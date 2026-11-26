package cn.lonwin.module.water.model.query;

import cn.lonwin.common.core.model.dto.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/** 证照管理查询对象 */
@Data
@EqualsAndHashCode(callSuper = true)
public class EcCertQuery extends PageQuery implements Serializable {
    private static final long serialVersionUID = 1L;

    /** 取水许可编码 */
    private String wpcCd;

    /** 许可证编号（模糊） */
    private String cert;

    /** 取水权人（模糊） */
    private String owner;

    /** 组织机构代码（模糊） */
    private String code;

    /** 河流（模糊） */
    private String river;

    /** 行政区（编码或地址名称，兼容旧前端与智能体传中文） */
    private String area;

    /**
     * 行政区划编码（WR_WPC_SUP_B.AD_CD）。
     *
     * <p>行政区一律按编码检索：名称会随行政区划调整变化，编码不会，且同名行政区（如两个「城关区」）
     * 用名称筛必然串数据。按前缀匹配，选市级编码能带出下属县区。
     */
    private String adCd;

    /** 监管单位 */
    private String org;

    /** 河道内外：1 河道内 / 0 河道外，空表示不限（对应 EC_BASE_INFO_WR.RIVER_INNER） */
    private String inpos;

    /** 水源类型码值：1 地表水 / 2 地下水 / 3 其他，兼容旧调用方传中文 */
    private List<String> srcs;

    /** 由 srcs 转换出的水源类型编码 */
    private List<String> srcCodes;

    /** 许可水量区间：lt100 / 100-1000 / gt1000 / 全部 */
    private String amtRange;

    /** 前端选中的状态（中文，由前端本地二次过滤） */
    private List<String> statuses;

    /** 发证状态：1 已发证 / 0 准予未发（对应 WR_WPC_SUP_B.STT，空值同 0），兼容旧调用方传中文 */
    private String issued;

    /** 仅看临近过期 */
    private Boolean expOnly;
}
