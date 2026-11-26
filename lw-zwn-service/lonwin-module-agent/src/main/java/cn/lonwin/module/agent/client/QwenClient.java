package cn.lonwin.module.agent.client;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Consumer;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RequestCallback;
import org.springframework.web.client.ResponseExtractor;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.module.agent.config.AgentProperties;
import lombok.extern.slf4j.Slf4j;

/**
 * 内网 qwen3 接口客户端（OpenAI 兼容），同时支持阻塞式与流式（SSE）调用。
 *
 * <p><b>原生 function calling</b>：请求体携带 OpenAI 格式的 {@code tools} 数组与
 * {@code tool_choice:"auto"}；响应里 {@code tool_calls} 与 {@code content} 是两个
 * 独立通道——工具轮只有 tool_calls、回答轮只有 content，编排层不再需要
 * 「从正文里抠 JSON」的文本协议。
 *
 * <p>平台要求两个防重放请求头，且必须是**每次请求现生成**：
 * <ul>
 *   <li>{@code X-Timestamp}：毫秒时间戳，与服务器时钟偏差需在 ±5 分钟内；</li>
 *   <li>{@code X-Nonce}：一次性随机串，重试必须换新的（复用会返回 40001 重复请求）。</li>
 * </ul>
 * 因此这两个头不能挂在 RestTemplate 的默认头里，而是在每次 {@link RequestCallback} 执行时生成——
 * 重试会重新执行 callback，天然拿到新 nonce。
 *
 * <p>重试策略：4xx 请求侧错误一律不重试；429xx 是「整分钟额度」问题——重发同一份 prompt 只会
 * 更快把窗口打满，因此最多只等一次很短的 {@code Retry-After}（≤5 秒），否则直接把限流原因返回前端；
 * 5xxxx 平台故障按 1s/2s/4s 指数退避最多 3 次；**流已经吐出内容后中断不再重试**，避免重复输出。
 */
@Slf4j
@Service
public class QwenClient {

    /** 5xx 平台故障的退避序列（毫秒） */
    private static final long[] BACKOFF_MS = { 1_000L, 2_000L, 4_000L };

    /**
     * 限流时愿意等待的上限（秒）：再久用户已等不起，而 TPM 是分钟窗，几秒内也恢复不了，
     * 继续重发只会把窗口占得更满。
     */
    private static final long RATE_LIMIT_MAX_WAIT_SECONDS = 5;

