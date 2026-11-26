package cn.lonwin.module.system.menu.dto;

import lombok.Data;

import java.util.List;

/**
 * 导航路径前缀 VO
 * 对应菜单系统 /api/menu/prefixMenu 接口返回的 data 结构：
 * 功能路径前缀（funcPrefix）、管理路径前缀（managePrefix）、区域路径前缀（regionPrefix）
 *
 * @author lonwin
 */
@Data
public class MenuPrefixVO {

    /** 功能路径前缀（如：数字孪生海河 -> 数字孪生工程） */
    private List<PrefixNodeDTO> funcPrefix;

    /** 管理路径前缀（如：海委 -> 海河下游局） */
    private List<PrefixNodeDTO> managePrefix;

    /** 区域路径前缀（如：海河流域 -> 海河下游 -> 海河闸） */
    private List<PrefixNodeDTO> regionPrefix;
}
