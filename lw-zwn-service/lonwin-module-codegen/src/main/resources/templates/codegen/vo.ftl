package ${table.packageName}.model.vo;

import lombok.Data;
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
 * ${table.tableComment}视图对象
 */
@Data
public class ${table.className}VO {

<#list table.columns as col>
    /**
     * ${col.columnComment}
     */
    private ${col.javaType} ${col.javaField};

</#list>
}