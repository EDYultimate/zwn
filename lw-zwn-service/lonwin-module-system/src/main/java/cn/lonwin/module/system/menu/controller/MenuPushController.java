package cn.lonwin.module.system.menu.controller;

import cn.lonwin.common.core.base.BaseController;
import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.module.system.menu.dto.MenuNodeDTO;
import cn.lonwin.module.system.menu.dto.MenuPrefixVO;
import cn.lonwin.module.system.menu.service.MenuPushService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * 菜单系统对接接口（本系统内部触发，调用外部菜单系统）
 * 1. 推送菜单：POST /menu-push/trigger（前端经 /api 代理访问）-> 外部 /api/menu/push
 * 2. 获取导航路径前缀：POST /menu-push/prefix -> 外部 /api/menu/prefixMenu
 *
 * @author lonwin
 */
@Slf4j
@RestController
@RequestMapping("/menu-push")
@RequiredArgsConstructor
@Tag(name = "菜单系统对接", description = "推送菜单/获取导航路径前缀")
public class MenuPushController extends BaseController {

    private final MenuPushService menuPushService;

    /**
     * 触发推送菜单
     * 请求体：菜单扁平列表（每条记录带 parentRouteName，由外部菜单系统还原树形），例如：
     * [
     *   { "routeName":"system", "menuName":"系统管理", "routePath":"/index/system", "menuType":"MODULE", "sortNum":1 },
     *   { "routeName":"system-menu", "parentRouteName":"system", "menuName":"菜单管理", "routePath":"/index/system/menu", "menuType":"MENU", "sortNum":1 }
     * ]
     * 允许为空数组（= 清空所有 /index 路由相关菜单）
     */
    @Operation(summary = "推送菜单到外部菜单系统")
    @PostMapping("/trigger")
    public Result<Map<String, Object>> trigger(@RequestBody List<MenuNodeDTO> menus) {
//        Map<String, Object> resp = menuPushService.pushMenus(menus);
        return buildResult(null, "推送成功", "推送失败");
    }

    /**
     * 获取本系统的导航路径前缀（功能 funcPrefix / 管理 managePrefix / 区域 regionPrefix）
     * 无需请求参数，服务端自动携带 apiKey + timestamp + sign 认证
     */
    @Operation(summary = "获取导航路径前缀（功能/管理/区域）")
    @PostMapping("/prefix")
    public Result<MenuPrefixVO> prefix() {
        try {
//            MenuPrefixVO vo = menuPushService.getPrefixMenu();
            return Result.success("获取成功", null);
        } catch (Exception e) {
            log.error("获取导航路径前缀失败", e);
            return Result.fail("获取失败: " + e.getMessage());
        }
    }

    /**
     * 根据外部系统响应 code 构建统一返回（code=0 为成功）
     */
    private Result<Map<String, Object>> buildResult(Map<String, Object> resp, String successMsg, String failMsg) {
        Object code = resp.get("code");
        if (code != null) {
            try {
                if (Integer.parseInt(code.toString()) == 0) {
                    return Result.success(successMsg, resp);
                }
            } catch (NumberFormatException ignored) {
            }
        }
        return Result.fail(failMsg + ": " + resp.get("message"));
    }
}
