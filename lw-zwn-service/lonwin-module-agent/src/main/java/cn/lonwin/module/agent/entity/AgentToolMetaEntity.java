package cn.lonwin.module.agent.entity;

import java.io.Serializable;

import org.apache.ibatis.type.JdbcType;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import cn.lonwin.module.agent.mapper.typehandler.AgentClobTypeHandler;
import lombok.Data;

/**
 * AGENT_TOOL_META：工具元数据的人工覆盖项（MyBatis Plus 方式）。
 *
 * <p>字段与列名显式绑定，风格与 lonwin-module-water 的 SysTest2Entity 保持一致；
 * CLOB 列指定专用 TypeHandler，详见 AgentClobTypeHandler。
 * 主键 NAME 由业务语义决定（= @AgentTool#name），使用 IdType.INPUT，不用数据库自增。
 */
@Data
@TableName(value = "AGENT_TOOL_META", autoResultMap = true)
public class AgentToolMetaEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    /** 工具名，= @AgentTool#name */
    @TableId(value = "NAME", type = IdType.INPUT)
    private String name;

    /** 中文短名，null = 沿用注解 */
    @TableField("TITLE")
    private String title;

    /** 描述，null = 沿用注解 */
    @TableField(value = "DESCRIPTION", jdbcType = JdbcType.CLOB, typeHandler = AgentClobTypeHandler.class)
    private String description;

    /** 问法示例（JSON 数组），null = 沿用注解 */
    @TableField(value = "EXAMPLES_JSON", jdbcType = JdbcType.CLOB, typeHandler = AgentClobTypeHandler.class)
    private String examplesJson;

    /** 业务分类 */
    @TableField("CATEGORY")
    private String category;

    /** 是否启用：null = 沿用注解，1 = 启用，0 = 停用 */
    @TableField("ENABLED")
    private Integer enabled;

    /** 参数说明（JSON 对象），null = 沿用注解 */
    @TableField(value = "PARAM_DESC_JSON", jdbcType = JdbcType.CLOB, typeHandler = AgentClobTypeHandler.class)
    private String paramDescJson;

    @TableField("UPDATED_BY")
    private String updatedBy;

    @TableField("UPDATED_AT")
    private String updatedAt;
}
