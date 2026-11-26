package cn.lonwin.common.core.model.dto;

import lombok.Data;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * 分页查询参数
 */
@Data
public class PageQuery {
    
    /** 当前页码 */
    @NotNull(message = "页码不能为空")
    @Min(value = 1, message = "页码最小为1")
    private Integer pageNum = 1;
    
    /** 每页大小 */
    @NotNull(message = "每页大小不能为空")
    @Min(value = 1, message = "每页大小最小为1")
    @Max(value = 1000, message = "每页大小最大为1000")
    private Integer pageSize = 20;
    
    /** 排序字段 */
    private String orderBy;
    
    /** 排序方式: asc/desc */
    private String orderDirection = "desc";
    
    /** 是否计算总数 */
    private Boolean searchCount = true;
    
    /**
     * 获取偏移量
     */
    public Long getOffset() {
        return (long) (pageNum - 1) * pageSize;
    }
}