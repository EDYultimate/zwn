package cn.lonwin.module.agent.support;

import java.util.LinkedHashSet;
import java.util.Set;

import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;

import cn.lonwin.common.core.config.AuthProperties;
import cn.lonwin.common.core.constant.AuthModeEnum;
import cn.lonwin.framework.security.cache.TokenCacheService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

/**
 * 功能权限判定：把权限系统下发的 actList 抽成可复用的判定能力。
 *
 * <p>既服务于 HTTP 接口拦截器（{@code ActUrlPermissionInterceptor}），
 * 也服务于「工具级」权限校验（{@code AgentToolPermissionChecker}）——
 * 否则同一个工具可能被接口放行、却被模型直接调用绕过按钮权限。
 *
 * <p>token 取值方式与 {@code GlobalAuthenticationFilter} 严格保持一致。
 */
@Component
@RequiredArgsConstructor
public class ActUrlAuthority {

    /** actList 中代表「全部权限」的通配值 */
    private static final Set<String> WILDCARD_PERMISSIONS = Set.of("*", "ALL");

    private final AuthProperties authProperties;
    private final TokenCacheService tokenCacheService;

    /** 只有 POWERS 模式才下发 actList，其余模式（NONE/JWT/OAUTH2）不做功能权限校验 */
    public boolean powersMode() {
        return authProperties.getMode() == AuthModeEnum.POWERS;
    }

    /**
     * 当前调用是否具备做权限过滤的条件：POWERS 模式 + 能取到 token。
     *
     * <p>为什么要单独判定，而不是「没有权限就过滤掉」：非 HTTP 线程（内部 {@code ask()} 调用、
     * 定时任务、单元测试）取不到请求上下文，actList 恒为空，若直接按空集过滤会把整份能力清单清空，
     * 表现为「所有页面忽然都不能跳了」。宁可在无法判定的场景放行，由接口级 {@code @RequireActUrl}
     * 保证入口权限，也不要在无上下文时误杀。
     */
    public boolean canFilter() {
        return powersMode() && StringUtils.hasText(currentToken());
    }

    /** 当前请求是否拥有任意一个所需权限 */
    public boolean ownsAny(String... required) {
        if (required == null || required.length == 0) {
            return true;
        }
        Set<String> owned = currentActUrls();
        if (owned.isEmpty()) {
            return false;
        }
        if (owned.stream().anyMatch(WILDCARD_PERMISSIONS::contains)) {
            return true;
        }
        for (String url : required) {
            if (owned.contains(url)) {
                return true;
            }
        }
        return false;
    }

    /** 当前请求上下文的 actList（非 HTTP 线程返回空集合） */
    public Set<String> currentActUrls() {
        String token = currentToken();
        if (!StringUtils.hasText(token)) {
            return Set.of();
        }
        Set<String> urls = actUrls(token);
        return urls == null ? Set.of() : urls;
    }

    /** 当前请求的 token（非 HTTP 线程返回 null） */
    public String currentToken() {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return null;
        }
        return resolveToken(attributes.getRequest());
    }

    /**
     * 取 token 对应的 actList。
     *
     * @return null 表示缓存中没有任何权限信息（需提示重新登录），空集合表示确实无权限
     */
    public Set<String> actUrls(String token) {
        JSONArray actList = tokenCacheService.getActAuth(token);
        if (actList == null) {
            return null;
        }
        Set<String> urls = new LinkedHashSet<>();
        for (int i = 0; i < actList.size(); i++) {
            JSONObject item = actList.getJSONObject(i);
            if (item == null) {
                continue;
            }
            String url = item.getString("URL");
            if (StringUtils.hasText(url)) {
                urls.add(url.trim());
            }
        }
        return urls;
    }

    /** 与 GlobalAuthenticationFilter 一致：Authorization: Bearer xxx / token / Token */
    public static String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(bearer) && bearer.regionMatches(true, 0, "Bearer ", 0, 7)) {
            return bearer.substring(7).trim();
        }
        String token = request.getHeader("token");
        if (!StringUtils.hasText(token)) {
            token = request.getHeader("Token");
        }
        return StringUtils.hasText(token) ? token.trim() : bearer;
    }
}
