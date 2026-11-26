<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue'
import { useECharts } from '@/hooks/web/useECharts'
import PatrolRecordModal from './components/PatrolRecordModal.vue'

// 巡查记录详情弹框（右栏「详情」按钮打开）
const prModalRef = ref<InstanceType<typeof PatrolRecordModal>>()

/** 详情：打开巡查记录弹框（复刻原型 patRecDetail → openPatrolRec） */
function showMore() {
  prModalRef.value?.show(patrolYear.value)
}

/* ==================== 本地演示数据（提取自静态原型，不调后端接口） ==================== */

// 年度巡查统计
interface YearStat {
  total: number
  checked: number
  dist: number
  ok: number
  problem: number
  fixed: number
  unfixed: number
}

const PATROL_YEARS: Record<string, YearStat> = {
  2026: { total: 381, checked: 181, dist: 15, ok: 166, problem: 15, fixed: 11, unfixed: 4 },
  2025: { total: 372, checked: 158, dist: 18, ok: 139, problem: 19, fixed: 12, unfixed: 7 }
}

// 当前选中的年度
const patrolYear = ref('2026')

// 统计卡图标（xuncha1.png ~ xuncha6.png，与 6 张卡片一一对应）
const PT_IC = {
  total: new URL('@/assets/img/business/waterUse/xuncha1.png', import.meta.url).href,
  check: new URL('@/assets/img/business/waterUse/xuncha2.png', import.meta.url).href,
  ok: new URL('@/assets/img/business/waterUse/xuncha3.png', import.meta.url).href,
  problem: new URL('@/assets/img/business/waterUse/xuncha4.png', import.meta.url).href,
  fixed: new URL('@/assets/img/business/waterUse/xuncha5.png', import.meta.url).href,
  unfixed: new URL('@/assets/img/business/waterUse/xuncha6.png', import.meta.url).href
}

// 统计卡配置（n 数值 / t 标题 / up 上升箭头）
const statCards = computed(() => {
  const d = PATROL_YEARS[patrolYear.value]
  if (!d) {
    return []
  }
  return [
    // nc：数值颜色，前四个青蓝、已整改绿、待整改黄
    { key: 'total', n: d.total, t: '取水口总数', ic: PT_IC.total, up: false, nc: '#35DBFE' },
    { key: 'checked', n: d.checked, t: '已巡查数', ic: PT_IC.check, up: true, nc: '#35DBFE' },
    { key: 'ok', n: d.ok, t: '达标取水口数', ic: PT_IC.ok, up: false, nc: '#35DBFE' },
    {
      key: 'problem',
      n: d.problem,
      t: '问题取水口数',
      ic: PT_IC.problem,
      up: false,
      nc: '#35DBFE'
    },
    { key: 'fixed', n: d.fixed, t: '已整改', ic: PT_IC.fixed, up: true, nc: '#28EF9F' },
    { key: 'unfixed', n: d.unfixed, t: '待整改', ic: PT_IC.unfixed, up: false, nc: '#FDD800' }
  ]
})

// 问题取水口分布（按监管局）
const PATROL_BUREAUS = [
  { b: '德州局', n: 50, c: '#25c98a' },
  { b: '邯郸局', n: 45, c: '#ff9f43' },
  { b: '聊城局', n: 36, c: '#3f97f2' },
  { b: '水管局', n: 58, c: '#ffd94d' },
  { b: '沧州局', n: 76, c: '#4dd0e1' }
]

// ── 环形图（ECharts 实现，同 waterSource/sourcePanel：主环 + 底部装饰环 + 中心 label） ──
const donutRef = ref<HTMLDivElement | null>(null)
const { setOptions: setDonutOptions } = useECharts(donutRef as Ref<HTMLDivElement>)

// 环形图数据：按监管局分布
const donutData = computed(() => PATROL_BUREAUS.map((x) => ({ name: x.b, value: x.n })))

