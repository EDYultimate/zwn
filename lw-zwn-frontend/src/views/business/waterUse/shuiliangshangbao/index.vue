<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch, type Ref } from 'vue'
import * as echarts from 'echarts'
import { useECharts } from '@/hooks/web/useECharts'
import ProTable from '@/components/common/ProTable'
import type { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid'
import MeterFillModal from './components/MeterFillModal.vue'
import MeterConfirmModal from './components/MeterConfirmModal.vue'
import MeterDeleteModal from './components/MeterDeleteModal.vue'
import PlanCertModal from '../jihuashangbao/components/PlanCertModal.vue'
import type { PlanRowLike } from '../jihuashangbao/components/PlanFormModal.vue'
import {
  ALARM_TEXT,
  MONTH_OPTIONS,
  ORG_OPTIONS,
  REPORT_MONTH,
  REPORT_STATUS_TEXT,
  SRC_OPTIONS,
  YEAR_OPTIONS,
  batchSubmit,
  fmt,
  removeManual,
  rowsOf,
  saveManual,
  submitRow,
  type MeterRow
} from './meterShared'

/**
 * 水量复核 · 水量上报（浅色整页视图）
 * 复刻自静态原型 #pwMeterView，数据为本地 mock（meterShared 共享状态），
 * 行结构与列头源自原型 renderPwMeter / pwRepRows。
 */

/* ---------------- 筛选条件（原型 pwMF） ---------------- */
const year = ref(YEAR_OPTIONS[0])
const month = ref(REPORT_MONTH)
const org = ref('全部')
const owner = ref('')
const alarm = ref('全部')

/** 当月全部复核行（不受筛选影响，导出用） */
const monthRows = computed<MeterRow[]>(() => rowsOf(month.value))

/** 按筛选条件过滤后的行 */
const filteredRows = computed<MeterRow[]>(() => {
  const kw = owner.value.trim()
  return monthRows.value.filter(
    (r) =>
      (org.value === '全部' || r.org === org.value) &&
      (!kw || r.owner.includes(kw)) &&
      (alarm.value === '全部' || ALARM_TEXT[r.al] === alarm.value)
  )
})

/* ---------------- 统计（顶部卡片 / 底部统计行） ---------------- */
// 在线计量水量合计（保留 1 位小数）
const volSum = computed(
  () => Math.round(filteredRows.value.reduce((a, r) => a + r.vol, 0) * 10) / 10
)
// 人工填报水量合计（保留 1 位小数）
const manSum = computed(
  () => Math.round(filteredRows.value.reduce((a, r) => a + (r.man ?? 0), 0) * 10) / 10
)
// 超警 / 已达计划90% 取水口个数
const overCount = computed(() => filteredRows.value.filter((r) => r.al === 2).length)
const warn90Count = computed(() => filteredRows.value.filter((r) => r.al === 1).length)
// 年累计水量 / 年许可水量合计（用于计划执行率）
const accSum = computed(() => Math.round(filteredRows.value.reduce((a, r) => a + r.acc, 0)))
const amtSum = computed(() => filteredRows.value.reduce((a, r) => a + r.amt, 0))
// 计划执行率 = 年累计 / 年许可（百分数保留 1 位小数）
const execRate = computed(() =>
  amtSum.value ? Math.round((accSum.value / amtSum.value) * 1000) / 10 : 0
)

// 「在线计量水量合计」卡片小柱图：按监管单位汇总取前 5（与原型 buildBars 一致）
const orgBars = computed(() => {
  const agg: Record<string, number> = {}
  filteredRows.value.forEach((r) => {
    agg[r.org] = Math.round(((agg[r.org] || 0) + r.vol) * 10) / 10
  })
  return Object.entries(agg)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, val]) => ({ name, val }))
})

/* ---------------- 小柱图（ECharts，样式对齐证照管理统计卡） ---------------- */

