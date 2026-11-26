package cn.lonwin.module.video.service;

import cn.lonwin.module.video.config.VideoProperties;
import cn.lonwin.module.video.entity.VideoSnapshotEntity;
import cn.lonwin.module.video.mapper.VideoSnapshotMapper;
import cn.lonwin.module.video.model.dto.VideoPoint;
import cn.lonwin.module.video.model.vo.SnapshotVO;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * 抓拍图片服务：写抓拍记录、组装页面抓拍列表、输出图片 / 打包下载。
 * <p>
 * 数据来源以主库 VIDEO_SNAPSHOT 表为准（本地磁盘与 MinIO 共用），
 * 磁盘目录结构（仅 local 模式）：
 * {savePath}/{yyyy-MM-dd}/{timed|abnormal|water}/{编码_名称}/{编码_名称_时间戳}.jpg
 * <p>
 * 兼容改造前只落磁盘、没有入库的历史图片：表内查不到当天记录时回退扫描本地目录。
 */
@Slf4j
@Service
public class VideoSnapshotService {

    public static final String GROUP_TIMED = "timed";
    public static final String GROUP_ABNORMAL = "abnormal";
    public static final String GROUP_WATER = "water";

    private static final Set<String> GROUP_CODES =
            Set.of(GROUP_TIMED, GROUP_ABNORMAL, GROUP_WATER);

    private static final Set<String> IMAGE_EXTS =
            Set.of(".jpg", ".jpeg", ".png", ".bmp", ".webp");

    private static final DateTimeFormatter DATE_TIME =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final DateTimeFormatter TIME =
            DateTimeFormatter.ofPattern("HH:mm:ss");

    private final VideoProperties props;

    private final VideoSnapshotMapper snapshotMapper;

    private final VideoSnapshotStorageService storageService;

    public VideoSnapshotService(VideoProperties props,
                                VideoSnapshotMapper snapshotMapper,
                                VideoSnapshotStorageService storageService) {
        this.props = props;
        this.snapshotMapper = snapshotMapper;
        this.storageService = storageService;
    }

    /** 分组编码 → 页面分组名称 */
    public String groupName(String groupCode) {
        if (GROUP_ABNORMAL.equalsIgnoreCase(groupCode)) {
            return "异常抓拍";
        }
        if (GROUP_WATER.equalsIgnoreCase(groupCode)) {
            return "取水抓拍";
        }
        return "定时拍摄";
    }

    /**
     * 归一化分组参数：支持 all / 空 / 编码 / 中文名称，返回 null 表示不过滤。
     */
    public String normalizeGroup(String group) {
        if (group == null || group.isBlank()) {
            return null;
        }
        String value = group.trim();
        if ("all".equalsIgnoreCase(value) || "全部".equals(value)) {
            return null;
        }
        if (GROUP_CODES.contains(value.toLowerCase(Locale.ROOT))) {
            return value.toLowerCase(Locale.ROOT);
        }
        if ("定时拍摄".equals(value)) {
            return GROUP_TIMED;
        }
        if ("异常抓拍".equals(value)) {
            return GROUP_ABNORMAL;
        }
        if ("取水抓拍".equals(value)) {
            return GROUP_WATER;
        }
        return null;
    }

    /**
     * 查询抓拍列表。
     *
     * @param date  查询日期 yyyy-MM-dd，空则取当天
     * @param code  点位编码，空则全部
     * @param group 分组，空 / all 表示全部
     * @param limit 最多返回条数（<=0 不限制）
     */
    public List<SnapshotVO> list(String date, String code, String group, int limit) {
        LocalDate day = parseDate(date);
        String filterGroup = normalizeGroup(group);
        List<SnapshotVO> result = queryFromDb(day, code, filterGroup, limit);
        if (result.isEmpty()) {
            // 改造前的图片只存在磁盘上，回退扫描本地目录保证历史数据可见
            result = scanLocal(day, code, filterGroup);
        }
        result.sort(Comparator.comparing(SnapshotVO::getCaptureTime,
                Comparator.nullsFirst(Comparator.naturalOrder())).reversed());
        if (limit > 0 && result.size() > limit) {
            return new ArrayList<>(result.subList(0, limit));
        }
        return result;
    }

