package cn.lonwin.module.video.model.vo;

import lombok.Data;

/**
 * 视频播放信息。
 * <p>
 * streamUrl 为平台 HLS 流地址（m3u8），浏览器不支持 HLS 时前端用 snapshotUrl 展示最新抓拍画面。
 */
@Data
public class VideoPlayVO {

    private String code;

    private String name;

    /** 平台返回的播放页地址 */
    private String playUrl;

    /** HLS 视频流地址 */
    private String streamUrl;

    /** 流协议（hls） */
    private String protocol;

    /** 是否成功获取到播放地址 */
    private Boolean online;

    /** 最新抓拍图片 URL（播放失败时的降级画面） */
    private String snapshotUrl;

    /** 失败原因 */
    private String message;
}
