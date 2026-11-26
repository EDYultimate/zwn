<script setup lang="ts">
import { computed, nextTick, ref, watch, type Ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import ProTabs from '@/components/common/ProTabs/ProTabs.vue'
import ProTable from '@/components/common/ProTable'
import type { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid'
import { useECharts } from '@/hooks/web/useECharts'

/** 预警类别定义（与原型一致：名称 + 描述 + 类别色） */
const WARN_CATS = [
  {
    key: '临界许可',
    color: '#c07a00',
    desc: '许可水量使用率已达 80% ~ 100%，尚未超出许可水量，处于临界状态。'
  },
  {
    key: '超许可',
    color: '#e2564a',
    desc: '实际取水量已超出取水许可证载明的许可水量，需依法查处并核减下年度计划。'
  },
  {
    key: '超计划',
    color: '#d99100',
    desc: '实际取水量已超出年度取水计划，其中超出批准计划 5% 以上的纳入超计划预警。'
  },
  {
    key: '计量异常',
    color: '#0e7fa8',
    desc: '计量设施在线监测数据异常分为「数据缺失」「数据突变」两类：数据缺失为设备离线或时段数据未采集；数据突变为瞬时流量跳变、读数恒定不变、比对超差等数值异常。'
  }
] as const

type WarnCat = (typeof WARN_CATS)[number]['key']

/** 预警记录：公共字段 + 各类别专属字段 */
interface WarnRow {
  cert: string // 许可证编号
  owner: string // 取水权人名称
  gate: string // 取水口 / 监测点
  org: string // 监管单位
  perm: number // 许可水量（万m³）
  fact: number // 实际取水量（万m³）
  plan?: number // 年度计划（超计划/临界许可）
  rate?: number // 许可水量使用率（%）
  over?: number // 超出水量（万m³）
  overPct?: number // 超出比例（%）
  dev?: string // 计量设施（计量异常）
  devNo?: string // 设备编号
  xc?: '数据缺失' | '数据突变' // 异常类型
  d0?: number | null // 当日水量（数据缺失为 null）
  d1?: number // 上一日水量
  cnt?: number // 异常次数
  last?: string // 最近异常时间
  loss?: number // 累计影响时长（小时，计量异常）
  date: string // 预警日期
  st: '待处理' | '已处理' // 状态
  res?: string // 处理结果（已处理时有值）
  note?: string // 处置情况说明
}

const visible = ref(false)
const loading = ref(false)
const activeCat = ref<WarnCat>('临界许可')
const curDate = ref('2026-09-03')
const keyword = ref('')

/* ==================== 本地 mock 数据（与原型一致，接入后端后替换为接口调用） ==================== */
const WARN_ROWS: Record<WarnCat, WarnRow[]> = {
  临界许可: [
    {
      cert: 'A130402S2025-0032',
      owner: '邯郸市生态水网管理中心',
      gate: '民有渠渠首',
      org: '岳城局',
      perm: 6202,
      fact: 5954,
      plan: 6100,
      rate: 96.0,
      date: '2026-09-03',
      st: '待处理'
    },
    {
      cert: 'A410505S2024-0581',
      owner: '安阳市水利工程运行保障中心',
      gate: '漳南渠渠首',
      org: '岳城局',
      perm: 3914,
      fact: 3762,
      plan: 3800,
      rate: 96.1,
      date: '2026-09-03',
      st: '待处理'
    },
    {
      cert: 'A130427S2023-0032',
      owner: '邯郸市漳岳水电有限公司',
      gate: '岳城水库泄洪洞9#闸门',
      org: '岳城局',
      perm: 20000,
      fact: 19120,
      plan: 19500,
      rate: 95.6,
      date: '2026-09-02',
      st: '已处理',
      res: '已电话通知取水权人压减取水流量，纳入下年度计划核减参考。'
    },
    {
      cert: 'A371581S2022-0330',
      owner: '临清市水务局',
      gate: '卫运河临清取水口',
      org: '聊城局',
      perm: 1260,
      fact: 1204,
      plan: 1240,
      rate: 95.6,
      date: '2026-09-02',
      st: '待处理'
    },
    {
      cert: 'A131182S2024-0210',
      owner: '故城县城乡供水有限公司',
      gate: '卫运河故城取水口',
      org: '邢台局',
      perm: 540,
      fact: 513,
      plan: 520,
      rate: 95.0,
      date: '2026-09-01',
      st: '待处理'
    },
    {
      cert: 'A371428S2023-0127',
      owner: '武城县水利局',
      gate: '卫运河武城取水口',
      org: '德州局',
      perm: 480,
      fact: 441,
      plan: 470,
      rate: 91.9,
      date: '2026-09-01',
      st: '已处理',
      res: '已提醒控制取水节奏，下月取水计划核减 30 万m³。'
    },
    {
      cert: 'A130928S2023-0446',
      owner: '吴桥县水务局',
      gate: '漳卫新河吴桥取水口',
      org: '德州局',
      perm: 380,
      fact: 349,
      plan: 370,
      rate: 91.8,
      date: '2026-08-31',
      st: '待处理'
    },
    {
      cert: 'A130981S2025-0071',
      owner: '宁津县水利局',
      gate: '漳卫新河宁津取水口',
      org: '德州局',
      perm: 95,
      fact: 87,
      plan: 92,
      rate: 91.6,
      date: '2026-08-31',
      st: '待处理'
    },
    {
      cert: 'A410526S2024-0213',
      owner: '河南省滑县道口镇人民政府',
      gate: '卫河滑县道口取水口',
      org: '濮阳局',
      perm: 260,
      fact: 237,
      plan: 255,
      rate: 91.2,
      date: '2026-08-30',
      st: '待处理'
    },
    {
      cert: 'A410621S2021-1648',
      owner: '河南省浚县新镇镇淇门南街村委会',
      gate: '淇门南街灌溉取水口',
      org: '濮阳局',
      perm: 22,
      fact: 20,
      plan: 21,
      rate: 90.9,
      date: '2026-08-30',
      st: '待处理'
    }
  ],
  超许可: [
    {
      cert: 'A410403S2022-0617',
      owner: '安阳丰源水务有限公司',
      gate: '安阳河右岸取水口',
      org: '濮阳局',
      perm: 1500,
      fact: 1690,
      over: 190,
      overPct: 12.7,
      date: '2026-09-03',
      st: '待处理',
      note: '超出许可水量 190 万m³，已冻结新增取水申请，移交水政执法立案查处。'
    },
    {
      cert: 'A130402S2025-0032',
      owner: '邯郸市生态水网管理中心',
      gate: '民有渠渠首',
      org: '岳城局',
      perm: 6202,
      fact: 6560,
      over: 358,
      overPct: 5.77,
      date: '2026-09-03',
      st: '待处理',
      note: '超许可 5.77%，下达停止超取水行为通知书，纳入重点监控名单。'
    },
    {
      cert: 'A410505S2024-0581',
      owner: '安阳市水利工程运行保障中心',
      gate: '漳南渠渠首',
      org: '岳城局',
      perm: 3914,
      fact: 4150,
      over: 236,
      overPct: 6.03,
      date: '2026-09-02',
      st: '待处理',
      note: '超许可 6.03%，约谈取水权人，责令书面说明原因并核减下年度计划。'
    },
    {
      cert: 'A130427S2023-0032',
      owner: '邯郸市漳岳水电有限公司',
      gate: '岳城水库泄洪洞9#闸门',
      org: '岳城局',
      perm: 20000,
      fact: 20640,
      over: 640,
      overPct: 3.2,
      date: '2026-09-02',
      st: '已处理',
      res: '已通知调整发电调度方案，复核下月发电取水计划。',
      note: '河道内水力发电超许可 640 万m³，已通知调整发电调度方案。'
    },
    {
      cert: 'A130535S2021-0907',
      owner: '临西县水务局',
      gate: '尖塚扬水站（卫运河左41+900）',
      org: '邢衡局',
      perm: 5080,
      fact: 5290,
      over: 210,
      overPct: 4.13,
      date: '2026-09-01',
      st: '待处理',
      note: '超许可 4.13%，灌溉期末复核取水台账，按许可水量闭环管控。'
    },
    {
      cert: 'A371525S2022-0412',
      owner: '冠县水利局',
      gate: '班庄扬水站（卫河右181+780）',
      org: '聊城局',
      perm: 4200,
      fact: 4380,
      over: 180,
      overPct: 4.29,
      date: '2026-09-01',
      st: '待处理',
      note: '超许可 4.29%，要求补报水量并核减下月取水计划。'
    },
    {
      cert: 'A371581S2022-0330',
      owner: '临清市水务局',
      gate: '卫运河临清取水口',
      org: '聊城局',
      perm: 1260,
      fact: 1338,
      over: 78,
      overPct: 6.19,
      date: '2026-08-31',
      st: '待处理',
      note: '超许可 6.19%，连续两年超取，列为水政执法重点检查对象。'
    },
    {
      cert: 'A130928S2024-0112',
      owner: '东光县水务局',
      gate: '王营盘引水闸（漳卫新河左62+220）',
      org: '水闸局',
      perm: 3763,
      fact: 3876,
      over: 113,
      overPct: 3.0,
      date: '2026-08-31',
      st: '已处理',
      res: '已通知控制引水流量，月底复核取水台账。',
      note: '超许可 3.00%，已通知控制引水流量，待月底复核。'
    },
    {
      cert: 'A371428S2023-0127',
      owner: '武城县水利局',
      gate: '卫运河武城取水口',
      org: '德州局',
      perm: 480,
      fact: 503,
      over: 23,
      overPct: 4.79,
      date: '2026-08-30',
      st: '待处理',
      note: '超许可 4.79%，年内取水量即将触顶，提示提前办理许可变更。'
    },
    {
      cert: 'A131126S2023-0055',
      owner: '故城县城乡供水有限公司',
      gate: '卫运河故城取水口',
      org: '邢衡局',
      perm: 540,
      fact: 566,
      over: 26,
      overPct: 4.81,
      date: '2026-08-28',
      st: '待处理',
      note: '超许可 4.81%，供水高峰期超取，建议错峰并申请许可水量核增。'
    }
  ],
  超计划: [
    {
      cert: 'A410621S2021-0503',
      owner: '卫河元村灌区服务站',
      gate: '卫河元村取水口',
      org: '濮阳局',
      perm: 2200,
      fact: 1968,
      plan: 1900,
      over: 68,
      overPct: 3.58,
      date: '2026-09-03',
      st: '待处理',
      note: '超年度计划 3.58%，提醒关注'
    },
    {
      cert: 'A130402S2025-0032',
      owner: '邯郸市生态水网管理中心',
      gate: '民有渠渠首',
      org: '岳城局',
      perm: 6202,
      fact: 5954,
      plan: 5640,
      over: 314,
      overPct: 5.57,
      date: '2026-09-03',
      st: '待处理',
      note: '超年度计划 5.57%，已达 5%'
    },
    {
      cert: 'A371581S2022-0330',
      owner: '临清市水务局',
      gate: '卫运河临清取水口',
      org: '聊城局',
      perm: 1260,
      fact: 1204,
      plan: 1130,
      over: 74,
      overPct: 6.55,
      date: '2026-09-02',
      st: '待处理',
      note: '超年度计划 6.55%，需核减下年度计划'
    },
    {
      cert: 'A371428S2023-0127',
      owner: '武城县水利局',
      gate: '卫运河武城取水口',
      org: '德州局',
      perm: 480,
      fact: 441,
      plan: 414,
      over: 27,
      overPct: 6.52,
      date: '2026-09-02',
      st: '待处理',
      note: '超年度计划 6.52%'
    },
    {
      cert: 'A131182S2024-0210',
      owner: '故城县城乡供水有限公司',
      gate: '卫运河故城取水口',
      org: '邢台局',
      perm: 540,
      fact: 513,
      plan: 490,
      over: 23,
      overPct: 4.69,
      date: '2026-09-01',
      st: '已处理',
      res: '已提醒关注并联动核减下月取水计划。',
      note: '超年度计划 4.69%，未达 5%'
    },
    {
      cert: 'A130928S2023-0446',
      owner: '吴桥县水务局',
      gate: '漳卫新河吴桥取水口',
      org: '德州局',
      perm: 380,
      fact: 349,
      plan: 330,
      over: 19,
      overPct: 5.76,
      date: '2026-09-01',
      st: '待处理',
      note: '超年度计划 5.76%'
    },
    {
      cert: 'A410505S2024-0581',
      owner: '安阳市水利工程运行保障中心',
      gate: '漳南渠渠首',
      org: '岳城局',
      perm: 3914,
      fact: 3762,
      plan: 3580,
      over: 182,
      overPct: 5.08,
      date: '2026-08-31',
      st: '待处理',
      note: '超年度计划 5.08%'
    },
    {
      cert: 'A130981S2025-0071',
      owner: '宁津县水利局',
      gate: '漳卫新河宁津取水口',
      org: '德州局',
      perm: 95,
      fact: 87,
      plan: 82,
      over: 5,
      overPct: 6.1,
      date: '2026-08-31',
      st: '待处理',
      note: '超年度计划 6.10%'
    },
    {
      cert: 'A410526S2024-0213',
      owner: '河南省滑县道口镇人民政府',
      gate: '卫河滑县道口取水口',
      org: '濮阳局',
      perm: 260,
      fact: 237,
      plan: 228,
      over: 9,
      overPct: 3.95,
      date: '2026-08-30',
      st: '已处理',
      res: '已提醒关注，灌溉期末复核取水台账。',
      note: '超年度计划 3.95%，未达 5%'
    },
    {
      cert: 'A130402S2025-0033',
      owner: '磁县岳城供水管理站',
      gate: '岳城水库坝下取水口',
      org: '岳城局',
      perm: 168,
      fact: 152,
      plan: 145,
      over: 7,
      overPct: 4.83,
      date: '2026-08-30',
      st: '待处理',
      note: '超年度计划 4.83%'
    }
  ],
  计量异常: [
    {
      cert: 'A130402S2025-0032',
      owner: '邯郸市生态水网管理中心',
      gate: '民有渠渠首（电磁流量计）',
      org: '岳城局',
      perm: 6202,
      fact: 5954,
      dev: '电磁流量计',
      devNo: 'LLJ-2023-0417',
      xc: '数据突变',
      d1: 24.1,
      d0: 35.6,
      cnt: 6,
      last: '2026-09-03 08:26',
      loss: 3.2,
      date: '2026-09-03',
      st: '待处理',
      note: '48 小时内 6 次出现瞬时流量跳变（幅度 >30%），疑似传感器结垢或线路接触不良。'
    },
    {
      cert: 'A371581S2022-0330',
      owner: '临清市水务局',
      gate: '卫运河临清取水口（超声波）',
      org: '聊城局',
      perm: 1260,
      fact: 1204,
      dev: '超声波流量计',
      devNo: 'CSB-2022-1180',
      xc: '数据缺失',
      d1: 4.9,
      d0: null,
      cnt: 12,
      last: '2026-09-03 06:40',
      loss: 8.7,
      date: '2026-09-03',
      st: '待处理',
      note: '累计 12 个时段数据缺失（合计 8.7 小时），超出 4 小时上报阈值，需现场排查通信链路。'
    },
    {
      cert: 'A131182S2024-0210',
      owner: '故城县城乡供水有限公司',
      gate: '卫运河故城取水口（电磁）',
      org: '邢台局',
      perm: 540,
      fact: 513,
      dev: '电磁流量计',
      devNo: 'LLJ-2024-0633',
      xc: '数据突变',
      d1: 2.1,
      d0: 2.1,
      cnt: 9,
      last: '2026-09-02 22:15',
      loss: 5.1,
      date: '2026-09-02',
      st: '待处理',
      note: '连续 9 个时段读数恒定不变，与下游水位变化趋势不符，疑似计量表死机。'
    },
    {
      cert: 'A371428S2023-0127',
      owner: '武城县水利局',
      gate: '卫运河武城取水口（明渠）',
      org: '德州局',
      perm: 480,
      fact: 441,
      dev: '明渠流量计',
      devNo: 'MQ-2023-0271',
      xc: '数据缺失',
      d1: 1.8,
      d0: null,
      cnt: 0,
      last: '2026-09-02 15:03',
      loss: 16.4,
      date: '2026-09-02',
      st: '待处理',
      note: '设备已离线 16.4 小时未恢复，期间取水量按上次有效值折算，数据可信度低。'
    },
    {
      cert: 'A130928S2023-0446',
      owner: '吴桥县水务局',
      gate: '漳卫新河吴桥取水口（电磁）',
      org: '德州局',
      perm: 380,
      fact: 349,
      dev: '电磁流量计',
      devNo: 'LLJ-2023-0912',
      xc: '数据突变',
      d1: 1.4,
      d0: 2.6,
      cnt: 4,
      last: '2026-09-01 19:48',
      loss: 2.3,
      date: '2026-09-01',
      st: '已处理',
      res: '已通知运维单位检查接地与排气，故障已排除。',
      note: '4 次瞬时流量负值跳变，疑似接地不良或管道内气体影响。'
    },
    {
      cert: 'A130981S2025-0071',
      owner: '宁津县水利局',
      gate: '漳卫新河宁津取水口（超声波）',
      org: '德州局',
      perm: 95,
      fact: 87,
      dev: '超声波流量计',
      devNo: 'CSB-2025-0044',
      xc: '数据缺失',
      d1: 0.35,
      d0: null,
      cnt: 5,
      last: '2026-09-01 11:20',
      loss: 3.8,
      date: '2026-09-01',
      st: '待处理',
      note: '5 个时段数据缺失（3.8 小时），接近 4 小时上报阈值。'
    },
    {
      cert: 'A410526S2024-0213',
      owner: '河南省滑县道口镇人民政府',
      gate: '卫河滑县道口取水口（电磁）',
      org: '濮阳局',
      perm: 260,
      fact: 237,
      dev: '电磁流量计',
      devNo: 'LLJ-2024-0338',
      xc: '数据突变',
      d1: 0.96,
      d0: 1.45,
      cnt: 2,
      last: '2026-08-31 09:10',
      loss: 0,
      date: '2026-08-31',
      st: '已处理',
      res: '已通知重新标定流量计，比对偏差回归允许范围。',
      note: '在线监测值与人工比对值偏差 6.8%，超出 ±5% 允许范围，需重新标定。'
    },
    {
      cert: 'A410621S2021-1648',
      owner: '河南省浚县新镇镇淇门南街村委会',
      gate: '淇门南街灌溉取水口（明渠）',
      org: '濮阳局',
      perm: 22,
      fact: 20,
      dev: '明渠流量计',
      devNo: 'MQ-2021-0088',
      xc: '数据缺失',
      d1: 0.08,
      d0: null,
      cnt: 0,
      last: '2026-08-31 07:30',
      loss: 22.6,
      date: '2026-08-31',
      st: '待处理',
      note: '灌溉期设备离线 22.6 小时，为连续第二个月出现同类故障。'
    },
    {
      cert: 'A130402S2025-0033',
      owner: '磁县岳城供水管理站',
      gate: '岳城水库坝下取水口（管道）',
      org: '岳城局',
      perm: 168,
      fact: 152,
      dev: '电磁流量计',
      devNo: 'LLJ-2025-0019',
      xc: '数据突变',
      d1: 0.62,
      d0: 0.44,
      cnt: 3,
      last: '2026-08-30 20:05',
      loss: 1.6,
      date: '2026-08-30',
      st: '待处理',
      note: '3 次瞬时流量跳变，幅度 18% ~ 26%，未超 30% 阈值，持续观察。'
    },
    {
      cert: 'A410505S2024-0581',
      owner: '安阳市水利工程运行保障中心',
      gate: '漳南渠渠首（渠道）',
      org: '岳城局',
      perm: 3914,
      fact: 3762,
      dev: '明渠流量计',
      devNo: 'MQ-2024-0512',
      xc: '数据突变',
      d1: 3.2,
      d0: 4.2,
      cnt: 1,
      last: '2026-08-29 14:22',
      loss: 0,
      date: '2026-08-29',
      st: '已处理',
      res: '已通知复核计量系数，在线数据已修正。',
      note: '在线监测值与人工比对值偏差 5.4%，略超允许范围。'
    }
  ]
}

const catInfo = computed(() => WARN_CATS.find((c) => c.key === activeCat.value)!)

/**
 * 当前类别全量记录（响应式数据源，切换类别时先清空避免旧数据渲染到新列）
 * 当前为本地 mock（fetchData 里赋值），接入后端后由接口返回替换
 */
const allRows = ref<WarnRow[]>([])

/** 关键词模糊过滤（许可证编号 / 取水权人 / 取水口 / 监管单位等） */
const filteredRows = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) {
    return allRows.value
  }
  return allRows.value.filter((r) =>
    [r.cert, r.owner, r.gate, r.org, r.dev, r.devNo, r.st, r.note]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(q)
  )
})

