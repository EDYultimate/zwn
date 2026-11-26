import request from '@/utils/request'

/**
 * 取用水模块 API
 * ------------------------------------------------------------------
 * 已接入后端真实接口（/waterUse，数据源 HWWR 247.73 测试库）。
 * 列表接口返回数组 res.data；统计/概览接口返回对象 res.data。
 * ------------------------------------------------------------------
 */

/* ==================================================================
 * 一、取水计划填报
 * ================================================================== */

/** 顶部统计：待填报/已填报 证数 */
export function getPlanFillStat(params?: Record<string, any>) {
  return request({ url: '/api/waterUse/planFill/stat', method: 'GET', params })
}

/** 取水计划填报列表（status: pending/filled） */
export function getPlanFillList(params?: Record<string, any>) {
  return request({ url: '/api/waterUse/planFill/list', method: 'GET', params })
}

/** 取水计划填报单证详情（基础信息 + 12月计划） */
export function getPlanFillDetail(params: { certNo: string; year?: number }) {
  return request({ url: '/api/waterUse/planFill/detail', method: 'GET', params })
}

/** 取水计划填报保存：整证覆盖式，body = {certNo, year, months:[{mn,qty}×12]} */
export function savePlanFill(data: {
  certNo: string
  year: number
  months: { mn: number; qty: number | null }[]
}) {
  return request({ url: '/api/waterUse/planFill/save', method: 'POST', data })
}

/* ==================================================================
 * 二、取水台账管理
 * ================================================================== */

/** 顶部统计卡：委发证许可水量/规模以上/户数/个数/到报率/在线设施/接入率 */
export function getLedgerStat() {
  return request({ url: '/api/waterUse/ledger/stat', method: 'GET' })
}

/** 取水台账列表（month 格式 yyyy-MM，缺省当月） */
export function getLedgerList(params?: Record<string, any>) {
  return request({ url: '/api/waterUse/ledger/list', method: 'GET', params })
}

/* ==================================================================
 * 三、违规取用水行为监管（超计划 / 超许可 / 证照过期）
 * ================================================================== */

/**
 * 违规明细列表
 * @param type plan=计量取水超计划 / license=计量取水超许可 / expired=证照过期仍取水
 */
export function getIllegalList(type: string, params?: Record<string, any>) {
  return request({ url: '/api/waterUse/illegal/list', method: 'GET', params: { ...params, type } })
}

/** 违规监管顶部 tab 计数：{ plan, license, expired } */
export function getIllegalStat(params?: Record<string, any>) {
  return request({ url: '/api/waterUse/illegal/stat', method: 'GET', params })
}

/* ==================================================================
 * 四、超载区取用水管理
 * ================================================================== */

/** 超载区统计：委发证总数 + 省分布(list) + 超载分区(regions) + 左右户数(siteCount) */
export function getOverloadStat(params?: Record<string, any>) {
  return request({ url: '/api/waterUse/overload/stat', method: 'GET', params })
}

/* ==================================================================
 * 五、电子证照库（迁自 gk 证照库 zzk）
 * ================================================================== */

/** 证照列表（licenseNumber/waterOwner/creditCode 模糊，province 省份编码逗号分隔，
 * isExLimit 只看超许可，isWarning 只看超计划预警，startDate 到期早于该日，stStart/stEnd 有效开始区间） */
export function getCertLibList(params?: Record<string, any>) {
  return request({ url: '/api/waterUse/certLib/list', method: 'GET', params })
}

/** 准予未发证列表 */
export function getCertLibWaitList() {
  return request({ url: '/api/waterUse/certLib/waitList', method: 'GET' })
}

/** 剔除超许可标记 */
export function removeCertExLimit(licenseNumber: string) {
  return request({
    url: '/api/waterUse/certLib/removeExLimit',
    method: 'GET',
    params: { licenseNumber }
  })
}

/* ==================================================================
 * 六、计量设施库（迁自 gk 计量设施库 jlss）
 * ================================================================== */

/** 计量设施列表 */
export function getMeasLibList(params?: Record<string, any>) {
  return request({ url: '/api/waterUse/measLib/list', method: 'GET', params })
}

/** 计量设施水量：type=year 近两年 / month 近12个月 / day 近30天 */
export function getMeasLibWater(params: { measId: string; type?: 'year' | 'month' | 'day' }) {
  return request({ url: '/api/waterUse/measLib/water', method: 'GET', params })
}

/* ==================================================================
 * 七、用水统计调查
 * ================================================================== */

/** 供水统计（按水源类型：地表水/地下水/其他，[{NAME, WATER}] 万m³） */
export function getSurveySupply() {
  return request({ url: '/api/waterUse/survey/supply', method: 'GET' })
}

/** 各行政区供用水分析（[{NAME, SUPPLY_WATER, USE_WATER}] 万m³） */
export function getSurveyProvince() {
  return request({ url: '/api/waterUse/survey/province', method: 'GET' })
}

/** 用水统计（按用途：工业/农业/生活/生态/其他，[{NAME, WATER}] 万m³） */
export function getSurveyUse() {
  return request({ url: '/api/waterUse/survey/use', method: 'GET' })
}

/** 各行政区取用水量（[{NAME, CONTROL_WATER, PERMIT_WATER, STAT_WATER, METER_WATER}] 万m³；管控指标暂无数据源为 null） */
export function getSurveyRegionUse() {
  return request({ url: '/api/waterUse/survey/regionUse', method: 'GET' })
}

/** 委发证重点取水户季度上报水量 top10（[{CERT, OWNER, PERMIT_WATER, REPORT_WATER}] 万m³，quarter=1~4） */
export function getSurveyKeyUsers(quarter = 1) {
  return request({ url: '/api/waterUse/survey/keyUsers', method: 'GET', params: { quarter } })
}
