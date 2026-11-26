package cn.lonwin.module.video.service;

import cn.lonwin.module.video.entity.VideoPointStatusEntity;
import cn.lonwin.module.video.mapper.VideoPointStatusMapper;
import cn.lonwin.module.video.model.dto.VideoPoint;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 视频点位信息与在线状态（主库 HWWR 的 VIDEO_POINT_STATUS 表）。
 * <p>
 * 职责划分：
 * <ul>
 *   <li>WEIHE 台账（tr_Spd）只读，由 {@link #syncFromWeihe()} 把点位基础信息同步进本表；</li>
 *   <li>页面查询一律读本表，不再直连 WEIHE；</li>
 *   <li>截图任务把「能否取到帧」的实测结果写入 ONLINE_STATE / STATE_TIME / STATE_REASON，
 *       并把最新抓拍路径与 URL 一并落到同一行，替代原先的本地 JSON 状态文件。</li>
 * </ul>
 * 状态更新先在内存累积，一轮截图结束后由 {@link #flush()} 统一写库，避免逐点位刷库。
 */
@Slf4j
@Service
public class VideoPointStatusService {

    /** STATE_REASON 列长度 */
    private static final int REASON_MAX_LENGTH = 500;

    private final VideoPointStatusMapper pointStatusMapper;

    private final VideoPointService videoPointService;

    /** 待落库的状态：点位编码（小写）→ 状态 */
    private final Map<String, PendingState> pending = new ConcurrentHashMap<>();

    /** 主表是否可用（未执行建表脚本时避免每个点位刷一条告警） */
    private volatile boolean tableReady;

    private volatile long tableCheckedAt;

    public VideoPointStatusService(VideoPointStatusMapper pointStatusMapper,
                                   VideoPointService videoPointService) {
        this.pointStatusMapper = pointStatusMapper;
        this.videoPointService = videoPointService;
    }

    /** 内存中待落库的一次实测结果 */
    private record PendingState(String code, String name, boolean online, LocalDateTime time,
                                String reason, String snapshotPath, String snapshotUrl) {
    }

    /**
     * 从 WEIHE 台账同步点位基础信息到 VIDEO_POINT_STATUS。
     * <p>
     * 已存在的点位只刷新基础信息，不动在线状态；台账中已不存在的点位会从本表删除，
     * 保证页面展示的点位与台账一致。WEIHE 读取失败时直接返回 0，不做任何删除。
     *
     * @return 本次同步的点位数量
     */
    public synchronized int syncFromWeihe() {
        if (!tableReady()) {
            return 0;
        }
        List<VideoPoint> weihePoints;
        try {
            weihePoints = videoPointService.getDbPoints();
        } catch (Exception e) {
            log.warn("读取 WEIHE 视频点位台账失败，跳过同步：{}", e.getMessage());
            return 0;
        }
        if (weihePoints == null) {
            return 0;
        }
        Map<String, VideoPointStatusEntity> existing = new HashMap<>();
        for (VideoPointStatusEntity row : safeListAll()) {
            existing.put(key(row.getPointCode()), row);
        }

        LocalDateTime now = LocalDateTime.now();
        Set<String> weiheKeys = new HashSet<>();
        int insert = 0;
        int update = 0;
        for (VideoPoint point : weihePoints) {
            if (point == null || point.getCode() == null || point.getCode().isBlank()) {
                continue;
            }
            String codeKey = key(point.getCode());
            weiheKeys.add(codeKey);
            try {
                VideoPointStatusEntity old = existing.get(codeKey);
                if (old == null) {
                    pointStatusMapper.insert(newEntity(point, now));
                    insert++;
                } else {
                    VideoPointStatusEntity entity = fillInfo(old.getPointCode(), point, now);
                    pointStatusMapper.updateById(entity);
                    update++;
                }
            } catch (Exception e) {
                log.warn("同步视频点位失败：{} - {}", point.getCode(), e.getMessage());
            }
        }

        int removed = 0;
        for (Map.Entry<String, VideoPointStatusEntity> entry : existing.entrySet()) {
            if (weiheKeys.contains(entry.getKey())) {
                continue;
            }
            try {
                pointStatusMapper.deleteById(entry.getValue().getPointCode());
                removed++;
            } catch (Exception e) {
                log.warn("删除已下线视频点位失败：{} - {}", entry.getValue().getPointCode(),
                        e.getMessage());
            }
        }
        log.info("视频点位台账同步完成：新增={}，更新={}，删除={}", insert, update, removed);
        return insert + update;
    }

    /**
     * 页面查询用：点位信息 + 在线状态。表为空时自动从 WEIHE 同步一次。
     */
    public List<VideoPointStatusEntity> loadStatusList() {
        List<VideoPointStatusEntity> rows = safeListAll();
        if (rows.isEmpty()) {
            syncFromWeihe();
            rows = safeListAll();
        }
        return rows;
    }

    /**
     * 截图任务 / 播放接口使用的点位列表：主表优先，主表与 WEIHE 都取不到时返回空列表。
     */
    public List<VideoPoint> loadPoints() {
        List<VideoPoint> points = new ArrayList<>();
        for (VideoPointStatusEntity row : loadStatusList()) {
            points.add(toPoint(row));
        }
        if (!points.isEmpty()) {
            return points;
        }
        // 主表异常（例如建表脚本未执行）时只读兜底，保证截图任务仍可运行
        try {
            return videoPointService.getDbPoints();
        } catch (Exception e) {
            log.warn("读取 WEIHE 视频点位台账失败：{}", e.getMessage());
            return points;
        }
    }

    /** 按编码查点位信息与状态，未找到返回 null */
    public VideoPointStatusEntity getByCode(String code) {
        if (code == null || code.isBlank()) {
            return null;
        }
        String target = key(code);
        for (VideoPointStatusEntity row : loadStatusList()) {
            if (target.equals(key(row.getPointCode()))) {
                return row;
            }
        }
        return null;
    }

    /** 按编码查点位，未找到返回 null */
    public VideoPoint getPoint(String code) {
        VideoPointStatusEntity row = getByCode(code);
        return row == null ? null : toPoint(row);
    }

    /** 记录截图成功（能取到帧即在线），同时记下最新抓拍 */
    public void markOnline(String code, String name,
                           VideoSnapshotStorageService.StoredSnapshot snapshot) {
        if (code == null || code.isBlank()) {
            return;
        }
        LocalDateTime now = LocalDateTime.now();
        pending.put(key(code), new PendingState(code.trim(), name, true, now, "截图成功",
                snapshot == null ? null : snapshot.path(),
                snapshot == null ? null : snapshot.url()));
    }

    /** 记录截图失败（拉流 / 取帧失败视为离线） */
    public void markOffline(String code, String name, String reason) {
        if (code == null || code.isBlank()) {
            return;
        }
        pending.put(key(code), new PendingState(code.trim(), name, false, LocalDateTime.now(),
                reason == null || reason.isBlank() ? "截图失败" : reason, null, null));
    }

    /**
     * 把内存中累积的实测状态写入数据库。写失败的状态保留在内存，等下一轮重试。
     */
    public synchronized void flush() {
        if (pending.isEmpty()) {
            return;
        }
        if (!tableReady()) {
            // 主表不可用时保留内存状态，等表可用后下一轮重试
            return;
        }
        Map<String, PendingState> batch = new HashMap<>(pending);
        int ok = 0;
        for (Map.Entry<String, PendingState> entry : batch.entrySet()) {
            PendingState state = entry.getValue();
            try {
                applyState(state);
                pending.remove(entry.getKey());
                ok++;
            } catch (Exception e) {
                log.warn("视频点位状态落库失败：{} - {}", state.code(), e.getMessage());
            }
        }
        log.info("视频点位状态落库完成：成功={}，待重试={}", ok, pending.size());
    }

    // ==================== 私有方法 ====================

    private List<VideoPointStatusEntity> safeListAll() {
        if (!tableReady()) {
            return new ArrayList<>();
        }
        try {
            List<VideoPointStatusEntity> rows = pointStatusMapper.selectList(null);
            return rows == null ? new ArrayList<>() : rows;
        } catch (Exception e) {
            tableReady = false;
            tableCheckedAt = System.currentTimeMillis();
            log.warn("查询视频点位状态表失败（请确认已执行 sql/video_monitor.sql）：{}", e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * 主表可用性探测：失败后 5 分钟内不重复探测，避免未建表时刷日志。
     */
    private boolean tableReady() {
        if (tableReady) {
            return true;
        }
        long now = System.currentTimeMillis();
        if (now - tableCheckedAt < 300_000L) {
            return false;
        }
        tableCheckedAt = now;
        try {
            pointStatusMapper.selectCount(null);
            tableReady = true;
        } catch (Exception e) {
            tableReady = false;
            log.warn("视频点位主表不可用，请先执行 sql/video_monitor.sql：{}", e.getMessage());
        }
        return tableReady;
    }

    private void applyState(PendingState state) {
        LocalDateTime now = LocalDateTime.now();
        UpdateWrapper<VideoPointStatusEntity> wrapper = new UpdateWrapper<>();
        wrapper.eq("POINT_CODE", state.code())
                .set("ONLINE_STATE", state.online() ? 1 : 0)
                .set("STATE_TIME", state.time())
                .set("STATE_REASON", truncate(state.reason()))
                .set("UPDATE_TIME", now);
        if (state.snapshotPath() != null) {
            wrapper.set("LATEST_SNAPSHOT_PATH", state.snapshotPath())
                    .set("LATEST_SNAPSHOT_URL", state.snapshotUrl())
                    .set("LATEST_SNAPSHOT_TIME", state.time());
        }
        int rows = pointStatusMapper.update(null, wrapper);
        if (rows == 0) {
            // 台账里没有该点位（例如平台接口单独截图），补一行最小记录
            VideoPointStatusEntity entity = new VideoPointStatusEntity();
            entity.setPointCode(state.code());
            entity.setPointName(state.name());
            entity.setOnlineState(state.online() ? 1 : 0);
            entity.setStateTime(state.time());
            entity.setStateReason(truncate(state.reason()));
            entity.setLatestSnapshotPath(state.snapshotPath());
            entity.setLatestSnapshotUrl(state.snapshotUrl());
            entity.setLatestSnapshotTime(state.snapshotPath() == null ? null : state.time());
            entity.setCreateTime(now);
            entity.setUpdateTime(now);
            pointStatusMapper.insert(entity);
        }
    }

    private VideoPointStatusEntity newEntity(VideoPoint point, LocalDateTime now) {
        VideoPointStatusEntity entity = fillInfo(point.getCode().trim(), point, now);
        entity.setCreateTime(now);
        entity.setUpdateTime(now);
        return entity;
    }

    /** 用 WEIHE 台账数据填充基础信息（不动在线状态字段） */
    private VideoPointStatusEntity fillInfo(String pointCode, VideoPoint point, LocalDateTime now) {
        VideoPointStatusEntity entity = new VideoPointStatusEntity();
        entity.setPointCode(pointCode);
        entity.setPointName(defaultName(point.getName(), pointCode));
        entity.setSite(point.getSite());
        entity.setOrg(point.getOrg());
        entity.setManageUnit(point.getManageUnit());
        entity.setStakeNo(point.getStakeNo());
        entity.setRiver(point.getRiver());
        entity.setSetupBasis(point.getSetupBasis());
        entity.setAddress(point.getAddress());
        entity.setWaterTime(point.getWaterTime());
        entity.setWaterAmount(point.getWaterAmount());
        entity.setXAxis(point.getXAxis());
        entity.setYAxis(point.getYAxis());
        entity.setIsMain(Boolean.TRUE.equals(point.getMain()) ? 1 : 0);
        entity.setPlatformState(point.getState());
        entity.setSyncTime(now);
        entity.setUpdateTime(now);
        return entity;
    }

    private VideoPoint toPoint(VideoPointStatusEntity row) {
        VideoPoint point = new VideoPoint();
        point.setCode(row.getPointCode());
        point.setName(defaultName(row.getPointName(), row.getPointCode()));
        point.setSite(row.getSite());
        point.setState(row.getPlatformState());
        point.setXAxis(row.getXAxis());
        point.setYAxis(row.getYAxis());
        point.setOrg(row.getOrg());
        point.setManageUnit(row.getManageUnit());
        point.setStakeNo(row.getStakeNo());
        point.setRiver(row.getRiver());
        point.setSetupBasis(row.getSetupBasis());
        point.setAddress(row.getAddress());
        point.setWaterTime(row.getWaterTime());
        point.setWaterAmount(row.getWaterAmount());
        point.setMain(Objects.equals(row.getIsMain(), 1));
        return point;
    }

    private String defaultName(String name, String code) {
        return name == null || name.isBlank() ? code : name;
    }

    private String truncate(String value) {
        if (value == null) {
            return null;
        }
        return value.length() <= REASON_MAX_LENGTH
                ? value : value.substring(0, REASON_MAX_LENGTH);
    }

    private String key(String code) {
        return code == null ? "" : code.trim().toLowerCase(Locale.ROOT);
    }
}
