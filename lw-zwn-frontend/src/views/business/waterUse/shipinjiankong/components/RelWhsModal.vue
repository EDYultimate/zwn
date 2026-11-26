<script setup lang="ts">
import { computed, nextTick, ref, watch, type Ref } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import ProTabs from '@/components/common/ProTabs/ProTabs.vue'
import ProTable from '@/components/common/ProTable'
import type { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid'
import { useECharts } from '@/hooks/web/useECharts'
import type { VideoStation } from '@/api/waterUse/video'

// 关联取水口管理暂无后端数据源，本弹框仍为演示数据；仅把点位类型与列表页对齐
/** 监控点位数据结构（与列表页一致） */
type StationItem = VideoStation

/** 取水口信息（复刻原型 intakes） */
interface Intake {
  id: number
  name: string
  river: string
  cert: string
  user: string
  perm: number
  used: number
  type: string
  org: string
}

// 取水口台账 mock：名称·许可证·取水权人·许可水量与原型 intakes 一致
const intakes: Intake[] = [
  {
    id: 1,
    name: '民有渠',
    river: '卫运河右岸',
    cert: 'A130402S2025-0032',
    user: '邯郸市生态水网管理中心',
    perm: 6202,
    used: 5954,
    type: '河道外',
    org: '岳城局'
  },
  {
    id: 2,
    name: '和平闸',
    river: '卫运河左岸',
    cert: 'A410505S2024-0581',
    user: '馆陶县水利局',
    perm: 3914,
    used: 3762,
    type: '河道外',
    org: '岳城局'
  },
  {
    id: 3,
    name: '周尹涵闸',
    river: '卫运河右岸',
    cert: 'A130928S2023-0446',
    user: '东光县水务局',
    perm: 341.8,
    used: 1204,
    type: '河道外',
    org: '水闸局'
  },
  {
    id: 4,
    name: '马固提灌站',
    river: '卫河右岸',
    cert: 'A410527S2023-0288',
    user: '内黄县水利局',
    perm: 549.74,
    used: 511,
    type: '河道外',
    org: '安阳局'
  },
  {
    id: 5,
    name: '班庄扬水站',
    river: '卫河右岸',
    cert: 'A371525S2022-0412',
    user: '冠县水利局',
    perm: 4200,
    used: 3860,
    type: '河道外',
    org: '聊城局'
  },
  {
    id: 6,
    name: '王营盘引水闸',
    river: '漳卫新河左岸',
    cert: 'A130928S2023-0446',
    user: '东光县水务局',
    perm: 3763,
    used: 3480,
    type: '河道外',
    org: '水闸局'
  },
  {
    id: 7,
    name: '尖塚扬水站',
    river: '卫运河左岸',
    cert: 'A131126S2023-0055',
    user: '故城县水利局',
    perm: 500,
    used: 462,
    type: '河道外',
    org: '邢衡局'
  },
  {
    id: 8,
    name: '土龙头引水闸',
    river: '卫河右岸',
    cert: 'A130425S2022-0164',
    user: '大名县水利局',
    perm: 206.05,
    used: 178,
    type: '河道外',
    org: '邯郸局'
  },
  {
    id: 9,
    name: '前王引水闸',
    river: '卫运河右岸',
    cert: 'A371581S2022-0330',
    user: '临清市水务局',
    perm: 341.8,
    used: 1204,
    type: '河道外',
    org: '德州局'
  },
  {
    id: 10,
    name: '漳南渠',
    river: '岳城水库',
    cert: 'A410526S2024-0213',
    user: '河南省滑县道口镇人民政府',
    perm: 206.71,
    used: 237,
    type: '河道外',
    org: '岳城局'
  }
]

// 统计口径常量（复刻原型）
const WM_D0 = '2026-01-01'
const WM_D1 = '2026-09-30'
const WM_YF: Record<string, number> = { 2026: 1, 2025: 0.88, 2024: 0.94, 2023: 0.79 }
const WM_MW = [0.42, 0.48, 1.35, 1.72, 1.95, 1.6, 1.12, 1.35, 1.28, 0.72, 0.5, 0.44]
const WM_GC = ['#1f9ee0', '#18a874', '#8e6bd6', '#e8971d', '#e2654a']

const visible = ref(false)
const cur = ref<Intake | null>(null)

// 弹框页签：info=基础信息 / stats=水量统计
const view = ref<'info' | 'stats'>('info')
// 水量统计：按取水口 / 按许可证
const statsTab = ref<'it' | 'cert'>('it')
// 按取水口统计粒度
const gran = ref<'day' | 'month'>('day')
const from = ref(WM_D0)
const to = ref(WM_D1)
const year = ref('2026')

/** 站点 → 关联取水口：优先按名称匹配，否则按 id 顺序取演示数据（复刻原型 stIntake） */
function matchIntake(st: StationItem): Intake {
  const strip = (s: string) => s.replace(/渠首|扬水站|泵站|引水闸|水站|闸/g, '')
  const k = strip(st.name)
  return (
    intakes.find((x) => k.length >= 2 && strip(x.name).indexOf(k) >= 0) ||
    intakes.find((x) => x.name.indexOf(st.name) >= 0) ||
    intakes[(st.id - 1) % intakes.length]
  )
}

/* ==================== 基础信息（复刻原型 wmInfoGrid） ==================== */

interface LgItem {
  k: string
  v: string
  full?: boolean
  pts?: { no: string; pos: string; eng: string }
}

// 行政编码 → 行政区划（原型 AREA）
const AREA: Record<string, string> = {
  '130402': '河北省 / 邯郸市',
  '410505': '河南省 / 安阳市',
  '410526': '河南省 / 安阳市 / 滑县',
  '410527': '河南省 / 安阳市 / 内黄县',
  '130425': '河北省 / 邯郸市 / 大名县',
  '130535': '河北省 / 邢台市 / 临西县',
  '371525': '山东省 / 聊城市 / 冠县',
  '371581': '山东省 / 聊城市 / 临清市',
  '131126': '河北省 / 衡水市 / 故城县',
  '130928': '河北省 / 沧州市 / 东光县'
}

// 基本信息字段（含取水口明细全宽块）
const baseItems = computed<LgItem[]>(() => {
  const it = cur.value
  if (!it) {
    return []
  }
  const code = (it.cert.match(/A(\d{6})/) || [])[1] || ''
  const cy = (it.cert.match(/S(\d{4})/) || [])[1] || '2024'
  const engType = /闸/.test(it.name) ? '水闸' : /泵站|提灌站|扬水站/.test(it.name) ? '泵站' : '渠道'
  const useType = /生态|水网/.test(it.user)
    ? '生态环境补水'
    : /水库/.test(it.river)
      ? '城镇供水'
      : '农业灌溉和工业用水'
  const uscc =
    '12' +
    code +
    'QX' +
    String(it.id).padStart(2, '0') +
    String(100000 + it.id * 7919).slice(-6) +
    'X'
  return [
    { k: '取水许可证编号', v: it.cert },
    { k: '许可证状态', v: '已发证' },
    { k: '有效期', v: `${cy}-01-01 ~ ${+cy + 3}-12-31` },
    { k: '许可水量', v: `${it.perm.toLocaleString()} 万m³/年` },
    { k: '取水项目名称', v: it.name },
    { k: '取水权人', v: it.user },
    { k: '组织机构代码', v: uscc },
    { k: '累计取水量', v: `${it.used.toLocaleString()} 万m³` },
    {
      k: '取水口信息',
      v: '',
      full: true,
      pts: {
        no: `QSK${String(it.id).padStart(3, '0')}-01`,
        pos: `${it.river} · ${it.name}`,
        eng: engType
      }
    },
    { k: '所属河流', v: it.river.replace(/左岸|右岸/, '') },
    { k: '所在河段', v: it.river },
    { k: '水源类型', v: '地表水' },
    { k: '取水类型', v: '地表水' },
    { k: '取水用途', v: useType },
    { k: '取水口类型', v: it.type }
  ]
})

// 行政区划与监管字段
const adminItems = computed<LgItem[]>(() => {
  const it = cur.value
  if (!it) {
    return []
  }
  const code = (it.cert.match(/A(\d{6})/) || [])[1] || ''
  return [
    { k: '监管单位', v: it.org },
    { k: '行政区划', v: AREA[code] || '河北省' },
    { k: '是否重点监管取水口', v: it.id % 4 === 0 ? '是' : '否' },
    { k: '是否大中型灌区', v: it.id % 3 === 1 ? '是' : '否' },
    { k: '是否典型小型灌区', v: '否' }
  ]
})

/* ==================== 水量统计（复刻原型 wm*） ==================== */

/** 伪随机（原型 wmRand） */
function wmRand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** 统计截止月份：2026 年数据截至 9 月（原型 wmMonthEnd） */
function wmMonthEnd(y: string) {
  return y === '2026' ? 9 : 12
}

/** 累计数组（原型 wmCum） */
function wmCum(a: number[]) {
  let s = 0
  return a.map((v) => +(s += v).toFixed(1))
}

/** 该证覆盖的取水口（mock 以当前取水口为一个口） */
function wmGates(it: Intake) {
  return [it.name]
}

/** 单取水口逐月取水量（万m³） */
function wmItMonthly(it: Intake, y: string) {
  const me = wmMonthEnd(y)
  const tot = it.used * (WM_YF[y] || 0.9)
  const ws: number[] = []
  let sw = 0
  for (let m = 1; m <= me; m++) {
    const w = WM_MW[m - 1] * (0.82 + wmRand(it.id * 57 + m * 13 + +y * 7) * 0.42)
    ws.push(w)
    sw += w
  }
  return ws.map((w) => +((w / sw) * tot).toFixed(1))
}

/** 单取水口 2026 年逐日取水量（1—9 月，带日期便于按时间段截取） */
function wmItDailyRaw(it: Intake) {
  const mm = wmItMonthly(it, '2026')
  const arr: { d: string; x: string; v: number }[] = []
  for (let m = 1; m <= 9; m++) {
    const dim = new Date(2026, m, 0).getDate()
    const raw: number[] = []
    let rs = 0
    for (let d = 1; d <= dim; d++) {
      const v = 0.35 + wmRand(it.id * 57 + m * 37 + d * 7) * 1.3
      raw.push(v)
      rs += v
    }
    const k = mm[m - 1] / rs
    raw.forEach((v, i) =>
      arr.push({
        d: `2026-${String(m).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`,
        x: `${m}/${i + 1}`,
        v: +(v * k).toFixed(2)
      })
    )
  }
  return arr
}

/** 按所选时间段 → 逐日累计水量过程 */
function wmDaySeries(it: Intake) {
  const all = wmItDailyRaw(it).filter((p) => p.d >= from.value && p.d <= to.value)
  let c = 0
  return {
    xs: all.map((p) => p.x),
    cum: all.map((p) => +(c += p.v).toFixed(1))
  }
}

/** 按所选时间段 → 逐月取水量 + 累计水量过程 */
function wmMonthSeries(it: Intake) {
  const mm = wmItMonthly(it, '2026')
  const idx: number[] = []
  for (let m = 1; m <= mm.length; m++) {
    const first = `2026-${String(m).padStart(2, '0')}-01`
    const last = `2026-${String(m).padStart(2, '0')}-${String(new Date(2026, m, 0).getDate()).padStart(2, '0')}`
    if (last >= from.value && first <= to.value) {
      idx.push(m)
    }
  }
  const vals = idx.map((m) => mm[m - 1])
  let c = 0
  return {
    xs: idx.map((m) => `${m}月`),
    vals,
    cum: vals.map((v) => +(c += v).toFixed(1))
  }
}

/** 该证下各取水口逐月取水量 + 证书合计 */
function wmCertSeries(it: Intake, y: string) {
  const gates = wmGates(it)
  const me = wmMonthEnd(y)
  const tot = it.used * (WM_YF[y] || 0.9)
  const sh = gates.map((g, i) => 0.55 + wmRand(it.id * 31 + i * 97 + g.length * 17) * 0.5)
  const ss = sh.reduce((a, b) => a + b, 0)
  const per = gates.map((g, i) => {
    const ws: number[] = []
    let sw = 0
    for (let m = 1; m <= me; m++) {
      const w = WM_MW[m - 1] * (0.8 + wmRand(it.id * 57 + i * 13 + m * 7 + +y) * 0.44)
      ws.push(w)
      sw += w
    }
    return ws.map((w) => +(((w / sw) * tot * sh[i]) / ss).toFixed(1))
  })
  const total = Array.from({ length: me }, (_, j) => +per.reduce((a, p) => a + p[j], 0).toFixed(1))
  return { gates, per, total }
}

/** 数值格式化（原型 nm） */
function nm(v: number) {
  return (v === null || v === undefined ? '' : v).toLocaleString()
}

/** 右侧数据表（与图表同一数据源） */
const statsTable = computed<{ head: string[]; rows: (string | number)[][] }>(() => {
  const it = cur.value
  if (!it) {
    return { head: [], rows: [] }
  }
  if (statsTab.value === 'it') {
    if (gran.value === 'day') {
      const all = wmItDailyRaw(it).filter((p) => p.d >= from.value && p.d <= to.value)
      let c = 0
      return {
        head: ['日期', '累计水量（万m³）'],
        rows: all.map((p) => [p.d, +(c += p.v).toFixed(1)])
      }
    }
    const s = wmMonthSeries(it)
    return {
      head: ['月份', '月取水量（万m³）', '累计水量（万m³）'],
      rows: s.xs.map((x, i) => [x, nm(s.vals[i]), nm(s.cum[i])])
    }
  }
  const { gates, per, total } = wmCertSeries(it, year.value)
  const cum = wmCum(total)
  return {
    head: ['月份', ...gates, '合计（万m³）', '累计（万m³）'],
    rows: total.map((v, i) => [`${i + 1}月`, ...per.map((p) => nm(p[i] || 0)), nm(v), nm(cum[i])])
  }
})

/* ---------------- 视图层：页签 / 字段栅格 / 明细表 / 统计卡（对齐 LicDetailModal） ---------------- */

// 弹框页签项（ProTabs）
const detailTabs = [
  { key: 'info', label: '基础信息' },
  { key: 'stats', label: '水量统计' }
] as const

// 基本字段：取水口明细块之前的一段
const infoBasicKv = computed(() => baseItems.value.filter((it) => !it.full).slice(0, 8))

// 基本字段：取水口明细块之后的一段
const infoSourceKv = computed(() => baseItems.value.filter((it) => !it.full).slice(8))

// 取水口明细行（单行，通过 ProTable 呈现）
const ptsRows = computed(() => {
  const item = baseItems.value.find((i) => i.full)
  return [{ no: item?.pts?.no ?? '—', pos: item?.pts?.pos ?? '—', eng: item?.pts?.eng ?? '—' }]
})

// 取水口明细表列
const ptColumns: VxeGridPropTypes.Columns = [
  { field: 'no', title: '取水口编号', minWidth: 120, align: 'center' },
  { field: 'pos', title: '取水口位置', minWidth: 180, align: 'center' },
  { field: 'eng', title: '取水工程（设施）类型', minWidth: 180, align: 'center' }
]

// 统计表：动态表头 → ProTable 的行 / 列
const statsRows = computed<Record<string, string | number>[]>(() =>
  statsTable.value.rows.map((row) => {
    const o: Record<string, string | number> = {}
    row.forEach((c, i) => (o[`c${i}`] = c))
    return o
  })
)

const statsColumns = computed<VxeGridPropTypes.Columns>(() =>
  statsTable.value.head.map((h, i) => ({
    field: `c${i}`,
    title: h,
    minWidth: 80,
    align: 'center',
    className: i === 0 ? '' : 'num-cell'
  }))
)

// 统计区间文案
const rangeText = computed(() => {
  if (!cur.value) {
    return ''
  }
  if (statsTab.value === 'it') {
    if (gran.value === 'day') {
      return `${from.value} ~ ${to.value}`
    }
    const xs = wmMonthSeries(cur.value).xs
    return xs.length ? `${xs[0]} ~ ${xs[xs.length - 1]}` : ''
  }
  return `${year.value}年 1—${wmMonthEnd(year.value)}月`
})

// 当前统计序列（统计卡与图例共用）
const rangeSeries = computed(() => {
  const it = cur.value
  if (!it) {
    return {
      labels: [] as string[],
      vals: [] as number[],
      cum: [] as number[],
      gates: [] as string[]
    }
  }
  if (statsTab.value === 'it') {
    if (gran.value === 'day') {
      const all = wmItDailyRaw(it).filter((p) => p.d >= from.value && p.d <= to.value)
      let c = 0
      const cum = all.map((p) => +(c += p.v).toFixed(1))
      return {
        labels: all.map((p) => p.d),
        vals: all.map((p) => p.v),
        cum,
        gates: [] as string[]
      }
    }
    const s = wmMonthSeries(it)
    return { labels: s.xs, vals: s.vals, cum: s.cum, gates: [] as string[] }
  }
  const cs = wmCertSeries(it, year.value)
  return {
    labels: cs.total.map((_, i) => `${i + 1}月`),
    vals: cs.total,
    cum: wmCum(cs.total),
    gates: cs.gates
  }
})

// 统计卡：最大 / 最小 / 累计
const statCards = computed(() => {
  const s = rangeSeries.value
  const vals = s.vals
  if (!vals.length) {
    return []
  }
  const max = Math.max(...vals)
  const min = Math.min(...vals)
  return [
    {
      cap: '最大取水量（万m³）',
      v: nm(+max.toFixed(1)),
      t: s.labels[vals.indexOf(max)]
    },
    {
      cap: '最小取水量（万m³）',
      v: nm(+min.toFixed(1)),
      t: s.labels[vals.indexOf(min)]
    },
    {
      cap: '累计取水量（万m³）',
      v: nm(s.cum.length ? s.cum[s.cum.length - 1] : 0),
      t: rangeText.value
    }
  ]
})

// 自定义图例（与参考弹框一致：图上居中色条 + 名称）
const legendItems = computed(() => {
  if (!cur.value) {
    return []
  }
  if (statsTab.value === 'cert') {
    return [
      ...rangeSeries.value.gates.map((g, i) => ({ name: g, color: WM_GC[i % WM_GC.length] })),
      { name: '累计水量', color: '#e8971d' }
    ]
  }
  return gran.value === 'day'
    ? [{ name: '累计水量', color: '#1f7ae0' }]
    : [
        { name: '月取水量', color: '#1f7ae0' },
        { name: '累计水量', color: '#e8971d' }
      ]
})

// 底部备注
const footText = computed(() => {
  const it = cur.value
  if (!it) {
    return ''
  }
  const s = rangeSeries.value
  const cum = s.cum.length ? s.cum[s.cum.length - 1] : 0
  return `备注：图为${statsTab.value === 'it' ? '所选取水口' : '该证下各取水口'}在「${rangeText.value}」内的取水过程与累计水量过程；累计取水量 ${nm(cum)} 万m³；许可水量 ${nm(it.perm)} 万m³/年。`
})

/* ---------------- 图表 ---------------- */

const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>, 'light')

