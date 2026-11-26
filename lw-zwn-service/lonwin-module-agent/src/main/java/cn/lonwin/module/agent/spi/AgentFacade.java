package cn.lonwin.module.agent.spi;

import cn.lonwin.module.agent.model.dto.AgentChatDTO;
import cn.lonwin.module.agent.model.vo.AgentChatVO;

/**
 * 对其他业务模块开放的智能问答入口。
 *
 * <p>其他模块若想在内部"问一句"，注入本接口即可，无需直接依赖
 * {@code AgentChatService} 的实现细节，便于后续替换（同步/异步/流式）。
 */
public interface AgentFacade {

    /**
     * 完整问答（带会话记忆与跳转按钮）。
     *
     * @param dto 会话 ID 与问题
     * @return 回答内容与跳转按钮
     */
    AgentChatVO chat(AgentChatDTO dto);

    /**
     * 只要文本结果的简化问答。
     *
     * @param sessionId 会话 ID，用于多轮上下文，可传 null
     * @param question  问题
     * @return 模型回答文本
     */
    String ask(String sessionId, String question);
}
