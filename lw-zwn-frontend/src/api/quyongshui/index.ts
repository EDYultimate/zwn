import request from '@/utils/request'

/** 首页统计：全流域/委发证 证照数、取用水户数、许可水量、准予发证数 */
export function getBaseInfo() {
  return request({
    url: '/api/quyongshui/getBaseInfo',
    method: 'GET'
  })
}

/** 取用水量详情：按省统计 证数/许可水量/实际水量（year 缺省当年；实际水量=当年月表全年求和） */
export function qysDetails(params?: { year?: number }) {
  return request({
    url: '/api/quyongshui/qysDetails',
    method: 'GET',
    params
  })
}

/** 许可证预警统计：超许可/即将到期/取水计划预警 */
export function getYuJingData(params?: { year?: number }) {
  return request({
    url: '/api/quyongshui/getYuJingData',
    method: 'GET',
    params
  })
}

/**
 * 统计明细（点击统计数值 → 弹窗逐条展示）
 * 表头与数据随统计类型不同，由后端一并下发：返回 { columns, rows }
 * kind：exLimit / yuJing / expired / certWfz / waitWfz / ownerWfz / sumXukeWfzOut / sumXukeWfzIn
 */
export interface StatDetailColumn {
  title: string
  key: string
  width?: number | string
}

export interface StatDetailResult {
  columns: StatDetailColumn[]
  rows: Record<string, any>[]
}

export function getStatDetail(kind: string, year?: number, unit?: string) {
  return request<StatDetailResult>({
    url: '/api/quyongshui/statDetail',
    method: 'GET',
    params: { kind, year, unit }
  })
}

/** 地图河流信息（保留：地图暂不迁移，待 GIS 联调后接入） */
export function riverMapInfo(params: { riverId: string }) {
  return request({
    url: '/api/quyongshui/riverMapInfo',
    method: 'GET',
    params
  })
}

/** 圈选取水量监测信息：证书号/设施编码列表（逗号分隔）+ 日期区间 → 取水证信息 + 区间累计取水量 + 年累计取水量（万m³） */
export function waterMonitorInfo(params: {
  certCodes?: string
  stcds?: string
  startDate: string
  endDate: string
}) {
  return request({
    url: '/api/quyongshui/waterMonitorInfo',
    method: 'GET',
    params
  })
}

/** 地图撒点：海委取水工程点位（设施 ID=STCD + 工程名 + JD/WD 经纬度 + 证号） */
export function mapEngPoints() {
  return request({
    url: '/api/quyongshui/mapEngPoints',
    method: 'GET'
  })
}

/** 许可证详情：证照基础信息 + 指定年份年度取水量 */
export function certDetail(params: { certCode: string; year?: number }) {
  return request({
    url: '/api/quyongshui/certDetail',
    method: 'GET',
    params
  })
}

/** 许可证计量设施：按证号查设施列表（名称/传输方式/状态 + 该证年累计水量） */
export function certFacilities(params: { certCode: string; year?: number }) {
  return request({
    url: '/api/quyongshui/certFacilities',
    method: 'GET',
    params
  })
}

/** 许可证月度水量：月表按证号按月份分组（万m³） */
export function certMonthWater(params: { certCode: string; year?: number }) {
  return request({
    url: '/api/quyongshui/certMonthWater',
    method: 'GET',
    params
  })
}

/** 许可证取水计划：按证号+年份查年度计划（M1~M12 + TT，万m³） */
export function certPlanReview(params: { certCode: string; year?: number }) {
  return request({
    url: '/api/quyongshui/certPlanReview',
    method: 'GET',
    params
  })
}

/** 计量设施水量：type=year 近两年 / month 近12个月 / day 近30天（单位 m³，迁自旧项目 queryJlssMonthWater） */
export function measWater(params: { measId: string; type?: 'year' | 'month' | 'day' }) {
  return request({
    url: '/api/waterUse/measLib/water',
    method: 'GET',
    params
  })
}
