package cn.lonwin.module.agent.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 清空会话入参。
 */
@Data
@Schema(description = "清空会话请求")
public class AgentResetDTO {

    @NotBlank(message = "sessionId 不能为空")
    @Schema(description = "要清空记忆的会话 ID")
    private String sessionId;
}
