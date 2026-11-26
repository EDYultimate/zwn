<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getLydsSums, getLydsRangeSum } from '@/api/waterdisp'
import { LYDS_TOP_CFG } from './lydsTopConfig'

/**
 * 流域调水详情 —— 页签上方的两块（旧项目 Page_p + Page_c「通水累计」，2026-09-24 复刻）
 *
 * ① 文字统计条（不可选，旧 Page_p）：本月（万m³）/ 本年（亿m³）/ 自通水累计（亿m³），各带期次
 * ② 通水累计卡（旧 Page_c）：可改的「自 yyyy-MM 至 yyyy-MM」区间 → 常规水量累计（亿m³）；
 *    下方本月/本年两格不随区间变化（与旧页面一致）
 *
 * 数据来源按线路配置（旧项目各线路来源不同）：
 *   - 'month'：PORTAL_SYS.MONTH_DATA（漳河/引滦/引黄入冀/南水北调 …）—— 累计=自最早期、区间=任意区间求和
 *   - 'ydh'  ：永定河走 YDH 专属接口（见 YdBlocks.vue）
 *   - 'luru' ：山西/滦河/滹沱河走季度录入 SZY_LURU_DATA（按月区间即可，见配置 start）
 */
const props = defineProps<{ lineCd: string }>()

const cfg = computed(() => LYDS_TOP_CFG[props.lineCd] || null)
const idsParam = computed(() => (cfg.value ? cfg.value.ids.join(';') : ''))

const sums = ref<any>(null)
/** 区间（yyyy-MM）；默认 = [起始年-01, 数据期] */
const rangeStart = ref<string>('')
const rangeEnd = ref<string>('')
const rangeSum = ref<number | null>(null)

const startYmDefault = computed(() => {
  const s = String(cfg.value?.start ?? '')
  return s.includes('-') ? s : `${s}-01`
})
const dataYm = computed(() => {
  const s = String(sums.value?.tm || '')
  return s.length >= 7 ? s.slice(0, 7) : ''
})

function monthEndOf(ym: string) {
  if (!ym) {
    return ''
  }
  const [y, m] = ym.split('-').map(Number)
  const last = new Date(y, m, 0).getDate()
  return `${ym}-${String(last).padStart(2, '0')}`
}

async function loadRange() {
  if (!cfg.value || !rangeStart.value || !rangeEnd.value) {
    return
  }
  try {
    const res = await getLydsRangeSum({
      ids: idsParam.value,
      sdt: `${rangeStart.value}-01`,
      edt: monthEndOf(rangeEnd.value)
    })
    if (res.code === 0) {
      rangeSum.value = Number(res.data) || 0
    }
  } catch (e) {
    console.warn('LydsTopBlocks: 区间累计查询失败', e)
  }
}

async function load() {
  if (!cfg.value) {
    return
  }
  sums.value = null
  rangeSum.value = null
  try {
    const res = await getLydsSums({ ids: idsParam.value })
    if (res.code === 0 && res.data) {
      sums.value = res.data.total || null
      // 默认区间（仅作选择器初值）：自「起始年」至数据期
      rangeStart.value = startYmDefault.value
      rangeEnd.value = dataYm.value || startYmDefault.value
      // ⚠️ 与旧项目一致：初次显示的是「全量累计」（zsd，含起始年之前的行），
      //    只有用户改区间后才切换为「区间求和」结果
      rangeSum.value = Number(sums.value?.zsd) || 0
    }
  } catch (e) {
    console.warn('LydsTopBlocks: 通水累计查询失败', e)
  }
}
watch(() => props.lineCd, load, { immediate: true })

const fmtYi = (wan: any) => {
  const n = Number(wan)
  return isFinite(n) ? (n / 10000).toFixed(2) : '-'
}
const fmtWan = (wan: any) => {
  const n = Number(wan)
  return isFinite(n) ? n.toLocaleString('zh-CN', { maximumFractionDigits: 0 }) : '-'
}
const ymCn = (ym: string) => (ym ? `${ym.slice(0, 4)}年${Number(ym.slice(5, 7))}月` : '-')
/** 起始/结束选择器范围限制：不早于起始年、不晚于今天 */
const disabledStart = (ts: number) => ts > Date.now()
const disabledEnd = (ts: number) => ts > Date.now()
</script>

