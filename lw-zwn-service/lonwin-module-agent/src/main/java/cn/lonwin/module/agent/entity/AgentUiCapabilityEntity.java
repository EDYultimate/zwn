package cn.lonwin.module.agent.entity;

import java.io.Serializable;

import org.apache.ibatis.type.JdbcType;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;

import cn.lonwin.module.agent.mapper.typehandler.AgentClobTypeHandler;
import lombok.Data;

/**
 * AGENT_UI_CAPABILITY：一行一个 (CLIENT, ROUTE) 的页面能力配置（MyBatis Plus 方式）。
 *
 * <p>BASELINE_JSON 是前端代码声明（上报时写入），OVERRIDE_JSON 是配置页人工修改，
 * 运行时取 OVERRIDE ?? BASELINE；一键还原只需把 OVERRIDE_JSON 置空。
 *
 * <p>该表是复合主键 (CLIENT, ROUTE)，MyBatis-Plus 的单列 @TableId 不适用，
 * 所有查询/更新都走 AgentUiCapabilityMapper.xml 里按复合键编写的 SQL。
 */
@Data
@TableName(value = "AGENT_UI_CAPABILITY", autoResultMap = true)
public class AgentUiCapabilityEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    /** 上报方：web / bigscreen / mobile */
    @TableField("CLIENT")
    private String client;

    /** 页面路由 */
    @TableField("ROUTE")
    private String route;

    /** 当前生效（或基线）的页面标题，便于在库里直接检索 */
    @TableField("TITLE")
    private String title;

    @TableField("REQUIRED_ACT_URL")
    private String requiredActUrl;

    @TableField("VERSION")
    private String version;

    /** 代码默认声明（整份 UiPageCapability 的 JSON） */
    @TableField(value = "BASELINE_JSON", jdbcType = JdbcType.CLOB, typeHandler = AgentClobTypeHandler.class)
    private String baselineJson;

    /** 人工覆盖声明，null = 未人工修改 */
    @TableField(value = "OVERRIDE_JSON", jdbcType = JdbcType.CLOB, typeHandler = AgentClobTypeHandler.class)
    private String overrideJson;

    /** 1 = 存在人工覆盖，0 = 代码默认 */
    @TableField("OVERRIDDEN")
    private Integer overridden;

    @TableField("UPDATED_BY")
    private String updatedBy;

    @TableField("UPDATED_AT")
    private String updatedAt;
}
