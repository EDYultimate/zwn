package cn.lonwin.module.water.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

/**
 * SYS_TEST2 - MyBatis Plus方式
 */
@Data
@TableName("SYS_TEST2")
public class SysTest2Entity implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * ID
     */
    @TableField("ID")
    private String id;

    /**
     * DESCRIPTION
     */
    @TableField("DESCRIPTION")
    private String description;

    /**
     * NAME
     */
    @TableField("NAME")
    private String name;

    /**
     * STATUS
     */
    @TableField("STATUS")
    private Integer status;

}