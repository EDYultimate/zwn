package cn.lonwin.module.knowledge.index;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.module.knowledge.config.KnowledgeProperties;
import cn.lonwin.module.knowledge.entity.KnowledgeDocEntity;
import cn.lonwin.module.knowledge.entity.KnowledgeFileEntity;
import cn.lonwin.module.knowledge.mapper.KnowledgeDocMapper;
import cn.lonwin.module.knowledge.mapper.KnowledgeFileMapper;
import cn.lonwin.module.knowledge.parser.DocumentParser;
import cn.lonwin.module.knowledge.parser.ExcelParser;
import cn.lonwin.module.knowledge.parser.ParsedDocument;
import cn.lonwin.module.knowledge.parser.PdfParser;
import cn.lonwin.module.knowledge.parser.WordParser;
import cn.lonwin.module.knowledge.retrieve.BgeM3Client;
import cn.lonwin.module.knowledge.retrieve.QdrantClient;
import cn.lonwin.module.knowledge.storage.KnowledgeFileStore;
import cn.lonwin.module.knowledge.storage.KnowledgeStorageKeys;
import lombok.extern.slf4j.Slf4j;

/**
 * 上传即入库的编排服务：把「MinIO 里的原文件」变成 Qdrant 里可检索的点。
 *
 * <p>顺序恒为：读回 MinIO → 结构化解析 → parsed.json 回写 MinIO → 切片
 * → BGE-M3 批量编码 → Qdrant upsert → 回填达梦状态。
 * 任一步失败只把 {@code PARSE_STATUS} 置 FAILED 并记 ERROR_MSG，
 * <b>绝不回滚或删除已上传的 MinIO 对象</b>。
 *
 * <p>point ID 由内容哈希生成，重试 / 重建都是覆盖式幂等，不会产生重复点。
 */
@Slf4j
@Service
public class KnowledgeIndexService {

    public record IndexResult(boolean success, boolean skipped, int chunkCount, String message) {
        static IndexResult skipped(String message) {
            return new IndexResult(true, true, 0, message);
        }
        static IndexResult ok(int count) {
            return new IndexResult(true, false, count, "已写入 Qdrant");
        }
        static IndexResult failed(String message) {
            return new IndexResult(false, false, 0, message);
        }
    }

    private final KnowledgeFileStore fileStore;
    private final KnowledgeFileMapper fileMapper;
    private final KnowledgeDocMapper docMapper;
    private final KnowledgeProperties properties;
    private final ObjectMapper objectMapper;
    private final BgeM3Client bge;
    private final QdrantClient qdrant;
    private final KnowledgeChunker chunker;
    private final Map<String, DocumentParser> parsers;

    /**
     * 容器用的构造器：本类另有一个供单测注入 mock 客户端的包级构造器，
     * 存在多个构造器时必须显式指定，否则 Spring 会退回无参构造并报
     * {@code BeanInstantiationException: No default constructor found}。
     */
    @Autowired
    public KnowledgeIndexService(KnowledgeFileStore fileStore,
                                 KnowledgeFileMapper fileMapper,
                                 KnowledgeDocMapper docMapper,
                                 KnowledgeProperties properties,
                                 ObjectMapper objectMapper) {
        this(fileStore, fileMapper, docMapper, properties, objectMapper,
                new BgeM3Client(properties, objectMapper),
                new QdrantClient(properties, objectMapper));
    }

    /** 单元测试可直接注入 mock 客户端 */
    KnowledgeIndexService(KnowledgeFileStore fileStore,
                          KnowledgeFileMapper fileMapper,
                          KnowledgeDocMapper docMapper,
                          KnowledgeProperties properties,
                          ObjectMapper objectMapper,
                          BgeM3Client bge, QdrantClient qdrant) {
        this.fileStore = fileStore;
        this.fileMapper = fileMapper;
        this.docMapper = docMapper;
        this.properties = properties;
        this.objectMapper = objectMapper;
        this.bge = bge;
        this.qdrant = qdrant;
        this.chunker = new KnowledgeChunker(properties);
        this.parsers = Map.of("WORD", new WordParser(), "PDF", new PdfParser(),
                "EXCEL", new ExcelParser());
    }

    /** 上传成功后调用：默认走独立线程池，不占用 HTTP 上传线程 */
    @Async("knowledgeIndexExecutor")
    public void indexAsync(String fileId) {
        try {
            index(fileId);
        } catch (Exception e) {
            log.error("[kb-index] 异步索引异常 fileId={}: {}", fileId, e.getMessage(), e);
            markFailed(fileId, e.getMessage());
        }
    }

