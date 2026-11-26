<script setup lang="ts">
import ProModal from '@/components/common/ProModal/ProModal.vue'
import { findSysTest2ById } from '@/api/table/sysTest2'

const visible = ref(false)
const detail = ref<Record<string, any>>({})

const show = async (id: string) => {
  try {
    const res = await findSysTest2ById(id)
    debugger
    if (res.code === 200 || res.code === 0) {
      detail.value = res.data || {}
      visible.value = true
    } else {
      window.$message.error(res.data.message || '获取详情失败')
    }
  } catch {
    window.$message.error('请求异常')
  }
}

const hide = () => {
  visible.value = false
}

defineExpose({ show, hide })
</script>

<template>
  <pro-modal v-model:show="visible" title="详情" :style-params="{ width: '600px', height: 'auto' }">
    <n-descriptions label-placement="left" bordered :column="1">
      <n-descriptions-item label="主键">{{ detail.id }}</n-descriptions-item>
      <n-descriptions-item label="名称">{{ detail.name }}</n-descriptions-item>
      <n-descriptions-item label="描述">{{ detail.description }}</n-descriptions-item>
      <n-descriptions-item label="状态">
        <n-tag :type="detail.status === 1 ? 'success' : 'error'">
          {{ detail.status === 1 ? '启用' : '禁用' }}
        </n-tag>
      </n-descriptions-item>
    </n-descriptions>
    <template #action>
      <n-space justify="end">
        <n-button @click="hide">关闭</n-button>
      </n-space>
    </template>
  </pro-modal>
</template>

<style scoped></style>
