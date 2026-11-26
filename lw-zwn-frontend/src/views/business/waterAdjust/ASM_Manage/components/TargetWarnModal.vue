<script setup lang="ts">
// ============================================================
// 目标及预警设置弹窗（浅色，复刻原型）
// 结构：版本选择 → 基本信息 / 责任主体 → 生态流量目标设置 → 预警规则
// 由父组件 ref.show(section) 打开，内容随断面行载入（演示数据）
// ============================================================
import { reactive, ref } from 'vue'

interface SectionItem {
  id: number
  name: string
  river: string
  province: string
  mode: string
  target: string
  basis: string
  monitor: string
  status: '在用' | '预留接口'
}

interface TargetRow {
  name: string // 控制断面工程名称
  kind: '水量' | '流量' // 水量/流量
  start: string // 开始日期
  end: string // 结束日期
  value: string // 数值
}

interface WarnRow {
  node: string // 控制节点
  target: string // 目标值
  timeVal: string // 序时值
  lv1: string // 一级预警阈值
  lv2: string // 二级预警阈值
  lv3: string // 三级预警阈值
}

const emit = defineEmits<{ saved: [] }>()

const visible = ref(false)
const version = ref('现行值')

/* ---------------- 基本信息 / 责任主体 ---------------- */

const basic = reactive({
  name: '',
  riverProvince: '',
  mode: '',
  basis: '',
  monitor: '',
  plan: ''
})

const responsibilities = ref<{ label: string; value: string }[]>([])

/* ---------------- 生态流量目标设置 ---------------- */

const targetRows = ref<TargetRow[]>([])

// 由断面生态流量目标文本解析出类型与数值："3384 万m³/年"→水量；"2.137 / 0.712 m³/s"→流量
function parseTarget(s: SectionItem): TargetRow {
  const kind = s.target.includes('m³/s') ? '流量' : '水量'
  const value = s.target.match(/[\d.]+/)?.[0] ?? ''
  return { name: s.name, kind, start: '01-01', end: '12-31', value }
}

function addTargetRow() {
  targetRows.value.push({ name: '', kind: '水量', start: '01-01', end: '12-31', value: '' })
}

/* ---------------- 预警规则 ---------------- */

const warnRows = ref<WarnRow[]>([])

/* ---------------- 打开 / 关闭 / 保存 ---------------- */

function show(s: SectionItem) {
  version.value = '现行值'
  basic.name = s.name
  basic.riverProvince = `${s.river} ${s.province}`
  basic.mode = s.status === '预留接口' ? `${s.mode}（预留接口）` : s.mode
  basic.basis = s.basis
  basic.monitor = s.monitor
  basic.plan = '现状暂不具备考核条件（监测断面与计量设施待完善）'
  responsibilities.value = [
    { label: '生态流量保障主体', value: '漳卫南运河管理局' },
    { label: '生态流量调度主体', value: '漳卫南运河管理局' },
    { label: '生态流量泄放主体', value: '岳城水库管理局' },
    { label: '生态流量监管主体', value: '海河水利委员会' },
    { label: '监测与信息报送', value: s.monitor }
  ]
  targetRows.value = [parseTarget(s)]
  warnRows.value = [
    { node: '8月底', target: '3200', timeVal: '2560', lv1: '2560', lv2: '2048', lv3: '/' },
    { node: '9月底', target: '3200', timeVal: '2720', lv1: '2720', lv2: '2176', lv3: '/' }
  ]
  visible.value = true
}

function onCancel() {
  visible.value = false
}

function onSave() {
  window.$message?.success(`${basic.name} 目标及预警规则已保存（演示数据，未写入数据库）`)
  visible.value = false
  emit('saved')
}

