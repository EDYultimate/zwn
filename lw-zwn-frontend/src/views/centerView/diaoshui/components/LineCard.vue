<script setup lang="ts">
import { computed } from 'vue'

interface LineCardData {
  lineCd: string
  lineNm: string
  ydhEco?: boolean
  yr?: number
  mn?: number
  // 实际数据期（缺报月 as-of 回退后可能早于所选月份）
  dataYr?: number
  dataMn?: number
  // 普通线路指标（万m³）
  monthCmp?: number
  calYearCmp?: number
  dispatchYearCmp?: number
  cumulative?: number
  // 永定河生态指标（万m³）
  gtys?: number
  gtyx?: number
}

interface Props {
  card: LineCardData
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  active: false
})

const emit = defineEmits<{ (e: 'click', lineCd: string): void }>()

// 原值（万m³），保留原始数值展示
function raw(v: number | null | undefined): string {
  if (v == null || isNaN(Number(v))) {
    return '-'
  }
  return String(Number(v))
}

// 万m³ → 亿m³，保留 2 位小数
function toYi(v: number | null | undefined): string {
  if (v == null || isNaN(Number(v))) {
    return '-'
  }
  return (Number(v) / 10000).toFixed(2)
}

// 是否永定河生态特殊卡片
const isEco = computed(() => props.card.ydhEco === true)

// 动态月/年标签：以实际数据期为准（缺报月回退后如实标注，不冒充所选月份）
const dataYr = computed(() => props.card.dataYr || props.card.yr)
const dataMn = computed(() => props.card.dataMn || props.card.mn)
const monthLabel = computed(() => `${dataYr.value}年${dataMn.value}月供水量`)
const yearLabel = computed(() => `${dataYr.value}年总供水量`)

// 指标列表（普通线路 4 个 / 永定河生态 2 个）
const metrics = computed(() => {
  if (isEco.value) {
    return [
      { label: '官厅以上生态水量', value: raw(props.card.gtys), unit: '万m³' },
      { label: '官厅以下生态水量', value: raw(props.card.gtyx), unit: '万m³' }
    ]
  }
  return [
    { label: monthLabel.value, value: raw(props.card.monthCmp), unit: '万m³' },
    { label: yearLabel.value, value: toYi(props.card.calYearCmp), unit: '亿m³' },
    { label: '调度年总供水量', value: toYi(props.card.dispatchYearCmp), unit: '亿m³' },
    { label: '累计总供水量', value: toYi(props.card.cumulative), unit: '亿m³' }
  ]
})
</script>

<template>
  <div class="line-card" :class="{ active }" @click="emit('click', card.lineCd)">
    <div class="line-card-head">
      <span class="line-card-name">{{ card.lineNm }}</span>
      <span class="line-card-arrow">&gt;</span>
    </div>
    <div class="metric-grid">
      <div v-for="(m, idx) in metrics" :key="idx" class="metric-item">
        <div class="metric-value">
          <span class="metric-num">{{ m.value }}</span>
          <span class="metric-unit">{{ m.unit }}</span>
        </div>
        <div class="metric-label">{{ m.label }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.line-card {
  padding: 8px 10px;
  margin-bottom: 8px;
  border-radius: 8px;
  background: #f7fafc;
  border: 1px solid #e3e8f1;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #1766db;
    background: #f0f7ff;
  }

  &.active {
    border-color: #1766db;
    background: #eaf3ff;
    box-shadow: 0 0 6px rgba(23, 102, 219, 0.25);
  }
}

.line-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.line-card-name {
  font-size: 15px;
  font-weight: 700;
  color: #0f378c;
}

.line-card-arrow {
  color: #999;
  font-size: 14px;
}

.metric-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 10px;
}

.metric-item {
  min-width: 0;
}

.metric-value {
  line-height: 1.3;
}

.metric-num {
  font-size: 17px;
  font-weight: 600;
  color: #1766db;
}

.metric-unit {
  font-size: 12px;
  color: #999;
  margin-left: 2px;
}

.metric-label {
  font-size: 12px;
  color: #666;
  line-height: 1.3;
}
</style>
