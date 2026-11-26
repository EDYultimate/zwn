package cn.lonwin.module.video.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 异常图片识别要素表（主库 HWWR，对应 sql/video_monitor.sql）。
 * <p>
 * 一行对应一次截图的智能识别结果：记录识别到的 label 实体（CLASS_COUNTS / DETECT_DETAIL）、
 * 是否命中异常类别（IS_ABNORMAL / ABNORMAL_LABELS）以及标注图位置。
 * 通过 SNAPSHOT_ID 关联 {@link VideoSnapshotEntity#getId()}，与抓拍记录一对一。
 */
@Data
@TableName("VIDEO_SNAPSHOT_DETECT")
public class VideoSnapshotDetectEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "ID", type = IdType.INPUT)
    private String id;

    /** 关联的抓拍记录主键（VIDEO_SNAPSHOT.ID） */
    @TableField("SNAPSHOT_ID")
    private String snapshotId;

    @TableField("POINT_CODE")
    private String pointCode;

    @TableField("POINT_NAME")
    private String pointName;

    /** 截图分组：timed / abnormal / water */
    @TableField("GROUP_CODE")
    private String groupCode;

    /** 抓拍日期 yyyy-MM-dd */
    @TableField("CAPTURE_DATE")
    private String captureDate;

    @TableField("CAPTURE_TIME")
    private LocalDateTime captureTime;

    /** 识别是否成功：1=成功，0=失败 */
    @TableField("DETECT_SUCCESS")
    private Integer detectSuccess;

    /** 是否异常抓拍：1=命中异常类别，0=正常 */
    @TableField("IS_ABNORMAL")
    private Integer isAbnormal;

    /** 命中的异常类别，逗号分隔，如 person,car */
    @TableField("ABNORMAL_LABELS")
    private String abnormalLabels;

    /** 检测到的目标总数 */
    @TableField("TOTAL_COUNT")
    private Integer totalCount;

    /** 各类别数量（JSON，如 {"person":2}） */
    @TableField("CLASS_COUNTS")
    private String classCounts;

    @TableField("IMAGE_WIDTH")
    private Integer imageWidth;

    @TableField("IMAGE_HEIGHT")
    private Integer imageHeight;

    /** 本次使用的检测模型 ID，逗号分隔 */
    @TableField("MODELS_USED")
    private String modelsUsed;

    /** 检测服务返回的汇总描述 */
    @TableField("SUMMARY")
    private String summary;

    /** 检测明细（detections 数组 JSON，含 label / confidence / bbox） */
    @TableField("DETECT_DETAIL")
    private String detectDetail;

    /** 推理耗时（毫秒） */
    @TableField("INFERENCE_TIME_MS")
    private Double inferenceTimeMs;

    /** 标注图路径：local 为相对截图根目录，minio 为对象 key */
    @TableField("ANNOTATED_PATH")
    private String annotatedPath;

    /** 标注图访问 URL */
    @TableField("ANNOTATED_URL")
    private String annotatedUrl;

    /** 识别失败原因 */
    @TableField("ERROR_MSG")
    private String errorMsg;

    @TableField("CREATE_TIME")
    private LocalDateTime createTime;
}
