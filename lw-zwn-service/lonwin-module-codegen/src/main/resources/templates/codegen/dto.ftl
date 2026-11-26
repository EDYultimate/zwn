package ${table.packageName}.model.dto;

import cn.lonwin.common.core.model.dto.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
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
<#assign hasStringField = false>
<#list table.columns as col>
<#if !col.primaryKey && col.javaType == "String" && (col.required || col.maxLength??)>
<#assign hasStringField = true>
</#if>
</#list>
<#if hasStringField>
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
</#if>
<#list table.columns as col>
<#if !col.primaryKey && col.javaType != "String" && col.required>
import jakarta.validation.constraints.NotNull;
<#break>
</#if>
</#list>

/**
 * ${table.tableComment}数据传输对象
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ${table.className}DTO extends BaseDTO {

<#list table.columns as col>
<#if !col.primaryKey>
    <#if col.required>
        <#if col.javaType == "String">
    @NotBlank(message = "${col.columnComment}不能为空")
        <#else>
    @NotNull(message = "${col.columnComment}不能为空")
        </#if>
    </#if>
    <#if col.maxLength?? && col.maxLength gt 0>
    @Size(max = ${col.maxLength}, message = "${col.columnComment}长度不能超过${col.maxLength}个字符")
    </#if>
    private ${col.javaType} ${col.javaField};

</#if>
</#list>
}