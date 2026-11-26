/*
 *    Copyright (c) 2018-2025, waterx All rights reserved.
 *
 *    Redistribution and use in source and binary forms, with or without
 *    modification, are permitted provided that the following conditions are met:
 */
package cn.lonwin.module.knowledge.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 文件查看（原文预览 / 下载）配置。
 *
 * <p>从 knowledge-platform 的 ResourceController 迁移过来的能力，在本项目里做成可配置：
 * 只暴露白名单前缀下的对象，避免把整个 bucket 变成匿名文件服务器。
 *
 * <p>对应配置前缀 {@code file.view}，示例：
 * <pre>
 * file:
 *   view:
 *     enabled: true
 *     bucket: yqbucket          # 留空则跟随 file.bucketName
 *     allowed-prefixes: [docFiles, imgFiles]
 *     inline-extensions: [pdf, png, jpg, jpeg, gif, webp, txt]
 *     try-leading-slash-key: true
 * </pre>
 */
@Data
@Component
@ConfigurationProperties(prefix = "file.view")
public class ResourceViewProperties {

    /** 是否启用文件查看端点 */
    private boolean enabled = true;

    /**
     * 读取哪个 bucket；留空时使用 {@code file.bucketName}。
     *
     * <p>历史知识库文件可能在独立的 bucket 里，允许与业务上传 bucket 分开配置。
     */
    private String bucket = "";

    /** 允许访问的对象一级前缀白名单 */
    private List<String> allowedPrefixes = List.of("docFiles", "imgFiles");

    /** 这些扩展名默认 inline 预览，其余默认 attachment 下载 */
    private List<String> inlineExtensions = List.of("pdf", "png", "jpg", "jpeg", "gif", "webp", "svg", "txt");

    /**
     * 是否兼容对象 key 带前导斜杠。
     *
     * <p>knowledge-platform 的 {@code getObjectDef("/docFiles/...")} 传的是带斜杠的 key，
     * 而 MinIO 中同一批对象也可能以不带斜杠的 key 存在。开启后按顺序尝试两种写法。
     */
    private boolean tryLeadingSlashKey = true;

    /** 单次响应最大字节数保护（0 表示不限制），避免超大文件直接打满内存/连接 */
    private long maxObjectBytes = 0L;
}
