// ============================================================
// 智能问答 · 通用问答引擎
// 复刻原型 cgAnswer / cgAQuota / cgALic / cgARiver / cgAIrrig / cgAWtotal ...
// 输出结构化答案（标题 / KPI / 段落 / 列表 / 表格 / 出处 / 行动按钮）
// ============================================================
import { KB_DOCS, KB_IRRIG_DATA, KB_RIVER_DATA, LIC_CERTS, QA_CHIPS, QUOTA_STD } from '../data'
import type { AgentKbRef } from '@/api/agent/agentChat'
import type { AgentUiEvent } from '@/api/agent/agentUiCapability'
import type { AnsDetail } from '@/agent/answerDetails'

export interface AnsKpi {
  k: string
  v: string
}
export interface AnsTable {
  head: string[]
  rows: string[][]
  num?: number[]
}
export interface AnsAction {
  label: string
  act: string
  /** 后端智能问答返回的跳转路由（有值时优先按路由跳转，见 QA/index.vue） */
  routePath?: string
  /** 跳转携带的 query 参数 */
  query?: Record<string, string | number>
  /** 按钮所需功能权限 URL，与登录返回的 myPermission 求交集后决定是否展示 */
  requiredActUrl?: string
  /** 后端返回的 UI 引导事件（DIALOG/SPOTLIGHT/COMMAND），点击时交给事件总线执行 */
  event?: AgentUiEvent
}
export interface Answer {
  title: string
  kpis?: AnsKpi[]
  p?: string[]
  list?: string[]
  table?: AnsTable
  /** 后端下发的结构化明细块（表格 / 要点），归一化后可直接渲染 */
  details?: AnsDetail[]
  source?: string
  acts?: AnsAction[]
  /** 行内引用的事件：正文里的 [[n]] 按 cite 编号对应到这里的条目 */
  refs?: AgentUiEvent[]
  /** 知识库文档引用：编号 ≥ 11，点击角标打开原文并按章节定位 */
  kbRefs?: AgentKbRef[]
  /**
   * done 帧的完整原始正文（未剥离 Markdown 表格），只供来源清单 / 角标编号统计。
   * 表格单元格里也可能带 [[n]]，用剥离后的 p 统计会丢引用。
   */
  citeText?: string
}

/* ---------------- 工具 ---------------- */

// 数字千分位（保留两位小数）
function num(v: number | string): string {
  return (Math.round((+v || 0) * 100) / 100).toLocaleString()
}

// 汇总
function sum<T>(list: T[], f: (x: T) => number | string): number {
  return list.reduce((s, x) => s + (+f(x) || 0), 0)
}

// 行政区识别（县 → 市 → 省）
function findArea(s: string): { prov: string; city: string; county: string } | null {
  const hit = LIC_CERTS.filter((c) => s.includes(c.county)).sort(
    (a, b) => b.county.length - a.county.length
  )[0]
  if (hit) {
    return { prov: hit.prov, city: hit.area, county: hit.county }
  }
  const city = [...new Set(LIC_CERTS.map((c) => c.area))]
    .filter((c) => s.includes(c.replace(/市$/, '')))
    .sort((a, b) => b.length - a.length)[0]
  if (city) {
    const p = LIC_CERTS.find((c) => c.area === city)
    return { prov: p?.prov ?? '', city, county: '' }
  }
  const prov = ['河北省', '河南省', '山东省'].find((p) => s.includes(p.slice(0, 2)))
  return prov ? { prov, city: '', county: '' } : null
}

/* ---------------- ① 用水定额 ---------------- */

