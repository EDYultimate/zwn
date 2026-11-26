<script setup lang="ts">
import { computed, h, ref, watch, type Ref } from 'vue'
import { getLineMonthReport, getPrjMonthComplete } from '@/api/waterdisp'
import type { DataTableColumns } from 'naive-ui'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import { useECharts } from '@/hooks/web/useECharts'

/**
 * 线路月报数据弹窗（调水一张图标题栏「月报数据」按钮）
 *
 * 数据源：HWWR.WR_WSP_MN_M（供水调度月报表，月度数据为主体）
 *        + HWWR.WR_WSP_WDE_B（取水工程基本信息，按 PRJ_CD 关联，补充工程属性）
 * 弹窗壳：ProModal（统一系统风格：浅蓝渐变表头 + 蓝竖条标题 + 圆角投影）；
 *        月份选择器由 ProModal 的「标题右侧时间选择」能力提供（show-time-picker，type=month）；
 *        固定 1120×640，内容区 contentMode=fill → 表格 max-height 表体内部滚动；
 *        月份选择超过最新一期时自动跳回最新一期（禁用 + 兜底回跳）。
 *
 * 2026-09-28：点击表格行滑出「单站月完成水量趋势」页（参照 LineDataDialog 的横向滑动切换，
 * 轨道 200% + translateX(-50%)）；趋势页只展示月报的月完成水量（WR_WSP_MN_M.MN_CMP_QTY 逐期）。
 *
 * 用法：<MonthReportDialog v-model:show="show" line-cd="ZH" line-nm="漳河" />
 */
const show = defineModel<boolean>('show', { default: false })

const props = defineProps<{ lineCd: string; lineNm: string }>()

const loading = ref(false)
const rows = ref<any[]>([])
const curYm = ref('') // 实际数据期 yyyy-MM（as-of 后）
const maxYm = ref('') // 该线路最新一期 yyyy-MM（月份选择器上限）
const monthVal = ref<string | null>(null) // 月份选择器值（v-model:time-picker-value）

// ==================== 单站月完成水量趋势（滑动视图2） ====================
type Pane = 'data' | 'trend'
const pane = ref<Pane>('data')
const trendCtg = ref('')
const trendPrj = ref('')
const trendRows = ref<{ ym: string; mnCmpQty: number | null }[]>([])
const trendLoading = ref(false)
/** 按工程缓存序列（月报全期次数据与所选月份无关，同一工程不重复请求） */
const trendCache = new Map<string, { ym: string; mnCmpQty: number | null }[]>()
const trendChartRef = ref<HTMLDivElement | null>(null)
const { setOptions: setTrendOptions } = useECharts(trendChartRef as Ref<HTMLDivElement>)

const trendTitle = computed(() => (trendPrj.value ? `${trendPrj.value}月完成水量趋势` : '单站趋势'))

async function openTrend(row: any) {
  const prjCd = String(row?.PRJ_CD ?? '').trim()
  if (!prjCd) {
    return
  }
  trendCtg.value = String(row?.CTG_NM ?? '')
  trendPrj.value = String(row?.PRJ_NM ?? '')
  pane.value = 'trend'
  const cached = trendCache.get(prjCd)
  if (cached) {
    trendRows.value = cached
    renderTrend()
    return
  }
  trendLoading.value = true
  try {
    const res: any = await getPrjMonthComplete({
      lineCd: props.lineCd,
      ctgCd: String(row?.CTG_CD ?? ''),
      prjCd
    })
    if (res.code === 0 && res.data) {
      const list: { ym: string; mnCmpQty: number | null }[] = res.data.rows || []
      trendCache.set(prjCd, list)
      trendRows.value = list
    } else {
      trendRows.value = []
    }
  } catch (e) {
    console.warn('getPrjMonthComplete failed', e)
    trendRows.value = []
  } finally {
    trendLoading.value = false
  }
  renderTrend()
}

function backToData() {
  pane.value = 'data'
}

/** 趋势图：逐月柱状（月完成水量，空期为断柱） */
function renderTrend() {
  setTrendOptions({
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params
        const v = p?.value
        return `${p?.name ?? ''}<br/>月完成水量：${v === null || v === undefined ? '-' : v} 万m³`
      }
    },
    grid: { left: 64, right: 24, top: 28, bottom: 30 },
    xAxis: {
      type: 'category',
      data: trendRows.value.map((r) => r.ym),
      axisLine: { lineStyle: { color: '#c9cdd4' } },
      axisLabel: { color: '#4e5969', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#4e5969', fontSize: 11 },
      splitLine: { lineStyle: { color: '#e5e6eb', type: 'dashed' } }
    },
    series: [
      {
        name: '月完成水量',
        type: 'bar',
        barMaxWidth: 28,
        itemStyle: { color: '#256AB7' },
        data: trendRows.value.map((r) => r.mnCmpQty)
      }
    ]
  })
}

