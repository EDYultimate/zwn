package cn.lonwin.framework.security.token.powers;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 权限系统的相关配置类。
 */
@Component
@ConfigurationProperties(prefix = "lonwin.auth.powers")
@Data
public class PowersProperties {
    private String baseUrl;
    private String account;
    private String publicKey;
    private String accountName;
    private String syncLogUrl;
}
