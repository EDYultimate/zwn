package ${table.packageName}.service;

import ${table.packageName}.entity.${table.className}Entity;
<#if config.useMybatis()>
import ${table.packageName}.mapper.${table.className}Mapper;
</#if>
import ${table.packageName}.model.query.${table.className}Query;
import org.springframework.data.domain.PageRequest;
<#if config.useJpa()>
import ${table.packageName}.repository.${table.className}Repository;
import cn.lonwin.common.core.model.dto.LoginUserDTO;
import cn.lonwin.common.core.utils.StringUtils;
import cn.lonwin.common.core.utils.UUIDUtils;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
</#if>
<#if config.useMybatis() && !config.useJpa()>
import cn.lonwin.common.core.model.dto.LoginUserDTO;
import cn.lonwin.common.core.utils.StringUtils;
import cn.lonwin.common.core.utils.UUIDUtils;
</#if>
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

<#if config.useJpa()>
import java.util.List;
import java.util.Optional;
<#else>
import java.util.List;
</#if>

/**
 * ${table.tableComment}服务
 * <#if config.useMybatis() && config.useJpa()>同时使用 MyBatis-Plus 和 JPA<#elseif config.useJpa()>使用 JPA 方式<#elseif config.useMybatis()>使用 MyBatis-Plus 方式</#if>
 */
@Service
@RequiredArgsConstructor
public class ${table.className}Service {

<#if config.useMybatis()>
    private final ${table.className}Mapper ${table.classNameLower}Mapper;
</#if>
<#if config.useJpa()>
    private final ${table.className}Repository ${table.classNameLower}Repository;
</#if>

<#if config.useJpa()>
    // ==================== JPA 方式 ====================

    /**
     * 构建查询条件
     */
    private Predicate buildPredicate(Root<${table.className}Entity> root, CriteriaQuery<?> query, CriteriaBuilder cb, ${table.className}Query param) {
        Predicate predicate = cb.isNotNull(root.get("${table.primaryKey.javaField}"));
        if (param != null) {
<#list table.columns as col>
<#if col.queryField>
            if (StringUtils.isNotNull(param.get${col.javaField?cap_first}())) {
    <#if col.queryType == "LIKE">
                predicate = cb.and(predicate, cb.like(root.get("${col.javaField}"), "%" + param.get${col.javaField?cap_first}() + "%"));
    <#else>
                predicate = cb.and(predicate, cb.equal(root.get("${col.javaField}"), param.get${col.javaField?cap_first}()));
    </#if>
            }
</#if>
</#list>
        }
        if (predicate != null) {
            query.where(predicate);
        }
        return null;
    }

    /**
     * JPA查询列表
     */
    public List<${table.className}Entity> findList_jpa(${table.className}Query param) {
        return ${table.classNameLower}Repository.findAll((root, query, cb) -> buildPredicate(root, query, cb, param));
    }

    /**
     * JPA分页查询
     */
    public Page<${table.className}Entity> findListByPage_jpa(PageRequest pageRequest, ${table.className}Query param) {
        return ${table.classNameLower}Repository.findAll((root, query, cb) -> buildPredicate(root, query, cb, param), pageRequest);
    }

    /**
     * 根据ID查询
     */
    public ${table.className}Entity findById_jpa(${table.primaryKey.javaType} id) {
        Optional<${table.className}Entity> o = ${table.classNameLower}Repository.findById(id);
        return o.orElse(null);
    }

    /**
     * 新增
     */
    public int add_jpa(${table.className}Entity saveEntity, LoginUserDTO loginUser) {
        if (saveEntity == null) {
            return 0;
        }
        try {
            if (StringUtils.isEmpty(saveEntity.get${table.primaryKey.javaField?cap_first}())) {
                saveEntity.set${table.primaryKey.javaField?cap_first}(UUIDUtils.generateUUID());
            }
            ${table.classNameLower}Repository.save(saveEntity);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 修改
     */
    public int update_jpa(${table.className}Entity updateEntity, LoginUserDTO loginUser) {
        try {
            Optional<${table.className}Entity> localOptional = ${table.classNameLower}Repository.findById(updateEntity.get${table.primaryKey.javaField?cap_first}());
            if (!localOptional.isPresent()) {
                return 0;
            }
            ${table.className}Entity localEntity = localOptional.get();
            BeanUtils.copyProperties(updateEntity, localEntity);
            ${table.classNameLower}Repository.save(localEntity);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 删除
     */
    public int deleteById_jpa(${table.primaryKey.javaType} id, LoginUserDTO loginUser) {
        try {
            ${table.classNameLower}Repository.deleteById(id);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }
</#if>

<#if config.useMybatis()>
    // ==================== MyBatis-Plus 方式 ====================

    /**
     * MyBatis-Plus查询列表
     */
    public List<${table.className}Entity> findByList_mybatis(${table.className}Query param) {
        return ${table.classNameLower}Mapper.selectList(param);
    }

    /**
     * MyBatis-Plus分页查询
     */
    public com.baomidou.mybatisplus.extension.plugins.pagination.Page<${table.className}Entity> findListByPage_mybatis(PageRequest pageClause, ${table.className}Query param) {
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<${table.className}Entity> pageQuery =
                new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(pageClause.getPageNumber(), pageClause.getPageSize());
        return ${table.classNameLower}Mapper.selectListByPage(pageQuery, param);
    }
</#if>
}