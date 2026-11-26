package cn.lonwin.module.agent.tool.meta;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import cn.lonwin.common.core.context.UserContext;
import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.common.core.model.dto.LoginUserDTO;
import cn.lonwin.module.agent.tool.AgentToolDefinition;
import cn.lonwin.module.agent.tool.AgentToolSchemaRenderer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 工具元数据的加载、合并与写入。
 *
 * <p>核心规则：<b>注解是默认值，存储里的记录是覆盖值，空字段不覆盖</b>。
 * 因此「改一句描述」只需要存一个 {@code {"name":"...","description":"..."}}，
 * 新增参数后也不用回来补元数据——未覆盖的字段自动跟随代码。
 *
 * <p>加载时机：
 * <ol>
 *   <li><b>启动</b>：{@code AgentToolRegistry} 构造时调用 {@link #apply}，把覆盖项合并进工具定义；</li>
 *   <li><b>管理接口写入后</b>：{@link #save} / {@link #remove} 立即重载，由注册表刷新快照；</li>
 *   <li><b>手工刷新</b>：{@code POST /api/agent/tools/refresh}，用于直接改文件后不重启生效。</li>
 * </ol>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AgentToolMetaService {

    private static final int MAX_TITLE_LENGTH = 50;
    private static final int MAX_DESCRIPTION_LENGTH = 1000;
    private static final int MAX_EXAMPLES = 10;
    private static final int MAX_EXAMPLE_LENGTH = 100;
    private static final int MAX_PARAM_DESCRIPTION_LENGTH = 200;

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final AgentToolMetaStore store;
    private final AgentToolSchemaRenderer schemaRenderer;

    /** 最近一次从存储加载的结果，供管理接口展示「是否被覆盖」 */
    private volatile Map<String, AgentToolMeta> overrides = Map.of();

    /** 从存储重新加载（文件/DB 被外部改动时也走这里） */
    public Map<String, AgentToolMeta> reload() {
        Map<String, AgentToolMeta> loaded = store.loadAll();
        this.overrides = Map.copyOf(loaded);
        log.info("[agent-tool] 工具元数据加载完成，来源={}，覆盖项={} 个", store.location(), loaded.size());
        return this.overrides;
    }

    /** 最近一次加载的覆盖项 */
    public Map<String, AgentToolMeta> overrides() {
        return overrides;
    }

    public AgentToolMeta find(String name) {
        return name == null ? null : overrides.get(name);
    }

    /**
     * 把覆盖项合并进工具定义。
     *
     * @param baseline 由注解生成的原始定义（不受覆盖影响）
     * @return 生效定义：已过滤 {@code enabled=false} 的工具，并应用了文案与参数说明覆盖
     */
    public List<AgentToolDefinition> apply(List<AgentToolDefinition> baseline) {
        Map<String, AgentToolMeta> current = reload();
        List<AgentToolDefinition> effective = new ArrayList<>(baseline.size());
        Set<String> baselineNames = new LinkedHashSet<>();

        for (AgentToolDefinition definition : baseline) {
            baselineNames.add(definition.getName());
            AgentToolMeta meta = current.get(definition.getName());
            if (meta == null) {
                effective.add(definition);
                continue;
            }
            if (Boolean.FALSE.equals(meta.getEnabled())) {
                log.info("[agent-tool] 工具 {} 已被管理端停用，本次不注册", definition.getName());
                continue;
            }
            effective.add(applyMeta(definition, meta));
        }

        // 代码里删掉的工具，其覆盖记录会残留：只告警不删除，避免误删人工维护的文案
        Set<String> stale = new LinkedHashSet<>(current.keySet());
        stale.removeAll(baselineNames);
        if (!stale.isEmpty()) {
            log.warn("[agent-tool] 以下元数据覆盖项在代码中已不存在，可清理：{}", stale);
        }
        if (!current.isEmpty()) {
            log.info("[agent-tool] 已应用元数据覆盖 {} 项，生效工具 {} 个", current.size(), effective.size());
        }
        return effective;
    }

    /**
     * 保存覆盖项（不负责刷新注册表，由调用方编排）。
     *
     * <p>只允许改文案类字段；{@code name} 必须是已存在的工具，防止写入孤儿记录。
     */
    public void save(AgentToolMeta meta, Set<String> knownNames) {
        AgentToolMeta normalized = normalize(meta);
        if (!knownNames.contains(normalized.getName())) {
            throw new BusinessException(400, "工具不存在：" + normalized.getName());
        }
        LoginUserDTO user = UserContext.get();
        if (user != null && StringUtils.hasText(user.getUserCode())) {
            normalized.setUpdatedBy(user.getUserCode());
        }
        normalized.setUpdatedAt(LocalDateTime.now().format(TIME_FORMAT));
        store.save(normalized);
        reload();
    }

    public boolean remove(String name) {
        boolean removed = store.remove(name);
        reload();
        return removed;
    }

    /** 清空全部覆盖项（一键还原），返回清除条数 */
    public int clearAll() {
        int removed = store.clearAll();
        reload();
        return removed;
    }

    // ==================== 内部实现 ====================

    /**
     * 覆盖合并：只替换非空字段，参数说明按参数名逐个替换。
     *
     * <p>公开是为了让管理接口在展示「已停用工具」时也能看到覆盖后的文案——
     * 停用只是不注册给模型，不代表覆盖失效。
     */
    public AgentToolDefinition applyMeta(AgentToolDefinition definition, AgentToolMeta meta) {
        if (meta == null) {
            return definition;
        }
        AgentToolDefinition.AgentToolDefinitionBuilder builder = definition.toBuilder();

        if (StringUtils.hasText(meta.getTitle())) {
            builder.title(meta.getTitle().trim());
        }
        if (StringUtils.hasText(meta.getDescription())) {
            builder.description(meta.getDescription().trim());
        }
        if (StringUtils.hasText(meta.getCategory())) {
            builder.category(meta.getCategory().trim());
        }
        if (meta.getParamDescriptions() != null && !meta.getParamDescriptions().isEmpty()) {
            List<AgentToolDefinition.Param> params = new ArrayList<>(definition.getParams().size());
            for (AgentToolDefinition.Param param : definition.getParams()) {
                String overridden = meta.getParamDescriptions().get(param.name());
                params.add(StringUtils.hasText(overridden) ? param.withDescription(overridden.trim()) : param);
            }
            // 参数说明变了，Schema 必须重算，否则下发给模型的还是旧描述
            builder.params(List.copyOf(params)).paramSchema(schemaRenderer.renderDocument(params));
        }
        return builder.build();
    }

    /** 去掉首尾空白、空串转 null、空集合转 null（表示不覆盖），并做长度与数量校验 */
    private AgentToolMeta normalize(AgentToolMeta meta) {
        if (meta == null || !StringUtils.hasText(meta.getName())) {
            throw new BusinessException(400, "工具名 name 不能为空");
        }
        String name = meta.getName().trim();

        String title = trimToNull(meta.getTitle());
        if (title != null && title.length() > MAX_TITLE_LENGTH) {
            throw new BusinessException(400, "工具标题不能超过 " + MAX_TITLE_LENGTH + " 个字符");
        }
        String description = trimToNull(meta.getDescription());
        if (description != null && description.length() > MAX_DESCRIPTION_LENGTH) {
            throw new BusinessException(400, "工具描述不能超过 " + MAX_DESCRIPTION_LENGTH + " 个字符");
        }

        List<String> examples = null;
        if (meta.getExamples() != null) {
            List<String> cleaned = meta.getExamples().stream()
                    .map(this::trimToNull)
                    .filter(java.util.Objects::nonNull)
                    .toList();
            if (cleaned.size() > MAX_EXAMPLES) {
                throw new BusinessException(400, "问法示例不能超过 " + MAX_EXAMPLES + " 条");
            }
            for (String example : cleaned) {
                if (example.length() > MAX_EXAMPLE_LENGTH) {
                    throw new BusinessException(400, "单条问法示例不能超过 " + MAX_EXAMPLE_LENGTH + " 个字符");
                }
            }
            examples = cleaned.isEmpty() ? null : cleaned;
        }

        Map<String, String> paramDescriptions = null;
        if (meta.getParamDescriptions() != null && !meta.getParamDescriptions().isEmpty()) {
            Map<String, String> cleaned = new LinkedHashMap<>();
            meta.getParamDescriptions().forEach((key, value) -> {
                String paramName = trimToNull(key);
                String text = trimToNull(value);
                if (paramName != null && text != null) {
                    if (text.length() > MAX_PARAM_DESCRIPTION_LENGTH) {
                        throw new BusinessException(400,
                                "参数 " + paramName + " 的说明不能超过 " + MAX_PARAM_DESCRIPTION_LENGTH + " 个字符");
                    }
                    cleaned.put(paramName, text);
                }
            });
            paramDescriptions = cleaned.isEmpty() ? null : cleaned;
        }

        return AgentToolMeta.builder()
                .name(name)
                .title(title)
                .description(description)
                .examples(examples)
                .category(trimToNull(meta.getCategory()))
                .enabled(meta.getEnabled())
                .paramDescriptions(paramDescriptions)
                .updatedBy(trimToNull(meta.getUpdatedBy()))
                .updatedAt(trimToNull(meta.getUpdatedAt()))
                .build();
    }

    private String trimToNull(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return value.trim();
    }
}
