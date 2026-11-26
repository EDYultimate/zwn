<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getLydsSums, getLydsPeriod, getLydsLuru } from '@/api/waterdisp'

/**
 * 流域调水详情 —— 旧项目内容块（2026-09-23 复刻，按旧页面版式）
 *
 * 旧项目（portal/src/view/water_tr/lyds）每块版式：
 *   ① 通水累计（Page_c）：「自 YYYY 年 M 月 至 YYYY 年 M 月」区间行 + 「常规水量累计：X 亿m³」+ 本月（万m³）/ 本年（亿m³）两格
 *   ② 调度年进度（Progress_p/c）：「2026.07 - 2027.06 调度年」+ 已完成（万m³）+ 进度条 + 计划供水量（万m³）
 *   ③ 季度累计（Page_c_quarter，山西/滦河/滹沱河）：自 2025.07 起的季度上传口径
 * 数据源 PORTAL_SYS（MONTH_DATA / PERIOD / SZY_LURU_DATA），口径同旧 gainLydsDataByIds / period / getLuruLastData。
 *
 * 用法（两处共用一份数据缓存，不重复请求）：
 *   <LydsBlocks :line-cd="lineCd" mode="total" />                      <!-- 页签上方：全线通水累计 + 全线调度年进度 -->
 *   <LydsBlocks :line-cd="lineCd" :group-nm="当前分组名" mode="group" />  <!-- 页签内容顶部：本省/分组块 + 进度 + 各工程块 -->
 */

/** 单个工程/断面块配置：id（MONTH_DATA.SITE id）+ 显示名 + 累计起始（年 或 'YYYY-MM'） */
interface ItemCfg {
  id: string
  name: string
  start: string | number
}
/** 分组（= 页签名）配置 */
interface GroupCfg {
  /** 该分组合计的累计起始（年 或 'YYYY-MM'） */
  start: string | number
  items: ItemCfg[]
}
interface LydsCfg {
  /** 全线块标题（旧页面：漳河通水累计 / 引滦工程通水累计 …） */
  title: string
  /** 全线累计起始 */
  start: string | number
  /** 分组名（页签名）→ 分组配置 */
  groups: Record<string, GroupCfg>
  /** 分组 → 调度年进度 ids（PERIOD.ID，组合 id 原样保留逗号） */
  periods?: Record<string, string[]>
  /** 全线调度年进度 ids（旧 Progress_p：全线合计） */
  totalPeriods?: string[]
  /** 季度块（山西/滦河/滹沱河）：分组 → { 起始, 明细 } */
  quarters?: Record<string, { start: string; items: ItemCfg[] }>
}

