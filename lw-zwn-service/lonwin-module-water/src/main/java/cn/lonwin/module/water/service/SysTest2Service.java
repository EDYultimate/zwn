package cn.lonwin.module.water.service;

import cn.lonwin.module.water.entity.SysTest2Entity;
import cn.lonwin.module.water.mapper.SysTest2Mapper;
import cn.lonwin.module.water.model.query.SysTest2Query;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * SYS_TEST2服务
 * 使用 MyBatis-Plus 方式
 */
@Service
@RequiredArgsConstructor
public class SysTest2Service {

    private final SysTest2Mapper sysTest2Mapper;


    // ==================== MyBatis-Plus 方式 ====================

    /**
     * MyBatis-Plus查询列表
     */
    public List<SysTest2Entity> findByList_mybatis(SysTest2Query param) {
        return sysTest2Mapper.selectList(param);
    }

    /**
     * MyBatis-Plus分页查询
     */
    public com.baomidou.mybatisplus.extension.plugins.pagination.Page<SysTest2Entity> findListByPage_mybatis(PageRequest pageClause, SysTest2Query param) {
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<SysTest2Entity> pageQuery =
                new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(pageClause.getPageNumber(), pageClause.getPageSize());
        return sysTest2Mapper.selectListByPage(pageQuery, param);
    }
}