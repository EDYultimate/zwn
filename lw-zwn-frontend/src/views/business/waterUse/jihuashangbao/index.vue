<script setup lang="ts">
import { computed, ref } from 'vue'
import ProTable from '@/components/common/ProTable'
import type { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid'
import PlanFormModal from './components/PlanFormModal.vue'
import PlanCertModal from './components/PlanCertModal.vue'
import PlanSuggModal from './components/PlanSuggModal.vue'
import PlanDeleteModal from './components/PlanDeleteModal.vue'
import type { LicOption, PlanRowLike } from './components/PlanFormModal.vue'

/**
 * 计划用水管理 · 计划上报（浅色整页视图）
 * 复刻自静态原型 #pwReportView，数据为本地 mock，
 * 数值文案源自原型 PW_TEST / PW_HEAD_PLAN / renderPwPlan。
 */

// 计划状态：0 待上报 / 1 已上报待审核 / 2 审核通过 / 3 审核不通过 / 4 海委已批复
type PlanStatus = 0 | 1 | 2 | 3 | 4

// 计划行数据结构
interface PlanRow {
  id: string // 行编号
  year: string // 年度
  cert: string // 许可证编号
  outlet: string // 取水口名称
  owner: string // 取水单位
  org: string // 监管单位
  proj: string // 取水项目名称
  area: string // 所在行政区
  amt: number // 许可水量（万m³）
  months: number[] // 1-12 月计划水量（万m³）
  st: PlanStatus // 计划状态
  reason: string // 审核退回意见（仅"审核不通过"时有值）
}

// 状态文案（数组下标即 PlanStatus）
const STATUS_TEXT = ['待上报', '已上报待审核', '审核通过', '审核不通过', '海委已批复']

// 监管单位筛选项
const ORG_OPTIONS = ['全部', '岳城局', '邢衡局', '水闸局', '卫河局', '德州局', '聊城局']

// 年度筛选项
const YEAR_OPTIONS = ['2026', '2025']

// 证照池（新增计划时可选的取水许可证）
const LICENSE_POOL: LicOption[] = [
  {
    cert: 'A130426S2022-0021',
    owner: '邯郸市跃峰渠灌区服务中心',
    org: '岳城局',
    amt: 9069,
    proj: '跃峰渠灌区',
    area: '河北省 邯郸市 磁县',
    outlet: '漳河左岸跃峰渠渠首'
  },
  {
    cert: 'A130426S2022-0040',
    owner: '邯郸市跃峰渠管理处',
    org: '岳城局',
    amt: 22758,
    proj: '跃峰渠灌区',
    area: '河北省 邯郸市 磁县',
    outlet: '清漳河左岸跃峰渠渠首'
  },
  {
    cert: 'A410506S2022-0022',
    owner: '安阳市殷都区跃进渠灌区服务中心',
    org: '岳城局',
    amt: 9796,
    proj: '跃进渠灌区',
    area: '河南省 安阳市 安阳县',
    outlet: '跃进渠渠首（古城村）'
  },
  {
    cert: 'A130227S2021-2093',
    owner: '迁西顺发铁选有限公司',
    org: '邢衡局',
    amt: 18,
    proj: '迁西顺发铁选',
    area: '河北省 唐山市 迁西县',
    outlet: '潘家口水库库区取水口（顺发）'
  },
  {
    cert: 'A130227S2021-1566',
    owner: '迁西福珍全矿业有限公司老铁选厂',
    org: '水闸局',
    amt: 35,
    proj: '福珍全矿业铁选',
    area: '河北省 唐山市 迁西县',
    outlet: '潘家口水库库区取水口（福珍全老厂）'
  },
  {
    cert: 'A130227S2021-1809',
    owner: '河北津西钢铁集团股份有限公司',
    org: '卫河局',
    amt: 2000,
    proj: '津西钢铁',
    area: '河北省 唐山市 迁西县',
    outlet: '大黑汀水库库区取水口（津西钢铁）'
  },
  {
    cert: '国海(2009)003',
    owner: '河北省唐山市引滦工程管理局',
    org: '德州局',
    amt: 95000,
    proj: '引滦供水',
    area: '河北省 唐山市 路南区',
    outlet: '大黑汀水库引滦供水闸'
  },
  {
    cert: 'A130827S2021-1591',
    owner: '承德润金水务有限公司',
    org: '聊城局',
    amt: 760.4,
    proj: '润金水务供水',
    area: '河北省 承德市 宽城县',
    outlet: '潘家口水库清河口取水口'
  }
]

// 2026 年计划行 mock（共 8 行，覆盖全部 5 种状态）
const planRows = ref<PlanRow[]>([
  {
    id: 'P101',
    year: '2026',
    cert: 'A130426S2022-0021',
    outlet: '漳河左岸跃峰渠渠首',
    owner: '邯郸市跃峰渠灌区服务中心',
    org: '岳城局',
    proj: '跃峰渠灌区',
    area: '河北省 邯郸市 磁县',
    amt: 9069,
    st: 4,
    months: [500, 609, 561, 573, 767, 494, 700, 700, 700, 1300, 965, 1200],
    reason: ''
  },
  {
    id: 'P102',
    year: '2026',
    cert: 'A130426S2022-0040',
    outlet: '清漳河左岸跃峰渠渠首',
    owner: '邯郸市跃峰渠管理处',
    org: '岳城局',
    proj: '跃峰渠灌区',
    area: '河北省 邯郸市 磁县',
    amt: 22758,
    st: 2,
    months: [1065.7, 881.6, 968.8, 968.8, 1211, 1356.4, 3390.8, 3390.9, 3390.9, 2422.1, 2517, 436],
    reason: ''
  },
  {
    id: 'P103',
    year: '2026',
    cert: 'A410506S2022-0022',
    outlet: '跃进渠渠首（古城村）',
    owner: '安阳市殷都区跃进渠灌区服务中心',
    org: '岳城局',
    proj: '跃进渠灌区',
    area: '河南省 安阳市 安阳县',
    amt: 9796,
    st: 1,
    months: [600, 800, 1000, 1000, 1000, 1000, 400, 400, 600, 900, 800, 1097],
    reason: ''
  },
  {
    id: 'P104',
    year: '2026',
    cert: 'A130227S2021-2093',
    outlet: '潘家口水库库区取水口（顺发）',
    owner: '迁西顺发铁选有限公司',
    org: '邢衡局',
    proj: '迁西顺发铁选',
    area: '河北省 唐山市 迁西县',
    amt: 18,
    st: 0,
    months: [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5],
    reason: ''
  },
  {
    id: 'P105',
    year: '2026',
    cert: 'A130227S2021-1566',
    outlet: '潘家口水库库区取水口（福珍全老厂）',
    owner: '迁西福珍全矿业有限公司老铁选厂',
    org: '水闸局',
    proj: '福珍全矿业铁选',
    area: '河北省 唐山市 迁西县',
    amt: 35,
    st: 3,
    months: [3.2, 3.2, 3.2, 3.1, 3.1, 3.1, 3.1, 3.2, 3.2, 3.2, 3.2, 3.2],
    reason: '年度计划总量超过许可水量上限，请核减后重新上报。'
  },
  {
    id: 'P106',
    year: '2026',
    cert: 'A130227S2021-1809',
    outlet: '大黑汀水库库区取水口（津西钢铁）',
    owner: '河北津西钢铁集团股份有限公司',
    org: '卫河局',
    proj: '津西钢铁',
    area: '河北省 唐山市 迁西县',
    amt: 2000,
    st: 2,
    months: [160, 160, 160, 165, 165, 170, 175, 175, 175, 175, 160, 160],
    reason: ''
  },
  {
    id: 'P107',
    year: '2026',
    cert: '国海(2009)003',
    outlet: '大黑汀水库引滦供水闸',
    owner: '河北省唐山市引滦工程管理局',
    org: '德州局',
    proj: '引滦供水',
    area: '河北省 唐山市 路南区',
    amt: 95000,
    st: 4,
    months: [0, 0, 0, 5416.7, 17499.9, 16666.7, 0, 0, 4166.7, 2083.3, 0, 4166.7],
    reason: ''
  },
  {
    id: 'P108',
    year: '2026',
    cert: 'A130827S2021-1591',
    outlet: '潘家口水库清河口取水口',
    owner: '承德润金水务有限公司',
    org: '聊城局',
    proj: '润金水务供水',
    area: '河北省 承德市 宽城县',
    amt: 760.4,
    st: 1,
    months: [61.5, 61.5, 61.5, 61.5, 61.5, 61.5, 72.1, 71.8, 71.8, 71.8, 61.5, 62],
    reason: ''
  }
])

// 各状态对应的操作按钮（与原型 pwPlanOps 一致）
interface OpItem {
  label: string
  type?: 'primary' | 'danger'
}
const OPS_MAP: Record<PlanStatus, OpItem[]> = {
  0: [
    { label: '编辑', type: 'primary' },
    { label: '上报' },
    { label: '生成建议' },
    { label: '删除', type: 'danger' }
  ],
  1: [{ label: '生成建议' }],
  2: [{ label: '生成建议' }],
  3: [{ label: '重新填报', type: 'primary' }, { label: '生成建议' }],
  4: [] // 海委已批复：无操作按钮
}

// 按状态取操作按钮（模板插槽中 row 为 any，统一在此收敛类型）
function opsOf(st: PlanStatus): OpItem[] {
  return OPS_MAP[st]
}

// 数值格式化：千分位展示（与原型 pwFmt 一致）
function fmt(x: number): string {
  return Number(x).toLocaleString()
}

// 行计划合计 = 12 个月计划水量之和
function rowTotal(row: PlanRow): number {
  return row.months.reduce((a, b) => a + b, 0)
}

/* ---------------- 筛选（原型 pwF：年度 / 状态 / 监管单位 / 关键字） ---------------- */
const fYear = ref('2026')
const fSt = ref('全部')
const fOrg = ref('全部')
const fKw = ref('')

const filteredRows = computed(() => {
  return planRows.value.filter((p) => {
    if (p.year !== fYear.value) {
      return false
    }
    if (fSt.value !== '全部' && STATUS_TEXT[p.st] !== fSt.value) {
      return false
    }
    if (fOrg.value !== '全部' && p.org !== fOrg.value) {
      return false
    }
    const kw = fKw.value.trim()
    if (kw && !(p.cert.includes(kw) || p.owner.includes(kw) || p.outlet.includes(kw))) {
      return false
    }
    return true
  })
})

// 底部统计：许可水量 / 计划水量合计（随筛选结果变化）
const totalAmt = computed(() => filteredRows.value.reduce((a, p) => a + p.amt, 0))
const totalPlan = computed(() => filteredRows.value.reduce((a, p) => a + rowTotal(p), 0))

/* ---------------- 轻提示（原型 toast） ---------------- */
const toastMsg = ref('')
let toastTimer: number | undefined

function toast(msg: string) {
  toastMsg.value = msg
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toastMsg.value = ''), 2200)
}

