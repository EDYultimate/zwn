<script setup lang="ts">
import { computed } from 'vue'

// 由父组件传入考核日期（yyyy-MM-dd）
const props = defineProps<{ date: string }>()
// 点击站点项 → 通知父组件打开考核详情弹窗
const emit = defineEmits<{ select: [name: string] }>()

// 断面数据（演示数据，后续接接口替换）
interface FlowStation {
  id: number
  name: string
  flow: number // 当日流量 m³/s
  target: number // 目标流量 m³/s
}

const stationList: FlowStation[] = [
  { id: 1, name: '祝官屯节制闸', flow: 1.375, target: 0.8 },
  { id: 2, name: '四女寺枢纽（南进洪闸）', flow: 0.62, target: 0.8 },
  { id: 3, name: '王营盘拦河闸', flow: 1.375, target: 0.8 },
  { id: 4, name: '罗塞拦河闸', flow: 1.375, target: 0.8 },
  { id: 5, name: '庆云拦河闸', flow: 1.375, target: 0.8 },
  { id: 6, name: '辛集挡潮闸', flow: 1.375, target: 0.8 }
]

// 是否达标：当日流量 ≥ 目标流量
function isQualified(s: FlowStation): boolean {
  return s.flow >= s.target
}

// 断面总数 / 当日达标数
const total = computed(() => stationList.length)
const qualifiedCount = computed(() => stationList.filter(isQualified).length)
</script>

<template>
  <div class="flow-panel">
    <!-- 统计概览 -->
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-title">流量考核断面</div>
        <div class="stat-main">
          <span class="stat-num">{{ total }}</span>
          <span class="stat-unit">个</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-title">
          当日达标断面
          <span class="stat-date">{{ props.date }}</span>
        </div>
        <div class="stat-main">
          <span class="stat-num">{{ qualifiedCount }}/{{ total }}</span>
          <span class="stat-tag">达标</span>
        </div>
      </div>
    </div>

    <!-- 断面列表 -->
    <div class="station-list">
      <div v-for="s in stationList" :key="s.id" class="flow-item" @click="emit('select', s.name)">
        <span class="marker"></span>
        <div class="item-main">
          <div class="item-head">
            <span class="item-name">{{ s.name }}</span>
            <span class="item-badge" :class="isQualified(s) ? 'ok' : 'warn'">
              {{ isQualified(s) ? '达标' : '低于目标' }}
            </span>
          </div>
          <div class="item-sub">
            <span class="sub-date">{{ props.date }}</span>
            <span class="sub-flow">{{ s.flow.toFixed(3) }}m³/s</span>
            <span class="sub-sep">|</span>
            <span class="sub-target">目标≥{{ s.target.toFixed(3) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.flow-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 统计概览两卡 */
.stat-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  .stat-card {
    padding: 10px 12px;
    background: linear-gradient(160deg, rgba(20, 70, 160, 0.4), rgba(10, 38, 90, 0.45));
    border: 1px solid rgba(80, 170, 255, 0.3);
    border-radius: 6px;
  }

  .stat-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: #9dc4f0;
    margin-bottom: 6px;
  }

  .stat-date {
    font-size: 11px;
    color: #7fa5d2;
    font-variant-numeric: tabular-nums;
  }

  .stat-main {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .stat-num {
    font-size: 24px;
    font-weight: 800;
    color: #6fd8f0;
    line-height: 1.2;
    font-variant-numeric: tabular-nums;
  }

  .stat-unit {
    font-size: 12px;
    color: #8ab8e8;
  }

  .stat-tag {
    font-size: 13px;
    font-weight: 600;
    color: #39e6a3;
  }
}

/* 断面列表 */
.station-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.flow-item {
  display: flex;
  align-items: stretch;
  gap: 10px;
  padding: 10px 12px;
  cursor: pointer;
  background: linear-gradient(160deg, rgba(20, 70, 160, 0.35), rgba(10, 38, 90, 0.4));
  border: 1px solid rgba(80, 170, 255, 0.25);
  border-radius: 6px;
  transition:
    box-shadow 0.3s ease,
    border-color 0.3s ease;

  /* 鼠标经过：边框高亮 + 外发光 */
  &:hover {
    border-color: rgba(87, 199, 255, 0.8);
    box-shadow:
      0 0 15px rgba(87, 199, 255, 0.35),
      0 0 30px rgba(87, 199, 255, 0.15),
      inset 0 0 20px rgba(87, 199, 255, 0.08);
  }

  /* 左侧发光竖条（固定高度，垂直居中，不撑满整行） */
  .marker {
    width: 4px;
    height: 16px;
    flex: none;
    align-self: center;
    border-radius: 2px;
    background: linear-gradient(180deg, #57c7ff, #1f6fd6);
    box-shadow: 0 0 6px rgba(87, 199, 255, 0.6);
    margin-top: -15px;
  }

  .item-main {
    flex: 1;
    min-width: 0;
  }

  .item-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 4px;
  }

  .item-name {
    font-size: 14px;
    font-weight: 600;
    color: #eaf5ff;
    letter-spacing: 1px;
  }

  .item-badge {
    flex: none;
    padding: 1px 10px;
    font-size: 11px;
    font-weight: 600;
    border-radius: 9px;
    white-space: nowrap;

    &.ok {
      color: #39e6a3;
      background: rgba(37, 201, 138, 0.15);
      border: 1px solid rgba(57, 230, 163, 0.45);
    }

    &.warn {
      color: #4a3600;
      background: linear-gradient(180deg, #ffd94d, #f0a93c);
      border: 1px solid rgba(255, 217, 77, 0.6);
    }
  }

  .item-sub {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #7fa5d2;
    font-variant-numeric: tabular-nums;

    .sub-flow {
      color: #6fd8f0;
      font-weight: 700;
    }

    .sub-sep {
      color: rgba(127, 165, 210, 0.5);
    }
  }
}
</style>
