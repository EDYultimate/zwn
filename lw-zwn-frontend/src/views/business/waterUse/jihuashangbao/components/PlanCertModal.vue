<script setup lang="ts">
// ============================================================
// 许可证编号点击 · 取水许可证详情弹框
// 页签一「取水许可证信息」：证照字段两列展示
// 页签二「水量分析」：统计卡 + 月/年切换 + 柱线图 + 数据表
// 复刻原型 openPwCert，样式沿用浅色弹框体系
// ============================================================
import { computed, nextTick, ref, watch, type Ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import ProTabs from '@/components/common/ProTabs/ProTabs.vue'
import ProTable from '@/components/common/ProTable'
import type { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid'
import { useECharts } from '@/hooks/web/useECharts'
import type { PlanRowLike } from './PlanFormModal.vue'

const visible = ref(false)
const row = ref<PlanRowLike | null>(null)
const tab = ref<'lic' | 'water'>('lic')
const gran = ref<'month' | 'year'>('month')
const year = ref('2026')

const certTabs = [
  { key: 'lic', label: '取水许可证信息' },
  { key: 'water', label: '水量分析' }
] as const

function show(r: PlanRowLike) {
  row.value = r
  tab.value = 'lic'
  gran.value = 'month'
  year.value = r.year
  visible.value = true
}

function fmt(x: number | null | undefined): string {
  return x === null || x === undefined ? '—' : Number(x).toLocaleString()
}

/* ---------------- 页签一：许可证信息 ---------------- */

const seedS = computed(() => {
  const cert = row.value?.cert || ''
  return [...cert].reduce((s, ch) => s + ch.charCodeAt(0), 0)
})

const issueYear = computed(() => {
  const m = (row.value?.cert || '').match(/S(\d{4})/)
  return m ? +m[1] - 6 : +(row.value?.year || 2026) - 6
})

const useWord = computed(() => {
  const proj = row.value?.proj || ''
  if (/发电/.test(proj)) {
    return '水力发电'
  }
  if (/生活/.test(proj)) {
    return '生活用水'
  }
  if (/供水/.test(proj)) {
    return '城市供水'
  }
  if (/工业/.test(proj)) {
    return '工业用水'
  }
  return '农业灌溉'
})

const srcWord = computed(() => (/地下/.test(row.value?.proj || '') ? '地下水' : '地表水'))

const areaRest = computed(() => {
  const parts = (row.value?.area || '').split(' ').filter(Boolean)
  return parts.slice(1).join('') || row.value?.area || '—'
})

const certKv = computed(() => {
  const r = row.value
  if (!r) {
    return [] as { k: string; v: string }[]
  }
  const y = issueYear.value
  const d = (v: string) => `${v}-07-29 00:00:00`
  const kv: [string, string][] = [
    ['许可证编号', r.cert],
    ['发证日期', d(String(y))],
    ['取水项目名称', r.proj],
    ['有效期', `${d(String(y))} 至 ${d(String(y + 10))}`],
    ['取水权人名称', r.owner],
    ['统一社会信用代码', `1210000000013${3000 + (seedS.value % 900)}R`],
    ['所在行政区', areaRest.value],
    ['取水地址', (r.area || '').replace(/ /g, '') + r.outlet],
    ['取水类型', '基础设施或公用事业'],
    ['年许可水量（万m3）', String(r.amt)],
    ['水源类型', srcWord.value],
    ['取水用途', useWord.value],
    ['发证机关', '水利部海河水利委员会'],
    ['办理机关', '水利部海河水利委员会'],
    ['首次发证日期', d(String(y + 2))],
    ['原证件编号', ''],
    ['原证件发证日期', ''],
    ['备注', '']
  ]
  return kv.map(([k, v]) => ({ k, v }))
})

/* ---------------- 页签二：水量分析 ---------------- */

function seed(i: number, j: number): number {
  const x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
  return x - Math.floor(x)
}

const series = computed(() => {
  const r = row.value
  const plan = r ? r.months.slice() : Array(12).fill(0)
  const planPrev = plan.map((v) => Math.round(v * 0.97 * 10) / 10)
  const rep = plan.map((v, i) => Math.round(v * 0.85 * (0.98 + 0.04 * seed(1, i)) * 10) / 10)
  const onl = rep.map((v) => Math.round(v * 1.04 * 10) / 10)
  const sum = (a: number[]) => Math.round(a.reduce((x, y) => x + y, 0) * 10) / 10
  return {
    plan,
    planPrev,
    rep,
    onl,
    planSum: sum(plan),
    prevSum: sum(planPrev),
    repSum: sum(rep),
    onlSum: sum(onl)
  }
})

const stats = computed(() => [
  { k: '许可水量', n: fmt(row.value?.amt) },
  { k: '计划水量', n: fmt(series.value.planSum) },
  { k: '上年计划水量', n: fmt(series.value.prevSum) },
  { k: '在线水量', n: fmt(series.value.onlSum) },
  { k: '上报水量', n: fmt(series.value.repSum) }
])

const monthLabels = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月'
]

const tableData = computed(() => {
  if (gran.value === 'month') {
    return {
      head: ['月份', `${year.value}年计划`, `${+year.value - 1}年计划`, '在线水量', '上报水量'],
      rows: monthLabels.map((lb, i) => [
        lb,
        fmt(series.value.plan[i]),
        fmt(series.value.planPrev[i]),
        fmt(series.value.onl[i]),
        fmt(series.value.rep[i])
      ])
    }
  }
  const ys = [String(+year.value - 2), String(+year.value - 1), year.value]
  return {
    head: ['年份', '许可水量', '计划水量', '在线水量', '上报水量'],
    rows: ys.map((y, i) => {
      const k = 1 - i * 0.035
      return [
        y,
        fmt(row.value?.amt),
        fmt(Math.round(series.value.planSum * k * 10) / 10),
        fmt(Math.round(series.value.onlSum * k * 10) / 10),
        fmt(Math.round(series.value.repSum * k * 10) / 10)
      ]
    })
  }
})

/* ---------------- 数据表（ProTable） ---------------- */

// 数据表行：将字符串数组转为具名字段，便于 ProTable 列渲染
const pwcRows = computed(() =>
  tableData.value.rows.map((r, i) => ({
    id: i,
    c0: r[0],
    c1: r[1],
    c2: r[2],
    c3: r[3],
    c4: r[4]
  }))
)

// 数据表列：表头随「月 / 年」切换而变化
const pwcColumns = computed<VxeGridPropTypes.Columns>(() =>
  tableData.value.head.map((h, i) => ({
    field: `c${i}`,
    title: h,
    minWidth: 80,
    align: 'center' as const
  }))
)

/* ---------------- 图表 ---------------- */

const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>, 'light')

