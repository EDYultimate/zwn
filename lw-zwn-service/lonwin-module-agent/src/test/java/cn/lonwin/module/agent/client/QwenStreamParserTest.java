package cn.lonwin.module.agent.client;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import cn.lonwin.module.agent.client.QwenStreamParser.Frame;
import cn.lonwin.module.agent.client.QwenStreamParser.Kind;

/** 按《大模型接口调用说明》§6 覆盖五种 SSE 帧与两个实测坑 */
@DisplayName("上游 SSE 帧解析")
class QwenStreamParserTest {

    @Test
    @DisplayName("增量正文：data: 与 data: 两种前缀都要认")
    void contentDeltaBothPrefixes() {
        QwenStreamParser parser = new QwenStreamParser();
        Frame noSpace = parser.accept("data:{\"choices\":[{\"delta\":{\"content\":\"许\"}}]}");
        Frame withSpace = parser.accept("data: {\"choices\":[{\"delta\":{\"content\":\"可水量\"}}]}");

        assertThat(noSpace.kind()).isEqualTo(Kind.CONTENT);
        assertThat(noSpace.text()).isEqualTo("许");
        assertThat(withSpace.kind()).isEqualTo(Kind.CONTENT);
        assertThat(withSpace.text()).isEqualTo("可水量");
    }

    @Test
    @DisplayName("思考模型：reasoning / reasoning_content 两种命名都收，且不当正文")
    void reasoningFields() {
        QwenStreamParser parser = new QwenStreamParser();
        Frame a = parser.accept("data:{\"choices\":[{\"delta\":{\"reasoning\":\"想\"}}]}");
        Frame b = parser.accept("data: {\"choices\":[{\"delta\":{\"reasoning_content\":\"…\"}}]}");

        assertThat(a.kind()).isEqualTo(Kind.REASONING);
        assertThat(a.text()).isEqualTo("想");
        assertThat(b.kind()).isEqualTo(Kind.REASONING);
        assertThat(b.text()).isEqualTo("…");
    }

    @Test
    @DisplayName("usage-only 载荷帧：choices 为空，只取计量不产生正文")
    void usageOnlyFrame() {
        QwenStreamParser parser = new QwenStreamParser();
        Frame frame = parser.accept("data:{\"id\":\"x\",\"choices\":[],\"usage\":{\"total_tokens\":70}}");

        assertThat(frame.kind()).isEqualTo(Kind.USAGE);
    }

    @Test
    @DisplayName("流中错误帧：带出平台业务码与可读信息")
    void errorFrame() {
        QwenStreamParser parser = new QwenStreamParser();
        Frame frame = parser.accept(
                "data:{\"error\":{\"message\":\"上下文超限\",\"type\":\"invalid_request\",\"code\":40005}}");

        assertThat(frame.kind()).isEqualTo(Kind.ERROR);
        assertThat(frame.code()).isEqualTo(40005);
        assertThat(frame.errorMessage()).isEqualTo("[40005] 上下文超限");
        assertThat(parser.isDone()).isTrue();
    }

    @Test
    @DisplayName("[DONE] 之后的所有行都忽略；心跳注释与 SSE 元数据行不干扰")
    void doneAndNoise() {
        QwenStreamParser parser = new QwenStreamParser();
        assertThat(parser.accept(": ping").kind()).isEqualTo(Kind.IGNORE);
        assertThat(parser.accept("").kind()).isEqualTo(Kind.IGNORE);
        assertThat(parser.accept("event: message").kind()).isEqualTo(Kind.IGNORE);
        assertThat(parser.accept("id: 123").kind()).isEqualTo(Kind.IGNORE);
        assertThat(parser.accept("data: {\"choices\":[{\"delta\":{}}]}").kind()).isEqualTo(Kind.IGNORE);

        assertThat(parser.accept("data:[DONE]").kind()).isEqualTo(Kind.DONE);
        assertThat(parser.isDone()).isTrue();
        assertThat(parser.accept("data:{\"choices\":[{\"delta\":{\"content\":\"迟到\"}}]}").kind())
                .isEqualTo(Kind.IGNORE);
    }

    @Test
    @DisplayName("非 JSON 调试行与 \r 行尾不导致整次解析中断")
    void malformedLines() {
        QwenStreamParser parser = new QwenStreamParser();
        assertThat(parser.accept("data: not-json\r").kind()).isEqualTo(Kind.IGNORE);
        assertThat(parser.accept("data:{\"choices\":[{\"delta\":{\"content\":\"好\"}}]}\r").text())
                .isEqualTo("好");
        assertThat(parser.isDone()).isFalse();
    }

    @Test
    @DisplayName("原生工具调用增量：首帧带 id/name，后续帧只有 arguments 分片，帧类型都是 TOOL_CALL")
    void toolCallDeltas() {
        QwenStreamParser parser = new QwenStreamParser();
        Frame first = parser.accept(
                "data:{\"choices\":[{\"delta\":{\"tool_calls\":[{\"index\":0,\"id\":\"call_1\","
                        + "\"function\":{\"name\":\"water.cert.list\",\"arguments\":\"{\"}}]}}]}");
        Frame second = parser.accept(
                "data: {\"choices\":[{\"delta\":{\"tool_calls\":[{\"index\":0,"
                        + "\"function\":{\"arguments\":\"\\\"river\\\":\\\"漳河\\\"}\"}}]}}]}");

        assertThat(first.kind()).isEqualTo(Kind.TOOL_CALL);
        assertThat(first.text()).contains("call_1").contains("water.cert.list");
        assertThat(second.kind()).isEqualTo(Kind.TOOL_CALL);
        assertThat(second.text()).contains("漳河");
        // 工具调用帧不进正文：content 不会被误拼
        assertThat(parser.accept("data:{\"choices\":[{\"delta\":{\"content\":\"答\"}}]}").kind())
                .isEqualTo(Kind.CONTENT);
    }

    @Test
    @DisplayName("并列多个工具调用：各按 index 归位，互不串扰")
    void parallelToolCallsAreFramed() {
        QwenStreamParser parser = new QwenStreamParser();
        Frame frame = parser.accept(
                "data:{\"choices\":[{\"delta\":{\"tool_calls\":["
                        + "{\"index\":0,\"id\":\"a\",\"function\":{\"name\":\"t1\",\"arguments\":\"{}\"}},"
                        + "{\"index\":1,\"id\":\"b\",\"function\":{\"name\":\"t2\",\"arguments\":\"{}\"}}]}}]}");

        assertThat(frame.kind()).isEqualTo(Kind.TOOL_CALL);
        assertThat(frame.text()).contains("\"id\":\"a\"").contains("\"id\":\"b\"");
    }
}
