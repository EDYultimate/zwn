package cn.lonwin.module.knowledge.index;

import java.util.Map;

/**
 * 一个待写入 Qdrant 的检索单元。
 *
 * @param id        确定性 UUID（Qdrant 只接受无符号整数或标准 UUID），重建/重试覆盖式幂等
 * @param collection kp_chunks / kp_tables
 * @param text       进 prompt 的正文（不带上下文头）
 * @param embedText  送 BGE-M3 的文本（带文件名 / 章节 / 类型上下文头）
 * @param payload    Qdrant payload，字段与 {@code QdrantClient.toHit()} 对齐
 */
public record KnowledgeChunk(String id, String collection, String text, String embedText,
                             Map<String, Object> payload) { }
