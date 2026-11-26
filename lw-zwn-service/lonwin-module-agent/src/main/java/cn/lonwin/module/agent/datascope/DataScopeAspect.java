package cn.lonwin.module.agent.datascope;

import java.util.concurrent.atomic.AtomicBoolean;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import cn.lonwin.common.core.context.UserContext;
import cn.lonwin.common.core.model.dto.LoginUserDTO;
import cn.lonwin.module.agent.config.AgentProperties;
import cn.lonwin.module.agent.support.AgentDataScope;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 数据权限切面：在 {@link DataScope} 标注的调用入口处建立单位上下文。
 *
 * <p>它只做三件事，且都可被开关控制：
 * <ol>
 *   <li><b>开关</b>：{@code lonwin.agent.data-scope.enabled=false} 时直接放行，
 *       不解析、不注入，业务代码读到的单位恒为 {@code null}，等价于「无数据权限」；</li>
 *   <li><b>登记</b>：把「如何取单位」登记到 {@link DataScopeContext}（惰性，不立即查权限系统）；</li>
 *   <li><b>清理</b>：{@code finally} 中恢复上一个范围，杜绝线程池复用导致的越权串数据。</li>
 * </ol>
 *
 * <p>顺序设为最高优先级之一：必须早于事务、MyBatis 拦截器、远程调用，否则数据访问已经发生，
 * 再设置范围就晚了。
 */
@Slf4j
@Aspect
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 100)
@RequiredArgsConstructor
public class DataScopeAspect {

    private final AgentProperties properties;
    private final AgentDataScope agentDataScope;

    /** 关闭态只提示一次，避免每个请求刷日志 */
    private final AtomicBoolean disabledLogged = new AtomicBoolean(false);

    @Around("@annotation(cn.lonwin.module.agent.datascope.DataScope) "
            + "|| @within(cn.lonwin.module.agent.datascope.DataScope)")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        AgentProperties.DataScope config = properties.getDataScope();
        if (!config.isEnabled()) {
            if (disabledLogged.compareAndSet(false, true)) {
                log.info("[agent] 数据权限切面已关闭（lonwin.agent.data-scope.enabled=false），查询不做单位过滤");
            }
            return joinPoint.proceed();
        }

        LoginUserDTO user = UserContext.get();
        DataScopeContext.Scope previous = DataScopeContext.open(
                user == null ? null : user.getUserCode(),
                () -> resolveUnitCode(config));
        try {
            return joinPoint.proceed();
        } finally {
            DataScopeContext.restore(previous);
        }
    }

    /**
     * 解析当前用户单位编码。
     *
     * <p>非严格模式（默认）解析不到时只告警并放行，保证「功能优先」阶段不被权限数据缺失卡死；
     * 严格模式下复用 {@link AgentDataScope#resolveUnitCode()} 抛出带指引的 403。
     */
    private String resolveUnitCode(AgentProperties.DataScope config) {
        String unitCode = agentDataScope.resolveUnitCodeOrNull();
        if (unitCode == null && config.isStrict()) {
            // 这里一定会抛 BusinessException，异常信息里带有「请在权限系统配置所属单位」的指引
            return agentDataScope.resolveUnitCode();
        }
        return unitCode;
    }
}
