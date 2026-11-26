package cn.lonwin.module.codegen.model;

import lombok.Data;

/**
 * 数据库列信息
 */
@Data
public class ColumnInfo {

    /**
     * 列名
     */
    private String columnName;

    /**
     * 数据类型
     */
    private String dataType;

    /**
     * 列注释
     */
    private String columnComment;

    /**
     * 列长度
     */
    private Integer columnSize;

    /**
     * 小数位数
     */
    private Integer decimalDigits;

    /**
     * 是否可为空
     */
    private Boolean nullable;

    /**
     * 是否主键
     */
    private Boolean primaryKey;

    /**
     * 默认值
     */
    private String columnDefault;

    /**
     * Java属性名
     */
    private String javaField;

    /**
     * Java类型
     */
    private String javaType;

    /**
     * Java类型（完整包名）
     */
    private String javaTypeFull;

    /**
     * 是否是查询字段
     */
    private Boolean queryField = false;

    /**
     * 查询方式：EQ(等于)、LIKE(模糊)、BETWEEN(范围)
     */
    private String queryType = "EQ";

    /**
     * 是否必填
     */
    private Boolean required = false;

    /**
     * 最大长度（用于验证）
     */
    private Integer maxLength;
}