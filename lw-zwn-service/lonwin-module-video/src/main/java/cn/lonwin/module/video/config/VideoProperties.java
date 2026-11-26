package cn.lonwin.module.video.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 视频监控平台（spjk）对接配置。
 * <p>
 * 配置项前缀 {@code lonwin.spjk}，与截图源模块保持同名，便于直接复用已有配置。
 * 配置必须写在 lonwin-start 的 application.yml 中（依赖 jar 内的 application.yml 不会被加载）。
 */
@Data
@Component
@ConfigurationProperties(prefix = "lonwin.spjk")
public class VideoProperties {

    /** 平台基础地址 */
    private String baseUrl = "http://10.3.70.33:8060";

    /** 接入账号 */
    private String account = "zwnszy";

    /** 平台分配的 RSA 公钥（用于生成 sptoken） */
    private String publicKey;

    /** 截图保存目录（Windows） */
    private String savePath = "D:/workdir/zwn_pic";

    /** 截图保存目录（Linux） */
    private String linuxSavePath = "/home/java1/workdir/zwn_pic";

    /** 本机 IP（参与 sptoken 生成，留空则自动获取本机局域网 IP） */
    private String localIp;

    /** HTTP 连接超时（秒） */
    private int connectTimeoutSeconds = 15;

    /** HTTP 读取超时（秒） */
    private int readTimeoutSeconds = 30;

    /** 视频流拉流超时（秒） */
    private int grabTimeoutSeconds = 30;

    /**
     * javacpp（FFmpeg 本地库）解压缓存目录，留空使用默认的 {user.home}/.javacpp/cache。
     * <p>
     * Linux 部署时若运行用户对 home 目录无写权限、或 home / tmp 所在分区挂载了 noexec，
     * 本地库无法 dlopen，会报 {@code Could not initialize class org.bytedeco.ffmpeg.global.avutil}，
     * 此时把该目录指向一个可写、可执行的目录（如 /home/java1/workdir/javacpp-cache）即可。
     */
    private String nativeCacheDir;

    /** 本地 tr_Spd 表的监管单位过滤值 */
    private String manageDept = "dept_zwnjszyc";

    /** 是否开启定时截图任务 */
    private boolean captureEnabled = true;

    /** 定时截图首次执行延迟（毫秒，默认启动后 5 分钟） */
    private long captureInitialDelay = 300_000L;

    /** 定时截图执行间隔（毫秒，默认 1 小时） */
    private long captureFixedRate = 3_600_000L;

    /** 截图图片访问 URL 前缀（前端 /api 由 vite/nginx 代理去掉后落到后端 /video/snapshots/image） */
    private String imageUrlPrefix = "/api/video/snapshots/image?path=";

    /**
     * 截图存储方式：local=本地磁盘，minio=对象存储（MinIO / S3 兼容）。
     * <p>
     * minio 模式要求 {@code file.oss.enable=true}（复用 lonwin-common-oss 的 OssTemplate），
     * 否则自动降级为 local 并打告警日志，不影响定时任务运行。
     */
    private String snapshotStorage = "local";

    /** minio 桶名，留空跟随 file.bucketName */
    private String minioBucket;

    /** minio 中截图目录前缀 */
    private String minioSnapshotDir = "video/snapshots";

    /** minio 模式下是否同时在本地保留一份副本（排查 / 迁移用） */
    private boolean minioKeepLocal = false;

    // ==================== 异常图片智能识别（目标检测服务） ====================

    /** 是否在定时截图后调用目标检测服务做「异常抓拍」识别 */
    private boolean detectEnabled = true;

    /** 目标检测服务地址（YOLO 多模型检测服务） */
    private String detectBaseUrl = "http://10.3.34.192:8001";

    /**
     * 检测模型 ID 列表（对应服务端 /api/v1/models 返回的 model_id）。
     * <p>
     * 默认 lonwin-odm-100 为 COCO 通用目标检测（80 类，含人/车/动物/日常物品等）；
     * 留空则使用服务端默认模型。
     */
    private List<String> detectModelIds = new ArrayList<>(List.of("lonwin-odm-100"));

    /** 检测置信度阈值 */
    private double detectConfidenceThreshold = 0.5;

    /** 单张图片最多返回的检测目标数 */
    private int detectMaxDetections = 50;

    /** 只检测指定类别（留空表示检测所选模型的全部类别） */
    private List<String> detectTargetClasses = new ArrayList<>();

    /** 判定为「异常抓拍」的目标类别：命中任意一个即视为异常 */
    private List<String> detectAbnormalLabels =
            new ArrayList<>(List.of("person", "bicycle", "car", "truck", "boat"));

    /** 调用检测 / 标注接口的超时时间（秒） */
    private int detectTimeoutSeconds = 60;

    /** 是否调用 /api/v1/annotate 生成标注图并保存到截图相同位置 */
    private boolean detectAnnotate = true;

    /**
     * 识别为异常抓拍后，是否把标注图另存一条 VIDEO_SNAPSHOT 记录（group=abnormal）。
     * <p>
     * 原始定时抓拍保持 group=timed 不变，页面「定时拍摄」与「异常抓拍」因此各有一张图。
     */
    private boolean detectSaveAnnotatedSnapshot = true;

    /** 监管单位编码 → 页面展示名称，如 dept_zwnjszyc: 岳城局监管 */
    private Map<String, String> orgMapping = new LinkedHashMap<>();

    /** 重点点位编码（用于列表「详情」按钮高亮） */
    private List<String> mainPointCodes = new ArrayList<>();

    /** 当前是否为 Linux 系统 */
    public static final boolean LINUX = System.getProperty("os.name", "")
            .toLowerCase().contains("linux");

    /** 实际生效的截图保存目录 */
    public String getEffectiveSavePath() {
        return LINUX ? linuxSavePath : savePath;
    }

    /** 是否已切换为对象存储（仅看配置，是否真正可用由存储服务用 FileTemplate 判断） */
    public boolean isMinioStorage() {
        return "minio".equalsIgnoreCase(snapshotStorage == null ? "" : snapshotStorage.trim());
    }
}
