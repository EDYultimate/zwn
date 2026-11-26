<script setup lang="ts">
// ============================================================
// 考核断面管理（浅色整页视图，表格样式复刻 zhengzhaoguanli）
// 页面结构：标题 + 操作按钮 → 筛选行（考核状态 / 关键字）→ 列表表格
// ============================================================
import { computed, ref } from 'vue'
import TargetWarnModal from './components/TargetWarnModal.vue'
import AddSectionModal, { type NewSection } from './components/AddSectionModal.vue'

// 「目标及预警设置」弹框引用
const twModalRef = ref<InstanceType<typeof TargetWarnModal>>()
// 「新增考核断面」弹框引用
const addModalRef = ref<InstanceType<typeof AddSectionModal>>()

/* ---------------- 断面列表数据（本地 mock，字段取自原型） ---------------- */

interface SectionItem {
  id: number
  name: string // 考核断面
  river: string // 所在河流
  province: string // 所在省份
  mode: string // 考核方式
  target: string // 生态流量目标
  basis: string // 依据（核定文件）
  monitor: string // 监测主体
  status: '在用' | '预留接口' // 考核状态
}

const sections = ref<SectionItem[]>([
  {
    id: 1,
    name: '岳城水库',
    river: '漳河（清漳河下游）',
    province: '河北省 邯郸市磁县',
    mode: '每年考核',
    target: '3200 万m³/年',
    basis: '海节保函〔2025〕9号；站码 31007101',
    monitor: '漳卫南运河管理局',
    status: '在用'
  },
  {
    id: 2,
    name: '祝官屯节制闸',
    river: '卫运河',
    province: '山东省 聊城市临清市',
    mode: '考核方式待定',
    target: '3384 万m³/年',
    basis: '海节保函〔2025〕9号',
    monitor: '祝官屯枢纽管理处',
    status: '预留接口'
  },
  {
    id: 3,
    name: '四女寺枢纽（南进洪闸）',
    river: '漳河',
    province: '山东省 德州市武城县',
    mode: '考核方式待定',
    target: '2.137 / 0.712 m³/s',
    basis: '环审〔2024〕48号',
    monitor: '漳卫南运河四女寺枢纽管理局',
    status: '预留接口'
  },
  {
    id: 4,
    name: '王营盘拦河闸',
    river: '漳卫新河',
    province: '山东省 德州市宁津县',
    mode: '考核方式待定',
    target: '4.14 / 1.38 m³/s',
    basis: '环审〔2024〕48号',
    monitor: '漳卫南运河管理局（水闸局）',
    status: '预留接口'
  },
  {
    id: 5,
    name: '罗寨拦河闸',
    river: '漳卫新河',
    province: '山东省 德州市乐陵市',
    mode: '考核方式待定',
    target: '4.14 / 1.38 m³/s',
    basis: '环审〔2024〕48号',
    monitor: '漳卫南运河管理局（水闸局）',
    status: '预留接口'
  },
  {
    id: 6,
    name: '庆云拦河闸',
    river: '漳卫新河',
    province: '山东省 德州市庆云县',
    mode: '考核方式待定',
    target: '4.14 / 1.38 m³/s',
    basis: '环审〔2024〕48号',
    monitor: '漳卫南运河管理局（水闸局）',
    status: '预留接口'
  },
  {
    id: 7,
    name: '辛集挡潮闸',
    river: '漳卫新河',
    province: '山东省 滨州市无棣县',
    mode: '考核方式待定',
    target: '4.14 / 1.38 m³/s',
    basis: '环审〔2024〕48号',
    monitor: '漳卫南运河管理局（水闸局）',
    status: '预留接口'
  }
])

// 考核状态选项
const STATUS_OPTIONS = ['全部', '在用', '预留接口']

/* ---------------- 筛选状态 ---------------- */

const fqStatus = ref('全部') // 考核状态
const fqKeyword = ref('') // 关键字（断面名称 / 所在河流）

// 筛选后的列表
const filteredRows = computed(() =>
  sections.value.filter((s) => {
    if (fqStatus.value !== '全部' && s.status !== fqStatus.value) {
      return false
    }
    const kw = fqKeyword.value.trim()
    if (kw && !s.name.includes(kw) && !s.river.includes(kw)) {
      return false
    }
    return true
  })
)

/* ---------------- 交互（演示） ---------------- */

function onAdd() {
  addModalRef.value?.open()
}

// 新增断面保存：插入列表顶部（演示，未写库）
function onAddSaved(item: NewSection) {
  sections.value.unshift({
    id: Math.max(0, ...sections.value.map((s) => s.id)) + 1,
    name: item.name,
    river: item.river,
    province: item.province,
    mode: item.mode,
    target: item.target,
    basis: item.basis,
    monitor: item.monitor,
    status: item.status
  })
  window.$message?.success(`考核断面"${item.name}"已新增`)
}

function onExport() {
  window.$message?.info('导出')
}