/** 每条线路配置（对照旧项目 wwtr_1~7；起始年取自旧页面各块标题） */
const LYDS_CFG: Record<string, LydsCfg> = {
  // 漳河（旧 wwtr_3）：全线自1983年；河南/河北自1963年；山西为季度上传（清漳河/浊漳河，自2025年7月）
  ZH: {
    title: '漳河通水累计',
    start: 1983,
    groups: {
      河南省: {
        start: 1963,
        items: [
          { id: 'ZYJD000011', name: '红旗渠', start: 1993 },
          { id: 'ZYJD000013', name: '跃进渠', start: 1993 },
          { id: 'ZYJD000019', name: '漳南渠', start: 1963 },
          { id: 'ZYJD000017', name: '引岳入安管道', start: 1996 }
        ]
      },
      河北省: {
        start: 1963,
        items: [
          { id: 'ZYJD000014', name: '大跃峰渠', start: 1993 },
          { id: 'ZYJD000015', name: '小跃峰渠', start: 1993 },
          { id: 'ZYJD000018', name: '民有渠', start: 1963 },
          { id: 'ZYJD000016', name: '引岳济邯管道', start: 1999 }
        ]
      }
    },
    periods: {
      河南省: ['ZYJD000011', 'ZYJD000013', 'ZYJD000019,ZYJD000017'],
      河北省: ['ZYJD000014', 'ZYJD000015', 'ZYJD000018,ZYJD000016']
    },
    totalPeriods: [
      'ZYJD000011',
      'ZYJD000013',
      'ZYJD000014',
      'ZYJD000015',
      'ZYJD000018,ZYJD000016',
      'ZYJD000019,ZYJD000017'
    ],
    quarters: {
      山西省: {
        start: '2025-07',
        items: [
          { id: 'LRSJ_ZH_QZH', name: '清漳河', start: '2025-07' },
          { id: 'LRSJ_ZH_ZZH', name: '浊漳河', start: '2025-07' }
        ]
      }
    }
  },
  // 引滦工程（旧 wwtr_1）：引滦入津 / 引滦入唐 / 滦河下游（自1980/1984年）
  LD: {
    title: '引滦工程通水累计',
    start: 1980,
    groups: {
      引滦工程: {
        start: 1980,
        items: [
          { id: 'ZYJD00001', name: '引滦入津', start: 1983 },
          { id: 'ZYJD00002', name: '引滦入唐', start: 1983 },
          { id: 'ZYJD00003', name: '滦河下游', start: 1980 }
        ]
      }
    },
    periods: { 引滦工程: ['ZYJD00001', 'ZYJD00002,ZYJD00003'] },
    totalPeriods: ['ZYJD00001', 'ZYJD00002,ZYJD00003']
  },
  // 引黄入冀（旧 wwtr_4）：渠村/位山/潘庄/李家岸等（自1992/2011/2017年）
  YH_YJ: {
    title: '引黄入冀通水累计',
    start: 1992,
    groups: {
      引黄入冀: {
        start: 1992,
        items: [
          { id: 'ZYJD000020', name: '渠村闸', start: 1992 },
          { id: 'ZYJD000022', name: '穿卫出口闸', start: 1992 },
          { id: 'ZYJD000021', name: '大树刘泵站（入淀）', start: 2011 },
          { id: 'ZYJD000023', name: '位山闸', start: 2011 },
          { id: 'ZYJD000024-01', name: '穿卫枢纽-位山', start: 2011 },
          { id: 'ZYJD000026', name: '潘庄闸', start: 2011 },
          { id: 'ZYJD000027-01', name: '第三店-潘庄', start: 2011 },
          { id: 'ZYJD000028', name: '李家岸闸', start: 2011 },
          { id: 'ZYJD000030', name: '穿漳卫新河倒虹吸', start: 2017 },
          { id: 'ZYJD000032', name: '穿漳卫新河倒虹吸（二）', start: 2011 }
        ]
      }
    },
    periods: { 引黄入冀: ['ZYJD000020', 'ZYJD000023', 'ZYJD000026', 'ZYJD000028'] },
    totalPeriods: ['ZYJD000020', 'ZYJD000023', 'ZYJD000026', 'ZYJD000028']
  },
  // 南水北调（旧 wwtr_5）：受水区（省）+ 工程断面（自2014/2019年）
  NSBD: {
    title: '南水北调通水累计',
    start: 2014,
    groups: {
      南水北调: {
        start: 2014,
        items: [
          { id: '28', name: '北京市', start: 2020 },
          { id: '29', name: '天津市', start: 2020 },
          { id: '30', name: '河北省', start: 2020 },
          { id: '31', name: '河南省', start: 2020 },
          { id: '32', name: '雄安新区', start: 2020 },
          { id: 'ZYJD000029-01', name: '穿黄工程出口-东线', start: 2020 },
          { id: 'ZYJD000029-02', name: '穿黄工程出口-北延', start: 2020 },
          { id: 'ZYJD000027-03', name: '第三店-北延', start: 2020 },
          { id: 'ZYJD000024-02', name: '穿卫枢纽-北延', start: 2020 },
          { id: 'ZYJD000025-01', name: '九宣闸-北延', start: 2020 }
        ]
      }
    },
    periods: {
      南水北调: [
        'ZYJD000029-01',
        'ZYJD000029-02',
        'ZYJD000027-03',
        'ZYJD000024-02',
        'ZYJD000025-01'
      ]
    },
    totalPeriods: [
      'ZYJD000029-01',
      'ZYJD000029-02',
      'ZYJD000027-03',
      'ZYJD000024-02',
      'ZYJD000025-01'
    ]
  },
  // 滦河（旧 wwtr_6）：全部为季度上传（自2025年7月），按页签分组
  LH: {
    title: '滦河通水累计',
    start: '2025-07',
    groups: {},
    quarters: {
      河北省: {
        start: '2025-07',
        items: [
          { id: 'LRSJ_LH_HB', name: '河北省', start: '2025-07' },
          { id: 'LRSJ_LH_SDH', name: '闪电河以上', start: '2025-07' },
          { id: 'LRSJ_LH_XSW', name: '西山湾-潘家口', start: '2025-07' },
          { id: 'LRSJ_LH_PJK', name: '潘家口-入海口', start: '2025-07' }
        ]
      },
      天津市: { start: '2025-07', items: [{ id: 'LRSJ_LH_TJ', name: '天津市', start: '2025-07' }] },
      内蒙古: {
        start: '2025-07',
        items: [{ id: 'LRSJ_LH_NMG', name: '内蒙古', start: '2025-07' }]
      },
      辽宁省: { start: '2025-07', items: [{ id: 'LRSJ_LH_LN', name: '辽宁省', start: '2025-07' }] }
    }
  },
  // 滹沱河（旧 wwtr_7）：季度上传（自2025年）
  HT: {
    title: '滹沱河通水累计',
    start: 2025,
    groups: {},
    quarters: {
      河北省: { start: 2025, items: [{ id: 'LRSJ_HTH_HB', name: '河北省', start: 2025 }] },
      山西省: {
        start: 2025,
        items: [
          { id: 'LRSJ_HTH_SX', name: '山西省', start: 2025 },
          { id: 'LRSJ_HTH_HEJI', name: '虚拟断面合计', start: 2025 }
        ]
      }
    }
  }
}

