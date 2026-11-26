package cn.lonwin.module.video.model.dto;

import lombok.Data;

/**
 * 视频点位信息。
 * <p>
 * 同时兼容两种数据来源：平台 getVideoList 返回的 spdList 元素，
 * 以及本地数据库 tr_Spd 表（后者可提供更多点位基础信息）。
 */
@Data
public class VideoPoint {

    /** 视频点编码（获取视频流的唯一标识） */
    private String code;

    /** 视频点名称 */
    private String name;

    /** 所属站点 */
    private String site;

    /** 平台原始状态值 */
    private String state;

    /** 经度 */
    private String xAxis;

    /** 纬度 */
    private String yAxis;

    /** 监管单位（页面列表展示） */
    private String org;

    /** 管理单位名称（TR_DEPT.DEPTNAME） */
    private String manageUnit;

    /** 桩号 */
    private String stakeNo;

    /** 河流名称（DICT_SPJK.KEYNAME） */
    private String river;

    /** 设置依据 */
    private String setupBasis;

    /** 地址 */
    private String address;

    /** 取水时段（暂无取水口数据源时为空） */
    private String waterTime;

    /** 上报取水量（暂无取水口数据源时为空） */
    private String waterAmount;

    /** 是否重点点位 */
    private Boolean main;
}
