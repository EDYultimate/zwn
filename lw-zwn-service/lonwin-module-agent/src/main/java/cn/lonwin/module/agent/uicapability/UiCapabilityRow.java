package cn.lonwin.module.agent.uicapability;

/**
 * 一行页面能力配置：同时保存「代码默认基线」与「页面人工覆盖」。
 *
 * <p>两者分开是一键还原的关键：前端启动/定时上报只更新 baseline，
 * 人工改的内容留在 override，运行时读 override ?? baseline；
 * 点还原只需把 override 清空，不需要重新发版，也不会被下一次上报冲掉。
 */
public record UiCapabilityRow(String client, String route,
                              UiPageCapability baseline, UiPageCapability override,
                              String updatedBy, String updatedAt) {

    /** 当前生效的声明（提示词渲染、事件白名单校验都用它） */
    public UiPageCapability effective() {
        return override != null ? override : baseline;
    }

    public boolean overridden() {
        return override != null;
    }
}
