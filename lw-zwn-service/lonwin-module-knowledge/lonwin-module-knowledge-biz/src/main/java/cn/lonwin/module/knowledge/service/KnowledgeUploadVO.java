package cn.lonwin.module.knowledge.service;

import java.util.LinkedHashMap;
import java.util.Map;

import lombok.Builder;
import lombok.Data;

/**
 * 一次上传的结果。每个上传文件都会返回一条，且只要 {@code objectKey} 非空，
 * 就代表该文件已真实写入 MinIO。
 *
 * <p>{@code metaPersisted=false} 只说明达梦元数据表未写入（通常是没执行建表脚本），
 * 不代表文件没存；此时用 {@code warning} 明确提示运维动作。
 */
@Data
@Builder
public class KnowledgeUploadVO {

    private String fileId;
    private String docId;
    /** 所属文档类型 ID（上传时必填） */
    private String typeId;
    private String groupId;
    private String fileName;
    private String sourceType;
    private String fileHash;
    private long size;
    private String bucket;
    private String objectKey;
    /** 裸路径，便于运维定位对象 */
    private String viewPath;
    /** 可直接用于文档角标的原文地址（/resourceShow/file?path=...） */
    private String resourceUrl;

    /** 1 = 与已有文件字节相同；仅影响阶段 2 是否切片，文件照样已存 */
    private Integer isDuplicate;
    /** CANONICAL / ATTACHMENT / INDEPENDENT */
    private String dedupDecision;
    private String parseStatus;
    private Integer indexed;
    /** async / sync / skipped-duplicate / disabled / meta-missing / trigger-failed */
    private String indexMode;

    private boolean metaPersisted;
    private String warning;
    private String error;

    /** 给前端与日志用的紧凑视图 */
    public Map<String, Object> toMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("fileId", fileId);
        map.put("docId", docId);
        map.put("typeId", typeId);
        map.put("groupId", groupId);
        map.put("fileName", fileName);
        map.put("sourceType", sourceType);
        map.put("fileHash", fileHash);
        map.put("size", size);
        map.put("bucket", bucket);
        map.put("objectKey", objectKey);
        map.put("viewPath", viewPath);
        map.put("resourceUrl", resourceUrl);
        map.put("isDuplicate", isDuplicate);
        map.put("dedupDecision", dedupDecision);
        map.put("parseStatus", parseStatus);
        map.put("indexed", indexed);
        map.put("indexMode", indexMode);
        map.put("metaPersisted", metaPersisted);
        if (warning != null) {
            map.put("warning", warning);
        }
        if (error != null) {
            map.put("error", error);
        }
        return map;
    }
}