const barsChartRef = ref<HTMLDivElement | null>(null)
const { setOptions: setBarsOptions } = useECharts(barsChartRef as Ref<HTMLDivElement>, 'light')

function renderBars() {
  const data = orgBars.value
  setBarsOptions({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'none' },
      formatter: (params: any) => `${params[0].name}：${fmt(params[0].value)} 万m³`
    },
    grid: { left: 2, right: 2, top: 8, bottom: 4, containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        interval: 0,
        fontSize: 10,
        lineHeight: 11,
        color: '#5a7ba6',
        // 竖排文字：每个字符单独一行
        formatter: (v: string) => v.split('').join('\n')
      }
    },
    yAxis: { type: 'value', show: false },
    series: [
      {
        type: 'bar',
        data: data.map((d) => d.val),
        barWidth: 9,
        itemStyle: {
          borderRadius: [2, 2, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#6cb5f5' },
            { offset: 1, color: '#2f80d8' }
          ])
        }
      }
    ]
  })
}

watch(orgBars, () => nextTick(renderBars))
onMounted(renderBars)

/* ---------------- 轻提示（复刻原型 toast，2.2s 自动消失） ---------------- */
const toastMsg = ref('')
let toastTimer: number | undefined
function toast(msg: string) {
  toastMsg.value = msg
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toastMsg.value = ''), 2200)
}

/* ---------------- 弹框引用 ---------------- */
const fillRef = ref<InstanceType<typeof MeterFillModal>>()
const confirmRef = ref<InstanceType<typeof MeterConfirmModal>>()
const deleteRef = ref<InstanceType<typeof MeterDeleteModal>>()
const certRef = ref<InstanceType<typeof PlanCertModal>>()

/** 编辑：打开月度水量确认单填报 */
function openFill(r: MeterRow) {
  fillRef.value?.show(r)
}

/** 保存填报：写入当月人工填报数据 */
function onFillConfirm(payload: {
  id: string
  month: string
  vol: number
  eco: number
  emg: number
  trade: number
  src: string
}) {
  const row = monthRows.value.find((r) => r.id === payload.id)
  saveManual(payload.id, payload.month, payload)
  toast(
    `已更新：${row?.outlet ?? payload.id} ${payload.month} 水量确认单填报（许可取水量 ${fmt(
      payload.vol
    )} 万m³，${payload.src}）`
  )
}

/** 单条上报 / 重新上报 */
function submitOne(r: MeterRow) {
  const resub = r.st === 3
  submitRow(r.id, month.value)
  toast(
    resub
      ? `${r.outlet} ${month.value} 已修改并重新上报，回到待审核`
      : `${r.outlet} ${month.value} 人工填报数据已上报，进入水量审核`
  )
}

/** 一键上报：本月未上报 / 审核不通过的记录全部上报 */
function submitAll() {
  const { n, done } = batchSubmit(month.value)
  toast(
    n
      ? `一键上报完成：本月新上报 ${n} 条（此前已上报 ${done} 条），已进入水量审核`
      : `本月数据均已上报（共 ${done} 条），无需重复上报`
  )
}

/** 生成月度水量确认单 */
function openConfirm(r: MeterRow) {
  confirmRef.value?.show(r.id, month.value)
}

/** 删除当月人工填报数据 */
function openDelete(r: MeterRow) {
  deleteRef.value?.show(r)
}

function onDeleteConfirm(r: MeterRow) {
  removeManual(r.id, month.value)
  toast(`已删除 ${r.outlet} ${month.value} 的人工填报数据`)
}

/** 取水权人 → 取水许可证详情（复用计划上报的许可证弹框） */
function openCert(r: MeterRow) {
  const p: PlanRowLike = {
    id: r.id,
    year: year.value,
    cert: r.cert,
    outlet: r.outlet,
    owner: r.owner,
    org: r.org,
    proj: r.proj,
    area: r.area,
    amt: r.amt,
    months: Array.from({ length: 12 }, () => r.plan),
    st: 1,
    reason: ''
  }
  certRef.value?.show(p)
}