function aQuota(s: string): Answer {
  const prov = ['河北省', '河南省', '山东省'].find((p) => s.includes(p.slice(0, 2)))
  const use = /灌溉|农业|亩|渠|灌区/.test(s)
    ? 'ag'
    : /工业|万元|产值/.test(s)
      ? 'ind'
      : /生活|城镇|人口/.test(s)
        ? 'life'
        : ''
  const std = prov ? QUOTA_STD.find((q) => q.nm.startsWith(prov)) : undefined
  if (std && use) {
    const label = { ag: '农业灌溉', ind: '工业用水', life: '城镇生活' }[use]
    return {
      title: `${prov} · ${label}用水定额`,
      p: [
        `现行定额值：${std[use]}`,
        `标准依据：${std.nm}`,
        '应用提示：取水许可审批与水资源论证审查中，以该定额核算项目单位用水量是否达标；实际单位用水量高于定额的，需补充说明节水措施与整改方案。'
      ],
      source: '出处：用水定额标准库（河北 / 河南 / 山东省地方标准 DB13、DB41、DB37 系列）',
      acts: [
        { label: '用论证智能体做定额对标', act: 'tab:argue' },
        { label: '查许可证实际用水', act: 'tab:query' }
      ]
    }
  }
  if (std) {
    return {
      title: `${prov}用水定额`,
      p: [`标准依据：${std.nm}`],
      table: {
        head: ['用水类别', '定额值'],
        rows: [
          ['农业灌溉', std.ag],
          ['工业用水', std.ind],
          ['城镇生活', std.life]
        ]
      },
      source: '出处：用水定额标准库',
      acts: [{ label: '用论证智能体做定额对标', act: 'tab:argue' }]
    }
  }
  return {
    title: '河北 / 河南 / 山东 三省主要用水定额',
    table: {
      head: ['省份', '农业灌溉', '工业用水', '城镇生活'],
      rows: QUOTA_STD.map((q) => [q.nm.replace(/（.*）$/, ''), q.ag, q.ind, q.life]),
      num: [1, 2, 3]
    },
    p: [
      '请告诉我具体省份与用水类别（如「河北省工业用水定额」），可给出定额标准出处；也可在「水资源论证报告审查智能体」中直接用于项目对标。'
    ],
    source: '出处：用水定额标准库（水利部及各省地方标准）',
    acts: [{ label: '用论证智能体做定额对标', act: 'tab:argue' }]
  }
}

/* ---------------- ② 取水许可 / 证照 ---------------- */

function aLic(s: string): Answer {
  const a = findArea(s)
  const org = [...new Set(LIC_CERTS.map((c) => c.org))]
    .sort((x, y) => y.length - x.length)
    .find((o) => s.includes(o))
  const river = [...new Set(LIC_CERTS.map((c) => c.river))]
    .sort((x, y) => y.length - x.length)
    .find((r) => s.includes(r))
  const st = /临近|即将到期|快到期/.test(s)
    ? 'soon'
    : /注销/.test(s)
      ? '注销'
      : /有效/.test(s)
        ? '有效'
        : ''
  const m = s.match(/(\d+(?:\.\d+)?)\s*万/i)
  const th = m ? parseFloat(m[1]) : null
  const over = /超过|大于|以上|高出/.test(s)
  const under = /低于|小于|不足/.test(s)

  const list = LIC_CERTS.filter((c) => {
    if (a?.county && c.county !== a.county) {
      return false
    }
    if (a && !a.county && a.city && c.area !== a.city) {
      return false
    }
    if (a?.prov && !a.city && c.prov !== a.prov) {
      return false
    }
    if (org && c.org !== org) {
      return false
    }
    if (river && c.river !== river) {
      return false
    }
    if (st === '注销' && c.status !== '注销') {
      return false
    }
    if (st === '有效' && c.status !== '有效') {
      return false
    }
    if (st === 'soon' && !c.exp) {
      return false
    }
    if (th !== null && over && !(+c.amt > th)) {
      return false
    }
    if (th !== null && under && !(+c.amt < th)) {
      return false
    }
    return true
  })

  const cond: string[] = []
  if (a?.county) {
    cond.push(`${a.prov} ${a.city} ${a.county}`)
  } else if (a?.city) {
    cond.push(a.city)
  } else if (a?.prov) {
    cond.push(a.prov)
  }
  if (org) {
    cond.push(`监管单位 ${org}`)
  }
  if (river) {
    cond.push(`所属河流 ${river}`)
  }
  if (st) {
    cond.push(`状态 ${{ soon: '临近到期', 有效: '有效', 注销: '注销' }[st]}`)
  }
  if (th !== null) {
    cond.push(`许可水量 ${over ? '超过' : under ? '低于' : '约'} ${th} 万m³`)
  }

  if (!list.length) {
    const irr = a?.county ? KB_IRRIG_DATA.filter((r) => r[1] === a.county) : []
    return {
      title: '未命中取水许可记录',
      p: [
        `按「${cond.join(' · ') || '当前条件'}」在电子证照库中未检索到记录，可调整行政区或监管单位再试。`
      ],
      table: irr.length
        ? {
            head: ['区县', '取水权人', '建设项目', '许可水量(万m³)', '灌区名称'],
            rows: irr.map((r) => [r[1], r[3], r[5], r[4], r[7]]),
            num: [3]
          }
        : undefined,
      source: '数据来源：取水许可电子证照库（演示明细）· 灌区取水许可台账',
      acts: [
        { label: '打开取水许可管理智能体', act: 'tab:query' },
        { label: '在知识库查看台账', act: 'view:base' }
      ]
    }
  }

  const show = [...list].sort((x, y) => y.amt - x.amt)
  const cap = show.slice(0, 8)
  return {
    title: '取水许可检索结果',
    kpis: [
      { k: '命中', v: `${list.length} 份` },
      { k: '许可水量合计', v: `${num(sum(list, (c) => c.amt))} 万m³` },
      { k: '有效', v: `${list.filter((c) => c.status === '有效').length} 份` },
      { k: '单证最大', v: `${num(show[0].amt)} 万m³` }
    ],
    p: cond.length ? [`检索条件：${cond.join('　')}`] : undefined,
    table: {
      head: ['取水口编号', '许可证编号', '取水权人', '所属河流', '许可水量(万m³)', '状态'],
      rows: cap.map((c) => [c.no, c.cert, c.owner, c.river, c.amt.toLocaleString(), c.status]),
      num: [4]
    },
    source: '数据来源：取水许可电子证照库 · 漳卫南运河管理局',
    acts: [
      { label: '查看全部证照明细', act: 'tab:query' },
      { label: '用管理智能体继续筛选', act: `ask:${s}` }
    ]
  }
}

