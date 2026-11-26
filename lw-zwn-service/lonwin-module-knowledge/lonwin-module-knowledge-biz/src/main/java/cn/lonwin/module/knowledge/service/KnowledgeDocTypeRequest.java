package cn.lonwin.module.knowledge.service;

/**
 * 文档类型新增 / 修改请求体。
 *
 * <p>新增时 {@code parentId} 为空表示建根节点；修改（改名）时只用 {@code typeName}
 * 与 {@code remark}，其余字段忽略。
 */
public record KnowledgeDocTypeRequest(String parentId, String typeName, String typeCode,
                                      Integer sortNo, String remark) {
}
