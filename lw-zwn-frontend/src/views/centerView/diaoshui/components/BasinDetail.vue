<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import StationCard from './StationCard.vue'
import LydsTopBlocks from './LydsTopBlocks.vue'
import { hasLydsTopBlocks } from './lydsTopConfig'
import YdBlocks from './YdBlocks.vue'
import DispatchWarnPanel from './DispatchWarnPanel.vue'

interface DetailData {
  yr?: number
  mn?: number
  dataYr?: number
  dataMn?: number
  lineCd?: string
  detail?: Record<string, any>[]
  unit?: string | null
  stDt?: string | null
  noteCnt?: string | null
}

interface Props {
  lineCd: string
  detail: DetailData
}

const props = withDefaults(defineProps<Props>(), {
  detail: () => ({}) as DetailData
})

const TOTAL_CODES = ['TOT', 'HJ', 'ZJHJ', 'HJHJ']
const isAggName = (nm: string) =>
  ['小计', '合计', '总计', '累计'].some((k) => (nm || '').includes(k))

/** 分类归一键：去掉「合计」后缀（“河南省合计”并入“河南省”组）——与旧项目 tab 结构一致 */
const ctgKey = (nm: string) => String(nm || '').replace(/合计$/, '')
/** 线路级总计/合计分类：不做 tab（其数据由顶部总计条展示） */
const isTotalCtg = (cd: string, nm: string) =>
  TOTAL_CODES.includes(cd) || (nm || '').includes('总计')

const rows = computed(() => props.detail.detail || [])

// 线路级总计行（TOT/HJ 分类）
const totalRow = computed(() => rows.value.find((r) => TOTAL_CODES.includes(String(r.CTG_CD))))

// 分类展示顺序（对齐旧项目）：南水北调=中线/东线/北延，滦河=冀/津/蒙/辽；未配置的线路按数据行序
const CTG_ORDER: Record<string, string[]> = {
  NSBD: ['ZXYS', 'DXY', 'DXBY'],
  LH: ['HE', 'TJ', 'NM', 'LN'],
  // 引黄入冀：旧项目 tab 顺序 渠村线→位山线→潘庄线→李家岸线；渠首/省界累计类靠后
  YH_YJ: ['QCX', 'WSX', 'PZX', 'LJA']
}

// 分类（省/工程线）分组：排除线路级总计分类，保持行序
interface CtgGroup {
  ctgCd: string
  ctgNm: string
  stations: Record<string, any>[]
}
const ctgGroups = computed<CtgGroup[]>(() => {
  const map = new Map<string, CtgGroup>()
  for (const r of rows.value) {
    const ctgCd = String(r.CTG_CD)
    const ctgNm = String(r.CTG_NM || ctgCd)
    if (isTotalCtg(ctgCd, ctgNm)) {
      continue
    }
    // 归并键：省合计并入所属省（组内保留合计行，供分类汇总卡与站点过滤使用）
    const key = ctgKey(ctgNm)
    if (!map.has(key)) {
      map.set(key, { ctgCd, ctgNm: key, stations: [] })
    }
    map.get(key)!.stations.push(r)
  }
  const groups = [...map.values()]
  const order = CTG_ORDER[props.lineCd]
  if (order) {
    groups.sort((a, b) => {
      const ia = order.indexOf(a.ctgCd)
      const ib = order.indexOf(b.ctgCd)
      return (ia < 0 ? order.length : ia) - (ib < 0 ? order.length : ib)
    })
  }
  return groups
})

// 当前选中分类
const activeCtg = ref('')
watch(
  ctgGroups,
  (groups) => {
    if (!groups.find((g) => g.ctgCd === activeCtg.value)) {
      activeCtg.value = groups[0]?.ctgCd || ''
    }
  },
  { immediate: true }
)

const activeGroup = computed(() => ctgGroups.value.find((g) => g.ctgCd === activeCtg.value))

/** 无分类 tab 的线路（旧项目为单一平铺布局：内容自上而下依次展示）：引滦工程、滹沱河 */
const FLAT_LINES = ['LD', 'HT']
const isFlat = computed(() => FLAT_LINES.includes(props.lineCd))

