package cn.lonwin.module.system.menu.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 菜单推送系统配置
 * 对应 application.yml 中 lonwin.menu-push 配置节
 *
 * @author lonwin
 */
@Component
@ConfigurationProperties(prefix = "lonwin.menu-push")
@Data
public class MenuPushProperties {

    /** 菜单系统基础地址 */
    private String baseUrl;

    /** 推送菜单接口路径（相对 baseUrl，默认 /api/menu/push） */
    private String pushUrl = "/api/menu/push";

    /** 获取导航路径前缀接口路径（相对 baseUrl，默认 /api/menu/prefixMenu） */
    private String prefixUrl = "/api/menu/prefixMenu";

    /** 业务系统在菜单系统注册的账号 */
    private String apiKey;

    /**
     * 菜单系统分配的 apiSecret（base64 编码的 RSA 公钥）
     * 用于对 timestamp 进行 RSA 非对称加密，生成 sign
     */
    private String apiSecret;

    /** 时间戳防重放有效期（毫秒，默认 5 分钟） */
    private long timestampValidMillis = 5 * 60 * 1000L;

    /** HTTP 连接超时（毫秒） */
    private int connectTimeoutMs = 5000;

    /** HTTP 读取超时（毫秒） */
    private int readTimeoutMs = 15000;
}
