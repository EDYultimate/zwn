<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { NModal } from 'naive-ui'
import { useECharts } from '@/hooks/web/useECharts'
import { queryStcdDailyRange, queryStcdMonthRange, queryStcdYearPlan } from '@/api/waterdisp'
import ChartTableToggle from './ChartTableToggle.vue'
import iconQ8 from '@/assets/img/diaoshui/q.png'
import iconZ8 from '@/assets/img/diaoshui/z.png'
import iconAwq from '@/assets/img/diaoshui/awq.png'
import iconW from '@/assets/img/diaoshui/w.png'
import iconDayQ from '@/assets/img/diaoshui/dayq.png'

// 站点详情弹窗（设计稿：跃进渠详情信息 / 东榆林水库详情信息）
// ★ 数据源：queryStcdDailyRange（日过程线）/ queryStcdMonthRange（月度水量）/ queryStcdYearPlan（年度计划+许可）
//   库值与计算值（AWQ*8.64 及累加）在接口中并存，可按需切换
// 两套原型按站性质切换：
//   - 非永定河河道站（STTP≠RR 且非永定河线路）→ 跃进渠详情信息原型
//   - 永定河线路站 → 东榆林水库原型（永定河河道站无「水库蓄水量」tab）
//   - 水库站（STTP=RR，如东榆林）→ 东榆林水库原型（含水库蓄水量 tab）
type Row = Record<string, any>

const show = defineModel<boolean>('show', { default: false })

