package ${table.packageName}.controller;

import cn.lonwin.common.core.base.BaseController;
import cn.lonwin.common.core.model.dto.LoginUserDTO;
import cn.lonwin.common.core.model.vo.PageResult;
import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.framework.security.annotation.CurrentUser;
import org.springframework.data.domain.PageRequest;
import ${table.packageName}.convert.${table.className}Convert;
import ${table.packageName}.entity.${table.className}Entity;
import ${table.packageName}.model.dto.${table.className}DTO;
import ${table.packageName}.model.query.${table.className}Query;
import ${table.packageName}.service.${table.className}Service;
<#if config.useMybatis() && !config.useJpa()>
import ${table.packageName}.mapper.${table.className}Mapper;
</#if>
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
<#if config.useJpa()>
import org.springframework.data.domain.Page;
</#if>
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ${table.tableComment}Controller
 * <#if config.useMybatis() && config.useJpa()>同时使用 MyBatis-Plus 和 JPA<#elseif config.useJpa()>使用 JPA 方式<#elseif config.useMybatis()>使用 MyBatis-Plus 方式</#if>
 */
@Slf4j
@RestController
@RequestMapping("${table.baseRequestMapping}")
@RequiredArgsConstructor
@Tag(name = "${table.functionName}", description = "${table.tableComment}")
public class ${table.className}Controller extends BaseController {

    private final ${table.className}Service ${table.classNameLower}Service;
    private final ${table.className}Convert ${table.classNameLower}Convert;
<#if config.useMybatis() && !config.useJpa()>
    private final ${table.className}Mapper ${table.classNameLower}Mapper;
</#if>

    @Operation(summary = "测试接口")
    @GetMapping("/apiTest")
    public Result apiTest() {
        return Result.success("接口正常");
    }

    @Operation(summary = "获取当前用户信息")
    @GetMapping("/getUserInfo")
    public Result getUserInfo(@CurrentUser LoginUserDTO loginUser) {
        return Result.success("获取成功", loginUser);
    }

<#if config.useMybatis()>
    // ==================== MyBatis-Plus 方式接口 ====================

    @Operation(summary = "查询列表（MyBatis-Plus）")
    @GetMapping({"/findList_mybatis", "/getList_mybatis"})
    public Result findList_mybatis(HttpServletRequest request, ${table.className}Query query) {
        if (this.isPage(request)) {
            PageRequest pageRequest = this.getPageRequest_mybatis(request);
            com.baomidou.mybatisplus.extension.plugins.pagination.Page<${table.className}Entity> pageResult =
                    ${table.classNameLower}Service.findListByPage_mybatis(pageRequest, query);
            return Result.success("查询成功", new PageResult(pageResult.getRecords(), pageResult.getTotal()));
        } else {
            List<${table.className}Entity> list = ${table.classNameLower}Service.findByList_mybatis(query);
            return Result.success("查询成功", list);
        }
    }
</#if>

<#if config.useJpa()>
    // ==================== JPA 方式接口 ====================

    @Operation(summary = "查询列表（JPA）")
    @GetMapping({"/findList_jpa", "/getList_jpa"})
    public Result findList_jpa(HttpServletRequest request, ${table.className}Query query) {
        if (this.isPage(request)) {
            PageRequest pageRequest = this.getPageRequest_jpa(request);
            Page<${table.className}Entity> pageResult = ${table.classNameLower}Service.findListByPage_jpa(pageRequest, query);
            return Result.success("查询成功", new PageResult(pageResult.getContent(), pageResult.getTotalElements()));
        } else {
            List<${table.className}Entity> list = ${table.classNameLower}Service.findList_jpa(query);
            return Result.success("查询成功", list);
        }
    }

