package cn.lonwin.module.video.service;

import cn.lonwin.module.video.config.VideoProperties;
import cn.lonwin.module.video.entity.VideoSnapshotDetectEntity;
import cn.lonwin.module.video.entity.VideoSnapshotEntity;
import cn.lonwin.module.video.model.dto.CapturedSnapshot;
import cn.lonwin.module.video.model.vo.DetectAnalyzeVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

/**
 * 手动分析图片：按视频站编码 / 抓拍日期找出已有抓拍图片，逐张调用目标检测服务识别。
 * <p>
 * 与定时截图的识别口径一致：命中 {@code lonwin.spjk.detect-abnormal-labels}
 * 即判定为异常抓拍，识别详情写入 VIDEO_SNAPSHOT_DETECT，标注图与截图存在同一位置。
 */
@Slf4j
@Service
public class VideoSnapshotAnalyzeService {

    /** 点位目录在文件路径中的下标（从末尾数第 2 段：.../{分组}/{点位目录}/{文件名}） */
    private static final int POINT_DIR_SEGMENT_FROM_END = 2;

    /** 标注图子目录（与 VideoDetectRecordService 保持一致，用于跳过二次识别） */
    private static final String ANNOTATED_SUB_DIR = "anno";

    private final VideoProperties props;

    private final VideoSnapshotService snapshotService;

    private final VideoSnapshotStorageService storageService;

    private final VideoDetectService detectService;

    public VideoSnapshotAnalyzeService(VideoProperties props,
                                       VideoSnapshotService snapshotService,
                                       VideoSnapshotStorageService storageService,
                                       VideoDetectService detectService) {
        this.props = props;
        this.snapshotService = snapshotService;
        this.storageService = storageService;
        this.detectService = detectService;
    }

    /**
     * 分析已有抓拍图片。
     *
     * @param code  视频站编码，空则按日期
     * @param date  抓拍日期 yyyy-MM-dd，空则取当天
     * @param group 分组 timed / abnormal / water，空为全部
     * @param limit 最多识别条数（<=0 不限制）
     * @return 识别结果汇总
     */
    public DetectAnalyzeVO analyze(String code, String date, String group, int limit) {
        if ((code == null || code.isBlank()) && (date == null || date.isBlank())) {
            throw new IllegalArgumentException(
                    "请至少传入视频站编码 code 或抓拍日期 date（yyyy-MM-dd）");
        }
        if (!props.isDetectEnabled()) {
            throw new IllegalStateException("图片识别未开启：请设置 lonwin.spjk.detect-enabled=true");
        }
        List<VideoSnapshotEntity> rows = snapshotService.queryEntities(date, code, group, limit)
                .stream()
                // 标注图本身不再重复识别，避免在标注图上再生成标注图
                .filter(row -> !isAnnotated(row.getFilePath()))
                .toList();
        DetectAnalyzeVO result = new DetectAnalyzeVO();
        result.setTotal(rows.size());
        for (VideoSnapshotEntity row : rows) {
            DetectAnalyzeVO.Item item = analyzeOne(row);
            result.getItems().add(item);
            if (item.isSuccess()) {
                result.setDetected(result.getDetected() + 1);
                if (item.isAbnormal()) {
                    result.setAbnormal(result.getAbnormal() + 1);
                }
            } else {
                result.setFailed(result.getFailed() + 1);
            }
        }
        log.info("图片分析完成：code={}，date={}，group={}，总数={}，识别成功={}，异常抓拍={}，失败={}",
                code, date, group, result.getTotal(), result.getDetected(),
                result.getAbnormal(), result.getFailed());
        return result;
    }

    // ==================== 私有方法 ====================

