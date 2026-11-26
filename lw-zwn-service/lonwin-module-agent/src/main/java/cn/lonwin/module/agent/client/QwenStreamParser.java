package cn.lonwin.module.agent.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * 上游 {@code text/event-stream} 的逐行解析器（纯逻辑，不碰网络，便于单测）。
 *
 * <p>按《大模型接口调用说明》§6，必须同时处理五种帧：
 * <ul>
 *   <li>{@code data:{"choices":[{"delta":{"content":"…"}}]}} 增量正文；</li>
 *   <li>{@code delta.reasoning} / {@code delta.reasoning_content} 思考增量（qwen3 思考模式）；</li>
 *   <li>{@code delta.tool_calls} 原生工具调用增量（id/name 在首帧，arguments 逐帧分片追加）；</li>
 *   <li>{@code choices:[] + usage:{…}} 计量帧（[DONE] 前最后一帧，仅取计量）；</li>
 *   <li>{@code data:{"error":{…}}} 流中错误；</li>
 *   <li>{@code data:[DONE]} 结束。</li>
 * </ul>
 *
 * <p>两个实测坑一并处理：平台输出是 {@code data:{...}}（冒号后无空格），
 * OpenAI 规范允许 {@code data: {...}}；另外约 15 秒一次 {@code : ping} 心跳注释行必须跳过。
 * 拆行由调用方用 {@link java.io.BufferedReader#readLine()} 完成——它按字符边界拆，
 * 不会像逐块直读那样在 chunk 边界截断长 JSON 行。
 */
public final class QwenStreamParser {

    public enum Kind { IGNORE, CONTENT, REASONING, TOOL_CALL, USAGE, ERROR, DONE }

    /** @param code 平台业务错误码（error.code），仅 ERROR 帧有值 */
    public record Frame(Kind kind, String text, String errorMessage, int code) { }

    private static final Frame IGNORE = new Frame(Kind.IGNORE, "", null, 0);
    private static final Frame USAGE = new Frame(Kind.USAGE, "", null, 0);
    private static final Frame DONE = new Frame(Kind.DONE, "", null, 0);

    private final ObjectMapper objectMapper = new ObjectMapper();
    private boolean done;

    /**
     * 上游最后给出的结束原因（{@code stop} / {@code length} / {@code tool_calls}）。
     *
     * <p>为什么要留这个字段：{@code length} 表示输出被 max_tokens 截断。
     * 截断发生在工具调用的 arguments 中途时，流里会出现「有 tool_calls 帧但参数是半截 JSON」，
     * 下游如果不看 finish_reason，只会看到「参数解析失败」而查不到真实原因，
     * 更容易误判成「模型没调工具」。qwen3 思考模式下 reasoning 会先吃掉全部额度，
     * 这是最常见的截断来源。
     */
    private String finishReason = "";

    public boolean isDone() {
        return done;
    }

    /** 最近一次上游给出的 finish_reason；没有则为空串 */
    public String finishReason() {
        return finishReason;
    }

    /** 消费一行；返回 IGNORE 表示该行无需处理 */
    public Frame accept(String line) {
        if (done || line == null) {
            return IGNORE;
        }
        String text = line.endsWith("\r") ? line.substring(0, line.length() - 1) : line;
        if (text.isEmpty() || text.startsWith(":")) {
            return IGNORE;
        }
        // event: / id: / retry: 等 SSE 元数据行不承载内容
        if (!text.startsWith("data:")) {
            return IGNORE;
        }
        String payload = text.substring("data:".length());
        if (payload.startsWith(" ")) {
            payload = payload.substring(1);
        }
        payload = payload.trim();
        if (payload.isEmpty()) {
            return IGNORE;
        }
        if ("[DONE]".equals(payload)) {
            done = true;
            return DONE;
        }

        JsonNode node;
        try {
            node = objectMapper.readTree(payload);
        } catch (Exception e) {
            // 网关偶尔会插一行非 JSON 的调试信息，忽略比中断整次回答更合适
            return IGNORE;
        }

        JsonNode error = node.path("error");
        if (error.isObject()) {
            done = true;
            String message = error.path("message").asText("模型返回错误");
            int code = error.path("code").asInt(0);
            return new Frame(Kind.ERROR, "", code > 0 ? "[" + code + "] " + message : message, code);
        }

        JsonNode delta = node.path("choices").path(0).path("delta");
        // finish_reason 可能和最后一个 token 同帧到达（如 {"delta":{"reasoning":"x"},"finish_reason":"length"}），
        // 因此先记录、再判帧类型，避免为了拿结束原因丢掉这一帧的内容
        JsonNode finishNode = node.path("choices").path(0).path("finish_reason");
        if (finishNode.isTextual() && !finishNode.asText().isEmpty()) {
            finishReason = finishNode.asText();
        }
        if (delta.isObject()) {
            // 原生工具调用增量：整段 tool_calls 数组交给调用方聚合
            // （arguments 按字符分片到达，这里不做拼接，只负责识别帧类型）
            JsonNode toolCalls = delta.get("tool_calls");
            if (toolCalls != null && toolCalls.isArray() && !toolCalls.isEmpty()) {
                return new Frame(Kind.TOOL_CALL, toolCalls.toString(), null, 0);
            }
            JsonNode content = delta.get("content");
            if (content != null && content.isTextual() && !content.asText().isEmpty()) {
                return new Frame(Kind.CONTENT, content.asText(), null, 0);
            }
            JsonNode reasoning = delta.get("reasoning");
            if (reasoning == null || reasoning.isNull()) {
                reasoning = delta.get("reasoning_content");
            }
            if (reasoning != null && reasoning.isTextual() && !reasoning.asText().isEmpty()) {
                return new Frame(Kind.REASONING, reasoning.asText(), null, 0);
            }
        }
        if (node.has("usage")) {
            return USAGE;
        }
        return IGNORE;
    }
}
