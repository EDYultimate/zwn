package cn.lonwin.module.system.menu.service;

import cn.lonwin.module.system.menu.client.MenuPushClient;
import cn.lonwin.module.system.menu.dto.MenuNodeDTO;
import cn.lonwin.module.system.menu.dto.MenuPrefixVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 菜单推送服务
 * 完整流程：生成 apiKey + timestamp + sign 认证参数 -> 调用推送菜单接口 /api/menu/push
 *
 * @author lonwin
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MenuPushService {

    private final MenuPushClient menuPushClient;

    /**
     * 推送菜单（扁平列表）到外部菜单系统
     *
     * @param menus 菜单扁平列表（每条记录带 parentRouteName，允许为空数组=清空）
     * @return 外部系统响应（包含 code/message/data）
     */
    public Map<String, Object> pushMenus(List<MenuNodeDTO> menus) {
        log.info("推送菜单到外部菜单系统, menus.size={}", menus == null ? 0 : menus.size());
        return menuPushClient.pushMenus(menus);
    }

    /**
     * 从菜单系统获取本系统的导航路径前缀（功能/管理/区域）
     *
     * @return MenuPrefixVO（funcPrefix/managePrefix/regionPrefix 强类型结构）
     */
    public MenuPrefixVO getPrefixMenu() {
        log.info("从菜单系统获取导航路径前缀");
        return menuPushClient.getPrefixMenu();
    }
}
