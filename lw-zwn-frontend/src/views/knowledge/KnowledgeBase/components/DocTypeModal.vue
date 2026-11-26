<script setup lang="ts">
// ============================================================
// 知识库 · 文档类型新增 / 重命名弹框
// 仅负责收集名称，落库由父页面调用 /knowledge/doc-types 完成
// ============================================================
import { computed, nextTick, ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'

interface DocTypeModalPayload {
  mode: 'create' | 'rename'
  parentId?: string | null
  typeId?: string
  name: string
}

interface ShowOptions {
  mode: 'create' | 'rename'
  title: string
  parentId?: string | null
  parentName?: string
  typeId?: string
  name?: string
}

const emit = defineEmits<{ submit: [payload: DocTypeModalPayload] }>()

const visible = ref(false)
const mode = ref<'create' | 'rename'>('create')
const title = ref('')
const parentId = ref<string | null>(null)
const parentName = ref('')
const typeId = ref('')
const name = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const hint = computed(() =>
  mode.value === 'create' ? `父类型：${parentName.value || '根节点'}` : '修改后立即生效'
)

function show(opts: ShowOptions) {
  mode.value = opts.mode
  title.value = opts.title
  parentId.value = opts.parentId ?? null
  parentName.value = opts.parentName ?? ''
  typeId.value = opts.typeId ?? ''
  name.value = opts.name ?? ''
  visible.value = true
  nextTick(() => inputRef.value?.focus())
}
defineExpose({ show })

function submit() {
  const value = name.value.trim()
  if (!value) {
    window.$message?.warning('请输入类型名称')
    return
  }
  if (value.length > 64) {
    window.$message?.warning('类型名称不能超过 64 个字')
    return
  }
  visible.value = false
  emit('submit', {
    mode: mode.value,
    parentId: parentId.value,
    typeId: typeId.value,
    name: value
  })
}
</script>

<template>
  <pro-modal
    v-model:show="visible"
    :title="title"
    table-theme="light"
    content-mode="fill"
    default-padding="10px 24px 0"
    :style-params="{ width: '480px' }"
  >
    <div class="type-form">
      <div class="fitem">
        <span class="lbl req">类型名称</span>
        <span class="ctl">
          <input
            ref="inputRef"
            v-model="name"
            type="text"
            maxlength="64"
            placeholder="如：跨省河流水量分配"
            @keydown.enter.prevent="submit"
          />
        </span>
      </div>
      <p class="hint">{{ hint }}</p>
    </div>

    <template #action>
      <div class="type-foot">
        <button class="tbtn" type="button" @click="visible = false">取 消</button>
        <button class="tbtn primary" type="button" @click="submit">确 定</button>
      </div>
    </template>
  </pro-modal>
</template>

<style scoped lang="scss">
.type-form {
  padding: 6px 0 14px;
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
  color: #8aa3c4;
}

.type-foot {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 8px 0 10px;
}

.tbtn {
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
