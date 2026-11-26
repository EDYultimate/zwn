package cn.lonwin.module.video.service;

import cn.lonwin.module.video.config.VideoProperties;
import cn.lonwin.module.video.entity.VideoSnapshotDetectEntity;
import cn.lonwin.module.video.model.dto.CapturedSnapshot;
import cn.lonwin.module.video.model.dto.SnapshotResult;
import cn.lonwin.module.video.model.dto.VideoPoint;
import cn.lonwin.module.video.util.RsaTokenUtil;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import org.bytedeco.ffmpeg.global.avutil;
import org.bytedeco.javacpp.Loader;
import org.bytedeco.javacv.FFmpegFrameGrabber;
import org.bytedeco.javacv.Frame;
import org.bytedeco.javacv.Java2DFrameConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpTimeoutException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 视频监控平台（spjk）对接服务。
 * <p>
 * 复制自截图源模块 lonwin-module-water，并补充：
 * 1. 播放页地址与 HLS 流地址同时返回（PlayInfo），供页面直接播放视频；
 * 2. 截图按分组目录保存（timed / abnormal / water），供页面三类抓拍列表展示。
 * <p>
 * 整体流程：
 * 1. 获取视频点位（平台接口 getVideoList 或本地数据库 tr_Spd）；
 * 2. 按点位 CODE 调 getPreVideoUrl 拿到播放页地址，解析出 HLS(m3u8) 流地址；
 * 3. 用 JavaCV（FFmpeg）从视频流截取一帧，保存为 JPEG 图片。
 */
@Service
public class SpjkVideoService {

    private static final Logger log = LoggerFactory.getLogger(SpjkVideoService.class);

    /** 获取视频点位列表接口路径 */
    private static final String PATH_GET_VIDEO_LIST = "/spjk/spjk/spzy/getVideoList";

    /** 获取视频播放地址接口路径 */
    private static final String PATH_GET_PRE_VIDEO_URL = "/spjk/spjk/spzy/getPreVideoUrl";

    private static final Set<String> GROUPS = Set.of(
            VideoSnapshotService.GROUP_TIMED,
            VideoSnapshotService.GROUP_ABNORMAL,
            VideoSnapshotService.GROUP_WATER);

    /** 截图格式（captureFrame 统一输出 JPEG） */
    private static final String IMAGE_FORMAT_JPEG = "jpg";

    /** FFmpeg 本地库是否已成功加载 */
    private static volatile boolean ffmpegNativeLoaded = false;

    /** FFmpeg 本地库加载失败的根因（缓存，避免每个点位重复尝试并刷屏） */
    private static volatile String ffmpegNativeError;

    private final VideoProperties props;

    private final VideoSnapshotService snapshotService;

    private final VideoSnapshotStorageService storageService;

    private final VideoPointStatusService pointStatusService;

    private final VideoDetectService detectService;

    private final HttpClient httpClient;

