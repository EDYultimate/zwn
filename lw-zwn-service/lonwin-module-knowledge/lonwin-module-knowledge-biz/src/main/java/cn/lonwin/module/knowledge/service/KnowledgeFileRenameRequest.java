package cn.lonwin.module.knowledge.service;

/**
 * 文件重命名请求体。
 *
 * <p>只改展示用的文件名（{@code SYS_KNOWLEDGE_FILE.FILE_NAME} 与
 * {@code SYS_KNOWLEDGE_DOC.TITLE}），<b>不移动 MinIO 对象</b>——
 * 对象 key 里带 fileId，改名不会造成同名覆盖，也不影响已有原文链接。
 */
public record KnowledgeFileRenameRequest(String fileName) {
}
