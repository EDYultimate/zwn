<script setup lang="ts">
// ============================================================
// 新增考核断面弹窗（浅色，复刻原型）
// 字段：考核断面 / 断面编码 / 所在河流 / 所在省份 / 考核方式 /
//       生态流量目标 / 依据文件 / 监测主体 / 考核状态
// 由父组件 ref.open() 打开，保存时 emit('saved', 新断面)
// ============================================================
import { reactive, ref } from 'vue'

export interface NewSection {
  name: string
  code: string
  river: string
  province: string
  mode: string
  target: string
  basis: string
  monitor: string
  status: '在用' | '预留接口'
}

const emit = defineEmits<{ saved: [item: NewSection] }>()

// 考核方式 / 考核状态选项
const MODE_OPTIONS = ['每年考核', '逐月考核', '考核方式待定']
const STATUS_OPTIONS = ['预留接口', '在用']

const visible = ref(false)

const form = reactive<NewSection>({
  name: '',
  code: '',
  river: '',
  province: '',
  mode: '每年考核',
  target: '',
  basis: '',
  monitor: '',
  status: '预留接口'
})

function open() {
  form.name = ''
  form.code = ''
  form.river = ''
  form.province = ''
  form.mode = '每年考核'
  form.target = ''
  form.basis = ''
  form.monitor = ''
  form.status = '预留接口'
  visible.value = true
}

function onCancel() {
  visible.value = false
}

function onSave() {
  if (!form.name.trim()) {
    window.$message?.warning('请填写考核断面名称')
    return
  }
  emit('saved', { ...form })
  visible.value = false
}

defineExpose({ open })
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="ns-mask" @click.self="onCancel">
      <div class="ns-modal">
        <!-- 头部 -->
        <div class="ns-head">
          <span class="ns-caret">▼</span>
          <span class="ns-title">新增考核断面</span>
          <span class="ns-close" @click="onCancel">&times;</span>
        </div>

        <!-- 表单 -->
        <div class="ns-body">
          <label class="ns-row">
            <span class="ns-label">考核断面</span>
            <input v-model="form.name" type="text" placeholder="如：祝官屯节制闸" />
          </label>
          <label class="ns-row">
            <span class="ns-label">断面编码</span>
            <input v-model="form.code" type="text" placeholder="如：31007101（可由文档自动解析）" />
          </label>
          <label class="ns-row">
            <span class="ns-label">所在河流</span>
            <input v-model="form.river" type="text" placeholder="如：卫运河" />
          </label>
          <label class="ns-row">
            <span class="ns-label">所在省份</span>
            <input v-model="form.province" type="text" placeholder="如：山东省 聊城市临清市" />
          </label>
          <label class="ns-row">
            <span class="ns-label">考核方式</span>
            <select v-model="form.mode">
              <option v-for="o in MODE_OPTIONS" :key="o" :value="o">{{ o }}</option>
            </select>
          </label>
          <label class="ns-row">
            <span class="ns-label">生态流量目标</span>
            <input v-model="form.target" type="text" placeholder="如：3384 万m³/年" />
          </label>
          <label class="ns-row">
            <span class="ns-label">依据文件</span>
            <input v-model="form.basis" type="text" placeholder="如：海节保函〔2025〕9号" />
          </label>
          <label class="ns-row">
            <span class="ns-label">监测主体</span>
            <input v-model="form.monitor" type="text" placeholder="如：祝官屯枢纽管理处" />
          </label>
          <label class="ns-row">
            <span class="ns-label">考核状态</span>
            <select v-model="form.status">
              <option v-for="o in STATUS_OPTIONS" :key="o" :value="o">{{ o }}</option>
            </select>
          </label>
        </div>

        <!-- 底部 -->
        <div class="ns-foot">
          <button class="ns-btn cancel" type="button" @click="onCancel">取消</button>
          <button class="ns-btn save" type="button" @click="onSave">保存</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
/* ================= 遮罩 + 弹窗容器 ================= */
.ns-mask {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 40, 75, 0.45);
}

.ns-modal {
  display: flex;
  flex-direction: column;
  width: 600px;
  max-width: 94vw;
  max-height: 92vh;
  overflow: hidden;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 8px 40px rgba(20, 60, 120, 0.25);
}

/* ================= 头部 ================= */
.ns-head {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: none;
  padding: 13px 18px;
  border-bottom: 1px solid #e2ebf7;

  .ns-caret {
    font-size: 11px;
    color: #1f7ae0;
  }

  .ns-title {
    font-size: 15px;
    font-weight: 700;
    color: #1f7ae0;
    letter-spacing: 0.5px;
  }

  .ns-close {
    margin-left: auto;
    padding: 0 6px;
    font-size: 22px;
    line-height: 1;
    color: #8aa3c4;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      color: #24405e;
      background: #eef3f8;
    }
  }
}

/* ================= 表单 ================= */
.ns-body {
  flex: 1;
  min-height: 0;
  padding: 16px 22px 6px;
  overflow: auto;
}

.ns-row {
  display: flex;
  align-items: center;
  margin-bottom: 14px;

  .ns-label {
    width: 92px;
    padding-right: 10px;
    font-size: 13.5px;
    color: #333;
    text-align: right;
    flex: none;
  }

  input[type='text'],
  select {
    box-sizing: border-box;
    flex: 1;
    height: 34px;
    padding: 0 10px;
    font-family: inherit;
    font-size: 13.5px;
    color: #222;
    background: #fff;
    border: 1px solid #d0d8e4;
    border-radius: 4px;
    outline: none;

    &::placeholder {
      color: #9fb3cc;
    }

    &:focus {
      border-color: #3f97f2;
      box-shadow: 0 0 0 2px rgba(63, 151, 242, 0.15);
    }
  }

  select {
    cursor: pointer;
  }
}

/* ================= 底部 ================= */
.ns-foot {
  display: flex;
  justify-content: center;
  gap: 26px;
  flex: none;
  padding: 8px 18px 18px;
}

.ns-btn {
  min-width: 108px;
  padding: 9px 30px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  border: none;
  border-radius: 20px;

  &:hover {
    filter: brightness(1.06);
  }

  &.cancel {
    background: #b6c3d4;
  }

  &.save {
    background: linear-gradient(180deg, #3f97f2, #1f6fd6);
  }
}
</style>
