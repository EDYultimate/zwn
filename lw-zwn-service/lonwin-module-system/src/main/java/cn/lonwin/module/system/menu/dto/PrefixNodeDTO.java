package cn.lonwin.module.system.menu.dto;

import lombok.Data;

/**
 * 导航路径前缀节点 DTO
 * 用于解析菜单系统 /api/menu/prefixMenu 接口返回的 funcPrefix / managePrefix / regionPrefix 数组元素
 *
 * @author lonwin
 */
@Data
public class PrefixNodeDTO {

    /** 层级 */
    private Integer level;

    /** 名称 */
    private String name;

    /** 跳转地址（可为空） */
    private String url;
}
