package cn.lonwin.module.agent.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.mockito.ArgumentCaptor;

import cn.lonwin.module.agent.client.ModelReply;
import cn.lonwin.module.agent.client.QwenClient;
import cn.lonwin.module.agent.config.AgentProperties;
import cn.lonwin.module.agent.model.dto.AgentChatDTO;
import cn.lonwin.module.agent.model.vo.AgentChatVO;
import cn.lonwin.module.agent.preprocess.QuestionNormalizer;
import cn.lonwin.module.agent.spi.AgentToolResult;
import cn.lonwin.module.agent.support.AgentToolPermissionChecker;
import cn.lonwin.module.agent.tool.AgentToolDefinition;
import cn.lonwin.module.agent.tool.AgentToolRegistry;
import cn.lonwin.module.agent.uicapability.InMemoryUiCapabilityStore;
import cn.lonwin.module.agent.uicapability.UiCapabilityLocator;
import cn.lonwin.module.agent.uicapability.UiCapabilityService;
import cn.lonwin.module.agent.uicapability.UiPageCapability;

/**
 * 最终回答解析测试：答案是交付主体，页面按钮只是可选的附加功能。
 *
 * <p>锁定两条底线：模型不按约定输出 JSON 时，答案原文完整保留、不再为拿按钮多调一次模型；
 * 定位无匹配时，只补一句提示，绝不把已经写好的详细答案覆盖掉。
 *
 * <p>模型调用按原生 function calling mock：{@code chat(messages, tools)} 返回
 * {@link ModelReply}；工具轮用 {@code toolCalls}，回答轮用 {@code content}。
 */
class AgentChatServiceFinalAnswerTest {

    private static final String QUESTION = "打开超许可预警明细";

    /** 模型「不听话」的初稿：已完成语气 + 纯文本 */
    private static final String PLAIN_DRAFT = "已为您打开超许可预警明细页面。";

    /** 纠偏后应有的约定格式 */
    private static final String JSON_REPLY = """
            {"answer": "我可以帮你打开超许可预警明细，点击下方按钮即可查看逐条记录。",
             "events": [{"type": "DIALOG", "target": "warnDetailModal", "label": "查看超许可明细",
                         "args": {"category": "超许可"}}]}
            """;

    /** 按顺序 mock 模型回复：每条都是「无工具调用的最终回答」 */
    private static void replies(QwenClient qwen, String... contents) {
        ModelReply[] replyList = Arrays.stream(contents).map(ModelReply::text).toArray(ModelReply[]::new);
        when(qwen.chat(any(), any())).thenReturn(replyList[0],
                Arrays.copyOfRange(replyList, 1, replyList.length));
    }

    /** mock 一轮工具调用回复（模型自主发起，参数是嵌套 JSON 字符串） */
    private static void toolCall(QwenClient qwen, String id, String name, String arguments) {
        when(qwen.chat(any(), any())).thenReturn(new ModelReply("",
                List.of(new ModelReply.ToolRequest(id, name, arguments))));
    }

    @Test
    @DisplayName("模型回纯文本时：答案原文完整保留，不再为拿按钮追加格式纠正调用")
    void plainTextAnswerKeptAsIs() {
        QwenClient qwen = mock(QwenClient.class);
        replies(qwen, PLAIN_DRAFT, JSON_REPLY);

        AgentChatVO result = newService(qwen, withCapability()).chat(dto(QUESTION));

        // 非 JSON 也是合法答案：一个字不改，也只调用模型一次（少一轮等待）
        assertThat(result.getAnswer()).isEqualTo(PLAIN_DRAFT);
        verify(qwen, times(1)).chat(any(), any());
    }

    @Test
    @DisplayName("模型首次就输出约定 JSON 时：事件正常下发，也只调用一次")
    void noExtraCallWhenModelFollowsFormat() {
        QwenClient qwen = mock(QwenClient.class);
        replies(qwen, JSON_REPLY);

        AgentChatVO result = newService(qwen, withCapability()).chat(dto(QUESTION));

        assertThat(result.getEvents()).hasSize(1);
        verify(qwen, times(1)).chat(any(), any());
    }

