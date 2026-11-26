package cn.lonwin.module.agent.tool.meta;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.module.agent.config.AgentConfigSupport;
import cn.lonwin.module.agent.entity.AgentToolMetaEntity;
import cn.lonwin.module.agent.mapper.AgentToolMetaMapper;
import cn.lonwin.module.agent.service.AgentConfigAuditService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 工具元数据的数据库实现：配置页每次 PUT 都通过 AgentToolMetaMapper 立即写 AGENT_TOOL_META。
 *
 * <p>数据访问方式仿照 lonwin-module-water：entity + @Mapper extends BaseMapper +
 * resources/mapper/*.xml；Store 只负责领域对象与实体的相互转换，不写 SQL。
 *
 * <p>「注解默认值依旧在代码里，表里只放人工覆盖项」这条规则不变：
 * {@link AgentToolMetaService#apply} 仍负责把覆盖合并进注解定义，
 * 所以删掉表里全部行就等价于「一键还原到代码默认」。
 *
 * <p>读操作只在注册表构建/刷新与管理页查询时发生，问答请求读的是内存快照，
 * 不会因为落库给每次对话增加一次 SQL。
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "lonwin.agent.tools", name = "meta-store", havingValue = "db")
public class DbAgentToolMetaStore implements AgentToolMetaStore {

    private static final String TABLE = "AGENT_TOOL_META";

    private final AgentToolMetaMapper toolMetaMapper;
    private final ObjectMapper objectMapper;
    private final AgentConfigAuditService audit;

    @Override
    public synchronized Map<String, AgentToolMeta> loadAll() {
        try {
            Map<String, AgentToolMeta> result = new LinkedHashMap<>();
            for (AgentToolMetaEntity entity : toolMetaMapper.selectAll()) {
                result.put(entity.getName(), toMeta(entity));
            }
            return result;
        } catch (Exception e) {
            // 表还没建不能拖垮应用启动：按「无人工覆盖」运行，保存时再给出明确报错
            log.error("[agent-tool] 读取 {} 失败，请先执行 sql/agent_config.sql；本次按注解默认值运行：{}",
                    TABLE, e.getMessage());
            return Map.of();
        }
    }

    @Override
    public synchronized void save(AgentToolMeta meta) {
        AgentToolMetaEntity entity = toEntity(meta);
        entity.setUpdatedAt(StringUtils.hasText(meta.getUpdatedAt())
                ? meta.getUpdatedAt() : AgentConfigSupport.now());
        entity.setUpdatedBy(StringUtils.hasText(meta.getUpdatedBy())
                ? meta.getUpdatedBy() : AgentConfigAuditService.currentUser());
        try {
            // 与 lonwin-module-water 的新增/修改写法一致：先按业务主键查，再决定 insert / update
            boolean exists = toolMetaMapper.selectByName(meta.getName()) != null;
            if (exists) {
                toolMetaMapper.updateOne(entity);
            } else {
                toolMetaMapper.insertOne(entity);
            }
        } catch (Exception e) {
            throw AgentConfigSupport.writeFailed(TABLE, e);
        }
        audit.record("TOOL", meta.getName(), "UPDATE", meta);
        log.info("[agent-tool] 工具元数据已落库：{} → {}", meta.getName(), TABLE);
    }

    @Override
    public synchronized boolean remove(String name) {
        try {
            int removed = toolMetaMapper.deleteByName(name);
            if (removed > 0) {
                audit.record("TOOL", name, "RESET", null);
                log.info("[agent-tool] 工具元数据覆盖已删除（回到注解默认值）：{}", name);
            }
            return removed > 0;
        } catch (Exception e) {
            throw AgentConfigSupport.writeFailed(TABLE, e);
        }
    }

    /** 一键还原：一条 DELETE 清空覆盖表，避免逐条删除的 N+1 次查询 */
    @Override
    public synchronized int clearAll() {
        try {
            int removed = toolMetaMapper.deleteAll();
            if (removed > 0) {
                audit.record("RESTORE", "ALL", "RESTORE", Map.of("tools", removed));
            }
            return removed;
        } catch (Exception e) {
            throw AgentConfigSupport.writeFailed(TABLE, e);
        }
    }

    @Override
    public String location() {
        return "mybatis:" + TABLE;
    }

    // ==================== 领域对象 ↔ 实体 ====================

    private AgentToolMeta toMeta(AgentToolMetaEntity entity) {
        AgentToolMeta meta = new AgentToolMeta();
        meta.setName(entity.getName());
        meta.setTitle(entity.getTitle());
        meta.setDescription(entity.getDescription());
        meta.setCategory(entity.getCategory());
        if (entity.getEnabled() != null) {
            meta.setEnabled(entity.getEnabled() != 0);
        }
        meta.setUpdatedBy(entity.getUpdatedBy());
        meta.setUpdatedAt(entity.getUpdatedAt());
        meta.setExamples(parseList(entity.getExamplesJson()));
        meta.setParamDescriptions(parseMap(entity.getParamDescJson()));
        return meta;
    }

    private AgentToolMetaEntity toEntity(AgentToolMeta meta) {
        AgentToolMetaEntity entity = new AgentToolMetaEntity();
        entity.setName(meta.getName());
        entity.setTitle(meta.getTitle());
        entity.setDescription(meta.getDescription());
        entity.setCategory(meta.getCategory());
        if (meta.getEnabled() != null) {
            entity.setEnabled(Boolean.TRUE.equals(meta.getEnabled()) ? 1 : 0);
        }
        entity.setExamplesJson(toJson(meta.getExamples()));
        entity.setParamDescJson(toJson(meta.getParamDescriptions()));
        return entity;
    }

    private List<String> parseList(String json) {
        if (!StringUtils.hasText(json)) {
            return null;
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() { });
        } catch (JsonProcessingException e) {
            log.warn("[agent-tool] EXAMPLES_JSON 解析失败，忽略该字段：{}", e.getMessage());
            return null;
        }
    }

    private Map<String, String> parseMap(String json) {
        if (!StringUtils.hasText(json)) {
            return null;
        }
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, String>>() { });
        } catch (JsonProcessingException e) {
            log.warn("[agent-tool] PARAM_DESC_JSON 解析失败，忽略该字段：{}", e.getMessage());
            return null;
        }
    }

    private String toJson(Object value) {
        if (value == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            throw new BusinessException(500, "工具元数据序列化失败：" + e.getMessage());
        }
    }
}
