package cn.lonwin.module.knowledge.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.common.core.utils.UUIDUtils;
import cn.lonwin.module.knowledge.config.KnowledgeProperties;
import cn.lonwin.module.knowledge.entity.KnowledgeDocEntity;
import cn.lonwin.module.knowledge.entity.KnowledgeFileEntity;
import cn.lonwin.module.knowledge.index.KnowledgeIndexService;
import cn.lonwin.module.knowledge.mapper.KnowledgeDocMapper;
import cn.lonwin.module.knowledge.mapper.KnowledgeFileMapper;
import cn.lonwin.module.knowledge.storage.KnowledgeFileStore;
import cn.lonwin.module.knowledge.storage.KnowledgeStorageKeys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 上传入库编排（阶段 0/1）。
 *
 * <p><b>顺序是刻意定的</b>：先无条件写 MinIO，再写达梦元数据。
 * 任何后续步骤（查重、建表缺失、解析未实现）失败都不会让「文件已保存」这个事实回滚，
 * 这是对「所有上传文件都要保存到 MinIO，不管是否同名」的直接保证。
 *
 * <p><b>上传即入库</b>：文件落 MinIO 之后立即触发 {@code KnowledgeIndexService}，
 * 按 Word/PDF/Excel 解析 → 切片 → BGE-M3 批量编码 → Qdrant upsert → 回填状态。
 * 默认异步（不占 HTTP 上传线程），{@code index.sync=true} 时同步完成；
 * 索引失败只标 FAILED 并留 ERROR_MSG，绝不回滚或删除已上传的 MinIO 对象。
 *
 * <h3>去重决策（只影响是否切片，不影响是否存文件）</h3>
 * <ul>
 *   <li>{@code fileHash} 已存在 → ATTACHMENT，标 IS_DUPLICATE=1，阶段 2 跳过重复切片；</li>
 *   <li>同 {@code groupId} 但 hash 不同 → INDEPENDENT，一律独立逻辑文档。
 *       这是用户拍板的「同名但内容差异大的 Excel 一律独立文档」的保守落地：
 *       阶段 1 没有文本可比，无法证明内容几乎一致时宁可各存各的、各建各的文档，
 *       绝不按文件名硬合并；阶段 2 有 textHash/SimHash 后再做更细的内容级判定。</li>
 *   <li>其它 → CANONICAL。</li>
 * </ul>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KnowledgeUploadService {

    private static final String WARN_NO_TABLE =
            "文件已成功写入 MinIO，但元数据表未写入，请先执行 sql/knowledge_schema.sql 建表";

    private final KnowledgeFileStore fileStore;
    private final KnowledgeFileMapper fileMapper;
    private final KnowledgeDocMapper docMapper;
    private final KnowledgeProperties properties;

    /**
     * 索引服务用可选字段注入：单元测试直接 new 本类时保持 null（只验证存储行为），
     * Spring 容器里必定存在，上传成功后由它把文件写进 Qdrant。
     */
    @Autowired(required = false)
    private KnowledgeIndexService indexService;

    /**
     * 兼容旧调用（不带文档类型）：仅供模块内单测与历史代码使用。
     * 对外 HTTP 入口一律走三参重载，{@code typeId} 由 Controller 强制校验。
     */
    public KnowledgeUploadVO upload(MultipartFile file, String bizDir) {
        return upload(file, bizDir, null);
    }

    /** 单文件上传：MinIO 写入失败直接抛异常；元数据写入失败降级为 warning */
    public KnowledgeUploadVO upload(MultipartFile file, String bizDir, String typeId) {
        ensureEnabled();
        return doUpload(file, bizDir, typeId);
    }

    /** 兼容旧调用（不带文档类型） */
    public List<KnowledgeUploadVO> uploadBatch(List<MultipartFile> files, String bizDir) {
        return uploadBatch(files, bizDir, null);
    }

    /** 批量上传：逐个处理，一个文件失败不影响其它文件继续入库 */
    public List<KnowledgeUploadVO> uploadBatch(List<MultipartFile> files, String bizDir, String typeId) {
        ensureEnabled();
        if (files == null || files.isEmpty()) {
            return List.of();
        }
        int max = Math.max(1, properties.getStorage().getMaxBatchSize());
        if (files.size() > max) {
            throw new BusinessException(400, "单次最多上传 " + max + " 个文件，本次 " + files.size() + " 个");
        }
        List<KnowledgeUploadVO> result = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                result.add(doUpload(file, bizDir, typeId));
            } catch (Exception e) {
                log.error("[kb-upload] 文件 {} 入库失败：{}",
                        file == null ? "null" : file.getOriginalFilename(), e.getMessage(), e);
                result.add(KnowledgeUploadVO.builder()
                        .fileName(file == null ? null : file.getOriginalFilename())
                        .error("入库失败：" + e.getMessage())
                        .build());
            }
        }
        return result;
    }

    private KnowledgeUploadVO doUpload(MultipartFile file, String bizDir, String typeId) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(400, "上传文件为空");
        }
        String original = file.getOriginalFilename();
        String safeName = KnowledgeStorageKeys.safeFileName(original);
        String docId = UUIDUtils.generateUUID();
        String fileId = UUIDUtils.generateUUID();
        String groupId = KnowledgeStorageKeys.groupKey(safeName, bizDir);
        String sourceType = KnowledgeStorageKeys.sourceType(safeName);

        // ① 无条件写 MinIO —— 同名、同 hash 也写，key 里带 fileId 保证不覆盖
        KnowledgeFileStore.StoredObject stored = fileStore.store(file, docId, fileId);

        // ② 只做标记，不跳过任何已发生的写入
        boolean sameHashExists = existsByHash(stored.fileHash());
        boolean sameGroupDifferentHash = !sameHashExists && existsByGroup(groupId);
        String decision = sameHashExists ? "ATTACHMENT"
                : (sameGroupDifferentHash ? "INDEPENDENT" : "CANONICAL");
        int isDuplicate = sameHashExists ? 1 : 0;
        String parseStatus = sameHashExists ? "SKIPPED_DUP" : "PENDING";

        // ③ 元数据落库（失败不影响 ①）
        boolean metaPersisted = persist(fileId, docId, groupId, typeId, safeName, sourceType,
                stored, isDuplicate, decision, parseStatus);

        // ④ 上传即触发索引：默认异步（不占 HTTP 线程），index.sync=true 时同步完成
        String indexMode = triggerIndex(fileId, parseStatus, metaPersisted);

        return KnowledgeUploadVO.builder()
                .fileId(fileId)
                .docId(docId)
                .typeId(typeId)
                .groupId(groupId)
                .fileName(safeName)
                .sourceType(sourceType)
                .fileHash(stored.fileHash())
                .size(stored.size())
                .bucket(stored.bucket())
                .objectKey(stored.objectKey())
                .viewPath(stored.viewPath())
                .resourceUrl(KnowledgeStorageKeys.resourceUrl(stored.objectKey()))
                .isDuplicate(isDuplicate)
                .dedupDecision(decision)
                .parseStatus(parseStatus)
                .indexed(0)
                .indexMode(indexMode)
                .metaPersisted(metaPersisted)
                .warning(metaPersisted ? null : WARN_NO_TABLE)
                .build();
    }

    /**
     * 上传成功即触发 Qdrant 写入。返回模式串仅供接口回显与验收，
     * 任何异常都不影响「文件已写入 MinIO」这个事实。
     */
    private String triggerIndex(String fileId, String parseStatus, boolean metaPersisted) {
        if (indexService == null || !properties.getIndex().isEnabled()) {
            return "disabled";
        }
        if ("SKIPPED_DUP".equals(parseStatus)) {
            return "skipped-duplicate";
        }
        if (!metaPersisted) {
            // 没有元数据行，索引任务与定时兜底都查不到；明确提示先建表
            return "meta-missing";
        }
        try {
            if (properties.getIndex().isSync()) {
                indexService.index(fileId);
                return "sync";
            }
            indexService.indexAsync(fileId);
            return "async";
        } catch (Exception e) {
            log.warn("[kb-upload] 索引触发失败（文件已存 MinIO，可由定时兜底补写）fileId={}: {}",
                    fileId, e.getMessage());
            return "trigger-failed";
        }
    }

    private boolean persist(String fileId, String docId, String groupId, String typeId, String fileName,
                            String sourceType, KnowledgeFileStore.StoredObject stored,
                            int isDuplicate, String decision, String parseStatus) {
        try {
            KnowledgeDocEntity doc = new KnowledgeDocEntity();
            doc.setDocId(docId);
            doc.setTypeId(typeId);
            doc.setGroupId(groupId);
            doc.setTitle(stripExt(fileName));
            doc.setCanonicalFileId(decision.equals("ATTACHMENT") ? null : fileId);
            doc.setSourceType(sourceType);
            doc.setVariant("INDEPENDENT".equals(decision) ? groupId : null);
            doc.setVersion(1);
            doc.setStatus("RECEIVED");
            doc.setIndexed(0);
            doc.setChunkCount(0);
            doc.setQdrantCollection(properties.getCollectionChunks());

            KnowledgeFileEntity entity = new KnowledgeFileEntity();
            entity.setFileId(fileId);
            entity.setDocId(docId);
            entity.setGroupId(groupId);
            entity.setFileName(fileName);
            entity.setFileExt(KnowledgeStorageKeys.ext(fileName));
            entity.setFileSize(stored.size());
            entity.setContentType(stored.contentType());
            entity.setFileHash(stored.fileHash());
            entity.setBucket(stored.bucket());
            entity.setObjectKey(stored.objectKey());
            entity.setSourceType(sourceType);
            entity.setIsDuplicate(isDuplicate);
            entity.setDedupDecision(decision);
            entity.setCanonicalFileId(decision.equals("ATTACHMENT") ? null : fileId);
            entity.setParseStatus(parseStatus);
            entity.setIndexed(0);
            entity.setChunkCount(0);

            docMapper.insert(doc);
            fileMapper.insert(entity);
            return true;
        } catch (Exception e) {
            // 文件已经安全躺在 MinIO 里，这里只告警，不回滚、不抛给调用方
            log.warn("[kb-upload] {} objectKey={}", WARN_NO_TABLE, stored.objectKey(), e);
            return false;
        }
    }

    private boolean existsByHash(String hash) {
        try {
            return fileMapper.selectCount(new QueryWrapper<KnowledgeFileEntity>()
                    .eq("FILE_HASH", hash)) > 0;
        } catch (Exception e) {
            log.warn("[kb-upload] 查询 FILE_HASH 失败，按「不重复」继续：{}", e.getMessage());
            return false;
        }
    }

    private boolean existsByGroup(String groupId) {
        try {
            return fileMapper.selectCount(new QueryWrapper<KnowledgeFileEntity>()
                    .eq("GROUP_ID", groupId)) > 0;
        } catch (Exception e) {
            log.warn("[kb-upload] 查询 GROUP_ID 失败，按「无同组」继续：{}", e.getMessage());
            return false;
        }
    }

    private void ensureEnabled() {
        if (!properties.getStorage().isEnabled()) {
            throw new BusinessException(403, "知识库上传入口已关闭（lonwin.agent.knowledge.storage.enabled=false）");
        }
    }

    private static String stripExt(String fileName) {
        int dot = fileName == null ? -1 : fileName.lastIndexOf('.');
        return dot > 0 ? fileName.substring(0, dot) : fileName;
    }
}
