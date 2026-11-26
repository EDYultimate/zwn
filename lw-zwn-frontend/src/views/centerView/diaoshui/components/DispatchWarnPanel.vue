<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import { getDispatchWarn, queryStcdMonthRange } from '@/api/waterdisp'
import { useECharts } from '@/hooks/web/useECharts'
import type { DataTableColumns } from 'naive-ui'

/**
 * 调水预警面板（2026-09-28 迁自老项目 water_tr 预警页签，portal 前后端）
 *
 * 挂载于调水一张图「流域调水」详情（BasinDetail）：漳河/滹沱河/滦河 详情态的「预警」页签内容。
 * 数据：/waterdisp/dispatchWarn 阈值比对（老项目前端写死规则已后端化）——
 *   漳河（麻田/匡门口/侯壁）与滹沱河（小觉+地都+泉口 合计及单站）：指标×系数两节点红/蓝；
 *   滦河（滦县站）：8月底/9月底两时点行，蓝/橙阈值直接取库。
 *   年累计口径 = 老项目 YEARQ1（日历年 SUM(AWQ)×8.64，01-02 起）；年累计偏少为警。
 *   阈值未录入（库内 0/无行）显示 - 且不判定级别。
 */
const LINE_NM: Record<string, string> = { ZH: '漳河', HT: '滹沱河', LH: '滦河' }

const props = defineProps<{ lineCd: string }>()

interface WarnRow {
  stcd: string
  stnm: string
  isTotal?: boolean
  node?: string
  target: number | null
  red: number | null
  blue: number | null
  orange?: number | null
  red8?: number | null
  blue8?: number | null
  red9?: number | null
  blue9?: number | null
  yearAcc: number | null
  level: string
}

const warnLoading = ref(false)
const warnRows = ref<WarnRow[]>([])
const sepNode = ref(false)

const lineNm = computed(() => LINE_NM[props.lineCd] ?? '')

function fmt(v: number | null | undefined) {
  if (v === null || v === undefined || Number.isNaN(Number(v))) {
    return '-'
  }
  const n = Number(v)
  return Number.isInteger(n) ? String(n) : n.toFixed(2)
}

/** 预警级别文案与颜色（年累计偏少为警；'-'=未判定/正常） */
const LEVEL_TEXT: Record<string, string> = {
  red: '红色预警',
  blue: '蓝色预警',
  orange: '橙色预警',
  '-': '-'
}

function levelColor(level: string) {
  if (level === 'red') {
    return '#e64545'
  }
  if (level === 'blue') {
    return '#1e79ff'
  }
  if (level === 'orange') {
    return '#ff8c00'
  }
  return '#4e5969'
}

/** 年累计单元格按级别着色（老项目同款：红/蓝/橙字加粗） */
function renderAcc(row: WarnRow) {
  const text = fmt(row.yearAcc)
  const color = row.yearAcc == null ? '#4e5969' : levelColor(row.level)
  return h('span', { style: `color:${color};font-weight:700` }, text)
}

function renderLevel(row: WarnRow) {
  const level = row.level || '-'
  return h(
    'span',
    { style: `color:${levelColor(level)};font-weight:700` },
    LEVEL_TEXT[level] || '-'
  )
}

async function loadWarn() {
  warnLoading.value = true
  try {
    const res: any = await getDispatchWarn({ lineCd: props.lineCd })
    if (res.code === 0 && res.data) {
      warnRows.value = res.data.rows || []
      sepNode.value = !!res.data.sepNode
    } else {
      warnRows.value = []
    }
  } catch (e) {
    console.warn('getDispatchWarn failed', e)
    warnRows.value = []
  } finally {
    warnLoading.value = false
  }
}

watch(
  () => props.lineCd,
  () => loadWarn(),
  { immediate: true }
)

// ==================== 行点击明细弹窗（老项目 showDialog 复刻） ====================
// 打开：标题=断面名；顶部「{年}年日历年累计」+ 月份范围选择（默认当年 01~12）；
// 阈值表（有指标时）；「1-8月累计 / 1-9月累计」（按节点阈值着色）；左=逐月水量柱状图，右=月份表格。
// 月水量取既有接口 queryStcdMonthRange 的 MONTH_Q_CALC（SUM(AWQ)*8.64，与年累计同口径）。
const dlg = ref({
  show: false,
  stnm: '',
  stcd: '',
  row: null as WarnRow | null
})

const dlgYear = new Date().getFullYear()
const monthRange = ref<[string, string]>([`${dlgYear}-01`, `${dlgYear}-12`])

/** 当年 01-12 全量月序列（口径 MONTH_Q_CALC） */
const dlgRows = ref<{ ym: string; val: number | null }[]>([])
const dlgLoading = ref(false)
const dlgChartRef = ref<HTMLDivElement | null>(null)
const { setOptions: setDlgOptions } = useECharts(dlgChartRef as any)

