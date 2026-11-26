package cn.lonwin.module.video.service;

import cn.lonwin.module.video.config.VideoProperties;
import com.lonwin.common.file.core.FileProperties;
import com.lonwin.common.file.core.FileTemplate;
import com.lonwin.common.file.oss.service.OssTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 截图存储服务：按配置把图片写入本地磁盘或 MinIO（S3 兼容对象存储）。
 * <p>
 * 存储方式由 {@code lonwin.spjk.snapshot-storage} 控制：
 * <ul>
 *   <li>{@code local}：写入 {@code lonwin.spjk.save-path} 下的 {@code 日期/分组/点位/文件} 目录；</li>
 *   <li>{@code minio}：写入 {@code 桶/目录前缀/日期/分组/点位/文件}，复用 lonwin-common-oss 的
 *       {@link OssTemplate}（要求 {@code file.oss.enable=true}）。</li>
 * </ul>
 * 两种方式的 path 都直接用于页面「预览 / 下载」接口（{@code /video/snapshots/image?path=}）：
 * local 下是相对截图根目录的路径，minio 下是对象 key。
 * <p>
 * minio 模式但对象存储未启用时自动降级为本地磁盘并打告警，保证定时任务不中断。
 */
@Slf4j
@Service
public class VideoSnapshotStorageService {

    public static final String STORAGE_LOCAL = "local";
    public static final String STORAGE_MINIO = "minio";

    /** 手工上传图片的相对目录（不参与按日期分组的截图列表扫描） */
    private static final String UPLOAD_DIR = "upload";

    private static final Set<String> IMAGE_EXTS =
            Set.of(".jpg", ".jpeg", ".png", ".bmp", ".webp");

    private static final DateTimeFormatter DAY = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final VideoProperties props;

    private final ObjectProvider<FileProperties> filePropertiesProvider;

    private final ObjectProvider<FileTemplate> fileTemplateProvider;

    /** 只在首次发现「配置了 minio 但对象存储不可用」时告警，避免每张截图刷日志 */
    private final AtomicBoolean minioUnavailableWarned = new AtomicBoolean(false);

    public VideoSnapshotStorageService(VideoProperties props,
                                      ObjectProvider<FileProperties> filePropertiesProvider,
                                      ObjectProvider<FileTemplate> fileTemplateProvider) {
        this.props = props;
        this.filePropertiesProvider = filePropertiesProvider;
        this.fileTemplateProvider = fileTemplateProvider;
    }

    /** 一次保存的结果 */
    public record StoredSnapshot(String storageType, String path, String url,
                                 String fileName, long size) {
    }

    /**
     * 保存一帧截图。
     *
     * @param data     图片字节
     * @param day      日期目录 yyyy-MM-dd
     * @param group    分组目录 timed / abnormal / water
     * @param pointDir 点位目录
     * @param fileName 文件名
     */
    public StoredSnapshot store(byte[] data, String day, String group,
                                String pointDir, String fileName) {
        String safeGroup = group == null || group.isBlank() ? "timed" : group.trim();
        String relative = day + "/" + safeGroup + "/" + pointDir + "/" + fileName;
        if (useMinio()) {
            try {
                String objectKey = minioKey(relative);
                putObject(objectKey, data);
                if (props.isMinioKeepLocal()) {
                    writeLocal(relative, data);
                }
                return new StoredSnapshot(STORAGE_MINIO, objectKey, urlOf(objectKey),
                        fileName, data.length);
            } catch (Exception e) {
                log.error("截图写入对象存储失败，降级保存到本地：{} - {}", relative, e.getMessage());
            }
        }
        writeLocal(relative, data);
        return new StoredSnapshot(STORAGE_LOCAL, relative, urlOf(relative), fileName, data.length);
    }

