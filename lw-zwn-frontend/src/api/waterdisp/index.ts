import request from '@/utils/request'

/** 最新月报年月 */
export function queryLatestMonth() {
  return request({
    url: '/api/waterdisp/queryLatestMonth',
    method: 'GET'
  })
}

/** 可选月份列表（供月份选择框） */
export function queryMonthList() {
  return request({
    url: '/api/waterdisp/queryMonthList',
    method: 'GET'
  })
}

/** 左侧线路指标卡（当月/自然年/调度年/累计供水量；永定河为生态特殊卡片） */
export function getLineCards(params?: { yr?: number; mn?: number }) {
  return request({
    url: '/api/waterdisp/getLineCards',
    method: 'GET',
    params
  })
}

/** 线路下钻明细 */
export function getLineDetail(params: { lineCd: string; yr?: number; mn?: number }) {
  return request({
    url: '/api/waterdisp/getLineDetail',
    method: 'GET',
    params
  })
}

/** 线路流域简介（正文） */
export function getLineText(params: { lineCd: string }) {
  return request({
    url: '/api/waterdisp/getLineText',
    method: 'GET',
    params
  })
}

/** 右侧日尺度数据（GWAPP 库；分组/站点展示关系由 PORTAL_SYS.ST_DIC_B 字典配置，返回 tableList/busiId/clickable） */
export function queryDsDaily(params: { wtTime: string; lineCd: string }) {
  return request({
    url: '/api/waterdisp/queryDsDaily',
    method: 'GET',
    params
  })
}

/** 日尺度数据最新有数据日期（GWAPP.APP_DAY_W_R 全表 MAX(DT)，不按流域过滤；右侧日尺度面板默认查询日） */
export function queryDsMaxTime() {
  return request({
    url: '/api/waterdisp/queryDsMaxTime',
    method: 'GET'
  })
}

/** 数据修正：批量写入 GWAPP.APP_DAY_W_R（每行 stcd/wtTime/z/w/q/awq，全空行跳过，存在则更新非空字段否则插入） */
export function updateDsDailyData(rows: Array<Record<string, string>>) {
  return request({
    url: '/api/waterdisp/updateDsDailyData',
    method: 'POST',
    data: rows
  })
}

/** 永定河左侧专属详情（通水累计/官厅以上以下当年生态水量/全线有水天数；站点分组由字典 DS_YD_ECO 配置） */
export function getYdDetail(params?: { endDate?: string }) {
  return request({
    url: '/api/waterdisp/getYdDetail',
    method: 'GET',
    params
  })
}

/** 站点月度水量序列（月度柱状图弹窗用） */
export function queryMonthRange(params: { startMonth: string; endMonth: string; stcd: string }) {
  return request({
    url: '/api/waterdisp/queryMonthRange',
    method: 'GET',
    params
  })
}

/**
 * 单站日过程线（区间逐日；站点详情弹窗折线图/表格用）
 * 返回 rows: [{ DT, Q, AWQ, Z, W, DAY_Q, DAY_Q_CALC, TOTAL_Q, TOTAL_Q_CUM, TOTAL_Q_CALC }]
 * DAY_Q/DAY_Q_CALC：库中填报值 / AWQ*8.64 计算值；TOTAL_Q/TOTAL_Q_CUM/TOTAL_Q_CALC：库中值 / 库值累加 / 计算值累加
 */
export function queryStcdDailyRange(params: { stcd: string; startDate: string; endDate: string }) {
  return request({
    url: '/api/waterdisp/queryStcdDailyRange',
    method: 'GET',
    params
  })
}

/**
 * 单站月度水量（区间逐月；站点详情统计图用）
 * 返回 rows: [{ MONTH, MONTH_Q, MONTH_Q_CALC, CUM_Q, CUM_Q_CALC }]
 */
export function queryStcdMonthRange(params: {
  stcd: string
  startMonth: string
  endMonth: string
}) {
  return request({
    url: '/api/waterdisp/queryStcdMonthRange',
    method: 'GET',
    params
  })
}

