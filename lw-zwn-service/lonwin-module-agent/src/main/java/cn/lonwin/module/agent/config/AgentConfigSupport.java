package cn.lonwin.module.agent.config;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import cn.lonwin.common.core.exception.BusinessException;

/**
 * 在线配置的公共支撑：时间与写库失败提示。
 *
 * <p>与具体持久化方式无关（Mapper / 文件 / 内存三种存储都可复用），
 * 因此不再叫 JdbcXxx，也不再持有任何 JDBC 绑定代码。
 */
public final class AgentConfigSupport {

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private AgentConfigSupport() {
    }

    /** 由服务端统一生成的修改时间，格式与 AgentToolMetaService 一致 */
    public static String now() {
        return LocalDateTime.now().format(TIME_FORMAT);
    }

    /**
     * 任何写库失败都要给出可行动的提示：绝大多数情况是没执行建表脚本。
     * 不静默吞掉——「保存成功但没落库」比直接报错更危险。
     */
    public static BusinessException writeFailed(String table, Exception cause) {
        return new BusinessException(500,
                "配置落库失败（" + table + "），请先执行 sql/agent_config.sql 建表：" + cause.getMessage());
    }
}
