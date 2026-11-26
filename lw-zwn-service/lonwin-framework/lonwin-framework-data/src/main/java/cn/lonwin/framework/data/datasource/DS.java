package cn.lonwin.framework.data.datasource;

import java.lang.annotation.*;

/**
 * 数据源切换注解
 * <p>
 * 加在 Mapper 接口类或方法上，指定该方法走哪个数据源。
 * 不加此注解则走默认主数据源。
 * <p>
 * 示例：
 * <pre>
 * &#64;DS("ydh")
 * public interface YdhXxxMapper { ... }
 * </pre>
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DS {

    /**
     * 数据源名称，对应 DataSourceConfig 中注册的 key
     */
    String value() default "master";
}