// 浅色弹窗中的坐标轴配色（原型 AX）
const AX = {
  axisLine: { lineStyle: { color: 'rgba(90,125,170,.45)' } },
  axisLabel: { color: '#5a7599', fontSize: 11 },
  splitLine: { lineStyle: { color: 'rgba(90,125,170,.14)' } }
}
const AX2 = {
  axisLine: { lineStyle: { color: 'rgba(90,125,170,.45)' } },
  axisLabel: { color: '#5a7599', fontSize: 11 },
  splitLine: { show: false }
}

/** 绘制水量统计图：按取水口（日/月）或按许可证 */
function drawChart() {
  const it = cur.value
  if (!it || view.value !== 'stats') {
    return
  }
  const TIP: EChartsOption['tooltip'] = {
    trigger: 'axis',
    backgroundColor: 'rgba(255,255,255,.97)',
    borderColor: '#c2d7ef',
    textStyle: { color: '#22436f', fontSize: 12 },
    valueFormatter: (v) => `${v === null || v === undefined ? '–' : v} 万m³`
  }
  if (statsTab.value === 'it') {
    if (gran.value === 'day') {
      const s = wmDaySeries(it)
      const dMax = s.cum.length ? Math.max(...s.cum) : 0
      const showPerm = it.perm > 0 && it.perm <= dMax * 1.35
      const mRaw = (showPerm ? Math.max(dMax, it.perm) : dMax) * 1.06
      const yMax = mRaw >= 1000 ? Math.ceil(mRaw / 1000) * 1000 : Math.ceil(mRaw / 50) * 50
      const ser: Record<string, unknown> = {
        name: '累计水量',
        type: 'line',
        data: s.cum,
        symbol: 'none',
        smooth: true,
        lineStyle: { width: 2.2, color: '#1f7ae0' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(31,122,224,.20)' },
            { offset: 1, color: 'rgba(31,122,224,0)' }
          ])
        }
      }
      if (showPerm) {
        ser.markLine = {
          silent: true,
          symbol: 'none',
          lineStyle: { type: 'dashed', color: 'rgba(232,151,29,.9)' },
          label: {
            color: '#d98a00',
            fontSize: 11,
            position: 'insideEndTop',
            formatter: `年许可水量 ${it.perm.toLocaleString()}`
          },
          data: [{ yAxis: it.perm }]
        }
      }
      setOptions({
        backgroundColor: 'transparent',
        tooltip: TIP,
        legend: { show: false },
        grid: { left: 64, right: 26, top: 16, bottom: 26 },
        xAxis: {
          type: 'category',
          data: s.xs,
          boundaryGap: false,
          ...AX,
          axisLabel: {
            ...AX.axisLabel,
            interval: (_i: number, v: string) => String(v).endsWith('/1')
          }
        },
        yAxis: {
          type: 'value',
          name: '万m³',
          nameTextStyle: { color: '#41577a', fontSize: 11 },
          max: yMax,
          ...AX
        },
        series: [ser]
      })
      return
    }
    const s = wmMonthSeries(it)
    setOptions({
      backgroundColor: 'transparent',
      tooltip: TIP,
      legend: { show: false },
      grid: { left: 64, right: 64, top: 16, bottom: 26 },
      xAxis: { type: 'category', data: s.xs, ...AX },
      yAxis: [
        {
          type: 'value',
          name: '月取水量',
          nameTextStyle: { color: '#41577a', fontSize: 11 },
          ...AX
        },
        {
          type: 'value',
          name: '累计水量',
          nameTextStyle: { color: '#41577a', fontSize: 11 },
          ...AX2
        }
      ],
      series: [
        {
          name: '月取水量',
          type: 'bar',
          data: s.vals,
          barWidth: 20,
          itemStyle: {
            borderRadius: [3, 3, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#35d0af' },
              { offset: 1, color: '#1f7ae0' }
            ])
          }
        },
        {
          name: '累计水量',
          type: 'line',
          data: s.cum,
          yAxisIndex: 1,
          symbol: 'circle',
          symbolSize: 5,
          lineStyle: { width: 2.2, color: '#e8971d' },
          itemStyle: { color: '#e8971d' }
        }
      ]
    })
    return
  }
  const { gates, per, total } = wmCertSeries(it, year.value)
  const mRaw = Math.max(...total, it.perm) * 1.06
  const cMax = mRaw >= 1000 ? Math.ceil(mRaw / 1000) * 1000 : Math.ceil(mRaw / 50) * 50
  setOptions({
    backgroundColor: 'transparent',
    tooltip: TIP,
    legend: { show: false },
    grid: { left: 60, right: 64, top: 16, bottom: 30 },
    xAxis: { type: 'category', data: total.map((_, i) => `${i + 1}月`), ...AX },
    yAxis: [
      {
        type: 'value',
        name: '月取水量/万m³',
        nameTextStyle: { color: '#41577a', fontSize: 11 },
        ...AX
      },
      {
        type: 'value',
        name: '累计/万m³',
        nameTextStyle: { color: '#41577a', fontSize: 11 },
        max: cMax,
        ...AX2
      }
    ],
    series: [
      ...gates.map((g, i) => ({
        name: g,
        type: 'line' as const,
        data: per[i],
        symbol: 'none',
        smooth: true,
        lineStyle: { width: 1.8, color: WM_GC[i % WM_GC.length] }
      })),
      {
        name: '累计水量',
        type: 'line',
        data: wmCum(total),
        yAxisIndex: 1,
        symbol: 'none',
        smooth: true,
        lineStyle: { width: 2.6, color: '#e8971d' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(232,151,29,.16)' },
            { offset: 1, color: 'rgba(232,151,29,0)' }
          ])
        }
      }
    ]
  })
}