/** 右侧数据表：月份 + 水量（与图表同源；暂不加合计行，2026-09-30） */
const trendTableColumns = computed<DataTableColumns<any>>(() => [
  { title: '月份', key: 'ym', align: 'center' },
  {
    title: '水量(万m³)',
    key: 'mnCmpQty',
    align: 'center',
    render: (r: any) => fmt(r.mnCmpQty)
  }
])

/** 空值统一显示「-」 */
function fmt(v: unknown) {
  return v === null || v === undefined || v === '' ? '-' : String(v)
}

/** 长文本列：允许折行完整展示 */
function wrapText(v: unknown) {
  return h('span', { class: 'mrd-wrap' }, fmt(v))
}

/**
 * 类别列合并键：去掉「合计」后缀（“河北省合计”并入“河北省”块，消除类别列与工程列同显“河北省合计”的重复；
 * “总计”保持独立一组）。
 */
function ctgKey(v: unknown) {
  return String(v ?? '').replace(/合计$/, '')
}

/** 类别列合并跨度：连续相同“基础类别名”的行竖向合并（首行返回连续行数，其余返回 0） */
const ctgRowSpans = ref<Record<number, number>>({})
function calcCtgSpans(rows: any[]) {
  const spans: Record<number, number> = {}
  let i = 0
  while (i < rows.length) {
    let j = i + 1
    while (j < rows.length && ctgKey(rows[j].CTG_NM) === ctgKey(rows[i].CTG_NM)) {
      j++
    }
    spans[i] = j - i
    i = j
  }
  ctgRowSpans.value = spans
}

/**
 * 列定义（按 key 取用）：字段来源 = 附件 PDF《海河流域水资源调度月报》各线路附表
 *（类别/工程、7月水量、调度年计划、调度年完成、完成率、序时进度、生态水量、年累计、供水时段等）
 */
type ColKey = 'CTG' | 'PRJ' | 'MN' | 'YRPLN' | 'YRCMP' | 'PRG' | 'RAT' | 'ECO' | 'CAL' | 'WSP'

const COL_DEFS: Record<ColKey, any> = {
  CTG: {
    title: '类别',
    key: 'CTG_NM',
    width: 92,
    rowSpan: (_r: any, rowIndex: number) => ctgRowSpans.value[rowIndex] || 0,
    render: (r: any) => wrapText(ctgKey(r.CTG_NM))
  },
  PRJ: { title: '工程名称', key: 'PRJ_NM', width: 170, render: (r: any) => wrapText(r.PRJ_NM) },
  MN: {
    title: '月完成水量',
    key: 'MN_CMP_QTY',
    width: 96,
    align: 'right',
    render: (r: any) => fmt(r.MN_CMP_QTY)
  },
  YRPLN: {
    title: '调度年计划',
    key: 'YR_PLN_QTY',
    width: 96,
    align: 'right',
    render: (r: any) => fmt(r.YR_PLN_QTY)
  },
  YRCMP: {
    title: '调度年完成',
    key: 'YR_CMP_QTY',
    width: 96,
    align: 'right',
    render: (r: any) => fmt(r.YR_CMP_QTY)
  },
  PRG: {
    title: '序时进度',
    key: 'SQ_PRG',
    width: 84,
    align: 'right',
    render: (r: any) => fmt(r.SQ_PRG)
  },
  RAT: {
    title: '完成率',
    key: 'CMP_RAT',
    width: 84,
    align: 'right',
    render: (r: any) => fmt(r.CMP_RAT)
  },
  ECO: {
    title: '生态水量',
    key: 'ECO_QTY',
    width: 88,
    align: 'right',
    render: (r: any) => fmt(r.ECO_QTY)
  },
  CAL: {
    title: '自然年累计',
    key: 'CAL_YR_CMP_QTY',
    width: 96,
    align: 'right',
    render: (r: any) => fmt(r.CAL_YR_CMP_QTY)
  },
  WSP: { title: '供水时段', key: 'WSP_PER', width: 168, render: (r: any) => wrapText(r.WSP_PER) }
}

/**
 * 线路 → 展示列（按 PDF《海河流域水资源调度月报-2026年7月》对应附表的字段）：
 *   ZH 漳河（附表1）：类别/工程、7月、调度年计划·完成、完成率、序时进度、供水时段
 *   HT 滹沱河（附表2）：同上但无供水时段
 *   YD 永定河（附表4）：仅工程（类别同工程名，不单独展示）、7月、年累计、补水时段
 *   LD 引滦（附表5）：类别、工程、7月、调度年计划·完成、完成率、序时进度、供水时段
 *   NSBD 南水北调（附表6）：类别、受水区/断面、7月、调度年计划·完成、完成率（无序时进度）
 *   YH_YJ 引黄入冀（附表7）：类别、断面、7月、年累计、调度年、供水时段
 *   LH 滦河：PDF 未涉及，保留通用全列
 */
