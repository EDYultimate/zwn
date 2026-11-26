package cn.lonwin.module.knowledge.storage;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.model.S3Object;
import com.lonwin.common.file.core.FileProperties;
import com.lonwin.common.file.core.FileTemplate;

import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.module.knowledge.config.KnowledgeProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 上传文件 → MinIO 的唯一写入口。
 *
 * <p><b>硬性约定（用户明确要求）：所有上传文件都必须保存到 MinIO，
 * 不管文件名是否相同、内容 hash 是否相同、是否被判定为重复附件。</b>
 * 因此本类：
 * <ul>
 *   <li>不做任何「已存在则跳过」判断，每次调用都执行 {@code putObject}；</li>
 *   <li>对象 key 带 {@code fileId}，同名文件不会互相覆盖；</li>
 *   <li>fileHash 在上传过程中顺带算出，只用于给元数据表打
 *       {@code IS_DUPLICATE} 标记（影响是否切片入 Qdrant），不影响本次写入。</li>
 * </ul>
 *
 * <p>用 {@link DigestInputStream} 边传边算摘要，文件只读一遍，
 * 避免 100MB 级文件为了算 hash 先整体读进内存。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KnowledgeFileStore {

    private final FileTemplate fileTemplate;
    private final FileProperties fileProperties;
    private final KnowledgeProperties properties;

    /** 无条件把一次上传写入对象存储，返回对象定位信息 */
    public StoredObject store(MultipartFile file, String docId, String fileId) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(400, "上传文件为空");
        }
        String original = file.getOriginalFilename();
        String objectKey = KnowledgeStorageKeys.sourceKey(
                properties.getStorage().getSourcePrefix(), docId, fileId, original);
        String bucket = resolveBucket();
        String contentType = file.getContentType() == null
                ? "application/octet-stream" : file.getContentType();

        MessageDigest digest = sha256();
        try (InputStream raw = file.getInputStream();
             DigestInputStream in = new DigestInputStream(new BufferedInputStream(raw), digest)) {
            fileTemplate.putObject(bucket, objectKey, in, contentType);
        } catch (IOException e) {
            throw new BusinessException(500, "读取上传文件失败：" + e.getMessage());
        } catch (Exception e) {
            throw new BusinessException(500, "写入 MinIO 失败（bucket=" + bucket + "）：" + e.getMessage());
        }
        String hash = HexFormat.of().formatHex(digest.digest());
        log.info("[kb-upload] 已写入 MinIO bucket={} key={} size={} hash={}",
                bucket, objectKey, file.getSize(), hash);
        return new StoredObject(bucket, objectKey,
                KnowledgeStorageKeys.viewPath(objectKey), hash, file.getSize(), contentType);
    }

    /** 供阶段 2 复用：把解析产物 JSON / 分页文本 / 图片字节写进同一 docId 前缀 */
    public void putBytes(String relativeKey, byte[] bytes, String contentType) {
        String bucket = resolveBucket();
        try (InputStream in = new java.io.ByteArrayInputStream(bytes)) {
            fileTemplate.putObject(bucket, relativeKey, in, contentType);
        } catch (Exception e) {
            throw new BusinessException(500, "写入解析产物失败（" + relativeKey + "）：" + e.getMessage());
        }
    }

    /**
     * 删除一个对象（仅文档删除时调用）。
     *
     * <p>对象不存在按成功处理：删除流程要的是「删完之后没有这个对象」。
     * 失败抛 500，由调用方决定是否只告警，避免元数据与对象长期不一致。
     */
    public void removeObject(String objectKey) {
        if (objectKey == null || objectKey.isBlank()) {
            return;
        }
        String bucket = resolveBucket();
        try {
            fileTemplate.removeObject(bucket, objectKey);
        } catch (Exception e) {
            throw new BusinessException(500,
                    "删除 MinIO 对象失败（bucket=" + bucket + "，key=" + objectKey + "）：" + e.getMessage());
        }
    }

    /** 阶段 2 索引链路：按 objectKey 从 MinIO 读回原文件字节 */
    public byte[] loadBytes(String objectKey) {
        String bucket = resolveBucket();
        S3Object object = fileTemplate.getObject(bucket, objectKey);
        if (object == null) {
            throw new BusinessException(404, "MinIO 对象不存在：" + objectKey);
        }
        try (S3Object closeable = object; InputStream in = object.getObjectContent()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(500, "读取 MinIO 对象失败（" + objectKey + "）：" + e.getMessage());
        }
    }

    public String resolveBucket() {
        String configured = properties.getStorage().getBucket();
        return configured == null || configured.isBlank()
                ? fileProperties.getBucketName() : configured.trim();
    }

    private static MessageDigest sha256() {
        try {
            return MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("JVM 不支持 SHA-256", e);
        }
    }

    /** 一次上传的对象定位信息；viewPath 可直接给前端 /docFiles 链路使用 */
    public record StoredObject(String bucket, String objectKey, String viewPath,
                               String fileHash, long size, String contentType) { }
}