/** 渲染的分组：平铺模式=全部分类依次展示；tab 模式=仅当前激活分类 */
const displayGroups = computed<CtgGroup[]>(() => {
  if (isFlat.value) {
    return ctgGroups.value
  }
  return activeGroup.value ? [activeGroup.value] : []
})

/** 某分类下的叶子站点行（排除省内小计/合计行；若全是聚合行则原样展示） */
function leafOf(g: CtgGroup) {
  const leaf = g.stations.filter(
    (r) => !TOTAL_CODES.includes(String(r.PRJ_CD)) && !isAggName(String(r.PRJ_NM))
  )
  return leaf.length ? leaf : g.stations
}

/** 某分类的聚合行（省内小计/合计），其当月/累计值供汇总卡展示 */
function aggOf(g: CtgGroup) {
  return g.stations.find(
    (r) => TOTAL_CODES.includes(String(r.PRJ_CD)) || isAggName(String(r.PRJ_NM))
  )
}

/** 分类级汇总卡：该分类下多于 1 个明细站点时展示（组内合计行不计入） */
function showCardOf(g: CtgGroup) {
  return leafOf(g).length > 1
}

const dataYr = computed(() => props.detail.dataYr || props.detail.yr || 0)
const dataMn = computed(() => props.detail.dataMn || props.detail.mn || 0)

function fmt(v: any) {
  if (v == null || v === '' || isNaN(Number(v))) {
    return '-'
  }
  return Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 2 })
}

// ==================== 调水预警页签（2026-09-28 迁自老项目 water_tr 预警页签） ====================
// 仅漳河/滹沱河/滦河三线在内容上方加「监控/预警」两个页签：监控=原详情内容，预警=阈值比对面板。
// 切换线路时回到监控页签；其余线路不显示该页签（保持原样）。
const WARN_LINES = ['ZH', 'HT', 'LH']
const isWarnLine = computed(() => WARN_LINES.includes(props.lineCd))
const viewTab = ref<'monitor' | 'warning'>('monitor')
watch(
  () => props.lineCd,
  () => {
    viewTab.value = 'monitor'
  }
)
</script>

<template>
  <div class="basin-detail">
    <!-- 调水预警页签（仅漳河/滹沱河/滦河）：监控=原详情内容，预警=DispatchWarnPanel -->
    <div v-if="isWarnLine" class="ctg-tabs warn-tabs">
      <span class="ctg-tab" :class="{ active: viewTab === 'monitor' }" @click="viewTab = 'monitor'">
        监控
      </span>
      <span class="ctg-divider"></span>
      <span class="ctg-tab" :class="{ active: viewTab === 'warning' }" @click="viewTab = 'warning'">
        预警
      </span>
    </div>

    <template v-if="!isWarnLine || viewTab === 'monitor'">
      <!-- 线路总计（有「通水累计」两块的线路不显示，与旧项目版式一致） -->
      <div v-if="totalRow && !hasLydsTopBlocks(lineCd)" class="total-bar">
        <div class="total-item">
          <span class="total-label">当月供水量</span>
          <span class="total-value month">{{ fmt(totalRow.MN_CMP_QTY) }}</span>
          <span class="total-unit">万m³</span>
        </div>
        <div class="total-item">
          <span class="total-label">调度年累计</span>
          <span class="total-value year">{{ fmt(totalRow.YR_CMP_QTY) }}</span>
          <span class="total-unit">万m³</span>
        </div>
      </div>

      <!-- 永定河专属块：生态补水指标 + 通水累计 + 官厅以上/以下进度（旧 wwtr_2 复刻） -->
      <YdBlocks v-if="lineCd === 'YD'" />

      <!-- 页签上方两块：文字统计条（不可选）+ 通水累计（区间可选）——旧项目 Page_p + Page_c 复刻 -->
      <LydsTopBlocks v-if="hasLydsTopBlocks(lineCd)" :line-cd="lineCd" />

      <!-- 省/分类切换（平铺线路不显示 tab，内容直接依次展示） -->
      <div v-if="!isFlat && ctgGroups.length" class="ctg-tabs">
        <template v-for="(g, i) in ctgGroups" :key="g.ctgCd">
          <span v-if="i > 0" class="ctg-divider"></span>
          <span
            class="ctg-tab"
            :class="{ active: g.ctgCd === activeCtg }"
            @click="activeCtg = g.ctgCd"
          >
            {{ g.ctgNm }}
          </span>
        </template>
      </div>

      <!-- 分类级汇总卡 + 站点卡（内部滚动，总计/Tab 固定不动） -->
      <div class="station-scroll">
        <template v-for="g in displayGroups" :key="g.ctgCd">
          <!-- 平铺模式：分组小标题 -->
          <div v-if="isFlat" class="flat-group-title">{{ g.ctgNm }}</div>
          <StationCard
            v-if="showCardOf(g)"
            :key="`ctg-${lineCd}-${g.ctgCd}`"
            :line-cd="lineCd"
            :ctg-cd="g.ctgCd"
            :name="`${g.ctgNm}（汇总）`"
            :month-cmp="aggOf(g)?.MN_CMP_QTY"
            :yr-cmp="aggOf(g)?.YR_CMP_QTY"
            :data-yr="dataYr"
            :data-mn="dataMn"
          />
          <StationCard
            v-for="st in leafOf(g)"
            :key="`${lineCd}-${g.ctgCd}-${st.PRJ_CD}`"
            :line-cd="lineCd"
            :ctg-cd="g.ctgCd"
            :prj-cd="String(st.PRJ_CD)"
            :name="String(st.PRJ_NM || st.PRJ_CD)"
            :month-cmp="st.MN_CMP_QTY"
            :yr-cmp="st.YR_CMP_QTY"
            :data-yr="dataYr"
            :data-mn="dataMn"
          />
        </template>
        <div v-if="!displayGroups.length" class="empty-tip">暂无明细数据</div>

        <!-- 备注信息 -->
        <div v-if="detail.unit || detail.stDt" class="detail-meta">
          <span v-if="detail.unit">单位：{{ detail.unit }}</span>
          <span v-if="detail.stDt">统计截止：{{ detail.stDt }}</span>
        </div>
        <div v-if="detail.noteCnt" class="detail-note">{{ detail.noteCnt }}</div>
      </div>
    </template>

    <!-- 预警页签内容（阈值比对面板） -->
    <DispatchWarnPanel v-else :line-cd="lineCd" />
  </div>
