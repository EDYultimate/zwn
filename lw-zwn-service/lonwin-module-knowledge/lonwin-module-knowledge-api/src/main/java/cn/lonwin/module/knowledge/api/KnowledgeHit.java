package cn.lonwin.module.knowledge.api;

/**
 * 知识侧检索命中片段：Qdrant point 归一化后的只读快照。
 *
 * <p>字段全部来自 payload（入库时已冗余原文与位置信息），
 * 在线问答<b>不回查 MongoDB / Elasticsearch / 达梦正文</b>。
 * 前端拿到 {@code KbRefVO} 后可用 filePath / sectionPath 跳回原文定位。
 *
 * <p>前 12 个字段与阶段 1 之前完全一致，保留 12 参构造器，
 * 使 agent 编排层（{@code AgentToolApiImpl}）与既有单元测试零改动；
 * 后 4 个字段为阶段 2/3 预留：组内折叠、canonical 归属、PDF 页号、来源文件类型。
 *
 * @param score 跨集合按秩融合后的分（不是原始 RRF 分）
 */
public record KnowledgeHit(
        String chunkId,
        String collection,
        String docId,
        String docType,
        String title,
        String fileName,
        String filePath,
        String sectionPath,
        String elemType,
        String text,
        double score,
        String embedderId,
        String groupId,
        String canonicalDocId,
        Integer pageNo,
        String sourceType) {

    /** 兼容阶段 1 之前的 12 参构造：新增字段一律置空。 */
    public KnowledgeHit(String chunkId, String collection, String docId, String docType,
                        String title, String fileName, String filePath, String sectionPath,
                        String elemType, String text, double score, String embedderId) {
        this(chunkId, collection, docId, docType, title, fileName, filePath, sectionPath,
                elemType, text, score, embedderId, null, null, null, null);
    }

    /** 展示用来源标题：优先章节路径，其次文档标题，最后文件名 */
    public String displaySource() {
        if (sectionPath != null && !sectionPath.isBlank()) {
            return sectionPath;
        }
        return title == null || title.isBlank() ? (fileName == null ? "" : fileName) : title;
    }

    /**
     * 同名 PDF/Word/Excel 的检索级折叠键：同组只保留最高分。
     * 老数据没有 groupId 时退化为 {@code collection#docId}，保证折叠不会把所有命中压成一条。
     */
    public String foldKey() {
        if (groupId != null && !groupId.isBlank()) {
            return groupId;
        }
        return (collection == null ? "" : collection) + "#"
                + (docId == null || docId.isBlank() ? chunkId : docId);
    }

    /** 生成一个只改分数的副本，用于跨集合按秩融合后重算分值 */
    public KnowledgeHit withScore(double newScore) {
        return new KnowledgeHit(chunkId, collection, docId, docType, title, fileName,
                filePath, sectionPath, elemType, text, newScore, embedderId,
                groupId, canonicalDocId, pageNo, sourceType);
    }
}
