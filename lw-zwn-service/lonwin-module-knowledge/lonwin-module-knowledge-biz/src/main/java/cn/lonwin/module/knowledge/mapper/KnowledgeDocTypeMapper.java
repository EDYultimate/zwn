package cn.lonwin.module.knowledge.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import cn.lonwin.module.knowledge.entity.KnowledgeDocTypeEntity;

/** 文档类型树读写；@MapperScan 在 framework-data 中统一扫描 cn.lonwin */
@Mapper
public interface KnowledgeDocTypeMapper extends BaseMapper<KnowledgeDocTypeEntity> {
}