/* ==================== 列定义（每类预警差异化列，口径与原型一致；彩色单元格用命名插槽渲染） ==================== */
/* 白色背景配色：红 #f5222d / 橙 #fa8c16 / 蓝 #1677ff，保证浅底上可读 */
/** 使用率配色：≥95% 红 / ≥92% 橙 / 其余蓝（口径同原型） */
function rateColor(rate: number) {
  return rate >= 95 ? '#f5222d' : rate >= 92 ? '#fa8c16' : '#1677ff'
}

/** 超出量/比例配色：超许可统一红；超计划 ≥5% 红、<5% 橙 */
function overColor(row: WarnRow) {
  return activeCat.value === '超计划' && row.overPct! < 5 ? '#fa8c16' : '#f5222d'
}

const baseColumns: VxeGridPropTypes.Columns = [
  { type: 'seq', title: '序号', width: 55, align: 'center' },
  {
    field: 'cert',
    title: '许可证编号',
    width: 165,
    showOverflow: true,
    slots: { default: 'cert' }
  },
  { field: 'owner', title: '取水权人名称', width: 175, showOverflow: true },
  { field: 'gate', title: '取水口 / 监测点', minWidth: 180, showOverflow: true },
  { field: 'org', title: '监管单位', width: 85 }
]

/** 公共尾列：状态徽标 + 处理结果 */
const tailColumns: VxeGridPropTypes.Columns = [
  { field: 'st', title: '状态', width: 76, slots: { default: 'st' } },
  { field: 'res', title: '处理结果', width: 150, showOverflow: true, slots: { default: 'res' } }
]

