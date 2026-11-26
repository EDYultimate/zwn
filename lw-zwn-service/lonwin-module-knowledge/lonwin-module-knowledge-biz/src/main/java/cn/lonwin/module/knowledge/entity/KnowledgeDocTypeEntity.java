package cn.lonwin.module.knowledge.entity;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;

/**
 * SYS_KNOWLEDGE_DOC_TYPE：知识库文档类型（业务类型）树。
 *
 * <p>文档必须挂在一个类型节点上（{@code SYS_KNOWLEDGE_DOC.TYPE_ID}），
 * 本表即前端知识库左侧结构树的唯一数据源：可新增节点、改名、删除节点。
 *
 * <p>{@code TYPE_CODE} 只用于与历史静态分类 / 业务标识对齐（river、report 等），
 * 新节点可以不填；{@code PARENT_ID} 为空表示根节点。
 */
@Data
@TableName("SYS_KNOWLEDGE_DOC_TYPE")
public class KnowledgeDocTypeEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(value = "TYPE_ID", type = IdType.INPUT)
    private String typeId;

    /** 父节点 ID，空 = 根节点 */
    @TableField("PARENT_ID")
    private String parentId;

    @TableField("TYPE_NAME")
    private String typeName;

    /** 业务编码（可空），如 river / report，用于与既有分类映射 */
    @TableField("TYPE_CODE")
    private String typeCode;

    /** 同级排序号，升序 */
    @TableField("SORT_NO")
    private Integer sortNo;

    @TableField("REMARK")
    private String remark;
}
