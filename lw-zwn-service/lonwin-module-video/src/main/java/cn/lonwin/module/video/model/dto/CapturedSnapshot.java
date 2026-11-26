package cn.lonwin.module.video.model.dto;

import java.time.LocalDateTime;

/**
 * 一次成功截图的内存快照，供截图后的「异常抓拍」智能识别使用。
 * <p>
 * image 为截图原始字节（JPEG）；day / group / pointDir / fileName 与落盘时一致，
 * 异常识别生成的标注图按同样的位置保存（同日期 / 同分组 / 点位目录下的 anno 子目录）。
 *
 * @param pointCode   视频点编码
 * @param pointName   视频点名称
 * @param image       截取的图片字节
 * @param imageFormat 图片格式（jpg / png）
 * @param snapshotId  VIDEO_SNAPSHOT 主键（落库失败时为 null）
 * @param day         日期目录 yyyy-MM-dd
 * @param group       分组目录 timed / abnormal / water
 * @param pointDir    点位目录名
 * @param fileName    截图文件名
 * @param captureTime 抓拍时间
 */
public record CapturedSnapshot(String pointCode, String pointName, byte[] image, String imageFormat,
                               String snapshotId, String day, String group, String pointDir,
                               String fileName, LocalDateTime captureTime) {
}
