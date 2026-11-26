<script setup lang="ts">
import { computed, ref } from 'vue'
import ProTable from '@/components/common/ProTable'
import type { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid'
import MeterFillDetailModal from './components/MeterFillDetailModal.vue'
import MeterReviewRejectModal from './components/MeterReviewRejectModal.vue'
import {
  ALARM_TEXT,
  MONTH_OPTIONS,
  ORG_OPTIONS,
  REPORT_MONTH,
  REVIEW_STATUS_TEXT,
  YEAR_OPTIONS,
  approveReview,
  clearFinalUse,
  fmt,
  rejectReview,
  resetReview,
  reviewStatusOf,
  rowsOf,
  setFinalUse,
  type FinalUse,
  type MeterRow,
  type ReviewStatus
} from '../shuiliangshangbao/meterShared'

/**
 * 水量复核 · 水量审核（浅色整页视图）
 * 复刻自静态原型 #pwReviewView，数据与「水量上报」共用 meterShared 共享状态，
 * 行结构与列头源自原型 renderPwReview。
 */

/** 审核行 = 复核行 + 审核状态 */
interface ReviewRow extends MeterRow {
  vst: ReviewStatus
}

/* ---------------- 筛选条件（原型 pwVF） ---------------- */
const year = ref(YEAR_OPTIONS[0])
const month = ref(REPORT_MONTH)
const org = ref('全部')
const owner = ref('')
const reviewSt = ref('全部')

/** 当月全部审核行（不受筛选影响，导出用） */
const monthRows = computed<ReviewRow[]>(() =>
  rowsOf(month.value).map((r) => ({ ...r, vst: reviewStatusOf(r.id, month.value) }))
)

/** 按筛选条件过滤后的行 */
const filteredRows = computed(() => {
  const kw = owner.value.trim()
  return monthRows.value.filter(
    (r) =>
      (org.value === '全部' || r.org === org.value) &&
      (!kw || r.owner.includes(kw)) &&
      (reviewSt.value === '全部' || REVIEW_STATUS_TEXT[r.vst] === reviewSt.value)
  )
})

/* ---------------- 底部统计 ---------------- */
const volSum = computed(
  () => Math.round(filteredRows.value.reduce((a, r) => a + r.vol, 0) * 10) / 10
)
const manSum = computed(
  () => Math.round(filteredRows.value.reduce((a, r) => a + (r.man ?? 0), 0) * 10) / 10
)
const waitCount = computed(() => filteredRows.value.filter((r) => r.vst === 0).length)
const passCount = computed(() => filteredRows.value.filter((r) => r.vst === 1).length)
const rejectCount = computed(() => filteredRows.value.filter((r) => r.vst === 2).length)
const useOnlineCount = computed(() => filteredRows.value.filter((r) => r.fin === '在线计量').length)
const useManualCount = computed(() => filteredRows.value.filter((r) => r.fin === '人工填报').length)
const useNoneCount = computed(() => filteredRows.value.filter((r) => !r.fin).length)

/* ---------------- 轻提示（原型 toast） ---------------- */
const toastMsg = ref('')
let toastTimer: number | undefined

function toast(msg: string) {
  toastMsg.value = msg
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toastMsg.value = ''), 2200)
}

/* ---------------- 弹框引用 ---------------- */
const rejectRef = ref<InstanceType<typeof MeterReviewRejectModal>>()
const detailRef = ref<InstanceType<typeof MeterFillDetailModal>>()

/** 查看填报详情 */
function openDetail(r: ReviewRow) {
  detailRef.value?.show(r)
}

/** 审核通过 */
function onApprove(r: ReviewRow) {
  approveReview(r.id, month.value)
  toast(`${r.outlet} ${month.value} 月度上报数据已审核通过`)
}

/** 退回重报：打开退回意见弹框 */
function onRejectOpen(r: ReviewRow) {
  rejectRef.value?.show(r)
}

