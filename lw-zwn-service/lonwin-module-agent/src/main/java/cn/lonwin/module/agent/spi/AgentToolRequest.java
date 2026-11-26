package cn.lonwin.module.agent.spi;

import java.util.Map;

import lombok.Builder;
import lombok.Data;

/**
 * 工具执行入参。
 *
 * <p>由 agent 模块统一构造并注入登录用户与单位信息，
 * 业务方实现工具时无需自己再去取 ThreadLocal，直接使用 {@code unitCode} 做数据权限过滤即可。
 */
@Data
@Builder
public class AgentToolRequest {

    /** 会话 ID（多轮对话） */
    private String sessionId;

    /** 当前登录用户工号 */
    private String userCode;

    /** 当前登录用户姓名 */
    private String userName;

    /**
     * 本次会话的业务模块（智能体键）：公共工具按它收窄页面检索范围，见
     * {@code AgentToolContext#getModule()}。通用问答时为空。
     */
    private String module;

    /**
     * 当前用户所属单位编码（数据权限依据）。
     * 由 AgentDataScope 解析，业务方必须用它限制查询范围。
     */
    private String unitCode;

    /** 模型解析出的工具参数，如 {"year": 2026} */
    private Map<String, Object> args;
}
