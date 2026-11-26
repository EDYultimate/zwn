package cn.lonwin.module.agent.tool.meta;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 工具元数据覆盖项：运行期可修改的那部分「人读信息」。
 *
 * <p>设计原则：<b>注解是默认值，本对象是覆盖值</b>。
 * 字段为 {@code null} 或空表示「不覆盖，沿用注解」——这样运维只想改一句话术时，
 * 不必把整份元数据抄一遍，也不会因为漏填字段而把其他信息清空。
 *
 * <p>只允许覆盖「不影响安全与契约」的内容：
 * <ul>
 *   <li>可以改：标题、描述、问法示例、分类、启停、参数说明；</li>
 *   <li>不能改：工具名（模型协议的键）、参数类型/必填/枚举范围（改了会让校验与实现脱节）、
 *       所需功能权限（改了等于绕过权限审批流程）。</li>
 * </ul>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentToolMeta {

    /** 工具名，与 {@code @AgentTool#name} 一致，是覆盖关系的唯一键 */
    private String name;

    /** 中文短名，null = 沿用注解 */
    private String title;

    /** 何时使用 + 返回什么，null/空 = 沿用注解 */
    private String description;

    /** 典型问法，空集合 = 沿用注解 */
    private List<String> examples;

    /** 业务分类，null = 沿用注解 */
    private String category;

    /** 是否启用；null = 沿用注解（默认启用），false = 不注册给模型 */
    private Boolean enabled;

    /** 参数名 → 参数说明；只覆盖给出的键，null = 沿用注解 */
    private Map<String, String> paramDescriptions;

    /** 最后修改人（工号），由服务端填充 */
    private String updatedBy;

    /** 最后修改时间（ISO-8601），由服务端填充 */
    private String updatedAt;
}
