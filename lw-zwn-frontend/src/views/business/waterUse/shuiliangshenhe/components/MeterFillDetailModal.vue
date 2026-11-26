<script setup lang="ts">
// ============================================================
// 月度取水量填报详情弹框（复刻原型 openPwReportDetail）
// 在线计量 + 人工填报 + 审核结果 / 最终采用数据一并展示
// ============================================================
import { computed, ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import {
  ALARM_TEXT,
  REPORT_STATUS_TEXT,
  fmt,
  keyOf,
  manualRecOf,
  meterState,
  reviewStatusOf,
  type MeterRow
} from '../../shuiliangshangbao/meterShared'

const visible = ref(false)
const rec = ref<MeterRow | null>(null)

/** 打开弹框 */
function show(row: MeterRow) {
  rec.value = row
  visible.value = true
}

/** 当月人工填报记录 */
const manRec = computed(() => (rec.value ? manualRecOf(rec.value.id, rec.value.month) : null))

/** 审核状态 */
const vst = computed(() => (rec.value ? reviewStatusOf(rec.value.id, rec.value.month) : 0))

/** 退回意见 */
const reason = computed(() =>
  rec.value ? (meterState.reason[keyOf(rec.value.id, rec.value.month)] ?? '') : ''
)

/** 最终采用数据 */
const fin = computed(() =>
  rec.value ? (meterState.finalUse[keyOf(rec.value.id, rec.value.month)] ?? '') : ''
)

/** 最终采用数值 */
const finVal = computed(() => {
  if (!rec.value || !fin.value) {
    return 0
  }
  return fin.value === '在线计量' ? rec.value.vol : (manRec.value?.vol ?? 0)
})

defineExpose({ show })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    title="月度取水量填报详情"
    table-theme="light"
    content-mode="fill"
    default-padding="0"
    :style-params="{ width: '580px' }"
  >
    <div v-if="rec" class="lcm-body">
      <div class="lcm-row">
        <span class="lbl">取水口</span>
        <span class="lcm-val">{{ rec.outlet }}（{{ rec.owner }}）</span>
      </div>
      <div class="lcm-row">
        <span class="lbl">上报月份</span>
        <span class="lcm-val"> {{ rec.month }} · 月批复计划 {{ fmt(rec.plan) }} 万m³ </span>
      </div>
      <div class="lcm-row">
        <span class="lbl">上报状态</span>
        <span class="lcm-val">{{ REPORT_STATUS_TEXT[rec.st] }}</span>
      </div>
      <div v-if="vst === 2" class="lcm-row top">
        <span class="lbl">退回意见</span>
        <span class="lcm-val danger">{{ reason || '数据核对不符，请核对后重新上报。' }}</span>
      </div>
      <div class="lcm-row">
        <span class="lbl">超警情况</span>
        <span class="lcm-val"
          ><span class="alb" :class="'a' + rec.al">{{ ALARM_TEXT[rec.al] }}</span></span
        >
      </div>
      <div class="lcm-row">
        <span class="lbl">在线水量</span>
        <span class="lcm-val">
          {{ fmt(rec.vol) }} 万m³<em class="hint">（计量设施自动采集）</em>
        </span>
      </div>
      <div class="lcm-row">
        <span class="lbl">填报水量</span>
        <span class="lcm-val">
          <template v-if="manRec">{{ fmt(manRec.vol) }} 万m³</template>
          <span v-else class="empty">未填报</span>
        </span>
      </div>
      <div class="lcm-row">
        <span class="lbl">生态补水量</span>
        <span class="lcm-val">{{ fmt(manRec?.eco ?? 0) }} 万m³</span>
      </div>
      <div class="lcm-row">
        <span class="lbl">应急取水量</span>
        <span class="lcm-val">{{ fmt(manRec?.emg ?? 0) }} 万m³</span>
      </div>
      <div class="lcm-row">
        <span class="lbl">水权交易量</span>
        <span class="lcm-val">{{ fmt(manRec?.trade ?? 0) }} 万m³</span>
      </div>
      <div class="lcm-row">
        <span class="lbl">人工填报数据来源</span>
        <span class="lcm-val"
          ><span class="srctag">{{ manRec?.src ?? '—' }}</span></span
        >
      </div>
      <div class="lcm-row">
        <span class="lbl">最终采用数据</span>
        <span class="lcm-val">
          <template v-if="fin">
            <span class="usetag">{{ fin }}</span
            >（{{ fmt(finVal) }} 万m³）
          </template>
          <span v-else class="waittag">待审核确定</span>
        </span>
      </div>
      <div class="lcm-row">
        <span class="lbl">填报信息</span>
        <span class="lcm-val weak">
          填报人（经办人）：{{ manRec?.by ?? '—' }} · 填报时间：{{ manRec?.time ?? '—' }}
        </span>
      </div>
      <div class="pmtip">
        在线计量与人工填报并行留存；水量审核时由复核人员确定以哪一路数据为最终采用数据。
      </div>
    </div>

    <template #action>
      <div class="lcm-foot">
        <button class="lcm-btn" type="button" @click="visible = false">关 闭</button>
      </div>
    </template>
  </pro-modal>
</template>

<style scoped lang="scss">
@use '@/assets/style/lic-modal-common.scss' as lic;

/* 表单行（复刻原型 .lcm-body / .lcm-row） */
.lcm-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 26px 16px;
}

