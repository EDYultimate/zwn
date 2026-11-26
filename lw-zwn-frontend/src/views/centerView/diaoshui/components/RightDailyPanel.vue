<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { queryDsDaily } from '@/api/waterdisp'
import StationDetailDialog from './StationDetailDialog.vue'

// 右侧日尺度数据面板：迁自旧调水报表项目右侧（Report_exp / Report_exp_wwtr_3/6/7 监控页签）
// 预警页签与数据编辑功能按要求不迁移
// 2026-09-15：本面板已内嵌于 LineDataDialog，标题与查询日期选择器上移到 dialog 标题栏，
//             wtTime 由父级 dialog 持有并下发（含"默认取库中最新有数据日期"的初始化逻辑）。
interface Props {
  lineCd?: string
  lineNm?: string
  /** 查询日期 yyyy-MM-dd（由父级 dialog 的标题栏日期选择器控制） */
  wtTime?: string
  /**
   * 抑制内部站点详情弹窗：由父级 dialog 统一承载（避免弹窗叠加），
   * 行点击改为 emit('row-click')，父级据此滑动切换到详情视图
   */
  suppressDetail?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  lineCd: '',
  lineNm: '',
  wtTime: '',
  suppressDetail: false
})

const emit = defineEmits<{
  (e: 'row-click', payload: { row: Row; groupNm: string }): void
}>()

type Row = Record<string, any>

// 分组表结构由后端按 PORTAL_SYS.ST_DIC_B 字典组装：{groupCd, groupNm, colTpl(FLOW/RSVR), rows}
interface DailyTable {
  groupCd: string
  groupNm: string
  colTpl: string
  rows: Row[]
}

const loading = ref(false)
const tableList = ref<DailyTable[]>([])
// 行点击月度弹窗是否启用，由字典 DS_LINE_MAP.COLUMN_2 配置（接口返回）
// 2026-09-08：行点击改为站点详情弹窗（StationDetailDialog），此标志保留供旧月度弹窗恢复时使用
const clickable = ref(false)

// ==================== 表格列 ====================
function textCol(key: string, title: string) {
  return {
    key,
    title,
    align: 'center' as const,
    render: (row: Row) => (row[key] == null || row[key] === '' ? '-' : row[key])
  }
}

/** 输水时段：库中为一个字段，多段以 [,;，；] 分隔（如「1.1;1.25-2.1;2.26-7.4」） */
function splitTimes(s: any): string[] {
  if (!s) {
    return []
  }
  return String(s)
    .split(/[,;，；]/)
    .filter((t: string) => t.trim() !== '')
}

/** 月累计水量：原为悬停浮层内容，2026-09-17 起直接成列 */
function monthQCol() {
  return {
    key: 'MONTH_Q_COL',
    title: '月累计水量',
    align: 'center' as const,
    render: (row: Row) => {
      const v = row.MONTHQ ?? row.MONTH_Q
      return v == null || v === '' ? '-' : String(v)
    }
  }
}

/** 输水时段：原为悬停浮层内容，2026-09-17 起直接成列。
 *  浮层里是每段一行，但库里最多 6 段（如「1.1;1.25-2.1;2.26-7.4;…」），逐段换行会把行高撑到 170px+、
 *  一屏只看 3 行；故改为以「；」连成一行，超出列宽自然折行（约 2 行），信息不丢且表格可扫读 */
function timesCol() {
  return {
    key: 'WT_TIMES_COL',
    title: '输水时段',
    align: 'center' as const,
    render: (row: Row) => {
      const list = splitTimes(row.WT_TIMES)
      return list.length ? list.join('；') : '-'
    }
  }
}

function flowCols(firstLabel: string) {
  return [
    textCol('STNM', firstLabel),
    textCol('qyzt', '8时流量'),
    textCol('awqyzt', '日均流量'),
    textCol('dayqyzt', '日过水量'),
    monthQCol(),
    timesCol()
  ]
}

function skCols() {
  return [
    textCol('STNM', '水库'),
    textCol('zyzt', '8时水位'),
    textCol('wyzt', '8时蓄量'),
    textCol('dayqyzt', '日过水量'),
    monthQCol(),
    timesCol()
  ]
}

// 按接口分组渲染（列模板：RSVR=水位蓄量列，其余=流量列）
const tables = computed<{ title: string; cols: any[]; rows: Row[] }[]>(() =>
  tableList.value.map((t) => ({
    title: t.groupNm,
    cols: t.colTpl === 'RSVR' ? skCols() : flowCols(t.groupNm),
    rows: t.rows || []
  }))
)

