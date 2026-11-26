package cn.lonwin.module.video.service;

import cn.lonwin.module.video.entity.VideoPointStatusEntity;
import cn.lonwin.module.video.model.dto.VideoPoint;
import cn.lonwin.module.video.model.vo.SnapshotVO;
import cn.lonwin.module.video.model.vo.VideoPlayVO;
import cn.lonwin.module.video.model.vo.VideoStationDetailVO;
import cn.lonwin.module.video.model.vo.VideoStationVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 页面聚合服务：把「视频点位状态主表 + 抓拍记录 + 平台播放接口」组装成视频监控页所需数据。
 * <p>
 * 点位信息与在线状态一律读主库 VIDEO_POINT_STATUS（由 WEIHE 台账同步而来），
 * WEIHE 数据源只读、页面不再直连。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VideoStationService {

    /** 单次查询抓拍的最大数量，避免单日记录过多拖慢页面 */
    private static final int SNAPSHOT_SCAN_LIMIT = 3000;

    private static final DateTimeFormatter DATE_TIME =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final SpjkVideoService spjkVideoService;

    private final VideoSnapshotService snapshotService;

    private final VideoPointStatusService pointStatusService;

    /**
     * 点位来源：主库状态表优先，主表不可用（未建表 / 无数据）时降级到平台接口；
     * 都失败时返回空列表（页面展示空态），不影响系统启动。
     */
    public List<VideoPoint> loadPoints() {
        return spjkVideoService.getPointListWithFallback();
    }

    /**
     * 监控点位列表（支持名称 / 监管单位 / 状态筛选，与页面筛选项一致）。
     */
    public List<VideoStationVO> listStations(String date, String keyword, String org, String status) {
        List<VideoPointStatusEntity> rows = loadRows();
        Map<String, List<SnapshotVO>> byCode = snapshots(date).stream()
                .collect(Collectors.groupingBy(s -> key(s.getCode())));

        List<VideoStationVO> result = new ArrayList<>();
        for (int i = 0; i < rows.size(); i++) {
            VideoPointStatusEntity row = rows.get(i);
            List<SnapshotVO> own = byCode.getOrDefault(key(row.getPointCode()), List.of());
            boolean capture = own.stream().anyMatch(
                    s -> VideoSnapshotService.GROUP_ABNORMAL.equals(s.getGroupCode()));
            boolean water = own.stream().anyMatch(
                    s -> VideoSnapshotService.GROUP_WATER.equals(s.getGroupCode()));
            String statusText = statusOf(row, !own.isEmpty());
            if (!matchFilter(keyword, org, status, row, statusText, capture, water)) {
                continue;
            }

            VideoStationVO vo = new VideoStationVO();
            vo.setId(i + 1);
            vo.setCode(row.getPointCode());
            vo.setName(nameOf(row));
            vo.setOrg(row.getOrg() == null || row.getOrg().isBlank() ? "—" : row.getOrg());
            vo.setStatus(statusText);
            vo.setStatusTime(timeText(row.getStateTime()));
            vo.setCapture(capture);
            vo.setWater(water);
            vo.setMain(Integer.valueOf(1).equals(row.getIsMain()));
            vo.setSite(row.getSite());
            vo.setState(row.getPlatformState());
            vo.setXAxis(row.getXAxis());
            vo.setYAxis(row.getYAxis());
            vo.setSnapshotCount(own.size());
            vo.setThumb(own.isEmpty() ? "" : own.get(0).getUrl());
            vo.setLatestCaptureTime(own.isEmpty() ? "" : own.get(0).getCaptureTime());
            result.add(vo);
        }
        return result;
    }

    /**
     * 点位基本信息（视频详情弹框左侧）。找不到点位时返回 null。
     */
    public VideoStationDetailVO getDetail(String code, String date) {
        VideoPointStatusEntity row = findRow(code);
        if (row == null) {
            return null;
        }
        List<SnapshotVO> own = snapshots(date).stream()
                .filter(s -> key(code).equals(key(s.getCode())))
                .collect(Collectors.toList());

        VideoStationDetailVO vo = new VideoStationDetailVO();
        vo.setCode(row.getPointCode());
        vo.setName(nameOf(row));
        vo.setOrg(row.getOrg());
        vo.setManageUnit(row.getManageUnit());
        vo.setStakeNo(row.getStakeNo());
        vo.setRiver(row.getRiver());
        vo.setSetupBasis(row.getSetupBasis());
        vo.setAddress(row.getAddress());
        vo.setWaterTime(row.getWaterTime());
        vo.setWaterAmount(row.getWaterAmount());
        vo.setSite(row.getSite());
        vo.setStatus(statusOf(row, !own.isEmpty()));
        vo.setStatusTime(timeText(row.getStateTime()));
        vo.setXAxis(row.getXAxis());
        vo.setYAxis(row.getYAxis());
        vo.setSnapshotCount(own.size());
        vo.setLatestCaptureTime(own.isEmpty() ? "" : own.get(0).getCaptureTime());
        vo.setLatestSnapshot(own.isEmpty() ? "" : own.get(0).getUrl());
        return vo;
    }

    /**
     * 视频播放信息：HLS 流地址 + 最新抓拍降级画面。
     */
    public VideoPlayVO getPlay(String code, String date) {
        VideoPointStatusEntity row = findRow(code);
        VideoPlayVO vo = new VideoPlayVO();
        vo.setCode(code);
        vo.setName(row == null ? code : nameOf(row));
        vo.setProtocol("hls");

        try {
            SnapshotVO latest = snapshotService.latest(date, code);
            vo.setSnapshotUrl(latest == null ? "" : latest.getUrl());
        } catch (Exception e) {
            log.warn("读取点位最新抓拍失败：{} - {}", code, e.getMessage());
            vo.setSnapshotUrl("");
        }

        try {
            SpjkVideoService.PlayInfo info = spjkVideoService.getPlayInfo(code);
            vo.setPlayUrl(info.playUrl());
            vo.setStreamUrl(info.streamUrl());
            vo.setOnline(true);
        } catch (Exception e) {
            log.warn("获取点位播放地址失败：{} - {}", code, e.getMessage());
            vo.setOnline(false);
            vo.setStreamUrl("");
            vo.setMessage(e.getMessage());
        }
        return vo;
    }

    /**
     * 监管单位下拉选项（不含「全部」，由前端补）。
     */
    public List<String> listOrgs() {
        Set<String> orgs = new LinkedHashSet<>();
        for (VideoPointStatusEntity row : loadRows()) {
            if (row.getOrg() != null && !row.getOrg().isBlank()) {
                orgs.add(row.getOrg());
            }
        }
        return new ArrayList<>(orgs);
    }

    /**
     * 按编码查找点位（手动截图等接口复用）。
     */
    public VideoPoint getPoint(String code) {
        VideoPointStatusEntity row = findRow(code);
        if (row == null) {
            return null;
        }
        VideoPoint point = new VideoPoint();
        point.setCode(row.getPointCode());
        point.setName(nameOf(row));
        point.setSite(row.getSite());
        point.setState(row.getPlatformState());
        point.setXAxis(row.getXAxis());
        point.setYAxis(row.getYAxis());
        point.setOrg(row.getOrg());
        point.setMain(Integer.valueOf(1).equals(row.getIsMain()));
        return point;
    }

    // ==================== 私有方法 ====================

    /**
     * 点位行：主库状态表优先；主表为空时降级到平台点位接口（不落库，仅供页面展示）。
     */
    private List<VideoPointStatusEntity> loadRows() {
        List<VideoPointStatusEntity> rows = pointStatusService.loadStatusList();
        if (!rows.isEmpty()) {
            return rows;
        }
        return spjkVideoService.getPointListWithFallback().stream()
                .map(this::toRow)
                .collect(Collectors.toList());
    }

    private VideoPointStatusEntity findRow(String code) {
        if (code == null || code.isBlank()) {
            return null;
        }
        String target = key(code);
        return loadRows().stream()
                .filter(row -> target.equals(key(row.getPointCode())))
                .findFirst()
                .orElse(null);
    }

    private VideoPointStatusEntity toRow(VideoPoint point) {
        VideoPointStatusEntity row = new VideoPointStatusEntity();
        row.setPointCode(point.getCode());
        row.setPointName(point.getName());
        row.setSite(point.getSite());
        row.setOrg(point.getOrg());
        row.setManageUnit(point.getManageUnit());
        row.setStakeNo(point.getStakeNo());
        row.setRiver(point.getRiver());
        row.setSetupBasis(point.getSetupBasis());
        row.setAddress(point.getAddress());
        row.setWaterTime(point.getWaterTime());
        row.setWaterAmount(point.getWaterAmount());
        row.setXAxis(point.getXAxis());
        row.setYAxis(point.getYAxis());
        row.setIsMain(Boolean.TRUE.equals(point.getMain()) ? 1 : 0);
        row.setPlatformState(point.getState());
        return row;
    }

    private List<SnapshotVO> snapshots(String date) {
        try {
            return snapshotService.list(date, null, null, SNAPSHOT_SCAN_LIMIT);
        } catch (Exception e) {
            log.warn("查询抓拍记录失败：{} - {}", date, e.getMessage());
            return List.of();
        }
    }

    /**
     * 在线状态文案：只以「能否截取到图片」为准，不再看台账/平台原始 STATE。
     * <p>
     * 判定顺序：
     * <ol>
     *   <li>最近一轮截图实测 ONLINE_STATE=1 → 在线；</li>
     *   <li>实测失败（或尚未实测）但查询日期内有抓拍图片 → 在线（当天确实截到过图，
     *       避免平台/网络抖动一轮就把有图的点位显示成离线）；</li>
     *   <li>其余（当天一次都没截到图）→ 离线。</li>
     * </ol>
     * 异常抓拍不再混进状态文案（否则「在线」筛选会漏掉这些点位），
     * 由 {@code capture} 标志 + 页面红点 / 「异常抓拍」筛选项表达。
     */
    private String statusOf(VideoPointStatusEntity row, boolean hasSnapshot) {
        boolean measuredOnline = row.getStateTime() != null
                && Integer.valueOf(1).equals(row.getOnlineState());
        return measuredOnline || hasSnapshot ? "在线" : "离线";
    }

    private boolean matchFilter(String keyword, String org, String status,
                                VideoPointStatusEntity row, String statusText,
                                boolean capture, boolean water) {
        String name = nameOf(row);
        if (keyword != null && !keyword.isBlank() && !name.contains(keyword.trim())) {
            return false;
        }
        if (org != null && !org.isBlank() && !"全部".equals(org)
                && !org.equals(row.getOrg())) {
            return false;
        }
        if (status == null || status.isBlank() || "全部".equals(status)) {
            return true;
        }
        if ("有取水".equals(status)) {
            return water;
        }
        if ("异常抓拍".equals(status)) {
            return capture;
        }
        return status.equals(statusText);
    }

    private String nameOf(VideoPointStatusEntity row) {
        return row.getPointName() == null || row.getPointName().isBlank()
                ? row.getPointCode() : row.getPointName();
    }

    private String timeText(LocalDateTime time) {
        return time == null ? "" : time.format(DATE_TIME);
    }

    private String key(String code) {
        return code == null ? "" : code.trim().toLowerCase(Locale.ROOT);
    }
}