function drawChart() {
  if (tab.value !== 'water') {
    return
  }
  const s = series.value
  const isMonth = gran.value === 'month'
  const labels = isMonth ? monthLabels : tableData.value.rows.map((r) => r[0])
  const agg = (idx: number) =>
    tableData.value.rows.map((r) => Number(String(r[idx]).replace(/,/g, '')) || 0)
  const planArr = isMonth ? s.plan : agg(2)
  const prevArr = isMonth ? s.planPrev : agg(2).map((v) => Math.round(v * 0.98 * 10) / 10)
  const onlArr = isMonth ? s.onl : agg(3)
  const repArr = isMonth ? s.rep : agg(4)
  setOptions({
    backgroundColor: 'transparent',
    grid: { left: 56, right: 16, top: 36, bottom: 26 },
    legend: {
      top: 2,
      textStyle: { color: '#5a7ba6', fontSize: 12 },
      data: [`${year.value}年计划`, `${+year.value - 1}年计划`, '在线水量', '上报水量']
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: '#c9dcf2' } },
      axisLabel: { color: '#6b87a8' }
    },
    yAxis: {
      type: 'value',
      name: '万m3',
      nameTextStyle: { color: '#6b87a8' },
      axisLabel: { color: '#6b87a8' },
      splitLine: { lineStyle: { color: '#eaf1f9' } }
    },
    series: [
      {
        name: `${year.value}年计划`,
        type: 'bar',
        data: planArr,
        barWidth: 9,
        itemStyle: { color: '#2fa8dc' }
      },
      {
        name: `${+year.value - 1}年计划`,
        type: 'bar',
        data: prevArr,
        barWidth: 9,
        itemStyle: { color: '#1f6fd6' }
      },
      {
        name: '在线水量',
        type: 'line',
        data: onlArr,
        symbolSize: 7,
        itemStyle: { color: '#c04ad0' },
        lineStyle: { width: 2 }
      },
      {
        name: '上报水量',
        type: 'line',
        data: repArr,
        symbolSize: 7,
        itemStyle: { color: '#f0912e' },
        lineStyle: { width: 2 }
      }
    ]
  })
}

