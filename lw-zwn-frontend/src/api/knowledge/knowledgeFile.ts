import request from '@/utils/request'
import type { ResponseSchema } from '@/utils/request/type'

/**
 * 知识库文档上传 / 查询 / 维护接口。
 *
 * 对应后端 KnowledgeUploadController：
 *   POST   /knowledge/files/uploadBatch  批量上传（FormData 字段 files 重复、typeId 必填）
 *   GET    /knowledge/files/config       当前存储配置（桶 / 前缀 / 单次数量上限）
 *   GET    /knowledge/files/{fileId}     单个文件元数据，用于刷新解析状态
 *   GET    /knowledge/files              文件列表（typeId / keyword / limit 可选）
 *   GET    /knowledge/files/page         文件分页列表（pageNumber / pageSize）
 *   GET    /knowledge/files/stats        文档数 / 文件数 / 已索引文件数
 *   PUT    /knowledge/files/{fileId}     重命名（只改展示名与文档标题）
 *   DELETE /knowledge/files/{fileId}     删除（MinIO 对象 + 达梦元数据）
 *
 * 前端统一带 /api 前缀，由 vite / nginx 反代时去掉，见 vite.config.ts。
 */

/** uploadBatch 返回的单文件入库结果（KnowledgeUploadVO.toMap()） */
export interface KnowledgeUploadItem {
  fileId?: string
  docId?: string
  groupId?: string
  fileName?: string
  sourceType?: string
  fileHash?: string
  size?: number
  bucket?: string
  objectKey?: string
  viewPath?: string
  resourceUrl?: string
  isDuplicate?: number
  dedupDecision?: string
  parseStatus?: string
  indexed?: number
  indexMode?: string
  metaPersisted?: boolean
  warning?: string
  error?: string
}

/** /knowledge/files/config 返回体 */
export interface KnowledgeStorageConfig {
  enabled?: boolean
  bucket?: string
  sourcePrefix?: string
  imagePrefix?: string
  maxBatchSize?: number
  mode?: string
  allUploadsStoredInMinio?: boolean
}

/** /knowledge/files/{fileId} 返回体 */
export interface KnowledgeFileDetail {
  fileId?: string
  docId?: string
  groupId?: string
  fileName?: string
  sourceType?: string
  fileHash?: string
  size?: number
  bucket?: string
  objectKey?: string
  viewPath?: string
  resourceUrl?: string
  isDuplicate?: number
  dedupDecision?: string
  parseStatus?: string
  indexed?: number
}

/** GET /knowledge/files 列表行（字段与上传返回体对齐） */
export interface KnowledgeFileRow {
  fileId?: string
  docId?: string
  typeId?: string
  /** 逻辑文档标题（无扩展名） */
  title?: string
  groupId?: string
  fileName?: string
  fileExt?: string
  size?: number
  contentType?: string
  sourceType?: string
  bucket?: string
  objectKey?: string
  viewPath?: string
  /** 可直接 window.open 的原文地址（/resourceShow/file?path=...） */
  resourceUrl?: string
  isDuplicate?: number
  dedupDecision?: string
  parseStatus?: string
  indexed?: number
  chunkCount?: number
  errorMsg?: string
  /** 入库时间，yyyy-MM-dd HH:mm:ss */
  createTime?: string
  docStatus?: string
}

/** GET /knowledge/files/stats 返回体 */
export interface KnowledgeFileStats {
  docs?: number
  files?: number
  indexedFiles?: number
  /** 未归类（TYPE_ID 为空）的历史文档数 */
  unclassified?: number
  indexEnabled?: boolean
  bucket?: string
}

/** 文件列表查询参数 */
export interface KnowledgeFileQuery {
  typeId?: string
  keyword?: string
  /** 默认 200，最大 1000 */
  limit?: number
  /** true 时只查未归类历史数据（TYPE_ID 为空，左侧树无节点可挂） */
  unclassified?: boolean
}

