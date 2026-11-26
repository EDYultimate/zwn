package cn.lonwin.module.knowledge.config;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/**
 * 索引专用线程池：与上传的 HTTP 线程、在线问答的检索线程隔离。
 *
 * <p>核心线程数刻意小（默认 2）：BGE-M3 是独立 Python 进程，Java 侧开更多并发
 * 只会让编码请求排队，反而拖慢在线问答的 query encode。
 */
@Configuration(proxyBeanMethods = false)
public class KnowledgeIndexConfiguration {

    @Bean("knowledgeIndexExecutor")
    public Executor knowledgeIndexExecutor(KnowledgeProperties properties) {
        KnowledgeProperties.Index cfg = properties.getIndex();
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(Math.max(1, cfg.getCorePoolSize()));
        executor.setMaxPoolSize(Math.max(1, cfg.getCorePoolSize()));
        executor.setQueueCapacity(Math.max(1, cfg.getQueueCapacity()));
        executor.setThreadNamePrefix("kb-index-");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);
        executor.initialize();
        return executor;
    }
}
