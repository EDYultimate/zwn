<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import { useECharts } from '@/hooks/web/useECharts'
import { useMapBridge } from '@/hooks/web/useMapBridge'
import RightSide from '@/components/business/RightSide.vue'
import DivBackIn from '@/components/business/DivBackIn.vue'
import TitleBackOut from '@/components/business/TitleBackOut.vue'
import WaterMonitorModal from './components/WaterMonitorModal.vue'
import LicenseDetailModal from './components/LicenseDetailModal.vue'
import RiverSelector from './components/RiverSelector.vue'
import StatDetailDialog from '@/components/business/StatDetailDialog.vue'
import type { MapRiverItem } from '@/components/business/MapToolbar.vue'
import {
  getBaseInfo,
  getYuJingData,
  qysDetails,
  riverMapInfo,
  mapEngPoints,
  getStatDetail
} from '@/api/quyongshui'

/**
 * 取用水一张图（迁自 gk_java guankong/index.vue）
 * 左：全流域/委发证取水许可证统计；右：许可证预警 + 行政区证照数量 + 取用水量详情。
 * 地图：diaoshui_mapbox/main/szyjg 取用水地图应用（取水许可点位+许可河流），配置方式同调水一张图。
 */

const base = ref<any>({})
const yj = ref({ exLimit: 0, expired: 0, yuJing: 0 })

// 地图工具栏工具（2026-09-15 暂时隐去整条工具栏，随之注释；恢复时与 template 中那行一起放开）
// 内置 5 个 + 框选（boxselect 需地图应用 selectTool 支持，GIS BoxSelectTool 已实现；
// 双击完成绘制 → postMessage boxselect → openWaterMonitor 取水量监测弹窗）
// 其中「river 河流选择」已迁至左下 RiverSelector（见 onRiverSelect）
// const MAP_TOOLS = ['north', 'fullview', 'clear', 'coordinate', 'river', 'boxselect']

const chartEl1 = ref<HTMLDivElement>()
const chartEl2 = ref<HTMLDivElement>()
const { setOptions: setChart1 } = useECharts(chartEl1)
const { setOptions: setChart2 } = useECharts(chartEl2)

// 使用地图桥接 composable，自动管理消息监听和生命周期
const { callMapReady } = useMapBridge({
  onReady: () => {
    console.log('取用水地图应用就绪')
  },
  messageHandlers: {
    details: (data) => {
      // 点位详情 → 打开取水许可证详情弹窗
      if (data.CODE) {
        licenseDetailModalRef.value?.open(data.CODE, new Date().getFullYear())
      }
    },
    heliudetails: (data) => {
      // 河流点击 → 加载河流信息
      loadRiverInfo(data.code)
    },
    boxselect: (data) => {
      // 框选 → 打开水量监测弹窗
      openWaterMonitor(data)
    },
    loaded: () => {
      // 地图加载完成 → 撒点
      loadMapPoints()
    }
  }
})

onMounted(() => {
  loadBase()
  loadYuJing()
  loadDetails()
})

// ==================== 地图交互（iframe 内 diaoshui_mapbox 取用水地图应用，跨窗口同源直调，同调水一张图） ====================
// 地图应用（szyjg/index.html）global 方法：m_ogetData(dataset) 点位绘制、m_opositionPoint(x,y) 定位、
// queryRiverXK() 许可河流查询、m_oposition(stcd) 河流定位高亮；事件：postMessage loaded/details/heliudetails
const riverInfo = ref<{ fpsl?: string; xksl?: string; fpval?: string; name?: string } | null>(null)
const riverInfoShow = ref(false)

