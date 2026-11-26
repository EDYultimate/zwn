<script setup lang="ts">
import { computed, ref } from 'vue'
import ProTable from '@/components/common/ProTable'
import type { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid'
import PlanCertModal from '../jihuashangbao/components/PlanCertModal.vue'
import PlanAuditRejectModal from './components/PlanAuditRejectModal.vue'
import type { PlanRowLike } from '../jihuashangbao/components/PlanFormModal.vue'

/**
 * 计划用水管理 · 计划审核（浅色整页视图）
 * 复刻自静态原型 #pwAuditView，数据为本地 mock，
 * 数值文案源自原型 PW_TEST / PW_HEAD_PLAN / renderPwAudit。
 */

// 计划状态：1 已上报待审核 / 2 审核通过 / 3 审核不通过 / 4 海委已批复
// （审核视图只展示已上报的计划，原型中 st=0 待上报的数据不进入本视图）
type AuditStatus = 1 | 2 | 3 | 4

// 审核行数据结构
interface AuditRow {
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
  st: AuditStatus // 计划状态
  reason: string // 退回意见（仅"审核不通过"时有值）
}

// 状态文案（与原型 PW_ST 下标对应）
const STATUS_TEXT = ['待上报', '已上报待审核', '审核通过', '审核不通过', '海委已批复']

// 状态筛选项（原型审核视图仅提供 1-4 状态）
const STATUS_OPTIONS = STATUS_TEXT.slice(1)

// 监管单位筛选项
const ORG_OPTIONS = ['全部', '岳城局', '邢衡局', '水闸局', '卫河局', '德州局', '聊城局']

// 2026 年审核计划行 mock（共 8 行，覆盖待审核/通过/不通过/已批复 4 种状态）
const auditRows = ref<AuditRow[]>([
  {
    id: 'P101',
    year: '2026',
    proj: '跃峰渠灌区',
    area: '河北省 邯郸市 磁县',
    cert: 'A130426S2022-0021',
    outlet: '漳河左岸跃峰渠渠首',
    owner: '邯郸市跃峰渠灌区服务中心',
    org: '岳城局',
    amt: 9069,
    st: 4,
    months: [500, 609, 561, 573, 767, 494, 700, 700, 700, 1300, 965, 1200],
    reason: ''
  },
  {
    id: 'P102',
    year: '2026',
    proj: '跃峰渠灌区',
    area: '河北省 邯郸市 磁县',
    cert: 'A130426S2022-0040',
    outlet: '清漳河左岸跃峰渠渠首',
    owner: '邯郸市跃峰渠管理处',
    org: '岳城局',
    amt: 22758,
    st: 2,
    months: [1065.7, 881.6, 968.8, 968.8, 1211, 1356.4, 3390.8, 3390.9, 3390.9, 2422.1, 2517, 436],
    reason: ''
  },
  {
    id: 'P103',
    year: '2026',
    proj: '跃进渠灌区',
    area: '河南省 安阳市 安阳县',
    cert: 'A410506S2022-0022',
    outlet: '跃进渠渠首（古城村）',
    owner: '安阳市殷都区跃进渠灌区服务中心',
    org: '岳城局',
    amt: 9796,
    st: 1,
    months: [600, 800, 1000, 1000, 1000, 1000, 400, 400, 600, 900, 800, 1097],
    reason: ''
  },
  {
    id: 'P104',
    year: '2026',
    proj: '红旗渠灌区',
    area: '河南省 安阳市 林州市',
    cert: 'A410581S2022-0023',
    outlet: '红旗渠渠首分水闸',
    owner: '林州市红旗渠灌区服务中心',
    org: '岳城局',
    amt: 19592,
    st: 1,
    months: [
      1600.1, 1551.8, 969.8, 581.9, 1551.8, 1823.3, 1357.7, 1357.7, 1357.7, 1357.7, 1357.7, 4132.8
    ],
    reason: ''
  },
  {
    id: 'P105',
    year: '2026',
    proj: '福珍全矿业铁选',
    area: '河北省 唐山市 迁西县',
    cert: 'A130227S2021-1566',
    outlet: '潘家口水库库区取水口（福珍全老厂）',
    owner: '迁西福珍全矿业有限公司老铁选厂',
    org: '水闸局',
    amt: 35,
    st: 3,
    months: [3.2, 3.2, 3.2, 3.1, 3.1, 3.1, 3.1, 3.2, 3.2, 3.2, 3.2, 3.2],
    reason: '年度计划总量超过许可水量上限，请核减后重新上报。'
  },
  {
    id: 'P106',
    year: '2026',
    proj: '津西钢铁',
    area: '河北省 唐山市 迁西县',
    cert: 'A130227S2021-1809',
    outlet: '大黑汀水库库区取水口（津西钢铁）',
    owner: '河北津西钢铁集团股份有限公司',
    org: '卫河局',
    amt: 2000,
    st: 2,
    months: [160, 160, 160, 165, 165, 170, 175, 175, 175, 175, 160, 160],
    reason: ''
  },
  {
    id: 'P107',
    year: '2026',
    proj: '引滦供水',
    area: '河北省 唐山市 路南区',
    cert: '国海(2009)003',
    outlet: '大黑汀水库引滦供水闸',
    owner: '河北省唐山市引滦工程管理局',
    org: '德州局',
    amt: 95000,
    st: 4,
    months: [0, 0, 0, 5416.7, 17499.9, 16666.7, 0, 0, 4166.7, 2083.3, 0, 4166.7],
    reason: ''
  },
  {
    id: 'P108',
    year: '2026',
    proj: '润金水务供水',
    area: '河北省 承德市 宽城县',
    cert: 'A130827S2021-1591',
    outlet: '潘家口水库清河口取水口',
    owner: '承德润金水务有限公司',
    org: '聊城局',
    amt: 760.4,
    st: 1,
    months: [61.5, 61.5, 61.5, 61.5, 61.5, 61.5, 72.1, 71.8, 71.8, 71.8, 61.5, 62],
    reason: ''
  }
])

// 数值格式化：千分位展示（与原型 pwFmt 一致）
function fmt(x: number): string {
  return Number(x).toLocaleString()
}

// 行计划合计 = 12 个月计划水量之和
function rowTotal(row: AuditRow): number {
  return row.months.reduce((a, b) => a + b, 0)
}

/* ---------------- 筛选（原型 pwAF：状态 / 监管单位 / 关键字） ---------------- */
const fSt = ref('全部')
const fOrg = ref('全部')
const fKw = ref('')

const filteredRows = computed(() =>
  auditRows.value.filter((p) => {
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
)

// 底部统计：各状态份数与批复计划水量（随筛选结果变化）
const countBySt = (st: AuditStatus) => filteredRows.value.filter((p) => p.st === st).length
const st1Count = computed(() => countBySt(1))
const st2Count = computed(() => countBySt(2))
const st3Count = computed(() => countBySt(3))
const st4Count = computed(() => countBySt(4))
// 批复计划水量 = 海委已批复行的计划合计之和
const approvedTotal = computed(() =>
  filteredRows.value.filter((p) => p.st === 4).reduce((a, p) => a + rowTotal(p), 0)
)

/* ---------------- 轻提示（原型 toast） ---------------- */
const toastMsg = ref('')
let toastTimer: number | undefined

function toast(msg: string) {
  toastMsg.value = msg
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toastMsg.value = ''), 2200)
}

/* ---------------- 弹框引用 ---------------- */
const certRef = ref<InstanceType<typeof PlanCertModal>>()
const rejectRef = ref<InstanceType<typeof PlanAuditRejectModal>>()

/** 许可证编号 → 许可证详情 */
function openCert(p: AuditRow) {
  certRef.value?.show(p)
}

/** 审核通过：已上报待审核 → 审核通过 */
function onApprove(p: AuditRow) {
  p.st = 2
  toast(`${p.outlet} 取水计划审核通过，可报送海委批复`)
}

/** 退回：打开退回意见弹框 */
function onRejectOpen(p: AuditRow) {
  rejectRef.value?.show(p)
}

/** 确认退回：审核不通过 + 记录退回意见 */
function onRejectConfirm(p: PlanRowLike, reason: string) {
  const row = auditRows.value.find((r) => r.id === p.id)
  if (!row) {
    return
  }
  row.st = 3
  row.reason = reason
  toast(`已退回 ${row.outlet} 的取水计划，取水户可修改后重新上报`)
}

/** 报送海委：审核通过 → 海委已批复 */
function sendHw(p: AuditRow) {
  p.st = 4
  toast(`${p.outlet} 计划已报送海委并批复（演示），已关联电子证照`)
}

/** 批量报送海委：本年度所有「审核通过」→「海委已批复」 */
function sendAll() {
  const list = auditRows.value.filter((p) => p.year === '2026' && p.st === 2)
  if (!list.length) {
    toast('当前没有可报送的「审核通过」计划')
    return
  }
  list.forEach((p) => (p.st = 4))
  toast(`已批量报送海委：${list.length} 份计划批复完成（演示），批复计划已关联电子证照`)
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
  const list = auditRows.value.filter((p) => p.year === '2026')
  const rows = list.map((p, i) => [
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
  a.download = '2026年度取水计划审核表.csv'
  a.click()
  URL.revokeObjectURL(a.href)
  toast(`已导出 ${list.length} 条取水计划审核数据`)
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
    title: '审核操作',
    width: 130,
    align: 'center',
    fixed: 'right',
    slots: { default: 'op' }
  }
]
</script>

<template>
  <!-- 计划用水管理 · 计划审核（浅色整页视图） -->
  <div class="pw-audit-view">
    <div class="audit-card">
      <!-- 页头：标题 + 操作按钮组 -->
      <div class="card-head">
        <h4 class="card-title"><span class="caret">▶</span>取水计划审核与报送</h4>
        <div class="head-btns">
          <button type="button" class="pbtn" @click="sendAll">批量报送海委</button>
          <button type="button" class="pbtn ghost" @click="exportCsv">导出</button>
        </div>
      </div>

      <!-- 筛选行 -->
      <div class="filter-row">
        <label class="filter-item">
          年度
          <select class="w-year">
            <option>2026</option>
          </select>
        </label>
        <label class="filter-item">
          状态
          <select v-model="fSt" class="w-st">
            <option value="全部">全部</option>
            <option v-for="s in STATUS_OPTIONS" :key="s" :value="s">{{ s }}</option>
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

      <!-- 审核表格：左侧冻结列（编号/许可证编号/取水口名称/取水单位/许可水量）+ 12 个月列，可横向滚动 -->
      <div class="pt-table-wrap">
        <pro-table
          :columns="columns"
          :data="filteredRows"
          :is-pagination="false"
          height="100%"
          empty-text="暂无待审核数据"
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
            <!-- 待审核：通过 / 退回 -->
            <template v-if="row.st === 1">
              <button type="button" class="pa ok" title="审核通过" @click="onApprove(row)">
                ✔
              </button>
              <button type="button" class="pa no" title="退回" @click="onRejectOpen(row)">✖</button>
            </template>
            <!-- 审核通过：可报送海委 -->
            <button v-else-if="row.st === 2" type="button" class="act" @click="sendHw(row)">
              报送海委
            </button>
            <!-- 审核不通过：已退回（退回意见以浮层提示展示，替代原表格内附行） -->
            <span v-else-if="row.st === 3" class="back-txt" :title="row.reason">已退回</span>
            <!-- 海委已批复 -->
            <span v-else class="done-txt">已批复</span>
          </template>
        </pro-table>
      </div>

      <!-- 底部统计 -->
      <div class="card-foot">
        统计：待审核 <b>{{ st1Count }}</b> 份 ；审核通过 <b>{{ st2Count }}</b> 份 ；审核不通过
        <b>{{ st3Count }}</b> 份 ；海委已批复 <b>{{ st4Count }}</b> 份 ；批复计划水量
        <b>{{ fmt(approvedTotal) }}</b> 万m³
      </div>
    </div>

    <!-- 轻提示 -->
    <div class="pw-toast" :class="{ show: !!toastMsg }">{{ toastMsg }}</div>

    <!-- 弹框：许可证详情、退回意见 -->
    <plan-cert-modal ref="certRef" />
    <plan-audit-reject-modal ref="rejectRef" @confirm="onRejectConfirm" />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/style/water-filter.scss' as wf;
/* ===== 页面根容器：占满内容区的浅色视图 ===== */
.pw-audit-view {
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
.audit-card {
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

/* ===== 审核表格容器 ===== */

/* 许可证编号（可点击查看详情） */
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
/* 通过 / 退回：圆形图标按钮（原型 pa-ok / pa-no） */
.pa {
  width: 26px;
  height: 26px;
  padding: 0;
  margin-right: 6px;
  font-size: 13px;
  cursor: pointer;
  border-radius: 50%;

  &.ok {
    color: #389e0d;
    background: #f6ffed;
    border: 1px solid #b7eb8f;

    &:hover {
      opacity: 0.85;
    }
  }
  &.no {
    color: #cf1322;
    background: #fff1f0;
    border: 1px solid #ffa39e;

    &:hover {
      opacity: 0.85;
    }
  }
}
/* 报送海委：文本按钮（原型 lact） */
.act {
  padding: 3px 10px;
  font-size: 12px;
  color: #1890ff;
  cursor: pointer;
  background: #fff;
  border: 1px solid #91caff;
  border-radius: 4px;

  &:hover {
    opacity: 0.85;
  }
}
/* 已退回 / 已批复：状态文字 */
.back-txt {
  font-size: 12.5px;
  color: #b6c6dc;
}
.done-txt {
  font-size: 12.5px;
  color: #0e7fa8;
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
