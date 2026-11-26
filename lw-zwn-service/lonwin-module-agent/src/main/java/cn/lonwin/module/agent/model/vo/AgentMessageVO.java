package cn.lonwin.module.agent.model.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 会话中的一条消息，用于返回历史记录。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "会话消息")
public class AgentMessageVO {

    @Schema(description = "角色：user / assistant", example = "user")
    private String role;

    @Schema(description = "消息内容")
    private String content;

    @Schema(description = "时间戳（毫秒）")
    private Long timestamp;
}
