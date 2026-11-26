package cn.lonwin.module.agent.annotation;

/**
 * 工具参数的数据类型，用于生成结构化 Schema 并做入参校验。
 *
 * <p>{@link #AUTO} 表示按 Java 方法参数类型自动推断，绝大多数场景保持默认即可。
 * 只有需要「在提示词里约束格式」时才显式声明，例如把 {@code String} 标成 {@link #DATE}。
 */
public enum AgentParamType {

    /** 自动推断（String->STRING，Integer/Long->INTEGER，Double/BigDecimal->NUMBER，枚举->STRING+枚举值） */
    AUTO,

    STRING,

    INTEGER,

    NUMBER,

    BOOLEAN,

    /** 日期，格式 yyyy-MM-dd */
    DATE,

    /** 日期时间，格式 yyyy-MM-dd'T'HH:mm:ss */
    DATETIME,

    /** 复杂对象，原样透传（不做结构校验） */
    OBJECT
}
