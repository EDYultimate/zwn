package cn.lonwin.module.agent.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * {@link AgentToolAction} 的容器注解，由 {@code @Repeatable} 自动使用，业务代码无需直接引用。
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AgentToolActions {

    AgentToolAction[] value();
}
