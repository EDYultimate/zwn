<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getYdLyds } from '@/api/waterdisp'

/**
 * 永定河详情块（旧项目 wwtr_2 + queryYdhDatasNew 复刻）
 *
 * ① 指标：全线有水时间（YDH_SZLS.WQD_WC_DU 最新一条 WSDAYS）/ 累计生态水量（= 本年官厅以上+以下合计，同旧页面）/
 *    计划补水（YDH_SZLS.WR_WTS_B 计划合计；当年无计划时后端回退到最近有计划的调水年并回传 planYear）
 * ② 通水累计（自2022年）：GWAPP.APP_DAY_W_R，口径只取 SUM(AWQ)*8.64（与旧 queryDateRangeSumData 一致）
 * ③ 官厅以上 / 官厅及以下：本年完成 + 计划 + 完成率（旧 Progress_c）
 */
const props = defineProps<{ date?: string }>()

const data = ref<any>(null)

async function load() {
  try {
    const res = await getYdLyds({ date: props.date })
    if (res.code === 0 && res.data) {
      data.value = res.data
    }
  } catch (e) {
    console.warn('YdBlocks: 加载永定河详情块失败', e)
  }
}
watch(() => props.date, load, { immediate: true })

const fmtYi = (wan: any) => {
  const n = Number(wan)
  return isFinite(n) ? (n / 10000).toFixed(2) : '-'
}
const fmtWan = (wan: any, digits = 0) => {
  const n = Number(wan)
  return isFinite(n) ? n.toLocaleString('zh-CN', { maximumFractionDigits: digits }) : '-'
}
const yearCn = computed(() => (data.value?.date ? `${String(data.value.date).slice(0, 4)}年` : '-'))
/** 累计生态水量（旧页面 = 本年官厅以上 + 以下） */
const ecoYear = computed(() =>
  data.value ? Number(data.value.gtys?.year || 0) + Number(data.value.gtyx?.year || 0) : 0
)
const planTotal = computed(() =>
  data.value ? Number(data.value.gtys?.plan || 0) + Number(data.value.gtyx?.plan || 0) : 0
)
/** 完成率：有计划才算，否则与旧页面一致显示 '-' */
const pctOf = (g: any) => {
  const plan = Number(g?.plan || 0)
  if (!plan) {
    return '-'
  }
  return Math.min(100, Math.max(0, Math.round((Number(g?.year || 0) / plan) * 100)))
}
</script>

<template>
  <div v-if="data" class="yd-blocks">
    <!-- ① 指标（旧 Page_p1） -->
    <div class="yd-card">
      <div class="yd-title">永定河生态补水指标</div>
      <div class="yd-row">
        <div class="yd-item">
          <div class="yd-num">{{ fmtWan(data.wsdays) }}<span class="yd-unit">天</span></div>
          <div class="yd-sub">全线有水时间</div>
        </div>
        <div class="yd-item">
          <div class="yd-num">{{ fmtYi(ecoYear) }}<span class="yd-unit">亿m³</span></div>
          <div class="yd-sub">累计生态水量</div>
        </div>
        <div class="yd-item">
          <div class="yd-num">
            {{ planTotal ? fmtWan(planTotal) : '-'
            }}<span v-if="planTotal" class="yd-unit">万m³</span>
          </div>
          <div class="yd-sub">
            计划补水<span v-if="data.planYear" class="yd-tm">（{{ data.planYear }}年）</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ② 通水累计（旧 Page_c「自2022年通水累计」） -->
    <div class="yd-card">
      <div class="yd-title">永定河通水累计（自2022年）</div>
      <div class="yd-row">
        <div class="yd-item">
          <div class="yd-num month">{{ fmtWan(data.month) }}<span class="yd-unit">万m³</span></div>
          <div class="yd-sub">{{ String(data.monthStart || '').slice(0, 7) }}</div>
        </div>
        <div class="yd-item">
          <div class="yd-num year">{{ fmtYi(data.year) }}<span class="yd-unit">亿m³</span></div>
          <div class="yd-sub">{{ yearCn }}</div>
        </div>
        <div class="yd-item">
          <div class="yd-num total">{{ fmtYi(data.all) }}<span class="yd-unit">亿m³</span></div>
          <div class="yd-sub">通水累计</div>
        </div>
      </div>
    </div>

    <!-- ③ 官厅以上 / 官厅及以下进度（旧 Progress_c） -->
    <div v-for="(g, idx) in [data.gtys, data.gtyx]" :key="idx" class="yd-card">
      <div class="yd-title">
        {{ idx === 0 ? '官厅以上' : '官厅及以下' }}
        <span v-if="data.planYear" class="yd-tm">（计划 {{ data.planYear }} 年）</span>
      </div>
      <div class="yd-bar">
        <i :style="{ width: pctOf(g) === '-' ? '100%' : pctOf(g) + '%' }"></i>
      </div>
      <div class="yd-row">
        <div class="yd-item">
          <div class="yd-num month">{{ fmtWan(g?.year) }}<span class="yd-unit">万m³</span></div>
          <div class="yd-sub">已完成（本年）</div>
        </div>
        <div class="yd-item">
          <div class="yd-num plan">
            {{ g?.plan ? fmtWan(g.plan) : '-' }}<span v-if="g?.plan" class="yd-unit">万m³</span>
          </div>
          <div class="yd-sub">计划</div>
        </div>
        <div class="yd-item">
          <div class="yd-num year">
            {{ pctOf(g) }}<span v-if="pctOf(g) !== '-'" class="yd-unit">%</span>
          </div>
          <div class="yd-sub">完成率</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.yd-blocks {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.yd-card {
  background: rgba(24, 144, 255, 0.06);
  border-radius: 6px;
  padding: 8px 10px;
}

.yd-title {
  font-size: 13px;
  font-weight: 600;
  color: #0f378c;
  margin-bottom: 6px;
}

.yd-tm {
  font-weight: 400;
  color: #667086;
  font-size: 12px;
}

.yd-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.yd-item {
  flex: 1;
  text-align: center;
}

.yd-num {
  font-size: 18px;
  font-weight: 700;
  line-height: 22px;
}

.yd-num.month {
  color: #21a6de;
}

.yd-num.year {
  color: #006bc9;
}

.yd-num.total {
  color: #1766db;
}

.yd-num.plan {
  color: #949396;
}

.yd-unit {
  font-size: 11px;
  font-weight: 400;
  margin-left: 2px;
  color: #667086;
}

.yd-sub {
  font-size: 12px;
  color: #667086;
  line-height: 16px;
}

.yd-bar {
  height: 6px;
  border-radius: 3px;
  background: #d2d2d2;
  overflow: hidden;
  margin-bottom: 6px;
}

.yd-bar i {
  display: block;
  height: 100%;
  background: #7674f9;
}
</style>