const columns = computed<VxeGridPropTypes.Columns>(() => {
  if (activeCat.value === '临界许可') {
    return [
      ...baseColumns,
      {
        field: 'perm',
        title: '许可水量(万m³)',
        width: 140,
        align: 'right',
        slots: { default: 'num' }
      },
      {
        field: 'fact',
        title: '实际取水量(万m³)',
        width: 156,
        align: 'right',
        slots: { default: 'num' }
      },
      { field: 'rate', title: '使用率', width: 90, align: 'right', slots: { default: 'rate' } },
      ...tailColumns
    ]
  }
  if (activeCat.value === '超许可') {
    return [
      ...baseColumns,
      {
        field: 'perm',
        title: '许可水量(万m³)',
        width: 140,
        align: 'right',
        slots: { default: 'num' }
      },
      {
        field: 'fact',
        title: '实际取水量(万m³)',
        width: 156,
        align: 'right',
        slots: { default: 'num' }
      },
      {
        field: 'over',
        title: '超出水量(万m³)',
        width: 156,
        align: 'right',
        slots: { default: 'over' }
      },
      {
        field: 'overPct',
        title: '超出比例',
        width: 90,
        align: 'right',
        slots: { default: 'overPct' }
      },
      { field: 'date', title: '预警日期', width: 100 },
      ...tailColumns
    ]
  }
  if (activeCat.value === '超计划') {
    return [
      ...baseColumns,
      {
        field: 'plan',
        title: '年度计划(万m³)',
        width: 140,
        align: 'right',
        slots: { default: 'num' }
      },
      {
        field: 'fact',
        title: '实际取水量(万m³)',
        width: 156,
        align: 'right',
        slots: { default: 'num' }
      },
      {
        field: 'over',
        title: '超出计划(万m³)',
        width: 140,
        align: 'right',
        slots: { default: 'over' }
      },
      {
        field: 'overPct',
        title: '超出比例',
        width: 90,
        align: 'right',
        slots: { default: 'overPct' }
      },
      { field: 'date', title: '预警日期', width: 100 },
      ...tailColumns
    ]
  }
  /* 计量异常：数据缺失 / 数据突变 两类 */
  return [
    ...baseColumns,
    { field: 'xc', title: '异常类型', width: 90, slots: { default: 'xc' } },
    { field: 'd0', title: '当日水量(万m³)', width: 140, align: 'right', slots: { default: 'd0' } },
    {
      field: 'd1',
      title: '上一日水量(万m³)',
      width: 156,
      align: 'right',
      slots: { default: 'd1' }
    },
    { field: 'cnt', title: '异常次数', width: 95, align: 'right', slots: { default: 'cnt' } },
    { field: 'last', title: '最近异常时间', width: 140 },
    ...tailColumns
  ]
})