// 更新环形图配置
function updateDonutChart() {
  setDonutOptions({
    color: PATROL_BUREAUS.map((x) => x.c),
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} 个 ({d}%)',
      confine: true
    },
    series: [
      // 主环：按监管局分布
      {
        type: 'pie',
        radius: ['55%', '80%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: 'rgba(10, 38, 90, 0.6)',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'center',
          formatter: '{title|分布情况}\n{sub|按监管局}',
          rich: {
            title: { color: '#fff', fontSize: 13, fontWeight: 'bold', lineHeight: 20 },
            sub: { color: '#7fa5d2', fontSize: 10.5, lineHeight: 16 }
          }
        },
        labelLine: { show: false },
        data: donutData.value
      },
      // 底环：深色背景装饰层
      {
        itemStyle: { color: 'rgba(62, 109, 255, 0.15)' },
        type: 'pie',
        silent: true,
        radius: ['50%', '85%'],
        center: ['50%', '50%'],
        tooltip: { show: false },
        label: { show: false },
        data: [{ value: 1 }],
        z: -1
      }
    ]
  })
}

onMounted(updateDonutChart)

// 巡查记录（原型 PATROL_RECS，仅保留面板所需字段）
interface PatrolRec {
  year: string
  intake: string
  bureau: string
  date: string
  result: string
}

const PATROL_RECS: PatrolRec[] = [
  {
    year: '2026',
    intake: '兰庄提水站',
    bureau: '邯郸局',
    date: '2026-07-02',
    result: '已下发整改通知书'
  },
  {
    year: '2026',
    intake: '洪门闸街提水站',
    bureau: '邯郸局',
    date: '2026-05-16',
    result: '已下发整改通知书'
  },
  { year: '2026', intake: '武城头屯泵站', bureau: '德州局', date: '2026-06-18', result: '已整改' },
  { year: '2026', intake: '周尹涵闸', bureau: '沧州局', date: '2026-06-25', result: '已整改' },
  {
    year: '2026',
    intake: '西郑庄分洪闸取水口',
    bureau: '德州局',
    date: '2026-07-05',
    result: '已整改'
  },
  {
    year: '2026',
    intake: '大名龙王庙扬水站',
    bureau: '邯郸局',
    date: '2026-06-30',
    result: '已整改'
  },
  {
    year: '2026',
    intake: '王营盘引水闸',
    bureau: '水管局',
    date: '2026-05-28',
    result: '已下发整改通知书'
  },
  { year: '2025', intake: '吕洼闸', bureau: '德州局', date: '2025-09-12', result: '已整改' },
  { year: '2025', intake: '梳头李涵闸', bureau: '沧州局', date: '2025-08-20', result: '已整改' },
  { year: '2025', intake: '尖塚扬水站', bureau: '德州局', date: '2025-07-15', result: '已整改' },
  { year: '2025', intake: '草寺闸', bureau: '沧州局', date: '2025-06-10', result: '已整改' },
  { year: '2025', intake: '班庄扬水站', bureau: '德州局', date: '2025-05-22', result: '已整改' }
]

// 地图问题点位（原型 PATROL_PTS 中非「达标」点位，用于补充 2026 年记录列表）
interface ProbPt {
  name: string
  b: string
  date: string
  st: 'rectified' | 'pending'
}

const PATROL_PROB_PTS: ProbPt[] = [
  { name: '班庄扬水站', b: '德州局', date: '2026-03-08', st: 'rectified' },
  { name: '草寺闸', b: '沧州局', date: '2026-03-12', st: 'rectified' },
  { name: '西郑庄分洪闸取水口', b: '德州局', date: '2026-03-18', st: 'pending' },
  { name: '四女寺枢纽取水口', b: '德州局', date: '2026-03-20', st: 'pending' },
  { name: '前官屯涵闸', b: '沧州局', date: '2026-03-22', st: 'pending' },
  { name: '盐土庄节制闸取水口', b: '水管局', date: '2026-03-24', st: 'rectified' },
  { name: '小河口节制闸取水口', b: '德州局', date: '2026-03-25', st: 'pending' }
]

// 面板记录行
interface FeedItem {
  date: string
  nm: string
  bp: string
  done: boolean
}

