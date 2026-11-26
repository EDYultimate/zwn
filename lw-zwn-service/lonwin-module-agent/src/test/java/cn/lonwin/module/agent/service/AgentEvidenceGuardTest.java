package cn.lonwin.module.agent.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.fasterxml.jackson.databind.ObjectMapper;

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

/**
 * 「零证据防线」行为锁定。
 *
 * <p>要防的事故很具体：用户问「许可水量总共多少」，模型一次工具都不调，
 * 直接吐出一个看起来很像真的数字（实测出现过 15,842.35 万m³/年），
 * 日志里只有「一次模型调用、零次工具调用」，事后无法区分它是查的还是编的。
 *
 * <p>防线分两段，本类逐条锁定：
 * <ol>
 *   <li>有工具却没调 + 数据类问法 + 答案含数字 → 用 {@code tool_choice=required} 强制取数一次；</li>
 *   <li>强制后仍不调工具 → 不输出任何数字，改为如实说明「没取到数据」。</li>
 * </ol>
 *
 * <p>同时锁定两条「不该误伤」的边界：工具清单为空时不重试（重试也调不出东西），
 * 非数据类问题（概念解释）不重试。
 */
@DisplayName("零证据防线")
class AgentEvidenceGuardTest {

    private static final String DATA_QUESTION = "许可水量总共多少";

    /** 编造的许可水量：整条防线就是为了不让它出现在用户屏幕上 */
    private static final String FABRICATED = "全部取水许可证的许可水量合计为 15,842.35 万m³/年。";

    private static final String REAL_ANSWER = """
            {"answer": "许可水量合计 24436 万m³/年，按河流分项见下表。", "refs": [], "details": []}
            """;

    @Test
    @DisplayName("有工具却不调、直接报数字：强制取数一次，最终用接口返回的数据作答")
    void forcesToolCallWhenNumbersAppearWithoutEvidence() {
        QwenClient qwen = mock(QwenClient.class);
        // 首轮：零工具调用 + 一个编造的数字
        when(qwen.chat(any(), any())).thenReturn(ModelReply.text(FABRICATED), ModelReply.text(REAL_ANSWER));
        // 强制轮：只读工具 + required
        when(qwen.chat(any(), any(), eq("required"))).thenReturn(toolCall("call-1", "water.cert.list"));

        AgentChatVO result = service(qwen, true).chat(dto(DATA_QUESTION));

        // 编造的数字绝不能出现在最终答案里
        assertThat(result.getAnswer()).doesNotContain("15,842");
        assertThat(result.getAnswer()).contains("24436");
        // 首轮 + 最终回答共两次普通调用，强制轮一次 required 调用
        verify(qwen, times(2)).chat(any(), any());
        verify(qwen, times(1)).chat(any(), any(), eq("required"));
        assertThat(result.getUsedTools()).containsExactly("water.cert.list");
    }

    @Test
    @DisplayName("强制轮只开放只读工具：写接口不会因为 required 约束被模型选中")
    void forcedRoundOnlyExposesReadOnlyTools() {
        QwenClient qwen = mock(QwenClient.class);
        when(qwen.chat(any(), any())).thenReturn(ModelReply.text(FABRICATED), ModelReply.text(REAL_ANSWER));
        when(qwen.chat(any(), any(), eq("required"))).thenReturn(toolCall("call-1", "water.cert.list"));

        service(qwen, true).chat(dto(DATA_QUESTION));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Map<String, Object>>> captor = ArgumentCaptor.forClass(List.class);
        verify(qwen).chat(any(), captor.capture(), eq("required"));
        List<String> names = new ArrayList<>();
        for (Map<String, Object> tool : captor.getValue()) {
            @SuppressWarnings("unchecked")
            Map<String, Object> function = (Map<String, Object>) tool.get("function");
            names.add(String.valueOf(function.get("name")));
        }
        assertThat(names).containsExactly("water.cert.list");
        assertThat(names).doesNotContain("water.cert.delete", "water.cert.save");
    }

    @Test
    @DisplayName("强制取数后仍不调工具：不给数字，改为如实说明没取到数据")
    void refusesToAnswerWhenForcedRoundStillSkipsTools() {
        QwenClient qwen = mock(QwenClient.class);
        when(qwen.chat(any(), any())).thenReturn(ModelReply.text(FABRICATED));
        // 强制轮依旧「不听话」：没有任何 tool_calls
        when(qwen.chat(any(), any(), eq("required"))).thenReturn(ModelReply.text(FABRICATED));

        AgentChatVO result = service(qwen, true).chat(dto(DATA_QUESTION));

        assertThat(result.getAnswer())
                .contains("未能从业务系统取到数据")
                .doesNotContain("15,842");
        assertThat(result.getUsedTools()).isEmpty();
        // 只重试一次，不做无上限循环
        verify(qwen, times(1)).chat(any(), any(), eq("required"));
    }

    @Test
    @DisplayName("网关不支持 required 时降级：不让整次问答报错，按无证据如实说明")
    void degradesWhenGatewayRejectsRequired() {
        QwenClient qwen = mock(QwenClient.class);
        when(qwen.chat(any(), any())).thenReturn(ModelReply.text(FABRICATED));
        when(qwen.chat(any(), any(), eq("required")))
                .thenThrow(new cn.lonwin.common.core.exception.BusinessException("调用大模型失败：[40001] 参数不支持"));

        AgentChatVO result = service(qwen, true).chat(dto(DATA_QUESTION));

        assertThat(result.getAnswer()).contains("未能从业务系统取到数据").doesNotContain("15,842");
    }