/** 线路级数据缓存（两个实例共用，避免重复请求）；key = lineCd */
interface LydsData {
  sums: Record<string, any>
  total: any
  tm: string
  periods: any[]
  luru: Record<string, any>
  luruTm: Record<string, string>
}
const lydsCache = new Map<string, LydsData>()
const pending = new Map<string, Promise<LydsData>>()

function allIds(cfg: LydsCfg): string[] {
  const out: string[] = []
  Object.values(cfg.groups || {}).forEach((g) => g.items.forEach((it) => out.push(it.id)))
  Object.values(cfg.quarters || {}).forEach((q) => q.items.forEach((it) => out.push(it.id)))
  return Array.from(new Set(out))
}

function loadLyds(lineCd: string, cfg: LydsCfg): Promise<LydsData> {
  const hit = lydsCache.get(lineCd)
  if (hit) {
    return Promise.resolve(hit)
  }
  const inflight = pending.get(lineCd)
  if (inflight) {
    return inflight
  }
  const ids = allIds(cfg)
  const monthIds = ids.filter((i) => !i.startsWith('LRSJ_'))
  const luruIds = ids.filter((i) => i.startsWith('LRSJ_'))
  const periodIds = Array.from(
    new Set([...(cfg.totalPeriods || []), ...Object.values(cfg.periods || {}).flat()])
  )
  const p = (async (): Promise<LydsData> => {
    const data: LydsData = { sums: {}, total: null, tm: '', periods: [], luru: {}, luruTm: {} }
    try {
      if (monthIds.length) {
        const res = await getLydsSums({ ids: monthIds.join(';') })
        if (res.code === 0 && res.data) {
          data.sums = res.data.part || {}
          data.total = res.data.total || null
          data.tm = res.data.tm || ''
        }
      }
      if (periodIds.length) {
        const res = await getLydsPeriod({ ids: periodIds.join(';') })
        if (res.code === 0 && Array.isArray(res.data)) {
          data.periods = res.data
        }
      }
      if (luruIds.length) {
        const res = await getLydsLuru({ ids: luruIds.join(';') })
        if (res.code === 0 && Array.isArray(res.data)) {
          res.data.forEach((r: any) => {
            data.luru[r.ID] = Number(r.DATA) || 0
            data.luruTm[r.ID] = r.TM
          })
        }
      }
    } catch (e) {
      console.warn('LydsBlocks: 加载流域调水详情块失败', e)
    }
    lydsCache.set(lineCd, data)
    pending.delete(lineCd)
    return data
  })()
  pending.set(lineCd, p)
  return p
}

