<script setup lang="ts">
import ProModal from '@/components/common/ProModal/ProModal.vue'
import { addSysTest2, updateSysTest2 } from '@/api/table/sysTest2'

const props = defineProps<{
  mode: 'add' | 'edit'
}>()

const visible = ref(false)
const formRef = ref()
const saving = ref(false)

const formData = reactive({
  id: null as string | null,
  name: '',
  description: '',
  status: null as number | null
})

const rules = {
  name: { required: true, message: '请输入名称', trigger: 'blur' }
}

const show = (row?: any) => {
  if (row && props.mode === 'edit') {
    formData.id = row.id
    formData.name = row.name
    formData.description = row.description
    formData.status = row.status
  } else {
    formData.id = null
    formData.name = ''
    formData.description = ''
    formData.status = null
  }
  visible.value = true
}

const hide = () => {
  visible.value = false
}

const emit = defineEmits(['confirm'])

const handleConfirm = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  saving.value = true
  try {
    const apiFun = props.mode === 'add' ? addSysTest2 : updateSysTest2
    const res = await apiFun({ ...formData })
    if (res.code === 200 || res.code === 0) {
      window.$message.success(props.mode === 'add' ? '新增成功' : '修改成功')
      emit('confirm')
      hide()
    } else {
      window.$message.error(res.data.message || '操作失败')
    }
  } catch {
    window.$message.error('请求异常')
  } finally {
    saving.value = false
  }
}

defineExpose({ show, hide })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    :title="mode === 'add' ? '新增' : '编辑'"
    :style-params="{ width: '600px', height: 'auto' }"
  >
    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="left"
      label-width="80px"
    >
      <n-form-item label="名称" path="name">
        <n-input v-model:value="formData.name" placeholder="请输入名称" />
      </n-form-item>
      <n-form-item label="描述" path="description">
        <n-input
          v-model:value="formData.description"
          type="textarea"
          placeholder="请输入描述"
          :rows="3"
        />
      </n-form-item>
      <n-form-item label="状态" path="status">
        <n-select
          v-model:value="formData.status"
          placeholder="请选择状态"
          :options="[
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 }
          ]"
          clearable
        />
      </n-form-item>
    </n-form>
    <template #action>
      <n-space justify="end">
        <n-button @click="hide">取消</n-button>
        <n-button type="primary" :loading="saving" @click="handleConfirm">确认</n-button>
      </n-space>
    </template>
  </pro-modal>
</template>

<style scoped></style>