// 页签 / 粒度 / 时间段 / 年份变化后重绘
watch([view, statsTab, gran, from, to, year, visible], () => {
  if (view.value === 'stats' && visible.value) {
    nextTick(() => drawChart())
  }
})

/**
 * 打开弹框：展示当前监控点位关联取水口的信息（基础信息 / 水量统计）
 * @param st 点位对象（列表页传入）
 */
const show = (st: StationItem) => {
  cur.value = matchIntake(st)
  view.value = 'info'
  statsTab.value = 'it'
  gran.value = 'day'
  year.value = '2026'
  from.value = WM_D0
  to.value = WM_D1
  visible.value = true
}

const hide = () => {
  visible.value = false
}

defineExpose({ show, hide })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    :title="`${cur?.name || ''} 取水口信息`"
    table-theme="light"
    content-mode="scroll"
    default-padding="0"
    :style-params="{ width: '1240px', height: '86vh' }"
  >
    <!-- 页签（对齐 LicDetailModal：ProTabs + lcm-tabs 留白） -->
    <pro-tabs v-model="view" :items="detailTabs" class="lcm-tabs" />

    <!-- 页签一：基础信息 -->
    <div v-if="view === 'info'" class="lgrid">
      <div class="lgsec">基本信息</div>

      <template v-for="item in infoBasicKv" :key="item.k">
        <span class="k">{{ item.k }}</span>
        <span class="v">{{ item.v || '—' }}</span>
      </template>

      <!-- 取水口信息：标签与上方字段同列同宽，右侧放三列明细表 -->
      <div class="lgfull">
        <span class="k">取水口信息</span>
        <div class="lpts-wrap pt-table-wrap">
          <pro-table :columns="ptColumns" :data="ptsRows" :is-pagination="false" height="" />
        </div>
      </div>

      <template v-for="item in infoSourceKv" :key="item.k">
        <span class="k">{{ item.k }}</span>
        <span class="v">{{ item.v || '—' }}</span>
      </template>

      <div class="lgsec">行政区划与监管</div>

      <template v-for="item in adminItems" :key="item.k">
        <span class="k">{{ item.k }}</span>
        <span class="v">{{ item.v || '—' }}</span>
      </template>
    </div>

    <!-- 页签二：水量统计 -->
    <template v-else>
      <div class="lq-row">
        <span class="lq-lbl">统计维度：</span>
        <span class="lm-seg">
          <span :class="{ on: statsTab === 'it' }" @click="statsTab = 'it'">按取水口统计</span>
          <span :class="{ on: statsTab === 'cert' }" @click="statsTab = 'cert'">按许可证统计</span>
        </span>
      </div>

      <div class="lq-row">
        <span class="lq-lbl">统计时间：</span>
        <span v-if="statsTab === 'it'" class="lm-seg">
          <span :class="{ on: gran === 'day' }" @click="gran = 'day'">按日统计</span>
          <span :class="{ on: gran === 'month' }" @click="gran = 'month'">按月统计</span>
        </span>
        <template v-if="statsTab === 'it'">
          <DatePicker v-model="from" type="date" size="small" width="140px" :clearable="false" />
          <span>至</span>
          <DatePicker v-model="to" type="date" size="small" width="140px" :clearable="false" />
        </template>
        <DatePicker
          v-else
          v-model="year"
          type="year"
          size="small"
          width="110px"
          :clearable="false"
        />
        <span class="lq-note">（{{ rangeText }}）</span>
      </div>

      <div class="lq-cards">
        <div v-for="(c, i) in statCards" :key="c.cap" class="lq-card">
          <div class="cap">{{ c.cap }}</div>
          <div class="v" :class="i === 1 ? 'o' : 'g'">{{ c.v }}</div>
          <div class="t">{{ c.t }}</div>
        </div>
      </div>

      <div class="lq-main">
        <div class="lq-chart">
          <div class="lq-title">{{ cur?.name }} · {{ rangeText }} 取水变化过程</div>
          <div class="lm-legend">
            <span v-for="l in legendItems" :key="l.name">
              <i :style="{ background: l.color }"></i>{{ l.name }}
            </span>
          </div>
          <div ref="chartRef" class="lq-echart"></div>
        </div>
        <div class="lq-tbl">
          <div class="lq-title">
            取水过程统计表（{{ statsTab === 'it' ? '按取水口' : '按许可证' }}）
          </div>
          <pro-table :columns="statsColumns" :data="statsRows" :is-pagination="false" height="" />
        </div>
      </div>

      <div class="lq-foot">{{ footText }}</div>
    </template>
  </pro-modal>