/** 月份范围选择器禁用：只能选弹窗年份内的月份 */
function dlgMonthDisabled(ts: number) {
  const d = new Date(ts)
  return d.getFullYear() !== dlgYear
}

const dlgColumns: DataTableColumns<{ ym: string; val: number | null }> = [
  { title: '月份', key: 'ym', align: 'center' },
  {
    title: '水量(万m³)',
    key: 'val',
    align: 'center',
    render: (r) => fmt(r.val)
  }
]

/** 选择范围内的月序列（图表与右侧表格共用） */
const dlgSlice = computed(() =>
  dlgRows.value.filter((r) => r.ym >= monthRange.value[0] && r.ym <= monthRange.value[1])
)

/** 1-8月 / 1-9月累计（全量序列求和，与所选范围无关，同老项目） */
const total8 = computed(() => sumByMonth(8))
const total9 = computed(() => sumByMonth(9))

function sumByMonth(mn: number) {
  const end = `${dlgYear}-${String(mn).padStart(2, '0')}`
  let sum = 0
  let any = false
  for (const r of dlgRows.value) {
    if (r.ym <= end && r.val != null) {
      sum += r.val
      any = true
    }
  }
  return any ? Number(sum.toFixed(2)) : null
}

/** 节点累计着色：小于红（或橙）→红/橙，小于蓝→蓝 */
function totalStyle(total: number | null, node: 8 | 9) {
  const row = dlg.value.row
  if (total == null || !row) {
    return ''
  }
  const red = node === 8 ? row.red8 : row.red9
  const blue = node === 8 ? row.blue8 : row.blue9
  if (props.lineCd === 'LH') {
    if (total != null && row.orange != null && total <= row.orange) {
      return 'color:#ff8c00;font-weight:700'
    }
    if (total != null && row.blue != null && total <= row.blue) {
      return 'color:#1e79ff;font-weight:700'
    }
    return ''
  }
  if (red != null && total < red) {
    return 'color:#e64545;font-weight:700'
  }
  if (blue != null && total < blue) {
    return 'color:#1e79ff;font-weight:700'
  }
  return ''
}

async function loadDlgMonths() {
  dlgLoading.value = true
  try {
    const res: any = await queryStcdMonthRange({
      stcd: dlg.value.stcd,
      startMonth: `${dlgYear}-01`,
      endMonth: `${dlgYear}-12`
    })
    const rows: any[] = res?.code === 0 && res.data ? res.data.rows || [] : []
    dlgRows.value = rows.map((r) => ({
      ym: String(r.MONTH || ''),
      val: r.MONTH_Q_CALC == null ? null : Number(r.MONTH_Q_CALC)
    }))
  } catch (e) {
    console.warn('queryStcdMonthRange failed', e)
    dlgRows.value = []
  } finally {
    dlgLoading.value = false
  }
  renderDlgChart()
}