.lcm-row {
  display: flex;
  align-items: flex-start;

  &.top {
    align-items: flex-start;
  }
}

.lbl {
  flex: none;
  width: 150px;
  padding-top: 1px;
  font-size: lic.$font-md;
  color: #41577a;
}

.lcm-val {
  flex: 1;
  font-size: lic.$font-md;
  font-weight: 600;
  color: #22436f;

  &.danger {
    font-weight: 500;
    color: #c0392b;
  }
  &.weak {
    font-size: lic.$font-xs;
    font-weight: 400;
    color: #5a7ba6;
  }
}

.hint {
  margin-left: 4px;
  font-size: lic.$font-xs;
  font-style: normal;
  font-weight: 400;
  color: #8aa3c4;
}

.empty {
  font-weight: 400;
  color: #b6c6dc;
}

/* 超警情况标签 */
.alb {
  display: inline-block;
  padding: 2px 10px;
  font-size: 12px;
  line-height: 18px;
  border-radius: 999px;

  &.a0 {
    color: #389e0d;
    background: #f6ffed;
    border: 1px solid #b7eb8f;
  }
  &.a1 {
    color: #d48806;
    background: #fff7e6;
    border: 1px solid #ffd591;
  }
  &.a2 {
    color: #cf1322;
    background: #fff1f0;
    border: 1px solid #ffa39e;
  }
}

/* 来源 / 采用标签 */
.srctag {
  display: inline-block;
  padding: 1px 8px;
  font-size: 12px;
  font-weight: 400;
  color: #08979c;
  background: #e6fffb;
  border: 1px solid #87e8de;
  border-radius: 999px;
}

.usetag {
  display: inline-block;
  padding: 1px 8px;
  margin-right: 4px;
  font-size: 12px;
  color: #389e0d;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 999px;
}

.waittag {
  display: inline-block;
  padding: 1px 8px;
  font-size: 12px;
  font-weight: 400;
  color: #1890ff;
  background: #e6f4ff;
  border: 1px solid #91caff;
  border-radius: 999px;
}

.pmtip {
  padding: 8px 12px;
  margin-top: 4px;
  font-size: lic.$font-xs;
  line-height: 1.7;
  color: #8aa3c4;
  background: #f4f8fe;
  border-radius: 4px;
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

  &:hover {
    filter: brightness(1.06);
  }
}
</style>
