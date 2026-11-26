<script setup lang="ts">
import { computed, ref } from 'vue'
import ProTable from '@/components/common/ProTable'
import type { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid'
import RptAddModal, { type RptAddPayload } from './components/RptAddModal.vue'
import RptHisModal, { type RptHisRow } from './components/RptHisModal.vue'
import RptQueryModal from './components/RptQueryModal.vue'

// ============ 本地 mock 数据 ============
// 数据源：《漳卫南局重点取水口取水日报》（2025年第93期，2025-09-11）

// 重点取水口取水基础数据行（null 表示未上报 / 无数据，展示为空或"未上报"）
interface RptDayRow {
  name: string // 取水口名称
  dayQty: number | null // 当日取水量
  monthPlan: number | null // 当月计划
  monthTotal: number | null // 当月累计
  yearPermit: number | null // 年度许可
  yearTotal: number | null // 年度累计
  org: string // 监管单位
  note: string // 备注
}

// 水资源监控运行情况数据行
interface RptOpsRow {
  name: string // 取水口名称
  meter: string // 计量、视频情况
  fix: string // 整改进展情况
  org: string // 监管单位
  note: string // 备注
}

const rptDayList: RptDayRow[] = [
  {
    name: '民有渠',
    dayQty: 0,
    monthPlan: 40,
    monthTotal: 0,
    yearPermit: 6202,
    yearTotal: 9340.7904,
    org: '岳城局',
    note: ''
  },
  {
    name: '引岳济邯',
    dayQty: 0,
    monthPlan: 109,
    monthTotal: 18.85248,
    yearPermit: 1600,
    yearTotal: 1445.76156,
    org: '岳城局',
    note: ''
  },
  {
    name: '漳南渠',
    dayQty: 65.232,
    monthPlan: 600,
    monthTotal: 102.0336,
    yearPermit: 3914,
    yearTotal: 2720.8176,
    org: '岳城局',
    note: ''
  },
  {
    name: '引岳入安',
    dayQty: 1.13184,
    monthPlan: 360,
    monthTotal: 11.11104,
    yearPermit: 3080,
    yearTotal: 802.9712,
    org: '岳城局',
    note: ''
  },
  {
    name: '和平闸',
    dayQty: 338.6,
    monthPlan: 350,
    monthTotal: 445.578,
    yearPermit: 1000,
    yearTotal: 1012.148,
    org: '水闸局',
    note: ''
  },
  {
    name: '草寺闸',
    dayQty: 34.5,
    monthPlan: 175,
    monthTotal: 58.552,
    yearPermit: 500,
    yearTotal: 58.552,
    org: '水闸局',
    note: ''
  },
  {
    name: '路庄扬水站',
    dayQty: 16,
    monthPlan: 110,
    monthTotal: 71.9,
    yearPermit: 1410.87,
    yearTotal: 624.8,
    org: '邯郸局',
    note: ''
  },
  {
    name: '马头扬水站',
    dayQty: 2,
    monthPlan: null,
    monthTotal: 3,
    yearPermit: null,
    yearTotal: 28.1,
    org: '邯郸局',
    note: ''
  },
  {
    name: '肖村扬水站',
    dayQty: 1.5,
    monthPlan: null,
    monthTotal: 1.5,
    yearPermit: null,
    yearTotal: 22.27,
    org: '邯郸局',
    note: ''
  },
  {
    name: '班庄扬水站',
    dayQty: null,
    monthPlan: 300,
    monthTotal: null,
    yearPermit: 4200,
    yearTotal: null,
    org: '聊城局',
    note: '未安装计量设施，整改中'
  },
  {
    name: '乜村扬水站',
    dayQty: 10.07,
    monthPlan: 100,
    monthTotal: 45.24,
    yearPermit: 990,
    yearTotal: 633.74,
    org: '聊城局',
    note: ''
  },
  {
    name: '头闸口扬水站',
    dayQty: null,
    monthPlan: 101.8,
    monthTotal: null,
    yearPermit: 341.8,
    yearTotal: null,
    org: '聊城局',
    note: ''
  },
  {
    name: '军留扬水站',
    dayQty: 38,
    monthPlan: 150,
    monthTotal: 62,
    yearPermit: 2900,
    yearTotal: 681.5,
    org: '邯郸局',
    note: ''
  }
]

const rptOpsList = ref<RptOpsRow[]>([
  {
    name: '瓦岗提灌站',
    meter: '计量运行不正常（责任单位：取水户）',
    fix: '8月29日汤阴县水利局提交《关于瓦岗提灌站取水量的情况说明》',
    org: '卫河局',
    note: '6月24日卫河局对瓦岗进行测流，与平台水量不一致；建议9月4日-12月31日取水计划按62.56万m³控制。'
  },
  {
    name: '班庄扬水站',
    meter: '未安装计量设施（责任单位：取水户）',
    fix: '未完成整改',
    org: '聊城局',
    note: '整改函要求7月15日完成整改；6月27日以《工作提醒》督促，班庄承诺8月底前完成安装调试。'
  },
  {
    name: '尖塚扬水站',
    meter: '未实现计量数据上传（责任单位：取水户）',
    fix: '未完成整改',
    org: '邢衡局',
    note: '7月3日邢衡局报送整改说明，承诺8月8日前接入全国取用水管理平台。'
  },
  {
    name: '武城头屯泵站',
    meter: '计量数据未上传（取水户）、视频未恢复（运维单位）',
    fix: '6月24日武城县水利局发文，已列入在建项目信息化建设',
    org: '德州局',
    note: '7月7日漳卫南局以《工作提醒（水资源处2025年31号）》督促。'
  },
  {
    name: '周尹涵闸',
    meter: '计量数据未上传（责任单位：取水户）',
    fix: '未完成整改',
    org: '德州局',
    note: '6月5日德州局反馈未完成整改，已下达整改函。'
  },
  {
    name: '吕洼引水闸',
    meter: '计量数据未上传（取水户）、视频设备损坏（运维单位）',
    fix: '未完成整改',
    org: '水闸局',
    note: '9月3日水资源处以《工作提醒（水资源处2025年33号）》督促。'
  },
  {
    name: '梳头李引水闸',
    meter: '计量数据未上传（责任单位：取水户）',
    fix: '未完成整改',
    org: '水闸局',
    note: '整改函要求6月30日前上传至漳卫南局平台和全国取用水管理平台；水闸局报送整改报告，未完成。'
  },
  {
    name: '跃丰引水闸',
    meter: '未安装（责任单位：取水户）',
    fix: '未完成整改',
    org: '水闸局',
    note: '整改函要求7月15日前完成；6月30日水闸局报送整改情况报告，未完成。'
  },
  {
    name: '芦庄闸',
    meter: '计量运行不正常（责任单位：取水户）',
    fix: '未完成整改',
    org: '邢衡局',
    note: '8月2日测流5.71m³/s，全国平台数据为0。'
  },
  {
    name: '岔河咀扬水站',
    meter: '计量运行不正常（责任单位：取水户）',
    fix: '未完成整改',
    org: '邯郸局',
    note: '大名县水利局将于汛后原址重建，同步建设在线计量设施并上传平台。'
  }
])

// ============ 页面状态 ============
// base：取水基本情况表；ops：水资源监控运行情况表（与原型一致，通过按钮切换）
const rptDayMode = ref<'base' | 'ops'>('base')
const rptDayDate = ref('2025-09-11')

// 数据较多时每张表最多展示 8 行（合计与脚注仍按全量数据统计）
const MAX_ROWS = 8

// 报表副标题（期号与编制单位，与原型一致）
const reportSub = '2025年第93期 · 水资源管理与保护处编制'

// 视图标题：随模式切换
const pageTitle = computed(() =>
  rptDayMode.value === 'base' ? '重点取水口取水日报' : '水资源监控运行情况'
)

// 切换按钮文案：base 模式下去看运行情况，ops 模式下返回基本情况
const modeBtnText = computed(() => (rptDayMode.value === 'base' ? '运行情况' : '取水基本情况'))

// 切换报表模式
function toggleMode() {
  rptDayMode.value = rptDayMode.value === 'base' ? 'ops' : 'base'
}

// 日报表头日期 = 所选日期的前一天（与原型渲染逻辑一致）
const prevDate = computed(() => {
  const dt = new Date((rptDayDate.value || '2025-09-11') + 'T00:00:00')
  dt.setDate(dt.getDate() - 1)
  return dt
})

// "X月X日取水量"中的日期标签
const dayLabel = computed(() => `${prevDate.value.getMonth() + 1}月${prevDate.value.getDate()}日`)

// "X月计划 / X月累计"中的月份标签
const monthLabel = computed(() => `${prevDate.value.getMonth() + 1}月`)

// 数值格式化：千分位 + 最多 4 位小数；null 展示为空（与原型 rNum 一致）
function fmtNum(x: number | null): string {
  if (x === null) {
    return ''
  }
  return Number(x).toLocaleString('zh-CN', { maximumFractionDigits: 4 })
}

type QtyKey = 'dayQty' | 'monthPlan' | 'monthTotal' | 'yearPermit' | 'yearTotal'

// 基本情况表合计（按全量数据统计，先四舍五入到 5 位小数再格式化，与原型一致）
const baseTotals = computed(() => {
  const sum = (key: QtyKey): number => {
    const total = rptDayList.reduce((acc, row) => acc + (row[key] ?? 0), 0)
    return Math.round(total * 1e5) / 1e5
  }
  return {
    dayQty: sum('dayQty'),
    monthPlan: sum('monthPlan'),
    monthTotal: sum('monthTotal'),
    yearPermit: sum('yearPermit'),
    yearTotal: sum('yearTotal')
  }
})

// 列表展示行（超过 8 行时截断）
const baseRows = computed(() => rptDayList.slice(0, MAX_ROWS))
const opsRows = computed(() => rptOpsList.value.slice(0, MAX_ROWS))

/* ---------------- 列表列定义与合计行（ProTable） ---------------- */

// 取水基本情况表列（当日取水量 / 当月计划 / 当月累计的表头随日期变化）
const baseColumns = computed<VxeGridPropTypes.Columns>(() => [
  { type: 'seq', title: '序号', width: 52, align: 'center' },
  { field: 'name', title: '取水口名称', minWidth: 96, className: 'col-name' },
  {
    field: 'dayQty',
    title: `${dayLabel.value}取水量`,
    minWidth: 96,
    align: 'center',
    slots: { default: 'dayQty' }
  },
  {
    field: 'monthPlan',
    title: `${monthLabel.value}计划`,
    minWidth: 96,
    align: 'center',
    formatter: ({ cellValue }: any) => fmtNum(cellValue)
  },
  {
    field: 'monthTotal',
    title: `${monthLabel.value}累计`,
    minWidth: 96,
    align: 'center',
    formatter: ({ cellValue }: any) => fmtNum(cellValue)
  },
  {
    field: 'yearPermit',
    title: '年度许可',
    minWidth: 96,
    align: 'center',
    formatter: ({ cellValue }: any) => fmtNum(cellValue)
  },
  {
    field: 'yearTotal',
    title: '年度累计',
    minWidth: 96,
    align: 'center',
    formatter: ({ cellValue }: any) => fmtNum(cellValue)
  },
  { field: 'org', title: '监管单位', minWidth: 96, align: 'center' },
  { field: 'note', title: '备注', minWidth: 130, align: 'center', className: 'note-cell' }
])

// 合计行：按全量数据统计
const baseGridOptions = {
  showFooter: true,
  footerMethod: ({ columns }: any) => {
    const t = baseTotals.value
    const cells = columns.map((_c: any, i: number) => {
      if (i === 1) {
        return '合计'
      }
      const vals = [
        '',
        '',
        fmtNum(t.dayQty),
        fmtNum(t.monthPlan),
        fmtNum(t.monthTotal),
        fmtNum(t.yearPermit),
        fmtNum(t.yearTotal),
        '',
        ''
      ]
      return vals[i] ?? ''
    })
    return [cells]
  }
} as Record<string, any>

// 水资源监控运行情况表列（长文本列允许换行、左对齐）
const opsColumns: VxeGridPropTypes.Columns = [
  { type: 'seq', title: '序号', width: 52, align: 'center' },
  {
    field: 'name',
    title: '取水口名称',
    minWidth: 96,
    className: 'col-name',
    slots: { default: 'opsName' }
  },
  {
    field: 'meter',
    title: '计量、视频情况',
    minWidth: 210,
    className: 'wrap-cell'
  },
  {
    field: 'fix',
    title: '整改进展情况',
    minWidth: 210,
    className: 'wrap-cell'
  },
  { field: 'org', title: '监管单位', minWidth: 96, align: 'center' },
  {
    field: 'note',
    title: '备注',
    minWidth: 300,
    className: 'wrap-cell note-cell'
  }
]

/* ---------------- 弹框与操作（复刻原型 openRptAdd / openRptHis / rptDayGenDoc / rptDayCsv） ---------------- */

const addRef = ref<InstanceType<typeof RptAddModal>>()
const hisRef = ref<InstanceType<typeof RptHisModal>>()
const queryRef = ref<InstanceType<typeof RptQueryModal>>()

// 历次巡查记录（复刻原型 RPT_HIS）
const RPT_HIS: Record<string, RptHisRow[]> = {
  瓦岗提灌站: [
    {
      time: '2025-08-29',
      unit: '卫河局',
      issue: '计量运行不正常',
      action: '汤阴县水利局提交情况说明，取水计划按62.56万m³控制'
    },
    {
      time: '2025-06-24',
      unit: '卫河局',
      issue: '测流水量与平台不一致',
      action: '列入整改台账，持续跟踪'
    }
  ],
  班庄扬水站: [
    {
      time: '2025-07-15',
      unit: '聊城局',
      issue: '未安装计量设施',
      action: '整改函限期完成，承诺8月底前安装调试'
    },
    {
      time: '2025-06-27',
      unit: '漳卫南局',
      issue: '未安装计量设施',
      action: '以《工作提醒》方式督促'
    }
  ]
}

// 未登记巡查记录的取水口：原型通用两条记录
const DEFAULT_HIS: RptHisRow[] = [
  {
    time: '2025-08-15',
    unit: '监管单位',
    issue: '计量设施运行异常',
    action: '已通知取水户限期整改'
  },
  { time: '2025-07-10', unit: '监管单位', issue: '日常巡查', action: '运行正常' }
]

// 轻提示（复刻原型 toast，2.2s 自动消失）
const toastMsg = ref('')
let toastTimer: number | undefined
function toast(msg: string) {
  toastMsg.value = msg
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toastMsg.value = ''), 2200)
}

