<script setup lang="ts">
import { computed } from 'vue'

interface DetailData {
  yr?: number
  mn?: number
  lineCd?: string
  showEco?: boolean
  detail?: Record<string, any>[]
  unit?: string | null
  stDt?: string | null
  noteCnt?: string | null
}

interface Props {
  detail: DetailData
}

const props = withDefaults(defineProps<Props>(), {
  detail: () => ({}) as DetailData
})

// 数值列渲染：保留原值（万m³），空值显示 -
function numCol(key: string, title: string, width = 90) {
  return {
    key,
    title,
    width,
    render: (row: Record<string, any>) => {
      const v = row[key]
      return v == null || v === '' ? '-' : v
    }
  }
}

const columns = computed(() => {
  const cols: any[] = [
    { key: 'CTG_NM', title: '分类', width: 90 },
    { key: 'PRJ_NM', title: '工程/项目', width: 110 },
    numCol('MN_PLN_QTY', '当月计划'),
    numCol('MN_CMP_QTY', '当月完成'),
    numCol('YR_PLN_QTY', '年计划'),
    numCol('YR_CMP_QTY', '年完成'),
    numCol('SQ_PRG', '时序进度'),
    numCol('CMP_RAT', '完成率'),
    numCol('WSP_PER', '供水占比')
  ]
  if (props.detail.showEco) {
    cols.push(numCol('ECO_QTY', '生态水量'))
  }
  return cols
})

const rows = computed(() => props.detail.detail || [])
</script>

<template>
  <div class="line-detail-table">
    <n-data-table
      :columns="columns"
      :data="rows"
      :bordered="true"
      size="small"
      :max-height="320"
      :scroll-x="props.detail.showEco ? 860 : 770"
    />
    <div v-if="detail.unit || detail.stDt" class="detail-meta">
      <span v-if="detail.unit">单位：{{ detail.unit }}</span>
      <span v-if="detail.stDt">统计截止：{{ detail.stDt }}</span>
    </div>
    <div v-if="detail.noteCnt" class="detail-note">{{ detail.noteCnt }}</div>
  </div>
</template>

<style scoped lang="scss">
.line-detail-table {
  width: 100%;
}

.detail-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #666;
  padding: 6px 2px 0;
}

.detail-note {
  font-size: 12px;
  color: #666;
  padding: 4px 2px 0;
  line-height: 1.5;
  white-space: pre-line;
  word-break: break-all;
}
</style>