    /** 同步执行一次索引，返回结构化结果；失败不抛异常，由调用方决定如何展示 */
    public IndexResult index(String fileId) {
        if (!properties.getIndex().isEnabled()) {
            return IndexResult.skipped("索引开关已关闭（index.enabled=false）");
        }
        KnowledgeFileEntity file = fileMapper.selectById(fileId);
        if (file == null) {
            return IndexResult.failed("文件元数据不存在：" + fileId);
        }
        if ("SKIPPED_DUP".equals(file.getParseStatus())) {
            return IndexResult.skipped("同源附件已存 MinIO，按去重规则跳过切片");
        }
        if (!claim(fileId)) {
            return IndexResult.skipped("已被其它线程抢占或状态不允许");
        }

        try {
            byte[] bytes = fileStore.loadBytes(file.getObjectKey());
            String sourceType = file.getSourceType() == null ? "OTHER" : file.getSourceType();
            String ext = KnowledgeStorageKeys.ext(file.getFileName());
            DocumentParser.ImageSink imageSink = (index, extension, imageBytes) -> {
                String key = KnowledgeStorageKeys.imageKey(
                        properties.getStorage().getImagePrefix(), file.getDocId(), index);
                fileStore.putBytes(key, imageBytes, "image/" + extension);
                return key;
            };
            DocumentParser.ParseContext parseContext = new DocumentParser.ParseContext(
                    file.getDocId(), file.getFileName(), file.getGroupId(),
                    file.getObjectKey(), ext, imageSink);

            ParsedDocument document = parsers.containsKey(sourceType)
                    ? parsers.get(sourceType).parse(bytes, parseContext)
                    : plainText(bytes, parseContext);

            String parsedKey = KnowledgeStorageKeys.parsedKey(
                    properties.getStorage().getSourcePrefix(), file.getDocId());
            fileStore.putBytes(parsedKey, objectMapper.writeValueAsBytes(document),
                    "application/json");

            if (document.needOcr()) {
                updateFile(fileId, "NEED_OCR", 0, parsedKey, "疑似扫描件，需 OCR 后重建");
                updateDoc(file.getDocId(), "NEED_OCR", 0, document.textHash());
                return IndexResult.skipped("疑似扫描件，已标记 NEED_OCR");
            }

            KnowledgeChunker.ChunkContext chunkContext = new KnowledgeChunker.ChunkContext(
                    file.getDocId(), file.getGroupId(), file.getDocId(), file.getFileName(),
                    stripExt(file.getFileName()),
                    KnowledgeStorageKeys.resourceUrl(file.getObjectKey()), sourceType);
            List<KnowledgeChunk> chunks = chunker.chunk(document, chunkContext);
            int written = upsertChunks(chunks);

            String status = written > 0 ? "INDEXED" : "PARSED";
            updateFile(fileId, status, written, parsedKey, null);
            updateDoc(file.getDocId(), status, written, document.textHash());
            log.info("[kb-index] 文件已入库 fileId={} docId={} chunks={} type={}",
                    fileId, file.getDocId(), written, sourceType);
            return IndexResult.ok(written);
        } catch (Exception e) {
            String message = e.getMessage() == null ? e.getClass().getSimpleName() : e.getMessage();
            log.error("[kb-index] 索引失败 fileId={}: {}", fileId, message, e);
            markFailed(fileId, message);
            return IndexResult.failed(message);
        }
    }

    /** 按 docId 重建：先清掉旧点，再逐个文件重新索引 */
    public IndexResult reindex(String docId) {
        for (String collection : List.of(properties.getCollectionChunks(),
                properties.getCollectionTables())) {
            qdrant.deleteByDocId(collection, docId);
        }
        List<KnowledgeFileEntity> files = fileMapper.selectList(
                new QueryWrapper<KnowledgeFileEntity>().eq("DOC_ID", docId));
        int total = 0;
        for (KnowledgeFileEntity file : files) {
            resetForReindex(file.getFileId());
            IndexResult one = index(file.getFileId());
            total += one.chunkCount();
        }
        return IndexResult.ok(total);
    }

    /** 删除某逻辑文档在 Qdrant 里的点，并把文件状态退回 PENDING */
    public int delete(String docId) {
        for (String collection : List.of(properties.getCollectionChunks(),
                properties.getCollectionTables())) {
            qdrant.deleteByDocId(collection, docId);
        }
        KnowledgeFileEntity update = new KnowledgeFileEntity();
        update.setParseStatus("PENDING");
        update.setIndexed(0);
        update.setChunkCount(0);
        return fileMapper.update(update, new UpdateWrapper<KnowledgeFileEntity>()
                .eq("DOC_ID", docId));
    }

    /** 定时兜底扫描：补偿进程重启 / 外部依赖抖动丢掉的任务 */
    public int scanPending() {
        if (!properties.getIndex().isEnabled() || !properties.getIndex().isScanEnabled()) {
            return 0;
        }
        List<KnowledgeFileEntity> pending;
        try {
            pending = fileMapper.selectList(new QueryWrapper<KnowledgeFileEntity>()
                    .in("PARSE_STATUS", List.of("PENDING", "FAILED"))
                    .orderByAsc("CREATE_TIME"));
        } catch (Exception e) {
            log.warn("[kb-index] 扫描待索引文件失败（元数据表可能未建）：{}", e.getMessage());
            return 0;
        }
        int done = 0;
        for (KnowledgeFileEntity file : pending) {
            if (done >= Math.max(1, properties.getIndex().getMaxScanBatch())) {
                break;
            }
            IndexResult result = index(file.getFileId());
            if (!result.skipped()) {
                done++;
            }
        }
        return done;
    }

