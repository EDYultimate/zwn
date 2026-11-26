package cn.lonwin.module.system.menu.client;

import cn.lonwin.framework.security.token.powers.RSAEncryptUtil;
import cn.lonwin.module.system.menu.config.MenuPushProperties;
import cn.lonwin.module.system.menu.dto.MenuNodeDTO;
import cn.lonwin.module.system.menu.dto.MenuPrefixVO;
import com.alibaba.fastjson2.JSONObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.apache.http.HttpResponse;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 菜单推送系统客户端
 * 1. 用 apiSecret（base64 公钥）对 timestamp 进行 RSA 非对称加密，生成 sign
 * 2. 携带 apiKey / timestamp / sign + 业务参数 menus 调用推送接口
 *
 * @author lonwin
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class MenuPushClient {

    private final MenuPushProperties properties;

    /**
     * 生成签名：用 apiSecret（base64公钥）对 timestamp 进行 RSA 加密
     *
     * @param timestamp 请求时间戳（毫秒）
     * @return sign 签名串
     */
    public String generateSign(long timestamp) {
        try {
            String stringToSign = String.valueOf(timestamp);
            return RSAEncryptUtil.encrypt(stringToSign,
                    Base64.decodeBase64(properties.getApiSecret().getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            log.error("生成菜单推送签名失败, timestamp={}", timestamp, e);
            throw new RuntimeException("生成菜单推送签名失败", e);
        }
    }

    /**
     * 组装公共认证参数（apiKey + timestamp + sign）
     * 除业务参数外，每个请求都需带
     */
    public Map<String, Object> buildAuthParams() {
        long timestamp = System.currentTimeMillis();
        Map<String, Object> params = new HashMap<>();
        params.put("apiKey", properties.getApiKey());
        params.put("timestamp", timestamp);
        params.put("sign", generateSign(timestamp));
        return params;
    }

    /**
     * 组装推送菜单请求参数（认证参数 + 业务参数 menus 菜单扁平列表）
     */
    public Map<String, Object> buildRequest(List<MenuNodeDTO> menus) {
        Map<String, Object> request = buildAuthParams();
        request.put("menus", menus);
        return request;
    }

    /**
     * 调用推送菜单接口
     *
     * @param menus 菜单扁平列表（允许为空数组=清空所有 /index 路由相关菜单）
     * @return 外部系统响应（解析为 Map，含 code/message/data）
     */
    public Map<String, Object> pushMenus(List<MenuNodeDTO> menus) {
        String url = properties.getBaseUrl() + properties.getPushUrl();
        return postForMap(url, buildRequest(menus), "推送菜单");
    }

    /**
     * 调用获取导航路径前缀接口 /api/menu/prefixMenu
     * 获取本系统的功能/管理/区域路径前缀
     *
     * @return MenuPrefixVO（funcPrefix/managePrefix/regionPrefix 强类型结构）
     * @throws RuntimeException 请求失败或响应 code != 0
     */
    public MenuPrefixVO getPrefixMenu() {
        String url = properties.getBaseUrl() + properties.getPrefixUrl();
        Map<String, Object> resp = postForMap(url, buildAuthParams(), "获取导航路径前缀");
        Object code = resp.get("code");
        if (code == null || Integer.parseInt(code.toString()) != 0) {
            throw new RuntimeException("获取导航路径前缀失败: " + resp.get("message"));
        }
        Object data = resp.get("data");
        if (data == null) {
            throw new RuntimeException("获取导航路径前缀失败: 响应无 data");
        }
        return JSONObject.parseObject(JSONObject.toJSONString(data), MenuPrefixVO.class);
    }

    /**
     * 发送 JSON POST 请求并解析响应为 Map
     *
     * @param url          请求地址
     * @param requestBody  请求参数
     * @param bizName      业务名称（用于日志）
     * @return 响应 Map；请求失败时返回 code=500 的失败 Map
     */
    private Map<String, Object> postForMap(String url, Map<String, Object> requestBody, String bizName) {
        String jsonStr = JSONObject.toJSONString(requestBody);
        log.info("调用菜单系统接口[{}], url={}, body={}", bizName, url, jsonStr);
        String respStr = doPostJson(url, jsonStr);
        if (respStr == null || respStr.isEmpty()) {
            Map<String, Object> fail = new HashMap<>();
            fail.put("code", 500);
            fail.put("message", "菜单系统返回空响应");
            return fail;
        }
        try {
            Map<String, Object> respMap = JSONObject.parseObject(respStr);
            log.info("菜单系统接口[{}]响应: {}", bizName, respStr);
            return respMap;
        } catch (Exception e) {
            log.error("解析菜单系统响应失败, resp={}", respStr, e);
            Map<String, Object> fail = new HashMap<>();
            fail.put("code", 500);
            fail.put("message", "菜单系统响应解析失败: " + e.getMessage());
            return fail;
        }
    }

    /**
     * 发送 JSON POST 请求（UTF-8）
     */
    private String doPostJson(String url, String jsonStr) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            RequestConfig config = RequestConfig.custom()
                    .setConnectTimeout(properties.getConnectTimeoutMs())
                    .setSocketTimeout(properties.getReadTimeoutMs())
                    .build();
            HttpPost httpPost = new HttpPost(url);
            httpPost.setConfig(config);
            httpPost.setHeader("Content-Type", "application/json; charset=utf-8");
            StringEntity entity = new StringEntity(jsonStr, StandardCharsets.UTF_8);
            entity.setContentEncoding("UTF-8");
            entity.setContentType("application/json");
            httpPost.setEntity(entity);
            HttpResponse resp = httpClient.execute(httpPost);
            return EntityUtils.toString(resp.getEntity(), StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("调用菜单推送接口失败, url={}", url, e);
            return null;
        }
    }
}
