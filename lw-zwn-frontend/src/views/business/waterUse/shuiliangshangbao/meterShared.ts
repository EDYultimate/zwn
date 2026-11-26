import { reactive } from 'vue'

/**
 * 水量复核（水量上报 / 水量审核）公共 mock 数据与共享状态
 * 复刻静态原型 pwPlans / pwActual / pwManual / pwMSubmit / pwRevMap / pwFinalUse，
 * 两个页面读写同一份 reactive 状态，保持「上报 → 审核 → 最终采用」链路联动。
 */

/** 取水口基础信息（原型 pwPlans 的静态字段） */
export interface OutletBase {
  id: string // 取水口编号
  org: string // 监管单位
  owner: string // 取水权人
  outlet: string // 取水口名称
  cert: string // 取水许可证编号
  proj: string // 取水项目
  area: string // 行政区
  amt: number // 许可水量（万m³）
  plan: number // 月批复计划（万m³）
}

/** 人工填报记录（原型 pwManual + pwManualSrc + pwManualX 合并） */
export interface ManualRec {
  vol: number // 填报水量（许可取水量，万m³）
  eco: number // 生态补水量（万m³）
  emg: number // 应急取水量（万m³）
  trade: number // 水权交易量（万m³）
  src: string // 填报来源方式
  by: string // 填报人
  time: string // 填报时间
}

/** 上报状态：0 待上报 / 1 已上报待审核 / 2 审核通过 / 3 审核不通过 */
export type ReportStatus = 0 | 1 | 2 | 3
/** 审核状态：0 待审核 / 1 审核通过 / 2 审核不通过 */
export type ReviewStatus = 0 | 1 | 2
/** 最终采用数据 */
export type FinalUse = '在线计量' | '人工填报'

/** 表格展示行 = 取水口基础信息 + 当月在线计量 / 人工填报 / 审核结果 */
export interface MeterRow extends OutletBase {
  time: string // 上报月份
  vol: number // 在线水量（计量设施自动采集，万m³）
  man: number | null // 填报水量（人工填报，未填报为 null）
  src: string // 填报来源
  acc: number // 年累计水量（万m³）
  al: AlarmType // 超警情况
  st: ReportStatus // 上报状态
  reason: string // 退回意见（审核不通过时有值）
  fin: FinalUse | '' // 最终采用数据
}

/** 告警类型：0 正常 / 1 已达计划90% / 2 超警 */
export type AlarmType = 0 | 1 | 2

/** 告警文案（数组下标即 AlarmType） */
export const ALARM_TEXT = ['正常', '已达计划90%', '超警'] as const
/** 上报状态文案（数组下标即 ReportStatus） */
export const REPORT_STATUS_TEXT = ['待上报', '已上报待审核', '审核通过', '审核不通过'] as const
/** 审核状态文案（数组下标即 ReviewStatus） */
export const REVIEW_STATUS_TEXT = ['待审核', '审核通过', '审核不通过'] as const
/** 人工填报的数据来源方式 */
export const SRC_OPTIONS = ['计量监测', '以电折水'] as const

/** 原型 mock 数据仅 2026-08 有在线计量记录 */
export const REPORT_MONTH = '2026-08'

/** 年度下拉项 */
export const YEAR_OPTIONS = ['2026']

/** 月份下拉项（2026-01 ~ 2026-12） */
export const MONTH_OPTIONS = Array.from(
  { length: 12 },
  (_, k) => `2026-${String(k + 1).padStart(2, '0')}`
)