/* ---------------- 导出 / 模版 / 导入（复刻原型 pwMExport / pwMTpl / pwImportFile） ---------------- */

/** 下载 CSV（BOM + 引号转义） */
function downloadCsv(filename: string, head: string[], rows: (string | number)[][]) {
  const csv =
    '\uFEFF' +
    [head, ...rows]
      .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\r\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

/** 导出当月复核数据表 */
function exportCsv() {
  const head = [
    '序号',
    '监管单位',
    '取水权人',
    '取水项目',
    '行政区',
    '许可水量',
    '时间',
    '月批复计划',
    '在线水量',
    '填报水量',
    '填报来源',
    '年累计水量',
    '超警情况',
    '状态'
  ]
  downloadCsv(
    `${month.value}水量复核月度上报数据表.csv`,
    head,
    monthRows.value.map((r, i) => [
      i + 1,
      r.org,
      r.owner,
      r.proj,
      r.area,
      fmt(r.amt),
      r.time,
      fmt(r.plan),
      fmt(r.vol),
      r.man === null ? '' : fmt(r.man),
      r.src,
      fmt(r.acc),
      ALARM_TEXT[r.al],
      REPORT_STATUS_TEXT[r.st]
    ])
  )
  toast(`已导出 ${monthRows.value.length} 条上报数据`)
}

/** 下载人工填报导入模版 */
function downloadTemplate() {
  const head = [
    '监管单位',
    '取水权人',
    '取水项目',
    '取水口',
    '数据来源方式',
    '填报水量(万m³)',
    '生态补水量(万m³)',
    '应急取水量(万m³)',
    '水权交易量(万m³)',
    '填报人'
  ]
  downloadCsv(
    '月度取水量人工填报导入模版.csv',
    head,
    monthRows.value.map((r) => [r.org, r.owner, r.proj, r.outlet, r.src, '', '', '', '', ''])
  )
  toast('模版已下载：按取水口填写来源方式、许可取水量及生态补水/应急取水/水权交易量后导入')
}

const importFileRef = ref<HTMLInputElement | null>(null)

function triggerImport() {
  importFileRef.value?.click()
}

/** CSV 单行解析（支持双引号包裹与转义） */
function parseCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (quoted) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          quoted = false
        }
      } else {
        cur += c
      }
    } else if (c === '"') {
      quoted = true
    } else if (c === ',') {
      out.push(cur)
      cur = ''
    } else {
      cur += c
    }
  }
  out.push(cur)
  return out
}

/** 导入文本：按「取水口」列匹配取水口，写入当月人工填报 */
function importText(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l)
  const hi = lines.findIndex((l) => l.includes('取水口'))
  if (hi < 0) {
    toast('导入失败：未找到表头行（需包含「取水口」列）')
    return
  }
  const cols = parseCsvLine(lines[hi])
  const ci = (n: string) => cols.findIndex((c) => c.includes(n))
  const cOut = ci('取水口')
  const cSrc = ci('来源')
  const cBy = ci('填报人')
  let cVol = ci('填报水量')
  if (cVol < 0) {
    cVol = ci('水量')
  }
  const cEco = ci('生态补水')
  const cEmg = ci('应急取水')
  const cTrd = ci('水权交易')
  if (cOut < 0 || cVol < 0) {
    toast('导入失败：缺少「取水口」或「水量」列')
    return
  }

  const num = (cells: string[], idx: number) => {
    const v = idx >= 0 ? parseFloat(cells[idx]) : NaN
    return Number.isFinite(v) && v >= 0 ? v : 0
  }
  const pickSrc = (v?: string) =>
    SRC_OPTIONS.some((s) => s === v) ? (v as string) : SRC_OPTIONS[0]

  let ok = 0
  let fail = 0
  const outs = new Set<string>()
  lines.slice(hi + 1).forEach((line) => {
    const cells = parseCsvLine(line)
    const outletName = (cells[cOut] ?? '').trim()
    const row = monthRows.value.find((r) => r.outlet === outletName)
    const v = parseFloat(cells[cVol])
    if (!row || !Number.isFinite(v) || v < 0) {
      fail++
      return
    }
    saveManual(row.id, month.value, {
      vol: Math.round(v * 100) / 100,
      eco: num(cells, cEco),
      emg: num(cells, cEmg),
      trade: num(cells, cTrd),
      src: pickSrc(cSrc >= 0 ? cells[cSrc] : undefined)
    })
    outs.add(row.id)
    ok++
  })
  toast(`导入完成：成功 ${ok} 条（取水口 ${outs.size} 个），未匹配/无效 ${fail} 条`)
}