/** 打开「新增监控记录」弹框（仅运行情况视图显示该按钮） */
function openAdd() {
  addRef.value?.show()
}

/** 保存监控记录：插入到运行情况表首行并提示 */
function addRecord(p: RptAddPayload) {
  rptOpsList.value.unshift({
    name: p.name,
    meter: `${p.meter}（责任单位：取水户）`,
    fix: p.fix,
    org: p.org,
    note: p.note
  })
  toast(`监控记录已新增：${p.name}`)
}

/** 点击取水口名称 → 历次巡查记录 */
function openHis(nm: string) {
  hisRef.value?.show(nm, RPT_HIS[nm] ?? DEFAULT_HIS)
}

/** 打开日报查询弹框 */
function openQuery() {
  queryRef.value?.show()
}

/** 切换查询日期后重新渲染并提示（DatePicker update:value 回调） */
function onDateChange(_v: unknown, formatted: string | null) {
  toast(`日报查询日期已切换为 ${formatted || rptDayDate.value}`)
}

/** 一键生成日报 Word 文档（复刻原型 rptDayGenDoc） */
function genDoc() {
  const dv = rptDayDate.value || '2025-09-11'
  const dt = new Date(dv + 'T00:00:00')
  const dp = new Date(dt)
  dp.setDate(dp.getDate() - 1)
  const dLab = `${dp.getMonth() + 1}月${dp.getDate()}日`
  const mLab = `${dp.getMonth() + 1}月`
  const y = dt.getFullYear()
  const doy = Math.ceil((dt.getTime() - new Date(y, 0, 1).getTime()) / 86400000)
  const dateCn = `${y}年${dt.getMonth() + 1}月${dt.getDate()}日`
  const r0 = (v: number | null) => (v === null ? '未上报' : fmtNum(v))
  const tot = baseTotals.value
  const baseHtml = rptDayList
    .map(
      (r, i) =>
        `<tr><td>${i + 1}</td><td>${r.name}</td><td>${r0(r.dayQty)}</td><td>${r0(r.monthPlan)}</td><td>${r0(r.monthTotal)}</td><td>${r0(r.yearPermit)}</td><td>${r0(r.yearTotal)}</td><td>${r.org}</td><td>${r.note}</td></tr>`
    )
    .join('')
  const footHtml =
    `<tr class="tot"><td></td><td>合计</td><td>${fmtNum(tot.dayQty)}</td><td>${fmtNum(tot.monthPlan)}</td>` +
    `<td>${fmtNum(tot.monthTotal)}</td><td>${fmtNum(tot.yearPermit)}</td><td>${fmtNum(tot.yearTotal)}</td><td></td><td></td></tr>`
  const opsHtml = rptOpsList.value
    .map(
      (r, i) =>
        `<tr><td>${i + 1}</td><td>${r.name}</td><td class="lt">${r.meter}</td><td class="lt">${r.fix}</td><td>${r.org}</td><td class="lt">${r.note}</td></tr>`
    )
    .join('')
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body{font-family:"宋体",SimSun,serif;margin:0;padding:22px 26px;color:#000;}
    .t{font-family:"方正小标宋简体","宋体",SimSun,serif;font-size:28pt;text-align:center;font-weight:bold;margin:4px 0 8px;}
    .sub{font-family:"楷体_GB2312","楷体",KaiTi,serif;font-size:16pt;text-align:center;margin-bottom:16px;}
    .by{font-family:"楷体_GB2312","楷体",KaiTi,serif;font-size:16pt;display:flex;justify-content:space-between;margin-bottom:16px;}
    .h{font-family:"黑体",SimHei,sans-serif;font-size:16pt;font-weight:bold;margin:16px 0 4px;}
    .unit{font-family:"楷体_GB2312","楷体",KaiTi,serif;font-size:16pt;text-align:center;margin-bottom:4px;}
    table{border-collapse:collapse;width:100%;font-size:10.5pt;font-family:"宋体",SimSun,serif;}
    td,th{border:1px solid #000;padding:3px 5px;text-align:center;vertical-align:middle;height:22px;}
    th{font-weight:bold;}
    td.lt{text-align:left;}
    tr.tot td{font-weight:bold;}
  </style></head><body>
    <div class="t">漳卫南局重点取水口取水日报</div>
    <div class="sub">（${y}年第${doy}期）</div>
    <div class="by"><span>水资源管理与保护处编制</span><span>${dateCn}</span></div>
    <div class="h">一、取水基本情况</div>
    <div class="unit">单位：万m³</div>
    <table><thead><tr><th>序号</th><th>取水口名称</th><th>${dLab}取水量</th><th>${mLab}计划</th><th>${mLab}累计</th><th>年度许可</th><th>年度累计</th><th>监管单位</th><th>备注</th></tr></thead>
    <tbody>${baseHtml}${footHtml}</tbody></table>
    <div class="h">二、水资源监控运行情况</div>
    <table><thead><tr><th>序号</th><th>取水口名称</th><th>计量、视频情况</th><th>整改进展情况</th><th>监管单位</th><th>备注</th></tr></thead>
    <tbody>${opsHtml}</tbody></table>
  </body></html>`
  const blob = new Blob([html], { type: 'application/msword' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `漳卫南局重点取水口取水日报（${dv}）.doc`
  a.click()
  URL.revokeObjectURL(a.href)
  toast(`取水日报文档已生成并下载：${dv}`)
}

/** 导出当前报表 CSV（复刻原型 rptDayCsv，按视图区分表头） */
function exportCsv() {
  const isBase = rptDayMode.value === 'base'
  const head = isBase
    ? [
        '序号',
        '取水口名称',
        '当日取水量',
        '月计划',
        '月累计',
        '年度许可',
        '年度累计',
        '监管单位',
        '备注'
      ]
    : ['序号', '取水口名称', '计量、视频情况', '整改进展情况', '监管单位', '备注']
  const rows: (string | number)[][] = isBase
    ? rptDayList.map((r, i) => [
        i + 1,
        r.name,
        r.dayQty === null ? '未上报' : r.dayQty,
        r.monthPlan ?? '',
        r.monthTotal ?? '',
        r.yearPermit ?? '',
        r.yearTotal ?? '',
        r.org,
        r.note
      ])
    : rptOpsList.value.map((r, i) => [i + 1, r.name, r.meter, r.fix, r.org, r.note])
  const csv =
    '\uFEFF' +
    [head, ...rows]
      .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\r\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = isBase ? '重点取水口取水日报.csv' : '水资源监控运行情况.csv'
  a.click()
  URL.revokeObjectURL(a.href)
  toast(`已导出 ${rows.length} 条数据`)
}
</script>

<template>
  <!-- 整页浅色容器：占满内容区 -->
  <div class="rpt-day-page">
    <!-- 白底报表卡片 -->
    <div class="report-card">
      <!-- 页头：标题 + 副标题 + 操作按钮 -->
      <div class="card-head">
        <h4 class="card-title">
          {{ pageTitle }}
          <small class="card-sub">{{ reportSub }}</small>
        </h4>
        <div class="head-btns">
          <button class="btn-primary" type="button" @click="genDoc">一键生成</button>
          <button class="btn-primary" type="button" @click="toggleMode">{{ modeBtnText }}</button>
          <button v-if="rptDayMode === 'ops'" class="btn-primary" type="button" @click="openAdd">
            新增
          </button>
          <button class="btn-ghost" type="button" @click="exportCsv">导出</button>
          <button class="btn-ghost" type="button" @click="openQuery">日报查询</button>
        </div>
      </div>

      <!-- 筛选行：时间 + 单位说明 -->
      <div class="filter-row">
        <label class="filter-item">
          时间
          <DatePicker
            v-model="rptDayDate"
            type="date"
            size="small"
            width="150px"
            :clearable="false"
            @update:value="onDateChange"
          />
        </label>
        <span class="unit-text">单位：万m³</span>
      </div>

      <!-- 报表区域 -->
      <div class="table-wrap pt-table-wrap">
        <!-- 取水基本情况表 -->
        <pro-table
          v-if="rptDayMode === 'base'"
          :columns="baseColumns"
          :data="baseRows"
          :grid-options="baseGridOptions"
          :is-pagination="false"
          height="100%"
        >
          <template #dayQty="{ row }">
            <span v-if="row.dayQty === null" class="no-report">未上报</span>
            <template v-else>{{ fmtNum(row.dayQty) }}</template>
          </template>
        </pro-table>

        <!-- 水资源监控运行情况表 -->
        <pro-table
          v-else
          :columns="opsColumns"
          :data="opsRows"
          :is-pagination="false"
          height="100%"
        >
          <template #opsName="{ row }">
            <span class="link-name" @click="openHis(row.name)">{{ row.name }}</span>
          </template>
        </pro-table>
      </div>

      <!-- 脚注 -->
      <div class="card-foot">
        <template v-if="rptDayMode === 'base'">
          共 <b>{{ rptDayList.length }}</b> 处重点取水口 ；当日取水
          <b>{{ fmtNum(baseTotals.dayQty) }}</b> 万m³ ；年度累计
          <b>{{ fmtNum(baseTotals.yearTotal) }}</b> 万m³
        </template>
        <template v-else>
          共 <b>{{ rptOpsList.length }}</b> 条监控运行记录 ；点击取水口名称可查看历次巡查记录
        </template>
      </div>
    </div>

    <!-- 新增监控记录 / 历次巡查记录 -->
    <rpt-add-modal ref="addRef" :names="rptDayList.map((r) => r.name)" @confirm="addRecord" />
    <rpt-his-modal ref="hisRef" />
    <rpt-query-modal ref="queryRef" />

    <!-- 轻提示（复刻原型 toast） -->
    <div v-if="toastMsg" class="rpt-toast">{{ toastMsg }}</div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/style/water-filter.scss' as wf;
/* 整页浅色容器：占满内容区 */
.rpt-day-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  //padding: 16px;
  //background: #eef3f8;
  box-sizing: border-box;
  overflow: hidden;
}

/* 白底报表卡片 */
.report-card {
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

/* 页头 */
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  margin: 0;
  font-size: 19px;
  font-weight: 700;
  color: #1f7ae0;
  letter-spacing: 1px;

  .card-sub {
    margin-left: 8px;
    font-size: 12.5px;
    font-weight: 400;
    color: #5a7ba6;
  }
}

.head-btns {
  display: flex;
  gap: 10px;
}

.btn-primary {
  padding: 5px 16px;
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
}

.btn-ghost {
  padding: 5px 16px;
  font-size: 13px;
  color: #1f7ae0;
  white-space: nowrap;
  cursor: pointer;
  background: #f2f8ff;
  border: 1px solid #8fc0f2;
  border-radius: 3px;

  &:hover {
    filter: brightness(1.05);
  }
}

/* 筛选行 */
.filter-row {
  @include wf.row;

  margin-top: 11px;
}

.filter-item {
  @include wf.field;
}

.unit-text {
  align-self: center;
  font-size: 12.5px;
  color: #5a7ba6;
}

/* 报表区域：占满卡片剩余高度，表体在容器内滚动 */
.table-wrap {
  flex: 1;
  min-height: 0;
  margin-top: 10px;
}

/* 语义化扩展：取水口名称列左对齐加粗（内边距沿用全局标准） */
:deep(.col-name) .vxe-cell {
  font-weight: 600;
  text-align: left;
}

/* 语义化扩展：长文本列允许换行、左对齐 */
:deep(.wrap-cell) .vxe-cell {
  white-space: normal !important;
  text-align: left;
  line-height: 1.7;
}

/* 监控运行情况表中的取水口名称：蓝色下划线，可点击查看巡查记录（原型同款视觉） */
.link-name {
  color: #1f7ae0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

/* 未上报：红色提示 */
.no-report {
  color: #c2564d;
}

/* 脚注 */
.card-foot {
  margin-top: 10px;
  font-size: 13px;
  color: #33507a;

  b {
    font-weight: 700;
    color: #1f7ae0;
  }
}

/* 轻提示（复刻原型 .toast） */
.rpt-toast {
  position: fixed;
  top: 26px;
  left: 50%;
  z-index: 3000;
  padding: 8px 24px;
  font-size: 13px;
  color: #fff;
  white-space: nowrap;
  pointer-events: none;
  background: rgba(20, 80, 180, 0.94);
  border: 1px solid rgba(120, 200, 255, 0.55);
  border-radius: 18px;
  box-shadow: 0 0 20px rgba(60, 150, 255, 0.55);
  transform: translateX(-50%);
}
</style>
