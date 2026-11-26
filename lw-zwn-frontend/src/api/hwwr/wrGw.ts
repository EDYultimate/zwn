import request from '@/utils/request'

// 按统计年份查询参数
interface OvexYrParams {
  /** 统计年份（如 2023） */
  evlYr?: string
}

// 按统计年份和层次类型查询参数
interface OvexAreaParams extends OvexYrParams {
  /** 层次类型（1浅层地下水 2深层承压水） */
  tp?: string
}

// 按统计年份查询超采区总体统计（超采区数量/超采量/超采区面积）
export function stat(params: OvexYrParams) {
  return request({
    url: '/api/wrGwOvex/stat',
    method: 'GET',
    data: params
  })
}

// 按统计年份查询省级行政区分组统计（各省级下所有子行政区的数量）
export function prvStat(params: OvexYrParams) {
  return request({
    url: '/api/wrGwOvex/prvStat',
    method: 'GET',
    data: params
  })
}

// 按统计年份查询各地级行政区的浅层、深层超采量
export function ovexQty(params: OvexYrParams) {
  return request({
    url: '/api/wrGwOvex/qty',
    method: 'GET',
    data: params
  })
}

// 按统计年份和层次类型查询各地级行政区的超采区面积
export function ovexArea(params: OvexAreaParams) {
  return request({
    url: '/api/wrGwOvex/area',
    method: 'GET',
    data: params
  })
}

// 按统计年份查询超采区合计面积总和（扣除浅层与深层重叠面积）
export function areaSum(params: OvexYrParams) {
  return request({
    url: '/api/wrGwOvex/areaSum',
    method: 'GET',
    data: params
  })
}

// 超采区面积和水量列表查询参数（列表详情弹框）
interface OvexListParams {
  /** 统计年份（可选，为空时不过滤） */
  evlYr?: string
  /** 地级行政区编码（可选，为空时不过滤） */
  areCd?: string
}

// 查询超采区面积和水量统计列表（不分页，全量返回）
// 返回字段：evlYr / areCd / areNm / shlGenAr / shlSevAr / shlSubAr /
//          depGenAr / depSevAr / depSubAr / totDedAr / shlOvexQty / depOvexQty / subOvexQty / nt
export function ovexFindList(params: OvexListParams) {
  return request({
    url: '/api/wrGwOvex/findList',
    method: 'GET',
    data: params
  })
}

// ========== 地下水埋深控制（WR_GW_BD_CTL_Q 双控指标）==========

// 埋深控制数据查询参数（按上级行政区+年份+季度+层位类型查询子级行政区数据）
interface BdListParams {
  /** 上级（地市级）区划编码（如 130100；直辖市为 110000/120000）；为空时查询全部行政区 */
  upCd: string
  /** 年份（如 2024） */
  yr: string
  /** 季度（1-4） */
  qtr: string
  /** 层位类型（S浅层 D深层）；不传时返回浅层+深层全部数据 */
  lyrTp?: string
}

// 查询地市级上级行政区列表（按省级分组，用于行政区级联第二层）
export function upList() {
  return request({
    url: '/api/wrGwWater/upList',
    method: 'GET'
  })
}

// 按上级行政区、年份、季度、层位类型查询所有子级行政区的埋深控制数据
// 返回字段：adCd / adNm / thv(序时阈值) / bd(埋深) / diff(差值=阈值-埋深)
export function bdList(params: BdListParams) {
  return request({
    url: '/api/wrGwWater/bdList',
    method: 'GET',
    data: params
  })
}

// 取水量指标与取水总量查询参数
interface TgtListParams {
  /** 实际取水量年份（如 2024；为空时统计整个规划期累计） */
  yr?: string
  /** 实际取水量季度（1-4；为空时统计全年累计） */
  qtr?: string
}

// 查询各顶级行政区的取水量控制指标与实际取水总量
// 返回字段：adCd / adNm / tgtQty(控制指标) / wqQty(实际取水总量)
export function tgtList(params: TgtListParams) {
  return request({
    url: '/api/wrGwWater/tgtList',
    method: 'GET',
    data: params
  })
}
