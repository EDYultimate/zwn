<script setup lang="ts">
// ============================================================
// 生态流量考核详情弹窗（浅色）
// 顶部断面切换 → 完成情况 / 预警情况 / 年度考核 / 责任主体 / 测站信息
// 由父组件 ref.show(stationName?) 打开；数据为演示数据，后续接接口替换
// ============================================================
import { computed, nextTick, ref, watch } from 'vue'
import * as echarts from 'echarts'

/* ---------------- 断面定义 ---------------- */

interface Station {
  id: number
  name: string
  evalMode: 'year' | 'day' // 按年评价 / 按天评价
  target: number // 生态流量目标
  unit: string
  targetText: string
}

const STATIONS: Station[] = [
  {
    id: 1,
    name: '岳城水库',
    evalMode: 'year',
    target: 3200,
    unit: '万m³',
    targetText: '3,200 万m³/年'
  },
  {
    id: 2,
    name: '祝官屯节制闸',
    evalMode: 'year',
    target: 3384,
    unit: '万m³',
    targetText: '3,384 万m³/年'
  },
  {
    id: 3,
    name: '四女寺枢纽（南进洪闸）',
    evalMode: 'day',
    target: 2.137,
    unit: 'm³/s',
    targetText: '2.137/0.172 m³/s'
  },
  {
    id: 4,
    name: '王营盘拦河闸',
    evalMode: 'day',
    target: 4.14,
    unit: 'm³/s',
    targetText: '4.14/1.38 m³/s'
  },
  {
    id: 5,
    name: '罗塞拦河闸',
    evalMode: 'day',
    target: 4.14,
    unit: 'm³/s',
    targetText: '4.14/1.38 m³/s'
  },
  {
    id: 6,
    name: '庆云拦河闸',
    evalMode: 'day',
    target: 4.14,
    unit: 'm³/s',
    targetText: '4.14/1.38 m³/s'
  },
  {
    id: 7,
    name: '辛集挡潮闸',
    evalMode: 'day',
    target: 4.14,
    unit: 'm³/s',
    targetText: '4.14/1.38 m³/s'
  }
]

const TABS = ['完成情况', '预警情况', '年度考核', '责任主体', '测站信息'] as const

const visible = ref(false)
const currentId = ref(1)
const activeTab = ref<(typeof TABS)[number]>('完成情况')
const year = ref(2025)
const month = ref(9)

const current = computed(() => STATIONS.find((s) => s.id === currentId.value) ?? STATIONS[0])
const YEARS = Array.from({ length: 13 }, (_, i) => 2014 + i)
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

/* ---------------- 演示数据生成（确定性伪随机） ---------------- */

function seeded(seed: number) {
  let t = seed * 7919 + 13
  return () => {
    t = (t * 9301 + 49297) % 233280
    return t / 233280
  }
}

// 逐月明细（按年评价断面）
interface MonthRow {
  month: number
  amount: number // 生态水量（月）
  cumulative: number // 年度累计
  seq: number // 序时控制值
}

// 序时控制值曲线（万m³，取自预警规则：8月底 2560、9月底 2720 ……）
function seqCurve(target: number): number[] {
  const r = target / 3200
  return [320, 640, 960, 1280, 1600, 1920, 2240, 2560, 2720, 2880, 3040, 3200].map((v) =>
    Math.round(v * r)
  )
}

const YC_MONTHLY = [
  236.6, 248.2, 302.8, 311.5, 286.4, 214.8, 268.2, 279.6, 262.4, 285.3, 296.8, 310.5
]

const monthRows = computed<MonthRow[]>(() => {
  const st = current.value
  const seq = seqCurve(st.target)
  const rnd = seeded(st.id + year.value)
  const base =
    st.id === 1 && year.value === 2025
      ? YC_MONTHLY
      : // 系数 0.45~0.95：让各断面/年份完成率落在约 55%~95%，进度条长短有区分
        MONTHS.map(() => +((st.target / 12) * (0.45 + rnd() * 0.5)).toFixed(1))
  let cum = 0
  return MONTHS.map((m, i) => {
    cum = +(cum + base[i]).toFixed(1)
    return { month: m, amount: base[i], cumulative: cum, seq: seq[i] }
  })
})