const LINE_COLS: Record<string, ColKey[]> = {
  ZH: ['CTG', 'PRJ', 'MN', 'YRPLN', 'YRCMP', 'RAT', 'PRG', 'WSP'],
  HT: ['CTG', 'PRJ', 'MN', 'YRPLN', 'YRCMP', 'RAT', 'PRG'],
  YD: ['PRJ', 'MN', 'CAL', 'WSP'],
  LD: ['CTG', 'PRJ', 'MN', 'YRPLN', 'YRCMP', 'RAT', 'PRG', 'WSP'],
  NSBD: ['CTG', 'PRJ', 'MN', 'YRPLN', 'YRCMP', 'RAT'],
  YH_YJ: ['CTG', 'PRJ', 'MN', 'CAL', 'YRCMP', 'WSP'],
  LH: ['CTG', 'PRJ', 'MN', 'YRPLN', 'YRCMP', 'PRG', 'RAT', 'ECO', 'CAL', 'WSP']
}

const columns = computed<DataTableColumns>(() =>
  (LINE_COLS[props.lineCd] || LINE_COLS.LH).map((k) => COL_DEFS[k])
)

const titleText = computed(() => `${props.lineNm}月报数据展示`)

async function load(tm: string | null) {
  if (!props.lineCd) {
    return
  }
  loading.value = true
  try {
    const params: { lineCd: string; yr?: number; mn?: number } = { lineCd: props.lineCd }
    if (tm) {
      const [y, m] = tm.split('-')
      params.yr = Number(y)
      params.mn = Number(m)
    }
    const res = await getLineMonthReport(params)
    if (res.code === 0 && res.data) {
      rows.value = res.data.rows || []
      calcCtgSpans(rows.value)
      const y = res.data.yr
      const m = String(res.data.mn).padStart(2, '0')
      const ym = y ? `${y}-${m}` : ''
      curYm.value = ym
      // 最新一期上限：以打开弹窗时（tm=null）接口返回的实际数据期为准；
      // 选择器默认带上最新一期年月（不再显示占位符）
      if (!tm && ym) {
        maxYm.value = ym
        monthVal.value = ym
      }
    }
  } catch (e) {
    console.warn('getLineMonthReport failed', e)
  } finally {
    loading.value = false
  }
}

// 打开弹窗：取该线路最新一期并把选择器回填为实际数据期；每次打开回到列表视图
watch(
  () => show.value,
  (v) => {
    if (v && props.lineCd) {
      pane.value = 'data'
      monthVal.value = null
      load(null)
    }
  }
)

/** 月份选择器禁用：超过最新一期（maxYm）的月份灰色不可选 */
function monthDisabled(ts: number) {
  if (!maxYm.value) {
    return false
  }
  const d = new Date(ts)
  const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  return ym > maxYm.value
}

function onMonthChange(val: string | null) {
  if (!val) {
    return
  }
  // 超过最新一期 → 自动跳回最新一期（手输/滚动越过禁用范围时的兜底）
  if (maxYm.value && val > maxYm.value) {
    monthVal.value = maxYm.value
    load(maxYm.value)
    return
  }
  monthVal.value = val
  load(val)
}

/** 行点击 → 滑出单站趋势页（无工程编码的行不响应） */
function rowProps(row: any) {
  return {
    style: 'cursor: pointer',
    onClick: () => openTrend(row)
  }
}
</script>

