import request from '@/utils/request'
import type { ResponseSchema } from '@/utils/request/type'

/**
 * 文件实体（对应后端 cn.lonwin.framework.file.entity.SysFile）
 */
export interface SysFile {
  id?: number | string
  /** 文件名（存储名，通常为 uuid） */
  fileName?: string
  /** 原始文件名 */
  original?: string
  /** 存储桶名称 */
  bucketName?: string
  /** 文件夹 */
  dir?: string
  /** 文件类型（contentType） */
  type?: string
  /** 文件组：业务 id，配合 groupType 定位一批业务文件 */
  groupId?: string
  /** 文件组类型 */
  groupType?: string
  /** 文件大小（字节） */
  fileSize?: number
  /** 文件 hash */
  hash?: string
  /** 简介 */
  info?: string
  /** 来源 */
  docSource?: string
  /** 发布时间 */
  publishTime?: string
  /** 备注 */
  nt?: string
  /** 上传人 */
  createBy?: string
  /** 上传时间 */
  createTime?: string
  /** 更新人 */
  updateBy?: string
  /** 更新时间 */
  updateTime?: string
  /** 删除标记：1-已删除，0-正常 */
  delFlag?: string
}

/**
 * 文件查询参数
 */
export interface SysFileQuery {
  /** 文件类型（contentType，精确匹配） */
  type?: string
  /** 文件组（业务 id，精确匹配） */
  groupId?: string
  /** 文件组类型（精确匹配） */
  groupType?: string
  /** 原始文件名（模糊检索） */
  original?: string
}

/**
 * 上传文件参数
 * 对应后端 POST /ossFile/upload，仅接收 file / groupId / groupType（目录由后台按日期自动生成）
 */
export interface SysFileUploadParams {
  /** 文件组（业务 id） */
  groupId?: string
  /** 文件组类型 */
  groupType?: string
}

/**
 * 列表查询（非分页），根据 type / groupId / groupType / original 检索一批业务文件
 * 对应后端 GET /api/ossFile/list
 */
export function findSysFileList(params: SysFileQuery) {
  return request({
    url: '/api/ossFile/list',
    method: 'GET',
    data: params
  }) as unknown as Promise<ResponseSchema<SysFile[]>>
}

/**
 * 分页查询
 * 对应后端 GET /api/ossFile/page
 */
export function findSysFilePage(params: SysFileQuery & { pageNumber?: number; pageSize?: number }) {
  return request({
    url: '/api/ossFile/page',
    method: 'GET',
    data: params
  }) as unknown as Promise<ResponseSchema<{ records: SysFile[]; total: number }>>
}

/**
 * 通过 id 删除文件（支持批量）
 * 对应后端 DELETE /ossFile，请求体为 Long[] ids
 */
export function deleteSysFile(ids: (number | string)[]) {
  return request({
    url: '/api/ossFile',
    method: 'DELETE',
    data: ids
  }) as unknown as Promise<ResponseSchema>
}

/**
 * 修改文件名
 * 对应后端 PUT /api/ossFile/rename，请求体为 SysFile
 */
export function renameSysFile(data: SysFile) {
  return request({
    url: '/api/ossFile/rename',
    method: 'PUT',
    data
  }) as unknown as Promise<ResponseSchema>
}

/**
 * 上传文件
 * 对应后端 POST /api/ossFile/upload，FormData 字段：file、groupId、groupType
 * 注意：后端不接收 dir/type，目录由后台按日期（yyyy/MM/dd）自动生成
 * @param data FormData
 * @param config 附加 axios 配置（如 onUploadProgress、params、headers、timeout）
 */
export function uploadSysFile(data: FormData, config?: Record<string, any>) {
  return request({
    url: '/api/ossFile/upload',
    method: 'POST',
    data,
    ...config
  }) as unknown as Promise<
    ResponseSchema<{
      bucketName: string
      fileName: string
      url: string
    }>
  >
}

/**
 * 下载文件（通过 id，返回文件流，非 JSON）
 * 对应后端 GET /api/ossFile/{id}
 * @param id 文件编号
 * @param config 附加 axios 配置（如 responseType: 'blob'）
 */
export function downloadSysFile(id: number | string, config?: Record<string, any>) {
  return request({
    url: `/api/ossFile/${id}`,
    method: 'GET',
    ...config
  }) as unknown as Promise<any>
}

/**
 * 下载文件（通过存储文件名，返回文件流，非 JSON）
 * 对应后端 GET /api/ossFile/oss/file?fileName=xxx
 * @param fileName 存储文件名
 * @param config 附加 axios 配置（如 responseType: 'blob'）
 */
export function downloadSysFileByName(fileName: string, config?: Record<string, any>) {
  return request({
    url: '/api/ossFile/oss/file',
    method: 'GET',
    params: { fileName },
    ...config
  }) as unknown as Promise<any>
}
