package cn.lonwin.module.agent.model.vo;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 智能问答返回结果。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "智能问答结果")
public class AgentChatVO {

    @Schema(description = "会话 ID，前端下次提问需回传以保持上下文")
    private String sessionId;

    @Schema(description = "回答正文")
    private String answer;

    @Schema(description = "回答附带的跳转按钮，可为空")
    private List<AgentActionVO> actions;

    @Schema(description = "回答附带的 UI 引导事件（打开弹框/高亮数字/触发命令/跳转页面），已按能力声明白名单校验")
    private List<AgentUiEventVO> events;

    /**
     * 知识库引用：正文里 {@code [[n]]}（n ≥ 11）指向的文档片段与原文定位信息。
     *
     * <p>只在知识侧通道开启且本轮命中文档时有值；关闭时为空列表，前端无需判空分支之外的处理。
     * 与 events 共用编号空间但分派行为不同，见 {@link KbRefVO}。
     */
    @Schema(description = "回答引用的知识库片段原文定位，可为空")
    private List<KbRefVO> kbRefs;

    /**
     * 与 {@code answer} 并列的结构化明细：正文给结论与概述，逐项数据在这里渲染成表格 / 要点。
     *
     * <p>可为空（纯文字回答完全合法）。服务端已做限额与列数对齐清洗，前端可直接使用。
     */
    @Schema(description = "回答附带的结构化明细块，由前端渲染成表格 / 要点；可为空")
    private List<AgentAnswerDetailVO> details;

    @Schema(description = "本次实际调用过的工具名，便于排查")
    private List<String> usedTools;

    @Schema(description = "耗时（毫秒）")
    private Long costMs;

    /**
     * 本次回答时后端的能力声明缓存为空。
     *
     * <p>前端收到 true 说明「页面能力没同步」，应重新上报并重试一次；
     * 常见于后端重启后（声明只在前端页面挂载时上报）。仅用于前端自愈，不展示给用户。
     */
    @Schema(description = "服务端能力声明为空，前端应重新上报后重试")
    private Boolean capabilitiesStale;

    /**
     * 本轮是在向用户追问缺失的工具参数。
     *
     * <p>true 时答案正文已是逐项引导文案、events/actions 均为空，工具没有执行。
     * 前端可据此展示「等待补充信息」状态；不读取该字段也不影响原有展示。
     */
    @Schema(description = "本次回答为参数追问，工具未执行，等待用户补充")
    private Boolean awaitingParams;

    @Schema(description = "待用户补充或修正的工具参数名，便于前端做输入框提示")
    private List<String> missingParams;
}
