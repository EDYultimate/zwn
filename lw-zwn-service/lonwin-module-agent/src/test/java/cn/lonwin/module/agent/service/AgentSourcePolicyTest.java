package cn.lonwin.module.agent.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.module.agent.client.QwenClient;
import cn.lonwin.module.agent.config.AgentProperties;
import cn.lonwin.module.agent.preprocess.QuestionNormalizer;
import cn.lonwin.module.agent.support.AgentToolPermissionChecker;
import cn.lonwin.module.agent.tool.AgentToolRegistry;
import cn.lonwin.module.agent.uicapability.UiCapabilityLocator;
import cn.lonwin.module.agent.uicapability.UiCapabilityService;

/**
 * 三开关组合 → 系统提示词「数据来源与引用规则」章节。
 *
 * <p>这段提示词是融合问答的行为约束来源：两开时必须有冲突裁决，只开工具侧时
 * 必须禁止模型引用文档，只开知识侧时必须禁止拿历史数字冒充实时值。
 * 用反射调私有方法，避免为了测试启动 Spring 容器或真的调用模型。
 */
class AgentSourcePolicyTest {

    private static String section(boolean toolsOn, boolean knowledgeOn) {
        AgentProperties properties = new AgentProperties();
        properties.getTools().setEnabled(toolsOn);
        properties.getKnowledge().setEnabled(knowledgeOn);

        UiCapabilityService ui = mock(UiCapabilityService.class);
        AgentChatService service = new AgentChatService(
                mock(QwenClient.class),
                mock(AgentToolRegistry.class),
                mock(ConversationMemoryService.class),
                mock(AgentToolPermissionChecker.class),
                properties,
                new ObjectMapper(),
                ui,
                new UiCapabilityLocator(ui),
                new QuestionNormalizer());

        return ReflectionTestUtils.invokeMethod(service, "sourcePolicySection");
    }

    @Test
    @DisplayName("双开：写明 source=api/kb 分区、数值以 api 为准、冲突并列")
    void fusionSectionDefinesConflictRules() {
        String text = section(true, true);

        assertThat(text).contains("source=api", "source=kb", "冲突裁决", "数值、状态、统计以 api 为准");
        assertThat(text).contains("显式并列", "kb.search", "[[11]]");
        assertThat(text).doesNotContain("本轮未接入任何外部数据通道");
    }

    @Test
    @DisplayName("只开工具侧：明确禁止引用制度条文，不出现文档引用编号")
    void toolsOnlySectionForbidsDocumentCitations() {
        String text = section(true, false);

        assertThat(text).contains("知识侧未接入", "不要引用制度条文");
        assertThat(text).doesNotContain("[[11]]", "source=kb");
    }

    @Test
    @DisplayName("只开知识侧：禁止拿文档历史数字冒充实时值")
    void knowledgeOnlySectionWarnsAboutRealtimeNumbers() {
        String text = section(false, true);

        assertThat(text).contains("工具侧未接入", "kb.search", "不要用文档里的历史数字冒充实时值");
        assertThat(text).contains("[[11]]");
    }

    @Test
    @DisplayName("全关：不调工具、不给业务数字，只做概念与寒暄")
    void allDisabledSectionIsShortCircuit() {
        String text = section(false, false);

        assertThat(text).contains("未接入任何外部数据通道", "不要调用工具");
        assertThat(text).doesNotContain("kb.search", "source=api");
    }

    @Test
    @DisplayName("引用编号规则在四种组合下都不允许写死链角标")
    void citationRuleAlwaysPresent() {
        for (boolean tools : new boolean[]{true, false}) {
            for (boolean knowledge : new boolean[]{true, false}) {
                if (!tools && !knowledge) {
                    continue;
                }
                assertThat(section(tools, knowledge)).contains("没有对应来源的编号不要写");
            }
        }
    }
}