/** 单站年度取水计划（1-12月）+ 年度取水许可水量（站点详情统计图用） */
export function queryStcdYearPlan(params: { stcd: string; yr: number }) {
  return request({
    url: '/api/waterdisp/queryStcdYearPlan',
    method: 'GET',
    params
  })
}

/**
 * 单站基础信息（站名 / 站类 STTP）
 * 地图点位点击消息只带 STCD，「水库站」需据此判定（STTP='RR'）切换详情弹窗原型
 */
export function queryStcdInfo(stcd: string) {
  return request<{ stcd: string; stnm: string; sttp: string; frgrd: string }>({
    url: '/api/waterdisp/queryStcdInfo',
    method: 'GET',
    params: { stcd }
  })
}

/**
 * 单站区间累计（月/调度年/日历年；口径同老项目 queryDailyInfoRole）
 * 返回 MONTHSUM1/2、YEARSUM1/2、CALENDARYEAR1/2（后缀 1=表中 SUM(DAY_Q)，2=计算 SUM(AWQ)*8.64）
 * 及 monthStart/yearStart/calYearStart 区间起点、TOTAL_Q 库中当日累计
 */
export function queryStcdPeriodSum(params: { stcd: string; refDate: string; lineCd?: string }) {
  return request({
    url: '/api/waterdisp/queryStcdPeriodSum',
    method: 'GET',
    params
  })
}

/**
 * 线路月报数据（调水一张图标题栏「月报数据」弹窗）：WR_WSP_MN_M 月度数据 + WR_WSP_WDE_B 工程属性。
 * yr/mn 缺省=该线路最新一期；返回 yr/mn 为实际数据期（as-of 回退）
 */
export function getLineMonthReport(params: { lineCd: string; yr?: number; mn?: number }) {
  return request({
    url: '/api/waterdisp/getLineMonthReport',
    method: 'GET',
    params
  })
}

/**
 * 全景「调水」表格（永定河/滦河/引滦工程/北延供水；date=yyyy-MM-dd 缺省=最新有数据日）
 * 每行：lineCd/lineNm/periodStart/periodEnd/day（日数据）/month（月数据）/yearTotal（调度年累计），单位万m³
 */
export function panoramaTransfer(params?: { date?: string }) {
  return request({
    url: '/api/waterdisp/panoramaTransfer',
    method: 'GET',
    params
  })
}

/** 地图点位数据（坐标+鼠标移入弹窗数值；地图渲染由 GIS 组实现，本接口只供数据）
 *  riverCd：线路编码（如 "YD"），不为空时仅返回该线路点位；为空返回全部线路 */
export function mapPoints(params?: { wtTime?: string; riverCd?: string }) {
  return request({
    url: '/api/waterdisp/mapPoints',
    method: 'GET',
    params
  })
}

/** 站点/分类时间范围水量（prjCd 不传则统计分类下全部叶子站点） */
export function getRangeSum(params: {
  lineCd: string
  ctgCd: string
  prjCd?: string
  startYr: number
  startMn: number
  endYr: number
  endMn: number
}) {
  return request({
    url: '/api/waterdisp/getRangeSum',
    method: 'GET',
    params
  })
}

/** 月批复数据（WR_WSP_IQ_M.WPA_TP=3 月批复 + WR_WSP_MN_M 当月计划，按线路+年月） */
export function getIqMonthData(params: { lineCd: string; yr?: number; mn?: number }) {
  return request({
    url: '/api/waterdisp/getIqMonthData',
    method: 'GET',
    params
  })
}