</template>

<style scoped lang="scss">
@use '@/assets/style/lic-modal-common.scss' as lic;

/* 页签（弹框 padding 为 0，由这里补页签外层留白） */
.lcm-tabs {
  padding: 10px 24px 0;
}

/* ================= 基本信息（四列字段栅格，样式取自公共 lic(detail-kv)） ================= */
.lgrid {
  @include lic.detail-kv;

  padding: 10px 24px 18px;
}

/* 分组标题（左蓝条 + 渐隐分隔线）与跨列块 */
.lgsec,
.lgfull {
  grid-column: 1 / -1;
}

.lgsec {
  @include lic.sect-title;

  margin: 2px 0 -2px;
}

/* 取水口信息：标签与上方字段同列同宽，右侧放三列明细表 */
.lgfull {
  display: flex;
  gap: 22px;
  padding-bottom: 4px;

  .k {
    flex: none;
    width: 150px;
    border-bottom: none;
  }
}

/* 取水口明细表：容器描边 / 圆角由 .pt-table-wrap 统一提供 */
.lpts-wrap {
  flex: 1;
  min-width: 0;
  max-height: 240px;

  &.pt-table-wrap {
    overflow: auto;
  }
}

/* ==================== 水量统计（对齐 LicDetailModal） ==================== */
.lq-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 12px 24px 0;
  font-size: lic.$font-title;
  color: lic.$c-text;
}

