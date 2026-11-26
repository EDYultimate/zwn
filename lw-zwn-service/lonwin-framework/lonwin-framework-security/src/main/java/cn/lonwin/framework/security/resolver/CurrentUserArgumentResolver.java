package cn.lonwin.framework.security.resolver;

import cn.lonwin.common.core.context.UserContext;
import cn.lonwin.common.core.model.dto.LoginUserDTO;
import cn.lonwin.framework.security.annotation.CurrentUser;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        // 只支持带有 @CurrentUser 注解的参数
        return parameter.hasParameterAnnotation(CurrentUser.class)
                && parameter.getParameterType().isAssignableFrom(LoginUserDTO.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) {

        HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);
        if (request == null) {
            return null;
        }
        // 在GlobalAuthenticationFilter中设置用户 
        return UserContext.get();
    }
}