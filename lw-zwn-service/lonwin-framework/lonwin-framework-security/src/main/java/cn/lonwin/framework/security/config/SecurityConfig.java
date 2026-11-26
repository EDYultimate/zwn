package cn.lonwin.framework.security.config;

import cn.lonwin.framework.security.filter.GlobalAuthenticationFilter;
import cn.lonwin.framework.security.handler.AuthEntryPoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
               GlobalAuthenticationFilter globalAuthenticationFilter) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth ->
                        auth
                                .requestMatchers("/api/auth/**").permitAll()

                                // ✅ 外部系统 open API（文件访问等），放行后由接口内 apiKey+sign 自行验签
                                .requestMatchers("/api/open/**").permitAll()

                                // ✅ 知识库原文查看（问答正文里的文档角标会在新标签页打开，
                                //    浏览器不带 Authorization 头，因此必须免鉴权）。
                                //    接口内部用 file.view.allowed-prefixes 白名单限制可访问对象，
                                //    与 knowledge-platform 的 /resourceShow/** 放行策略一致。
                                .requestMatchers(
                                        "/docFiles/**",
                                        "/imgFiles/**",
                                        "/resourceShow/**"
                                ).permitAll()

                                // ✅ 视频监控截图图片：<img> 标签直连不带 Authorization 头，
                                //    接口内部用「必须在截图根目录内 + 图片后缀白名单」限制可访问文件
                                .requestMatchers(
                                        "/video/snapshots/image",
                                        "/video/snapshots/download"
                                ).permitAll()

                                // ✅ Swagger / OpenAPI 放行
                                .requestMatchers(
                                        "/swagger-ui.html",
                                        "/swagger-ui/**",
                                        "/v3/api-docs/**",
                                        "/v2/api-docs",
                                        "/v2/api-docs-ext",
                                        "/webjars/**"
                                ).permitAll()

                                // 其他请求必须认证
                                .anyRequest().authenticated()
                )
                .exceptionHandling(ex ->
                        ex.authenticationEntryPoint(new AuthEntryPoint())
                )
                // Spring Security 的 Filter 顺序是固定链表：
                /*
                SecurityContextPersistenceFilter
                ↓
                UsernamePasswordAuthenticationFilter
                ↓
                ExceptionTranslationFilter
                ↓
                FilterSecurityInterceptor
你告诉 Spring：把我这个 Filter 插在 UsernamePasswordAuthenticationFilter 之前
                 */
                .addFilterBefore(
                        globalAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}