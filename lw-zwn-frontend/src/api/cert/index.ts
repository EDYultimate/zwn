import request from '@/utils/request'

/** 证照管理查询参数（与后端 EcCertQuery 对应） */
export interface CertQuery {
  wpcCd?: string
  cert?: string
  owner?: string
  code?: string
  river?: string
  /** 行政区划编码（6 位县级及以上，只给前 4 位可覆盖该市下所有县区） */
  adCd?: string
  /** 行政区名称（旧参数，保留兼容；行政区别名检索走 adCd） */
  area?: string
  org?: string
  /** 河道内外：1 河道内 / 0 河道外 */
  inpos?: string
  /** 水源类型码值：1 地表水 / 2 地下水 / 3 其他 */
  srcs?: string[]
  amtRange?: string
  statuses?: string[]
  /** 发证状态码值：1 已发证 / 0 准予未发 */
  issued?: string
  expOnly?: boolean
}

/** 分组统计项 */
export interface CertGroup {
  name: string
  qty: number
}

/** 统计横条 / 脚注数据 */
export interface CertStat {
  certCount: number
  permitQty: number
  intakeCount: number
  riverQty: CertGroup[]
  orgCount: CertGroup[]
  riverIntake: CertGroup[]
}

/** 根据条件查询取水许可电子证照基本信息列表 */
export function getCertList(params?: CertQuery) {
  return request({
    url: '/api/ecCert/list',
    method: 'GET',
    data: params
  })
}

/** 根据取水许可证编码获取证照基本信息 */
export function getCertDetail(wpcCd: string) {
  return request({
    url: '/api/ecCert/detail',
    method: 'GET',
    data: { wpcCd }
  })
}

/** 获取取水口列表 */
export function getCertIntakes(params: { wpcCd?: string; ecBaseInfoId?: string }) {
  return request({
    url: '/api/ecCert/intakes',
    method: 'GET',
    data: params
  })
}

/** 证件数 / 许可水量 / 取水口数 */
export function getCertSummary(wpcCd?: string) {
  return request({
    url: '/api/ecCert/summary',
    method: 'GET',
    data: { wpcCd }
  })
}

/** 统计横条与脚注（汇总数 + 三组分组统计） */
export function getCertStat() {
  return request({
    url: '/api/ecCert/stat',
    method: 'GET'
  })
}

/** 新增取水许可证信息 */
export function saveCert(data: any) {
  return request({
    url: '/api/ecCert/add',
    method: 'POST',
    data
  })
}

/** 编辑取水许可证信息 */
export function updateCert(data: any) {
  return request({
    url: '/api/ecCert/update',
    method: 'POST',
    data
  })
}

/** 删除取水许可证信息 */
export function deleteCert(wpcCd: string) {
  return request({
    url: '/api/ecCert/delete',
    method: 'POST',
    params: { wpcCd }
  })
}

/**
 * 前端表单记录 → 后端 EcCertDTO。
 * 有效期 / 业务类型 / 取水口明细属于外部只读表，后端仅用于保存后回显。
 */
export function toCertPayload(rec: any) {
  return {
    wpcCd: rec?.wpcCd || '',
    cert: rec?.cert || '',
    issued: rec?.issued || '已发证',
    from: rec?.from || '',
    to: rec?.to || '',
    amt: Number(rec?.amt) || 0,
    proj: rec?.proj || '',
    owner: rec?.owner || '',
    code: rec?.code || '',
    points: rec?.pts || [],
    river: rec?.river || '',
    reach: rec?.reach || '',
    wtype: rec?.src || '',
    itype: rec?.itype || '',
    use: rec?.use || '',
    org: rec?.org || '',
    prov: rec?.prov || '',
    city: rec?.city || '',
    county: rec?.county || '',
    adCd: rec?.adCd || '',
    focus: rec?.focus || '否',
    big: rec?.big || '否',
    small: rec?.small || '否',
    biz: rec?.biz || '',
    status: rec?.status || '',
    inpos: rec?.inpos || '',
    addr: rec?.inposTxt || rec?.addr || '',
    exp: !!rec?.exp
  }
}
