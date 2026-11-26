<script setup lang="ts">
// ============================================================
// 巡查记录弹框（复刻原型右栏巡查信息「详情」按钮 → prModal 浅色版）
// 视图一「列表」：筛选栏 + 统计卡 + 巡查记录表（ProTable）
// 视图二「添加 / 编辑」：两栏表单 + 文件上传
// 视图三「详情」：巡检信息 / 水量分析 页签（折线图 + ProTable 明细表）
// 附：整改确认小弹框（处理结果 + 上传整改后影像）
// ============================================================
import { computed, nextTick, reactive, ref, watch, type Ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import ProTabs from '@/components/common/ProTabs/ProTabs.vue'
import ProTable from '@/components/common/ProTable'
import type { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid'
import { useECharts } from '@/hooks/web/useECharts'

/* ---------------- 巡查记录数据（提取自原型 PATROL_RECS） ---------------- */

interface PrRec {
  id: number
  year: string
  owner: string
  bureau: string
  dist: string
  prov: string
  project: string
  intake: string
  permVol: number
  date: string
  place: string
  probType: string
  probDesc: string
  checker: string
  result: string
  cert?: string
  credit?: string
  fixResult?: string
  fixFiles?: string[]
  fixDate?: string
}

const PATROL_RECS: PrRec[] = [
  {
    id: 1,
    year: '2026',
    owner: '河南省濮县新镇兰庄村村委会',
    bureau: '邯郸局',
    dist: '濮县',
    prov: '河南省',
    project: '兰庄提水站',
    intake: '兰庄提水站',
    permVol: 34,
    date: '2026-07-02',
    place: '兰庄村',
    probType: '计量不规范',
    probDesc: '计量设施不正常',
    checker: '李军',
    result: '已下发整改通知书',
    cert: 'D130528G2022-0001',
    credit: '12100000000133057R'
  },
  {
    id: 2,
    year: '2026',
    owner: '河南省濮县新镇洪门闸街村委会',
    bureau: '邯郸局',
    dist: '濮县',
    prov: '河南省',
    project: '洪门闸街提水站',
    intake: '洪门闸街提水站',
    permVol: 45,
    date: '2026-05-16',
    place: '洪门闸街',
    probType: '无计量设施',
    probDesc: '取水口未安装计量设施，取水量无法计量',
    checker: '陈晨',
    result: '已下发整改通知书'
  },
  {
    id: 3,
    year: '2026',
    owner: '武城县头屯灌区管理站',
    bureau: '德州局',
    dist: '武城县',
    prov: '山东省',
    project: '武城头屯泵站',
    intake: '武城头屯泵站',
    permVol: 52,
    date: '2026-06-18',
    place: '头屯干渠',
    probType: '无证取水',
    probDesc: '未取得取水许可证擅自取水',
    checker: '马腾',
    result: '已整改',
    fixResult: '已更换取水口损坏的防护设施，现场恢复取水',
    fixFiles: ['整改后照片_1.jpg', '整改后照片_2.jpg'],
    fixDate: '2026-06-18'
  },
  {
    id: 4,
    year: '2026',
    owner: '吴桥县水利局',
    bureau: '沧州局',
    dist: '吴桥县',
    prov: '河北省',
    project: '周尹涵闸',
    intake: '周尹涵闸',
    permVol: 18,
    date: '2026-06-25',
    place: '周尹村',
    probType: '计量不规范',
    probDesc: '计量设施安装不规范，量水堰槽尺寸偏差',
    checker: '周琴',
    result: '已整改',
    fixResult: '已按标准重新安装计量设施并校验合格',
    fixFiles: ['整改后照片_1.jpg', '整改后视频_1.mp4'],
    fixDate: '2026-06-25'
  },
  {
    id: 5,
    year: '2026',
    owner: '武城县水利局',
    bureau: '德州局',
    dist: '武城县',
    prov: '山东省',
    project: '西郑庄分洪闸取水口',
    intake: '西郑庄分洪闸取水口',
    permVol: 76,
    date: '2026-07-05',
    place: '西郑庄',
    probType: '无证取水',
    probDesc: '5 月取水量超出许可批准量 10%，未办理变更',
    checker: '王建国',
    result: '已整改',
    fixResult: '已补办取水许可变更手续，取水量纳入计划管理',
    fixFiles: ['整改后照片_1.jpg'],
    fixDate: '2026-07-05'
  },
  {
    id: 6,
    year: '2026',
    owner: '大名县龙王庙镇水利站',
    bureau: '邯郸局',
    dist: '大名县',
    prov: '河北省',
    project: '大名龙王庙扬水站',
    intake: '大名龙王庙扬水站',
    permVol: 60,
    date: '2026-06-30',
    place: '龙王庙镇',
    probType: '无证取水',
    probDesc: '擅自改变取水用途，未办理取水许可变更',
    checker: '李伟',
    result: '已整改',
    fixResult: '已恢复原取水用途并补办变更手续',
    fixFiles: ['整改后视频_1.mp4'],
    fixDate: '2026-06-30'
  },
  {
    id: 7,
    year: '2026',
    owner: '东光县供水公司',
    bureau: '水管局',
    dist: '东光县',
    prov: '河北省',
    project: '王营盘引水闸',
    intake: '王营盘引水闸',
    permVol: 45,
    date: '2026-05-28',
    place: '王营盘村',
    probType: '无计量设施',
    probDesc: '未按取水许可规定安装计量设施',
    checker: '陈永刚',
    result: '已下发整改通知书'
  },
  {
    id: 8,
    year: '2025',
    owner: '武城县吕洼闸管理所',
    bureau: '德州局',
    dist: '武城县',
    prov: '山东省',
    project: '吕洼闸',
    intake: '吕洼闸',
    permVol: 27,
    date: '2025-09-12',
    place: '吕洼村',
    probType: '计量不规范',
    probDesc: '计量器具超检定周期使用',
    checker: '王建国',
    result: '已整改',
    fixResult: '已送检计量器具并在有效期内使用',
    fixFiles: ['整改后照片_1.jpg'],
    fixDate: '2025-09-12'
  },
  {
    id: 9,
    year: '2025',
    owner: '东光县水务公司',
    bureau: '沧州局',
    dist: '东光县',
    prov: '河北省',
    project: '梳头李涵闸',
    intake: '梳头李涵闸',
    permVol: 33,
    date: '2025-08-20',
    place: '梳头李村',
    probType: '无计量设施',
    probDesc: '未安装计量设施，取水量无法核定',
    checker: '周琴',
    result: '已整改',
    fixResult: '已补全取水台账并落实专人按月记录',
    fixFiles: ['整改后照片_1.jpg'],
    fixDate: '2025-08-20'
  },
  {
    id: 10,
    year: '2025',
    owner: '临西县水务局',
    bureau: '德州局',
    dist: '临西县',
    prov: '河北省',
    project: '尖塚扬水站',
    intake: '尖塚扬水站',
    permVol: 41,
    date: '2025-07-15',
    place: '尖塚镇',
    probType: '无证取水',
    probDesc: '上半年取水量超出批准量 6%，未办理调整审批',
    checker: '马腾',
    result: '已整改',
    fixResult: '已补办计划调整审批，恢复正常取水',
    fixFiles: ['整改后照片_1.jpg', '整改后视频_1.mp4'],
    fixDate: '2025-07-15'
  },
  {
    id: 11,
    year: '2025',
    owner: '故城县水利局',
    bureau: '沧州局',
    dist: '故城县',
    prov: '河北省',
    project: '草寺闸',
    intake: '草寺闸',
    permVol: 29,
    date: '2025-06-10',
    place: '草寺村',
    probType: '无计量设施',
    probDesc: '取水口未安装计量设施，取水量按估算填报',
    checker: '陈永刚',
    result: '已整改',
    fixResult: '已安装计量设施并接入在线监测',
    fixFiles: ['整改后照片_1.jpg'],
    fixDate: '2025-06-10'
  },
  {
    id: 12,
    year: '2025',
    owner: '冠县班庄灌区管理站',
    bureau: '德州局',
    dist: '冠县',
    prov: '山东省',
    project: '班庄扬水站',
    intake: '班庄扬水站',
    permVol: 38,
    date: '2025-05-22',
    place: '班庄村',
    probType: '计量不规范',
    probDesc: '在线计量数据传输异常',
    checker: '王建国',
    result: '已整改',
    fixResult: '已检修在线计量设备，数据恢复正常上传',
    fixFiles: ['整改后照片_1.jpg'],
    fixDate: '2025-05-22'
  }
]

// 演示记录为可变数据（添加 / 编辑 / 删除 / 整改确认直接改写）
const recs = ref<PrRec[]>(PATROL_RECS.map((r) => ({ ...r })))

/* ---------------- 常量（原型 PR_STATS / PR_BUREAUS / PR_TYPES） ---------------- */

const PR_STATS: Record<string, { checked: number; types: number; probs: number; todo: number }> = {
  2026: { checked: 136, types: 3, probs: 6, todo: 36 },
  2025: { checked: 128, types: 3, probs: 8, todo: 41 },
  全部: { checked: 264, types: 3, probs: 14, todo: 77 }
}

const PR_BUREAUS = ['全部', '邯郸局', '德州局', '聊城局', '水管局', '沧州局']
const PR_TYPES = ['全部', '计量不规范', '无计量设施', '无证取水']

/* ---------------- 弹框视图状态 ---------------- */

type ViewMode = 'list' | 'form' | 'detail'

const visible = ref(false)
const view = ref<ViewMode>('list')
const editId = ref<number | null>(null)
const detId = ref<number | null>(null)
const detTab = ref<'info' | 'water'>('info')
// 两步删除：第一次点「删除」变为「确认」，2.6s 后还原
const delArmId = ref<number | null>(null)
let delTimer: number | undefined

// 筛选条件
const fYear = ref('2026')
const fBureau = ref('全部')
const fType = ref('全部')
const fq = ref('')

/** 打开弹框（year：与右栏年度联动） */
function show(year?: string) {
  fYear.value = year || '2026'
  fBureau.value = '全部'
  fType.value = '全部'
  fq.value = ''
  view.value = 'list'
  editId.value = null
  detId.value = null
  visible.value = true
}

defineExpose({ show })

/** 弹框标题随视图切换（复刻原型 renderPr） */
const modalTitle = computed(() => {
  if (view.value === 'list') {
    return '巡查记录管理'
  }
  if (view.value === 'form') {
    return editId.value ? '编辑巡查记录' : '添加巡查记录'
  }
  const b = recs.value.find((x) => x.id === detId.value)
  return `${b ? b.project : '巡查记录'} 详情`
})

/* ---------------- 列表：筛选 / 统计卡 / 行操作 ---------------- */

/** 筛选后的记录（复刻原型 prFiltered） */
const filteredRecs = computed(() => {
  const q = fq.value.trim()
  return recs.value.filter(
    (r) =>
      (fYear.value === '全部' || r.year === fYear.value) &&
      (fBureau.value === '全部' || r.bureau === fBureau.value) &&
      (fType.value === '全部' || r.probType === fType.value) &&
      (!q || `${r.owner}${r.project}${r.intake}${r.place}`.includes(q))
  )
})

/** 统计卡（复刻原型 prListHTML 的 cards） */
const statCards = computed(() => {
  const s = PR_STATS[fYear.value] || PR_STATS['全部']
  return [
    { t: '已完成巡查取水口个数', n: s.checked, u: '个', c: '#0fb5a6' },
    { t: '巡查发现问题类型', n: s.types, u: '类', c: '#1f9ee0' },
    { t: '巡查发现问题数量', n: s.probs, u: '个', c: '#0fb5a6' },
    { t: '待巡查取水口数量', n: s.todo, u: '个', c: '#1f9ee0' }
  ]
})

/** 记录是否待整改（复刻原型 recPending） */
function isPending(r: PrRec) {
  return r.result !== '已整改'
}

/** 详情字段派生（复刻原型 prFull：证照等字段演示数据优先取记录自带值） */
function fullOf(r: PrRec) {
  const idStr = String(1000 + r.id).slice(1)
  return {
    ...r,
    cert: r.cert || `D130528G2022-${idStr}`,
    credit: r.credit || `1210000000013${3057 + r.id * 7}R`,
    issue: `${+r.year - 10}-07-29 00:00:00`,
    validFrom: `${+r.year - 10}-07-29`,
    validTo: `${+r.year}-07-28`,
    firstIssue: `${+r.year - 8}-10-25 00:00:00`,
    oldCert: '',
    oldIssue: '',
    note: '',
    wtype: '基础设施或公用事业',
    source: '地表水',
    use: r.id % 2 ? '农业灌溉' : '工业',
    organ: '水利部海河水利委员会',
    agent: '水利部海河水利委员会',
    addr: `${r.prov || '河北省'}${r.dist || '—'}${r.place}12-800`
  }
}

/** 行操作：详情 */
function onView(r: PrRec) {
  detId.value = r.id
  detTab.value = 'info'
  view.value = 'detail'
}

/** 行操作：编辑 */
function onEdit(r: PrRec) {
  editId.value = r.id
  fillForm(recs.value.find((x) => x.id === r.id))
  view.value = 'form'
}

/** 行操作：添加 */
function onAdd() {
  editId.value = null
  fillForm(null)
  view.value = 'form'
}

/** 行操作：两步删除（复刻原型 prDelArm 逻辑） */
function onDel(r: PrRec) {
  if (delArmId.value !== r.id) {
    delArmId.value = r.id
    window.clearTimeout(delTimer)
    delTimer = window.setTimeout(() => {
      delArmId.value = null
    }, 2600)
    return
  }
  const i = recs.value.findIndex((x) => x.id === r.id)
  if (i > -1) {
    recs.value.splice(i, 1)
    window.$message?.success(`「${r.project}」巡查记录已删除`)
  }
  delArmId.value = null
}

/* ---------------- 列表表格列定义（ProTable） ---------------- */

const dash = '—'

const listColumns: VxeGridPropTypes.Columns = [
  { field: 'id', title: '编号', minWidth: 50, align: 'center' },
  { field: 'owner', title: '取水权人', minWidth: 150, align: 'center' },
  // minWidth 需容纳 16px 表头单行显示，避免表头折行把行高撑到 60px
  { field: 'bureau', title: '监管单位', minWidth: 100, align: 'center' },
  { field: 'project', title: '取水项目', minWidth: 110, align: 'center' },
  { field: 'intake', title: '取水口名称', minWidth: 110, align: 'center' },
  { field: 'permVol', title: '许可水量(m³/年)', minWidth: 150, align: 'center' },
  { field: 'date', title: '巡查日期', minWidth: 90, align: 'center' },
  {
    field: 'place',
    title: '巡查地点',
    minWidth: 84,
    align: 'center',
    formatter: ({ cellValue }: any) => cellValue || dash
  },
  { field: 'probType', title: '问题类型', minWidth: 88, align: 'center', className: 'ptype-cell' },
  {
    field: 'probDesc',
    title: '问题描述',
    minWidth: 170,
    align: 'left',
    className: 'desc-cell'
  },
  { field: 'checker', title: '巡检人', minWidth: 68, align: 'center' },
  {
    field: 'result',
    title: '处理结果',
    minWidth: 118,
    align: 'center',
    formatter: ({ cellValue }: any) => cellValue || dash
  },
  { field: 'op', title: '操作', minWidth: 240, align: 'center', slots: { default: 'op' } }
]

/* ---------------- 添加 / 编辑表单 ---------------- */

const form = reactive({
  project: '',
  owner: '',
  date: '',
  probType: '',
  result: '',
  cert: '',
  permVol: '' as string | number,
  place: '',
  probDesc: '',
  bureau: ''
})

/** 表单回填（新增给默认值，编辑取记录值） */
function fillForm(r: PrRec | null | undefined) {
  Object.assign(form, {
    project: r?.project || '',
    owner: r?.owner || '',
    date: r?.date || '2026-05-16',
    probType: r?.probType || '',
    result: r?.result || '',
    cert: r?.cert || '',
    permVol: r?.permVol ?? '',
    place: r?.place || '',
    probDesc: r?.probDesc || '',
    bureau: r?.bureau || ''
  })
}

/** 保存：校验必填后写入记录（复刻原型 prSave） */
function saveForm() {
  if (!form.project.trim()) {
    window.$message?.warning('请填写取水项目名称')
    return
  }
  if (!form.date) {
    window.$message?.warning('请选择巡查时间')
    return
  }
  if (!form.probType) {
    window.$message?.warning('请选择问题类型')
    return
  }
  if (!form.bureau) {
    window.$message?.warning('请选择监管单位')
    return
  }
  const old = editId.value ? recs.value.find((x) => x.id === editId.value) : null
  const rec: PrRec = {
    id: editId.value || Math.max(...recs.value.map((x) => x.id)) + 1,
    year: form.date.slice(0, 4),
    owner: form.owner.trim() || `${form.project}管理单位`,
    bureau: form.bureau,
    dist: old?.dist || '',
    prov: old?.prov || '',
    project: form.project.trim(),
    intake: form.project.trim(),
    permVol: Number(form.permVol) || 0,
    date: form.date,
    place: form.place.trim() || dash,
    probType: form.probType,
    probDesc: form.probDesc.trim() || `${form.probType}相关问题`,
    checker: old?.checker || '系统用户',
    result: form.result.trim() || '已下发整改通知书',
    cert: form.cert.trim() || undefined
  }
  if (old) {
    Object.assign(old, rec)
    window.$message?.success('巡查记录已更新')
  } else {
    recs.value.push(rec)
    window.$message?.success('巡查记录已保存')
  }
  if (fYear.value !== '全部' && fYear.value !== rec.year) {
    fYear.value = rec.year
  }
  backToList()
}

/** 返回列表（表单取消 / 保存后 / 详情返回） */
function backToList() {
  editId.value = null
  view.value = 'list'
}

/* ---------------- 表单上传区（演示文件，本地不实际上传） ---------------- */

interface FormFile {
  name: string
}

const mediaFiles = ref<FormFile[]>([
  { name: '巡查录音.MP3' },
  { name: '巡查照片.jpg' },
  { name: '巡查照片.png' }
])
const docFiles = ref<FormFile[]>([{ name: '申请文件.docx' }, { name: '文档.docx' }])
let fileSeq = 1

/** 上传演示文件 */
function addFile(kind: 'media' | 'docs') {
  const name = kind === 'media' ? `现场照片_${fileSeq}.jpg` : `补充文件_${fileSeq}.docx`
  ;(kind === 'media' ? mediaFiles : docFiles).value.push({ name })
  fileSeq++
  window.$message?.info('已添加演示文件（本地环境不实际上传）')
}

/* ---------------- 详情：巡检信息页签 ---------------- */

/** 当前详情记录（含派生字段） */
const detRec = computed(() => {
  const b = recs.value.find((x) => x.id === detId.value)
  return b ? fullOf(b) : null
})

/** 巡检信息字段（复刻原型 prDetailHTML 第一段） */
const infoKv = computed(() => {
  const r = detRec.value
  if (!r) {
    return []
  }
  return [
    { k: '巡查时间', v: r.date },
    { k: '巡查地点', v: r.place },
    { k: '问题类型', v: r.probType },
    { k: '问题描述', v: r.probDesc },
    { k: '处理情况', v: r.result },
    { k: '处理结果', v: r.fixResult },
    { k: '整改时间', v: r.fixDate },
    { k: '监管单位', v: r.bureau }
  ]
})

/** 基本信息字段（复刻原型 prDetailHTML 第二段） */
const baseKv = computed(() => {
  const r = detRec.value
  if (!r) {
    return []
  }
  return [
    { k: '许可证编号', v: r.cert },
    { k: '发证日期', v: r.issue },
    { k: '取水项目名称', v: r.project },
    { k: '有效期', v: `${r.validFrom} 00:00:00 至 ${r.validTo} 00:00:00` },
    { k: '取水权人名称', v: r.owner },
    { k: '统一社会信用代码', v: r.credit },
    { k: '所在行政区', v: r.dist },
    { k: '取水地址', v: r.addr },
    { k: '取水类型', v: r.wtype },
    { k: '年许可水量（万m3）', v: r.permVol },
    { k: '水源类型', v: r.source },
    { k: '取水用途', v: r.use },
    { k: '发证机关', v: r.organ },
    { k: '办理机关', v: r.agent },
    { k: '首次发证日期', v: r.firstIssue },
    { k: '原证件编号', v: r.oldCert },
    { k: '原证件发证日期', v: r.oldIssue },
    { k: '备注', v: r.note }
  ]
})

// 现场图片占位（原型 4 张渐变占位图）与演示附件
const detailFiles = ['巡检录像.mp4', '巡查录音.mp3', '申请文件.docx']

/* ---------------- 详情：水量分析页签 ---------------- */

type Gran = 'day' | 'month' | 'year'

const wa = reactive({ gran: 'day' as Gran, start: '2026-01-01', end: '2026-01-31' })

/** 打开详情时按记录年份重置水量分析区间（复刻原型 prWaReset） */
function waReset(y: string) {
  wa.gran = 'day'
  wa.start = `${y}-01-01`
  wa.end = `${y}-01-31`
}

/** 切换粒度时同步默认区间（复刻原型 data-act=wa 逻辑） */
function onGran(g: Gran) {
  wa.gran = g
  const y = wa.start.slice(0, 4)
  if (g === 'month') {
    wa.start = `${y}-01-01`
    wa.end = `${y}-12-31`
  } else if (g === 'year') {
    wa.start = `${+y - 4}-01-01`
    wa.end = `${y}-12-31`
  }
}

/** 水量分析序列（复刻原型 prWaData：确定性伪随机演示数据） */
const waSeries = computed(() => {
  const r = detRec.value
  const pts: { t: string; x: string; on: number; up: number }[] = []
  if (!r) {
    return pts
  }
  const sd = (k: number) => (((k * 7 + r.id * 13) % 89) + (k % 5) * 3) / 92
  const s = wa.start || '2026-01-01'
  const e = wa.end || s
  if (wa.gran === 'day') {
    const a = new Date(`${s}T00:00:00`)
    const b = new Date(`${e}T00:00:00`)
    let n = Math.round((b.getTime() - a.getTime()) / 86400000) + 1
    if (!isFinite(n) || n < 1) {
      n = 1
    }
    if (n > 366) {
      n = 366
    }
    const base = r.permVol / 365
    for (let i = 0; i < n; i++) {
      const d = new Date(a.getTime() + i * 86400000)
      const on = +(base * (0.45 + sd(i + 1) * 0.95)).toFixed(2)
      const up = +(on * (0.78 + sd(i + 31) * 0.22)).toFixed(2)
      pts.push({
        t: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
        x: `${d.getMonth() + 1}/${d.getDate()}`,
        on,
        up
      })
    }
  } else if (wa.gran === 'month') {
    let y = +s.slice(0, 4)
    let m = +s.slice(5, 7)
    const ey = +e.slice(0, 4)
    const em = +e.slice(5, 7)
    const base = r.permVol / 12
    let guard = 0
    while ((y < ey || (y === ey && m <= em)) && guard++ < 144) {
      const on = +(base * (0.5 + sd(m + y * 12) * 0.85)).toFixed(2)
      const up = +(on * (0.78 + sd(m + y * 12 + 31) * 0.22)).toFixed(2)
      pts.push({ t: `${y}-${m}`, x: `${m}月`, on, up })
      m++
      if (m > 12) {
        m = 1
        y++
      }
    }
    if (!pts.length) {
      const on = +(base * 0.8).toFixed(2)
      pts.push({ t: s, x: `${+s.slice(5, 7)}月`, on, up: +(on * 0.9).toFixed(2) })
    }
  } else {
    const y0 = +s.slice(0, 4)
    let y1 = +e.slice(0, 4)
    if (!(y1 >= y0)) {
      y1 = y0
    }
    if (y1 - y0 > 19) {
      y1 = y0 + 19
    }
    for (let y = y0; y <= y1; y++) {
      const on = +(r.permVol * (0.65 + sd(y) * 0.45)).toFixed(2)
      const up = +(on * (0.78 + sd(y + 31) * 0.22)).toFixed(2)
      pts.push({ t: `${y}`, x: `${y}`, on, up })
    }
  }
  return pts
})

const fmt = (v: number) => (v >= 100 ? String(Math.round(v)) : String(+v.toFixed(2)))

const waSum = computed(() => +waSeries.value.reduce((a, p) => a + p.on, 0).toFixed(2))
const waMax = computed(() => Math.max(...waSeries.value.map((p) => p.on), 0))
const waMin = computed(() => Math.min(...waSeries.value.map((p) => p.on), 0))

/** 水量明细行（ProTable 数据） */
const waterRows = computed(() =>
  waSeries.value.map((p, i) => ({ no: i + 1, t: p.t, on: p.on, up: p.up }))
)

const waterColumns = computed<VxeGridPropTypes.Columns>(() => [
  {
    field: 't',
    title: wa.gran === 'day' ? '日期' : wa.gran === 'month' ? '月份' : '年份',
    minWidth: 96,
    align: 'center'
  },
  {
    field: 'on',
    title: '在线水量(万m³)',
    minWidth: 100,
    align: 'center',
    className: 'num-cell',
    formatter: ({ cellValue }: any) => fmt(cellValue)
  },
  {
    field: 'up',
    title: '上报水量(万m³)',
    minWidth: 100,
    align: 'center',
    formatter: ({ cellValue }: any) => fmt(cellValue)
  }
])

/* ---------------- 水量分析折线图（ECharts） ---------------- */

const waterChartRef = ref<HTMLDivElement | null>(null)
const { setOptions: setWaterOptions } = useECharts(waterChartRef as Ref<HTMLDivElement>, 'light')

function renderWaterChart() {
  if (view.value !== 'detail' || detTab.value !== 'water') {
    return
  }
  setWaterOptions({
    tooltip: { trigger: 'axis' },
    legend: { show: false },
    grid: { left: 50, right: 18, top: 16, bottom: 26 },
    xAxis: {
      type: 'category',
      data: waSeries.value.map((p) => p.x),
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#dbe7f6' } },
      axisTick: { show: false },
      axisLabel: { fontSize: 10.5, color: '#8aa3c4' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#eef3fa' } },
      axisLabel: { fontSize: 10.5, color: '#8aa3c4' }
    },
    series: [
      {
        name: '在线水量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        data: waSeries.value.map((p) => p.on),
        lineStyle: { color: '#1f9ee0', width: 2 },
        itemStyle: { color: '#4aa8e8' },
        areaStyle: { color: 'rgba(31, 158, 224, 0.12)' }
      }
    ]
  })
}

watch(
  () => [visible.value, view.value, detTab.value, detId.value, wa.gran, wa.start, wa.end],
  () => nextTick(renderWaterChart)
)

/* ---------------- 整改确认弹框（复刻原型 openPatrolFix） ---------------- */

const fixVisible = ref(false)
const fixRec = ref<PrRec | null>(null)
const fixResult = ref('')
const fixFiles = ref<string[]>([])

/** 打开整改确认 */
function openFix(r: PrRec) {
  fixRec.value = r
  fixResult.value = r.fixResult || ''
  fixFiles.value = (r.fixFiles || []).slice()
  fixVisible.value = true
}

/** 添加整改演示文件 */
function addFixFile() {
  const n = fixFiles.value.length + 1
  fixFiles.value.push(n % 2 ? `整改后照片_${n}.jpg` : `整改后视频_${n}.mp4`)
  window.$message?.info('已添加演示文件（本地环境不实际上传）')
}

/** 提交整改确认（复刻原型 submitPatrolFix：结果必填，确认后置为已整改） */
function submitFix() {
  const txt = fixResult.value.trim()
  if (!txt) {
    window.$message?.warning('请填写处理结果')
    return
  }
  const r = fixRec.value
  if (!r) {
    return
  }
  r.result = '已整改'
  r.fixResult = txt
  r.fixFiles = fixFiles.value.slice()
  r.fixDate = '2026-09-03'
  fixVisible.value = false
  window.$message?.success(`「${r.intake}」整改已确认`)
}
</script>

<template>
  <pro-modal
    v-model:show="visible"
    :title="modalTitle"
    table-theme="light"
    content-mode="scroll"
    default-padding="0"
    :style-params="{ width: '1280px', height: '86vh' }"
  >
    <!-- ============ 视图一：列表 ============ -->
    <div v-if="view === 'list'" class="pr-body">
      <!-- 筛选栏 -->
      <div class="pr-fbar">
        <label>
          时 间
          <select v-model="fYear" class="pr-fsel">
            <option v-for="y in ['全部', '2026', '2025']" :key="y" :value="y">{{ y }}</option>
          </select>
        </label>
        <label>
          监管单位
          <select v-model="fBureau" class="pr-fsel">
            <option v-for="b in PR_BUREAUS" :key="b" :value="b">{{ b }}</option>
          </select>
        </label>
        <label>
          问题类型
          <select v-model="fType" class="pr-fsel">
            <option v-for="t in PR_TYPES" :key="t" :value="t">{{ t }}</option>
          </select>
        </label>
        <input v-model="fq" class="pr-ipt" placeholder="取水权人名称/取水项目/取水口名称" />
        <button class="pr-addbtn" type="button" @click="onAdd">＋ 巡检记录</button>
      </div>

      <!-- 统计卡 -->
      <div class="pr-cards">
        <div v-for="c in statCards" :key="c.t" class="pr-card">
          <div class="t">{{ c.t }}</div>
          <div class="row">
            <span class="ic">
              <svg viewBox="0 0 40 40">
                <circle
                  cx="20"
                  cy="20"
                  r="15.5"
                  fill="none"
                  :stroke="c.c"
                  stroke-width="2.2"
                  stroke-dasharray="66 32"
                  stroke-linecap="round"
                  transform="rotate(-70 20 20)"
                />
                <circle cx="20" cy="20" r="8.6" fill="none" :stroke="c.c" stroke-width="1.8" />
                <circle cx="20" cy="20" r="3.2" :fill="c.c" />
              </svg>
            </span>
            <span class="n"
              >{{ c.n }}<small>{{ c.u }}</small></span
            >
          </div>
        </div>
      </div>

      <!-- 巡查记录表 -->
      <div class="pt-table-wrap">
        <pro-table :columns="listColumns" :data="filteredRecs" :is-pagination="false" height="">
          <template #op="{ row }">
            <button class="pr-op" type="button" @click="onView(row)">详情</button>
            <button class="pr-op" type="button" @click="openFix(row)">整改确认</button>
            <button class="pr-op" type="button" @click="onEdit(row)">编辑</button>
            <button class="pr-op d" type="button" @click="onDel(row)">
              {{ delArmId === row.id ? '确认' : '删除' }}
            </button>
          </template>
        </pro-table>
      </div>
    </div>

    <!-- ============ 视图二：添加 / 编辑 ============ -->
    <div v-else-if="view === 'form'" class="pr-body">
      <span class="pr-back" @click="backToList">« 返回列表</span>
      <div class="pr-form">
        <div>
          <div class="fitem">
            <span class="lbl req">取水项目名称：</span>
            <span class="ctl"
              ><input v-model="form.project" type="text" placeholder="可选择"
            /></span>
          </div>
          <div class="fitem">
            <span class="lbl">取水权人名称：</span>
            <span class="ctl"><input v-model="form.owner" type="text" /></span>
          </div>
          <div class="fitem">
            <span class="lbl req">巡查时间：</span>
            <span class="ctl"><input v-model="form.date" type="date" /></span>
          </div>
          <div class="fitem">
            <span class="lbl req">问题类型：</span>
            <span class="ctl">
              <select v-model="form.probType">
                <option value="">请选择</option>
                <option v-for="t in PR_TYPES.slice(1)" :key="t" :value="t">{{ t }}</option>
              </select>
            </span>
          </div>
          <div class="fitem">
            <span class="lbl">处理情况：</span>
            <span class="ctl">
              <input v-model="form.result" type="text" placeholder="如：已下发整改通知书" />
            </span>
          </div>
          <div class="fitem top">
            <span class="lbl">现场视频、照片、录音：</span>
            <div class="upwrap">
              <div class="uprow">
                <button class="upbtn" type="button" @click="addFile('media')">⬆ 上传文件</button>
              </div>
              <div class="upext">支持扩展名：.jpg .png .MP3 .MP4 ...</div>
              <div class="upzone" @click="addFile('media')">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1f9ee0" stroke-width="1.6">
                  <path d="M3 7 V19 H21 V9 H12 L10 6 H3 Z" stroke-linejoin="round" />
                  <path
                    d="M12 12 v5 M9.6 14.2 L12 11.8 L14.4 14.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div>点击或将文件拖拽到这里上传</div>
                <div class="ext">支持扩展名：.jpg .png .MP3 .MP4 ...</div>
              </div>
              <ul class="files">
                <li v-for="f in mediaFiles" :key="f.name" class="file">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#1f9ee0" stroke-width="1.7">
                    <path d="M6 2 H15 L20 7 V22 H6 Z" stroke-linejoin="round" />
                    <path d="M15 2 V7 H20" />
                    <path d="M9 12 h8 M9 16 h8" />
                  </svg>
                  {{ f.name }}
                  <span class="bar"><i style="width: 100%"></i></span>
                  <b class="fx" @click="mediaFiles = mediaFiles.filter((x) => x !== f)">✕</b>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <div class="fitem">
            <span class="lbl">取水许可证编号：</span>
            <span class="ctl"><input v-model="form.cert" type="text" /></span>
          </div>
          <div class="fitem">
            <span class="lbl">许可水量（万m3）：</span>
            <span class="ctl"><input v-model="form.permVol" type="number" /></span>
          </div>
          <div class="fitem">
            <span class="lbl">巡查地点：</span>
            <span class="ctl"><input v-model="form.place" type="text" /></span>
          </div>
          <div class="fitem">
            <span class="lbl">问题描述：</span>
            <span class="ctl"><input v-model="form.probDesc" type="text" /></span>
          </div>
          <div class="fitem">
            <span class="lbl req">监管单位：</span>
            <span class="ctl">
              <select v-model="form.bureau">
                <option value="">请选择</option>
                <option v-for="b in PR_BUREAUS.slice(1)" :key="b" :value="b">{{ b }}</option>
              </select>
            </span>
          </div>
          <div class="fitem top">
            <span class="lbl">相关申请文件：</span>
            <div class="upwrap">
              <div class="uprow">
                <button class="upbtn" type="button" @click="addFile('docs')">⬆ 上传文件</button>
              </div>
              <div class="upext">支持扩展名：.rar .zip .doc .docx ...</div>
              <div class="upzone" @click="addFile('docs')">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1f9ee0" stroke-width="1.6">
                  <path d="M3 7 V19 H21 V9 H12 L10 6 H3 Z" stroke-linejoin="round" />
                  <path
                    d="M12 12 v5 M9.6 14.2 L12 11.8 L14.4 14.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div>点击或将文件拖拽到这里上传</div>
                <div class="ext">支持扩展名：.rar .zip .doc .docx ...</div>
              </div>
              <ul class="files">
                <li v-for="f in docFiles" :key="f.name" class="file">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#1f9ee0" stroke-width="1.7">
                    <path d="M6 2 H15 L20 7 V22 H6 Z" stroke-linejoin="round" />
                    <path d="M15 2 V7 H20" />
                    <path d="M9 12 h8 M9 16 h8" />
                  </svg>
                  {{ f.name }}
                  <span class="bar"><i style="width: 100%"></i></span>
                  <b class="fx" @click="docFiles = docFiles.filter((x) => x !== f)">✕</b>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="form-foot">
        <button class="pr-btn save" type="button" @click="saveForm">保 存</button>
        <button class="pr-btn cancel" type="button" @click="backToList">取 消</button>
      </div>
    </div>

    <!-- ============ 视图三：详情 ============ -->
    <div v-else class="pr-body">
      <span class="pr-back" @click="backToList">« 返回列表</span>
      <pro-tabs
        v-model="detTab"
        :items="[
          { key: 'info', label: '巡检信息' },
          { key: 'water', label: '水量分析' }
        ]"
        class="pr-tabs"
      />

      <!-- 页签一：巡检信息 -->
      <template v-if="detTab === 'info' && detRec">
        <div class="pr-sect">
          <div class="pr-sect-h">
            巡检信息
            <button
              v-if="isPending(detRec)"
              class="pr-op fix-link"
              type="button"
              @click="openFix(detRec)"
            >
              整改确认
            </button>
          </div>
          <div class="pr-grid">
            <template v-for="item in infoKv" :key="item.k">
              <span class="k">{{ item.k }}</span>
              <span class="v" :class="{ empty: !item.v }">{{ item.v || '—' }}</span>
            </template>
          </div>
          <div class="pr-media">
            <div>
              <div class="pr-k">现场图片：</div>
              <div class="pr-phs">
                <div v-for="i in 4" :key="i" class="pr-ph" title="现场照片"></div>
              </div>
            </div>
            <div>
              <div class="pr-k">相关文件：</div>
              <div class="pr-dfiles">
                <div v-for="f in detailFiles" :key="f" class="pr-dfile">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#1f9ee0" stroke-width="1.7">
                    <path d="M6 2 H15 L20 7 V22 H6 Z" stroke-linejoin="round" />
                    <path d="M15 2 V7 H20" />
                    <path d="M9 12 h8 M9 16 h8" />
                  </svg>
                  {{ f }}
                </div>
              </div>
            </div>
          </div>
          <div class="pr-media">
            <div>
              <div class="pr-k">整改后视频、图片：</div>
              <div v-if="detRec.fixFiles?.length" class="pr-dfiles">
                <div v-for="f in detRec.fixFiles" :key="f" class="pr-dfile">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#1f9ee0" stroke-width="1.7">
                    <path d="M6 2 H15 L20 7 V22 H6 Z" stroke-linejoin="round" />
                    <path d="M15 2 V7 H20" />
                    <path d="M9 12 h8 M9 16 h8" />
                  </svg>
                  {{ f }}
                </div>
              </div>
              <span v-else class="pr-none">暂无</span>
            </div>
          </div>
        </div>
        <div class="pr-sect">
          <div class="pr-sect-h">基本信息</div>
          <div class="pr-grid">
            <template v-for="item in baseKv" :key="item.k">
              <span class="k">{{ item.k }}</span>
              <span class="v" :class="{ empty: !item.v }">{{ item.v || '—' }}</span>
            </template>
          </div>
        </div>
      </template>

      <!-- 页签二：水量分析 -->
      <template v-else-if="detRec">
        <div class="pr-wbar">
          <div class="pr-seg">
            <span class="b" :class="{ on: wa.gran === 'day' }" @click="onGran('day')">日</span>
            <span class="b" :class="{ on: wa.gran === 'month' }" @click="onGran('month')">月</span>
            <span class="b" :class="{ on: wa.gran === 'year' }" @click="onGran('year')">年</span>
          </div>
          <DatePicker
            v-model="wa.start"
            type="date"
            size="small"
            width="150px"
            :clearable="false"
          />
          <DatePicker v-model="wa.end" type="date" size="small" width="150px" :clearable="false" />
        </div>
        <div class="pr-wstats">
          <div>
            <div class="k">累计水量</div>
            <div class="n">{{ fmt(waSum) }}</div>
          </div>
          <div>
            <div class="k">最大水量</div>
            <div class="n">{{ fmt(waMax) }}</div>
          </div>
          <div>
            <div class="k">最小水量</div>
            <div class="n">{{ fmt(waMin) }}</div>
          </div>
        </div>
        <div class="pr-wsplit">
          <div class="pr-wchart">
            <div class="pr-wlegend"><i></i>在线水量</div>
            <div ref="waterChartRef" class="pr-wechart"></div>
          </div>
          <div class="pr-wtblwrap pt-table-wrap">
            <pro-table :columns="waterColumns" :data="waterRows" :is-pagination="false" height="" />
          </div>
        </div>
      </template>
    </div>

    <!-- ============ 整改确认小弹框 ============ -->
    <pro-modal
      v-model:show="fixVisible"
      :title="`整改确认 · ${fixRec?.intake || ''}`"
      table-theme="light"
      content-mode="fill"
      default-padding="14px 26px"
      :style-params="{ width: '620px' }"
    >
      <div class="fx-row">
        <label>处理结果：</label>
        <textarea
          v-model="fixResult"
          class="fx-ta"
          placeholder="请填写整改处理结果，如：已补办取水许可变更手续，恢复正常取水"
        ></textarea>
      </div>
      <div class="fx-row">
        <label>整改后视频、图片：</label>
        <div class="fx-upwrap">
          <div class="upzone slim" @click="addFixFile">
            <svg viewBox="0 0 24 24" fill="none" stroke="#4fa0f4" stroke-width="1.6">
              <path d="M3 7 V19 H21 V9 H12 L10 6 H3 Z" stroke-linejoin="round" />
              <path
                d="M12 12 v5 M9.6 14.2 L12 11.8 L14.4 14.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div>点击或将文件拖拽到这里上传</div>
            <div class="ext">支持扩展名：.jpg .png .MP4 ...</div>
          </div>
          <ul class="files">
            <li v-for="f in fixFiles" :key="f" class="file">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1f9ee0" stroke-width="1.7">
                <path d="M6 2 H15 L20 7 V22 H6 Z" stroke-linejoin="round" />
                <path d="M15 2 V7 H20" />
                <path d="M9 12 h8 M9 16 h8" />
              </svg>
              {{ f }}
              <span class="bar"><i style="width: 100%"></i></span>
              <b class="fx" @click="fixFiles = fixFiles.filter((x) => x !== f)">✕</b>
            </li>
          </ul>
        </div>
      </div>
      <template #action>
        <div class="lcm-foot">
          <button class="lcm-btn primary" type="button" @click="submitFix">
            {{ fixRec?.result === '已整改' ? '保 存' : '确认整改' }}
          </button>
          <button class="lcm-btn" type="button" @click="fixVisible = false">取 消</button>
        </div>
      </template>
    </pro-modal>
  </pro-modal>
</template>

<style scoped lang="scss">
@use '@/assets/style/lic-modal-common.scss' as lic;

/* ================= 列表 ================= */
.pr-body {
  padding: 14px 20px 18px;
}

/* 筛选栏 */
.pr-fbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  font-size: lic.$font-md;
  color: lic.$c-secondary;

  label {
    display: flex;
    align-items: center;
    gap: 7px;
    white-space: nowrap;
  }
}

.pr-fsel,
.pr-ipt {
  @include lic.input;

  height: 28px;
}

.pr-ipt {
  width: 300px;

  &::placeholder {
    color: lic.$c-muted;
  }
}

/* ＋巡检记录 按钮（原型 .pr-addbtn 青绿渐变） */
.pr-addbtn {
  margin-left: auto;
  padding: 6px 16px;
  font-family: inherit;
  font-size: lic.$font-btn;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(180deg, #5d9ff1, #0b70dd);
  border: none;
  border-radius: 3px;
  box-shadow: 0 2px 8px rgba(20, 150, 150, 0.3);

  &:hover {
    filter: brightness(1.08);
  }
}

/* 统计卡 */
.pr-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin: 16px 0 14px;
}

.pr-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  padding: 13px 8px;
  background: linear-gradient(160deg, #f7fbff, #eef5fc);
  border: 1px solid #d5e4f5;
  border-radius: 6px;

  .t {
    font-size: 13.5px;
    color: lic.$c-secondary;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ic {
    display: inline-flex;
    width: 38px;
    height: 38px;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .n {
    font-size: 30px;
    font-weight: 700;
    line-height: 1;
    color: #0e9f92;

    small {
      margin-left: 3px;
      font-size: 13px;
      font-weight: 400;
      color: #5fa89f;
    }
  }
}

/* 表格：问题类型蓝色、问题描述左对齐换行 */
.pr-body :deep(.ptype-cell) .vxe-cell {
  color: lic.$c-blue;
}

.pr-body :deep(.desc-cell) .vxe-cell {
  text-align: left;
  line-height: 1.5;
  white-space: normal;
}

/* 行操作按钮（原型 .pr-op 浅色版） */
.pr-op {
  display: inline-block;
  margin: 0 2px;
  padding: 2px 8px;
  font-family: inherit;
  font-size: lic.$font-sm;
  color: lic.$c-blue;
  cursor: pointer;
  background: #eef5fd;
  border: 1px solid #b9d6f5;
  border-radius: 3px;

  &:hover {
    color: #1359c4;
    background: #dcecfc;
  }

  /* 删除（两步确认） */
  &.d {
    color: #d2453a;
    background: #fdf0ef;
    border-color: #f0b9b4;

    &:hover {
      color: #b32e24;
      background: #fadfdb;
    }
  }
}

/* ================= 返回列表 ================= */
.pr-back {
  display: inline-block;
  margin-bottom: 8px;
  padding: 2px 10px;
  font-size: lic.$font-sm;
  color: #41577a;
  cursor: pointer;
  border: 1px solid #c2d7ef;
  border-radius: 3px;

  &:hover {
    color: lic.$c-blue;
    border-color: lic.$c-blue-border;
  }
}

/* ================= 添加 / 编辑表单 ================= */
.pr-form {
  @include lic.two-col-form(150px, 0 34px);

  padding: 6px 6px 0;
}

/* 上传区 */
.upwrap {
  flex: 1;
  min-width: 0;
}

.uprow {
  display: flex;
  align-items: center;
  gap: 10px;
}

.upbtn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  font-family: inherit;
  font-size: lic.$font-sm;
  color: lic.$c-blue;
  cursor: pointer;
  background: #fff;
  border: 1px solid #c2d7ef;
  border-radius: 3px;

  &:hover {
    background: #f0f7ff;
  }
}

.upext {
  margin: 6px 0 8px;
  font-size: lic.$font-xs;
  color: lic.$c-muted;
}

.upzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 16px 10px;
  font-size: lic.$font-sm;
  color: lic.$c-secondary;
  text-align: center;
  cursor: pointer;
  background: #f6faff;
  border: 1px dashed #b9d6f5;
  border-radius: 5px;

  &:hover {
    color: lic.$c-blue;
    border-color: lic.$c-blue-border;
  }

  svg {
    width: 34px;
    height: 34px;
  }

  .ext {
    font-size: lic.$font-hint;
    color: lic.$c-muted;
  }

  /* 整改确认弹框内的紧凑版 */
  &.slim {
    padding: 12px 10px;
  }
}

.files {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}

.file {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: lic.$font-sm;
  color: lic.$c-secondary;

  > svg {
    flex: none;
    width: 15px;
    height: 15px;
  }

  .bar {
    flex: 1;
    height: 4px;
    overflow: hidden;
    background: #e2ecf7;
    border-radius: 2px;

    i {
      display: block;
      height: 100%;
      background: linear-gradient(90deg, #39e6a3, #57c7ff);
    }
  }

  .fx {
    font-weight: 400;
    font-style: normal;
    color: lic.$c-muted;
    cursor: pointer;

    &:hover {
      color: #ff8a8a;
    }
  }
}

.form-foot {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 14px 6px 2px;
}

.pr-btn {
  padding: 7px 26px;
  font-family: inherit;
  font-size: lic.$font-btn;
  color: #fff;
  cursor: pointer;
  border: none;
  border-radius: 3px;

  &.save {
    background: linear-gradient(180deg, #22b8ac, #0e8f8f);
    box-shadow: 0 2px 8px rgba(20, 150, 150, 0.3);
  }

  &.cancel {
    background: linear-gradient(180deg, #4fa0f4, lic.$c-blue-deep);
  }

  &:hover {
    filter: brightness(1.08);
  }
}

/* ================= 详情 ================= */
.pr-tabs {
  justify-content: center;
  margin: 4px 0 16px;
}

.pr-sect {
  margin-bottom: 18px;
}

.pr-sect-h {
  @include lic.sect-title;

  margin-bottom: 6px;
  font-size: 15.5px;
}

/* 巡检信息标题行内的「整改确认」链接按钮 */
.fix-link {
  margin-left: 10px;
}

/* 字段栅格（两列：标签 | 值 × 2） */
.pr-grid {
  @include lic.detail-kv(158px, 38px);
}

.pr-media {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 38px;
  margin-top: 10px;

  .pr-k {
    margin-bottom: 8px;
    font-size: lic.$font-title;
    color: lic.$c-secondary;
  }
}

/* 现场图片占位（原型渐变缩略图） */
.pr-phs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pr-ph {
  position: relative;
  width: 76px;
  height: 52px;
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(180deg, #4e7fae 0 30%, #2e5f8e 30% 55%, #16375e 55% 100%);
  border: 1px solid rgba(120, 190, 255, 0.35);
  border-radius: 3px;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 18px;
    height: 14px;
    background: rgba(255, 255, 255, 0.25);
    border: 2px solid rgba(255, 255, 255, 0.85);
    border-radius: 3px;
    transform: translate(-50%, -50%);
  }

  &:hover {
    border-color: #7cc5ff;
  }
}

.pr-dfiles {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.pr-dfile {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: lic.$font-title;
  color: lic.$c-blue;
  cursor: pointer;

  svg {
    width: 15px;
    height: 15px;
  }

  &:hover {
    color: #1359c4;
    text-decoration: underline;
  }
}

.pr-none {
  font-size: lic.$font-sm;
  color: lic.$c-muted;
}

/* ================= 水量分析 ================= */
.pr-wbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin: 2px 0 12px;
}

.pr-seg {
  display: flex;
  gap: 6px;

  .b {
    padding: 3px 14px;
    font-size: lic.$font-md;
    color: lic.$c-secondary;
    cursor: pointer;
    background: #fff;
    border: 1px solid #c2d7ef;
    border-radius: 3px;
    transition: all 0.15s;

    &:hover {
      color: lic.$c-blue;
    }

    &.on {
      color: lic.$c-blue;
      background: #eaf3fd;
      border-color: lic.$c-blue;
    }
  }
}

.pr-wstats {
  display: flex;
  gap: 64px;
  padding: 2px 6px 12px;

  .k {
    margin-bottom: 7px;
    font-size: lic.$font-sm;
    color: #6b86a8;
  }

  .n {
    font-size: 27px;
    font-weight: 700;
    line-height: 1;
    color: #1e3a5f;
  }
}

.pr-wsplit {
  display: flex;
  gap: 18px;
  align-items: stretch;
}

.pr-wchart {
  flex: 1.5;
  min-width: 0;
  padding: 10px 12px 6px;
  background: #fff;
  border: 1px solid #d5e4f5;
  border-radius: 6px;
}

.pr-wechart {
  width: 100%;
  height: 318px;
}

.pr-wlegend {
  margin-bottom: 2px;
  font-size: lic.$font-xs;
  color: lic.$c-secondary;
  text-align: right;

  i {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-right: 5px;
    vertical-align: middle;
    background: #1f9ee0;
    border-radius: 50%;
  }
}

.pr-wtblwrap {
  flex: 1;
  min-width: 0;
  max-height: 360px;

  /* 数据表纵向滚动（容器描边 / 圆角由 .pt-table-wrap 统一提供） */
  &.pt-table-wrap {
    overflow: auto;
  }

  /* 语义化扩展：数值列强调 */
  :deep(.num-cell) .vxe-cell {
    font-weight: 700;
    color: lic.$c-blue;
  }
}

/* ================= 整改确认小弹框 ================= */
.fx-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 14px;

  > label {
    flex: none;
    width: 132px;
    padding-top: 6px;
    font-size: lic.$font-title;
    color: lic.$c-text;
    text-align: right;
  }
}

.fx-ta {
  @include lic.input;

  width: 100%;
  height: 76px;
  padding: 6px 8px;
  font-family: inherit;
  line-height: 1.6;
  resize: vertical;
}

.fx-upwrap {
  flex: 1;
  min-width: 0;
}

/* 底部按钮（与证照管理弹框统一） */
.lcm-foot {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 8px 0 10px;
}

.lcm-btn {
  width: 110px;
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