watch([tab, gran, year, visible], () => {
  if (tab.value === 'water' && visible.value) {
    nextTick(() => drawChart())
  }
})

defineExpose({ show })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    :title="`${row?.outlet || ''} 详情`"
    table-theme="light"
    content-mode="scroll"
    default-padding="12px 24px 10px"
    :style-params="{ width: '1160px', height: '700px' }"
  >
    <!-- 页签 -->
    <pro-tabs v-model="tab" :items="certTabs" class="pwc-tabs" />

    <!-- 页签一 -->
    <div v-if="tab === 'lic'" class="pwckv">
      <template v-for="item in certKv" :key="item.k">
        <span class="k">{{ item.k }}</span>
        <span class="v" :class="{ empty: !item.v }">{{ item.v || '—' }}</span>
      </template>
    </div>

    <!-- 页签二 -->
    <template v-else>
      <div class="pwcbar">
        <div class="pwcseg">
          <span :class="{ on: gran === 'month' }" @click="gran = 'month'">月</span>
          <span :class="{ on: gran === 'year' }" @click="gran = 'year'">年</span>
        </div>
        <select v-model="year" class="pwcyear">
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
      </div>

      <div class="pwcstats">
        <div v-for="s in stats" :key="s.k" class="pwcst">
          <div class="k">{{ s.k }}</div>
          <div class="n">{{ s.n }}</div>
        </div>
      </div>

      <div class="pwcsplit">
        <div ref="chartRef" class="pwcchart"></div>
        <div class="pwctbl pt-table-wrap">
          <pro-table :columns="pwcColumns" :data="pwcRows" :is-pagination="false" height="" />
        </div>
      </div>
    </template>
  </pro-modal>
</template>

<style scoped lang="scss">
@use '@/assets/style/lic-modal-common.scss' as lic;

/* 页签（组件 ProTabs），仅控制与下方内容的间距 */
.pwc-tabs {
  margin-bottom: 12px;
}

/* 许可证信息：四列字段栅格（标签 | 值）× 2，样式取自公共 lic(detail-kv) */
.pwckv {
  @include lic.detail-kv;

  padding-bottom: 6px;
}

/* 工具条 */
.pwcbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.pwcseg {
  display: inline-flex;
  overflow: hidden;
  border: 1px solid #c2d7ef;
  border-radius: 3px;

  span {
    padding: 4px 16px;
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

.pwcyear {
  @include lic.input;

  width: 96px;
}

/* 统计卡 */
.pwcstats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.pwcst {
  padding: 10px 14px;
  background: #f9fbfe;
  border: 1px solid #e3ecf7;
  border-radius: 6px;

  .k {
    font-size: lic.$font-xs;
    color: lic.$c-secondary;
  }

  .n {
    margin-top: 2px;
    font-size: 20px;
    font-weight: 800;
    color: lic.$c-blue-deep;
  }
}

/* 图表 + 数据表 */
.pwcsplit {
  display: flex;
  gap: 14px;
  align-items: stretch;
}

.pwcchart {
  /* 图表 : 数据表 = 1 : 1.4，为 16px 标准表头留足列宽，避免换行与裁切 */
  flex: 1;
  min-width: 0;
  height: 320px;
  background: #fff;
  border: 1px solid #e3ecf7;
  border-radius: 6px;
}

.pwctbl {
  flex: 1.4;
  min-width: 0;
  max-height: 320px;

  /* 数据表纵向滚动（容器描边 / 圆角由 .pt-table-wrap 统一提供） */
  &.pt-table-wrap {
    overflow: auto;
  }

  /* 语义化扩展：数值列蓝色（对齐原表），尺寸与内边距沿用全局标准 */
  :deep(.vxe-body--column .vxe-cell) {
    color: lic.$c-blue-deep;
  }
}
</style>
