package cn.lonwin.module.knowledge.parser;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;

/**
 * 文档解析端口：把文件字节变成结构化元素，不触碰数据库、Qdrant 或 BGE-M3。
 *
 * <p>实现是有状态无关的纯对象，由 {@code KnowledgeIndexService} 按来源类型路由，
 * 便于单测直接用内存字节验证输出，也避免把 ES/Mongo 依赖带进本项目。
 */
public interface DocumentParser {

    /** WORD / PDF / EXCEL / OTHER */
    String sourceType();

    ParsedDocument parse(byte[] bytes, ParseContext context) throws Exception;

    /** 图片回调：parser 只负责把字节交出去，对象 key 由存储层决定 */
    @FunctionalInterface
    interface ImageSink {
        String save(int index, String extension, byte[] bytes);
    }

    /**
     * @param docId      逻辑文档 ID
     * @param fileName   原始文件名
     * @param groupId    去重组
     * @param objectKey  原文件在 MinIO 的 key（用于生成原文回看地址）
     * @param extension  小写扩展名
     * @param imageSink  图片落地回调，返回 MinIO 对象 key
     */
    record ParseContext(String docId, String fileName, String groupId, String objectKey,
                        String extension, ImageSink imageSink) { }

    /** 所有元素纯文本的 SHA-256，作为内容级去重的 textHash */
    static String textHash(List<ParsedDocument.Element> elements) {
        MessageDigest digest;
        try {
            digest = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("JVM 不支持 SHA-256", e);
        }
        for (ParsedDocument.Element element : elements) {
            if (element.text() != null) {
                digest.update(element.text().getBytes(java.nio.charset.StandardCharsets.UTF_8));
            }
            digest.update((byte) '\n');
        }
        return HexFormat.of().formatHex(digest.digest());
    }

    /** 归一化扩展名 */
    static String ext(String fileName) {
        if (fileName == null) {
            return "";
        }
        int dot = fileName.lastIndexOf('.');
        return dot < 0 ? "" : fileName.substring(dot + 1).toLowerCase(Locale.ROOT);
    }
}
