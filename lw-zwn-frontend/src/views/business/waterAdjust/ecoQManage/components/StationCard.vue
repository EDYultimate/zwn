<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue'
import { useECharts } from '@/hooks/web/useECharts'

interface Warning {
  level: string
  count: number
  date: string
}

interface Props {
  name: string
  dotColor: string
  target: number
  yearTotal: number
  rate: number
  monthlyValues: number[]
  warnings: Warning[]
}

const props = defineProps<Props>()

const emit = defineEmits<{ cardClick: [station: Props] }>()

function onCardClick() {
  emit('cardClick', props)
}

// 每月累计值（由月水量累加得出）
const monthlyCumulative = computed(() => {
  const arr: number[] = []
  let sum = 0
  for (const v of props.monthlyValues) {
    sum += v
    arr.push(Math.round(sum * 10) / 10)
  }
  return arr
})

// 完成率颜色：>=100 绿，>=60 黄，<60 红
function rateColor(rate: number): string {
  if (rate >= 100) {
    return '#39e6a3'
  }
  if (rate >= 60) {
    return '#ffd94d'
  }
  return '#ff5a5a'
}

// ── 柱状+折线图（全宽，无环状图） ──
const barLineRef = ref<HTMLDivElement | null>(null)
const { setOptions: setBarLineOptions } = useECharts(barLineRef as Ref<HTMLDivElement>)

function initBarLine() {
  const months = Array.from({ length: 12 }, (_, i) => `${i + 1}月`)
  setBarLineOptions({
    grid: { top: 10, right: 38, bottom: 4, left: 40, containLabel: false },
    xAxis: {
      type: 'category',
      data: months,
      show: false
    },
    yAxis: [
      {
        type: 'value',
        show: false
      },
      {
        type: 'value',
        show: false
      }
    ],
    series: [
      {
        name: '月水量',
        type: 'bar',
        yAxisIndex: 0,
        data: props.monthlyValues,
        barWidth: '55%',
        itemStyle: {
          borderRadius: [3, 3, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(72, 220, 220, 0.85)' },
              { offset: 1, color: 'rgba(30, 120, 200, 0.5)' }
            ]
          }
        }
      },
      {
        name: '累计值',
        type: 'line',
        yAxisIndex: 1,
        data: monthlyCumulative.value,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#e8c95a', width: 2.5 },
        itemStyle: { color: '#e8c95a' }
      }
    ]
  })
}

onMounted(() => {
  initBarLine()
})
</script>

<template>
  <div class="station-card" @click="onCardClick">
    <!-- 站点名称：蓝色竖条图标 + 名称 -->
    <div class="card-header">
      <span class="marker"></span>
      <span class="name">{{ props.name }}</span>
    </div>

    <!-- 统计值 -->
    <div class="stat-row">
      <div class="stat-item">
        <div class="stat-label">目标值</div>
        <div class="stat-value">{{ props.target.toLocaleString() }}<small>万m³</small></div>
      </div>
      <div class="stat-item">
        <div class="stat-label">年度累计</div>
        <div class="stat-value">{{ props.yearTotal.toLocaleString() }}<small>万m³</small></div>
      </div>
      <div class="stat-item">
        <div class="stat-label">完成率</div>
        <div class="stat-value" :style="{ color: rateColor(props.rate) }">
          {{ props.rate }}<small>%</small>
        </div>
      </div>
    </div>

    <!-- 柱状折线图（全宽） -->
    <div ref="barLineRef" class="barline-chart"></div>

    <!-- 预警信息 -->
    <div class="warning-row">
      <template v-if="props.warnings.length">
        <span
          v-for="(w, i) in props.warnings"
          :key="i"
          class="warning-badge"
          :class="'lv-' + w.level.charAt(0)"
        >
          {{ w.level }}级预警 ×{{ w.count }}
        </span>
        <span class="warning-date">{{ props.warnings[0].date }}</span>
      </template>
      <span v-else class="no-warning">无预警</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.station-card {
  padding: 14px;
  background: linear-gradient(160deg, rgba(20, 70, 160, 0.4), rgba(10, 38, 90, 0.45));
  border: 1px solid rgba(80, 170, 255, 0.3);
  border-radius: 6px;
  cursor: pointer;
  transition:
    box-shadow 0.3s ease,
    border-color 0.3s ease;

  &:hover {
    border-color: rgba(87, 199, 255, 0.8);
    box-shadow:
      0 0 15px rgba(87, 199, 255, 0.35),
      0 0 30px rgba(87, 199, 255, 0.15),
      inset 0 0 20px rgba(87, 199, 255, 0.08);
  }
}

/* 站点名称：蓝色竖条 + 白色粗体名称 */
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  .marker {
    width: 4px;
    height: 16px;
    flex: none;
    border-radius: 2px;
    background: linear-gradient(180deg, #57c7ff, #1f6fd6);
  }

  .name {
    font-size: 15px;
    font-weight: 600;
    color: #eaf5ff;
    letter-spacing: 1px;
  }
}

/* 统计值行 */
.stat-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin-bottom: 10px;

  .stat-item {
    padding: 8px 10px;
    background: rgba(10, 40, 90, 0.5);
    border: 1px solid rgba(80, 170, 255, 0.2);
    border-radius: 4px;
    text-align: center;
  }

  .stat-label {
    font-size: 11px;
    color: #fff;
    margin-bottom: 4px;
    font-weight: 400;
  }

  .stat-value {
    font-size: 22px;
    font-weight: 700;
    color: #6fd8f0;
    line-height: 1.2;
    font-variant-numeric: tabular-nums;

    small {
      margin-left: 2px;
      font-size: 11px;
      font-weight: 400;
      color: #8ab8e8;
    }
  }
}

/* 柱状折线图：全宽 */
.barline-chart {
  width: 100%;
  height: 100px;
  margin-bottom: 8px;
}

/* 预警信息 */
.warning-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(80, 170, 255, 0.15);

  .warning-badge {
    padding: 2px 10px;
    font-size: 11px;
    font-weight: 600;
    border-radius: 9px;
    white-space: nowrap;

    &.lv-一 {
      color: #ff8a7a;
      background: rgba(255, 90, 90, 0.16);
      border: 1px solid rgba(255, 138, 122, 0.5);
    }

    &.lv-二 {
      color: #ffd94d;
      background: rgba(255, 217, 77, 0.14);
      border: 1px solid rgba(255, 217, 77, 0.45);
    }

    &.lv-三 {
      color: #57c7ff;
      background: rgba(87, 199, 255, 0.14);
      border: 1px solid rgba(87, 199, 255, 0.4);
    }
  }

  .warning-date {
    font-size: 11px;
    color: #6b9fd0;
  }

  .no-warning {
    padding: 2px 10px;
    font-size: 11px;
    font-weight: 600;
    color: #39e6a3;
    background: rgba(37, 201, 138, 0.15);
    border: 1px solid rgba(57, 230, 163, 0.4);
    border-radius: 9px;
  }
}
</style>
