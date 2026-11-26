package cn.lonwin.module.water.controller;

import cn.lonwin.common.core.base.BaseController;
import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.module.water.model.dto.WrAdBDTO;
import cn.lonwin.module.water.model.query.WrAdBQuery;
import cn.lonwin.module.water.model.vo.WrAdBVO;
import cn.lonwin.module.water.service.WrAdBService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * 行政区划（WR_AD_B）接口
 * 数据：WR_AD_B（县级及县级以上行政区划基本信息表，可写）
 */
@Slf4j
@RestController
@RequestMapping("/wrAdB")
@RequiredArgsConstructor
@Tag(name = "行政区划管理", description = "县级及县级以上行政区划基本信息")
public class WrAdBController extends BaseController {

    private final WrAdBService wrAdBService;

    // ==================== 查询 ====================

    @Operation(summary = "条件查询行政区划列表")
    @GetMapping({"/list", "/getList"})
    public Result<List<WrAdBVO>> list(WrAdBQuery query) {
        return Result.success("查询成功", wrAdBService.list(query));
    }

    @Operation(summary = "分页查询行政区划列表")
    @GetMapping("/page")
    public Result page(WrAdBQuery query) {
        return this.<WrAdBVO, WrAdBQuery>pageQuery(query, page -> wrAdBService.findListByPage(page, query));
    }

    @Operation(summary = "根据行政区划代码查询详情")
    @GetMapping("/detail")
    public Result<WrAdBVO> detail(@Parameter(description = "行政区划代码") @RequestParam("adCd") String adCd) {
        WrAdBVO vo = wrAdBService.detail(adCd);
        return vo == null ? Result.fail("行政区划不存在") : Result.success("查询成功", vo);
    }

    @Operation(summary = "根据行政区划代码查询名称")
    @GetMapping("/name")
    public Result<String> name(@Parameter(description = "行政区划代码") @RequestParam("adCd") String adCd) {
        String name = wrAdBService.nameByCd(adCd);
        return hasText(name) ? Result.success("查询成功", name) : Result.fail("行政区划不存在");
    }

    @Operation(summary = "批量根据代码查询名称（编码 → 名称）")
    @GetMapping("/names")
    public Result<Map<String, String>> names(
            @Parameter(description = "行政区划代码，多个用逗号分隔") @RequestParam("adCds") List<String> adCds) {
        return Result.success("查询成功", wrAdBService.nameMapByCds(adCds));
    }

    @Operation(summary = "根据名称模糊查询行政区划（下拉联想）")
    @GetMapping("/search")
    public Result<List<WrAdBVO>> search(
            @Parameter(description = "名称或简称关键字") @RequestParam(value = "adNm", required = false) String adNm,
            @Parameter(description = "返回条数，默认 20") @RequestParam(value = "limit", required = false) Integer limit) {
        return Result.success("查询成功", wrAdBService.searchByName(adNm, limit));
    }

    // ==================== 新增 / 编辑 / 删除 ====================

    @Operation(summary = "新增行政区划")
    @PostMapping("/add")
    public Result<WrAdBVO> add(@Valid @RequestBody WrAdBDTO dto) {
        if (wrAdBService.exists(dto.getAdCd())) {
            return Result.fail("行政区划代码已存在：" + dto.getAdCd());
        }
        try {
            return Result.success("新增成功", wrAdBService.save(dto));
        } catch (Exception e) {
            log.error("新增行政区划失败", e);
            return Result.fail("新增失败：" + e.getMessage());
        }
    }

    @Operation(summary = "编辑行政区划")
    @PostMapping("/update")
    public Result<WrAdBVO> update(@Valid @RequestBody WrAdBDTO dto) {
        if (!hasText(dto.getAdCd())) {
            return Result.fail("行政区划代码不能为空");
        }
        try {
            WrAdBVO vo = wrAdBService.update(dto);
            return vo == null ? Result.fail("行政区划不存在，无法编辑") : Result.success("编辑成功", vo);
        } catch (Exception e) {
            log.error("编辑行政区划失败", e);
            return Result.fail("编辑失败：" + e.getMessage());
        }
    }

    @Operation(summary = "删除行政区划")
    @PostMapping("/delete")
    public Result<Boolean> delete(@Parameter(description = "行政区划代码") @RequestParam("adCd") String adCd) {
        if (!hasText(adCd)) {
            return Result.fail("行政区划代码不能为空");
        }
        try {
            return wrAdBService.delete(adCd)
                    ? Result.success("删除成功", true)
                    : Result.fail("删除失败或记录不存在");
        } catch (Exception e) {
            log.error("删除行政区划失败", e);
            return Result.fail("删除失败：" + e.getMessage());
        }
    }

    private static boolean hasText(String text) {
        return text != null && !text.trim().isEmpty();
    }
}
