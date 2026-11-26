package cn.lonwin.module.knowledge.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.common.core.model.vo.PageResult;
import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.module.knowledge.config.KnowledgeProperties;
import cn.lonwin.module.knowledge.entity.KnowledgeFileEntity;
import cn.lonwin.module.knowledge.mapper.KnowledgeFileMapper;
import cn.lonwin.module.knowledge.service.KnowledgeDocTypeService;
import cn.lonwin.module.knowledge.service.KnowledgeFileRenameRequest;
import cn.lonwin.module.knowledge.service.KnowledgeFileService;
import cn.lonwin.module.knowledge.service.KnowledgeUploadService;
import cn.lonwin.module.knowledge.service.KnowledgeUploadVO;
import cn.lonwin.module.knowledge.storage.KnowledgeStorageKeys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 知识文件上传与管理入口。
 *
 * <p>与 knowledge-platform 的 {@code uploadOneDoc / uploadBatchFiles} 对应，
 * 但<b>不经过 ES 与 MongoDB</b>：文件直接进 MinIO，元数据进达梦两张表，
 * 随后立即触发解析与切片写入 Qdrant（见 {@code KnowledgeIndexService}）。
 *
 * <p>所有上传文件一律保存，不做「同名跳过」；前端可用返回的 {@code resourceUrl}
 * 直接通过 {@code /resourceShow/file?path=} 回看原文（对象 key 是多级路径，
 * 两段式的 {@code /docFiles/{fileDate}/{fileName}} 匹配不到，故用通用按路径查看端点）。
 *
 * <h3>端点总览</h3>
 * <pre>
 *   POST   /knowledge/files/upload        单文件上传（typeId 必填）
 *   POST   /knowledge/files/uploadBatch   批量上传（typeId 必填，逐文件返回结果）
 *   GET    /knowledge/files               文件列表（typeId / keyword / limit / unclassified 可选）
 *   GET    /knowledge/files/list          同上（兼容写法）
 *   GET    /knowledge/files/page          分页列表（pageNumber / pageSize，返回 records + total）
 *   GET    /knowledge/files/stats         文档数 / 文件数 / 已索引文件数 / 未归类文档数
 *   GET    /knowledge/files/{fileId}      单文件元数据（刷新解析状态用）
 *   PUT    /knowledge/files/{fileId}      重命名（只改展示名与文档标题）
 *   DELETE /knowledge/files/{fileId}      删除（MinIO 对象 + 达梦元数据 + 尽力清向量）
 *   DELETE /knowledge/files/unclassified  批量清理未归类历史数据（TYPE_ID 为空）
 *   GET    /knowledge/files/config        当前存储配置
 * </pre>
 */
@Slf4j
@RestController
@RequestMapping("/knowledge/files")
@RequiredArgsConstructor
public class KnowledgeUploadController {

    private final KnowledgeUploadService uploadService;
    private final KnowledgeFileService fileService;
    private final KnowledgeDocTypeService docTypeService;
    private final KnowledgeFileMapper fileMapper;
    private final KnowledgeProperties properties;

    /**
     * 单文件上传。
     *
     * <p>{@code typeId} 必填：文档必须挂在「文档类型」树的一个节点上，
     * 前端未选择类型时不允许上传。
     */
    @PostMapping("/upload")
    public Result<Map<String, Object>> upload(@RequestParam("file") MultipartFile file,
                                              @RequestParam(value = "bizDir", required = false) String bizDir,
                                              @RequestParam(value = "typeId", required = false) String typeId) {
        String docTypeId = requireType(typeId);
        return Result.success(uploadService.upload(file, bizDir, docTypeId).toMap());
    }