// 河流映射（迁自旧项目 portalIndex.vue：地图河流 STCD → AAA_GK_EXINFO 的 INFO_ID 前缀，riverId=exInfoId_YEARS_）
const RIVERS = [
  { name: '滦河', code: 'QSXK00000001', exInfoId: 'LH' },
  { name: '蓟运河', code: 'QSXK00000002', exInfoId: 'JYH' },
  { name: '泃河', code: 'QSXK00000003', exInfoId: 'JH' },
  { name: '拒马河', code: 'QSXK00000004', exInfoId: 'JMH' },
  { name: '滹沱河', code: 'QSXK00000005', exInfoId: 'HTH' },
  { name: '浊漳河1', code: 'QSXK00000006', exInfoId: 'ZZH' },
  { name: '浊漳河2', code: 'QSXK00000007', exInfoId: 'ZZH' },
  { name: '清漳河', code: 'QSXK00000008', exInfoId: 'QZH' },
  { name: '漳河', code: 'QSXK00000009', exInfoId: 'ZH' },
  { name: '卫河', code: 'QSXK00000010', exInfoId: 'WH' },
  { name: '共产主义渠', code: 'QSXK00000011', exInfoId: 'GCZYQ' },
  { name: '卫运河', code: 'QSXK00000012', exInfoId: 'WYH' },
  { name: '漳卫新河', code: 'QSXK00000013', exInfoId: 'ZWXH' },
  { name: '南运河', code: 'QSXK00000014', exInfoId: 'NYH' }
]

// 河流信息：FPSL 分配水量 / XKSL 许可水量 / FPVAL 分配比例（地图河流点击）
async function loadRiverInfo(riverId: string) {
  if (!riverId) {
    return
  }
  // 地图发来河流 STCD，映射为 AAA_GK_EXINFO 的 INFO_ID（同旧项目 portalIndex.vue）
  const matched = RIVERS.find((r) => r.code === riverId)
  if (!matched) {
    window.$message?.warning?.(`未配置河流信息：${riverId}`)
    return
  }
  try {
    const res = await riverMapInfo({ riverId: matched.exInfoId + '_YEARS_' })
    if (res.code === 0 && res.data) {
      riverInfo.value = { ...res.data, name: matched.name }
      riverInfoShow.value = true
    }
  } catch (e) {
    console.warn('riverMapInfo failed', e)
  }
}

// 地图撒点：后台取水工程点位（设施 ID=STCD + 工程名 + JD/WD 经纬度 + 证号）→ m_ogetData 传给地图应用
async function loadMapPoints() {
  try {
    const res = await mapEngPoints()
    if (res.code === 0 && Array.isArray(res.data) && res.data.length > 0) {
      callMapReady((win) => (win as any).m_ogetData?.(res.data))
    } else {
      console.warn('取水工程点位接口返回异常', res)
    }
  } catch (e) {
    console.warn('mapEngPoints failed', e)
  }
}

const waterMonitorModalRef = ref<InstanceType<typeof WaterMonitorModal>>()
const licenseDetailModalRef = ref<InstanceType<typeof LicenseDetailModal>>()

// 河流选择（原地图工具栏倒数第二个「河流」功能，现由左下 RiverSelector 触发）：
// 点某条河流 → 地图定位并高亮该河流，行为与原来完全一致（m_oposition(code)）
function onRiverSelect(river: MapRiverItem) {
  callMapReady((win) => (win as any).m_oposition?.(river.code))
}

// ==================== 统计明细弹窗（点击统计数值 → 逐条展示相符的明细） ====================
// 表头与数据均由后端按统计类型下发（/quyongshui/statDetail?kind=），
// 每个 kind 的取数口径与其对应统计的聚合查询严格一致，保证「明细条数 = 统计值」。
// 预警类同一证可能多个月超标 → 该表按「证 × 预警月份」展开，逐条全部列出。
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

type StatKind =
  | 'exLimit'
  | 'yuJing'
  | 'expired'
  | 'certWfz'
  | 'waitWfz'
  | 'ownerWfz'
  | 'sumXukeWfzOut'
  | 'sumXukeWfzIn'

