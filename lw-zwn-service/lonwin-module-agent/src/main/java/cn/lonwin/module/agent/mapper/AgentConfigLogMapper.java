package cn.lonwin.module.agent.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import cn.lonwin.module.agent.entity.AgentConfigLogEntity;

/**
 * AGENT_CONFIG_LOG Mapper（MyBatis Plus 方式，与 lonwin-module-water 一致）。
 *
 * <p>SQL 统一放在 resources/mapper/AgentConfigLogMapper.xml，写入由 AgentConfigAuditService 编排。
 */
@Mapper
public interface AgentConfigLogMapper extends BaseMapper<AgentConfigLogEntity> {

    /** 记录一次配置变更 */
    int insertLog(@Param("entity") AgentConfigLogEntity entity);
}
