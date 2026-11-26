package cn.lonwin.module.knowledge.service;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;

/**
 * 文档类型树节点，直接返回给前端左侧结构树。
 *
 * <p>{@code docCount} 是挂在本节点上的文档数（不含子节点），
 * 前端展示汇总数时可自行逐层累加。
 */
@Data
public class KnowledgeDocTypeVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String typeId;
    private String parentId;
    private String typeName;
    private String typeCode;
    private Integer sortNo;
    private String remark;
    private Long docCount;
    private List<KnowledgeDocTypeVO> children = new ArrayList<>();
}
