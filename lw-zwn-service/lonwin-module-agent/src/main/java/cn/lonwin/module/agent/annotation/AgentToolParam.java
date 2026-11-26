package cn.lonwin.module.agent.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 工具参数的「结构化 Schema」声明。
 *
 * <p>与把参数写进 description 自由文本相比，结构化声明的收益是：
 * <ul>
 *   <li>提示词里生成的是机器可读的 JSON Schema，模型拼参数更准；</li>
 *   <li>执行前可做强校验（必填、枚举、范围、正则），错误信息能回传模型让它自我纠正；</li>
 *   <li>将来若换成 OpenAI 原生 function calling，可直接映射为 {@code tools[].function.parameters}。</li>
 * </ul>
 *
 * <p>参数名缺省取 Java 形参名（编译已开启 {@code -parameters}）。
 * 若形参名被混淆或想用更友好的名字，用 {@link #name()} 显式指定。
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AgentToolParam {

    /** 参数名，缺省取 Java 形参名 */
    String name() default "";

    /** 参数说明：写清楚「填什么」，这是模型正确取值的主要依据 */
    String description();

    /** 是否必填。false 时未传可选 {@link #defaultValue()} */
    boolean required() default false;

    /** 数据类型，缺省按 Java 类型推断 */
    AgentParamType type() default AgentParamType.AUTO;

    /** 可选值清单（枚举）。非空时执行前会校验取值必须命中其中之一 */
    String[] enums() default {};

    /** 格式提示，如 date / date-time / year-month */
    String format() default "";

    /** 示例值，会写进 Schema，帮助模型理解粒度（如 "2026"） */
    String example() default "";

    /** 缺省值（字符串形式），未传参且非必填时使用 */
    String defaultValue() default "";

    /** 数值下限（含），NaN 表示不限制 */
    double min() default Double.NaN;

    /** 数值上限（含），NaN 表示不限制 */
    double max() default Double.NaN;

    /** 字符串正则约束，空表示不限制 */
    String pattern() default "";
}
