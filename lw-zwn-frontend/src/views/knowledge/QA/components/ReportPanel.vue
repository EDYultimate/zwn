<script setup lang="ts">
// ============================================================
// 智能体三 / 四 · 重点取水口日报 & 水资源信息通报
// 严格复刻原型 index.html 的 agDaily / agBulletin：
//   日报：基础信息 → 一、取水基本情况（后台读取校核表）→ 二、监控运行情况录入
//         → ⚡ 自动编制 → 版式预览弹框（生成日报 / 归档知识库 / 重置）
//   通报：基础信息 → 一、通报附表（1-1 / 1-2 / 2 / 3 / 4 页签）→ 二、工作动态录入
//         → ⚡ 自动编制 → 六段版式预览弹框
// ============================================================
import { computed, onMounted, ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import { KB_DOCS, type KbDoc } from '../../data'
import {
  BL_GATE,
  BL_NEWS0,
  BL_PROV,
  BL_RIVER,
  BL_SEC,
  BL_YC,
  DR_BASE_DATE,
  DR_BASE_ISSUE,
  DR_DATA,
  DR_LAST_SUM,
  DR_MON,
  MON_HIST_84,
  MON_OPTIONS,
  RPT_DAY_ARCH,
  type BlNews,
  type DrMonRow
} from '../reportData'

const props = defineProps<{ mode: 'daily' | 'bulletin' }>()
const emit = defineEmits<{ notify: [msg: string] }>()

const isDaily = computed(() => props.mode === 'daily')
const unitName = computed(() =>
  isDaily.value ? '漳卫南局重点取水口取水日报' : '漳卫南运河水资源信息通报'
)
const title = computed(() => (isDaily.value ? '日报' : '通报'))

/** 数值格式化：千分位、最多两位小数（原型 agN） */
function n(v: number | null | undefined): string {
  if (v === null || v === undefined) {
    return '—'
  }
  return Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 2 })
}

