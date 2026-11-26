package cn.lonwin.module.knowledge.api;

import java.util.List;

/**
 * 知识侧网关（端口）：把「一句自然语言」变成一组可供大模型参考的文档片段。
 *
 * <p>与工具侧网关是并列关系，不是同一类数据：
 * <ul>
 *   <li>工具侧 = 可执行的动作，返回确定性业务数值，受工具侧权限门面约束；</li>
 *   <li>知识侧 = 可参考的依据，模糊召回只读文本，<b>当前设计不做任何权限过滤</b>。</li>
 * </ul>
 *
 * <h3>为什么不走 HTTP/Feign</h3>
 * 本接口位于 {@code lonwin-module-knowledge-api}，agent 只依赖这个纯契约包；
 * 实现由 {@code lonwin-module-knowledge-biz} 在启动模块装配进同一个 Spring 容器，
 * 编排层直接注入调用，省掉一次进程间跳转、序列化与超时治理。
 * 将来若真拆成独立服务，只需提供一个走 Feign 的实现类，编排层零改动。
 *
 * <h3>生命周期</h3>
 * 只有 {@code lonwin.agent.knowledge.enabled=true} 时才创建实现 Bean。
 * 关闭时工具契约通过 {@code @Autowired(required=false)} 拿到 null，
 * 直接返回一条明确的失败观察结果，不会因向量服务未启动而启动失败。
 *
 * <h3>模块边界</h3>
 * 实现唯一，位于 {@code lonwin-module-knowledge-biz} 的 {@code LocalKnowledgeGateway}；
 * agent 不持有任何 Qdrant / BGE-M3 / MinIO 客户端，只注入本接口读取命中片段。
 */
public interface KnowledgeGateway {

    /**
     * 混合检索（BGE-M3 编码 → dense/sparse 两路 prefetch → RRF 融合）。
     *
     * @param query   用户问题或核心名词，必填
     * @param topK    最终返回片段数
     * @param docType 文档类型业务筛选，可为空；<b>不是权限条件</b>
     * @param section 章节关键词业务筛选，可为空；<b>不是权限条件</b>
     * @return 命中片段（无结果返回空列表，不返回 null）
     * @throws KnowledgeException 向量服务/Qdrant 不可用或返回异常时抛出，由工具层决定降级策略
     */
    List<KnowledgeHit> search(String query, int topK, String docType, String section);

    /** 扩展入口：默认回落到四参签名，实现类可覆写以支持 filter 下推与组内折叠 */
    default List<KnowledgeHit> search(KnowledgeQuery request) {
        return search(request.query(), request.topK(), request.docType(), request.section());
    }
}
