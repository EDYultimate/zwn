package cn.lonwin.module.knowledge.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 配置绑定入口（<b>无条件注册</b>）。
 *
 * <p>刻意与 {@link KnowledgeConfiguration} 分开：检索网关受
 * {@code lonwin.agent.knowledge.enabled} 控制，但上传入库与 MinIO 存储不受该开关影响——
 * 「所有上传文件都要保存到 MinIO」是硬要求，即使知识检索整条链路被关掉，
 * 文件也仍然能上传、能落对象存储、能写元数据表。
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(KnowledgeProperties.class)
public class KnowledgePropertiesConfiguration {
}
