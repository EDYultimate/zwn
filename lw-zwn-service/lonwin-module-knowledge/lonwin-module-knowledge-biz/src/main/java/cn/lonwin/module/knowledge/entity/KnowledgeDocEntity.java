package cn.lonwin.module.knowledge.entity;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;

/**
 * SYS_KNOWLEDGE_DOC：逻辑文档元数据（不存正文）。
 *
 * <p>阶段 1 一次上传生成一个逻辑文档；阶段 2 解析后会按 GROUP_ID 合并
 * 同名 PDF/Word/Excel，并回填 CANONICAL_FILE_ID / TEXT_HASH / INDEXED。
 */
@Data
@TableName("SYS_KNOWLEDGE_DOC")
public class KnowledgeDocEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(value = "DOC_ID", type = IdType.INPUT)
    private String docId;

    /** 所属文档类型（SYS_KNOWLEDGE_DOC_TYPE.TYPE_ID）：文档必须挂在类型节点上 */
    @TableField("TYPE_ID")
    private String typeId;

    @TableField("GROUP_ID")
    private String groupId;

    @TableField("TITLE")
    private String title;

    @TableField("CANONICAL_FILE_ID")
    private String canonicalFileId;

    @TableField("SOURCE_TYPE")
    private String sourceType;

    @TableField("VARIANT")
    private String variant;

    @TableField("TEXT_HASH")
    private String textHash;

    @TableField("VERSION")
    private Integer version;

    @TableField("STATUS")
    private String status;

    @TableField("INDEXED")
    private Integer indexed;

    @TableField("CHUNK_COUNT")
    private Integer chunkCount;

    @TableField("QDRANT_COLLECTION")
    private String qdrantCollection;

    @TableField("ERROR_MSG")
    private String errorMsg;
}
