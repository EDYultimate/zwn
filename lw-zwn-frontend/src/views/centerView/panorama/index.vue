<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, type Ref } from 'vue'
import { useECharts } from '@/hooks/web/useECharts'
import request from '@/utils/request'
import { getCumulativeSupply, getEcoMaxTime } from '@/api/ecology'
import { queryNewSeason, getFusuData, getHupoAvailableMonths } from '@/api/recovery'
import { statistics } from '@/api/hwwr/wrWhs'
import { panoramaTransfer, mapPoints } from '@/api/waterdisp'
import { getBaseInfo, getStatDetail, mapEngPoints } from '@/api/quyongshui'
import { useMapBridge } from '@/hooks/web/useMapBridge'
import { useMapStationDialog } from '@/hooks/web/useMapStationDialog'
import StationDetailDialog from '@/views/centerView/diaoshui/components/StationDetailDialog.vue'
import StatDetailDialog from '@/components/business/StatDetailDialog.vue'
import EcoSectionDialog from '@/views/business/ecoFlow/components/EcoSectionDialog.vue'

const handleDiaoshuiBtnClick = () => {
  window.$message.success('成功')
}

const handleClick = (path: string) => {
  const { origin } = window.location
  window.open(`${origin}${path}`, '_blank')
}

// 年份选择器各自独立、互不联动（2026-09-22 用户要求）：水资源量 / 生态流量
// （取用水块的选择器已于 2026-09-23 按要求去掉，块内不按年取数）
const waterResYear = ref('2000')
const ecoYear = ref('2023')

import water_use from '@/assets/img/layout/menu/horizontal/water_use.png'
import water_get from '@/assets/img/layout/menu/horizontal/water_get.png'

const leftMenuList = ref([
  {
    name: '调水一张图',
    path: '/waterAdjust/diaoshuyizhangtu',
    img: water_use
  },
  {
    name: '取用水一张图',
    path: '/waterUse/quyongshui',
    img: water_get
  }
])

// ==================== 左侧：调水表格（接真实接口 /waterdisp/panoramaTransfer） ====================
// 四线路：永定河/滦河/引滦工程/北延供水
// 口径（用户 2026-09-21 拍板 + 2026-09-23 按日调整 + 2026-09-23 口径修订）：
//   永定河=官厅以上+以下（7 站）；引滦工程=引滦入唐+引滦入津+滦下供水 三站累加；
//   北延供水=第三店+九宣闸（东线北延两入水口，调度年同南水北调 11-02 起）；
//   以上按所选日期取数——日数据=所选日当天、月数据=02 日制当月累计（1 号取上月 2 号起）、年累计=调度年起~所选日；
//   滦河无日数据：只取 PORTAL_SYS.SZY_LURU_DATA 季度录入数据，日数据恒为「-」、
//   月数据=最近一个有数据的季度累加、年累计=调度年范围内累加（后端已算好，前端直接展示）；
//   水位每天优先 DAY_Q，无则 AWQ*8.64（COALESCE 回退）
const transferDate = ref(dayStr(new Date()))

/** 各线路数据来源（悬停行显示小飘窗；来源由用户 2026-09-23 提供，文字为说明性表述） */
const TRANSFER_SOURCE: Record<string, string[]> = {
  YD: ['官厅以上', '官厅以下'],
  LH: [
    '滦河_天津',
    '滦河_闪电河以上',
    '滦河_西山湾-潘家口',
    '滦河_潘家口-入海口',
    '滦河_内蒙古',
    '滦河_辽宁'
  ],
  LD: ['引滦入唐', '引滦入津', '滦下供水'],
  NSBD: ['第三店（入河北）', '九宣闸（入天津）']
}

/** 数据来源飘窗主题：白底深蓝字（与页面浅色系一致；naive 的 Tooltip 配色只能走 theme-overrides） */
const TIP_THEME = { color: '#ffffff', textColor: '#244165' }

const transferRows = ref<
  {
    lineNm: string
    period: string
    day: number | string
    month: number | string
    yearTotal: number | string
    source: string[]
  }[]
>([])

