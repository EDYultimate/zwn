<script setup lang="ts">
// ============================================================
// 历次巡查记录弹框（复刻原型 openRptHis）
// 表格列：巡查时间 / 巡查单位 / 发现问题 / 处理情况
// ============================================================
import { computed, ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import ProTable from '@/components/common/ProTable'
import type { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid'

// 单条巡查记录
export interface RptHisRow {
  time: string
  unit: string
  issue: string
  action: string
}

const visible = ref(false)
const name = ref('')
const rows = ref<RptHisRow[]>([])

const title = computed(() => `${name.value} · 历次巡查记录`)

// 列表列：发现问题 / 处理情况为长文本，允许换行左对齐
const columns: VxeGridPropTypes.Columns = [
  { field: 'time', title: '巡查时间', minWidth: 90, align: 'center' },
  { field: 'unit', title: '巡查单位', minWidth: 80, align: 'center' },
  { field: 'issue', title: '发现问题', minWidth: 150, className: 'wrap-cell' },
  { field: 'action', title: '处理情况', minWidth: 150, className: 'wrap-cell' }
]

/** 打开弹框（传入取水口名称与巡查记录） */
function show(nm: string, list: RptHisRow[]) {
  name.value = nm
  rows.value = list
  visible.value = true
}

defineExpose({ show })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    :title="title"
    table-theme="light"
    content-mode="scroll"
    default-padding="12px 20px 16px"
    :style-params="{ width: '760px', height: '460px' }"
  >
    <div class="pt-table-wrap">
      <pro-table :columns="columns" :data="rows" :is-pagination="false" height="" />
    </div>
  </pro-modal>
</template>

<style scoped lang="scss">
/* 长文本列：允许换行、左对齐（语义化扩展，尺寸沿用全局表格标准） */
:deep(.wrap-cell) .vxe-cell {
  white-space: normal !important;
  text-align: left;
  line-height: 1.7;
}
</style>
