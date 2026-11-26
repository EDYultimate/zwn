package cn.lonwin.module.video.model.vo;

import lombok.Data;

/**
 * 视频详情弹框：站点基本信息。
 */
@Data
public class VideoStationDetailVO {

    private String code;

    private String name;

    /** 监管单位 */
    private String org;

    /** 管理单位名称（TR_DEPT.DEPTNAME，SQL 别名 DEPT_NAME） */
    private String manageUnit;

    /** 桩号 */
    private String stakeNo;

    /** 河流名称（DICT_SPJK.KEYNAME，SQL 别名 RIVERID_NAME） */
    private String river;

    /** 设置依据 */
    private String setupBasis;

    /** 地址 */
    private String address;

    /** 取水时段（暂无取水口数据源时为空） */
    private String waterTime;

    /** 上报取水量（暂无取水口数据源时为空） */
    private String waterAmount;

    /** 所属站点 */
    private String site;

    /** 在线状态 */
    private String status;

    /** 最近一次状态实测时间（yyyy-MM-dd HH:mm:ss，未知为空） */
    private String statusTime;

    /** 经度 */
    private String xAxis;

    /** 纬度 */
    private String yAxis;

    /** 查询日期内抓拍数量 */
    private Integer snapshotCount;

    /** 最近一次抓拍时间 */
    private String latestCaptureTime;

    /** 最新抓拍图片 URL */
    private String latestSnapshot;
}
