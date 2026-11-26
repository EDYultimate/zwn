package cn.lonwin.framework.security.cache.impl;

import cn.lonwin.common.core.model.dto.LoginUserDTO;
import cn.lonwin.framework.security.cache.TokenCacheService;
import com.alibaba.fastjson2.JSONArray;
import net.jodah.expiringmap.ExpiringMap;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class MemoryTokenCacheServiceImpl implements TokenCacheService {

    /** 缓存token与用户信息*/
    private final ExpiringMap<String, LoginUserDTO> tokenToUser;
    /** 缓存token与菜单信息*/
    private final ExpiringMap<String, JSONArray> tokenToMenu;
    /** 缓存token与后端接口信息*/
    private final ExpiringMap<String, JSONArray> tokenToAct;


    public MemoryTokenCacheServiceImpl() {
        this.tokenToUser = ExpiringMap.builder().expiration(120, TimeUnit.MINUTES).build();
        this.tokenToMenu = ExpiringMap.builder().expiration(120, TimeUnit.MINUTES).build();
        this.tokenToAct = ExpiringMap.builder().expiration(120, TimeUnit.MINUTES).build();
    }
    @Override
    public LoginUserDTO getUser(String token) {
        return tokenToUser.get(token);
    }

    @Override
    public void putUser(String token, LoginUserDTO user) {
        tokenToUser.put(token, user);
    }

    @Override
    public void removeUser(String token) {
        tokenToUser.remove(token);
    }

    @Override
    public boolean containUser(String token) {
        return tokenToUser.containsKey(token);
    }

    @Override
    public JSONArray getMenuAuth(String token) {
        return tokenToMenu.get(token);
    }

    @Override
    public void putMenuAuth(String token, JSONArray auth) {
        tokenToMenu.put(token, auth);
    }

    @Override
    public void removeMenuAuth(String token) {
        tokenToMenu.remove( token);
    }

    @Override
    public boolean containMenuAuth(String token) {
        return tokenToMenu.containsKey( token);
    }

    @Override
    public JSONArray getActAuth(String token) {
        return tokenToAct.get( token);
    }

    @Override
    public void putActAuth(String token, JSONArray auth) {
        tokenToAct.put(token, auth);
    }

    @Override
    public void removeActAuth(String token) {
        tokenToAct.remove(token);
    }

    @Override
    public boolean containsActAuth(String token) {
        return tokenToAct.containsKey( token);
    }
}