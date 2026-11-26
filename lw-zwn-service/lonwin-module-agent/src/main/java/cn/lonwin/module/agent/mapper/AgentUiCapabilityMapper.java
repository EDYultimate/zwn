package cn.lonwin.module.agent.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import cn.lonwin.module.agent.entity.AgentUiCapabilityEntity;

/**
 * AGENT_UI_CAPABILITY Mapper（MyBatis Plus 方式，与 lonwin-module-water 一致）。
 *
 * <p>复合主键 (CLIENT, ROUTE)，因此所有查询/更新都按复合键在 XML 里显式编写。
 * 特别注意 updateBaseline 只更新基线列，绝不触碰 OVERRIDE_JSON；
 * clearOverrides 只清人工覆盖列，代码基线保留——这是「一键还原」的 SQL 边界。
 */
@Mapper
public interface AgentUiCapabilityMapper extends BaseMapper<AgentUiCapabilityEntity> {

    /** 全部页面配置行 */
    List<AgentUiCapabilityEntity> selectAll();

    /** 按复合键查询 */
    AgentUiCapabilityEntity selectByClientAndRoute(@Param("client") String client,
                                                   @Param("route") String route);

    /** 新增页面基线（人工覆盖列保持为空） */
    int insertBaseline(@Param("entity") AgentUiCapabilityEntity entity);

    /** 更新代码基线（前端全量/增量上报，只改 BASELINE_JSON 等基线列） */
    int updateBaseline(@Param("entity") AgentUiCapabilityEntity entity);

    /** 保存配置页的人工覆盖 */
    int updateOverride(@Param("entity") AgentUiCapabilityEntity entity);

    /** 删除单页人工覆盖，回到代码默认 */
    int removeOverride(@Param("client") String client, @Param("route") String route,
                       @Param("operator") String operator, @Param("updatedAt") String updatedAt);

    /** 统计存在人工覆盖的页面数 */
    int countOverrides();

    /** 清空全部人工覆盖（一键还原） */
    int clearOverrides(@Param("operator") String operator, @Param("updatedAt") String updatedAt);

    /** 清空某上报方（版本回退 / 页面下线） */
    int deleteByClient(@Param("client") String client);

    /** 删除单个下线页面 */
    int deleteByClientAndRoute(@Param("client") String client, @Param("route") String route);
}