/* ---------------- 弹框引用 ---------------- */
const formRef = ref<InstanceType<typeof PlanFormModal>>()
const certRef = ref<InstanceType<typeof PlanCertModal>>()
const suggRef = ref<InstanceType<typeof PlanSuggModal>>()
const delRef = ref<InstanceType<typeof PlanDeleteModal>>()

/** ＋ 新增计划 */
function openNew() {
  formRef.value?.show()
}

/** 许可证编号 → 许可证详情 */
function openCert(p: PlanRow) {
  certRef.value?.show(p)
}

/** 生成建议 → 取水计划建议表 */
function openSugg(p: PlanRow) {
  suggRef.value?.show(p)
}

/** 行操作分发（编辑 / 重新填报 / 上报 / 生成建议 / 删除） */
function onRowAct(p: PlanRow, label: string) {
  if (label === '编辑' || label === '重新填报') {
    formRef.value?.show(p)
  } else if (label === '上报') {
    submitRow(p)
  } else if (label === '生成建议') {
    openSugg(p)
  } else if (label === '删除') {
    delRef.value?.show(p)
  }
}

/** 单行上报：待上报 → 已上报待审核 */
function submitRow(p: PlanRow) {
  p.st = 1
  toast(`${p.outlet} 取水计划已上报，等待漳卫南局审核`)
}

