<script setup lang="ts">
// ============================================================
// 退回取水计划弹框（复刻原型 openPwReject）
// 展示取水口 / 年度计划合计，填写退回意见后回传父页面
// 样式沿用浅色弹框体系（lic-modal-common）
// ============================================================
import { computed, ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import type { PlanRowLike } from '../../jihuashangbao/components/PlanFormModal.vue'

const visible = ref(false)
const rec = ref<PlanRowLike | null>(null)
const reason = ref('')

const emit = defineEmits<{ confirm: [row: PlanRowLike, reason: string] }>()

/** 打开弹框（传入待退回的计划行，预填默认退回意见） */
function show(row: PlanRowLike) {
  rec.value = row
  reason.value = '年度计划总量超过许可水量，请核减后重新上报。'
  visible.value = true
}

/** 年度计划合计 = 12 个月计划水量之和 */
const planTotal = computed(() => (rec.value?.months || []).reduce((a, b) => a + b, 0))

function fmt(x: number | null | undefined): string {
  return Number(x ?? 0).toLocaleString()
}

/** 确认退回：意见为空时用默认文案，与原型一致 */
function onConfirm() {
  if (!rec.value) {
    return
  }
  emit('confirm', rec.value, reason.value.trim() || '不符合填报要求，请核减后重新上报。')
  visible.value = false
}

defineExpose({ show })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    title="退回取水计划"
    table-theme="light"
    content-mode="fill"
    :style-params="{ width: '560px' }"
  >
    <div class="rj">
      <div class="rj-row">
        <span class="lb">取水口</span>
        <span class="val">{{ rec?.outlet }}（{{ rec?.owner }}）</span>
      </div>
      <div class="rj-row">
        <span class="lb">年度计划合计</span>
        <span class="val"> {{ fmt(planTotal) }} 万m³（许可水量 {{ fmt(rec?.amt) }} 万m³） </span>
      </div>
      <div class="rj-row top">
        <span class="lb">退回意见</span>
        <textarea v-model="reason" />
      </div>
    </div>

    <template #action>
      <div class="lcm-foot">
        <button class="lcm-btn danger" type="button" @click="onConfirm">确认退回</button>
        <button class="lcm-btn" type="button" @click="visible = false">取 消</button>
      </div>
    </template>
  </pro-modal>
</template>

<style scoped lang="scss">
@use '@/assets/style/lic-modal-common.scss' as lic;

/* 内容行 */
.rj {
  padding: 12px 4px 4px;
  font-size: lic.$font-md;
  color: lic.$c-text;
}

.rj-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;

  &.top {
    align-items: flex-start;
  }
}

.lb {
  flex: none;
  width: 88px;
  color: lic.$c-secondary;
  text-align: right;
}

.val {
  font-size: lic.$font-md;
  color: #22436f;
}

textarea {
  flex: 1;
  height: 84px;
  padding: 8px 10px;
  font-family: inherit;
  font-size: lic.$font-sm;
  color: #24466f;
  resize: vertical;
  outline: none;
  border: 1px solid lic.$c-blue-border;
  border-radius: 4px;

  &:focus {
    border-color: lic.$c-focus;
    box-shadow: 0 0 0 2px rgba(63, 151, 242, 0.15);
  }
}

/* 底部按钮 */
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
  font-size: lic.$font-btn;
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
