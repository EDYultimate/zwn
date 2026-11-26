package cn.lonwin.module.water.entity;

import cn.lonwin.module.water.model.dto.EcIntakeDTO;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/**
 * 取水许可证监管信息 WR_WPC_SUP_B（可读可写）。
 * EC_BASE_INFO_WR / EC_B_WATER_ENG 为外部同步的只读数据，不在本实体中。
 */
@Data
@TableName("WR_WPC_SUP_B")
public class EcWpcSupEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    /** 主键自增id */
    @TableId(value = "ID", type = IdType.AUTO)
    private Long id;

    /** 取水许可编码（与 EC_BASE_INFO_WR.FIR_CERT_NUM_CODE 对应） */
    @TableField("WPC_CD")
    private String wpcCd;

    /** 状态：1已发证 / 0准予未发 */
    @TableField("STT")
    private String stt;

    @TableField("IS_KEY_WDE")
    private String isKeyWde;

    @TableField("IS_LM_IRR")
    private String isLmIrr;

    @TableField("IS_TYP_SML_IRR")
    private String isTypSmlIrr;

    @TableField("SUP_MAN_CD")
    private String supManCd;

    @TableField("SUP_MAN_NM")
    private String supManNm;

    @TableField("RV_SEC")
    private String rvSec;

    @TableField("AD_CD")
    private String adCd;

    @TableField("ORG_CD")
    private String orgCd;

    @TableField("WUR_NM")
    private String wurNm;

    @TableField("WPC_NO")
    private String wpcNo;

    @TableField("PRJ_NM")
    private String prjNm;

    @TableField("RV_NM")
    private String rvNm;

    @TableField("ADDR")
    private String addr;

    /** 许可水量（万m³） */
    @TableField("PER_QTY")
    private BigDecimal perQty;

    @TableField("WUSE_TP")
    private String wuseTp;

    @TableField("WDE_TP")
    private String wdeTp;

    @TableField("WSRC_TP")
    private String wsrcTp;

    @TableField("INTK_TP")
    private String intkTp;

    /** 表单传入的取水口明细，仅用于业务处理，不落库（取水口来自只读表 EC_B_WATER_ENG） */
    @TableField(exist = false)
    private List<EcIntakeDTO> points;
}
