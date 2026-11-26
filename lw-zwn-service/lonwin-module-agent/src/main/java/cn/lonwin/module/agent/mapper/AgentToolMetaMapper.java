package cn.lonwin.module.agent.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import cn.lonwin.module.agent.entity.AgentToolMetaEntity;

/**
 * AGENT_TOOL_META Mapper（MyBatis Plus 方式，与 lonwin-module-water 一致）。
 *
 * <p>只放数据读写，业务语义（覆盖合并、提示词刷新）留在 DbAgentToolMetaStore /
 * AgentToolMetaService，避免 Mapper 层掺杂业务逻辑。
 */
@Mapper
public interface AgentToolMetaMapper extends BaseMapper<AgentToolMetaEntity> {

    /** 全部人工覆盖项 */
    List<AgentToolMetaEntity> selectAll();

    /** 按工具名查询（判断新增还是更新用） */
    AgentToolMetaEntity selectByName(@Param("name") String name);

    /** 新增一条覆盖项 */
    int insertOne(@Param("entity") AgentToolMetaEntity entity);

    /** 更新一条覆盖项 */
    int updateOne(@Param("entity") AgentToolMetaEntity entity);

    /** 删除单条覆盖项（恢复注解默认值） */
    int deleteByName(@Param("name") String name);

    /** 清空全部覆盖项（一键还原工具配置） */
    int deleteAll();
}
