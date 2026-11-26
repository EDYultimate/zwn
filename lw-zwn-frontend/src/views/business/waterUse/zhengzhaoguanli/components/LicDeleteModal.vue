<script setup lang="ts">
// ============================================================
// 删除证照确认弹框（复刻原型 confirmLicDel 浅色小弹框）
// 取消 / 删除（danger），确认后由父组件负责移除记录
// ============================================================
import { ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'

const visible = ref(false)
const rec = ref<any>(null)

const emit = defineEmits<{ confirm: [record: any] }>()

/** 打开弹框（传入待删除记录） */
function show(c: any) {
  rec.value = c
  visible.value = true
}

function onCancel() {
  visible.value = false
}

function onConfirm() {
  visible.value = false
  emit('confirm', rec.value)
}

defineExpose({ show })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    title="删除确认"
    table-theme="light"
    content-mode="fill"
    :style-params="{ width: '520px' }"
  >
    <div class="lcm-confirm">
      确定删除许可证 <b>{{ rec?.cert }}</b
      >（{{ rec?.owner }}）吗？<br />删除后该证照及其取水口信息将一并移除，且不可恢复。
    </div>

    <template #action>
      <div class="lcm-foot">
        <button class="lcm-btn" type="button" @click="onCancel">取 消</button>
        <button class="lcm-btn danger" type="button" @click="onConfirm">删 除</button>
      </div>
    </template>
  </pro-modal>
</template>

<style scoped lang="scss">
/* 确认文案 */
.lcm-confirm {
  padding: 16px 4px 6px;
  font-size: 13.5px;
  line-height: 1.8;
  color: #41577a;

  b {
    color: #22436f;
  }
}

/* 底部按钮（原型样式） */
.lcm-foot {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 8px 0 10px;
}

.lcm-btn {
  width: 88px;
  height: 30px;
  font-family: inherit;
  font-size: 13px;
  color: #fff;
  background: #a9bdd6;
  border: none;
  border-radius: 15px;
  cursor: pointer;

  &.danger {
    background: linear-gradient(180deg, #f0756a, #e2564a);
  }

  &:hover {
    filter: brightness(1.06);
  }
}
</style>