/** 各统计项 → 弹窗标题（表头与数据由后端给） */
const STAT_TITLE: Record<StatKind, string> = {
  exLimit: '超许可许可证明细',
  yuJing: '取水计划预警明细（按月展开）',
  expired: '即将到期许可证明细',
  certWfz: '委发证证照明细',
  waitWfz: '准予发证明细',
  ownerWfz: '取用水户明细',
  sumXukeWfzOut: '许可水量（河道外）明细',
  sumXukeWfzIn: '河道内许可明细'
}

/** 水量数值格式：保留 2 位小数并去掉多余的 .0；空值统一显示 - */
function fmtQty(v: any) {
  if (v === null || v === undefined || v === '') {
    return '-'
  }
  const n = Number(v)
  if (Number.isNaN(n)) {
    return '-'
  }
  return String(Number(n.toFixed(2)))
}

/** 取水计划预警表专用：一个证占两行（上行计划、下行实际），这 4 列纵向合并 */
const MERGED_KEYS = ['FIR_CERT_NUM_CODE', 'WAT_RIG_OWNER', 'PRO_NAME', 'WAT_T_AMNT']

/**
 * 列表头装饰。**只有取水计划预警**（mergeRows=true）做「一个证两行」的特殊处理：
 * - 月列（M01~M12）展示该月水量（计划行=计划水量，实际行=实际取水量），无数据月显示 -；
 *   实际行若该月实际 > 计划×1.3 则标红加粗（即预警月），提示文字给出该月计划值。
 * - 基础信息前 4 列按 rowSpan=2 合并（同一证信息只出现一次），并 fixed:'left' 不随横向滚动；
 *   行对固定为「计划、实际」，偶数行起始合并、奇数行合并掉（分页行数取组大小整数倍，不会拆断）。
 *
 * 其余统计表每行即一条独立记录（如取水户明细一行一个取水户），**不得做任何合并**，
 * 否则会把相邻两条无关记录的名称并到一起。
 */
function decorateColumns(columns: any[], mergeRows: boolean) {
  return columns.map((c) => {
    const key = String(c?.key || '')
    if (mergeRows && /^M\d{2}$/.test(key)) {
      return {
        ...c,
        align: 'center',
        render: (row: Record<string, any>) => {
          const txt = fmtQty(row[key])
          if (txt === '-') {
            return '-'
          }
          const planKey = `P${key.substring(1)}`
          const plan = row[planKey]
          const over =
            row.ROW_TYPE === '实际' &&
            plan !== null &&
            plan !== undefined &&
            plan !== '' &&
            Number(row[key]) > Number(plan) * 1.3
          return h(
            'span',
            {
              title: over ? `超月计划（月计划 ${fmtQty(plan)} 万m³）` : '',
              style: over ? 'color:#e64545;font-weight:700' : ''
            },
            txt
          )
        }
      }
    }
    if (mergeRows && MERGED_KEYS.includes(key)) {
      return {
        ...c,
        // 列多时表格横向滚动，基础信息固定在左侧不随滚动移出视野
        fixed: 'left',
        rowSpan: (_row: Record<string, any>, idx: number) => (idx % 2 === 0 ? 2 : 0)
      }
    }
    if (key === 'ROW_TYPE') {
      return { ...c, align: 'center' }
    }
    return c
  })
}

async function openStatDetail(kind: StatKind) {
  statDlg.value = {
    show: true,
    title: STAT_TITLE[kind] || '数据明细',
    totalText: '',
    unitText: '',
    rowGroupSize: 1,
    columns: [],
    rows: [],
    loading: true
  }
  try {
    const res = await getStatDetail(kind)
    const d = res?.data
    const list = Array.isArray(d?.rows) ? d.rows : []
    // 仅取水计划预警需要「一个证两行」的合并与固定列，其余表保持逐行独立
    statDlg.value.columns = decorateColumns(d?.columns || [], kind === 'yuJing')
    statDlg.value.rows = list
    // 单位统一提到弹窗右上角小字（各表列头不再写单位）：水量类列均为万m³
    statDlg.value.unitText = '单位：万m³'
    // 取水计划预警一个证占「计划 / 实际」两行，行数不是证书数，故显式说明口径
    if (kind === 'yuJing') {
      const certCount = new Set(list.map((r) => r.FIR_CERT_NUM_CODE)).size
      statDlg.value.totalText = `共 ${certCount} 个预警证书 · 每证两行（上计划 / 下实际），实际超月计划×1.3 的月份标红`
      statDlg.value.rowGroupSize = 2
    }
  } catch (e) {
    console.warn('statDetail failed', e)
    statDlg.value.rows = []
  } finally {
    statDlg.value.loading = false
  }
}