defineExpose({ show })
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="tw-mask" @click.self="onCancel">
      <div class="tw-modal">
        <!-- 头部 -->
        <div class="tw-head">
          <span class="tw-caret">▼</span>
          <span class="tw-title">{{ basic.name }} · 生态流量目标与预警规则</span>
          <span class="tw-tip">（内容可修改）</span>
          <span class="tw-close" @click="onCancel">&times;</span>
        </div>

        <div class="tw-body">
          <!-- 版本 -->
          <div class="tw-ver">
            <span class="tw-ver-label">版本</span>
            <select v-model="version" class="tw-ver-select">
              <option>现行值</option>
            </select>
            <span class="tw-ver-hint">保存修改时可命名版本；切换版本即载入对应内容</span>
          </div>

          <!-- 基本信息 / 责任主体 -->
          <div class="tw-cols">
            <div class="tw-col">
              <div class="tw-sec-title">基本信息</div>
              <table class="tw-tbl">
                <thead>
                  <tr>
                    <th style="width: 34%">项目</th>
                    <th>内容（可直接修改）</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>考核断面</td>
                    <td>{{ basic.name }}</td>
                  </tr>
                  <tr>
                    <td>所在河流 / 省份</td>
                    <td>{{ basic.riverProvince }}</td>
                  </tr>
                  <tr>
                    <td>考核方式</td>
                    <td>{{ basic.mode }}</td>
                  </tr>
                  <tr>
                    <td>依据文件</td>
                    <td><input v-model="basic.basis" type="text" /></td>
                  </tr>
                  <tr>
                    <td>监测主体</td>
                    <td><input v-model="basic.monitor" type="text" /></td>
                  </tr>
                  <tr>
                    <td>考核安排</td>
                    <td><input v-model="basic.plan" type="text" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="tw-col">
              <div class="tw-sec-title">责任主体</div>
              <table class="tw-tbl">
                <thead>
                  <tr>
                    <th style="width: 42%">责任类别</th>
                    <th>责任主体</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in responsibilities" :key="r.label">
                    <td>{{ r.label }}</td>
                    <td>{{ r.value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 生态流量目标设置 -->
          <div class="tw-sec-bar">
            <div class="tw-sec-title">生态流量目标设置</div>
            <button class="tw-btn ghost sm" type="button" @click="addTargetRow">＋添加行</button>
          </div>
          <table class="tw-tbl">
            <thead>
              <tr>
                <th style="width: 48px">序号</th>
                <th>控制断面工程名称</th>
                <th style="width: 110px">水量/流量</th>
                <th style="width: 120px">开始日期</th>
                <th style="width: 120px">结束日期</th>
                <th style="width: 110px">数值</th>
                <th style="width: 80px">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(t, i) in targetRows" :key="i">
                <td>{{ i + 1 }}</td>
                <td><input v-model="t.name" type="text" /></td>
                <td>
                  <select v-model="t.kind">
                    <option>水量</option>
                    <option>流量</option>
                  </select>
                </td>
                <td><input v-model="t.start" type="text" /></td>
                <td><input v-model="t.end" type="text" /></td>
                <td><input v-model="t.value" type="text" /></td>
                <td>
                  <button class="tw-del" type="button" @click="targetRows.splice(i, 1)">
                    删除
                  </button>
                </td>
              </tr>
              <tr v-if="!targetRows.length">
                <td colspan="7" class="tw-empty">暂无行，点击右上角"＋添加行"新增</td>
              </tr>
            </tbody>
          </table>

          <!-- 预警规则 -->
          <div class="tw-sec-title">
            预警规则
            <span class="tw-warn-hint">单位：万m³ · "/" 表示无该级阈值</span>
          </div>
          <table class="tw-tbl">
            <thead>
              <tr>
                <th style="width: 90px">控制节点</th>
                <th>目标值</th>
                <th>序时值</th>
                <th>一级预警阈值</th>
                <th>二级预警阈值</th>
                <th>三级预警阈值</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="w in warnRows" :key="w.node">
                <td>{{ w.node }}</td>
                <td><input v-model="w.target" type="text" /></td>
                <td><input v-model="w.timeVal" type="text" /></td>
                <td><input v-model="w.lv1" type="text" /></td>
                <td><input v-model="w.lv2" type="text" /></td>
                <td><input v-model="w.lv3" type="text" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 底部 -->
        <div class="tw-foot">
          <button class="tw-btn ghost" type="button" @click="onCancel">取消</button>
          <button class="tw-btn" type="button" @click="onSave">保存修改</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
/* ================= 遮罩 + 弹窗容器 ================= */
.tw-mask {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 40, 75, 0.45);
}

.tw-modal {
  display: flex;
  flex-direction: column;
  width: 1024px;
  max-width: 96vw;
  max-height: 92vh;
  overflow: hidden;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 8px 40px rgba(20, 60, 120, 0.25);
}

/* ================= 头部 ================= */
.tw-head {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: none;
  padding: 13px 18px;
  border-bottom: 1px solid #e2ebf7;

  .tw-caret {
    font-size: 11px;
    color: #1f7ae0;
  }

  .tw-title {
    font-size: 15px;
    font-weight: 700;
    color: #1f7ae0;
    letter-spacing: 0.5px;
  }

  .tw-tip {
    font-size: 12px;
    font-weight: 400;
    color: #8aa3c4;
  }

  .tw-close {
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

/* ================= 内容区 ================= */
.tw-body {
  flex: 1;
  min-height: 0;
  padding: 12px 18px;
  overflow: auto;
}

/* 版本行 */
.tw-ver {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 13px;

  .tw-ver-label {
    color: #2c2c2c;
  }

  .tw-ver-select {
    height: 26px;
    padding: 0 6px;
    font-size: 13px;
    color: #222;
    cursor: pointer;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 3px;
    outline: none;

    &:focus {
      border-color: #3f97f2;
    }
  }

  .tw-ver-hint {
    font-size: 12px;
    color: #8aa3c4;
  }
}

/* 基本信息 / 责任主体 双列 */
.tw-cols {
  display: grid;
  grid-template-columns: 4.2fr 5.8fr;
  gap: 18px;
  margin-bottom: 14px;
}

/* 分区标题 */
.tw-sec-title {
  margin-bottom: 6px;
  font-size: 13.5px;
  font-weight: 700;
  color: #24405e;
}

/* 分区标题 + 右侧按钮 */
.tw-sec-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0 6px;

  .tw-sec-title {
    margin-bottom: 0;
  }
}

/* 预警规则提示 */
.tw-warn-hint {
  margin-left: 8px;
  font-size: 12px;
  font-weight: 400;
  color: #8aa3c4;
}

/* ================= 表格 ================= */
.tw-tbl {
  width: 100%;
  margin-bottom: 14px;
  font-size: 13px;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #dbe7f6;

  th {
    padding: 7px 8px;
    font-weight: 600;
    white-space: nowrap;
    color: #20517e;
    text-align: center;
    background: #e2eefb;
    border-right: 1px solid #cfe0f4;
    border-bottom: 1px solid #cfe0f4;

    &:last-child {
      border-right: none;
    }
  }

  td {
    padding: 6px 8px;
    white-space: nowrap;
    color: #2a3f5c;
    background: #fff;
    border-right: 1px solid #e2ebf7;
    border-bottom: 1px solid #e2ebf7;

    &:last-child {
      border-right: none;
    }
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  /* 可编辑单元格输入框 */
  input[type='text'],
  select {
    box-sizing: border-box;
    width: 100%;
    height: 26px;
    padding: 0 6px;
    font-family: inherit;
    font-size: 13px;
    color: #222;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 3px;
    outline: none;

    &:focus {
      border-color: #3f97f2;
      box-shadow: 0 0 0 2px rgba(63, 151, 242, 0.15);
    }
  }

  select {
    cursor: pointer;
  }
}

.tw-empty {
  padding: 18px 0 !important;
  color: #8aa3c4 !important;
  text-align: center;
  letter-spacing: 1px;
}

/* ================= 按钮 ================= */
.tw-btn {
  padding: 7px 18px;
  font-size: 13px;
  color: #fff;
  white-space: nowrap;
  cursor: pointer;
  background: linear-gradient(180deg, #3f97f2, #1f6fd6);
  border: none;
  border-radius: 3px;

  &:hover {
    filter: brightness(1.08);
  }

  &.ghost {
    color: #1f7ae0;
    background: #f2f8ff;
    border: 1px solid #8fc0f2;
  }

  &.sm {
    padding: 4px 12px;
    font-size: 12.5px;
  }
}

/* 删除按钮 */
.tw-del {
  padding: 3px 12px;
  font-size: 12.5px;
  color: #fff;
  cursor: pointer;
  background: #f2564f;
  border: none;
  border-radius: 3px;

  &:hover {
    filter: brightness(1.08);
  }
}

/* ================= 底部 ================= */
.tw-foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex: none;
  padding: 12px 18px;
  border-top: 1px solid #e2ebf7;
}
</style>