function onSetting(s: SectionItem) {
  twModalRef.value?.show(s)
}
</script>

<template>
  <div class="asm-page">
    <div class="asec">
      <!-- 标题 + 操作按钮 -->
      <div class="asec-head">
        <h4>考核断面管理</h4>
        <div class="abtns">
          <button class="abtn" type="button" @click="onAdd">＋ 新增考核断面</button>
          <button class="abtn ghost" type="button" @click="onExport">导出</button>
        </div>
      </div>

      <!-- 筛选行 -->
      <div class="afrow">
        <label class="af">
          考核状态
          <select v-model="fqStatus">
            <option v-for="o in STATUS_OPTIONS" :key="o" :value="o">{{ o }}</option>
          </select>
        </label>
        <label class="af">
          关键字
          <input v-model="fqKeyword" type="text" placeholder="断面名称/所在河流" />
        </label>
      </div>

      <!-- 断面列表 -->
      <div class="atbl-wrap">
        <table class="atbl">
          <thead>
            <tr>
              <th>序号</th>
              <th>考核断面</th>
              <th>所在河流</th>
              <th>所在省份</th>
              <th>考核方式</th>
              <th>生态流量目标</th>
              <th>依据（核定文件）</th>
              <th>监测主体</th>
              <th>考核状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(s, i) in filteredRows" :key="s.id">
              <td>{{ i + 1 }}</td>
              <td>{{ s.name }}</td>
              <td>{{ s.river }}</td>
              <td>{{ s.province }}</td>
              <td>{{ s.mode }}</td>
              <td>{{ s.target }}</td>
              <td>{{ s.basis }}</td>
              <td>{{ s.monitor }}</td>
              <td>
                <span class="stag" :class="s.status === '在用' ? 'on' : 'rsrv'">
                  {{ s.status }}
                </span>
              </td>
              <td>
                <span class="alink" @click="onSetting(s)">目标及预警设置</span>
              </td>
            </tr>
            <tr v-if="!filteredRows.length" class="aempty">
              <td colspan="10">暂无符合条件的数据</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 目标及预警设置弹框 -->
    <TargetWarnModal ref="twModalRef" />
    <!-- 新增考核断面弹框 -->
    <AddSectionModal ref="addModalRef" @saved="onAddSaved" />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/style/water-filter.scss' as wf;

/* ================= 页面容器（浅色整页） ================= */
.asm-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
  min-height: 100%;
  padding: 5px;
  font-size: 13px;
  color: #1c3a63;
}

/* ================= 白色卡片 ================= */
.asec {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #d5e4f5;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(30, 90, 170, 0.08);
}

.asec-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: none;

  h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: #24405e;
  }
}

.abtns {
  display: flex;
  gap: 10px;
}

.abtn {
  padding: 7px 16px;
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

  /* 幽灵按钮 */
  &.ghost {
    color: #1f7ae0;
    background: #f2f8ff;
    border: 1px solid #8fc0f2;
  }
}

/* ================= 筛选行 ================= */
.afrow {
  @include wf.row;

  flex: none;
  margin-top: 11px;
}

.af {
  @include wf.field;

  input[type='text'] {
    width: 180px;
  }

  select {
    width: 118px;
  }
}

/* ================= 列表表格 ================= */
.atbl-wrap {
  flex: 1;
  max-height: 600px;
  min-height: 0;
  margin-top: 10px;
  overflow: auto;
  border: 1px solid #dbe7f6;
}

.atbl {
  width: max-content;
  min-width: 100%;
  font-size: 14px;
  border-collapse: separate;
  border-spacing: 0;

  th {
    position: sticky;
    top: 0;
    z-index: 2;
    padding: 9px 10px;
    font-weight: 600;
    white-space: nowrap;
    color: #20517e;
    background: #e2eefb;
    border-right: 1px solid #cfe0f4;
    border-bottom: 1px solid #cfe0f4;
  }

  td {
    height: 36px;
    padding: 8px 10px;
    text-align: center;
    white-space: nowrap;
    color: #2a3f5c;
    background: #fff;
    border-right: 1px solid #e2ebf7;
    border-bottom: 1px solid #e2ebf7;
  }

  tbody tr:hover td {
    background: #f2f8ff;
  }
}

/* 考核状态标签 */
.stag {
  display: inline-block;
  padding: 2px 10px;
  font-size: 12px;
  line-height: 18px;
  border-radius: 10px;

  &.on {
    color: #1f7ae0;
    background: #e8f2ff;
    border: 1px solid #bcd7f7;
  }

  &.rsrv {
    color: #7a8aa0;
    background: #f0f2f5;
    border: 1px solid #d9dee5;
  }
}

/* 操作列链接 */
.alink {
  color: #1f7ae0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

/* 空数据行 */
.aempty td {
  padding: 30px 0;
  color: #8aa3c4;
  letter-spacing: 2px;
}
</style>
