package cn.lonwin.module.knowledge.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.module.knowledge.config.KnowledgeProperties;
import cn.lonwin.module.knowledge.index.KnowledgeIndexService;
import cn.lonwin.module.knowledge.index.KnowledgeIndexService.IndexResult;
import lombok.RequiredArgsConstructor;

/**
 * 索引运维端点：手动补写、按文档重建、重试失败、删除向量、查看策略。
 *
 * <p>正常业务不需要调用这些接口 —— 上传成功后会自动触发索引；
 * 这里只用于验收、故障恢复与换模型后的重灌。
 */
@RestController
@RequestMapping("/knowledge/index")
@RequiredArgsConstructor
public class KnowledgeIndexController {

    private final KnowledgeIndexService indexService;
    private final KnowledgeProperties properties;

    /** 手动同步索引单个物理文件 */
    @PostMapping("/file/{fileId}")
    public Result<Map<String, Object>> index(@PathVariable String fileId) {
        return Result.success(toMap(indexService.index(fileId)));
    }

    /** 按逻辑文档重建：先删旧点再重新切片写入（确定性 ID 保证不重复） */
    @PostMapping("/doc/{docId}/reindex")
    public Result<Map<String, Object>> reindex(@PathVariable String docId) {
        return Result.success(toMap(indexService.reindex(docId)));
    }

    /** 立即扫描一次 PENDING / FAILED */
    @PostMapping("/retry-failed")
    public Result<Map<String, Object>> retryFailed() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("processed", indexService.scanPending());
        return Result.success(map);
    }

    /** 删除某逻辑文档在 Qdrant 里的点，文件本体仍保留在 MinIO */
    @DeleteMapping("/doc/{docId}")
    public Result<Map<String, Object>> delete(@PathVariable String docId) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("resetFiles", indexService.delete(docId));
        return Result.success(map);
    }

    /** 当前入库策略，便于运维确认同步/异步与批量参数 */
    @GetMapping("/config")
    public Result<Map<String, Object>> config() {
        KnowledgeProperties.Index cfg = properties.getIndex();
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("enabled", cfg.isEnabled());
        map.put("sync", cfg.isSync());
        map.put("batchSize", cfg.getBatchSize());
        map.put("chunkRange", cfg.getChunkMin() + "-" + cfg.getChunkMax());
        map.put("tableRowsPerPoint", cfg.getTableRowsPerPoint());
        map.put("contextHeader", cfg.isContextHeader());
        map.put("scanEnabled", cfg.isScanEnabled());
        map.put("scanIntervalMs", cfg.getScanIntervalMs());
        map.put("collectionChunks", properties.getCollectionChunks());
        map.put("collectionTables", properties.getCollectionTables());
        return Result.success(map);
    }

    private static Map<String, Object> toMap(IndexResult result) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("success", result.success());
        map.put("skipped", result.skipped());
        map.put("chunkCount", result.chunkCount());
        map.put("message", result.message());
        return map;
    }
}
