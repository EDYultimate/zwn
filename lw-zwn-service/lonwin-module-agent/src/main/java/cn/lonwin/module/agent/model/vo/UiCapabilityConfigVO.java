package cn.lonwin.module.agent.model.vo;

import cn.lonwin.module.agent.uicapability.UiPageCapability;
import lombok.Builder;
import lombok.Data;

/**
 * 配置页看到的单个页面能力：代码默认值、当前生效值、是否被人工改过。
 *
 * <p>把 baseline 一起返回，页面才能显示「改了什么」，并在一键还原后
 * 让用户确认确实回到了代码里的声明。
 */
@Data
@Builder
public class UiCapabilityConfigVO {

    private String client;

    private String route;

    /** 代码默认值：前端 src/agent 下 &lt;pageKey&gt;.ts 声明，启动全量上报得到 */
    private UiPageCapability baseline;

    /** 当前生效值（提示词与事件白名单实际用的就是它） */
    private UiPageCapability effective;

    /** true = 存在页面人工修改 */
    private boolean overridden;

    private String updatedBy;

    private String updatedAt;
}
