package cn.lonwin.module.agent.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.common.core.base.BaseController;
import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.module.agent.annotation.RequireActUrl;
import cn.lonwin.module.agent.model.dto.AgentChatDTO;
import cn.lonwin.module.agent.model.dto.AgentResetDTO;
import cn.lonwin.module.agent.model.vo.AgentChatVO;
import cn.lonwin.module.agent.model.vo.AgentMessageVO;
import cn.lonwin.module.agent.service.AgentChatService;
import cn.lonwin.module.agent.service.AgentStreamSink;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 智能问答接口。
 *
 * <p>权限说明：
 * <ul>
 *   <li>登录态：由框架 SecurityConfig 统一保证，无 token 直接 401；</li>
 *   <li>功能权限：{@link RequireActUrl} 交由 ActUrlPermissionInterceptor 强校验，
 *       需在权限系统中为本接口配置对应的功能 URL；</li>
 *   <li>数据权限：工具查询时由 AgentDataScope 注入用户单位编码过滤。</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/agent/chat")
@RequiredArgsConstructor
@Tag(name = "智能问答", description = "调水业务智能问答（含跳转按钮）")
public class AgentChatController extends BaseController {

    private final AgentChatService agentChatService;
    private final ObjectMapper objectMapper;

    @Operation(summary = "提问", description = "支持多轮对话；返回 answer 正文与 actions 跳转按钮列表")
    @RequireActUrl("/agent/chat")
    @PostMapping
    public Result<AgentChatVO> chat(@Valid @RequestBody AgentChatDTO dto) {
        return Result.success("回答成功", agentChatService.chat(dto));
    }

    /**
     * 流式提问（SSE）。逐帧 {@code data: {"type":"stage|delta|done|error", ...}}，
     * 结束帧为 {@code data: [DONE]}。
     *
     * <p>直接写 {@link HttpServletResponse} 并在请求线程内同步推进，不使用异步线程池：
     * {@code UserContext} 与 {@code DataScopeContext} 都是 ThreadLocal，换线程会丢登录用户
     * 和单位数据权限，除非额外做上下文拷贝。这样写既保留了逐帧 flush 的实时性，
     * 也不会让数据权限切面绕过。
     *
     * <p>权限沿用 {@code /agent/chat}：流式只是同一功能的另一种传输方式，
     * 不额外引入一条需要管理员配置的功能 URL。
     */
    @Operation(summary = "提问（流式）", description = "SSE：stage 进度 / delta 逐字增量 / done 权威结果 / error 失败")
    @RequireActUrl("/agent/chat")
    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public void stream(@Valid @RequestBody AgentChatDTO dto, HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType(MediaType.TEXT_EVENT_STREAM_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setHeader("Cache-Control", "no-cache, no-store, no-transform");
        // nginx 默认会缓冲代理响应，不关掉的话 SSE 会退化成「全部生成完才一次性到达」
        response.setHeader("X-Accel-Buffering", "no");
        response.setHeader("Connection", "keep-alive");

        SseWriter writer = new SseWriter(response, objectMapper);
        try {
            agentChatService.chatStream(dto, writer);
        } catch (Exception e) {
            log.error("[agent] 流式问答失败", e);
            writer.error(e.getMessage() == null ? "问答服务异常" : e.getMessage());
        } finally {
            writer.close();
        }
    }

    @Operation(summary = "清空会话记忆", description = "前端「新对话」按钮调用")
    @RequireActUrl("/agent/chat/reset")
    @PostMapping("/reset")
    public Result<Void> reset(@Valid @RequestBody AgentResetDTO dto) {
        agentChatService.reset(dto.getSessionId());
        return Result.success("会话已清空", null);
    }

    @Operation(summary = "查询会话历史")
    @RequireActUrl("/agent/chat/history")
    @GetMapping("/history")
    public Result<List<AgentMessageVO>> history(@RequestParam String sessionId) {
        return Result.success(agentChatService.history(sessionId));
    }

    /** 把编排层的事件写成 SSE 帧；同时按固定间隔插心跳注释，防止工具轮长时间无输出被代理掐断 */
    private static final class SseWriter implements AgentStreamSink {

        private static final long HEARTBEAT_INTERVAL_MS = 10_000L;

        private final HttpServletResponse response;
        private final PrintWriter out;
        private final ObjectMapper objectMapper;
        private long lastWriteAt = System.currentTimeMillis();

        SseWriter(HttpServletResponse response, ObjectMapper objectMapper) throws IOException {
            this.response = response;
            this.objectMapper = objectMapper;
            this.out = response.getWriter();
        }

        @Override
        public void stage(String text) {
            send("stage", Map.of("text", text == null ? "" : text));
        }

        @Override
        public void delta(String text) {
            send("delta", Map.of("text", text == null ? "" : text));
        }

        @Override
        public void error(String message) {
            send("error", Map.of("message", message == null ? "问答服务异常" : message));
        }

        @Override
        public void done(AgentChatVO vo) {
            send("done", Map.of("data", vo));
        }

        @Override
        public void heartbeat() {
            if (System.currentTimeMillis() - lastWriteAt < HEARTBEAT_INTERVAL_MS) {
                return;
            }
            out.write(": ping\n\n");
            flush();
        }

        private void send(String type, Map<String, ?> payload) {
            Map<String, Object> frame = new LinkedHashMap<>();
            frame.put("type", type);
            frame.putAll(payload);
            try {
                out.write("data: " + objectMapper.writeValueAsString(frame) + "\n\n");
            } catch (JsonProcessingException e) {
                throw new IllegalStateException("序列化 SSE 帧失败", e);
            }
            flush();
        }

        private void flush() {
            out.flush();
            try {
                response.flushBuffer();
            } catch (IOException e) {
                throw new java.io.UncheckedIOException(e);
            }
            lastWriteAt = System.currentTimeMillis();
        }

        void close() {
            try {
                out.write("data: [DONE]\n\n");
                flush();
            } catch (Exception ignored) {
                // 客户端可能已经关闭连接，收尾帧发不出去不影响结果
            }
        }
    }
}