/** 当前日期（归档时间） */
function today(): string {
  const d = new Date()
  const p = (x: number) => String(x).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

/** 解析日期字符串 */
function parseDate(s: string): Date {
  return new Date(s.replace(/-/g, '/'))
}

/** 月日文案（原型 md） */
function monthDay(d: Date): string {
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

/** 中文日期：2025-09-10 → 2025年9月10日 */
function cnDate(s: string): string {
  const parts = s.split('-')
  return `${parts[0]}年${parseInt(parts[1] ?? '1', 10)}月${parseInt(parts[2] ?? '1', 10)}日`
}

/* ==================== 一、日报 ==================== */

const drDate = ref('2025-09-10')
const drNo = ref(`第${DR_BASE_ISSUE}期`)
const drHint = ref('读取校核与录入完成后，点击「⚡ 自动编制日报」生成版式预览')
const drLoading = ref(false)
const drLoaded = ref(false)

interface Chk {
  t: string
  s: 'ok' | 'warn' | 'bad'
  d: string
}
const drChecks = ref<Chk[]>([])

const drParsed = computed(() => parseDate(drDate.value || DR_BASE_DATE))
const drPrev = computed(() => new Date(drParsed.value.getTime() - 86400000))
const drPrevLabel = computed(() => monthDay(drPrev.value))
const drMonthLabel = computed(() => `${drParsed.value.getMonth() + 1}月`)
const drSum = computed(() => DR_DATA.reduce((s, x) => s + (x.day || 0), 0))

const drMon = ref<DrMonRow[]>(DR_MON.map((x) => ({ ...x })))
const drName = ref(drMon.value[0]?.name ?? '')
const drStatus = ref(MON_OPTIONS[0] ?? '')
const drProg = ref('')
const drNote = ref('')

/** 校核：上报完整性 / 逻辑 / 计划 / 许可 / 合计（原型 drChecks） */
function buildDrChecks(): Chk[] {
  const its: Chk[] = []
  const miss = DR_DATA.filter((x) => x.day === null)
  its.push({
    t: '上报完整性',
    s: miss.length ? 'warn' : 'ok',
    d: miss.length
      ? `应报 ${DR_DATA.length} 处，实报 ${DR_DATA.length - miss.length} 处；缺报：${miss
          .map((x) => x.name)
          .join('、')}（当日取水量、月累计为空）`
      : `${DR_DATA.length} 处取水口全部上报`
  })
  its.push({
    t: '当日-累计逻辑',
    s: 'ok',
    d: '已上报取水口当日取水量均不大于当月累计，未发现数据倒挂'
  })
  const op = DR_DATA.filter((x) => x.mon !== null && x.mon > x.plan)
  its.push({
    t: '月累计 vs 月计划',
    s: op.length ? 'warn' : 'ok',
    d: op.length
      ? op
          .map(
            (x) =>
              `${x.name} 月累计 ${n(x.mon)} 万m³，超月计划 ${n(x.plan)} 万m³（超 ${n(
                (x.mon ?? 0) - x.plan
              )}）`
          )
          .join('；')
      : '各取水口月累计均未超当月计划'
  })
  const oy = DR_DATA.filter((x) => x.ytot !== null && x.ytot > x.year)
  its.push({
    t: '年累计 vs 年度许可',
    s: oy.some((x) => (x.ytot ?? 0) > x.year * 1.1) ? 'bad' : oy.length ? 'warn' : 'ok',
    d: oy.length
      ? oy
          .map(
            (x) =>
              `${x.name} 年累计 ${n(x.ytot)} 万m³，超年度许可 ${n(x.year)} 万m³（超 ${(
                ((x.ytot ?? 0) / x.year - 1) *
                100
              ).toFixed(1)}%）`
          )
          .join('；')
      : '各取水口年累计均未超年度许可水量'
  })
  const diff = DR_LAST_SUM - drSum.value
  its.push({
    t: '合计复核',
    s: Math.abs(diff) < 0.01 ? 'ok' : 'bad',
    d: `后台明细合计 ${n(drSum.value)} 万m³，上期日报载合计 ${DR_LAST_SUM} 万m³，相差 ${n(
      diff
    )} 万m³；本次编制以后台明细合计为准，并提请业务复核`
  })
  return its
}

/** 校核计数（原型 cnt） */
const chkCnt = computed(() => {
  const c = { ok: 0, warn: 0, bad: 0 }
  drChecks.value.forEach((x) => {
    c[x.s] += 1
  })
  return c
})

/** ① 后台读取与校核（原型 drLoad） */
function loadDaily() {
  if (drLoading.value) {
    return
  }
  drLoading.value = true
  window.setTimeout(() => {
    drChecks.value = buildDrChecks()
    drLoaded.value = true
    drLoading.value = false
    emit('notify', '后台数据读取与校核完成，取水基本情况已生成')
  }, 650)
}

/** 录入回填：选中取水口后带入已有记录（原型 drPrefill） */
function drPrefill() {
  const r = drMon.value.find((x) => x.name === drName.value)
  drStatus.value = r && MON_OPTIONS.includes(r.st) ? r.st : (MON_OPTIONS[0] ?? '')
  drProg.value = r ? r.prog : ''
  drNote.value = r ? r.note : ''
}

/** 录入生效：编制时读取当前取水口监控情况（原型 drSyncMon） */
function drSyncMon() {
  const nm = drName.value
  const st = drStatus.value
  const prog = drProg.value.trim() || '未完成整改'
  const note = drNote.value.trim()
  const base = DR_MON.find((x) => x.name === nm)
  const org = base ? base.org : '—'
  const r = drMon.value.find((x) => x.name === nm)
  if (r) {
    r.st = st
    r.prog = prog
    r.note = note
    r.org = org
  } else {
    drMon.value.unshift({ name: nm, org, st, prog, note })
  }
  drMon.value.sort(
    (a, b) =>
      DR_MON.findIndex((x) => x.name === a.name) - DR_MON.findIndex((x) => x.name === b.name)
  )
}

// 首次进入即回填首个取水口已有监控记录（对应原型 drPrefill 初始化）
drPrefill()

/* ==================== 二、通报 ==================== */

// 默认显示上一期：2025年第11期（总第83期）· 统计月份 2025-11 · 2025-12-06 发布
const blMonth = ref('2025-11')
const blNo = ref('2025年第11期（总第83期）')
const blDate = ref('2025-12-06')
const blHint = ref('读取校核与录入完成后，点击「⚡ 自动编制通报」生成版式预览')
const blLoading = ref(false)
const blLoaded = ref(false)
type BlTabKey = 'r1' | 'r2' | 'sec' | 'yc' | 'st'
const blTab = ref<BlTabKey>('r1')
const BL_TABS: [BlTabKey, string][] = [
  ['r1', '附表1-1（按河流）'],
  ['r2', '附表1-2（按省份）'],
  ['sec', '附表2（断面过流）'],
  ['yc', '附表3（岳城水库）'],
  ['st', '附表4（枢纽水闸）']
]
const blNews = ref<BlNews[]>(BL_NEWS0.map((x) => ({ ...x })))
const blBody = ref(BL_NEWS0[0]?.body ?? '')

/** ① 后台读取与校核（原型 blLoad）：生成附表 1-1 至附表 4 */
function loadBulletin() {
  if (blLoading.value) {
    return
  }
  blLoading.value = true
  window.setTimeout(() => {
    blLoaded.value = true
    blLoading.value = false
    emit('notify', '后台数据读取完成，附表 1-1 至附表 4 已生成，可页签切换查看')
  }, 650)
}

/** 工作动态与内容框同步（原型 blSyncBody） */
function blSyncBody() {
  const v = blBody.value.trim()
  if (!v || !blNews.value.length) {
    return
  }
  let t = v.split(/[。；;\n]/)[0]?.trim() ?? ''
  if (t.length > 30) {
    t = t.slice(0, 30)
  }
  blNews.value[0] = { title: t, body: v }
}

/** 附表4 小计 / 合计 */
function sumWq(rows: [string, number, number][]): string {
  return rows.reduce((s, r) => s + r[1], 0).toFixed(1)
}
function sumG(rows: [string, number, number][]): number {
  return rows.reduce((s, r) => s + r[2], 0)
}

/* ==================== 三、编制 / 预览 ==================== */

const prevVisible = ref(false)
const made = ref(false)

/** ⚡ 自动编制（原型 drRun / blRun） */
function makeReport() {
  if (isDaily.value) {
    if (!drLoaded.value) {
      emit('notify', '请先点击「自动读取数据」读取后台数据')
      return
    }
    drSyncMon()
    drHint.value = '编制中…'
    window.setTimeout(() => {
      drHint.value = `编制完成：取水基本情况 ${DR_DATA.length} 处 · 监控运行情况 ${drMon.value.length} 条，版式预览已弹出`
      made.value = true
      prevVisible.value = true
      emit('notify', '日报编制完成，可预览、下载或归档')
    }, 600)
    return
  }
  if (!blLoaded.value) {
    emit('notify', '请先点击「自动读取数据」读取后台数据')
    return
  }
  blSyncBody()
  const rCnt = BL_RIVER.reduce((s, x) => s + x.cnt, 0)
  blHint.value = '编制中…'
  window.setTimeout(() => {
    blHint.value = `编制完成：取水口 ${rCnt} 处 · 工作动态 ${blNews.value.length} 项，版式预览已弹出`
    made.value = true
    prevVisible.value = true
    emit('notify', '通报编制完成，可预览、下载或归档')
  }, 600)
}

/* ---------- 日报正文（原型 drText） ---------- */
function drText(): string {
  const L: string[] = []
  L.push(`漳卫南局重点取水口取水日报（${drDate.value} ${drNo.value}）`)
  L.push('水资源管理与保护处编制')
  L.push('')
  L.push('一、取水基本情况（单位：万m³）')
  L.push('序号\t取水口名称\t当日取水量\t月计划\t月累计\t年度许可\t年度累计\t监管单位')
  DR_DATA.forEach((x, i) => {
    L.push(
      [
        i + 1,
        x.name,
        x.day === null ? '未上报' : n(x.day),
        n(x.plan),
        x.mon === null ? '—' : n(x.mon),
        n(x.year),
        x.ytot === null ? '—' : n(x.ytot),
        x.org
      ].join('\t')
    )
  })
  L.push(`合计\t\t${n(drSum.value)}\t（按后台明细求和，上期载 ${DR_LAST_SUM}，差 6.66 待复核）`)
  L.push('')
  L.push('二、水资源监控运行情况')
  L.push('序号\t取水口名称\t计量、视频情况\t整改进展情况\t监管单位\t备注')
  drMon.value.forEach((x, i) => {
    L.push([i + 1, x.name, x.st, x.prog, x.org, x.note || ''].join('\t'))
  })
  return L.join('\r\n')
}

/* ---------- 通报正文（原型 blText） ---------- */
function blText(): string {
  const dp = blDate.value.split('-')
  const ds = `${dp[0]}年${parseInt(dp[1] ?? '1', 10)}月${parseInt(dp[2] ?? '1', 10)}日`
  const y = blMonth.value.slice(0, 4)
  const mo = parseInt(blMonth.value.slice(5, 7), 10)
  const rCnt = BL_RIVER.reduce((s, x) => s + x.cnt, 0)
  const rMon = BL_RIVER.reduce((s, x) => s + x.mon, 0)
  const rSum = BL_RIVER.reduce((s, x) => s + x.wq, 0)
  const pCnt = BL_PROV.reduce((s, x) => s + x.cnt, 0)
  const pMon = BL_PROV.reduce((s, x) => s + x.mon, 0)
  const pSum = BL_PROV.reduce((s, x) => s + x.wq, 0)
  const L: string[] = []
  L.push(`漳卫南运河水资源信息通报（${blNo.value}）`)
  L.push(`漳卫南运河管理局    ${ds}发布`)
  L.push('编辑：水资源管理与保护处')
  L.push('')
  L.push('一、基本情况')
  L.push(
    `本期通报${y}年${mo}月漳卫南运河水系取用水、重要断面过流及水库枢纽蓄水调度等情况（单位：万m³，流量单位 m³/s）。`
  )
  L.push('')
  L.push('二、取水管理')
  L.push('（一）按河流分类（不含漳岳水电站 3,480 万m³）')
  L.push('序号\t河流\t取水口(处)\t计量取水口(处)\t取水量(万m³)')
  BL_RIVER.forEach((x, i) => L.push([i + 1, x.name, x.cnt, x.mon, n(x.wq)].join('\t')))
  L.push(`合计\t\t${rCnt}\t${rMon}\t${n(rSum)}`)
  L.push('')
  L.push('（二）按省份分类')
  L.push('序号\t省份\t取水口(处)\t计量取水口(处)\t取水量(万m³)')
  BL_PROV.forEach((x, i) => L.push([i + 1, x.name, x.cnt, x.mon, n(x.wq)].join('\t')))
  L.push(`合计\t\t${pCnt}\t${pMon}\t${n(pSum)}`)
  L.push('')
  L.push('三、重要断面过流情况')
  L.push('序号\t断面\t所在河流\t月均流量(m³/s)\t月过水量(万m³)')
  BL_SEC.forEach((x, i) => L.push([i + 1, x.name, x.river, x.flow, n(x.wq)].join('\t')))
  L.push('')
  L.push('四、岳城水库蓄水供水和调度情况')
  L.push(
    `水位 ${BL_YC.level} m，库容 ${n(BL_YC.storage)} 万m³；月均入库流量 ${
      BL_YC.inFlow
    } m³/s，月入库水量 ${n(BL_YC.inWq)} 万m³；月供出水量 ${n(BL_YC.outWq)} 万m³。`
  )
  L.push('序号\t供水通道\t供水量(万m³)')
  BL_YC.channels.forEach((x, i) => L.push([i + 1, x.name, n(x.wq)].join('\t')))
  L.push(`合计\t\t${n(BL_YC.channels.reduce((s, x) => s + x.wq, 0))}`)
  L.push('')
  L.push('五、直管枢纽水闸蓄水和调度情况')
  L.push('枢纽水闸\t蓄水量(万m³)\t闸孔(座)')
  BL_GATE.forEach((x) => L.push([x.name, n(x.wq), x.g].join('\t')))
  L.push('')
  L.push('六、工作动态')
  blNews.value.forEach((x, i) => {
    L.push(`${i + 1}、${x.title}`)
    if (x.body) {
      L.push(`    ${x.body}`)
    }
  })
  return L.join('\r\n')
}

/** 下载版式文件（原型 drDl / blDl，TXT + BOM） */
function download() {
  if (!made.value) {
    emit('notify', `请先编制${title.value}`)
    return
  }
  const text = isDaily.value ? drText() : blText()
  const name = isDaily.value
    ? `${unitName.value}_${drDate.value}_${drNo.value}.txt`
    : `${unitName.value}_${blMonth.value}_${blNo.value}.txt`
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob(['\uFEFF' + text], { type: 'text/plain;charset=utf-8' }))
  a.download = name
  a.click()
  window.setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  emit('notify', `${title.value}已开始下载`)
}

/** 归档到知识库（原型 drArc / blArc） */
function archive() {
  if (!made.value) {
    emit('notify', `请先编制${title.value}`)
    return
  }
  const report = KB_DOCS.report || (KB_DOCS.report = [])
  if (isDaily.value) {
    const doc: KbDoc = {
      name: `漳卫南局重点取水口取水日报（${drDate.value} ${drNo.value}）`,
      fmt: 'TXT',
      size: '—',
      date: today(),
      type: 'report',
      sub: '重点取水口日报智能体 · 自动编制',
      info: `取水口 <b>${DR_DATA.length}</b> 处 · 当日合计 <b>${n(
        drSum.value
      )}</b> 万m³ · 监控运行情况 <b>${drMon.value.length}</b> 条`,
      desc: [
        '本日报由重点取水口日报智能体自动编制：后台读取取水计量数据并完成 5 项校核，汇入水资源监控运行情况录入，按固定版式生成。',
        '一、取水基本情况；二、水资源监控运行情况。'
      ],
      meta: [
        ['数据日期', drDate.value],
        ['期号', drNo.value || '—'],
        ['取水口', '13 处'],
        ['当日合计', `${n(drSum.value)} 万m³`],
        ['监控运行情况', `${drMon.value.length} 条`],
        ['编制单位', '水资源管理与保护处'],
        ['生成时间', today()]
      ]
    }
    report.unshift(doc)
  } else {
    const rCnt = BL_RIVER.reduce((s, x) => s + x.cnt, 0)
    const rSum = BL_RIVER.reduce((s, x) => s + x.wq, 0)
    const doc: KbDoc = {
      name: `漳卫南运河水资源信息通报（${blMonth.value} ${blNo.value}）`,
      fmt: 'TXT',
      size: '—',
      date: today(),
      type: 'report',
      sub: '水资源信息通报智能体 · 自动编制',
      info: `取水口 <b>${rCnt}</b> 处 · 取水量合计 <b>${n(rSum)}</b> 万m³ · 工作动态 <b>${
        blNews.value.length
      }</b> 项`,
      desc: [
        '本通报由水资源信息通报智能体自动编制：后台读取取水、断面过流、水库枢纽蓄水调度等数据并完成 5 项校核，汇入工作动态录入，按固定版式生成。',
        '一、基本情况；二、取水管理；三、重要断面过流；四、岳城水库；五、枢纽水闸；六、工作动态。'
      ],
      meta: [
        ['统计月份', blMonth.value],
        ['期号', blNo.value || '—'],
        ['取水口', `${rCnt} 处`],
        ['取水量合计', `${n(rSum)} 万m³`],
        ['工作动态', `${blNews.value.length} 项`],
        ['编制单位', '水资源管理与保护处'],
        ['生成时间', today()]
      ]
    }
    report.unshift(doc)
  }
  emit('notify', `${title.value}已归档到知识库 ·「水资源论证报告」，可检索预览`)
}

/** 重置本期编制状态（原型 drResetAll / blResetAll） */
function resetAll() {
  prevVisible.value = false
  made.value = false
  if (isDaily.value) {
    drLoaded.value = false
    drChecks.value = []
    drMon.value = DR_MON.map((x) => ({ ...x }))
    drName.value = drMon.value[0]?.name ?? ''
    drProg.value = ''
    drNote.value = ''
    drHint.value = '读取校核与录入完成后，点击「⚡ 自动编制日报」生成版式预览'
  } else {
    blLoaded.value = false
    blTab.value = 'r1'
    blNews.value = BL_NEWS0.map((x) => ({ ...x }))
    blBody.value = blNews.value[0]?.body ?? ''
    blHint.value = '读取校核与录入完成后，点击「⚡ 自动编制通报」生成版式预览'
  }
  emit('notify', '已重置')
}

/* ==================== 四、历史查询 ==================== */

const histVisible = ref(false)

/* 日报：年份页签 + 月份筛选 + 归档列表（原型 openDayQry / qryRender） */
const histYear = ref('2025')
const histMonth = ref('')
const HIST_YEARS = ['2022', '2023', '2024', '2025', '2026']
const histDailyAll = computed(() => RPT_DAY_ARCH[histYear.value] ?? [])
const histDailyItems = computed(() =>
  histDailyAll.value.filter((it) => !histMonth.value || it[0].slice(5, 7) === histMonth.value)
)

/** 下载归档日报（演示：按归档日期生成 TXT） */
function downloadArch(it: [string, number]) {
  const text =
    '\uFEFF' +
    [
      `漳卫南局重点取水口取水日报（${it[0]}）`,
      `（第${it[1]}期）`,
      '水资源管理与保护处编制',
      '',
      '一、取水基本情况（单位：万m³）',
      '序号\t取水口名称\t当日取水量\t月计划\t月累计\t年度许可\t年度累计\t监管单位',
      ...DR_DATA.map((x, i) =>
        [
          i + 1,
          x.name,
          x.day === null ? '未上报' : n(x.day),
          n(x.plan),
          x.mon === null ? '—' : n(x.mon),
          n(x.year),
          x.ytot === null ? '—' : n(x.ytot),
          x.org
        ].join('\t')
      ),
      '',
      '二、水资源监控运行情况',
      '序号\t取水口名称\t计量、视频情况\t整改进展情况\t监管单位\t备注',
      ...DR_MON.map((x, i) => [i + 1, x.name, x.st, x.prog, x.org, x.note].join('\t'))
    ].join('\r\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
  a.download = `漳卫南局重点取水口取水日报（${it[0]}）.doc`
  a.click()
  window.setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  emit('notify', `漳卫南局重点取水口取水日报（${it[0]}）.doc 已生成并下载`)
}

/* 通报：期号选择 + 正式印发版式预览（原型 openBlHist / monHistDocHtml） */
const histNo = ref('84')
const histDoc = computed(() => (histNo.value === '84' ? MON_HIST_84 : null))

function openHistory() {
  if (isDaily.value) {
    histYear.value = '2025'
    histMonth.value = ''
  } else {
    histNo.value = '84'
  }
  histVisible.value = true
}

// 打开日报 / 通报面板时自动读取后台数据（无需再点「自动读取数据」）
onMounted(() => {
  if (isDaily.value) {
    loadDaily()
  } else {
    loadBulletin()
  }
})
</script>

<template>
  <div class="report-panel">
    <template v-if="isDaily">
      <!-- 日报基础信息 -->
      <div class="ag-card">
        <div class="ag-card-hd">
          日报基础信息
          <span class="ag-hint">
            编制单位固定为「水资源管理与保护处」；进入默认显示上一期（第93期 · 2025-09-10），可修改
          </span>
          <span class="ag-hint">{{ drHint }}</span>
        </div>
        <div class="dr-row">
          <label class="ag-field">
            <span>日报日期</span>
            <input v-model="drDate" type="date" />
          </label>
          <label class="ag-field">
            <span>日报期号（默认显示上一期，可修改）</span>
            <input v-model="drNo" />
          </label>
          <button class="ag-btn dr-auto" type="button" :disabled="drLoading" @click="loadDaily">
            ⟳ 自动读取数据
          </button>
          <button class="ag-btn pri" type="button" @click="makeReport">⚡ 自动编制日报</button>
          <button class="ag-btn ghost" type="button" @click="openHistory">🕘 历史日报查询</button>
        </div>
      </div>

      <div class="ag-col-l daily">
        <!-- 一、取水基本情况 · 后台读取与校核 -->
        <div class="ag-card">
          <div class="ag-card-hd">
            一、取水基本情况 · 后台读取与校核
            <span class="ag-hint">对接 取用水管理 · 水量监控</span>
          </div>
          <div class="kres" :class="{ show: drLoaded || drLoading }">
            <span v-if="drLoading" class="kres-loading">
              ⟳ 正在连接后台取水计量数据库（取用水管理 · 水量监控）…
            </span>
            <template v-else-if="drLoaded">
              <div class="ag-note left">单位：万m³ · 取水量日期：{{ drPrevLabel }}（后台数据）</div>
              <div class="ag-tblwrap">
                <table class="agt">
                  <thead>
                    <tr>
                      <th>序号</th>
                      <th>取水口名称</th>
                      <th>{{ drPrevLabel }}取水量</th>
                      <th>{{ drMonthLabel }}计划</th>
                      <th>{{ drMonthLabel }}累计</th>
                      <th>年度许可</th>
                      <th>年度累计</th>
                      <th>监管单位</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(r, i) in DR_DATA" :key="r.name">
                      <td>{{ i + 1 }}</td>
                      <td>{{ r.name }}</td>
                      <td class="num">
                        <span v-if="r.day === null" class="miss">未上报</span>
                        <span v-else>{{ n(r.day) }}</span>
                      </td>
                      <td class="num">{{ n(r.plan) }}</td>
                      <td class="num">{{ r.mon === null ? '—' : n(r.mon) }}</td>
                      <td class="num">{{ n(r.year) }}</td>
                      <td class="num">{{ r.ytot === null ? '—' : n(r.ytot) }}</td>
                      <td>{{ r.org }}</td>
                    </tr>
                    <tr class="tot">
                      <td colspan="2"><b>合计</b></td>
                      <td class="num">
                        <b>{{ n(drSum) }}</b>
                      </td>
                      <td colspan="5" class="tot-note">
                        按后台明细求和（上期载 {{ DR_LAST_SUM }}，差 6.66 万m³ 待复核）
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <span class="kres-sum">
                校核完成：通过 {{ chkCnt.ok }} 项 · 需关注 {{ chkCnt.warn }} 项 · 需修正
                {{ chkCnt.bad }} 项（缺报与异常已在表中标注）
              </span>
            </template>
            <span v-else class="kres-loading">
              点击「⟳ 自动读取数据」后展示后台取水基本情况与校核结果
            </span>
          </div>
        </div>

        <!-- 二、水资源监控运行情况 · 录入 -->
        <div class="ag-card">
          <div class="ag-card-hd">二、水资源监控运行情况 · 录入</div>
          <div class="ag-field">
            <label>取水口（选中后自动带入已有记录与监管单位）</label>
            <select v-model="drName" @change="drPrefill">
              <option v-for="m in drMon" :key="m.name" :value="m.name">{{ m.name }}</option>
            </select>
          </div>
          <div class="ag-field">
            <label>计量、视频情况</label>
            <select v-model="drStatus">
              <option v-for="o in MON_OPTIONS" :key="o">{{ o }}</option>
            </select>
          </div>
          <div class="ag-field fgrow">
            <label>整改进展情况</label>
            <textarea
              v-model="drProg"
              rows="4"
              placeholder="如：未完成整改 / 8月29日××县水利局提交情况说明"
            />
          </div>
          <div class="ag-field fgrow">
            <label>备注</label>
            <textarea
              v-model="drNote"
              rows="4"
              placeholder="如：整改函要求、测流比对、承诺时限等"
            />
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <!-- 通报基础信息 -->
      <div class="ag-card">
        <div class="ag-card-hd">
          通报基础信息
          <span class="ag-hint">
            编制单位固定为「水资源管理与保护处」；进入默认显示上一期（2025年第11期 /
            总第83期），可修改
          </span>
          <span class="ag-hint">{{ blHint }}</span>
        </div>
        <div class="dr-row">
          <label class="ag-field">
            <span>统计月份</span>
            <input v-model="blMonth" type="month" />
          </label>
          <label class="ag-field">
            <span>通报期号（默认显示上一期，可修改）</span>
            <input v-model="blNo" />
          </label>
          <label class="ag-field">
            <span>发布日期</span>
            <input v-model="blDate" type="date" />
          </label>
          <button class="ag-btn dr-auto" type="button" :disabled="blLoading" @click="loadBulletin">
            ⟳ 自动读取数据
          </button>
          <button class="ag-btn pri" type="button" @click="makeReport">⚡ 自动编制通报</button>
          <button class="ag-btn ghost" type="button" @click="openHistory">🕘 历史通报查询</button>
        </div>
      </div>

      <div class="ag-col-l bulletin">
        <!-- 一、通报附表 · 后台读取与校核 -->
        <div class="ag-card">
          <div class="ag-card-hd">
            一、通报附表 · 后台读取与校核
            <span class="ag-hint">对接 取用水管理 · 水量监控 · 水工程调度</span>
          </div>
          <div class="ag-tabs">
            <div
              v-for="t in BL_TABS"
              :key="t[0]"
              class="ag-tab"
              :class="{ on: blTab === t[0] }"
              @click="blTab = t[0]"
            >
              {{ t[1] }}
            </div>
          </div>
          <div class="kres" :class="{ show: blLoaded || blLoading }">
            <span v-if="blLoading" class="kres-loading">
              ⟳ 正在连接后台数据（取用水管理 · 水量监控 · 水工程调度）…
            </span>
            <template v-else-if="blLoaded">
              <!-- 附表1-1 按河流 -->
              <template v-if="blTab === 'r1'">
                <div class="bl-tw">
                  <table class="agt">
                    <thead>
                      <tr>
                        <th>序号</th>
                        <th>所属河流</th>
                        <th>取水工程数量</th>
                        <th>当月取水的取水工程数量</th>
                        <th>当月取水量（万m³）</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(r, i) in MON_HIST_84.river" :key="r[0]">
                        <td>{{ i + 1 }}</td>
                        <td>{{ r[0] }}</td>
                        <td>{{ r[1] }}</td>
                        <td>{{ r[2] }}</td>
                        <td class="num">{{ n(Number(r[3])) }}</td>
                      </tr>
                      <tr class="tot">
                        <td colspan="2"><b>合计</b></td>
                        <td>
                          <b>{{ MON_HIST_84.riverSum[0] }}</b>
                        </td>
                        <td>
                          <b>{{ MON_HIST_84.riverSum[1] }}</b>
                        </td>
                        <td class="num">
                          <b>{{ MON_HIST_84.riverSum[2] }}</b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="ag-note left">{{ MON_HIST_84.riverNote }}</div>
              </template>

              <!-- 附表1-2 按省份 -->
              <template v-else-if="blTab === 'r2'">
                <div class="bl-tw">
                  <table class="agt">
                    <thead>
                      <tr>
                        <th>序号</th>
                        <th>所属省份</th>
                        <th>取水工程数量</th>
                        <th>当月取水的取水工程数量</th>
                        <th>当月取水量（万m³）</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(r, i) in MON_HIST_84.prov" :key="r[0]">
                        <td>{{ i + 1 }}</td>
                        <td>{{ r[0] }}</td>
                        <td>{{ r[1] }}</td>
                        <td>{{ r[2] }}</td>
                        <td class="num">{{ n(Number(r[3])) }}</td>
                      </tr>
                      <tr class="tot">
                        <td colspan="2"><b>合计</b></td>
                        <td>
                          <b>{{ MON_HIST_84.provSum[0] }}</b>
                        </td>
                        <td>
                          <b>{{ MON_HIST_84.provSum[1] }}</b>
                        </td>
                        <td class="num">
                          <b>{{ MON_HIST_84.provSum[2] }}</b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="ag-note left">
                  注：河北省取水量占比 71.9%，以岳城水库及以下漳河沿线为主。
                </div>
              </template>

              <!-- 附表2 断面过流 -->
              <template v-else-if="blTab === 'sec'">
                <div class="bl-tw">
                  <table class="agt">
                    <thead>
                      <tr>
                        <th>序号</th>
                        <th>站名</th>
                        <th>所在河流</th>
                        <th>断面地点</th>
                        <th>管理单位</th>
                        <th>月均流量（m³/s）</th>
                        <th>月总过水量（万m³）</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(r, i) in MON_HIST_84.sec" :key="r[0]">
                        <td>{{ i + 1 }}</td>
                        <td>{{ r[0] }}</td>
                        <td>{{ r[1] }}</td>
                        <td>{{ r[2] }}</td>
                        <td>{{ r[3] }}</td>
                        <td class="num">{{ n(Number(r[4])) }}</td>
                        <td class="num">{{ n(Number(r[5])) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="ag-note left">
                  注：卫运河临清站月总过水量最大（14115.17 万m³）；四女寺枢纽节制闸当月未过水。
                </div>
              </template>

              <!-- 附表3 岳城水库 -->
              <template v-else-if="blTab === 'yc'">
                <div class="bl-tw">
                  <table class="agt">
                    <thead>
                      <tr>
                        <th rowspan="2">水位<br />(m)</th>
                        <th rowspan="2">库容<br />(万m³)</th>
                        <th rowspan="2">月平均入库流量<br />(m³/s)</th>
                        <th rowspan="2">月入库水量<br />(万m³)</th>
                        <th colspan="6">月出库水量（万m³）</th>
                      </tr>
                      <tr>
                        <th>引岳济邯<br />管道</th>
                        <th>民有渠<br />（含工业用水）</th>
                        <th>引岳入安<br />管道</th>
                        <th>漳南渠</th>
                        <th>漳河河道</th>
                        <th>合计</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="num">{{ n(MON_HIST_84.yc.wl) }}</td>
                        <td class="num">{{ n(MON_HIST_84.yc.cap) }}</td>
                        <td class="num">{{ n(MON_HIST_84.yc.inflow) }}</td>
                        <td class="num">{{ n(MON_HIST_84.yc.inVol) }}</td>
                        <td v-for="(v, i) in MON_HIST_84.yc.out" :key="i" class="num">
                          {{ n(v) }}
                        </td>
                      </tr>
                      <tr>
                        <td>蓄水、供水<br />情况说明</td>
                        <td colspan="9" class="desc">{{ MON_HIST_84.yc.desc }}</td>
                      </tr>
                      <tr>
                        <td>调度情况</td>
                        <td colspan="9" class="desc">{{ MON_HIST_84.yc.disp }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="ag-note left">注：水位、库容为 2026 年 1 月 1 日 8 时数据。</div>
              </template>

              <!-- 附表4 枢纽水闸 -->
              <template v-else>
                <div class="bl-tw">
                  <table class="agt">
                    <thead>
                      <tr>
                        <th colspan="2">直管枢纽水闸名称</th>
                        <th>蓄水量（万m³）</th>
                        <th>调整次数</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td :rowspan="MON_HIST_84.hub.length" class="grp">枢纽</td>
                        <td>{{ MON_HIST_84.hub[0]?.[0] }}</td>
                        <td class="num">{{ n(MON_HIST_84.hub[0]?.[1]) }}</td>
                        <td class="num">{{ MON_HIST_84.hub[0]?.[2] }}</td>
                      </tr>
                      <tr v-for="r in MON_HIST_84.hub.slice(1)" :key="r[0]">
                        <td>{{ r[0] }}</td>
                        <td class="num">{{ n(r[1]) }}</td>
                        <td class="num">{{ r[2] }}</td>
                      </tr>
                      <tr class="tot">
                        <td></td>
                        <td>小计</td>
                        <td class="num">{{ sumWq(MON_HIST_84.hub) }}</td>
                        <td class="num">{{ sumG(MON_HIST_84.hub) }}</td>
                      </tr>
                      <tr>
                        <td :rowspan="MON_HIST_84.gate.length" class="grp">水闸</td>
                        <td>{{ MON_HIST_84.gate[0]?.[0] }}</td>
                        <td class="num">{{ n(MON_HIST_84.gate[0]?.[1]) }}</td>
                        <td class="num">{{ MON_HIST_84.gate[0]?.[2] }}</td>
                      </tr>
                      <tr v-for="r in MON_HIST_84.gate.slice(1)" :key="r[0]">
                        <td>{{ r[0] }}</td>
                        <td class="num">{{ n(r[1]) }}</td>
                        <td class="num">{{ r[2] }}</td>
                      </tr>
                      <tr class="tot">
                        <td></td>
                        <td>小计</td>
                        <td class="num">{{ sumWq(MON_HIST_84.gate) }}</td>
                        <td class="num">{{ sumG(MON_HIST_84.gate) }}</td>
                      </tr>
                      <tr class="tot">
                        <td colspan="2" class="tc">合计</td>
                        <td class="num">
                          {{
                            (
                              parseFloat(sumWq(MON_HIST_84.hub)) +
                              parseFloat(sumWq(MON_HIST_84.gate))
                            ).toFixed(1)
                          }}
                        </td>
                        <td class="num">{{ sumG(MON_HIST_84.hub) + sumG(MON_HIST_84.gate) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="ag-note left">
                  注：蓄水量为 2026 年 1 月 1 日 8 时数据；辛集挡潮蓄水闸蓄水最多（808.0 万m³）。
                </div>
              </template>
            </template>
            <span v-else class="kres-loading">
              点击「⟳ 自动读取数据」后生成附表 1-1 至附表 4，可页签切换查看
            </span>
          </div>
        </div>

        <!-- 二、工作动态录入 -->
        <div class="ag-card">
          <div class="ag-card-hd">二、工作动态录入（可编辑／新增）</div>
          <div class="ag-field fgrow">
            <label>内容</label>
            <textarea v-model="blBody" rows="4" placeholder="动态详情" />
          </div>
        </div>
      </div>
    </template>

    <!-- ============ 版式预览弹框 ============ -->
    <pro-modal
      v-model:show="prevVisible"
      :title="`${title}自动编制 · 版式预览`"
      table-theme="light"
      content-mode="scroll"
      default-padding="14px 18px"
      :style-params="{ width: '1000px', height: '760px' }"
    >
      <div class="dr-prev">
        <template v-if="isDaily">
          <div class="dr-head">
            <div class="t1">漳卫南局重点取水口取水日报</div>
            <div class="t2">（{{ drParsed.getFullYear() }}年{{ drNo }}）</div>
            <div class="t3">水资源管理与保护处编制&nbsp;&nbsp;&nbsp;&nbsp;{{ cnDate(drDate) }}</div>
          </div>

          <div class="dr-sec">一、取水基本情况</div>
          <div class="ag-note left">单位：万m³ · 取水量日期：{{ drPrevLabel }}（后台数据）</div>
          <div class="ag-tblwrap">
            <table class="agt">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>取水口名称</th>
                  <th>{{ drPrevLabel }}取水量</th>
                  <th>{{ drMonthLabel }}计划</th>
                  <th>{{ drMonthLabel }}累计</th>
                  <th>年度许可</th>
                  <th>年度累计</th>
                  <th>监管单位</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, i) in DR_DATA" :key="r.name">
                  <td>{{ i + 1 }}</td>
                  <td>{{ r.name }}</td>
                  <td class="num">
                    <span v-if="r.day === null" class="miss">未上报</span>
                    <span v-else>{{ n(r.day) }}</span>
                  </td>
                  <td class="num">{{ n(r.plan) }}</td>
                  <td class="num">{{ r.mon === null ? '—' : n(r.mon) }}</td>
                  <td class="num">{{ n(r.year) }}</td>
                  <td class="num">{{ r.ytot === null ? '—' : n(r.ytot) }}</td>
                  <td>{{ r.org }}</td>
                  <td></td>
                </tr>
                <tr class="tot">
                  <td colspan="2"><b>合计</b></td>
                  <td class="num">
                    <b>{{ n(drSum) }}</b>
                  </td>
                  <td colspan="6" class="tot-note">
                    按后台明细求和（上期载 {{ DR_LAST_SUM }}，差 6.66 万m³ 待复核）
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="dr-sec">二、水资源监控运行情况</div>
          <div class="ag-tblwrap">
            <table class="agt">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>取水口名称</th>
                  <th>计量、视频情况</th>
                  <th>整改进展情况</th>
                  <th>监管单位</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, i) in drMon" :key="r.name">
                  <td>{{ i + 1 }}</td>
                  <td>{{ r.name }}</td>
                  <td class="wrap">{{ r.st }}</td>
                  <td class="wrap">{{ r.prog }}</td>
                  <td>{{ r.org }}</td>
                  <td class="wrap">{{ r.note }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <template v-else>
          <div class="dr-head">
            <div class="t1">漳卫南运河水资源信息通报</div>
            <div class="t2">（{{ blNo }}）</div>
            <div class="t3">漳卫南运河管理局&nbsp;&nbsp;&nbsp;&nbsp;{{ cnDate(blDate) }}发布</div>
          </div>

          <div class="dr-sec">一、基本情况</div>
          <div class="ag-note left">
            本期通报 {{ blMonth.slice(0, 4) }} 年 {{ parseInt(blMonth.slice(5, 7), 10) }}
            月漳卫南运河水系取用水、重要断面过流及水库枢纽蓄水调度等情况（单位：万m³，流量单位
            m³/s）。
          </div>

          <div class="dr-sec">二、取水管理</div>
          <div class="ag-note left">（一）按河流分类（不含漳岳水电站 3,480 万m³）</div>
          <div class="ag-tblwrap">
            <table class="agt">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>河流</th>
                  <th>取水口（处）</th>
                  <th>计量取水口（处）</th>
                  <th>取水量</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, i) in BL_RIVER" :key="r.name">
                  <td>{{ i + 1 }}</td>
                  <td>{{ r.name }}</td>
                  <td class="num">{{ r.cnt }}</td>
                  <td class="num">{{ r.mon }}</td>
                  <td class="num">{{ n(r.wq) }}</td>
                </tr>
                <tr class="tot">
                  <td colspan="2"><b>合计</b></td>
                  <td class="num">
                    <b>{{ BL_RIVER.reduce((s, x) => s + x.cnt, 0) }}</b>
                  </td>
                  <td class="num">
                    <b>{{ BL_RIVER.reduce((s, x) => s + x.mon, 0) }}</b>
                  </td>
                  <td class="num">
                    <b>{{ n(BL_RIVER.reduce((s, x) => s + x.wq, 0)) }}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="ag-note left">（二）按省份分类</div>
          <div class="ag-tblwrap">
            <table class="agt">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>省份</th>
                  <th>取水口（处）</th>
                  <th>计量取水口（处）</th>
                  <th>取水量</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, i) in BL_PROV" :key="r.name">
                  <td>{{ i + 1 }}</td>
                  <td>{{ r.name }}</td>
                  <td class="num">{{ r.cnt }}</td>
                  <td class="num">{{ r.mon }}</td>
                  <td class="num">{{ n(r.wq) }}</td>
                </tr>
                <tr class="tot">
                  <td colspan="2"><b>合计</b></td>
                  <td class="num">
                    <b>{{ BL_PROV.reduce((s, x) => s + x.cnt, 0) }}</b>
                  </td>
                  <td class="num">
                    <b>{{ BL_PROV.reduce((s, x) => s + x.mon, 0) }}</b>
                  </td>
                  <td class="num">
                    <b>{{ n(BL_PROV.reduce((s, x) => s + x.wq, 0)) }}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="dr-sec">三、重要断面过流情况</div>
          <div class="ag-tblwrap">
            <table class="agt">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>断面</th>
                  <th>所在河流</th>
                  <th>月均流量</th>
                  <th>月过水量</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, i) in BL_SEC" :key="r.name">
                  <td>{{ i + 1 }}</td>
                  <td>{{ r.name }}</td>
                  <td>{{ r.river }}</td>
                  <td class="num">{{ n(r.flow) }}</td>
                  <td class="num">{{ n(r.wq) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="dr-sec">四、岳城水库蓄水供水和调度情况</div>
          <div class="ag-note left">
            水位 {{ BL_YC.level }} m，库容 {{ n(BL_YC.storage) }} 万m³；月均入库流量
            {{ BL_YC.inFlow }} m³/s，月入库水量 {{ n(BL_YC.inWq) }} 万m³；月供出水量
            {{ n(BL_YC.outWq) }} 万m³。
          </div>
          <div class="ag-tblwrap">
            <table class="agt">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>供水通道</th>
                  <th>供水量</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, i) in BL_YC.channels" :key="r.name">
                  <td>{{ i + 1 }}</td>
                  <td>{{ r.name }}</td>
                  <td class="num">{{ n(r.wq) }}</td>
                </tr>
                <tr class="tot">
                  <td colspan="2"><b>合计</b></td>
                  <td class="num">
                    <b>{{ n(BL_YC.channels.reduce((s, x) => s + x.wq, 0)) }}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="dr-sec">五、直管枢纽水闸蓄水和调度情况</div>
          <div class="ag-tblwrap">
            <table class="agt">
              <thead>
                <tr>
                  <th>枢纽水闸</th>
                  <th>蓄水量</th>
                  <th>闸孔（座）</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="r in BL_GATE"
                  :key="`${r.name}-${r.grp}`"
                  :class="{ sub: r.sub, tot: r.total }"
                >
                  <td>{{ r.name }}</td>
                  <td class="num">{{ n(r.wq) }}</td>
                  <td class="num">{{ r.g }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="dr-sec">六、工作动态</div>
          <div class="ag-tblwrap">
            <table class="agt">
              <tbody>
                <template v-for="(r, i) in blNews" :key="r.title">
                  <tr>
                    <td>{{ i + 1 }}</td>
                    <td class="t">{{ r.title }}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td class="b">{{ r.body }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <div class="ag-note left">编辑：水资源管理与保护处</div>
        </template>
      </div>

      <template #action>
        <div class="lcm-foot">
          <button class="lcm-btn primary" type="button" @click="download">生成{{ title }}</button>
          <button class="lcm-btn" type="button" @click="archive">归档到知识库</button>
          <button class="lcm-btn" type="button" @click="resetAll">重 置</button>
        </div>
      </template>
    </pro-modal>

    <!-- ============ 历史查询弹框 ============ -->
    <pro-modal
      v-model:show="histVisible"
      :title="isDaily ? '日报查询' : '历史通报查询'"
      table-theme="light"
      :content-mode="isDaily ? 'fill' : 'scroll'"
      default-padding="14px 26px 6px"
      :style-params="isDaily ? { width: '680px' } : { width: '1000px', height: '760px' }"
    >
      <!-- 日报：年份页签 + 月份筛选 + 归档列表 -->
      <template v-if="isDaily">
        <div class="qry-tabs">
          <div
            v-for="y in HIST_YEARS"
            :key="y"
            class="qry-tab"
            :class="{ on: histYear === y }"
            @click="histYear = y"
          >
            {{ y }}年
          </div>
        </div>
        <div class="qry-filter">
          <span>筛选条件</span>
          <select v-model="histMonth">
            <option value="">全部月份</option>
            <option v-for="m in 12" :key="m" :value="String(m).padStart(2, '0')">{{ m }}月</option>
          </select>
          <span class="cnt">
            共 {{ histDailyItems.length }} 份 / 归档 {{ histDailyAll.length }} 份
          </span>
        </div>
        <div class="qry-list">
          <div v-if="!histDailyItems.length" class="qry-empty">该筛选条件下暂无归档日报</div>
          <div v-for="(it, i) in histDailyItems" :key="it[0]" class="qry-item">
            <span class="no">{{ i + 1 }}.</span>
            <span class="nm">漳卫南局重点取水口取水日报（{{ it[0] }}）.doc</span>
            <button class="dl" type="button" @click="downloadArch(it)">下载</button>
          </div>
        </div>
      </template>

      <!-- 通报：期号选择 + 正式印发版式预览 -->
      <template v-else>
        <div class="hist-sel">
          <label>选择期号：</label>
          <select v-model="histNo">
            <option value="84">2025年第12期（总第84期）· 2026年1月6日</option>
            <option value="83">2025年第11期（总第83期）· 2025年12月6日</option>
          </select>
          <span class="hist-tip">版式同正式印发文档；其余期次将随数字化进度陆续收录</span>
        </div>
        <div class="hist-doc">
          <template v-if="histDoc">
            <div class="doc-title">漳卫南运河水资源信息通报</div>
            <div class="doc-sub">（{{ histDoc.no }}）</div>
            <div class="doc-by">
              <span>{{ histDoc.org }}</span>
              <span>{{ histDoc.date }}</span>
            </div>
            <div class="doc-h">一、基本情况</div>
            <p class="doc-p">{{ histDoc.s1 }}</p>
            <div class="doc-h">二、取水管理</div>
            <p class="doc-p">{{ histDoc.s2 }}</p>
            <div class="doc-h">三、重要断面过流</div>
            <p class="doc-p">{{ histDoc.s3 }}</p>
            <div class="doc-h">四、岳城水库、枢纽水闸蓄水和调度</div>
            <p class="doc-p">{{ histDoc.s4a }}</p>
            <p class="doc-p">{{ histDoc.s4b }}</p>
            <p class="doc-p">{{ histDoc.s4c }}</p>
            <div class="doc-h">五、工作动态</div>
            <p class="doc-p">（一）{{ histDoc.s5t1 }}。{{ histDoc.s5d1 }}</p>
            <p class="doc-p">（二）{{ histDoc.s5t2 }}。{{ histDoc.s5d2 }}</p>
            <p class="doc-p">（三）{{ histDoc.s5t3 }}。{{ histDoc.s5d3 }}</p>

            <div class="doc-pt">附表 1-1 漳卫南局管辖范围取水情况统计表（按河流分类）</div>
            <div class="doc-pd">2025年12月</div>
            <table class="doc-tbl">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>所属河流</th>
                  <th>取水工程<br />数量</th>
                  <th>当月取水的<br />取水工程数量</th>
                  <th>当月取水量<br />（万m³）</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, i) in histDoc.river" :key="r[0]">
                  <td>{{ i + 1 }}</td>
                  <td class="lt">{{ r[0] }}</td>
                  <td>{{ r[1] }}</td>
                  <td>{{ r[2] }}</td>
                  <td class="m">{{ n(Number(r[3])) }}</td>
                </tr>
                <tr class="tot">
                  <td></td>
                  <td>合计</td>
                  <td>{{ histDoc.riverSum[0] }}</td>
                  <td>{{ histDoc.riverSum[1] }}</td>
                  <td class="m">{{ n(Number(histDoc.riverSum[2])) }}</td>
                </tr>
              </tbody>
            </table>
            <div class="doc-note">{{ histDoc.riverNote }}</div>

            <div class="doc-pt">附表 1-2 漳卫南局管辖范围取水情况统计表（按省份分类）</div>
            <div class="doc-pd">2025年12月</div>
            <table class="doc-tbl">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>所属省份</th>
                  <th>取水工程<br />数量</th>
                  <th>当月取水的<br />取水工程数量</th>
                  <th>当月取水量<br />（万m³）</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, i) in histDoc.prov" :key="r[0]">
                  <td>{{ i + 1 }}</td>
                  <td class="lt">{{ r[0] }}</td>
                  <td>{{ r[1] }}</td>
                  <td>{{ r[2] }}</td>
                  <td class="m">{{ n(Number(r[3])) }}</td>
                </tr>
                <tr class="tot">
                  <td></td>
                  <td>合计</td>
                  <td>{{ histDoc.provSum[0] }}</td>
                  <td>{{ histDoc.provSum[1] }}</td>
                  <td class="m">{{ n(Number(histDoc.provSum[2])) }}</td>
                </tr>
              </tbody>
            </table>

            <div class="doc-pt">附表 2 漳卫南运河重要控制断面过流情况统计表</div>
            <div class="doc-pd">2025年12月</div>
            <table class="doc-tbl">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>站名</th>
                  <th>所在河流</th>
                  <th>断面地点</th>
                  <th>管理单位</th>
                  <th>月均流量<br />（m³/s）</th>
                  <th>月总过水量<br />（万m³）</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, i) in histDoc.sec" :key="r[0]">
                  <td>{{ i + 1 }}</td>
                  <td class="lt">{{ r[0] }}</td>
                  <td class="lt">{{ r[1] }}</td>
                  <td class="lt">{{ r[2] }}</td>
                  <td class="lt">{{ r[3] }}</td>
                  <td class="m">{{ n(Number(r[4])) }}</td>
                  <td class="m">{{ n(Number(r[5])) }}</td>
                </tr>
              </tbody>
            </table>

            <div class="doc-pt">附表 3 岳城水库蓄水、供水和调度情况统计表</div>
            <div class="doc-pd">2025年12月</div>
            <table class="doc-tbl">
              <thead>
                <tr>
                  <th rowspan="2">水位<br />（m）</th>
                  <th rowspan="2">库容<br />（万m³）</th>
                  <th rowspan="2">月平均<br />入库流量<br />（m³/s）</th>
                  <th rowspan="2">月入库水量<br />（万m³）</th>
                  <th colspan="6">月出库水量（万m³）</th>
                </tr>
                <tr>
                  <th>引岳济邯<br />管道</th>
                  <th>民有渠<br />（含工业用水）</th>
                  <th>引岳入安<br />管道</th>
                  <th>漳南渠</th>
                  <th>漳河河道</th>
                  <th>合计</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="m">{{ n(histDoc.yc.wl) }}</td>
                  <td class="m">{{ n(histDoc.yc.cap) }}</td>
                  <td class="m">{{ n(histDoc.yc.inflow) }}</td>
                  <td class="m">{{ n(histDoc.yc.inVol) }}</td>
                  <td v-for="(v, i) in histDoc.yc.out" :key="i" class="m">{{ n(v) }}</td>
                </tr>
                <tr>
                  <td>蓄水、供水<br />情况说明</td>
                  <td colspan="9" class="lt ptext">{{ histDoc.yc.desc }}</td>
                </tr>
                <tr>
                  <td>调度情况</td>
                  <td colspan="9" class="lt ptext">{{ histDoc.yc.disp }}</td>
                </tr>
              </tbody>
            </table>
            <div class="doc-note">注：水位、库容为 2026 年 1 月 1 日 8 时数据</div>

            <div class="doc-pt">附表 4 直管枢纽水闸蓄水和调度情况统计表</div>
            <div class="doc-pd">2025年12月</div>
            <table class="doc-tbl doc-tbl-gate">
              <thead>
                <tr>
                  <th colspan="2">直管枢纽水闸名称</th>
                  <th>蓄水量（万m³）</th>
                  <th>调整次数</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td :rowspan="histDoc.hub.length" class="grp">枢纽</td>
                  <td class="lt">{{ histDoc.hub[0]?.[0] }}</td>
                  <td class="m">{{ n(histDoc.hub[0]?.[1]) }}</td>
                  <td>{{ histDoc.hub[0]?.[2] }}</td>
                </tr>
                <tr v-for="r in histDoc.hub.slice(1)" :key="r[0]">
                  <td class="lt">{{ r[0] }}</td>
                  <td class="m">{{ n(r[1]) }}</td>
                  <td>{{ r[2] }}</td>
                </tr>
                <tr class="tot">
                  <td></td>
                  <td>小计</td>
                  <td class="m">{{ sumWq(histDoc.hub) }}</td>
                  <td>{{ sumG(histDoc.hub) }}</td>
                </tr>
                <tr>
                  <td :rowspan="histDoc.gate.length" class="grp">水闸</td>
                  <td class="lt">{{ histDoc.gate[0]?.[0] }}</td>
                  <td class="m">{{ n(histDoc.gate[0]?.[1]) }}</td>
                  <td>{{ histDoc.gate[0]?.[2] }}</td>
                </tr>
                <tr v-for="r in histDoc.gate.slice(1)" :key="r[0]">
                  <td class="lt">{{ r[0] }}</td>
                  <td class="m">{{ n(r[1]) }}</td>
                  <td>{{ r[2] }}</td>
                </tr>
                <tr class="tot">
                  <td></td>
                  <td>小计</td>
                  <td class="m">{{ sumWq(histDoc.gate) }}</td>
                  <td>{{ sumG(histDoc.gate) }}</td>
                </tr>
                <tr class="tot">
                  <td colspan="2" class="tc">合计</td>
                  <td class="m">
                    {{
                      (parseFloat(sumWq(histDoc.hub)) + parseFloat(sumWq(histDoc.gate))).toFixed(1)
                    }}
                  </td>
                  <td>{{ sumG(histDoc.hub) + sumG(histDoc.gate) }}</td>
                </tr>
              </tbody>
            </table>
            <div class="doc-note">注：蓄水量为 2026 年 1 月 1 日 8 时数据</div>

            <div class="doc-foot">{{ histDoc.editor }}</div>
            <div class="doc-foot">{{ histDoc.sendto }}</div>
            <div class="doc-foot right">共印 30 份</div>
          </template>
          <div v-else class="hist-empty">该期通报电子版暂未收录，可到档案室查阅纸质件。</div>
        </div>
      </template>
      <template #action>
        <div class="lcm-foot">
          <button class="lcm-btn" type="button" @click="histVisible = false">关 闭</button>
        </div>
      </template>
    </pro-modal>
  </div>
</template>

<style scoped lang="scss">
.report-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  padding-right: 2px;
  overflow-y: auto;
}

/* ===== 卡片（原型 .ag-card） ===== */
.ag-card {
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  padding: 12px 14px;
  background: #fff;
  border: 1px solid #d5e4f5;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(30, 90, 170, 0.07);
  overflow: auto;
}
.ag-card-hd {
  display: flex;
  flex: none;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  padding-bottom: 8px;
  font-size: 14.5px;
  font-weight: 700;
  color: #1f4f86;
  border-bottom: 1px solid #e8f0f9;

  .ag-hint {
    margin-left: auto;
    font-size: 12.5px;
    font-weight: 400;
    color: #8aa3c4;
  }
}
.ag-col-l {
  display: grid;
  flex: 1;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
  gap: 12px;
  min-height: 0;

  &.bulletin {
    grid-template-columns: minmax(0, 2.4fr) minmax(0, 1fr);
  }
}

/* ===== 基础信息行 ===== */
.dr-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: flex-end;
}
.ag-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;

  label,
  > span {
    font-size: 13px;
    color: #5a7ba6;
  }
  input,
  select,
  textarea {
    box-sizing: border-box;
    width: 100%;
    padding: 0 9px;
    font-family: inherit;
    font-size: 13.5px;
    color: #24466f;
    background: #fff;
    border: 1px solid #bcd7f7;
    border-radius: 4px;
    outline: none;

    &:focus {
      box-shadow: 0 0 0 2px rgba(63, 151, 242, 0.18);
    }
  }
  input,
  select {
    height: 34px;
  }
  textarea {
    min-height: 88px;
    padding: 7px 9px;
    line-height: 1.55;
    resize: vertical;
  }
  &.fgrow {
    flex: 1 1 auto;
  }
}
.dr-row .ag-field {
  flex: 0 0 240px;
}