/** 一键上报：当前年度所有「待上报」批量上报 */
function submitAll() {
  const list = planRows.value.filter((p) => p.year === fYear.value && p.st === 0)
  if (!list.length) {
    toast('当前没有「待上报」的取水计划')
    return
  }
  list.forEach((p) => (p.st = 1))
  toast(`一键上报成功：${list.length} 份取水计划已报送漳卫南局审核`)
}

/** 保存（新增 / 编辑 / 重新填报） */
function onSave(payload: { id: string | null; cert: string; months: number[] }) {
  if (payload.id) {
    const row = planRows.value.find((r) => r.id === payload.id)
    if (!row) {
      return
    }
    row.months = payload.months
    if (row.st === 3) {
      row.st = 0
      row.reason = ''
    }
    toast(`${row.outlet} 取水计划已更新`)
    return
  }
  // 新增：从证照池带出单位信息，状态为「待上报」
  const lic = LICENSE_POOL.find((l) => l.cert === payload.cert)
  if (!lic) {
    return
  }
  rowSeq += 1
  planRows.value.push({
    id: 'P' + rowSeq,
    year: fYear.value,
    cert: lic.cert,
    outlet: lic.outlet || lic.proj || '取水口',
    owner: lic.owner,
    org: lic.org,
    proj: lic.proj || '',
    area: lic.area || '',
    amt: lic.amt,
    months: payload.months,
    st: 0,
    reason: ''
  })
  toast('新增取水计划已保存')
}
let rowSeq = 300

