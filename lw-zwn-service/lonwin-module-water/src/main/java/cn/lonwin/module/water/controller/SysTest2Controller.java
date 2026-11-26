package cn.lonwin.module.water.controller;

import cn.lonwin.common.core.base.BaseController;
import cn.lonwin.common.core.model.dto.LoginUserDTO;
import cn.lonwin.common.core.model.vo.PageResult;
import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.framework.security.annotation.CurrentUser;
import cn.lonwin.module.water.convert.SysTest2Convert;
import cn.lonwin.module.water.entity.SysTest2Entity;
import cn.lonwin.module.water.model.dto.SysTest2DTO;
import cn.lonwin.module.water.model.query.SysTest2Query;
import cn.lonwin.module.water.service.SysTest2Service;
import cn.lonwin.module.water.mapper.SysTest2Mapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * SYS_TEST2Controller
 * 使用 MyBatis-Plus 方式
 */
@Slf4j
@RestController
@RequestMapping("/example/sysTest2")
@RequiredArgsConstructor
@Tag(name = "SYS_TEST2", description = "SYS_TEST2")
public class SysTest2Controller extends BaseController {

    private final SysTest2Service sysTest2Service;
    private final SysTest2Convert sysTest2Convert;
    private final SysTest2Mapper sysTest2Mapper;

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

    // ==================== MyBatis-Plus 方式接口 ====================

    @Operation(summary = "查询列表（MyBatis-Plus）")
    @GetMapping({"/findList_mybatis", "/getList_mybatis"})
    public Result findList_mybatis(HttpServletRequest request, SysTest2Query query) {
        if (this.isPage(request)) {
            PageRequest pageRequest = this.getPageRequest_mybatis(request);
            com.baomidou.mybatisplus.extension.plugins.pagination.Page<SysTest2Entity> pageResult =
                    sysTest2Service.findListByPage_mybatis(pageRequest, query);
            return Result.success("查询成功", new PageResult(pageResult.getRecords(), pageResult.getTotal()));
        } else {
            List<SysTest2Entity> list = sysTest2Service.findByList_mybatis(query);
            return Result.success("查询成功", list);
        }
    }

    // ==================== MyBatis-Plus 方式接口（作为默认CRUD） ====================

    @Operation(summary = "根据ID查询")
    @GetMapping({"/findById", "/getById"})
    public Result findById(@RequestParam("id") String id) {
        if (id == null) {
            return Result.fail("参数错误");
        }
        SysTest2Entity entity = sysTest2Mapper.selectById(id);
        return Result.success(entity);
    }

    @Operation(summary = "新增")
    @PostMapping("/add")
    public Result add(@RequestBody SysTest2Entity entity) {
        if (entity.getId() == null) {
            entity.setId(cn.lonwin.common.core.utils.UUIDUtils.generateUUID());
        }
        int i = sysTest2Mapper.insert(entity);
        return i > 0 ? Result.success() : Result.fail("新增失败");
    }

    @Operation(summary = "新增（DTO传值）")
    @PostMapping("/addByDto")
    public Result addByDto(@Valid @RequestBody SysTest2DTO dto) {
        SysTest2Entity entity = sysTest2Convert.dtoToEntity(dto);
        if (entity.getId() == null) {
            entity.setId(cn.lonwin.common.core.utils.UUIDUtils.generateUUID());
        }
        int i = sysTest2Mapper.insert(entity);
        return i > 0 ? Result.success() : Result.fail("新增失败");
    }

    @Operation(summary = "修改")
    @PostMapping("/update")
    public Result update(@RequestBody SysTest2Entity entity) {
        int i = sysTest2Mapper.updateById(entity);
        return i > 0 ? Result.success() : Result.fail("修改失败");
    }

    @Operation(summary = "删除")
    @PostMapping("/delete")
    public Result delete(@RequestParam("id") String id) {
        if (id == null) {
            return Result.fail("id为空");
        }
        int i = sysTest2Mapper.deleteById(id);
        return i > 0 ? Result.success() : Result.fail("删除失败");
    }
}