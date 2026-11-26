package cn.lonwin.module.agent.interceptor;

import java.io.IOException;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.Set;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.module.agent.annotation.RequireActUrl;
import cn.lonwin.module.agent.support.ActUrlAuthority;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 功能权限拦截器：把「权限系统下发的 actList」变成后端可执行的校验。
 *
 * <p>项目现状是功能权限只下发前端做显隐，后端没有校验；本拦截器为 agent 模块的接口补上这一环：
 * 只有标注了 {@link RequireActUrl} 的接口才校验，其余接口仍只受全局登录态保护，不影响现有行为。
 *
 * <p>token 解析与 actList 读取统一由 {@link ActUrlAuthority} 提供，
 * 与工具级权限校验共用同一套判定逻辑，避免两边规则漂移。
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ActUrlPermissionInterceptor implements HandlerInterceptor {

    /** actList 中代表「全部权限」的通配值 */
    private static final Set<String> WILDCARD_PERMISSIONS = Set.of("*", "ALL");

    private final ActUrlAuthority actUrlAuthority;
    private final ObjectMapper objectMapper;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws IOException {
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }
        RequireActUrl requireActUrl = resolveAnnotation(handlerMethod);
        if (requireActUrl == null) {
            return true;
        }
        // 只有 POWERS 模式才会下发 actList；NONE(开发)/JWT/OAUTH2 模式下放行，避免误伤
        if (!actUrlAuthority.powersMode()) {
            return true;
        }

        String token = ActUrlAuthority.resolveToken(request);
        if (!StringUtils.hasText(token)) {
            return reject(response, 401, "未获取到登录 token");
        }

        Set<String> owned = actUrlAuthority.actUrls(token);
        if (owned == null) {
            return reject(response, 403, "未获取到功能权限信息，请重新登录");
        }

        String[] required = requireActUrl.value().length > 0
                ? requireActUrl.value()
                : new String[]{request.getRequestURI()};

        boolean allowed = owned.stream().anyMatch(WILDCARD_PERMISSIONS::contains)
                || java.util.Arrays.stream(required).anyMatch(owned::contains);
        if (allowed) {
            return true;
        }

        log.warn("功能权限校验未通过, uri={}, required={}, owned={}", request.getRequestURI(),
                java.util.Arrays.toString(required), owned);
        return reject(response, 403, "无权限访问该功能");
    }

    /** 方法上的注解优先，其次类上的 */
    private RequireActUrl resolveAnnotation(HandlerMethod handlerMethod) {
        Method method = handlerMethod.getMethod();
        RequireActUrl annotation = method.getAnnotation(RequireActUrl.class);
        if (annotation != null) {
            return annotation;
        }
        return handlerMethod.getBeanType().getAnnotation(RequireActUrl.class);
    }

    /** 统一以 Result 结构返回，前端按 code 处理 */
    private boolean reject(HttpServletResponse response, int code, String message) throws IOException {
        response.setStatus(code);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(Result.fail(code, message)));
        return false;
    }
}
