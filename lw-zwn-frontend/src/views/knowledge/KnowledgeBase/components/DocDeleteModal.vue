<script setup lang="ts">
// ============================================================
// 知识库 · 删除文档确认弹框
// 确认后由父页面调 DELETE /knowledge/files/{fileId}：
// 后端删 MinIO 对象 + 达梦元数据，最后一个文件时连带文档与向量
// ============================================================
import { ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'

defineProps<{
  docName: string
  bizName: string
}>()

const emit = defineEmits<{ confirm: [] }>()

const visible = ref(false)

/** 打开确认框 */
function show() {
  visible.value = true
}

/** 确认删除 */
function confirm() {
  visible.value = false
  emit('confirm')
}

defineExpose({ show })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    title="删除确认"
    table-theme="light"
    content-mode="fill"
    default-padding="0"
    :style-params="{ width: '540px' }"
  >
    <div class="lcm-confirm">
      确定从「<b>{{ bizName }}</b
      >」中删除文档 <b>{{ docName }}</b> 吗？<br />
      删除后该文件的对象存储原件、元数据与向量将一并移除，且不可恢复。
    </div>

    <template #action>
      <div class="lcm-foot">
        <button class="lcm-btn" type="button" @click="visible = false">取 消</button>
        <button class="lcm-btn danger" type="button" @click="confirm">删 除</button>
      </div>
    </template>
  </pro-modal>
</template>

<style scoped lang="scss">
@use '@/assets/style/lic-modal-common.scss' as lic;

.lcm-confirm {
  padding: 34px 30px;
  font-size: lic.$font-md;
  line-height: 2;
  color: #2a4a72;
  text-align: center;

  b {
    color: #1f7ae0;
  }
}
.lcm-foot {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 8px 0 10px;
}
.lcm-btn {
  width: 96px;
  height: 30px;
  font-family: inherit;
  font-size: lic.$font-btn;
  color: #fff;
  cursor: pointer;
  background: #a9bdd6;
  border: none;
  border-radius: 15px;
  &.danger {
    background: linear-gradient(180deg, #f07b70, #e2564a);
  }
  &:hover {
    filter: brightness(1.06);
  }
}
</style>
