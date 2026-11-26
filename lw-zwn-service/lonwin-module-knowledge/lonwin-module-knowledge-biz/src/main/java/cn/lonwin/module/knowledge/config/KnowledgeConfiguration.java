package cn.lonwin.module.knowledge.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.module.knowledge.api.KnowledgeGateway;
import cn.lonwin.module.knowledge.retrieve.BgeM3Client;
import cn.lonwin.module.knowledge.retrieve.LocalKnowledgeGateway;
import cn.lonwin.module.knowledge.retrieve.QdrantClient;

/**
 * 知识检索网关装配：{@code lonwin.agent.knowledge.enabled=true}（默认）时
 * 容器里有且只有一个 {@link KnowledgeGateway}。
 *
 * <p><b>模块边界</b>：知识库侧的检索、入库、BGE-M3 交互、MinIO 读写全部由本模块实现，
 * agent 只依赖 {@code lonwin-module-knowledge-api} 的纯契约读取命中片段。
 * 旧的 {@code mode=legacy} 回退实现已从 agent 移除，实现唯一，避免两套代码分叉。
 *
 * <p>客户端用构造方法手工 new，不单独暴露成 Bean，方便单元测试直接替换成 mock，
 * 也避免与外部同名的客户端类型冲突。
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnProperty(prefix = "lonwin.agent.knowledge", name = "enabled",
        havingValue = "true", matchIfMissing = true)
public class KnowledgeConfiguration {

    @Bean
    public KnowledgeGateway localKnowledgeGateway(ObjectMapper objectMapper,
                                                  KnowledgeProperties properties) {
        BgeM3Client bge = new BgeM3Client(properties, objectMapper);
        QdrantClient qdrant = new QdrantClient(properties, objectMapper);
        return new LocalKnowledgeGateway(bge, qdrant, properties);
    }
}
