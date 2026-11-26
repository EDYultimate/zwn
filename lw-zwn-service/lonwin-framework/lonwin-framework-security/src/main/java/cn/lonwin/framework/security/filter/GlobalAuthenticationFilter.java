package cn.lonwin.framework.security.filter;

import cn.lonwin.common.core.config.AuthProperties;
import cn.lonwin.common.core.constant.AuthModeEnum;
import cn.lonwin.common.core.context.UserContext;
import cn.lonwin.common.core.model.dto.LoginUserDTO;
import cn.lonwin.common.core.utils.StringUtils;
import cn.lonwin.common.core.utils.UUIDUtils;
import cn.lonwin.framework.security.adapter.AuthorityAdapter;
import cn.lonwin.framework.security.cache.TokenCacheService;
import cn.lonwin.framework.security.token.TokenParser;
import cn.lonwin.framework.security.token.TokenParserSelector;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

/**
 * 权限的过滤器, 用于解析token并设置用户信息到上下文。
 */
@Component
public class GlobalAuthenticationFilter extends OncePerRequestFilter {

    private final TokenParserSelector selector;
    private final AuthProperties authProperties;
    private final TokenCacheService tokenCacheService;
    public GlobalAuthenticationFilter(TokenParserSelector selector,
                                      AuthProperties authProperties,
                                      TokenCacheService tokenCacheService) {
        this.selector = selector;
        this.authProperties = authProperties;
        this.tokenCacheService = tokenCacheService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws IOException, ServletException {

        try {
            if(authProperties.getMode() == AuthModeEnum.NONE){
                // 如果配置为不需要登录，用模拟用户
                LoginUserDTO user = LoginUserDTO.builder()
                        .userId(UUIDUtils.generateUUID())
                        .userCode("testUserCode")
                        .userName("testUserName")
                        .sort(0)
                        .roles(List.of())
                        .permissions(List.of())
                        .tokenType("NONE")
                        .build();

                // 设置业务上下文
                UserContext.set(user);

                // 告诉 Spring Security 已认证
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                AuthorityAdapter.toAuthorities(user)
                        );
                SecurityContextHolder.getContext().setAuthentication(authentication);
                request.getSession().setAttribute("userinfo", user);
            }else{
                String token = resolveToken(request);
                if (token != null) {
                    // 1.从缓存获取
                    LoginUserDTO user = tokenCacheService.getUser(token);

                    // 2.缓存未命中，解析token
                    if (user == null) {
                        TokenParser parser = selector.select(authProperties.getMode());
                        user = parser.parse(token);
                        tokenCacheService.putUser(token, user);
                    }

                    // 3.设置业务上下文
                    UserContext.set(user);

                    // 4.关键：告诉 Spring Security 已认证
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    user,
                                    null,
                                    AuthorityAdapter.toAuthorities(user)
                            );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    request.getSession().setAttribute("userinfo", user);
                }
            }
            chain.doFilter(request, response);
        } finally {
            UserContext.clear();
            SecurityContextHolder.clearContext();
        }
    }

    private String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader(HttpHeaders.AUTHORIZATION);
        if(bearer == null || StringUtils.isEmpty(bearer)){
            bearer = request.getHeader("token");
        }
        if(bearer == null || StringUtils.isEmpty(bearer)){
            bearer = request.getHeader("Token");
        }
        if (bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return bearer;
    }
}