const props = defineProps<{
  /** 被点击的表格行（STNM/STCD/qyzt/awqyzt/dayqyzt/STTP 等） */
  row?: Row | null
  /** 面板当前查询日期 yyyy-MM-dd */
  wtTime?: string
  /** 线路编码（YD=永定河 / ZH=漳河 / HT=滹沱河 等） */
  lineCd?: string
  /** 线路名称 */
  lineNm?: string
  /** 点击行所在分组名（水库/河道分组） */
  groupNm?: string
  /**
   * 内嵌模式：由父级 dialog 承载，自身不渲染 n-modal。
   * 关闭按钮改为 emit('close')，交由父级做滑动切回（避免弹窗叠加重合）。
   */
  inline?: boolean
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

/** 外层容器：内嵌时为普通 div（避免弹窗套弹窗），否则为 n-modal */
const wrapperTag = computed(() => (props.inline ? 'div' : NModal))
const wrapperProps = computed(() =>
  props.inline
    ? { class: 'sdd-inline' }
    : {
        show: show.value,
        'onUpdate:show': (v: boolean) => (show.value = v),
        autoFocus: false
      }
)

/** 关闭：内嵌模式交父级处理（滑动回列表），独立模式直接关弹窗 */
function onClose() {
  if (props.inline) {
    emit('close')
  } else {
    show.value = false
  }
}

const stnm = computed(() => props.row?.STNM || '')
const title = computed(() => `${stnm.value}详情信息`)

function fmt(v: any) {
  return v == null || v === '' ? '-' : v
}

// ==================== 原型判定 ====================
// 站类：RR=水库（来自 GWAPP.APP_STBPRP_B.STTP，queryDsDaily 行透传）
const isReservoir = computed(
  () =>
    String(props.row?.STTP || '').toUpperCase() === 'RR' || /水库/.test(String(props.groupNm || ''))
)
// 永定河线路（lineCd=YD 或线路名含永定河）
const isYdLine = computed(
  () =>
    String(props.lineCd || '').toUpperCase() === 'YD' || /永定河/.test(String(props.lineNm || ''))
)
// 是否东榆林水库原型：水库站 或 永定河线路站
const useReservoirProto = computed(() => isReservoir.value || isYdLine.value)
// 水库蓄水量 tab：仅水库站显示（永定河河道站不显示）
const showStorageTab = computed(() => isReservoir.value)

// ==================== 实时信息（随类型/线路/tab 变化，行内最多 3 个） ====================
interface RtItem {
  key: string
  label: string
  unit: string
  icon: string
  val: string | number
  /** 前缀文案（如"增加/减少"），普通字号渲染 */
  pre?: string
}

// ==================== 接口数据（真实数据源） ====================
// 过程线/表格：单站日过程线（区间逐日）
const dailyRows = ref<Record<string, any>[]>([])
// 统计信息：单站月度水量（区间逐月）+ 单站年度计划/取水许可水量
const monthRows = ref<Record<string, any>[]>([])
const planMap = ref<Record<string, number | null>>({})
const permitQ = ref<number | null>(null)
const dataLoading = ref(false)

// 与年初蓄水量对比：区间内首末蓄水量之差（真实数据；不足两天时为 -）
const rsvExtra = computed(() => {
  const ws = dailyRows.value.map((r) => Number(r.W)).filter((v) => !Number.isNaN(v))
  if (ws.length < 2) {
    return { diff: '-', trend: '', has: false }
  }
  const d = ws[ws.length - 1] - ws[0]
  return { diff: Math.abs(d).toFixed(2), trend: d >= 0 ? '增加' : '减少', has: true }
})
// 水库原型当前 tab（水位流量 / 累计补水量 / 水库蓄水量）
// 必须在 rtItems 之前声明（rtItems computed 依赖它，setup 中 watch 首次求值即需可访问）
const rsvTab = ref<'WL' | 'LB' | 'W'>('WL')

// 过程线区间 / 统计区间（需在 rtItems 之前声明，实时信息「累计水量」依赖区间）
const processRange = ref<[string, string] | null>(null)
const statRange = ref<[string, string] | null>(null)

// 累计补水量 tab：累计水量 = 区间内逐日累加末值（接口计算值 TOTAL_Q_CALC，首日 = 当天日过水量）
const rsvCumLast = computed(() => {
  const rows = dailyRows.value
  if (!rows.length) {
    return '-'
  }
  const last = rows[rows.length - 1]
  const v = last.TOTAL_Q_CALC != null ? last.TOTAL_Q_CALC : last.TOTAL_Q_CUM
  return v == null ? '-' : Number(v).toFixed(2)
})

const rtItems = computed<RtItem[]>(() => {
  const r = props.row || {}
  // 跃进渠原型（非永定河河道站）：固定 3 项 8时流量/日均流量/日过水量
  if (!useReservoirProto.value) {
    return [
      { key: 'qyzt', label: '8时流量', unit: 'm³/s', icon: iconQ8, val: fmt(r.qyzt) },
      { key: 'awqyzt', label: '日均流量', unit: 'm³/s', icon: iconAwq, val: fmt(r.awqyzt) },
      { key: 'dayqyzt', label: '日过水量', unit: 'm³', icon: iconDayQ, val: fmt(r.dayqyzt) }
    ]
  }
  // 东榆林水库原型：实时信息随 tab 变化
  if (rsvTab.value === 'WL') {
    // 水位流量 tab：8时水位 / 8时流量 / 日均流量
    return [
      { key: 'zyzt', label: '8时水位', unit: 'm', icon: iconZ8, val: fmt(r.zyzt) },
      { key: 'qyzt', label: '8时流量', unit: 'm³/s', icon: iconQ8, val: fmt(r.qyzt) },
      { key: 'awqyzt', label: '日均流量', unit: 'm³/s', icon: iconAwq, val: fmt(r.awqyzt) }
    ]
  }
  if (rsvTab.value === 'LB') {
    // 累计补水量 tab：日过水量 / 累计水量（累计首日 = 当天日过水量，之后累加）
    return [
      { key: 'dayqyzt', label: '日过水量', unit: 'm³', icon: iconDayQ, val: fmt(r.dayqyzt) },
      { key: 'cumQ', label: '累计水量', unit: '万m³', icon: iconDayQ, val: rsvCumLast.value }
    ]
  }
  // 水库蓄水量 tab：水库蓄水量 / 与年初蓄水量对比
  return [
    { key: 'wyzt', label: '水库蓄水量', unit: '万m³', icon: iconW, val: fmt(r.wyzt) },
    {
      key: 'yearDiff',
      label: '与年初蓄水量对比',
      unit: '万m³',
      icon: iconW,
      val: rsvExtra.value.diff,
      pre: rsvExtra.value.trend
    }
  ]
})

// ==================== 实时信息数值宽度统一 ====================
// 卡片宽度由内容自适应（不再按最宽卡片拉伸，去掉多余空白）；
// 数值段宽度取当前卡片中最宽数值的宽度并右对齐，单位紧跟其后，数值位数变化时卡片不跳动。
const NUM_FONT = '700 20px Arial, sans-serif'
let numCtx: CanvasRenderingContext2D | null = null

function measureNumWidth(text: string) {
  if (!numCtx) {
    numCtx = document.createElement('canvas').getContext('2d')
  }
  if (!numCtx) {
    return 0
  }
  numCtx.font = NUM_FONT
  return numCtx.measureText(text).width
}

const rtNumW = computed(() => {
  const w = Math.max(0, ...rtItems.value.map((i) => measureNumWidth(String(i.val))))
  return w ? Math.ceil(w) : null
})
const rtNumStyle = computed(() => (rtNumW.value ? { width: `${rtNumW.value}px` } : undefined))

// ==================== 时间范围 ====================
function toDateStr(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

/** 默认过程线范围：上个月今天 ~ 今天（锚点为面板查询日期，缺省取系统当天） */
function lastMonthTodayRange(base?: string): [string, string] {
  const end = base ? new Date(base) : new Date()
  const start = new Date(end)
  start.setMonth(start.getMonth() - 1)
  return [toDateStr(start), toDateStr(end)]
}

/**
 * 调度年区间（口径参照老项目 ToolUtils.getYearStartStr）：起点统一为 02 日（库中数据为前一天），
 * 终点取查询日（不延伸到未来）。lineCd 映射：
 *  - 永定河(YD)：按日历年（01-02 ~ 今天）
 *  - 南水北调(NSBD)：11-02 ~ 今天
 *  - 引滦/漳河/引黄入冀/滦河/滹沱河等：07-02 ~ 今天
 */
function getDispatchYearRange(lineCd: string, base?: string): [string, string] {
  const d = base ? new Date(base) : new Date()
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  const end = toDateStr(d)
  const code = String(lineCd || '').toUpperCase()
  if (code === 'YD') {
    return [`${y}-01-02`, end]
  }
  if (code === 'NSBD') {
    return [m >= 11 ? `${y}-11-02` : `${y - 1}-11-02`, end]
  }
  return [m >= 7 ? `${y}-07-02` : `${y - 1}-07-02`, end]
}

/** 区间内月份列表 */
function monthsBetween(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  const arr: { ym: string; label: string }[] = []
  const cur = new Date(s.getFullYear(), s.getMonth(), 1)
  const last = new Date(e.getFullYear(), e.getMonth(), 1)
  while (cur <= last) {
    arr.push({
      ym: `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}`,
      label: `${cur.getMonth() + 1}月`
    })
    cur.setMonth(cur.getMonth() + 1)
  }
  return arr
}

const rtDate = computed(() => {
  const t = String(props.row?.TM || props.wtTime || '')
  if (!t) {
    return ''
  }
  const [y, m, d] = t.substring(0, 10).split('-')
  return `${y}-${Number(m)}-${Number(d)}`
})

// 统计页签：日历年 / 调度年
const statTab = ref<'DLN' | 'DDN'>('DLN')
const statChartTitle = computed(
  () => `${stnm.value}${statTab.value === 'DLN' ? '日历年' : '调度年'}水量过程`
)

// ==================== 图表 / 表格切换 ====================
type ChartMode = 'chart' | 'table'
const modeProcess = ref<ChartMode>('chart')
const modeStat = ref<ChartMode>('chart')
const modeRsvWl = ref<ChartMode>('chart')
const modeRsvLb = ref<ChartMode>('chart')
const modeRsvW = ref<ChartMode>('chart')

// 水库原型：切换按钮随当前 tab 定位到对应状态
const rsvMode = computed<ChartMode>({
  get: () =>
    rsvTab.value === 'WL'
      ? modeRsvWl.value
      : rsvTab.value === 'LB'
        ? modeRsvLb.value
        : modeRsvW.value,
  set: (v) => {
    if (rsvTab.value === 'WL') {
      modeRsvWl.value = v
    } else if (rsvTab.value === 'LB') {
      modeRsvLb.value = v
    } else {
      modeRsvW.value = v
    }
  }
})

// 表格数据（与图表同源，切换表格时展示）
const tableProcess = ref<Record<string, any>[]>([])
const tableStat = ref<Record<string, any>[]>([])
const tableRsvWl = ref<Record<string, any>[]>([])
const tableRsvLb = ref<Record<string, any>[]>([])
const tableRsvW = ref<Record<string, any>[]>([])

const processCols = [
  { title: '日期', key: 'date', align: 'center' as const, width: 130 },
  { title: '8时流量(m³/s)', key: 'flow', align: 'center' as const },
  { title: '日水量(万m³)', key: 'dayQ', align: 'center' as const },
  { title: '累计水量(万m³)', key: 'cum', align: 'center' as const }
]
const statCols = [
  { title: '月份', key: 'month', align: 'center' as const },
  { title: '月取水计划(万m³)', key: 'plan', align: 'center' as const },
  { title: '月累计水量(万m³)', key: 'actual', align: 'center' as const },
  { title: '年度取水许可水量(万m³)', key: 'permit', align: 'center' as const },
  { title: '年度累计水量(万m³)', key: 'cum', align: 'center' as const }
]
const rsvWlCols = [
  { title: '日期', key: 'date', align: 'center' as const, width: 130 },
  { title: '水位(m)', key: 'z', align: 'center' as const },
  { title: '8时流量(m³/s)', key: 'q', align: 'center' as const }
]
const rsvLbCols = [
  { title: '日期', key: 'date', align: 'center' as const, width: 130 },
  { title: '日过水量(万m³)', key: 'dayQ', align: 'center' as const },
  { title: '累计水量(万m³)', key: 'cum', align: 'center' as const }
]
const rsvWCols = [
  { title: '日期', key: 'date', align: 'center' as const, width: 130 },
  { title: '蓄水量(万m³)', key: 'w', align: 'center' as const }
]

// ==================== 接口加载（真实数据） ====================
/** 日期展示：2026-08-07 → 26/08/07 */
function fmtDayLabel(dt: string) {
  const d = String(dt || '').substring(0, 10)
  return d.length === 10 ? `${d.substring(2, 4)}/${d.substring(5, 7)}/${d.substring(8, 10)}` : d
}

/** 取日过程线（单站区间逐日） */
async function loadDaily() {
  const stcd = String(props.row?.STCD || '')
  if (!stcd || !processRange.value) {
    dailyRows.value = []
    return
  }
  try {
    const res: any = await queryStcdDailyRange({
      stcd,
      startDate: processRange.value[0],
      endDate: processRange.value[1]
    })
    dailyRows.value = res?.data?.rows || []
  } catch (e) {
    console.warn('queryStcdDailyRange failed', e)
    dailyRows.value = []
  }
}

/** 取月度水量 + 年度计划/取水许可水量（单站区间逐月，跨年时按年分别取计划） */
async function loadMonth() {
  const stcd = String(props.row?.STCD || '')
  const range = statRange.value
  if (!stcd || !range) {
    monthRows.value = []
    planMap.value = {}
    permitQ.value = null
    return
  }
  try {
    const res: any = await queryStcdMonthRange({
      stcd,
      startMonth: range[0].substring(0, 7),
      endMonth: range[1].substring(0, 7)
    })
    monthRows.value = res?.data?.rows || []
  } catch (e) {
    console.warn('queryStcdMonthRange failed', e)
    monthRows.value = []
  }
  const years = Array.from(
    new Set(monthsBetween(range[0], range[1]).map((m) => Number(m.ym.substring(0, 4))))
  )
  const pmap: Record<string, number | null> = {}
  let permit: number | null = null
  for (const yr of years) {
    try {
      const pr: any = await queryStcdYearPlan({ stcd, yr })
      ;(pr?.data?.rows || []).forEach((r: any) => {
        pmap[`${yr}-${String(r.MONTH).padStart(2, '0')}`] = r.PLAN_Q
      })
      if (pr?.data?.PERMIT_Q != null) {
        permit = pr.data.PERMIT_Q
      }
    } catch (e) {
      console.warn('queryStcdYearPlan failed', e)
    }
  }
  planMap.value = pmap
  permitQ.value = permit
}

/** 日过程线数据（来自接口；库中值缺失时用计算值兜底） */
function buildDaily() {
  const rows = dailyRows.value
  const days = rows.map((r) => fmtDayLabel(r.DT))
  const flows = rows.map((r) => r.Q)
  const dayQs = rows.map((r) => (r.DAY_Q_CALC != null ? r.DAY_Q_CALC : r.DAY_Q))
  const cumQs = rows.map((r) => (r.TOTAL_Q_CALC != null ? r.TOTAL_Q_CALC : r.TOTAL_Q_CUM))
  const zs = rows.map((r) => r.Z)
  const ws = rows.map((r) => r.W)
  return { rows, days, flows, dayQs, cumQs, zs, ws, qs: flows }
}

/** 月度统计数据（来自接口） */
function buildStat() {
  const range = statRange.value
  if (!range) {
    return { months: [], ms: [], plan: [], actual: [], cum: [], permit: null, total: 0 }
  }
  const ms = monthsBetween(range[0], range[1])
  const byMonth: Record<string, any> = {}
  monthRows.value.forEach((r) => (byMonth[String(r.MONTH)] = r))
  return {
    ms,
    months: ms.map((m) => m.label),
    plan: ms.map((m) => planMap.value[m.ym] ?? null),
    actual: ms.map((m) => byMonth[m.ym]?.MONTH_Q_CALC ?? null),
    cum: ms.map((m) => byMonth[m.ym]?.CUM_Q_CALC ?? null),
    permit: permitQ.value,
    total: monthRows.value.length
      ? (monthRows.value[monthRows.value.length - 1]?.CUM_Q_CALC ?? 0)
      : 0
  }
}

// ==================== 图表 ====================
const processRef = ref<HTMLDivElement | null>(null)
const statRef = ref<HTMLDivElement | null>(null)
const donutRef = ref<HTMLDivElement | null>(null)
const rsvWlRef = ref<HTMLDivElement | null>(null)
const rsvWRef = ref<HTMLDivElement | null>(null)
const rsvLbRef = ref<HTMLDivElement | null>(null)
const {
  setOptions: setProcess,
  disposeInstance: disposeProcess,
  resize: resizeProcess
} = useECharts(processRef as Ref<HTMLDivElement>, 'light')
const {
  setOptions: setStat,
  disposeInstance: disposeStat,
  resize: resizeStat
} = useECharts(statRef as Ref<HTMLDivElement>, 'light')
const { setOptions: setDonut, disposeInstance: disposeDonut } = useECharts(
  donutRef as Ref<HTMLDivElement>,
  'light'
)
const {
  setOptions: setRsvWl,
  disposeInstance: disposeRsvWl,
  resize: resizeRsvWl
} = useECharts(rsvWlRef as Ref<HTMLDivElement>, 'light')
const {
  setOptions: setRsvW,
  disposeInstance: disposeRsvW,
  resize: resizeRsvW
} = useECharts(rsvWRef as Ref<HTMLDivElement>, 'light')
const {
  setOptions: setRsvLb,
  disposeInstance: disposeRsvLb,
  resize: resizeRsvLb
} = useECharts(rsvLbRef as Ref<HTMLDivElement>, 'light')

// 年度累计水量 / 年度取水（来自接口，供左上统计文字与环形图）
const yearCum = ref<string | number>(85)
const yearPlan = ref<string | number>(100)

function renderProcess() {
  if (!processRange.value) {
    return
  }
  const { rows, days, flows, dayQs, cumQs } = buildDaily()
  // 表格数据（与折线同源）
  tableProcess.value = rows.map((r, i) => ({
    date: String(r.DT || '').substring(0, 10),
    flow: flows[i],
    dayQ: dayQs[i],
    cum: cumQs[i]
  }))
  if (modeProcess.value !== 'chart') {
    return
  }
  setProcess({
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#e0e0e0',
      textStyle: { color: '#333', fontSize: 12 }
    },
    legend: {
      top: 0,
      right: 120,
      itemWidth: 16,
      itemHeight: 8,
      textStyle: { color: '#323232', fontSize: 12 },
      data: ['8时流量', '日水量', '累计水量']
    },
    grid: { left: 50, right: 56, top: 34, bottom: 30 },
    xAxis: {
      type: 'category',
      data: days,
      boundaryGap: false,
      axisLabel: { color: '#244165', fontSize: 11 },
      axisLine: { lineStyle: { color: '#7BACDE' } },
      axisTick: { show: false }
    },
    yAxis: [
      {
        type: 'value',
        name: '流量（m³/s）',
        nameTextStyle: { color: '#6faf9f', fontSize: 12 },
        // 刻度随数据自适应（不再固定 0~5）
        scale: true,
        axisLabel: { color: '#244165', fontSize: 11 },
        splitLine: { lineStyle: { type: 'dashed', color: '#94B9E5' } }
      },
      {
        type: 'value',
        name: '水量（万m³）',
        nameTextStyle: { color: '#006bc9', fontSize: 12 },
        min: 0,
        axisLabel: { color: '#244165', fontSize: 11 },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '8时流量',
        type: 'line',
        data: flows,
        yAxisIndex: 0,
        symbol: 'none',
        lineStyle: { color: '#f8ac39', width: 1.5, type: 'dashed' },
        itemStyle: { color: '#f8ac39' }
      },
      {
        name: '日水量',
        type: 'line',
        data: dayQs,
        yAxisIndex: 1,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#4f96ec', width: 2 },
        itemStyle: { color: '#4f96ec' }
      },
      {
        name: '累计水量',
        type: 'line',
        // 累计水量：首日 = 当天日水量，之后逐日累加（真实值）
        data: cumQs,
        yAxisIndex: 1,
        symbol: 'none',
        lineStyle: { color: '#86cc24', width: 2 },
        itemStyle: { color: '#86cc24' }
      }
    ]
  })
}

function renderStat() {
  const { months, plan, actual, cum, permit } = buildStat()
  yearCum.value = cum.length ? (cum[cum.length - 1] ?? 0) : 0
  yearPlan.value = permit ?? 0 // 年度取水（取水许可水量）
  // 表格数据（与折线同源）
  tableStat.value = months.map((m, i) => ({
    month: m,
    plan: plan[i],
    actual: actual[i],
    permit,
    cum: cum[i]
  }))
  renderDonut()
  if (modeStat.value !== 'chart') {
    return
  }
  setStat({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#fff',
      borderColor: '#e0e0e0',
      textStyle: { color: '#333', fontSize: 12 }
    },
    grid: { left: 46, right: 76, top: 46, bottom: 26 },
    legend: {
      top: 0,
      right: 120,
      itemWidth: 14,
      itemHeight: 8,
      itemGap: 10,
      textStyle: { color: '#323232', fontSize: 12 },
      data: ['月取水计划', '月累计水量', '年度取水许可水量', '年度累计水量']
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLabel: { color: '#244165', fontSize: 11 },
      axisLine: { lineStyle: { color: '#7BACDE' } },
      axisTick: { show: false }
    },
    yAxis: [
      {
        type: 'value',
        name: '月水量（万m³）',
        nameTextStyle: { color: '#244165', fontSize: 12 },
        axisLabel: { color: '#244165', fontSize: 11 },
        splitLine: { lineStyle: { type: 'dashed', color: '#94B9E5' } }
      },
      {
        type: 'value',
        name: '年度累计水量（万m³）',
        nameTextStyle: { color: '#244165', fontSize: 12 },
        axisLabel: { color: '#244165', fontSize: 11 },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '月取水计划',
        type: 'bar',
        data: plan,
        yAxisIndex: 0,
        barWidth: 10,
        itemStyle: { color: '#86cc24', borderRadius: [2, 2, 0, 0] }
      },
      {
        name: '月累计水量',
        type: 'bar',
        data: actual,
        yAxisIndex: 0,
        barWidth: 10,
        itemStyle: { color: '#fabd1a', borderRadius: [2, 2, 0, 0] }
      },
      {
        name: '年度取水许可水量',
        type: 'line',
        data: months.map(() => permit),
        yAxisIndex: 1,
        symbol: 'none',
        lineStyle: { color: '#e64545', width: 1.5 },
        itemStyle: { color: '#e64545' }
      },
      {
        name: '年度累计水量',
        type: 'line',
        data: cum,
        yAxisIndex: 1,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#4f96ec', width: 2 },
        itemStyle: { color: '#4f96ec' }
      }
    ]
  })
}

