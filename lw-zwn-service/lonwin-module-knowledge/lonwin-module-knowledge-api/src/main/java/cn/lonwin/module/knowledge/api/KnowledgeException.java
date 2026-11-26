package cn.lonwin.module.knowledge.api;

/**
 * 知识侧可预期的失败：BGE-M3 推理服务不可用、Qdrant 检索失败、集合配置错误等。
 *
 * <p>刻意继承 {@link RuntimeException} 且不绑定任何框架：编排层（agent）只 catch 本异常
 * 并依据 {@code lonwin.agent.knowledge.degrade-on-error} 决定降级成「知识库暂不可用」
 * 还是向上抛出，不感知底层是 Qdrant 还是别的向量库。
 */
public class KnowledgeException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public KnowledgeException(String message) {
        super(message);
    }

    public KnowledgeException(String message, Throwable cause) {
        super(message, cause);
    }
}
