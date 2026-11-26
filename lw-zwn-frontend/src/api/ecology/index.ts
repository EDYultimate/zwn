import request from '@/utils/request'

/** 自试点累计补水量（tm 截止月份 yyyy-MM，可选；为空返回最新全量累计） */
export function getCumulativeSupply(params?: { tm?: string }) {
  return request({
    url: '/api/ecology/getCumulativeSupply',
    method: 'GET',
    params
  })
}

/** 获取最新数据月份 */
export function getEcoMaxTime() {
  return request({
    url: '/api/ecology/getEcoMaxTime',
    method: 'GET'
  })
}

/** 年度补水合计(单年) */
export function getRiverSourceHeji(params: { tm: string }) {
  return request({
    url: '/api/ecology/getRiverSourceHeji',
    method: 'GET',
    data: params
  })
}

/** 年份范围补水合计 */
export function getRiverSourceRange(params: { startYear: string; endYear: string }) {
  return request({
    url: '/api/ecology/getRiverSourceRange',
    method: 'GET',
    data: params
  })
}

/** 河湖补水量列表 */
export function getRiverSourceNew(params?: { name?: string; tm?: string }) {
  return request({
    url: '/api/ecology/getRiverSourceNew',
    method: 'GET',
    data: params
  })
}

/**
 * 月报文件列表（ST_MEDIA_B 多级区分）
 * @param params.type 模块大类（DOC_TP：DS=调水管理，HBS=河湖补水，FH=河湖复苏，QYS=取用水）
 * @param params.cat  文件类型（FILE_CAT，沿用旧项目 yuebao.type：ECO=生态补水月报，HHFS=河湖复苏简报，STLL=水利厅月报）
 */
export function getMediaList(params?: { year?: string; type?: string; cat?: string }) {
  return request({
    url: '/api/ecology/getMediaList',
    method: 'GET',
    data: params
  })
}

/** 河湖详情 - 年度/月度水源累计水量 */
export function getRiverYearData(params: { id: string; startYear?: string; endYear?: string }) {
  return request({
    url: '/api/ecology/getRiverYearData',
    method: 'GET',
    data: params
  })
}

/** 生态流量-流域目标统计（读 HWWR.WR_ECO_SEC_B） */
export function getEcoFlowTargetStat() {
  return request({
    url: '/api/ecology/ecoFlow/targetStat',
    method: 'GET'
  })
}

/** 生态流量-重点跟踪断面评估（KEY_TRK_TP=1，55 条） */
export function getEcoFlowEval() {
  return request({
    url: '/api/ecology/ecoFlow/eval',
    method: 'GET'
  })
}

/** 生态流量-重点跟踪断面预警（tab：flow 生态流量 / level 生态水位 / volume 生态水量） */
export function getEcoFlowWarn(params: { tab: string }) {
  return request({
    url: '/api/ecology/ecoFlow/warn',
    method: 'GET',
    params
  })
}

/** 生态流量-断面基本信息列表（scope：all 全部 194 条 / tracked 重点跟踪 55 条）—— 三个标题「详情」弹窗 */
export function getEcoFlowSections(params: { scope: 'all' | 'tracked' }) {
  return request({
    url: '/api/ecology/ecoFlow/sections',
    method: 'GET',
    params
  })
}