// ==================== 数据加载 ====================
async function loadDaily() {
  if (!props.lineCd || !props.wtTime) {
    tableList.value = []
    clickable.value = false
    return
  }
  loading.value = true
  try {
    const res = await queryDsDaily({
      wtTime: props.wtTime,
      lineCd: props.lineCd
    })
    if (res.code === 0 && res.data) {
      tableList.value = res.data.tableList || []
      clickable.value = !!res.data.clickable
    } else {
      tableList.value = []
      clickable.value = false
    }
  } catch (e) {
    console.warn('queryDsDaily failed', e)
  } finally {
    loading.value = false
  }
}

// 线路或查询日期变化时刷新（查询日期由父级 dialog 标题栏的选择器下发，
// 其「默认取库中最新有数据日期」的初始化逻辑也在父级完成）
watch([() => props.lineCd, () => props.wtTime], () => loadDaily(), { immediate: true })

// ==================== 行点击：站点详情弹窗（设计稿：跃进渠详情信息，当前假数据） ====================
// 省界站（小觉/地都/泉口）暂不弹出详情
const NO_POPUP_STNMS = ['小觉', '地都', '泉口']

const showDetail = ref(false)
const detailRow = ref<Row | null>(null)
// 点击行所在分组（水库/河道分组信息，随行传递用于详情弹窗展示）
const detailGroupNm = ref('')

function canOpenDetail(row: Row) {
  if (!row?.STCD) {
    return false
  }
  const nm = String(row.STNM || '')
  return !NO_POPUP_STNMS.some((s) => nm.includes(s))
}

function rowProps(row: Row, groupNm = '') {
  const openable = canOpenDetail(row)
  return {
    style: openable ? 'cursor: pointer' : '',
    onClick: () => {
      if (!openable) {
        return
      }
      // 由父级 dialog 承载详情时，仅上报点击，由父级滑动切换视图（查询日期父级已持有）
      if (props.suppressDetail) {
        emit('row-click', { row, groupNm })
        return
      }
      detailRow.value = row
      detailGroupNm.value = groupNm
      showDetail.value = true
    }
  }
}

/* ==================== 旧月度水量弹窗（2026-09-08 起停用，按要求保留代码备恢复） ====================
import { nextTick } from 'vue'
import type { Ref } from 'vue'
import { queryMonthRange } from '@/api/waterdisp'
import { useECharts } from '@/hooks/web/useECharts'

const showMonthDlg = ref(false)
const dlgTitle = ref('')
const dlgStcd = ref('')
const yearQ1Now = ref<string | number>('-')
const yearNow = ref('')
const monthRange = ref<[string, string] | null>(null)
const chartTable = ref<{ month: string; value: number | string }[]>([])
const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions, disposeInstance } = useECharts(chartRef as Ref<HTMLDivElement>, 'light')

function onRowClick(row: Row) {
  if (!clickable.value || !row.STCD) return
  dlgTitle.value = row.STNM || row.STCD
  dlgStcd.value = row.STCD
  yearQ1Now.value = row.YEARQ1 == null || row.YEARQ1 === '' ? '-' : row.YEARQ1
  yearNow.value = (row.TM ? String(row.TM) : props.wtTime).substring(0, 4)
  monthRange.value = [`${yearNow.value}-01`, `${yearNow.value}-12`]
  showMonthDlg.value = true
  nextTick(() => loadMonthChart())
}

async function loadMonthChart() {
  if (!dlgStcd.value || !monthRange.value) return
  try {
    const res = await queryMonthRange({
      startMonth: monthRange.value[0],
      endMonth: monthRange.value[1],
      stcd: dlgStcd.value
    })
    if (res.code === 0 && res.data) {
      const months: string[] = res.data.months || []
      const monthData: Row[] = res.data.monthData || []
      const datas: (number | string)[] = []
      chartTable.value = []
      months.forEach((m) => {
        const matched = monthData.find((e) => e.MONTH === m)
        const value = matched ? matched.MONTHQ : 0
        datas.push(value)
        chartTable.value.push({ month: m, value })
      })
      setOptions({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: ['月累计'], top: 6 },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', data: months },
        yAxis: { type: 'value', name: '水量(万m³)' },
        series: [
          {
            name: '月累计',
            type: 'bar',
            data: datas as number[],
            itemStyle: { color: '#fac858' },
            barMaxWidth: 30
          }
        ]
      })
    }
  } catch (e) {
    console.warn('queryMonthRange failed', e)
  }
}

function onMonthRangeChange(val: [string, string] | null) {
  if (val && val.length === 2) {
    monthRange.value = val
    loadMonthChart()
  }
}

function onDlgClose() {
  dlgStcd.value = ''
  chartTable.value = []
  disposeInstance()
}

const monthCols = [textCol('month', '月份'), textCol('value', '水量(万m³)')]
*/
</script>

