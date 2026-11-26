package cn.lonwin.module.video.model.vo;

import lombok.Data;

/**
 * 视频监控页「监控点位列表」卡片数据。
 */
@Data
public class VideoStationVO {

    /** 列表序号（页面选中/定位使用） */
    private Integer id;

    /** 视频点编码 */
    private String code;

    /** 点位名称 */
    private String name;

    /** 监管单位 */
    private String org;

    /**
     * 在线状态：在线 / 离线 / 异常抓拍。
     * <p>
     * 优先取定时截图的实测结果（主库 VIDEO_POINT_STATUS.ONLINE_STATE），
     * 尚未实测过的点位才回退台账原始 STATE。
     */
    private String status;

    /** 最近一次状态实测时间（yyyy-MM-dd HH:mm:ss，未知为空） */
    private String statusTime;

    /** 是否存在异常抓拍 */
    private Boolean capture;

    /** 是否存在取水抓拍（有取水行为） */
    private Boolean water;

    /** 是否重点点位 */
    private Boolean main;

    /** 最新抓拍图片 URL（列表缩略图） */
    private String thumb;

    /** 所属站点 */
    private String site;

    /** 平台原始状态值 */
    private String state;

    /** 经度 */
    private String xAxis;

    /** 纬度 */
    private String yAxis;

    /** 查询日期内的抓拍数量 */
    private Integer snapshotCount;

    /** 最近一次抓拍时间 */
    private String latestCaptureTime;
}