/** 删除确认后移除 */
function onDeleteConfirm(p: PlanRowLike) {
  const i = planRows.value.findIndex((r) => r.id === p.id)
  if (i >= 0) {
    planRows.value.splice(i, 1)
  }
  toast('取水计划已删除')
}

/* ---------------- 导出 CSV（原型 pwCsv + PW_HEAD_PLAN） ---------------- */
const CSV_HEAD = [
  '编号',
  '许可证编号',
  '取水口名称',
  '取水单位',
  '许可水量',
  ...Array.from({ length: 12 }, (_, i) => `${i + 1}月`),
  '计划合计',
  '状态',
  '操作'
]

function exportCsv() {
  const rows = filteredRows.value.map((p, i) => [
    i + 1,
    p.cert,
    p.outlet,
    p.owner,
    p.amt,
    ...p.months,
    rowTotal(p),
    STATUS_TEXT[p.st],
    ''
  ])
  const csv =
    '\uFEFF' +
    [CSV_HEAD, ...rows]
      .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\r\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = `${fYear.value}年度取水计划信息表.csv`
  a.click()
  URL.revokeObjectURL(a.href)
  toast(`已导出 ${filteredRows.value.length} 条取水计划`)
}

/* ---------------- 表格列：左侧冻结 5 列 + 12 个月列 + 合计/状态/操作 ---------------- */
const monthColumns = Array.from({ length: 12 }, (_, mi) => ({
  title: `${mi + 1}月`,
  width: 64,
  align: 'center' as const,
  params: { mi },
  slots: { default: 'month' }
}))

const columns: VxeGridPropTypes.Columns = [
  { type: 'seq', title: '编号', width: 52, align: 'left', fixed: 'left' },
  {
    field: 'cert',
    title: '许可证编号',
    width: 150,
    align: 'left',
    fixed: 'left',
    slots: { default: 'cert' }
  },
  {
    field: 'outlet',
    title: '取水口名称',
    width: 180,
    align: 'left',
    fixed: 'left',
    showOverflow: 'tooltip'
  },
  {
    field: 'owner',
    title: '取水单位',
    width: 210,
    align: 'left',
    fixed: 'left',
    showOverflow: 'tooltip'
  },
  {
    field: 'amt',
    title: '许可水量',
    width: 96,
    align: 'center',
    fixed: 'left',
    formatter: ({ cellValue }: any) => fmt(Number(cellValue))
  },
  ...monthColumns,
  {
    field: 'sum',
    title: '计划合计',
    width: 84,
    align: 'center',
    slots: { default: 'sum' }
  },
  {
    field: 'st',
    title: '状态',
    width: 104,
    align: 'center',
    fixed: 'right',
    slots: { default: 'st' }
  },
  {
    field: 'op',
    title: '操作',
    width: 240,
    align: 'center',
    fixed: 'right',
    slots: { default: 'op' }
  }
]
</script>

