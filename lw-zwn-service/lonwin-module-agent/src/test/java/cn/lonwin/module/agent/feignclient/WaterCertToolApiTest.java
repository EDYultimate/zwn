package cn.lonwin.module.agent.feignclient;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Modifier;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.module.agent.annotation.AgentTool;
import cn.lonwin.module.agent.annotation.AgentToolContract;
import cn.lonwin.module.agent.tool.AgentToolDefinition;
import cn.lonwin.module.agent.tool.AgentToolDefinitionFactory;
import cn.lonwin.module.agent.tool.AgentToolInvoker;
import cn.lonwin.module.agent.tool.AgentToolSchemaRenderer;

/**
 * 证照 / 行政区划能力清单的启动期校验。
 *
 * <p>这份清单最容易出错的地方不是业务逻辑，而是注解写漏（缺描述 / 缺参数说明 / 工具重名）——
 * 这些错误只有到应用启动才会 fail-fast，那时排查成本已经很高。这里用单测提前挡一遍，
 * 同时把「清单里到底有哪些能力」固化成可读的断言。
 *
 * <p>统计能力已收敛为通用聚合工具 {@code agent.result.stat}（见基础契约），
 * 证照契约只保留 list / detail / save / delete 四个工具。
 */
class WaterCertToolApiTest {

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();
    private final AgentToolDefinitionFactory factory = new AgentToolDefinitionFactory(
            new AgentToolInvoker(objectMapper), new AgentToolSchemaRenderer());

    /** 只解析注解元数据，不执行任何方法：实现 Bean 传 null 即可 */
    private List<AgentToolDefinition> definitions(Class<?> contract) {
        return factory.build(contract, null);
    }

    private Set<String> names(Class<?> contract) {
        return definitions(contract).stream()
                .map(AgentToolDefinition::getName)
                .collect(Collectors.toSet());
    }

    @Test
    @DisplayName("证照清单：取水许可收敛为 4 个工具（统计走通用聚合），行政区已独立为公共契约")
    void shouldExposeExpectedCertToolNames() {
        assertThat(names(WaterCertToolApi.class)).containsExactlyInAnyOrder(
                "water.cert.list", "water.cert.detail", "water.cert.save", "water.cert.delete");
    }

    @Test
    @DisplayName("行政区划清单：5 个公共工具，和取水证契约不重名")
    void shouldExposeExpectedRegionToolNames() {
        assertThat(names(GeoRegionToolApi.class)).containsExactlyInAnyOrder(
                "geo.region.list", "geo.region.detail", "geo.region.translate",
                "geo.region.save", "geo.region.delete");
    }

    @Test
    @DisplayName("行政区划已限定为 geo-region 模块：仅通用问答可见，不再混入指定智能体（如 water-cert）")
    void regionToolsShouldNotLeakIntoModuleSessions() {
        List<AgentToolDefinition> regions = definitions(GeoRegionToolApi.class);
        assertThat(regions).isNotEmpty();
        for (AgentToolDefinition definition : regions) {
            assertThat(definition.getModule())
                    .as(definition.getName() + " 必须声明 module=geo-region，从指定智能体中排除")
                    .isEqualTo("geo-region");
        }
        // 与取水证模块不一致：water-cert 智能体的工具清单里不能出现 geo.region.*
        assertThat(regions).allMatch(definition -> !"water-cert".equals(definition.getModule()));
    }

