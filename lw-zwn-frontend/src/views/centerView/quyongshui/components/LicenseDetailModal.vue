<script setup lang="ts">
import { ref, computed, watch, nextTick, h } from 'vue'
import {
  certDetail,
  certFacilities,
  certMonthWater,
  certPlanReview,
  measWater
} from '@/api/quyongshui'
import { useECharts } from '@/hooks/web/useECharts'

/**
 * 取水许可证详情弹窗（取用水一张图 · 框选监测详情按钮）
 *
 * 参照旧项目电子证照库点击许可证编号弹出的 dialog（zzk/index.vue）三个页签：
 * ①基本信息（取用水户 + 证照信息）②计量设施（名称/传输方式/状态/年累计水量）
 * ③取水计划及水量（许可水量 vs 实际水量 12 个月转置表 + 计划/实际柱状图，实际超计划 30% 标红预警）。
 * 年度取水量/年累计水量=指定年份月表全年合计（与框选弹窗"年累计取水量"同口径）。
 */

interface DetailData {
  FIR_CERT_NUM_CODE?: string
  WAT_RIG_OWNER?: string
  STATUS?: string
  WAT_T_AMNT?: number
  OWNER_CODE?: string
  INTAKING_TYPE?: string
  WAT_SOU_DES_CODE?: string
  WAT_USAGE_DES?: string
  MULTI_INT?: string
  PRO_NAME?: string
  INT_LOCATION_FULL?: string
  EFF_PER_FROM?: string
  EFF_PER_TO?: string
  ISSU_DATE?: string
  INT_LOC_DIV_CODE?: string
  WATER_YEAR?: number
}

interface FacilityRow {
  FACILITY_ID: string
  MEAS_NAME: string
  TRANS_MODE: string
  STATUS_MODE: string
  WATER_FACTOR_MODE?: string // 计量位置类型：取水口/供水口/退水口（供水口/退水口年累计水量标 0）
  WATER: number
}

const visible = ref(false)
const loading = ref(false)
const detail = ref<DetailData>({})
// 查询年份（实际水量/明细口径）；计划记录 as-of 回退后计划年份可能早于该值
const queryYear = ref(String(new Date().getFullYear()))

const activeTab = ref('basic')
const facilities = ref<FacilityRow[]>([])
const monthWaterList = ref<{ DATE_STR: string; WATER: number }[]>([])
const planReview = ref<Record<string, string> | null>(null)

// 月份配置（同旧项目 zzk 转置表）
const MONTHS = [
  { prop: 'M1', label: '1月' },
  { prop: 'M2', label: '2月' },
  { prop: 'M3', label: '3月' },
  { prop: 'M4', label: '4月' },
  { prop: 'M5', label: '5月' },
  { prop: 'M6', label: '6月' },
  { prop: 'M7', label: '7月' },
  { prop: 'M8', label: '8月' },
  { prop: 'M9', label: '9月' },
  { prop: 'M10', label: '10月' },
  { prop: 'M11', label: '11月' },
  { prop: 'M12', label: '12月' }
]

function open(certCode: string, year?: number) {
  detail.value = {}
  facilities.value = []
  monthWaterList.value = []
  planReview.value = null
  activeTab.value = 'basic'
  queryYear.value = String(year || new Date().getFullYear())
  visible.value = true
  loadAll(certCode, year)
}

defineExpose({ open })

async function loadAll(certCode: string, year?: number) {
  loading.value = true
  try {
    const [d, f, m, p] = await Promise.all([
      certDetail({ certCode, year }),
      certFacilities({ certCode, year }),
      certMonthWater({ certCode, year }),
      certPlanReview({ certCode, year })
    ])
    detail.value = d.code === 0 && d.data ? d.data : {}
    facilities.value = f.code === 0 && Array.isArray(f.data) ? f.data : []
    monthWaterList.value = m.code === 0 && Array.isArray(m.data) ? m.data : []
    planReview.value = p.code === 0 && p.data ? p.data : null
  } catch (e) {
    console.warn('certDetail tabs failed', e)
    detail.value = {}
  } finally {
    loading.value = false
  }
}

function show(v: unknown) {
  return v === undefined || v === null || v === '' ? '-' : String(v)
}

// 详情数据所属年份（接口按此年份查询计划/水量；计划 as-of 回退后可能早于 queryYear）
const detailYear = computed(() => String(planReview.value?.YEAR || queryYear.value))

