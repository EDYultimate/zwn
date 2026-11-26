package cn.lonwin.module.video.service;

import cn.lonwin.module.video.entity.VideoSnapshotDetectEntity;
import cn.lonwin.module.video.mapper.VideoSnapshotDetectMapper;
import cn.lonwin.module.video.model.dto.CapturedSnapshot;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 异常图片识别结果的落库与标注图存储。
 * <p>
 * 标注图与定时截取的图片保存在同一位置：local 模式为
 * {根目录}/{日期}/{分组}/{点位目录}/anno/{原文件名}_anno.png，
 * minio 模式为对应对象 key；单独放 anno 子目录是为了不让标注图混进抓拍列表。
 */
@Slf4j
@Service
public class VideoDetectRecordService {

    /** 标注图子目录（与抓拍图同点位目录下） */
    private static final String ANNOTATED_SUB_DIR = "anno";

    /** 标注图扩展名（/api/v1/annotate 返回 PNG） */
    private static final String ANNOTATED_EXT = ".png";

    private final VideoSnapshotDetectMapper detectMapper;

    private final VideoSnapshotStorageService storageService;

    public VideoDetectRecordService(VideoSnapshotDetectMapper detectMapper,
                                    VideoSnapshotStorageService storageService) {
        this.detectMapper = detectMapper;
        this.storageService = storageService;
    }

    /**
     * 写入一条识别记录。落库失败只告警，不影响截图与识别本身。
     */
    public void save(VideoSnapshotDetectEntity entity) {
        if (entity == null) {
            return;
        }
        try {
            detectMapper.insert(entity);
        } catch (Exception e) {
            log.warn("异常图片识别记录落库失败：{}({}) - {}（请确认已执行 sql/video_monitor.sql）",
                    entity.getPointName(), entity.getPointCode(), e.getMessage());
        }
    }

    /**
     * 保存标注图：与抓拍图同日期、同分组、同点位目录（anno 子目录下）。
     */
    public VideoSnapshotStorageService.StoredSnapshot storeAnnotated(CapturedSnapshot captured,
                                                                    byte[] data) {
        return storageService.store(data, captured.day(), captured.group(),
                captured.pointDir() + "/" + ANNOTATED_SUB_DIR,
                annotatedFileName(captured.fileName()));
    }

    /** 标注图文件名：原截图文件名（去扩展名） + _anno.png */
    private String annotatedFileName(String fileName) {
        String base = fileName == null || fileName.isBlank() ? "snapshot" : fileName;
        int dot = base.lastIndexOf('.');
        if (dot > 0) {
            base = base.substring(0, dot);
        }
        return base + "_anno" + ANNOTATED_EXT;
    }
}
