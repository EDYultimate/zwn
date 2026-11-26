package cn.lonwin.framework.security.token.powers;

import cn.lonwin.common.core.model.dto.LoginUserDTO;
import cn.lonwin.framework.security.cache.TokenCacheService;
import cn.lonwin.framework.security.token.TokenParser;
import com.alibaba.fastjson2.JSONArray;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * 权限系统的token，解析。
 */
@Component
public class PowersTokenParserImpl implements TokenParser {
    private final TokenCacheService tokenCacheService;
    private final PowersProperties powersProperties;
    public PowersTokenParserImpl(TokenCacheService tokenCacheService,
                                 PowersProperties powersProperties) {
        this.tokenCacheService = tokenCacheService;
        this.powersProperties = powersProperties;
    }

    @Override
    public LoginUserDTO parse(String token) {
        if(tokenCacheService.containUser(token)){
            return tokenCacheService.getUser(token);
        }
        // 从权限系统获取用户信息及权限信息，放入缓存。
        Map<String, Object> backMap = PowerSysUtil.getUserInfoAndAuthFromPowerSys_POST(token, powersProperties);
        String code = (String)backMap.getOrDefault("code","200").toString();
        String message = (String)backMap.getOrDefault("msg","成功");
        // 权限接口返回失败
        if(!StringUtils.equals(code, "200")){
            throw new RuntimeException(message);
        }
        // 接口返回成功，拿到的数据：userInfo为JSONObject, menuList为JSONArray， actList为JSONArray
        Map<String, Object> userInfoAndAuthMap = userInfoAndAuthMap = (Map<String, Object>)backMap.get("data");
        Map<String, Object> userInfo = (Map<String, Object>)userInfoAndAuthMap.get("userInfo");
        JSONArray menuList = (JSONArray)userInfoAndAuthMap.get("menuList");
        JSONArray actList = (JSONArray)userInfoAndAuthMap.get("actList");

        tokenCacheService.putMenuAuth(token, menuList);
        tokenCacheService.putActAuth(token, actList);

        LoginUserDTO loginUserDTO  =  LoginUserDTO.builder()
                .userId(userInfo.getOrDefault("userId","").toString())
                .userCode(userInfo.getOrDefault("account","").toString())
                .userName(userInfo.getOrDefault("realname","").toString())
                .phone(userInfo.getOrDefault("phone","").toString())
                .sort(0)
                .roles(List.of())
                .permissions(List.of())
                .tokenType("powers")
                .build();
        //loginUserDTO.getAttrs().put("userInfo", userInfo);
        tokenCacheService.putUser(token, loginUserDTO);
        return loginUserDTO;
    }
}
