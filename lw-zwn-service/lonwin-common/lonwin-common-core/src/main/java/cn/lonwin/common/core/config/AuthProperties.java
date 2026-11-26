package cn.lonwin.common.core.config;

import cn.lonwin.common.core.constant.AuthModeEnum;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 登录方式，从配置文件lonwin.auth.mode读取值。
 */
@Component
@ConfigurationProperties(prefix = "lonwin.auth")
public class AuthProperties {

    private AuthModeEnum mode = AuthModeEnum.JWT;

    public AuthModeEnum getMode() {
        return mode;
    }

    public void setMode(AuthModeEnum mode) {
        this.mode = mode;
    }
}