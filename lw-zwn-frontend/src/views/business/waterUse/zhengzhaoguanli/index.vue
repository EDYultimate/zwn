<script setup lang="ts">
// ============================================================
// 证照管理（复刻原型 licView 浅色整页视图）
// 页面结构：统计横条（3 张卡片）→ 电子证照查询区（筛选 + 表格 + 脚注）
// ============================================================
import { computed, onMounted, reactive, ref, type Ref } from 'vue'
import * as echarts from 'echarts'
import { useECharts } from '@/hooks/web/useECharts'
import ProTable from '@/components/common/ProTable'
import type { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid'
import {
  deleteCert,
  getCertList,
  getCertStat,
  saveCert,
  toCertPayload,
  updateCert,
  type CertQuery,
  type CertStat
} from '@/api/cert'
import LicNewModal from './components/LicNewModal.vue'
import LicDetailModal from './components/LicDetailModal.vue'
import LicDeleteModal from './components/LicDeleteModal.vue'
import { exposeAgentContext } from '@/agent/page'
// 类型专用导入：编译后擦除，业务页不产生对能力声明的运行时依赖
import type { ZhengzhaoguanliPageContract } from './zhengzhaoguanli'

// 新增 / 编辑许可证弹框引用（「＋ 新建」与「编辑」共用同一表单组件）
const licNewRef = ref<InstanceType<typeof LicNewModal>>()
// 详情 / 删除弹框引用
const licDetailRef = ref<InstanceType<typeof LicDetailModal>>()
const licDeleteRef = ref<InstanceType<typeof LicDeleteModal>>()

/* ---------------- 统计横条数据（/api/ecCert/stat 实时返回） ---------------- */

// 卡片一：许可水量按河流分布的迷你柱状图（[名称, 柱高百分比, 实际水量]）
const LIC_BARS1 = ref<Array<[string, number, number]>>([])
// 卡片三：取水口按河流分布的迷你柱状图（[名称, 柱高百分比, 实际个数]）
const LIC_BARS2 = ref<Array<[string, number, number]>>([])
// 卡片二：监管单位分布环形图（名称、数量、颜色）
const LIC_ORGS = ref<Array<[string, number, string]>>([])

// 环形图配色（按后端返回的监管单位顺序循环取色）
const PIE_COLORS = ['#2f9df0', '#37c4a0', '#ffc24d', '#ff8a7a', '#9a7bff', '#5bc8ff']

// 顶部三张卡片 + 底部脚注的汇总数
const statData = reactive({ certCount: 0, permitQty: 0, intakeCount: 0 })
// 数据加载中标记
const loading = ref(false)

/** 分组统计 → 迷你柱状图数据（[名称, 柱高百分比, 实际值]） */
function toBars(groups: any[], limit = 8): Array<[string, number, number]> {
  const rows = (groups || []).filter((g) => g && g.name).slice(0, limit)
  const max = Math.max(1, ...rows.map((g) => Number(g.qty) || 0))
  return rows.map<[string, number, number]>((g) => {
    const qty = Number(g.qty) || 0
    return [String(g.name), Math.max(4, Math.round((qty / max) * 100)), qty]
  })
}

/* ---------------- 许可证列表数据（后端接口返回） ---------------- */

interface LicPoint {
  no: string
  pos: string
  eng: string
}

interface LicCert {
  wpcCd?: string // 取水许可编码（后端主键，编辑/删除/详情用）
  ecId?: string // 电子证照 ID
  no: string // 取水口编号（多个取水口时配合 nos 使用）
  nos?: string[] // 同一许可证下的多个取水口编号
  pts?: LicPoint[] // 取水口明细
  cert: string // 许可证编号
  owner: string // 取水权人
  code: string // 组织机构代码
  proj?: string // 取水项目名称
  river: string // 所属河流
  amt: number // 许可水量（万m³/年）
  use: string // 用途
  biz: string // 业务类型
  src: string // 水源类型
  org: string // 监管单位
  area: string // 行政区名称（WR_AD_B.AD_NM，按 AD_CD 联查得到）
  adNm?: string // 行政区划名称（同 area，保留原始字段）
  inpos: string // 河道内外
  status: string // 证照状态
  issued: string // 发证状态
  exp: boolean // 是否临近过期
  // 详情 / 编辑弹框使用的扩展字段
  from?: string
  to?: string
  reach?: string
  itype?: string
  focus?: string
  big?: string
  small?: string
  prov?: string
  city?: string
  county?: string
  addr?: string
  eng?: string
  adCd?: string
  inposTxt?: string
}

// 后端接口不可用时的兜底演示数据（正常流程完全走 /api/ecCert 接口）
const DEMO_CERTS: LicCert[] = [
  {
    no: '岳城局-01-1',
    nos: ['岳城局-01-1', '岳城局-01-2'],
    cert: 'A130402S2025-0032',
    owner: '邯郸市生态水网管理中心',
    code: '121304006732187090',
    proj: '民有渠',
    river: '岳城水库',
    amt: 6202,
    use: '农业灌溉和工业用水',
    biz: '新办',
    src: '地表水',
    org: '岳城局',
    area: '邯郸市',
    inpos: '河道外',
    status: '有效',
    issued: '已发证',
    exp: false
  },
  {
    no: '岳城局-02-1',
    nos: ['岳城局-02-1', '岳城局-02-2'],
    cert: 'A410505S2024-0581',
    owner: '安阳市水利工程运行保障中心',
    code: '12410500MB1L19153',
    proj: '漳南渠',
    river: '岳城水库',
    amt: 3914,
    use: '农业灌溉',
    biz: '延续',
    src: '地表水',
    org: '岳城局',
    area: '安阳市',
    inpos: '河道外',
    status: '有效',
    issued: '已发证',
    exp: false
  },
  {
    no: '岳城局-03',
    cert: 'A130427S2023-0032',
    owner: '邯郸市漳岳水电有限公司',
    code: '911304275661567092',
    proj: '漳岳水电站',
    river: '岳城水库',
    amt: 20000,
    use: '河道内生产用水-水力发电',
    biz: '延续',
    src: '地表水',
    org: '岳城局',
    area: '邯郸市',
    inpos: '河道内',
    status: '有效',
    issued: '已发证',
    exp: false
  },
  {
    no: '卫河局-01',
    cert: 'A410621S2021-1648',
    owner: '河南省浚县新镇镇淇门南街村委会',
    code: '54410621ME2116999F',
    proj: '淇门南街提水站',
    river: '卫河',
    amt: 22,
    use: '农业灌溉',
    biz: '延续',
    src: '地表水',
    org: '卫河局',
    area: '鹤壁市',
    inpos: '河道外',
    status: '有效',
    issued: '已发证',
    exp: false
  },
  {
    no: '卫河局-08',
    cert: 'A410526S2024-0213',
    owner: '河南省滑县道口镇人民政府',
    code: '54410527B67450401T',
    proj: '滑县道口泵站',
    river: '卫河',
    amt: 260,
    use: '农业灌溉',
    biz: '新办',
    src: '地表水',
    org: '卫河局',
    area: '安阳市',
    inpos: '河道外',
    status: '有效',
    issued: '已发证',
    exp: false
  },
  {
    no: '德州局-01',
    cert: 'A371428S2023-0127',
    owner: '武城县水利局',
    code: '113714280044512345',
    proj: '四女寺南闸取水工程',
    river: '卫运河',
    amt: 480,
    use: '工业和城市生活',
    biz: '新办',
    src: '地表水',
    org: '德州局',
    area: '德州市',
    inpos: '河道内',
    status: '有效',
    issued: '准予未发',
    exp: true
  },
  {
    no: '聊城局-01',
    cert: 'A371581S2022-0330',
    owner: '临清市水务局',
    code: '113715810044312345',
    proj: '临清运河灌区取水工程',
    river: '南运河',
    amt: 1260,
    use: '农业灌溉',
    biz: '变更',
    src: '地表水',
    org: '聊城局',
    area: '聊城市',
    inpos: '河道外',
    status: '有效',
    issued: '已发证',
    exp: false
  },
  {
    no: '邢衡局-01',
    cert: 'A131182S2024-0210',
    owner: '故城县城乡供水有限公司',
    code: '91131126MA0ABCDE12',
    proj: '故城县城区供水水源工程',
    river: '卫运河',
    amt: 540,
    use: '生活用水',
    biz: '新办',
    src: '地下水',
    org: '邢衡局',
    area: '衡水市',
    inpos: '河道外',
    status: '有效',
    issued: '已发证',
    exp: true
  },
  {
    no: '沧州局-01',
    cert: 'A130928S2023-0446',
    owner: '吴桥县水务局',
    code: '111309280044223344',
    proj: '吴桥县漳卫新河扬水站',
    river: '漳卫新河',
    amt: 380,
    use: '生态用水',
    biz: '注销',
    src: '地表水',
    org: '沧州局',
    area: '沧州市',
    inpos: '河道内',
    status: '注销',
    issued: '已发证',
    exp: false
  },
  {
    no: '水闸局-01',
    cert: 'A130981S2025-0071',
    owner: '宁津县水利局',
    code: '113714220044112233',
    proj: '减河宁津段取水工程',
    river: '减河',
    amt: 95,
    use: '农业灌溉',
    biz: '新办',
    src: '地表水',
    org: '水闸局',
    area: '德州市',
    inpos: '河道外',
    status: '有效',
    issued: '已发证',
    exp: false
  }
]

// 演示数据补行政区编码：行政区下拉按 AD_CD 取值，缺编码会导致接口不可用时下拉为空
const DEMO_CITY_AD_CD: Record<string, string> = {
  邯郸市: '130400',
  安阳市: '410500',
  鹤壁市: '410600',
  德州市: '371400',
  聊城市: '371500',
  衡水市: '131100',
  沧州市: '130900'
}
DEMO_CERTS.forEach((c) => {
  c.adCd = c.adCd || DEMO_CITY_AD_CD[c.area] || ''
})

/* ---------------- 列表数据加载 ---------------- */

const licCerts = ref<LicCert[]>([])
/** 下拉选项数据源：全量列表（与筛选结果解耦，保证行政区 / 监管单位选项始终最全） */
const optionCerts = ref<LicCert[]>([])

/** 组装后端查询参数（文本条件取已生效值，避免边输边检索） */
function buildQuery(): CertQuery {
  const q: CertQuery = {}
  if (aqCert.value) {
    q.cert = aqCert.value
  }
  if (aqOwner.value) {
    q.owner = aqOwner.value
  }
  if (aqCode.value) {
    q.code = aqCode.value
  }
  if (aqRiver.value) {
    q.river = aqRiver.value
  }
  // 行政区传编码（AD_CD），不再传名称
  if (fqArea.value) {
    q.adCd = fqArea.value
  }
  if (fqOrg.value) {
    q.org = fqOrg.value
  }
  // 下拉 / 单选 / 多选一律传码值：中文只用于界面展示，接口契约保持 1 / 0 / 数字编码
  if (inpos.value) {
    q.inpos = inpos.value
  }
  if (srcs.value.length) {
    q.srcs = srcs.value
  }
  if (issued.value) {
    q.issued = issued.value
  }
  const range =
    amt.value === '<100'
      ? 'lt100'
      : amt.value === '>1000'
        ? 'gt1000'
        : amt.value === '全部'
          ? ''
          : amt.value
  if (range) {
    q.amtRange = range
  }
  if (expOnly.value) {
    q.expOnly = true
  }
  return q
}

/** 加载证照列表；统计为全库概览，仅在初始化 / 数据变更后刷新 */
async function loadData(withStat = true) {
  loading.value = true
  try {
    const query = buildQuery()
    // 下拉选项不能跟着筛选结果缩水：带条件查询时额外拉一次全量列表作为选项数据源
    const needAll = Object.keys(query).length > 0
    const [listRes, statRes, allRes] = await Promise.all([
      getCertList(query),
      withStat ? getCertStat() : Promise.resolve(null),
      needAll ? getCertList() : Promise.resolve(null)
    ])
    const rows = (listRes?.data || []) as LicCert[]
    licCerts.value = rows
    optionCerts.value = allRes ? ((allRes?.data || []) as LicCert[]) : rows
    if (statRes) {
      const stat = (statRes.data || {}) as CertStat
      statData.certCount = Number(stat.certCount) || licCerts.value.length
      statData.permitQty = Number(Number(stat.permitQty || 0).toFixed(2))
      statData.intakeCount = Number(stat.intakeCount) || 0
      LIC_BARS1.value = toBars(stat.riverQty)
      LIC_BARS2.value = toBars(stat.riverIntake)
      LIC_ORGS.value = (stat.orgCount || [])
        .slice(0, 6)
        .map<
          [string, number, string]
        >((g, i) => [String(g.name), Number(g.qty) || 0, PIE_COLORS[i % PIE_COLORS.length]])
      renderMiniBarsAll()
      renderOrgDonut()
    }
  } catch (e: any) {
    licCerts.value = DEMO_CERTS
    optionCerts.value = DEMO_CERTS
    applyDemoStat()
    window.$message?.error(e?.message || '后端接口不可用，当前展示演示数据')
  } finally {
    loading.value = false
  }
}

/** 接口不可用时的兜底统计 */
function applyDemoStat() {
  statData.certCount = DEMO_CERTS.length
  statData.permitQty = DEMO_CERTS.reduce((s, c) => s + c.amt, 0)
  statData.intakeCount = DEMO_CERTS.reduce((s, c) => s + (c.nos?.length || 1), 0)
  const rivers = [...new Set(DEMO_CERTS.map((c) => c.river))]
  const ofRiver = (r: string) => DEMO_CERTS.filter((c) => c.river === r)
  LIC_BARS1.value = toBars(
    rivers.map((r) => ({ name: r, qty: ofRiver(r).reduce((s, c) => s + c.amt, 0) }))
  )
  LIC_BARS2.value = toBars(
    rivers.map((r) => ({
      name: r,
      qty: ofRiver(r).reduce((s, c) => s + (c.nos?.length || 1), 0)
    }))
  )
  const orgs = [...new Set(DEMO_CERTS.map((c) => c.org))]
  LIC_ORGS.value = orgs
    .slice(0, 6)
    .map<
      [string, number, string]
    >((o, i) => [o, DEMO_CERTS.filter((c) => c.org === o).length, PIE_COLORS[i % PIE_COLORS.length]])
  renderMiniBarsAll()
  renderOrgDonut()
}

/* ---------------- 筛选选项（值为数据库码值，中文只用于展示） ---------------- */

// 河道内外（单选）：EC_BASE_INFO_WR.RIVER_INNER，1 河道内 / 0 河道外
const INPOS_OPTIONS: Array<{ v: string; t: string }> = [
  { v: '', t: '全部' },
  { v: '1', t: '河道内' },
  { v: '0', t: '河道外' }
]

// 水源类型（多选）：WR_WPC_SUP_B.WSRC_TP，1 地表水 / 2 地下水 / 3 其他
// 原型的「矿泉水 / 地热水」在码表里没有独立取值，归入地表水 / 地下水，避免两个选项同码值互相联动
const SRC_OPTIONS: Array<{ v: string; t: string }> = [
  { v: '1', t: '地表水' },
  { v: '2', t: '地下水' },
  { v: '3', t: '其他' }
]

// 许可水量区间（单选）
const AMT_OPTIONS: Array<{ v: string; t: string }> = [
  { v: '全部', t: '全部' },
  { v: '<100', t: '<100万m³' },
  { v: '100-1000', t: '100-1000万m³' },
  { v: '>1000', t: '>1000万m³' }
]

// 证照状态（多选，同时匹配证照状态 / 业务类型）
const CERT_STATUS_OPTIONS = ['有效', '新办', '变更', '延续', '无效', '注销', '吊销', '撤销']

// 状态-发证状态（单选）：WR_WPC_SUP_B.STT，1 已发证 / 0 准予未发（空值同 0）
const ISSUED_OPTIONS: Array<{ v: string; t: string }> = [
  { v: '', t: '全部' },
  { v: '1', t: '已发证' },
  { v: '0', t: '准予未发' }
]

/* ---------------- 筛选状态 ---------------- */

// 文本输入（草稿）：边输边改，不参与检索
const fqCert = ref('') // 许可证编号
const fqOwner = ref('') // 取水权人
const fqCode = ref('') // 组织机构代码
const fqRiver = ref('') // 河流

// 已生效的文本条件：仅在点击「查询」/「清除筛选」时由上方草稿同步
const aqCert = ref('')
const aqOwner = ref('')
const aqCode = ref('')
const aqRiver = ref('')

const fqArea = ref('') // 行政区划编码（WR_WPC_SUP_B.AD_CD）
const fqOrg = ref('') // 监管单位
const inpos = ref('') // 河道内外：1 / 0 / 空
const amt = ref('全部') // 许可水量区间
const srcs = ref<string[]>([]) // 水源类型码值多选：1 / 2 / 3
const sts = ref<string[]>([]) // 证照状态多选（前端本地过滤，不下发后端）
const issued = ref('') // 发证状态：1 / 0 / 空
const expOnly = ref(false) // 仅看临近过期

// 查询区折叠状态（点击标题折叠/展开）
const secFold = ref(false)

// 行政区下拉：值统一用 AD_CD，名称只用于展示
// 后端按编码前缀匹配（给 130400 能带出下属县区），行政区更名也不会让筛选失效
const areaOptions = computed(() => {
  const map = new Map<string, string>()
  for (const c of optionCerts.value) {
    const code = (c.adCd || '').trim()
    const name = (c.area || c.adNm || '').trim()
    if (code) {
      map.set(code, name || code)
    }
  }
  return [...map.entries()]
    .map(([value, label]) => ({ label, value }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh'))
})
const orgOptions = computed(() =>
  [...new Set(optionCerts.value.map((c) => (c.org || '').trim()))].filter((o) => o).sort()
)

// n-select 选项：首项「全部」表示不限，其余取自全量选项数据源（不随筛选结果变化）
const areaSelectOptions = computed(() => [{ label: '全部', value: '' }, ...areaOptions.value])
const orgSelectOptions = computed(() => [
  { label: '全部', value: '' },
  ...orgOptions.value.map((v) => ({ label: v, value: v }))
])

/* ---------------- 计算属性：筛选逻辑与原型保持一致 ---------------- */

// 列表接口返回中文字段，筛选条件统一用码值：本地二次过滤前先做一次「中文 → 码值」翻译。
// 与后端 EcCertService.binaryCode / toSrcCode 保持同一套口径，两边任一改动都要同步。
const srcCodeOf = (text?: string) => {
  const v = (text || '').trim()
  if (!v) {
    return ''
  }
  if (v.includes('地表')) {
    return '1'
  }
  if (v.includes('地下')) {
    return '2'
  }
  return '3'
}
const inposCodeOf = (text?: string) => ((text || '').trim() === '河道内' ? '1' : '0')
const issuedCodeOf = (text?: string) => ((text || '').trim() === '已发证' ? '1' : '0')

// 筛选后的列表
const filteredRows = computed(() =>
  licCerts.value.filter((c) => {
    if (aqCert.value && !c.cert.toLowerCase().includes(aqCert.value.toLowerCase())) {
      return false
    }
    if (aqOwner.value && !c.owner.includes(aqOwner.value)) {
      return false
    }
    if (aqCode.value && !c.code.toLowerCase().includes(aqCode.value.toLowerCase())) {
      return false
    }
    if (aqRiver.value && !c.river.includes(aqRiver.value)) {
      return false
    }
    // 行政区按编码比对；编码缺失的行不参与命中，避免「空值恰好相等」的假匹配
    if (fqArea.value && c.adCd !== fqArea.value) {
      return false
    }
    if (fqOrg.value && c.org !== fqOrg.value) {
      return false
    }
    // 筛选条件已是码值，列表返回的是中文展示值：比对前先翻译一次
    if (inpos.value && inposCodeOf(c.inpos) !== inpos.value) {
      return false
    }
    if (srcs.value.length && !srcs.value.includes(srcCodeOf(c.src))) {
      return false
    }
    if (amt.value === '<100' && !(c.amt < 100)) {
      return false
    }
    if (amt.value === '100-1000' && !(c.amt >= 100 && c.amt <= 1000)) {
      return false
    }
    if (amt.value === '>1000' && !(c.amt > 1000)) {
      return false
    }
    if (sts.value.length && !(sts.value.includes(c.status) || sts.value.includes(c.biz))) {
      return false
    }
    if (issued.value && issuedCodeOf(c.issued) !== issued.value) {
      return false
    }
    if (expOnly.value && !c.exp) {
      return false
    }
    return true
  })
)

// 筛选结果许可水量合计
const filteredAmt = computed(
  () => Math.round(filteredRows.value.reduce((s, c) => s + (Number(c.amt) || 0), 0) * 100) / 100
)

// 筛选结果取水口数合计
const filteredIntakeCount = computed(() =>
  filteredRows.value.reduce((s, c) => s + (c.nos?.length || 0), 0)
)

// 是否处于筛选状态（决定脚注文案与"清除筛选"入口）
const hasFilter = computed(
  () =>
    !!aqCert.value ||
    !!aqOwner.value ||
    !!aqCode.value ||
    !!aqRiver.value ||
    !!fqArea.value ||
    !!fqOrg.value ||
    !!inpos.value ||
    amt.value !== '全部' ||
    srcs.value.length > 0 ||
    sts.value.length > 0 ||
    !!issued.value ||
    expOnly.value
)

/* ---------------- 迷你柱状图（卡片一 / 卡片三，ECharts） ---------------- */

// 两个迷你柱状图容器与实例
const bars1ChartRef = ref<HTMLDivElement | null>(null)
const bars2ChartRef = ref<HTMLDivElement | null>(null)
const { setOptions: setBars1Options } = useECharts(bars1ChartRef as Ref<HTMLDivElement>, 'light')
const { setOptions: setBars2Options } = useECharts(bars2ChartRef as Ref<HTMLDivElement>, 'light')

// 渲染迷你柱状图：无坐标轴线/刻度，类目标签竖排，样式对齐原假柱子
function renderMiniBars(
  setOptions: (opt: Record<string, any>) => void,
  data: Array<[string, number, number]>,
  unit: string
) {
  setOptions({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'none' },
      // 悬停显示实际值（柱高仍按百分比归一化）
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params
        const raw = data[p.dataIndex]?.[2]
        const val = typeof raw === 'number' ? Number(raw.toFixed(2)) : 0
        return `${p.name}：${val} ${unit}`
      }
    },
    grid: { left: 2, right: 2, top: 8, bottom: 4, containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map((d) => d[0]),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        interval: 0,
        fontSize: 10,
        lineHeight: 11,
        color: '#5a7ba6',
        // 竖排文字：每个字符单独一行
        formatter: (v: string) => v.split('').join('\n')
      }
    },
    yAxis: { type: 'value', show: false, max: 100 },
    series: [
      {
        type: 'bar',
        data: data.map((d) => d[1]),
        barWidth: 9,
        itemStyle: {
          borderRadius: [2, 2, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#6cb5f5' },
            { offset: 1, color: '#2f80d8' }
          ])
        }
      }
    ]
  })
}

