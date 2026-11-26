package cn.lonwin.module.agent.config;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.bind.Bindable;
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.boot.context.properties.source.MapConfigurationPropertySource;

/**
 * 双通道开关与编排配置的绑定测试。
 *
 * <p>知识侧的 Qdrant / BGE-M3 / MinIO 连接参数已全部迁到
 * {@code lonwin-module-knowledge} 的 {@code KnowledgeProperties}；
 * agent 这里只保留「是否读、读多少、失败怎么降级」四个编排字段。
 */
class AgentPropertiesBindingTest {

    private static AgentProperties bind(Map<String, Object> values) {
        return new Binder(new MapConfigurationPropertySource(values))
                .bind("lonwin.agent", Bindable.of(AgentProperties.class))
                .orElseGet(AgentProperties::new);
    }

    @Test
    @DisplayName("默认值：工具侧开、知识侧开、工具侧权限关")
    void defaultsAreFusionWithPermissionOff() {
        AgentProperties properties = new AgentProperties();

        assertThat(properties.getTools().isEnabled()).isTrue();
        assertThat(properties.getKnowledge().isEnabled()).isTrue();
        assertThat(properties.getTools().getPermission().isEnabled()).isFalse();
        assertThat(properties.getKnowledge().isDegradeOnError()).isTrue();
        assertThat(properties.getKnowledge().getTopK()).isEqualTo(8);
        assertThat(properties.getKnowledge().getMaxTextChars()).isEqualTo(900);
    }

    @Test
    @DisplayName("只有工具侧接口：knowledge.enabled=false 且 permission.enabled=false")
    void toolsOnlyConfiguration() {
        Map<String, Object> values = new HashMap<>();
        values.put("lonwin.agent.tools.enabled", true);
        values.put("lonwin.agent.tools.permission.enabled", false);
        values.put("lonwin.agent.knowledge.enabled", false);

        AgentProperties properties = bind(values);

        assertThat(properties.getTools().isEnabled()).isTrue();
        assertThat(properties.getTools().getPermission().isEnabled()).isFalse();
        assertThat(properties.getKnowledge().isEnabled()).isFalse();
        // 关通道不影响编排参数仍然可读，避免编排层出现空指针
        assertThat(properties.getKnowledge().getTopK()).isEqualTo(8);
    }

    @Test
    @DisplayName("kebab-case 配置能绑定编排参数，未配置的项保持默认")
    void orchestrationKeysBindFromYamlStyleNames() {
        Map<String, Object> values = new HashMap<>();
        values.put("lonwin.agent.knowledge.top-k", 8);
        values.put("lonwin.agent.knowledge.max-text-chars", 900);
        values.put("lonwin.agent.knowledge.degrade-on-error", false);

        AgentProperties.Knowledge knowledge = bind(values).getKnowledge();

        assertThat(knowledge.getTopK()).isEqualTo(8);
        assertThat(knowledge.getMaxTextChars()).isEqualTo(900);
        assertThat(knowledge.isDegradeOnError()).isFalse();
        assertThat(knowledge.isEnabled()).isTrue();
    }

    @Test
    @DisplayName("打开权限开关：仍走同一组配置对象，不影响知识侧开关")
    void permissionSwitchIsIndependent() {
        Map<String, Object> values = new HashMap<>();
        values.put("lonwin.agent.tools.permission.enabled", true);
        values.put("lonwin.agent.knowledge.enabled", true);

        AgentProperties properties = bind(values);

        assertThat(properties.getTools().getPermission().isEnabled()).isTrue();
        assertThat(properties.getKnowledge().isEnabled()).isTrue();
    }

    @Test
    @DisplayName("模块边界：agent 不再持有任何向量库 / 推理服务连接配置")
    void knowledgePropertiesCarryNoConnectionSettings() {
        String[] methods = Arrays.stream(AgentProperties.Knowledge.class.getDeclaredMethods())
                .map(m -> m.getName()).toArray(String[]::new);

        assertThat(methods).doesNotContain("getQdrantUrl", "getEmbedUrl", "getCollectionChunks",
                "getDenseVector", "getSparseVector", "getQdrantApiKey", "getEmbedderId");
    }
}
