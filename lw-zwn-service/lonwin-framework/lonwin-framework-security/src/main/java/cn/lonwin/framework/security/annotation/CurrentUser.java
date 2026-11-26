package cn.lonwin.framework.security.annotation;

import java.lang.annotation.*;

/**
 * 自定义注解 ，用于获取登录用户。
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface CurrentUser {
}