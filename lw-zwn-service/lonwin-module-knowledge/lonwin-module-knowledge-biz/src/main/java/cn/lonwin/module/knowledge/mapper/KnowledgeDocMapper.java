package cn.lonwin.module.knowledge.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import cn.lonwin.module.knowledge.entity.KnowledgeDocEntity;

/** 逻辑文档元数据读写；@MapperScan 在 framework-data 中统一扫描 cn.lonwin */
@Mapper
public interface KnowledgeDocMapper extends BaseMapper<KnowledgeDocEntity> {

    /**
     * 按文档类型聚合统计文档数，供左侧类型树展示。
     *
     * <p>不要再用 {@code QueryWrapper.select("TYPE_ID")} 走 BaseMapper：
     * 达梦下「只 select 部分列 + 实体含未查询的主键」会返回 null 元素，
     * 曾导致类型树计数恒为 0（日志：{@code getTypeId() because "doc" is null}）。
     *
     * @return 每行两个字段：TYPE_ID、CNT（达梦返回大写列名）
     */
    @Select("SELECT TYPE_ID, COUNT(1) AS CNT FROM SYS_KNOWLEDGE_DOC"
            + " WHERE TYPE_ID IS NOT NULL GROUP BY TYPE_ID")
    List<Map<String, Object>> countGroupByTypeId();
}