<template>
  <div class="right-daily">
    <!-- 内容区：本面板已内嵌于 LineDataDialog，按 dialog 样式直接展示，不再套 DivBackIn 外框；
         线路名称与查询日期选择器已上移到 dialog 标题栏（见 LineDataDialog 的 .ldd-bar） -->
    <n-spin :show="loading" class="daily-spin">
      <div class="panel-body">
        <div v-if="!lineCd" class="empty-tip">请选择流域查看日尺度数据</div>

        <div v-else class="tables-scroll">
          <div v-for="t in tables" :key="t.title" class="table-block">
            <!-- flex-height + height:100%：表格取父级（.table-block）的确定高度，表体内部滚动，
                 这样各组表格撑满可用高度、提示行下方不再留空白 -->
            <n-data-table
              :columns="t.cols"
              :data="t.rows"
              :row-key="(row: any) => row.STCD"
              :row-props="(row: any) => rowProps(row, t.title)"
              :bordered="true"
              :single-line="false"
              size="small"
              flex-height
              style="height: 100%"
            />
          </div>
          <div class="daily-note">点击行查看站点详情</div>
        </div>
      </div>
    </n-spin>

    <!-- 站点详情弹窗（设计稿：跃进渠详情信息/东榆林水库详情信息；省界站小觉/地都/泉口不弹）
         suppressDetail=true 时由父级 dialog 承载，此处不渲染 -->
    <StationDetailDialog
      v-if="!suppressDetail"
      v-model:show="showDetail"
      :row="detailRow"
      :wt-time="wtTime"
      :line-cd="props.lineCd"
      :line-nm="props.lineNm"
      :group-nm="detailGroupNm"
    />

    <!--
      旧月度水量弹窗（2026-09-08 起停用，按要求保留代码备恢复；恢复时同时放开 script 中注释块）
      <n-modal
        v-model:show="showMonthDlg"
        preset="card"
        :title="`${dlgTitle} · 月度水量`"
        style="width: 780px"
        @after-leave="onDlgClose"
      >
        <div class="dlg-head">
          <div>
            <span>{{ yearNow }}年日历年累计: </span>
            <span class="dlg-year-num">{{ yearQ1Now }} 万m³</span>
          </div>
          <div class="dlg-range">
            <span>选择月份范围：</span>
            <n-date-picker
              :formatted-value="monthRange"
              type="monthrange"
              size="small"
              value-format="yyyy-MM"
              :clearable="false"
              @update:formatted-value="onMonthRangeChange"
            />
          </div>
        </div>
        <div class="dlg-body">
          <div ref="chartRef" class="dlg-chart"></div>
          <div class="dlg-table">
            <n-data-table
              :columns="monthCols"
              :data="chartTable"
              :bordered="true"
              size="small"
              :max-height="360"
            />
          </div>
        </div>
      </n-modal>
    -->
  </div>
</template>

<style scoped lang="scss">
.right-daily {
  width: 100%;
  height: 100%;
}

/* n-spin 的 class 落在其根 .n-spin-container 上；再打通 .n-spin-content，使 .panel-body 的 100% 生效 */
.daily-spin {
  height: 100%;
}

:deep(.n-spin-content) {
  height: 100%;
}

.panel-body {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.empty-tip {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 13px;
}

/* 各组表格均分可用高度（滚动交给各表格内部），提示行只占自身高度 →
   提示行下方不再出现空白 */
.tables-scroll {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-right: 4px;
}

.table-block {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.daily-note {
  flex: none;
  font-size: 12px;
  color: #999;
  text-align: center;
  padding: 4px 0 8px;
}

/* 旧月度水量弹窗样式（2026-09-08 起停用，保留备恢复）
.dlg-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 13px;
}

.dlg-year-num {
  font-weight: 700;
}

.dlg-range {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dlg-body {
  display: flex;
  height: 380px;
}

.dlg-chart {
  width: 65%;
  height: 100%;
}

.dlg-table {
  width: 35%;
  padding-left: 12px;
  overflow-y: auto;
}
*/
</style>