/* ---------------- ③ 跨省河流水量分配 ---------------- */

function aRiver(s: string): Answer {
  const city = [...new Set(KB_RIVER_DATA.map((r) => r[1]))]
    .filter((c) => s.includes(c))
    .sort((a, b) => b.length - a.length)[0]
  const prov = ['河南省', '河北省', '山东省'].find((p) => s.includes(p.slice(0, 2)))
  let list = KB_RIVER_DATA
  if (city) {
    list = list.filter((r) => r[1] === city)
  } else if (prov) {
    list = list.filter((r) => r[0] === prov)
  }
  if (city || prov) {
    return {
      title: `${prov || ''}${city || ''}跨省河流水量分配指标`,
      kpis: [
        { k: '分配水量合计', v: `${num(sum(list, (r) => r[3]))} 万m³` },
        { k: '明细', v: `${list.length} 条` }
      ],
      table: {
        head: ['省份', '城市', '河系', '水量(万m³)', '备注'],
        rows: list.map((r) => [r[0], r[1], r[2], r[3], r[4] || '—']),
        num: [3]
      },
      source: '出处：漳卫南运河河系跨省水量分配到地市数据（2026 年）· 合计 69,220.65 万m³',
      acts: [
        { label: '由论证智能体核验指标', act: 'tab:argue' },
        { label: '在知识库中查看原文', act: 'view:base' }
      ]
    }
  }
  const byProv = ['河南省', '河北省', '山东省'].map((p) => {
    const rows = KB_RIVER_DATA.filter((r) => r[0] === p)
    return [
      p,
      [...new Set(rows.map((r) => r[1]))].join('、'),
      String(rows.length),
      num(sum(rows, (r) => r[3]))
    ]
  })
  return {
    title: '漳卫南运河河系跨省水量分配（2026 年）',
    kpis: [
      { k: '合计', v: '69,220.65 万m³' },
      { k: '涉及', v: '3 省 10 个地市' },
      { k: '河系', v: '2 个（漳河 / 卫河含卫运河-漳卫新河）' }
    ],
    p: ['分省汇总：'],
    table: {
      head: ['省份', '涉及地市', '明细条数', '分配水量(万m³)'],
      rows: byProv,
      num: [2, 3]
    },
    source: '出处：漳卫南运河河系跨省水量分配到地市数据 · 漳卫南运河管理局',
    acts: [
      { label: '由论证智能体核验指标', act: 'tab:argue' },
      { label: '在知识库中查看原文', act: 'view:base' }
    ]
  }
}

/* ---------------- ④ 大中型灌区 ---------------- */