    @Test
    @DisplayName("每个工具都有说明、参数 Schema 与返回字段声明，写操作显式标注 readOnly=false")
    void shouldCarryCompleteMetadata() {
        for (Class<?> contract : List.of(WaterCertToolApi.class, GeoRegionToolApi.class)) {
            for (AgentToolDefinition definition : definitions(contract)) {
                assertThat(definition.getTitle()).as(definition.getName()).isNotBlank();
                assertThat(definition.getDescription()).as(definition.getName()).isNotBlank();
                assertThat(definition.getParams()).as(definition.getName()).isNotEmpty();
                assertThat(definition.getParamSchema())
                        .as(definition.getName())
                        .containsEntry("type", "object")
                        .containsKey("properties");
                assertThat(definition.getReturns()).as(definition.getName()).isNotEmpty();
            }
        }

        Set<String> writable = definitions(WaterCertToolApi.class).stream()
                .filter(definition -> !definition.isReadOnly())
                .map(AgentToolDefinition::getName)
                .collect(Collectors.toSet());
        assertThat(writable).containsExactlyInAnyOrder("water.cert.save", "water.cert.delete");

        Set<String> writableRegions = definitions(GeoRegionToolApi.class).stream()
                .filter(definition -> !definition.isReadOnly())
                .map(AgentToolDefinition::getName)
                .collect(Collectors.toSet());
        assertThat(writableRegions).containsExactlyInAnyOrder("geo.region.save", "geo.region.delete");
    }

    @Test
    @DisplayName("OpenAI 工具渲染：type=function，name/description/parameters 齐全，返回字段拼进 description")
    @SuppressWarnings("unchecked")
    void shouldRenderOpenAiToolEntries() {
        AgentToolDefinition list = definitions(WaterCertToolApi.class).stream()
                .filter(definition -> "water.cert.list".equals(definition.getName()))
                .findFirst()
                .orElseThrow();
        Map<String, Object> entry = list.toOpenAiTool();
        assertThat(entry.get("type")).isEqualTo("function");
        Map<String, Object> function = (Map<String, Object>) entry.get("function");
        assertThat(function.get("name")).isEqualTo("water.cert.list");
        assertThat((String) function.get("description"))
                .contains("取水许可证")
                .contains("wpcCd")
                .contains("许可水量");
        Map<String, Object> parameters = (Map<String, Object>) function.get("parameters");
        assertThat(parameters).containsEntry("type", "object").containsKey("properties");
        assertThat((List<String>) parameters.get("required")).isEmpty();
        assertThat((Map<String, Object>) parameters.get("properties")).containsKey("river");
    }

    @Test
    @DisplayName("与基础契约不重名：多契约共用一个 Bean 时不会触发「工具名重复」启动失败")
    void shouldNotCollideWithBaseContract() {
        Set<String> base = names(AgentToolApi.class);
        assertThat(base).doesNotContainAnyElementsOf(names(WaterCertToolApi.class));
        assertThat(base).doesNotContainAnyElementsOf(names(GeoRegionToolApi.class));
    }

    @Test
    @DisplayName("命名约定：每个 @AgentToolContract 都能在 feignclient.impl 下找到可实例化的实现类")
    void everyContractShouldHaveImpl() throws Exception {
        for (Class<?> contract : List.of(WaterCertToolApi.class, GeoRegionToolApi.class, AgentToolApi.class)) {
            assertThat(contract.isAnnotationPresent(AgentToolContract.class))
                    .as(contract.getSimpleName() + " 缺少 @AgentToolContract").isTrue();

            String implName = "cn.lonwin.module.agent.feignclient.impl."
                    + contract.getSimpleName() + "Impl";
            Class<?> impl = Class.forName(implName);
            assertThat(contract.isAssignableFrom(impl))
                    .as(implName + " 必须 implements " + contract.getSimpleName()).isTrue();
            assertThat(Modifier.isAbstract(impl.getModifiers())).isFalse();
            assertThat(impl.isInterface()).isFalse();
        }
    }

    @Test
    @DisplayName("契约方法都写了 @AgentTool，避免加了方法却忘记注册成能力")
    void everyMethodShouldBeDeclaredAsTool() {
        for (Class<?> contract : List.of(WaterCertToolApi.class, GeoRegionToolApi.class, AgentToolApi.class)) {
            long annotated = Arrays.stream(contract.getDeclaredMethods())
                    .filter(method -> method.isAnnotationPresent(AgentTool.class))
                    .count();
            assertThat(annotated).as(contract.getSimpleName()).isEqualTo(contract.getDeclaredMethods().length);
        }
    }
}
