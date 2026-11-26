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
 * AGENT_CONFIG_LOG：配置变更流水（MyBatis Plus 方式）。
 *
 * <p>主键由应用层用 UUIDUtils.generateUUID() 生成，与 lonwin-module-water 的写法一致。
 */
@Data
@TableName(value = "AGENT_CONFIG_LOG", autoResultMap = true)
public class AgentConfigLogEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(value = "ID", type = IdType.INPUT)
    private String id;

    /** TOOL / UI / RESTORE */
    @TableField("CFG_TYPE")
    private String cfgType;

    /** 工具名 / 页面路由 / ALL */
    @TableField("CFG_KEY")
    private String cfgKey;

    /** UPDATE / RESET / OVERRIDE / REMOVE / RESTORE */
    @TableField("ACTION")
    private String action;

    /** 本次写入的完整内容 */
    @TableField(value = "PAYLOAD", jdbcType = JdbcType.CLOB, typeHandler = AgentClobTypeHandler.class)
    private String payload;

    @TableField("OPERATOR")
    private String operator;
}