function renderDonut() {
  const used = Number(yearCum.value) || 0
  const total = Number(yearPlan.value) || 100
  setDonut({
    tooltip: { show: false },
    series: [
      {
        type: 'pie',
        radius: ['68%', '88%'],
        center: ['50%', '50%'],
        silent: true,
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: used, name: '年度累计水量', itemStyle: { color: '#4c95ec' } },
          { value: Math.max(0, total - used), name: '剩余', itemStyle: { color: '#e6e6e6' } }
        ]
      }
    ]
  })
}

// ==================== 水库原型：水位流量过程线 ====================
function renderRsvWl() {
  if (!processRange.value) {
    return
  }
  const { rows, days, zs, qs } = buildDaily()
  tableRsvWl.value = rows.map((r, i) => ({
    date: String(r.DT || '').substring(0, 10),
    z: zs[i],
    q: qs[i]
  }))
  if (modeRsvWl.value !== 'chart') {
    return
  }
  setRsvWl({
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#e0e0e0',
      textStyle: { color: '#333', fontSize: 12 }
    },
    legend: {
      top: 0,
      right: 120,
      itemWidth: 16,
      itemHeight: 8,
      textStyle: { color: '#323232', fontSize: 12 },
      data: ['水位', '8时流量']
    },
    grid: { left: 50, right: 56, top: 34, bottom: 30 },
    xAxis: {
      type: 'category',
      data: days,
      boundaryGap: false,
      axisLabel: { color: '#244165', fontSize: 11 },
      axisLine: { lineStyle: { color: '#7BACDE' } },
      axisTick: { show: false }
    },
    yAxis: [
      {
        type: 'value',
        name: '水位（m）',
        nameTextStyle: { color: '#006bc9', fontSize: 12 },
        // 刻度随数据自适应（不再固定 0~20）
        scale: true,
        axisLabel: { color: '#244165', fontSize: 11 },
        splitLine: { lineStyle: { type: 'dashed', color: '#94B9E5' } }
      },
      {
        type: 'value',
        name: '流量（m³/s）',
        nameTextStyle: { color: '#6faf9f', fontSize: 12 },
        // 刻度随数据自适应（不再固定 0~5）
        scale: true,
        axisLabel: { color: '#244165', fontSize: 11 },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '水位',
        type: 'line',
        data: zs,
        yAxisIndex: 0,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#4f96ec', width: 2 },
        itemStyle: { color: '#4f96ec' }
      },
      {
        name: '8时流量',
        type: 'line',
        data: qs,
        yAxisIndex: 1,
        symbol: 'none',
        lineStyle: { color: '#f8ac39', width: 1.5, type: 'dashed' },
        itemStyle: { color: '#f8ac39' }
      }
    ]
  })
}

