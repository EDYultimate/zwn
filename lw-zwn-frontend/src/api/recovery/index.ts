import request from '@/utils/request'

/** 获取最新季度/月份 */
export function queryNewSeason() {
  return request({
    url: '/api/recovery/queryNewSeason',
    method: 'GET'
  })
}

/** 湖泊可用月份列表 */
export function getHupoAvailableMonths(params: { year: string }) {
  return request({
    url: '/api/recovery/getHupoAvailableMonths',
    method: 'GET',
    params
  })
}

/** 综合接口：河湖复苏成效统计信息 */
export function getFusuData(params: { year: string; season: string }) {
  return request({
    url: '/api/recovery/getFusuData',
    method: 'GET',
    params
  })
}

/** 达标数据(饼图) */
export function getDaBiaoData(params: { ym: string }) {
  return request({
    url: '/api/recovery/getDaBiaoData',
    method: 'GET',
    params
  })
}

/** 达标明细 */
export function getDaBiaoDetail(params: { ym: string }) {
  return request({
    url: '/api/recovery/getDaBiaoDetail',
    method: 'GET',
    params
  })
}
