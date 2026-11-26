<script setup lang="ts">
import EditModal from './components/EditModal.vue'
import DetailModal from './components/DetailModal.vue'
import useFetchTable from '@/hooks/web/useFetchTable'
import ProTable from '@/components/common/ProTable'
import { findSysTest2List, deleteSysTest2 } from '@/api/table/sysTest2'
import { shallowRef } from 'vue'
import type { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid'

const proTableRef = shallowRef<InstanceType<typeof ProTable>>()
const addModalRef = shallowRef<InstanceType<typeof EditModal>>()
const editModalRef = shallowRef<InstanceType<typeof EditModal>>()
const detailModalRef = shallowRef<InstanceType<typeof DetailModal>>()

const searchForm = reactive({
  name: '',
  status: null as number | null
})

const columns: VxeGridPropTypes.Columns = [
  { type: 'seq', title: '序号', align: 'center', width: 60 },
  { field: 'id', title: '主键', align: 'center', minWidth: 200 },
  { field: 'name', title: '名称', align: 'center', minWidth: 120 },
  { field: 'description', title: '描述', align: 'center', minWidth: 160 },
  {
    field: 'status',
    title: '状态',
    align: 'center',
    width: 100,
    slots: {
      default: ({ row }) => {
        const isEnable = row.status === 1
        return h(
          resolveComponent('n-tag'),
          { type: isEnable ? 'success' : 'error', size: 'small' },
          () => (isEnable ? '启用' : '禁用')
        )
      }
    }
  },
  {
    title: '操作',
    align: 'center',
    width: 220,
    fixed: 'right',
    slots: {
      default: ({ row }) => {
        return h(resolveComponent('n-space'), { justify: 'center' }, () => [
          h(
            resolveComponent('n-button'),
            { size: 'small', type: 'primary', quaternary: true, onClick: () => handleDetail(row) },
            () => '详情'
          ),
          h(
            resolveComponent('n-button'),
            { size: 'small', type: 'warning', quaternary: true, onClick: () => handleEdit(row) },
            () => '编辑'
          ),
          h(
            resolveComponent('n-button'),
            { size: 'small', type: 'error', quaternary: true, onClick: () => handleDelete(row) },
            () => '删除'
          )
        ])
      }
    }
  }
]

const table = useFetchTable({
  apiFun: findSysTest2List,
  params: searchForm,
  tableRef: proTableRef as any
})

const handleSearch = () => {
  table.pager.pageNumber = 1
  table.loadData()
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.status = null
  table.pager.pageNumber = 1
  table.loadData()
}

const handleAdd = () => {
  addModalRef.value?.show()
}

const handleEdit = (row: any) => {
  editModalRef.value?.show(row)
}

const handleDetail = (row: any) => {
  detailModalRef.value?.show(row.id)
}

const handleDelete = (row: any) => {
  window?.$dialog?.warning({
    title: '提示',
    content: '确定删除该条数据吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        const res = await deleteSysTest2(row.id)
        if (res.data.code === 200 || res.data.code === 0) {
          window.$message.success('删除成功')
          table.loadData()
        } else {
          window.$message.error(res.data.message || '删除失败')
        }
      } catch {
        window.$message.error('请求异常')
      }
    }
  })
}

const onEditConfirm = () => {
  table.loadData()
}
</script>

<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <div style="margin-bottom: 12px">
      <n-space align="center" :wrap="false">
        <n-input
          v-model:value="searchForm.name"
          placeholder="请输入名称"
          clearable
          style="width: 200px"
        />
        <n-select
          v-model:value="searchForm.status"
          placeholder="请选择状态"
          :options="[
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 }
          ]"
          clearable
          style="width: 150px"
        />
        <n-button type="primary" @click="handleSearch">查询</n-button>
        <n-button @click="handleReset">重置</n-button>
        <n-button type="primary" @click="handleAdd">新增</n-button>
      </n-space>
    </div>

    <div style="flex: 1">
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
          <n-empty description="暂无数据" />
        </template>
      </pro-table>
    </div>

    <edit-modal ref="addModalRef" mode="add" @confirm="onEditConfirm" />
    <edit-modal ref="editModalRef" mode="edit" @confirm="onEditConfirm" />
    <detail-modal ref="detailModalRef" />
  </div>
</template>

<style scoped></style>
