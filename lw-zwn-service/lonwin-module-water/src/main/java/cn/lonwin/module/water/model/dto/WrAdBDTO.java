package cn.lonwin.module.water.model.dto;

import cn.lonwin.common.core.model.dto.BaseDTO;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 行政区划新增 / 编辑入参（对应 WR_AD_B）。
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class WrAdBDTO extends BaseDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    /** 行政区划代码（新增必填，编辑时作为主键） */
    @NotBlank(message = "行政区划代码不能为空")
    private String adCd;

    /** 行政区划名称 */
    @NotBlank(message = "行政区划名称不能为空")
    private String adNm;

    /** 行政区划简称 */
    private String adShnm;

    /** 行政区划面积 */
    private BigDecimal adA;

    /** 备注 */
    private String nt;

    /** 是否启用：1 启用 / 0 停用，为空默认 1 */
    private String isuse;
}
