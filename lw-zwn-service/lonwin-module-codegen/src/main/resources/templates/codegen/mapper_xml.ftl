<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="${table.packageName}.mapper.${table.className}Mapper">

    <!-- 结果映射 -->
    <resultMap id="BaseResultMap" type="${table.packageName}.entity.${table.className}Entity">
<#list table.columns as col>
    <#if col.primaryKey>
        <id column="${col.columnName}" property="${col.javaField}" jdbcType="<#if col.javaType == "String">VARCHAR<#elseif col.javaType == "Integer">INTEGER<#elseif col.javaType == "Long">BIGINT<#elseif col.javaType == "BigDecimal">DECIMAL<#elseif col.javaType == "LocalDateTime">TIMESTAMP<#else>VARCHAR</#if>"/>
    <#else>
        <result column="${col.columnName}" property="${col.javaField}" jdbcType="<#if col.javaType == "String">VARCHAR<#elseif col.javaType == "Integer">INTEGER<#elseif col.javaType == "Long">BIGINT<#elseif col.javaType == "BigDecimal">DECIMAL<#elseif col.javaType == "LocalDateTime">TIMESTAMP<#else>VARCHAR</#if>"/>
    </#if>
</#list>
    </resultMap>

    <!-- 基础查询SQL -->
    <sql id="selectList_common">
        SELECT mt.*
        FROM ${table.tableName} mt
        <where>
<#list table.columns as col>
<#if col.queryField>
            <if test="query.${col.javaField} != null<#if col.javaType == "String"> and query.${col.javaField} != ''</#if>">
    <#if col.queryType == "LIKE">
                AND (mt.${col.columnName} LIKE CONCAT('%', ${'#'}{query.${col.javaField}}, '%'))
    <#else>
                AND (mt.${col.columnName} = ${'#'}{query.${col.javaField}})
    </#if>
            </if>
</#if>
</#list>
        </where>
    </sql>

    <!-- 查询列表 -->
    <select id="selectList" resultMap="BaseResultMap">
        <include refid="selectList_common"/>
    </select>

    <!-- 分页查询 -->
    <select id="selectListByPage" resultMap="BaseResultMap">
        <include refid="selectList_common"/>
    </select>

</mapper>