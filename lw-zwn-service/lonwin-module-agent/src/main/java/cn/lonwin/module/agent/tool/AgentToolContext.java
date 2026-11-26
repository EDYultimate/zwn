package cn.lonwin.module.agent.tool;

import cn.lonwin.module.agent.spi.AgentToolRequest;
import lombok.Builder;
import lombok.Getter;

/**
 * 工具执行上下文：框架注入，不由模型提供，也<b>不是必填参数</b>。
 *
 * <p>绝大多数工具只需要自己的业务参数，因此推荐签名保持最简：
 * <pre>{@code
 * AgentToolResult annualWaterTransfer(@AgentToolParam(description = "年份") Integer year);
 * }</pre>
 * 只有当工具确实需要「是谁在什么会话里问的」时，才声明为第一个参数——
 * 这个参数不会出现在提示词的参数清单里，模型看不到也填不了。
 *
 * <p>单位（组织）不在这里：数据权限由 {@code DataScopeAspect} 统一准备，
 * 在工具/网关内部读 {@code DataScopeContext.unitCode()} 即可，避免权限参数沿着签名层层传递。
 */
@Getter
@Builder
public class AgentToolContext {

    /** 会话 ID（多轮对话） */
    private final String sessionId;

    /** 当前登录用户工号 */
    private final String userCode;

    /** 当前登录用户姓名 */
    private final String userName;

    /**
     * 本次会话的业务模块（智能体键，来自 {@code AgentChatDTO.module}）。
     *
     * <p>用于工具执行时感知「自己正服务于哪个智能体」：公共工具（如 {@code ui.locate}）
     * 需要按它把页面检索范围收窄到「本模块 + 公共页面」，避免指定智能体引导到
     * 其他模块的页面。通用问答时为空，语义是「不设限，全部可见」。
     */
    private final String module;

    public static AgentToolContext of(AgentToolRequest request) {
        if (request == null) {
            return AgentToolContext.builder().build();
        }
        return AgentToolContext.builder()
                .sessionId(request.getSessionId())
                .userCode(request.getUserCode())
                .userName(request.getUserName())
                .module(request.getModule())
                .build();
    }
}
