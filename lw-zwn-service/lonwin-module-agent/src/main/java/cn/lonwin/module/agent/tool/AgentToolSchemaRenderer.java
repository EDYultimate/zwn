package cn.lonwin.module.agent.tool;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import lombok.RequiredArgsConstructor;

/**
 * 参数 JSON Schema 渲染器：生成 OpenAI function calling 的
 * {@code function.parameters} 完整 document（type=object + properties + required）。
 *
 * <p>为什么单独抽出来：Schema 既在启动期生成（注解 → 定义），
 * 也可能在运行期重新生成（管理接口改了参数描述 → 重算 Schema）。
 * 放在工厂里会迫使「运行期改描述」去依赖工厂，职责不清。
 */
@Component
@RequiredArgsConstructor
public class AgentToolSchemaRenderer {

    /**
     * 生成完整 JSON Schema document：
     * {@code {"type":"object","properties":{...},"required":[...]}}。
     *
     * <p>properties 里只保留模型真正需要的字段：类型、说明、枚举、范围、示例、缺省值。
     */
    public Map<String, Object> renderDocument(List<AgentToolDefinition.Param> params) {
        Map<String, Object> document = new LinkedHashMap<>();
        document.put("type", "object");
        if (params == null || params.isEmpty()) {
            document.put("properties", Map.of());
            document.put("required", List.of());
            return document;
        }
        Map<String, Object> properties = new LinkedHashMap<>();
        List<String> required = new ArrayList<>();
        for (AgentToolDefinition.Param param : params) {
            Map<String, Object> property = new LinkedHashMap<>();
            property.put("type", param.schemaType());
            property.put("description", param.description());
            if (!param.enums().isEmpty()) {
                property.put("enum", param.enums());
            }
            if (StringUtils.hasText(param.format())) {
                property.put("format", param.format());
            }
            if (StringUtils.hasText(param.example())) {
                property.put("example", param.example());
            }
            if (param.defaultValue() != null) {
                property.put("default", param.defaultValue());
            }
            if (param.min() != null) {
                property.put("minimum", param.min());
            }
            if (param.max() != null) {
                property.put("maximum", param.max());
            }
            if (StringUtils.hasText(param.pattern())) {
                property.put("pattern", param.pattern());
            }
            properties.put(param.name(), property);
            if (param.required()) {
                required.add(param.name());
            }
        }
        document.put("properties", properties);
        document.put("required", required);
        return document;
    }
}
