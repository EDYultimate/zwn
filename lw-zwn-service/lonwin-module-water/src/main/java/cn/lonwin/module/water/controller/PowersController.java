package cn.lonwin.module.water.controller;

import cn.lonwin.common.core.base.BaseController;
import cn.lonwin.common.core.utils.ToolSystemUtils;
import cn.lonwin.framework.security.cache.TokenCacheService;
import cn.lonwin.framework.security.token.powers.PowerSysUtil;
import cn.lonwin.framework.security.token.powers.PowersProperties;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Controller
@RequestMapping("/powers")
@RequiredArgsConstructor
@Tag(name = "测试接口", description = "获取用户权限")
public class PowersController extends BaseController {
    private final TokenCacheService tokenCacheService;
    private final PowersProperties powersProperties;

    /**
     * 获取登录的用户及权限信息
     * @param request
     * @param response
     * @return
     */
    @Operation(summary = "权限系统登录")
    @RequestMapping(value = {"/isLogin_powerSys","/getusername"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String,Object> isLogin_powerSys(HttpServletRequest request, HttpServletResponse response){
        Map<String,Object> result = new HashMap<String,Object>();
        try{
            String token = request.getHeader("token");
            Map<String, Object> backMap = PowerSysUtil.getUserInfoAndAuthFromPowerSys_POST(token, powersProperties);
            String code = (String)backMap.getOrDefault("code","200");
            String message = (String)backMap.getOrDefault("msg","成功");
            result.put("code", code);
            result.put("msg", backMap.get("msg"));
            if(!StringUtils.equals(code, "200")){
                return result;
            }
            // 成功
            // 调用权限系统失败，将失败信息返回到前端进行处理。
            // code含义：601-token错误；602-集成账号account错误；603-业务系统服务端ip与权限系统配置ip不一致；604-token过期；605-缓存过期；200-成功
            Map<String, Object> userInfoAndAuthMap = (Map<String, Object>)backMap.get("data");
            Map<String, Object> userInfo = (Map<String, Object>)userInfoAndAuthMap.get("userInfo");
            List<Map<String, Object>> menuList3 = (List<Map<String, Object>>)userInfoAndAuthMap.get("menuList");
            List<Map<String, Object>> actList = (List<Map<String, Object>>)userInfoAndAuthMap.get("actList");
            List<Map<String, Object>> roleList = (List<Map<String, Object>>)userInfoAndAuthMap.get("roleList");
            List<String> actUrlList = null;
            if(actList != null){
                actUrlList = actList.stream().map(a -> (String)a.getOrDefault("URL","")).distinct().collect(Collectors.toList());
            }
            List<String> roleCodeList = null;
            if(roleList != null){
                roleCodeList = roleList.stream().map(r -> (String)r.getOrDefault("CODE","")).distinct().collect(Collectors.toList());
            }
            result.put("myRole", roleCodeList);
            result.put("myPermission", actUrlList);
            result.put("myRouter", menuList3);
            result.put("code",0);
            result.put("msg","成功");
            result.put("message","成功");
            result.put("myUser", userInfo);
            result.put("nameCN", userInfo.get("realname"));
            result.put("username", userInfo.get("employeenum"));
            result.put("token", token);
            result.put("clientIP", ToolSystemUtils.getIpAddress(request));
            return result;
        }catch (Exception e){
            e.printStackTrace();
            result.put("code","1");
            result.put("msg","失败"+e.getMessage());
            result.put("message","失败"+e.getMessage());
            return result;
        }
    }
}
