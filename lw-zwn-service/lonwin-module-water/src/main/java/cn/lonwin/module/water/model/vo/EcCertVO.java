package cn.lonwin.module.water.model.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/**
 * 证照管理列表 / 详情出参，字段与前端 LicCert 保持一致。
 * 带 @JsonIgnore 的是数据库原始码值，仅用于服务端字典翻译，不返回前端。
 */
@Data
public class EcCertVO implements Serializable {
    private static final long serialVersionUID = 1L;

    // ---------------- 前端展示字段 ----------------

    /** 取水许可编码（编辑 / 删除 / 详情的主键） */
    private String wpcCd;

    /** EC_BASE_INFO_WR.ID */
    private String ecId;

    /** 表格「编号」列：第一个取水口编号 */
    private String no;

    /** 同一许可证下的多个取水口编号 */
    private List<String> nos;

    /** 取水口明细（详情弹框） */
    private List<EcIntakeVO> pts;

    /** 许可证编号 */
    private String cert;

    /** 取水权人 */
    private String owner;

    /** 组织机构代码 */
    private String code;

    /** 取水项目名称 */
    private String proj;

    /** 所属河流 */
    private String river;

    /** 许可水量（万m³/年） */
    private BigDecimal amt = BigDecimal.ZERO;

    /** 取水用途 */
    private String use;

    /** 业务类型：新办 / 变更 / 延续 / 注销 */
    private String biz;

    /** 水源类型 */
    private String src;

    /** 监管单位 */
    private String org;

    /** 行政区 */
    private String area;

    /** 行政区划编码（WR_WPC_SUP_B.AD_CD） */
    private String adCd;

    /** 行政区划名称（WR_AD_B.AD_NM，与 AD_CD 联查得到） */
    private String adNm;

    /** 河道内 / 河道外 */
    private String inpos;

    /** 证照状态 */
    private String status;

    /** 发证状态：已发证 / 准予未发 */
    private String issued;

    /** 是否临近过期（≤60天） */
    private Boolean exp = false;

    /** 有效期自 yyyy-MM-dd */
    private String from;

    /** 有效期至 yyyy-MM-dd */
    private String to;

    /** 所在河段 */
    private String reach;

    /** 取水类型 */
    private String itype;

    /** 是否重点监管取水口：是 / 否 */
    private String focus;

    /** 是否大中型灌区：是 / 否 */
    private String big;

    /** 是否典型小型灌区：是 / 否 */
    private String small;

    /** 省 */
    private String prov;

    /** 市 */
    private String city;

    /** 县 */
    private String county;

    /** 取水口位置 */
    private String addr;

    /** 取水工程（设施）类型 */
    private String eng;

    // ---------------- 数据库原始值（翻译用，不返回前端） ----------------

    @JsonIgnore
    private String stt;

    @JsonIgnore
    private String wuseTp;

    @JsonIgnore
    private String wdeTp;

    @JsonIgnore
    private String wsrcTp;

    @JsonIgnore
    private String intkTp;

    @JsonIgnore
    private String supManCd;

    @JsonIgnore
    private String certNumCode;

    @JsonIgnore
    private String bizCode;

    @JsonIgnore
    private String overallState;

    @JsonIgnore
    private String isValid;

    @JsonIgnore
    private String isPer;

    @JsonIgnore
    private String dataStatus;

    @JsonIgnore
    private String riverInner;

    @JsonIgnore
    private String watUsageDes;

    @JsonIgnore
    private String watSouDes;

    @JsonIgnore
    private String intakingType;

    @JsonIgnore
    private String intLocationFull;

    @JsonIgnore
    private String intLocDivCode;

    @JsonIgnore
    private String valPerFrom;

    @JsonIgnore
    private String valPerTo;

    @JsonIgnore
    private String expFlag;

    @JsonIgnore
    private String isKeyWde;

    @JsonIgnore
    private String isLmIrr;

    @JsonIgnore
    private String isTypSmlIrr;
}
