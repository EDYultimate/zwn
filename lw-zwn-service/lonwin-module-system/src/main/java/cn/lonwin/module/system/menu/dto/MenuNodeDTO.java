package cn.lonwin.module.system.menu.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

/**
 * 菜单推送 DTO（扁平列表结构）
 * 菜单按扁平列表组织（每条记录带 parentRouteName），由外部菜单系统根据顺序 + parentRouteName 还原树形。
 * 允许为空数组（= 清空所有 /index 路由相关菜单）。
 *
 * @author lonwin
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MenuNodeDTO {

    /** 路由 name（唯一幂等 key，DB 已存在则更新，不存在则按 routeName 插入）——必填 */
    private String routeName;

    /** 父路由 name，顶级菜单为 null；可指向 DB 已有但不在本次请求中的菜单 */
    private String parentRouteName;

    /** 菜单名称（来自路由 meta.title）——必填 */
    private String menuName;

    /** 完整路由 path（如 /index/system/menu） */
    private String routePath;

    /** 菜单类型：MODULE-模块 / MENU-菜单 */
    private String menuType;

    /** 同级排序号 */
    private Integer sortNum;
}