.lq-lbl {
  flex: none;
}

.lq-note {
  font-size: lic.$font-xs;
  color: lic.$c-secondary;
}

/* 分段按钮（统计维度 / 日、月粒度） */
.lm-seg {
  display: inline-flex;
  overflow: hidden;
  border: 1px solid #c2d7ef;
  border-radius: 3px;

  span {
    padding: 4px 13px;
    font-size: lic.$font-sm;
    color: lic.$c-text;
    cursor: pointer;
    background: #fff;

    &.on {
      color: #fff;
      background: lic.$c-blue;
    }
  }
}

/* 统计卡 */
.lq-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  padding: 12px 24px 2px;
}

.lq-card {
  padding: 12px 18px;
  background: #f9fbfe;
  border: 1px solid #e3ecf7;
  border-radius: 6px;

  .cap {
    font-size: lic.$font-sm;
    color: lic.$c-secondary;
  }

  .v {
    font-size: 26px;
    font-weight: 800;
    line-height: 1.3;

    &.g {
      color: #18a05e;
    }

    &.o {
      color: #f08c00;
    }
  }

  .t {
    margin-top: 2px;
    font-size: lic.$font-xs;
    color: lic.$c-muted;
  }
}

/* 图表 + 统计表 */
.lq-main {
  display: flex;
  align-items: stretch;
  gap: 14px;
  padding: 12px 24px 8px;
}