/** 请求预警明细列表（当前为本地 mock，接入后端后替换为真实接口调用） */
async function fetchData() {
  try {
    loading.value = true
    await new Promise((r) => setTimeout(r, 200))
    // mock 数据：按当前类别取静态记录；接入后端后替换为接口返回值
    allRows.value = WARN_ROWS[activeCat.value] ?? []
  } finally {
    loading.value = false
  }
}

/** 类别页签：显示类别名 + 各类记录数角标 */
const catTabs = computed(() =>
  WARN_CATS.map((c) => ({ key: c.key, label: c.key, badge: WARN_ROWS[c.key].length }))
)

/** 切换预警类别 tab：清空搜索词与旧类别数据（避免新列插槽渲染到旧类别行导致字段缺失） */
function switchCat(key: WarnCat) {
  if (activeCat.value === key) {
    return
  }
  activeCat.value = key
  keyword.value = ''
  allRows.value = []
  fetchData()
}

/**
 * 打开弹框：展示指定类别预警明细列表
 * @param cat 预警类别（临界许可/超许可/超计划/计量异常）
 * @param date 统计口径日期（父级预警信息标题处的日期选择值）
 */
const show = (cat: string, date: string) => {
  activeCat.value = (WARN_CATS.find((c) => c.key === cat)?.key ?? '临界许可') as WarnCat
  curDate.value = date
  keyword.value = ''
  allRows.value = []
  visible.value = true
  fetchData()
}