/** yyyy-MM-dd（日期选择器与接口同格式） */
function dayStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`
}

/** 调水周期显示：调度年区间（如 2025/11\n2026/10，两行格式与样例一致） */
/** 调水周期显示：调度年区间一行短格式（年份取后两位，如 25/11-26/10） */
function transferPeriod(pym: string) {
  const [y, m] = String(pym).split('-')
  return `${String(y).slice(-2)}/${m}`
}

async function loadTransfer() {
  try {
    const res = await panoramaTransfer({ date: transferDate.value })
    if (res.code === 0 && res.data && Array.isArray(res.data.rows)) {
      // 接口回填实际取数日（缺省请求时=库中最新有数据日）
      if (res.data.date) {
        transferDate.value = res.data.date
      }
      transferRows.value = res.data.rows.map((r: any) => ({
        lineNm: r.lineNm || '',
        period: transferPeriod(r.periodStart) + '-' + transferPeriod(r.periodEnd),
        day: r.day ?? '-',
        month: r.month ?? '-',
        yearTotal: r.yearTotal ?? '-',
        source: TRANSFER_SOURCE[r.lineCd] || []
      }))
    }
  } catch (e) {
    console.warn('panoramaTransfer failed', e)
  }
}

// ==================== 左侧：取用水数据（委发证取水许可证统计，/quyongshui/getBaseInfo） ====================
const waterUseData = ref({
  permitOut: '-', // 许可水量（河道外）亿m³
  certCount: '-', // 证照总数（个）
  riverInPermit: '-', // 河道内许可（亿m³）
  ownerCount: '-' // 取用水户总数（个）
})

async function loadWaterUse() {
  try {
    const res = await getBaseInfo()
    if (res.code === 0 && res.data) {
      const d: any = res.data
      const fmt = (v: number) => (v == null ? '-' : Number(v).toFixed(2))
      waterUseData.value = {
        permitOut: fmt(Number(d.sumXukeWfzOut) || 0),
        certCount: Number(d.countCertWfz) || 0,
        riverInPermit: fmt(Number(d.sumXukeWfzIn) || 0),
        ownerCount: Number(d.countOwnerWfz) || 0
      }
    }
  } catch (e) {
    console.warn('getBaseInfo failed', e)
  }
}

// ==================== 取用水统计明细弹窗（点击块内统计数值打开） ====================
// 与取用水模块（centerView/quyongshui）/ 子系统页（zhhSystem）同款公共弹窗 StatDetailDialog：
// 表头与数据均由后端按统计类型下发（/quyongshui/statDetail?kind=），明细条数 = 页面统计值
type StatKind = 'sumXukeWfzOut' | 'certWfz' | 'sumXukeWfzIn' | 'ownerWfz'

const STAT_TITLE: Record<StatKind, string> = {
  sumXukeWfzOut: '许可水量（河道外）明细',
  certWfz: '委发证证照明细',
  sumXukeWfzIn: '河道内许可明细',
  ownerWfz: '取用水户明细'
}

const statDlg = ref({
  show: false,
  title: '',
  totalText: '',
  unitText: '',
  rowGroupSize: 1,
  columns: [] as any[],
  rows: [] as Record<string, any>[],
  loading: false
})

async function openStatDetail(kind: StatKind) {
  statDlg.value = {
    show: true,
    title: STAT_TITLE[kind] || '数据明细',
    totalText: '',
    unitText: '单位：万m³',
    rowGroupSize: 1,
    columns: [],
    rows: [],
    loading: true
  }
  try {
    const res: any = await getStatDetail(kind)
    if (res.code === 0 && res.data) {
      const list: any[] = res.data.rows || []
      statDlg.value.columns = res.data.columns || []
      statDlg.value.rows = list
      statDlg.value.totalText = `共 ${list.length} 条`
    }
  } catch (e) {
    console.warn('panorama statDetail failed', e)
    statDlg.value.rows = []
  } finally {
    statDlg.value.loading = false
  }
}

// ==================== 左侧：水资源量数据（水资源公报 getGbsl 全流域） ====================
// 字段对应 publicReport/reportTrees：CUR_P=降水量、DBSTOL=地表水、WR_T=水资源量、DXSTOL=地下水
const FULL_BASIN_CD = 'C000000040000' // 全流域分区编码（tableTypes l5）
const waterResourceData = ref({
  rainfall: '-' as string | number,
  surfaceWater: '-' as string | number,
  waterTotal: '-' as string | number,
  groundwater: '-' as string | number
})
const waterLoading = ref(false)
// 公报可选年份列表（接口返回），用于限制年份选择范围
const wrYears = ref<string[]>([])

// 仅允许选择公报年份列表内的年份
function wrDateDisabled(d: Date) {
  return wrYears.value.length > 0 && !wrYears.value.includes(String(d.getFullYear()))
}

async function loadWaterResource() {
  waterLoading.value = true
  try {
    const res: any = await request({
      url: '/api/szyGb/getGbsl',
      method: 'GET',
      data: { btm: waterResYear.value, etm: waterResYear.value }
    })
    const list = res?.data?.[0]?.list || []
    const row =
      list.find((r: any) => String(r.YEAR) === String(waterResYear.value)) || list[0] || {}
    waterResourceData.value = {
      rainfall: row[`${FULL_BASIN_CD}_CUR_P`] ?? '-',
      surfaceWater: row[`${FULL_BASIN_CD}_DBSTOL`] ?? '-',
      waterTotal: row[`${FULL_BASIN_CD}_WR_T`] ?? '-',
      groundwater: row[`${FULL_BASIN_CD}_DXSTOL`] ?? '-'
    }
  } catch (e) {
    console.warn('loadWaterResource failed', e)
  } finally {
    waterLoading.value = false
  }
}

// 初始年份不在公报年份列表时，收敛到最新年份后再查询
async function initWaterResource() {
  try {
    const res: any = await request({
      url: '/api/szyGb/getIndex_Gsl_Year',
      method: 'GET',
      data: {}
    })
    const years = (res?.data || []).map((d: any) => String(d.YEAR))
    wrYears.value = years
    if (years.length > 0) {
      waterResYear.value = years[0]
      return // watch 会触发查询
    }
  } catch (e) {
    console.warn('getIndex_Gsl_Year failed', e)
  }
  loadWaterResource()
}

// 仅水资源量块随其年份选择请求数据（取用水/生态流量暂无按年接口，独立后互不影响）
watch(waterResYear, () => {
  loadWaterResource()
})

// ==================== 右1：地下水（按用户给定数据展示） ====================
const groundWaterOverview = ref({
  overArea: 85399, // 超采区面积（km²）
  overQty: 115650, // 超采量（万m³）
  countyLevel: 282, // 水位监管区县个数（处）
  countyVolume: 342 // 水量监管区县个数（处）
})

// ==================== 右2：河湖补水（lakeSupply/overview 自试点累计补水量环形图） ====================
const supplyLoading = ref(false)
const supplyChartRef = ref<HTMLDivElement | null>(null)
const { setOptions: setSupplyOptions } = useECharts(supplyChartRef as Ref<HTMLDivElement>)

// 截止月份选择：默认最新有数据月份；选择更早月份则按截止该月累计
// ★初始必须给合法日期，否则 NaiveUI date-picker 解析空串抛 Invalid time value 导致整个页面白屏
function monthStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
const supplyMaxMonth = ref('')
const supplyMonth = ref(monthStr(new Date()))

function supplyDateDisabled(ts: number) {
  const d = new Date(ts)
  const mm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  return mm < '2018-01' || (supplyMaxMonth.value !== '' && mm > supplyMaxMonth.value)
}

const SUPPLY_COLORS = ['#6FBD45', '#42CBCC', '#E5BC29', '#E37C49', '#6F64EE', '#256AB7']
const SUPPLY_LABELS: Record<string, string> = {
  SYSK: '上游水库',
  NSBDZX: '南水北调中线',
  NSBDDX: '南水北调东线',
  YH: '引黄',
  YL: '引滦',
  ZSSJYHS: '再生水及其他'
}

const supplyChartData = ref<{ name: string; value: number }[]>([])
const supplyTotal = ref(0)

// 样例数据：接口不可用时保证环形图可见（单位：亿m³）
const SUPPLY_SAMPLE = [
  { key: 'SYSK', value: 0.45 },
  { key: 'NSBDZX', value: 3.2 },
  { key: 'NSBDDX', value: 1.02 },
  { key: 'YH', value: 2.41 },
  { key: 'YL', value: 0.38 },
  { key: 'ZSSJYHS', value: 0.96 }
]

function applySupplyData(data: Record<string, number>) {
  supplyChartData.value = SUPPLY_SAMPLE.map((s) => ({
    name: SUPPLY_LABELS[s.key],
    value: Number(((data?.[s.key] ?? s.value) || 0).toFixed(2))
  }))
  supplyTotal.value = Number(
    supplyChartData.value.reduce((sum, it) => sum + it.value, 0).toFixed(2)
  )
  renderSupplyChart()
}

function renderSupplyChart() {
  const pieData = supplyChartData.value.map((item, index) => ({
    ...item,
    itemStyle: { color: SUPPLY_COLORS[index % SUPPLY_COLORS.length] }
  }))
  setSupplyOptions({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} 亿m³ ({d}%)',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e3e8f1',
      borderWidth: 1,
      textStyle: { color: '#1a2332', fontSize: 13 }
    },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'center',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 10,
      textStyle: { fontSize: 12, color: '#5f7794' },
      formatter: (name: string) => {
        const item = supplyChartData.value.find((d: any) => d.name === name)
        return item ? `${name}  ${item.value}` : name
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '75%'],
        center: ['34%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          color: (params: any) => SUPPLY_COLORS[params.dataIndex % SUPPLY_COLORS.length],
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'center',
          formatter: `{total|${supplyTotal.value}}\n{label|自试点累计水量}`,
          rich: {
            total: { fontSize: 18, fontWeight: 'bold', color: '#333', lineHeight: 26 },
            label: { fontSize: 12, color: '#666', lineHeight: 18 }
          }
        },
        labelLine: { lineStyle: { color: '#999' } },
        data: pieData
      },
      {
        type: 'pie',
        radius: ['45%', '80%'],
        center: ['34%', '50%'],
        itemStyle: { color: 'rgba(62, 109, 255, 0.15)' },
        emphasis: { scale: false },
        label: { show: false },
        data: [{ value: 1 }],
        z: -1,
        silent: true
      }
    ] as any
  })
}

async function loadCumulativeSupply() {
  supplyLoading.value = true
  try {
    const params = supplyMonth.value ? { tm: supplyMonth.value } : {}
    const res = await getCumulativeSupply(params)
    if (res.code === 0 && res.data) {
      applySupplyData(res.data)
    } else {
      // 接口无数据：使用样例保证展示
      applySupplyData({})
    }
  } catch (e) {
    console.warn('loadCumulativeSupply failed, use sample', e)
    applySupplyData({})
  } finally {
    supplyLoading.value = false
  }
}

// 初始化截止月份（默认取最新有数据月份）
async function initSupplyMonth() {
  try {
    const res = await getEcoMaxTime()
    if (res.code === 0 && res.data) {
      supplyMaxMonth.value = String(res.data)
      // 初始（或用户选中的）月份晚于最新数据月时，收敛到最新数据月
      if (supplyMonth.value > supplyMaxMonth.value) {
        supplyMonth.value = supplyMaxMonth.value
      }
    }
  } catch (e) {
    console.warn('getEcoMaxTime failed', e)
  }
  await loadCumulativeSupply()
}

// ==================== 右3：生态流量（不变，样例值） ====================
const ecoFlowData = ref({
  targetRiverLakeCount: 58,
  controlSectionCount: 91,
  newSectionCount: 58
})

// ==================== 生态流量断面基本信息弹窗（点击块内统计数值打开） ====================
// 与生态流量模块（/ecoFlow/monitor）三个标题的详情弹窗同款 EcoSectionDialog：
// scope='all' 全部断面基本信息 / scope='tracked' 重点跟踪断面（即具备监测评估条件的断面），
// 数据由组件按 scope 自取 /ecology/ecoFlow/sections
const sectionDialog = ref({ show: false, title: '', scope: 'all' as 'all' | 'tracked' })

function openEcoSections(scope: 'all' | 'tracked') {
  sectionDialog.value = {
    show: true,
    title: scope === 'tracked' ? '重点跟踪断面基本信息' : '断面基本信息',
    scope
  }
}

// ==================== 右4：河湖复苏（lakeRevival/overview 整体情况：全线贯通河流数量 + 全线有水平均天数） ====================
// 时间选择逻辑与 lakeRevival/overview 一致：2026 及以后为月度，2025 及以前为季度
const revivalLoading = ref(false)
const revivalData = ref<{ allRiverNum: string | number; avgWaterDays: string | number }>({
  allRiverNum: '-',
  avgWaterDays: '-'
})

const revivalYear = ref(new Date().getFullYear().toString())
const revivalSeason = ref('')
const revivalIsMonthly = ref(false)
const revivalAvailableMonths = ref<any[]>([])
const revivalQuarterOptions = [
  { label: '第1季度', value: '1' },
  { label: '第2季度', value: '2' },
  { label: '第3季度', value: '3' },
  { label: '第4季度', value: '4' }
]
const filteredRevivalMonthOptions = computed(() => {
  const availableSet = new Set(revivalAvailableMonths.value.map((m: any) => Number(m.SEASON)))
  const options: any[] = []
  for (let i = 1; i <= 12; i++) {
    options.push({
      label: i + '月',
      value: String(i),
      disabled: revivalIsMonthly.value && availableSet.size > 0 ? !availableSet.has(i) : false
    })
  }
  return options
})

async function loadRevivalAvailableMonths() {
  if (Number(revivalYear.value) >= 2026) {
    revivalIsMonthly.value = true
    const res = await getHupoAvailableMonths({ year: revivalYear.value })
    if (res.code === 0 && res.data) {
      revivalAvailableMonths.value = res.data || []
    }
  } else {
    revivalIsMonthly.value = false
    revivalAvailableMonths.value = []
  }
}

async function loadRevivalStats() {
  if (!revivalSeason.value) {
    return
  }
  revivalLoading.value = true
  try {
    const res = await getFusuData({
      year: revivalYear.value,
      season: revivalSeason.value
    })
    if (res.code === 0 && res.data) {
      revivalData.value = {
        allRiverNum: res.data.all_river_num ?? '-',
        avgWaterDays: res.data.avg_water_days ?? '-'
      }
    }
  } catch (e) {
    console.warn('loadRevivalStats failed', e)
  } finally {
    revivalLoading.value = false
  }
}

async function loadRevivalMeta() {
  try {
    const res = await queryNewSeason()
    if (res.code === 0 && res.data) {
      revivalYear.value = String(res.data.YEAR)
      if (Number(revivalYear.value) >= 2026) {
        revivalIsMonthly.value = true
        revivalSeason.value = String(res.data.SEASON)
        await loadRevivalAvailableMonths()
      } else {
        revivalIsMonthly.value = false
        revivalSeason.value = String(res.data.SEASON)
      }
      loadRevivalStats()
      return
    }
  } catch (e) {
    console.warn('queryNewSeason failed, using defaults', e)
  }
  // 兜底：默认选 2025 年第 4 季度
  revivalYear.value = '2025'
  revivalIsMonthly.value = false
  revivalSeason.value = '4'
  loadRevivalStats()
}

async function onRevivalYearChange() {
  if (Number(revivalYear.value) >= 2026) {
    revivalIsMonthly.value = true
    await loadRevivalAvailableMonths()
    if (revivalAvailableMonths.value.length > 0) {
      revivalSeason.value = String(
        revivalAvailableMonths.value[revivalAvailableMonths.value.length - 1].SEASON
      )
    } else {
      revivalSeason.value = ''
    }
  } else {
    revivalIsMonthly.value = false
    revivalAvailableMonths.value = []
    if (Number(revivalSeason.value) > 4) {
      revivalSeason.value = '1'
    }
  }
  loadRevivalStats()
}

function onRevivalSeasonChange() {
  loadRevivalStats()
}

// ==================== 右5：饮用水水源地（waterSource/sourcePanel 流域整体情况：重要饮用水水源地 + 设计总供水人口） ====================
const sourceLoading = ref(false)
const sourceData = ref<{ sourceCount: string | number; supplyPopulation: string | number }>({
  sourceCount: '-',
  supplyPopulation: '-'
})

async function loadSourceData() {
  sourceLoading.value = true
  try {
    // 与 waterSource/sourcePanel 默认一致：取 rptYr=2025
    const res = await statistics({ rptYr: '2025' })
    if (res.code === 0 && res.data) {
      sourceData.value = {
        sourceCount: res.data.targetRiverLakeCount ?? '-',
        supplyPopulation: res.data.newSectionCount ?? '-'
      }
    }
  } catch (e) {
    console.warn('loadSourceData failed', e)
  } finally {
    sourceLoading.value = false
  }
}

// ==================== 地图桥接：业务全景地图（gis_mapbox_es shouye 模块）加载完成后，
// 把「调水管理」「取用水」两模块的业务数据传给 GIS（方法名带 Shouye 后缀，为首页专用入口） ====================
/** 数据集与两模块页面完全一致：调水=mapPoints（7 线路点位，同 /waterAdjust/diaoshuyizhangtu）；
 *  取用水=mapEngPoints（取水工程点位，同 /waterUse/quyongshui） */
async function loadMapTransferData() {
  try {
    const res = await mapPoints()
    if (res.code === 0 && res.data && Array.isArray(res.data.lines)) {
      const all = res.data.lines.flatMap((l: any) => l.points || [])
      callMapReady((win) => (win as any).m_oDataToJieShuiShouye?.({ id: '0', data: all }))
    }
  } catch (e) {
    console.warn('panorama mapPoints failed', e)
  }
  try {
    const res = await mapEngPoints()
    if (res.code === 0 && Array.isArray(res.data) && res.data.length > 0) {
      callMapReady((win) => (win as any).m_ogetDataShouye?.(res.data))
    }
  } catch (e) {
    console.warn('panorama mapEngPoints failed', e)
  }
}

// 首页地图应用以接收方法（m_oDataToJieShuiShouye）作为就绪标志；就绪后传两组业务数据。
// 点位点击 → 单站详情弹窗：与调水一张图同一套实现（公共 hook + StationDetailDialog），
// GIS 点击点位后 postMessage { eventname:'details', STCD, MARK, TM, STNM }
const { mapStationShow, mapStationRow, mapStationWt, onMapNodeClick } = useMapStationDialog()

const { callMapReady } = useMapBridge({
  readyMethod: 'm_oDataToJieShuiShouye',
  messageHandlers: {
    details: onMapNodeClick
  },
  onReady: () => {
    loadMapTransferData()
  }
})

onMounted(() => {
  // 样例数据先渲染，保证环形图/数值立即可见；接口可用后自动刷新为真实数据
  applySupplyData({})
  initSupplyMonth()
  loadRevivalMeta()
  loadSourceData()
  loadTransfer()
  loadWaterUse()
  initWaterResource()
})

const options = [
  {
    label: '漳河上游水资源',
    key: '漳河上游水资源'
  },
  {
    label: '漳卫南水资源',
    key: '漳卫南水资源'
  }
]

/**
 * 进入系统下拉 → 两个子系统页面（漳河上游 / 漳卫南）
 *
 * 用 window.open 新标签页打开（与下拉里其他「进入系统」项一致）：
 * 这两个页面的地图应用与业务全景不同（diaoshuiguanli ↔ shouye），若在 SPA 内 push，
 * 地图 iframe 会重新加载，而**子框架导航同样计入浏览器联合历史**——表现为"要按两次返回才回到全景"。
 * 新标签页打开可避开该问题；若将来要改回 SPA 内跳转，需由 GIS 侧支持"单实例内切换模块"。
 */
const SYSTEM_ROUTE: Record<string, string> = {
  漳河上游水资源: '/centerView/zhangheUpstream',
  漳卫南水资源: '/centerView/zhangweinan'
}

function handleSelect(key: string | number) {
  const k = String(key)
  // 1.内部子系统路由（顶部「进入系统」下拉）
  const path = SYSTEM_ROUTE[k]
  if (path) {
    const { origin } = window.location
    window.open(`${origin}${path}`, '_blank')
    return
  }
  // 2.外部信息系统（底部「相关系统」下拉），新标签页打开
  const sys = INFO_SYSTEM_LIST.find((s) => s.name === k)
  if (sys?.url) {
    window.open(sys.url, '_blank')
    return
  }
  // 3.相关网站（底部「相关网站」下拉），新标签页打开
  const site = WEBSITE_LIST.find((s) => s.name === k)
  if (site?.url) {
    window.open(site.url, '_blank')
  }
}

/**
 * 信息系统导航数据（底部「相关系统」下拉）
 * picUrl 为旧系统导航图标路径，本项目暂无对应资源；资源补齐后可通过 option.icon 渲染
 */
const INFO_SYSTEM_LIST = [
  {
    name: '全国取用水管理平台',
    url: 'http://qysgl.mwr.cn/wr_web_manager/#/loginhaihe'
  },
  {
    name: '水利部政务服务审批系统',
    url: 'http://10.1.1.126/spjc/userlogin.do?ltype=oldLogin'
  },
  {
    name: '用水统计调查直报管理系统',
    url: 'https://qysgl.mwr.cn/zb/#/login'
  },
  {
    name: '数字孪生永定河平台',
    url: 'http://10.3.4.64:9060/ydrtclsCard'
  },
  {
    name: '数字孪生漳卫河',
    url: 'http://10.3.70.34:8086/portals'
  },
  {
    name: '华北地下水超采',
    url: 'https://10.3.247.9:8088/gwnc/login_new.html'
  }
]

/** 「相关系统」下拉选项：url 为空（尚未开发）的项禁用 */
const infoSystemOptions = INFO_SYSTEM_LIST.map((s) => ({
  label: s.name,
  key: s.name,
  disabled: !s.url
}))

/**
 * 相关网站导航数据（底部「相关网站」下拉，均为水利部外部门户）
 */
const WEBSITE_LIST = [
  {
    name: '水资源管理',
    url: 'http://szy.mwr.gov.cn/'
  },
  {
    name: '节约用水',
    url: 'http://qgjsb.mwr.gov.cn/'
  },
  {
    name: '调水管理',
    url: 'http://dsgl.mwr.gov.cn/'
  }
]

/** 「相关网站」下拉选项 */
const websiteOptions = WEBSITE_LIST.map((s) => ({
  label: s.name,
  key: s.name
}))
</script>

<template>
  <div>
    <img
      src="@/assets/img/layout/menu/enter_btn2.png"
      class="enter-btn pointer-auto"
      style="position: fixed; right: 40px; top: 14px; cursor: pointer"
      alt=""
      @click="handleClick('/enter')"
    />

    <n-dropdown
      trigger="hover"
      size="huge"
      :show-arrow="true"
      :options="options"
      class="index_dropdown"
      @select="handleSelect"
    >
      <img
        src="@/assets/img/layout/menu/sys_choose2.png"
        class="enter-btn pointer-auto"
        style="position: fixed; right: 184px; top: 14px; cursor: pointer"
      />
    </n-dropdown>

    <!-- 进入业务"一张图"入口图：功能已迁入左侧一级菜单（调水管理/取用水 各自的二级菜单），此处暂时隐去；需恢复时改 v-show 为 true -->
    <div v-show="false" class="leftMenuBtn pointer-auto">
      <img
        v-for="item in leftMenuList"
        :key="item.path"
        :src="item.img"
        :alt="item.name"
        @click="handleClick(item.path)"
      />
    </div>

    <LeftSide width="480px" top="80px">
      <TitleBackOut content="调水" :is-click-btn="true" @btn-click="handleClick('/waterAdjust')">
        <div class="transfer-tools">
          <n-date-picker
            v-model:formatted-value="transferDate"
            type="date"
            size="small"
            style="width: 124px"
            value-format="yyyy-MM-dd"
            :clearable="false"
            @update:formatted-value="loadTransfer"
          />
          <!-- 单位标签：公共类 .unit-tag（标题行控件排序：下拉框 → 时间选择 → 单位）；2026-09-28 用户要求文案与深灰色 -->
          <span class="unit-tag">单位：万m³</span>
        </div>
      </TitleBackOut>
      <DivBackIn style="margin: 10px 0 4px">
        <div class="consistency-table">
          <div class="table-header">
            <span class="cell sub-name">线路</span>
            <span class="cell sub-name">调水周期</span>
            <span class="cell sub-name">日数据</span>
            <span class="cell sub-name">月数据</span>
            <span class="cell sub-name">年累计</span>
          </div>
          <!-- 悬停行显示该线路数据来源（2026-09-23 用户要求） -->
          <n-tooltip
            v-for="(row, index) in transferRows"
            :key="index"
            placement="right"
            :width="230"
            :theme-overrides="TIP_THEME"
          >
            <template #trigger>
              <div class="table-row">
                <span class="cell sub-name-label">{{ row.lineNm }}</span>
                <span class="cell sub-name-label">{{ row.period }}</span>
                <span class="cell sub-name-label">{{ row.day }}</span>
                <span class="cell sub-name-label">{{ row.month }}</span>
                <span class="cell sub-name-label">{{ row.yearTotal }}</span>
              </div>
            </template>
            <div class="src-tip">
              <div class="src-tip-hd">数据来源</div>
              <div v-for="s in row.source" :key="s" class="src-tip-item">{{ s }}</div>
            </div>
          </n-tooltip>
        </div>
      </DivBackIn>

      <!-- 取用水块无年份选择器（2026-09-23 用户要求去掉，块内不按年取数）；
           4 个统计数值可点击（2026-09-28），明细弹窗与取用水模块同款（/quyongshui/statDetail） -->
      <TitleBackOut content="取用水" :is-click-btn="true" @btn-click="handleClick('/waterUse')" />
      <DivBackIn style="margin: 10px 0 4px">
        <div class="grid-2">
          <div class="metric-item">
            <img src="@/assets/img/business/yl_shui.png" alt="" class="metric-icon" />
            <div>
              <div class="metric-label">许可水量（河道外）</div>
              <div
                class="metric-value num-click"
                title="点击查看明细"
                @click="openStatDetail('sumXukeWfzOut')"
              >
                {{ waterUseData.permitOut }} <span class="unit">亿m³</span>
              </div>
            </div>
          </div>
          <div class="metric-item">
            <img src="@/assets/img/business/yl_zheng.png" alt="" class="metric-icon" />
            <div>
              <div class="metric-label">证照总数</div>
              <div
                class="metric-value num-click"
                title="点击查看明细"
                @click="openStatDetail('certWfz')"
              >
                {{ waterUseData.certCount }} <span class="unit">个</span>
              </div>
            </div>
          </div>
          <div class="metric-item">
            <img src="@/assets/img/business/yl_shui.png" alt="" class="metric-icon" />
            <div>
              <div class="metric-label">河道内许可</div>
              <div
                class="metric-value num-click"
                title="点击查看明细"
                @click="openStatDetail('sumXukeWfzIn')"
              >
                {{ waterUseData.riverInPermit }} <span class="unit">亿m³</span>
              </div>
            </div>
          </div>
          <div class="metric-item">
            <img src="@/assets/img/business/yl_zheng.png" alt="" class="metric-icon" />
            <div>
              <div class="metric-label">取用水户总数</div>
              <div
                class="metric-value num-click"
                title="点击查看明细"
                @click="openStatDetail('ownerWfz')"
              >
                {{ waterUseData.ownerCount }} <span class="unit">个</span>
              </div>
            </div>
          </div>
        </div>
      </DivBackIn>

      <TitleBackOut
        content="水资源量"
        :is-click-btn="true"
        @btn-click="handleClick('/waterUse/qushuijianguan/shuiliangjiankong')"
      >
        <DatePicker
          v-model="waterResYear"
          type="year"
          size="small"
          width="120px"
          :clearable="false"
          :disabled-date="wrDateDisabled"
          :actions="null"
        />
      </TitleBackOut>
      <DivBackIn style="margin: 10px 0 4px" :is-loading="waterLoading">
        <div class="grid-2">
          <div class="metric-item">
            <img src="@/assets/img/business/yl_jiangyu.png" alt="" class="metric-icon" />
            <div>
              <div class="metric-label">降雨量</div>
              <div class="metric-value">
                {{ waterResourceData.rainfall }} <span class="unit">mm</span>
              </div>
            </div>
          </div>
          <div class="metric-item">
            <img src="@/assets/img/business/yl_dibiaoshui.png" alt="" class="metric-icon" />
            <div>
              <div class="metric-label">地表水资源量</div>
              <div class="metric-value">
                {{ waterResourceData.surfaceWater }} <span class="unit">亿m³</span>
              </div>
            </div>
          </div>
          <div class="metric-item">
            <img src="@/assets/img/business/yl_jingliu.png" alt="" class="metric-icon" />
            <div>
              <div class="metric-label">水资源总量</div>
              <div class="metric-value">
                {{ waterResourceData.waterTotal }} <span class="unit">亿m³</span>
              </div>
            </div>
          </div>
          <div class="metric-item">
            <img src="@/assets/img/business/yl_dixiashui.png" alt="" class="metric-icon" />
            <div>
              <div class="metric-label">地下水资源量</div>
              <div class="metric-value">
                {{ waterResourceData.groundwater }} <span class="unit">亿m³</span>
              </div>
            </div>
          </div>
        </div>
      </DivBackIn>
    </LeftSide>

    <RightSide width="480px" top="80px">
      <!-- 右1：地下水 -->
      <TitleBackOut content="地下水" :is-click-btn="true" @btn-click="handleClick('/waterGround')">
      </TitleBackOut>
      <DivBackIn style="margin: 10px 0 4px">
        <div class="grid-2">
          <div class="metric-item">
            <img src="@/assets/img/business/yl_dixiashui.png" alt="" class="metric-icon" />
            <div>
              <div class="metric-value">
                {{ groundWaterOverview.overArea }} <span class="unit">km²</span>
              </div>
              <div class="metric-label">超采区面积</div>
            </div>
          </div>
          <div class="metric-item">
            <img src="@/assets/img/business/yl_shui.png" alt="" class="metric-icon" />
            <div>
              <div class="metric-value">
                {{ groundWaterOverview.overQty }} <span class="unit">万m³</span>
              </div>
              <div class="metric-label">超采量</div>
            </div>
          </div>
          <div class="metric-item">
            <img src="@/assets/img/business/yl_duan.png" alt="" class="metric-icon" />
            <div>
              <div class="metric-value">
                {{ groundWaterOverview.countyLevel }} <span class="unit">个</span>
              </div>
              <div class="metric-label">水位监管区县个数</div>
            </div>
          </div>
          <div class="metric-item">
            <img src="@/assets/img/business/yl_jiangyu.png" alt="" class="metric-icon" />
            <div>
              <div class="metric-value">
                {{ groundWaterOverview.countyVolume }} <span class="unit">个</span>
              </div>
              <div class="metric-label">水量监管区县个数</div>
            </div>
          </div>
        </div>
      </DivBackIn>

      <!-- 右2：河湖补水（自试点累计补水量环形图，可选择截止月份） -->
      <TitleBackOut content="河湖补水" :is-click-btn="true" @btn-click="handleClick('/lakeSupply')">
        <div class="supply-picker">
          <span class="supply-picker-label">截止</span>
          <n-date-picker
            v-model:formatted-value="supplyMonth"
            type="month"
            size="small"
            style="width: 105px"
            value-format="yyyy-MM"
            :clearable="false"
            :is-date-disabled="supplyDateDisabled"
            @update:formatted-value="loadCumulativeSupply"
          />
        </div>
      </TitleBackOut>
      <DivBackIn style="margin: 10px 0 4px" :is-loading="supplyLoading">
        <div ref="supplyChartRef" style="width: 100%; height: 205px"></div>
      </DivBackIn>

      <!-- 右3：生态流量（不变）；3 个统计数值可点击（2026-09-28），断面基本信息弹窗与生态流量模块同款 -->
      <TitleBackOut content="生态流量" :is-click-btn="true" @btn-click="handleClick('/ecoFlow')">
        <DatePicker v-model="ecoYear" type="year" size="small" width="120px" :clearable="false" />
      </TitleBackOut>
      <DivBackIn style="margin: 10px 0 4px">
        <div class="grid-2">
          <div class="metric-item">
            <img src="@/assets/img/business/yl_river.png" alt="" class="metric-icon" />
            <div>
              <div
                class="metric-value num-click"
                title="点击查看明细"
                @click="openEcoSections('all')"
              >
                {{ ecoFlowData.targetRiverLakeCount }} <span class="unit">条</span>
              </div>
              <div class="metric-label">生态流量目标河湖</div>
            </div>
          </div>
          <div class="metric-item">
            <img src="@/assets/img/business/yl_duan.png" alt="" class="metric-icon" />
            <div>
              <div
                class="metric-value num-click"
                title="点击查看明细"
                @click="openEcoSections('all')"
              >
                {{ ecoFlowData.controlSectionCount }} <span class="unit">条</span>
              </div>
              <div class="metric-label">控制断面和已建工程</div>
            </div>
          </div>
          <div class="metric-item" style="grid-column: 1 / -1">
            <img src="@/assets/img/business/yl_duan.png" alt="" class="metric-icon" />
            <div>
              <div
                class="metric-value num-click"
                title="点击查看明细"
                @click="openEcoSections('tracked')"
              >
                {{ ecoFlowData.newSectionCount }} <span class="unit">条</span>
              </div>
              <div class="metric-label">具备监测条件的断面和工程</div>
            </div>
          </div>
        </div>
      </DivBackIn>

      <!--      &lt;!&ndash; 右4：河湖复苏（全线贯通河流数量 / 全线有水平均天数，一行左右放置） &ndash;&gt;-->
      <!--      <TitleBackOut content="河湖复苏">-->
      <!--        <div class="time-picker">-->
      <!--          <n-date-picker-->
      <!--            v-model:formatted-value="revivalYear"-->
      <!--            type="year"-->
      <!--            value-format="yyyy"-->
      <!--            size="small"-->
      <!--            style="width: 85px"-->
      <!--            :clearable="false"-->
      <!--            :is-date-disabled="-->
      <!--              (ts: number) => {-->
      <!--                const y = new Date(ts).getFullYear()-->
      <!--                return y < 2025 || y > new Date().getFullYear()-->
      <!--              }-->
      <!--            "-->
      <!--            @update:formatted-value="onRevivalYearChange"-->
      <!--          />-->
      <!--          <n-select-->
      <!--            v-if="!revivalIsMonthly"-->
      <!--            v-model:value="revivalSeason"-->
      <!--            :options="revivalQuarterOptions"-->
      <!--            size="small"-->
      <!--            style="width: 100px"-->
      <!--            @update:value="onRevivalSeasonChange"-->
      <!--          />-->
      <!--          <n-select-->
      <!--            v-else-->
      <!--            v-model:value="revivalSeason"-->
      <!--            :options="filteredRevivalMonthOptions"-->
      <!--            size="small"-->
      <!--            style="width: 75px"-->
      <!--            @update:value="onRevivalSeasonChange"-->
      <!--          />-->
      <!--        </div>-->
      <!--      </TitleBackOut>-->
      <!--      <DivBackIn style="margin: 10px 0" :is-loading="revivalLoading">-->
      <!--        <div class="grid-2">-->
      <!--          <div class="metric-item">-->
      <!--            <img src="@/assets/img/business/yl_river.png" alt="" class="metric-icon" />-->
      <!--            <div>-->
      <!--              <div class="metric-value">-->
      <!--                {{ revivalData.allRiverNum }} <span class="unit">条</span>-->
      <!--              </div>-->
      <!--              <div class="metric-label">全线贯通河流数量</div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--          <div class="metric-item">-->
      <!--            <img src="@/assets/img/business/yl_shui.png" alt="" class="metric-icon" />-->
      <!--            <div>-->
      <!--              <div class="metric-value">-->
      <!--                {{ revivalData.avgWaterDays }} <span class="unit">天</span>-->
      <!--              </div>-->
      <!--              <div class="metric-label">全线有水平均天数</div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </DivBackIn>-->

      <!--      &lt;!&ndash; 右5：饮用水水源地（重要饮用水水源地 / 设计总供水人口，一行左右放置） &ndash;&gt;-->
      <!--      <TitleBackOut content="饮用水水源地"> </TitleBackOut>-->
      <!--      <DivBackIn style="margin: 10px 0" :is-loading="sourceLoading">-->
      <!--        <div class="grid-2">-->
      <!--          <div class="metric-item">-->
      <!--            <img src="@/assets/img/business/yl_river.png" alt="" class="metric-icon" />-->
      <!--            <div>-->
      <!--              <div class="metric-value">-->
      <!--                {{ sourceData.sourceCount }} <span class="unit">个</span>-->
      <!--              </div>-->
      <!--              <div class="metric-label">重要饮用水水源地</div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--          <div class="metric-item">-->
      <!--            <img src="@/assets/img/business/yl_duan.png" alt="" class="metric-icon" />-->
      <!--            <div>-->
      <!--              <div class="metric-value">-->
      <!--                {{ sourceData.supplyPopulation }} <span class="unit">万人</span>-->
      <!--              </div>-->
      <!--              <div class="metric-label">设计总供水人口</div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </DivBackIn>-->
    </RightSide>

    <BottomSide>
      <div class="bottom-div">
        <div>
          <n-dropdown
            trigger="hover"
            size="huge"
            :show-arrow="true"
            :options="infoSystemOptions"
            class="index_dropdown"
            @select="handleSelect"
          >
            <div class="bottom-btn">
              <img src="@/assets/img/business/panorama/xg_xt.png" alt="相关系统" />
              <span>▲</span>
            </div>
          </n-dropdown>
        </div>
        <div>
          <n-dropdown
            trigger="hover"
            size="huge"
            :show-arrow="true"
            :options="websiteOptions"
            class="index_dropdown"
            @select="handleSelect"
          >
            <div class="bottom-btn">
              <img src="@/assets/img/business/panorama/xg_wz.png" alt="相关网站" />
              <span>▲</span>
            </div>
          </n-dropdown>
        </div>
      </div>
    </BottomSide>

    <!-- 地图点位点击 → 单站详情弹窗（与调水一张图同一组件/同一公共 hook） -->
    <StationDetailDialog
      v-model:show="mapStationShow"
      :row="mapStationRow"
      :wt-time="mapStationWt"
    />

    <!-- 取用水统计明细弹窗（公共组件）：点击取用水块统计数值打开，表头与数据由后端按统计类型下发 -->
    <StatDetailDialog
      v-model:show="statDlg.show"
      :title="statDlg.title"
      :total-text="statDlg.totalText"
      :unit-text="statDlg.unitText"
      :row-group-size="statDlg.rowGroupSize"
      :columns="statDlg.columns"
      :rows="statDlg.rows"
      :loading="statDlg.loading"
    />

    <!-- 生态流量断面基本信息弹窗：点击生态流量块统计数值打开（组件按 scope 自取数据） -->
    <EcoSectionDialog
      v-model:show="sectionDialog.show"
      :title="sectionDialog.title"
      :scope="sectionDialog.scope"
    />
  </div>
</template>

<style scoped lang="scss">
.leftMenuBtn {
  position: fixed;
  top: 90px;
  left: 520px;
  img {
    margin: 0 5px;
    cursor: pointer;

    &:hover {
      transition: filter 0.2s ease;
      /* 均匀环绕光晕 */
      filter: drop-shadow(0 0 8px rgba(64, 158, 255, 0.5));
    }
  }
}
.year-tag {
  font-size: 0.875rem;
  color: #43699e;
  font-weight: bold;
}

.unit-tag {
  font-size: 0.8rem;
  /* 2026-09-28 用户要求调水块单位标签灰色（本页 scoped 覆盖，不影响公共类与水源地页）；再浅一档 */
  color: #636b7d;
  margin-left: 8px;
  font-weight: bold;

  background-color: rgba(26, 148, 214, 0.13);
  padding: 5px 10px;
  border-radius: 5px;

  font-style: italic;
  text-shadow: none;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.time-picker {
  display: flex;
  align-items: center;
  gap: 6px;
}

.supply-picker {
  display: flex;
  align-items: center;
  gap: 4px;
}

.supply-picker-label {
  font-size: 12px;
  color: #5f7794;
  white-space: nowrap;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
}

.metric-icon {
  //width: 32px;
  //height: 32px;
}

.metric-label {
  font-size: 0.9rem;
  color: #4e6880;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #0490ff;
  font-style: italic;
}

.unit {
  font-size: 0.75rem;
  font-weight: normal;
  color: #666;
}

.flow-item {
  text-align: center;
  padding: 8px 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
}

.sub-name {
  font-size: 0.9rem;
  color: #1c2a3e;
  margin-bottom: 4px;
  font-weight: bold;
}

.sub-value {
  font-size: 1rem;
  font-weight: bold;
  color: #329e51;
}

/* 调水块标题行工具区：时间选择 + 单位标签 */
.transfer-tools {
  display: flex;
  align-items: center;
  gap: 6px;
}

.consistency-table {
  width: 100%;
  font-size: 0.875rem;
}

/* 行悬停：轻微底色提示可查看数据来源；飘窗内容为白底深蓝字（与页面浅色系一致） */
.table-row:hover {
  background: rgba(24, 144, 255, 0.06);
}

.src-tip {
  font-size: 12px;
  line-height: 18px;
}

.src-tip-hd {
  margin-bottom: 2px;
  font-weight: 600;
  color: #1766db;
}

.src-tip-item {
  color: #244165;
  white-space: nowrap;
}

.table-header,
.table-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(24, 144, 255, 0.15);
}

.table-header {
  font-weight: bold;
  color: #0f378c;
  background: rgba(24, 144, 255, 0.1);
  border-radius: 6px 6px 0 0;
  padding: 10px 0;
}

.table-row:last-child {
  border-bottom: none;
}

.cell {
  flex: 1;
  text-align: center;
}

.sub-name-label {
  font-size: 0.9rem;
  color: #636b7d;
}

.enter-btn {
  &:hover {
    transition: filter 0.2s ease;
    /* 均匀环绕光晕 */
    filter: drop-shadow(0 0 4px rgba(64, 158, 255, 0.5));
  }
}

.bottom-div {
  //width: 400px;
  display: flex;
  justify-content: space-around;
  .bottom-btn {
    padding: 3px 15px;
    cursor: pointer;
    display: flex;
    align-items: center;

    color: #fff;
    border-radius: 6px;
    position: relative;
    //img {
    //  height: 50px;
    //}
    span {
      position: absolute;
      left: 178px;
      margin-bottom: 2px;
      font-size: 9px;
    }

    &:hover {
      transition: filter 0.5s ease;
      /* 均匀环绕光晕 */
      filter: drop-shadow(0 0 5px rgba(64, 158, 255, 0.5));

      span {
        color: #3a78de;
      }
    }
  }
}
</style>