    /** 识别单张抓拍图片 */
    private DetectAnalyzeVO.Item analyzeOne(VideoSnapshotEntity row) {
        DetectAnalyzeVO.Item item = new DetectAnalyzeVO.Item();
        item.setSnapshotId(row.getId());
        item.setPointCode(row.getPointCode());
        item.setPointName(row.getPointName());
        item.setCaptureDate(row.getCaptureDate());

        String path = row.getFilePath();
        if (path == null || path.isBlank()) {
            item.setMessage("抓拍记录没有图片路径");
            return item;
        }
        byte[] image;
        try (InputStream in = storageService.openStream(path)) {
            image = in.readAllBytes();
        } catch (Exception e) {
            item.setMessage("读取图片失败：" + e.getMessage());
            return item;
        }

        CapturedSnapshot captured = new CapturedSnapshot(row.getPointCode(), row.getPointName(),
                image, imageFormat(path, row.getFileName()), row.getId(), captureDay(row),
                row.getGroupCode(), pointDirOf(path, row.getPointCode()),
                fileNameOf(path, row.getFileName()), LocalDateTime.now());
        VideoDetectService.DetectOutcome outcome;
        try {
            outcome = detectService.analyze(captured);
        } catch (Exception e) {
            item.setMessage("识别异常：" + e.getMessage());
            return item;
        }
        if (outcome == null) {
            item.setMessage("识别失败（检测服务不可用或返回异常，详见日志）");
            return item;
        }

        VideoSnapshotDetectEntity detect = outcome.record();
        item.setSuccess(true);
        item.setAbnormal(Integer.valueOf(1).equals(detect.getIsAbnormal()));
        item.setLabels(detect.getAbnormalLabels());
        item.setTotalCount(detect.getTotalCount());
        item.setAnnotatedPath(detect.getAnnotatedPath());
        item.setAnnotatedUrl(detect.getAnnotatedUrl());
        // 标注图另存一条「异常抓拍」记录，原定时抓拍记录保持不变
        if (item.isAbnormal() && props.isDetectSaveAnnotatedSnapshot()
                && outcome.annotated() != null) {
            snapshotService.record(row.getPointCode(), row.getPointName(),
                    VideoSnapshotService.GROUP_ABNORMAL, captureDay(row), outcome.annotated(),
                    row.getCaptureTime());
        }
        return item;
    }

    /** 是否为标注图（位于点位目录的 anno 子目录下） */
    private boolean isAnnotated(String path) {
        return path != null && path.contains("/" + ANNOTATED_SUB_DIR + "/");
    }

    /** 抓拍日期（记录缺失时按当天，用于标注图目录） */
    private String captureDay(VideoSnapshotEntity row) {
        String day = row.getCaptureDate();
        return day == null || day.isBlank() ? LocalDate.now().toString() : day;
    }

    /** 从文件路径末段取文件名（记录里 FILE_NAME 为空时兜底） */
    private String fileNameOf(String path, String fileName) {
        if (fileName != null && !fileName.isBlank()) {
            return fileName;
        }
        int slash = path.lastIndexOf('/');
        return slash >= 0 ? path.substring(slash + 1) : path;
    }

    /** 从文件路径取点位目录（.../{日期}/{分组}/{点位目录}/{文件名}） */
    private String pointDirOf(String path, String pointCode) {
        String[] parts = path.split("/");
        if (parts.length >= POINT_DIR_SEGMENT_FROM_END) {
            String dir = parts[parts.length - POINT_DIR_SEGMENT_FROM_END];
            if (!dir.isBlank()) {
                return dir;
            }
        }
        return pointCode == null || pointCode.isBlank() ? "unknown" : pointCode;
    }

    /** 送检图片格式（取扩展名，缺省 jpg） */
    private String imageFormat(String path, String fileName) {
        String name = fileNameOf(path, fileName).toLowerCase(Locale.ROOT);
        int dot = name.lastIndexOf('.');
        if (dot > 0 && dot < name.length() - 1) {
            String ext = name.substring(dot + 1);
            if ("png".equals(ext) || "bmp".equals(ext) || "webp".equals(ext)) {
                return ext;
            }
        }
        return "jpg";
    }
}
