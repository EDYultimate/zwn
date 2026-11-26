package cn.lonwin.common.core.context;

import cn.lonwin.common.core.model.dto.LoginUserDTO;

/**
 * 用户信息上下文
 */
public class UserContext {

    private static final ThreadLocal<LoginUserDTO> CONTEXT = new ThreadLocal<>();

    public static void set(LoginUserDTO user) {
        CONTEXT.set(user);
    }

    public static LoginUserDTO get() {
        return CONTEXT.get();
    }

    public static void clear() {
        CONTEXT.remove();
    }
}