    @Test
    @DisplayName("工具清单为空时不重试：没有工具可调，重试只会多烧一次调用")
    void noRetryWhenNoToolsRegistered() {
        QwenClient qwen = mock(QwenClient.class);
        when(qwen.chat(any(), any())).thenReturn(ModelReply.text(FABRICATED));

        AgentChatVO result = service(qwen, false).chat(dto(DATA_QUESTION));

        assertThat(result.getAnswer()).isEqualTo(FABRICATED);
        verify(qwen, times(1)).chat(any(), any());
        verify(qwen, never()).chat(any(), any(), any());
    }

    @Test
    @DisplayName("概念类问题不重试：没有统计口径，就不该逼模型去查数")
    void noRetryForConceptQuestion() {
        QwenClient qwen = mock(QwenClient.class);
        String concept = "取水许可证的有效期一般为 5 年，到期需办理延续。";
        when(qwen.chat(any(), any())).thenReturn(ModelReply.text(concept));

        AgentChatVO result = service(qwen, true).chat(dto("取水许可证是什么"));

        assertThat(result.getAnswer()).isEqualTo(concept);
        verify(qwen, times(1)).chat(any(), any());
        verify(qwen, never()).chat(any(), any(), any());
    }

    @Test
    @DisplayName("流式下编造的数字不再逐字上屏：零证据轮正文先扣住，真实数据拿到后才流出")
    void fabricatedNumberNeverStreamsToUser() {
        QwenClient qwen = mock(QwenClient.class);
        // 首轮流式直接吐编造数字；强制取数后的最终轮流式吐真实答案
        java.util.concurrent.atomic.AtomicInteger streamCalls = new java.util.concurrent.atomic.AtomicInteger();
        when(qwen.chatStream(any(), any(), any(), any())).thenAnswer(inv -> {
            java.util.function.Consumer<String> onDelta = inv.getArgument(2);
            String text = streamCalls.incrementAndGet() == 1 ? FABRICATED : REAL_ANSWER;
            for (int i = 0; i < text.length(); i += 5) {
                onDelta.accept(text.substring(i, Math.min(i + 5, text.length())));
            }
            return ModelReply.text(text);
        });
        when(qwen.chat(any(), any(), eq("required"))).thenReturn(toolCall("call-1", "water.cert.list"));

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

        service(qwen, true).chatStream(dto(DATA_QUESTION), sink);

        // 流式期间：编造数字从未上屏（防线拦下的那轮正文被扣住）
        String streamed = String.join("", deltas);
        assertThat(streamed).doesNotContain("15,842");
        assertThat(streamed).doesNotContain("许可水量合计为");
        // 阶段提示照常发：用户看得到系统在工作，不是卡死
        assertThat(stages).isNotEmpty();
        // 拿到工具证据后，真实数据照常逐字流出
        assertThat(streamed).contains("24436");
    }

    // ==================== 装配 ====================

    private AgentChatDTO dto(String question) {
        AgentChatDTO dto = new AgentChatDTO();
        dto.setQuestion(question);
        return dto;
    }

    private ModelReply toolCall(String id, String name) {
        return new ModelReply("", List.of(new ModelReply.ToolRequest(id, name, "{}")));
    }

    /** 工具清单：一个只读列表工具 + 一个写工具，用于验证强制轮只放只读 */
    private List<Map<String, Object>> toolList(boolean readOnlyOnly) {
        List<Map<String, Object>> tools = new ArrayList<>();
        tools.add(tool("water.cert.list"));
        if (!readOnlyOnly) {
            tools.add(tool("water.cert.delete"));
        }
        return tools;
    }

    private Map<String, Object> tool(String name) {
        Map<String, Object> function = new LinkedHashMap<>();
        function.put("name", name);
        function.put("description", name);
        function.put("parameters", Map.of("type", "object", "properties", Map.of(), "required", List.of()));
        Map<String, Object> tool = new LinkedHashMap<>();
        tool.put("type", "function");
        tool.put("function", function);
        return tool;
    }

    private AgentChatService service(QwenClient qwen, boolean withTools) {
        AgentProperties properties = new AgentProperties();
        properties.getQwen().setApiKey("test-key");
        properties.setMaxToolRounds(2);

        AgentToolDefinition listTool = mock(AgentToolDefinition.class);
        when(listTool.getTitle()).thenReturn("证照列表查询");
        when(listTool.execute(any(), any())).thenReturn(AgentToolResult.ok(
                Map.of("rows", List.of(Map.of("river", "漳河", "amt", 24436)), "source", "api"), null));

        AgentToolRegistry registry = mock(AgentToolRegistry.class);
        when(registry.isEmpty()).thenReturn(!withTools);
        when(registry.openAiTools(any())).thenReturn(withTools ? toolList(false) : List.of());
        when(registry.readOnlyTools(any())).thenReturn(withTools ? toolList(true) : List.of());
        when(registry.find(anyString())).thenReturn(withTools ? Optional.of(listTool) : Optional.empty());
        when(registry.all()).thenReturn(withTools ? List.of(listTool) : List.of());

        AgentToolPermissionChecker permission = mock(AgentToolPermissionChecker.class);
        when(permission.allows(any())).thenReturn(true);

        ConversationMemoryService memory = mock(ConversationMemoryService.class);
        when(memory.history(anyString())).thenReturn(List.of());

        UiCapabilityService ui = new UiCapabilityService(new InMemoryUiCapabilityStore());
        return new AgentChatService(qwen, registry, memory, permission,
                properties, new ObjectMapper(), ui, new UiCapabilityLocator(ui), new QuestionNormalizer());
    }
}