function aIrrig(s: string): Answer {
  const county = [...new Set(KB_IRRIG_DATA.map((r) => r[1]))].filter((c) => s.includes(c))[0]
  const nm = KB_IRRIG_DATA.map((r) => r[7]).filter(
    (n) => n && s.includes(n.replace(/灌区$/, ''))
  )[0]
  let list = KB_IRRIG_DATA
  if (county) {
    list = list.filter((r) => r[1] === county)
  } else if (nm) {
    list = list.filter((r) => r[7] === nm)
  }
  if (county || nm) {
    return {
      title: `${county || nm} 大中型灌区取水情况`,
      kpis: [
        { k: '取水户', v: `${list.length} 处` },
        { k: '许可水量合计', v: `${num(sum(list, (r) => r[4]))} 万m³` }
      ],
      table: {
        head: ['区县', '取水权人', '建设项目', '许可水量(万m³)', '灌区名称'],
        rows: list.map((r) => [r[1] || '—', r[3], r[5], r[4], r[7]]),
        num: [3]
      },
      source: '出处：漳卫南局管辖范围大中型灌区取水许可台账',
      acts: [{ label: '在知识库中查看台账', act: 'view:base' }]
    }
  }
  const byProv = ['河北省', '河南省', '山东省'].map((p) => {
    const rows = KB_IRRIG_DATA.filter((r) => r[0].startsWith(p))
    return [p, String(rows.length), num(sum(rows, (r) => r[4]))]
  })
  const scale = KB_IRRIG_DATA.filter((r) => r[6] === '规模以上').length
  return {
    title: '漳卫南局管辖范围大中型灌区',
    kpis: [
      { k: '灌区取水户', v: `${KB_IRRIG_DATA.length} 处` },
      { k: '许可水量合计', v: `${num(sum(KB_IRRIG_DATA, (r) => r[4]))} 万m³` },
      { k: '规模以上', v: `${scale} 处 · 规模以下 ${KB_IRRIG_DATA.length - scale} 处` }
    ],
    table: {
      head: ['省份', '取水户数', '许可水量(万m³)'],
      rows: byProv,
      num: [1, 2]
    },
    p: ['可再问「馆陶县有哪些灌区」「魏县军留灌区许可水量多少」，给出到区县、灌区的明细。'],
    source: '出处：漳卫南局管辖范围大中型灌区取水许可台账（3 省 7 市 32 处）',
    acts: [{ label: '在知识库中查看台账', act: 'view:base' }]
  }
}

/* ---------------- ⑤ 区县用水总量 ---------------- */

function aWtotal(s: string): Answer {
  const a = findArea(s)
  if (a?.county) {
    return {
      title: `${a.prov} ${a.city} ${a.county}`,
      p: [
        '该县（区）属于漳卫南运河管理局管辖范围，纳入县域用水总量控制名录；取水许可审批需核验其用水总量控制指标与上年度实际用水量。'
      ],
      kpis: [
        { k: '所属地市', v: a.city },
        { k: '控制指标', v: '按年度台账维护' }
      ],
      source: '出处：漳卫南运河管理局管辖范围区县用水总量名录',
      acts: [
        { label: '用论证智能体核验', act: 'tab:argue' },
        { label: '在知识库查看名录', act: 'view:base' }
      ]
    }
  }
  const rows = ['河北省', '河南省', '山东省'].map((p) => {
    const cities = [
      ...new Set(KB_IRRIG_DATA.filter((r) => r[0].startsWith(p)).map((r) => r[0].slice(0, 4)))
    ]
    return [p, String(cities.length), cities.join('、')]
  })
  return {
    title: '管辖范围区县用水总量名录',
    kpis: [{ k: '覆盖', v: '3 省 10 市 29 个县（区）' }],
    table: { head: ['省份', '地市数', '地市明细'], rows, num: [1] },
    p: ['县域用水总量控制指标随年度台账入库维护，可在知识库「区县用水总量」分类查看报表。'],
    source: '出处：漳卫南运河管理局管辖范围区县用水总量名录',
    acts: [
      { label: '用论证智能体核验', act: 'tab:argue' },
      { label: '在知识库查看名录', act: 'view:base' }
    ]
  }
}

/* ---------------- ⑥ 水资源论证报告 ---------------- */

