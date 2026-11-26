package cn.lonwin.module.agent.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * 逐字增量抽取测试。核心约束：工具指令一点都不能漏给用户，
 * 最终回答只漏 answer 字段的值、不漏 JSON 语法，转义要等补齐后再解。
 */
@DisplayName("流式回答增量抽取")
class StreamingAnswerTapTest {

    /** 按 2 个字符一片模拟上游 chunk，尽量贴近真实 SSE 的输入节奏 */
    private static String feed(String raw, List<String> deltas) {
        AgentStreamSink sink = new AgentStreamSink() {
            @Override
            public void delta(String text) {
                deltas.add(text);
            }
        };
        StreamingAnswerTap tap = new StreamingAnswerTap(sink);
        for (int i = 0; i < raw.length(); i += 2) {
            tap.accept(raw.substring(i, Math.min(i + 2, raw.length())));
        }
        return tap.rawText();
    }

    @Test
    @DisplayName("工具轮：整体吞掉，不产生任何可见增量，但原文完整保留供编排层解析")
    void toolRoundIsSilent() {
        String raw = "{\"tool\":\"water.license\",\"args\":{\"year\":2026}}";
        List<String> deltas = new ArrayList<>();

        String text = feed(raw, deltas);

        assertThat(deltas).isEmpty();
        assertThat(text).isEqualTo(raw);
    }

    @Test
    @DisplayName("最终回答：只发 answer 的值，花括号/引号/refs 不外泄")
    void finalJsonOnlyAnswerValue() {
        String raw = "{\"answer\":\"许可水量 [[1]]53631 万m³\",\"refs\":[{\"id\":1,\"type\":\"SPOTLIGHT\","
                + "\"target\":\"tile.xuKeShuiLiang\"}]}";
        List<String> deltas = new ArrayList<>();

        feed(raw, deltas);

        assertThat(String.join("", deltas)).isEqualTo("许可水量 [[1]]53631 万m³");
        assertThat(String.join("", deltas)).doesNotContain("{", "refs", "target");
        assertThat(deltas.size()).isGreaterThan(1); // 必须是增量，不是最后一帧一次性给
    }

    @Test
    @DisplayName("不守规矩的纯文本：直接逐字发，交给下游格式纠正")
    void plainText() {
        List<String> deltas = new ArrayList<>();

        feed("已经为您打开超许可预警明细。", deltas);

        assertThat(String.join("", deltas)).isEqualTo("已经为您打开超许可预警明细。");
    }

    @Test
    @DisplayName("```json 围栏：即使分片到达也不会把围栏内容误判为纯文本")
    void codeFence() {
        String raw = "```json\n{\"answer\":\"河道外 24436 万m³\"}\n```";
        List<String> deltas = new ArrayList<>();

        feed(raw, deltas);

        assertThat(String.join("", deltas)).isEqualTo("河道外 24436 万m³");
        assertThat(String.join("", deltas)).doesNotContain("```", "answer");
    }

    @Test
    @DisplayName("转义序列补齐后再解码：不出现半个反斜杠闪一下")
    void escapes() {
        // 模型原文里是 JSON 转义序列（换行转义、Unicode 转义），Java 源码要写双反斜杠
        String raw = "{\"answer\":\"第一行\\n第二行 \\u4e2d文\"}";
        List<String> deltas = new ArrayList<>();

        feed(raw, deltas);

        assertThat(String.join("", deltas)).isEqualTo("第一行\n第二行 \u4e2d文");
        assertThat(deltas).noneMatch(part -> part.equals("\\"));
    }

    @Test
    @DisplayName("模型偶尔先写 refs 再写 answer，也照样能抽到正文")
    void refsBeforeAnswer() {
        String raw = "{\"refs\":[],\"answer\":\"取水户数 128 户\"}";
        List<String> deltas = new ArrayList<>();

        feed(raw, deltas);

        assertThat(String.join("", deltas)).isEqualTo("取水户数 128 户");
    }