<template>
  <!-- 计划用水管理 · 计划上报（浅色整页视图） -->
  <div class="pw-report-view">
    <div class="plan-card">
      <!-- 页头：标题 + 操作按钮组 -->
      <div class="card-head">
        <h4 class="card-title"><span class="caret">▶</span>取水计划填报与上报</h4>
        <div class="head-btns">
          <button type="button" class="pbtn" @click="openNew">＋ 新增计划</button>
          <button type="button" class="pbtn" @click="submitAll">一键上报</button>
          <button type="button" class="pbtn ghost" @click="exportCsv">导出</button>
        </div>
      </div>

      <!-- 筛选行 -->
      <div class="filter-row">
        <label class="filter-item">
          年度
          <select v-model="fYear" class="w-year">
            <option v-for="y in YEAR_OPTIONS" :key="y" :value="y">{{ y }}</option>
          </select>
        </label>
        <label class="filter-item">
          状态
          <select v-model="fSt" class="w-st">
            <option value="全部">全部</option>
            <option v-for="s in STATUS_TEXT" :key="s" :value="s">{{ s }}</option>
          </select>
        </label>
        <label class="filter-item">
          监管单位
          <select v-model="fOrg" class="w-org">
            <option v-for="o in ORG_OPTIONS" :key="o" :value="o">{{ o }}</option>
          </select>
        </label>
        <label class="filter-item">
          关键字
          <input v-model="fKw" type="text" placeholder="证号 / 取水单位 / 取水口" />
        </label>
      </div>

      <!-- 计划表格：左侧冻结列（编号/许可证编号/取水口名称/取水单位/许可水量）+ 12 个月列，可横向滚动 -->
      <div class="pt-table-wrap">
        <pro-table
          :columns="columns"
          :data="filteredRows"
          :is-pagination="false"
          height="100%"
          empty-text="暂无符合条件的数据"
        >
          <template #cert="{ row }">
            <span class="cert-link" title="点击查看许可证详情" @click="openCert(row)">{{
              row.cert
            }}</span>
          </template>
          <template #month="{ row, column }">
            <span :class="{ m0: !row.months[column.params.mi] }">{{
              fmt(row.months[column.params.mi])
            }}</span>
          </template>
          <template #sum="{ row }">
            <span class="sum-cell">{{ fmt(rowTotal(row)) }}</span>
          </template>
          <template #st="{ row }">
            <span class="stb" :class="'s' + row.st">{{ STATUS_TEXT[row.st] }}</span>
          </template>
          <template #op="{ row }">
            <button
              v-for="op in opsOf(row.st)"
              :key="op.label"
              type="button"
              class="act"
              :class="{ primary: op.type === 'primary', danger: op.type === 'danger' }"
              @click="onRowAct(row, op.label)"
            >
              {{ op.label }}
            </button>
            <span v-if="row.st === 4" class="done-txt">已批复</span>
            <!-- 审核不通过：退回意见以浮层提示展示，替代原表格内附行 -->
            <span v-if="row.st === 3" class="reason-tip" :title="row.reason">退回意见</span>
          </template>
        </pro-table>
      </div>

      <!-- 底部统计 -->
      <div class="card-foot">
        统计：取水口数 <b>{{ filteredRows.length }}</b> 个 ；许可水量
        <b>{{ fmt(totalAmt) }}</b> 万m³ ；计划水量 <b>{{ fmt(totalPlan) }}</b> 万m³
      </div>
    </div>

    <!-- 轻提示 -->
    <div class="pw-toast" :class="{ show: !!toastMsg }">{{ toastMsg }}</div>

    <!-- 弹框：新增/编辑、许可证详情、建议表、删除确认 -->
    <plan-form-modal ref="formRef" :licenses="LICENSE_POOL" @save="onSave" />
    <plan-cert-modal ref="certRef" />
    <plan-sugg-modal ref="suggRef" />
    <plan-delete-modal ref="delRef" @confirm="onDeleteConfirm" />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/style/water-filter.scss' as wf;