const hide = () => {
  visible.value = false
  rowVisible.value = false
}

/* ==================== 单条预警详情弹框（复刻原型 openWarnRow） ==================== */
/** 详情字段：标签 + 值（彩色值用 tone 区分） */
interface DetailKv {
  k: string
  v: string
  tone?: 'red' | 'orange' | 'blue' | 'green' | 'muted'
}

const rowVisible = ref(false)
const curRow = ref<WarnRow | null>(null)
const handling = ref(false)
const resInput = ref('')

/** 详情弹框页签：预警详情 / 水量分析（样式对齐 PlanCertModal） */
const detailTab = ref<'info' | 'water'>('info')
const detailTabs = [
  { key: 'info', label: '预警详情' },
  { key: 'water', label: '水量分析' }
] as const
/** 水量分析粒度与年份 */
const wGran = ref<'month' | 'year'>('month')
const wYear = ref('2026')
/** 年份下拉选项：当前年 + 上一年 */
const wYears = computed(() => [wYear.value, String(+wYear.value - 1)])

/** 表格行点击：打开当前行的预警详情 */
function onCellClick({ row }: { row: WarnRow }) {
  curRow.value = row
  handling.value = false
  resInput.value = row.res ?? ''
  detailTab.value = 'info'
  wGran.value = 'month'
  wYear.value = (row.date || '2026').slice(0, 4)
  rowVisible.value = true
}

/** 详情字段清单（按预警类别差异化，字段口径与原型一致） */
const detailKv = computed<DetailKv[]>(() => {
  const r = curRow.value
  if (!r) {
    return []
  }
  const kv: DetailKv[] = [
    { k: '预警类别', v: activeCat.value },
    { k: '许可证编号', v: r.cert },
    { k: '取水权人名称', v: r.owner },
    { k: '取水口 / 监测点', v: r.gate },
    { k: '监管单位', v: r.org }
  ]
  if (activeCat.value === '临界许可') {
    kv.push(
      { k: '许可水量', v: `${r.perm.toLocaleString()} 万m³` },
      { k: '实际取水量', v: `${r.fact.toLocaleString()} 万m³` },
      { k: '年度取水计划', v: `${(r.plan ?? 0).toLocaleString()} 万m³` },
      { k: '剩余许可水量', v: `${(r.perm - r.fact).toLocaleString()} 万m³`, tone: 'blue' }
    )
  } else if (activeCat.value === '超许可') {
    kv.push(
      { k: '许可水量', v: `${r.perm.toLocaleString()} 万m³` },
      { k: '实际取水量', v: `${r.fact.toLocaleString()} 万m³` },
      { k: '超出水量', v: `+${(r.over ?? 0).toLocaleString()} 万m³`, tone: 'red' },
      { k: '超出比例', v: `${(r.overPct ?? 0).toFixed(2)}%`, tone: 'red' }
    )
  } else if (activeCat.value === '超计划') {
    const hi = (r.overPct ?? 0) >= 5
    kv.push(
      { k: '年度取水计划', v: `${(r.plan ?? 0).toLocaleString()} 万m³` },
      { k: '实际取水量', v: `${r.fact.toLocaleString()} 万m³` },
      { k: '超出计划', v: `+${(r.over ?? 0).toLocaleString()} 万m³`, tone: hi ? 'red' : 'orange' },
      { k: '超出比例', v: `${(r.overPct ?? 0).toFixed(2)}%`, tone: hi ? 'red' : 'orange' }
    )
  } else {
    const missing = r.xc === '数据缺失'
    const d0 = r.d0
    kv.push(
      { k: '计量设施', v: `${r.dev || '—'}（${r.devNo || '—'}）` },
      { k: '异常类型', v: r.xc || '—', tone: missing ? 'red' : 'orange' },
      {
        k: '当日水量',
        v: d0 === null || d0 === undefined ? '未采集（数据缺失）' : `${d0.toFixed(1)} 万m³`,
        tone: d0 === null || d0 === undefined ? 'muted' : r.xc === '数据突变' ? 'red' : undefined
      },
      { k: '上一日水量', v: `${(r.d1 ?? 0).toFixed(1)} 万m³` },
      { k: '异常次数', v: `${r.cnt ?? 0} 次` },
      { k: '最近异常时间', v: r.last || '—' },
      { k: '累计影响时长', v: `${(r.loss ?? 0).toFixed(1)} 小时` }
    )
  }
  kv.push(
    { k: '预警日期', v: r.date },
    { k: '当前状态', v: r.st, tone: r.st === '已处理' ? 'green' : 'orange' },
    { k: '数据来源', v: '取用水在线监测' }
  )
  if (r.st === '已处理') {
    kv.push({ k: '处理结果', v: r.res || '已办结', tone: 'green' })
  }
  return kv
})

/** 处置说明（长文本，置于字段栅格下方） */
const detailNote = computed<DetailKv | null>(() => {
  const r = curRow.value
  if (!r) {
    return null
  }
  if (activeCat.value === '临界许可') {
    return {
      k: '处置建议',
      v: '纳入下年度计划核减参考；继续监测，取水量达到许可水量时自动升级为超许可预警。'
    }
  }
  if (activeCat.value === '超许可') {
    return { k: '处置情况', v: r.note || '—' }
  }
  if (activeCat.value === '超计划') {
    const hi = (r.overPct ?? 0) >= 5
    return {
      k: '超计划判定',
      v: hi ? '超出比例 ≥ 5%，纳入超计划预警，需书面说明' : '超出比例 < 5%，提醒关注'
    }
  }
  return { k: '异常说明', v: r.note || '—' }
})

/** 栅格补齐：字段数为奇数时补空项，保证四列栅格不留半行 */
const gridKv = computed(() => {
  const list: (DetailKv & { blank?: boolean })[] = detailKv.value.slice()
  if (list.length % 2 === 1) {
    list.push({ k: '', v: '', blank: true })
  }
  return list
})

/* ==================== 水量分析（布局与 PlanCertModal 一致） ==================== */

/** 确定性伪随机，保证同一记录每次渲染数值一致 */
function seedOf(i: number, j: number): number {
  const x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
  return x - Math.floor(x)
}

const MONTH_LABELS = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月'
]

/** 农业灌溉月度权重（夏季集中，贴合取用水规律） */
const MONTH_WEIGHTS = [2, 3, 6, 9, 13, 16, 15, 12, 9, 6, 3, 2]

function fmtNum(x: number | null | undefined): string {
  return x === null || x === undefined ? '—' : Number(x).toLocaleString()
}

