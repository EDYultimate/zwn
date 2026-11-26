package cn.lonwin.module.agent.uicapability;

import java.util.List;

/**
 * 能力声明的「在线配置」扩展能力，只有支持落库持久化的存储实现才实现本接口。
 *
 * <p>刻意不塞进 {@link UiCapabilityStore}：上报、提示词渲染等主链路只需要纯读写语义，
 * 文件/内存实现无需为空实现这些管理端方法；配置页在非 db 存储下会收到明确的错误提示。
 */
public interface UiCapabilityAdminStore {

    /** 全部配置行（含基线、覆盖、修改人/时间），供配置页展示 */
    List<UiCapabilityRow> rows();

    /** 指定上报方 + 路由的一行；不存在返回 null */
    UiCapabilityRow row(String client, String route);

    /** 代码默认声明（前端上报的基线），供指纹/对照展示 */
    List<UiPageCapability> baseline(String client);

    /** 保存人工覆盖（整份声明），写库即可生效 */
    void saveOverride(String client, UiPageCapability page, String operator);

    /** 删除单页人工覆盖，回到代码默认 */
    boolean removeOverride(String client, String route);

    /** 清空全部人工覆盖，供「一键还原」调用；返回被还原的页面数 */
    int clearOverrides();
}