const yearSummary = computed(() => {
  const rows = monthRows.value
  const total = rows.length ? rows[rows.length - 1].cumulative : 0
  return { total, rate: Math.round((total / current.value.target) * 100) }
})

// 逐日明细（按天评价断面）
interface DayRow {
  day: number
  date: string
  flow: number
  ok: boolean
}

const dayRows = computed<DayRow[]>(() => {
  const st = current.value
  const rnd = seeded(st.id * 31 + month.value)
  const days = 30
  return Array.from({ length: days }, (_, i) => {
    // 系数 0.7~1.25：达标天数占比随断面/月份变化，进度条长短有区分
    const flow = +(st.target * (0.7 + rnd() * 0.55)).toFixed(3)
    return {
      day: i + 1,
      date: `${year.value}-${String(month.value).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`,
      flow,
      ok: flow >= st.target
    }
  })
})

const daySummary = computed(() => {
  const ok = dayRows.value.filter((r) => r.ok).length
  return { ok, total: dayRows.value.length }
})

// 进度条百分比：按年评价=完成率，按天评价=达标天数占比
const progressPct = computed(() =>
  current.value.evalMode === 'day'
    ? Math.round((daySummary.value.ok / (daySummary.value.total || 1)) * 100)
    : Math.min(100, yearSummary.value.rate)
)

/* ---------------- 预警情况 ---------------- */

const warnRows = computed(() => {
  const st = current.value
  const rnd = seeded(st.id + 7)
  return [8, 9].map((m, i) => {
    const seq = seqCurve(st.target)[m - 1]
    const acc = +(seq * (0.88 + rnd() * 0.06)).toFixed(1)
    return {
      date: `${year.value}-${String(m).padStart(2, '0')}-${24 + i * 2}`,
      name: st.name,
      acc,
      level: '一级预警',
      cond: `${m}月底序时值 ${seq.toLocaleString()} ${st.unit}`
    }
  })
})

const warnRules = computed(() => {
  const st = current.value
  const rnd = seeded(st.id + 13)
  return [8, 9].map((m) => {
    const seq = seqCurve(st.target)[m - 1]
    return {
      node: `${m}月底`,
      seq,
      lv1: seq,
      lv2: Math.round(seq * 0.8),
      lv3: '/',
      actual: +(seq * (0.88 + rnd() * 0.06)).toFixed(1)
    }
  })
})

/* ---------------- 年度考核 ---------------- */

const YC_YEARS: [number, number][] = [
  [2014, 2360],
  [2015, 2810],
  [2016, 3450],
  [2017, 3120],
  [2018, 3680],
  [2019, 3540],
  [2020, 2960],
  [2021, 3820],
  [2022, 3610],
  [2023, 3480],
  [2024, 3390],
  [2025, 3348]
]

const yearAssess = computed(() => {
  const st = current.value
  const rnd = seeded(st.id * 3)
  const rows = YEARS.map((y, i) => {
    // 岳城水库用原型硬编码数据（仅 2014–2025），越界年份回退为按目标生成
    const actual =
      st.id === 1 && YC_YEARS[i] ? YC_YEARS[i][1] : Math.round(st.target * (0.72 + rnd() * 0.48))
    const rate = Math.round((actual / st.target) * 100)
    return { year: y, name: st.name, target: st.target, actual, rate, ok: rate >= 100 }
  })
  const okCount = rows.filter((r) => r.ok).length
  return { rows, okCount, rate: Math.round((okCount / rows.length) * 100) }
})

/* ---------------- 责任主体 ---------------- */

const DUTIES = [
  ['生态流量保障主体', '漳卫南运河管理局', '统筹生态流量保障目标落实，下达年度调度计划'],
  ['生态流量调度主体', '漳卫南运河管理局', '按照批复的调度方案组织实施生态流量调度'],
  ['生态流量泄放主体', '岳城水库管理局', '负责闸门启闭与生态水量下泄，做好泄放记录'],
  ['生态流量监管主体', '海河水利委员会', '对生态流量目标完成情况进行监督考核，组织预警响应核查'],
  ['监测与信息报送', '漳卫南运河管理局', '负责考核断面与管理断面流量监测、数据审核与信息报送']
]

