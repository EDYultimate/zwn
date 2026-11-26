<script setup lang="ts">
// ============================================================
// 删除取水计划确认弹框（复刻原型计划上报「删除」流程）
// 取消 / 确认删除（danger），确认后由父组件移除该行
// ============================================================
import { ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import type { PlanRowLike } from './PlanFormModal.vue'

const visible = ref(false)
const rec = ref<PlanRowLike | null>(null)

const emit = defineEmits<{ confirm: [row: PlanRowLike] }>()

/** 打开弹框（传入待删除的计划行） */
function show(row: PlanRowLike) {
  rec.value = row
  visible.value = true
}

function onConfirm() {
  visible.value = false
  if (rec.value) {
    emit('confirm', rec.value)
  }
}

defineExpose({ show })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    title="删除取水计划"
    table-theme="light"
    content-mode="fill"
    :style-params="{ width: '520px' }"
  >
    <div class="lcm-confirm">
      确定删除 <b>{{ rec?.outlet }}</b
      >（{{ rec?.owner }}）{{ rec?.year }} 年度取水计划吗？<br />删除后不可恢复。
    </div>

    <template #action>
      <div class="lcm-foot">
        <button class="lcm-btn danger" type="button" @click="onConfirm">确认删除</button>
        <button class="lcm-btn" type="button" @click="visible = false">取 消</button>
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
  height: 30px;
  padding: 0 20px;
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
