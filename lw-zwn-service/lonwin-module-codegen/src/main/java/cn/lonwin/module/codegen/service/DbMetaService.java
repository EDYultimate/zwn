package cn.lonwin.module.codegen.service;

import cn.lonwin.module.codegen.model.ColumnInfo;
import cn.lonwin.module.codegen.model.TableInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

/**
 * 数据库元数据服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DbMetaService {

    private final DataSource dataSource;

    /**
     * 获取表信息
     */
    public TableInfo getTableInfo(String tableName) {
        TableInfo tableInfo = new TableInfo();
        tableInfo.setTableName(tableName);

        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();

            // 获取表注释
            ResultSet tables = metaData.getTables(null, null, tableName.toUpperCase(), new String[]{"TABLE"});
            if (tables.next()) {
                String remarks = tables.getString("REMARKS");
                tableInfo.setTableComment(remarks != null ? remarks : tableName);
            }
            tables.close();

            // 获取列信息
            List<ColumnInfo> columns = new ArrayList<>();
            ResultSet columnRs = metaData.getColumns(null, null, tableName.toUpperCase(), null);

            while (columnRs.next()) {
                ColumnInfo column = new ColumnInfo();
                String colName = columnRs.getString("COLUMN_NAME");
                String dataType = columnRs.getString("TYPE_NAME");
                String remarks = columnRs.getString("REMARKS");
                int columnSize = columnRs.getInt("COLUMN_SIZE");
                int decimalDigits = columnRs.getInt("DECIMAL_DIGITS");
                int nullable = columnRs.getInt("NULLABLE");
                String defaultValue = columnRs.getString("COLUMN_DEF");

                column.setColumnName(colName);
                column.setDataType(dataType);
                column.setColumnComment(remarks != null && !remarks.isEmpty() ? remarks : colName);
                column.setColumnSize(columnSize);
                column.setDecimalDigits(decimalDigits);
                column.setNullable(nullable == DatabaseMetaData.columnNullable);
                column.setColumnDefault(defaultValue);

                // 转换为Java字段和类型
                column.setJavaField(columnToJavaField(colName));
                column.setJavaType(sqlTypeToJavaType(dataType, columnSize, decimalDigits));
                column.setJavaTypeFull(getFullJavaType(dataType, columnSize, decimalDigits));

                // 默认查询字段（字符串类型支持模糊查询）
                if ("VARCHAR".equalsIgnoreCase(dataType) || "VARCHAR2".equalsIgnoreCase(dataType)
                        || "CHAR".equalsIgnoreCase(dataType)) {
                    column.setQueryField(true);
                    column.setQueryType("LIKE");
                    column.setMaxLength(columnSize);
                }

                // 主键判断
                column.setPrimaryKey(false);

                columns.add(column);
            }
            columnRs.close();

            // 获取主键信息
            ResultSet pkRs = metaData.getPrimaryKeys(null, null, tableName.toUpperCase());
            while (pkRs.next()) {
                String pkColumnName = pkRs.getString("COLUMN_NAME");
                for (ColumnInfo col : columns) {
                    if (col.getColumnName().equalsIgnoreCase(pkColumnName)) {
                        col.setPrimaryKey(true);
                        col.setRequired(true);
                        tableInfo.setPrimaryKey(col);
                        break;
                    }
                }
            }
            pkRs.close();

            tableInfo.setColumns(columns);

        } catch (Exception e) {
            log.error("获取表信息失败: {}", tableName, e);
            throw new RuntimeException("获取表信息失败: " + tableName, e);
        }

        return tableInfo;
    }

    /**
     * 列名转Java字段名
     */
    public String columnToJavaField(String columnName) {
        StringBuilder sb = new StringBuilder();
        boolean nextUpper = false;
        for (char c : columnName.toLowerCase().toCharArray()) {
            if (c == '_') {
                nextUpper = true;
            } else if (nextUpper) {
                sb.append(Character.toUpperCase(c));
                nextUpper = false;
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }

    /**
     * SQL类型转Java类型（简写）
     */
    public String sqlTypeToJavaType(String sqlType, int size, int digits) {
        String type = sqlType.toUpperCase();
        if (type.contains("INT") || type.contains("SERIAL")) {
            return "Integer";
        } else if (type.contains("BIGINT")) {
            return "Long";
        } else if (type.contains("DECIMAL") || type.contains("NUMERIC") || type.contains("NUMBER")) {
            if (digits > 0) {
                return "BigDecimal";
            } else if (size > 10) {
                return "Long";
            } else {
                return "Integer";
            }
        } else if (type.contains("FLOAT") || type.contains("REAL")) {
            return "Float";
        } else if (type.contains("DOUBLE")) {
            return "Double";
        } else if (type.contains("DATE") || type.contains("TIME")) {
            return "LocalDateTime";
        } else if (type.contains("BOOLEAN") || type.contains("BIT")) {
            return "Boolean";
        } else if (type.contains("BLOB") || type.contains("BINARY") || type.contains("BYTEA")) {
            return "byte[]";
        } else if (type.contains("TEXT") || type.contains("CLOB")) {
            return "String";
        } else {
            return "String";
        }
    }

    /**
     * 获取完整Java类型（含包名）
     */
    public String getFullJavaType(String sqlType, int size, int digits) {
        String simpleType = sqlTypeToJavaType(sqlType, size, digits);
        switch (simpleType) {
            case "BigDecimal":
                return "java.math.BigDecimal";
            case "LocalDateTime":
                return "java.time.LocalDateTime";
            case "LocalDate":
                return "java.time.LocalDate";
            case "byte[]":
                return "byte[]";
            default:
                return simpleType;
        }
    }

    /**
     * 表名转类名
     */
    public String tableToClassName(String tableName, String prefix) {
        String name = tableName;
        if (prefix != null && !prefix.isEmpty() && name.toUpperCase().startsWith(prefix.toUpperCase())) {
            name = name.substring(prefix.length());
        }
        // 去掉下划线并转驼峰，首字母大写
        StringBuilder sb = new StringBuilder();
        boolean nextUpper = true;
        for (char c : name.toLowerCase().toCharArray()) {
            if (c == '_') {
                nextUpper = true;
            } else if (nextUpper) {
                sb.append(Character.toUpperCase(c));
                nextUpper = false;
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}