/* ---------------- 测站信息 ---------------- */

const stationInfo = computed(() => {
  const st = current.value
  if (st.id === 1) {
    return {
      测站名称: '岳城水库（漳河）',
      编码: '31007101',
      经度: '114.2177',
      纬度: '36.2738',
      测站类型: 'ZQ',
      河流名称: '漳河',
      水系名称: '南运河',
      流域名称: '海河',
      站址: '河北省邯郸市磁县',
      设站年月: '1968',
      始报年月: '—',
      库别: '0',
      监测站方位: '—',
      集水面积: '—',
      基准图名名称: '大沽',
      基面高程: '0',
      备注: '—'
    }
  }
  const rnd = seeded(st.id * 97)
  return {
    测站名称: `${st.name}（漳卫新河）`,
    编码: `3100710${st.id}`,
    经度: (115.5 + rnd() * 1.5).toFixed(4),
    纬度: (37.2 + rnd() * 0.8).toFixed(4),
    测站类型: 'ZQ',
    河流名称: '漳卫新河',
    水系名称: '南运河',
    流域名称: '海河',
    站址: '山东省德州市',
    设站年月: '1975',
    始报年月: '—',
    库别: '0',
    监测站方位: '—',
    集水面积: '—',
    基准图名名称: '大沽',
    基面高程: '0',
    备注: '—'
  }
})

/* ---------------- 图表 ---------------- */

const chartEl = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

function buildOption(): echarts.EChartsOption {
  const st = current.value
  if (st.evalMode === 'day') {
    return {
      grid: { left: 46, right: 16, top: 30, bottom: 24 },
      legend: { data: ['日流量', '控制目标'], top: 0, textStyle: { fontSize: 11 } },
      xAxis: {
        type: 'category',
        data: dayRows.value.map((r) => `${String(r.day).padStart(2, '0')}日`)
      },
      yAxis: { type: 'value', name: st.unit, splitLine: { lineStyle: { color: '#eef2f8' } } },
      series: [
        {
          name: '日流量',
          type: 'bar',
          data: dayRows.value.map((r) => r.flow),
          itemStyle: { color: '#3f97f2' },
          barWidth: '55%'
        },
        {
          name: '控制目标',
          type: 'line',
          data: dayRows.value.map(() => st.target),
          symbol: 'none',
          lineStyle: { color: '#2fbf71', type: 'dashed' }
        }
      ]
    }
  }
  return {
    grid: { left: 56, right: 16, top: 30, bottom: 24 },
    legend: { data: ['月生态水量', '年度累计', '序时控制值'], top: 0, textStyle: { fontSize: 11 } },
    xAxis: { type: 'category', data: MONTHS.map((m) => `${m}月`) },
    yAxis: { type: 'value', name: st.unit, splitLine: { lineStyle: { color: '#eef2f8' } } },
    series: [
      {
        name: '月生态水量',
        type: 'bar',
        data: monthRows.value.map((r) => r.amount),
        itemStyle: { color: '#3f97f2' },
        barWidth: '55%'
      },
      {
        name: '年度累计',
        type: 'line',
        data: monthRows.value.map((r) => r.cumulative),
        itemStyle: { color: '#f5a623' },
        lineStyle: { color: '#f5a623' }
      },
      {
        name: '序时控制值',
        type: 'line',
        data: monthRows.value.map((r) => r.seq),
        symbol: 'none',
        lineStyle: { color: '#2fbf71', type: 'dashed' }
      }
    ]
  }
}

async function renderChart() {
  await nextTick()
  if (!chartEl.value) {
    return
  }
  // Tab 切换后容器 DOM 已重建，旧实例失效，必须销毁后重新 init
  chart?.dispose()
  chart = echarts.init(chartEl.value)
  chart.setOption(buildOption())
  chart.resize()
}

