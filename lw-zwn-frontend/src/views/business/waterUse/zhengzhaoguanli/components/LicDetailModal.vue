<script setup lang="ts">
// ============================================================
// 证照详情弹框（复刻原型 openLicDetail 浅色大弹框）
// 页签一「基本信息」：字段栅格 + 取水口明细表
// 页签二「监测计量信息」：取水口切换 + 日/月/年统计 + 统计卡 + 双折线图 + 统计表
// ============================================================
import { computed, nextTick, reactive, ref, watch, type Ref } from 'vue'
import ProTabs from '@/components/common/ProTabs/ProTabs.vue'
import ProTable from '@/components/common/ProTable'
import type { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid'
import { useECharts } from '@/hooks/web/useECharts'

const visible = ref(false)

/* ---------------- 详情状态 ---------------- */

interface LicPoint {
  no: string
  pos: string
  eng: string
}

type Gran = 'day' | 'month' | 'year'

const rec = ref<any>(null)
const st = reactive({
  tab: 'basic' as 'basic' | 'meter',
  gran: 'month' as Gran,
  sd: '2026-01',
  ed: '2026-06',
  port: '汇总'
})

const detailTabs = [
  { key: 'basic', label: '基本信息' },
  { key: 'meter', label: '监测计量信息' }
] as const

// 取水口选项：汇总 + 各取水口编号
const ports = computed<string[]>(() => {
  const c = rec.value
  if (!c) {
    return ['汇总']
  }
  const ids = c.pts?.length ? c.pts.map((p: LicPoint) => p.no) : c.nos?.length ? c.nos : [c.no]
  return ['汇总', ...ids]
})

/** 当前取水口对应的许可水量（多口拆分） */
const portAmt = computed(() => {
  const c = rec.value
  if (!c) {
    return 0
  }
  if (st.port === '汇总' || ports.value.length === 2) {
    return Number(c.amt) || 0
  }
  return (Number(c.amt) || 0) / Math.max(1, ports.value.length - 1)
})

/** 打开参数：可由智能体指定初始页签 / 统计粒度 / 取水口 */
interface DetailShowOptions {
  tab?: 'basic' | 'meter'
  gran?: Gran
  port?: string
}

/** 打开弹框 */
function show(c: any, opts?: DetailShowOptions) {
  rec.value = c
  Object.assign(st, {
    tab: opts?.tab === 'meter' ? 'meter' : 'basic',
    gran: 'month',
    sd: '2026-01',
    ed: '2026-06',
    port: '汇总'
  })
  if (opts?.gran && opts.gran !== 'month') {
    onGran(opts.gran)
  }
  if (opts?.port && opts.port !== '汇总' && ports.value.includes(opts.port)) {
    st.port = opts.port
  }
  visible.value = true
}

defineExpose({ show })

/* ---------------- 基本信息字段 ---------------- */

const dash = '—'

const pts = computed<LicPoint[]>(() => {
  const c = rec.value
  if (!c) {
    return []
  }
  if (c.pts?.length) {
    return c.pts
  }
  const nos = c.nos?.length ? c.nos : [c.no]
  return nos.map((n: string) => ({ no: n, pos: dash, eng: dash }))
})

const areaTxt = computed(() => {
  const c = rec.value || {}
  return [c.prov, c.city || c.area, c.county].filter(Boolean).join(' / ') || dash
})

const validTxt = computed(() => {
  const c = rec.value || {}
  return `${c.from || dash} ~ ${c.to || dash}`
})

/** 基本信息字段（四列字段栅格） */
const basicKv = computed(() => {
  const c = rec.value || {}
  return [
    { k: '取水许可证编号', v: c.cert || dash },
    { k: '许可证状态', v: c.issued || dash },
    { k: '有效期', v: validTxt.value },
    { k: '许可水量', v: `${c.amt ?? dash} 万m³/年` },
    { k: '取水项目名称', v: c.proj || dash },
    { k: '取水权人', v: c.owner || dash },
    { k: '组织机构代码', v: c.code || dash }
  ]
})

/** 基本信息续：河流 / 河段 / 水源 / 类型 / 用途 */
const sourceKv = computed(() => {
  const c = rec.value || {}
  return [
    { k: '所属河流', v: c.river || dash },
    { k: '所在河段', v: c.reach || dash },
    { k: '水源类型', v: c.src || dash },
    { k: '取水类型', v: c.itype || dash },
    { k: '取水用途', v: c.use || dash }
  ]
})

/** 行政区划与监管字段 */
const areaKv = computed(() => {
  const c = rec.value || {}
  return [
    { k: '监管单位', v: c.org || dash },
    { k: '行政区划', v: areaTxt.value },
    { k: '是否重点监管取水口', v: c.focus || dash },
    { k: '是否大中型灌区', v: c.big || dash },
    { k: '是否典型小型灌区', v: c.small || dash }
  ]
})

/* ---------------- 监测计量：序列生成（与原型同款演示数据） ---------------- */

/** 由字符串生成种子（保证同一口径下图形稳定） */
function seedOf(s: string) {
  return [...s].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
}

/** 按粒度生成时间标签与两条序列：在线计量 / 全国取用水平台 */
function buildSeries(gran: Gran, sd: string, ed: string, port: string, amt: number) {
  const a = amt || 3600
  const seed = seedOf(sd + ed + gran + (port || ''))
  const labels: string[] = []
  let per: number
  if (gran === 'day') {
    const d0 = new Date(sd + 'T00:00:00')
    const d1 = new Date(ed + 'T00:00:00')
    let n = Math.round((d1.getTime() - d0.getTime()) / 86400000)
    if (!isFinite(n) || n < 0) {
      n = 0
    }
    if (n > 366) {
      n = 366
    }
    for (let i = 0; i <= n; i++) {
      const t = new Date(d0.getTime() + i * 86400000)
      labels.push(
        `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(
          t.getDate()
        ).padStart(2, '0')}`
      )
    }
    per = a / 365
  } else if (gran === 'month') {
    const y0 = +sd.slice(0, 4)
    const m0 = +sd.slice(5, 7)
    const y1 = +ed.slice(0, 4)
    const m1 = +ed.slice(5, 7)
    const n = Math.max(0, (y1 - y0) * 12 + (m1 - m0))
    for (let k = 0; k <= n; k++) {
      const y = y0 + Math.floor((m0 - 1 + k) / 12)
      const m = ((m0 - 1 + k) % 12) + 1
      labels.push(`${y}年${m}月`)
    }
    per = a / 12
  } else {
    for (let y = +sd; y <= +ed; y++) {
      labels.push(`${y}年`)
    }
    per = a
  }
  const shape = (i: number) => {
    const v =
      0.92 + 0.38 * Math.sin((i + (seed % 9)) / 1.9) + 0.14 * Math.sin((i * 1.7 + (seed % 5)) / 1.3)
    return Math.max(0.18, v)
  }
  const nat = labels.map((_, i) => Math.round(per * shape(i) * 10) / 10)
  const on = nat.map((v, i) => Math.round(v * (0.92 + ((i * 37 + seed) % 11) / 100) * 10) / 10)
  return { labels, on, nat, per }
}

const series = computed(() => buildSeries(st.gran, st.sd, st.ed, st.port, portAmt.value))

const fmt = (v: number) =>
  v >= 100 ? Math.round(v).toLocaleString() : String(Math.round(v * 10) / 10)

/* ---------------- 明细表列定义（ProTable） ---------------- */

// 取水口信息表（空值展示破折号）
const ptColumns: VxeGridPropTypes.Columns = [
  {
    field: 'no',
    title: '取水口编号',
    minWidth: 120,
    align: 'center',
    formatter: ({ cellValue }: any) => cellValue || dash
  },
  {
    field: 'pos',
    title: '取水口位置',
    minWidth: 180,
    align: 'center',
    formatter: ({ cellValue }: any) => cellValue || dash
  },
  {
    field: 'eng',
    title: '取水工程（设施）类型',
    minWidth: 180,
    align: 'center',
    formatter: ({ cellValue }: any) => cellValue || dash
  }
]

// 取水过程统计表：时间 / 在线计量 / 全国取用水平台
const meterRows = computed(() =>
  series.value.labels.map((l, i) => ({
    time: l,
    on: series.value.on[i],
    nat: series.value.nat[i]
  }))
)

const meterColumns: VxeGridPropTypes.Columns = [
  { field: 'time', title: '时间', minWidth: 80, align: 'center' },
  {
    field: 'on',
    title: '在线计量（万m³）',
    minWidth: 120,
    align: 'center',
    className: 'num-cell',
    formatter: ({ cellValue }: any) => fmt(cellValue)
  },
  {
    field: 'nat',
    title: '全国取用水平台（万m³）',
    minWidth: 130,
    align: 'center',
    className: 'num-cell',
    formatter: ({ cellValue }: any) => fmt(cellValue)
  }
]

/** 2026年1月 → 2026.1 */
const pt = (l: string) => l.replace(/年/, '.').replace(/月/, '')

/** 图表 x 轴短标签 */
const shortLabels = computed(() =>
  series.value.labels.map((l) => (st.gran === 'day' ? l.slice(5) : pt(l)))
)

const gname = computed(() => (st.gran === 'day' ? '日' : st.gran === 'year' ? '年' : '月'))
const rngTxt = computed(() =>
  st.gran === 'day'
    ? `${series.value.labels[0]} ~ ${series.value.labels[series.value.labels.length - 1]}`
    : `${pt(series.value.labels[0])}—${pt(series.value.labels[series.value.labels.length - 1])}`
)
const durTxt = computed(() =>
  st.gran === 'day'
    ? `${series.value.labels.length} 天`
    : st.gran === 'year'
      ? `${series.value.labels.length} 年`
      : `${series.value.labels.length} 个月`
)
const daysN = computed(() =>
  st.gran === 'day'
    ? series.value.labels.length
    : st.gran === 'year'
      ? series.value.labels.length * 365
      : series.value.labels.length * 30.4
)

const sumN = computed(() => Math.round(series.value.nat.reduce((a, b) => a + b, 0) * 10) / 10)
const sumO = computed(() => Math.round(series.value.on.reduce((a, b) => a + b, 0) * 10) / 10)
const maxV = computed(() => Math.max(...series.value.nat))
const minV = computed(() => Math.min(...series.value.nat))
const maxI = computed(() => series.value.nat.indexOf(maxV.value))
const minI = computed(() => series.value.nat.indexOf(minV.value))

/* ---------------- 监测计量：折线图（ECharts） ---------------- */

const meterChartRef = ref<HTMLDivElement | null>(null)
const { setOptions: setMeterOptions } = useECharts(meterChartRef as Ref<HTMLDivElement>, 'light')

function renderMeterChart() {
  if (st.tab !== 'meter') {
    return
  }
  setMeterOptions({
    tooltip: { trigger: 'axis' },
    legend: { show: false },
    grid: { left: 50, right: 18, top: 16, bottom: 26 },
    xAxis: {
      type: 'category',
      data: shortLabels.value,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#dbe7f6' } },
      axisTick: { show: false },
      axisLabel: { fontSize: 10.5, color: '#8aa3c4' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#eef3fa' } },
      axisLabel: { fontSize: 10.5, color: '#8aa3c4' }
    },
    series: [
      {
        name: '在线计量数据',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: series.value.on,
        lineStyle: { color: '#2f7ce0', width: 2.4 },
        areaStyle: { color: 'rgba(47, 124, 224, 0.14)' },
        itemStyle: { color: '#2f7ce0' }
      },
      {
        name: '全国取用水平台数据',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: series.value.nat,
        lineStyle: { color: '#f5a623', width: 2, type: 'dashed' },
        itemStyle: { color: '#f5a623' }
      }
    ]
  })
}

watch(
  () => [visible.value, st.tab, st.gran, st.sd, st.ed, st.port],
  () => nextTick(renderMeterChart)
)

/** 切换粒度时同步默认时间区间 */
function onGran(g: Gran) {
  st.gran = g
  if (g === 'year') {
    st.sd = '2025'
    st.ed = '2026'
  } else if (g === 'day') {
    st.sd = '2026-01-01'
    st.ed = '2026-01-31'
  } else {
    st.sd = '2026-01'
    st.ed = '2026-06'
  }
}
</script>

<template>
  <pro-modal
    v-model:show="visible"
    title="证照详情"
    table-theme="light"
    content-mode="scroll"
    default-padding="0"
    :style-params="{ width: '1240px', height: '86vh' }"
  >
    <!-- 页签 -->
    <pro-tabs v-model="st.tab" :items="detailTabs" class="lcm-tabs" />

    <!-- 页签一：基本信息 -->
    <div v-if="st.tab === 'basic'" class="lgrid">
      <div class="lgsec">基本信息</div>

      <template v-for="item in basicKv" :key="item.k">
        <span class="k">{{ item.k }}</span>
        <span class="v">{{ item.v }}</span>
      </template>

      <div class="lgfull">
        <span class="k">取水口信息</span>
        <div class="lpts-wrap pt-table-wrap">
          <pro-table :columns="ptColumns" :data="pts" :is-pagination="false" height="" />
        </div>
      </div>

      <template v-for="item in sourceKv" :key="item.k">
        <span class="k">{{ item.k }}</span>
        <span class="v">{{ item.v }}</span>
      </template>

      <div class="lgsec">行政区划与监管</div>

      <template v-for="item in areaKv" :key="item.k">
        <span class="k">{{ item.k }}</span>
        <span class="v">{{ item.v }}</span>
      </template>
    </div>

    <!-- 页签二：监测计量信息 -->
    <template v-else>
      <div class="lq-row">
        <span class="lq-lbl">取水口选择：</span>
        <span class="lm-seg">
          <span v-for="p in ports" :key="p" :class="{ on: st.port === p }" @click="st.port = p">{{
            p
          }}</span>
        </span>
      </div>
      <div class="lq-row">
        <span class="lq-lbl">统计时间：</span>
        <span class="lm-seg">
          <span :class="{ on: st.gran === 'day' }" @click="onGran('day')">按日统计</span>
          <span :class="{ on: st.gran === 'month' }" @click="onGran('month')">按月统计</span>
          <span :class="{ on: st.gran === 'year' }" @click="onGran('year')">按年统计</span>
        </span>
        <template v-if="st.gran === 'year'">
          <DatePicker v-model="st.sd" type="year" size="small" width="110px" :clearable="false" />
          <span>至</span>
          <DatePicker v-model="st.ed" type="year" size="small" width="110px" :clearable="false" />
        </template>
        <template v-else-if="st.gran === 'day'">
          <DatePicker v-model="st.sd" type="date" size="small" width="140px" :clearable="false" />
          <span>至</span>
          <DatePicker v-model="st.ed" type="date" size="small" width="140px" :clearable="false" />
        </template>
        <template v-else>
          <DatePicker v-model="st.sd" type="month" size="small" width="130px" :clearable="false" />
          <span>至</span>
          <DatePicker v-model="st.ed" type="month" size="small" width="130px" :clearable="false" />
        </template>
        <span class="lq-note">（{{ rngTxt }} · {{ durTxt }}）</span>
      </div>

      <div class="lq-cards">
        <div class="lq-card">
          <div class="cap">最大取水量（万m³/{{ gname }}）</div>
          <div class="v g">{{ fmt(maxV) }}</div>
          <div class="t">{{ series.labels[maxI] }}</div>
        </div>
        <div class="lq-card">
          <div class="cap">最小取水量（万m³/{{ gname }}）</div>
          <div class="v o">{{ fmt(minV) }}</div>
          <div class="t">{{ series.labels[minI] }}</div>
        </div>
        <div class="lq-card">
          <div class="cap">累计取水量（万m³）</div>
          <div class="v g">{{ fmt(sumN) }}</div>
          <div class="t">{{ rngTxt }} · {{ durTxt }}</div>
        </div>
      </div>

      <div class="lq-main">
        <div class="lq-chart">
          <div class="lq-title">{{ st.port }} · {{ rngTxt }} 取水变化过程</div>
          <div class="lm-legend">
            <span><i style="background: #2f7ce0"></i>在线计量数据</span>
            <span><i style="background: #f5a623"></i>全国取用水平台数据</span>
          </div>
          <div ref="meterChartRef" class="lq-echart"></div>
        </div>
        <div class="lq-tbl">
          <div class="lq-title">取水过程统计表（{{ st.port }}）</div>
          <pro-table :columns="meterColumns" :data="meterRows" :is-pagination="false" height="" />
        </div>
      </div>

      <div class="lq-foot">
        备注：图为所选时间段内的在线计量数据与全国取用水平台数据；统计卡按「全国取用水平台数据」统计，累计
        {{ fmt(sumN) }} 万m³（在线计量累计 {{ fmt(sumO) }} 万m³）；区间日均取水
        {{ (sumN / daysN).toFixed(1) }} 万m³，最大 {{ fmt(maxV) }} 万m³（{{
          series.labels[maxI]
        }}），最小 {{ fmt(minV) }} 万m³（{{ series.labels[minI] }}）；许可水量
        {{ fmt(rec?.amt || 0) }} 万m³/年。
      </div>
    </template>
  </pro-modal>
</template>

<style scoped lang="scss">
@use '@/assets/style/lic-modal-common.scss' as lic;

/* ================= 详情页签（组件 ProTabs） ================= */
/* 弹框 padding 为 0，由这里补页签外层留白 */
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

/* ================= 监测计量信息 ================= */
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

/* 分段按钮（日 / 月 / 年、取水口） */
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

/* 取水过程统计表：数值列蓝色加粗（对齐原 .lmt） */
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