    @Test
    @DisplayName("refs 被白名单拒绝时：带拒绝原因重问一次，只换按钮不改正文")
    void retryWithRejectsOnlyReplacesRefs() {
        // 模型编了一个不存在的 target：白名单必须拒掉，但原因要回给模型，否则它下一轮照抄
        String bad = """
                {"answer": "许可水量为 53631 万m³，点击下方按钮查看。",
                 "refs": [{"id": 1, "type": "SPOTLIGHT", "target": "tile.notExist", "label": "查看"}]}
                """;
        // 纠正轮只补 refs、不重复 answer —— 服务端因此只取事件、正文沿用上一轮
        String fixed = """
                {"refs": [{"id": 1, "type": "SPOTLIGHT", "target": "tile.xuKeShuiLiang", "label": "许可水量"}]}
                """;
        QwenClient qwen = mock(QwenClient.class);
        // 首轮（带工具）返回坏 refs；纠正轮不带工具，走单参 chat
        when(qwen.chat(any(), any())).thenReturn(ModelReply.text(bad));
        when(qwen.chat(any())).thenReturn(fixed);

        AgentChatVO result = newService(qwen, withAnchorCapability()).chat(dto("许可水量多少"));

        assertThat(result.getAnswer()).contains("53631");
        assertThat(result.getEvents()).hasSize(1);
        assertThat(result.getEvents().get(0).getTarget()).isEqualTo("tile.xuKeShuiLiang");
        // 一次取数（双参）+ 一次事件纠正（单参，无工具）
        verify(qwen, times(1)).chat(any(), any());
        verify(qwen, times(1)).chat(any());
    }

    @Test
    @DisplayName("带 ```json 围栏的输出也能解析，不触发纠偏")
    void parseFencedJson() {
        QwenClient qwen = mock(QwenClient.class);
        replies(qwen, "```json\n" + JSON_REPLY + "\n```");

        AgentChatVO result = newService(qwen, withCapability()).chat(dto(QUESTION));

        assertThat(result.getEvents()).hasSize(1);
        verify(qwen, times(1)).chat(any(), any());
    }

    @Test
    @DisplayName("能力清单为空且要打开弹框时：直接返回 capabilitiesStale，不浪费一次模型调用")
    void gateWhenCapabilitiesMissingForOperate() {
        QwenClient qwen = mock(QwenClient.class);
        replies(qwen, PLAIN_DRAFT);

        AgentChatVO result = newService(qwen, emptyCapabilities()).chat(dto(QUESTION));

        // 门禁前置：这类问题没有清单必然给不出按钮，先让前端同步再重试
        assertThat(result.getCapabilitiesStale()).isTrue();
        assertThat(result.getAnswer()).contains("页面引导能力正在加载");
        assertThat(result.getEvents()).isEmpty();
        verify(qwen, times(0)).chat(any(), any());
    }

    @Test
    @DisplayName("refs 带引用编号：正文 [[n]] 标记与事件一一对应")
    void citationMarkersAreParsed() {
        QwenClient qwen = mock(QwenClient.class);
        replies(qwen, """
                {"answer": "许可水量为 [[1]]53631 万m³。",
                 "refs": [{"id": 1, "type": "SPOTLIGHT", "target": "tile.xuKeShuiLiang", "label": "高亮许可水量"}]}
                """);

        AgentChatVO result = newService(qwen, withMetricAnchors()).chat(dto("许可水量是多少"));

        assertThat(result.getAnswer()).contains("[[1]]");
        assertThat(result.getEvents()).hasSize(1);
        assertThat(result.getEvents().get(0).getCite()).isEqualTo(1);
        assertThat(result.getEvents().get(0).getTarget()).isEqualTo("tile.xuKeShuiLiang");
    }

    @Test
    @DisplayName("target 不在白名单：事件被丢弃，正文里的死角标一并清掉")
    void orphanCitationIsRemoved() {
        QwenClient qwen = mock(QwenClient.class);
        replies(qwen, """
                {"answer": "许可水量为 [[1]]53631 万m³，[[2]]另有 3 条预警。",
                 "refs": [{"id": 1, "type": "SPOTLIGHT", "target": "tile.buCunZai", "label": "高亮"}]}
                """);

        AgentChatVO result = newService(qwen, withMetricAnchors()).chat(dto("许可水量是多少"));

        assertThat(result.getEvents()).isEmpty();
        // 标记必须清掉，否则用户点到的是死链；正文其余内容要保留
        assertThat(result.getAnswer()).doesNotContain("[[");
        assertThat(result.getAnswer()).contains("53631").contains("另有 3 条预警");
    }


