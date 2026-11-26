package cn.lonwin.module.water.model.dto;

import cn.lonwin.common.core.model.dto.BaseDTO;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/**
 * 新增 / 编辑取水许可证入参（字段与前端表单保持一致）。
 * 其中有效期、发证状态、业务类型等属于外部只读表 EC_BASE_INFO_WR 的内容，
 * 仅用于保存后回显，不会写入数据库。
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class EcCertDTO extends BaseDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    /** 取水许可编码，编辑时必传 */
    private String wpcCd;

    @NotBlank(message = "取水许可证编号不能为空")
    private String cert;

    /** 已发证 / 准予未发 */
    private String issued;

    /** 有效期起 yyyy-MM-dd（只读表字段，仅回显） */
    private String from;

    /** 有效期止 yyyy-MM-dd（只读表字段，仅回显） */
    private String to;

    /** 许可水量（万m³/年） */
    private BigDecimal amt;

    @NotBlank(message = "取水项目名称不能为空")
    private String proj;

    @NotBlank(message = "取水权人不能为空")
    private String owner;

    private String code;

    /** 一证多口明细（只读表字段，仅回显） */
    private List<EcIntakeDTO> points;

    private String river;

    /** 所在河段 */
    private String reach;

    /** 水源类型（表单下拉中文） */
    private String wtype;

    /** 取水类型 */
    private String itype;

    /** 取水用途（表单下拉中文） */
    private String use;

    /** 监管单位名称 */
    private String org;

    private String prov;

    private String city;

    private String county;

    /** 行政区划编码 */
    private String adCd;

    /** 是否重点监管取水口：是 / 否 */
    private String focus;

    /** 是否大中型灌区：是 / 否 */
    private String big;

    /** 是否典型小型灌区：是 / 否 */
    private String small;

    /** 业务类型（只读表字段，仅回显） */
    private String biz;

    /** 证照状态（只读表字段，仅回显） */
    private String status;

    /** 河道内外 */
    private String inpos;

    /** 取水口位置（第一个取水口） */
    private String addr;

    /** 是否临近过期（只读表字段，仅回显） */
    private Boolean exp;
}