/** 月/年水量序列（由当前预警记录的许可量、计划量、实际量派生） */
const waterSeries = computed(() => {
  const r = curRow.value
  const planTotal = r ? (r.plan ?? Math.round(r.perm * 0.95)) : 0
  const ratio = r && planTotal > 0 ? r.fact / planTotal : 1
  const wSum = MONTH_WEIGHTS.reduce((a, b) => a + b, 0)
  const round1 = (v: number) => Math.round(v * 10) / 10
  const plan = MONTH_WEIGHTS.map((w, i) =>
    round1(planTotal * (w / wSum) * (0.98 + 0.04 * seedOf(1, i)))
  )
  const planPrev = plan.map((v) => round1(v * 0.97))
  const onl = plan.map((v, i) => round1(v * ratio * (0.98 + 0.04 * seedOf(2, i))))
  const rep = onl.map((v, i) => round1(v * (0.96 + 0.06 * seedOf(3, i))))
  const sum = (a: number[]) => round1(a.reduce((x, y) => x + y, 0))
  return {
    plan,
    planPrev,
    onl,
    rep,
    planSum: sum(plan),
    prevSum: sum(planPrev),
    onlSum: sum(onl),
    repSum: sum(rep)
  }
})

/** 统计卡（5 项，与参考弹框一致） */
const waterStats = computed(() => [
  { k: '许可水量', n: fmtNum(curRow.value?.perm) },
  { k: '年度计划水量', n: fmtNum(waterSeries.value.planSum) },
  { k: '上年计划水量', n: fmtNum(waterSeries.value.prevSum) },
  { k: '在线水量', n: fmtNum(waterSeries.value.onlSum) },
  { k: '上报水量', n: fmtNum(waterSeries.value.repSum) }
])

/** 明细表数据：月粒度 12 行 / 年粒度 3 行 */
const waterTable = computed(() => {
  const s = waterSeries.value
  if (wGran.value === 'month') {
    return {
      head: ['月份', `${wYear.value}年计划`, `${+wYear.value - 1}年计划`, '在线水量', '上报水量'],
      rows: MONTH_LABELS.map((lb, i) => [
        lb,
        fmtNum(s.plan[i]),
        fmtNum(s.planPrev[i]),
        fmtNum(s.onl[i]),
        fmtNum(s.rep[i])
      ])
    }
  }
  const ys = [String(+wYear.value - 2), String(+wYear.value - 1), wYear.value]
  return {
    head: ['年份', '许可水量', '计划水量', '在线水量', '上报水量'],
    rows: ys.map((y, i) => {
      const k = 1 - i * 0.035
      return [
        y,
        fmtNum(curRow.value?.perm),
        fmtNum(Math.round(s.planSum * k * 10) / 10),
        fmtNum(Math.round(s.onlSum * k * 10) / 10),
        fmtNum(Math.round(s.repSum * k * 10) / 10)
      ]
    })
  }
})

/** 明细表行（字符串数组转具名字段，便于 ProTable 列渲染） */
const waterRows = computed(() =>
  waterTable.value.rows.map((r, i) => ({
    id: i,
    c0: r[0],
    c1: r[1],
    c2: r[2],
    c3: r[3],
    c4: r[4]
  }))
)

/** 明细表列（表头随「月 / 年」切换） */
const waterColumns = computed<VxeGridPropTypes.Columns>(() =>
  waterTable.value.head.map((h, i) => ({
    field: `c${i}`,
    title: h,
    minWidth: 80,
    align: 'center' as const
  }))
)

/** 折线/柱状图（配色与参考弹框一致） */
const wChartRef = ref<HTMLDivElement | null>(null)
const { setOptions } = useECharts(wChartRef as Ref<HTMLDivElement>, 'light')

function drawWaterChart() {
  if (detailTab.value !== 'water') {
    return
  }
  const s = waterSeries.value
  const isMonth = wGran.value === 'month'
  const labels = isMonth ? MONTH_LABELS : waterTable.value.rows.map((r) => r[0])
  const agg = (idx: number) =>
    waterTable.value.rows.map((r) => Number(String(r[idx]).replace(/,/g, '')) || 0)
  const planArr = isMonth ? s.plan : agg(2)
  const prevArr = isMonth ? s.planPrev : agg(2).map((v) => Math.round(v * 0.98 * 10) / 10)
  const onlArr = isMonth ? s.onl : agg(3)
  const repArr = isMonth ? s.rep : agg(4)
  setOptions({
    backgroundColor: 'transparent',
    grid: { left: 56, right: 16, top: 36, bottom: 26 },
    legend: {
      top: 2,
      textStyle: { color: '#5a7ba6', fontSize: 12 },
      data: [`${wYear.value}年计划`, `${+wYear.value - 1}年计划`, '在线水量', '上报水量']
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: '#c9dcf2' } },
      axisLabel: { color: '#6b87a8' }
    },
    yAxis: {
      type: 'value',
      name: '万m3',
      nameTextStyle: { color: '#6b87a8' },
      axisLabel: { color: '#6b87a8' },
      splitLine: { lineStyle: { color: '#eaf1f9' } }
    },
    series: [
      {
        name: `${wYear.value}年计划`,
        type: 'bar',
        data: planArr,
        barWidth: 9,
        itemStyle: { color: '#2fa8dc' }
      },
      {
        name: `${+wYear.value - 1}年计划`,
        type: 'bar',
        data: prevArr,
        barWidth: 9,
        itemStyle: { color: '#1f6fd6' }
      },
      {
        name: '在线水量',
        type: 'line',
        data: onlArr,
        symbolSize: 7,
        itemStyle: { color: '#c04ad0' },
        lineStyle: { width: 2 }
      },
      {
        name: '上报水量',
        type: 'line',
        data: repArr,
        symbolSize: 7,
        itemStyle: { color: '#f0912e' },
        lineStyle: { width: 2 }
      }
    ]
  })
}

/** 切页签 / 切粒度 / 切年份 / 重新打开时重绘图表 */
watch([detailTab, wGran, wYear, rowVisible], () => {
  if (detailTab.value === 'water' && rowVisible.value) {
    nextTick(() => drawWaterChart())
  }
})

/** 立即处置：切回预警详情页签并展开处理结果录入（原型交互） */
function startHandle() {
  detailTab.value = 'info'
  handling.value = true
}

/** 提交处理结果：状态改为已处理，写入处置说明并关闭详情 */
function submitHandle() {
  const r = curRow.value
  if (!r) {
    return
  }
  const txt = resInput.value.trim()
  if (!txt) {
    window.$message?.warning('请先填写处理结果')
    return
  }
  r.st = '已处理'
  r.res = txt
  window.$message?.success(`预警已处置：${r.owner}`)
  rowVisible.value = false
}