    @Test
    @DisplayName("能力清单为空但只是查数据时：不触发门禁，照常取数作答")
    void noGateForDataQuestionWithoutCapabilities() {
        QwenClient qwen = mock(QwenClient.class);
        replies(qwen, "{\"answer\": \"今年许可水量为 53631 万m³。\", \"events\": []}");

        AgentChatVO result = newService(qwen, emptyCapabilities(), permitTool()).chat(dto("今年许可水量是多少"));

        assertThat(result.getAnswer()).contains("53631");
        verify(qwen, times(1)).chat(any(), any());
    }

    @Test
    @DisplayName("原生工具调用（arguments 是嵌套 JSON）：必须被识别并真正执行")
    void nativeToolCallIsExecuted() {
        QwenClient qwen = mock(QwenClient.class);
        // 第一轮模型发起工具调用；第二轮基于结果作答
        when(qwen.chat(any(), any())).thenReturn(new ModelReply("",
                        List.of(new ModelReply.ToolRequest("call-1", "water.permit.overview", "{\"year\": 2026}"))),
                ModelReply.text("{\"answer\": \"今年许可水量为 53631 万m³（河道外 24436、河道内 24436）。\", \"events\": []}"));

        AgentToolDefinition tool = mock(AgentToolDefinition.class);
        when(tool.getTitle()).thenReturn("取水许可与预警概况");
        when(tool.execute(any(), any())).thenReturn(AgentToolResult.ok(Map.of("licensedWater", 53631), null));

        AgentChatVO result = newService(qwen, emptyCapabilities(), tool).chat(dto("今年许可水量是多少"));

        assertThat(result.getUsedTools()).contains("water.permit.overview");
        assertThat(result.getAnswer()).contains("53631");
        assertThat(result.getEvents()).isEmpty();
        verify(tool, times(1)).execute(any(), any());
    }

    @Test
    @DisplayName("工具轮消息结构：assistant.tool_calls 之后紧跟 tool 消息，观测带任务锚")
    @SuppressWarnings("unchecked")
    void toolMessagesFollowNativeProtocol() {
        QwenClient qwen = mock(QwenClient.class);
        when(qwen.chat(any(), any())).thenReturn(new ModelReply("",
                        List.of(new ModelReply.ToolRequest("call-9", "water.permit.overview", "{\"year\": 2026}"))),
                ModelReply.text("{\"answer\": \"今年许可水量为 53631 万m³。\", \"events\": []}"));

        AgentToolDefinition tool = mock(AgentToolDefinition.class);
        when(tool.getTitle()).thenReturn("取水许可与预警概况");
        when(tool.execute(any(), any())).thenReturn(AgentToolResult.ok(Map.of("licensedWater", 53631), null));

        newService(qwen, emptyCapabilities(), tool).chat(dto("今年许可水量是多少"));

        ArgumentCaptor<List<Map<String, Object>>> captor = ArgumentCaptor.forClass(List.class);
        verify(qwen, times(2)).chat(captor.capture(), any());
        List<Map<String, Object>> messages = captor.getAllValues().get(1);

        // [system, user] 之后：assistant.tool_calls → tool（tool_call_id 对得上）
        Map<String, Object> assistant = messages.get(2);
        assertThat(assistant.get("role")).isEqualTo("assistant");
        assertThat((List<?>) assistant.get("tool_calls")).hasSize(1);
        Map<String, Object> toolMessage = messages.get(3);
        assertThat(toolMessage.get("role")).isEqualTo("tool");
        assertThat(toolMessage.get("tool_call_id")).isEqualTo("call-9");
        // 工具结果带任务锚：多轮往返中模型始终看得到初始问题
        assertThat(String.valueOf(toolMessage.get("content")))
                .contains("licensedWater")
                .contains("【当前任务】今年许可水量是多少");
    }

    // ==================== 位置检索兜底 ====================

    @Test
    @DisplayName("问位置但模型没调工具、也没给按钮：服务端兜底补出定位按钮")
    void locateFallbackWhenModelSkipsTool() {
        QwenClient qwen = mock(QwenClient.class);
        replies(qwen, "{\"answer\":\"许可水量在水量监控页面。\",\"events\":[]}");

        AgentChatVO result = newService(qwen, withAnchorCapability()).chat(dto("许可水量在系统哪里看"));

        assertThat(result.getEvents()).hasSize(1);
        assertThat(result.getEvents().get(0).getType()).isEqualTo("SPOTLIGHT");
        assertThat(result.getEvents().get(0).getTarget()).isEqualTo("tile.xuKeShuiLiang");
    }

