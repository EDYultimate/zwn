<template>
  <div style="height: 100%">
    <pro-table
      ref="proTableRef"
      :columns="columns"
      :loading="table.loading"
      :data="table.data"
      :pager="table.pager"
      :is-pagination="true"
      height="auto"
      @page-change="table.pageChange"
    >
      <template #empty>
        <n-empty description="暂无数据"></n-empty>
      </template>
      <template #pager-left>
        <n-space direction="left">
          （提示：<span style="color: #18a058">这里可以加表格全局提示</span>）
        </n-space>
      </template>
    </pro-table>
  </div>
</template>

<script setup lang="ts">
import { findTestList } from '@/api/table'
import useFetchTable from '@/hooks/web/useFetchTable'
import ProTable from '@/components/common/ProTable'
import { shallowRef } from 'vue'
import type { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid'

const proTableRef = shallowRef<InstanceType<typeof ProTable>>()

const columns: VxeGridPropTypes.Columns = [
  { type: 'seq', title: '序号', align: 'center' },
  { field: 'id', title: '主键', align: 'center' },
  { field: 'name', title: '名称', align: 'center' },
  { field: 'description', title: '内容', align: 'center' },
  { field: 'status', title: '状态', align: 'center' }
]

const table = useFetchTable({
  apiFun: findTestList,
  params: {},
  tableRef: proTableRef as any
})
</script>

<style scoped></style>
