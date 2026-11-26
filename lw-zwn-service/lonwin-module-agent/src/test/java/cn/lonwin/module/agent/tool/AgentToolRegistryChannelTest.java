package cn.lonwin.module.agent.tool;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ListableBeanFactory;

import cn.lonwin.module.agent.config.AgentProperties;
import cn.lonwin.module.agent.feignclient.AgentToolApi;
import cn.lonwin.module.agent.tool.meta.AgentToolMetaService;

/**
 * 双通道开关在工具注册表里的实际效果。
 *
 * <p>这是「只有工具侧接口时把 knowledge.enabled 置 false」能成立的关键：
 * kb.search 必须在 build() 阶段就被过滤掉，既不进提示词清单，也无法被 find() 命中，
 * 模型才不会去调一个 Bean 根本不存在的工具。
 */
class AgentToolRegistryChannelTest {

    private static AgentToolDefinition definition(String name) {
        return AgentToolDefinition.builder()
                .name(name)
                .title(name)
                .description("测试工具")
                .params(List.of())
                .build();
    }

    private static List<AgentToolDefinition> baseline() {
        return List.of(definition("ui.locate"), definition(AgentToolRegistry.KNOWLEDGE_TOOL));
    }

    private static AgentToolRegistry registry(boolean toolsOn, boolean knowledgeOn) {
        AgentProperties properties = new AgentProperties();
        properties.getTools().setEnabled(toolsOn);
        properties.getKnowledge().setEnabled(knowledgeOn);

        // 只需要一条契约：具体产出哪些工具交给 factory 决定，本测试关注的只是通道过滤
        AgentToolContracts contracts = new AgentToolContracts(
                List.of(new AgentToolContracts.Contract(AgentToolApi.class, "agentToolApi")));

        AgentToolDefinitionFactory factory = mock(AgentToolDefinitionFactory.class);
        when(factory.build(any(), any())).thenAnswer(invocation -> new ArrayList<>(baseline()));

        AgentToolMetaService metaService = mock(AgentToolMetaService.class);
        when(metaService.apply(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        return new AgentToolRegistry(contracts, mock(ListableBeanFactory.class),
                List.of(), factory, metaService, properties);
    }

    private static List<String> names(AgentToolRegistry registry) {
        return registry.all().stream().map(AgentToolDefinition::getName).collect(Collectors.toList());
    }

    @Test
    @DisplayName("双开：两个通道的工具都注册，清单按名字排序")
    void bothChannelsEnabled() {
        AgentToolRegistry registry = registry(true, true);

        assertThat(names(registry)).containsExactly(AgentToolRegistry.KNOWLEDGE_TOOL, "ui.locate");
        assertThat(registry.find(AgentToolRegistry.KNOWLEDGE_TOOL)).isPresent();
        assertThat(registry.describeAll()).contains("kb.search", "ui.locate");
    }

    @Test
    @DisplayName("只有工具侧：knowledge.enabled=false 时 kb.search 彻底消失")
    void toolsOnlyRemovesKnowledgeTool() {
        AgentToolRegistry registry = registry(true, false);

        assertThat(names(registry)).containsExactly("ui.locate");
        assertThat(registry.find(AgentToolRegistry.KNOWLEDGE_TOOL)).isEmpty();
        assertThat(registry.describeAll()).doesNotContain("kb.search");
    }

    @Test
    @DisplayName("只有知识侧：tools.enabled=false 时业务/页面工具全部消失")
    void knowledgeOnlyRemovesApiTools() {
        AgentToolRegistry registry = registry(false, true);

        assertThat(names(registry)).containsExactly(AgentToolRegistry.KNOWLEDGE_TOOL);
        assertThat(registry.find("ui.locate")).isEmpty();
    }

    @Test
    @DisplayName("全关：注册表为空，提示词里没有工具清单")
    void allChannelsDisabledLeavesEmptyRegistry() {
        AgentToolRegistry registry = registry(false, false);

        assertThat(registry.isEmpty()).isTrue();
        assertThat(registry.size()).isZero();
        assertThat(registry.describeAll()).isEmpty();
    }
}
