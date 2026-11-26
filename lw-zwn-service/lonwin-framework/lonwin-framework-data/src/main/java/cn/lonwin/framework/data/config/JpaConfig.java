package cn.lonwin.framework.data.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * JPA配置
 * 支持达梦数据库
 */
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
    basePackages = "cn.lonwin.**.repository",
    entityManagerFactoryRef = "entityManagerFactory",
    transactionManagerRef = "transactionManager"
)
public class JpaConfig {
    
    // JPA 的详细配置在 application-{profile}.yml 中
    // 包括：ddl-auto、dialect、show-sql 等
    
}