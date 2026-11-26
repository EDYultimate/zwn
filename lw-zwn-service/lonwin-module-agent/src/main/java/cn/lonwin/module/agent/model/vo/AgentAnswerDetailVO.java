package cn.lonwin.module.agent.model.vo;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 回答里的结构化明细块。
 *
 * <p>设计意图：正文 {@code answer} 负责「结论 + 概述 + 口径说明」，逐项数值、
 * 多个对象的对比数据放在这里由前端渲染成表格或要点。两者不重复。
 * 这样既保住流式逐字输出（只推 answer 字段），又让长答案不再是一大段编号文本。
 *
 * <p>一个块可以只有表格（有 head）、只有要点（有 points），或两者都有；
 * 前端按 title → 表格 → 要点 → note 的顺序渲染。所有数值都以字符串下发，
 * 避免模型输出的数字被 JSON 解析成科学计数法或丢精度。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "回答附带的明细块（表格 / 要点）")
public class AgentAnswerDetailVO {

    @Schema(description = "小节标题，如「分项明细」「口径说明」")
    private String title;

    @Schema(description = "表头；为空表示该块没有表格")
    private List<String> head;

    @Schema(description = "表格数据，每行的列数与 head 一致")
    private List<List<String>> rows;

    @Schema(description = "要点列表；表格之外的补充说明")
    private List<String> points;

    @Schema(description = "数值列的列索引（从 0 开始），前端右对齐并加粗")
    private List<Integer> num;

    @Schema(description = "表下注释：口径、单位、数据范围、未展开条数等")
    private String note;
}