// ==================== 水库原型：水库蓄水量过程线 ====================
function renderRsvW() {
  if (!processRange.value) {
    return
  }
  const { rows, days, ws } = buildDaily()
  tableRsvW.value = rows.map((r, i) => ({
    date: String(r.DT || '').substring(0, 10),
    w: ws[i]
  }))
  if (modeRsvW.value !== 'chart') {
    return
  }
  setRsvW({
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#e0e0e0',
      textStyle: { color: '#333', fontSize: 12 }
    },
    legend: {
      top: 0,
      right: 120,
      itemWidth: 16,
      itemHeight: 8,
      textStyle: { color: '#323232', fontSize: 12 },
      data: ['蓄水量']
    },
    grid: { left: 50, right: 30, top: 34, bottom: 30 },
    xAxis: {
      type: 'category',
      data: days,
      boundaryGap: false,
      axisLabel: { color: '#244165', fontSize: 11 },
      axisLine: { lineStyle: { color: '#7BACDE' } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: '蓄水量（万m³）',
      nameTextStyle: { color: '#006bc9', fontSize: 12 },
      min: 0,
      axisLabel: { color: '#244165', fontSize: 11 },
      splitLine: { lineStyle: { type: 'dashed', color: '#94B9E5' } }
    },
    series: [
      {
        name: '蓄水量',
        type: 'line',
        data: ws,
        smooth: true,
        symbol: 'none',
        areaStyle: { color: 'rgba(79,150,236,0.12)' },
        lineStyle: { color: '#4f96ec', width: 2 },
        itemStyle: { color: '#4f96ec' }
      }
    ]
  })
}

