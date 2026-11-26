<script setup lang="ts">
import { computed } from 'vue'
import StationCard from './StationCard.vue'

// 由父组件传入考核年份
const props = defineProps<{ year: string }>()
// 点击站点卡片 → 通知父组件打开考核详情弹窗
const emit = defineEmits<{ select: [name: string] }>()

// 站点数据（演示数据，后续接接口替换）
interface StationItem {
  id: number
  name: string
  dotColor: string
  target: number
  yearTotal: number
  rate: number
  monthlyValues: number[]
  warnings: { level: string; count: number; date: string }[]
}

const STATION_DATA: Record<string, StationItem[]> = {
  '2026': [
    {
      id: 1,
      name: '岳城水库',
      dotColor: '#39e6a3',
      target: 3200,
      yearTotal: 3848,
      rate: 105,
      monthlyValues: [280, 260, 310, 290, 320, 340, 350, 330, 310, 290, 270, 300],
      warnings: [{ level: '一', count: 2, date: '2025年9月' }]
    },
    {
      id: 2,
      name: '祝官屯节制闸',
      dotColor: '#ffd94d',
      target: 3384,
      yearTotal: 1489.7,
      rate: 44,
      monthlyValues: [180, 160, 150, 130, 120, 110, 100, 95, 90, 85, 80, 90],
      warnings: []
    }
  ],
  '2025': [
    {
      id: 1,
      name: '岳城水库',
      dotColor: '#39e6a3',
      target: 3200,
      yearTotal: 3100,
      rate: 97,
      monthlyValues: [260, 250, 270, 260, 280, 290, 300, 280, 270, 250, 240, 260],
      warnings: []
    },
    {
      id: 2,
      name: '祝官屯节制闸',
      dotColor: '#ffd94d',
      target: 3384,
      yearTotal: 2030,
      rate: 60,
      monthlyValues: [200, 190, 180, 170, 175, 180, 185, 170, 160, 155, 150, 145],
      warnings: [{ level: '二', count: 3, date: '2025年8月' }]
    }
  ]
}

// 当前年份站点列表（响应父组件 year 变化）
const stationList = computed<StationItem[]>(() => STATION_DATA[props.year] ?? [])

function onCardClick(station: StationItem) {
  emit('select', station.name)
}
</script>

<template>
  <!-- 站点卡片循环 -->
  <div class="station-list">
    <StationCard
      v-for="s in stationList"
      :key="s.id"
      :name="s.name"
      :dot-color="s.dotColor"
      :target="s.target"
      :year-total="s.yearTotal"
      :rate="s.rate"
      :monthly-values="s.monthlyValues"
      :warnings="s.warnings"
      @card-click="onCardClick(s)"
    />
  </div>
</template>

<style scoped lang="scss">
/* 站点列表 */
.station-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
