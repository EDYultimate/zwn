<script setup lang="ts">
// ============================================================
// 月度水量确认单填报弹框（复刻原型 openPwMeterEdit）
// 在线水量只读；许可取水量 / 生态补水 / 应急取水 / 水权交易可填，
// 年度累计随填写自动汇总（不可修改）
// ============================================================
import { computed, ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import { SRC_OPTIONS, cumulativeOf, fmt, manualRecOf, type MeterRow } from '../meterShared'

/** 保存回传的数据 */
export interface MeterFillPayload {
  id: string
  month: string
  vol: number
  eco: number
  emg: number
  trade: number
  src: string
}

const emit = defineEmits<{ confirm: [payload: MeterFillPayload] }>()

const visible = ref(false)
const rec = ref<MeterRow | null>(null)

const vol = ref<number | null>(null)
const eco = ref<number | null>(null)
const emg = ref<number | null>(null)
const trade = ref<number | null>(null)
const src = ref<string>(SRC_OPTIONS[0])

/** 当月之前月份的人工填报累计（复刻原型 calcCum 的初始累加） */
const beforeCum = computed(() =>
  rec.value
    ? cumulativeOf(rec.value.id, rec.value.month, { vol: 0, eco: 0, emg: 0, trade: 0 })
    : null
)

/** 年度累计 = 之前月份累计 + 当月填写值 */
const cum = computed(() => ({
  c1: Math.round(((beforeCum.value?.c1 ?? 0) + (Number(vol.value) || 0)) * 10) / 10,
  c2: Math.round(((beforeCum.value?.c2 ?? 0) + (Number(eco.value) || 0)) * 10) / 10,
  c3: Math.round(((beforeCum.value?.c3 ?? 0) + (Number(emg.value) || 0)) * 10) / 10,
  c4: Math.round(((beforeCum.value?.c4 ?? 0) + (Number(trade.value) || 0)) * 10) / 10
}))

/** 累计行的月份区间文案 */
const cumMonths = computed(() => (rec.value ? `1-${Number(rec.value.month.slice(5))}月累计` : ''))

/** 打开弹框（回填当月已保存的填报数据） */
function show(row: MeterRow) {
  rec.value = row
  const saved = manualRecOf(row.id, row.month)
  vol.value = saved ? saved.vol : null
  eco.value = saved ? saved.eco : null
  emg.value = saved ? saved.emg : null
  trade.value = saved ? saved.trade : null
  src.value = saved ? saved.src : SRC_OPTIONS[0]
  visible.value = true
}

/** 保存修改：回传取水口 / 月份 / 四项水量与来源 */
function submit() {
  if (!rec.value) {
    return
  }
  visible.value = false
  emit('confirm', {
    id: rec.value.id,
    month: rec.value.month,
    vol: Number(vol.value) || 0,
    eco: Number(eco.value) || 0,
    emg: Number(emg.value) || 0,
    trade: Number(trade.value) || 0,
    src: src.value
  })
}

defineExpose({ show })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    title="月度水量确认单填报"
    table-theme="light"
    content-mode="fill"
    default-padding="0"
    :style-params="{ width: '620px' }"
  >
    <div v-if="rec" class="lcm-body">
      <div class="sect">一、取水工程情况</div>
      <div class="lcm-row">
        <span class="lbl">取水口名称</span>
        <span class="lcm-val">{{ rec.outlet }}</span>
      </div>
      <div class="lcm-row">
        <span class="lbl">取水权人</span>
        <span class="lcm-val">{{ rec.owner }}</span>
      </div>
      <div class="lcm-row">
        <span class="lbl">年许可取水量（万m³）</span>
        <span class="lcm-val">{{ fmt(rec.amt) }}</span>
      </div>

      <div class="sect">二、月度取水量（单位：万m³）— 上报月份：{{ rec.month }}</div>
      <div class="lcm-row">
        <span class="lbl">在线水量</span>
        <span class="lcm-val">
          {{ fmt(rec.vol) }} 万m³
          <em class="hint">（计量设施自动采集，不可修改）</em>
        </span>
      </div>
      <div class="lcm-row">
        <span class="lbl">许可取水量</span>
        <input
          v-model.number="vol"
          class="w-num"
          type="number"
          min="0"
          step="0.1"
          placeholder="0"
        />
        <span class="unit">万m³</span>
      </div>
      <div class="lcm-row">
        <span class="lbl">生态补水量</span>
        <input
          v-model.number="eco"
          class="w-num"
          type="number"
          min="0"
          step="0.1"
          placeholder="0"
        />
        <span class="unit">万m³</span>
      </div>
      <div class="lcm-row">
        <span class="lbl">应急取水量</span>
        <input
          v-model.number="emg"
          class="w-num"
          type="number"
          min="0"
          step="0.1"
          placeholder="0"
        />
        <span class="unit">万m³</span>
      </div>
      <div class="lcm-row">
        <span class="lbl">水权交易量</span>
        <input
          v-model.number="trade"
          class="w-num"
          type="number"
          min="0"
          step="0.1"
          placeholder="0"
        />
        <span class="unit">万m³</span>
      </div>
      <div class="lcm-row">
        <span class="lbl">人工填报数据来源</span>
        <select v-model="src" class="w-src">
          <option v-for="s in SRC_OPTIONS" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>

      <div class="sect">三、年度累计取水量（万m³）</div>
      <div class="lcm-row">
        <span class="lbl">许可取水量（{{ cumMonths }}）</span>
        <input class="w-num" type="text" :value="fmt(cum.c1)" disabled />
        <span class="unit">自动汇总</span>
      </div>
      <div class="lcm-row">
        <span class="lbl">生态补水量（{{ cumMonths }}）</span>
        <input class="w-num" type="text" :value="fmt(cum.c2)" disabled />
        <span class="unit">自动汇总</span>
      </div>
      <div class="lcm-row">
        <span class="lbl">应急取水量（{{ cumMonths }}）</span>
        <input class="w-num" type="text" :value="fmt(cum.c3)" disabled />
        <span class="unit">自动汇总</span>
      </div>
      <div class="lcm-row">
        <span class="lbl">水权交易量（{{ cumMonths }}）</span>
        <input class="w-num" type="text" :value="fmt(cum.c4)" disabled />
        <span class="unit">自动汇总</span>
      </div>

      <div class="pmtip">
        按《月度水量确认单》结构填报：许可取水量为主要人工填报水量，生态补水量、应急取水量、水权交易量按实际发生填写（无则填
        0）；年度累计随填写自动汇总。保存后进入水量审核，由复核人员确定最终采用数据。
      </div>
    </div>

    <template #action>
      <div class="lcm-foot">
        <button class="lcm-btn primary" type="button" @click="submit">保存修改</button>
        <button class="lcm-btn" type="button" @click="visible = false">取 消</button>
      </div>
    </template>
  </pro-modal>
</template>

<style scoped lang="scss">
@use '@/assets/style/lic-modal-common.scss' as lic;

/* 表单容器（复刻原型 .lcm-body / .lcm-row） */
.lcm-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 26px 14px;
}