// ==================== 水库原型：累计补水量过程线 ====================
function renderRsvLb() {
  if (!processRange.value) {
    return
  }
  const { rows, days, dayQs, cumQs } = buildDaily()
  tableRsvLb.value = rows.map((r, i) => ({
    date: String(r.DT || '').substring(0, 10),
    dayQ: dayQs[i],
    cum: cumQs[i]
  }))
  if (modeRsvLb.value !== 'chart') {
    return
  }
  setRsvLb({
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#e0e0e0',
      textStyle: { color: '#333', fontSize: 12 }
    },
    legend: {
      top: 0,
      right: 120,
      itemWidth: 16,
      itemHeight: 8,
      textStyle: { color: '#323232', fontSize: 12 },
      data: ['日过水量', '累计水量']
    },
    grid: { left: 50, right: 56, top: 34, bottom: 30 },
    xAxis: {
      type: 'category',
      data: days,
      boundaryGap: false,
      axisLabel: { color: '#244165', fontSize: 11 },
      axisLine: { lineStyle: { color: '#7BACDE' } },
      axisTick: { show: false }
    },
    yAxis: [
      {
        type: 'value',
        name: '日过水量（万m³）',
        nameTextStyle: { color: '#6faf9f', fontSize: 12 },
        min: 0,
        axisLabel: { color: '#244165', fontSize: 11 },
        splitLine: { lineStyle: { type: 'dashed', color: '#94B9E5' } }
      },
      {
        type: 'value',
        name: '累计（万m³）',
        nameTextStyle: { color: '#006bc9', fontSize: 12 },
        min: 0,
        axisLabel: { color: '#244165', fontSize: 11 },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '日过水量',
        type: 'bar',
        data: dayQs,
        yAxisIndex: 0,
        barWidth: 6,
        itemStyle: { color: '#fabd1a', borderRadius: [2, 2, 0, 0] }
      },
      {
        name: '累计水量',
        type: 'line',
        data: cumQs,
        yAxisIndex: 1,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#4f96ec', width: 2 },
        itemStyle: { color: '#4f96ec' }
      }
    ]
  })
}

