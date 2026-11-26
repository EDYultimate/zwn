package cn.lonwin.module.knowledge.storage;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

/**
 * MinIO 对象 key 与去重组键的唯一定义处。
 *
 * <p><b>为什么前缀用 docFiles / imgFiles</b>：lonwin-framework-file 的
 * {@code ResourceViewController} 只放行 {@code file.view.allowed-prefixes}（当前为
 * docFiles / imgFiles）。新上传文件沿用这两个前缀，就能直接被
 * {@code /docFiles/**}、{@code /imgFiles/**}、{@code /resourceShow/file?path=} 打开，
 * Qdrant payload 的 {@code filePath} 与前端 {@code kbRefUrl()} 零改动。
 *
 * <p><b>同名不覆盖</b>：对象 key 里带 {@code fileId}，因此同名文件、
 * 甚至字节完全相同的文件，每次上传都生成独立对象，符合「所有上传文件都保存」的要求。
 */
public final class KnowledgeStorageKeys {

    /** 默认前缀，与 KnowledgeProperties.Storage 保持一致 */
    public static final String DEFAULT_SOURCE_PREFIX = "docFiles/knowledge";
    public static final String DEFAULT_IMAGE_PREFIX = "imgFiles/knowledge";

    private KnowledgeStorageKeys() {
    }

    /** 原文件：docFiles/knowledge/{docId}/source/{fileId}_{安全文件名} */
    public static String sourceKey(String sourcePrefix, String docId, String fileId, String fileName) {
        return prefix(sourcePrefix, DEFAULT_SOURCE_PREFIX) + "/" + docId + "/source/"
                + fileId + "_" + safeFileName(fileName);
    }

    /** 结构化解析产物：docFiles/knowledge/{docId}/parsed.json（阶段 2 写入） */
    public static String parsedKey(String sourcePrefix, String docId) {
        return prefix(sourcePrefix, DEFAULT_SOURCE_PREFIX) + "/" + docId + "/parsed.json";
    }

    /** PDF 分页纯文本，供 small-to-big 回取：docFiles/knowledge/{docId}/page/{n}.txt */
    public static String pageKey(String sourcePrefix, String docId, int pageNo) {
        return prefix(sourcePrefix, DEFAULT_SOURCE_PREFIX) + "/" + docId + "/page/" + pageNo + ".txt";
    }

    /** 抽出的图片：imgFiles/knowledge/{docId}/img/{n}.png（默认只占位，不生成 caption） */
    public static String imageKey(String imagePrefix, String docId, int index) {
        return prefix(imagePrefix, DEFAULT_IMAGE_PREFIX) + "/" + docId + "/img/" + index + ".png";
    }

    /** 裸路径形式，便于运维直接看对象位置：/docFiles/knowledge/{docId}/source/{file} */
    public static String viewPath(String objectKey) {
        if (objectKey == null || objectKey.isBlank()) {
            return "";
        }
        return objectKey.startsWith("/") ? objectKey : "/" + objectKey;
    }

    /**
     * 可直接给前端文档角标用的原文地址。
     *
     * <p>对象 key 是<b>多级</b>路径，而 {@code /docFiles/{fileDate}/{fileName:.+}}
     * 只匹配两段，多级路径会落空；因此走支持任意层级的
     * {@code /resourceShow/file?path=}（lonwin-framework-file 已实现，Vite 已配代理）。
     * 阶段 2 把 Qdrant payload 的 {@code filePath} 写成这个值，
     * 前端 {@code kbRefUrl()} / 青色知识角标即可零改动打开原文。
     */
    public static String resourceUrl(String objectKey) {
        String path = viewPath(objectKey);
        if (path.isEmpty()) {
            return "";
        }
        return "/resourceShow/file?path="
                + URLEncoder.encode(path, StandardCharsets.UTF_8).replace("+", "%20");
    }

    /**
     * 文件名安全化：去路径分隔符与控制字符，保留中文，长度截断。
     * 绝不因为「同名」而改写或拒绝——同名由 fileId 前缀区分。
     */
    public static String safeFileName(String fileName) {
        String name = fileName == null ? "" : fileName.trim();
        int slash = Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\'));
        if (slash >= 0) {
            name = name.substring(slash + 1);
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < name.length(); i++) {
            char c = name.charAt(i);
            if ("/\\:*?\"<>|".indexOf(c) < 0 && c >= 0x20 && c != 0x7f) {
                sb.append(c);
            }
        }
        String cleaned = sb.toString().trim();
        if (cleaned.isEmpty() || ".".equals(cleaned) || "..".equals(cleaned)) {
            return "file";
        }
        return cleaned.length() > 180 ? cleaned.substring(cleaned.length() - 180) : cleaned;
    }

    /** 小写扩展名，不含点；无扩展名返回空串 */
    public static String ext(String fileName) {
        String name = safeFileName(fileName);
        int dot = name.lastIndexOf('.');
        return dot < 0 || dot == name.length() - 1 ? "" : name.substring(dot + 1).toLowerCase(Locale.ROOT);
    }

    /** 按扩展名判定来源类型；阶段 2 据此路由 WordAnalyse / PDFBox / ExcleAnalyse */
    public static String sourceType(String fileName) {
        return switch (ext(fileName)) {
            case "doc", "docx" -> "WORD";
            case "pdf" -> "PDF";
            case "xls", "xlsx", "csv" -> "EXCEL";
            default -> "OTHER";
        };
    }

    /**
     * 去重组键 = 规范化文件名 + 业务目录。
     *
     * <p>只用于「内容级去重与检索折叠」的分组，<b>不参与对象 key</b>：
     * 即使算出同一个 groupId，文件照样各存各的 MinIO 对象。
     * 规范化去掉扩展名、转换/副本/版本号/日期等噪声后缀，
     * 使「防洪预案.docx」与「防洪预案.pdf」落到同一组。
     */
    public static String groupKey(String fileName, String bizDir) {
        String base = safeFileName(fileName);
        int dot = base.lastIndexOf('.');
        if (dot > 0) {
            base = base.substring(0, dot);
        }
        String normalized = base.toLowerCase(Locale.ROOT)
                .replaceAll("[_\\-\\s(（]?(转换|副本|最终版|final|copy|v\\d+|\\d{1,2})[)）]?$", "")
                .replaceAll("\\d{4}[-_]?\\d{1,2}[-_]?\\d{1,2}", "")
                .replaceAll("[\\s_\\-().（）\\[\\]【】]", "")
                .trim();
        if (normalized.isEmpty()) {
            normalized = base.isEmpty() ? "unnamed" : base.toLowerCase(Locale.ROOT);
        }
        String dir = bizDir == null ? "" : safeSegment(bizDir);
        return dir.isEmpty() ? normalized : dir + "|" + normalized;
    }

    /** 业务目录只允许字母数字中文与 - _，避免拼出带路径穿越的 groupId */
    private static String safeSegment(String raw) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < raw.length() && sb.length() < 64; i++) {
            char c = raw.charAt(i);
            if (Character.isLetterOrDigit(c) || c == '-' || c == '_') {
                sb.append(c);
            }
        }
        return sb.toString();
    }

    private static String prefix(String configured, String fallback) {
        if (configured == null || configured.isBlank()) {
            return fallback;
        }
        String value = configured.trim();
        while (value.endsWith("/")) {
            value = value.substring(0, value.length() - 1);
        }
        return value.startsWith("/") ? value.substring(1) : value;
    }
}