.lq-chart {
  flex: 1.9;
  min-width: 0;
  padding: 10px 12px 6px;
  background: #fff;
  border: 1px solid #e3ecf7;
  border-radius: 6px;
}

.lq-tbl {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  max-height: 372px;
  padding: 10px 12px 8px;
  overflow: auto;
  background: var(--pt-wrap-bg);
  border: 1px solid var(--pt-wrap-border-color);
  border-radius: var(--pt-radius);
}

.lq-echart {
  width: 100%;
  height: 300px;
}

.lq-title {
  margin: 2px 0 4px;
  font-size: lic.$font-title;
  font-weight: 700;
  text-align: center;
  color: lic.$c-text;
}

.lm-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 26px;
  justify-content: center;
  margin-bottom: 2px;
  font-size: lic.$font-xs;
  color: lic.$c-text;

  i {
    display: inline-block;
    width: 16px;
    height: 3px;
    margin-right: 5px;
    vertical-align: middle;
    border-radius: 2px;
  }
}

/* 语义化扩展：数值列强调（尺寸沿用全局标准） */
.lq-tbl :deep(.num-cell) .vxe-cell {
  font-weight: 700;
  color: lic.$c-blue-deep !important;
}

/* 底部备注 */
.lq-foot {
  margin: 2px 24px 14px;
  padding: 8px 14px;
  font-size: lic.$font-xs;
  line-height: 1.65;
  color: lic.$c-secondary;
  background: #f4f7fb;
  border-radius: 4px;
}
</style>