function fmtWater(v: unknown) {
  const n = Number(v)
  return isNaN(n) ? '0.00' : n.toFixed(2)
}

// ==================== 取水计划及水量（转置表 + 柱状图，迁自旧项目 zzk 取水计划页签） ====================
const warningTip = '单位：万m³；实际水量红色字体为预警，预警标准：超许可 30%'

interface PlanRow {
  type: string
  M1?: string
  M2?: string
  M3?: string
  M4?: string
  M5?: string
  M6?: string
  M7?: string
  M8?: string
  M9?: string
  M10?: string
  M11?: string
  M12?: string
  total?: string
  isWarning?: Record<string, boolean>
}

// 实际水量按月转 12 列（DATE_STR=yyyy-MM）
function actualByMonth(year: string): Record<string, string> {
  const map: Record<string, string> = {}
  monthWaterList.value.forEach((item) => {
    if (item.DATE_STR && item.DATE_STR.startsWith(year)) {
      const month = item.DATE_STR.split('-')[1]
      if (month) {
        map[month] = fmtWater(item.WATER)
      }
    }
  })
  return map
}

function buildPlanRows(): PlanRow[] {
  // 实际水量按查询年份取数；计划行直接取计划记录的 M1~M12（as-of 回退时计划年份见提示文案）
  const planRow: PlanRow = { type: '许可水量', isWarning: {} }
  const actualRow: PlanRow = { type: '实际水量', isWarning: {} }
  const actualMap = actualByMonth(queryYear.value)

  let planTotal = 0
  let actualTotal = 0
  MONTHS.forEach((m) => {
    const key = m.prop.slice(1).padStart(2, '0') // 01~12（actualByMonth 的键为两位月份）
    const planVal = planReview.value?.[m.prop]
    planRow[m.prop] = planVal === undefined || planVal === null ? '-' : String(planVal)
    if (planRow[m.prop] !== '-' && !isNaN(Number(planRow[m.prop]))) {
      planTotal += Number(planRow[m.prop])
    }
    actualRow[m.prop] = actualMap[key] || '-'
    if (actualRow[m.prop] !== '-') {
      actualTotal += Number(actualRow[m.prop])
    }
    // 预警：实际 > 计划*1.3
    const pv = Number(planRow[m.prop])
    const av = Number(actualRow[m.prop])
    if (!isNaN(pv) && !isNaN(av)) {
      actualRow.isWarning![m.prop] = av > pv * 1.3
    } else {
      actualRow.isWarning![m.prop] = false
    }
  })
  planRow.total =
    planReview.value?.TT !== undefined
      ? String(planReview.value.TT)
      : planTotal > 0
        ? planTotal.toFixed(2)
        : '-'
  actualRow.total = actualTotal > 0 ? actualTotal.toFixed(2) : '-'
  const tp = Number(planRow.total)
  const ta = Number(actualRow.total)
  actualRow.isWarning!.total = !isNaN(tp) && !isNaN(ta) ? ta > tp * 1.3 : false
  return [planRow, actualRow]
}

const planRows = ref<PlanRow[]>([])

// ==================== 柱状图（计划 vs 实际，ECharts） ====================
const planChartEl = ref<HTMLDivElement>()
const { setOptions: setPlanChart, disposeInstance: disposePlanChart } = useECharts(planChartEl)

