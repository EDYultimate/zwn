<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { getRangeSum } from '@/api/waterdisp'

interface Props {
  lineCd: string
  ctgCd: string
  // 站点编码；不传则为分类（省）级汇总卡
  prjCd?: string
  name: string
  // 当月完成（万m³），滦河等无月值线路为 null
  monthCmp?: number | string | null
  // 调度年累计（万m³）
  yrCmp?: number | string | null
  // 实际数据期
  dataYr?: number
  dataMn?: number
}

const props = withDefaults(defineProps<Props>(), {
  prjCd: '',
  monthCmp: null,
  yrCmp: null,
  dataYr: 0,
  dataMn: 0
})

// ==================== 时间范围（默认：建表首月 2025-12 ~ 实际数据期） ====================
const DATA_START = Date.UTC(2025, 11, 1)
const defaultEnd = () =>
  props.dataYr ? Date.UTC(props.dataYr, (props.dataMn || 1) - 1, 1) : DATA_START
const range = ref<[number, number]>([DATA_START, defaultEnd()])

// ==================== 范围水量查询 ====================
const rangeSum = ref<number | null>(null)
const cover = ref<{ start: number; end: number }>({ start: 0, end: 0 })
const loading = ref(false)

async function loadRangeSum() {
  const [s, e] = range.value
  if (!s || !e) {
    return
  }
  const sd = new Date(s)
  const ed = new Date(e)
  loading.value = true
  try {
    const res = await getRangeSum({
      lineCd: props.lineCd,
      ctgCd: props.ctgCd,
      prjCd: props.prjCd || undefined,
      startYr: sd.getFullYear(),
      startMn: sd.getMonth() + 1,
      endYr: ed.getFullYear(),
      endMn: ed.getMonth() + 1
    })
    if (res.code === 0 && res.data) {
      rangeSum.value = res.data.sum
      cover.value = { start: res.data.coverStart || 0, end: res.data.coverEnd || 0 }
    }
  } catch (err) {
    console.warn('getRangeSum failed', err)
    rangeSum.value = null
  } finally {
    loading.value = false
  }
}

function onRangeChange(val: [number, number] | null) {
  if (!val) {
    return
  }
  range.value = val
  loadRangeSum()
}

// 数值格式化：千分位，空值显示 -
function fmt(v: number | string | null | undefined) {
  if (v == null || v === '' || isNaN(Number(v))) {
    return '-'
  }
  return Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 2 })
}

const ymText = (ym: number) => (ym ? `${Math.floor(ym / 100)}年${ym % 100}月` : '')

// 实际数据覆盖期与所选范围不一致时如实标注
const coverTip = computed(() => {
  if (!cover.value.start) {
    return rangeSum.value != null ? '所选范围内无数据' : ''
  }
  const [s, e] = range.value
  const selStart = new Date(s).getFullYear() * 100 + new Date(s).getMonth() + 1
  const selEnd = new Date(e).getFullYear() * 100 + new Date(e).getMonth() + 1
  if (cover.value.start !== selStart || cover.value.end !== selEnd) {
    return `数据覆盖 ${ymText(cover.value.start)}~${ymText(cover.value.end)}`
  }
  return ''
})

watch(
  () => [props.lineCd, props.ctgCd, props.prjCd],
  () => {
    range.value = [DATA_START, defaultEnd()]
    loadRangeSum()
  }
)

onMounted(loadRangeSum)
</script>

<template>
  <div class="station-card" :class="{ 'is-province': !prjCd }">
    <div class="card-head">
      <span class="card-name">{{ name }}</span>
      <span v-if="dataYr" class="card-tm">{{ dataYr }}年{{ dataMn }}月</span>
    </div>

    <div class="card-metrics">
      <div class="metric">
        <div class="metric-value month">
          {{ fmt(monthCmp) }}<span class="metric-unit">万m³</span>
        </div>
        <div class="metric-label">当月水量</div>
      </div>
      <div class="metric-divider"></div>
      <div class="metric">
        <div class="metric-value year">{{ fmt(yrCmp) }}<span class="metric-unit">万m³</span></div>
        <div class="metric-label">调度年累计</div>
      </div>
    </div>

    <div class="card-range">
      <n-date-picker
        :value="range"
        type="monthrange"
        size="small"
        :clearable="false"
        format="yyyy年M月"
        style="width: 230px"
        @update:value="onRangeChange"
      />
      <div class="range-result">
        <span class="range-label">范围水量：</span>
        <n-spin v-if="loading" :size="12" />
        <template v-else>
          <span class="range-value">{{ fmt(rangeSum) }}</span>
          <span class="metric-unit">万m³</span>
        </template>
      </div>
    </div>
    <div v-if="coverTip" class="cover-tip">{{ coverTip }}</div>
  </div>
</template>

<style scoped lang="scss">
.station-card {
  border: 1px solid #dbe6f5;
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.75);

  &.is-province {
    border-color: #9dbdeb;
    background: rgba(230, 240, 255, 0.6);
  }
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;

  .card-name {
    font-size: 14px;
    font-weight: 700;
    color: #0f378c;
  }

  .card-tm {
    font-size: 12px;
    color: #888;
  }
}

.card-metrics {
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  .metric {
    flex: 1;
    text-align: center;
  }

  .metric-divider {
    width: 1px;
    height: 30px;
    background: #dbe6f5;
  }

  .metric-value {
    font-size: 18px;
    font-weight: 700;
    line-height: 22px;

    &.month {
      color: #21a6df;
    }

    &.year {
      color: #006bc9;
    }
  }

  .metric-label {
    font-size: 12px;
    color: #666;
    margin-top: 2px;
  }
}

.metric-unit {
  font-size: 11px;
  font-weight: 400;
  color: #888;
  margin-left: 2px;
}

.card-range {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.range-result {
  display: flex;
  align-items: center;

  .range-label {
    font-size: 12px;
    color: #666;
  }

  .range-value {
    font-size: 15px;
    font-weight: 700;
    color: #d48806;
  }
}

.cover-tip {
  font-size: 11px;
  color: #d48806;
  margin-top: 4px;
}
</style>
