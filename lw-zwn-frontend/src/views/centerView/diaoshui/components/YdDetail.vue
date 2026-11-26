<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getYdDetail } from '@/api/waterdisp'

/**
 * 永定河左侧专属详情面板（迁自旧项目 Wwtr_2.vue）：
 * 顶部指标（全线有水时间/累计生态水量/计划补水）+ 通水累计卡 + 官厅以上/及以下进度条。
 * 数据来自 /waterdisp/getYdDetail（GWAPP 区间过水量 + YDH 有水天数），与其他流域的月报明细不同。
 * 计划补水与进度条计划值旧项目已弃用（写死 '-'，进度条按 100% 展示），此处保持一致。
 */
const loading = ref(false)
const data = ref<any>(null)

async function loadData() {
  loading.value = true
  try {
    const res = await getYdDetail()
    if (res.code === 0 && res.data) {
      data.value = res.data
    }
  } catch (e) {
    console.warn('getYdDetail failed', e)
  } finally {
    loading.value = false
  }
}

function fmt(v: any, digits = 2) {
  if (v == null || v === '' || v === '-' || isNaN(Number(v))) {
    return '-'
  }
  return Number(v).toLocaleString('zh-CN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })
}

/** 万m³ → 亿m³（保留两位，同旧 Page_c zsd/10000） */
function toYi(v: any) {
  if (v == null || v === '' || isNaN(Number(v))) {
    return '-'
  }
  return fmt(Number(v) / 10000)
}

/** 进度条已完成值取整（同旧 Progress_c done.toFixed(0)） */
function fmtDone(v: any) {
  return fmt(v, 0)
}

onMounted(loadData)
</script>

<template>
  <n-spin :show="loading" class="yd-detail" content-style="height: 100%">
    <template v-if="data">
      <!-- 顶部指标（同旧 Page_p1：全线有水时间/累计生态水量/计划补水） -->
      <div class="metric-bar">
        <div class="metric-item">
          <div class="metric-value">{{ data.wsDays ?? '-' }}</div>
          <div class="metric-label">全线有水时间（天）</div>
        </div>
        <div class="metric-item">
          <div class="metric-value">{{ fmtDone(data.thisYearSum) }}</div>
          <div class="metric-label">累计生态水量（万m³）</div>
        </div>
        <div class="metric-item">
          <div class="metric-value">-</div>
          <div class="metric-label">计划补水（万m³）</div>
        </div>
      </div>

      <!-- 通水累计卡（同旧 Page_c：自2022年通水累计） -->
      <div class="cum-card">
        <div class="cum-title">永定河通水累计</div>
        <div class="cum-main">
          <span class="cum-label">通水累计</span>
          <span class="cum-value">{{ toYi(data.allSum) }}</span>
          <span class="cum-unit">亿m³</span>
        </div>
        <div class="cum-sub">
          <span>当年累计：{{ fmtDone(data.thisYearSum) }} 万m³</span>
          <span>当月累计：{{ fmtDone(data.thisMonthSum) }} 万m³</span>
        </div>
      </div>

      <!-- 官厅以上 / 官厅及以下（同旧 Progress_c：计划已弃用，进度条按 100% 展示） -->
      <div v-for="grp in ['GTYS', 'GTYX']" :key="grp" class="grp-card">
        <div class="grp-title">{{ grp === 'GTYS' ? '官厅以上' : '官厅及以下' }}</div>
        <div class="grp-bar"><div class="grp-bar-inner"></div></div>
        <div class="grp-row">
          <span>
            <i class="dot dot--done"></i>
            已完成：<b>{{ fmtDone(grp === 'GTYS' ? data.gtysSum : data.gtyxSum) }}</b>
            <span class="unit">万m³</span>
          </span>
          <span>
            <i class="dot dot--plan"></i>
            计划：<b>-</b>
            <span class="unit">万m³</span>
          </span>
          <span>
            <i class="dot dot--pct"></i>
            完成率：<b>-</b>
          </span>
        </div>
      </div>
    </template>
    <div v-else-if="!loading" class="empty-tip">暂无数据</div>
  </n-spin>
</template>

<style scoped lang="scss">
.yd-detail {
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.15);
    border-radius: 3px;
  }
}

.metric-bar {
  display: flex;
  border: 1px solid #9dbdeb;
  border-radius: 6px;
  background: rgba(230, 240, 255, 0.6);
  padding: 10px 8px;
  margin-bottom: 10px;

  .metric-item {
    flex: 1;
    text-align: center;
  }

  .metric-value {
    font-size: 18px;
    font-weight: 700;
    color: #006bc9;
  }

  .metric-label {
    font-size: 12px;
    color: #666;
    margin-top: 2px;
  }
}

.cum-card {
  border: 1px solid #9dbdeb;
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 10px;

  .cum-title {
    font-size: 13px;
    font-weight: 700;
    color: #0f378c;
    margin-bottom: 6px;
  }

  .cum-main {
    text-align: center;

    .cum-label {
      font-size: 12px;
      color: #666;
      margin-right: 6px;
    }

    .cum-value {
      font-size: 20px;
      font-weight: 700;
      color: #21a6df;
    }

    .cum-unit {
      font-size: 11px;
      color: #888;
      margin-left: 2px;
    }
  }

  .cum-sub {
    display: flex;
    justify-content: space-around;
    font-size: 12px;
    color: #666;
    margin-top: 6px;
  }
}

.grp-card {
  border: 1px solid #9dbdeb;
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 10px;

  .grp-title {
    font-size: 13px;
    font-weight: 700;
    color: #0f378c;
    margin-bottom: 8px;
  }

  .grp-bar {
    height: 5px;
    border-radius: 3px;
    background: #d2d2d2;
    overflow: hidden;
    margin-bottom: 8px;

    // 计划值旧项目已弃用（plan='-'），进度条按 100% 展示（同旧 Progress_c）
    .grp-bar-inner {
      width: 100%;
      height: 100%;
      background: #7674f9;
    }
  }

  .grp-row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #333;

    b {
      font-weight: 600;
    }

    .unit {
      font-size: 11px;
      color: #888;
      margin-left: 2px;
    }
  }

  .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 8px;
    margin-right: 3px;

    &--done {
      background: #7573f8;
    }

    &--plan {
      background: #b3b3b3;
    }

    &--pct {
      width: 7px;
      height: 7px;
      background: #fff;
      border: 1px solid #949396;
    }
  }
}

.empty-tip {
  padding: 16px 0;
  text-align: center;
  color: #999;
  font-size: 13px;
}
</style>