function renderPlanChart() {
  const actualMap = actualByMonth(queryYear.value)
  const planned = MONTHS.map((m) => Number(planReview.value?.[m.prop]) || 0)
  const actual = MONTHS.map((m) => {
    const key = m.prop.slice(1).padStart(2, '0')
    return actualMap[key] ? Number(actualMap[key]) : 0
  })
  setPlanChart({
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
    grid: { top: 36, left: 50, right: 12, bottom: 28 },
    xAxis: {
      type: 'category',
      data: MONTHS.map((m) => m.label),
      axisLabel: { color: '#244165', fontSize: 11 },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#7BACDE' } }
    },
    yAxis: {
      type: 'value',
      name: '水量（万m³）',
      nameTextStyle: { color: '#244165', fontSize: 12 },
      axisLabel: { color: '#244165', fontSize: 11 },
      axisTick: { show: false },
      axisLine: { show: true, lineStyle: { color: '#7BACDE' } },
      splitLine: { lineStyle: { type: 'dashed', color: '#94B9E5' } }
    },
    series: [
      {
        name: '计划水量',
        type: 'bar',
        data: planned,
        barMaxWidth: 14,
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
        name: '实际水量',
        type: 'bar',
        data: actual,
        barMaxWidth: 14,
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

// 切到"取水计划及水量"页签时构建表格 + 渲染图表
watch(activeTab, (tab) => {
  if (tab === 'plan') {
    planRows.value = buildPlanRows()
    nextTick(() => renderPlanChart())
  }
})

// ==================== 计量设施水量子弹窗（年/月/日，迁自旧项目 MeasureFacilityWater） ====================
const waterVisible = ref(false)
const waterLoading = ref(false)
const waterFacilityName = ref('')
const currentMeasId = ref('')
const waterType = ref<'year' | 'month' | 'day'>('year')
const waterList = ref<{ DATE_STR: string; WATER: number }[]>([])
const waterChartEl = ref<HTMLDivElement>()
const { setOptions: setWaterChart, disposeInstance: disposeWaterChart } = useECharts(waterChartEl)

// 弹窗关闭时内容会被 n-modal 卸载，图表实例必须同步销毁，否则下次打开绑在已销毁 DOM 上不渲染
watch(visible, (v) => {
  if (!v) {
    disposePlanChart()
    disposeWaterChart()
  }
})

// 日期列标签：年水量=年份 / 月水量=月份 / 日水量=日期（同旧项目）
const waterDateLabel = computed(() =>
  waterType.value === 'year' ? '年份' : waterType.value === 'month' ? '月份' : '日期'
)

// 点击计量设施表格"年累计水量"打开子弹窗（仅取水口有有效水量）
function openWaterModal(row: FacilityRow) {
  if (row.WATER_FACTOR_MODE === '供水口' || row.WATER_FACTOR_MODE === '退水口') {
    return
  }
  waterFacilityName.value = row.MEAS_NAME
  currentMeasId.value = row.FACILITY_ID
  waterType.value = 'year'
  waterVisible.value = true
  loadWaterData()
}

function switchWaterType(type: 'year' | 'month' | 'day') {
  if (waterType.value === type) {
    return
  }
  waterType.value = type
  loadWaterData()
}

async function loadWaterData() {
  if (!currentMeasId.value) {
    return
  }
  waterLoading.value = true
  try {
    const res = await measWater({ measId: currentMeasId.value, type: waterType.value })
    waterList.value = res.code === 0 && Array.isArray(res.data) ? res.data : []
  } catch (e) {
    console.warn('measWater failed', e)
    waterList.value = []
  } finally {
    waterLoading.value = false
    nextTick(() => renderWaterChart())
  }
}

// 渲染水量柱状图（日水量 x 轴标签同旧项目截取 MM-dd）
function renderWaterChart() {
  const labels = waterList.value.map((item) =>
    item.DATE_STR && item.DATE_STR.length === 10 ? item.DATE_STR.substring(5, 10) : item.DATE_STR
  )
  const amounts = waterList.value.map((item) => Number(item.WATER) || 0)
  setWaterChart({
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#e0e0e0',
      textStyle: { color: '#333', fontSize: 12 },
      axisPointer: { type: 'shadow' }
    },
    grid: { top: 30, left: 70, right: 16, bottom: 40 },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: { rotate: 45, color: '#244165', fontSize: 11 },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#7BACDE' } }
    },
    yAxis: {
      type: 'value',
      name: '水量 (m³)',
      nameTextStyle: { color: '#244165', fontSize: 12 },
      axisLabel: { color: '#244165', fontSize: 11 },
      axisTick: { show: false },
      axisLine: { show: true, lineStyle: { color: '#7BACDE' } },
      splitLine: { lineStyle: { type: 'dashed', color: '#94B9E5' } }
    },
    series: [
      {
        name: '水量',
        type: 'bar',
        data: amounts,
        barMaxWidth: 14,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#0490ff' },
              { offset: 1, color: '#a3c0f4' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  })
}

// 弹窗打开且默认展示基本信息，切到 plan 时由 watch 触发
</script>

<template>
  <n-modal
    v-model:show="visible"
    preset="card"
    title="取水许可证详情"
    style="width: 980px"
    :mask-closable="false"
  >
    <div v-if="loading" class="ld-loading ld-body">加载中...</div>
    <!-- 固定内容高度：切换页签时弹窗高度不变，内容超出滚动 -->
    <n-tabs
      v-else-if="detail.FIR_CERT_NUM_CODE"
      v-model:value="activeTab"
      type="line"
      animated
      class="ld-body"
    >
      <!-- 基本信息页签 -->
      <n-tab-pane name="basic" tab="基本信息">
        <div class="ld-section">
          <div class="ld-title">取用水户</div>
          <n-descriptions :column="2" label-placement="left" bordered size="small">
            <n-descriptions-item label="取水权人">{{
              show(detail.WAT_RIG_OWNER)
            }}</n-descriptions-item>
            <n-descriptions-item label="统一信用代码">{{
              show(detail.OWNER_CODE)
            }}</n-descriptions-item>
          </n-descriptions>
        </div>

        <div class="ld-section">
          <div class="ld-title">证照信息</div>
          <n-descriptions :column="2" label-placement="left" bordered size="small">
            <n-descriptions-item label="许可证编号">{{
              show(detail.FIR_CERT_NUM_CODE)
            }}</n-descriptions-item>
            <n-descriptions-item label="业务类型">{{ show(detail.STATUS) }}</n-descriptions-item>
            <n-descriptions-item label="取水类型">{{
              show(detail.INTAKING_TYPE)
            }}</n-descriptions-item>
            <n-descriptions-item label="许可水量">{{
              show(detail.WAT_T_AMNT)
            }}</n-descriptions-item>
            <n-descriptions-item label="年度取水量"
              >{{ fmtWater(detail.WATER_YEAR) }} 万m³</n-descriptions-item
            >
            <n-descriptions-item label="取水用途">{{
              show(detail.WAT_USAGE_DES)
            }}</n-descriptions-item>
            <n-descriptions-item label="水源类型">{{
              show(detail.WAT_SOU_DES_CODE)
            }}</n-descriptions-item>
            <n-descriptions-item label="是否多级取水">{{
              show(detail.MULTI_INT)
            }}</n-descriptions-item>
            <n-descriptions-item label="有效开始时间">{{
              show(detail.EFF_PER_FROM)
            }}</n-descriptions-item>
            <n-descriptions-item label="有效截止时间">{{
              show(detail.EFF_PER_TO)
            }}</n-descriptions-item>
            <n-descriptions-item label="发证日期">{{ show(detail.ISSU_DATE) }}</n-descriptions-item>
            <n-descriptions-item label="行政区划">{{
              show(detail.INT_LOC_DIV_CODE)
            }}</n-descriptions-item>
            <n-descriptions-item label="建设项目名称" :span="2">{{
              show(detail.PRO_NAME)
            }}</n-descriptions-item>
            <n-descriptions-item label="取水地址" :span="2">{{
              show(detail.INT_LOCATION_FULL)
            }}</n-descriptions-item>
          </n-descriptions>
        </div>
      </n-tab-pane>

      <!-- 计量设施页签（迁自旧项目 zzk 计量设施页签：名称/传输方式/年累计水量） -->
      <n-tab-pane name="measure" tab="计量设施">
        <div class="ld-section">
          <div class="ld-title">计量设施信息</div>
          <n-data-table
            size="small"
            :columns="[
              { title: '计量设施名称', key: 'MEAS_NAME' },
              { title: '传输方式', key: 'TRANS_MODE', width: 120, align: 'center' },
              { title: '使用状态', key: 'STATUS_MODE', width: 100, align: 'center' },
              { title: '计量位置类型', key: 'WATER_FACTOR_MODE', width: 110, align: 'center' },
              {
                title: '年累计水量(万m³)',
                key: 'WATER',
                width: 150,
                align: 'right',
                // 只有取水口显示有效水量且可点击弹出年/月/日水量详情；供水口/退水口直接标 0（2026-08-27 与 gk 对齐）
                render: (row: FacilityRow) => {
                  if (row.WATER_FACTOR_MODE === '供水口' || row.WATER_FACTOR_MODE === '退水口') {
                    return h('span', { style: 'color:#999' }, '0')
                  }
                  return h(
                    'span',
                    {
                      class: 'water-link',
                      onClick: () => openWaterModal(row)
                    },
                    fmtWater(row.WATER)
                  )
                }
              }
            ]"
            :data="facilities"
            :bordered="true"
            :single-line="false"
            :row-key="(row: any) => row.FACILITY_ID"
          />
          <div v-if="facilities.length === 0" class="ld-empty">该证暂无计量设施数据</div>
        </div>
      </n-tab-pane>

      <!-- 取水计划及水量页签（迁自旧项目 zzk 取水计划页签：许可/实际 12 月转置表 + 柱状图 + 预警标红） -->
      <n-tab-pane name="plan" tab="取水计划及水量">
        <div class="ld-section">
          <div class="plan-tip">
            计划年度 {{ detailYear
            }}<template v-if="detailYear !== queryYear">（as-of 最近有计划年份）</template> ·
            实际年度 {{ queryYear }} · {{ warningTip }}
          </div>
          <div v-if="!planReview" class="ld-empty">
            该证在源库中暂无{{
              queryYear
            }}年度取水计划记录（已向前回溯4年查找仍无，仅部分证照已填报年度计划），下表仅展示实际水量
          </div>
          <n-data-table
            size="small"
            :columns="[
              { title: '', key: 'type', width: 100 },
              ...MONTHS.map((m) => ({
                title: m.label,
                key: m.prop,
                width: 90,
                align: 'right' as const,
                render: (row: PlanRow) => {
                  const v = row[m.prop] ?? '-'
                  return row.isWarning?.[m.prop] ? h('span', { class: 'warning-red' }, v) : v
                }
              })),
              {
                title: '合计',
                key: 'total',
                width: 120,
                align: 'right',
                render: (row: PlanRow) => {
                  const v = row.total ?? '-'
                  return row.isWarning?.total ? h('span', { class: 'warning-red' }, v) : v
                }
              }
            ]"
            :data="planRows"
            :bordered="true"
            :single-line="false"
          />
        </div>
        <div class="ld-section">
          <div class="ld-title">计划与实际水量对比</div>
          <div ref="planChartEl" class="plan-chart" />
        </div>
      </n-tab-pane>
    </n-tabs>
    <div v-else-if="!loading" class="ld-loading">暂无详情数据</div>

    <!-- 子弹窗：计量设施水量（年/月/日，迁自旧项目 MeasureFacilityWater） -->
    <n-modal
      v-model:show="waterVisible"
      preset="card"
      :title="`计量设施水量 - ${waterFacilityName}`"
      style="width: 760px"
      :mask-closable="true"
    >
      <div class="wm-actions">
        <n-button
          size="small"
          :type="waterType === 'year' ? 'primary' : 'default'"
          @click="switchWaterType('year')"
          >年水量</n-button
        >
        <n-button
          size="small"
          :type="waterType === 'month' ? 'primary' : 'default'"
          @click="switchWaterType('month')"
          >月水量</n-button
        >
        <n-button
          size="small"
          :type="waterType === 'day' ? 'primary' : 'default'"
          @click="switchWaterType('day')"
          >日水量</n-button
        >
      </div>
      <!-- 用 v-show 而非 v-if：年/月/日切换时保持图表 DOM 不销毁，避免实例绑在旧节点上不渲染 -->
      <div v-show="waterLoading" class="ld-loading">加载中...</div>
      <div v-show="!waterLoading">
        <div ref="waterChartEl" class="water-chart" />
        <div class="wm-table">
          <n-data-table
            size="small"
            :columns="[
              { title: waterDateLabel, key: 'DATE_STR', align: 'center' },
              {
                title: '水量(立方米)',
                key: 'WATER',
                align: 'right',
                render: (row) => fmtWater(row.WATER)
              }
            ]"
            :data="waterList"
            :bordered="true"
            :single-line="false"
            max-height="250"
          />
        </div>
      </div>
    </n-modal>
  </n-modal>
</template>

<style scoped lang="scss">
.ld-body {
  height: 620px;
  overflow-y: auto;
}

.ld-loading {
  padding: 40px 0;
  text-align: center;
  color: #999;
  font-size: 13px;
}

.ld-empty {
  padding: 16px 0;
  text-align: center;
  color: #999;
  font-size: 13px;
}

.ld-section {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.ld-title {
  margin-bottom: 8px;
  padding-bottom: 4px;
  font-size: 15px;
  font-weight: 700;
  color: #1766db;
  border-bottom: 1px dashed #d5e2f3;
}

.plan-tip {
  margin-bottom: 8px;
  text-align: right;
  font-size: 12px;
  color: #999;
}

.plan-chart {
  width: 100%;
  height: 300px;
}

.wm-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.water-chart {
  width: 100%;
  height: 260px;
  margin-bottom: 12px;
}

/* 表格区固定高度：年/月/日行数不同时子弹窗高度不变 */
.wm-table {
  height: 256px;
  overflow-y: auto;
}

:deep(.water-link) {
  color: #0490ff;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

:deep(.warning-red) {
  color: #e02222;
  font-weight: 700;
}
</style>
