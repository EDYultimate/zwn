package cn.lonwin.framework.security.cache;

import cn.lonwin.common.core.model.dto.LoginUserDTO;
import com.alibaba.fastjson2.JSONArray;

/**
 * 定义接口，缓存token的用户信息
 */
public interface TokenCacheService {
    LoginUserDTO getUser(String token);
    void putUser(String token, LoginUserDTO user);
    void removeUser(String token);
    boolean containUser(String token);

    JSONArray getMenuAuth(String token);
    void putMenuAuth(String token, JSONArray auth);
    void removeMenuAuth(String token);
    boolean containMenuAuth(String token);

    JSONArray getActAuth(String token);
    void putActAuth(String token, JSONArray auth);
    void removeActAuth(String token);
    boolean containsActAuth(String token);
}