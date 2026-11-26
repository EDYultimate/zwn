package ${table.packageName}.model.query;

import cn.lonwin.common.core.model.dto.PageQuery;
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

/**
 * ${table.tableComment}查询对象
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ${table.className}Query extends PageQuery {

<#list table.columns as col>
<#if col.queryField>
    /**
     * ${col.columnComment}
     */
    private ${col.javaType} ${col.javaField};

</#if>
</#list>
}