/** 月水量柱状图（所选月份范围） */
function renderDlgChart() {
  setDlgOptions({
    tooltip: { trigger: 'axis' },
    grid: { left: 64, right: 24, top: 28, bottom: 30 },
    xAxis: {
      type: 'category',
      data: dlgSlice.value.map((r) => r.ym),
      axisLabel: { color: '#4e5969', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      name: '万m³',
      axisLabel: { color: '#4e5969', fontSize: 11 },
      splitLine: { lineStyle: { color: '#e5e6eb', type: 'dashed' } }
    },
    series: [
      {
        name: '月水量',
        type: 'bar',
        barMaxWidth: 30,
        itemStyle: { color: '#256AB7' },
        data: dlgSlice.value.map((r) => r.val)
      }
    ]
  })
}

watch(monthRange, () => renderDlgChart())

/** 表格行点击 → 打开明细弹窗 */
function rowProps(row: WarnRow) {
  return {
    style: 'cursor: pointer',
    onClick: () => openDlg(row)
  }
}

function openDlg(row: WarnRow) {
  dlg.value = { show: true, stnm: row.stnm, stcd: row.stcd, row }
  monthRange.value = [`${dlgYear}-01`, `${dlgYear}-12`]
  loadDlgMonths()
}

function closeDlg() {
  dlg.value = { show: false, stnm: '', stcd: '', row: null }
  dlgRows.value = []
}

// ==================== 预警表列 ====================
/** 漳河/滹沱河主表：当前节点红/蓝阈值随日期切换（8月节点 / 9月节点） */
const mainColumns = computed<DataTableColumns<WarnRow>>(() => [
  { title: '控制断面', key: 'stnm', width: 150, align: 'center' },
  {
    title: '下泄水量指标',
    key: 'target',
    width: 130,
    align: 'center',
    render: (r) => fmt(r.target)
  },
  {
    title: `${sepNode.value ? '9月' : '8月'}预警阈值`,
    key: 'cur',
    align: 'center',
    children: [
      { title: '红色', key: 'red', width: 110, align: 'center', render: (r) => fmt(r.red) },
      { title: '蓝色', key: 'blue', width: 110, align: 'center', render: (r) => fmt(r.blue) }
    ]
  },
  {
    title: '年累计',
    key: 'yearAcc',
    width: 140,
    align: 'center',
    render: renderAcc
  },
  {
    title: '预警级别',
    key: 'level',
    width: 120,
    align: 'center',
    render: renderLevel
  }
])

/** 漳河/滹沱河两节点明细表（8月底 / 9月底红蓝阈值） */
const nodeColumns = computed<DataTableColumns<WarnRow>>(() => [
  { title: '控制断面', key: 'stnm', width: 150, align: 'center' },
  {
    title: '8月底预警阈值',
    key: 'n8',
    align: 'center',
    children: [
      { title: '红色', key: 'red8', width: 110, align: 'center', render: (r) => fmt(r.red8) },
      { title: '蓝色', key: 'blue8', width: 110, align: 'center', render: (r) => fmt(r.blue8) }
    ]
  },
  {
    title: '9月底预警阈值',
    key: 'n9',
    align: 'center',
    children: [
      { title: '红色', key: 'red9', width: 110, align: 'center', render: (r) => fmt(r.red9) },
      { title: '蓝色', key: 'blue9', width: 110, align: 'center', render: (r) => fmt(r.blue9) }
    ]
  }
])

/** 滦河表：8月底/9月底两个时点行 */
const lhColumns = computed<DataTableColumns<WarnRow>>(() => [
  { title: '时点', key: 'node', width: 100, align: 'center' },
  { title: '断面', key: 'stnm', width: 110, align: 'center' },
  {
    title: '生态水量指标',
    key: 'target',
    width: 130,
    align: 'center',
    render: (r) => fmt(r.target)
  },
  {
    title: '蓝色预警阈值',
    key: 'blue',
    width: 130,
    align: 'center',
    render: (r) => fmt(r.blue)
  },
  {
    title: '橙色预警阈值',
    key: 'orange',
    width: 130,
    align: 'center',
    render: (r) => fmt(r.orange)
  },
  {
    title: '年累计',
    key: 'yearAcc',
    width: 140,
    align: 'center',
    render: renderAcc
  },
  {
    title: '预警级别',
    key: 'level',
    width: 120,
    align: 'center',
    render: renderLevel
  }
])
</script>

<template>
  <div class="dwp">
    <n-spin :show="warnLoading">
      <!-- 漳河 / 滹沱河：主表 + 两节点明细表 -->
      <template v-if="lineCd !== 'LH'">
        <div class="dwp-table-title">{{ lineNm }}控制断面预警阈值（点击行查看明细）</div>
        <n-data-table
          :columns="mainColumns"
          :data="warnRows"
          :row-key="(r: WarnRow) => r.stcd"
          :row-props="rowProps"
          size="small"
          :bordered="true"
          single-line
          :pagination="false"
        />
        <div class="dwp-table-title" style="margin-top: 16px">
          {{ lineNm }}控制断面两节点预警阈值（万m³）
        </div>
        <n-data-table
          :columns="nodeColumns"
          :data="warnRows"
          :row-key="(r: WarnRow) => r.stcd + '_node'"
          size="small"
          :bordered="true"
          single-line
          :pagination="false"
        />
        <div class="dwp-note">
          控制断面下泄水量设置两个预警节点：第一个节点为8月底，以下泄水量指标的60%为蓝色预警阈值、50%为红色预警阈值；第二个节点为9月底，以下泄水量指标的80%为蓝色预警阈值、60%为红色预警阈值。年累计小于红色阈值触发红色预警、小于蓝色阈值触发蓝色预警（年累计偏少为警）。水量单位：万m³。
        </div>
      </template>

      <!-- 滦河：滦县站两个时点行 -->
      <template v-else>
        <div class="dwp-table-title">滦河生态水量预警阈值（滦县站，点击行查看明细）</div>
        <n-data-table
          :columns="lhColumns"
          :data="warnRows"
          :row-key="(r: WarnRow) => String(r.node)"
          :row-props="rowProps"
          size="small"
          :bordered="true"
          single-line
          :pagination="false"
        />
        <div class="dwp-note">
          滦县站设置8月底、9月底两个预警时点，年累计达到橙色/蓝色预警阈值即触发相应级别预警（年累计偏少为警）。阈值与指标取自年度录入数据（XXZB_LH_LX
          等指标行），未录入时显示 - 且不判定。水量单位：万m³。
        </div>
      </template>
    </n-spin>

    <!-- 行点击明细弹窗（老项目 showDialog 复刻） -->
    <n-modal v-model:show="dlg.show" :auto-focus="false" @after-leave="closeDlg">
      <div class="dlg">
        <div class="dlg-bar">
          <span class="dlg-title">{{ dlg.stnm }}预警明细</span>
          <span class="dlg-close" title="关闭" @click="dlg.show = false">✕</span>
        </div>

        <div class="dlg-body">
          <!-- 年累计 + 月份范围 -->
          <div class="dlg-top">
            <span>
              {{ dlgYear }}年日历年累计： <b>{{ fmt(dlg.row?.yearAcc ?? null) }}</b> 万m³
            </span>
            <div class="dlg-range">
              <span>选择月份范围：</span>
              <n-date-picker
                v-model:formatted-value="monthRange[0]"
                type="month"
                value-format="yyyy-MM"
                size="small"
                :clearable="false"
                :is-date-disabled="dlgMonthDisabled"
                style="width: 110px"
              />
              <span class="dlg-sep">至</span>
              <n-date-picker
                v-model:formatted-value="monthRange[1]"
                type="month"
                value-format="yyyy-MM"
                size="small"
                :clearable="false"
                :is-date-disabled="dlgMonthDisabled"
                style="width: 110px"
              />
            </div>
          </div>

          <!-- 阈值表（有指标才显示；滦河=指标+蓝/橙单行） -->
          <div v-if="dlg.row && dlg.row.target != null" class="dlg-threshold">
            <n-data-table
              v-if="lineCd !== 'LH'"
              :columns="nodeColumns"
              :data="[dlg.row]"
              :row-key="(r: WarnRow) => r.stcd + '_dlg'"
              size="small"
              :bordered="true"
              single-line
              :pagination="false"
            />
            <n-data-table
              v-else
              :columns="lhColumns"
              :data="[dlg.row]"
              :row-key="(r: WarnRow) => String(r.node) + '_dlg'"
              size="small"
              :bordered="true"
              single-line
              :pagination="false"
            />
          </div>

          <!-- 1-8月 / 1-9月累计（按节点阈值着色） -->
          <div class="dlg-totals">
            <span>{{ dlgYear }}年1-8月累计：</span>
            <b :style="totalStyle(total8, 8)">{{ fmt(total8) }}</b>
            <span class="dlg-totals-gap">{{ dlgYear }}年1-9月累计：</span>
            <b :style="totalStyle(total9, 9)">{{ fmt(total9) }}</b>
            <span class="dlg-totals-unit">万m³</span>
          </div>

          <!-- 左图右表 -->
          <div class="dlg-main">
            <div class="dlg-chart">
              <n-spin :show="dlgLoading" style="height: 100%" :content-style="{ height: '100%' }">
                <div ref="dlgChartRef" class="dlg-echart" />
              </n-spin>
            </div>
            <div class="dlg-table">
              <n-data-table
                :columns="dlgColumns"
                :data="dlgSlice"
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
        </div>
      </div>
    </n-modal>
  </div>
</template>

<style scoped lang="scss">
.dwp {
  overflow: auto;
}

.dwp-table-title {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #163d90;
}

.dwp-note {
  margin-top: 12px;
  padding: 10px 12px;
  background-color: #f4f5f9;
  border-radius: 4px;
  color: #636b7d;
  font-size: 13px;
  line-height: 1.7;
}

/* ==================== 行点击明细弹窗 ==================== */
.dlg {
  display: flex;
  flex-direction: column;
  width: min(1080px, 94vw);
  max-height: 88vh;
  padding: 14px 18px 16px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.24);
  overflow: auto;
}

