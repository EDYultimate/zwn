package cn.lonwin.module.agent.annotation;

import java.lang.annotation.*;

/**
 * 声明工具返回数据的一个字段及其含义，可重复标注在工具方法上。
 *
 * <p>能力清单的三段式元数据（功能 / 入参 / 返回字段）中，入参由
 * {@link AgentToolParam} 映射为 JSON Schema，返回字段没有标准的
 * function calling 结构可挂——这里把字段说明拼进 function description，
 * 让模型在读清单时就知道「每个字段是什么意思、单位是什么」，
 * 而不用等第一次拿到数据后再猜。
 *
 * <p>字段写顶层键（如 {@code rows}、{@code certCount}）或行内字段
 * （如 {@code wpcCd}、{@code amt}），模型按名字对号入座。
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Repeatable(AgentToolReturn.List.class)
public @interface AgentToolReturn {

    /** 字段名（返回数据里的键名） */
    String field();

    /** 字段含义：写清业务语义与单位，如「许可水量，单位万m³/年」 */
    String description();

    /** 同一方法上可声明多个返回字段 */
    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    @Documented
    @interface List {
        AgentToolReturn[] value();
    }
}
