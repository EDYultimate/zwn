package cn.lonwin.common.core.model.vo;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * 分页数据包装类
 */
@Data
@NoArgsConstructor
public class PageResult<T> {
    
    /** 数据列表 */
    private List<T> records;
    
    /** 总记录数 */
    private Long total;
    
    public PageResult(List<T> records, Long total) {
        this.records = records;
        this.total = total;
    }
    
    public static <T> PageResult<T> of(List<T> records, Long total) {
        return new PageResult<>(records, total);
    }
    
    public static <T> PageResult<T> empty() {
        return new PageResult<>(List.of(), 0L);
    }
}