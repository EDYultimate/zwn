package cn.lonwin.module.water.model.vo;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/** 证照管理顶部统计横条 + 底部脚注数据 */
@Data
public class EcCertStatVO implements Serializable {
    private static final long serialVersionUID = 1L;

    /** 证件数 */
    private long certCount;

    /** 许可水量合计（万m³） */
    private BigDecimal permitQty = BigDecimal.ZERO;

    /** 取水口数 */
    private long intakeCount;

    /** 以所属河流分组的许可水量总和 */
    private List<EcGroupVO> riverQty = new ArrayList<>();

    /** 以监管单位分组的取水许可证个数 */
    private List<EcGroupVO> orgCount = new ArrayList<>();

    /** 以所属河流分组的取水口个数 */
    private List<EcGroupVO> riverIntake = new ArrayList<>();
}