    /* ------------------------------ 内部 ------------------------------ */

    private int upsertChunks(List<KnowledgeChunk> chunks) {
        int batchSize = Math.max(1, properties.getIndex().getBatchSize());
        int written = 0;
        for (int start = 0; start < chunks.size(); start += batchSize) {
            List<KnowledgeChunk> batch = chunks.subList(start,
                    Math.min(chunks.size(), start + batchSize));
            List<BgeM3Client.QueryVector> vectors = bge.encodeBatch(
                    batch.stream().map(KnowledgeChunk::embedText).toList());
            if (vectors.size() != batch.size()) {
                throw new IllegalStateException("BGE-M3 返回向量数与切片数不一致");
            }
            Map<String, List<Map<String, Object>>> byCollection = new LinkedHashMap<>();
            for (int i = 0; i < batch.size(); i++) {
                KnowledgeChunk chunk = batch.get(i);
                BgeM3Client.QueryVector vector = vectors.get(i);
                Map<String, Object> point = new LinkedHashMap<>();
                point.put("id", chunk.id());
                point.put("vector", Map.of(
                        properties.getDenseVector(), vector.dense(),
                        properties.getSparseVector(), Map.of(
                                "indices", vector.indices(), "values", vector.values())));
                point.put("payload", chunk.payload());
                byCollection.computeIfAbsent(chunk.collection(), k -> new ArrayList<>()).add(point);
            }
            for (Map.Entry<String, List<Map<String, Object>>> entry : byCollection.entrySet()) {
                written += qdrant.upsert(entry.getKey(), entry.getValue());
            }
        }
        return written;
    }

    private ParsedDocument plainText(byte[] bytes, DocumentParser.ParseContext context) {
        String text = new String(bytes, StandardCharsets.UTF_8).trim();
        List<ParsedDocument.Element> elements = text.isEmpty() ? List.of()
                : List.of(new ParsedDocument.Element(ParsedDocument.ElementType.TEXT,
                        "", text, null, null, null, 0));
        return new ParsedDocument(context.docId(), context.fileName(), "OTHER",
                elements, DocumentParser.textHash(elements), false);
    }

    /** 条件更新抢占，返回 true 表示本线程获得处理权 */
    private boolean claim(String fileId) {
        KnowledgeFileEntity update = new KnowledgeFileEntity();
        update.setParseStatus("INDEXING");
        try {
            return fileMapper.update(update, new UpdateWrapper<KnowledgeFileEntity>()
                    .eq("FILE_ID", fileId)
                    .in("PARSE_STATUS", List.of("PENDING", "FAILED", "INDEXED", "NEED_OCR"))) > 0;
        } catch (Exception e) {
            log.warn("[kb-index] 抢占状态失败（元数据表可能未建）fileId={}: {}", fileId, e.getMessage());
            return false;
        }
    }

    private void resetForReindex(String fileId) {
        KnowledgeFileEntity update = new KnowledgeFileEntity();
        update.setParseStatus("PENDING");
        fileMapper.update(update, new UpdateWrapper<KnowledgeFileEntity>().eq("FILE_ID", fileId));
    }

    private void updateFile(String fileId, String status, int chunkCount,
                            String parsedKey, String error) {
        KnowledgeFileEntity update = new KnowledgeFileEntity();
        update.setParseStatus(status);
        update.setIndexed(chunkCount > 0 ? 1 : 0);
        update.setChunkCount(chunkCount);
        update.setParsedKey(parsedKey);
        update.setErrorMsg(error);
        safeUpdate(() -> fileMapper.update(update, new UpdateWrapper<KnowledgeFileEntity>()
                .eq("FILE_ID", fileId)));
    }

    private void updateDoc(String docId, String status, int chunkCount, String textHash) {
        KnowledgeDocEntity update = new KnowledgeDocEntity();
        update.setStatus(status);
        update.setIndexed(chunkCount > 0 ? 1 : 0);
        update.setChunkCount(chunkCount);
        update.setTextHash(textHash);
        update.setErrorMsg(null);
        safeUpdate(() -> docMapper.update(update, new UpdateWrapper<KnowledgeDocEntity>()
                .eq("DOC_ID", docId)));
    }

    private void markFailed(String fileId, String message) {
        KnowledgeFileEntity update = new KnowledgeFileEntity();
        update.setParseStatus("FAILED");
        update.setErrorMsg(message == null ? "" : message.length() > 1800
                ? message.substring(0, 1800) : message);
        safeUpdate(() -> fileMapper.update(update, new UpdateWrapper<KnowledgeFileEntity>()
                .eq("FILE_ID", fileId)));
    }

    private void safeUpdate(Runnable action) {
        try {
            action.run();
        } catch (Exception e) {
            // 表未建不能让「文件已存 MinIO / 已写 Qdrant」这个事实回滚
            log.warn("[kb-index] 元数据回填失败（不影响文件与向量）：{}", e.getMessage());
        }
    }

    private static String stripExt(String fileName) {
        int dot = fileName == null ? -1 : fileName.lastIndexOf('.');
        return dot > 0 ? fileName.substring(0, dot) : fileName;
    }
}
