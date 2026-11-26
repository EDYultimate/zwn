package cn.lonwin.framework.security.token.powers;

import cn.lonwin.common.core.utils.StringUtils;
import com.alibaba.fastjson2.JSONObject;
import org.apache.commons.codec.binary.Base64;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 抽取出来的权限系统的Util类。
 * @author wyc
 * @date 2024-08-23
 */
public class PowerSysUtil {
    /**
     * 生成sptokne内容： toke&&时间戳long，进行RAS的非对称加密。
     * */
    public static String createSptoken(String token, String pubKey){
        String sptoken = token+"&&"+new Date().getTime();
        String encrypt = "";
        try {
            /**
             * 注：RSA加密对明文的长度有所限制
             * 规定需加密的明文最大长度=密钥长度-11（单位是字节，即byte）
             * 所以在加密和解密的过程中需要分块进行
             * 而密钥默认是1024位，即1024位/8位-11=128-11=117字节
             * 所以默认加密前的明文最大长度117字节
             * 解密密文最大长度为128字
             */
            encrypt = RSAEncryptUtil.encrypt(sptoken, Base64.decodeBase64(pubKey.getBytes("UTF-8")));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return encrypt;
    }

    /**
     * 获取得到用户信息以及权限。
     * @param token
     * @return
     */
    public static Map<String,Object> getUserInfoAndAuthFromPowerSys_POST(String token, PowersProperties powerSysConfig){
        Map<String, Object> back = new HashMap<String, Object>();
        String url = powerSysConfig.getBaseUrl()+"/sysfront/auth/getUserInfoAndSysAuth";
        JSONObject obj = new JSONObject();
        obj.put("sptoken", createSptoken(token,powerSysConfig.getPublicKey()));
        obj.put("account", powerSysConfig.getAccount());
        String backMsg = getResultPost(url, obj, null);
        if(StringUtils.isEmpty(backMsg)){
            back.put("code", 600);
            back.put("msg", "接口调用失败");
            return back;
        }
        Map resultMap = JSONObject.parseObject(backMsg);
        if(resultMap == null){
            back.put("code", 600);
            back.put("msg", "返回接口为空");
            return back;
        }
        return resultMap;
    }

    /**
     * 调用POST方法
     * @param url
     * @param json
     * @param headers
     * @return
     */
    public static String getResultPost(String url, JSONObject json, Map<String, String> headers) {
        String strResult = "";
        try {
            CloseableHttpClient httpClient = HttpClients.createDefault();
            HttpPost httpPost = new HttpPost(url);
            StringEntity entity = new StringEntity(json.toString(), "utf-8");
            entity.setContentEncoding("UTF-8");
            entity.setContentType("application/json");
            httpPost.setEntity(entity);
            if (headers != null && !headers.isEmpty()) {
                Object[] headerKeys = headers.keySet().toArray();
                for(int i = 0; i < headerKeys.length; ++i) {
                    String headerKey = headerKeys[i].toString();
                    httpPost.setHeader(headerKey, (String)headers.get(headerKey));
                }
            }
            HttpResponse resp = httpClient.execute(httpPost);
            // 获取响应实体
            strResult = EntityUtils.toString(resp.getEntity());
        } catch (Exception var10) {
        }
        return strResult;
    }
}
