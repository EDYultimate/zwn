package cn.lonwin.common.core.model.entity; // 建议修改包名，去掉 core，因为是通用的

import lombok.Data;

import java.io.Serializable;

/**
 * 基础实体类 (只保留 MP 注解，保持简洁)
 */
@Data
public class BaseEntity implements Serializable {
    private static final long serialVersionUID = 1L;
}