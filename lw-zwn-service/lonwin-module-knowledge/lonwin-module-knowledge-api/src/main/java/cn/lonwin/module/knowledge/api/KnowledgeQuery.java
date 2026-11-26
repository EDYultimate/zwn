package cn.lonwin.module.knowledge.api;

/**
 * 知识检索请求（阶段 2/3 扩展用）。
 *
 * <p>阶段 1 的 {@link KnowledgeGateway#search(String, int, String, String)} 仍是主入口，
 * 本对象只是把后续会用到的过滤维度收拢起来，避免每加一个条件就改一次接口签名。
 * {@code groupId / sourceType} 属于业务筛选，<b>不是权限条件</b>；知识侧按约定不做权限过滤。
 *
 * @param query       用户问题或核心名词
 * @param topK        最终返回片段数
 * @param docType     文档类型关键词，可空
 * @param section     章节关键词，可空
 * @param groupId     同名文件分组，可空
 * @param sourceType  WORD / PDF / EXCEL，可空
 * @param foldByGroup 是否在 RRF 之后按 groupId 折叠（同名多版本只留最高分）
 */
public record KnowledgeQuery(String query, int topK, String docType, String section,
                             String groupId, String sourceType, boolean foldByGroup) {

    public KnowledgeQuery {
        if (topK < 1) {
            topK = 5;
        }
    }

    /** 只带基础四参的便捷构造 */
    public static KnowledgeQuery of(String query, int topK, String docType, String section) {
        return new KnowledgeQuery(query, topK, docType, section, null, null, false);
    }
}
