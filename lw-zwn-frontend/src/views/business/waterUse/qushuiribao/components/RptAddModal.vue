<script setup lang="ts">
// ============================================================
// 新增监控记录弹框（复刻原型 openRptAdd）
// 取水口名称 / 计量视频情况 / 整改进展 / 监管单位 / 备注
// ============================================================
import { ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'

// 保存回传的监控记录字段
export interface RptAddPayload {
  name: string
  meter: string
  fix: string
  org: string
  note: string
}

const props = defineProps<{ names: string[] }>()
const emit = defineEmits<{ confirm: [payload: RptAddPayload] }>()

// 计量、视频情况下拉项（文案取自原型）
const METER_OPTIONS = [
  '运行正常',
  '计量运行不正常',
  '计量数据未上传',
  '未安装计量设施',
  '视频设备损坏'
]

// 监管单位下拉项（文案取自原型）
const ORG_OPTIONS = ['岳城局', '邯郸局', '聊城局', '德州局', '邢衡局', '水闸局', '卫河局']

const visible = ref(false)
const name = ref('')
const meter = ref('运行正常')
const fix = ref('')
const org = ref('岳城局')
const note = ref('')

/** 打开弹框（重置为原型默认值） */
function show() {
  name.value = props.names[0] ?? ''
  meter.value = '运行正常'
  fix.value = ''
  org.value = '岳城局'
  note.value = ''
  visible.value = true
}

/** 保存：整改进展为空时按原型默认「未完成整改」 */
function submit() {
  visible.value = false
  emit('confirm', {
    name: name.value,
    meter: meter.value,
    fix: fix.value.trim() || '未完成整改',
    org: org.value,
    note: note.value.trim()
  })
}

defineExpose({ show })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    title="新增监控记录"
    table-theme="light"
    content-mode="fill"
    default-padding="14px 26px 4px"
    :style-params="{ width: '720px' }"
  >
    <div class="licform">
      <!--      <div class="sect">监控记录信息</div>-->

      <div class="fitem">
        <span class="lbl req">取水口名称</span>
        <span class="ctl">
          <select v-model="name">
            <option v-for="n in names" :key="n" :value="n">{{ n }}</option>
          </select>
        </span>
      </div>
      <div class="fitem">
        <span class="lbl req">计量、视频情况</span>
        <span class="ctl">
          <select v-model="meter">
            <option v-for="o in METER_OPTIONS" :key="o" :value="o">{{ o }}</option>
          </select>
        </span>
      </div>
      <div class="fitem">
        <span class="lbl">整改进展情况</span>
        <span class="ctl">
          <input v-model="fix" type="text" placeholder="如：未完成整改 / 已完成整改" />
        </span>
      </div>
      <div class="fitem">
        <span class="lbl req">监管单位</span>
        <span class="ctl">
          <select v-model="org">
            <option v-for="o in ORG_OPTIONS" :key="o" :value="o">{{ o }}</option>
          </select>
        </span>
      </div>
      <div class="fitem span2">
        <span class="lbl">备注</span>
        <span class="ctl">
          <input v-model="note" type="text" placeholder="巡查说明（选填）" />
        </span>
      </div>
    </div>

    <template #action>
      <div class="lcm-foot">
        <button class="lcm-btn primary" type="button" @click="submit">保 存</button>
        <button class="lcm-btn" type="button" @click="visible = false">取 消</button>
      </div>
    </template>
  </pro-modal>
</template>

<style scoped lang="scss">
@use '@/assets/style/lic-modal-common.scss' as lic;

/* 分栏填报表单（与 LicNewModal 的 .licform 一致） */
.licform {
  @include lic.two-col-form;
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
    background: linear-gradient(180deg, #4fa0f4, lic.$c-blue-deep);
  }

  &:hover {
    filter: brightness(1.06);
  }
}
</style>