    /**
     * 保存页面上传的图片（「保存到 MinIO」手工接口）。
     * <p>
     * 落库目录与定时截图独立（{@code upload/yyyy-MM-dd/uuid.jpg}），不影响抓拍列表。
     */
    public StoredSnapshot storeUpload(MultipartFile file, String storageOverride) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("上传文件为空");
        }
        String fileName = UUID.randomUUID().toString().replace("-", "") + extOf(file.getOriginalFilename());
        String day = LocalDate.now().format(DAY);
        String relative = UPLOAD_DIR + "/" + day + "/" + fileName;
        byte[] data = file.getBytes();
        boolean wantMinio = storageOverride == null || storageOverride.isBlank()
                ? useMinio()
                : STORAGE_MINIO.equalsIgnoreCase(storageOverride.trim());
        if (wantMinio) {
            if (!minioAvailable()) {
                throw new IllegalStateException(
                        "对象存储未启用（file.oss.enable=false），无法保存到 MinIO");
            }
            String objectKey = minioKey(relative);
            try {
                putObject(objectKey, data);
            } catch (Exception e) {
                throw new IllegalStateException("保存到 MinIO 失败：" + e.getMessage(), e);
            }
            if (props.isMinioKeepLocal()) {
                writeLocal(relative, data);
            }
            return new StoredSnapshot(STORAGE_MINIO, objectKey, urlOf(objectKey),
                    fileName, data.length);
        }
        writeLocal(relative, data);
        return new StoredSnapshot(STORAGE_LOCAL, relative, urlOf(relative), fileName, data.length);
    }

    /** 当前是否走对象存储 */
    public boolean useMinio() {
        if (!props.isMinioStorage()) {
            return false;
        }
        boolean available = minioAvailable();
        if (!available && minioUnavailableWarned.compareAndSet(false, true)) {
            log.warn("lonwin.spjk.snapshot-storage=minio 但未找到可用的对象存储客户端"
                    + "（需 file.oss.enable=true），截图将保存到本地磁盘");
        }
        return available;
    }

    /** 对象存储客户端是否可用（必须是真的 oss 实现，避免 file.local 的本地实现被误用） */
    public boolean minioAvailable() {
        FileTemplate template = fileTemplateProvider.getIfAvailable();
        return template instanceof OssTemplate;
    }

    /** 当前生效的存储类型：local / minio */
    public String currentStorage() {
        return useMinio() ? STORAGE_MINIO : STORAGE_LOCAL;
    }

    /** 图片访问 URL（页面 img src） */
    public String urlOf(String path) {
        if (path == null || path.isBlank()) {
            return "";
        }
        return props.getImageUrlPrefix() + URLEncoder.encode(path, StandardCharsets.UTF_8);
    }

    /**
     * 本地文件路径校验：拒绝越权路径与非图片文件。
     *
     * @return 存在的本地文件，不存在或非法时返回 null
     */
    public Path resolveLocal(String path) {
        if (path == null || path.isBlank() || path.contains("..") || path.startsWith("/")) {
            return null;
        }
        String lower = path.toLowerCase(Locale.ROOT);
        if (IMAGE_EXTS.stream().noneMatch(lower::endsWith)) {
            return null;
        }
        Path root = localRoot();
        Path target = root.resolve(path).normalize();
        if (!target.startsWith(root) || !Files.isRegularFile(target)) {
            return null;
        }
        return target;
    }

    /**
     * 打开图片流：本地文件优先，其次对象存储。
     *
     * @throws IOException 两种存储都取不到时抛出（由接口转 404）
     */
    public InputStream openStream(String path) throws IOException {
        Path local = resolveLocal(path);
        if (local != null) {
            return Files.newInputStream(local);
        }
        if (path != null && !path.isBlank() && minioAvailable()) {
            try {
                return fileTemplateProvider.getObject().getObject(bucket(), path).getObjectContent();
            } catch (Exception e) {
                throw new IOException("对象存储中不存在该图片：" + path, e);
            }
        }
        throw new IOException("图片不存在：" + (path == null ? "" : path));
    }

    /** 按扩展名给出 Content-Type（取不到时按 jpeg 处理） */
    public String contentType(String path) {
        String lower = path == null ? "" : path.toLowerCase(Locale.ROOT);
        if (lower.endsWith(".png")) {
            return "image/png";
        }
        if (lower.endsWith(".bmp")) {
            return "image/bmp";
        }
        if (lower.endsWith(".webp")) {
            return "image/webp";
        }
        return "image/jpeg";
    }

    /** 相对截图根目录的本地路径（minio 对象 key 无法映射时返回原值） */
    public String localRelative(Path file) {
        try {
            return localRoot().relativize(file.toAbsolutePath().normalize())
                    .toString().replace('\\', '/');
        } catch (Exception e) {
            return file.getFileName().toString();
        }
    }

    // ==================== 私有方法 ====================

    private Path localRoot() {
        return Paths.get(props.getEffectiveSavePath()).toAbsolutePath().normalize();
    }

    private void writeLocal(String relative, byte[] data) {
        Path root = localRoot();
        Path target = root.resolve(relative).normalize();
        if (!target.startsWith(root)) {
            throw new IllegalArgumentException("非法的截图保存路径：" + relative);
        }
        try {
            Path parent = target.getParent();
            if (parent != null) {
                Files.createDirectories(parent);
            }
            Files.write(target, data);
        } catch (IOException e) {
            throw new IllegalStateException("保存截图到本地失败：" + target + " - " + e.getMessage(), e);
        }
    }

    /** 对象 key：{目录前缀}/{相对路径} */
    private String minioKey(String relative) {
        String prefix = props.getMinioSnapshotDir() == null ? "" : props.getMinioSnapshotDir().trim();
        while (prefix.startsWith("/")) {
            prefix = prefix.substring(1);
        }
        while (prefix.endsWith("/")) {
            prefix = prefix.substring(0, prefix.length() - 1);
        }
        if (relative.startsWith("/")) {
            relative = relative.substring(1);
        }
        return prefix.isEmpty() ? relative : prefix + "/" + relative;
    }

    private String bucket() {
        String bucket = props.getMinioBucket();
        if (bucket == null || bucket.isBlank()) {
            FileProperties fileProperties = filePropertiesProvider.getIfAvailable();
            bucket = fileProperties == null ? null : fileProperties.getBucketName();
        }
        if (bucket == null || bucket.isBlank()) {
            throw new IllegalStateException(
                    "未配置对象存储桶：请设置 lonwin.spjk.minio-bucket 或 file.bucketName");
        }
        return bucket.trim();
    }

    private void putObject(String objectKey, byte[] data) throws Exception {
        fileTemplateProvider.getObject().putObject(bucket(), objectKey,
                new ByteArrayInputStream(data), contentType(objectKey));
    }

    private String extOf(String fileName) {
        if (fileName == null) {
            return ".jpg";
        }
        int dot = fileName.lastIndexOf('.');
        if (dot < 0) {
            return ".jpg";
        }
        String ext = fileName.substring(dot).toLowerCase(Locale.ROOT);
        return IMAGE_EXTS.contains(ext) ? ext : ".jpg";
    }
}
