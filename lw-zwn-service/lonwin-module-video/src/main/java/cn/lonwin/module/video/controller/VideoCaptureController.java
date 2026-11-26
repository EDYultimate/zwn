package cn.lonwin.module.video.controller;

import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.module.video.model.dto.SnapshotResult;
import cn.lonwin.module.video.model.dto.VideoPoint;
import cn.lonwin.module.video.service.SpjkVideoService;
import cn.lonwin.module.video.service.VideoPointStatusService;
import cn.lonwin.module.video.service.VideoStationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 视频点位截图执行接口（保留截图源模块的原有能力，并支持页面「截图」按钮）。
 */
@RestController
@RequestMapping("/video")
@RequiredArgsConstructor
public class VideoCaptureController {

    private final SpjkVideoService spjkVideoService;

    private final VideoStationService stationService;

    private final VideoPointStatusService pointStatusService;

    /** 平台接口原始点位列表 */
    @GetMapping("/points")
    public Result<List<VideoPoint>> listPoints() {
        return Result.success(spjkVideoService.getVideoList());
    }

    /** 主库点位列表（VIDEO_POINT_STATUS，由 WEIHE 台账同步而来） */
    @GetMapping("/points/db")
    public Result<List<VideoPoint>> listDbPoints() {
        return Result.success(spjkVideoService.getZwnPointList());
    }

    /**
     * 手动触发点位信息同步：WEIHE 台账（只读）→ 主库 VIDEO_POINT_STATUS。
     *
     * @return 本次同步的点位数量
     */
    @PostMapping("/points/sync")
    public Result<Integer> syncPoints() {
        int count = pointStatusService.syncFromWeihe();
        return Result.success(count);
    }

    /** 指定点位的 HLS 视频流地址 */
    @GetMapping("/stream/{code}")
    public Result<String> getStreamUrl(@PathVariable("code") String code) {
        return Result.success(spjkVideoService.getStreamUrl(code));
    }

    /** 遍历平台点位截图 */
    @GetMapping("/capture")
    public Result<SnapshotResult> captureAll(
            @RequestParam(required = false, defaultValue = "timed") String group) {
        return Result.success(spjkVideoService.captureAll(group));
    }

    /** 遍历主库点位截图（定时任务使用的口径） */
    @GetMapping("/capture/db")
    public Result<SnapshotResult> captureZwnAll(
            @RequestParam(required = false, defaultValue = "timed") String group) {
        return Result.success(spjkVideoService.captureZwnAll(group));
    }

    /**
     * 对单个点位截图（页面「截图」按钮）；group 支持 timed / abnormal / water。
     */
    @PostMapping("/capture/{code}")
    public Result<SnapshotResult> captureOne(
            @PathVariable("code") String code,
            @RequestParam(required = false, defaultValue = "timed") String group) {
        VideoPoint point = stationService.getPoint(code);
        if (point == null) {
            point = new VideoPoint();
            point.setCode(code);
            point.setName(code);
        }
        SnapshotResult result = new SnapshotResult();
        result.setTotal(1);
        SnapshotResult.Item item = spjkVideoService.captureOne(point, group);
        // 手动单点截图同样把实测在线状态立即写库
        pointStatusService.flush();
        result.getItems().add(item);
        if (item.isOk()) {
            result.setSuccess(1);
        } else {
            result.setFail(1);
        }
        return Result.success(result);
    }
}
