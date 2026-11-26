package cn.lonwin.module.video.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 抓拍记录（主库 HWWR，对应 sql/video_monitor.sql）。
 * <p>
 * 本地磁盘与 MinIO 两种存储共用一张表：FILE_PATH 在 local 模式下是相对截图根目录的路径，
 * 在 minio 模式下是对象 key，均与页面「预览 / 下载」接口的 path 参数一致。
 */
@Data
@TableName("VIDEO_SNAPSHOT")
public class VideoSnapshotEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "ID", type = IdType.INPUT)
    private String id;

    @TableField("POINT_CODE")
    private String pointCode;

    @TableField("POINT_NAME")
    private String pointName;

    /** 分组编码：timed / abnormal / water */
    @TableField("GROUP_CODE")
    private String groupCode;

    /** 抓拍日期 yyyy-MM-dd */
    @TableField("CAPTURE_DATE")
    private String captureDate;

    @TableField("CAPTURE_TIME")
    private LocalDateTime captureTime;

    /** 存储类型：local / minio */
    @TableField("STORAGE_TYPE")
    private String storageType;

    @TableField("FILE_PATH")
    private String filePath;

    @TableField("FILE_URL")
    private String fileUrl;

    @TableField("FILE_NAME")
    private String fileName;

    @TableField("FILE_SIZE")
    private Long fileSize;

    @TableField("CREATE_TIME")
    private LocalDateTime createTime;
}