defineExpose({ show, hide })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    :title="`预警信息 · ${activeCat}（${curDate}）`"
    :style-params="{ width: '1320px', height: '680px' }"
    content-mode="fill"
  >
    <div class="warn-detail">
      <!-- 类别 Tabs：4 类预警切换，徽标为各类记录数 -->
      <pro-tabs :model-value="activeCat" :items="catTabs" class="cat-tabs" @change="switchCat" />

      <!-- 工具栏：统计口径时间 + 模糊搜索 -->
      <div class="toolbar">
        <span class="lb">时间</span>
        <span class="date-txt">{{ curDate }}</span>
        <n-input
          v-model:value="keyword"
          size="small"
          class="srch"
          placeholder="搜索许可证编号 / 取水权人 / 取水口名称…"
          clearable
        />
      </div>

      <!-- 类别说明 -->
      <div class="cat-desc">{{ catInfo.desc }}</div>

      <!-- 明细列表（列随类别差异化，彩色单元格用插槽渲染） -->
      <div class="table-wrap pt-table-wrap">
        <pro-table
          :columns="columns"
          :data="filteredRows"
          :loading="loading"
          :is-pagination="false"
          table-theme="light"
          height="auto"
          :row-config="{ isHover: true }"
          @cell-click="onCellClick"
        >
          <template #cert="{ row }">
            <span class="cell-cert">{{ row.cert }}</span>
          </template>
          <template #num="{ row, column }">
            <b>{{ (row[column.field] ?? 0).toLocaleString() }}</b>
          </template>
          <template #rate="{ row }">
            <b :style="{ color: rateColor(row.rate ?? 0) }">{{ (row.rate ?? 0).toFixed(1) }}%</b>
          </template>
          <template #over="{ row }">
            <b :style="{ color: overColor(row) }">+{{ (row.over ?? 0).toLocaleString() }}</b>
          </template>
          <template #overPct="{ row }">
            <b :style="{ color: overColor(row) }">{{ (row.overPct ?? 0).toFixed(2) }}%</b>
          </template>
          <template #xc="{ row }">
            <b :style="{ color: row.xc === '数据缺失' ? '#f5222d' : '#fa8c16' }">{{ row.xc }}</b>
          </template>
          <template #d0="{ row }">
            <span v-if="row.d0 == null" class="cell-sub">未采集</span>
            <b v-else :style="{ color: row.xc === '数据突变' ? '#f5222d' : undefined }">
              {{ row.d0.toFixed(1) }}
            </b>
          </template>
          <template #d1="{ row }">
            <b>{{ row.d1.toFixed(1) }}</b>
          </template>
          <template #cnt="{ row }">
            <b :style="{ color: row.cnt >= 5 ? '#f5222d' : '#fa8c16' }">{{ row.cnt }}</b>
            <div v-if="row.cnt >= 5" class="cell-sub">≥5 次</div>
          </template>
          <template #st="{ row }">
            <span class="st-tag" :class="row.st === '已处理' ? 'is-done' : 'is-pending'">
              {{ row.st }}
            </span>
          </template>
          <template #res="{ row }">
            <span v-if="row.st === '已处理'" class="cell-res">{{ row.res || '已办结' }}</span>
            <span v-else class="cell-res none">—</span>
          </template>
        </pro-table>
      </div>

      <!-- 底部统计 -->
      <div class="foot">
        <span
          >{{ curDate }} 共 <b>{{ filteredRows.length }}</b> 条明细（{{ activeCat }}）｜全量
          <b>{{ allRows.length }}</b> 条</span
        >
      </div>
    </div>
  </pro-modal>

  <!-- 单条预警详情弹框（点击列表行打开；视觉样式对齐 PlanCertModal 详情） -->
  <pro-modal
    v-model:show="rowVisible"
    :title="`${curRow?.gate || '预警'} 详情`"
    table-theme="light"
    content-mode="scroll"
    default-padding="12px 24px 10px"
    :style-params="{ width: '1060px', height: '700px' }"
  >
    <!-- 页签：预警详情 / 水量分析 -->
    <pro-tabs v-model="detailTab" :items="detailTabs" class="wrn-tabs" />

    <!-- 页签一：字段栅格（四列 标签|值，样式取自 lic.detail-kv） -->
    <div v-if="detailTab === 'info'">
      <div class="wrnkv">
        <template v-for="(item, i) in gridKv" :key="i">
          <span class="k" :class="{ blank: item.blank }">{{ item.k }}</span>
          <span class="v" :class="[item.tone, { blank: item.blank, empty: !item.v }]">{{
            item.v || '—'
          }}</span>
        </template>
      </div>

      <!-- 处置说明（长文本） -->
      <div v-if="detailNote" class="wrn-note">
        <span class="k">{{ detailNote.k }}</span>
        <span class="v">{{ detailNote.v }}</span>
      </div>

      <!-- 处理结果录入（原型「立即处置」展开） -->
      <div v-if="handling" class="warnres">
        <div class="warnres-lb">处理结果</div>
        <textarea
          v-model="resInput"
          class="warnres-ipt"
          rows="3"
          placeholder="请填写处理结果，例如：已通知取水权人整改，复核取水台账…"
        ></textarea>
        <div class="warnres-btns">
          <button class="lcm-btn" type="button" @click="handling = false">取 消</button>
          <button class="lcm-btn primary" type="button" @click="submitHandle">提交处理结果</button>
        </div>
      </div>
    </div>

    <!-- 页签二：水量分析（月/年粒度 + 统计卡 + 图表 + ProTable 明细） -->
    <template v-else>
      <div class="wrnbar">
        <div class="wrnseg">
          <span :class="{ on: wGran === 'month' }" @click="wGran = 'month'">月</span>
          <span :class="{ on: wGran === 'year' }" @click="wGran = 'year'">年</span>
        </div>
        <select v-model="wYear" class="wrnyear">
          <option v-for="y in wYears" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>

      <div class="wrnstats">
        <div v-for="s in waterStats" :key="s.k" class="wrnst">
          <div class="k">{{ s.k }}</div>
          <div class="n">{{ s.n }}</div>
        </div>
      </div>

      <div class="wrnsplit">
        <div ref="wChartRef" class="wrnchart"></div>
        <div class="wrntbl pt-table-wrap">
          <pro-table :columns="waterColumns" :data="waterRows" :is-pagination="false" height="" />
        </div>
      </div>
    </template>

    <template v-if="!handling" #action>
      <div class="lcm-foot">
        <button class="lcm-btn" type="button" @click="rowVisible = false">关 闭</button>
        <button class="lcm-btn primary" type="button" @click="startHandle">立即处置</button>
      </div>
    </template>
  </pro-modal>
