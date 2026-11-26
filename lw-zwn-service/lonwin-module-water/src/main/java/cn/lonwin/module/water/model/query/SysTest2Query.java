package cn.lonwin.module.water.model.query;

import cn.lonwin.common.core.model.dto.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * SYS_TEST2查询对象
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysTest2Query extends PageQuery {

    /**
     * ID
     */
    private String id;

    /**
     * DESCRIPTION
     */
    private String description;

    /**
     * NAME
     */
    private String name;

}