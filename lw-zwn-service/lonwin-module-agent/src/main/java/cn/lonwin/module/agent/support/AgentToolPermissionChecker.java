package cn.lonwin.module.agent.support;

import java.util.List;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Component;

import cn.lonwin.module.agent.config.AgentProperties;
import cn.lonwin.module.agent.tool.AgentToolContext;
import cn.lonwin.module.agent.tool.AgentToolDefinition;
import lombok.extern.slf4j.Slf4j;

/**
 * 工具侧权限门面：把「一键开关 / 自定义策略 / 原有 ActUrl 校验」收编到同一个入口。
 *
 * <p>为什么接口级 {@code @RequireActUrl} 不够：模型可以直接输出工具指令，绕过前端按钮显隐；
 * 工具执行前必须再校验一次，否则等于开了一个后门。
 *
 * <h3>三层决策（自上而下短路）</h3>
 * <ol>
 *   <li><b>总开关</b>：{@code lonwin.agent.tools.permission.enabled=false}（默认）时直接放行，
 *       不解析策略 Bean、不查权限系统，零开销；这就是「权限一键关闭」。</li>
 *   <li><b>自定义策略</b>：开关打开且容器里提供了 {@link AgentToolAccessPolicy} Bean 时，
 *       完全由它决定，便于将来接组织/角色/数据范围规则。</li>
 *   <li><b>默认校验</b>：没有自定义策略时回落到原有规则——
 *       非 POWERS 模式放行、工具未声明 permissions 只受登录态保护、否则 actList 需命中其一。</li>
 * </ol>
 *
 * <p>单位数据权限仍由 {@code DataScopeAspect} 独立处理，两者互不干扰。
 * 知识侧检索按当前设计不做权限过滤，也不经过本类。
 */
@Slf4j
@Component
public class AgentToolPermissionChecker {

    private final ActUrlAuthority actUrlAuthority;
    private final AgentProperties properties;
    private final ObjectProvider<AgentToolAccessPolicy> policies;

    public AgentToolPermissionChecker(ActUrlAuthority actUrlAuthority,
                                      AgentProperties properties,
                                      ObjectProvider<AgentToolAccessPolicy> policies) {
        this.actUrlAuthority = actUrlAuthority;
        this.properties = properties;
        this.policies = policies;
    }

    /** 编排层现有调用点保持不变（同步链路无用户上下文时传 null） */
    public boolean allows(AgentToolDefinition tool) {
        return allows(tool, null);
    }

    /**
     * 统一决策入口。带上下文的重载留给将来需要「按用户判权」的实现使用。
     */
    public boolean allows(AgentToolDefinition tool, AgentToolContext context) {
        // 1) 一键关闭：连策略 Bean 都不解析，纯功能阶段零开销
        if (!properties.getTools().getPermission().isEnabled()) {
            return true;
        }

        // 2) 自定义策略优先；ObjectProvider 懒解析，没有实现时不会启动失败
        AgentToolAccessPolicy policy = policies.getIfAvailable();
        if (policy != null) {
            return policy.allows(tool, context);
        }

        // 3) 默认规则：维持系统原有的 ActUrl 功能权限校验
        List<String> required = tool.getPermissions();
        if (required == null || required.isEmpty()) {
            return true;
        }
        if (!actUrlAuthority.powersMode()) {
            return true;
        }
        boolean allowed = actUrlAuthority.ownsAny(required.toArray(String[]::new));
        if (!allowed) {
            log.warn("[agent-tool] 无权限调用工具 {}，需要权限 {}，当前持有 {}",
                    tool.getName(), required, actUrlAuthority.currentActUrls());
        }
        return allowed;
    }
}
