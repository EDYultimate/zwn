package cn.lonwin.module.agent.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cn.lonwin.common.core.base.BaseController;
import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.module.agent.annotation.RequireActUrl;
import cn.lonwin.module.agent.model.vo.AgentToolMetaVO;
import cn.lonwin.module.agent.service.AgentToolAdminService;
import cn.lonwin.module.agent.tool.meta.AgentToolMeta;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

/**
 * 工具元数据管理接口：让「模型看到的工具说明」从代码里解放出来。
 *
 * <p>为什么需要它：描述写错一个字、示例不符合业务口语、某个工具上线后发现模型老选错——
 * 这些都不该走「改代码 → 提测 → 发版」的流程。改完立即生效，下一次提问就是新提示词。
 *
 * <p>权限：三个 URL 分别登记，便于按角色授权（只读账号只给查询，不给修改）。
 * 注意：能改工具描述就能影响模型行为，应只授予运维/管理员。
 */
@RestController
@RequestMapping("/agent/tools")
@RequiredArgsConstructor
@Tag(name = "智能问答-工具管理", description = "在线查看与调整大模型可用工具的描述、示例与启停")
public class AgentToolAdminController extends BaseController {

    private final AgentToolAdminService agentToolAdminService;

    @Operation(summary = "工具清单", description = "返回全部工具当前生效的标题/描述/示例/参数/启停状态，并标记是否被人工覆盖")
    @RequireActUrl("/agent/tools")
    @GetMapping
    public Result<List<AgentToolMetaVO>> list() {
        return Result.success(agentToolAdminService.list());
    }

    @Operation(summary = "工具详情")
    @RequireActUrl("/agent/tools")
    @GetMapping("/{name}")
    public Result<AgentToolMetaVO> detail(@PathVariable String name) {
        return Result.success(agentToolAdminService.detail(name));
    }

    @Operation(summary = "修改工具元数据",
            description = "只传需要改的字段即可，未传字段沿用注解默认值；保存后立即刷新提示词，无需重启")
    @RequireActUrl("/agent/tools/update")
    @PutMapping("/{name}")
    public Result<AgentToolMetaVO> update(@PathVariable String name, @RequestBody AgentToolMeta meta) {
        return Result.success("已生效", agentToolAdminService.update(name, meta));
    }

    @Operation(summary = "恢复注解默认值", description = "删除该工具的人工覆盖记录")
    @RequireActUrl("/agent/tools/update")
    @DeleteMapping("/{name}")
    public Result<Void> reset(@PathVariable String name) {
        boolean removed = agentToolAdminService.reset(name);
        return Result.success(removed ? "已恢复默认" : "该工具没有覆盖记录", null);
    }

    @Operation(summary = "热刷新", description = "直接修改元数据文件后调用，重新加载并重建工具快照")
    @RequireActUrl("/agent/tools/refresh")
    @PostMapping("/refresh")
    public Result<Map<String, Object>> refresh() {
        return Result.success("已刷新", agentToolAdminService.refresh());
    }
}
