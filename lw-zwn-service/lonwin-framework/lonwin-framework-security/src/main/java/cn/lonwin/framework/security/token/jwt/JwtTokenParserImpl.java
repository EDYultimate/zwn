package cn.lonwin.framework.security.token.jwt;

import cn.lonwin.common.core.model.dto.LoginUserDTO;
import cn.lonwin.framework.security.token.TokenParser;
import com.nimbusds.jwt.JWTClaimsSet;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 JWT解析后的内容：
     sub : wanyichen
     CAS_USER_SIGN : 89AEDA7F40447A4B95F584CDA1B618B7
     idCard : 53252219871113031X
     isPublicAccount : false
     iss : https://id.hwcc.com.cn/cas
     tgtId : TGT-15784-UI6o20-Q8Fw5fizzco6r37z4JH-AmUgFNOgieb3Nvykcw74nHgvRGJyJhgAG56WRhSI-localhost
     authWay : 0
     loginTime : 1778663387364
     longTermAuthenticationRequestTokenUsed : false
     employee_status : 1
     exp : Thu May 14 01:09:47 CST 2026
     iat : Wed May 13 17:09:47 CST 2026
     jti : ST-23192-zQWQ9S1pLhZLI-piAQxiDYfUBss-localhost
     email :
     st : ST-23192-zQWQ9S1pLhZLI-piAQxiDYfUBss-localhost
     isFromNewLogin : true
     employeenum : wanyichen
     authenticationDate : 2026-05-13T09:09:47.336200Z
     successfulAuthenticationHandlers : cimsAuthenticationHandler
     businessStatus :
     sort : 1
     userId : 7985dab96e1442c18ef230ca40530f03
     realname : 万意琛
     credentialType : CimsCredential
     aud : [http://10.3.70.34:8086/]
     accountId : 850dfdd8787d4a4ca6f4c3ffd2328979
     phone : xxxx
     authenticationMethod : cimsAuthenticationHandler
     account : wanyichen
 */
@Component
public class JwtTokenParserImpl implements TokenParser {
    private final JwtProperties autoconfig;

    public JwtTokenParserImpl(JwtProperties autoconfig) {
        this.autoconfig = autoconfig;
    }
    @Override
    public LoginUserDTO parse(String token) {
        // JWT 解析逻辑
        try {
            String jwt = JwtUtil.parseTicket(token, autoconfig.getSigningKey(), autoconfig.getEncryptionKey());
            JWTClaimsSet jwtclims = JWTClaimsSet.parse(jwt);
            Map<String,Object> user = new HashMap<>();
            for(String key:jwtclims.getClaims().keySet()){
                user.put(key,jwtclims.getClaims().get(key));
            }
            // 处理过期
            Date date= jwtclims.getExpirationTime();
            if(date.before(new Date())){
                return null;
            }

            return LoginUserDTO.builder()
                    .userId(user.getOrDefault("userId","").toString())
                    .userCode(user.getOrDefault("account","").toString())
                    .userName(user.getOrDefault("realname","").toString())
                    .phone(user.getOrDefault("phone","").toString())
                    .sort(0)
                    .roles(List.of())
                    .permissions(List.of())
                    .tokenType("jwt")
                    .build();
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    // 测试，一个芯盾的JWTtoken为：Token
    // eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.ZXlKNmFYQWlPaUpFUlVZaUxDSmhiR2NpT2lKa2FYSWlMQ0psYm1NaU9pSkJNVEk0UTBKRExVaFRNalUySWl3aVkzUjVJam9pU2xkVUlpd2lkSGx3SWpvaVNsZFVJbjAuLlExb0piTkxZZXdpU0NmRXRBN0NQSlEuX3VtVzVXR0VsM014RURmRVJHaFVCdTA1OHlETGFIVFFWMy1IZzdPdEdCd19jbDVPUzRUbUxYTTNacHprZ1hsUVV3c192aXNaTWQxOGttbnY2VWJ4NUF5MVA2MzluZ3ZqUFotWWc4OUFiZlVEa0tMSEhCa0dwc2hpQnpVLXRTUy1kaTN1WkZmSW9Pb3dBQjFJcnJqUEdCbkxXS1ZCblVUNTNpb2VaanB6Yk90RVB0eXZuLTV5UnRGNW1XOHp3U3g5a2d4QTNGbXlxcDU3TkFaU1luMDhxbWhIcmxlNWk5MS1nVjQ4d2RFLVdpVm9oR1FMcHJHWG5XX21sM3VkYi1XSjZMWWREVk5TRVU3dEZFZXhBbHNYSElISFB3ZTMyeHdZOEkxY1VIQkR5Z3V5NkZyT2M5OThrMDNIOHhCaXRmMFcwNGhnQUl3c3ZuZ21teUFSdjhTY3ZXQm96UjZwdE9OYkJwSm9iYzN2VWdDSjdlMjVYQ3I3cE5ELUJHbGxITlhuZDZvdXB4ZmpPVm42dUtLY0FPT3JPTXlSc3BCelhuWVRqNFJYRDhOYjFBWTRaMEk0ejN6MUo1V1RVYkhFc0k0NlJTTFBha2VWNE9GdkxVYlBKRkVLbGFlVzNJNEhMMzlnUmx3OGlXNy14RV9HOXJ2QXZJNzl5V2pEU3dmYzNrdjd6T1c3UTNtU1ZZbFJFc0Z1OEVnZ0E5ZkFicWdXY0R6d29XTFktYmhhYkZ5X3VzaWtVMFZ5RUxLY3Z2UEVkcXcyOVEySTJXb205S0dkc3YwbDctLUlCLTN5N09sZWFxZDRZRXAzY19hM2ZPQW9IY29jbHhGcEk3Q3JCSGd6bDFBd1NEOHRKREQ5bnA3ZlBZVDIwTzlxNVY0U3czX3ExQlNCZFRPa2tDaEVnZ0NXaXdla1hlVHhDcVNQcXlUb2ZCYXA1NHJvV2k5SkxzOU51N3pjc2pERFdHRmpKSlVjWk0zcjZ2ZEtoVnFrZmsxU2FQTU5EN3JGTXl4eVNZem9pUENXRVBUM0VtY3RpTnVLelp0eGE4THdGT08yVEhoaVJrVWF0aFVBTTRlQVhrdnF5UXdYeUNPQ2c3alVBOTZ0MEhJVi52ckVzekIxWlA5YWp5V2pjcnVGV2p3.XbNuN04D5Iqghz7A09uwx1nSGYVq0TNtph1QzN5_3appkNhUN7fLv6sAp4S2u_fGnGfAVqcnGJUPRlKKYbMR1Q
    /**
     解析后的内容：
     * @param args
     * @throws ParseException
     */
    public static void main(String[] args) throws ParseException {
        String token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.ZXlKNmFYQWlPaUpFUlVZaUxDSmhiR2NpT2lKa2FYSWlMQ0psYm1NaU9pSkJNVEk0UTBKRExVaFRNalUySWl3aVkzUjVJam9pU2xkVUlpd2lkSGx3SWpvaVNsZFVJbjAuLlExb0piTkxZZXdpU0NmRXRBN0NQSlEuX3VtVzVXR0VsM014RURmRVJHaFVCdTA1OHlETGFIVFFWMy1IZzdPdEdCd19jbDVPUzRUbUxYTTNacHprZ1hsUVV3c192aXNaTWQxOGttbnY2VWJ4NUF5MVA2MzluZ3ZqUFotWWc4OUFiZlVEa0tMSEhCa0dwc2hpQnpVLXRTUy1kaTN1WkZmSW9Pb3dBQjFJcnJqUEdCbkxXS1ZCblVUNTNpb2VaanB6Yk90RVB0eXZuLTV5UnRGNW1XOHp3U3g5a2d4QTNGbXlxcDU3TkFaU1luMDhxbWhIcmxlNWk5MS1nVjQ4d2RFLVdpVm9oR1FMcHJHWG5XX21sM3VkYi1XSjZMWWREVk5TRVU3dEZFZXhBbHNYSElISFB3ZTMyeHdZOEkxY1VIQkR5Z3V5NkZyT2M5OThrMDNIOHhCaXRmMFcwNGhnQUl3c3ZuZ21teUFSdjhTY3ZXQm96UjZwdE9OYkJwSm9iYzN2VWdDSjdlMjVYQ3I3cE5ELUJHbGxITlhuZDZvdXB4ZmpPVm42dUtLY0FPT3JPTXlSc3BCelhuWVRqNFJYRDhOYjFBWTRaMEk0ejN6MUo1V1RVYkhFc0k0NlJTTFBha2VWNE9GdkxVYlBKRkVLbGFlVzNJNEhMMzlnUmx3OGlXNy14RV9HOXJ2QXZJNzl5V2pEU3dmYzNrdjd6T1c3UTNtU1ZZbFJFc0Z1OEVnZ0E5ZkFicWdXY0R6d29XTFktYmhhYkZ5X3VzaWtVMFZ5RUxLY3Z2UEVkcXcyOVEySTJXb205S0dkc3YwbDctLUlCLTN5N09sZWFxZDRZRXAzY19hM2ZPQW9IY29jbHhGcEk3Q3JCSGd6bDFBd1NEOHRKREQ5bnA3ZlBZVDIwTzlxNVY0U3czX3ExQlNCZFRPa2tDaEVnZ0NXaXdla1hlVHhDcVNQcXlUb2ZCYXA1NHJvV2k5SkxzOU51N3pjc2pERFdHRmpKSlVjWk0zcjZ2ZEtoVnFrZmsxU2FQTU5EN3JGTXl4eVNZem9pUENXRVBUM0VtY3RpTnVLelp0eGE4THdGT08yVEhoaVJrVWF0aFVBTTRlQVhrdnF5UXdYeUNPQ2c3alVBOTZ0MEhJVi52ckVzekIxWlA5YWp5V2pjcnVGV2p3.XbNuN04D5Iqghz7A09uwx1nSGYVq0TNtph1QzN5_3appkNhUN7fLv6sAp4S2u_fGnGfAVqcnGJUPRlKKYbMR1Q";
        String  encryptionKey = "SCohMtxkDqIt8v0VR5FVK2g8CT8DlxYy7cXO43ypMJo";
        String signKey= "4Qy93T0Cea_s5J1IM8d_NZknAKVka_d7p_Inkm1WMckboJWBbte9JuxuUIaYgUg72WDwYhwGrqWKeW1ba6OVVQ";
        String jwt = JwtUtil.parseTicket(token, signKey, encryptionKey);
        JWTClaimsSet jwtclims = JWTClaimsSet.parse(jwt);
        Map<String,Object> user = new HashMap<>();
        for(String key:jwtclims.getClaims().keySet()){
            user.put(key,jwtclims.getClaims().get(key));
            System.out.println(key+" : " + jwtclims.getClaims().get(key));
        }
    }
}