    /**
     * 某点位某天最新的一张抓拍（用于列表缩略图 / 视频降级画面）。
     */
    public SnapshotVO latest(String date, String code) {
        List<SnapshotVO> list = list(date, code, null, 1);
        return list.isEmpty() ? null : list.get(0);
    }

    /**
     * 写入一条抓拍记录（截图成功后调用）。落库失败只告警，不影响截图本身。
     *
     * @return 生成的抓拍记录 ID（异常图片识别要素表按此关联）；落库失败返回 null
     */
    public String record(VideoPoint point, String groupCode, String day,
                         VideoSnapshotStorageService.StoredSnapshot stored) {
        if (point == null) {
            return null;
        }
        return record(point.getCode(), point.getName(), groupCode, day, stored, LocalDateTime.now());
    }

    /**
     * 写入一条抓拍记录（指定抓拍时间），用于把识别后的标注图另存为「异常抓拍」记录。
     *
     * @return 生成的抓拍记录 ID；参数缺失或落库失败返回 null
     */
    public String record(String pointCode, String pointName, String groupCode, String day,
                         VideoSnapshotStorageService.StoredSnapshot stored,
                         LocalDateTime captureTime) {
        if (stored == null || pointCode == null || pointCode.isBlank()) {
            return null;
        }
        try {
            VideoSnapshotEntity entity = new VideoSnapshotEntity();
            entity.setId(UUID.randomUUID().toString().replace("-", ""));
            entity.setPointCode(pointCode);
            entity.setPointName(pointName);
            entity.setGroupCode(groupCode);
            entity.setCaptureDate(day);
            entity.setCaptureTime(captureTime == null ? LocalDateTime.now() : captureTime);
            entity.setStorageType(stored.storageType());
            entity.setFilePath(stored.path());
            entity.setFileUrl(stored.url());
            entity.setFileName(stored.fileName());
            entity.setFileSize(stored.size());
            entity.setCreateTime(LocalDateTime.now());
            snapshotMapper.insert(entity);
            return entity.getId();
        } catch (Exception e) {
            log.warn("抓拍记录落库失败：{}({}) - {}", pointName, pointCode, e.getMessage());
            return null;
        }
    }

