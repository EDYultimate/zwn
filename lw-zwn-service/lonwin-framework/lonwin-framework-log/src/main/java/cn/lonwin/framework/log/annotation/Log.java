package cn.lonwin.framework.log.annotation;

import cn.lonwin.framework.log.enums.BusinessType;
import cn.lonwin.framework.log.enums.OperatorType;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 自定义操作日志记录注解，标记在Controller方法上记录操作日志。
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Log {

    /**
     * 功能描述
     */
    String title() default "";

    /**
     * 模块
     */
    String model() default "";

    /**
     * 功能
     */
    BusinessType businessType() default BusinessType.OTHER;

    /**
     * 操作人类别
     */
    OperatorType operatorType() default OperatorType.MANAGE;

    /**
     * 是否保存请求的参数
     */
    boolean isSaveRequestData() default true;
}