    @Test
    @DisplayName("问位置但能力清单里没有对应项：答案原文保留，只追加「暂无跳转入口」提示")
    void locateFallbackReportsNoMatch() {
        QwenClient qwen = mock(QwenClient.class);
        replies(qwen, "{\"answer\":\"水费在费用页面看。\",\"events\":[]}");

        AgentChatVO result = newService(qwen, withAnchorCapability()).chat(dto("水费账单在系统中的位置"));

        assertThat(result.getAnswer()).contains("水费在费用页面看");
        assertThat(result.getAnswer()).contains("未登记").contains("请以系统菜单为准");
        assertThat(result.getEvents()).isEmpty();
    }

    @Test
    @DisplayName("详细答案遇到定位无匹配：多行、多个数字一个都不能被覆盖或压缩")
    void detailedAnswerSurvivesLocateMiss() {
        QwenClient qwen = mock(QwenClient.class);
        replies(qwen, """
                {"answer": "2026 年许可水量 53631 万m³。\\n1. 河道外 24436 万m³；\\n2. 河道内 24436 万m³；\\n3. 单位：万m³，口径为取水许可批复量。", "refs": []}
                """);

        AgentChatVO result = newService(qwen, withAnchorCapability()).chat(dto("水费账单在系统中的位置"));

        assertThat(result.getAnswer()).contains("53631").contains("24436")
                .contains("1. 河道外").contains("2. 河道内").contains("3. 单位")
                .contains("\n");
        assertThat(result.getEvents()).isEmpty();
    }

    @Test
    @DisplayName("输出被 max_tokens 截断成半截 JSON：抢救出已生成的正文，不把 JSON 源码给用户看")
    void truncatedJsonAnswerIsRecovered() {
        QwenClient qwen = mock(QwenClient.class);
        // 没有收尾的引号和 }，ObjectMapper 必然解析失败
        replies(qwen,
                "{\"answer\":\"2026 年许可水量 53631 万m³。\\n1. 河道外 24436 万m³，河道内 244");

        AgentChatVO result = newService(qwen, withAnchorCapability()).chat(dto("许可水量是多少"));

        assertThat(result.getAnswer()).contains("53631").contains("河道外 24436");
        assertThat(result.getAnswer()).doesNotContain("{\"answer\"");
    }

    // ==================== 统计数字：说了按钮就必须有按钮 ====================

    @Test
    @DisplayName("补不出按钮时删掉「点击下方按钮」的表述：不能说了有按钮却什么都没有")
    void stripButtonMentionWhenNoEventAvailable() {
        QwenClient qwen = mock(QwenClient.class);
        // 第一轮工具取数；第二轮回答里提到了按钮但清单里没有可用锚点
        when(qwen.chat(any(), any())).thenReturn(new ModelReply("",
                        List.of(new ModelReply.ToolRequest("call-1", "water.permit.overview", "{\"year\": 2026}"))),
                ModelReply.text("{\"answer\": \"2026年许可水量·河道外为 24436 万m³。您可以点击下方按钮高亮查看该数据。\", \"events\": []}"));

        AgentChatVO result = newService(qwen, emptyCapabilities(), permitTool()).chat(dto("许可水量·河道外 量是多少"));

        // 数字保留，误导性的「点击下方按钮」删掉
        assertThat(result.getAnswer()).contains("24436").doesNotContain("按钮");
        assertThat(result.getEvents()).isEmpty();
    }

    // ==================== 结构化明细 ====================

    @Test
    @DisplayName("模型输出 details：正文完整保留，表格 / 要点 / 数值列一起下发")
    void detailsAreParsedAndAnswerKept() {
        QwenClient qwen = mock(QwenClient.class);
        replies(qwen, """
                {"answer":"2026 年许可水量 53631 万m³，分项见下表。\\n口径：取水许可批复量。",
                 "refs": [],
                 "details":[
                   {"title":"许可水量构成","head":["口径","水量(万m³)"],
                    "rows":[["总量","53631"],["河道外","24436"]],"num":[1],
                    "note":"已按当前单位过滤"},
                   {"title":"口径说明","points":["许可水量是批复量","不同于年度用水计划"]}
                 ]}
                """);

        AgentChatVO result = newService(qwen, withAnchorCapability()).chat(dto("许可水量是多少"));

        assertThat(result.getAnswer()).contains("53631").contains("口径：取水许可批复量");
        assertThat(result.getDetails()).hasSize(2);
        assertThat(result.getDetails().get(0).getTitle()).isEqualTo("许可水量构成");
        assertThat(result.getDetails().get(0).getHead()).containsExactly("口径", "水量(万m³)");
        assertThat(result.getDetails().get(0).getRows().get(1)).containsExactly("河道外", "24436");
        assertThat(result.getDetails().get(0).getNum()).containsExactly(1);
        assertThat(result.getDetails().get(0).getNote()).isEqualTo("已按当前单位过滤");
        assertThat(result.getDetails().get(1).getPoints()).hasSize(2);
        assertThat(result.getDetails().get(1).getHead()).isNull();
    }

