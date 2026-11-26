package cn.lonwin.module.agent.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.module.agent.model.vo.AgentToolMetaVO;
import cn.lonwin.module.agent.tool.AgentToolDefinition;
import cn.lonwin.module.agent.tool.AgentToolRegistry;
import cn.lonwin.module.agent.tool.meta.AgentToolMeta;
import cn.lonwin.module.agent.tool.meta.AgentToolMetaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 工具元数据管理编排：读 → 改 → 存储 → 刷新注册表。
 *
 * <p>刷新放在这里而不是 Controller 里，是为了保证「先落库、再刷新、失败回滚提示」的顺序只有一处实现。
 * 注册表刷新失败时旧快照继续生效（模型仍可用旧描述），不会出现「配置写坏了整个问答不可用」。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AgentToolAdminService {

    private final AgentToolRegistry registry;
    private final AgentToolMetaService metaService;

    /** 全部工具（含被停用的），按工具名排序 */
    public List<AgentToolMetaVO> list() {
        metaService.reload();
        List<AgentToolMetaVO> result = new ArrayList<>();
        registry.baselineTools().values().stream()
                .map(definition -> toVO(definition, registry.find(definition.getName()).isPresent()))
                .forEach(result::add);
        return result;
    }

    public AgentToolMetaVO detail(String name) {
        AgentToolDefinition definition = registry.baselineTools().get(name);
        if (definition == null) {
            throw new BusinessException(404, "工具不存在：" + name);
        }
        return toVO(definition, registry.find(name).isPresent());
    }

    /**
     * 更新工具元数据并立即生效。
     *
     * @param name 路径上的工具名，优先于请求体（防止 body 与 URL 不一致时改错工具）
     */
    public AgentToolMetaVO update(String name, AgentToolMeta meta) {
        meta.setName(name);
        metaService.save(meta, registry.baselineNames());
        refreshRegistry();
        return detail(name);
    }

    /** 删除覆盖项，恢复为注解默认值 */
    public boolean reset(String name) {
        if (!registry.baselineNames().contains(name)) {
            throw new BusinessException(404, "工具不存在：" + name);
        }
        boolean removed = metaService.remove(name);
        refreshRegistry();
        return removed;
    }

    /**
     * 一键还原：删除存储里的全部工具元数据覆盖项，立即回到 {@code @AgentTool} 注解默认值。
     *
     * <p>DB 存储下由 Mapper 一条 DELETE 完成（见 AgentToolMetaMapper.xml 的 deleteAll），
     * 文件/内存存储走接口默认实现的逐条删除，三种实现行为一致。
     *
     * @return 被清除的覆盖项数量与刷新后的快照版本
     */
    public Map<String, Object> restoreAll() {
        int removed = metaService.clearAll();
        AgentToolRegistry.Snapshot snapshot = refreshRegistry();
        log.info("[agent-tool] 一键还原完成：清除 {} 条工具元数据覆盖，回到注解默认值", removed);
        return Map.of("toolOverrides", removed, "toolVersion", snapshot.version());
    }

    /** 从存储重新加载并重建快照（直接改文件后用它生效，无需重启） */
    public Map<String, Object> refresh() {
        // registry.refresh() 内部会重新读取存储，这里不再重复 reload，避免同一份配置被读两遍
        AgentToolRegistry.Snapshot snapshot = refreshRegistry();
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("version", snapshot.version());
        result.put("size", snapshot.tools().size());
        result.put("tools", snapshot.tools().keySet());
        result.put("store", metaService.overrides().size());
        return result;
    }

    private AgentToolRegistry.Snapshot refreshRegistry() {
        try {
            return registry.refresh();
        } catch (IllegalStateException e) {
            // 保留旧快照，把原因如实告诉调用方
            throw new BusinessException(500, "工具注册表刷新失败：" + e.getMessage());
        }
    }

    private AgentToolMetaVO toVO(AgentToolDefinition baseline, boolean enabled) {
        AgentToolMeta meta = metaService.find(baseline.getName());
        // 生效工具：注册表里已是合并结果；停用工具：手动合并一次，保证展示的是覆盖后的文案
        AgentToolDefinition effective = enabled
                ? registry.find(baseline.getName()).orElse(baseline)
                : metaService.applyMeta(baseline, meta);

        List<AgentToolMetaVO.ParamView> params = new ArrayList<>();
        for (AgentToolDefinition.Param param : effective.getParams()) {
            params.add(AgentToolMetaVO.ParamView.builder()
                    .name(param.name())
                    .type(param.schemaType())
                    .description(param.description())
                    .required(param.required())
                    .enums(param.enums())
                    .build());
        }

        List<AgentToolMetaVO.ActionView> actions = new ArrayList<>();
        for (AgentToolDefinition.Action action : effective.getActions()) {
            actions.add(AgentToolMetaVO.ActionView.builder()
                    .label(action.label())
                    .route(action.route())
                    .queryParams(action.queryParams())
                    .build());
        }

        return AgentToolMetaVO.builder()
                .name(effective.getName())
                .title(effective.getTitle())
                .description(effective.getDescription())
                .category(effective.getCategory())
                .enabled(enabled)
                .overridden(meta != null)
                .permissions(effective.getPermissions())
                .actions(actions)
                .params(params)
                .updatedBy(Optional.ofNullable(meta).map(AgentToolMeta::getUpdatedBy).orElse(null))
                .updatedAt(Optional.ofNullable(meta).map(AgentToolMeta::getUpdatedAt).orElse(null))
                .build();
    }
}
