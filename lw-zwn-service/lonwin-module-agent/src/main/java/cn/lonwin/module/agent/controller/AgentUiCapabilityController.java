package cn.lonwin.module.agent.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cn.lonwin.common.core.base.BaseController;
import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.module.agent.annotation.RequireActUrl;
import cn.lonwin.module.agent.model.vo.UiCapabilityConfigVO;
import cn.lonwin.module.agent.uicapability.UiCapabilityService;
import cn.lonwin.module.agent.uicapability.UiPageCapability;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;

/**
 * 前端能力声明上报与查询。
 *
 * <p>前端登录后（及声明版本变化时）调用上传接口，把各页面的
 * {@code agent.capabilities.ts} 内容一次性交给后端缓存；
 * 后端据此生成 system prompt 中的「页面能力清单」，并校验模型输出的 UI 事件。
 */
@RestController
@RequestMapping("/agent/ui-capabilities")
@RequiredArgsConstructor
@Tag(name = "智能问答·能力声明", description = "前端页面对智能体开放能力的上报与查询")
public class AgentUiCapabilityController extends BaseController {

    private final UiCapabilityService uiCapabilityService;

    @Operation(summary = "上报能力声明",
            description = "页面挂载时单页上报（增量合并）；应用启动时全量上报（full=true 整体替换）")
    @RequireActUrl("/agent/ui-capabilities")
    @PostMapping
    public Result<Map<String, Object>> upload(@RequestBody UiCapabilityUploadDTO dto) {
        String client = dto.getClient() == null || dto.getClient().isBlank() ? "web" : dto.getClient();
        boolean full = Boolean.TRUE.equals(dto.getFull());
        int count = uiCapabilityService.save(dto.getPages(), client, full);
        return Result.success("能力声明已接收", Map.of("client", client, "pages", count, "full", full));
    }

    @Operation(summary = "查询能力声明", description = "查看当前缓存的全部页面能力（排查用）")
    @RequireActUrl("/agent/ui-capabilities")
    @GetMapping
    public Result<List<UiPageCapability>> list() {
        return Result.success(uiCapabilityService.all());
    }

    @Operation(summary = "查询能力清单指纹",
            description = "前端启动 / 定时同步时先查指纹，与本地声明算出的一致就不再重发全量声明（低成本一致性校验）")
    @RequireActUrl("/agent/ui-capabilities")
    @GetMapping("/fingerprint")
    public Result<UiCapabilityService.Fingerprint> fingerprint(
            @RequestParam(required = false) String client) {
        return Result.success(uiCapabilityService.fingerprint(client));
    }

    @Operation(summary = "清空某上报方的能力声明", description = "前端版本回退 / 页面下线时调用")
    @RequireActUrl("/agent/ui-capabilities")
    @DeleteMapping
    public Result<Void> clear(@RequestParam(defaultValue = "web") String client) {
        uiCapabilityService.clear(client);
        return Result.success("已清空", null);
    }

    // ==================== 在线配置页（人工覆盖，改完立即落库） ====================

    @Operation(summary = "配置页清单", description = "返回每个页面的代码默认值、当前生效值与是否被人工改过")
    @RequireActUrl("/agent/ui-capabilities")
    @GetMapping("/admin")
    public Result<List<UiCapabilityConfigVO>> configs() {
        return Result.success(uiCapabilityService.configs());
    }

    @Operation(summary = "保存页面能力配置",
            description = "只改文案类字段；route / version / 权限 / target / 参数类型以代码声明为准，保存后立即生效")
    @RequireActUrl("/agent/ui-capabilities/update")
    @PutMapping("/admin")
    public Result<UiCapabilityConfigVO> saveConfig(
            @RequestBody UiPageCapability page,
            @RequestParam(required = false) String client) {
        return Result.success("已生效", uiCapabilityService.saveOverride(page, client));
    }

    @Operation(summary = "恢复本页代码默认", description = "删除该页面的人工覆盖，回到前端代码声明")
    @RequireActUrl("/agent/ui-capabilities/update")
    @DeleteMapping("/admin")
    public Result<Void> resetConfig(
            @RequestParam String route,
            @RequestParam(defaultValue = "web") String client) {
        boolean removed = uiCapabilityService.removeOverride(client, route);
        return Result.success(removed ? "已恢复代码默认" : "该页面没有人工修改", null);
    }

    /** 上报入参 */
    @Data
    public static class UiCapabilityUploadDTO {

        /** 上报方标识：web / bigscreen / mobile，缺省 web */
        private String client;

        /**
         * 是否全量上报。
         * true = 本次 pages 就是该上报方的全部页面，未出现的页面视为下线（整体替换）；
         * false / 缺省 = 只覆盖本次出现的 route，其它页面保留（页面挂载时单页上报用）。
         */
        private Boolean full;

        /** 页面能力声明列表 */
        private List<UiPageCapability> pages;
    }
}
