package cn.lonwin.module.agent.model.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 知识库引用：answer 正文里 {@code [[n]]} 角标指向「文档中的哪一段」。
 *
 * <p>与 {@link AgentUiEventVO} 共用同一个编号空间但分工不同：
 * <ul>
 *   <li>{@code events[].cite}（1~9）→ 页面动作：跳转 / 弹框 / 高亮 / 命令；</li>
 *   <li>{@code kbRefs[].cite}（11 起）→ 文档依据：打开原文 / 定位章节。</li>
 * </ul>
 * 前端按编号查类型分派点击行为，避免出现两套 {@code [1]}。
 *
 * <p>定位所需字段在入库时就写进了 Qdrant payload，在线问答不回查 MongoDB。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "回答引用的知识库片段与原文定位信息")
public class KbRefVO {

    @Schema(description = "行内引用编号，对应 answer 里的 [[n]]；知识引用从 11 开始")
    private Integer cite;

    @Schema(description = "Qdrant point id")
    private String chunkId;

    @Schema(description = "来源集合：kp_chunks / kp_tables / kp_docs")
    private String collection;

    @Schema(description = "文档 ID")
    private String docId;

    @Schema(description = "文档类型")
    private String docType;

    @Schema(description = "文档标题")
    private String title;

    @Schema(description = "原文件名")
    private String fileName;

    @Schema(description = "原文件路径，前端据此打开原文")
    private String filePath;

    @Schema(description = "章节路径，如「1 总则 > 1.1 编制目的」")
    private String sectionPath;

    @Schema(description = "原文页码（PDF 等按页解析的来源才有）")
    private Integer pageNo;

    @Schema(description = "片段类型：TEXT / TABLE 等")
    private String elemType;

    @Schema(description = "片段摘要（前若干字），供悬浮展示")
    private String snippet;

    @Schema(description = "跨集合按秩融合后的相关度")
    private Double score;

    @Schema(description = "生成向量所用模型标识，用于发现换模型未重灌")
    private String embedderId;
}
