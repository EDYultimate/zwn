package cn.lonwin.module.agent.tool;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.common.core.constant.ResponseCode;
import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.module.agent.datascope.DataScopeContext;
import cn.lonwin.module.agent.model.vo.AgentActionVO;
import cn.lonwin.module.agent.spi.AgentToolResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 注解工具的反射执行器：参数绑定 → 强校验 → 调用 → 结果归一。
 *
 * <p>设计原则：<b>任何异常都不向上抛</b>。参数错误、业务异常都会转成
 * {@link AgentToolResult#fail} 回填给模型，让模型用自然语言向用户解释，
 * 避免一次查询失败导致整个问答 500。
 *
 * <p>参数错误信息刻意写得具体（「缺少必填参数 year」「参数 month 需在 1~12 之间」），
 * 因为这些文本会进入模型上下文，模型据此可以在下一轮自我纠正。
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AgentToolInvoker {

    /** 成功结果的来源标记：api = 业务数据接口，kb = 知识库（知识侧自行声明，不覆盖） */
    public static final String SOURCE_KEY = "source";
    public static final String TOOL_KEY = "tool";
    public static final String QUERIED_AT_KEY = "queriedAt";
    public static final String SOURCE_API = "api";

    private final ObjectMapper objectMapper;

    /**
     * 执行工具方法。
     *
     * @param definition 工具定义（提供参数元数据与按钮定义）
     * @param method     注解所在的方法（取接口方法，保证代理环境下也能正确调用）
     * @param bean       工具实现 Bean
     * @param ctx        执行上下文（会话 / 用户 / 单位）
     * @param args       模型给出的原始参数
     */
    public AgentToolResult invoke(AgentToolDefinition definition, Method method, Object bean,
                                  AgentToolContext ctx, Map<String, Object> args) {
        Object[] methodArgs;
        try {
            methodArgs = bind(definition, method, ctx, args);
        } catch (ToolArgumentException e) {
            log.warn("[agent-tool] {} 参数校验未通过：{}，原始参数={}", definition.getName(), e.getMessage(), args);
            return AgentToolResult.fail(e.getMessage());
        }

        Object returnValue;
        try {
            returnValue = method.invoke(bean, methodArgs);
        } catch (InvocationTargetException e) {
            Throwable cause = e.getTargetException();
            if (cause instanceof BusinessException businessException) {
                log.warn("[agent-tool] {} 业务校验失败：{}", definition.getName(), businessException.getMessage());
                return AgentToolResult.fail(businessException.getMessage());
            }
            log.error("[agent-tool] {} 执行异常，参数={}", definition.getName(), args, cause);
            return AgentToolResult.fail("查询失败：" + safeMessage(cause));
        } catch (Exception e) {
            log.error("[agent-tool] {} 调用失败，参数={}", definition.getName(), args, e);
            return AgentToolResult.fail("查询失败：" + safeMessage(e));
        }

        return withActions(definition, decorate(definition, normalize(returnValue)), args);
    }

    // ==================== 参数绑定 ====================

    private Object[] bind(AgentToolDefinition definition, Method method,
                          AgentToolContext ctx, Map<String, Object> args) {
        Parameter[] parameters = method.getParameters();
        Object[] values = new Object[parameters.length];
        for (int i = 0; i < parameters.length; i++) {
            // 上下文参数由框架注入，不参与 Schema，模型也看不到
            if (AgentToolContext.class.isAssignableFrom(parameters[i].getType())) {
                values[i] = ctx;
                continue;
            }
            AgentToolDefinition.Param param = definition.param(parameters[i].getName());
            if (param == null) {
                throw new ToolArgumentException("工具参数未声明描述：" + parameters[i].getName());
            }
            values[i] = convert(param, args == null ? null : args.get(param.name()));
        }
        return values;
    }

    /** 单个参数的类型转换 + 约束校验，失败抛 {@link ToolArgumentException} */
    private Object convert(AgentToolDefinition.Param param, Object raw) {
        boolean absent = raw == null || (raw instanceof String text && text.isBlank());
        if (absent) {
            if (StringUtils.hasText(param.defaultValue())) {
                raw = param.defaultValue();
            } else if (param.required()) {
                throw new ToolArgumentException("缺少必填参数 " + param.name() + "（" + param.description() + "）");
            } else {
                return null;
            }
        }

        return switch (param.type()) {
            case STRING, DATE, DATETIME -> convertText(param, raw);
            case INTEGER, NUMBER -> convertNumber(param, raw);
            case BOOLEAN -> convertBoolean(param, raw);
            case AUTO, OBJECT -> convertType(param, raw);
        };
    }

    private Object convertText(AgentToolDefinition.Param param, Object raw) {
        String value = raw instanceof String text ? text.trim() : String.valueOf(raw);
        if (!param.enums().isEmpty() && !param.enums().contains(value)) {
            throw new ToolArgumentException("参数 " + param.name() + " 只能取以下值之一："
                    + String.join("、", param.enums()) + "，当前为 " + value);
        }
        if (StringUtils.hasText(param.pattern()) && !Pattern.compile(param.pattern()).matcher(value).matches()) {
            throw new ToolArgumentException("参数 " + param.name() + " 格式不正确，当前为 " + value);
        }
        return convertType(param, value);
    }

    private Object convertNumber(AgentToolDefinition.Param param, Object raw) {
        BigDecimal value;
        try {
            value = raw instanceof Number number
                    ? new BigDecimal(number.toString())
                    : new BigDecimal(String.valueOf(raw).trim());
        } catch (NumberFormatException e) {
            throw new ToolArgumentException("参数 " + param.name() + " 需要是数字，当前为 " + raw);
        }
        if (param.min() != null && value.compareTo(BigDecimal.valueOf(param.min())) < 0) {
            throw new ToolArgumentException("参数 " + param.name() + " 不能小于 " + trimNumber(param.min()));
        }
        if (param.max() != null && value.compareTo(BigDecimal.valueOf(param.max())) > 0) {
            throw new ToolArgumentException("参数 " + param.name() + " 不能大于 " + trimNumber(param.max()));
        }
        if (!param.enums().isEmpty() && !param.enums().contains(value.stripTrailingZeros().toPlainString())) {
            throw new ToolArgumentException("参数 " + param.name() + " 只能取以下值之一："
                    + String.join("、", param.enums()));
        }
        return convertType(param, value);
    }

    private Object convertBoolean(AgentToolDefinition.Param param, Object raw) {
        if (raw instanceof Boolean flag) {
            return convertType(param, flag);
        }
        String text = String.valueOf(raw).trim().toLowerCase();
        if ("true".equals(text) || "1".equals(text) || "是".equals(text)) {
            return convertType(param, Boolean.TRUE);
        }
        if ("false".equals(text) || "0".equals(text) || "否".equals(text)) {
            return convertType(param, Boolean.FALSE);
        }
        throw new ToolArgumentException("参数 " + param.name() + " 需要是布尔值（true/false）");
    }

    /** 最终交给 Jackson 做目标类型转换，失败时给出人话提示 */
    private Object convertType(AgentToolDefinition.Param param, Object value) {
        try {
            return objectMapper.convertValue(value, param.javaType());
        } catch (IllegalArgumentException e) {
            throw new ToolArgumentException("参数 " + param.name() + " 取值不合法：" + value
                    + "，期望类型 " + param.schemaType());
        }
    }

    // ==================== 结果增强 ====================

    /**
     * 统一给成功结果补「来源标记」。
     *
     * <p>为什么由框架做而不是各工具自己写：这件事与业务无关、每个工具都要做，
     * 放在这里实现类就可以安心只写「查什么、怎么映射」。
     * 也正因为如此，能力清单只需要一个文件——不必为了打标记再留一个实现层。
     *
     * <p>{@code source/tool/queriedAt} 用 {@code putIfAbsent}，工具自己声明过的不覆盖
     * （知识侧返回 {@code source=kb}，必须保留，不能被改成 api）。
     */
    private AgentToolResult decorate(AgentToolDefinition definition, AgentToolResult result) {
        if (result == null || !result.isSuccess()) {
            return result;
        }
        Map<String, Object> data = new LinkedHashMap<>();
        if (result.getData() != null) {
            data.putAll(result.getData());
        }
        data.putIfAbsent(SOURCE_KEY, SOURCE_API);
        data.putIfAbsent(TOOL_KEY, definition.getName());
        data.putIfAbsent(QUERIED_AT_KEY, LocalDate.now().toString());
        return result.toBuilder().data(data).build();
    }

    // ==================== 结果归一 ====================

    /**
     * 支持三种返回类型：
     * <ul>
     *   <li>{@link AgentToolResult}：完整控制 data / summary；</li>
     *   <li>{@link Result}：直接复用一个现有的 Controller 方法返回值；</li>
     *   <li>其它对象 / Map：自动序列化为结构化数据。</li>
     * </ul>
     */
    @SuppressWarnings("unchecked")
    private AgentToolResult normalize(Object returnValue) {
        if (returnValue == null) {
            return AgentToolResult.ok(Map.of(), null);
        }
        if (returnValue instanceof AgentToolResult result) {
            return result;
        }
        if (returnValue instanceof Result<?> result) {
            if (result.getCode() != null && !ResponseCode.SUCCESS.getCode().equals(result.getCode())) {
                return AgentToolResult.fail(StringUtils.hasText(result.getMessage()) ? result.getMessage() : "查询失败");
            }
            return AgentToolResult.ok(toMap(result.getData()), null);
        }
        if (returnValue instanceof Map<?, ?> map) {
            return AgentToolResult.ok((Map<String, Object>) map, null);
        }
        return AgentToolResult.ok(toMap(returnValue), null);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> toMap(Object data) {
        if (data == null) {
            return Map.of();
        }
        if (data instanceof Map<?, ?> map) {
            return (Map<String, Object>) map;
        }
        try {
            return objectMapper.convertValue(data, Map.class);
        } catch (IllegalArgumentException e) {
            return Map.of("result", String.valueOf(data));
        }
    }

    /** 把注解里声明的跳转按钮补进结果，query 取模型入参 */
    private AgentToolResult withActions(AgentToolDefinition definition, AgentToolResult result,
                                        Map<String, Object> args) {
        if (definition.getActions().isEmpty()) {
            return result;
        }
        List<AgentActionVO> actions = new ArrayList<>(
                result.getActions() == null ? List.of() : result.getActions());

        // 单位从数据权限上下文读取：开关关闭时为 null，按钮 query 里就不会出现 unitCode
        String unitCode = DataScopeContext.unitCode();
        for (AgentToolDefinition.Action spec : definition.getActions()) {
            boolean duplicated = actions.stream()
                    .anyMatch(exists -> spec.route().equals(exists.getRoutePath()));
            if (duplicated) {
                continue;
            }
            Map<String, Object> query = new LinkedHashMap<>();
            for (String paramName : spec.queryParams()) {
                Object value = args == null ? null : args.get(paramName);
                if (value != null) {
                    query.put(paramName, value);
                }
            }
            if (definition.isUnitScoped() && StringUtils.hasText(unitCode)) {
                query.putIfAbsent("unitCode", unitCode);
            }
            actions.add(AgentActionVO.builder()
                    .type(AgentActionVO.TYPE_JUMP)
                    .label(spec.label())
                    .routePath(spec.route())
                    .query(query)
                    .requiredActUrl(spec.permissions().isEmpty() ? spec.route() : spec.permissions().get(0))
                    .build());
        }
        return result.toBuilder().actions(actions).build();
    }

    private String safeMessage(Throwable throwable) {
        String message = throwable == null ? null : throwable.getMessage();
        return StringUtils.hasText(message) ? message : "服务内部错误";
    }

    private String trimNumber(Double value) {
        return BigDecimal.valueOf(value).stripTrailingZeros().toPlainString();
    }

    /** 参数不合法：属于「模型可以自我纠正」的错误，不作为系统异常记录 */
    private static class ToolArgumentException extends RuntimeException {
        ToolArgumentException(String message) {
            super(message);
        }
    }
}