    @Test
    @DisplayName("畸形 details：列数补齐、越界列截断、角标/Markdown 清除、空块丢弃，正文不受影响")
    void malformedDetailsAreSanitized() {
        QwenClient qwen = mock(QwenClient.class);
        String longCell = "x".repeat(260);
        String reply = "{\"answer\":\"结论：许可水量 53631 万m³。\",\"refs\":[],\"details\":["
                + "{\"title\":\"明[[1]]细\",\"head\":[\"口径\",\"水量\"],"
                + "\"rows\":[[\"总量\"],[\"河道外\",\"24436\",\"多余列\"],[\"**加粗**\",\"`" + longCell + "`\"]],"
                + "\"num\":[1,99,-1]},"
                + "{},\"不是对象\"]}";
        when(qwen.chat(any(), any())).thenReturn(ModelReply.text(reply));

        AgentChatVO result = newService(qwen, withAnchorCapability()).chat(dto("许可水量是多少"));

        assertThat(result.getAnswer()).isEqualTo("结论：许可水量 53631 万m³。");
        assertThat(result.getDetails()).hasSize(1);
        var block = result.getDetails().get(0);
        assertThat(block.getTitle()).isEqualTo("明细");
        assertThat(block.getRows().get(0)).containsExactly("总量", "");
        assertThat(block.getRows().get(1)).containsExactly("河道外", "24436");
        assertThat(block.getRows().get(2).get(0)).isEqualTo("加粗");
        assertThat(block.getRows().get(2).get(1)).endsWith("…").hasSize(201);
        assertThat(block.getNum()).containsExactly(1);
    }

    @Test
    @DisplayName("模型没给 details：结果为空数组而不是 null，纯文字回答照常可用")
    void missingDetailsIsEmptyList() {
        QwenClient qwen = mock(QwenClient.class);
        replies(qwen, "{\"answer\":\"今年许可水量 53631 万m³。\",\"refs\":[]}");

        AgentChatVO result = newService(qwen, withAnchorCapability()).chat(dto("许可水量是多少"));

        assertThat(result.getAnswer()).contains("53631");
        assertThat(result.getDetails()).isEmpty();
    }

    // ==================== 问题预处理 ====================

    @Test
    @DisplayName("预处理结果随问题一起给模型：用户原话保留，年份与口径由服务端算好")
    @SuppressWarnings("unchecked")
    void preprocessingBriefIsSentToModel() {
        QwenClient qwen = mock(QwenClient.class);
        when(qwen.chat(any(), any())).thenReturn(
                ModelReply.text("{\"answer\": \"今年许可水量·河道外为 24436 万m³。\", \"events\": []}"));

        newService(qwen, emptyCapabilities(), permitTool())
                .chat(dto("麻烦你帮我看看今年河道外许可水量是多少啊，谢谢"));

        ArgumentCaptor<List<Map<String, Object>>> captor = ArgumentCaptor.forClass(List.class);
        verify(qwen).chat(captor.capture(), any());
        List<Map<String, Object>> messages = captor.getValue();
        String prompt = messages.stream()
                .map(m -> String.valueOf(m.get("content")))
                .collect(Collectors.joining("\n"));

        assertThat(prompt)
                .contains("用户原话：麻烦你帮我看看今年河道外许可水量是多少啊，谢谢")
                .contains("识别年份：" + java.time.LocalDate.now().getYear())
                .contains("意图：查业务数据");
        // 发给模型的用户消息是清理后的问句，不是带着「麻烦你帮我看看…啊，谢谢」的原话
        assertThat(messages.get(messages.size() - 1).get("content")).isEqualTo("今年河道外许可水量是多少");
    }

    // ==================== 测试装配 ====================

