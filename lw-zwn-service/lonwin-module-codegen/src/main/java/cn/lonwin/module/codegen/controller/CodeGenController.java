package cn.lonwin.module.codegen.controller;

import cn.lonwin.common.core.base.BaseController;
import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.module.codegen.model.GenerateConfig;
import cn.lonwin.module.codegen.service.CodeGenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * 代码生成控制器
 */
@Slf4j
@RestController
@RequestMapping("/codegen")
@RequiredArgsConstructor
@Tag(name = "代码生成", description = "根据数据库表结构生成代码")
public class CodeGenController extends BaseController {

    private final CodeGenService codeGenService;

    @Operation(summary = "生成代码")
    @PostMapping("/generate")
    public Result generate(@RequestBody GenerateConfig config) {
        try {
            codeGenService.generate(config);
            return Result.success("代码生成成功");
        } catch (Exception e) {
            log.error("代码生成失败", e);
            return Result.fail("代码生成失败: " + e.getMessage());
        }
    }

    /**
     *
     * @param tableName
     * @param moduleName
     * @param tablePrefix
     * @param functionName
     * @param ormMode   MYBATIS,JPA,BOTH
     * @return
     */
    @Operation(summary = "快速生成（使用默认配置）")
    @PostMapping("/quickGenerate")
    public Result quickGenerate(
            @RequestParam String tableName,
            @RequestParam String moduleName,
            @RequestParam(required = false, defaultValue = "") String tablePrefix,
            @RequestParam(required = false) String functionName,
            @RequestParam(required = false, defaultValue = "BOTH") String ormMode) {

        GenerateConfig config = new GenerateConfig();
        config.setTableName(tableName);
        config.setModuleName(moduleName);
        config.setTablePrefix(tablePrefix);
        config.setFunctionName(functionName != null ? functionName : tableName);
        config.setOrmMode(ormMode);

        try {
            codeGenService.generate(config);
            return Result.success("代码生成成功，ORM模式: " + ormMode);
        } catch (Exception e) {
            log.error("代码生成失败", e);
            return Result.fail("代码生成失败: " + e.getMessage());
        }
    }
}