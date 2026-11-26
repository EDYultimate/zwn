package cn.lonwin.module.system.file.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 外部系统文件访问（open API）配置
 * 对应 application.yml 中 lonwin.open-file 配置节
 * <p>
 * 鉴权模式与菜单推送（lonwin.menu-push）一致：apiKey + timestamp + sign
 * 区别：本系统作为服务端持有 base64 编码的 RSA 私钥，对外发放公钥；
 * 外部系统用公钥对 timestamp 加密生成 sign，本系统用私钥解密验签
 *
 * @author lonwin
 */
@Component
@ConfigurationProperties(prefix = "lonwin.open-file")
@Data
public class OpenFileProperties {

    /** 是否启用外部文件访问接口（默认关闭，安全起见需显式开启） */
    private boolean enabled = false;

    /** 分配给外部系统的访问账号 */
    private String apiKey;

    /**
     * 本系统的 apiSecret（base64 编码的 RSA 私钥）
     * 外部系统持有对应公钥，对 timestamp RSA 加密生成 sign
     */
    private String apiSecret;

    /** 时间戳防重放有效期（毫秒，默认 5 分钟） */
    private long timestampValidMillis = 5 * 60 * 1000L;
}
