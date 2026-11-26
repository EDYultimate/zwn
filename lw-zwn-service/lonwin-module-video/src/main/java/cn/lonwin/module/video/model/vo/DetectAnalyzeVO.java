package cn.lonwin.module.video.model.vo;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * 手动分析图片的结果（按视频站编码 / 抓拍日期批量识别已有抓拍图片）。
 */
@Data
public class DetectAnalyzeVO {

    /** 本次参与识别的图片数量 */
    private int total;

    /** 识别成功数量 */
    private int detected;

    /** 判定为「异常抓拍」的数量 */
    private int abnormal;

    /** 识别失败数量（图片缺失 / 检测服务不可用等） */
    private int failed;

    private List<Item> items = new ArrayList<>();

    @Data
    public static class Item {

        /** 抓拍记录 ID（VIDEO_SNAPSHOT.ID） */
        private String snapshotId;

        private String pointCode;

        private String pointName;

        private String captureDate;

        /** 识别是否成功 */
        private boolean success;

        /** 是否异常抓拍（命中 person / bicycle / car / truck / boat 等） */
        private boolean abnormal;

        /** 命中的类别，逗号分隔 */
        private String labels;

        /** 检测到的目标总数 */
        private Integer totalCount;

        /** 标注图路径（与截图同位置） */
        private String annotatedPath;

        /** 标注图访问 URL */
        private String annotatedUrl;

        /** 失败原因 */
        private String message;
    }
}