/* ===== 页面根容器：占满内容区的浅色视图 ===== */
.pw-report-view {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 10px 14px;
  overflow: hidden;
  //background: #eef3f8;
}

/* ===== 白底卡片 ===== */
.plan-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  //padding: 16px 18px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(31, 74, 132, 0.08);
}

/* 表格容器：占满卡片剩余高度，表体在容器内滚动 */
.pt-table-wrap {
  flex: 1;
  min-height: 0;
}

/* ===== 页头 ===== */
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #24405e;
  display: flex;
  align-items: center;

  .caret {
    margin-right: 8px;
    font-size: 10px;
    color: #1890ff;
    vertical-align: 1px;
  }
}
.head-btns {
  display: flex;
  gap: 10px;
}
.pbtn {
  height: 32px;
  padding: 0 18px;
  font-size: 13px;
  color: #fff;
  cursor: pointer;
  background: #1890ff;
  border: 1px solid #1890ff;
  border-radius: 6px;

  &.ghost {
    color: #1890ff;
    background: #fff;
  }
  &:hover {
    opacity: 0.88;
  }
}

/* ===== 筛选行 ===== */
.filter-row {
  @include wf.row;

  margin-bottom: 14px;
}
.filter-item {
  @include wf.field;

  input {
    width: 170px;
  }
  .w-year {
    width: 82px;
  }
  .w-st {
    width: 132px;
  }
  .w-org {
    width: 110px;
  }
}

/* 许可证编号（点击查看许可证详情） */
.cert-link {
  color: #1890ff;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

/* 月份列（零计划置灰） */
.m0 {
  color: #b9c7da;
}

/* 计划合计列 */
.sum-cell {
  font-weight: 700;
  color: #1f7ae0;
}

/* 状态列：彩色小标签 */
.stb {
  display: inline-block;
  padding: 2px 10px;
  font-size: 12px;
  line-height: 18px;
  border-radius: 999px;

  &.s0 {
    color: #d48806;
    background: #fff7e6;
    border: 1px solid #ffd591;
  }
  &.s1 {
    color: #1890ff;
    background: #e6f4ff;
    border: 1px solid #91caff;
  }
  &.s2 {
    color: #389e0d;
    background: #f6ffed;
    border: 1px solid #b7eb8f;
  }
  &.s3 {
    color: #cf1322;
    background: #fff1f0;
    border: 1px solid #ffa39e;
  }
  &.s4 {
    color: #08979c;
    background: #e6fffb;
    border: 1px solid #87e8de;
  }
}

/* 操作列按钮 */
.act {
  padding: 3px 10px;
  margin-right: 6px;
  font-size: 12px;
  color: #1890ff;
  cursor: pointer;
  background: #fff;
  border: 1px solid #91caff;
  border-radius: 4px;

  &.primary {
    color: #fff;
    background: #1890ff;
    border-color: #1890ff;
  }
  &.danger {
    color: #f5222d;
    border-color: #ffa39e;
  }
  &:hover {
    opacity: 0.85;
  }
}
.done-txt {
  font-size: 12.5px;
  color: #b6c6dc;
}

/* 退回意见提示（以浮层展示退回原因） */
.reason-tip {
  margin-left: 6px;
  font-size: 12px;
  color: #ad6800;
  text-decoration: underline dotted;
  cursor: help;
}

/* ===== 底部统计 ===== */
.card-foot {
  margin-top: 12px;
  font-size: 13px;
  color: #5a7ba6;

  b {
    color: #1f7ae0;
  }
}

/* ===== 轻提示（原型 toast） ===== */
.pw-toast {
  position: fixed;
  top: 84px;
  left: 50%;
  z-index: 3000;
  padding: 9px 22px;
  font-size: 13px;
  color: #e8f3ff;
  pointer-events: none;
  background: rgba(16, 42, 90, 0.92);
  border: 1px solid rgba(90, 166, 255, 0.55);
  border-radius: 18px;
  box-shadow: 0 6px 18px rgba(8, 26, 60, 0.28);
  opacity: 0;
  transform: translate(-50%, -8px);
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;

  &.show {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
</style>
