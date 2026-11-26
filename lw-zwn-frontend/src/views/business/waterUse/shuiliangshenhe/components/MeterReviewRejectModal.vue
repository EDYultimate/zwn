<script setup lang="ts">
// ============================================================
// 退回月度上报数据弹框（复刻原型 openPwRevReject）
// 展示取水口 / 上报月份 / 人工填报水量，填写退回意见后回传父页面
// ============================================================
import { ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import { SRC_OPTIONS, fmt, type MeterRow } from '../../shuiliangshangbao/meterShared'

/** 退回回传数据 */
export interface MeterRejectPayload {
  id: string
  month: string
  reason: string
}

const emit = defineEmits<{ confirm: [payload: MeterRejectPayload] }>()

const visible = ref(false)
const rec = ref<MeterRow | null>(null)
const reason = ref('')

/** 打开弹框（预填默认退回意见） */
function show(row: MeterRow) {
  rec.value = row
  reason.value = '人工填报数据与在线计量数据偏差较大，请核对计量设施读数后修改重新上报。'
  visible.value = true
}

/** 确认退回：意见为空时用默认文案 */
function onConfirm() {
  if (!rec.value) {
    return
  }
  const text = reason.value.trim() || '数据核对不符，请核对后重新上报。'
  visible.value = false
  emit('confirm', { id: rec.value.id, month: rec.value.month, reason: text })
}

defineExpose({ show })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    title="退回月度上报数据"
    table-theme="light"
    content-mode="fill"
    :style-params="{ width: '520px' }"
  >
    <div v-if="rec" class="rj">
      <div class="rj-row">
        <span class="lb">取水口</span>
        <span class="val">{{ rec.outlet }}（{{ rec.owner }}）</span>
      </div>
      <div class="rj-row">
        <span class="lb">上报月份</span>
        <span class="val">
          {{ rec.month }} · 人工填报 {{ rec.man === null ? '—' : fmt(rec.man) }} 万m³（{{
            SRC_OPTIONS.some((s) => s === rec?.src) ? rec.src : '—'
          }}）
        </span>
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
