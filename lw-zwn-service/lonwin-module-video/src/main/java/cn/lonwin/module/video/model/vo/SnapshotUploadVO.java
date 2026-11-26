package cn.lonwin.module.video.model.vo;

import lombok.Data;

/**
 * 图片上传（保存到 MinIO / 本地）结果。
 */
@Data
public class SnapshotUploadVO {

    /** 存储类型：minio / local */
    private String storageType;

    /** minio 模式为对象 key，local 模式为相对截图根目录的路径 */
    private String path;

    /** 图片访问 URL（可直接用于 img src） */
    private String url;

    /** 文件名 */
    private String fileName;

    /** 文件大小（字节） */
    private Long size;
}