/** 取水口基础数据（复刻原型 pwPlans） */
export const OUTLETS: OutletBase[] = [
  {
    id: 'P101',
    org: '岳城局',
    owner: '邯郸市跃峰渠灌区服务中心',
    outlet: '跃峰渠渠首闸',
    cert: 'A130421S2022-0118',
    proj: '跃峰渠灌区农业灌溉工程',
    area: '河北省 邯郸市磁县',
    amt: 9069,
    plan: 700
  },
  {
    id: 'P102',
    org: '岳城局',
    owner: '邯郸市跃峰渠管理处',
    outlet: '跃峰渠二干渠取水口',
    cert: 'A130426S2021-0075',
    proj: '跃峰渠灌区续建配套工程',
    area: '河北省 邯郸市涉县',
    amt: 22758,
    plan: 3390.9
  },
  {
    id: 'P103',
    org: '岳城局',
    owner: '安阳市殷都区跃进渠灌区服务中心',
    outlet: '跃进渠渠首闸',
    cert: 'A410522S2023-0261',
    proj: '跃进渠灌区工程',
    area: '河南省 安阳市殷都区',
    amt: 9796,
    plan: 400
  },
  {
    id: 'P104',
    org: '岳城局',
    owner: '林州市红旗渠灌区服务中心',
    outlet: '红旗渠渠首闸',
    cert: 'A410581S2022-0349',
    proj: '红旗渠灌区工程',
    area: '河南省 安阳市林州市',
    amt: 19592,
    plan: 1357.7
  },
  {
    id: 'P105',
    org: '邢衡局',
    owner: '迁西顺发铁选有限公司',
    outlet: '顺发铁选厂取水口',
    cert: 'A130227S2024-0017',
    proj: '顺发铁选生产供水工程',
    area: '河北省 唐山市迁西县',
    amt: 18,
    plan: 1.5
  },
  {
    id: 'P106',
    org: '邢衡局',
    owner: '迁西六兴利铁选有限公司',
    outlet: '六兴利铁选厂取水口',
    cert: 'A130227S2024-0018',
    proj: '六兴利铁选生产供水工程',
    area: '河北省 唐山市迁西县',
    amt: 12.65,
    plan: 1.05
  },
  {
    id: 'P107',
    org: '水闸局',
    owner: '迁西福珍全矿业有限公司老铁选厂',
    outlet: '福珍全老铁选厂取水口',
    cert: 'A130227S2023-0092',
    proj: '福珍全矿业老铁选厂供水工程',
    area: '河北省 唐山市迁西县',
    amt: 35,
    plan: 3.2
  },
  {
    id: 'P108',
    org: '水闸局',
    owner: '迁西福珍全矿业有限公司仁和铁选厂',
    outlet: '福珍全仁和铁选厂取水口',
    cert: 'A130227S2023-0093',
    proj: '福珍全矿业仁和铁选厂供水工程',
    area: '河北省 唐山市迁西县',
    amt: 16.2,
    plan: 1.35
  }
]

/** 监管单位下拉项（由取水口数据中的单位去重生成） */
export const ORG_OPTIONS = ['全部', ...new Set(OUTLETS.map((o) => o.org))]

/** 在线计量水量（复刻原型 pwActual，仅 2026-08 有值） */
const ONLINE_VOL: Record<string, number> = {
  P101: 466.3,
  P102: 3229,
  P103: 346.4,
  P104: 999.7,
  P105: 1.6,
  P106: 1.1,
  P107: 3.6,
  P108: 0.9
}

/** 年累计水量（复刻原型 pwSum8，1-8 月在线计量累计） */
const ACC_VOL: Record<string, number> = {
  P101: 3742.8,
  P102: 11138.3,
  P103: 5285.6,
  P104: 8765.6,
  P105: 9.8,
  P106: 7,
  P107: 28.4,
  P108: 8.5
}

/** 记录键：取水口编号|月份（对应原型 "id|YYYY-MM"） */
export function keyOf(id: string, month: string): string {
  return `${id}|${month}`
}

/** 千分位格式化（与原型 pwFmt 一致） */
export function fmt(x: number | null | undefined): string {
  return Number(x ?? 0).toLocaleString()
}

/** 保留 1 位小数 */
export function round1(x: number): number {
  return Math.round(x * 10) / 10
}

