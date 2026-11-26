package cn.lonwin.module.agent.model.vo;

import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Data;

/**
 * 工具元数据视图：管理端看到的「当前生效的工具长什么样」。
 *
 * <p>把「生效值」和「是否被覆盖」一起返回，运维才能判断某条描述到底来自代码还是来自配置，
 * 避免出现「代码里改了描述但线上没变」这类排查成本极高的问题。
 */
@Data
@Builder
public class AgentToolMetaVO {

    private String name;

    /** 生效的中文短名 */
    private String title;

    /** 生效的描述（会下发给模型） */
    private String description;

    private String category;

    /** 是否注册给模型；false 表示被管理端停用 */
    private boolean enabled;

    /** 是否存在元数据覆盖记录 */
    private boolean overridden;

    /** 生效的工具级权限（只读，运维不可改） */
    private List<String> permissions;

    /** 生效的跳转按钮 */
    private List<ActionView> actions;

    /** 生效的参数清单（含最终生效的说明） */
    private List<ParamView> params;

    private String updatedBy;

    private String updatedAt;

    /** 参数视图 */
    @Data
    @Builder
    public static class ParamView {
        private String name;
        private String type;
        private String description;
        private boolean required;
        private List<String> enums;
    }

    /** 跳转按钮视图 */
    @Data
    @Builder
    public static class ActionView {
        private String label;
        private String route;
        private List<String> queryParams;
    }
}
