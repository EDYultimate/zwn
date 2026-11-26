package cn.lonwin.module.water.model.vo;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 行政区划出参（对应 WR_AD_B）。
 */
@Data
public class WrAdBVO implements Serializable {
    private static final long serialVersionUID = 1L;

    /** 行政区划代码 */
    private String adCd;

    /** 行政区划名称 */
    private String adNm;

    /** 行政区划简称 */
    private String adShnm;

    /** 行政区划面积 */
    private BigDecimal adA;

    /** 更新时间 yyyy-MM-dd HH:mm:ss */
    private String ts;

    /** 备注 */
    private String nt;

    /** 是否启用：1 启用 / 0 停用 */
    private String isuse;
}
