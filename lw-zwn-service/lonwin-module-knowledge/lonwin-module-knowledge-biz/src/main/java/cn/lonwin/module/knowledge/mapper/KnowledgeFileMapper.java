package cn.lonwin.module.knowledge.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import cn.lonwin.module.knowledge.entity.KnowledgeFileEntity;

/** 物理文件元数据读写；@MapperScan 在 framework-data 中统一扫描 cn.lonwin */
@Mapper
public interface KnowledgeFileMapper extends BaseMapper<KnowledgeFileEntity> {
}