function renderMiniBarsAll() {
  renderMiniBars(setBars1Options, LIC_BARS1.value, '万m³')
  renderMiniBars(setBars2Options, LIC_BARS2.value, '个')
}

/* ---------------- 环形图（监管单位分布，ECharts） ---------------- */

// 饼图容器与实例
const donutChartRef = ref<HTMLDivElement | null>(null)
const { setOptions: setDonutOptions } = useECharts(donutChartRef as Ref<HTMLDivElement>, 'light')

// 饼图数据：颜色与右侧自定义图例共用 LIC_ORGS 中的色值，保证两边一致
const orgPieData = computed(() =>
  LIC_ORGS.value.map((d) => ({
    name: d[0],
    value: d[1],
    itemStyle: { color: d[2] }
  }))
)

// 渲染监管单位分布环形图
function renderOrgDonut() {
  setDonutOptions({
    tooltip: {
      trigger: 'item',
      formatter: '{b}：{c} 个（{d}%）'
    },
    // 图例由模板中的自定义 HTML 渲染（带点击筛选），故关闭内置图例
    legend: { show: false },
    series: [
      {
        type: 'pie',
        radius: ['58%', '92%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: '#fff', borderWidth: 2 },
        label: {
          show: true,
          position: 'center',
          formatter: (params: any) => '{name|监管单位}\n{name|分布}',
          rich: {
            name: { fontSize: 10, lineHeight: 13, color: '#41577a' }
          }
        },
        labelLine: { show: false },
        // 容器仅 76px，关闭悬停放大避免扇区被裁切
        emphasis: { scale: false },
        data: orgPieData.value
      },
      {
        // 底环：浅色装饰层
        type: 'pie',
        radius: ['54%', '100%'],
        center: ['50%', '50%'],
        silent: true,
        itemStyle: { color: 'rgba(99, 142, 220, 0.1)' },
        label: { show: false },
        data: [{ value: 1 }],
        z: -1
      }
    ]
  })
}

onMounted(() => loadData(true))

/* ---------------- 交互 ---------------- */

/** 点击「查询」：把文本输入的草稿值同步为生效条件后再检索 */
function applyQuery() {
  aqCert.value = fqCert.value.trim()
  aqOwner.value = fqOwner.value.trim()
  aqCode.value = fqCode.value.trim()
  aqRiver.value = fqRiver.value.trim()
  loadData(false)
}

// 清除全部筛选条件
function resetFilters() {
  fqCert.value = ''
  fqOwner.value = ''
  fqCode.value = ''
  fqRiver.value = ''
  aqCert.value = ''
  aqOwner.value = ''
  aqCode.value = ''
  aqRiver.value = ''
  fqArea.value = ''
  fqOrg.value = ''
  inpos.value = ''
  amt.value = '全部'
  srcs.value = []
  sts.value = []
  issued.value = ''
  expOnly.value = false
  loadData(false)
}

/** 新增 / 编辑保存：调用后端后刷新列表，只读表字段在本次会话内合并回显 */
async function onLicSaved(rec: any, meta?: { isEdit: boolean; oldCert: string }) {
  const oldCert = meta?.oldCert
  const old = oldCert ? licCerts.value.find((x) => x.cert === oldCert) : undefined
  const wpcCd = rec?.wpcCd || old?.wpcCd || ''
  const payload = { ...toCertPayload(rec), wpcCd }
  try {
    const res = meta?.isEdit ? await updateCert(payload) : await saveCert(payload)
    await loadData(true)
    const saved = res?.data
    const key = saved?.wpcCd || wpcCd || rec?.cert
    const i = licCerts.value.findIndex((x) => x.wpcCd === key || x.cert === rec?.cert)
    if (i >= 0) {
      licCerts.value.splice(i, 1, {
        ...licCerts.value[i],
        ...(saved || {}),
        ...rec,
        // 行政区取值以联查结果（AD_CD → WR_AD_B.AD_NM）为准，不让表单里的城市名覆盖
        area: licCerts.value[i].area || saved?.adNm || rec?.area,
        adCd: saved?.adCd || rec?.adCd || licCerts.value[i].adCd,
        wpcCd: key || licCerts.value[i].wpcCd
      } as LicCert)
    }
    window.$message?.success(meta?.isEdit ? '取水许可证已更新' : '新增取水许可证已保存')
  } catch (e: any) {
    window.$message?.error(e?.message || '保存失败')
  }
}

/** 删除确认后调用后端删除并刷新列表 */
async function onLicDeleted(c: any) {
  const wpcCd = c?.wpcCd
  if (!wpcCd) {
    window.$message?.warning('缺少取水许可编码，无法删除')
    return
  }
  try {
    await deleteCert(wpcCd)
    await loadData(true)
    window.$message?.success(`已删除许可证 ${c.cert}`)
  } catch (e: any) {
    window.$message?.error(e?.message || '删除失败')
  }
}

// 行操作：详情 / 编辑 / 删除
function onOp(act: string, c: LicCert) {
  if (act === 'det') {
    licDetailRef.value?.show(c)
  } else if (act === 'edt') {
    licNewRef.value?.show(c)
  } else if (act === 'del') {
    licDeleteRef.value?.show(c)
  }
}

// 点击取水权人打开证照详情（与原型一致）
function onOwnerClick(c: LicCert) {
  licDetailRef.value?.show(c)
}

// 点击环形图图例：按对应监管单位筛选表格
function onLegendClick(name: string) {
  if (licCerts.value.some((c) => c.org === name)) {
    fqOrg.value = name
  }
}

// 编号列：取第一个取水口编号
function firstNo(c: LicCert) {
  return c.nos && c.nos.length ? c.nos[0] : c.no
}

// 编号列：是否为多取水口（显示"等 N 个"角标）
function multiNo(c: LicCert) {
  return !!c.nos && c.nos.length > 1
}

/* ---------------- 许可证列表列（字段、顺序与原表格一致） ---------------- */
const columns: VxeGridPropTypes.Columns = [
  // { field: 'no', title: '编号', minWidth: 110, align: 'center', slots: { default: 'no' } },
  { field: 'cert', title: '许可证编号', minWidth: 150, align: 'center' },
  {
    field: 'owner',
    title: '取水权人',
    minWidth: 180,
    align: 'left',
    showOverflow: 'tooltip',
    slots: { default: 'owner' }
  },
  { field: 'code', title: '组织机构代码', minWidth: 160, align: 'center' },
  {
    field: 'proj',
    title: '取水项目名称',
    minWidth: 160,
    align: 'left',
    showOverflow: 'tooltip'
  },
  { field: 'river', title: '所属河流', minWidth: 110, align: 'center' },
  { field: 'amt', title: '许可水量（万m³/年）', minWidth: 180, align: 'center' },
  { field: 'use', title: '用途', minWidth: 100, align: 'center' },
  { field: 'biz', title: '业务类型', minWidth: 100, align: 'center' },
  { field: 'src', title: '水源类型', minWidth: 100, align: 'center' },
  { field: 'org', title: '监管单位', minWidth: 100, align: 'center' },
  { field: 'area', title: '行政区', minWidth: 160, align: 'center' },
  {
    field: 'op',
    title: '操作',
    width: 200,
    align: 'center',
    fixed: 'right',
    slots: { default: 'op' }
  }
]

/* ---------------- 智能体接入（声明见同目录 zhengzhaoguanli.ts） ---------------- */

/** 编号归一化：忽略空格与大小写，容忍模型给出的编号格式差异 */
function normKey(v?: string) {
  return (v || '').replace(/\s+/g, '').toUpperCase()
}

/** 按许可证编号 / 取水口编号查找记录（模型给的值不可信，找不到要提示） */
function findCert(key?: string) {
  const k = normKey(key)
  if (!k) {
    return undefined
  }
  return licCerts.value.find(
    (c) =>
      normKey(c.cert) === k || normKey(c.no) === k || (c.nos || []).some((n) => normKey(n) === k)
  )
}

function warnCertMissing(key?: string) {
  window.$message?.warning(`未找到许可证「${key || '（空）'}」，请确认编号是否正确`)
}

function showLicNew() {
  secFold.value = false
  licNewRef.value?.show()
}

function showLicEdit(cert?: string) {
  const rec = findCert(cert)
  if (!rec) {
    warnCertMissing(cert)
    return
  }
  secFold.value = false
  licNewRef.value?.show(rec)
}

function showLicDetail(cert?: string, tab?: string, gran?: string, port?: string) {
  const rec = findCert(cert)
  if (!rec) {
    warnCertMissing(cert)
    return
  }
  licDetailRef.value?.show(rec, {
    tab: tab === 'meter' ? 'meter' : 'basic',
    gran: gran === 'day' || gran === 'year' ? gran : 'month',
    port
  })
}

function showLicDelete(cert?: string) {
  const rec = findCert(cert)
  if (!rec) {
    warnCertMissing(cert)
    return
  }
  secFold.value = false
  licDeleteRef.value?.show(rec)
}

/** 文本条件（模糊匹配）：写入草稿后立即检索，模型给条件时用户期望马上看到结果 */
function setFilterKeyword(field?: string, keyword?: string) {
  const target =
    field === '许可证编号'
      ? fqCert
      : field === '取水权人'
        ? fqOwner
        : field === '组织机构代码'
          ? fqCode
          : field === '河流'
            ? fqRiver
            : undefined
  if (!target) {
    window.$message?.warning('不支持的筛选字段')
    return
  }
  target.value = (keyword || '').trim()
  secFold.value = false
  applyQuery()
}

/**
 * 下拉条件：行政区 / 监管单位。
 *
 * <p>行政区内部存的是 AD_CD，模型可能给编码也可能给名称（提示词里两者都写了）：
 * 编码直接命中，名称按 label 反查编码，两者都查不到才提示可选范围。
 */
function setSelectFilter(field?: string, value?: string) {
  const v = (value || '').trim()
  if (field !== '行政区' && field !== '监管单位') {
    window.$message?.warning('不支持的筛选字段')
    return
  }
  if (field === '行政区') {
    const hit =
      !v || v === '全部'
        ? undefined
        : areaOptions.value.find((o) => o.value === v) || areaOptions.value.find((o) => o.label === v)
    if (v && v !== '全部' && !hit) {
      window.$message?.warning(
        `可选行政区：${areaOptions.value.map((o) => `${o.label}(${o.value})`).join('、') || '暂无'}`
      )
      return
    }
    fqArea.value = hit?.value || ''
  } else {
    if (v && v !== '全部' && !orgOptions.value.includes(v)) {
      window.$message?.warning(`可选${field}：${orgOptions.value.join('、') || '暂无'}`)
      return
    }
    fqOrg.value = v === '全部' ? '' : v
  }
  secFold.value = false
}

/** 河道内外归一化：提示词让模型传 1 / 0，用户口语仍可能是中文，两种都收 */
function inposToCode(value?: string): string | undefined {
  const v = (value || '').trim()
  if (!v || v === '全部') {
    return ''
  }
  if (v === '1' || v.includes('河道内')) {
    return '1'
  }
  if (v === '0' || v.includes('河道外')) {
    return '0'
  }
  return undefined
}

function setInposFilter(value?: string) {
  const code = inposToCode(value)
  if (code === undefined) {
    window.$message?.warning('可选河道内外：1（河道内）、0（河道外）、全部')
    return
  }
  inpos.value = code
  secFold.value = false
}

/** 多值条件：模型输出「地表水,地下水」这类逗号串，非法项整体拒绝并提示可选值 */
function splitMulti(value?: string) {
  return (value || '')
    .split(/[,，、\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** 水源类型归一化：码值 1/2/3 优先，中文按关键字兜底翻译 */
function srcToCode(part: string): string | undefined {
  if (part === '1' || part.includes('地表')) {
    return '1'
  }
  if (part === '2' || part.includes('地下')) {
    return '2'
  }
  if (part === '3' || part.includes('其他')) {
    return '3'
  }
  return undefined
}

function setSrcFilter(value?: string) {
  const raw = (value || '').trim()
  secFold.value = false
  if (!raw || raw === '全部') {
    srcs.value = []
    return
  }
  const codes: string[] = []
  for (const part of splitMulti(raw)) {
    const code = srcToCode(part)
    if (code === undefined) {
      window.$message?.warning('可选水源类型：1（地表水）、2（地下水）、3（其他）')
      return
    }
    if (!codes.includes(code)) {
      codes.push(code)
    }
  }
  srcs.value = codes
}

function setAmtRangeFilter(value?: string) {
  const v = value || '全部'
  if (!AMT_OPTIONS.some((o) => o.v === v)) {
    window.$message?.warning(`可选许可水量区间：${AMT_OPTIONS.map((o) => o.v).join('、')}`)
    return
  }
  amt.value = v
  secFold.value = false
}

function setStatusFilter(value?: string) {
  const raw = (value || '').trim()
  secFold.value = false
  if (!raw || raw === '全部') {
    sts.value = []
    return
  }
  const list = splitMulti(raw)
  if (list.some((s) => !CERT_STATUS_OPTIONS.includes(s))) {
    window.$message?.warning(`可选证照状态：${CERT_STATUS_OPTIONS.join('、')}`)
    return
  }
  sts.value = list
}

function setIssuedFilter(value?: string) {
  const v = (value || '').trim()
  const code = !v || v === '全部' ? '' : v === '1' || v.includes('已发证') ? '1' : v === '0' || v.includes('准予未发') ? '0' : undefined
  if (code === undefined) {
    window.$message?.warning('可选发证状态：1（已发证）、0（准予未发）、全部')
    return
  }
  issued.value = code
  secFold.value = false
}

function setExpiringFilter(value?: string) {
  if (value !== '是' && value !== '否') {
    window.$message?.warning('到期提醒取值为 是 / 否')
    return
  }
  expOnly.value = value === '是'
  secFold.value = false
}

function applyCertsQuery() {
  secFold.value = false
  applyQuery()
}

function clearFilters() {
  secFold.value = false
  resetFilters()
}

function toggleQueryPanel(open?: string) {
  secFold.value = open === '折叠' ? true : open === '展开' ? false : !secFold.value
}

// 智能体接入：只暴露页面能力；声明在同目录 zhengzhaoguanli.ts，事件注册由公共层自动完成
// 一律写成 `键: 函数` 形式（契约校验脚本按对象字面量解析键名，简写属性不会被识别）
exposeAgentContext({
  ready: computed(() => !loading.value),
  showLicNew: () => showLicNew(),
  showLicEdit: (cert?: string) => showLicEdit(cert),
  showLicDetail: (cert?: string, tab?: string, gran?: string, port?: string) =>
    showLicDetail(cert, tab, gran, port),
  showLicDelete: (cert?: string) => showLicDelete(cert),
  setFilterKeyword: (field?: string, keyword?: string) => setFilterKeyword(field, keyword),
  setSelectFilter: (field?: string, value?: string) => setSelectFilter(field, value),
  setInposFilter: (value?: string) => setInposFilter(value),
  setSrcFilter: (value?: string) => setSrcFilter(value),
  setAmtRangeFilter: (value?: string) => setAmtRangeFilter(value),
  setStatusFilter: (value?: string) => setStatusFilter(value),
  setIssuedFilter: (value?: string) => setIssuedFilter(value),
  setExpiringFilter: (value?: string) => setExpiringFilter(value),
  applyCertsQuery: () => applyCertsQuery(),
  clearFilters: () => clearFilters(),
  toggleQueryPanel: (open?: string) => toggleQueryPanel(open)
} satisfies ZhengzhaoguanliPageContract)
</script>

<template>
  <div class="lic-page">
    <!-- 统计横条 -->
    <div class="lstats">
      <!-- 卡片一：许可水量 -->
      <div class="lcard" data-anchor="stat-permit-qty">
        <div class="lhead">
          <div class="lnum">{{ hasFilter ? filteredAmt : statData.permitQty }}<small> 万m³</small></div>
          <div class="ltag">许可水量</div>
        </div>
        <div class="lchart">
          <div ref="bars1ChartRef" class="lbar-chart"></div>
        </div>
      </div>
      <!-- 卡片二：取水许可证 + 监管单位分布环形图 -->
      <div class="lcard" data-anchor="stat-cert-count">
        <div class="lhead">
          <div class="lnum">{{ hasFilter ? filteredRows.length : statData.certCount }}<small> 个</small></div>
          <div class="ltag">取水许可证</div>
        </div>
        <div class="ldonut">
          <div ref="donutChartRef" class="ldonut-chart"></div>
          <div class="dlegend">
            <span v-for="d in LIC_ORGS" :key="d[0]" class="dleg" @click="onLegendClick(d[0])">
              <i :style="{ background: d[2] }"></i>{{ d[0] }} <b>{{ d[1] }}</b>
            </span>
          </div>
        </div>
      </div>
      <!-- 卡片三：取水口 -->
      <div class="lcard" data-anchor="stat-intake-count">
        <div class="lhead">
          <div class="lnum">{{ hasFilter ? filteredIntakeCount : statData.intakeCount }}<small> 个</small></div>
          <div class="ltag">取水口</div>
        </div>
        <div class="lchart">
          <div ref="bars2ChartRef" class="lbar-chart"></div>
        </div>
      </div>
    </div>

    <!-- 电子证照查询区（点击标题可折叠） -->
    <div class="lsec" :class="{ fold: secFold }" data-anchor="query-panel">
      <div class="lsec-head">
        <h4>
          <span class="lcaret">▶</span>
          <span>电子证照查询</span>
        </h4>
        <div class="lbtns">
          <button class="lbtn" type="button" :disabled="loading" @click="applyQuery">
            {{ loading ? '查询中…' : '查询' }}
          </button>
          <button class="lbtn" type="button" @click="licNewRef?.show()">＋ 新建</button>
          <button class="lbtn" type="button">导出</button>
        </div>
      </div>

      <!-- 筛选行一：文本输入（Naive UI n-input，自带一键清空） + 下拉 -->
      <div class="lfrow">
        <span class="lf">
          许可证编号
          <span class="lf-ipt">
            <n-input v-model:value="fqCert" size="small" clearable />
          </span>
        </span>
        <span class="lf">
          取水权人
          <span class="lf-ipt">
            <n-input v-model:value="fqOwner" size="small" clearable />
          </span>
        </span>
        <span class="lf">
          组织机构代码
          <span class="lf-ipt">
            <n-input v-model:value="fqCode" size="small" clearable />
          </span>
        </span>
        <span class="lf">
          河流
          <span class="lf-ipt">
            <n-input v-model:value="fqRiver" size="small" clearable />
          </span>
        </span>
        <span class="lf">
          行政区
          <span class="lf-sel">
            <n-select v-model:value="fqArea" size="small" :options="areaSelectOptions" />
          </span>
        </span>
        <span class="lf">
          监管单位
          <span class="lf-sel">
            <n-select v-model:value="fqOrg" size="small" :options="orgSelectOptions" />
          </span>
        </span>
      </div>

      <!-- 筛选行二：河道内外（单选）/ 水源类型（多选）/ 许可水量区间（单选） -->
      <div class="lfrow">
        <span class="lf">
          <span class="lflb big-label-back">河道内外</span>
          <n-radio-group v-model:value="inpos" class="lcks">
            <n-radio v-for="o in INPOS_OPTIONS" :key="o.v" :value="o.v">{{ o.t }}</n-radio>
          </n-radio-group>
        </span>
        <span class="lf">
          <span class="lflb big-label-back">水源类型</span>
          <n-checkbox-group v-model:value="srcs" class="lcks">
            <n-checkbox v-for="o in SRC_OPTIONS" :key="o.v" :value="o.v">{{ o.t }}</n-checkbox>
          </n-checkbox-group>
        </span>
        <span class="lf">
          <span class="lflb big-label-back">许可水量</span>
          <n-radio-group v-model:value="amt" class="lcks">
            <n-radio v-for="o in AMT_OPTIONS" :key="o.v" :value="o.v">{{ o.t }}</n-radio>
          </n-radio-group>
        </span>
      </div>

      <!-- 筛选行三：证照状态（多选）/ 状态（单选）/ 临近过期 -->
      <div class="lfrow">
        <span class="lf">
          <span class="lflb big-label-back">证照状态</span>
          <n-checkbox-group v-model:value="sts" class="lcks">
            <template v-for="(o, i) in CERT_STATUS_OPTIONS" :key="o">
              <span v-if="i === 4" class="lck-gap"></span>
              <n-checkbox :value="o">{{ o }}</n-checkbox>
            </template>
          </n-checkbox-group>
        </span>
        <span class="lf">
          <span class="lflb big-label-back">状态</span>
          <n-radio-group v-model:value="issued" class="lcks">
            <n-radio v-for="o in ISSUED_OPTIONS" :key="o.v" :value="o.v">{{ o.t }}</n-radio>
          </n-radio-group>
        </span>
        <span class="lf">
          <span class="lflb big-label-back">到期提醒</span>
          <n-checkbox v-model:checked="expOnly" class="lcks">临近过期（≤60天）</n-checkbox>
        </span>
      </div>

      <!-- 许可证列表 -->
      <div class="ltbl-wrap pt-table-wrap" data-anchor="cert-table">
        <pro-table
          :columns="columns"
          :data="filteredRows"
          :is-pagination="false"
          :loading="loading"
          height="100%"
          empty-text="暂无符合条件的数据"
        >
          <template #no="{ row }">
            {{ firstNo(row)
            }}<span v-if="multiNo(row)" class="nmulti">等 {{ row.nos?.length }} 个</span>
          </template>
          <template #owner="{ row }">
            <span class="lname" @click="onOwnerClick(row)">{{ row.owner }}</span>
          </template>
          <template #op="{ row }">
            <button class="lact" type="button" @click="onOp('det', row)">详情</button>
            <button class="lact edt" type="button" @click="onOp('edt', row)">编辑</button>
            <button class="lact del" type="button" @click="onOp('del', row)">删除</button>
          </template>
        </pro-table>
      </div>

      <!-- 底部脚注 -->
      <div class="lfoot" data-anchor="cert-foot">
        <template v-if="hasFilter">
          筛选结果：<b>{{ filteredRows.length }}</b> 条；许可水量合计
          <b>{{ filteredAmt }}</b> 万m³；取水口数 <b>{{ filteredIntakeCount }}</b
          >个<span class="lclear" @click="resetFilters">清除筛选</span>
        </template>
        <template v-else>
          证件数 <b>{{ statData.certCount }}</b
          >个；许可水量 <b>{{ statData.permitQty }}</b
          >万m³；取水口数 <b>{{ statData.intakeCount }}</b
          >个
        </template>
      </div>
    </div>

    <!-- 新增 / 编辑取水许可证弹框 -->
    <LicNewModal ref="licNewRef" @saved="onLicSaved" />
    <!-- 证照详情弹框（基本信息 / 监测计量信息） -->
    <LicDetailModal ref="licDetailRef" />
    <!-- 删除确认弹框 -->
    <LicDeleteModal ref="licDeleteRef" @confirm="onLicDeleted" />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/style/water-filter.scss' as wf;

/* ================= 页面容器（浅色整页） ================= */
.lic-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  padding: 5px;
  font-size: 13px;
  color: #1c3a63;
  //background: #eef3f8;
  overflow: hidden;
}

/* ================= 统计横条 ================= */
.lstats {
  display: flex;
  gap: 14px;
  flex: none;
}

.lcard {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 16px;
  padding: 10px 18px;
  background: #fff;
  border: 1px solid #d5e4f5;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(30, 90, 170, 0.08);
}

.lhead {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 128px;
  align-items: center;
}

.lnum {
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
  color: #1f7ae0;
  white-space: nowrap;

  small {
    font-size: 15px;
    color: #2d2d2d;
    font-weight: 500;
  }
}

.ltag {
  //align-self: flex-start;
  padding: 3px 14px;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  color: #1f7ae0;
  background: #e8f1fd;
  border: 1px solid #bcd7f7;
  border-radius: 3px;
}

/* 迷你柱状图 */
.lchart {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  min-width: 0;
}

/* 迷你柱状图（ECharts） */
.lbar-chart {
  flex: 1;
  min-width: 0;
  height: 116px;
}

/* 环形图 + 图例 */
.ldonut {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  min-width: 0;
  padding-right: 20px;

  .ldonut-chart {
    flex: none;
    width: 200px;
    height: 120px;
  }
}

.dlegend {
  display: flex;
  flex-direction: column;
  gap: 2px;
  //font-size: 12px;
  color: #41577a;
}

.dleg {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    color: #1f7ae0;
  }

  b {
    color: #22436f;
  }

  i {
    display: inline-block;
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 2px;
  }
}

/* ================= 查询区（白色卡片） ================= */
.lsec {
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

.lsec-head {
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
    cursor: pointer;
    user-select: none;
    align-items: center;
    display: flex;
  }
}

/* 折叠箭头 */
.lcaret {
  display: inline-block;
  margin-right: 6px;
  font-size: 12px;
  transition: transform 0.2s;
  color: #54a3dd;
}

.lbtns {
  display: flex;
  gap: 10px;
}

.lbtn {
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
.lfrow {
  @include wf.row;

  flex: none;
  margin-top: 11px;
}

/* 筛选字段：控件统一为 Naive UI 组件，公共样式只保留布局与文字 */
.lf {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: wf.$fs;
  color: wf.$c-label;
  white-space: nowrap;
}

/* 文本筛选框（n-input）：对齐下拉框的 26px 高度 / 118px 宽度 / 3px 圆角 */
.lf-ipt {
  display: inline-flex;
  width: 118px;

  :deep(.n-input) {
    @include wf.ninput;
  }
}

/* 下拉筛选框（n-select）：与 n-input 同一套外观 */
.lf-sel {
  display: inline-flex;
  width: 130px;

  :deep(.n-select) {
    width: 100%;

    .n-base-selection {
      @include wf.nselect;
    }
  }
}

/* 下划线小标签 */
.lflb {
  text-underline-offset: 3px;
  color: #2d2d2d;
  font-size: 14px;
  //font-weight: bold;
}

/* 单选 / 复选组（Naive UI n-radio / n-checkbox） */
.lcks {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 14px;
  font-size: wf.$fs;

  &,
  :deep(.n-radio),
  :deep(.n-checkbox) {
    --n-font-size: #{wf.$fs} !important;
    --n-size: 14px !important;
    --n-radio-size: 14px !important;
    --n-label-padding: 0 0 0 6px !important;
    --n-text-color: #{wf.$c-label} !important;
    --n-color-checked: #1f7ae0 !important;
    --n-border-checked: 1px solid #1f7ae0 !important;
    --n-color-active: #1f7ae0 !important;
    --n-dot-color-active: #fff !important;
    --n-check-mark-color: #fff !important;
    cursor: pointer;
  }
}

/* 状态分组间隔 */
.lck-gap {
  width: 8px;
}

/* ================= 列表表格 ================= */
/* 容器描边 / 圆角统一由 .pt-table-wrap 提供，此处仅保留布局 */
.ltbl-wrap {
  flex: 1;
  min-height: 0;
  margin-top: 10px;
  overflow: hidden;
}

/* 取水权人（可点击样式的链接文字） */
.lname {
  color: #1f7ae0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

/* 多取水口角标 */
.nmulti {
  display: inline-block;
  margin-left: 4px;
  padding: 0 5px;
  font-size: 11px;
  line-height: 15px;
  color: #1f7ae0;
  vertical-align: 1px;
  background: #e8f2ff;
  border-radius: 8px;
}

/* 操作列按钮（胶囊样式） */
.lact {
  margin: 0 2px;
  padding: 2px 11px;
  font-family: inherit;
  font-size: 12.5px;
  line-height: 18px;
  color: #1f8fe8;
  cursor: pointer;
  background: #f4faff;
  border: 1px solid #2f9df0;
  border-radius: 12px;

  &:hover {
    color: #fff;
    background: #1f8fe8;
  }

  &.edt {
    color: #1f9e6e;
    background: #f1fcf7;
    border-color: #39b98a;

    &:hover {
      color: #fff;
      background: #1f9e6e;
    }
  }

  &.del {
    color: #e2564a;
    background: #fff6f5;
    border-color: #f08a80;

    &:hover {
      color: #fff;
      background: #e2564a;
    }
  }
}

/* ================= 底部脚注 ================= */
.lfoot {
  flex: none;
  margin-top: 10px;
  font-size: 13px;
  color: #33507a;

  b {
    font-weight: 700;
    color: #1f7ae0;
  }
}

/* 清除筛选入口 */
.lclear {
  margin-left: 8px;
  color: #1f7ae0;
  cursor: pointer;
  text-decoration: underline;
}

/* ================= 折叠态 ================= */
.lsec.fold {
  .lfrow,
  .ltbl-wrap {
    display: none;
  }
}
</style>

