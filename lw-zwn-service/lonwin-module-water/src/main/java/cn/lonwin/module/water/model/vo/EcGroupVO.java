package cn.lonwin.module.water.model.vo;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

/** 分组统计项（按河流 / 监管单位） */
@Data
public class EcGroupVO implements Serializable {
    private static final long serialVersionUID = 1L;

    /** 分组名称 */
    private String name;

    /** 统计值（水量或个数） */
    private BigDecimal qty;
}
