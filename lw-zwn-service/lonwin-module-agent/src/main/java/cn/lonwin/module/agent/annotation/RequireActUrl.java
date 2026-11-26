package cn.lonwin.module.agent.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 功能权限校验注解（后端强校验）。
 *
 * <p>标注在 Controller 类或方法上，请求进入时会由
 * {@link cn.lonwin.module.agent.interceptor.ActUrlPermissionInterceptor}
 * 比对权限系统下发的 actList（功能权限 URL 列表），不匹配则返回 403。
 *
 * <p>说明：
 * <ul>
 *   <li>仅在 {@code lonwin.auth.mode=POWERS} 时生效；开发模式（NONE）/JWT 无 actList，自动放行；</li>
 *   <li>不标注该注解的接口不做功能权限校验，只受全局登录态保护；</li>
 *   <li>actList 中出现 {@code *} 或 {@code ALL} 视为拥有全部功能权限（超级管理员）。</li>
 * </ul>
 */
@Documented
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireActUrl {

    /**
     * 需要的功能权限 URL，多个之间为「或」关系。
     * 留空时默认取当前请求的 URI 进行匹配。
     */
    String[] value() default {};
}