// 近三个月巡查记录：巡查记录 + 问题点位，随年度联动（逻辑同原型 renderPatrolRp）
const feedList = computed<FeedItem[]>(() => {
  const feed: FeedItem[] = PATROL_RECS.filter((r) => r.year === patrolYear.value).map((r) => ({
    date: r.date,
    nm: r.intake,
    bp: r.bureau,
    // 处理结果非「已整改」视为待整改
    done: r.result === '已整改'
  }))
  // 2026 年补充地图问题点位
  if (patrolYear.value === '2026') {
    PATROL_PROB_PTS.forEach((p) => {
      feed.push({ date: p.date, nm: p.name, bp: p.b, done: p.st === 'rectified' })
    })
  }
  // 近三个月窗口：以数据内最新日期为基准回溯三个月
  const latest = feed
    .map((f) => f.date)
    .sort()
    .pop()
  let win = feed
  if (latest) {
    const [yy, mm, dd] = latest.split('-').map(Number)
    let cy = yy
    let cm = mm - 3
    if (cm < 1) {
      cm += 12
      cy -= 1
    }
    const cut = `${cy}-${String(cm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`
    win = feed.filter((f) => f.date >= cut)
  }
  return win.sort((a, b) => b.date.localeCompare(a.date))
})
</script>

<template>
  <div>
    <RightSide width="420px">
      <!-- 标题行：图标 + 标题 + 年度筛选 + 详情按钮 -->
      <TitleBackOut content="巡查信息" :is-click-btn="false">
        <DatePicker
          v-model="patrolYear"
          type="year"
          size="small"
          width="100px"
          :clearable="false"
          table-theme="blue"
          :actions="null"
        />
        <!-- 详情按钮：打开巡查记录弹框（复刻原型 rp-hdbtn） -->
        <button class="rp-hdbtn" type="button" title="查看巡查记录详情" @click="showMore">
          详情 »
        </button>
      </TitleBackOut>

      <!-- 统计卡（两列六卡，随年度联动） -->
      <div class="pt-stats">
        <div v-for="c in statCards" :key="c.key" class="pt-st">
          <img class="ic" :src="c.ic" alt="" />
          <div class="tx">
            <div class="t">{{ c.t }}</div>
            <div class="n" :style="{ color: c.nc }">
              {{ c.n }}<small>个</small><span v-if="c.up" class="up">↑</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 问题取水口分布（环形图 + 监管局图例） -->
      <div class="div-back-item-in">
        <title-pre-in content="问题取水口分布"></title-pre-in>
        <div class="pt-donut">
          <div ref="donutRef" class="pt-dchart"></div>
          <div class="pt-dleg">
            <div v-for="x in PATROL_BUREAUS" :key="x.b" class="pt-drow">
              <span class="dot" :style="{ background: x.c }"></span>{{ x.b }}<b>{{ x.n }}</b>
            </div>
          </div>
        </div>
      </div>

      <!-- 近三个月巡查记录 -->
      <div class="div-back-item-in">
        <title-pre-in content="近三个月巡查记录">
          <span class="cnt">共 {{ feedList.length }} 条</span>
        </title-pre-in>
        <!--        <div class="sec-h">-->
        <!--          <i></i>近三个月巡查记录<span class="cnt">共 {{ feedList.length }} 条</span>-->
        <!--        </div>-->
        <div class="pt-feed">
          <template v-if="feedList.length">
            <div v-for="(f, i) in feedList" :key="i" class="pt-feedrow div-back-item-line">
              <span class="dt">{{ f.date.slice(5) }}</span>
              <span class="nm" :title="f.nm">{{ f.nm }}</span>
              <span class="bp">{{ f.bp }}</span>
              <span class="rs" :class="f.done ? 'ok' : 'rd'">{{
                f.done ? '已整改' : '待整改'
              }}</span>
            </div>
          </template>
          <div v-else class="empty">近三个月暂无巡查记录</div>
        </div>
      </div>
    </RightSide>

    <!-- 巡查记录弹框（详情按钮打开） -->
    <PatrolRecordModal ref="prModalRef" />
  </div>
</template>