</template>

<style scoped lang="scss">
.basin-detail {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* 平铺模式（引滦/滹沱河，旧项目为单布局）：分组小标题 */
.flat-group-title {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  margin: 12px 0 6px;
  padding-left: 8px;
  border-left: 3px solid #1766db;
}

.total-bar {
  flex: none;
  display: flex;
  align-items: center;
  border: 1px solid #9dbdeb;
  border-radius: 6px;
  background: rgba(230, 240, 255, 0.6);
  padding: 10px 12px;
  margin-bottom: 10px;

  .total-item {
    flex: 1;
    text-align: center;

    .total-label {
      font-size: 12px;
      color: #666;
      margin-right: 6px;
    }

    .total-value {
      font-size: 18px;
      font-weight: 700;

      &.month {
        color: #21a6df;
      }

      &.year {
        color: #006bc9;
      }
    }

    .total-unit {
      font-size: 11px;
      color: #888;
      margin-left: 2px;
    }
  }
}

.ctg-tabs {
  flex: none;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 10px;

  .ctg-tab {
    font-size: 13px;
    color: #333;
    cursor: pointer;
    padding: 2px 8px;
    user-select: none;

    &.active {
      color: #006cc9;
      font-weight: 700;
    }

    &:hover {
      color: #006cc9;
    }
  }

  .ctg-divider {
    width: 1px;
    height: 14px;
    background: #ccc;
  }
}

/* 调水预警「监控/预警」页签：与分类页签同款，字号略大区分层级 */
.warn-tabs {
  .ctg-tab {
    font-size: 14px;
    font-weight: 600;
    padding: 2px 14px;
  }
}

.station-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.15);
    border-radius: 3px;
  }
}

.empty-tip {
  padding: 16px 0;
  text-align: center;
  color: #999;
  font-size: 13px;
}

.detail-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #666;
  padding: 6px 2px 0;
}

.detail-note {
  font-size: 12px;
  color: #666;
  padding: 4px 2px 0;
  line-height: 1.5;
  white-space: pre-line;
  word-break: break-all;
}
</style>
