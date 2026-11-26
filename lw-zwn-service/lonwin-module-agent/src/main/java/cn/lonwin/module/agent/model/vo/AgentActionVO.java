package cn.lonwin.module.agent.model.vo;

import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 回答下方的操作按钮（当前只支持页面跳转）。
 *
 * <p>路由由后端/业务工具给出而不是模型生成，避免模型编造不存在的页面。
 * 前端渲染前需用 {@code requiredActUrl} 与登录接口返回的 {@code myPermission} 求交集，
 * 保证「按钮显隐」也受功能权限控制。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "回答附带的操作按钮")
public class AgentActionVO {

    @Schema(description = "动作类型，目前仅 JUMP（页面跳转）", example = "JUMP")
    private String type;

    @Schema(description = "按钮文案", example = "查看调水明细")
    private String label;

    @Schema(description = "前端路由路径", example = "/waterAssign/haihe")
    private String routePath;

    @Schema(description = "跳转携带的查询参数，前端用 router.push({ path, query })")
    private Map<String, Object> query;

    @Schema(description = "按钮所需功能权限 URL，前端与 myPermission 求交集后决定是否显示",
            example = "/waterAssign/haihe")
    private String requiredActUrl;

    /** 页面跳转按钮 */
    public static final String TYPE_JUMP = "JUMP";
}
