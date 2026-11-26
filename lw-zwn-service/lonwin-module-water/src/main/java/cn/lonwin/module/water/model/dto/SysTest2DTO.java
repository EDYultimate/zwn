package cn.lonwin.module.water.model.dto;

import cn.lonwin.common.core.model.dto.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import jakarta.validation.constraints.Size;

/**
 * SYS_TEST2数据传输对象
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysTest2DTO extends BaseDTO {

    @Size(max = 500, message = "DESCRIPTION长度不能超过500个字符")
    private String description;

    @Size(max = 100, message = "NAME长度不能超过100个字符")
    private String name;

    private Integer status;

}