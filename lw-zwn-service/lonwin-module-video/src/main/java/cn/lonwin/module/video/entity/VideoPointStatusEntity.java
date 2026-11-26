package cn.lonwin.module.video.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 视频点位信息与在线状态（主库 HWWR，对应 sql/video_monitor.sql）。
 * <p>
 * 点位基础信息由 WEIHE 台账（tr_Spd）同步而来，WEIHE 数据源只读；
 * 在线状态（ONLINE_STATE / STATE_TIME / STATE_REASON）与最新抓拍信息由截图任务写入。
 */
@Data
@TableName("VIDEO_POINT_STATUS")
public class VideoPointStatusEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 视频点编码（业务主键） */
    @TableId(value = "POINT_CODE", type = IdType.INPUT)
    private String pointCode;

    @TableField("POINT_NAME")
    private String pointName;

    /** 所属站点 */
    @TableField("SITE")
    private String site;

    /** 监管单位（页面筛选项） */
    @TableField("ORG")
    private String org;

    /** 管理单位名称 */
    @TableField("MANAGE_UNIT")
    private String manageUnit;

    @TableField("STAKE_NO")
    private String stakeNo;

    @TableField("RIVER")
    private String river;

    @TableField("SETUP_BASIS")
    private String setupBasis;

    @TableField("ADDRESS")
    private String address;

    @TableField("WATER_TIME")
    private String waterTime;

    @TableField("WATER_AMOUNT")
    private String waterAmount;

    @TableField("X_AXIS")
    private String xAxis;

    @TableField("Y_AXIS")
    private String yAxis;

    /** 是否重点点位：1=是，0=否 */
    @TableField("IS_MAIN")
    private Integer isMain;

    /** 台账/平台原始状态值（仅兜底参考） */
    @TableField("PLATFORM_STATE")
    private String platformState;

    /** 实测在线状态：1=在线，0=离线 */
    @TableField("ONLINE_STATE")
    private Integer onlineState;

    /** 最近一次实测状态时间，为空表示尚未实测 */
    @TableField("STATE_TIME")
    private LocalDateTime stateTime;

    /** 最近一次实测状态说明（离线时为失败原因） */
    @TableField("STATE_REASON")
    private String stateReason;

    @TableField("LATEST_SNAPSHOT_PATH")
    private String latestSnapshotPath;

    @TableField("LATEST_SNAPSHOT_URL")
    private String latestSnapshotUrl;

    @TableField("LATEST_SNAPSHOT_TIME")
    private LocalDateTime latestSnapshotTime;

    /** 最近一次从 WEIHE 台账同步的时间 */
    @TableField("SYNC_TIME")
    private LocalDateTime syncTime;

    @TableField("CREATE_TIME")
    private LocalDateTime createTime;

    @TableField("UPDATE_TIME")
    private LocalDateTime updateTime;
}
