package cn.lonwin.module.water.controller;

import cn.lonwin.common.core.base.BaseController;
import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.module.water.model.dto.EcCertDTO;
import cn.lonwin.module.water.model.query.EcCertQuery;
import cn.lonwin.module.water.model.vo.EcCertStatVO;
import cn.lonwin.module.water.model.vo.EcCertVO;
import cn.lonwin.module.water.model.vo.EcGroupVO;
import cn.lonwin.module.water.model.vo.EcIntakeVO;
import cn.lonwin.module.water.service.EcCertService;
import io.swagger.v3.oas.annotations.Operation;
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
 * 证照管理（取水许可电子证照）接口
 * 数据：WR_WPC_SUP_B（可写） + EC_BASE_INFO_WR / EC_B_WATER_ENG（外部只读）
 */
@Slf4j
@RestController
@RequestMapping("/ecCert")
@RequiredArgsConstructor
@Tag(name = "证照管理", description = "取水许可电子证照")
public class EcCertController extends BaseController {

    private final EcCertService ecCertService;

    @Operation(summary = "根据条件查询取水许可电子证照基本信息列表")
    @GetMapping({"/list", "/getList"})
    public Result<List<EcCertVO>> list(EcCertQuery query) {
        return Result.success("查询成功", ecCertService.list(query));
    }

    @Operation(summary = "分页查询证照列表")
    @GetMapping("/page")
    public Result page(EcCertQuery query) {
        return this.<EcCertVO, EcCertQuery>pageQuery(query, page -> ecCertService.findListByPage(page, query));
    }

    @Operation(summary = "根据取水许可证编码获取证照基本信息")
    @GetMapping("/detail")
    public Result<EcCertVO> detail(@RequestParam("wpcCd") String wpcCd) {
        EcCertVO vo = ecCertService.detail(wpcCd);
        return vo == null ? Result.fail("证照不存在") : Result.success("查询成功", vo);
    }

    @Operation(summary = "获取取水口列表")
    @GetMapping("/intakes")
    public Result<List<EcIntakeVO>> intakes(
            @RequestParam(value = "wpcCd", required = false) String wpcCd,
            @RequestParam(value = "ecBaseInfoId", required = false) String ecBaseInfoId) {
        return Result.success("查询成功", ecCertService.intakes(wpcCd, ecBaseInfoId));
    }

    @Operation(summary = "证件数 / 许可水量 / 取水口数")
    @GetMapping("/summary")
    public Result<Map<String, Object>> summary(
            @RequestParam(value = "wpcCd", required = false) String wpcCd) {
        return Result.success("查询成功", ecCertService.summary(wpcCd));
    }

    @Operation(summary = "统计横条与脚注（汇总数 + 三组分组统计）")
    @GetMapping("/stat")
    public Result<EcCertStatVO> stat() {
        return Result.success("查询成功", ecCertService.stat());
    }

    @Operation(summary = "以所属河流为分组查询许可水量总和")
    @GetMapping("/riverQty")
    public Result<List<EcGroupVO>> riverQty() {
        return Result.success("查询成功", ecCertService.riverPermitQty());
    }

    @Operation(summary = "以监管单位为分组查询取水许可证的个数")
    @GetMapping("/orgCount")
    public Result<List<EcGroupVO>> orgCount() {
        return Result.success("查询成功", ecCertService.supManCertCount());
    }

    @Operation(summary = "以所属河流为分组查询取水口的个数")
    @GetMapping("/riverIntake")
    public Result<List<EcGroupVO>> riverIntake() {
        return Result.success("查询成功", ecCertService.riverIntakeCount());
    }

    // ==================== 新增 / 编辑 / 删除 ====================

    @Operation(summary = "新增取水许可证信息")
    @PostMapping("/add")
    public Result<EcCertVO> add(@Valid @RequestBody EcCertDTO dto) {
        String wpcCd = hasText(dto.getWpcCd()) ? dto.getWpcCd() : dto.getCert();
        if (ecCertService.exists(wpcCd)) {
            return Result.fail("取水许可证编码已存在：" + wpcCd);
        }
        try {
            return Result.success("新增成功", ecCertService.save(dto));
        } catch (Exception e) {
            log.error("新增取水许可证失败", e);
            return Result.fail("新增失败：" + e.getMessage());
        }
    }

    @Operation(summary = "编辑取水许可证信息")
    @PostMapping("/update")
    public Result<EcCertVO> update(@Valid @RequestBody EcCertDTO dto) {
        if (!hasText(dto.getWpcCd())) {
            return Result.fail("取水许可编码不能为空");
        }
        try {
            EcCertVO vo = ecCertService.update(dto);
            return vo == null ? Result.fail("证照不存在，无法编辑") : Result.success("编辑成功", vo);
        } catch (Exception e) {
            log.error("编辑取水许可证失败", e);
            return Result.fail("编辑失败：" + e.getMessage());
        }
    }

    @Operation(summary = "删除取水许可证信息")
    @PostMapping("/delete")
    public Result<Boolean> delete(@RequestParam("wpcCd") String wpcCd) {
        if (!hasText(wpcCd)) {
            return Result.fail("取水许可编码不能为空");
        }
        try {
            return ecCertService.delete(wpcCd)
                    ? Result.success("删除成功", true)
                    : Result.fail("删除失败或记录不存在");
        } catch (Exception e) {
            log.error("删除取水许可证失败", e);
            return Result.fail("删除失败：" + e.getMessage());
        }
    }

    private static boolean hasText(String text) {
        return text != null && !text.trim().isEmpty();
    }
}
