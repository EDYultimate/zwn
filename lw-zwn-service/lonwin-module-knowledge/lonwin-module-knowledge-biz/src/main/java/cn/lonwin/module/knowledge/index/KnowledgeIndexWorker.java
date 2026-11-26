package cn.lonwin.module.knowledge.index;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 定时兜底：只扫描达梦里 {@code PENDING / FAILED} 的记录，调用与主路径
 * 完全相同的 {@code KnowledgeIndexService.index(fileId)} 补写 Qdrant。
 *
 * <p><b>它不是主路径</b>：上传成功后立即投递异步任务，正常情况下扫描结果为空。
 * 它只负责补偿进程重启、线程池拒绝、BGE-M3 / Qdrant 临时不可用丢掉的任务。
 * 通过 {@code index.scan-enabled=false} 可整体关闭，不影响上传即入库。
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "lonwin.agent.knowledge.index", name = "scan-enabled",
        havingValue = "true", matchIfMissing = true)
public class KnowledgeIndexWorker {

    private final KnowledgeIndexService indexService;

//    暂时取消定时刷新 todo
//    @Scheduled(fixedDelayString = "${lonwin.agent.knowledge.index.scan-interval-ms:30000}")
    public void scan() {
        try {
            int done = indexService.scanPending();
            if (done > 0) {
                log.info("[kb-index] 定时兜底补写 {} 个文件的索引", done);
            }
        } catch (Exception e) {
            // 定时任务抛异常会中断后续调度，这里必须吞掉并留日志
            log.warn("[kb-index] 定时兜底扫描异常：{}", e.getMessage());
        }
    }
}