/** 确认退回：记录审核不通过与退回意见 */
function onRejectConfirm(payload: { id: string; month: string; reason: string }) {
  const row = monthRows.value.find((r) => r.id === payload.id)
  rejectReview(payload.id, payload.month, payload.reason)
  toast(
    `已退回 ${row?.outlet ?? payload.id} ${payload.month} 的月度上报数据，取水户可修改后重新上报`
  )
}

/** 撤销审核状态 */
function onReset(r: ReviewRow) {
  resetReview(r.id, month.value)
  toast('已撤销该条记录的审核状态')
}

/** 确定最终采用数据 */
function onUse(r: ReviewRow, use: FinalUse) {
  setFinalUse(r.id, month.value, use)
  toast(`已确定以${use}数据为最终采用数据`)
}

/** 取消最终采用数据 */
function onClearUse(r: ReviewRow) {
  clearFinalUse(r.id, month.value)
  toast('已取消最终采用数据的指定，可重新选定')
}

/** 批量通过：当前筛选结果中的「待审核」记录 */
function batchApprove() {
  const list = filteredRows.value.filter((r) => r.vst === 0)
  if (!list.length) {
    toast('当前没有「待审核」的上报记录')
    return
  }
  list.forEach((r) => approveReview(r.id, month.value))
  toast(`已批量审核通过 ${list.length} 条 ${month.value} 月度上报记录（演示）`)
}

/* ---------------- 导出 CSV（原型 pwVExport） ---------------- */
function exportCsv() {
  const head = [
    '序号',
    '监管单位',
    '取水权人',
    '取水项目',
    '行政区',
    '许可水量(万m³)',
    '上报月份',
    '月批复计划(万m³)',
    '在线水量(万m³)',
    '填报水量(万m³)',
    '填报来源',
    '年累计水量(万m³)',
    '超警情况',
    '最终采用',
    '审核状态'
  ]
  const rows = monthRows.value
    .filter((r) => org.value === '全部' || r.org === org.value)
    .map((r, i) => [
      i + 1,
      r.org,
      r.owner,
      r.proj,
      r.area,
      r.amt,
      r.time,
      r.plan,
      r.vol,
      r.man === null ? '' : r.man,
      r.src,
      r.acc,
      ALARM_TEXT[r.al],
      r.fin || '未确定',
      REVIEW_STATUS_TEXT[r.vst]
    ])
  const csv =
    '\uFEFF' +
    [head, ...rows]
      .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\r\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = `${month.value}水量复核月度审核表.csv`
  a.click()
  URL.revokeObjectURL(a.href)
  toast(`已导出 ${rows.length} 条月度审核数据`)
}

/* ---------------- 表格列（字段、顺序与原型一致） ---------------- */
const columns: VxeGridPropTypes.Columns = [
  { type: 'seq', title: '序号', width: 60, align: 'left' },
  { field: 'org', title: '监管单位', minWidth: 100, align: 'left' },
  { field: 'owner', title: '取水权人', minWidth: 190, align: 'left', showOverflow: 'tooltip' },
  { field: 'proj', title: '取水项目', minWidth: 190, align: 'left', showOverflow: 'tooltip' },
  { field: 'area', title: '行政区', minWidth: 150, align: 'center' },
  {
    field: 'amt',
    title: '许可水量',
    minWidth: 100,
    align: 'center',
    formatter: ({ cellValue }: any) => fmt(Number(cellValue))
  },
  { field: 'time', title: '上报月份', minWidth: 105, align: 'center' },
  {
    field: 'plan',
    title: '月批复计划',
    minWidth: 110,
    align: 'center',
    formatter: ({ cellValue }: any) => fmt(Number(cellValue))
  },
  {
    field: 'vol',
    title: '在线水量',
    minWidth: 110,
    align: 'center',
    formatter: ({ cellValue }: any) => fmt(Number(cellValue))
  },
  { field: 'man', title: '填报水量', minWidth: 110, align: 'center', slots: { default: 'man' } },
  { field: 'src', title: '填报来源', minWidth: 100, align: 'center', slots: { default: 'src' } },
  { field: 'acc', title: '年累计水量', minWidth: 110, align: 'center', slots: { default: 'acc' } },
  {
    field: 'fin',
    title: '最终采用数据',
    minWidth: 150,
    align: 'center',
    slots: { default: 'fin' }
  },
  { field: 'vst', title: '审核状态', width: 120, align: 'center', slots: { default: 'vst' } },
  {
    field: 'op',
    title: '审核操作',
    width: 200,
    align: 'center',
    fixed: 'right',
    slots: { default: 'op' }
  }
]
</script>