const props = withDefaults(
  defineProps<{
    lineCd: string
    /** 当前分组显示名（河南省/河北省/山西省…）；平铺/单分组线路不传 */
    groupNm?: string
    /** total=页签上方（全线块 + 全线进度）；group=页签内容（本分组块 + 进度 + 各工程块） */
    mode?: 'total' | 'group'
  }>(),
  { groupNm: '', mode: 'group' }
)

const cfg = computed<LydsCfg | null>(() => LYDS_CFG[props.lineCd] || null)
const groupNames = computed(() => [
  ...Object.keys(cfg.value?.groups || {}),
  ...Object.keys(cfg.value?.quarters || {})
])
const hasMultiGroups = computed(() => groupNames.value.length > 1)
const activeGroupNm = computed(() => props.groupNm || groupNames.value[0] || '')

const data = ref<LydsData>({ sums: {}, total: null, tm: '', periods: [], luru: {}, luruTm: {} })
async function load() {
  if (cfg.value) {
    data.value = await loadLyds(props.lineCd, cfg.value)
  }
}
watch(() => props.lineCd, load, { immediate: true })

// ---------------- 展示辅助 ----------------
const fmtYi = (wan: any, digits = 2) => {
  const n = Number(wan)
  return isFinite(n) ? (n / 10000).toFixed(digits) : '-'
}
const fmtWan = (wan: any, digits = 0) => {
  const n = Number(wan)
  return isFinite(n) ? n.toLocaleString('zh-CN', { maximumFractionDigits: digits }) : '-'
}
/** 数据期：yyyy年M月 */
const dataYm = computed(() => {
  const s = String(data.value.tm || '')
  return s.length >= 7 ? { y: s.slice(0, 4), m: String(Number(s.slice(5, 7))) } : { y: '-', m: '-' }
})
/** 起始（年 或 'YYYY-MM'）→ { y, m }；月缺省 1 */
function startYm(start: string | number) {
  const s = String(start)
  return s.includes('-') ? { y: s.slice(0, 4), m: String(Number(s.slice(5, 7))) } : { y: s, m: '1' }
}
const ymCn = (start: string | number) => {
  const s = startYm(start)
  return `${s.y}年${s.m}月`
}
const dataLabel = computed(() => `${dataYm.value.y}年${dataYm.value.m}月`)

/** 分组/工程取值：工程取该 id；分组 = 组内各 id 之和 */
function sumOf(ids: string[]) {
  const t = { month: 0, year: 0, zsd: 0 }
  ids.forEach((id) => {
    const r = data.value.sums[id]
    if (r) {
      t.month += Number(r.month) || 0
      t.year += Number(r.year) || 0
      t.zsd += Number(r.zsd) || 0
    }
  })
  return t
}
const activeGroup = computed(() => {
  const g = cfg.value?.groups?.[activeGroupNm.value]
  if (g) {
    return {
      type: 'month' as const,
      start: g.start,
      items: g.items,
      sum: sumOf(g.items.map((i) => i.id))
    }
  }
  const q = cfg.value?.quarters?.[activeGroupNm.value]
  if (q) {
    const sum = q.items.reduce((a, it) => a + (data.value.luru[it.id] || 0), 0)
    const tm = q.items.map((it) => data.value.luruTm[it.id]).filter(Boolean)[0] || ''
    return {
      type: 'quarter' as const,
      start: q.start,
      items: q.items,
      sum: { zsd: sum, month: 0, year: 0 },
      tm
    }
  }
  return null
})

