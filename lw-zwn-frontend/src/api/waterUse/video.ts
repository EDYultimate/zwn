import request from '@/utils/request'

/**
 * 视频监控页 API（后端模块 lonwin-module-video）
 * ------------------------------------------------------------------
 * 前端统一 /api 前缀，vite / nginx 代理会去掉后落到后端 /video/**。
 * 图片 URL 由后端直接返回，形如 /api/video/snapshots/image?path=...，
 * 可放在 <img :src> 中直连（该路径已在 SecurityConfig 中放行）。
 * ------------------------------------------------------------------
 */

/** 监控点位卡片 */
export interface VideoStation {
  id: number
  code: string
  name: string
  org: string
  /** 在线 / 离线 / 异常抓拍 */
  status: string
  /** 是否存在异常抓拍 */
  capture: boolean
  /** 是否存在取水行为（取水抓拍） */
  water: boolean
  /** 是否重点点位 */
  main: boolean
  /** 最新抓拍缩略图 */
  thumb: string
  site?: string
  state?: string
  /** 经度：后端 getXAxis() 经 Jackson 序列化后的实际字段名 */
  xaxis?: string
  /** 纬度：后端 getYAxis() 经 Jackson 序列化后的实际字段名 */
  yaxis?: string
  /** 兼容部分 Jackson 命名策略下的驼峰字段名 */
  xAxis?: string
  yAxis?: string
  snapshotCount?: number
  latestCaptureTime?: string
}

/** 点位基本信息（视频详情弹框） */
export interface VideoStationDetail {
  code: string
  name: string
  org?: string
  manageUnit?: string
  stakeNo?: string
  river?: string
  setupBasis?: string
  address?: string
  waterTime?: string
  waterAmount?: string
  site?: string
  status?: string
  /** 经度：后端 getXAxis() 经 Jackson 序列化后的实际字段名 */
  xaxis?: string
  /** 纬度：后端 getYAxis() 经 Jackson 序列化后的实际字段名 */
  yaxis?: string
  /** 兼容驼峰字段名 */
  xAxis?: string
  yAxis?: string
  snapshotCount?: number
  latestCaptureTime?: string
  latestSnapshot?: string
}

/** 视频播放信息 */
export interface VideoPlay {
  code: string
  name: string
  /** 平台播放页地址 */
  playUrl?: string
  /** HLS m3u8 流地址 */
  streamUrl?: string
  protocol?: string
  online?: boolean
  /** 播放不可用时的最新抓拍画面 */
  snapshotUrl?: string
  message?: string
}

/** 抓拍分组编码 */
export type SnapshotGroupCode = 'timed' | 'abnormal' | 'water'

/** 抓拍图片 */
export interface VideoSnapshot {
  /** 相对路径，同时作为唯一 id */
  id: string
  path: string
  url: string
  code: string
  name: string
  groupCode: SnapshotGroupCode
  /** 定时拍摄 / 异常抓拍 / 取水抓拍 */
  groupName: string
  date: string
  captureTime: string
  /** 帧标签 HH:mm:ss */
  duration: string
  fileName: string
  size: number
}

export interface VideoStationQuery {
  /** yyyy-MM-dd */
  date?: string
  keyword?: string
  org?: string
  status?: string
}

export interface VideoSnapshotQuery {
  date?: string
  code?: string
  /** timed / abnormal / water / all */
  group?: string
  limit?: number
}

/** 监控点位列表 */
export function getVideoStations(params?: VideoStationQuery) {
  return request<VideoStation[]>({ url: '/api/video/stations', method: 'GET', params })
}

/** 监管单位下拉选项（不含「全部」） */
export function getVideoOrgs() {
  return request<string[]>({ url: '/api/video/stations/orgs', method: 'GET' })
}

/** 点位基本信息 */
export function getVideoStationDetail(code: string, date?: string) {
  return request<VideoStationDetail>({
    url: `/api/video/stations/${encodeURIComponent(code)}`,
    method: 'GET',
    params: { date }
  })
}

/** 视频播放地址（HLS）+ 最新抓拍降级画面 */
export function getVideoPlay(code: string, date?: string) {
  return request<VideoPlay>({
    url: `/api/video/stations/${encodeURIComponent(code)}/play`,
    method: 'GET',
    params: { date }
  })
}

/** 抓拍图片列表（定时拍摄 / 异常抓拍 / 取水抓拍） */
export function getVideoSnapshots(params?: VideoSnapshotQuery) {
  return request<VideoSnapshot[]>({ url: '/api/video/snapshots', method: 'GET', params })
}

/** 手动截图（页面「截图」按钮） */
export function captureVideoSnapshot(code: string, group: SnapshotGroupCode = 'timed') {
  return request({
    url: `/api/video/capture/${encodeURIComponent(code)}`,
    method: 'POST',
    params: { group }
  })
}

/** 勾选的抓拍图片打包下载（zip） */
export function downloadVideoSnapshots(paths: string[]) {
  return request<Blob>({
    url: '/api/video/snapshots/download',
    method: 'POST',
    data: { paths },
    responseType: 'blob'
  })
}

/** 由截图相对路径拼出图片访问 URL */
export function snapshotImageUrl(path: string) {
  return `/api/video/snapshots/image?path=${encodeURIComponent(path)}`
}
