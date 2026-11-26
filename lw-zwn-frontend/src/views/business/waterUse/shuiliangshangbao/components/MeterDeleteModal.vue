<script setup lang="ts">
// ============================================================
// 删除人工填报数据确认弹框（复刻原型水量上报「删除」流程）
// 删除后当月人工填报水量清空，需重新填报上报
// ============================================================
import { ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import type { MeterRow } from '../meterShared'

const visible = ref(false)
const rec = ref<MeterRow | null>(null)

const emit = defineEmits<{ confirm: [row: MeterRow] }>()

/** 打开弹框（传入待删除的复核行） */
function show(row: MeterRow) {
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
    title="删除人工填报数据"
    table-theme="light"
    content-mode="fill"
    :style-params="{ width: '520px' }"
  >
    <div class="lcm-confirm">
      确定删除 <b>{{ rec?.outlet }}</b
      >（{{ rec?.owner }}）{{ rec?.month }} 的人工填报数据吗？<br />
      删除后该取水口当月人工填报水量清空，需重新填报上报。
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
  cursor: pointer;
  background: #a9bdd6;
  border: none;
  border-radius: 15px;

  &.danger {
    background: linear-gradient(180deg, #f0756a, #e2564a);
  }

  &:hover {
    filter: brightness(1.06);
  }
}
</style>
