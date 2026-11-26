package cn.lonwin.module.video.model.vo;

import lombok.Data;

/**
 * 抓拍图片（定时拍摄 / 异常抓拍 / 取水抓拍）。
 */
@Data
public class SnapshotVO {

    /** 唯一标识：相对路径 */
    private String id;

    /** 相对截图根目录的路径，供图片查看 / 下载接口使用 */
    private String path;

    /** 图片访问 URL（可直接用于 img src） */
    private String url;

    /** 点位编码 */
    private String code;

    /** 点位名称 */
    private String name;

    /** 分组编码：timed / abnormal / water */
    private String groupCode;

    /** 分组名称：定时拍摄 / 异常抓拍 / 取水抓拍 */
    private String groupName;

    /** 抓拍日期 yyyy-MM-dd */
    private String date;

    /** 抓拍时间 yyyy-MM-dd HH:mm:ss */
    private String captureTime;

    /** 帧标签（HH:mm:ss） */
    private String duration;

    /** 文件名 */
    private String fileName;

    /** 文件大小（字节） */
    private Long size;
}
