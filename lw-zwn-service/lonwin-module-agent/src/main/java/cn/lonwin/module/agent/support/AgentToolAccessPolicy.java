package cn.lonwin.module.agent.support;

import cn.lonwin.module.agent.tool.AgentToolContext;
import cn.lonwin.module.agent.tool.AgentToolDefinition;

/**
 * 工具侧数据接口权限的<b>唯一抽象扩展点</b>。
 *
 * <h3>为什么现在只有一个接口</h3>
 * 现阶段主要完善问答功能，权限不做重实现。这里只定义「要不要放行」这一个决定，
 * 具体的组织/角色/数据范围规则留到需要时再实现——届时只需提供一个本接口的 Spring Bean，
 * 编排层、工具契约、网关与前端一行都不用改。
 *
 * <h3>开关</h3>
 * {@code lonwin.agent.tools.permission.enabled=false}（默认）时，
 * {@link AgentToolPermissionChecker} 直接放行，<b>连本接口都不会被调用</b>，
 * 因此「一键关闭」是零开销的，也不会因为没有实现 Bean 而启动失败。
 * 置 true 后：若容器里有自定义策略则完全交给它；否则回落到原有的 ActUrl 功能权限校验。
 *
 * <h3>与单位数据权限的分工</h3>
 * 本接口管「能不能调这个工具」；单位数据范围由 {@code lonwin.agent.data-scope.enabled}
 * 与 {@code DataScopeAspect} 独立控制。知识侧检索<b>不做任何权限过滤</b>，不在此接口职责内。
 */
@FunctionalInterface
public interface AgentToolAccessPolicy {

    /**
     * @param tool    待执行的工具定义（含注解上声明的 permissions / unitScoped / category）
     * @param context 当前会话与登录用户；同步链路里可能为 null
     * @return true = 放行，false = 拒绝（编排层会转成一条明确的失败观察结果交给模型）
     */
    boolean allows(AgentToolDefinition tool, AgentToolContext context);
}
