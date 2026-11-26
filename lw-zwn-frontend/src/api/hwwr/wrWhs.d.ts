/**
 * 水源地（wrWhs）接口的类型声明 —— 与同目录 wrWhs.js 同名，供 TS 解析（消除 TS7016「隐式 any」红波浪线）。
 * 实现仍在 wrWhs.js（运行时用 .js，类型走本文件）。
 */

/** 后端统一返回包装（与 utils/request 的响应结构一致） */
export interface WrWhsResult<T = any> {
  code: number
  message?: string
  data: T
}

/** 水源地地图点位行（whsPoint），字段随水源地表，按需扩展 */
export interface WhsPointItem {
  WHS_CD?: string
  WHS_NM?: string
  WHS_TP?: string
  TYPE?: string | number
  LNG?: number
  LAT?: number
  BAS_NM?: string
  RV_NM?: string
  LOC?: string
  WS_OBJ_CITY?: string
  WQ_ASSESS?: string
  WS_ASSESS?: string
  MGMT_ASSESS?: string
  MON_ASSESS?: string
  DES_YR_WS?: number
  DES_WS_PP?: number
  RUN_MAN_UNIT?: string
  SUP_MAN_UNIT?: string
  RPT_YR?: number | string
  [key: string]: any
}

/** 取水源地统计（统计口径由后端定） */
export function statistics(params?: Record<string, any>): Promise<WrWhsResult>
/** 取水源地分组计数 */
export function groupCount(params?: Record<string, any>): Promise<WrWhsResult>
/** 取水源地问题/达标情况 */
export function whsProb(params?: Record<string, any>): Promise<WrWhsResult>
/** 水源地列表（分页） */
export function whsList(params?: Record<string, any>): Promise<WrWhsResult>
/** 水源地地图点位（必传报告年份 rptYr） */
export function whsPoint(params: {
  rptYr: string | number
  [key: string]: any
}): Promise<WrWhsResult<WhsPointItem[]>>
/** 水源地列表（不分页，全量） */
export function findAllList(params?: Record<string, any>): Promise<WrWhsResult>