/** 选择文件后读取（UTF-8 优先，乱码回退 GBK） */
function onImportFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) {
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    const buf = reader.result as ArrayBuffer
    let text = ''
    try {
      text = new TextDecoder('utf-8').decode(buf)
    } catch {
      text = ''
    }
    if (!text || (text.match(/\uFFFD/g) ?? []).length > text.length * 0.02) {
      try {
        text = new TextDecoder('gbk').decode(buf)
      } catch {
        /* 保持 UTF-8 结果 */
      }
    }
    importText(text)
  }
  reader.readAsArrayBuffer(file)
  toast(`正在解析 ${file.name} …`)
}

/* ---------------- 表格列（字段、顺序与原型一致） ---------------- */
const columns: VxeGridPropTypes.Columns = [
  { type: 'seq', title: '序号', width: 60, align: 'left' },
  { field: 'org', title: '监管单位', minWidth: 100, align: 'left' },
  {
    field: 'owner',
    title: '取水权人',
    minWidth: 190,
    align: 'left',
    showOverflow: 'tooltip',
    slots: { default: 'owner' }
  },
  {
    field: 'proj',
    title: '取水项目',
    minWidth: 190,
    align: 'left',
    showOverflow: 'tooltip'
  },
  { field: 'area', title: '行政区', minWidth: 150, align: 'center' },
  {
    field: 'amt',
    title: '许可水量',
    minWidth: 100,
    align: 'center',
    formatter: ({ cellValue }: any) => fmt(Number(cellValue))
  },
  { field: 'time', title: '时间', minWidth: 105, align: 'center' },
  {
    field: 'plan',
    title: '月批复计划',
    minWidth: 110,
    align: 'center',
    formatter: ({ cellValue }: any) => fmt(Number(cellValue))
  },
  {
    field: 'vol',
    title: '在线水量',
    minWidth: 110,
    align: 'center',
    formatter: ({ cellValue }: any) => fmt(Number(cellValue))
  },
  {
    field: 'man',
    title: '填报水量',
    minWidth: 110,
    align: 'center',
    slots: { default: 'man' }
  },
  {
    field: 'src',
    title: '填报来源',
    minWidth: 100,
    align: 'center',
    slots: { default: 'src' }
  },
  { field: 'acc', title: '年累计水量', minWidth: 110, align: 'center', slots: { default: 'acc' } },
  { field: 'st', title: '状态', width: 130, align: 'center', slots: { default: 'st' } },
  {
    field: 'op',
    title: '操作',
    width: 250,
    align: 'center',
    fixed: 'right',
    slots: { default: 'op' }
  }
]
</script>