<template>
  <!-- 水量复核 · 水量审核（浅色整页视图） -->
  <div class="pw-review-view">
    <div class="review-card">
      <!-- 页头：标题 + 操作按钮组 -->
      <div class="card-head">
        <h4 class="card-title"><span class="caret">▶</span>月度水量审核</h4>
        <div class="head-btns">
          <button type="button" class="pbtn" @click="batchApprove">批量通过</button>
          <button type="button" class="pbtn ghost" @click="exportCsv">导出</button>
        </div>
      </div>

      <!-- 筛选行 -->
      <div class="filter-row">
        <label class="filter-item">
          年度
          <select v-model="year" class="w-year">
            <option v-for="y in YEAR_OPTIONS" :key="y" :value="y">{{ y }}</option>
          </select>
        </label>
        <label class="filter-item">
          月份
          <select v-model="month" class="w-month">
            <option v-for="m in MONTH_OPTIONS" :key="m" :value="m">{{ m }}</option>
          </select>
        </label>
        <label class="filter-item">
          监管单位
          <select v-model="org" class="w-org">
            <option v-for="o in ORG_OPTIONS" :key="o" :value="o">{{ o }}</option>
          </select>
        </label>
        <label class="filter-item">
          取水权人
          <input v-model="owner" type="text" placeholder="取水权人名称模糊搜索" />
        </label>
        <label class="filter-item">
          审核状态
          <select v-model="reviewSt" class="w-st">
            <option>全部</option>
            <option v-for="s in REVIEW_STATUS_TEXT" :key="s" :value="s">{{ s }}</option>
          </select>
        </label>
      </div>

      <!-- 审核表格 -->
      <div class="pt-table-wrap">
        <pro-table
          :columns="columns"
          :data="filteredRows"
          :is-pagination="false"
          height="100%"
          empty-text="该月份暂无待审核的上报数据"
        >
          <template #man="{ row }">
            <span v-if="row.man === null" class="empty-txt">未填报</span>
            <span v-else>{{ fmt(row.man) }}</span>
          </template>
          <template #src="{ row }">
            <span class="srctag">{{ row.src }}</span>
          </template>
          <template #acc="{ row }">
            <span class="sum-cell">{{ fmt(row.acc) }}</span>
          </template>
          <template #fin="{ row }">
            <template v-if="row.fin">
              <span class="usetag" :class="{ manual: row.fin === '人工填报' }">{{ row.fin }}</span>
              <span class="edit-link" @click="onClearUse(row)">改</span>
            </template>
            <template v-else>
              <button
                type="button"
                class="act"
                title="以在线计量数据为最终采用"
                @click="onUse(row, '在线计量')"
              >
                用在线
              </button>
              <button
                type="button"
                class="act"
                title="以人工填报数据为最终采用"
                @click="onUse(row, '人工填报')"
              >
                用人工
              </button>
            </template>
          </template>
          <template #vst="{ row }">
            <span class="stb" :class="'s' + row.vst">{{ REVIEW_STATUS_TEXT[row.vst] }}</span>
          </template>
          <template #op="{ row }">
            <!-- 待审核：通过 / 退回 / 详情 -->
            <template v-if="row.vst === 0">
              <button type="button" class="pa ok" title="审核通过" @click="onApprove(row)">
                ✔
              </button>
              <button type="button" class="pa no" title="退回重报" @click="onRejectOpen(row)">
                ✖
              </button>
            </template>
            <!-- 已审核：撤销 / 详情 / 退回意见 -->
            <template v-else>
              <button type="button" class="act" @click="onReset(row)">撤销</button>
            </template>
            <button type="button" class="act" @click="openDetail(row)">详情</button>
            <span v-if="row.vst === 2" class="reason-tip" :title="row.reason">退回意见</span>
          </template>
        </pro-table>
      </div>

      <!-- 底部统计 -->
      <div class="card-foot">
        统计：上报记录 <b>{{ filteredRows.length }}</b> 条 ；在线计量 <b>{{ fmt(volSum) }}</b> 万m³
        ；人工填报 <b>{{ fmt(manSum) }}</b> 万m³ ；待审核 <b class="warn">{{ waitCount }}</b> 条
        ；审核通过 <b class="ok">{{ passCount }}</b> 条 ；审核不通过
        <b class="danger">{{ rejectCount }}</b> 条 ；最终采用：在线计量
        <b>{{ useOnlineCount }}</b> 条 / 人工填报 <b>{{ useManualCount }}</b> 条 / 未确定
        <b class="warn">{{ useNoneCount }}</b> 条
      </div>
    </div>

    <!-- 轻提示 -->
    <div class="pw-toast" :class="{ show: !!toastMsg }">{{ toastMsg }}</div>

    <!-- 弹框：退回意见、填报详情 -->
    <meter-review-reject-modal ref="rejectRef" @confirm="onRejectConfirm" />
    <meter-fill-detail-modal ref="detailRef" />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/style/water-filter.scss' as wf;