function aReport(s: string): Answer {
  const list = KB_DOCS.report
  const hit = list.find((d) => s.includes(d.name.slice(0, 6)) || s.includes(d.sub.split('　')[0]))
  if (hit) {
    return {
      title: hit.name,
      table: { head: ['要素', '内容'], rows: hit.meta.map((m) => [m[0], m[1]]) },
      source: `出处：水资源论证报告知识库 · ${hit.sub}`,
      acts: [
        { label: '用论证智能体审查该报告', act: 'tab:argue' },
        { label: '在知识库中打开', act: 'view:base' }
      ]
    }
  }
  return {
    title: '水资源论证报告 · 知识库与要求',
    kpis: [
      { k: '在库报告', v: `${list.length} 份` },
      { k: '结构化要素', v: '名称 / 编制单位 / 业主 / 工作等级 / 论证取水量' }
    ],
    p: ['报告应包含的主要内容：'],
    list: [
      '建设项目概况与取水方案（取水水源、地点、方式、取水量）',
      '水资源状况及开发利用分析、区域用水总量控制指标符合性',
      '取水水源可靠性论证（来水量、保证率、水质）',
      '取水影响与退水影响分析（对生态、其他用水户影响）',
      '节水评价与水资源保护措施、计量监测方案',
      '结论与建议（取退水方案是否可行）'
    ],
    source: '出处：水资源论证报告知识库（可自动解析报告要素）',
    acts: [{ label: '用论证智能体做智能审查', act: 'tab:argue' }]
  }
}

/* ---------------- ⑦ 办理流程 / 系统能力 ---------------- */

function aProc(): Answer {
  return {
    title: '取水许可办理流程',
    list: [
      '申请受理：取水单位提交取水许可申请书、水资源论证报告（书/表）、项目立项文件等材料',
      '技术审查：组织专家审查取水水源可靠性、用水合理性、节水评价、退水影响',
      '指标核验：核对区域用水总量控制指标、跨省河流水量分配指标、用水定额标准符合性',
      '审批发证：作出准予/不予许可决定，核发取水许可证并明确许可水量、有效期、取水口信息',
      '计量与监管：安装计量设施、接入在线监测，按年度开展取用水情况监督检查'
    ],
    p: [
      '主要依据：《取水许可和水资源费征收管理条例》《取水许可管理办法》《建设项目水资源论证管理办法》《建设项目水资源论证导则》及流域水量分配方案。'
    ],
    source: '出处：取水许可审批业务规则库',
    acts: [
      { label: '用论证智能体做审查', act: 'tab:argue' },
      { label: '查已有许可证', act: 'tab:query' }
    ]
  }
}

function aDaily(): Answer {
  return {
    title: '重点取水口日报（后台数据速览）',
    p: [
      `已对接后台取水计量数据库，当前数据期内重点取水口 ${LIC_CERTS.length} 处，当日取水量合计 268.4 万m³，缺报：夏津县水利局。`,
      '可在「重点取水口日报智能体」中完成：① 取水基本情况数据的后台读取及校核（完整性 / 当日-累计逻辑 / 月计划 / 年度许可 / 合计复核）；② 水资源监控运行情况录入；③ 一键自动编制日报（固定版式，可下载、可归档）。'
    ],
    source: '出处：后台取水计量数据库（取用水管理 · 水量监控）',
    acts: [
      { label: '打开重点取水口日报智能体', act: 'tab:daily' },
      { label: '查重点取水口许可', act: 'tab:query' }
    ]
  }
}

function aBulletin(): Answer {
  return {
    title: '水资源信息通报（后台数据速览）',
    p: [
      '已对接后台取水、断面过流、水库枢纽蓄水调度等数据，本期取水口 12 处，取水量合计 5,286.7 万m³（不含漳岳水电站 3,480 万m³）。',
      '可在「水资源信息通报智能体」中完成：① 取水、断面过流、水库枢纽等数据后台读取及校核（附表合计／流量-水量换算／水量平衡／枢纽合计／整编完整性）；② 工作动态录入；③ 一键自动编制「漳卫南运河水资源信息通报」（固定六节版式，可下载、可归档）。'
    ],
    source: '出处：后台取用水管理 · 水量监控 · 水工程调度数据库',
    acts: [
      { label: '打开水资源信息通报智能体', act: 'tab:bulletin' },
      { label: '查取水许可台账', act: 'tab:query' }
    ]
  }
}