// 水库原型当前 tab（水位流量 / 累计补水量 / 水库蓄水量）
function renderRsvActive() {
  if (rsvTab.value === 'WL') {
    renderRsvWl()
  } else if (rsvTab.value === 'LB') {
    renderRsvLb()
  } else {
    renderRsvW()
  }
}

// ==================== 打开/关闭/联动 ====================
async function initAndRender() {
  const t = props.wtTime || toDateStr(new Date())
  // 过程线默认范围：上个月今天 ~ 今天
  processRange.value = lastMonthTodayRange(t)
  // 统计默认范围：日历年（当年 01-02 ~ 今天，口径同老项目）
  statTab.value = 'DLN'
  statRange.value = [`${t.substring(0, 4)}-01-02`, t]
  await nextTick()
  dataLoading.value = true
  try {
    await loadDaily()
    if (useReservoirProto.value) {
      rsvTab.value = 'WL'
      renderRsvActive()
    } else {
      await loadMonth()
      renderProcess()
      renderStat()
    }
  } finally {
    dataLoading.value = false
  }
}

/** 过程线区间变更：重新取日数据后重绘 */
async function onProcessRangeChange() {
  dataLoading.value = true
  try {
    await loadDaily()
    renderProcess()
  } finally {
    dataLoading.value = false
  }
}

/** 统计区间变更：重新取月度数据后重绘 */
async function onStatRangeChange() {
  dataLoading.value = true
  try {
    await loadMonth()
    renderStat()
  } finally {
    dataLoading.value = false
  }
}

/** 水库原型区间变更：重新取日数据后重绘当前 tab */
async function onRsvRangeChange() {
  dataLoading.value = true
  try {
    await loadDaily()
    renderRsvActive()
  } finally {
    dataLoading.value = false
  }
}
function onRsvTabChange() {
  nextTick(() => {
    if (rsvTab.value === 'WL') {
      resizeRsvWl()
    } else if (rsvTab.value === 'LB') {
      resizeRsvLb()
    } else {
      resizeRsvW()
    }
    renderRsvActive()
  })
}

// 统计页签切换：查询区间随之切换（日历年 / 调度年），重新取数并重绘
watch(statTab, async () => {
  const t = props.wtTime || toDateStr(new Date())
  statRange.value =
    statTab.value === 'DLN'
      ? [`${t.substring(0, 4)}-01-02`, t]
      : getDispatchYearRange(String(props.lineCd || ''), t)
  dataLoading.value = true
  try {
    await loadMonth()
    renderStat()
  } finally {
    dataLoading.value = false
  }
})

// 图表/表格切换回折线时重新渲染（表格模式下跳过了图表绘制）
watch(modeProcess, (v) => {
  if (v === 'chart') {
    nextTick(() => {
      resizeProcess()
      renderProcess()
    })
  }
})
watch(modeStat, (v) => {
  if (v === 'chart') {
    nextTick(() => {
      resizeStat()
      renderStat()
    })
  }
})
watch(rsvMode, (v) => {
  if (v === 'chart') {
    nextTick(() => onRsvTabChange())
  }
})

/** 激活：各页签重置为图表态并初始化取数（独立弹窗 / 内嵌模式共用） */
async function activate() {
  statTab.value = 'DLN'
  modeProcess.value = 'chart'
  modeStat.value = 'chart'
  modeRsvWl.value = 'chart'
  modeRsvLb.value = 'chart'
  modeRsvW.value = 'chart'
  await initAndRender()
}

/** 释放：销毁各图表实例 */
function release() {
  disposeProcess()
  disposeStat()
  disposeDonut()
  disposeRsvWl()
  disposeRsvW()
  disposeRsvLb()
}

