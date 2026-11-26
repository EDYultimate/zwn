package cn.lonwin.module.agent.tool;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import cn.lonwin.module.agent.annotation.AgentParamType;
import cn.lonwin.module.agent.spi.AgentToolResult;
import lombok.Builder;
import lombok.Getter;

/**
 * 工具运行时定义：注解解析后的元数据 + 可执行句柄。
 *
 * <p>生命周期：启动时由 {@link AgentToolDefinitionFactory} 从工具契约的注解生成一次，
 * 之后全程只读（不可变），因此可安全并发复用。
 *
 * <p>元数据三块（对应能力清单的三段式）：
 * <ul>
 *   <li>{@link #description} + {@link #returns}：接口功能与返回字段含义，
 *       拼成 OpenAI function description；</li>
 *   <li>{@link #params} → {@link #paramSchema}：入参的完整 JSON Schema document，
 *       作为 {@code function.parameters} 下发；</li>
 *   <li>{@link #actions}：执行成功后要下发的跳转按钮。</li>
 * </ul>
 *
 * <p>「什么时候调用、调几次、何时停止」全部由模型自主决策；本定义不再携带
 * 口径词表（forMetrics/notFor）与问法示例，服务端也不做字面口径拦截。
 */
@Getter
@Builder(toBuilder = true)
public class AgentToolDefinition {

    /** 工具名，全局唯一 */
    private final String name;

    /** 中文短名 */
    private final String title;

    /** 接口功能与边界 */
    private final String description;

    /** 业务分类 */
    private final String category;

    /** 所属业务模块（空 = 全局工具，任何模块都可见） */
    private final String module;

    /** 是否只读 */
    private final boolean readOnly;

    /** 是否强制单位数据权限 */
    private final boolean unitScoped;

    /** 所需功能权限 actUrl，空表示仅需登录 */
    private final List<String> permissions;

    /** 结构化参数定义（不含 {@link AgentToolContext}） */
    private final List<Param> params;

    /** 预构建的完整参数 JSON Schema document（type=object + properties + required） */
    private final Map<String, Object> paramSchema;

    /** 返回字段声明：拼进 function description，模型读清单时即知每个字段的含义与单位 */
    private final List<ReturnField> returns;

    /** 跳转按钮定义 */
    private final List<Action> actions;

    /** 执行句柄：注解工具走反射调用，SPI 工具走接口委托 */
    private final AgentToolExecutor executor;

    /** 执行工具。异常与参数错误由执行器内部转成失败结果，不向编排层抛异常 */
    public AgentToolResult execute(AgentToolContext ctx, Map<String, Object> args) {
        return executor.execute(ctx, args);
    }

    public boolean requiresPermission() {
        return permissions != null && !permissions.isEmpty();
    }

    public Param param(String paramName) {
        if (params == null) {
            return null;
        }
        return params.stream().filter(p -> p.name().equals(paramName)).findFirst().orElse(null);
    }

    /**
     * 渲染为 OpenAI 原生 function calling 的一个工具条目：
     * {@code {"type":"function","function":{"name","description","parameters"}}}。
     *
     * <p>返回字段说明（{@link #returns}）拼进 description：入参含义已经由
     * parameters Schema 的逐参数 description 承载，返回字段没有标准结构可挂，
     * 这是模型理解「每个字段是什么、单位是什么」的唯一入口。
     */
    public Map<String, Object> toOpenAiTool() {
        Map<String, Object> function = new LinkedHashMap<>();
        function.put("name", name);
        function.put("description", fullDescription());
        function.put("parameters", paramSchema == null ? Map.of() : paramSchema);
        Map<String, Object> tool = new LinkedHashMap<>();
        tool.put("type", "function");
        tool.put("function", function);
        return tool;
    }

    /** function description：中文短名 + 功能说明 + 返回字段逐条含义 */
    public String fullDescription() {
        StringBuilder sb = new StringBuilder(title).append("。").append(description);
        if (returns != null && !returns.isEmpty()) {
            sb.append("\n返回字段：");
            for (ReturnField field : returns) {
                sb.append("\n- ").append(field.field()).append("：").append(field.description());
            }
        }
        return sb.toString();
    }

    /**
     * 生成提示词/日志里的一行工具说明（人读格式）。
     * 原生 function calling 下工具清单走 {@code tools} 数组、不再进 system 提示词，
     * 此方法仅供管理端展示与排查日志使用。
     */
    public String toPromptText() {
        StringBuilder sb = new StringBuilder();
        sb.append("   - ").append(name).append("（").append(title).append("）");

        List<String> tags = new ArrayList<>();
        if (category != null && !category.isBlank()) {
            tags.add(category);
        }
        if (unitScoped) {
            tags.add("按本单位数据");
        }
        if (!readOnly) {
            tags.add("写操作");
        }
        if (!tags.isEmpty()) {
            sb.append(" [").append(String.join("/", tags)).append(']');
        }
        sb.append('\n').append("     说明：").append(fullDescription()).append('\n');
        if (params != null && !params.isEmpty()) {
            sb.append("     参数：");
            for (Param param : params) {
                sb.append(param.name()).append(param.required() ? "(必填" : "(")
                        .append(param.schemaType()).append(")：").append(param.description()).append("；");
            }
            sb.append('\n');
        }
        return sb.toString();
    }

    /** 单个参数的结构化定义。 */
    public record Param(
            String name,
            AgentParamType type,
            Class<?> javaType,
            String description,
            boolean required,
            List<String> enums,
            String format,
            String example,
            String defaultValue,
            Double min,
            Double max,
            String pattern) {

        /** 用于 Schema 的简短类型名 */
        public String schemaType() {
            return switch (type) {
                case INTEGER -> "integer";
                case NUMBER -> "number";
                case BOOLEAN -> "boolean";
                case OBJECT -> "object";
                default -> "string";
            };
        }

        /** 仅替换说明，其余约束保持不变（供元数据覆盖使用） */
        public Param withDescription(String newDescription) {
            return new Param(name, type, javaType, newDescription, required,
                    enums, format, example, defaultValue, min, max, pattern);
        }
    }

    /** 返回字段声明 */
    public record ReturnField(String field, String description) {
    }

    /** 跳转按钮定义 */
    public record Action(String label, String route, List<String> permissions, List<String> queryParams) {
    }

    /** 工具执行句柄 */
    @FunctionalInterface
    public interface AgentToolExecutor {
        AgentToolResult execute(AgentToolContext ctx, Map<String, Object> args);
    }
}
