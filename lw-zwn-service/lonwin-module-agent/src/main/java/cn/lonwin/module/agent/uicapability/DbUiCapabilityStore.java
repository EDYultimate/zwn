package cn.lonwin.module.agent.uicapability;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.module.agent.config.AgentConfigSupport;
import cn.lonwin.module.agent.entity.AgentUiCapabilityEntity;
import cn.lonwin.module.agent.mapper.AgentUiCapabilityMapper;
import cn.lonwin.module.agent.service.AgentConfigAuditService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 页面能力声明的数据库实现：一行一个 (client, route)，同时存「代码默认」与「人工覆盖」。
 *
 * <p>数据访问方式仿照 lonwin-module-water：entity + @Mapper extends BaseMapper +
 * resources/mapper/AgentUiCapabilityMapper.xml。SQL 层就限定了边界：
 * updateBaseline 只改 BASELINE_JSON 等基线列，clearOverrides 只清空 OVERRIDE_JSON，
 * 避免前端定时全量上报把页面上人工改过的说明冲掉。
 *
 * <p>为什么必须分成两层：
 * 前端启动、每 5 分钟、切回标签页都会全量上报 {@code src/agent} 里的代码声明，
 * 若只有一列，页面上人工改过的描述几分钟后就被代码值悄悄冲掉。
 * 现在读取时取 OVERRIDE ?? BASELINE，一键还原清掉 OVERRIDE 即可立刻回到代码默认值。
 *
 * <p>数据库是权威存储，内存 Map 只是读缓存：问答链路每次渲染提示词都要读清单，
 * 缓存保证落库后不会给每次对话增加全表查询；写操作同时更新库与缓存。
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "lonwin.agent.ui-capability", name = "store", havingValue = "db")
public class DbUiCapabilityStore implements UiCapabilityStore, UiCapabilityAdminStore {

    private static final String TABLE = "AGENT_UI_CAPABILITY";

    private final AgentUiCapabilityMapper uiCapabilityMapper;
    private final ObjectMapper objectMapper;
    private final AgentConfigAuditService audit;

    /** client → (route → 配置行)，启动时从库里恢复 */
    private final Map<String, Map<String, UiCapabilityRow>> cache = new ConcurrentHashMap<>();

    @PostConstruct
    void load() {
        try {
            List<UiCapabilityRow> rows = uiCapabilityMapper.selectAll().stream()
                    .map(this::toRow)
                    .toList();
            rows.forEach(this::put);
            log.info("[agent] 已从 {} 恢复页面能力声明：{} 个页面、{} 个人工覆盖",
                    TABLE, rows.size(), rows.stream().filter(UiCapabilityRow::overridden).count());
        } catch (Exception e) {
            // 表未建不阻塞启动：清单为空时会由前端全量上报补上，但保存接口会明确提示先建表
            log.error("[agent] 读取 {} 失败，请先执行 sql/agent_config.sql；本次按空清单启动：{}",
                    TABLE, e.getMessage());
        }
    }

    // ==================== 上报主链路（只写基线） ====================

    @Override
    public synchronized void merge(String client, List<UiPageCapability> capabilities) {
        for (UiPageCapability page : capabilities) {
            if (!StringUtils.hasText(page.getRoute())) {
                continue;
            }
            UiCapabilityRow existing = rowOf(client, page.getRoute());
            upsertBaseline(client, page, existing);
            put(new UiCapabilityRow(client, page.getRoute(), page,
                    existing == null ? null : existing.override(),
                    existing == null ? null : existing.updatedBy(),
                    existing == null ? null : existing.updatedAt()));
        }
    }

    @Override
    public synchronized void replaceAll(String client, List<UiPageCapability> capabilities) {
        Set<String> incoming = new LinkedHashSet<>();
        for (UiPageCapability page : capabilities) {
            if (StringUtils.hasText(page.getRoute())) {
                incoming.add(page.getRoute());
            }
        }
        // 全量上报中没出现的页面视为下线：连同它的人工覆盖一起删除，避免留下孤儿配置
        Map<String, UiCapabilityRow> byRoute = cache.get(client);
        if (byRoute != null) {
            for (String route : new ArrayList<>(byRoute.keySet())) {
                if (!incoming.contains(route)) {
                    try {
                        uiCapabilityMapper.deleteByClientAndRoute(client, route);
                    } catch (Exception e) {
                        throw AgentConfigSupport.writeFailed(TABLE, e);
                    }
                    byRoute.remove(route);
                }
            }
        }
        merge(client, capabilities);
    }

    @Override
    public synchronized void clear(String client) {
        try {
            uiCapabilityMapper.deleteByClient(client);
        } catch (Exception e) {
            throw AgentConfigSupport.writeFailed(TABLE, e);
        }
        cache.remove(client);
    }

    @Override
    public List<UiPageCapability> findByClient(String client) {
        return effectiveOf(rowsOf(client));
    }

    @Override
    public List<UiPageCapability> findAll() {
        return effectiveOf(rows());
    }

    @Override
    public Optional<UiPageCapability> findByRoute(String route) {
        return rows().stream()
                .filter(row -> route.equals(row.route()))
                .map(UiCapabilityRow::effective)
                .filter(java.util.Objects::nonNull)
                .findFirst();
    }

    // ==================== 配置页管理接口（只写人工覆盖） ====================

    @Override
    public List<UiCapabilityRow> rows() {
        List<UiCapabilityRow> all = new ArrayList<>();
        cache.values().forEach(byRoute -> all.addAll(byRoute.values()));
        all.sort(Comparator.comparing(UiCapabilityRow::route));
        return all;
    }