    /** 批量上传：逐个处理，单文件失败不影响其它文件；typeId 必填且整批相同 */
    @PostMapping("/uploadBatch")
    public Result<List<Map<String, Object>>> uploadBatch(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "bizDir", required = false) String bizDir,
            @RequestParam(value = "typeId", required = false) String typeId) {
        String docTypeId = requireType(typeId);
        List<Map<String, Object>> rows = uploadService.uploadBatch(files, bizDir, docTypeId).stream()
                .map(KnowledgeUploadVO::toMap).toList();
        return Result.success(rows);
    }

    /** 文档类型必填校验：为空给 400，不存在给 404，均带明确提示 */
    private String requireType(String typeId) {
        if (typeId == null || typeId.isBlank()) {
            throw new BusinessException(400, "请先选择文档类型（typeId 不能为空）");
        }
        docTypeService.require(typeId);
        return typeId.trim();
    }

    /**
     * 文件列表：知识库页面右侧列表的真实数据源。
     *
     * <p>{@code typeId} 为空表示全部类型；{@code keyword} 匹配文件名或文档标题；
     * {@code limit} 默认 200、最大 1000；{@code unclassified=true} 只查「未归类」历史数据
     * （TYPE_ID 为空，左侧树没有节点可挂）。按入库时间倒序，字段与上传返回体一致。
     */
    @GetMapping({"", "/list"})
    public Result<List<Map<String, Object>>> list(
            @RequestParam(required = false) String typeId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false, defaultValue = "false") boolean unclassified) {
        return Result.success(fileService.list(typeId, keyword, limit, unclassified));
    }

    /**
     * 文件列表（分页）：知识库页面右侧表格的分页数据源。
     *
     * <p>过滤条件与 {@link #list} 完全一致，额外支持 {@code pageNumber}（从 1 开始，默认 1）
     * 与 {@code pageSize}（默认 20，最大 200）；返回 {@code { records, total }}，
     * 前端分页器直接用 total 渲染总条数与页数。
     @GetMapping("/page")
     */
    public Result<PageResult<Map<String, Object>>> page(
            @RequestParam(required = false) String typeId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer pageNumber,
            @RequestParam(required = false) Integer pageSize,
            @RequestParam(required = false, defaultValue = "false") boolean unclassified) {
        return Result.success(fileService.page(typeId, keyword, pageNumber, pageSize, unclassified));
    }

    /** 知识库总量：文档数 / 文件数 / 已索引文件数 */
    @GetMapping("/stats")
    public Result<Map<String, Object>> stats() {
        return Result.success(fileService.stats());
    }

    /**
     * 重命名文件：只改展示名与文档标题，MinIO 对象 key 不变，原文链接继续可用。
     */
    @PutMapping("/{fileId}")
    public Result<Map<String, Object>> rename(@PathVariable String fileId,
                                             @RequestBody(required = false) KnowledgeFileRenameRequest request) {
        return Result.success(fileService.rename(fileId, request));
    }

    /**
     * 删除文件：达梦两表元数据 + MinIO 对象；文档下最后一个文件删除时连带清文档与向量点。
     */
    @DeleteMapping("/{fileId}")
    public Result<Map<String, Object>> delete(@PathVariable String fileId) {
        return Result.success(fileService.delete(fileId));
    }

    /**
     * 批量清理「未归类」历史数据（TYPE_ID 为空的文档 / 文件 / 对象 / 向量）。
     *
     * <p>逐文件尽力清理，个别失败只记 warning 不回滚其它文件；返回实际清理数量。
     */
    @DeleteMapping("/unclassified")
    public Result<Map<String, Object>> purgeUnclassified() {
        return Result.success(fileService.purgeUnclassified());
    }

    /** 查询单个物理文件的元数据（含 MinIO 对象 key 与去重决策） */
    @GetMapping("/{fileId}")
    public Result<Map<String, Object>> detail(@PathVariable String fileId) {
        KnowledgeFileEntity entity = fileMapper.selectById(fileId);
        if (entity == null) {
            return Result.fail("文件不存在：" + fileId);
        }
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("fileId", entity.getFileId());
        map.put("docId", entity.getDocId());
        map.put("groupId", entity.getGroupId());
        map.put("fileName", entity.getFileName());
        map.put("sourceType", entity.getSourceType());
        map.put("fileHash", entity.getFileHash());
        map.put("size", entity.getFileSize());
        map.put("bucket", entity.getBucket());
        map.put("objectKey", entity.getObjectKey());
        map.put("viewPath", KnowledgeStorageKeys.viewPath(entity.getObjectKey()));
        map.put("resourceUrl", KnowledgeStorageKeys.resourceUrl(entity.getObjectKey()));
        map.put("isDuplicate", entity.getIsDuplicate());
        map.put("dedupDecision", entity.getDedupDecision());
        map.put("parseStatus", entity.getParseStatus());
        map.put("indexed", entity.getIndexed());
        return Result.success(map);
    }

    /** 当前存储配置，便于运维确认桶与前缀是否符合预期 */
    @GetMapping("/config")
    public Result<Map<String, Object>> config() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("enabled", properties.getStorage().isEnabled());
        map.put("bucket", properties.getStorage().getBucket());
        map.put("sourcePrefix", properties.getStorage().getSourcePrefix());
        map.put("imagePrefix", properties.getStorage().getImagePrefix());
        map.put("maxBatchSize", properties.getStorage().getMaxBatchSize());
        map.put("mode", properties.getMode());
        map.put("allUploadsStoredInMinio", true);
        return Result.success(map);
    }
}