<template>
  <!-- 水量复核 · 水量上报（浅色整页视图） -->
  <div class="pw-meter-view">
    <!-- 顶部统计卡片 -->
    <!--    <div class="stats-row">-->
    <!--      <div class="stat-card">-->
    <!--        <div class="stat-head">-->
    <!--          <div class="stat-num">{{ filteredRows.length }}<small> 条</small></div>-->
    <!--          <div class="stat-tag">本月上报记录</div>-->
    <!--        </div>-->
    <!--        <div class="stat-side">-->
    <!--          上报月份：<b>{{ month }}</b-->
    <!--          ><br />-->
    <!--          覆盖取水口 <b>{{ filteredRows.length }}</b> 个-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="stat-card">-->
    <!--        <div class="stat-head">-->
    <!--          <div class="stat-num">{{ fmt(volSum) }}<small> 万m³</small></div>-->
    <!--          <div class="stat-tag">在线计量合计</div>-->
    <!--        </div>-->
    <!--        <div class="stat-side bars-side">-->
    <!--          <div ref="barsChartRef" class="bar-chart"></div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="stat-card">-->
    <!--        <div class="stat-head">-->
    <!--          <div class="stat-num danger-num">{{ overCount }}<small> 个</small></div>-->
    <!--          <div class="stat-tag">超警取水口</div>-->
    <!--        </div>-->
    <!--        <div class="stat-side">-->
    <!--          超警 <b class="danger">{{ overCount }}</b> 个<br />-->
    <!--          已达计划90% <b class="warn">{{ warn90Count }}</b> 个-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="stat-card">-->
    <!--        <div class="stat-head">-->
    <!--          <div class="stat-num">{{ execRate }}<small> %</small></div>-->
    <!--          <div class="stat-tag">计划执行率</div>-->
    <!--        </div>-->
    <!--        <div class="stat-side">-->
    <!--          年累计 <b>{{ fmt(accSum) }}</b> 万m³<br />-->
    <!--          年许可 <b class="plain">{{ fmt(amtSum) }}</b> 万m³-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->

    <!-- 月度数据上报 -->
    <div class="meter-card">
      <!-- 页头：标题 + 操作按钮组 -->
      <div class="card-head">
        <h4 class="card-title"><span class="caret">▶</span>月度数据上报</h4>
        <div class="head-btns">
          <button type="button" class="pbtn ghost" @click="downloadTemplate">下载模版</button>
          <button type="button" class="pbtn ghost" @click="triggerImport">导入数据</button>
          <button type="button" class="pbtn" @click="submitAll">一键上报</button>
          <button type="button" class="pbtn ghost" @click="exportCsv">导出</button>
          <input
            ref="importFileRef"
            accept=".csv"
            style="display: none"
            type="file"
            @change="onImportFile"
          />
        </div>
      </div>

      <!-- 筛选行：年度 / 月份 / 监管单位 / 取水权人 / 超警情况 -->
      <div class="filter-row">
        <label class="filter-item">
          年度
          <select v-model="year" class="w-year">
            <option v-for="y in YEAR_OPTIONS" :key="y" :value="y">{{ y }}</option>
          </select>
        </label>
        <label class="filter-item">
          月份
          <select v-model="month" class="w-month">
            <option v-for="m in MONTH_OPTIONS" :key="m" :value="m">{{ m }}</option>
          </select>
        </label>
        <label class="filter-item">
          监管单位
          <select v-model="org" class="w-org">
            <option v-for="o in ORG_OPTIONS" :key="o" :value="o">{{ o }}</option>
          </select>
        </label>
        <label class="filter-item">
          取水权人
          <input v-model="owner" type="text" placeholder="取水权人名称模糊搜索" />
        </label>
        <label class="filter-item">
          超警情况
          <select v-model="alarm" class="w-al">
            <option>全部</option>
            <option v-for="a in ALARM_TEXT" :key="a" :value="a">{{ a }}</option>
          </select>
        </label>
      </div>

      <!-- 上报数据表格 -->
      <div class="pt-table-wrap">
        <pro-table
          :columns="columns"
          :data="filteredRows"
          :is-pagination="false"
          height="100%"
          empty-text="该月份暂无上报数据（局属单位于每月月初填报上月计量数据）"
        >
          <template #owner="{ row }">
            <span class="own clk" title="点击查看取水许可证详情" @click="openCert(row)">{{
              row.owner
            }}</span>
          </template>
          <template #man="{ row }">
            <span v-if="row.man === null" class="empty-txt">未填报</span>
            <span v-else>{{ fmt(row.man) }}</span>
          </template>
          <template #src="{ row }">
            <span class="srctag">{{ row.src }}</span>
          </template>
          <template #acc="{ row }">
            <span class="sum-cell">{{ fmt(row.acc) }}</span>
          </template>
          <template #st="{ row }">
            <span class="stb" :class="'s' + row.st">{{ REPORT_STATUS_TEXT[row.st] }}</span>
          </template>
          <template #op="{ row }">
            <button type="button" class="act" @click="openFill(row)">编辑</button>
            <button
              v-if="row.st === 0 || row.st === 3"
              type="button"
              class="act"
              :title="row.st === 3 ? '审核不通过，修改后可重新上报' : '上报人工填报数据'"
              @click="submitOne(row)"
            >
              {{ row.st === 3 ? '重新上报' : '上报' }}
            </button>
            <button v-if="row.st === 2" type="button" class="act" @click="openConfirm(row)">
              生成确认单
            </button>
            <button type="button" class="act danger" @click="openDelete(row)">删除</button>
            <span v-if="row.st === 3" class="reason-tip" :title="row.reason">退回意见</span>
          </template>
        </pro-table>
      </div>

      <!-- 底部统计 -->
      <div class="card-foot">
        统计：上报记录 <b>{{ filteredRows.length }}</b> 条 ；在线计量 <b>{{ fmt(volSum) }}</b> 万m³
        ；人工填报 <b>{{ fmt(manSum) }}</b> 万m³ ；超警 <b class="danger">{{ overCount }}</b> 个
        ；已达计划90% <b class="warn">{{ warn90Count }}</b> 个
      </div>
    </div>

    <!-- 月度水量确认单填报 / 确认单 / 删除确认 / 取水许可证详情 -->
    <meter-fill-modal ref="fillRef" @confirm="onFillConfirm" />
    <meter-confirm-modal ref="confirmRef" />
    <meter-delete-modal ref="deleteRef" @confirm="onDeleteConfirm" />
    <plan-cert-modal ref="certRef" />

    <!-- 轻提示（复刻原型 toast） -->
    <div v-if="toastMsg" class="pw-toast">{{ toastMsg }}</div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/style/water-filter.scss' as wf;
