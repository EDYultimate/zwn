<script setup lang="ts">
// ============================================================
// 知识库 · 重命名文档弹框
// 只收集新文件名，落库由父页面调用 PUT /knowledge/files/{fileId}
// 后端只改展示名与文档标题，不移动 MinIO 对象，原文链接不受影响
// ============================================================
import { nextTick, ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'

interface RenamePayload {
  fileId: string
  fileName: string
}

const emit = defineEmits<{ submit: [payload: RenamePayload] }>()

const visible = ref(false)
const fileId = ref('')
const oldName = ref('')
const fileName = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

/** 打开弹框并回填当前文件名 */
function show(row: { fileId?: string; fileName?: string }) {
  fileId.value = row.fileId ?? ''
  oldName.value = row.fileName ?? ''
  fileName.value = row.fileName ?? ''
  visible.value = true
  nextTick(() => {
    inputRef.value?.focus()
    // 只选中扩展名之前的部分，便于直接改名
    const dot = fileName.value.lastIndexOf('.')
    inputRef.value?.setSelectionRange(0, dot > 0 ? dot : fileName.value.length)
  })
}
defineExpose({ show })

function submit() {
  const value = fileName.value.trim()
  if (!value) {
    window.$message?.warning('请输入文件名称')
    return
  }
  if (value.length > 255) {
    window.$message?.warning('文件名称不能超过 255 个字符')
    return
  }
  visible.value = false
  emit('submit', { fileId: fileId.value, fileName: value })
}
</script>

<template>
  <pro-modal
    v-model:show="visible"
    title="重命名文档"
    table-theme="light"
    content-mode="fill"
    default-padding="10px 24px 0"
    :style-params="{ width: '520px' }"
  >
    <div class="rn-form">
      <div class="fitem">
        <span class="lbl req">文件名称</span>
        <span class="ctl">
          <input
            ref="inputRef"
            v-model="fileName"
            type="text"
            maxlength="255"
            placeholder="请输入新的文件名称"
            @keydown.enter.prevent="submit"
          />
        </span>
      </div>
      <p class="hint">
        当前名称：{{ oldName || '—' }}。改名只影响列表展示与文档标题，不移动对象存储中的原件。
      </p>
    </div>

    <template #action>
      <div class="rn-foot">
        <button class="rn-btn" type="button" @click="visible = false">取 消</button>
        <button class="rn-btn primary" type="button" @click="submit">确 定</button>
      </div>
    </template>
  </pro-modal>
</template>

<style scoped lang="scss">
.rn-form {
  padding: 8px 0 14px;
}

.fitem {
  display: flex;
  align-items: center;

  > .lbl {
    flex: none;
    width: 84px;
    padding-right: 10px;
    font-size: 13px;
    color: #41577a;
    text-align: right;

    &.req::before {
      margin-right: 2px;
      color: #e2564a;
      content: '*';
    }
  }

  .ctl {
    display: flex;
    flex: 1;
    min-width: 0;
  }

  input {
    box-sizing: border-box;
    width: 100%;
    height: 32px;
    padding: 0 10px;
    font-family: inherit;
    font-size: 13px;
    color: #24466f;
    background: #fff;
    border: 1px solid #bcd7f7;
    border-radius: 4px;
    outline: none;

    &:focus {
      box-shadow: 0 0 0 2px rgba(63, 151, 242, 0.18);
    }
  }
}

.hint {
  margin: 10px 0 0 84px;
  font-size: 12px;
  line-height: 1.7;
  color: #8aa3c4;
}

.rn-foot {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 8px 0 10px;
}

.rn-btn {
  width: 86px;
  height: 30px;
  font-family: inherit;
  font-size: 13px;
  color: #fff;
  cursor: pointer;
  background: #a9bdd6;
  border: none;
  border-radius: 15px;

  &.primary {
    background: linear-gradient(180deg, #4fa0f4, #1f6fd6);
  }

  &:hover {
    filter: brightness(1.06);
  }
}
</style>