/** 月批复表格单元格保存（field: MN_PLN_QTY 月报计划水量 / IQ_QTY 月下达水量，双击编辑后保存） */
export async function saveIqMonthCell(data: {
  lineCd: string
  prjCd: string
  yr: number
  mn: number
  field: 'MN_PLN_QTY' | 'IQ_QTY'
  value: number | null
}) {
  // 用原生 fetch：公共 request 封装对该 POST 的 body 序列化会丢掉字段，导致后端未落库
  const resp = await fetch('/api/waterdisp/saveIqMonthCell', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}`)
  }
  return resp.json()
}

/** 工程断面逐月调度计划执行（月批复表格点击「工程断面」弹窗）
 *  序列网格 = startYm 所在调度年 12 个月；四条序列 gsjh 供水计划 / ybjh 月报计划 / yxd 月下达 / ysy 月使用，
 *  参考线 limits.planTotal 调度期上限（年调度计划总量）/ limits.permit 取水许可线（年许可取水量） */
export function getPrjMonthSeries(params: {
  lineCd: string
  prjCd: string
  startYm: string
  endYm?: string
}) {
  return request({
    url: '/api/waterdisp/prjMonthSeries',
    method: 'GET',
    params
  })
}

/** 单站月完成水量序列（月报数据弹窗点击行滑出趋势页）：
 *  WR_WSP_MN_M 全部期次的 MN_CMP_QTY（月报的月完成水量），按年月升序 */
export function getPrjMonthComplete(params: { lineCd: string; ctgCd: string; prjCd: string }) {
  return request({
    url: '/api/waterdisp/prjMonthComplete',
    method: 'GET',
    params
  })
}

/** 调水预警（迁自老项目 water_tr 预警页签）：
 *  漳河/滹沱河 rows=[断面行]{stcd,stnm,isTotal,target,red8,blue8,red9,blue9,red,blue,yearAcc,level}；
 *  滦河 rows=[时点行]{stcd,stnm,node,target,blue,orange,yearAcc,level}；
 *  level: red/blue/orange/'-'；年累计口径=日历年 SUM(AWQ)*8.64（01-02 起，同老项目 YEARQ1） */
export function getDispatchWarn(params: { lineCd: string; date?: string }) {
  return request({
    url: '/api/waterdisp/dispatchWarn',
    method: 'GET',
    params
  })
}

/** 调水管理文件列表（按线路隔离） */
export function listMediaFiles(params: { lineCd: string; yr?: string; mn?: string }) {
  return request({
    url: '/api/waterdisp/media/list',
    method: 'GET',
    params
  })
}

/** 月报查询（报告类文件；fileCat: XB=旬报 / YB=月报 / JB=季报，空/NULL 视为月报） */
export interface ReportFileItem {
  fileCd: string
  /** 显示名（优先 FILE_TITL，无则文件名） */
  name: string
  fileName: string
  fileExt: string
  fileSize?: number | null
  /** 年份，如 '2026' */
  year: string
  /** 期内序号（旬 1-36 / 月 1-12 / 季 1-4） */
  mn: string
  /** 报告周期类型编码：XB / YB / JB，可能为空 */
  fileCat: string
  lineCd: string
}

export function listReportFiles(params: { docTp?: string; lineCd?: string; yr?: string }) {
  return request<ReportFileItem[]>({
    url: '/api/waterdisp/media/reportList',
    method: 'GET',
    params
  })
}

/** 批量上传文件（多选，仅支持 pdf/txt/excel/word） */
export function uploadMediaFiles(formData: FormData, onProgress?: (percent: number) => void) {
  return request({
    url: '/api/waterdisp/media/upload',
    method: 'POST',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e: { loaded: number; total?: number }) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
  })
}

/** 删除文件 */
export function deleteMediaFile(fileCd: string) {
  return request({
    url: '/api/waterdisp/media/delete',
    method: 'DELETE',
    params: { fileCd }
  })
}

/** 字典列表（按 COLUMN_2 顺序字段升序）
 *  附件模块用：DS_FILE_TYPE（文件类型）/ DS_FILE_SOURCE（文件来源）
 *  返回行结构：{ CODE, ID, COLUMN_1, COLUMN_2, ..., NT }
 *  - COLUMN_1：显示名（如"调度批复"）
 *  - COLUMN_2：顺序（如"1"）
 *  - NT：备注说明
 */
export function listDic(code: 'DS_FILE_TYPE' | 'DS_FILE_SOURCE' | string) {
  return request({
    url: '/api/waterdisp/dic/list',
    method: 'GET',
    params: { code }
  })
}

/** 追加字典行（仅允许 DS_FILE_TYPE / DS_FILE_SOURCE）
 *  后端自动生成 ID（TYPE_xx / SRC_xx），调用方只需传显示名等业务字段
 */
export function addDic(params: {
  code: 'DS_FILE_TYPE' | 'DS_FILE_SOURCE'
  displayNm: string
  orderSeq?: string
  nt?: string
}) {
  return request({
    url: '/api/waterdisp/dic/add',
    method: 'POST',
    params
  })
}

/** 生成月调度计划批复文档：后端按模板生成该线路全部文档（漳河 3 个 / 滹沱河 1 个），返回待下载清单 */
export function generateApprovalDoc(params: { lineCd: string; yr?: number; mn?: number }) {
  return request<Array<{ token: string; fileName: string; range: string }>>({
    url: '/api/waterdisp/approvalDoc/generate',
    method: 'GET',
    params
  })
}

/** 批复文档下载地址（一次性：下载完成后后端删除本地临时文件，同一 token 只能下一次） */
export function approvalDocDownloadUrl(token: string, fileName?: string) {
  return (
    `/api/waterdisp/approvalDoc/download?token=${encodeURIComponent(token)}` +
    (fileName ? `&fileName=${encodeURIComponent(fileName)}` : '')
  )
}

// ==================== 流域调水详情（旧项目内容块复刻：通水累计/进度/季度累计） ====================
// 数据源 PORTAL_SYS（MONTH_DATA / PERIOD / SZY_LURU_DATA），口径同旧 portal_sys
// 注：ids 用「分号」分隔，因为个别 PERIOD id 自身含逗号（如 ZYJD000018,ZYJD000016）

/** 通水累计：每 id 返回最新月/本日历年/自最早期累计，并给合计 total */
export function getLydsSums(params: { ids: string }) {
  return request<{
    tm: string
    total: { tm: string; month: number; year: number; zsd: number }
    part: Record<
      string,
      { id: string; name: string; tm: string; month: number; year: number; zsd: number }
    >
  }>({
    url: '/api/waterdisp/lydsSums',
    method: 'GET',
    params
  })
}

/** 调度年计划/完成（进度条）：PERIOD 行 */
export function getLydsPeriod(params: { ids: string }) {
  return request<Array<{ ID: string; NAME: string; PLAN: number; DONE: number; TM: string }>>({
    url: '/api/waterdisp/lydsPeriod',
    method: 'GET',
    params
  })
}

/** 季度录入数据最新一期（山西/滦河/滹沱河）：SZY_LURU_DATA 行 */
export function getLydsLuru(params: { ids: string; edt?: string }) {
  return request<Array<{ ID: string; TM: string; DATA: string | number }>>({
    url: '/api/waterdisp/lydsLuru',
    method: 'GET',
    params
  })
}

/** 永定河详情块（指标/通水累计/官厅以上以下进度）：旧 wwtr_2 + queryYdhDatasNew 复刻 */
export function getYdLyds(params: { date?: string }) {
  return request<{
    date: string
    wsdays: number | null
    wsfa: number | null
    wtDate: string | null
    month: number
    year: number
    all: number
    monthStart: string
    monthEnd: string
    planYear: string | null
    gtys: { month: number; year: number; all: number; plan: number }
    gtyx: { month: number; year: number; all: number; plan: number }
  }>({
    url: '/api/waterdisp/ydLyds',
    method: 'GET',
    params
  })
}

/** 通水累计·任意区间求和（旧「区间选择器」口径，返回万m³） */
export function getLydsRangeSum(params: { ids: string; sdt: string; edt?: string }) {
  return request<number>({
    url: '/api/waterdisp/lydsRangeSum',
    method: 'GET',
    params
  })
}

/** 按取水证归属单位统计（漳河上游 / 漳卫南 页面右侧） */
export function getUnitCertStat(params: { unit: string; year?: number }) {
  return request<{
    unit: string
    xlsCertCount: number
    certNum: number
    ownerNum: number
    sumXuke: number
    exLimit: number
    expired: number
    yuJing: number
  }>({
    url: '/api/quyongshui/unitCertStat',
    method: 'GET',
    params
  })
}
