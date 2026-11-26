package cn.lonwin.module.agent.tool;

import java.util.List;

/**
 * 已扫描到的能力清单集合：{@code @AgentToolContract} 接口 + 其同文件实现 Bean 名。
 *
 * <p>由 {@link AgentToolContractRegistrar} 在 BeanDefinition 注册阶段生成，
 * 供 {@link AgentToolRegistry} 在构造期逐个解析工具方法。
 * 单独抽成 Bean 而不是让注册表自己扫描：扫描只发生一次，注册表只负责组装，职责清晰、也便于测试。
 */
public final class AgentToolContracts {

    /**
     * 一条能力清单。
     *
     * @param apiInterface 契约接口（注解所在处）
     * @param beanName     同文件实现类的 Bean 名，注册表据此取实例执行
     */
    public record Contract(Class<?> apiInterface, String beanName) {
    }

    private final List<Contract> contracts;

    public AgentToolContracts(List<Contract> contracts) {
        this.contracts = contracts == null ? List.of() : List.copyOf(contracts);
    }

    public List<Contract> all() {
        return contracts;
    }

    /** 没有任何能力清单（测试或裁剪部署时的空实现，避免注册表判空） */
    public static AgentToolContracts empty() {
        return new AgentToolContracts(List.of());
    }
}
