package cn.lonwin.module.water.model.dto;

import lombok.Data;

import java.io.Serializable;

/** 表单中的取水口明细 */
@Data
public class EcIntakeDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    /** 取水口编号 */
    private String no;

    /** 取水口位置 */
    private String pos;

    /** 取水工程（设施）类型 */
    private String eng;
}
