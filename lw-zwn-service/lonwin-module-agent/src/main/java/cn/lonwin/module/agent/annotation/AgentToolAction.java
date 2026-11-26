package cn.lonwin.module.agent.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 工具执行成功后，随回答一起下发的「跳转按钮」。
 *
 * <p>路由写在后端注解里而不是让模型生成，杜绝模型编造不存在的页面。
 * 一个工具可声明多个按钮，按声明顺序返回。
 *
 * <pre>{@code
 * @AgentToolAction(label = "查看调水明细", route = "/waterAssign/haihe",
 *                  queryParams = {"year"}, permissions = {"/waterAssign/haihe"})
 * }</pre>
 *
 * @deprecated 已被「页面能力声明 + UI 事件」取代，仅供存量工具兼容。
 *
 * <p>旧方案的三个问题：路由写死在后端，前端换路由要改 Java 并重启；只能跳整页，
 * 无法打开弹框/高亮数字；按钮不经过 {@code ui-capabilities} 白名单与参数契约校验。
 * 新工具请改用 {@code AgentToolResult.data} + 前端 {@code agent.capabilities.ts} 声明，
 * 由模型从声明的 target 中挑选，服务端再校验一遍。
 *
 * <p>前端已在 {@code views/knowledge/QA} 里把 actions 与 events 归一成同一条执行链路，
 * 因此存量工具不迁移也不会失效，只是没有弹框/高亮能力。
 */
@Deprecated
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Repeatable(AgentToolActions.class)
@Documented
public @interface AgentToolAction {

    /** 按钮文案 */
    String label();

    /** 前端路由 path，需与 vue-router 实际路由一致 */
    String route();

    /** 按钮所需功能权限 actUrl；为空时退化为使用 {@link #route()} */
    String[] permissions() default {};

    /**
     * 需要带到 query 上的工具入参名。
     * 框架从模型解析出的 args 中取值，工具未传且非必填时自动忽略。
     */
    String[] queryParams() default {};
}
