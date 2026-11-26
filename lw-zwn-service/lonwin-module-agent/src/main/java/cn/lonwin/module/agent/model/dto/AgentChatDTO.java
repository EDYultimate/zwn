package cn.lonwin.module.agent.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 提问入参。
 */
@Data
@Schema(description = "智能问答请求")
public class AgentChatDTO {

    @Schema(description = "会话 ID。首次提问可不传（后端按用户生成），后续提问需回传以保持多轮上下文",
            example = "user-1001-default")
    private String sessionId;

    @NotBlank(message = "问题不能为空")
    @Size(max = 2000, message = "问题长度不能超过 2000 字")
    @Schema(description = "用户问题", example = "今年调水量是多少？")
    private String question;

    /**
     * 业务模块标识（可选）：用于「按当前前端模块裁剪工具清单」。
     *
     * <p>前端某个模块的智能体发问时带上本字段（如取水证模块传 {@code water-cert}），
     * 后端只给模型该模块的工具 + 全局工具，降低模型在大量工具里选错的概率、提升数据正确率。
     * 不传或传空 = 通用问答，注入全量工具清单。
     */
    @Schema(description = "业务模块标识，用于按模块裁剪工具清单；空表示通用（全量工具）", example = "water-cert")
    private String module;
}
