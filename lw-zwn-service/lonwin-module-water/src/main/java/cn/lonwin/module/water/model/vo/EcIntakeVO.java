package cn.lonwin.module.water.model.vo;

import lombok.Data;

import java.io.Serializable;

/** 取水口信息（对应 EC_B_WATER_ENG） */
@Data
public class EcIntakeVO implements Serializable {
    private static final long serialVersionUID = 1L;

    /** 取水口编号 */
    private String no;

    /** 取水口名称 */
    private String name;

    /** 取水口位置 */
    private String pos;

    /** 取水工程（设施）类型 */
    private String eng;

    /** 水源类型 */
    private String src;

    /** 所属证照 ID（EC_BASE_INFO_WR.ID） */
    private String ecId;

    /** 所属取水许可编码 */
    private String wpcCd;
}