.dlg-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  .dlg-title {
    font-size: 16px;
    font-weight: 700;
    color: #163d90;
  }

  .dlg-close {
    padding: 4px;
    color: #8a94a6;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;

    &:hover {
      color: #333;
    }
  }
}

.dlg-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dlg-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 14px;
  color: #333;

  .dlg-range {
    display: flex;
    align-items: center;
    gap: 6px;

    .dlg-sep {
      color: #86909c;
    }
  }
}

.dlg-threshold {
  :deep(.n-data-table-th) {
    text-align: center;
  }

  :deep(.n-data-table-td) {
    text-align: center;
  }
}

.dlg-totals {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 14px;
  color: #333;

  .dlg-totals-gap {
    margin-left: 24px;
  }

  .dlg-totals-unit {
    margin-left: 4px;
    color: #86909c;
    font-size: 12px;
  }
}

.dlg-main {
  display: flex;
  gap: 14px;
  height: 420px;

  .dlg-chart {
    flex: 1;
    min-width: 0;
    height: 100%;

    .dlg-echart {
      width: 100%;
      height: 100%;
    }
  }

  .dlg-table {
    flex: none;
    width: 240px;
    height: 100%;

    :deep(.n-data-table-th),
    :deep(.n-data-table-td) {
      text-align: center;
    }
  }
}
</style>
