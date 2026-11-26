package cn.lonwin.module.knowledge.index;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.module.knowledge.config.KnowledgeProperties;
import cn.lonwin.module.knowledge.mapper.KnowledgeDocMapper;
import cn.lonwin.module.knowledge.mapper.KnowledgeFileMapper;
import cn.lonwin.module.knowledge.storage.KnowledgeFileStore;

/**
 * 容器装配契约：单测里直接 new 的写法覆盖不到 Spring 的构造器选择，
 * 这里专门守住「多个构造器时仍能启动上下文」。
 */
class KnowledgeIndexServiceWiringTest {

    @Test
    @DisplayName("多个构造器时 Spring 仍按 @Autowired 构造器完成注入")
    void springInstantiatesViaAutowiredConstructor() {
        new ApplicationContextRunner()
                .withBean(ObjectMapper.class, ObjectMapper::new)
                .withBean(KnowledgeProperties.class, KnowledgeProperties::new)
                .withBean(KnowledgeFileStore.class, () -> mock(KnowledgeFileStore.class))
                .withBean(KnowledgeFileMapper.class, () -> mock(KnowledgeFileMapper.class))
                .withBean(KnowledgeDocMapper.class, () -> mock(KnowledgeDocMapper.class))
                .withUserConfiguration(KnowledgeIndexService.class)
                .run(ctx -> {
                    assertThat(ctx).hasNotFailed();
                    assertThat(ctx).hasSingleBean(KnowledgeIndexService.class);
                });
    }
}