/** 超警判定（复刻原型 pwAlOf）：超计划 → 超警；达计划 90% → 预警 */
export function alarmOf(vol: number, plan: number): AlarmType {
  if (vol > plan) {
    return 2
  }
  if (plan > 0 && vol >= plan * 0.9) {
    return 1
  }
  return 0
}

/** 当前时间（原型 pwNowStr） */
function nowStr(): string {
  const d = new Date()
  const z = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}`
}

/** 在线计量水量（未采集返回 null） */
export function onlineVolOf(id: string, month: string): number | null {
  return month === REPORT_MONTH ? (ONLINE_VOL[id] ?? null) : null
}

/** 人工填报记录 */
export function manualRecOf(id: string, month: string): ManualRec | null {
  return meterState.manual[keyOf(id, month)] ?? null
}

/** 共享状态（两个页面读写同一份数据） */
export const meterState = reactive({
  /** id|月份 → 人工填报记录 */
  manual: {} as Record<string, ManualRec>,
  /** id|月份 → 人工填报数据是否已上报 */
  submit: {} as Record<string, boolean>,
  /** id|月份 → 1 审核通过 / 2 审核不通过（缺省待审核） */
  review: {} as Record<string, 1 | 2>,
  /** id|月份 → 退回意见 */
  reason: {} as Record<string, string>,
  /** id|月份 → 最终采用数据 */
  finalUse: {} as Record<string, FinalUse>
})

/** 初始化 2026-08 人工填报演示数据（与在线计量略有偏差，复刻原型算法） */
OUTLETS.forEach((o, i) => {
  const vol = ONLINE_VOL[o.id]
  if (vol === undefined) {
    return
  }
  const man = round1(vol * (1 + ((i % 3) - 1) * 0.035))
  meterState.manual[keyOf(o.id, REPORT_MONTH)] = {
    vol: man,
    eco: 0,
    emg: 0,
    trade: 0,
    src: SRC_OPTIONS[i % SRC_OPTIONS.length],
    by: '水政水资源科 值班员',
    time: '2026-09-02 09:30'
  }
})

/** 上报状态（复刻原型 renderPwMeter 的状态推导） */
export function reportStatusOf(id: string, month: string): ReportStatus {
  const k = keyOf(id, month)
  if (meterState.review[k] === 1) {
    return 2
  }
  if (meterState.review[k] === 2) {
    return 3
  }
  return meterState.submit[k] ? 1 : 0
}

/** 审核状态 */
export function reviewStatusOf(id: string, month: string): ReviewStatus {
  return meterState.review[keyOf(id, month)] ?? 0
}

/** 当月复核行（仅显示在线计量已采集的取水口，复刻原型 r.vol != null 过滤） */
export function rowsOf(month: string): MeterRow[] {
  const list: MeterRow[] = []
  OUTLETS.forEach((o) => {
    const vol = onlineVolOf(o.id, month)
    if (vol === null) {
      return
    }
    const k = keyOf(o.id, month)
    const man = meterState.manual[k]
    list.push({
      ...o,
      time: month,
      vol,
      man: man ? man.vol : null,
      src: man ? man.src : '—',
      acc: ACC_VOL[o.id] ?? 0,
      al: alarmOf(vol, o.plan),
      st: reportStatusOf(o.id, month),
      reason: meterState.reason[k] ?? '',
      fin: meterState.finalUse[k] ?? ''
    })
  })
  return list
}

/** 保存月度水量确认单填报（新增 / 覆盖当月人工填报） */
export function saveManual(
  id: string,
  month: string,
  rec: Pick<ManualRec, 'vol' | 'eco' | 'emg' | 'trade' | 'src'>
) {
  meterState.manual[keyOf(id, month)] = {
    vol: rec.vol,
    eco: rec.eco,
    emg: rec.emg,
    trade: rec.trade,
    src: rec.src,
    by: '水政水资源科 值班员',
    time: nowStr()
  }
}

/** 上报单条（审核不通过后重新上报会清空退回状态） */
export function submitRow(id: string, month: string) {
  const k = keyOf(id, month)
  meterState.submit[k] = true
  delete meterState.review[k]
  delete meterState.reason[k]
}

/** 一键上报：本月未上报 / 审核不通过的记录全部置为已上报待审核 */
export function batchSubmit(month: string): { n: number; done: number } {
  let n = 0
  let done = 0
  rowsOf(month).forEach((r) => {
    const k = keyOf(r.id, month)
    if (!meterState.submit[k] || meterState.review[k] === 2) {
      meterState.submit[k] = true
      delete meterState.review[k]
      delete meterState.reason[k]
      n++
    } else {
      done++
    }
  })
  return { n, done }
}

/** 删除当月人工填报数据（连带上报 / 审核 / 最终采用状态） */
export function removeManual(id: string, month: string) {
  const k = keyOf(id, month)
  delete meterState.manual[k]
  delete meterState.submit[k]
  delete meterState.review[k]
  delete meterState.reason[k]
  delete meterState.finalUse[k]
}

/** 审核通过 */
export function approveReview(id: string, month: string) {
  const k = keyOf(id, month)
  meterState.review[k] = 1
  delete meterState.reason[k]
}

/** 审核不通过（退回重报） */
export function rejectReview(id: string, month: string, reason: string) {
  const k = keyOf(id, month)
  meterState.review[k] = 2
  meterState.reason[k] = reason
}

/** 撤销审核状态 */
export function resetReview(id: string, month: string) {
  const k = keyOf(id, month)
  delete meterState.review[k]
  delete meterState.reason[k]
}

/** 确定最终采用数据 */
export function setFinalUse(id: string, month: string, use: FinalUse) {
  meterState.finalUse[keyOf(id, month)] = use
}

/** 取消最终采用数据 */
export function clearFinalUse(id: string, month: string) {
  delete meterState.finalUse[keyOf(id, month)]
}

/** 月份下标（1-12） */
function monthIndex(month: string): number {
  return Number(month.slice(5))
}

/**
 * 年度累计（万m³）：1 ~ 当月的人工填报累计
 * @param current 传当月待保存的填报值；不传则取已保存记录
 */
export function cumulativeOf(
  id: string,
  month: string,
  current?: Pick<ManualRec, 'vol' | 'eco' | 'emg' | 'trade'>
) {
  const mi = monthIndex(month)
  let c1 = 0
  let c2 = 0
  let c3 = 0
  let c4 = 0
  for (let m = 1; m < mi; m++) {
    const rec = manualRecOf(id, `2026-${String(m).padStart(2, '0')}`)
    c1 += rec?.vol ?? 0
    c2 += rec?.eco ?? 0
    c3 += rec?.emg ?? 0
    c4 += rec?.trade ?? 0
  }
  const cur = current ?? manualRecOf(id, month)
  c1 += cur?.vol ?? 0
  c2 += cur?.eco ?? 0
  c3 += cur?.emg ?? 0
  c4 += cur?.trade ?? 0
  return { c1: round1(c1), c2: round1(c2), c3: round1(c3), c4: round1(c4) }
}

/** 月度水量确认单数据（复刻原型 pwCfmData） */
export function confirmDocData(id: string, month: string) {
  const base = OUTLETS.find((o) => o.id === id)
  if (!base) {
    return null
  }
  const rec = manualRecOf(id, month)
  const cum = cumulativeOf(id, month)
  return {
    year: month.slice(0, 4),
    month: monthIndex(month),
    outlet: base.outlet,
    owner: base.owner,
    amt: base.amt,
    man: round1(rec?.vol ?? 0),
    eco: round1(rec?.eco ?? 0),
    emg: round1(rec?.emg ?? 0),
    trade: round1(rec?.trade ?? 0),
    c1: cum.c1,
    c2: cum.c2,
    c3: cum.c3,
    c4: cum.c4
  }
}
