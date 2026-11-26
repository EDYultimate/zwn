package cn.lonwin.module.agent.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cn.lonwin.common.core.base.BaseController;
import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.module.agent.annotation.RequireActUrl;
import cn.lonwin.module.agent.config.AgentProperties;
import cn.lonwin.module.agent.model.vo.UiCapabilityConfigVO;
import cn.lonwin.module.agent.service.AgentConfigAuditService;
import cn.lonwin.module.agent.service.AgentToolAdminService;
import cn.lonwin.module.agent.tool.meta.AgentToolMetaService;
import cn.lonwin.module.agent.uicapability.UiCapabilityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 在线配置的全局入口：状态查看与「一键还原」。
 *
 * <p>一键还原同时作用于两个配置页（工具描述 + 页面能力）：
 * 清空 AGENT_TOOL_META 的覆盖行、清空 AGENT_UI_CAPABILITY 的 OVERRIDE_JSON，
 * 并立即重建工具快照与事件白名单索引。还原后运行时读取的是
 * 「代码里的默认值」——工具来自 {@code @AgentTool} 注解，页面能力来自前端
 * {@code src/agent} 下各 &lt;pageKey&gt;.ts 声明（即已落库的 BASELINE_JSON）。
 */
@Slf4j
@RestController
@RequestMapping("/agent/config")
@RequiredArgsConstructor
@Tag(name = "智能问答-在线配置", description = "配置状态与一键还原")
public class AgentConfigController extends BaseController {

    private final AgentToolAdminService toolAdminService;
    private final AgentToolMetaService metaService;
    private final UiCapabilityService uiCapabilityService;
    private final AgentProperties properties;
    private final AgentConfigAuditService audit;

    @Operation(summary = "配置状态", description = "当前存储方式、人工覆盖数量、页面基线数量")
    @RequireActUrl("/agent/config")
    @GetMapping("/status")
    public Result<Map<String, Object>> status() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("toolStore", properties.getTools().getMetaStore());
        status.put("uiStore", properties.getUiCapability().getStore());
        status.put("toolOverrides", metaService.reload().size());
        status.put("uiPages", uiCapabilityService.all().size());
        try {
            status.put("uiOverrides", uiCapabilityService.configs().stream()
                    .filter(UiCapabilityConfigVO::isOverridden).count());
        } catch (BusinessException e) {
            // 非 db 存储没有人工覆盖概念，状态接口仍要可用
            status.put("uiOverrides", 0);
        }
        return Result.success(status);
    }

    @Operation(summary = "一键还原",
            description = "清空工具与页面能力的全部人工配置，立即回到代码默认值；两个配置页共用此按钮")
    @RequireActUrl("/agent/config/restore")
    @PostMapping("/restore")
    public Result<Map<String, Object>> restore() {
        Map<String, Object> result = new LinkedHashMap<>(toolAdminService.restoreAll());
        try {
            result.put("uiOverrides", uiCapabilityService.clearOverrides());
        } catch (BusinessException e) {
            // 非 db 存储下页面能力没有人工覆盖，工具部分仍然照常还原
            log.warn("[agent-config] 跳过页面能力还原：{}", e.getMessage());
            result.put("uiOverrides", 0);
        }
        result.put("uiPages", uiCapabilityService.all().size());
        audit.record("RESTORE", "ALL", "RESTORE", result);
        return Result.success("已一键还原为代码默认配置", result);
    }
}
