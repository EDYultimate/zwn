package cn.lonwin.module.agent.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import cn.lonwin.module.agent.interceptor.ActUrlPermissionInterceptor;
import lombok.RequiredArgsConstructor;

/**
 * 注册功能权限拦截器，只作用于本模块接口，避免影响其他模块的现有行为。
 */
@Configuration
@RequiredArgsConstructor
public class AgentWebMvcConfig implements WebMvcConfigurer {

    private final ActUrlPermissionInterceptor actUrlPermissionInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Controller 实际路径是 /agent/**（context-path=/，前端 /api 前缀由代理去掉）；
        // 两个前缀都注册，兼容「代理保留 /api」与「直连后端」两种部署方式，
        // 否则 POWERS 模式下 @RequireActUrl 对新增的配置接口不会生效。
        registry.addInterceptor(actUrlPermissionInterceptor)
                .addPathPatterns("/agent/**", "/api/agent/**");
    }
}