watch(show, async (v) => {
  if (v) {
    await activate()
  } else {
    release()
  }
})

// 行变化时重新取数：
// - 内嵌模式（由 LineDataDialog 滑动切换）时弹窗 show 不变，必须靠行变化触发
// - 独立模式（地图点位点击）下若弹窗已打开又切换到另一个站，同样需要重取
watch(
  () => props.row,
  async (r) => {
    if (!r) {
      return
    }
    if (props.inline || show.value) {
      await activate()
    }
  }
)
</script>

<template>
  <!-- 独立模式渲染 n-modal；内嵌模式渲染普通 div，由父级 dialog 承载并做滑动切换 -->
  <component :is="wrapperTag" v-bind="wrapperProps">
    <div class="sdd" :class="{ 'sdd-rsv': useReservoirProto }">
      <!-- 头部：内嵌模式下标题与关闭按钮均由父级 dialog 标题栏承载，整行不渲染，避免重复 -->
      <div v-if="!inline" class="sdd-head">
        <span class="sdd-title">{{ title }}</span>
        <span class="sdd-close" @click="onClose">✕</span>
      </div>

      <!-- 实时信息（随类型/线路变化，行内最多 3 个） -->
      <div class="sdd-section rt">
        <div class="rt-label">
          <div class="sec-title">实时信息</div>
          <div class="rt-date">({{ rtDate }})</div>
        </div>
        <div class="rt-cards">
          <div v-for="item in rtItems" :key="item.key" class="rt-card">
            <div class="rt-icon">
              <img :src="item.icon" alt="" />
            </div>
            <div class="rt-text">
              {{ item.label }}:
              <span v-if="item.pre" class="rt-pre">{{ item.pre }}</span>
              <span class="rt-num" :style="rtNumStyle">{{ item.val }}</span>
              <span class="rt-unit">{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== 东榆林水库原型（水库站 / 永定河线路站） ==================== -->
      <template v-if="useReservoirProto">
        <div class="rsv-tabs">
          <div
            class="tab"
            :class="{ active: rsvTab === 'WL' }"
            @click="
              rsvTab = 'WL'
              onRsvTabChange()
            "
          >
            水位流量
          </div>
          <div
            class="tab"
            :class="{ active: rsvTab === 'LB' }"
            @click="
              rsvTab = 'LB'
              onRsvTabChange()
            "
          >
            累计补水量
          </div>
          <div
            v-if="showStorageTab"
            class="tab"
            :class="{ active: rsvTab === 'W' }"
            @click="
              rsvTab = 'W'
              onRsvTabChange()
            "
          >
            水库蓄水量
          </div>
        </div>

        <div class="sdd-section flex-section">
          <div class="proc-head">
            <div class="date-range">
              <n-date-picker
                v-model:formatted-value="processRange"
                type="daterange"
                size="small"
                value-format="yyyy-MM-dd"
                :clearable="false"
                style="width: 250px"
                @update:formatted-value="onRsvRangeChange"
              />
            </div>
            <div class="chart-title">
              {{
                rsvTab === 'WL'
                  ? `${stnm}水位、8时流量过程线`
                  : rsvTab === 'LB'
                    ? `${stnm}累计补水量过程线`
                    : `${stnm}蓄水量过程线`
              }}
            </div>
            <ChartTableToggle v-model="rsvMode" class="head-toggle" />
          </div>
          <div v-show="rsvMode === 'chart'" class="flex-body">
            <div v-show="rsvTab === 'WL'" ref="rsvWlRef" class="chart chart-fill"></div>
            <div v-show="rsvTab === 'LB'" ref="rsvLbRef" class="chart chart-fill"></div>
            <div v-show="rsvTab === 'W'" ref="rsvWRef" class="chart chart-fill"></div>
          </div>
          <div v-if="rsvMode === 'table'" class="flex-body chart-table">
            <n-data-table
              v-if="rsvTab === 'WL'"
              :columns="rsvWlCols"
              :data="tableRsvWl"
              size="small"
              :bordered="true"
              :single-line="false"
              flex-height
              style="height: 100%"
            />
            <n-data-table
              v-else-if="rsvTab === 'LB'"
              :columns="rsvLbCols"
              :data="tableRsvLb"
              size="small"
              :bordered="true"
              :single-line="false"
              flex-height
              style="height: 100%"
            />
            <n-data-table
              v-else
              :columns="rsvWCols"
              :data="tableRsvW"
              size="small"
              :bordered="true"
              :single-line="false"
              flex-height
              style="height: 100%"
            />
          </div>
        </div>
      </template>

      <!-- ==================== 跃进渠原型（非永定河河道站） ==================== -->
      <template v-else>
        <!-- 过程线 -->
        <div class="sdd-section flex-section">
          <div class="proc-head">
            <div class="date-range">
              <n-date-picker
                v-model:formatted-value="processRange"
                type="daterange"
                size="small"
                value-format="yyyy-MM-dd"
                :clearable="false"
                style="width: 250px"
                @update:formatted-value="onProcessRangeChange"
              />
            </div>
            <div class="chart-title">{{ stnm }}8时流量、日水量和累计水量过程线</div>
            <ChartTableToggle v-model="modeProcess" class="head-toggle" />
          </div>
          <div v-show="modeProcess === 'chart'" ref="processRef" class="chart chart-body"></div>
          <div v-if="modeProcess === 'table'" class="chart-table chart-body">
            <n-data-table
              :columns="processCols"
              :data="tableProcess"
              size="small"
              :bordered="true"
              :single-line="false"
              flex-height
              style="height: 100%"
            />
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="sdd-section flex-section">
          <div class="sec-title">统计信息</div>
          <div class="tabs">
            <div class="tab" :class="{ active: statTab === 'DLN' }" @click="statTab = 'DLN'">
              日历年统计
            </div>
            <div class="tab" :class="{ active: statTab === 'DDN' }" @click="statTab = 'DDN'">
              调度年统计
            </div>
          </div>
          <div class="stat-head">
            <n-date-picker
              v-model:formatted-value="statRange"
              type="daterange"
              size="small"
              value-format="yyyy-MM-dd"
              :clearable="false"
              style="width: 250px"
              @update:formatted-value="onStatRangeChange"
            />
            <div class="chart-title">{{ statChartTitle }}</div>
            <ChartTableToggle v-model="modeStat" class="head-toggle" />
          </div>
          <div class="stat-body flex-body">
            <div class="donut-block">
              <div class="donut-label">年度累计水量</div>
              <div class="donut-num">{{ yearCum }}万<span class="donut-unit">m³</span></div>
              <div class="donut-wrap">
                <div ref="donutRef" class="chart-donut"></div>
                <div class="donut-center">
                  <div class="dc-num">{{ yearPlan }}万m³</div>
                  <div class="dc-text">年度取水</div>
                </div>
              </div>
            </div>
            <div
              v-show="modeStat === 'chart'"
              ref="statRef"
              class="chart chart-stat chart-fill"
            ></div>
            <div v-if="modeStat === 'table'" class="chart-table chart-stat-table">
              <n-data-table
                :columns="statCols"
                :data="tableStat"
                size="small"
                :bordered="true"
                :single-line="false"
                flex-height
                style="height: 100%"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
  </component>
</template>

<style scoped lang="scss">
.sdd {
  width: 1160px;
  max-width: 96vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  border-radius: 10px;
  padding: 18px 26px 22px;
  box-shadow: 0 8px 40px rgba(30, 60, 120, 0.25);
  font-family: 'Source Han Sans CN', 'Microsoft YaHei', sans-serif;
  box-sizing: border-box;
}

/* 东榆林水库原型：单个图表，弹窗略矮一些 */
.sdd-rsv {
  height: 76vh;
}

/* 内嵌模式：尺寸由父级 dialog 的滑动面板决定，去掉自身定宽定高/阴影圆角 */
.sdd-inline {
  width: 100%;
  height: 100%;

  .sdd,
  .sdd-rsv {
    width: 100%;
    height: 100%;
    max-width: none;
    border-radius: 0;
    box-shadow: none;
  }
}

.sdd-head {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.sdd-title {
  font-size: 20px;
  font-weight: 700;
  color: #163d90;
}

.sdd-close {
  font-size: 18px;
  color: #8a94a6;
  cursor: pointer;
  line-height: 1;
  padding: 4px;

  &:hover {
    color: #333;
  }
}

.sdd-section {
  margin-bottom: 6px;
}

.sec-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f378c;
  border-left: 4px solid #1766db;
  padding-left: 8px;
  line-height: 1.2;
}

/* ---------- 实时信息 ---------- */
.rt {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 14px;
}

.rt-label {
  flex-shrink: 0;
}

.rt-date {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
  padding-left: 12px;
}

.rt-cards {
  flex: 1;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.rt-card {
  display: flex;
  align-items: center;
  border: 1px solid #dbe4f0;
  border-radius: 8px;
  padding: 8px 10px;
}

.rt-icon {
  width: 26px;
  height: 26px;
  margin-right: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.rt-text {
  display: flex;
  align-items: baseline;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
}

.rt-pre {
  font-size: 14px;
  color: #333;
  font-weight: 400;
  margin-right: 2px;
}

/* 数值段宽度由 JS 按当前最宽数值测量后统一固定（右对齐），单位紧跟其后（无空白） */
.rt-num {
  display: inline-block;
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-family: Arial, sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #005fd3;
}

.rt-unit {
  font-size: 12px;
  color: #333;
  margin-left: 4px;
}

/* ---------- 过程线 ---------- */
.proc-head {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 2px;
}

.chart-title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  font-size: 18px;
  font-weight: 500;
  color: #323232;
  white-space: nowrap;
}

.date-range {
  flex-shrink: 0;
}

.chart {
  width: 100%;
}

/* 分区弹性填充：图表/表格占据剩余高度，弹窗高度恒定、无整体滚动 */
.flex-section {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.flex-body {
  flex: 1 1 0;
  min-height: 0;
}

.chart-body {
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
}

.chart-fill {
  width: 100%;
  height: 100%;
}

.chart-table {
  width: 100%;
  margin-top: 4px;
  overflow: hidden;
}

.chart-stat-table {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

/* ---------- 统计信息 ---------- */
.tabs {
  display: flex;
  gap: 12px;
  margin: 12px 0 14px;
}

/* 水库原型 tabs（东榆林水库详情信息） */
.rsv-tabs {
  flex-shrink: 0;
  display: flex;
  gap: 12px;
  margin: 4px 0 14px;
}

.tab {
  padding: 7px 22px;
  border: 1px solid #d5dced;
  border-radius: 6px;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  user-select: none;

  &.active {
    color: #005fd3;
    border-color: #4f96ec;
    background: #eaf3ff;
    font-weight: 500;
  }
}

.stat-head {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

/* 图表/表格切换按钮：贴右，最右与图表最右对齐 */
.head-toggle {
  margin-left: auto;
}

.stat-body {
  display: flex;
  gap: 10px;
}

.donut-block {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.donut-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.donut-num {
  font-family: Arial, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #005fd3;
  margin-bottom: 6px;
}

.donut-unit {
  font-size: 12px;
  font-weight: 400;
  color: #333;
}

.donut-wrap {
  position: relative;
  width: 160px;
  height: 160px;
}

.chart-donut {
  width: 100%;
  height: 100%;
}

.donut-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.dc-num {
  font-family: Arial, sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #163d90;
}

.dc-text {
  font-size: 13px;
  color: #333;
}

.chart-stat {
  flex: 1;
  min-width: 0;
  min-height: 0;
}
</style>