/* ===== 页面根容器：占满内容区的浅色视图 ===== */
.pw-review-view {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 10px 14px;
  overflow: hidden;
}

/* ===== 白底卡片 ===== */
.review-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 10px 14px;
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

  input[type='text'] {
    width: 170px;
  }
  .w-year {
    width: 82px;
  }
  .w-month {
    width: 108px;
  }
  .w-org {
    width: 110px;
  }
  .w-st {
    width: 132px;
  }
}

/* ===== 表格单元格 ===== */
.empty-txt {
  color: #b6c6dc;
}
.sum-cell {
  font-weight: 700;
  color: #1f7ae0;
}

/* 填报来源标签 */
.srctag {
  display: inline-block;
  padding: 1px 8px;
  font-size: 12px;
  color: #08979c;
  background: #e6fffb;
  border: 1px solid #87e8de;
  border-radius: 999px;
}

/* 最终采用标签 */
.usetag {
  display: inline-block;
  padding: 1px 8px;
  font-size: 12px;
  color: #389e0d;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 999px;

  &.manual {
    color: #08979c;
    background: #e6fffb;
    border-color: #87e8de;
  }
}
.edit-link {
  margin-left: 6px;
  font-size: 12px;
  color: #1f7ae0;
  text-decoration: underline;
  cursor: pointer;
}

/* 审核状态：彩色小标签（0 待审核 / 1 通过 / 2 不通过） */
.stb {
  display: inline-block;
  padding: 2px 10px;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
  border-radius: 999px;

  &.s0 {
    color: #d48806;
    background: #fff7e6;
    border: 1px solid #ffd591;
  }
  &.s1 {
    color: #389e0d;
    background: #f6ffed;
    border: 1px solid #b7eb8f;
  }
  &.s2 {
    color: #cf1322;
    background: #fff1f0;
    border: 1px solid #ffa39e;
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
  }
  &.no {
    color: #cf1322;
    background: #fff1f0;
    border: 1px solid #ffa39e;
  }
  &:hover {
    opacity: 0.85;
  }
}

/* 文本按钮（原型 lact） */
.act {
  padding: 3px 10px;
  margin-right: 6px;
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

/* 退回意见（悬停查看） */
.reason-tip {
  font-size: 12px;
  color: #cf1322;
  text-decoration: underline;
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
  .danger {
    color: #f5222d;
  }
  .warn {
    color: #d48806;
  }
  .ok {
    color: #149a5b;
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
  white-space: nowrap;
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
