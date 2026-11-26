package ${table.packageName}.entity;

<#if config.useMybatis()>
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
</#if>
<#if config.useJpa()>
import jakarta.persistence.*;
</#if>
import lombok.Data;

import java.io.Serializable;
<#list table.columns as col>
<#if col.javaType == "BigDecimal">
import java.math.BigDecimal;
<#break>
</#if>
</#list>
<#list table.columns as col>
<#if col.javaType == "LocalDateTime">
import java.time.LocalDateTime;
<#break>
</#if>
</#list>
<#list table.columns as col>
<#if col.javaType == "LocalDate">
import java.time.LocalDate;
<#break>
</#if>
</#list>

/**
 * ${table.tableComment}<#if config.useMybatis() && config.useJpa()> - 同时支持JPA和MyBatis Plus<#elseif config.useJpa()> - JPA方式<#elseif config.useMybatis()> - MyBatis Plus方式</#if>
 */
@Data
<#if config.useJpa()>
@Entity
@Table(name = "${table.tableName}")
</#if>
<#if config.useMybatis()>
@TableName("${table.tableName}")
</#if>
public class ${table.className}Entity implements Serializable {
    private static final long serialVersionUID = 1L;

<#list table.columns as col>
    /**
     * ${col.columnComment}
     */
    <#if config.useJpa() && col.primaryKey>
    @Id
    @Column(name = "${col.columnName}")
    <#elseif config.useJpa()>
    @Column(name = "${col.columnName}"<#if col.columnSize?? && col.columnSize gt 0>, length = ${col.columnSize}</#if><#if !col.nullable>, nullable = false</#if>)
    </#if>
    <#if config.useMybatis()>
    @TableField("${col.columnName}")
    </#if>
    private ${col.javaType} ${col.javaField};

</#list>
}