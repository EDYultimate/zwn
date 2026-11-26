package cn.lonwin.module.water.model.query;

import cn.lonwin.common.core.model.dto.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * 行政区划查询对象（对应 WR_AD_B）。
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class WrAdBQuery extends PageQuery implements Serializable {
    private static final long serialVersionUID = 1L;

    /** 行政区划代码（前缀匹配，便于按层级检索，如 1304） */
    private String adCd;

    /** 行政区划名称（模糊） */
    private String adNm;

    /** 行政区划简称（模糊） */
    private String adShnm;

    /** 是否启用：1 启用 / 0 停用 */
    private String isuse;
}
