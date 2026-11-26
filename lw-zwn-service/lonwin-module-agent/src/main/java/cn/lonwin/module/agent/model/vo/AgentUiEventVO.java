package cn.lonwin.module.agent.model.vo;

import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 智能回答附带的「前端 UI 事件」。
 *
 * <p>模型只能从页面上报的能力声明中选择 target（后端已按白名单校验），
 * 前端统一分发器按类型执行：
 * <ul>
 *   <li>{@link #TYPE_NAVIGATE}：跳转到 target 指向的页面路由；</li>
 *   <li>{@link #TYPE_DIALOG}：打开 target 对应的弹框（args 为弹框参数）；</li>
 *   <li>{@link #TYPE_SPOTLIGHT}：高亮 target 对应的 data-anchor 元素（引导用户看某个数字）；</li>
 *   <li>{@link #TYPE_COMMAND}：触发 target 对应的页面行为（如切换日期、筛选）。</li>
 * </ul>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "回答附带的 UI 事件（页面引导指令）")
public class AgentUiEventVO {

    @Schema(description = "事件类型：NAVIGATE / DIALOG / SPOTLIGHT / COMMAND", example = "DIALOG")
    private String type;

    @Schema(description = "目标语义键（路由 / 弹框名 / 锚点 / 命令名）", example = "warnDetailModal")
    private String target;

    @Schema(description = "按钮文案（DIALOG/NAVIGATE 渲染成按钮时显示）", example = "查看超许可明细")
    private String label;

    @Schema(description = "事件参数，键与能力声明中的 params 对应")
    private Map<String, Object> args;

    /**
     * 行内引用编号：answer 里第 n 个 {@code [[n]]} 标记对应的就是这个事件。
     *
     * <p>为什么需要它：以前 answer 是一段纯文本、events 是一个平铺数组，两者没有任何关联，
     * 用户看到「许可水量 53631」和下面三个长得差不多的按钮，得自己猜哪个对应哪个数；
     * 一问多答时（河道内/河道外）尤其容易点错。带上编号后，前端可以把角标渲染在具体数字后面，
     * 「这个数在哪看」变成点它自己，而不是在按钮列表里做选择题。
     *
     * <p>为 null 表示该事件没有被正文引用（例如服务端兜底补的事件），前端按普通按钮渲染。
     */
    @Schema(description = "行内引用编号，对应 answer 里的 [[n]] 标记；null 表示未被正文引用")
    private Integer cite;

    public static final String TYPE_NAVIGATE = "NAVIGATE";
    public static final String TYPE_DIALOG = "DIALOG";
    public static final String TYPE_SPOTLIGHT = "SPOTLIGHT";
    public static final String TYPE_COMMAND = "COMMAND";
}
