package cn.lonwin.module.agent.tool.meta;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.module.agent.annotation.AgentTool;
import cn.lonwin.module.agent.annotation.AgentToolParam;
import cn.lonwin.module.agent.spi.AgentToolResult;
import cn.lonwin.module.agent.tool.AgentToolDefinition;
import cn.lonwin.module.agent.tool.AgentToolDefinitionFactory;
import cn.lonwin.module.agent.tool.AgentToolInvoker;
import cn.lonwin.module.agent.tool.AgentToolSchemaRenderer;

/**
 * 工具元数据覆盖测试：注解默认值 + 运行期覆盖 + 启停 + 校验。
 *
 * <p>覆盖能力的价值全在「不重启、不改代码」上，因此这里重点验证：
 * 只覆盖一个字段时其余字段是否保持不变、参数说明改了 Schema 是否跟着重算。
 */
class AgentToolMetaServiceTest {

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();
    private final AgentToolSchemaRenderer renderer = new AgentToolSchemaRenderer();

    private AgentToolMetaStore store;
    private AgentToolMetaService service;
    private List<AgentToolDefinition> baseline;

    interface DemoApi {

        @AgentTool(name = "demo.query", title = "演示查询", description = "注解里的原始描述")
        AgentToolResult query(@AgentToolParam(description = "注解里的年份说明") Integer year);

        @AgentTool(name = "demo.other", title = "另一个工具", description = "另一个工具的描述")
        AgentToolResult other();
    }

    static class DemoApiImpl implements DemoApi {

        @Override
        public AgentToolResult query(Integer year) {
            return AgentToolResult.ok(Map.of("year", year == null ? 0 : year), null);
        }

        @Override
        public AgentToolResult other() {
            return AgentToolResult.ok(Map.of(), null);
        }
    }

    @BeforeEach
    void setUp() {
        store = new InMemoryAgentToolMetaStore();
        service = new AgentToolMetaService(store, renderer);
        AgentToolDefinitionFactory factory = new AgentToolDefinitionFactory(
                new AgentToolInvoker(objectMapper), renderer);
        baseline = factory.build(DemoApi.class, new DemoApiImpl());
    }

    private AgentToolDefinition effective(String name) {
        return service.apply(baseline).stream()
                .filter(d -> d.getName().equals(name))
                .findFirst()
                .orElseThrow();
    }

    @Test
    @DisplayName("覆盖：只改描述时，标题/参数说明沿用注解；提示词随之变化")
    void shouldOverrideOnlyGivenFields() {
        store.save(AgentToolMeta.builder().name("demo.query").description("管理端改过的描述").build());

        AgentToolDefinition def = effective("demo.query");

        assertThat(def.getDescription()).isEqualTo("管理端改过的描述");
        assertThat(def.getTitle()).isEqualTo("演示查询");
        assertThat(def.getParams()).extracting(AgentToolDefinition.Param::description)
                .containsExactly("注解里的年份说明");
        assertThat(def.toPromptText()).contains("管理端改过的描述");
    }

    @Test
    @DisplayName("覆盖：改参数说明后 Schema 重新生成，提示词里是新的说明")
    @SuppressWarnings("unchecked")
    void shouldRegenerateSchemaWhenParamDescriptionOverridden() {
        store.save(AgentToolMeta.builder().name("demo.query")
                .paramDescriptions(Map.of("year", "目标年份，四位数")).build());

        AgentToolDefinition def = effective("demo.query");

        Map<String, Object> year = (Map<String, Object>) ((Map<String, Object>)
                def.getParamSchema().get("properties")).get("year");
        assertThat(year.get("description")).isEqualTo("目标年份，四位数");
        assertThat(def.toPromptText()).contains("目标年份，四位数");
    }

    @Test
    @DisplayName("启停：enabled=false 的工具不注册给模型，其余工具不受影响")
    void shouldDropDisabledTool() {
        store.save(AgentToolMeta.builder().name("demo.other").enabled(false).build());

        List<AgentToolDefinition> defs = service.apply(baseline);

        assertThat(defs).extracting(AgentToolDefinition::getName).containsExactly("demo.query");
    }

    @Test
    @DisplayName("校验：写入不存在的工具名直接拒绝，避免产生孤儿配置")
    void shouldRejectUnknownToolName() {
        Set<String> known = Set.of("demo.query", "demo.other");

        assertThatThrownBy(() -> service.save(AgentToolMeta.builder().name("demo.ghost").build(), known))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("工具不存在");
    }

    @Test
    @DisplayName("校验：超长描述被拒绝，避免把提示词撑爆")
    void shouldRejectTooLongDescription() {
        Set<String> known = Set.of("demo.query", "demo.other");
        String tooLong = "x".repeat(1001);

        assertThatThrownBy(() -> service.save(
                AgentToolMeta.builder().name("demo.query").description(tooLong).build(), known))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("不能超过");
    }
}