/* ===== 按钮（原型 .ag-btn） ===== */
.ag-btn {
  flex: none;
  height: 34px;
  padding: 0 18px;
  font-family: inherit;
  font-size: 13.5px;
  color: #fff;
  white-space: nowrap;
  cursor: pointer;
  background: linear-gradient(180deg, #3f97f2, #1f6fd6);
  border: none;
  border-radius: 5px;

  &:hover {
    filter: brightness(1.07);
  }
  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
  &.pri {
    padding: 0 16px;
    font-size: 13px;
    font-weight: 600;
  }
  &.ghost {
    padding: 0 14px;
    font-size: 13px;
    color: #1f7ae0;
    background: #fff;
    border: 1px solid #9cc3ef;
  }
  &.dr-auto {
    align-self: flex-end;
  }
}

/* ===== 校核区（原型 .kres / .kres.show） ===== */
.kres {
  display: none;
  gap: 3px;
  font-size: 12.5px;
  line-height: 1.6;

  &.show {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: calc(100% - 42px);
  }
}
.kres-loading {
  font-size: 12.5px;
  color: #8aa3c4;
  line-height: 1.7;
}
.kres-sum {
  flex: none;
  font-weight: 700;
  color: #1f7ae0;
}
.ag-note {
  font-size: 12px;
  color: #8aa3c4;
  line-height: 1.7;

  &.left {
    text-align: left;
  }
}

/* ===== 提示 ===== */
.bl-tw {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
}

/* ===== 表格（原型 .agt） ===== */
.ag-tblwrap {
  max-height: none;
  margin-bottom: 6px;
  overflow: auto;
  border: 1px solid #dbe7f6;
  border-radius: 6px;
}
table.agt {
  width: 100%;
  font-size: 13.5px;
  border-spacing: 0;
  border-collapse: separate;
}

.agt th {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 9px 11px;
  font-size: 13px;
  font-weight: 600;
  color: #20517e;
  text-align: left;
  white-space: nowrap;
  background: #e2eefb;
  border-bottom: 1px solid #cfe0f3;
}
.agt td {
  padding: 9px 11px;
  color: #2a3f5c;
  white-space: nowrap;
  border-bottom: 1px solid #eef3fa;
}
.agt tbody tr:last-child td {
  border-bottom: none;
}
.agt tbody tr:hover td {
  background: #f6fbff;
}
.agt .num {
  font-weight: 700;
  color: #1a4f86;
  font-variant-numeric: tabular-nums;
}
.agt tr.tot td {
  font-weight: 700;
  color: #123c6b;
  background: #eaf2fc;
  border-top: 1px solid #cfe0f3;
}
.agt tr.sub td {
  font-weight: 600;
  color: #2a5c94;
  background: #f4f8fd;
}
.agt td.t {
  font-weight: 600;
  color: #1a3f6b;
  vertical-align: top;
}
.agt td.b {
  color: #4f6f96;
  white-space: normal;
  padding-top: 0;
}
.agt td.wrap,
.agt td.desc {
  white-space: normal;
}
.agt td.grp {
  font-weight: 600;
  text-align: center;
}
.agt td.tc {
  text-align: center;
}
.agt .miss {
  color: #c07a00;
}
.agt .tot-note {
  font-size: 12.5px;
  font-weight: 400;
  color: #8aa3c4;
}

/* 通报附表：正式印发版式（全边框、居中、紧凑） */
.ag-col-l.bulletin .bl-tw .agt {
  height: auto;
  border-collapse: collapse;

  th,
  td {
    padding: 7px 8px;
    text-align: center;
    vertical-align: middle;
    border: 1px solid #b9d2ec;
  }
  td.num {
    font-weight: 400;
  }
  tr.tot td {
    font-weight: 700;
  }
  td.desc {
    line-height: 1.8;
    text-indent: 2em;
    text-align: left;
  }
}

/* ===== 页签（原型 .ag-tabs / .ag-tab） ===== */
.ag-tabs {
  display: flex;
  flex: none;
  gap: 3px;
  padding: 3px;
  background: #eef4fb;
  border: 1px solid #c9dcf2;
  border-radius: 6px;
}
.ag-tab {
  padding: 7px 16px;
  font-size: 13px;
  color: #41577a;
  white-space: nowrap;
  cursor: pointer;
  border-radius: 4px;
  user-select: none;

  &:hover {
    color: #1f7ae0;
  }
  &.on {
    font-weight: 600;
    color: #fff;
    background: linear-gradient(180deg, #3f97f2, #1f6fd6);
  }
}

/* ===== 版式预览（原型 .dr-prev / .dr-head / .dr-sec） ===== */
.dr-prev {
  min-height: 0;
  overflow-y: auto;
  white-space: normal;

  .ag-tblwrap {
    max-height: none;
    margin-bottom: 6px;
  }
}
.dr-head {
  padding: 4px 0 2px;
  text-align: center;

  .t1 {
    font-size: 17px;
    font-weight: 800;
    color: #123c6b;
    letter-spacing: 2px;
  }
  .t2 {
    margin-top: 3px;
    font-size: 14px;
    color: #2a5c94;
  }
  .t3 {
    margin-top: 3px;
    font-size: 12.5px;
    color: #5a7ba6;
  }
}
.dr-sec {
  margin: 10px 0 4px;
  font-size: 14px;
  font-weight: 700;
  color: #1a3f6b;
  text-align: left;
}

/* ===== 弹框底部按钮 ===== */
.lcm-foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 8px 4px 4px;
}
.lcm-btn {
  height: 32px;
  padding: 0 18px;
  font-family: inherit;
  font-size: 13px;
  color: #1f7ae0;
  cursor: pointer;
  background: #f2f8ff;
  border: 1px solid #9cc3ef;
  border-radius: 4px;

  &:hover {
    color: #fff;
    background: #1f7ae0;
  }
  &.primary {
    color: #fff;
    background: linear-gradient(180deg, #4fa0f4, #1f6fd6);
    border-color: #1f6fd6;
    &:hover {
      filter: brightness(1.07);
    }
  }
}

/* ===== 历史查询（原型 qry-tabs / qry-list） ===== */
.qry-tabs {
  display: flex;
  gap: 28px;
  margin-top: 4px;
  border-bottom: 1px solid #e3edf9;
}
.qry-tab {
  position: relative;
  padding: 4px 2px 10px;
  font-size: 14.5px;
  color: #5a7ba6;
  cursor: pointer;
  user-select: none;

  &:hover {
    color: #1f7ae0;
  }
  &.on {
    font-weight: 600;
    color: #1f7ae0;

    &::after {
      position: absolute;
      right: 0;
      bottom: -1px;
      left: 0;
      height: 2px;
      content: '';
      background: linear-gradient(90deg, #3f97f2, #1f6fd6);
    }
  }
}
.qry-filter {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px 0 4px;
  font-size: 13px;
  color: #5a7ba6;

  select {
    height: 30px;
    padding: 0 8px;
    font-family: inherit;
    font-size: 13px;
    color: #24466f;
    background: #fff;
    border: 1px solid #bcd7f7;
    border-radius: 4px;
  }
  .cnt {
    margin-left: auto;
    color: #8aa3c4;
  }
}
.qry-list {
  max-height: 320px;
  overflow-y: auto;
}
.qry-item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px 10px;
  font-size: 13px;
  color: #2a3f5c;
  border-bottom: 1px dashed #e8f0f9;

  &:hover {
    background: #f7fbff;
  }
  .no {
    flex: none;
    width: 22px;
    color: #8aa3c4;
    text-align: right;
  }
  .nm {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dl {
    flex: none;
    padding: 0;
    font-family: inherit;
    font-size: 13px;
    color: #1f7ae0;
    cursor: pointer;
    background: none;
    border: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
.qry-empty {
  padding: 34px 0;
  font-size: 13.5px;
  color: #8aa3c4;
  text-align: center;
}

/* ===== 历史通报正式版式 ===== */
.hist-sel {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 4px 0 8px;
  font-size: 13px;
  color: #5a7ba6;

  select {
    height: 30px;
    padding: 0 8px;
    font-family: inherit;
    font-size: 13px;
    color: #24466f;
    background: #fff;
    border: 1px solid #bcd7f7;
    border-radius: 4px;
  }
  .hist-tip {
    font-size: 12px;
    color: #8aa3c4;
  }
}
.hist-doc {
  min-height: 320px;
  padding: 20px 28px;
  font-family: SimSun, serif;
  color: #1e1e1e;
  background: #fff;
  border: 1px solid #dbe7f5;
  border-radius: 6px;

  .doc-title {
    margin-bottom: 4px;
    font-family: 'FZXiaoBiaoSong-B05S', SimSun, serif;
    font-size: 24px;
    font-weight: 700;
    text-align: center;
  }
  .doc-sub {
    margin-bottom: 4px;
    font-family: KaiTi, serif;
    font-size: 15px;
    text-align: center;
  }
  .doc-by {
    display: flex;
    justify-content: space-between;
    padding-bottom: 8px;
    margin-bottom: 10px;
    font-family: KaiTi, serif;
    font-size: 13px;
    border-bottom: 2px solid #000;
  }
  .doc-h {
    margin: 14px 0 2px;
    font-family: SimHei, sans-serif;
    font-size: 15px;
    font-weight: 700;
  }
  .doc-p {
    margin: 4px 0;
    font-size: 13px;
    line-height: 1.9;
    text-indent: 2em;
  }
  /* 附表标题（原型 .pt / .pd） */
  .doc-pt {
    margin: 14px 0 2px;
    font-family: SimHei, sans-serif;
    font-size: 13.5px;
    font-weight: 700;
    text-align: center;
  }
  .doc-pd {
    margin-bottom: 4px;
    font-family: KaiTi, serif;
    font-size: 12px;
    text-align: center;
  }
  .doc-tbl {
    width: 100%;
    margin: 2px 0 4px;
    font-family: SimSun, serif;
    font-size: 12px;
    border-collapse: collapse;

    th,
    td {
      padding: 3px 5px;
      text-align: center;
      vertical-align: middle;
      border: 1px solid #000;
    }
    th {
      font-weight: 400;
      white-space: nowrap;
    }
    td.lt {
      text-align: left;
    }
    td.m {
      font-variant-numeric: tabular-nums;
      text-align: right;
    }
    td.grp {
      font-weight: 700;
    }
    td.tc {
      text-align: center;
    }
    td.ptext {
      line-height: 1.8;
      text-indent: 2em;
    }
    tr.tot td {
      font-weight: 700;
    }
  }
  /* 附表4 与正式文件一致：表宽收窄居中 */
  .doc-tbl-gate {
    max-width: 720px;
    margin: 2px auto 4px;
  }
  .doc-note {
    margin: 2px 0 6px;
    font-size: 12px;
  }
  .doc-foot {
    margin-top: 6px;
    font-size: 12px;
    line-height: 1.9;
  }
  .doc-foot.right {
    text-align: right;
  }
}
.hist-empty {
  padding: 90px 0;
  font-size: 14px;
  color: #5a7ba6;
  text-align: center;
}
</style>