/** 文件分页查询参数 */
export interface KnowledgeFilePageQuery extends Omit<KnowledgeFileQuery, 'limit'> {
  /** 页码，从 1 开始 */
  pageNumber?: number
  /** 每页条数，默认 20，最大 200 */
  pageSize?: number
}

/** 后端 PageResult 对应结构 */
export interface KnowledgeFilePage {
  records: KnowledgeFileRow[]
  total: number
}

/**
 * 批量上传。后端逐文件处理结果，一个失败不影响其它文件，
 * 因此即便整体成功也要逐条检查 row.error / row.objectKey。
 *
 * 不手动设置 Content-Type：浏览器会自动补 multipart/form-data 的 boundary。
 */
export function uploadKnowledgeFiles(formData: FormData, onProgress?: (percent: number) => void) {
  return request({
    url: '/api/knowledge/files/uploadBatch',
    method: 'POST',
    data: formData,
    // 大批量 + 100MB 级文件，覆盖默认的 30s 超时
    timeout: 10 * 60 * 1000,
    onUploadProgress: (e: { loaded: number; total?: number }) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
  }) as unknown as Promise<ResponseSchema<KnowledgeUploadItem[]>>
}

export function getKnowledgeStorageConfig() {
  return request({
    url: '/api/knowledge/files/config',
    method: 'GET'
  }) as unknown as Promise<ResponseSchema<KnowledgeStorageConfig>>
}

export function getKnowledgeFileDetail(fileId: string) {
  return request({
    url: `/api/knowledge/files/${encodeURIComponent(fileId)}`,
    method: 'GET'
  }) as unknown as Promise<ResponseSchema<KnowledgeFileDetail>>
}

/**
 * 文件列表：知识库页面右侧列表的唯一数据源（不含任何前端演示数据）。
 * typeId 为空表示全部类型，keyword 匹配文件名或文档标题。
 */
export function listKnowledgeFiles(query: KnowledgeFileQuery) {
  return request({
    url: '/api/knowledge/files',
    method: 'GET',
    params: query
  }) as unknown as Promise<ResponseSchema<KnowledgeFileRow[]>>
}

/**
 * 文件分页列表：知识库页面右侧表格的数据源。
 * 返回 { records, total }，total 为当前类型 / 关键字下的总条数，供分页器渲染。
 */
export function pageKnowledgeFiles(query: KnowledgeFilePageQuery) {
  return request({
    url: '/api/knowledge/files/page',
    method: 'GET',
    params: query
  }) as unknown as Promise<ResponseSchema<KnowledgeFilePage>>
}

/** 知识库总量：文档数 / 文件数 / 已索引文件数 */
export function getKnowledgeFileStats() {
  return request({
    url: '/api/knowledge/files/stats',
    method: 'GET'
  }) as unknown as Promise<ResponseSchema<KnowledgeFileStats>>
}

/** 重命名：只改展示名与文档标题，MinIO 对象与向量不受影响 */
export function renameKnowledgeFile(fileId: string, fileName: string) {
  return request({
    url: `/api/knowledge/files/${encodeURIComponent(fileId)}`,
    method: 'PUT',
    data: { fileName }
  }) as unknown as Promise<ResponseSchema<KnowledgeFileRow>>
}

/** 删除文件：后端连带清理 MinIO 对象与元数据（最后一个文件时含文档与向量） */
export function deleteKnowledgeFile(fileId: string) {
  return request({
    url: `/api/knowledge/files/${encodeURIComponent(fileId)}`,
    method: 'DELETE'
  }) as unknown as Promise<ResponseSchema<Record<string, unknown>>>
}

/**
 * 批量清理「未归类」历史数据（TYPE_ID 为空的文档 / 文件 / 对象 / 向量）。
 * 逐文件尽力清理，返回 { files, docs, warnings }。
 */
export function purgeUnclassifiedFiles() {
  return request({
    url: '/api/knowledge/files/unclassified',
    method: 'DELETE'
  }) as unknown as Promise<ResponseSchema<{ files?: number; docs?: number; warnings?: string[] }>>
}
