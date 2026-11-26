package cn.lonwin.module.agent.uicapability;

import java.util.ArrayList;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 前端页面上报的「智能体能力声明」。
 *
 * <p>一个页面对应一份声明，由前端在登录后一次性上报（{@code POST /api/agent/ui-capabilities}）。
 * 声明描述的是页面对智能体开放的<b>能力面</b>：可高亮的元素（anchors）、可打开的弹框（dialogs）、
 * 可触发的页面行为（commands）。模型只能从这些白名单 target 中选择，不能自由编造。
 *
 * <p>与 {@code agent.capabilities.ts}（前端声明文件）字段一一对应，新增字段两端同步。
 */
@Data
@Schema(description = "页面对智能体开放的能力声明")
public class UiPageCapability {

    @Schema(description = "业务模块标识（如 water-cert）：与后端工具 @AgentTool.module 对齐，"
            + "用于按当前模块裁剪页面能力清单；空 = 不属于任何业务模块，仅通用问答（全量）时可见")
    private String module;

    @Schema(description = "页面路由，如 /waterUse/qushuijianguan/shuiliangjiankong")
    private String route;

    @Schema(description = "页面标题（进提示词，帮助模型判断何时建议跳转）", example = "取水监管 · 水量监控")
    private String title;

    @Schema(description = "本页菜单对应的功能权限 URL，生成提示词前按用户权限过滤")
    private String requiredActUrl;

    @Schema(description = "声明内容版本（前端按内容 hash 生成，未变化不重复上报）")
    private String version;

    @Schema(description = "上报方标识：web / bigscreen / mobile 等，便于多端各自维护能力目录")
    private String client = "web";

    @Schema(description = "可高亮的元素（SPOTLIGHT 指令的候选 target）")
    private List<Anchor> anchors = new ArrayList<>();

    @Schema(description = "可打开的弹框（DIALOG 指令的候选 target）")
    private List<Dialog> dialogs = new ArrayList<>();

    @Schema(description = "可触发的页面行为（COMMAND 指令的候选 target）")
    private List<Command> commands = new ArrayList<>();

    /** 可高亮元素定义 */
    @Data
    @Schema(description = "可高亮元素")
    public static class Anchor {

        @Schema(description = "语义键，对应模板中的 data-anchor 属性值", example = "tile.xuKeShuiLiang")
        private String target;

        @Schema(description = "给模型看的说明：这是什么、什么场景下建议高亮")
        private String desc;
    }

    /** 弹框/命令参数定义 */
    @Data
    @Schema(description = "弹框或命令的参数")
    public static class Param {

        @Schema(description = "参数名")
        private String name;

        @Schema(description = "参数说明")
        private String desc;

        @Schema(description = "是否必填")
        private Boolean required;

        @Schema(description = "参数类型：string / number / date", example = "date")
        private String type;

        @Schema(description = "枚举值：模型只能从中选")
        private List<String> enums;
    }

    /** 可打开弹框定义 */
    @Data
    @Schema(description = "可打开弹框")
    public static class Dialog {

        @Schema(description = "语义键", example = "warnDetailModal")
        private String target;

        @Schema(description = "给模型看的说明：弹框展示什么、什么场景下建议打开")
        private String desc;

        @Schema(description = "打开弹框需要的参数")
        private List<Param> params = new ArrayList<>();

        @Schema(description = "所需功能权限 URL")
        private String requiredActUrl;
    }

    /** 可触发命令定义 */
    @Data
    @Schema(description = "可触发的页面行为")
    public static class Command {

        @Schema(description = "语义键", example = "setWarnDate")
        private String target;

        @Schema(description = "给模型看的说明：命令做什么、什么场景下建议触发")
        private String desc;

        @Schema(description = "命令参数")
        private List<Param> params = new ArrayList<>();

        @Schema(description = "所需功能权限 URL")
        private String requiredActUrl;
    }
}
