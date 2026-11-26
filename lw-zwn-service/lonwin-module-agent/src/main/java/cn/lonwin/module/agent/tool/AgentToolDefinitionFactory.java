package cn.lonwin.module.agent.tool;

import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.Parameter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import cn.lonwin.module.agent.annotation.AgentParamType;
import cn.lonwin.module.agent.annotation.AgentTool;
import cn.lonwin.module.agent.annotation.AgentToolAction;
import cn.lonwin.module.agent.annotation.AgentToolParam;
import cn.lonwin.module.agent.annotation.AgentToolReturn;
import cn.lonwin.module.agent.datascope.DataScopeContext;
import cn.lonwin.module.agent.spi.AgentToolProvider;
import cn.lonwin.module.agent.spi.AgentToolRequest;
import cn.lonwin.module.agent.spi.AgentToolResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 工具定义工厂：把「接口方法上的注解」翻译成运行时可用的 {@link AgentToolDefinition}。
 *
 * <p><b>启动期校验（fail-fast）</b>：注解写错（缺描述、名字重复、参数没写 Schema、按钮缺路由）
 * 会在应用启动时直接抛 {@link IllegalStateException} 并指明具体方法，
 * 而不是等模型调用时才发现——这是把「提示词质量」纳入编译/启动检查的关键一步。
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AgentToolDefinitionFactory {

    private final AgentToolInvoker invoker;
    private final AgentToolSchemaRenderer schemaRenderer;

    /**
     * 解析一个工具契约接口的全部工具方法。
     *
     * @param apiInterface 契约接口（{@code AgentToolApi}），注解定义在接口方法上
     * @param bean         实现 Bean，运行时反射调用它
     */
    public List<AgentToolDefinition> build(Class<?> apiInterface, Object bean) {
        List<AgentToolDefinition> definitions = new ArrayList<>();
        for (Method method : apiInterface.getMethods()) {
            if (Modifier.isStatic(method.getModifiers()) || method.isDefault()) {
                continue;
            }
            AgentTool tool = method.getAnnotation(AgentTool.class);
            if (tool == null) {
                continue;
            }
            definitions.add(buildOne(apiInterface, method, bean, tool));
        }
        return definitions;
    }

    private AgentToolDefinition buildOne(Class<?> apiInterface, Method method, Object bean, AgentTool tool) {
        String location = apiInterface.getSimpleName() + "#" + method.getName();
        require(tool.name(), "工具名 name 不能为空", location);
        require(tool.title(), "工具中文名 title 不能为空", location);
        require(tool.description(), "工具说明 description 不能为空（模型据此判断是否调用）", location);

        List<AgentToolDefinition.Param> params = parseParams(method, location);
        List<AgentToolDefinition.Action> actions = parseActions(method, location);
        List<AgentToolDefinition.ReturnField> returns = parseReturns(method);

        if (!tool.readOnly()) {
            log.warn("[agent-tool] 工具 {} 声明为非只读（write），请确认模型不会在无人工确认的情况下执行写操作", tool.name());
        }

        AgentToolDefinition definition = AgentToolDefinition.builder()
                .name(tool.name().trim())
                .title(tool.title().trim())
                .description(tool.description().trim())
                .category(tool.category())
                .module(tool.module() == null ? "" : tool.module().trim())
                .readOnly(tool.readOnly())
                .unitScoped(tool.unitScoped())
                .permissions(List.of(tool.permissions()))
                .params(params)
                .paramSchema(schemaRenderer.renderDocument(params))
                .returns(returns)
                .actions(actions)
                .build();

        // 执行句柄最后绑定：闭包持有已构造好的 definition，用于参数名解析
        return definition.toBuilder()
                .executor((ctx, args) -> invoker.invoke(definition, method, bean, ctx, args))
                .build();
    }

    // ==================== 参数 ====================

    private List<AgentToolDefinition.Param> parseParams(Method method, String location) {
        List<AgentToolDefinition.Param> params = new ArrayList<>();
        Set<String> names = new LinkedHashSet<>();

        Parameter[] parameters = method.getParameters();
        for (int index = 0; index < parameters.length; index++) {
            Parameter parameter = parameters[index];
            // 上下文参数由框架注入，不进入 Schema
            if (AgentToolContext.class.isAssignableFrom(parameter.getType())) {
                continue;
            }
            AgentToolParam annotation = parameter.getAnnotation(AgentToolParam.class);
            if (annotation == null) {
                throw new IllegalStateException(location + " 的参数 " + parameter.getName()
                        + " 缺少 @AgentToolParam（模型需要知道这个参数是什么）");
            }
            requireParamName(parameter, annotation, index, location);
            require(annotation.description(), "参数 " + parameter.getName() + " 缺少 description", location);

            String name = StringUtils.hasText(annotation.name()) ? annotation.name().trim() : parameter.getName();
            if (!names.add(name)) {
                throw new IllegalStateException(location + " 存在重复参数名：" + name);
            }

            AgentParamType type = annotation.type() == AgentParamType.AUTO
                    ? inferType(parameter.getType())
                    : annotation.type();
            validateTypeDeclaration(type, annotation, name, location);

            params.add(new AgentToolDefinition.Param(
                    name,
                    type,
                    parameter.getType(),
                    annotation.description().trim(),
                    annotation.required(),
                    resolveEnums(parameter.getType(), annotation),
                    annotation.format(),
                    annotation.example(),
                    StringUtils.hasText(annotation.defaultValue()) ? annotation.defaultValue() : null,
                    Double.isNaN(annotation.min()) ? null : annotation.min(),
                    Double.isNaN(annotation.max()) ? null : annotation.max(),
                    annotation.pattern()));
        }
        return params;
    }

    /**
     * 参数名是模型唯一能看到的名字，必须可靠。
     *
     * <p>编译未开启 {@code -parameters} 时反射只能拿到 {@code arg0/arg1}，
     * 模型会照着 Schema 给出 {@code arg0}，工具端又报「缺少必填参数 arg0」——
     * 排查起来像玄学。这里在启动期直接失败，并给出两种修法。
     */
    private void requireParamName(Parameter parameter, AgentToolParam annotation, int index, String location) {
        if (StringUtils.hasText(annotation.name())) {
            return;
        }
        if (parameter.getName().matches("arg\\d+")) {
            throw new IllegalStateException(location + " 的第 " + (index + 1) + " 个参数取不到参数名"
                    + "（编译未开启 -parameters）。请二选一：\n"
                    + "  1) 给 @AgentToolParam 显式声明 name；\n"
                    + "  2) 在模块 pom 的 maven-compiler-plugin 开启 <parameters>true</parameters>。");
        }
    }

    /** 未显式声明类型时按 Java 类型推断 */
    private AgentParamType inferType(Class<?> javaType) {
        Class<?> type = wrap(javaType);
        if (type == String.class || type == Character.class || type.isEnum()) {
            return AgentParamType.STRING;
        }
        if (type == Integer.class || type == Long.class || type == Short.class || type == Byte.class) {
            return AgentParamType.INTEGER;
        }
        if (type == Double.class || type == Float.class || type == BigDecimal.class) {
            return AgentParamType.NUMBER;
        }
        if (type == Boolean.class) {
            return AgentParamType.BOOLEAN;
        }
        if (type == LocalDate.class) {
            return AgentParamType.DATE;
        }
        if (type == LocalDateTime.class) {
            return AgentParamType.DATETIME;
        }
        return AgentParamType.OBJECT;
    }

    private void validateTypeDeclaration(AgentParamType type, AgentToolParam annotation,
                                         String name, String location) {
        if ((type == AgentParamType.INTEGER || type == AgentParamType.NUMBER)
                && !StringUtils.hasText(annotation.defaultValue())
                && StringUtils.hasText(annotation.example())) {
            // 仅做提示：示例值必须是数字，否则会误导模型
            try {
                new BigDecimal(annotation.example().trim());
            } catch (NumberFormatException e) {
                throw new IllegalStateException(location + " 的参数 " + name + " 示例值必须是数字：" + annotation.example());
            }
        }
        if ((type == AgentParamType.DATE || type == AgentParamType.DATETIME)
                && !annotation.format().isEmpty()
                && !"date".equals(annotation.format()) && !"date-time".equals(annotation.format())) {
            log.warn("[agent-tool] {}/{} 的 format={} 不是标准值（date / date-time）", location, name, annotation.format());
        }
    }

    /** 枚举类型且未显式声明 enums 时，从 Java 枚举自动提取 */
    private List<String> resolveEnums(Class<?> javaType, AgentToolParam annotation) {
        if (annotation.enums().length > 0) {
            return List.of(annotation.enums());
        }
        if (javaType.isEnum()) {
            return Arrays.stream(javaType.getEnumConstants()).map(String::valueOf).toList();
        }
        return List.of();
    }

    // ==================== 返回字段 ====================

    /** 解析方法上的 @AgentToolReturn 声明（可重复），拼进 function description */
    private List<AgentToolDefinition.ReturnField> parseReturns(Method method) {
        List<AgentToolDefinition.ReturnField> returns = new ArrayList<>();
        for (AgentToolReturn annotation : method.getAnnotationsByType(AgentToolReturn.class)) {
            if (StringUtils.hasText(annotation.field()) && StringUtils.hasText(annotation.description())) {
                returns.add(new AgentToolDefinition.ReturnField(
                        annotation.field().trim(), annotation.description().trim()));
            }
        }
        return returns;
    }

    // ==================== 按钮 ====================

    private List<AgentToolDefinition.Action> parseActions(Method method, String location) {
        List<AgentToolDefinition.Action> actions = new ArrayList<>();
        for (AgentToolAction action : method.getAnnotationsByType(AgentToolAction.class)) {
            require(action.label(), "跳转按钮 label 不能为空", location);
            require(action.route(), "跳转按钮 route 不能为空", location);
            actions.add(new AgentToolDefinition.Action(
                    action.label().trim(),
                    action.route().trim(),
                    List.of(action.permissions()),
                    List.of(action.queryParams())));
        }
        return actions;
    }

    // ==================== 兼容旧 SPI ====================

    /**
     * 兼容 {@link AgentToolProvider} 扩展方式：老实现无需改造即可继续被注册。
     * 缺点是没有结构化参数（params 为空），新工具请优先使用注解方式。
     */
    public AgentToolDefinition fromProvider(AgentToolProvider provider) {
        return AgentToolDefinition.builder()
                .name(provider.toolName())
                .title(provider.toolName())
                .description(provider.description())
                .category("legacy")
                .module("")
                .readOnly(true)
                .unitScoped(true)
                .permissions(List.of())
                .params(List.of())
                .paramSchema(schemaRenderer.renderDocument(List.of()))
                .returns(List.of())
                .actions(List.of())
                .executor((ctx, args) -> {
                    try {
                        return provider.execute(AgentToolRequest.builder()
                                .sessionId(ctx.getSessionId())
                                .userCode(ctx.getUserCode())
                                .userName(ctx.getUserName())
                                .unitCode(DataScopeContext.unitCode())
                                .args(args)
                                .build());
                    } catch (Exception e) {
                        log.error("[agent-tool] SPI 工具 {} 执行异常", provider.toolName(), e);
                        return AgentToolResult.fail("查询失败：" + e.getMessage());
                    }
                })
                .build();
    }

    // ==================== 工具方法 ====================

    private Class<?> wrap(Class<?> type) {
        if (!type.isPrimitive()) {
            return type;
        }
        if (type == int.class) {
            return Integer.class;
        }
        if (type == long.class) {
            return Long.class;
        }
        if (type == short.class) {
            return Short.class;
        }
        if (type == byte.class) {
            return Byte.class;
        }
        if (type == double.class) {
            return Double.class;
        }
        if (type == float.class) {
            return Float.class;
        }
        if (type == boolean.class) {
            return Boolean.class;
        }
        if (type == char.class) {
            return Character.class;
        }
        return type;
    }

    private void require(String value, String message, String location) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalStateException(location + "：" + message);
        }
    }
}