<template>
  <!-- 公共弹窗壳 ProModal：标题随视图切换（趋势态=站点名），月份选择器仅列表态显示 -->
  <pro-modal
    v-model:show="show"
    v-model:time-picker-value="monthVal"
    :title="pane === 'trend' ? trendTitle : titleText"
    :style-params="{ width: '1120px', height: '640px' }"
    :show-time-picker="pane === 'data'"
    time-picker-type="month"
    content-mode="fill"
    time-picker-width="120px"
    time-picker-placeholder="选择月份"
    :time-picker-disabled="monthDisabled"
    @time-picker-change="onMonthChange"
  >
    <div class="mrd-body">
      <!-- 滑动视口：轨道宽 200%，趋势态整体左移一半（参照 LineDataDialog） -->
      <div class="mrd-viewport">
        <div class="mrd-track" :class="{ 'is-trend': pane === 'trend' }">
          <!-- 视图1：月报数据表（行点击滑出趋势页） -->
          <section class="mrd-pane">
            <div class="mrd-meta">
              <span v-if="curYm && rows.length" class="mrd-note">
                数据期：{{ curYm.replace('-', '年') }}月（所选月份缺报时自动回退到该线路最新一期）·
                点击行查看单站月完成水量趋势
              </span>
              <span class="mrd-unit">水量单位：（万立方米） 序时进度/完成率：（%）</span>
            </div>
            <div class="mrd-table-wrap">
              <n-data-table
                :columns="columns"
                :data="rows"
                :loading="loading"
                :row-key="(r: any) => r.PRJ_CD + r.YR + r.MN + r.CTG_NM"
                :row-props="rowProps"
                size="small"
                flex-height
                style="height: 100%"
                :bordered="false"
                :pagination="{ pageSize: 15, showSizePicker: false }"
              />
            </div>
            <div v-if="!loading && rows.length === 0" class="mrd-empty">该月暂无数据</div>
          </section>

          <!-- 视图2：单站月完成水量趋势（只展示月报的月完成水量） -->
          <section class="mrd-pane">
            <div class="mrt-head">
              <n-button size="small" secondary @click="backToData">← 返回</n-button>
              <!-- 类别与工程同名（如永定河「册田水库(出库)」）时只显示站名，避免「站名 · 站名」重复 -->
              <span class="mrt-title">
                {{ trendCtg && trendCtg !== trendPrj ? trendCtg + ' · ' : '' }}{{ trendPrj }}
              </span>
              <span class="mrt-unit">水量单位：万m³</span>
            </div>
            <!-- 左图右表：右侧表格展示图表逐月数据（2026-09-30，暂不加合计） -->
            <div class="mrt-main">
              <div
                class="mrt-chart"
                :class="{ 'is-empty': !trendLoading && trendRows.length === 0 }"
              >
                <n-spin
                  :show="trendLoading"
                  style="height: 100%"
                  :content-style="{ height: '100%' }"
                >
                  <div ref="trendChartRef" class="mrt-echart" />
                </n-spin>
                <div v-if="!trendLoading && trendRows.length === 0" class="mrt-empty">
                  该工程暂无月完成水量数据
                </div>
              </div>
              <div class="mrt-table">
                <n-data-table
                  :columns="trendTableColumns"
                  :data="trendRows"
                  :row-key="(r: any) => r.ym"
                  size="small"
                  :bordered="true"
                  single-line
                  flex-height
                  style="height: 100%"
                  :pagination="false"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </pro-modal>
</template>

<style scoped lang="scss">
/* 内容区撑满 ProModal 提供的固定高度（contentMode=fill），表格在剩余空间内滚动 */
.mrd-body {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* ==================== 滑动轨道（参照 LineDataDialog）：两个视图各占一半，趋势态整体左移 ==================== */
.mrd-viewport {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.mrd-track {
  display: flex;
  width: 200%;
  height: 100%;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  &.is-trend {
    transform: translateX(-50%);
  }
}

.mrd-pane {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;
  min-width: 0;
  overflow: hidden;
}

/* 视图2 头部：返回 + 站点名 + 单位 */
.mrt-head {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;

  .mrt-title {
    font-size: 14px;
    font-weight: 600;
    color: #163d90;
  }

  .mrt-unit {
    margin-left: auto;
    font-size: 12px;
    color: #999;
  }
}

/* 左图右表：图表占满剩余宽度，右侧固定宽月份表（内部滚动） */
.mrt-main {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 12px;
}

.mrt-chart {
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: 0;

  .mrt-echart {
    width: 100%;
    height: 100%;
  }

  &.is-empty .mrt-echart {
    display: none;
  }
}

.mrt-table {
  flex: none;
  width: 250px;
  height: 100%;

  :deep(.n-data-table-th),
  :deep(.n-data-table-td) {
    text-align: center;
  }
}

.mrt-empty {
  position: absolute;
  inset: 40% auto auto 50%;
  transform: translate(-50%, -50%);
  font-size: 13px;
  color: #999;
}

/* 表格 meta 行：左实际数据期提示，右水量/百分比单位灰色小字 */
.mrd-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
}

.mrd-table-wrap {
  flex: 1;
  min-height: 0; /* max-height 由弹窗固定高度决定，表体内部滚动 */
}

/* 表头居中 */
.mrd-table-wrap :deep(.n-data-table-thead .n-data-table-th) {
  text-align: center;
}

/* 单元格文字折行（数字列除外），行高收紧 */
.mrd-table-wrap :deep(.n-data-table-td) {
  white-space: normal;
  word-break: break-word;
  line-height: 1.4;
}

/* 数字列右对齐且单行不折 */
.mrd-table-wrap :deep(.n-data-table-td.n-data-table-td--align-right) {
  white-space: nowrap;
}

/* 长文本（工程名称/类别/供水时段）折行完整展示 */
.mrd-wrap {
  display: inline-block;
  max-width: 100%;
  vertical-align: middle;
}

.mrd-empty {
  position: absolute;
  inset: 40% auto auto 50%;
  transform: translate(-50%, -50%);
  font-size: 13px;
  color: #999;
}
</style>