<style scoped lang="scss">
/* 标题行「详情」按钮（复刻原型 .lbtn.rp-hdbtn） */
.rp-hdbtn {
  flex: none;
  margin-left: 8px;
  padding: 4px 14px;
  font-family: inherit;
  font-size: 12.5px;
  color: #fff;
  white-space: nowrap;
  cursor: pointer;
  background: linear-gradient(180deg, #3f97f2, #1f6fd6);
  border: none;
  border-radius: 3px;

  &:hover {
    filter: brightness(1.12);
  }
}

/* 标题行 */
.rp-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 12px 10px;
  border-bottom: 1px solid rgba(80, 170, 255, 0.28);

  .dm {
    width: 20px;
    height: 20px;
    flex: none;
  }

  .rp-title {
    font-size: 15px;
    font-weight: 600;
    color: #eaf5ff;
  }

  /* 年度下拉 */
  .pt-year {
    margin-left: auto;
    padding: 3px 6px;
    font-size: 12.5px;
    color: #dff0ff;
    cursor: pointer;
    background: rgba(10, 40, 90, 0.85);
    border: 1px solid rgba(80, 170, 255, 0.4);
    border-radius: 4px;
    outline: none;

    option {
      background: #0a2650;
    }
  }

  /* 详情按钮 */
  .rp-btn {
    flex: none;
    margin-left: 8px;
    padding: 4px 14px;
    font-size: 12.5px;
    color: #fff;
    cursor: pointer;
    background: linear-gradient(180deg, #2f7ff0, #1c5ec8);
    border: 1px solid rgba(140, 200, 255, 0.5);
    border-radius: 4px;
  }
}

/* 统计卡 */
.pt-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 12px 12px 3px;

  .pt-st {
    display: flex;
    align-items: center;
    gap: 11px;
    margin: 8px 0;
    padding: 2px 12px;
    //background: linear-gradient(160deg, rgba(20, 70, 160, 0.5), rgba(10, 38, 90, 0.5));
    //border: 1px solid rgba(80, 170, 255, 0.35);
    //border-radius: 5px;

    &:nth-child(1),
    &:nth-child(3),
    &:nth-child(5) {
      border-right: 1px dashed #5090da;
    }

    .ic {
      display: block;
      flex: none;
      object-fit: contain;
    }

    .n {
      font-size: 22px;
      font-weight: 800;
      line-height: 1.1;
      color: #fff;
      white-space: nowrap;

      small {
        margin-left: 2px;
        font-size: 11.5px;
        font-weight: 400;
        color: #f0f1f5;
      }

      .up {
        margin-left: 3px;
        font-size: 12px;
        font-weight: 700;
        color: #ff9f43;
      }
    }

    .t {
      font-size: 14px;
      color: #f0f1f5;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

/* 面板分区（问题分布 / 巡查记录） */
.pt-sec {
  margin: 0px 12px 10px;
  padding: 12px 14px;
  background: linear-gradient(160deg, rgba(20, 70, 160, 0.4), rgba(10, 38, 90, 0.45));
  border: 1px solid rgba(80, 170, 255, 0.3);
  border-radius: 6px;
}

.cnt {
  margin-left: auto;
  font-size: 12px;
  font-weight: 400;
  color: #8fc3ff;
}

/* 环形图 + 图例 */
.pt-donut {
  display: flex;
  align-items: center;
  gap: 16px;

  /* ECharts 容器 */
  .pt-dchart {
    width: 150px;
    height: 150px;
    flex: none;
  }

  .pt-dleg {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-right: 10px;
  }

  .pt-drow {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 14px;
    color: #cfe4ff;

    .dot {
      width: 8px;
      height: 8px;
      flex: none;
      border-radius: 50%;
    }

    b {
      margin-left: auto;
      color: #fff;
    }
  }
}

/* 近三个月巡查记录 */
.pt-feed {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 170px;
  overflow-y: auto;

  .pt-feedrow {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 9px;
    border-radius: 5px;
    background: rgba(20, 70, 160, 0.26);

    .dt {
      flex: none;
      font-size: 11.5px;
      color: #8fc3ff;
      font-variant-numeric: tabular-nums;
    }

    .nm {
      min-width: 0;
      font-size: 12.5px;
      font-weight: 600;
      color: #eaf5ff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .bp {
      flex: none;
      font-size: 11.5px;
      color: #9dc4f0;
    }

    .rs {
      margin-left: auto;
      flex: none;
      padding: 1px 8px;
      font-size: 11px;
      font-weight: 600;
      line-height: 16px;
      border-radius: 9px;
      white-space: nowrap;

      &.ok {
        color: #39e6a3;
        background: rgba(37, 201, 138, 0.18);
        border: 1px solid rgba(57, 230, 163, 0.45);
      }

      &.rd {
        color: #ff8a7a;
        background: rgba(255, 90, 90, 0.16);
        border: 1px solid rgba(255, 138, 122, 0.5);
      }
    }
  }

  .empty {
    padding: 10px 0;
    font-size: 12.5px;
    color: #7fa5d2;
    text-align: center;
  }
}
</style>
