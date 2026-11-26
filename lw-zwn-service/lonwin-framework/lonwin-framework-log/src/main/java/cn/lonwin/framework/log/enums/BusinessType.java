package cn.lonwin.framework.log.enums;

/**
 * 业务操作类型
 */
public enum BusinessType
{
    /**
     * 其他 0
     */
    OTHER,

    /**
     * 新增 1
     */
    INSERT,

    /**
     * 修改 2
     */
    UPDATE,

    /**
     * 删除 3
     */
    DELETE,

    /**
     * 查询-list 4
     */
    LIST,

    /**
     * 查询单条，详情 5
     */
    LIST_DETAIL,

    /**
     * 查询-TREE 6
     */
    LIST_TREE,

    /**
     * 查询-关系 7
     */
    LIST_RELATION,

    /**
     * 保存关系 8
     */
    SAVE_RELATION,

    /**
     * 同步 9
     */
    SYNC,

    /**
     * 导入 10
     */
    IMPORT,

    /**
     * 导出 11
     */
    EXPORT,

    /**
     *  下载 12
     */
    DOWNLOAD,

    /**
     * 授权-用户 13
     */
    AUTH_USER,

    /**
     * 授权-角色 14
     */
    AUTH_ROLE,

    /**
     * 授权-菜单 15
     */
    AUTH_MENU,

    /**
     * 授权-视频点 16
     */
    AUTH_SPD,

    /**
     * 生成代码 17
     */
    GEN,

    /**
     * 登录 18
     */
    LOGIN,

    /**
     * 退出 19
     */
    LOGOUT
}
