package cn.lonwin.module.agent.support;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;

import cn.lonwin.module.agent.config.AgentProperties;
import cn.lonwin.module.agent.tool.AgentToolDefinition;

/**
 * 工具侧轻量权限门面：一键关闭 / 自定义策略 / 回落 ActUrl 三层决策。
 *
 * <p>核心保证是「关掉开关时连接口都不调用」，这样纯功能阶段没有任何权限系统开销；
 * 知识侧不经过本类，因此这里不出现任何 Qdrant / 向量相关内容。
 */
class AgentToolPermissionCheckerTest {

    private static AgentToolDefinition tool(List<String> permissions) {
        return AgentToolDefinition.builder()
                .name("water.transfer.annual")
                .title("年度调水量")
                .permissions(permissions)
                .build();
    }

    @SuppressWarnings("unchecked")
    private static ObjectProvider<AgentToolAccessPolicy> provider(AgentToolAccessPolicy policy) {
        ObjectProvider<AgentToolAccessPolicy> provider = mock(ObjectProvider.class);
        when(provider.getIfAvailable()).thenReturn(policy);
        return provider;
    }

    private static AgentProperties properties(boolean permissionEnabled) {
        AgentProperties properties = new AgentProperties();
        properties.getTools().getPermission().setEnabled(permissionEnabled);
        return properties;
    }

    @Test
    @DisplayName("开关关闭：直接放行，不解析策略 Bean、不查 ActUrl")
    void disabledShortCircuitsEverything() {
        ActUrlAuthority act = mock(ActUrlAuthority.class);
        @SuppressWarnings("unchecked")
        ObjectProvider<AgentToolAccessPolicy> policies = mock(ObjectProvider.class);

        AgentToolPermissionChecker checker =
                new AgentToolPermissionChecker(act, properties(false), policies);

        assertThat(checker.allows(tool(List.of("ACT_WATER")))).isTrue();
        verifyNoInteractions(act, policies);
    }

    @Test
    @DisplayName("开关打开且有自定义策略：完全由策略决定，不再走 ActUrl")
    void customPolicyWins() {
        ActUrlAuthority act = mock(ActUrlAuthority.class);
        AgentToolAccessPolicy policy = (tool, context) -> false;

        AgentToolPermissionChecker checker =
                new AgentToolPermissionChecker(act, properties(true), provider(policy));

        assertThat(checker.allows(tool(List.of("ACT_WATER")), null)).isFalse();
        verifyNoInteractions(act);
    }

    @Test
    @DisplayName("开关打开无自定义策略：回落 ActUrl，权限不足时拒绝")
    void fallsBackToActUrlWhenNoPolicyBean() {
        ActUrlAuthority act = mock(ActUrlAuthority.class);
        when(act.powersMode()).thenReturn(true);
        when(act.ownsAny(any(String[].class))).thenReturn(false);

        AgentToolPermissionChecker checker =
                new AgentToolPermissionChecker(act, properties(true), provider(null));

        assertThat(checker.allows(tool(List.of("ACT_WATER")))).isFalse();
        verify(act).ownsAny(any(String[].class));
    }

    @Test
    @DisplayName("未声明 permissions 的工具：开启权限也只需登录态，不查权限系统")
    void toolWithoutPermissionsNeedsOnlyLogin() {
        ActUrlAuthority act = mock(ActUrlAuthority.class);

        AgentToolPermissionChecker checker =
                new AgentToolPermissionChecker(act, properties(true), provider(null));

        assertThat(checker.allows(tool(List.of()))).isTrue();
        verify(act, never()).powersMode();
    }

    @Test
    @DisplayName("非 POWERS 模式：即使工具声明了权限也放行（保持原有系统行为）")
    void nonPowersModeAllows() {
        ActUrlAuthority act = mock(ActUrlAuthority.class);
        when(act.powersMode()).thenReturn(false);

        AgentToolPermissionChecker checker =
                new AgentToolPermissionChecker(act, properties(true), provider(null));

        assertThat(checker.allows(tool(List.of("ACT_WATER")))).isTrue();
        verify(act, never()).ownsAny(any(String[].class));
    }
}