/* ===== 页面根容器：占满内容区的浅色视图 ===== */
.pw-meter-view {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 100%;
  min-height: 0;
  padding: 10px 14px;
  overflow: hidden;
}

/* ===== 顶部统计卡片（样式对齐证照管理数据面板） ===== */
.stats-row {
  display: flex;
  flex: none;
  gap: 14px;
}
.stat-card {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 16px;
  padding: 10px 18px;
  background: #fff;
  border: 1px solid #d5e4f5;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(30, 90, 170, 0.08);
}
.stat-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  min-width: 128px;
}
.stat-num {
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
  color: #1f7ae0;
  white-space: nowrap;

  small {
    font-size: 15px;
    font-weight: 500;
    color: #2d2d2d;
  }
  &.danger-num {
    color: #f5222d;
  }
}
.stat-tag {
  padding: 3px 14px;
  font-size: 13px;
  color: #1f7ae0;
  text-align: center;
  white-space: nowrap;
  background: #e8f1fd;
  border: 1px solid #bcd7f7;
  border-radius: 3px;
}
.stat-side {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  line-height: 1.8;
  color: #5a7ba6;
  text-align: right;

  b {
    color: #1f7ae0;
  }
  .plain {
    color: #5a7ba6;
  }
  .danger {
    color: #f5222d;
  }
  .warn {
    color: #d48806;
  }
}

/* 卡片内小柱图（ECharts，按监管单位汇总） */
.bars-side {
  display: flex;
  justify-content: flex-end;
}
.bar-chart {
  flex: 1;
  min-width: 0;
  height: 96px;
}

/* ===== 上报数据卡片 ===== */
.meter-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 10px 14px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(31, 74, 132, 0.08);
}