/* 分组标题（左蓝条 + 渐隐分隔线） */
.sect {
  @include lic.sect-title;

  margin: 6px 0 0;

  &:first-child {
    margin-top: 0;
  }
}

.lcm-row {
  display: flex;
  align-items: center;
}

.lbl {
  flex: none;
  width: 190px;
  font-size: lic.$font-md;
  color: #41577a;
}

.lcm-val {
  font-size: lic.$font-md;
  font-weight: 600;
  color: #22436f;
}

.hint {
  font-size: lic.$font-xs;
  font-style: normal;
  font-weight: 400;
  color: #8aa3c4;
}

input,
select {
  @include lic.input;

  width: 160px;
  font-size: lic.$font-xs;
  color: #24466f;
  border-color: lic.$c-blue-border;

  &:disabled {
    color: #4b6b93;
    background: #f4f8fe;
    border-color: #dbe8f7;
  }
}

.w-src {
  width: 160px;
}

.unit {
  margin-left: 6px;
  font-size: lic.$font-xs;
  color: #8aa3c4;
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

/* 底部按钮（与证照管理弹框统一） */
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
  font-size: lic.$font-btn;
  color: #fff;
  cursor: pointer;
  background: #a9bdd6;
  border: none;
  border-radius: 15px;

  &.primary {
    width: 96px;
    background: linear-gradient(180deg, #4fa0f4, lic.$c-blue-deep);
  }

  &:hover {
    filter: brightness(1.06);
  }
}
</style>
