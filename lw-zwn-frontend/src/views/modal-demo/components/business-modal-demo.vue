<script setup lang="ts">
import ProModal from '@/components/common/ProModal/ProModal.vue'
import ProTable from '@/components/common/ProTable'
import useFetchTable from '@/hooks/web/useFetchTable'
import { shallowRef } from 'vue'
import { findTestList } from '@/api/table'
import { globalPageSize } from '@/config/pagination'
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
  tableRef: proTableRef as any,
  isInit: false
})

const messageDemo = () => {
  window.$message.destroyAll()
  window.$notification.destroyAll()
  //消息提示
  window.$message.info('常规')
  window.$message.success('成功')
  window.$message.warning('警告')
  window.$message.error('错误')
  window.$message.loading('运行中')
  //通知提示
  window.$notification.info({ title: '测试', duration: 1000 })
  window.$notification.success({ title: '测试', duration: 1000 })
  window.$notification.warning({ title: '测试', duration: 1000 })
  window.$notification.error({ title: '测试', duration: 1000 })
  //页面加载进度条
  window.$loadingBar.start()
  setTimeout(() => {
    window.$loadingBar.error()
  }, 3000)
}
const init = () => {
  table.loadData()
}
//内部控制显隐,减少心智负担
const visible = ref(false)
const show = () => {
  visible.value = true
}
const hide = () => {
  visible.value = false
}
const closeModel = () => {
  table.pager.pageNumber = 1
  table.pager.pageSize = globalPageSize.value
}
//内部暴露方法方便外部组织调用
defineExpose({ show, hide, init })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    title="测试封装弹窗组件与ProTable组件结合"
    :is-full-screen="true"
    content-mode="fill"
    header-background-color="#3053b1"
    :style-params="{ width: '1000px', height: '600px' }"
    @open-modal="init"
    @close-modal="closeModel"
  >
    <div style="height: calc(100%)">
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
      </pro-table>
    </div>
    <template #action>
      <n-space justify="end">
        <n-button type="default" @click="messageDemo">取消</n-button>
        <n-button type="primary" @click="messageDemo">确认</n-button>
      </n-space>
    </template>
  </pro-modal>
</template>

<style scoped></style>