    /**
     * 输出图片：本地文件优先，其次对象存储；两者都取不到时抛异常由接口转 404。
     */
    public void writeImage(String path, boolean attachment, HttpServletResponse response)
            throws IOException {
        Path local = storageService.resolveLocal(path);
        String fileName = fileNameOf(path);
        if (local != null) {
            String contentType = Files.probeContentType(local);
            response.setContentType(contentType == null || !contentType.startsWith("image/")
                    ? "image/jpeg" : contentType);
            response.setContentLengthLong(Files.size(local));
        } else {
            response.setContentType(storageService.contentType(path));
        }
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Content-Disposition",
                (attachment ? "attachment" : "inline") + "; filename*=UTF-8''" + encodeFileName(fileName));
        try (InputStream in = local != null ? Files.newInputStream(local) : storageService.openStream(path);
             OutputStream os = response.getOutputStream()) {
            in.transferTo(os);
            os.flush();
        }
    }

    /** 把勾选的多张截图打包为 zip 输出 */
    public void writeZip(List<String> paths, HttpServletResponse response) throws IOException {
        response.setContentType("application/zip");
        response.setHeader("Content-Disposition",
                "attachment; filename=\"video-snapshots-" + LocalDate.now() + ".zip\"");
        Set<String> names = new HashSet<>();
        try (ZipOutputStream zos = new ZipOutputStream(response.getOutputStream(),
                StandardCharsets.UTF_8)) {
            for (String path : paths) {
                if (path == null || path.isBlank() || !names.add(path)) {
                    continue;
                }
                InputStream in;
                try {
                    in = storageService.openStream(path);
                } catch (IOException e) {
                    log.warn("跳过不存在的截图：{} - {}", path, e.getMessage());
                    continue;
                }
                try (InputStream stream = in) {
                    zos.putNextEntry(new ZipEntry(path));
                    stream.transferTo(zos);
                    zos.closeEntry();
                }
            }
        }
    }

    /**
     * 按日期 / 点位 / 分组查询抓拍记录（直接读库，不触发磁盘扫描），供手动识别图片使用。
     *
     * @param date  查询日期 yyyy-MM-dd，空则取当天
     * @param code  点位编码，空则全部
     * @param group 分组，空 / all 表示全部
     * @param limit 最多返回条数（<=0 不限制）
     */
    public List<VideoSnapshotEntity> queryEntities(String date, String code, String group, int limit) {
        return queryEntities(parseDate(date), code, normalizeGroup(group), limit);
    }

    // ==================== 私有方法 ====================

    /** 读主库抓拍记录（按日期 + 可选点位/分组，时间倒序） */
    private List<VideoSnapshotEntity> queryEntities(LocalDate day, String code,
                                                    String groupFilter, int limit) {
        List<VideoSnapshotEntity> result = new ArrayList<>();
        try {
            QueryWrapper<VideoSnapshotEntity> wrapper = new QueryWrapper<>();
            wrapper.eq("CAPTURE_DATE", day.toString());
            if (code != null && !code.isBlank()) {
                wrapper.apply("UPPER(POINT_CODE) = {0}", code.trim().toUpperCase(Locale.ROOT));
            }
            if (groupFilter != null) {
                wrapper.eq("GROUP_CODE", groupFilter);
            }
            wrapper.orderByDesc("CAPTURE_TIME");
            List<VideoSnapshotEntity> rows = snapshotMapper.selectList(wrapper);
            if (rows == null) {
                return result;
            }
            // 单日记录量有限（点位 × 每小时一条），按日期索引查询后统一截断即可
            for (VideoSnapshotEntity row : rows) {
                if (limit > 0 && result.size() >= limit) {
                    break;
                }
                result.add(row);
            }
        } catch (Exception e) {
            log.warn("查询抓拍记录失败（请确认已执行 sql/video_monitor.sql）：{}", e.getMessage());
        }
        return result;
    }

    private List<SnapshotVO> queryFromDb(LocalDate day, String code, String groupFilter, int limit) {
        List<SnapshotVO> result = new ArrayList<>();
        for (VideoSnapshotEntity row : queryEntities(day, code, groupFilter, limit)) {
            result.add(toVO(row, day));
        }
        return result;
    }

    private SnapshotVO toVO(VideoSnapshotEntity row, LocalDate queryDay) {
        LocalDateTime time = row.getCaptureTime();
        String path = row.getFilePath();
        SnapshotVO vo = new SnapshotVO();
        vo.setId(row.getId());
        vo.setPath(path);
        vo.setUrl(row.getFileUrl() == null || row.getFileUrl().isBlank()
                ? storageService.urlOf(path) : row.getFileUrl());
        vo.setCode(row.getPointCode());
        vo.setName(row.getPointName());
        vo.setGroupCode(row.getGroupCode());
        vo.setGroupName(groupName(row.getGroupCode()));
        vo.setDate(row.getCaptureDate() == null ? queryDay.toString() : row.getCaptureDate());
        vo.setCaptureTime(time == null ? "" : time.format(DATE_TIME));
        vo.setDuration(time == null ? "" : time.format(TIME));
        vo.setFileName(row.getFileName());
        vo.setSize(row.getFileSize() == null ? 0L : row.getFileSize());
        return vo;
    }

    /** 兼容改造前只落磁盘的历史图片：扫描 {根目录}/{日期}/... */
    private List<SnapshotVO> scanLocal(LocalDate day, String code, String groupFilter) {
        Path dayDir = Paths.get(props.getEffectiveSavePath())
                .toAbsolutePath().normalize().resolve(day.toString());
        List<SnapshotVO> result = new ArrayList<>();
        if (!Files.isDirectory(dayDir)) {
            return result;
        }
        try (Stream<Path> children = Files.list(dayDir)) {
            List<Path> dirs = children.filter(Files::isDirectory).collect(Collectors.toList());
            for (Path child : dirs) {
                String name = child.getFileName().toString();
                if (GROUP_CODES.contains(name.toLowerCase(Locale.ROOT))) {
                    // 新结构：分组目录 → 点位目录
                    try (Stream<Path> subDirs = Files.list(child)) {
                        List<Path> pointDirs = subDirs.filter(Files::isDirectory)
                                .collect(Collectors.toList());
                        for (Path pointDir : pointDirs) {
                            collect(pointDir, name.toLowerCase(Locale.ROOT), day,
                                    code, groupFilter, result);
                        }
                    }
                } else {
                    // 旧结构：日期目录下直接是点位目录，统一按定时拍摄处理
                    collect(child, GROUP_TIMED, day, code, groupFilter, result);
                }
            }
        } catch (IOException e) {
            log.warn("读取截图目录失败：{} - {}", dayDir, e.getMessage());
        }
        return result;
    }

    private void collect(Path pointDir, String groupCode, LocalDate day, String codeFilter,
                         String groupFilter, List<SnapshotVO> out) {
        if (groupFilter != null && !groupFilter.equals(groupCode)) {
            return;
        }
        String dirName = pointDir.getFileName().toString();
        int underscore = dirName.indexOf('_');
        String pointCode = underscore > 0 ? dirName.substring(0, underscore) : dirName;
        String pointName = underscore > 0 ? dirName.substring(underscore + 1) : dirName;
        if (codeFilter != null && !codeFilter.isBlank()
                && !pointCode.equalsIgnoreCase(codeFilter.trim())) {
            return;
        }
        try (Stream<Path> files = Files.list(pointDir)) {
            List<Path> images = files.filter(Files::isRegularFile)
                    .filter(p -> isImage(p.getFileName().toString()))
                    .collect(Collectors.toList());
            for (Path image : images) {
                String fileName = image.getFileName().toString();
                LocalDateTime time = LocalDateTime.ofInstant(
                        Instant.ofEpochMilli(readTimestamp(image)), ZoneId.systemDefault());
                String relative = storageService.localRelative(image);
                SnapshotVO vo = new SnapshotVO();
                vo.setId(relative);
                vo.setPath(relative);
                vo.setUrl(storageService.urlOf(relative));
                vo.setCode(pointCode);
                vo.setName(pointName);
                vo.setGroupCode(groupCode);
                vo.setGroupName(groupName(groupCode));
                vo.setDate(day.toString());
                vo.setCaptureTime(time.format(DATE_TIME));
                vo.setDuration(time.format(TIME));
                vo.setFileName(fileName);
                try {
                    vo.setSize(Files.size(image));
                } catch (IOException ignored) {
                    vo.setSize(0L);
                }
                out.add(vo);
            }
        } catch (IOException e) {
            log.warn("读取点位截图目录失败：{} - {}", pointDir, e.getMessage());
        }
    }

    private boolean isImage(String fileName) {
        int dot = fileName.lastIndexOf('.');
        return dot >= 0 && IMAGE_EXTS.contains(fileName.substring(dot).toLowerCase(Locale.ROOT));
    }

    /** 文件名末尾的时间戳（毫秒），解析失败时退回文件修改时间 */
    private long readTimestamp(Path image) {
        String fileName = image.getFileName().toString();
        int dot = fileName.lastIndexOf('.');
        String base = dot > 0 ? fileName.substring(0, dot) : fileName;
        int lastUnderscore = base.lastIndexOf('_');
        if (lastUnderscore >= 0) {
            try {
                return Long.parseLong(base.substring(lastUnderscore + 1));
            } catch (NumberFormatException ignored) {
                // 落到文件修改时间
            }
        }
        try {
            return Files.getLastModifiedTime(image).toMillis();
        } catch (IOException e) {
            return System.currentTimeMillis();
        }
    }

    private LocalDate parseDate(String date) {
        if (date == null || date.isBlank()) {
            return LocalDate.now();
        }
        try {
            return LocalDate.parse(date.trim());
        } catch (Exception e) {
            throw new IllegalArgumentException("查询日期格式不正确，应为 yyyy-MM-dd：" + date);
        }
    }

    private String fileNameOf(String path) {
        if (path == null || path.isBlank()) {
            return "snapshot.jpg";
        }
        int slash = path.lastIndexOf('/');
        return slash >= 0 ? path.substring(slash + 1) : path;
    }

    private String encodeFileName(String fileName) {
        return URLEncoder.encode(fileName == null ? "snapshot.jpg" : fileName,
                StandardCharsets.UTF_8).replace("+", "%20");
    }
}
