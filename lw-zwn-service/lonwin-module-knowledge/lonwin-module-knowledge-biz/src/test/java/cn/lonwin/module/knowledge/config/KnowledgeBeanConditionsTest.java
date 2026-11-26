package cn.lonwin.module.knowledge.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.module.knowledge.api.KnowledgeGateway;

/**
 * 条件装配契约：容器里有且只有一个 KnowledgeGateway；
 * 关闭知识通道时一个都没有，但配置 Bean 仍在（上传入库不受 knowledge.enabled 影响）。
 */
class KnowledgeBeanConditionsTest {

    private static ApplicationContextRunner runner() {
        return new ApplicationContextRunner()
                .withBean(ObjectMapper.class, ObjectMapper::new)
                .withUserConfiguration(KnowledgePropertiesConfiguration.class,
                        KnowledgeConfiguration.class);
    }

    @Test
    @DisplayName("默认 mode=local：注册唯一一个本地网关")
    void defaultModeRegistersLocalGateway() {
        runner().run(ctx -> {
            assertThat(ctx).hasNotFailed();
            assertThat(ctx).hasSingleBean(KnowledgeGateway.class);
            assertThat(ctx.getBean(KnowledgeGateway.class).getClass().getSimpleName())
                    .isEqualTo("LocalKnowledgeGateway");
        });
    }

    @Test
    @DisplayName("历史 mode=legacy 配置被忽略：实现唯一，仍注册本地网关")
    void legacyModeIsIgnoredAndStillRegistersLocalGateway() {
        runner().withPropertyValues("lonwin.agent.knowledge.mode=legacy").run(ctx -> {
            assertThat(ctx).hasNotFailed();
            assertThat(ctx).hasSingleBean(KnowledgeGateway.class);
            assertThat(ctx.getBean(KnowledgeGateway.class).getClass().getSimpleName())
                    .isEqualTo("LocalKnowledgeGateway");
        });
    }

    @Test
    @DisplayName("knowledge.enabled=false：不注册网关，但配置 Bean 仍在，上传入库不受影响")
    void disabledChannelStillBindsProperties() {
        runner().withPropertyValues("lonwin.agent.knowledge.enabled=false").run(ctx -> {
            assertThat(ctx).hasNotFailed();
            assertThat(ctx).doesNotHaveBean(KnowledgeGateway.class);
            assertThat(ctx).hasSingleBean(KnowledgeProperties.class);
        });
    }

    @Test
    @DisplayName("storage / retrieval 子段能从 yml 绑定，且存储开关可独立于检索")
    void nestedPropertiesBind() {
        runner().withPropertyValues(
                "lonwin.agent.knowledge.storage.enabled=true",
                "lonwin.agent.knowledge.storage.source-prefix=docFiles/custom",
                "lonwin.agent.knowledge.storage.max-batch-size=12",
                "lonwin.agent.knowledge.retrieval.fold-by-group=true").run(ctx -> {
            KnowledgeProperties p = ctx.getBean(KnowledgeProperties.class);
            assertThat(p.getStorage().getSourcePrefix()).isEqualTo("docFiles/custom");
            assertThat(p.getStorage().getMaxBatchSize()).isEqualTo(12);
            assertThat(p.getRetrieval().isFoldByGroup()).isTrue();
        });
    }
}
