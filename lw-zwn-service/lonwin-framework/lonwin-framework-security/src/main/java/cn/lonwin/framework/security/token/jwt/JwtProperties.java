package cn.lonwin.framework.security.token.jwt;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "lonwin.auth.jwt")
public class JwtProperties {
    private String encryptionKey;
    private String signingKey;

    public String getEncryptionKey() {
        return encryptionKey;
    }

    public void setEncryptionKey(String encryptionKey) {
        this.encryptionKey = encryptionKey;
    }

    public String getSigningKey() {
        return signingKey;
    }

    public void setSigningKey(String signingKey) {
        this.signingKey = signingKey;
    }
}
