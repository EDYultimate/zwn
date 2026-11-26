package cn.lonwin.module.agent.mapper.typehandler;

import java.io.StringReader;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

/**
 * 达梦 DM8 CLOB 列的 String 类型处理器。
 *
 * <p>配置内容是整份 JSON（可能几千个中文字符）。写入用字符流而不是 {@code ps.setString}，
 * 读取用 {@code rs.getString}——这是本库验证过可用的组合，避免不同驱动对
 * {@code setString(CLOB)} / {@code getClob} 的实现差异导致中文长文本被截断。
 *
 * <p>只在 XML 的 resultMap 与 SQL 参数、实体 {@code @TableField} 上显式指定，
 * 不注册为全局 String 处理器，不影响其它模块的普通 VARCHAR 字段。
 */
public class AgentClobTypeHandler extends BaseTypeHandler<String> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, String parameter, JdbcType jdbcType)
            throws SQLException {
        ps.setCharacterStream(i, new StringReader(parameter), parameter.length());
    }

    @Override
    public String getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return rs.getString(columnName);
    }

    @Override
    public String getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return rs.getString(columnIndex);
    }

    @Override
    public String getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return cs.getString(columnIndex);
    }
}
