package cn.lonwin.module.codegen.model;

import lombok.Data;

import java.util.List;

/**
 * 数据库表信息
 */
@Data
public class TableInfo {

    /**
     * 表名
     */
    private String tableName;

    /**
     * 表注释
     */
    private String tableComment;

    /**
     * 实体类名
     */
    private String className;

    /**
     * 实体类名（首字母小写）
     */
    private String classNameLower;

    /**
     * 模块名
     */
    private String moduleName;

    /**
     * 业务名
     */
    private String businessName;

    /**
     * 功能名
     */
    private String functionName;

    /**
     * 作者
     */
    private String author;

    /**
     * 列信息
     */
    private List<ColumnInfo> columns;

    /**
     * 主键列
     */
    private ColumnInfo primaryKey;

    /**
     * 基础请求路径
     */
    private String baseRequestMapping;

    /**
     * 包名
     */
    private String packageName;
}