    @Test
    @DisplayName("answer 闭合时发且只发一次阶段提示，供前端等待占位显示真实进度")
    void stageAfterAnswerClosed() {
        String raw = "{\"answer\":\"许可水量 53631 万m³，分项见下表\","
                + "\"refs\":[],\"details\":[]}";
        List<String> deltas = new ArrayList<>();
        List<String> stages = new ArrayList<>();
        AgentStreamSink sink = new AgentStreamSink() {
            @Override
            public void delta(String text) {
                deltas.add(text);
            }

            @Override
            public void stage(String text) {
                stages.add(text);
            }
        };
        StreamingAnswerTap tap = new StreamingAnswerTap(sink);
        for (int i = 0; i < raw.length(); i += 2) {
            tap.accept(raw.substring(i, Math.min(i + 2, raw.length())));
        }

        assertThat(String.join("", deltas)).isEqualTo("许可水量 53631 万m³，分项见下表");
        assertThat(stages).hasSize(1);
        // answer 写完、后面还有 refs/details 时下发的是约定标记而不是中文文案：
        // 前端据此停止把增量当正文，且不必猜测有没有表格
        assertThat(stages.get(0)).isEqualTo("<<DETAILS_START>>");
        // 并非每轮回答都有表格 / 入口，阶段文案不能承诺具体品类
        assertThat(stages.get(0)).doesNotContain("表格", "入口", "按钮");
    }

    @Test
    @DisplayName("工具轮不误发正文完成阶段提示")
    void toolRoundHasNoAnswerStage() {
        List<String> stages = new ArrayList<>();
        AgentStreamSink sink = new AgentStreamSink() {
            @Override
            public void stage(String text) {
                stages.add(text);
            }
        };
        StreamingAnswerTap tap = new StreamingAnswerTap(sink);
        tap.accept("{\"tool\":\"water.license\",\"args\":{}}");
        assertThat(stages).isEmpty();
    }

    @Test
    @DisplayName("前置说明 + 围栏 + JSON 逐片到达：说明保留，围栏与花括号绝不外泄")
    void proseThenFencedJsonLeaksNothing() {
        // 开头是普通文字被判为纯文本，answer 键写完整之前切不到 JSON 抽取——
        // ```json / {" 曾在这一窗口期被逐字推给用户
        String raw = "查询结果如下：\n```json\n{\"answer\":\"许可水量 53631 万m³\",\"refs\":[]}\n```";
        List<String> deltas = new ArrayList<>();

        feed(raw, deltas);

        String joined = String.join("", deltas);
        assertThat(joined).isEqualTo("查询结果如下：\n许可水量 53631 万m³");
        assertThat(joined).doesNotContain("```", "json", "{", "\"");
    }

    @Test
    @DisplayName("正文里出现花括号开头的普通文本：嫌疑解除后扣住的字符补发，不丢字")
    void plainTextWithBraceIsNotSwallowed() {
        List<String> deltas = new ArrayList<>();

        feed("许可水量为 {约} 53631 万m³", deltas);

        assertThat(String.join("", deltas)).isEqualTo("许可水量为 {约} 53631 万m³");
    }

    @Test
    @DisplayName("模型把 details 写在 answer 前面：answer 闭合后照样发补充与表格标记")
    void detailsBeforeAnswerStillNotifiesTable() {
        // answer 是最后一个字段，闭合后尾巴只剩 '}'：按尾巴判断会漏发标记，
        // 表格骨架就永远不会出现，done 帧突然砸出真表格
        String raw = "{\"details\":[{\"title\":\"分项\",\"head\":[\"口径\",\"水量\"],"
                + "\"rows\":[[\"河道外\",\"24436\"]]}],\"answer\":\"分项见下表\",\"refs\":[]}";
        List<String> deltas = new ArrayList<>();
        List<String> stages = new ArrayList<>();
        AgentStreamSink sink = new AgentStreamSink() {
            @Override
            public void delta(String text) {
                deltas.add(text);
            }

            @Override
            public void stage(String text) {
                stages.add(text);
            }
        };
        StreamingAnswerTap tap = new StreamingAnswerTap(sink);
        for (int i = 0; i < raw.length(); i += 2) {
            tap.accept(raw.substring(i, Math.min(i + 2, raw.length())));
        }

        assertThat(String.join("", deltas)).isEqualTo("分项见下表");
        assertThat(stages).containsExactly("<<DETAILS_START>>", "<<DETAILS_START:table>>");
    }

    @Test
    @DisplayName("正文值里出现 \"head\" 字样不算表格结构：不误发表格标记")
    void headInsideAnswerTextIsNotTable() {
        String raw = "{\"answer\":\"表格的 head 字段说明\",\"refs\":[]}";
        List<String> stages = new ArrayList<>();
        AgentStreamSink sink = new AgentStreamSink() {
            @Override
            public void stage(String text) {
                stages.add(text);
            }
        };
        StreamingAnswerTap tap = new StreamingAnswerTap(sink);
        for (int i = 0; i < raw.length(); i += 2) {
            tap.accept(raw.substring(i, Math.min(i + 2, raw.length())));
        }

        assertThat(stages).containsExactly("<<DETAILS_START>>");
    }
}
