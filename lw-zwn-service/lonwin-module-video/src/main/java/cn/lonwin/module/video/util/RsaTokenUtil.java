package cn.lonwin.module.video.util;

import javax.crypto.Cipher;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

/**
 * 视频监控平台 sptoken 生成工具。
 * <p>
 * 平台要求：用分配的 RSA 公钥加密「本机IP&amp;&amp;yyyy-MM-dd HH:mm:ss」后做 Base64 编码。
 * 仅依赖 JDK，避免引入 tomcat / commons-codec 的传递依赖。
 */
public final class RsaTokenUtil {

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private RsaTokenUtil() {
    }

    /**
     * 生成 sptoken
     *
     * @param ip        本机 IP
     * @param publicKey Base64 编码的 X509 RSA 公钥
     * @return Base64 密文
     */
    public static String getToken(String ip, String publicKey) {
        try {
            String content = ip + "&&" + LocalDateTime.now().format(FORMATTER);
            byte[] keyBytes = Base64.getDecoder().decode(publicKey.trim());
            PublicKey key = KeyFactory.getInstance("RSA")
                    .generatePublic(new X509EncodedKeySpec(keyBytes));
            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.ENCRYPT_MODE, key);
            return Base64.getEncoder().encodeToString(
                    cipher.doFinal(content.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException("生成视频平台 sptoken 失败：" + e.getMessage(), e);
        }
    }
}
