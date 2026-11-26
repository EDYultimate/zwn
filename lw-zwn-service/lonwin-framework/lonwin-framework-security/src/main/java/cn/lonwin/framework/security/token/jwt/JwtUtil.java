package cn.lonwin.framework.security.token.jwt;


import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.text.ParseException;
import cn.lonwin.common.core.utils.StringUtils;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.PlainJWT;
import org.jose4j.keys.AesKey;

public class JwtUtil {
    public static String parseTicket(String ticket, String signKey, String encryptionKey) throws ParseException {
        String clearJwt = null;
        if (StringUtils.hasText(ticket)) {
            if (StringUtils.hasText(signKey)) {
                try {
                    Key signingKey = new AesKey(signKey.getBytes(StandardCharsets.UTF_8));
                    byte[] encoded = EncodingUtils.verifyJwsSignature(signingKey, ticket.getBytes(StandardCharsets.UTF_8));
                    if (encoded != null && encoded.length > 0) {
                        final String encodedObj = new String(encoded, StandardCharsets.UTF_8);
                        if (StringUtils.hasText(encryptionKey)) {
                            Key encryptionKey2 =
                                    EncodingUtils.generateJsonWebKey(encryptionKey);
                            clearJwt = EncodingUtils.decryptJwtValue(encryptionKey2, encodedObj);
                        } else {
                            clearJwt = encodedObj;
                        }
                    } else {
                        throw new ParseException("jwt签名不通过", 0);
                    }
                } catch (Exception e) {
                    throw new ParseException("jwt签名或者解密不正确:" + e.getMessage(), 0);
                }
            } else {
                try {
                    PlainJWT plainJWT = PlainJWT.parse(ticket);
                    JWTClaimsSet jwtClaimsSet = plainJWT.getJWTClaimsSet();
                    clearJwt = jwtClaimsSet.toString();
                } catch (ParseException e) {
                    throw new ParseException("jwt解析异常:" + e.getMessage(), 0);
                }
            }
        }
        return clearJwt;
    }
}