// 地图框选：提取命中点的证书号列表（properties 含 FIR_CERT_NUM_CODE；兼容 GIS 只传 stcd 逗号分隔字符串）
function openWaterMonitor(data: any) {
  const certCodes = new Set<string>()
  let stcds = ''
  if (Array.isArray(data.properties)) {
    data.properties.forEach((p: any) => {
      if (p && p.FIR_CERT_NUM_CODE) {
        certCodes.add(String(p.FIR_CERT_NUM_CODE).trim())
      }
    })
    stcds = data.properties
      .map((p: any) => (p && p.STCD ? String(p.STCD).trim() : ''))
      .filter(Boolean)
      .join(',')
  } else {
    stcds = data.stcds || data.stcd || ''
  }
  if (certCodes.size === 0 && !stcds) {
    window.$message?.warning?.('框选结果中没有取水证信息，请重新框选')
    return
  }
  waterMonitorModalRef.value?.open({ certCodes: [...certCodes], stcds })
}

// ==================== 临时测试：模拟 GIS 框选消息（GIS 框选联调前验证弹窗链路，联调后可移除） ====================
// 测试点位取自后台 mapEngPoints 真实设施（盂县水电站群，2026 年有真实水量：年累计上万级），STCD=设施 ID 可走 stcds→证号映射
// const TEST_BOXSELECT_PROPS = [
//   {
//     STCD: '140322_1755745787264',
//     STNM: '盂县王家庄水电站',
//     FIR_CERT_NUM_CODE: 'A140322S2024-0576',
//     X: 113.276111,
//     Y: 38.423888
//   },
//   {
//     STCD: '140322_1755762748302',
//     STNM: '盂县闫家庄水电站',
//     FIR_CERT_NUM_CODE: 'A140322S2024-0577',
//     X: 113.515,
//     Y: 38.428611
//   },
//   {
//     STCD: '140322_1755847658014',
//     STNM: '御枣口水电站',
//     FIR_CERT_NUM_CODE: 'A140322S2024-0226',
//     X: 113.414444,
//     Y: 38.453889
//   },
//   {
//     STCD: '140322_1755743688391',
//     STNM: '夫城口水电站',
//     FIR_CERT_NUM_CODE: 'A140322S2025-0033',
//     X: 113.257222,
//     Y: 38.436111
//   },
//   {
//     STCD: '140322_1755762679597',
//     STNM: '永安水电站',
//     FIR_CERT_NUM_CODE: 'A140322S2024-0578',
//     X: 113.376666,
//     Y: 38.453611
//   },
//   {
//     STCD: '140322_1755762936513',
//     STNM: '盂县王家庄水电站（2号）',
//     FIR_CERT_NUM_CODE: 'A140322S2024-0576',
//     X: 113.276111,
//     Y: 38.423888
//   },
//   {
//     STCD: 'a4e4f357f5a945b59d18e814fbc5bb93',
//     STNM: '引滦入津工程引水渠',
//     FIR_CERT_NUM_CODE: 'A130227S2021-0019',
//     X: 118.31118,
//     Y: 40.19015
//   }
// ]

// function testBoxSelect() {
//   openWaterMonitor({
//     eventname: 'boxselect',
//     count: TEST_BOXSELECT_PROPS.length,
//     properties: TEST_BOXSELECT_PROPS
//   })
// }

async function loadBase() {
  try {
    const res = await getBaseInfo()
    if (res.code === 0 && res.data) {
      base.value = res.data
    }
  } catch (e) {
    console.warn('getBaseInfo failed', e)
  }
}