function aHelp(): Answer {
  return {
    title: '我可以帮你做这些',
    p: ['业务智能体（深度办理）：'],
    list: [
      '水资源论证报告审查智能体：选报告 → 自动识别行政区/用途 → 按定额与分配指标做合规审查 → 出审查意见书（可下载、可归档）',
      '取水许可信息管理智能体：用自然语言查电子证照（状态/水源/用途/河流/行政区/监管单位/水量阈值），支持聚合统计、导出 CSV 与新增许可证登记',
      '重点取水口日报智能体：后台读取计量数据并自动校核，录入运行情况，一键编制取水日报（可下载、可归档）',
      '水资源信息通报智能体：后台读取当月取水、断面过流、蓄水调度数据并校核，录入工作动态，一键编制信息通报（可下载、可归档）'
    ],
    source: '提示：点击下方按钮可直接跳转到对应模块或智能体',
    acts: [
      { label: '水资源论证报告审查智能体', act: 'tab:argue' },
      { label: '取水许可管理智能体', act: 'tab:query' },
      { label: '重点取水口日报智能体', act: 'tab:daily' },
      { label: '水资源信息通报智能体', act: 'tab:bulletin' },
      { label: '知识库', act: 'view:base' }
    ]
  }
}

function aFallback(q: string): Answer {
  return {
    title: '未检索到直接匹配的内容',
    p: [
      `已在 1,269 份知识条目与业务数据中检索「${q.slice(0, 40)}」，暂未命中确切答案。`,
      '换个问法或试试这些方向：'
    ],
    list: QA_CHIPS.slice(0, 4),
    source: '提示：业务智能体基于专用规则与台账数据，结论更精确',
    acts: [
      { label: '交给水资源论证报告审查智能体', act: 'tab:argue' },
      { label: '交给取水许可管理智能体', act: 'tab:query' }
    ]
  }
}

/* ---------------- 意图路由（复刻原型 cgAnswer） ---------------- */

export function answerOf(q: string): Answer {
  const s = q.replace(/\s/g, '')
  if (/^(你好|您好|hi|hello|在吗|开始)/i.test(s)) {
    return {
      title: '你好，我是智能问答助手',
      p: [
        '可以问我用水定额、跨省水量分配、取水许可、灌区、区县用水总量、论证报告、水情预警以及系统使用等任何问题。'
      ],
      acts: [{ label: '看看我能做什么', act: 'ask:系统能帮我做什么' }]
    }
  }
  if (/定额|用水指标|亩均|单位用水量|对标/.test(s)) {
    return aQuota(s)
  }
  if (/取水口日报|重点取水口|日报编制|编日报|日报数据/.test(s)) {
    return aDaily()
  }
  if (/水资源信息通报|信息通报|通报编制|通报数据/.test(s)) {
    return aBulletin()
  }
  if (/论证|报告书|报告表|导则|工作等级/.test(s)) {
    return aReport(s)
  }
  if (/跨省|水量分配|分配水量|分配指标|可分配/.test(s)) {
    return aRiver(s)
  }
  if (/灌区|灌溉面积|扬水站/.test(s)) {
    return aIrrig(s)
  }
  if (/用水总量|总量控制|控制指标|区县|管辖范围|名录/.test(s)) {
    return aWtotal(s)
  }
  if (/取水许可|许可证|证照|电子证照|许可水量|取水权人|取水口/.test(s)) {
    return aLic(s)
  }
  if (/流程|办理|审批|申请|依据|法规|条例|制度|管理办法/.test(s)) {
    return aProc()
  }
  if (/功能|做什么|怎么用|帮助|模块|导航|介绍|你会|能干/.test(s)) {
    return aHelp()
  }
  return aFallback(q)
}

// 开场白（复刻原型 cgInit 首条消息）
export function welcomeAnswer(): Answer {
  return {
    title: '你好，我是漳卫南运河管理局水资源智能问答助手',
    p: [
      '可以直接问我任何问题——用水定额、跨省水量分配、取水许可、灌区、区县用水总量、论证报告、水情与预警、系统使用等。',
      '如需对某个业务做深度办理（项目合规审查、证照台账筛选统计、日报自动编制），可返回问答首页选择业务智能体；我也会在回答里给出跳转入口。'
    ],
    source: '数据支撑：知识条目 1,269 份 · 取水许可电子证照库 · 跨省水量分配数据 · 用水定额标准库',
    acts: [
      { label: '系统能帮我做什么', act: 'ask:系统能帮我做什么' },
      { label: '水资源论证报告审查智能体', act: 'tab:argue' },
      { label: '取水许可管理智能体', act: 'tab:query' }
    ]
  }
}
