package cn.lonwin.module.agent.tool;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.module.agent.annotation.AgentTool;
import cn.lonwin.module.agent.annotation.AgentToolAction;
import cn.lonwin.module.agent.annotation.AgentToolParam;
import cn.lonwin.module.agent.datascope.DataScopeContext;
import cn.lonwin.module.agent.spi.AgentToolResult;

/**
 * 工具框架核心链路测试：注解解析 → Schema 生成 → 参数绑定/校验 → 反射执行 → 按钮注入。
 *
 * <p>这些用例覆盖的是「加工具时最容易写错的地方」，不依赖 Spring 容器与数据库。
 */
class AgentToolInvokerTest {

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();
    private final AgentToolSchemaRenderer schemaRenderer = new AgentToolSchemaRenderer();
    private final AgentToolInvoker invoker = new AgentToolInvoker(objectMapper);
    private final AgentToolDefinitionFactory factory = new AgentToolDefinitionFactory(invoker, schemaRenderer);

    // ==================== 测试用契约与实现 ====================

    interface DemoApi {

        @AgentTool(name = "demo.query", title = "演示查询", unitScoped = true,
                description = "按年份查询演示数据")
        @AgentToolAction(label = "查看明细", route = "/demo/detail", queryParams = {"year"})
        AgentToolResult query(@AgentToolParam(description = "年份，可省略", example = "2026", min = 2000, max = 2100)
                Integer year);

        @AgentTool(name = "demo.month", title = "按月查询", unitScoped = false,
                description = "按月查询演示数据")
        AgentToolResult byMonth(@AgentToolParam(description = "月份", required = true, min = 1, max = 12) Integer month,
                @AgentToolParam(description = "数据类型", enums = {"water", "rain"}) String type);
    }

    /** 模拟真实实现的写法：单位不在参数里，需要时从数据权限上下文取 */
    static class DemoApiImpl implements DemoApi {

        @Override
        public AgentToolResult query(Integer year) {
            return AgentToolResult.ok(Map.of(
                    "year", year == null ? 0 : year,
                    "unitCode", String.valueOf(DataScopeContext.unitCode())), null);
        }

        @Override
        public AgentToolResult byMonth(Integer month, String type) {
            return AgentToolResult.ok(Map.of("month", month, "type", type), null);
        }
    }

    private AgentToolDefinition definition(String name) {
        return factory.build(DemoApi.class, new DemoApiImpl()).stream()
                .filter(d -> d.getName().equals(name))
                .findFirst()
                .orElseThrow();
    }

    // ==================== 用例 ====================

    @Test
    @DisplayName("启动期解析：生成结构化 Schema 与提示词片段")
    @SuppressWarnings("unchecked")
    void shouldBuildSchemaAndPrompt() {
        AgentToolDefinition def = definition("demo.query");

        assertThat(def.getParams()).hasSize(1);
        Map<String, Object> schema = def.getParamSchema();
        assertThat(schema).containsEntry("type", "object").containsKey("properties");
        Map<String, Object> year = (Map<String, Object>) ((Map<String, Object>) schema.get("properties")).get("year");
        assertThat(year)
                .containsEntry("type", "integer")
                .containsEntry("minimum", 2000.0)
                .containsEntry("maximum", 2100.0);
        assertThat(def.toPromptText())
                .contains("demo.query").contains("演示查询").contains("按本单位数据");
        assertThat(def.getActions()).hasSize(1);
    }

    @Test
    @DisplayName("签名简化：工具方法只声明业务参数，不再出现 unitCode / 上下文参数")
    @SuppressWarnings("unchecked")
    void shouldNotExposePermissionParamsInSignature() {
        AgentToolDefinition def = definition("demo.query");

        assertThat(def.getParams()).extracting(AgentToolDefinition.Param::name).containsExactly("year");
        assertThat((Map<String, Object>) def.getParamSchema().get("properties"))
                .doesNotContainKey("unitCode");
    }

    @Test
    @DisplayName("执行：数据权限生效时单位由切面上下文提供，并透传到跳转按钮 query")
    void shouldReadUnitFromDataScopeContext() {
        AgentToolDefinition def = definition("demo.query");

        AgentToolResult result = DataScopeContext.runWith(
                DataScopeContext.of("1001", "U001"),
                () -> def.execute(null, Map.of("year", "2025")));

        assertThat(result.isSuccess()).isTrue();
        assertThat(result.getData()).containsEntry("year", 2025).containsEntry("unitCode", "U001");
        assertThat(result.getActions()).hasSize(1);
        assertThat(result.getActions().get(0).getRoutePath()).isEqualTo("/demo/detail");
        assertThat(result.getActions().get(0).getQuery())
                .containsEntry("year", "2025")
                .containsEntry("unitCode", "U001");
    }

    @Test
    @DisplayName("执行：数据权限关闭时单位为空，按钮 query 里也不出现 unitCode")
    void shouldNotInjectUnitWhenScopeDisabled() {
        AgentToolResult result = definition("demo.query").execute(null, Map.of("year", "2025"));

        assertThat(result.getData()).containsEntry("unitCode", "null");
        assertThat(result.getActions().get(0).getQuery()).doesNotContainKey("unitCode");
    }

    @Test
    @DisplayName("执行：可选参数缺省时不报错")
    void shouldAllowOptionalParamAbsent() {
        AgentToolResult result = definition("demo.query").execute(null, Map.of());

        assertThat(result.isSuccess()).isTrue();
        assertThat(result.getData()).containsEntry("year", 0);
    }

    @Test
    @DisplayName("校验：必填缺失 / 数值越界 / 枚举不合法 都返回可读错误")
    void shouldRejectInvalidParams() {
        AgentToolDefinition def = definition("demo.month");

        AgentToolResult missing = def.execute(null, Map.of("type", "water"));
        assertThat(missing.isSuccess()).isFalse();
        assertThat(missing.getErrorMessage()).contains("缺少必填参数 month");

        AgentToolResult outOfRange = def.execute(null, Map.of("month", 13, "type", "water"));
        assertThat(outOfRange.isSuccess()).isFalse();
        assertThat(outOfRange.getErrorMessage()).contains("month").contains("不能大于 12");

        AgentToolResult badEnum = def.execute(null, Map.of("month", 3, "type", "unknown"));
        assertThat(badEnum.isSuccess()).isFalse();
        assertThat(badEnum.getErrorMessage()).contains("只能取以下值之一");
    }
}