/* 表格容器：占满卡片剩余高度，表体在容器内滚动 */
.pt-table-wrap {
  flex: 1;
  min-height: 0;
}

/* 页头 */
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #24405e;
  display: flex;
  align-items: center;

  .caret {
    margin-right: 8px;
    font-size: 10px;
    color: #1890ff;
    vertical-align: 1px;
  }
}
.head-btns {
  display: flex;
  gap: 10px;
}
.pbtn {
  height: 32px;
  padding: 0 18px;
  font-size: 13px;
  color: #fff;
  cursor: pointer;
  background: #1890ff;
  border: 1px solid #1890ff;
  border-radius: 6px;

  &.ghost {
    color: #1890ff;
    background: #fff;
  }
  &:hover {
    opacity: 0.88;
  }
}

/* 筛选行 */
.filter-row {
  @include wf.row;

  margin-bottom: 14px;
}
.filter-item {
  @include wf.field;

  input[type='text'] {
    width: 170px;
  }
  .w-year {
    width: 82px;
  }
  .w-month {
    width: 108px;
  }
  .w-org {
    width: 110px;
  }
  .w-al {
    width: 132px;
  }
}

/* 取水权人可点击查看许可证详情（复刻原型 .pwclk） */
.own.clk {
  color: #1890ff;
  cursor: pointer;

  &:hover {
    color: #1f7ae0;
    text-decoration: underline;
  }
}
.sum-cell {
  font-weight: 700;
  color: #1f7ae0;
}
.empty-txt {
  color: #b6c6dc;
}

/* 填报来源标签 */
.srctag {
  display: inline-block;
  padding: 1px 8px;
  font-size: 12px;
  color: #08979c;
  background: #e6fffb;
  border: 1px solid #87e8de;
  border-radius: 999px;
}

/* 状态：彩色小标签（0 待上报 / 1 已上报待审核 / 2 审核通过 / 3 审核不通过） */
.stb {
  display: inline-block;
  padding: 2px 10px;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
  border-radius: 999px;

  &.s0 {
    color: #7b8fa8;
    background: #f4f7fb;
    border: 1px solid #d6e2f0;
  }
  &.s1 {
    color: #1890ff;
    background: #e6f4ff;
    border: 1px solid #91caff;
  }
  &.s2 {
    color: #389e0d;
    background: #f6ffed;
    border: 1px solid #b7eb8f;
  }
  &.s3 {
    color: #cf1322;
    background: #fff1f0;
    border: 1px solid #ffa39e;
  }
}

/* 操作列 */
.act {
  padding: 3px 10px;
  margin-right: 6px;
  font-size: 12px;
  color: #1890ff;
  cursor: pointer;
  background: #fff;
  border: 1px solid #91caff;
  border-radius: 4px;

  &.danger {
    color: #cf1322;
    border-color: #ffa39e;
  }
  &:hover {
    opacity: 0.85;
  }
}
/* 退回意见（悬停查看，替代原表格内附行） */
.reason-tip {
  font-size: 12px;
  color: #cf1322;
  text-decoration: underline;
  cursor: help;
}

/* 底部统计 */
.card-foot {
  margin-top: 12px;
  font-size: 13px;
  color: #5a7ba6;

  b {
    color: #1f7ae0;
  }
  .danger {
    color: #f5222d;
  }
  .warn {
    color: #d48806;
  }
}

/* 轻提示（复刻原型 .toast） */
.pw-toast {
  position: fixed;
  top: 26px;
  left: 50%;
  z-index: 3000;
  padding: 8px 24px;
  font-size: 13px;
  color: #fff;
  white-space: nowrap;
  pointer-events: none;
  background: rgba(20, 80, 180, 0.94);
  border: 1px solid rgba(120, 200, 255, 0.55);
  border-radius: 18px;
  box-shadow: 0 0 20px rgba(60, 150, 255, 0.55);
  transform: translateX(-50%);
}
</style>
