package cn.lonwin.module.knowledge.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;

/**
 * SYS_KNOWLEDGE_FILE：物理文件元数据。
 *
 * <p><b>一次上传 = 一行 = 一个 MinIO 对象</b>。OBJECT_KEY 非空，
 * 同名/同 hash 也照样新增；isDuplicate 与 dedupDecision 只描述
 * 「阶段 2 是否跳过切片」，与对象存储完全解耦。
 */
@Data
@TableName("SYS_KNOWLEDGE_FILE")
public class KnowledgeFileEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(value = "FILE_ID", type = IdType.INPUT)
    private String fileId;

    @TableField("DOC_ID")
    private String docId;

    @TableField("GROUP_ID")
    private String groupId;

    @TableField("FILE_NAME")
    private String fileName;

    @TableField("FILE_EXT")
    private String fileExt;

    @TableField("FILE_SIZE")
    private Long fileSize;

    @TableField("CONTENT_TYPE")
    private String contentType;

    @TableField("FILE_HASH")
    private String fileHash;

    @TableField("BUCKET")
    private String bucket;

    /** NOT NULL：每个上传文件都有独立对象，绝不因去重而为空 */
    @TableField("OBJECT_KEY")
    private String objectKey;

    @TableField("PARSED_KEY")
    private String parsedKey;

    @TableField("SOURCE_TYPE")
    private String sourceType;

    @TableField("IS_DUPLICATE")
    private Integer isDuplicate;

    @TableField("DEDUP_DECISION")
    private String dedupDecision;

    @TableField("CANONICAL_FILE_ID")
    private String canonicalFileId;

    @TableField("PARSE_STATUS")
    private String parseStatus;

    @TableField("INDEXED")
    private Integer indexed;

    @TableField("CHUNK_COUNT")
    private Integer chunkCount;

    @TableField("ERROR_MSG")
    private String errorMsg;

    /**
     * 入库时间，由数据库默认值 {@code CURRENT_TIMESTAMP} 生成，只读。
     * 列表按此倒序，插入时保持 null 即可（不参与 INSERT 语句）。
     */
    @TableField("CREATE_TIME")
    private LocalDateTime createTime;
}
