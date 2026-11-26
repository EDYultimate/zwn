/*
 *    Copyright (c) 2018-2025, waterx All rights reserved.
 *
 *    Redistribution and use in source and binary forms, with or without
 *    modification, are permitted provided that the following conditions are met:
 */
package cn.lonwin.module.knowledge.controller;

import cn.lonwin.module.knowledge.config.ResourceViewProperties;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import com.lonwin.common.file.core.FileProperties;
import com.lonwin.common.file.core.FileTemplate;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

/**
 * 知识库原文查看 / 下载端点（归属 lonwin-module-knowledge）。
 *
 * <p>迁移自 knowledge-platform 的 {@code ResourceController}，差异如下：
 * <ul>
 *   <li>不再依赖 {@code MgFileService}/{@code KpMgFile}（那是另一个项目的 Mongo 业务表）；</li>
 *   <li>不再依赖 {@code FileTemplate.getObjectDef()}（本项目 common-oss 没有该方法），
 *       统一用 {@code getObject(bucket, key)}，并兼容对象 key 带/不带前导斜杠两种写法；</li>
 *   <li>同时暴露裸 {@code /docFiles/**} 与 {@code /resourceShow/docFiles/**}：
 *       前者让 Qdrant payload 里现存的 {@code filePath} 无需改写，后者保持旧系统链接可用；</li>
 *   <li>补上路径穿越校验、白名单前缀、S3 流正确关闭、中文文件名 RFC 5987 编码、
 *       inline/attachment 切换。</li>
 * </ul>
 *
 * <p>存储后端由 {@code file.oss.enable} / {@code file.local.enable} 决定，
 * 本类只依赖 {@link FileTemplate} 抽象，不感知具体是 MinIO 还是本地磁盘。
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "file.view", name = "enabled", havingValue = "true", matchIfMissing = true)
public class ResourceViewController {

    /** 单段路径允许的字符：排除路径分隔符、通配符、控制字符 */
    private static final String UNSAFE_SEGMENT_CHARS = "/\\:*?\"<>|";

    private final FileTemplate fileTemplate;
    private final FileProperties fileProperties;
    private final ResourceViewProperties viewProperties;

    /**
     * 查看文档原文。Qdrant 里存的 {@code /docFiles/{日期}/{文件}.DOCX} 直接可用。
     *
     * @param inline   强制在线预览（不下载）
     * @param download 强制下载，优先级高于扩展名默认策略
     */
    @GetMapping({ "/docFiles/{fileDate}/{fileName:.+}",
                  "/resourceShow/docFiles/{fileDate}/{fileName:.+}" })
    public void docFile(@PathVariable String fileDate,
                        @PathVariable String fileName,
                        @RequestParam(defaultValue = "false") boolean inline,
                        @RequestParam(defaultValue = "false") boolean download,
                        HttpServletResponse response) throws IOException {
        serve("docFiles", new String[] { fileDate, fileName }, inline, download, response);
    }

    /** 查看图片，默认 inline 预览 */
    @GetMapping({ "/imgFiles/{fileDate}/{fileName:.+}",
                  "/resourceShow/imgFiles/{fileDate}/{fileName:.+}" })
    public void imgFile(@PathVariable String fileDate,
                        @PathVariable String fileName,
                        @RequestParam(defaultValue = "false") boolean inline,
                        @RequestParam(defaultValue = "false") boolean download,
                        HttpServletResponse response) throws IOException {
        serve("imgFiles", new String[] { fileDate, fileName }, inline || !download, download, response);
    }

    /**
     * 通用按路径查看，支持多级目录，例如
     * {@code /resourceShow/file?path=/docFiles/2025-07-16/a.docx}。
     * 仅允许 {@code file.view.allowed-prefixes} 白名单内的对象。
     */
    @GetMapping("/resourceShow/file")
    public void fileByPath(@RequestParam String path,
                           @RequestParam(defaultValue = "false") boolean inline,
                           @RequestParam(defaultValue = "false") boolean download,
                           HttpServletResponse response) throws IOException {
        String raw = path == null ? "" : path.trim();
        String trimmed = raw.startsWith("/") ? raw.substring(1) : raw;
        String[] parts = trimmed.isEmpty() ? new String[0] : trimmed.split("/");
        if (parts.length < 3) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "path 至少包含 前缀/目录/文件名");
            return;
        }
        String prefix = parts[0];
        String[] rest = Arrays.copyOfRange(parts, 1, parts.length);
        serve(prefix, rest, inline, download, response);
    }

    /* ------------------------------ 内部实现 ------------------------------ */

    private void serve(String prefix, String[] segments, boolean inline, boolean download,
                       HttpServletResponse response) throws IOException {
        final String key;
        try {
            key = safeKey(prefix, viewProperties.getAllowedPrefixes(), segments);
        } catch (IllegalArgumentException e) {
            log.warn("非法文件路径: {} - {}", Arrays.toString(segments), e.getMessage());
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "非法文件路径");
            return;
        }

        String fileName = segments[segments.length - 1];
        String bucket = resolveBucket();
        S3Object object = openObject(bucket, key);
        if (object == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "文件不存在");
            return;
        }

        try (S3Object closeable = object) {
            ObjectMetadata metadata = object.getObjectMetadata();
            long length = metadata == null ? -1L : metadata.getContentLength();
            if (viewProperties.getMaxObjectBytes() > 0 && length > viewProperties.getMaxObjectBytes()) {
                response.sendError(HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE, "文件过大");
                return;
            }

            MediaType mediaType = MediaTypeFactory.getMediaType(fileName)
                    .orElse(MediaType.APPLICATION_OCTET_STREAM);
            response.setContentType(mediaType.toString());
            if (length >= 0) {
                response.setContentLengthLong(length);
            }

            boolean asInline = !download && (inline || isInlineByDefault(fileName));
            String disposition = asInline ? "inline" : "attachment";
            String encoded = URLEncoder.encode(fileName, StandardCharsets.UTF_8).replace("+", "%20");
            response.setHeader("Content-Disposition",
                    disposition + "; filename=\"" + encoded + "\"; filename*=UTF-8''" + encoded);
            response.setHeader("Cache-Control", "private, max-age=0, must-revalidate");
            response.setHeader("X-Content-Type-Options", "nosniff");

            try (InputStream in = object.getObjectContent()) {
                in.transferTo(response.getOutputStream());
                response.getOutputStream().flush();
            }
        } catch (Exception e) {
            // 响应可能已开始写出，此时不能再 sendError，只记录
            log.error("文件读取失败: bucket={} key={}", bucket, key, e);
            if (!response.isCommitted()) {
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "文件读取失败");
            }
        }
    }

    /**
     * 依次尝试两种对象 key。knowledge-platform 写入时带前导斜杠，
     * MinIO 里也可能存在不带的写法，谁命中用谁。
     */
    private S3Object openObject(String bucket, String key) {
        for (String candidate : keyCandidates(key, viewProperties.isTryLeadingSlashKey())) {
            try {
                S3Object object = fileTemplate.getObject(bucket, candidate);
                if (object != null) {
                    return object;
                }
            } catch (Exception e) {
                log.debug("对象未命中: bucket={} key={} ({})", bucket, candidate, e.getMessage());
            }
        }
        log.warn("未找到文件: bucket={} key={}", bucket, key);
        return null;
    }

    private String resolveBucket() {
        String bucket = viewProperties.getBucket();
        return (bucket == null || bucket.isBlank()) ? fileProperties.getBucketName() : bucket.trim();
    }

    private boolean isInlineByDefault(String fileName) {
        int dot = fileName.lastIndexOf('.');
        if (dot < 0 || dot == fileName.length() - 1) {
            return false;
        }
        String ext = fileName.substring(dot + 1).toLowerCase(Locale.ROOT);
        return viewProperties.getInlineExtensions().contains(ext);
    }

    /* ------------------------------ 可单测的纯逻辑 ------------------------------ */

    /**
     * 拼装并校验对象 key。返回不带前导斜杠的 key。
     *
     * @throws IllegalArgumentException 前缀不在白名单，或任一段包含路径穿越/非法字符
     */
    static String safeKey(String prefix, List<String> allowedPrefixes, String... segments) {
        if (prefix == null || !allowedPrefixes.contains(prefix)) {
            throw new IllegalArgumentException("前缀不在白名单: " + prefix);
        }
        if (segments == null || segments.length == 0) {
            throw new IllegalArgumentException("缺少路径段");
        }
        List<String> parts = new ArrayList<>();
        parts.add(prefix);
        for (String segment : segments) {
            parts.add(checkSegment(segment));
        }
        return String.join("/", parts);
    }

    private static String checkSegment(String segment) {
        if (segment == null || segment.isEmpty() || ".".equals(segment) || "..".equals(segment)
                || segment.contains("..")) {
            throw new IllegalArgumentException("非法路径段: " + segment);
        }
        for (int i = 0; i < segment.length(); i++) {
            char c = segment.charAt(i);
            if (UNSAFE_SEGMENT_CHARS.indexOf(c) >= 0 || c < 0x20 || c == 0x7f) {
                throw new IllegalArgumentException("路径段含非法字符: " + segment);
            }
        }
        return segment;
    }

    /** 对象 key 的尝试顺序：先不带斜杠，再带斜杠 */
    static List<String> keyCandidates(String key, boolean tryLeadingSlashKey) {
        if (!tryLeadingSlashKey) {
            return List.of(key);
        }
        return List.of(key, "/" + key);
    }
}