    public SpjkVideoService(VideoProperties props,
                            VideoSnapshotService snapshotService,
                            VideoSnapshotStorageService storageService,
                            VideoPointStatusService pointStatusService,
                            VideoDetectService detectService) {
        this.props = props;
        this.snapshotService = snapshotService;
        this.storageService = storageService;
        this.pointStatusService = pointStatusService;
        this.detectService = detectService;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(props.getConnectTimeoutSeconds()))
                .build();
    }

    /** 播放页地址 + 真实 HLS 流地址 */
    public record PlayInfo(String playUrl, String streamUrl) {
    }

    /**
     * 从平台接口获取视频点位列表。
     */
    public List<VideoPoint> getVideoList() {
        JSONObject resp = postForm(PATH_GET_VIDEO_LIST, Collections.emptyMap());
        checkResponse(resp);

        JSONArray spdList = resp.getJSONArray("spdList");
        List<VideoPoint> points = new ArrayList<>();
        if (spdList == null) {
            return points;
        }
        for (int i = 0; i < spdList.size(); i++) {
            JSONObject item = spdList.getJSONObject(i);
            VideoPoint point = new VideoPoint();
            point.setCode(trim(item.getString("CODE")));
            point.setName(trim(item.getString("NAME")));
            point.setSite(trim(item.getString("SITE")));
            point.setState(trim(item.getString("STATE")));
            point.setXAxis(trim(item.getString("XAXIS")));
            point.setYAxis(trim(item.getString("YAXIS")));
            point.setOrg(point.getSite());
            point.setManageUnit(point.getSite());
            point.setMain(false);
            if (point.getCode() != null && !point.getCode().isBlank()) {
                points.add(point);
            }
        }
        return points;
    }

    /**
     * 从本地数据库（主库 VIDEO_POINT_STATUS，由 WEIHE 台账同步而来）查询视频点位列表。
     */
    public List<VideoPoint> getZwnPointList() {
        return pointStatusService.loadPoints();
    }

    /**
     * 获取平台播放页地址。
     */
    public String getPlayUrl(String spdCode) {
        Map<String, String> params = new LinkedHashMap<>();
        params.put("spdcode", spdCode);
        JSONObject resp = postForm(PATH_GET_PRE_VIDEO_URL, params);
        checkResponse(resp);

        JSONObject data = resp.getJSONObject("data");
        if (data == null) {
            throw new IllegalStateException("获取视频流地址失败：返回 data 为空，点位=" + spdCode);
        }
        String playUrl = data.getString("url");
        if (playUrl == null || playUrl.isBlank()) {
            throw new IllegalStateException("获取视频流地址失败：播放地址为空，点位=" + spdCode);
        }
        return playUrl;
    }

    /**
     * 获取播放页地址与真实的 HLS 流地址（页面播放视频使用）。
     */
    public PlayInfo getPlayInfo(String spdCode) {
        String playUrl = getPlayUrl(spdCode);
        return new PlayInfo(playUrl, extractStreamUrl(playUrl));
    }

    /**
     * 获取指定点位的 HLS 视频流地址。
     */
    public String getStreamUrl(String spdCode) {
        return getPlayInfo(spdCode).streamUrl();
    }

    /**
     * 从视频流中截取一帧，返回 JPEG 字节（由存储服务决定落本地磁盘还是 MinIO）。
     */
    public byte[] captureFrame(String streamUrl) throws Exception {
        // 先显式加载本地库：否则失败时只会抛出 NoClassDefFoundError（Could not initialize class），
        // 真正的根因（UnsatisfiedLinkError / 架构不匹配 / 无解压权限等）会被掩盖
        ensureFfmpegLoaded();

        FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(streamUrl);
        // 拉流超时（微秒），避免网络不通时长时间阻塞
        grabber.setOption("rw_timeout", String.valueOf(props.getGrabTimeoutSeconds() * 1_000_000L));
        // 只输出 FFmpeg 错误级别日志
        avutil.av_log_set_level(avutil.AV_LOG_ERROR);
        try {
            grabber.start();
            Frame frame = null;
            for (int i = 0; i < 30 && frame == null; i++) {
                frame = grabber.grabImage();
            }
            if (frame == null || frame.image == null) {
                throw new IllegalStateException("视频流中未获取到有效帧：" + streamUrl);
            }
            try (Java2DFrameConverter converter = new Java2DFrameConverter();
                 ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                BufferedImage image = converter.convert(frame);
                ImageIO.write(image, "jpg", out);
                return out.toByteArray();
            }
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("avformat_open_input")) {
                throw new IllegalStateException(translateGrabError(e.getMessage(), streamUrl), e);
            }
            throw e;
        } finally {
            try {
                grabber.stop();
                grabber.release();
            } catch (Exception e) {
                log.warn("关闭视频流抓取器异常：{}", e.getMessage());
            }
        }
    }

    /** 遍历平台点位截图（定时拍摄） */
    public SnapshotResult captureAll() {
        return capturePoints(getVideoList(), VideoSnapshotService.GROUP_TIMED);
    }

    /**
     * 定时截图使用的点位来源：主库 VIDEO_POINT_STATUS 优先，
     * 主表不可用（未建表 / 无数据）时降级到平台接口。
     */
    public List<VideoPoint> getPointListWithFallback() {
        try {
            List<VideoPoint> points = getZwnPointList();
            if (points != null && !points.isEmpty()) {
                return points;
            }
        } catch (Exception e) {
            log.warn("读取视频点位主表失败，改用平台接口：{}", e.getMessage());
        }
        try {
            return getVideoList();
        } catch (Exception e) {
            log.warn("读取平台视频点位列表失败：{}", e.getMessage());
            return Collections.emptyList();
        }
    }

    /** 遍历本地数据库点位截图（定时拍摄） */
    public SnapshotResult captureZwnAll() {
        return capturePoints(getPointListWithFallback(), VideoSnapshotService.GROUP_TIMED);
    }

    /** 遍历平台点位截图（指定分组） */
    public SnapshotResult captureAll(String group) {
        return capturePoints(getVideoList(), group);
    }

    /** 遍历本地数据库点位截图（指定分组） */
    public SnapshotResult captureZwnAll(String group) {
        return capturePoints(getPointListWithFallback(), group);
    }

    /**
     * 对指定点位集合执行截图。
     * <p>
     * 一轮截图结束（含异常）后统一把实测在线状态与最新抓拍写回主库 VIDEO_POINT_STATUS，
     * WEIHE 台账只读，不做任何修改；状态刷库完成后再对截取的图片做「异常抓拍」识别，
     * 避免识别耗时拖慢点位状态刷新。
     */
    public SnapshotResult capturePoints(List<VideoPoint> points, String group) {
        SnapshotResult result = new SnapshotResult();
        result.setTotal(points == null ? 0 : points.size());
        if (points == null) {
            return result;
        }
        List<CapturedSnapshot> captured = new ArrayList<>();
        try {
            for (VideoPoint point : points) {
                Captured one = capturePoint(point, group);
                result.getItems().add(one.item());
                if (one.snapshot() != null) {
                    captured.add(one.snapshot());
                }
                if (one.item().isOk()) {
                    result.setSuccess(result.getSuccess() + 1);
                } else {
                    result.setFail(result.getFail() + 1);
                }
            }
        } finally {
            pointStatusService.flush();
        }
        analyzeCaptured(captured);
        return result;
    }

    /**
     * 单点位截图。
     * <p>
     * 保存位置由 {@code lonwin.spjk.snapshot-storage} 决定：
     * local → {根目录}/{yyyy-MM-dd}/{分组}/{编码_名称}/{编码_名称_时间戳}.jpg
     * minio → {桶}/{目录前缀}/{同上相对路径}
     */
    public SnapshotResult.Item captureOne(VideoPoint point, String group) {
        return capturePoint(point, group).item();
    }

    /** 单点位截图结果：返回项 + 供后续异常识别的原图（失败时 snapshot 为 null） */
    private record Captured(SnapshotResult.Item item, CapturedSnapshot snapshot) {
    }

    /** 单点位截图实现：截帧 → 存储 → 落库，并把原图与路径信息回传给异常识别 */
    private Captured capturePoint(VideoPoint point, String group) {
        String safeGroup = normalizeGroup(group);
        try {
            String streamUrl = getStreamUrl(point.getCode());
            byte[] image = captureFrame(streamUrl);
            String day = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            String pointDir = buildPointDirName(point);
            String fileName = buildFileName(point);
            VideoSnapshotStorageService.StoredSnapshot stored = storageService.store(
                    image, day, safeGroup, pointDir, fileName);
            // 能截到帧说明摄像头在线：状态与最新抓拍一起落主库
            pointStatusService.markOnline(point.getCode(), point.getName(), stored);
            String snapshotId = snapshotService.record(point, safeGroup, day, stored);
            log.info("视频截图成功：{}({}) -> {}[{}]", point.getName(), point.getCode(),
                    stored.path(), stored.storageType());
            SnapshotResult.Item item = new SnapshotResult.Item(
                    point.getCode(), point.getName(), true, stored.path(), null);
            item.setPath(stored.path());
            CapturedSnapshot snapshot = new CapturedSnapshot(point.getCode(), point.getName(),
                    image, IMAGE_FORMAT_JPEG, snapshotId, day, safeGroup, pointDir, fileName,
                    LocalDateTime.now());
            return new Captured(item, snapshot);
        } catch (Throwable e) {
            // FFmpeg 本地库加载失败属于 Error（NoClassDefFoundError 不是 Exception），
            // 单点位失败不能中断整轮截图，这里统一兜住
            pointStatusService.markOffline(point.getCode(), point.getName(), e.getMessage());
            log.error("视频截图失败：{}({}) - {}", point.getName(), point.getCode(), e.getMessage());
            return new Captured(new SnapshotResult.Item(
                    point.getCode(), point.getName(), false, null, e.getMessage()), null);
        }
    }

    /**
     * 对截图成功的图片做异常识别：命中 person / bicycle / car / truck / boat 等类别即视为
     * 「异常抓拍」，识别详情写入 VIDEO_SNAPSHOT_DETECT，并可把抓拍记录改为 abnormal 分组。
     */
    private void analyzeCaptured(List<CapturedSnapshot> captured) {
        if (!props.isDetectEnabled() || captured == null || captured.isEmpty()) {
            return;
        }
        long start = System.currentTimeMillis();
        int abnormal = 0;
        for (CapturedSnapshot snapshot : captured) {
            try {
                VideoDetectService.DetectOutcome outcome = detectService.analyze(snapshot);
                if (outcome == null || !Integer.valueOf(1).equals(outcome.record().getIsAbnormal())) {
                    continue;
                }
                abnormal++;
                VideoSnapshotDetectEntity detect = outcome.record();
                log.info("识别到异常抓拍：{}({}) 命中类别={}，目标总数={}，标注图={}",
                        snapshot.pointName(), snapshot.pointCode(), detect.getAbnormalLabels(),
                        detect.getTotalCount(), detect.getAnnotatedPath());
                saveAnnotatedSnapshot(snapshot, outcome);
            } catch (Throwable e) {
                // 识别失败不能影响截图结果，逐张兜住
                log.warn("异常图片识别异常：{}({}) - {}",
                        snapshot.pointName(), snapshot.pointCode(), e.getMessage());
            }
        }
        log.info("异常图片识别完成：识别图片={}，异常抓拍={}，耗时={}秒",
                captured.size(), abnormal, (System.currentTimeMillis() - start) / 1000);
    }

    /**
     * 标注图另存为一条「异常抓拍」抓拍记录：原定时抓拍记录保持 group=timed，
     * 页面上同一时刻既有定时拍摄（原图）又有异常抓拍（带检测框的标注图）。
     */
    private void saveAnnotatedSnapshot(CapturedSnapshot snapshot,
                                       VideoDetectService.DetectOutcome outcome) {
        if (!props.isDetectSaveAnnotatedSnapshot() || outcome.annotated() == null) {
            return;
        }
        String id = snapshotService.record(snapshot.pointCode(), snapshot.pointName(),
                VideoSnapshotService.GROUP_ABNORMAL, snapshot.day(), outcome.annotated(),
                snapshot.captureTime());
        if (id == null) {
            log.warn("异常抓拍标注图落库失败：{}({}) - {}",
                    snapshot.pointName(), snapshot.pointCode(), outcome.annotated().path());
        }
    }

    // ==================== 私有方法 ====================

    /**
     * 显式加载 FFmpeg 本地库（avutil），失败时抛出带根因的异常。
     * <p>
     * Linux 部署常见的真实原因：CPU 架构与 jar 内本地库不匹配（如 aarch64）、
     * 系统为 musl（Alpine）、javacpp 解压目录不可写或挂载了 noexec、SELinux 限制等。
     * 这些都会让 avutil 静态初始化失败，之后统一表现为
     * {@code NoClassDefFoundError: Could not initialize class org.bytedeco.ffmpeg.global.avutil}。
     */
    private void ensureFfmpegLoaded() {
        if (ffmpegNativeLoaded) {
            return;
        }
        synchronized (SpjkVideoService.class) {
            if (ffmpegNativeLoaded) {
                return;
            }
            if (ffmpegNativeError != null) {
                throw new IllegalStateException(ffmpegNativeError);
            }
            String cacheDir = props.getNativeCacheDir();
            if (cacheDir != null && !cacheDir.isBlank()) {
                // javacpp 先把 *.so 解压到该目录再 dlopen：目录必须可写、且不能挂载 noexec
                System.setProperty("org.bytedeco.javacpp.cachedir", cacheDir.trim());
            }
            try {
                Loader.load(avutil.class);
                ffmpegNativeLoaded = true;
                log.info("FFmpeg 本地库加载成功：{}", nativeEnv());
            } catch (Throwable t) {
                Throwable root = rootCause(t);
                ffmpegNativeError = "FFmpeg 本地库加载失败：" + root + "；" + nativeEnv();
                log.error("FFmpeg 本地库加载失败，视频截图不可用。{}", nativeEnv(), t);
                throw new IllegalStateException(ffmpegNativeError, t);
            }
        }
    }

    /** 取最底层异常（异常链根因） */
    private static Throwable rootCause(Throwable t) {
        Throwable root = t;
        while (root.getCause() != null && root.getCause() != root) {
            root = root.getCause();
        }
        return root;
    }

    /** 打印排查本地库加载问题所需的运行环境信息 */
    private static String nativeEnv() {
        String platform;
        try {
            platform = Loader.getPlatform();
        } catch (Throwable t) {
            platform = "未知";
        }
        String cacheDir = System.getProperty("org.bytedeco.javacpp.cachedir");
        if (cacheDir == null || cacheDir.isBlank()) {
            cacheDir = System.getProperty("user.home", "?") + "/.javacpp/cache(默认)";
        }
        return "平台=" + platform
                + ", 架构=" + System.getProperty("os.arch")
                + ", 系统=" + System.getProperty("os.name")
                + ", JVM=" + System.getProperty("java.version")
                + ", 本地库缓存目录=" + cacheDir
                + ", 临时目录=" + System.getProperty("java.io.tmpdir");
    }

    /** 平台接口请求（表单方式），自动携带 sptoken 与 ACCOUNT */
    private JSONObject postForm(String path, Map<String, String> extra) {
        Map<String, String> params = new LinkedHashMap<>();
        params.put("sptoken", generateToken());
        params.put("ACCOUNT", props.getAccount());
        if (extra != null) {
            params.putAll(extra);
        }

        String body = params.entrySet().stream()
                .map(e -> urlEncode(e.getKey()) + "=" + urlEncode(e.getValue()))
                .collect(Collectors.joining("&"));

        HttpRequest request = HttpRequest.newBuilder(URI.create(props.getBaseUrl() + path))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .timeout(Duration.ofSeconds(props.getReadTimeoutSeconds()))
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request,
                    HttpResponse.BodyHandlers.ofString());
            log.debug("平台接口响应：{} -> {}", path, response.body());
            return JSON.parseObject(response.body());
        } catch (HttpTimeoutException e) {
            throw new IllegalStateException("平台接口请求超时：" + path, e);
        } catch (Exception e) {
            throw new IllegalStateException("平台接口请求失败：" + path + " - " + e.getMessage(), e);
        }
    }

    /** 校验平台响应码（code=0 表示成功） */
    private void checkResponse(JSONObject resp) {
        Integer code = resp.getInteger("code");
        if (code == null || code != 0) {
            throw new IllegalStateException("平台接口返回失败：code=" + code
                    + ", msg=" + resp.getString("msg"));
        }
    }

    /** 生成 sptoken（公钥加密 本机IP&&当前时间） */
    private String generateToken() {
        return RsaTokenUtil.getToken(resolveLocalIp(), props.getPublicKey());
    }

    /** 解析本机 IP（优先使用配置值） */
    private String resolveLocalIp() {
        if (props.getLocalIp() != null && !props.getLocalIp().isBlank()) {
            return props.getLocalIp().trim();
        }
        try {
            java.net.DatagramSocket socket = new java.net.DatagramSocket();
            try {
                socket.connect(InetAddress.getByName("10.255.255.255"), 1);
                return socket.getLocalAddress().getHostAddress();
            } finally {
                socket.close();
            }
        } catch (Exception e) {
            try {
                Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();
                while (interfaces.hasMoreElements()) {
                    NetworkInterface ni = interfaces.nextElement();
                    Enumeration<InetAddress> addresses = ni.getInetAddresses();
                    while (addresses.hasMoreElements()) {
                        InetAddress addr = addresses.nextElement();
                        if (!addr.isLoopbackAddress() && addr.getHostAddress().indexOf(':') < 0) {
                            return addr.getHostAddress();
                        }
                    }
                }
            } catch (Exception ignored) {
            }
            return "127.0.0.1";
        }
    }

    /** 从播放页地址中解析 spurl 参数（Base64 编码的流地址） */
    private String extractStreamUrl(String playUrl) {
        if (playUrl == null || playUrl.isBlank()) {
            throw new IllegalStateException("播放地址为空");
        }
        URI uri = URI.create(playUrl);
        String query = uri.getQuery();
        if (query != null) {
            for (String pair : query.split("&")) {
                int idx = pair.indexOf('=');
                if (idx > 0 && "spurl".equals(pair.substring(0, idx))) {
                    String base64 = pair.substring(idx + 1);
                    String normalized = base64.replace('-', '+').replace('_', '/');
                    byte[] decoded = Base64.getDecoder().decode(
                            normalized + "=".repeat((4 - normalized.length() % 4) % 4));
                    return new String(decoded, StandardCharsets.UTF_8);
                }
            }
        }
        // 平台若直接返回流地址，则原样使用
        if (playUrl.contains(".m3u8") || playUrl.contains(".flv") || playUrl.contains(".mp4")) {
            return playUrl;
        }
        throw new IllegalStateException("播放地址中未找到 spurl 参数：" + playUrl);
    }

    /** 归一化分组编码：非法值一律按定时拍摄处理 */
    private String normalizeGroup(String group) {
        String safeGroup = group == null ? VideoSnapshotService.GROUP_TIMED
                : group.trim().toLowerCase(Locale.ROOT);
        return GROUPS.contains(safeGroup) ? safeGroup : VideoSnapshotService.GROUP_TIMED;
    }

    /** 构建点位目录名：{点位编码}_{点位名称} */
    private String buildPointDirName(VideoPoint point) {
        return point.getCode() + "_" + sanitize(point.getName());
    }

    /** 构建截图文件名：{点位编码}_{点位名称}_{时间戳}.jpg */
    private String buildFileName(VideoPoint point) {
        return point.getCode() + "_" + sanitize(point.getName())
                + "_" + System.currentTimeMillis() + ".jpg";
    }

    /** 清理名称中的下划线及文件名非法字符，保证 "_" 只作为字段分隔符 */
    private String sanitize(String name) {
        String value = name == null ? "" : name.trim();
        return value.replaceAll("[\\\\/:*?\"<>|\\s_]", "-");
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }

    private String extractHostPort(String streamUrl) {
        try {
            URI uri = URI.create(streamUrl);
            return uri.getHost() + ":" + uri.getPort();
        } catch (Exception e) {
            return streamUrl;
        }
    }

    /** 把 FFmpeg 的打开流错误翻译成可读的排查提示 */
    private String translateGrabError(String message, String streamUrl) {
        java.util.regex.Matcher matcher = java.util.regex.Pattern
                .compile("error (-?\\d+)").matcher(message);
        if (matcher.find()) {
            int code = Integer.parseInt(matcher.group(1));
            String tag = asAsciiTag(code);
            if (tag.contains("404")) {
                return "视频流不存在（HTTP 404）：平台未推流或摄像头离线，请确认点位【"
                        + extractHostPort(streamUrl) + "】的在线状态。原始错误：" + message;
            }
            if (code == -138) {
                return "无法连接视频流服务器（" + extractHostPort(streamUrl)
                        + "），请检查本机到流服务器端口的网络/防火墙。原始错误：" + message;
            }
        }
        return "无法打开视频流：" + message;
    }

    private String asAsciiTag(int code) {
        StringBuilder sb = new StringBuilder(4);
        for (int i = 0; i < 4; i++) {
            int b = (code >>> (i * 8)) & 0xFF;
            sb.append(b >= 32 && b <= 126 ? (char) b : '?');
        }
        return sb.toString();
    }

    private String urlEncode(String value) {
        return URLEncoder.encode(value == null ? "" : value, StandardCharsets.UTF_8);
    }
}
