package cn.lonwin.module.knowledge.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.common.core.model.vo.PageResult;
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
 * 知识库文件的读 / 删 / 改名（上传走 {@link KnowledgeUploadService}）。
 *
 * <p>补齐知识库页面需要的只读与维护能力：
 * <ul>
 *   <li>{@link #list}：按文档类型（可空=全部）+ 关键字分页列出文件元数据，
 *       字段与上传返回体一致，前端列表可直接复用；</li>
 *   <li>{@link #stats}：知识库总量（文档数 / 文件数 / 已索引文件数）；</li>
 *   <li>{@link #rename}：只改展示名与文档标题，不动 MinIO 对象；</li>
 *   <li>{@link #delete}：删 MinIO 对象 + 达梦元数据；文档下最后一个文件删掉时
 *       连带删除逻辑文档，并尽力清掉 Qdrant 里的向量点。</li>
 * </ul>
 *
 * <p><b>依赖不可用时的取舍</b>：Qdrant / BGE-M3 未启动时向量点清理只记告警，
 * 元数据与对象照常删除，避免「向量服务挂了就删不掉文档」；
 * 对象存储删除失败则抛 500，防止出现「库里没了、对象还在」的静默不一致。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KnowledgeFileService {

    /** 列表默认返回条数 */
    private static final int DEFAULT_LIMIT = 200;
    /** 列表最大返回条数，防止一次拉全库 */
    private static final int MAX_LIMIT = 1000;
    /** 分页默认每页条数 */
    private static final int DEFAULT_PAGE_SIZE = 20;
    /** 分页最大每页条数 */
    private static final int MAX_PAGE_SIZE = 200;
    /** 达梦 IN 列表过大易触发解析限制，按批查询 */
    private static final int IN_BATCH = 500;
    private static final int FILE_NAME_MAX_LENGTH = 255;
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final KnowledgeFileMapper fileMapper;
    private final KnowledgeDocMapper docMapper;
    private final KnowledgeFileStore fileStore;
    private final KnowledgeProperties properties;

    /** 索引服务可选注入：向量清理失败不影响元数据维护 */
    @Autowired(required = false)
    private KnowledgeIndexService indexService;

    // ------------------------------------------------------------------ 查询

    /**
     * 按文档类型列出文件元数据，按入库时间倒序。
     *
     * @param typeId       文档类型 ID；为空表示全部类型
     * @param keyword      文件名 / 文档标题的模糊匹配（不区分大小写），可为空
     * @param limit        返回条数上限，默认 200，最大 1000
     * @param unclassified true 时只返回「未归类」历史数据（SYS_KNOWLEDGE_DOC.TYPE_ID 为空），
     *                     这些是类型树上线前的旧上传，左侧树没有节点可挂，只能单独查看 / 清理
     */
    public List<Map<String, Object>> list(String typeId, String keyword, Integer limit,
                                          boolean unclassified) {
        return query(typeId, keyword, unclassified, normalizeLimit(limit));
    }

    /**
     * 分页列出文件元数据（知识库列表表格使用），按入库时间倒序。
     *
     * <p>「类型」挂在文档表、「文件」挂在文件表，关键字还可能命中文档标题，
     * 因此先按与 {@link #list} 完全相同的规则过滤出全量行再切页，
     * 保证分页器上的总数与列表口径一致（不会出现「有总数却没数据」）。
     *
     * @param pageNumber   页码，从 1 开始，为空或小于 1 按 1 处理
     * @param pageSize     每页条数，默认 20，最大 200
     * @param unclassified true 时只查「未归类」历史数据（TYPE_ID 为空）
     */
    public PageResult<Map<String, Object>> page(String typeId, String keyword, Integer pageNumber,
                                               Integer pageSize, boolean unclassified) {
        int pageNum = normalizePageNumber(pageNumber);
        int size = normalizePageSize(pageSize);
        List<Map<String, Object>> rows = query(typeId, keyword, unclassified, Integer.MAX_VALUE);
        long total = rows.size();
        int from = (int) Math.min((long) (pageNum - 1) * size, total);
        int to = (int) Math.min((long) from + size, total);
        return PageResult.of(new ArrayList<>(rows.subList(from, to)), total);
    }

    /**
     * 按类型 / 关键字过滤出文件行。
     *
     * @param maxRows 返回行数上限，传 {@link Integer#MAX_VALUE} 表示不截断（分页需要全量算总数）
     */
    private List<Map<String, Object>> query(String typeId, String keyword, boolean unclassified,
                                            int maxRows) {
        Map<String, KnowledgeDocEntity> docs = unclassified ? selectUnclassifiedDocs() : selectDocs(typeId);
        if (docs.isEmpty()) {
            return new ArrayList<>();
        }
        List<KnowledgeFileEntity> files = selectFiles(docs.keySet());
        // 跨批次合并后统一按入库时间倒序，保证前端看到的顺序稳定
        files.sort(Comparator.comparing(KnowledgeFileEntity::getCreateTime,
                Comparator.nullsLast(Comparator.reverseOrder())));

        String kw = keyword == null ? "" : keyword.trim().toLowerCase();
        List<Map<String, Object>> rows = new ArrayList<>();
        for (KnowledgeFileEntity file : files) {
            KnowledgeDocEntity doc = docs.get(file.getDocId());
            if (!matches(file, doc, kw)) {
                continue;
            }
            rows.add(toMap(file, doc));
            if (rows.size() >= maxRows) {
                break;
            }
        }
        return rows;
    }

    /** 知识库总量统计：文档数 / 文件数 / 已索引文件数 / 未归类文档数 */
    public Map<String, Object> stats() {
        Map<String, Object> map = new LinkedHashMap<>();
        try {
            map.put("docs", docMapper.selectCount(null));
            map.put("files", fileMapper.selectCount(null));
            map.put("indexedFiles", fileMapper.selectCount(
                    new QueryWrapper<KnowledgeFileEntity>().eq("INDEXED", 1)));
            map.put("unclassified", docMapper.selectCount(unclassifiedWrapper()));
        } catch (Exception e) {
            throw new BusinessException(500,
                    "知识库元数据表不可用，请先执行 sql/knowledge_schema.sql 建表：" + e.getMessage());
        }
        map.put("indexEnabled", properties.getIndex().isEnabled());
        map.put("bucket", fileStore.resolveBucket());
        return map;
    }

    // ------------------------------------------------------------------ 维护

    /**
     * 重命名：只改元数据里的展示名与文档标题，MinIO 对象 key 不变。
     * 原文链接因此继续可用，也不需要重建索引。
     */
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> rename(String fileId, KnowledgeFileRenameRequest request) {
        KnowledgeFileEntity file = require(fileId);
        String name = request == null || request.fileName() == null ? "" : request.fileName().trim();
        if (name.isEmpty()) {
            throw new BusinessException(400, "文件名不能为空");
        }
        if (name.length() > FILE_NAME_MAX_LENGTH) {
            throw new BusinessException(400, "文件名不能超过 " + FILE_NAME_MAX_LENGTH + " 个字符");
        }

        KnowledgeFileEntity update = new KnowledgeFileEntity();
        update.setFileId(file.getFileId());
        update.setFileName(name);
        update.setFileExt(KnowledgeStorageKeys.ext(name));
        fileMapper.updateById(update);

        KnowledgeDocEntity doc = null;
        if (file.getDocId() != null && !file.getDocId().isBlank()) {
            KnowledgeDocEntity docUpdate = new KnowledgeDocEntity();
            docUpdate.setDocId(file.getDocId());
            docUpdate.setTitle(stripExt(name));
            docMapper.updateById(docUpdate);
            doc = docMapper.selectById(file.getDocId());
        }
        return toMap(fileMapper.selectById(file.getFileId()), doc);
    }

    /**
     * 删除一个物理文件：达梦两表元数据 + MinIO 对象（含 parsed.json）。
     * 该文档下已无其它文件时，连带删除逻辑文档并尽力清理 Qdrant 向量点。
     */
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> delete(String fileId) {
        KnowledgeFileEntity file = require(fileId);
        String docId = file.getDocId();

        // ① 先删元数据（同一事务）：后续删对象失败可整体回滚，不会丢库留对象记录
        fileMapper.deleteById(file.getFileId());
        long remain = countFiles(docId);
        boolean docRemoved = false;
        if (remain == 0 && docId != null && !docId.isBlank()) {
            docMapper.deleteById(docId);
            docRemoved = true;
        }

        // ② 向量点：被删文件已入库或文档整体消失时清理，服务未启动则跳过
        boolean vectorCleared = false;
        String warning = null;
        boolean needPurge = docRemoved || Integer.valueOf(1).equals(file.getIndexed());
        if (needPurge && docId != null && !docId.isBlank()) {
            try {
                if (indexService != null) {
                    indexService.delete(docId);
                    vectorCleared = true;
                }
            } catch (Exception e) {
                warning = "向量服务不可用，已跳过 Qdrant 清理：" + e.getMessage();
                log.warn("[kb-file] 删除向量点失败 docId={}：{}", docId, e.getMessage());
            }
        }

        // ③ 最后删对象存储：失败抛 500 触发回滚，避免「库里没了、对象还在」
        int objectsRemoved = 0;
        objectsRemoved += removeObject(file.getObjectKey(), "原文件");
        objectsRemoved += removeObject(file.getParsedKey(), "解析产物");

        Map<String, Object> map = new LinkedHashMap<>();
        map.put("fileId", file.getFileId());
        map.put("docId", docId);
        map.put("objectsRemoved", objectsRemoved);
        map.put("docRemoved", docRemoved);
        map.put("vectorCleared", vectorCleared);
        // 统计失败时返回 null，让前端知道「剩余条数未知」而不是 0
        map.put("remainFiles", remain < 0 ? null : remain);
        if (warning != null) {
            map.put("warning", warning);
        }
        log.info("[kb-file] 已删除文件 fileId={} docId={} objectsRemoved={} docRemoved={} remainFiles={}",
                file.getFileId(), docId, objectsRemoved, docRemoved, remain);
        return map;
    }

    /**
     * 批量清理「未归类」历史数据（TYPE_ID 为空的文档及其文件）。
     *
     * <p>类型树上线前的旧上传无法在页面上按类型查看，只能在这里集中清理：
     * 逐个文件复用 {@link #delete} 的流程（对象存储 + 元数据 + 向量），
     * 单个文件失败只记告警并继续，最后兜底删除没有文件行的空文档。
     */
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> purgeUnclassified() {
        Map<String, KnowledgeDocEntity> docs = selectUnclassifiedDocs();
        Map<String, Object> result = new LinkedHashMap<>();
        List<String> warnings = new ArrayList<>();
        if (docs.isEmpty()) {
            result.put("files", 0);
            result.put("docs", 0);
            result.put("warnings", warnings);
            return result;
        }

        int filesDeleted = 0;
        for (KnowledgeFileEntity file : selectFiles(docs.keySet())) {
            if (file == null || file.getFileId() == null) {
                continue;
            }
            try {
                delete(file.getFileId());
                filesDeleted++;
            } catch (Exception e) {
                warnings.add((file.getFileName() == null ? file.getFileId() : file.getFileName())
                        + "：" + e.getMessage());
                log.warn("[kb-file] 清理未归类文件失败 fileId={}：{}", file.getFileId(), e.getMessage());
            }
        }

        // 兜底：没有文件行的历史空文档（已被上面 delete 删掉的不再重复计数）
        int docsDeleted = 0;
        for (String docId : docs.keySet()) {
            try {
                if (docMapper.selectById(docId) == null) {
                    continue;
                }
                if (countFiles(docId) == 0) {
                    docMapper.deleteById(docId);
                    docsDeleted++;
                }
            } catch (Exception e) {
                warnings.add(docId + "：" + e.getMessage());
            }
        }

        result.put("files", filesDeleted);
        result.put("docs", docsDeleted);
        result.put("warnings", warnings);
        log.info("[kb-file] 未归类清理完成 files={} docs={} warnings={}",
                filesDeleted, docsDeleted, warnings.size());
        return result;
    }

    // ------------------------------------------------------------------ 内部

    private KnowledgeFileEntity require(String fileId) {
        if (fileId == null || fileId.isBlank()) {
            throw new BusinessException(400, "fileId 不能为空");
        }
        KnowledgeFileEntity file;
        try {
            file = fileMapper.selectById(fileId.trim());
        } catch (Exception e) {
            throw new BusinessException(500,
                    "知识库元数据表不可用，请先执行 sql/knowledge_schema.sql 建表：" + e.getMessage());
        }
        if (file == null) {
            throw new BusinessException(404, "文件不存在：" + fileId);
        }
        return file;
    }

    /** 文档表按类型过滤（typeId 为空即全部），返回 docId → 文档 的映射 */
    private Map<String, KnowledgeDocEntity> selectDocs(String typeId) {
        QueryWrapper<KnowledgeDocEntity> wrapper = new QueryWrapper<>();
        if (typeId != null && !typeId.isBlank()) {
            wrapper.eq("TYPE_ID", typeId.trim());
        }
        List<KnowledgeDocEntity> docs;
        try {
            docs = docMapper.selectList(wrapper);
        } catch (Exception e) {
            throw new BusinessException(500,
                    "知识库元数据表不可用，请先执行 sql/knowledge_schema.sql 建表：" + e.getMessage());
        }
        Map<String, KnowledgeDocEntity> map = new LinkedHashMap<>();
        for (KnowledgeDocEntity doc : docs) {
            if (doc.getDocId() != null) {
                map.put(doc.getDocId(), doc);
            }
        }
        return map;
    }

    /**
     * 「未归类」历史数据：SYS_KNOWLEDGE_DOC.TYPE_ID 为空（或空串）的文档。
     * 这些记录产生于类型树上线前，左侧树没有节点可挂，页面上无法通过类型查到。
     */
    private Map<String, KnowledgeDocEntity> selectUnclassifiedDocs() {
        List<KnowledgeDocEntity> docs;
        try {
            docs = docMapper.selectList(unclassifiedWrapper());
        } catch (Exception e) {
            throw new BusinessException(500,
                    "知识库元数据表不可用，请先执行 sql/knowledge_schema.sql 建表：" + e.getMessage());
        }
        Map<String, KnowledgeDocEntity> map = new LinkedHashMap<>();
        for (KnowledgeDocEntity doc : docs) {
            if (doc != null && doc.getDocId() != null) {
                map.put(doc.getDocId(), doc);
            }
        }
        return map;
    }

    /** TYPE_ID 为空 / 空串的过滤条件（达梦下空串可能等同于 NULL，两个条件都要带） */
    private static QueryWrapper<KnowledgeDocEntity> unclassifiedWrapper() {
        return new QueryWrapper<KnowledgeDocEntity>()
                .and(w -> w.isNull("TYPE_ID").or().eq("TYPE_ID", ""));
    }

    /** 按 docId 分批查文件，避免 IN 列表过长 */
    private List<KnowledgeFileEntity> selectFiles(Collection<String> docIds) {
        List<String> ids = new ArrayList<>(docIds);
        List<KnowledgeFileEntity> all = new ArrayList<>();
        try {
            for (int start = 0; start < ids.size(); start += IN_BATCH) {
                List<String> batch = ids.subList(start, Math.min(ids.size(), start + IN_BATCH));
                all.addAll(fileMapper.selectList(new QueryWrapper<KnowledgeFileEntity>()
                        .in("DOC_ID", batch)
                        .orderByDesc("CREATE_TIME")));
            }
        } catch (Exception e) {
            throw new BusinessException(500,
                    "知识库文件表不可用，请先执行 sql/knowledge_schema.sql 建表：" + e.getMessage());
        }
        return all;
    }

    private long countFiles(String docId) {
        if (docId == null || docId.isBlank()) {
            return 0L;
        }
        try {
            return fileMapper.selectCount(new QueryWrapper<KnowledgeFileEntity>().eq("DOC_ID", docId));
        } catch (Exception e) {
            log.warn("[kb-file] 统计文档剩余文件数失败 docId={}：{}", docId, e.getMessage());
            // 统计失败时不删文档行，宁可留一行空文档也不误删
            return -1L;
        }
    }

    private int removeObject(String objectKey, String label) {
        if (objectKey == null || objectKey.isBlank()) {
            return 0;
        }
        try {
            fileStore.removeObject(objectKey);
            return 1;
        } catch (Exception e) {
            log.warn("[kb-file] 删除{}失败 key={}：{}", label, objectKey, e.getMessage());
            throw new BusinessException(500,
                    "删除" + label + "失败（" + objectKey + "）：" + e.getMessage());
        }
    }

    private boolean matches(KnowledgeFileEntity file, KnowledgeDocEntity doc, String kw) {
        if (kw.isEmpty()) {
            return true;
        }
        String name = file.getFileName() == null ? "" : file.getFileName().toLowerCase();
        String title = doc == null || doc.getTitle() == null ? "" : doc.getTitle().toLowerCase();
        return name.contains(kw) || title.contains(kw);
    }

    private Map<String, Object> toMap(KnowledgeFileEntity file, KnowledgeDocEntity doc) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("fileId", file.getFileId());
        map.put("docId", file.getDocId());
        map.put("typeId", doc == null ? null : doc.getTypeId());
        map.put("title", doc == null ? null : doc.getTitle());
        map.put("groupId", file.getGroupId());
        map.put("fileName", file.getFileName());
        map.put("fileExt", file.getFileExt());
        map.put("size", file.getFileSize());
        map.put("contentType", file.getContentType());
        map.put("sourceType", file.getSourceType());
        map.put("bucket", file.getBucket());
        map.put("objectKey", file.getObjectKey());
        map.put("viewPath", KnowledgeStorageKeys.viewPath(file.getObjectKey()));
        map.put("resourceUrl", KnowledgeStorageKeys.resourceUrl(file.getObjectKey()));
        map.put("isDuplicate", file.getIsDuplicate());
        map.put("dedupDecision", file.getDedupDecision());
        map.put("parseStatus", file.getParseStatus());
        map.put("indexed", file.getIndexed());
        map.put("chunkCount", file.getChunkCount());
        map.put("errorMsg", file.getErrorMsg());
        map.put("createTime", format(file.getCreateTime()));
        map.put("docStatus", doc == null ? null : doc.getStatus());
        return map;
    }

    private static String format(LocalDateTime time) {
        return time == null ? null : time.format(TIME_FMT);
    }

    private static int normalizeLimit(Integer limit) {
        if (limit == null || limit <= 0) {
            return DEFAULT_LIMIT;
        }
        return Math.min(limit, MAX_LIMIT);
    }

    private static int normalizePageNumber(Integer pageNumber) {
        return pageNumber == null || pageNumber < 1 ? 1 : pageNumber;
    }

    private static int normalizePageSize(Integer pageSize) {
        if (pageSize == null || pageSize <= 0) {
            return DEFAULT_PAGE_SIZE;
        }
        return Math.min(pageSize, MAX_PAGE_SIZE);
    }

    private static String stripExt(String fileName) {
        int dot = fileName == null ? -1 : fileName.lastIndexOf('.');
        return dot > 0 ? fileName.substring(0, dot) : fileName;
    }
}