/** 调度年进度：由多条 PERIOD 行组成（组合 id 如「民有渠、引岳济邯管道」） */
function periodBlock(ids: string[]) {
  const rows = ids.map((id) => data.value.periods.find((p) => String(p.ID) === id)).filter(Boolean)
  const plan = rows.reduce((a, p: any) => a + (Number(p.PLAN) || 0), 0)
  const done = rows.reduce((a, p: any) => a + (Number(p.DONE) || 0), 0)
  const tm = String(rows[0]?.TM || '').replace('_', ' - ')
  return {
    plan,
    done,
    tm,
    pct: plan > 0 ? Math.min(100, Math.max(0, Math.round((done / plan) * 100))) : 0
  }
}
const totalPeriod = computed(() => periodBlock(cfg.value?.totalPeriods || []))
const groupPeriod = computed(() => periodBlock(cfg.value?.periods?.[activeGroupNm.value] || []))
</script>

<template>
  <!-- ==================== 页签上方：全线通水累计 + 全线调度年进度 ==================== -->
  <div v-if="cfg && mode === 'total'" class="lb-wrap">
    <div v-if="data.total" class="lb-card">
      <div class="lb-head">{{ cfg.title }}</div>
      <div class="lb-range">自 {{ ymCn(cfg.start) }} 至 {{ dataLabel }}</div>
      <div class="lb-acc">
        常规水量累计：<b>{{ fmtYi(data.total?.zsd) }}</b> 亿m³
      </div>
      <div class="lb-two">
        <div class="lb-cell">
          <div class="lb-num month">
            {{ fmtWan(data.total?.month) }}<span class="lb-unit">万m³</span>
          </div>
          <div class="lb-sub">{{ dataLabel }}</div>
        </div>
        <div class="lb-cell">
          <div class="lb-num year">
            {{ fmtYi(data.total?.year) }}<span class="lb-unit">亿m³</span>
          </div>
          <div class="lb-sub">{{ dataYm.y }}年</div>
        </div>
      </div>
    </div>

    <div v-if="totalPeriod.tm" class="lb-card">
      <div class="lb-prog-head">
        <span>{{ totalPeriod.tm }} 调度年</span>
        <span class="lb-dot-done"
          >已完成：<b>{{ fmtWan(totalPeriod.done) }}</b> 万m³</span
        >
      </div>
      <div class="lb-bar"><i :style="{ width: totalPeriod.pct + '%' }"></i></div>
      <div class="lb-prog-foot">
        <span class="lb-dot-plan"
          >计划供水量：<b>{{ fmtWan(totalPeriod.plan) }}</b> 万m³</span
        >
        <span v-if="totalPeriod.plan" class="lb-pct">{{ totalPeriod.pct }}%</span>
      </div>
    </div>
  </div>

  <!-- ==================== 页签内容：本分组块 + 进度 + 各工程块 ==================== -->
  <div v-else-if="cfg && mode === 'group' && activeGroup" class="lb-wrap">
    <!-- 分组块（旧 Page_c is_p：省/分组合计） -->
    <div v-if="activeGroup.type === 'month'" class="lb-card">
      <div v-if="hasMultiGroups" class="lb-head">{{ activeGroupNm }}</div>
      <div class="lb-range">自 {{ ymCn(activeGroup.start) }} 至 {{ dataLabel }}</div>
      <div class="lb-acc">
        常规水量累计：<b>{{ fmtYi(activeGroup.sum.zsd) }}</b> 亿m³
      </div>
      <div class="lb-two">
        <div class="lb-cell">
          <div class="lb-num month">
            {{ fmtWan(activeGroup.sum.month) }}<span class="lb-unit">万m³</span>
          </div>
          <div class="lb-sub">{{ dataLabel }}</div>
        </div>
        <div class="lb-cell">
          <div class="lb-num year">
            {{ fmtYi(activeGroup.sum.year) }}<span class="lb-unit">亿m³</span>
          </div>
          <div class="lb-sub">{{ dataYm.y }}年</div>
        </div>
      </div>
    </div>

    <!-- 分组调度年进度（旧 Progress_c） -->
    <div v-if="groupPeriod.tm" class="lb-card">
      <div class="lb-prog-head">
        <span>{{ groupPeriod.tm }} 调度年</span>
        <span class="lb-dot-done"
          >已完成：<b>{{ fmtWan(groupPeriod.done) }}</b> 万m³</span
        >
      </div>
      <div class="lb-bar"><i :style="{ width: groupPeriod.pct + '%' }"></i></div>
      <div class="lb-prog-foot">
        <span class="lb-dot-plan"
          >计划供水量：<b>{{ fmtWan(groupPeriod.plan) }}</b> 万m³</span
        >
        <span v-if="groupPeriod.plan" class="lb-pct">{{ groupPeriod.pct }}%</span>
      </div>
    </div>

    <!-- 各工程/断面块（旧 Page_c is_p=false；季度线路为 Page_c_quarter） -->
    <div v-for="it in activeGroup.items" :key="it.id" class="lb-card">
      <div class="lb-head">{{ it.name }}</div>
      <div class="lb-range">自 {{ ymCn(it.start) }} 至 {{ dataLabel }}</div>
      <div class="lb-acc">
        {{ activeGroup.type === 'quarter' ? '通水累计' : '常规水量累计' }}：<b>{{
          fmtYi(activeGroup.type === 'quarter' ? data.luru[it.id] : data.sums[it.id]?.zsd)
        }}</b>
        亿m³
      </div>
      <div v-if="activeGroup.type === 'month'" class="lb-two">
        <div class="lb-cell">
          <div class="lb-num month">
            {{ fmtWan(data.sums[it.id]?.month) }}<span class="lb-unit">万m³</span>
          </div>
          <div class="lb-sub">{{ dataLabel }}</div>
        </div>
        <div class="lb-cell">
          <div class="lb-num year">
            {{ fmtYi(data.sums[it.id]?.year) }}<span class="lb-unit">亿m³</span>
          </div>
          <div class="lb-sub">{{ dataYm.y }}年</div>
        </div>
      </div>
      <div v-else class="lb-sub lb-quarter-tm">
        数据期：{{ String(data.luruTm[it.id] || '').slice(0, 7) || '-' }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.lb-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.lb-card {
  background: #f7f8fa;
  border-radius: 6px;
  padding: 10px 12px;
}

.lb-head {
  font-size: 14px;
  font-weight: 600;
  color: #0f378c;
  margin-bottom: 6px;
}

.lb-range {
  font-size: 13px;
  color: #244165;
  text-align: center;
  margin: 2px 0 6px;
}

.lb-acc {
  font-size: 13px;
  color: #244165;
  text-align: center;
  margin-bottom: 8px;
}

.lb-acc b {
  color: #1766db;
  font-size: 15px;
}

.lb-two {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lb-cell {
  flex: 1;
  text-align: center;
  background: #eef1f5;
  border-radius: 4px;
  padding: 6px 4px;
}

.lb-num {
  font-size: 19px;
  font-weight: 700;
  line-height: 22px;
}

.lb-num.month {
  color: #2aa7d8;
}

.lb-num.year {
  color: #2b6cb0;
}

.lb-unit {
  font-size: 11px;
  font-weight: 400;
  margin-left: 2px;
  color: #667086;
}

.lb-sub {
  font-size: 12px;
  color: #667086;
  line-height: 16px;
}

.lb-quarter-tm {
  text-align: center;
}

/* 调度年进度（旧 Progress_c：已完成 / 进度条 / 计划供水量） */
.lb-prog-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #244165;
  margin-bottom: 8px;
}

.lb-dot-done::before {
  content: '';
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #7573f8;
  margin-right: 5px;
}

.lb-bar {
  height: 6px;
  border-radius: 3px;
  background: #d2d2d2;
  overflow: hidden;
  margin-bottom: 8px;
}

.lb-bar i {
  display: block;
  height: 100%;
  background: #7674f9;
}

.lb-prog-foot {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #244165;
}

.lb-dot-plan::before {
  content: '';
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1px solid #949396;
  background: #fff;
  margin-right: 5px;
}

.lb-pct {
  color: #667086;
}
</style>
