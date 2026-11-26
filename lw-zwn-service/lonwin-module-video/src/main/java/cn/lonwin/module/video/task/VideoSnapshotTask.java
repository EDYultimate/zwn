package cn.lonwin.module.video.task;

import cn.lonwin.module.video.model.dto.SnapshotResult;
import cn.lonwin.module.video.service.SpjkVideoService;
import cn.lonwin.module.video.service.VideoPointStatusService;
import cn.lonwin.module.video.service.VideoSnapshotService;
import cn.lonwin.module.video.service.VideoSnapshotStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 视频点位定时截图任务。
 * <p>
 * 开关：{@code lonwin.spjk.capture-enabled=false} 时整个任务不注册（默认开启）。
 * 执行节奏：启动后 {@code lonwin.spjk.capture-initial-delay}（默认 5 分钟）首次执行，
 * 之后每隔 {@code lonwin.spjk.capture-fixed-rate}（默认 1 小时）执行一次。
 * <p>
 * 每轮流程：
 * <ol>
 *   <li>把 WEIHE 台账（只读）的点位基础信息同步进主库 VIDEO_POINT_STATUS；</li>
 *   <li>逐点位拉流截帧，按 {@code lonwin.spjk.snapshot-storage} 保存到本地磁盘或 MinIO；</li>
 *   <li>截图结果（在线状态 + 最新抓拍）写回主库，页面只读主库。</li>
 * </ol>
 * running 标记防止上一轮未结束时重叠执行，异常必须吞掉避免影响调度线程。
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "lonwin.spjk", name = "capture-enabled",
        havingValue = "true", matchIfMissing = true)
public class VideoSnapshotTask {

    private final SpjkVideoService spjkVideoService;

    private final VideoPointStatusService pointStatusService;

    private final VideoSnapshotStorageService storageService;

    private final AtomicBoolean running = new AtomicBoolean(false);

    /**
     * 启动后延迟 5 分钟执行首次，之后每隔 1 小时执行一次（单位：毫秒）。
     */
    @Scheduled(initialDelayString = "5000",
            fixedRateString = "${lonwin.spjk.capture-fixed-rate:3600000}")
    public void captureVideoHourly() {
        if (!running.compareAndSet(false, true)) {
            log.warn("上一次视频截图任务尚未结束，跳过本次执行");
            return;
        }
        try {
            log.info("视频截图定时任务开始，存储方式={}", storageService.currentStorage());
            long start = System.currentTimeMillis();
            // 先把 WEIHE 台账同步进主库，保证本轮点位与台账一致
            int synced = pointStatusService.syncFromWeihe();
            log.info("视频点位台账同步完成：{} 个点位", synced);
            SnapshotResult result = spjkVideoService.captureZwnAll(
                    VideoSnapshotService.GROUP_TIMED);
            log.info("视频截图定时任务完成：总数={}，成功={}，失败={}，耗时={}秒",
                    result.getTotal(), result.getSuccess(), result.getFail(),
                    (System.currentTimeMillis() - start) / 1000);
        } catch (Throwable e) {
            // 必须兜住 Throwable：ScheduledThreadPoolExecutor 对周期任务只要抛出一次异常
            // （包括 NoClassDefFoundError 这类 Error）就会取消后续所有执行，任务会永久停摆
            log.error("视频截图定时任务执行异常：{}", e.getMessage(), e);
        } finally {
            running.set(false);
        }
    }
}
