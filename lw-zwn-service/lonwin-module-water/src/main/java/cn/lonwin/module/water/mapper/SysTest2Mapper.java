package cn.lonwin.module.water.mapper;

import cn.lonwin.module.water.entity.SysTest2Entity;
import cn.lonwin.module.water.model.query.SysTest2Query;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * SYS_TEST2Mapper - MyBatis Plus方式
 */
@Mapper
public interface SysTest2Mapper extends BaseMapper<SysTest2Entity> {

    /**
     * 查询列表
     */
    List<SysTest2Entity> selectList(@Param("query") SysTest2Query query);

    /**
     * 分页查询
     */
    Page<SysTest2Entity> selectListByPage(Page<SysTest2Entity> page, @Param("query") SysTest2Query query);
}