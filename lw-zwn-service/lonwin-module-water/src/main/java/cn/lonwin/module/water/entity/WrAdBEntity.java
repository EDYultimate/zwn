package cn.lonwin.module.water.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 县级及县级以上行政区划基本信息表 WR_AD_B。
 * 主键为行政区划代码 AD_CD（非自增，由业务方按国家标准录入）。
 */
@Data
@TableName("WR_AD_B")
public class WrAdBEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    /** 行政区划代码（主键） */
    @TableId(value = "AD_CD", type = IdType.INPUT)
    private String adCd;

    /** 行政区划名称 */
    @TableField("AD_NM")
    private String adNm;

    /** 行政区划简称 */
    @TableField("AD_SHNM")
    private String adShnm;

    /** 行政区划面积 */
    @TableField("AD_A")
    private BigDecimal adA;

    /** 更新时间（数据库默认 SYSDATE，新增/编辑时由 SQL 赋值） */
    @TableField("TS")
    private Date ts;

    /** 备注 */
    @TableField("NT")
    private String nt;

    /** 是否启用：1 启用 / 0 停用 */
    @TableField("ISUSE")
    private String isuse;
}
