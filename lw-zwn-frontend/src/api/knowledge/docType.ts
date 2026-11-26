import request from '@/utils/request'
import type { ResponseSchema } from '@/utils/request/type'

/**
 * 知识库文档类型（业务类型）树接口。
 *
 * 对应后端 KnowledgeDocTypeController（lonwin-module-knowledge）：
 *   GET    /knowledge/doc-types/tree     整棵类型树（含每节点文档数）
 *   POST   /knowledge/doc-types          新增节点（parentId 为空即根节点）
 *   PUT    /knowledge/doc-types/{typeId} 改名 / 改备注
 *   DELETE /knowledge/doc-types/{typeId} 删除节点
 *
 * 上传文档（/knowledge/files/uploadBatch）必须携带 typeId，文档挂在类型节点上。
 */

/** 类型树节点 */
export interface KnowledgeDocTypeNode {
  typeId: string
  parentId?: string | null
  typeName: string
  /** 业务编码，如 river / report，可空 */
  typeCode?: string | null
  sortNo?: number
  remark?: string | null
  /** 挂在本节点上的文档数（不含子节点） */
  docCount?: number
  children?: KnowledgeDocTypeNode[]
}

/** 新增 / 修改请求体 */
export interface KnowledgeDocTypePayload {
  parentId?: string | null
  typeName: string
  typeCode?: string | null
  sortNo?: number | null
  remark?: string | null
}

/** 整棵类型树 */
export function getDocTypeTree() {
  return request({
    url: '/api/knowledge/doc-types/tree',
    method: 'GET'
  }) as unknown as Promise<ResponseSchema<KnowledgeDocTypeNode[]>>
}

/** 新增类型节点 */
export function createDocType(data: KnowledgeDocTypePayload) {
  return request({
    url: '/api/knowledge/doc-types',
    method: 'POST',
    data
  }) as unknown as Promise<ResponseSchema<KnowledgeDocTypeNode>>
}

/** 修改类型名称 / 备注 */
export function updateDocType(typeId: string, data: KnowledgeDocTypePayload) {
  return request({
    url: `/api/knowledge/doc-types/${encodeURIComponent(typeId)}`,
    method: 'PUT',
    data
  }) as unknown as Promise<ResponseSchema<KnowledgeDocTypeNode>>
}

/** 删除类型节点（有子节点或已挂文档时后端会拒绝） */
export function deleteDocType(typeId: string) {
  return request({
    url: `/api/knowledge/doc-types/${encodeURIComponent(typeId)}`,
    method: 'DELETE'
  }) as unknown as Promise<ResponseSchema<void>>
}
