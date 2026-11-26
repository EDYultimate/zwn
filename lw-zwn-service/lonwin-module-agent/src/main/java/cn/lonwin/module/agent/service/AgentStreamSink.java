package cn.lonwin.module.agent.service;

import cn.lonwin.module.agent.model.vo.AgentChatVO;

/**
 * 流式问答的事件出口。编排层只往里「推事件」，不关心下面是 SSE、WebSocket 还是内存收集，
 * 因此同一份 {@code runChat} 逻辑既能服务阻塞式接口，也能服务流式接口。
 *
 * <p>所有方法默认空实现：同步接口传 {@link #NOOP}，零额外开销；单元测试也可以只覆写关心的事件。
 */
public interface AgentStreamSink {

    AgentStreamSink NOOP = new AgentStreamSink() { };

    /** 阶段进度，如「正在查询许可水量…」；工具轮不产出可见正文，靠它让用户知道系统在动 */
    default void stage(String text) { }

    /** 最终回答的增量文字（可能只有一两个字） */
    default void delta(String text) { }

    /** 上游有帧到达但暂无可展示内容时调用，由出口决定是否发 SSE 心跳 */
    default void heartbeat() { }

    /** 回答完成：下发经过校验/兜底/引用对账后的权威结果，前端应以此覆盖增量预览 */
    default void done(AgentChatVO vo) { }

    /** 失败：HTTP 响应已提交，只能以流内错误事件告知前端 */
    default void error(String message) { }
}