    /** 取水许可工具 */
    private AgentToolDefinition permitTool() {
        AgentToolDefinition tool = mock(AgentToolDefinition.class);
        when(tool.getTitle()).thenReturn("取水许可与预警概况");
        when(tool.execute(any(), any())).thenReturn(AgentToolResult.ok(
                Map.of("licensedWaterOut", 24436, "licensedWaterIn", 24436, "licensedWater", 53631), null));
        return tool;
    }

    /** 带「许可水量」与「许可水量·河道外」两个锚点的页面声明 */
    private UiCapabilityService withMetricAnchors() {
        UiPageCapability page = new UiPageCapability();
        page.setRoute("/waterUse/qushuijianguan/shuiliangjiankong");
        page.setTitle("取水监管 · 水量监控");
        page.setVersion("1");

        UiPageCapability.Anchor total = new UiPageCapability.Anchor();
        total.setTarget("tile.xuKeShuiLiang");
        total.setDesc("「许可水量」总数字（万m³）。用户问总许可水量时，高亮它");

        UiPageCapability.Anchor out = new UiPageCapability.Anchor();
        out.setTarget("tile.xuKeShuiLiangHeDaoWai");
        out.setDesc("「许可水量·河道外」统计数字。用户问河道外用水许可时，高亮它");

        page.setAnchors(List.of(total, out));

        UiCapabilityService service = new UiCapabilityService(new InMemoryUiCapabilityStore());
        service.save(List.of(page), "web");
        return service;
    }

    private AgentChatService newService(QwenClient qwen, UiCapabilityService ui) {
        return newService(qwen, ui, null);
    }

    private AgentChatService newService(QwenClient qwen, UiCapabilityService ui, AgentToolDefinition tool) {
        AgentProperties properties = new AgentProperties();
        properties.getQwen().setApiKey("test-key"); // 强制走模型分支，避开 Demo 脚本
        properties.setMaxToolRounds(2);

        AgentToolRegistry registry = mock(AgentToolRegistry.class);
        when(registry.isEmpty()).thenReturn(tool == null);
        when(registry.find(anyString()))
                .thenReturn(tool == null ? Optional.empty() : Optional.of(tool));
        when(registry.all()).thenReturn(tool == null ? List.of() : List.of(tool));
        when(registry.openAiTools(any())).thenReturn(List.of());

        AgentToolPermissionChecker permission = mock(AgentToolPermissionChecker.class);
        when(permission.allows(any())).thenReturn(true);

        ConversationMemoryService memory = mock(ConversationMemoryService.class);
        when(memory.history(anyString())).thenReturn(List.of());

        return new AgentChatService(qwen, registry, memory, permission,
                properties, new ObjectMapper(), ui, new UiCapabilityLocator(ui), new QuestionNormalizer());
    }

    // ==================== 页面能力声明样本 ====================

    private AgentChatDTO dto(String question) {
        AgentChatDTO dto = new AgentChatDTO();
        dto.setQuestion(question);
        return dto;
    }

    private UiCapabilityService emptyCapabilities() {
        return new UiCapabilityService(new InMemoryUiCapabilityStore());
    }

    /** 带「超许可预警明细」弹框的页面声明 */
    private UiCapabilityService withCapability() {
        UiPageCapability page = new UiPageCapability();
        page.setRoute("/waterUse/qushuijianguan/shuiliangjiankong");
        page.setTitle("取水监管 · 水量监控");
        page.setVersion("1");

        UiPageCapability.Anchor tile = new UiPageCapability.Anchor();
        tile.setTarget("tile.xuKeShuiLiang");
        tile.setDesc("「许可水量」总数字（万m³）");

        page.setAnchors(List.of(tile));

        // 弹框现在挂在 dialogs 里（Anchor 只剩数字锚点）：类型校验按 kind 判定，
        // 声明成 Anchor 的 target 不能承载 DIALOG 事件
        UiPageCapability.Dialog warn = new UiPageCapability.Dialog();
        warn.setTarget("warnDetailModal");
        warn.setDesc("「超许可预警明细」弹框，可按 category 筛选");
        UiPageCapability.Param category = new UiPageCapability.Param();
        category.setName("category");
        category.setDesc("预警分类");
        category.setType("string");
        category.setEnums(List.of("超许可"));
        warn.setParams(List.of(category));
        page.setDialogs(List.of(warn));

        UiCapabilityService service = new UiCapabilityService(new InMemoryUiCapabilityStore());
        service.save(List.of(page), "web");
        return service;
    }

    private UiCapabilityService withAnchorCapability() {
        return withCapability();
    }
}