watch([visible, activeTab, currentId, year, month], () => {
  if (visible.value && activeTab.value === '完成情况') {
    renderChart()
  }
})

/* ---------------- 打开 / 关闭 ---------------- */

function show(stationName?: string) {
  const idx = STATIONS.findIndex((s) => s.name === stationName)
  currentId.value = idx >= 0 ? STATIONS[idx].id : STATIONS[0].id
  activeTab.value = '完成情况'
  visible.value = true
}

function onClose() {
  visible.value = false
  chart?.dispose()
  chart = null
}

function onQuery() {
  window.$message?.info('查询（演示数据）')
}

function onExport() {
  window.$message?.info('导出（演示数据）')
}

defineExpose({ show })
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="sd-mask" @click.self="onClose">
      <div class="sd-modal">
        <!-- 头部 -->
        <div class="sd-head">
          <span class="sd-caret">▼</span>
          <span class="sd-title">生态流量考核详情</span>
          <span class="sd-close" @click="onClose">&times;</span>
        </div>

        <!-- 断面切换 -->
        <div class="sd-stations">
          <span
            v-for="s in STATIONS"
            :key="s.id"
            class="sd-pill"
            :class="{ active: s.id === currentId }"
            @click="currentId = s.id"
          >
            {{ s.name }}
            <em class="sd-pill-tag">{{ s.evalMode === 'year' ? '按年评价' : '按天评价' }}</em>
          </span>
        </div>

        <!-- Tab -->
        <div class="sd-tabs">
          <span
            v-for="t in TABS"
            :key="t"
            class="sd-tab"
            :class="{ active: t === activeTab }"
            @click="activeTab = t"
          >
            {{ t }}
          </span>
        </div>

        <div class="sd-body">
          <!-- ============ 完成情况 ============ -->
          <template v-if="activeTab === '完成情况'">
            <div class="sd-filters">
              <label>
                年份
                <select v-model.number="year">
                  <option v-for="y in YEARS" :key="y" :value="y">{{ y }}</option>
                </select>
              </label>
              <label v-if="current.evalMode === 'day'">
                月份
                <select v-model.number="month">
                  <option v-for="m in MONTHS" :key="m" :value="m">{{ m }}月</option>
                </select>
              </label>
              <span class="sd-unit">单位：{{ current.unit }}</span>
              <div class="sd-fbtns">
                <button class="sd-btn" type="button" @click="onQuery">查 询</button>
                <button class="sd-btn ghost" type="button" @click="onExport">导出</button>
              </div>
            </div>

            <div class="sd-finish">
              <!-- 左：进度条 + 图表 -->
              <div class="sd-chart-box">
                <div class="sd-progress">
                  <div class="sd-progress-track">
                    <div class="sd-progress-fill" :style="{ width: progressPct + '%' }"></div>
                  </div>
                  <div class="sd-progress-labels">
                    <span>0</span>
                    <span>
                      {{
                        current.evalMode === 'day'
                          ? `当月达标 ${daySummary.ok}/${daySummary.total} 天`
                          : `序时进度线 ${current.targetText}`
                      }}
                    </span>
                    <span>
                      {{
                        current.evalMode === 'day' ? `${daySummary.total} 天` : current.targetText
                      }}
                    </span>
                  </div>
                </div>
                <div ref="chartEl" class="sd-chart"></div>
              </div>

              <!-- 右：明细表 -->
              <div class="sd-detail">
                <div class="sd-detail-title">
                  {{ current.evalMode === 'day' ? '逐日明细' : '逐月明细' }}
                  <span
                    >{{ year }} 年{{ current.evalMode === 'day' ? ` ${month} 月` : '' }} · 单位：{{
                      current.unit
                    }}</span
                  >
                </div>
                <div class="sd-tbl-wrap">
                  <table class="sd-tbl">
                    <template v-if="current.evalMode === 'day'">
                      <thead>
                        <tr>
                          <th>序号</th>
                          <th>日期</th>
                          <th>流量（{{ current.unit }}）</th>
                          <th>目标（{{ current.unit }}）</th>
                          <th>达标情况</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="r in dayRows" :key="r.day">
                          <td>{{ r.day }}</td>
                          <td>{{ r.date }}</td>
                          <td>{{ r.flow.toFixed(3) }}</td>
                          <td>{{ current.target.toFixed(3) }}</td>
                          <td>
                            <span class="sd-tag" :class="r.ok ? 'ok' : 'bad'">
                              {{ r.ok ? '达标' : '低于目标' }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                    <template v-else>
                      <thead>
                        <tr>
                          <th>序号</th>
                          <th>年份 / 月份</th>
                          <th>考核断面</th>
                          <th>生态水量（月）</th>
                          <th>年度累计</th>
                          <th>序时控制值</th>
                          <th>与序时值对比</th>
                          <th>目标完成情况</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="r in monthRows" :key="r.month">
                          <td>{{ r.month }}</td>
                          <td>{{ year }} 年 {{ r.month }} 月</td>
                          <td>{{ current.name }}</td>
                          <td>{{ r.amount.toLocaleString() }}</td>
                          <td>{{ r.cumulative.toLocaleString() }}</td>
                          <td>{{ r.seq.toLocaleString() }}</td>
                          <td>
                            <span class="sd-tag" :class="r.cumulative >= r.seq ? 'ok' : 'mid'">
                              {{ r.cumulative >= r.seq ? '高于序时值' : '低于序时值' }}
                            </span>
                          </td>
                          <td>
                            <span class="sd-tag" :class="r.cumulative >= r.seq ? 'ok' : 'bad'">
                              {{ r.cumulative >= r.seq ? '达标' : '未达标' }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </table>
                </div>
              </div>
            </div>

            <div class="sd-note">
              <template v-if="current.evalMode === 'day'">
                {{ current.name }}（考核断面）{{ year }}-{{
                  String(month).padStart(2, '0')
                }}
                当月达标 {{ daySummary.ok }}/{{ daySummary.total }} 天；控制目标≥
                {{ current.target.toFixed(3) }}{{ current.unit }}； 生态流量目标：{{
                  current.targetText
                }}
              </template>
              <template v-else>
                {{ year }} 年{{ current.name }}累计下泄生态水量
                {{ yearSummary.total.toLocaleString() }} 万m³，完成年度目标 {{ yearSummary.rate }}%
                <em class="sd-hl">· 生态流量目标：{{ current.targetText }}</em>
              </template>
            </div>
          </template>

          <!-- ============ 预警情况 ============ -->
          <template v-else-if="activeTab === '预警情况'">
            <div class="sd-filters">
              <label>
                年份
                <select v-model.number="year">
                  <option v-for="y in YEARS" :key="y" :value="y">{{ y }}</option>
                </select>
              </label>
              <span class="sd-unit">单位：{{ current.unit }}</span>
              <div class="sd-fbtns">
                <button class="sd-btn" type="button" @click="onQuery">查 询</button>
                <button class="sd-btn ghost" type="button" @click="onExport">导出</button>
              </div>
            </div>

            <div class="sd-sec-title">预警情况</div>
            <div class="sd-tbl-wrap plain">
              <table class="sd-tbl">
                <thead>
                  <tr>
                    <th>序号</th>
                    <th>预警日期</th>
                    <th>考核断面</th>
                    <th>年累计水量</th>
                    <th>预警级别</th>
                    <th>触发条件</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(w, i) in warnRows" :key="i">
                    <td>{{ i + 1 }}</td>
                    <td>{{ w.date }}</td>
                    <td>{{ w.name }}</td>
                    <td>{{ w.acc.toLocaleString() }} {{ current.unit }}</td>
                    <td>
                      <span class="sd-tag info">{{ w.level }}</span>
                    </td>
                    <td>{{ w.cond }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="sd-sec-title">预警规则</div>
            <div v-for="r in warnRules" :key="r.node" class="sd-rule">
              <div class="sd-rule-title">{{ r.node }} 控制节点</div>
              <div class="sd-rule-cards">
                <div class="sd-rule-card">
                  <div class="sd-rule-k">序时控制值</div>
                  <div class="sd-rule-v">{{ r.seq.toLocaleString() }}</div>
                </div>
                <div class="sd-rule-card">
                  <div class="sd-rule-k">一级预警阈值</div>
                  <div class="sd-rule-v">{{ r.lv1.toLocaleString() }}</div>
                </div>
                <div class="sd-rule-card warn">
                  <div class="sd-rule-k">二级预警阈值</div>
                  <div class="sd-rule-v red">{{ r.lv2.toLocaleString() }}</div>
                </div>
                <div class="sd-rule-card">
                  <div class="sd-rule-k">三级预警阈值</div>
                  <div class="sd-rule-v">{{ r.lv3 }}</div>
                </div>
                <div class="sd-rule-card ok">
                  <div class="sd-rule-k">实际累计（演示）</div>
                  <div class="sd-rule-v green">{{ r.actual.toLocaleString() }}</div>
                </div>
              </div>
              <div class="sd-rule-note">
                年度目标 {{ current.targetText }}（序时值 {{ r.seq.toLocaleString() }}
                {{ current.unit }}）； 实际累计低于序时值 {{ r.seq.toLocaleString() }}
                {{ current.unit }} 触发一级预警， 低于 {{ r.lv2.toLocaleString() }}
                {{ current.unit }} 触发二级预警，逐级上报并启动补充下泄调度。
              </div>
            </div>

            <div class="sd-note">
              预警规则依据《漳河岳城水库生态流量核定与保障报告》表 5：当前共
              {{ warnRows.length }} 条预警响应记录，均为一级预警
              <em class="sd-hl">· 生态流量目标：{{ current.targetText }}</em>
            </div>
          </template>

          <!-- ============ 年度考核 ============ -->
          <template v-else-if="activeTab === '年度考核'">
            <div class="sd-tbl-wrap plain tall">
              <table class="sd-tbl">
                <thead>
                  <tr>
                    <th>序号</th>
                    <th>年份</th>
                    <th>考核断面</th>
                    <th>生态流量目标</th>
                    <th>年实际下泄量</th>
                    <th>完成率</th>
                    <th>考核结论</th>
                    <th>说明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(r, i) in yearAssess.rows" :key="r.year">
                    <td>{{ i + 1 }}</td>
                    <td>{{ r.year }} 年</td>
                    <td>{{ r.name }}</td>
                    <td>{{ r.target.toLocaleString() }} {{ current.unit }}</td>
                    <td>{{ r.actual.toLocaleString() }}</td>
                    <td>{{ r.rate }}%</td>
                    <td>
                      <span class="sd-tag" :class="r.ok ? 'ok' : 'bad'">{{
                        r.ok ? '达标' : '未达标'
                      }}</span>
                    </td>
                    <td class="sd-tl">
                      {{ r.ok ? '年度考核通过' : '低于年度目标，已下达补充下泄计划' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="sd-note">
              近 12 年评价 {{ yearAssess.okCount }} 年达标，达标率 {{ yearAssess.rate }}%
              <em class="sd-hl">· 生态流量目标：{{ current.targetText }}</em>
            </div>
          </template>

          <!-- ============ 责任主体 ============ -->
          <template v-else-if="activeTab === '责任主体'">
            <div class="sd-tbl-wrap plain">
              <table class="sd-tbl">
                <thead>
                  <tr>
                    <th>序号</th>
                    <th>责任类别</th>
                    <th>责任主体</th>
                    <th>职责内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(d, i) in DUTIES" :key="d[0]">
                    <td>{{ i + 1 }}</td>
                    <td>{{ d[0] }}</td>
                    <td>{{ d[1] }}</td>
                    <td class="sd-tl">{{ d[2] }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="sd-note">
              考核组织：海河水利委员会负责组织年度生态流量目标完成情况考核；漳卫南运河管理局负责监测数据审核与信息报送；考核结果纳入最严格水资源管理制度考核。<br />
              责任主体依据《漳河岳城水库生态流量核定与保障报告》表 6：共 5 项责任分工
              <em class="sd-hl">· 生态流量目标：{{ current.targetText }}</em>
            </div>
          </template>

          <!-- ============ 测站信息 ============ -->
          <template v-else>
            <div class="sd-info">
              <div v-for="(v, k) in stationInfo" :key="k" class="sd-info-item">
                <span class="sd-info-label">{{ k }}</span>
                <span class="sd-info-val">{{ v }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
/* ================= 遮罩 + 容器 ================= */
.sd-mask {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 40, 75, 0.45);
}

.sd-modal {
  display: flex;
  flex-direction: column;
  width: 1240px;
  max-width: 97vw;
  max-height: 92vh;
  overflow: hidden;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 8px 40px rgba(20, 60, 120, 0.25);
}

/* ================= 头部 ================= */
.sd-head {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: none;
  padding: 13px 18px;
  border-bottom: 1px solid #e2ebf7;

  .sd-caret {
    font-size: 11px;
    color: #1f7ae0;
  }

  .sd-title {
    font-size: 15px;
    font-weight: 700;
    color: #1f7ae0;
    letter-spacing: 0.5px;
  }

  .sd-close {
    margin-left: auto;
    padding: 0 6px;
    font-size: 22px;
    line-height: 1;
    color: #8aa3c4;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      color: #24405e;
      background: #eef3f8;
    }
  }
}

/* ================= 断面切换 ================= */
.sd-stations {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: none;
  padding: 12px 18px 0;
}

.sd-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 13px;
  color: #20517e;
  cursor: pointer;
  background: #f4f9ff;
  border: 1px solid #bcd7f7;
  border-radius: 14px;

  &.active {
    color: #fff;
    background: linear-gradient(180deg, #3f97f2, #1f6fd6);
    border-color: #1f6fd6;

    .sd-pill-tag {
      color: #cfe7ff;
      border-color: rgba(255, 255, 255, 0.5);
    }
  }

  .sd-pill-tag {
    padding: 0 5px;
    font-size: 11px;
    font-style: normal;
    color: #1f7ae0;
    border: 1px solid #bcd7f7;
    border-radius: 8px;
  }
}

/* ================= Tab ================= */
.sd-tabs {
  display: flex;
  gap: 6px;
  flex: none;
  padding: 12px 18px 0;
}

.sd-tab {
  padding: 5px 16px;
  font-size: 13px;
  color: #20517e;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background: #eef5fd;
  }

  &.active {
    color: #fff;
    background: linear-gradient(180deg, #3f97f2, #1f6fd6);
  }
}

/* ================= 内容区 ================= */
.sd-body {
  flex: 1;
  min-height: 0;
  padding: 12px 18px 16px;
  overflow: auto;
}

/* 筛选行 */
.sd-filters {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 13px;
  color: #2c2c2c;

  label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  select {
    height: 26px;
    padding: 0 6px;
    font-size: 13px;
    color: #222;
    cursor: pointer;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 3px;
    outline: none;

    &:focus {
      border-color: #3f97f2;
    }
  }

  .sd-unit {
    color: #7a8aa0;
  }

  .sd-fbtns {
    display: flex;
    gap: 8px;
    margin-left: auto;
  }
}

.sd-btn {
  padding: 5px 16px;
  font-size: 13px;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(180deg, #3f97f2, #1f6fd6);
  border: none;
  border-radius: 3px;

  &:hover {
    filter: brightness(1.08);
  }

  &.ghost {
    color: #1f7ae0;
    background: #f2f8ff;
    border: 1px solid #8fc0f2;
  }
}

/* ================= 完成情况 ================= */
.sd-finish {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.sd-chart-box {
  min-width: 0;
}

.sd-progress {
  margin-bottom: 8px;

  .sd-progress-track {
    height: 8px;
    overflow: hidden;
    background: #e8eef5;
    border-radius: 4px;
  }

  .sd-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #2fbf71, #5fd99a);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .sd-progress-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 4px;
    font-size: 12px;
    color: #7a8aa0;
  }
}

.sd-chart {
  width: 100%;
  height: 340px;
}

.sd-detail {
  min-width: 0;
}

.sd-detail-title {
  margin-bottom: 6px;
  font-size: 13.5px;
  font-weight: 700;
  color: #24405e;

  span {
    margin-left: 8px;
    font-size: 12px;
    font-weight: 400;
    color: #8aa3c4;
  }
}

/* ================= 表格 ================= */
.sd-tbl-wrap {
  max-height: 380px;
  overflow: auto;
  border: 1px solid #dbe7f6;

  &.plain {
    max-height: 300px;
  }

  &.tall {
    max-height: 460px;
  }
}

.sd-tbl {
  width: 100%;
  font-size: 13px;
  border-collapse: separate;
  border-spacing: 0;

  th {
    position: sticky;
    top: 0;
    z-index: 2;
    padding: 8px 10px;
    font-weight: 600;
    white-space: nowrap;
    color: #20517e;
    background: #e2eefb;
    border-right: 1px solid #cfe0f4;
    border-bottom: 1px solid #cfe0f4;

    &:last-child {
      border-right: none;
    }
  }

  td {
    padding: 7px 10px;
    text-align: center;
    white-space: nowrap;
    color: #2a3f5c;
    background: #fff;
    border-right: 1px solid #e2ebf7;
    border-bottom: 1px solid #e2ebf7;

    &:last-child {
      border-right: none;
    }
  }

  tbody tr:hover td {
    background: #f2f8ff;
  }
}

.sd-tl {
  text-align: left !important;
}

/* 标签 */
.sd-tag {
  display: inline-block;
  padding: 1px 10px;
  font-size: 12px;
  border-radius: 9px;

  &.ok {
    color: #16a34a;
    background: #e9f9ef;
    border: 1px solid #b7e8c8;
  }

  &.bad {
    color: #e23c3c;
    background: #fdecec;
    border: 1px solid #f6c1c1;
  }

  &.mid {
    color: #d48806;
    background: #fdf6e3;
    border: 1px solid #f0dcaa;
  }

  &.info {
    color: #1f7ae0;
    background: #e8f2ff;
    border: 1px solid #bcd7f7;
  }
}

/* 分区标题 */
.sd-sec-title {
  margin: 12px 0 6px;
  font-size: 13.5px;
  font-weight: 700;
  color: #24405e;
}

/* ================= 预警规则卡片 ================= */
.sd-rule {
  margin-bottom: 10px;

  .sd-rule-title {
    margin-bottom: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #2a3f5c;
  }

  .sd-rule-cards {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
  }

  .sd-rule-card {
    padding: 8px 10px;
    background: #f7fafd;
    border: 1px solid #e2ebf7;
    border-radius: 4px;

    &.warn {
      background: #fdf3f3;
      border-color: #f6c1c1;
    }

    &.ok {
      background: #eefaf3;
      border-color: #b7e8c8;
    }
  }

  .sd-rule-k {
    font-size: 12px;
    color: #8aa3c4;
  }

  .sd-rule-v {
    margin-top: 2px;
    font-size: 15px;
    font-weight: 700;
    color: #24405e;
    font-variant-numeric: tabular-nums;

    &.red {
      color: #e23c3c;
    }

    &.green {
      color: #16a34a;
    }
  }

  .sd-rule-note {
    margin-top: 6px;
    font-size: 12px;
    color: #7a8aa0;
  }
}

/* ================= 底部说明 ================= */
.sd-note {
  margin-top: 10px;
  font-size: 12.5px;
  line-height: 1.8;
  color: #7a8aa0;

  .sd-hl {
    margin-left: 6px;
    font-style: normal;
    font-weight: 600;
    color: #1f7ae0;
  }
}

/* ================= 测站信息 ================= */
.sd-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
}

.sd-info-item {
  display: flex;
  align-items: center;
  gap: 10px;

  .sd-info-label {
    width: 96px;
    font-size: 13px;
    color: #333;
    text-align: right;
    flex: none;
  }

  .sd-info-val {
    flex: 1;
    padding: 7px 10px;
    font-size: 13px;
    color: #2a3f5c;
    background: #f7fafd;
    border: 1px solid #e2ebf7;
    border-radius: 3px;
  }
}
</style>