</template>

<style scoped lang="scss">
@use '@/assets/style/lic-modal-common.scss' as lic;

/* 弹框内容纵向布局：tabs / 工具栏 / 说明固定，表格占满剩余高度 */
.warn-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.table-wrap {
  flex: 1;
  min-height: 0;

  /* 语义化扩展：行可点击查看预警详情 */
  :deep(.vxe-body--row) {
    cursor: pointer;
  }
}

/* 单元格样式（表格列插槽内容，配色适配白色背景） */
.cell-cert {
  color: #1677ff;
  font-weight: 500;
  font-size: 15px;
}

.cell-sub {
  font-size: 11.5px;
  color: rgba(0, 0, 0, 0.45);
}

.cell-res {
  color: #389e0d;
  line-height: 1.55;

  &.none {
    color: rgba(0, 0, 0, 0.3);
  }
}

/* 状态徽标：待处理 橙 / 已处理 绿（浅底配色） */
.st-tag {
  display: inline-block;
  font-size: 11.5px;
  border-radius: 9px;
  padding: 1px 8px;
  line-height: 16px;
  white-space: nowrap;

  &.is-pending {
    background: rgba(250, 140, 22, 0.12);
    color: #d46b08;
    border: 1px solid rgba(250, 140, 22, 0.55);
  }

  &.is-done {
    background: rgba(82, 196, 26, 0.12);
    color: #389e0d;
    border: 1px solid rgba(82, 196, 26, 0.5);
  }
}

/* 类别 Tabs（组件 ProTabs），仅控制与下方工具栏的间距 */
.cat-tabs {
  margin-bottom: 12px;
}

/* 工具栏：时间口径 + 模糊搜索 */
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #4e6a94;

  .lb {
    white-space: nowrap;
  }

  .date-txt {
    padding: 3px 10px;
    border: 1px solid rgba(55, 122, 236, 0.3);
    border-radius: 3px;
    background: #f2f7ff;
    color: #1f3b63;
    font-size: 12.5px;
  }

  .srch {
    margin-left: auto;
    width: 300px;
  }
}

/* 类别口径说明 */
.cat-desc {
  font-size: 12.5px;
  color: rgba(31, 59, 99, 0.65);
  line-height: 1.7;
  margin-bottom: 10px;
}

/* 底部统计行 */
.foot {
  display: flex;
  align-items: center;
  padding-top: 10px;
  font-size: 12.5px;
  color: rgba(31, 59, 99, 0.65);

  b {
    color: #377aec;
  }
}

/* ==================== 单条预警详情弹框（样式对齐 PlanCertModal） ==================== */

/* 页签（组件 ProTabs），仅控制与下方内容的间距 */
.wrn-tabs {
  margin-bottom: 12px;
}

/* 预警详情：四列字段栅格（标签 | 值）× 2，样式取自公共 lic(detail-kv) */
.wrnkv {
  @include lic.detail-kv;

  padding-bottom: 4px;

  .k.blank,
  .v.blank {
    border-bottom: 0;
  }

  .v.red {
    color: lic.$c-req;
  }

  .v.orange {
    color: #d99100;
  }

  .v.blue {
    color: #0e7fa8;
  }

  .v.green {
    color: #1d7a55;
  }

  .v.muted {
    font-weight: 400;
    color: #7d8fa3;
  }
}

/* 处置说明（长文本，浅底卡片，与统计卡同一视觉语言） */
.wrn-note {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  column-gap: 22px;
  margin-top: 10px;
  padding: 10px 14px;
  font-size: lic.$font-title;
  line-height: 1.7;
  background: #f9fbfe;
  border: 1px solid #e3ecf7;
  border-radius: 6px;

  .k {
    color: lic.$c-secondary;
    white-space: nowrap;
  }

  .v {
    color: lic.$c-text;
    word-break: break-all;
  }
}

/* 工具条：月/年粒度 + 年份 */
.wrnbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.wrnseg {
  display: inline-flex;
  overflow: hidden;
  border: 1px solid #c2d7ef;
  border-radius: 3px;

  span {
    padding: 4px 16px;
    font-size: lic.$font-sm;
    color: lic.$c-text;
    cursor: pointer;
    background: #fff;

    &.on {
      color: #fff;
      background: lic.$c-blue;
    }
  }
}

.wrnyear {
  @include lic.input;

  width: 96px;
}

/* 统计卡（5 项） */
.wrnstats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.wrnst {
  padding: 10px 14px;
  background: #f9fbfe;
  border: 1px solid #e3ecf7;
  border-radius: 6px;

  .k {
    font-size: lic.$font-xs;
    color: lic.$c-secondary;
  }

  .n {
    margin-top: 2px;
    font-size: 20px;
    font-weight: 800;
    color: lic.$c-blue-deep;
  }
}

/* 图表 + 明细表 */
.wrnsplit {
  display: flex;
  gap: 14px;
  align-items: stretch;
}

.wrnchart {
  /* 图表 : 数据表 = 1.1 : 1，保证 16px 标准表头在小表内不换行、不裁切 */
  flex: 1.1;
  min-width: 0;
  height: 320px;
  background: #fff;
  border: 1px solid #e3ecf7;
  border-radius: 6px;
}

.wrntbl {
  flex: 1;
  min-width: 0;
  max-height: 320px;

  /* 数据表纵向滚动（容器描边 / 圆角由 .pt-table-wrap 统一提供） */
  &.pt-table-wrap {
    overflow: auto;
  }

  /* 语义化扩展：数值列蓝色（尺寸与内边距沿用全局标准） */
  :deep(.vxe-body--column .vxe-cell) {
    color: lic.$c-blue-deep;
  }
}

/* 处理结果录入（原型 .warnres） */
.warnres {
  margin-top: 12px;
}

.warnres-lb {
  margin-bottom: 6px;
  font-size: lic.$font-title;
  color: lic.$c-secondary;
}

.warnres-ipt {
  box-sizing: border-box;
  width: 100%;
  min-height: 76px;
  padding: 8px 10px;
  font-family: inherit;
  font-size: lic.$font-title;
  line-height: 1.7;
  color: #1c3a5e;
  resize: vertical;
  background: #fff;
  border: 1px solid lic.$c-blue-border;
  border-radius: 5px;
  outline: none;

  &:focus {
    border-color: lic.$c-focus;
    box-shadow: 0 0 0 2px rgba(63, 151, 242, 0.18);
  }
}

.warnres-btns {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 14px;
}

/* 底部按钮（原型 .lcm-foot / .lcm-btn） */
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
    background: linear-gradient(180deg, #4fa0f4, #1f6fd6);
  }

  &:hover {
    filter: brightness(1.06);
  }
}
</style>