async function loadYuJing() {
  try {
    const res = await getYuJingData()
    if (res.code === 0 && res.data) {
      yj.value = {
        exLimit: res.data.exLimit ?? 0,
        expired: res.data.expired ?? 0,
        yuJing: res.data.yuJing ?? 0
      }
    }
  } catch (e) {
    console.warn('getYuJingData failed', e)
  }
}

async function loadDetails() {
  try {
    const res = await qysDetails()
    if (res.code === 0 && Array.isArray(res.data)) {
      // 按指定顺序排序：天津 河北 河南 山东 山西 内蒙古（同旧项目）
      const provinceOrder = ['天津', '河北', '河南', '山东', '山西', '内蒙古']
      const sorted = [...res.data].sort(
        (a, b) => provinceOrder.indexOf(a.PROVINCE) - provinceOrder.indexOf(b.PROVINCE)
      )
      drawChart1(sorted)
      drawChart2(sorted)
    }
  } catch (e) {
    console.warn('qysDetails failed', e)
  }
}

// 行政区证照数量（柱状图）
function drawChart1(data: any[]) {
  const provinces = data.map((i) => i.PROVINCE)
  const certCounts = data.map((i) => Number(i.CERT_COUNT) || 0)
  setChart1({
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#e0e0e0',
      textStyle: { color: '#333', fontSize: 12 },
      axisPointer: { type: 'shadow' }
    },
    grid: { top: 15, left: 50, right: 12, bottom: 28 },
    xAxis: {
      type: 'category',
      data: provinces,
      axisLabel: { color: '#244165', fontSize: 11 },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#7BACDE' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#244165', fontSize: 11 },
      axisTick: { show: false },
      axisLine: { show: true, lineStyle: { color: '#7BACDE' } },
      splitLine: { lineStyle: { type: 'dashed', color: '#94B9E5' } }
    },
    series: [
      {
        name: '证照数量',
        type: 'bar',
        data: certCounts,
        barMaxWidth: 18,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#0490ff' },
              { offset: 1, color: '#1766db' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  })
}

// 取用水量详情（实际 vs 计划双柱状图，单位万m³）
function drawChart2(data: any[]) {
  const provinces = data.map((i) => i.PROVINCE)
  const actualWater = data.map((i) => (Number(i.TOTAL_ACTUAL_WATER) || 0) / 10000)
  const planWater = data.map((i) => (Number(i.TOTAL_PERMIT_WATER) || 0) / 10000)
  setChart2({
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#e0e0e0',
      textStyle: { color: '#333', fontSize: 12 },
      axisPointer: { type: 'shadow' }
    },
    legend: {
      right: '3%',
      top: 0,
      icon: 'rect',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { color: '#244165', fontSize: 12 }
    },
    grid: { top: 32, left: 50, right: 12, bottom: 28 },
    xAxis: {
      type: 'category',
      data: provinces,
      axisLabel: { color: '#244165', fontSize: 11 },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#7BACDE' } }
    },
    yAxis: {
      name: '取水量：万m³',
      nameTextStyle: { color: '#244165', fontSize: 12 },
      type: 'value',
      axisLabel: { color: '#244165', fontSize: 11 },
      axisTick: { show: false },
      axisLine: { show: true, lineStyle: { color: '#7BACDE' } },
      splitLine: { lineStyle: { type: 'dashed', color: '#94B9E5' } }
    },
    series: [
      {
        name: '实际取水量',
        type: 'bar',
        data: actualWater,
        barMaxWidth: 16,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#0490ff' },
              { offset: 1, color: '#1766db' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        }
      },
      {
        name: '计划取水量',
        type: 'bar',
        data: planWater,
        barMaxWidth: 16,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#f1a100' },
              { offset: 1, color: '#f5c25d' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  })
}

/** 数字组件（保留两位/整数） */
function num(v: any, p = 0) {
  const n = Number(v)
  return isNaN(n) ? 0 : Number(n.toFixed(p))
}
</script>

<template>
  <div class="page-layout">
    <!-- 河流选择：固定在页面左下（距页面底 20px），左侧沿用原面板内边距位置 266px；
         左侧统计块已移至右侧面板，故不再需要 LeftSide 外框
         点击从按钮右侧滑出一整行全部河流 -->
    <RiverSelector class="river-selector-floating pointer-auto" @select="onRiverSelect" />

    <!-- 中间地图区域（透明，复用布局层地图底板；空白区域事件穿透，点击直达地图） -->
    <div class="center-map-area"></div>

    <!--
      地图工具栏（可复用组件：指北针/复位/清除/坐标搜索/河流选择/框选，迁自旧项目 portalIndex）
      2026-09-15：按要求暂时隐去。其中「河流选择」已迁至左下 RiverSelector；
      需要恢复整条工具栏时放开下面一行即可（MapToolbar 组件本身未改动，waterAssign/haihe 仍在用）。
    -->
    <!-- <MapToolbar class="pointer-auto" :tools="MAP_TOOLS" /> -->

    <!-- 右侧：统计 + 预警 + 图表
         2026-09-16：原左侧「全流域 / 委发证」统计移至此处；为容纳更多内容，
         两个统计块改为「主数值 + 一行 4 小项」的紧凑卡片，两个图表高度同时下调 -->
    <RightSide width="470px" padding="0 4px" class="pointer-auto">
      <TitleBackOut content="全流域取水许可证统计" :is-click-btn="false" />
      <DivBackIn class="qy-stat-card">
        <div class="stat-hero">
          <span class="stat-hero-value">
            <n-number-animation :from="0" :to="num(base.sumXukeAll, 2)" :precision="2" />
          </span>
          <span class="stat-hero-unit">亿m³</span>
        </div>
        <div class="stat-hero-label">许可水量（河道外）</div>
        <div class="stat-grid stat-grid--4">
          <div class="stat-item">
            <div class="stat-value">
              <n-number-animation :from="0" :to="num(base.countOwnerAll)" />
            </div>
            <div class="stat-label">取用水户总数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">
              <n-number-animation :from="0" :to="num(base.countOwnerAllOut)" />
            </div>
            <div class="stat-label">河道外取水户</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">
              <n-number-animation :from="0" :to="num(base.countCertAll)" />
            </div>
            <div class="stat-label">证照总数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">
              <n-number-animation :from="0" :to="num(base.countCertAllOut)" />
            </div>
            <div class="stat-label">河道外证照</div>
          </div>
        </div>
      </DivBackIn>

      <TitleBackOut content="委发证取水许可证统计" :is-click-btn="false" />
      <DivBackIn class="qy-stat-card">
        <div
          class="stat-hero stat-clickable"
          title="点击查看明细"
          @click="openStatDetail('sumXukeWfzOut')"
        >
          <span class="stat-hero-value num-click">
            <n-number-animation :from="0" :to="num(base.sumXukeWfzOut, 2)" :precision="2" />
          </span>
          <span class="stat-hero-unit">亿m³</span>
        </div>
        <div class="stat-hero-label">许可水量（河道外）</div>
        <div class="stat-grid stat-grid--4">
          <div
            class="stat-item stat-clickable"
            title="点击查看明细"
            @click="openStatDetail('certWfz')"
          >
            <div class="stat-value num-click">
              <n-number-animation :from="0" :to="num(base.countCertWfz)" />
            </div>
            <div class="stat-label">证照总数</div>
          </div>
          <div
            class="stat-item stat-clickable"
            title="点击查看明细"
            @click="openStatDetail('waitWfz')"
          >
            <div class="stat-value num-click">
              <n-number-animation :from="0" :to="num(base.waitNum)" />
            </div>
            <div class="stat-label">准予发证</div>
          </div>
          <div
            class="stat-item stat-clickable"
            title="点击查看明细"
            @click="openStatDetail('ownerWfz')"
          >
            <div class="stat-value num-click">
              <n-number-animation :from="0" :to="num(base.countOwnerWfz)" />
            </div>
            <div class="stat-label">取用水户总数</div>
          </div>
          <div
            class="stat-item stat-clickable"
            title="点击查看明细"
            @click="openStatDetail('sumXukeWfzIn')"
          >
            <div class="stat-value num-click">
              <n-number-animation :from="0" :to="num(base.sumXukeWfzIn, 2)" :precision="2" />
            </div>
            <div class="stat-label">河道内许可（亿m³）</div>
          </div>
        </div>
      </DivBackIn>

      <TitleBackOut content="许可证预警情况" :is-click-btn="false" />
      <DivBackIn class="qy-warn-card">
        <div
          class="warn-row stat-clickable"
          title="点击查看明细"
          @click="openStatDetail('exLimit')"
        >
          <span class="warn-label">超许可许可证</span>
          <span class="warn-value num-click">{{ yj.exLimit }}</span>
        </div>
        <div class="warn-row stat-clickable" title="点击查看明细" @click="openStatDetail('yuJing')">
          <span class="warn-label">取水计划预警许可证</span>
          <span class="warn-value num-click">{{ yj.yuJing }}</span>
        </div>
        <div
          class="warn-row stat-clickable"
          title="点击查看明细"
          @click="openStatDetail('expired')"
        >
          <span class="warn-label">即将到期许可证</span>
          <span class="warn-value num-click">{{ yj.expired }}</span>
        </div>
      </DivBackIn>

      <TitleBackOut content="行政区证照数量" :is-click-btn="false" />
      <DivBackIn class="qy-chart-card">
        <div ref="chartEl1" class="qy-chart" style="height: 120px" />
      </DivBackIn>

      <TitleBackOut content="取用水量详情" :is-click-btn="false" />
      <DivBackIn class="qy-chart-card">
        <div ref="chartEl2" class="qy-chart" style="height: 160px" />
      </DivBackIn>
    </RightSide>

    <!-- 河流信息弹窗（地图点击许可河流 → heliudetails → riverMapInfo） -->
    <n-modal
      v-model:show="riverInfoShow"
      preset="card"
      :title="riverInfo?.name ? `${riverInfo.name}河流信息` : '河流信息'"
      style="width: 380px"
    >
      <n-descriptions v-if="riverInfo" :column="1" label-placement="left" bordered size="small">
        <n-descriptions-item label="分配水量">{{ riverInfo.fpsl ?? '-' }}</n-descriptions-item>
        <n-descriptions-item label="许可水量">{{ riverInfo.xksl ?? '-' }}</n-descriptions-item>
        <n-descriptions-item label="分配比例">{{ riverInfo.fpval ?? '-' }}</n-descriptions-item>
      </n-descriptions>
    </n-modal>

    <!-- 取水量监测信息弹窗（地图框选 → boxselect → 证书号列表 + 日期区间） -->
    <WaterMonitorModal ref="waterMonitorModalRef" />

    <!-- 取水许可证详情弹窗（地图点位点击 → details → 证号，三 tab：基本信息/计量设施/取水计划及水量） -->
    <LicenseDetailModal ref="licenseDetailModalRef" />

    <!-- 统计明细弹窗（公共组件）：表头与数据由后端按统计类型下发，固定宽高 + 表头固定 + 分页 -->
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

    <!-- 临时测试按钮：模拟 GIS 框选消息（联调后可移除） -->
    <!-- <button class="test-boxselect-btn" @click="testBoxSelect">测试框选</button> -->
  </div>
</template>

<style scoped lang="scss">
.page-layout {
  display: flex;
  //width: 100%;
  //height: 100vh;
  overflow: hidden;
  pointer-events: none; /* 页面容器整体穿透：中间空白区域点击直达地图底板；可交互面板用 .pointer-auto 恢复 */
}

.center-map-area {
  flex: 1;
  background: transparent;
  pointer-events: none; /* 空白区域穿透至地图底板，地图可拖动/缩放 */
}

/* 河流选择：固定页面左下，距页面底 20px。
   left 沿用原 LeftSide(left:250px) + 面板内边距(4px+12px) 的落点 266px，左侧位置与调整前一致；
   按钮宽度由组件自身按内容（箭头 + “选择河流”）自适应，不再铺满整条 */
.river-selector-floating {
  position: fixed;
  left: 266px;
  bottom: 20px;
  z-index: 20;
}

.qy-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 10px 0 14px;
}

.stat-block {
  text-align: center;
  padding: 4px 0 2px;

  .stat-value {
    font-size: 30px;
    font-weight: 700;
    color: #1766db;
    font-style: italic;
    line-height: 1.2;

    .stat-unit {
      font-size: 14px;
      font-weight: 400;
      color: #5b6b85;
      margin-left: 4px;
    }
  }

  .stat-label {
    margin-top: 6px;
    font-size: 14px;
    color: #5b6b85;
  }
}

.stat-grid {
  display: flex;
  justify-content: space-around;
  padding: 4px 0 2px;

  .stat-item {
    flex: 1;
    text-align: center;

    .stat-value {
      font-size: 26px;
      font-weight: 700;
      color: #1766db;
      font-style: italic;
      line-height: 1.2;
    }

    .stat-label {
      margin-top: 6px;
      font-size: 13px;
      color: #5b6b85;
    }
  }
}

/* ==================== 紧凑统计卡（2026-09-16 统计块移至右侧后新增）
   原为「主数值卡 + 两个 2 列网格卡」三张 DivBackIn，占高约 300px；
   改为单卡「主数值 + 一行 4 小项」，约 150px，便于右侧一栏容纳更多区块 */
.qy-stat-card {
  margin: 6px 0 8px;
}

/* 可点击统计项：点击弹出该统计口径的明细表（除 echarts 与「全流域」统计外均可点） */
.stat-clickable {
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.18s;

  &:hover {
    background: #f0f7ff;
  }

  &:hover .stat-value,
  &:hover .warn-value {
    color: #0e8ee7;
  }
}

.stat-hero {
  text-align: center;
  padding: 2px 0 0;

  .stat-hero-value {
    font-size: 26px;
    font-weight: 700;
    color: #1766db;
    font-style: italic;
    line-height: 1.15;
  }

  .stat-hero-unit {
    font-size: 13px;
    font-weight: 400;
    color: #5b6b85;
    margin-left: 4px;
  }
}

.stat-hero-label {
  margin-top: 2px;
  text-align: center;
  font-size: 12px;
  color: #5b6b85;
}

/* 一行 4 小项：数值/标签同步收小，四等分对齐 */
.stat-grid--4 {
  margin-top: 6px;
  padding: 6px 0 0;
  border-top: 1px solid #eef2f8;
  gap: 4px;

  .stat-item {
    min-width: 0;

    .stat-value {
      font-size: 18px;
    }

    .stat-label {
      margin-top: 2px;
      font-size: 11px;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

/* 预警：三行合并为一张卡，行高收紧 */
.qy-warn-card {
  margin: 6px 0 8px;

  .warn-row {
    padding: 6px 12px;

    .warn-label {
      font-size: 14px;
    }

    .warn-value {
      font-size: 22px;
    }
  }

  .warn-row + .warn-row {
    border-top: 1px solid #eef2f8;
  }
}

.warn-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;

  .warn-label {
    font-size: 15px;
    color: #3a4a63;
  }

  .warn-value {
    font-size: 28px;
    font-weight: 700;
    color: #f1a100;
  }
}

.qy-chart-card {
  margin: 10px 0 14px;

  .qy-chart {
    width: 100%;
  }
}

/* 临时测试按钮（模拟 GIS 框选，联调后可移除） */
.test-boxselect-btn {
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 50;
  padding: 6px 16px;
  border: 1px solid rgba(77, 182, 255, 0.6);
  border-radius: 6px;
  background: rgba(0, 100, 200, 0.75);
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 150, 255, 0.9);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}
</style>
