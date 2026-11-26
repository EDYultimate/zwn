package cn.lonwin.module.agent.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import cn.lonwin.module.agent.tool.AgentToolContractRegistrar;

/**
 * 打开「能力清单自动注册」：只做一件事——把 {@link AgentToolContractRegistrar} 引入容器。
 *
 * <p>单独建一个配置类而不是塞进 {@code AgentWebMvcConfig}：
 * 前者是「工具契约的装配」，后者是「Web 拦截器」，混在一起会让排查启动问题时找不到入口。
 *
 * <p>新增能力清单<b>不需要</b>改这里：注册器会自行扫描 {@code feignclient} 包。
 */
@Configuration
@Import(AgentToolContractRegistrar.class)
public class AgentToolContractConfig {
}