    @Override
    public UiCapabilityRow row(String client, String route) {
        return rowOf(client, route);
    }

    @Override
    public List<UiPageCapability> baseline(String client) {
        return rowsOf(client).stream()
                .map(UiCapabilityRow::baseline)
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    @Override
    public synchronized void saveOverride(String client, UiPageCapability page, String operator) {
        UiCapabilityRow existing = rowOf(client, page.getRoute());
        if (existing == null || existing.baseline() == null) {
            throw new BusinessException(400, "代码中尚未声明该页面，不能保存配置：" + page.getRoute());
        }
        String time = AgentConfigSupport.now();
        AgentUiCapabilityEntity entity = new AgentUiCapabilityEntity();
        entity.setClient(client);
        entity.setRoute(page.getRoute());
        entity.setOverrideJson(toJson(page));
        entity.setUpdatedBy(operator);
        entity.setUpdatedAt(time);
        try {
            uiCapabilityMapper.updateOverride(entity);
        } catch (Exception e) {
            throw AgentConfigSupport.writeFailed(TABLE, e);
        }
        put(new UiCapabilityRow(client, page.getRoute(), existing.baseline(), page, operator, time));
        audit.record("UI", page.getRoute(), "OVERRIDE", page);
        log.info("[agent] 页面能力人工配置已落库：{} → {}", page.getRoute(), TABLE);
    }

    @Override
    public synchronized boolean removeOverride(String client, String route) {
        UiCapabilityRow existing = rowOf(client, route);
        if (existing == null || !existing.overridden()) {
            return false;
        }
        String operator = AgentConfigAuditService.currentUser();
        String time = AgentConfigSupport.now();
        try {
            int removed = uiCapabilityMapper.removeOverride(client, route, operator, time);
            if (removed == 0) {
                return false;
            }
        } catch (Exception e) {
            throw AgentConfigSupport.writeFailed(TABLE, e);
        }
        put(new UiCapabilityRow(client, route, existing.baseline(), null, operator, time));
        audit.record("UI", route, "REMOVE", null);
        return true;
    }

    @Override
    public synchronized int clearOverrides() {
        int count;
        String operator = AgentConfigAuditService.currentUser();
        String time = AgentConfigSupport.now();
        try {
            count = uiCapabilityMapper.countOverrides();
            if (count > 0) {
                uiCapabilityMapper.clearOverrides(operator, time);
            }
        } catch (Exception e) {
            throw AgentConfigSupport.writeFailed(TABLE, e);
        }
        // 清缓存里的覆盖，但保留代码基线：还原后提示词仍然是完整的
        for (Map<String, UiCapabilityRow> byRoute : cache.values()) {
            byRoute.replaceAll((route, row) -> new UiCapabilityRow(row.client(), route,
                    row.baseline(), null, operator, time));
        }
        audit.record("RESTORE", "UI", "RESTORE", Map.of("pages", count));
        log.info("[agent] 已一键还原 {} 个页面的人工能力配置，运行时回到代码默认声明", count);
        return count;
    }

    // ==================== 内部实现（领域对象 ↔ 实体） ====================

    private void upsertBaseline(String client, UiPageCapability page, UiCapabilityRow existing) {
        AgentUiCapabilityEntity entity = new AgentUiCapabilityEntity();
        entity.setClient(client);
        entity.setRoute(page.getRoute());
        entity.setTitle(page.getTitle());
        entity.setRequiredActUrl(page.getRequiredActUrl());
        entity.setVersion(page.getVersion());
        entity.setBaselineJson(toJson(page));
        try {
            boolean exists = existing != null;
            if (exists) {
                uiCapabilityMapper.updateBaseline(entity);
            } else {
                uiCapabilityMapper.insertBaseline(entity);
            }
        } catch (Exception e) {
            throw AgentConfigSupport.writeFailed(TABLE, e);
        }
    }

    private UiCapabilityRow toRow(AgentUiCapabilityEntity entity) {
        return new UiCapabilityRow(entity.getClient(), entity.getRoute(),
                parse(entity.getBaselineJson()), parse(entity.getOverrideJson()),
                entity.getUpdatedBy(), entity.getUpdatedAt());
    }

    private UiPageCapability parse(String json) {
        if (!StringUtils.hasText(json)) {
            return null;
        }
        try {
            return objectMapper.readValue(json, UiPageCapability.class);
        } catch (JsonProcessingException e) {
            log.warn("[agent] 页面能力声明 JSON 解析失败，忽略该行：{}（{}）", e.getMessage(), json);
            return null;
        }
    }

    private String toJson(UiPageCapability page) {
        try {
            return objectMapper.writeValueAsString(page);
        } catch (JsonProcessingException e) {
            throw new BusinessException(500, "页面能力声明序列化失败：" + e.getMessage());
        }
    }

    private void put(UiCapabilityRow row) {
        cache.computeIfAbsent(row.client(), key -> new ConcurrentHashMap<>()).put(row.route(), row);
    }

    private UiCapabilityRow rowOf(String client, String route) {
        Map<String, UiCapabilityRow> byRoute = cache.get(client);
        return byRoute == null ? null : byRoute.get(route);
    }

    private List<UiCapabilityRow> rowsOf(String client) {
        Map<String, UiCapabilityRow> byRoute = cache.get(client);
        return byRoute == null ? List.of() : new ArrayList<>(byRoute.values());
    }

    private List<UiPageCapability> effectiveOf(List<UiCapabilityRow> rows) {
        List<UiPageCapability> result = new ArrayList<>(rows.size());
        for (UiCapabilityRow row : rows) {
            UiPageCapability effective = row.effective();
            if (effective != null) {
                result.add(effective);
            }
        }
        return result;
    }
}