<template>
  <div v-if="cfg && sums" class="lt-wrap">
    <!-- ① 文字统计条（不可选） -->
    <div class="lt-card lt-stat">
      <div class="lt-cell">
        <div class="lt-num month">{{ fmtWan(sums.month) }}<span class="lt-unit">万m³</span></div>
        <div class="lt-sub">{{ ymCn(dataYm) }}</div>
      </div>
      <div class="lt-cell">
        <div class="lt-num year">{{ fmtYi(sums.year) }}<span class="lt-unit">亿m³</span></div>
        <div class="lt-sub">{{ dataYm ? dataYm.slice(0, 4) + '年' : '-' }}</div>
      </div>
      <div class="lt-cell">
        <div class="lt-num total">{{ fmtYi(sums.zsd) }}<span class="lt-unit">亿m³</span></div>
        <div class="lt-sub">自通水累计</div>
      </div>
    </div>

    <!-- ② 通水累计（区间可选） -->
    <div class="lt-card">
      <div class="lt-title">{{ cfg.title }}</div>
      <div class="lt-range">
        <span>自</span>
        <n-date-picker
          v-model:formatted-value="rangeStart"
          type="month"
          size="small"
          value-format="yyyy-MM"
          style="width: 108px"
          :clearable="false"
          :is-date-disabled="disabledStart"
          @update:formatted-value="loadRange"
        />
        <span>至</span>
        <n-date-picker
          v-model:formatted-value="rangeEnd"
          type="month"
          size="small"
          value-format="yyyy-MM"
          style="width: 108px"
          :clearable="false"
          :is-date-disabled="disabledEnd"
          @update:formatted-value="loadRange"
        />
      </div>
      <div class="lt-acc">
        常规水量累计：<b>{{ fmtYi(rangeSum) }}</b> 亿m³
      </div>
      <div class="lt-two">
        <div class="lt-cell lt-cell-bg">
          <div class="lt-num month">{{ fmtWan(sums.month) }}<span class="lt-unit">万m³</span></div>
          <div class="lt-sub">{{ ymCn(dataYm) }}</div>
        </div>
        <div class="lt-cell lt-cell-bg">
          <div class="lt-num year">{{ fmtYi(sums.year) }}<span class="lt-unit">亿m³</span></div>
          <div class="lt-sub">{{ dataYm ? dataYm.slice(0, 4) + '年' : '-' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.lt-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.lt-card {
  background: rgba(24, 144, 255, 0.06);
  border-radius: 6px;
  padding: 8px 10px;
}

/* ① 三格文字统计 */
.lt-stat {
  display: flex;
  align-items: center;
}

.lt-cell {
  flex: 1;
  text-align: center;
}

.lt-cell-bg {
  background: rgba(24, 144, 255, 0.07);
  border-radius: 4px;
  padding: 6px 4px;
}

.lt-num {
  font-size: 18px;
  font-weight: 700;
  line-height: 22px;
}

.lt-num.month {
  color: #21a6de;
}

.lt-num.year {
  color: #006bc9;
}

.lt-num.total {
  color: #1766db;
}

.lt-unit {
  font-size: 11px;
  font-weight: 400;
  margin-left: 2px;
  color: #667086;
}

.lt-sub {
  font-size: 12px;
  color: #667086;
  line-height: 16px;
}

/* ② 通水累计卡 */
.lt-title {
  font-size: 13px;
  font-weight: 600;
  color: #0f378c;
  margin-bottom: 6px;
}

.lt-range {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  color: #244165;
  margin-bottom: 6px;
}

.lt-acc {
  font-size: 13px;
  color: #244165;
  text-align: center;
  margin-bottom: 8px;
}

.lt-acc b {
  font-size: 15px;
  color: #1766db;
}

.lt-two {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