    private final AgentProperties properties;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public QwenClient(AgentProperties properties) {
        this.properties = properties;
        AgentProperties.Qwen qwen = properties.getQwen();
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(qwen.getConnectTimeoutSeconds()));
        factory.setReadTimeout(Duration.ofSeconds(qwen.getReadTimeoutSeconds()));
        this.restTemplate = new RestTemplate(factory);
    }

    /**
     * 阻塞式发送一轮对话（工具轮 / 格式纠正 / 流式关闭时的调用）。
     *
     * @param messages OpenAI 格式消息列表（system / user / assistant / tool）
     * @param tools    OpenAI 格式工具清单；null 或空表示本轮不开放工具（纯对话）
     * @return 模型回复（content 与 tool_calls 分流）
     */
    public ModelReply chat(List<Map<String, Object>> messages, List<Map<String, Object>> tools) {
        return chat(messages, tools, null);
    }

    /**
     * 阻塞式发送一轮对话，可指定 {@code tool_choice}。
     *
     * <p>{@code toolChoice="required"} 用于「零证据防线」：当模型对着数据类问题
     * 直接编出一串数字、一次工具都没调时，编排层用它强行逼出一次真实查询。
     * 该值只在有工具时下发给上游，{@code null} 表示保持默认的 {@code auto}。
     */
    public ModelReply chat(List<Map<String, Object>> messages, List<Map<String, Object>> tools,
                           String toolChoice) {
        AgentProperties.Qwen qwen = properties.getQwen();
        requireApiKey(qwen);
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            applyAuthHeaders(headers, qwen);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    qwen.getBaseUrl() + "/chat/completions",
                    new HttpEntity<>(buildRequestBody(messages, tools, qwen, false, toolChoice), headers),
                    String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode choice = root.path("choices").path(0);
            JsonNode message = choice.path("message");
            String content = message.path("content").asText("");
            List<ModelReply.ToolRequest> toolCalls = parseToolCalls(message.path("tool_calls"));
            warnIfTruncated(choice.path("finish_reason").asText(""), toolCalls.size());
            requireReply(content, toolCalls, message, choice.path("finish_reason").asText(""));
            return new ModelReply(content, toolCalls);
        } catch (HttpStatusCodeException e) {
            String errorMessage = extractErrorMessage(e.getResponseBodyAsString());
            log.error("调用大模型失败, status={}, body={}", e.getStatusCode(), errorMessage);
            throw new BusinessException("调用大模型失败：" + errorMessage);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("调用大模型异常", e);
            throw new BusinessException("调用大模型失败：" + e.getMessage());
        }
    }

    /** 纯对话调用（不带工具）：用于最终回答之外的确定性小请求，如事件纠正 */
    public String chat(List<Map<String, Object>> messages) {
        return chat(messages, null).content();
    }

    /**
     * 流式发送一轮对话：{@code delta.content} 逐字回调，{@code delta.tool_calls}
     * 增量聚合；两者天然分流，最终返回完整的 {@link ModelReply}。
     *
     * <p>本方法只负责「把上游 SSE 变成增量文本 + 聚合后的工具调用」，不判断这一轮的
     * 语义——原生协议下工具轮不会有 content 增量，前端自然不会看到工具过程。
     *
     * @param messages OpenAI 格式消息列表
     * @param tools    OpenAI 格式工具清单；null 或空表示本轮不开放工具
     * @param onDelta  增量正文回调（可能被调用多次，参数可能只有一两个字）
     * @param onFrame  每收到一个上游帧回调一次，用于给前端发 SSE 心跳；可为 null
     */
    public ModelReply chatStream(List<Map<String, Object>> messages, List<Map<String, Object>> tools,
                                 Consumer<String> onDelta, Runnable onFrame) {
        return chatStream(messages, tools, null, onDelta, onFrame);
    }

    /** 流式调用，可指定 {@code tool_choice}（同 {@link #chat(List, List, String)}） */
    public ModelReply chatStream(List<Map<String, Object>> messages, List<Map<String, Object>> tools,
                                 String toolChoice, Consumer<String> onDelta, Runnable onFrame) {
        AgentProperties.Qwen qwen = properties.getQwen();
        requireApiKey(qwen);
        String bodyJson = buildRequestBody(messages, tools, qwen, true, toolChoice);
        int maxRetries = Math.max(0, qwen.getStreamMaxRetries());

        for (int attempt = 0; ; attempt++) {
            // started 一旦为 true 表示已经向业务层吐出过内容，此后任何异常都不能重试
            final boolean[] started = { false };
            try {
                return requestStream(bodyJson, qwen, delta -> {
                    started[0] = true;
                    onDelta.accept(delta);
                }, onFrame);
            } catch (UpstreamException e) {
                // 429 是「整分钟额度」问题：重发同一份大 prompt 只会更快打满窗口，
                // 因此限流最多只等一次很短的 Retry-After，等不到就如实告诉用户，不再继续消耗额度
                boolean rateLimited = isRateLimited(e.code());
                long waitMs = rateLimited ? rateLimitWaitMs(e) : backoffMs(attempt);
                int allowedRetries = rateLimited ? Math.min(1, maxRetries) : maxRetries;
                if (started[0] || !e.retryable() || waitMs < 0 || attempt >= allowedRetries) {
                    throw new BusinessException(failureMessage(e, rateLimited));
                }
                log.warn("[agent] 上游返回 {}，{}ms 后第 {} 次重试：{}",
                        e.code(), waitMs, attempt + 1, e.getMessage());
                sleep(waitMs);
            } catch (BusinessException e) {
                // 流中错误帧 / 请求构造失败：属于请求侧问题，原样重发不会成功
                throw e;
            } catch (Exception e) {
                log.error("[agent] 流式调用异常（已输出内容={}）", started[0], e);
                if (started[0] || attempt >= maxRetries) {
                    throw new BusinessException("调用大模型失败："
                            + (started[0] ? "流式响应中断，" : "") + e.getMessage());
                }
                sleep(backoffMs(attempt));
            }
        }
    }

    /** 旧签名保留（不带工具的流式调用） */
    public String chatStream(List<Map<String, Object>> messages, Consumer<String> onDelta, Runnable onFrame) {
        return chatStream(messages, null, onDelta, onFrame).content();
    }

    /** 平台限流：HTTP 429 与业务码 429xx 同义 */
    private static boolean isRateLimited(int code) {
        return code == 429 || (code >= 42900 && code <= 42999);
    }

    /** 限流时只认可很短的服务端 Retry-After；返回 -1 表示不值得重试 */
    private static long rateLimitWaitMs(UpstreamException e) {
        long seconds = e.retryAfterSeconds();
        return seconds > 0 && seconds <= RATE_LIMIT_MAX_WAIT_SECONDS ? seconds * 1000 : -1;
    }

    private static long backoffMs(int attempt) {
        return BACKOFF_MS[Math.min(attempt, BACKOFF_MS.length - 1)];
    }

    /** 限流单独给一句可操作的提示，别让用户只看到平台内部码 */
    private static String failureMessage(UpstreamException e, boolean rateLimited) {
        if (!rateLimited) {
            return "调用大模型失败：" + e.getMessage();
        }
        return "调用大模型失败：平台接口限流（" + e.getMessage() + "）。"
                + "请稍后重试；频繁出现时请减少单次查询的数据量";
    }

    /** 单次流式请求（不含重试） */
    private ModelReply requestStream(String bodyJson, AgentProperties.Qwen qwen,
                                     Consumer<String> onDelta, Runnable onFrame) {
        try {
            RequestCallback callback = request -> {
                HttpHeaders headers = request.getHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setAccept(List.of(MediaType.TEXT_EVENT_STREAM, MediaType.APPLICATION_JSON));
                // 部分网关对压缩响应做整块缓冲，会让 SSE 退化成一次性返回
                headers.set("Accept-Encoding", "identity");
                applyAuthHeaders(headers, qwen);
                request.getBody().write(bodyJson.getBytes(StandardCharsets.UTF_8));
            };
            ResponseExtractor<ModelReply> extractor = response -> readStream(response, onDelta, onFrame);
            return restTemplate.execute(qwen.getBaseUrl() + "/chat/completions",
                    HttpMethod.POST, callback, extractor);
        } catch (HttpStatusCodeException e) {
            String body = e.getResponseBodyAsString();
            // 平台的业务错误码在 body.error.code 里（如 50201），比 HTTP 状态码更能决定是否重试
            int code = extractErrorCode(body);
            throw new UpstreamException(code > 0 ? code : e.getStatusCode().value(),
                    parseRetryAfter(e.getResponseHeaders()), extractErrorMessage(body));
        }
    }

    /**
     * 按行读取上游 SSE。用 BufferedReader 而不是「逐块读 + 手动拆行」：
     * 后者会在 chunk 边界截断长 JSON 行，报 Unterminated string。
     */
    private ModelReply readStream(ClientHttpResponse response, Consumer<String> onDelta, Runnable onFrame)
            throws IOException {
        QwenStreamParser parser = new QwenStreamParser();
        StringBuilder content = new StringBuilder();
        StringBuilder reasoning = new StringBuilder();
        ToolCallAssembler toolAssembler = new ToolCallAssembler();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(response.getBody(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (onFrame != null) {
                    onFrame.run();
                }
                QwenStreamParser.Frame frame = parser.accept(line);
                switch (frame.kind()) {
                    case CONTENT -> {
                        content.append(frame.text());
                        onDelta.accept(frame.text());
                    }
                    case REASONING -> reasoning.append(frame.text());
                    case TOOL_CALL -> toolAssembler.accept(frame.text());
                    case ERROR -> {
                        if (UpstreamException.retryable(frame.code())) {
                            throw new UpstreamException(frame.code(), 0, frame.errorMessage());
                        }
                        throw new BusinessException("调用大模型失败：" + frame.errorMessage());
                    }
                    case DONE -> {
                        warnIfTruncated(parser.finishReason(), toolAssembler.size());
                        return finishReply(content, reasoning, toolAssembler, parser.finishReason());
                    }
                    default -> { /* USAGE / IGNORE：只取计量，不参与正文 */ }
                }
            }
        }
        // 没收到 [DONE] 就断开：说明被截断。拼了一半的 JSON 交给下游会因缺右括号被当纯文本展示，
        // 比明确报错更糟，因此只在看起来是完整 JSON 时才放行。
        if (!parser.isDone()) {
            log.warn("[agent] 上游未发送 [DONE] 即结束流，已接收 {} 字，finish_reason={}",
                    content.length(), parser.finishReason());
            if (!content.toString().trim().endsWith("}") && toolAssembler.isEmpty()) {
                throw new BusinessException("模型回答未完整返回，请重试");
            }
        }
        warnIfTruncated(parser.finishReason(), toolAssembler.size());
        return finishReply(content, reasoning, toolAssembler, parser.finishReason());
    }

    /**
     * 组装流式回复：content 与 tool_calls 至少要有一个，都为空按「输出额度被打满」处理。
     *
     * <p>{@code finish_reason=length} 时把原因直接写进报错文案：这种情况十有八九是
     * qwen3 的思考过程先吃光了 max-tokens，工具调用还没开始写就被截断——
     * 运维看到「未返回正文」只会去调温度，看到「被 max-tokens 截断」才会去调额度。
     */
    private ModelReply finishReply(StringBuilder content, StringBuilder reasoning,
                                   ToolCallAssembler assembler, String finishReason) {
        List<ModelReply.ToolRequest> toolCalls = assembler.toolCalls();
        if (content.length() == 0 && toolCalls.isEmpty()) {
            log.warn("模型未返回正文，finish_reason={}，reasoning 前 200 字：{}",
                    finishReason, abbreviate(reasoning.toString(), 200));
            if ("length".equals(finishReason)) {
                throw new BusinessException("模型输出被 max-tokens 截断（finish_reason=length）："
                        + "输出额度被思考过程占满，请关闭思考模式（lonwin.agent.qwen.thinking-enabled=false）"
                        + "或调大 max-tokens 后重试");
            }
            throw new BusinessException("模型未返回正文，请调大 max-tokens 或关闭思考模式");
        }
        return new ModelReply(content.toString(), toolCalls);
    }

    /** 截断告警：论证「模型没调工具」到底是模型不配合，还是输在被截断 */
    private void warnIfTruncated(String finishReason, int toolCallCount) {
        if (!"length".equals(finishReason)) {
            return;
        }
        log.warn("[agent] 模型输出被 max-tokens 截断（finish_reason=length），本轮 tool_calls={}。"
                + "常见原因：思考模式占满输出额度，或 max-tokens 过小；"
                + "若截断发生在工具参数中途，会被误判成「模型没有调用工具」", toolCallCount);
    }

    /** 非流式回复校验：正文与工具调用至少要有一个 */
    private void requireReply(String content, List<ModelReply.ToolRequest> toolCalls, JsonNode message,
                              String finishReason) {
        if (StringUtils.hasText(content) || !toolCalls.isEmpty()) {
            return;
        }
        // qwen3 思考模式可能把输出额度全部消耗在思考上，此时 content 为空
        String reasoning = message.path("reasoning").asText(message.path("reasoning_content").asText(""));
        log.warn("模型未返回正文，finish_reason={}，reasoning 前 200 字：{}",
                finishReason, abbreviate(reasoning, 200));
        if ("length".equals(finishReason)) {
            throw new BusinessException("模型输出被 max-tokens 截断（finish_reason=length）："
                    + "输出额度被思考过程占满，请关闭思考模式（lonwin.agent.qwen.thinking-enabled=false）"
                    + "或调大 max-tokens 后重试");
        }
        throw new BusinessException("模型未返回正文，请调大 max-tokens 或关闭思考模式");
    }

    /** 解析非流式响应里的 tool_calls 数组 */
    private List<ModelReply.ToolRequest> parseToolCalls(JsonNode toolCallsNode) {
        if (toolCallsNode == null || !toolCallsNode.isArray() || toolCallsNode.isEmpty()) {
            return List.of();
        }
        List<ModelReply.ToolRequest> calls = new ArrayList<>();
        for (JsonNode node : toolCallsNode) {
            String id = node.path("id").asText("");
            String name = node.path("function").path("name").asText("");
            String arguments = node.path("function").path("arguments").asText("{}");
            if (StringUtils.hasText(id) && StringUtils.hasText(name)) {
                calls.add(new ModelReply.ToolRequest(id, name, arguments));
            }
        }
        return calls;
    }

    /**
     * 流式工具调用聚合器：按 {@code index} 归位每个调用的 id / name / arguments 分片。
     *
     * <p>OpenAI 流式协议里一次回复可以并列多个 tool_calls；同一调用的 arguments
     * 会拆成任意多帧送达，必须按 index 拼接后再交给编排层解析。
     */
    private final class ToolCallAssembler {
        private final Map<Integer, String> ids = new LinkedHashMap<>();
        private final Map<Integer, String> names = new LinkedHashMap<>();
        private final Map<Integer, StringBuilder> arguments = new LinkedHashMap<>();

        void accept(String toolCallsJson) {
            try {
                JsonNode array = objectMapper.readTree(toolCallsJson);
                for (JsonNode item : array) {
                    int index = item.path("index").asInt(0);
                    JsonNode id = item.get("id");
                    if (id != null && id.isTextual()) {
                        ids.put(index, id.asText());
                    }
                    JsonNode function = item.path("function");
                    JsonNode name = function.get("name");
                    if (name != null && name.isTextual() && !name.asText().isEmpty()) {
                        names.put(index, name.asText());
                    }
                    JsonNode args = function.get("arguments");
                    if (args != null && args.isTextual()) {
                        arguments.computeIfAbsent(index, k -> new StringBuilder()).append(args.asText());
                    }
                }
            } catch (Exception e) {
                // 单帧解析失败只丢这一帧的增量，不让整次流式回答失败
                log.debug("[agent] 工具调用增量帧解析失败：{}", e.getMessage());
            }
        }

        boolean isEmpty() {
            return ids.isEmpty();
        }

        /** 已聚合的工具调用个数（只用于截断告警，不做语义判断） */
        int size() {
            return ids.size();
        }

        List<ModelReply.ToolRequest> toolCalls() {
            List<ModelReply.ToolRequest> calls = new ArrayList<>();
            for (Map.Entry<Integer, String> entry : ids.entrySet()) {
                int index = entry.getKey();
                String name = names.get(index);
                if (name == null) {
                    continue;
                }
                StringBuilder args = arguments.get(index);
                calls.add(new ModelReply.ToolRequest(entry.getValue(), name,
                        args == null || args.isEmpty() ? "{}" : args.toString()));
            }
            return calls;
        }
    }

    /** 构造请求体：带工具清单时按 OpenAI 格式追加 tools 与 tool_choice */
    private String buildRequestBody(List<Map<String, Object>> messages, List<Map<String, Object>> tools,
                                    AgentProperties.Qwen qwen, boolean stream, String toolChoice) {
        Map<String, Object> body = new HashMap<>();
        body.put("model", qwen.getModel());
        body.put("messages", messages);
        body.put("max_tokens", qwen.getMaxTokens());
        body.put("temperature", qwen.getTemperature());
        // 实测：只有 enable_thinking 对 qwen3 无效，必须走 chat_template_kwargs，
        // 否则思考过程会先吃掉全部 max_tokens，工具调用还没开始写就被截断
        body.put("enable_thinking", qwen.isThinkingEnabled());
        body.put("chat_template_kwargs", Map.of("enable_thinking", qwen.isThinkingEnabled()));
        if (tools != null && !tools.isEmpty()) {
            body.put("tools", tools);
            body.put("tool_choice", StringUtils.hasText(toolChoice) ? toolChoice : "auto");
        }
        if (stream) {
            body.put("stream", true);
        }
        // 排查「模型为什么不调工具」的第一现场：确认工具到底有没有随请求发出去
        log.debug("[agent] 请求体 model={}, messages={}, tools={}, tool_choice={}, max_tokens={}, stream={}",
                qwen.getModel(), messages.size(), tools == null ? 0 : tools.size(),
                tools == null || tools.isEmpty() ? "未下发" : (toolChoice == null ? "auto" : toolChoice),
                qwen.getMaxTokens(), stream);
        try {
            return objectMapper.writeValueAsString(body);
        } catch (JsonProcessingException e) {
            throw new BusinessException("构造大模型请求失败：" + e.getMessage());
        }
    }

    /** 每次请求现生成，重试会重新执行本方法，天然换新 nonce */
    private void applyAuthHeaders(HttpHeaders headers, AgentProperties.Qwen qwen) {
        headers.setBearerAuth(qwen.getApiKey());
        headers.set("X-Timestamp", String.valueOf(System.currentTimeMillis()));
        headers.set("X-Nonce", UUID.randomUUID().toString().replace("-", ""));
    }

    private void requireApiKey(AgentProperties.Qwen qwen) {
        if (!StringUtils.hasText(qwen.getApiKey())) {
            throw new BusinessException("未配置大模型密钥，请在 application.yml 配置 lonwin.agent.qwen.api-key");
        }
    }

    /** 从平台错误体 {"error":{"message":"...","code":40005}} 中取可读信息 */
    private String extractErrorMessage(String responseBody) {
        if (!StringUtils.hasText(responseBody)) {
            return "无响应内容";
        }
        try {
            JsonNode error = objectMapper.readTree(responseBody).path("error");
            String message = error.path("message").asText("");
            int code = error.path("code").asInt(0);
            if (StringUtils.hasText(message)) {
                return code > 0 ? "[" + code + "] " + message : message;
            }
        } catch (Exception ignored) {
            // 非 JSON 响应，走下面的截断返回
        }
        return abbreviate(responseBody, 200);
    }

    private int extractErrorCode(String responseBody) {
        if (!StringUtils.hasText(responseBody)) {
            return 0;
        }
        try {
            return objectMapper.readTree(responseBody).path("error").path("code").asInt(0);
        } catch (Exception ignored) {
            return 0;
        }
    }

    private long parseRetryAfter(HttpHeaders headers) {
        if (headers == null) {
            return 0;
        }
        String value = headers.getFirst("Retry-After");
        if (!StringUtils.hasText(value)) {
            return 0;
        }
        try {
            return Math.max(0, Long.parseLong(value.trim()));
        } catch (NumberFormatException e) {
            // HTTP-date 形式不常见，交给默认退避
            return 0;
        }
    }

    private void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new BusinessException("调用大模型被中断");
        }
    }

    private String abbreviate(String text, int maxLength) {
        if (!StringUtils.hasText(text)) {
            return "";
        }
        return text.length() <= maxLength ? text : text.substring(0, maxLength) + "...";
    }

    /** 上游可重试异常：code 可能是 HTTP 状态码，也可能是平台业务码（42901 / 50201 等） */
    private static final class UpstreamException extends RuntimeException {

        private final int code;
        private final long retryAfterSeconds;

        UpstreamException(int code, long retryAfterSeconds, String message) {
            super(message);
            this.code = code;
            this.retryAfterSeconds = retryAfterSeconds;
        }

        int code() {
            return code;
        }

        long retryAfterSeconds() {
            return retryAfterSeconds;
        }

        boolean retryable() {
            return retryable(code);
        }

        /** 429xx 限流、5xxxx 平台故障才重试；40001/40005/401xx/40401 等请求侧错误一律不重试 */
        static boolean retryable(int code) {
            if (code == 429 || (code >= 42900 && code <= 42999)) {
                return true;
            }
            if (code >= 500 && code < 600) {
                return true;
            }
            return code >= 50000 && code < 60000;
        }
    }
}