    @Operation(summary = "根据ID查询")
    @GetMapping({"/findById", "/getById"})
    public Result findById(@RequestParam("id") ${table.primaryKey.javaType} id) {
        if (id == null) {
            return Result.fail("参数错误");
        }
        ${table.className}Entity entity = ${table.classNameLower}Service.findById_jpa(id);
        return Result.success(entity);
    }

    @Operation(summary = "新增")
    @PostMapping("/add")
    public Result add(@RequestBody ${table.className}Entity entity) {
        int i = ${table.classNameLower}Service.add_jpa(entity, this.getLoginUser());
        return i > 0 ? Result.success() : Result.fail("新增失败");
    }

    @Operation(summary = "新增（DTO传值）")
    @PostMapping("/addByDto")
    public Result addByDto(@Valid @RequestBody ${table.className}DTO dto) {
        ${table.className}Entity entity = ${table.classNameLower}Convert.dtoToEntity(dto);
        int i = ${table.classNameLower}Service.add_jpa(entity, this.getLoginUser());
        return i > 0 ? Result.success() : Result.fail("新增失败");
    }

    @Operation(summary = "修改")
    @PostMapping("/update")
    public Result update(@RequestBody ${table.className}Entity entity) {
        int i = ${table.classNameLower}Service.update_jpa(entity, this.getLoginUser());
        return i > 0 ? Result.success() : Result.fail("修改失败");
    }

    @Operation(summary = "删除")
    @PostMapping("/delete")
    public Result delete(@RequestParam("id") ${table.primaryKey.javaType} id) {
        if (id == null) {
            return Result.fail("id为空");
        }
        int i = ${table.classNameLower}Service.deleteById_jpa(id, this.getLoginUser());
        return i > 0 ? Result.success() : Result.fail("删除失败");
    }
<#elseif config.useMybatis()>
    // ==================== MyBatis-Plus 方式接口（作为默认CRUD） ====================

    @Operation(summary = "根据ID查询")
    @GetMapping({"/findById", "/getById"})
    public Result findById(@RequestParam("id") ${table.primaryKey.javaType} id) {
        if (id == null) {
            return Result.fail("参数错误");
        }
        ${table.className}Entity entity = ${table.classNameLower}Mapper.selectById(id);
        return Result.success(entity);
    }

    @Operation(summary = "新增")
    @PostMapping("/add")
    public Result add(@RequestBody ${table.className}Entity entity) {
        if (entity.get${table.primaryKey.javaField?cap_first}() == null) {
            entity.set${table.primaryKey.javaField?cap_first}(cn.lonwin.common.core.utils.UUIDUtils.generateUUID());
        }
        int i = ${table.classNameLower}Mapper.insert(entity);
        return i > 0 ? Result.success() : Result.fail("新增失败");
    }

    @Operation(summary = "新增（DTO传值）")
    @PostMapping("/addByDto")
    public Result addByDto(@Valid @RequestBody ${table.className}DTO dto) {
        ${table.className}Entity entity = ${table.classNameLower}Convert.dtoToEntity(dto);
        if (entity.get${table.primaryKey.javaField?cap_first}() == null) {
            entity.set${table.primaryKey.javaField?cap_first}(cn.lonwin.common.core.utils.UUIDUtils.generateUUID());
        }
        int i = ${table.classNameLower}Mapper.insert(entity);
        return i > 0 ? Result.success() : Result.fail("新增失败");
    }

    @Operation(summary = "修改")
    @PostMapping("/update")
    public Result update(@RequestBody ${table.className}Entity entity) {
        int i = ${table.classNameLower}Mapper.updateById(entity);
        return i > 0 ? Result.success() : Result.fail("修改失败");
    }

    @Operation(summary = "删除")
    @PostMapping("/delete")
    public Result delete(@RequestParam("id") ${table.primaryKey.javaType} id) {
        if (id == null) {
            return Result.fail("id为空");
        }
        int i = ${table.classNameLower}Mapper.deleteById(id);
        return i > 0 ? Result.success() : Result.fail("删除失败");
    }
</#if>
}