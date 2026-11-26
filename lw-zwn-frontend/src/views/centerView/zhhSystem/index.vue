<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import LeftSide from '@/components/business/LeftSide.vue'
import RightSide from '@/components/business/RightSide.vue'
import TitleBackOut from '@/components/business/TitleBackOut.vue'
import DivBackIn from '@/components/business/DivBackIn.vue'
import StatDetailDialog from '@/components/business/StatDetailDialog.vue'
import LydsTopBlocks from '@/views/centerView/diaoshui/components/LydsTopBlocks.vue'
import StationCard from '@/views/centerView/diaoshui/components/StationCard.vue'
import StationDetailDialog from '@/views/centerView/diaoshui/components/StationDetailDialog.vue'
import {
  getIqMonthData,
  getUnitCertStat,
  queryDsMaxTime,
  queryStcdInfo,
  queryStcdDailyRange
} from '@/api/waterdisp'
import { getBaseInfo, getStatDetail } from '@/api/quyongshui'
import { useMapBridge } from '@/hooks/web/useMapBridge'
import { useMapStationDialog } from '@/hooks/web/useMapStationDialog'

/**
 * 漳河上游 / 漳卫南 水资源调度系统（两个页面共用本组件，按路由区分所属单位）
 *
 * 版式参照 /centerView/panorama；顶部标题图由路由 meta.headerLogo 覆盖 CenterLayout 的默认 banner。
 * 地图暂用调水管理地图（meta.mapUrl = gismapbox_es?module=diaoshuiguanli），进页面镜头定位漳河。
 * 右侧「委发证取水许可证统计 / 许可证预警情况」按**取水证归属单位**筛选（归属关系来自标识牌清单 XLS →
 * 后端 certunit/whs-cert-unit.json，按许可证编号与库里证照交叉）；预警数值可点击看明细（与取用水页面同一弹窗）。
 */
const route = useRoute()
/** 所属单位：/centerView/zhangweinan → 漳卫南；/centerView/zhangheUpstream → 漳河上游 */
const unit = computed(() => (route.path.includes('zhangweinan') ? '漳卫南' : '漳河上游'))
/** 月批复表里的监管单位前缀（漳卫南局 / 漳河上游局） */
const unitKey = computed(() => (unit.value === '漳卫南' ? '漳卫南局' : '漳河上游局'))

const loading = ref(false)
/** 本单位的工程/断面行（月批复按监管单位过滤，字段同漳河详情页） */
const rows = ref<Array<any>>([])
/** 数据期（月批复返回的 yr/mn） */
const dataYr = ref(0)
const dataMn = ref(0)
/** 全流域取水许可证统计（不变） */
const base = ref<any>({})
/** 本单位：委发证统计 + 预警 */
const unitStat = ref<any>({})

const fmt = (v: any, digits = 2) => {
  const n = Number(v)
  return isFinite(n) && v != null && v !== '' ? n.toFixed(digits) : '-'
}
const num = (v: any) => {
  const n = Number(v)
  return isFinite(n) && v != null && v !== '' ? n : 0
}

async function load() {
  loading.value = true
  try {
    const iq: any = await getIqMonthData({ lineCd: 'ZH' })
    if (iq.code === 0 && iq.data) {
      dataYr.value = Number(iq.data.yr) || 0
      dataMn.value = Number(iq.data.mn) || 0
      const detail = Array.isArray(iq.data.detail) ? iq.data.detail : []
      rows.value = detail.filter((r: any) => String(r.supManUnit || '').startsWith(unitKey.value))
    }
  } catch (e) {
    console.warn('zhhSystem: 月批复加载失败', e)
  }
  try {
    const b: any = await getBaseInfo()
    if (b.code === 0 && b.data) {
      base.value = b.data
    }
  } catch (e) {
    console.warn('zhhSystem: getBaseInfo 失败', e)
  }
  try {
    const s: any = await getUnitCertStat({ unit: unit.value })
    if (s.code === 0 && s.data) {
      unitStat.value = s.data
    }
  } catch (e) {
    console.warn('zhhSystem: unitCertStat 失败', e)
  }
  loading.value = false
}

// ==================== 预警明细弹窗（与取用水页面同一公共组件与列定义，行按单位过滤） ====================
type StatKind =
  | 'exLimit'
  | 'yuJing'
  | 'expired'
  // 委发证块（按归属单位）——与取用水页面同名同标题
  | 'certWfz'
  | 'ownerWfz'
  | 'sumXukeWfzOut'

const STAT_TITLE: Record<string, string> = {
  exLimit: '超许可许可证明细',
  yuJing: '取水计划预警许可证明细',
  expired: '即将到期许可证明细',
  certWfz: '委发证证照明细',
  ownerWfz: '取用水户明细',
  sumXukeWfzOut: '许可水量（河道外）明细'
}
const statDlg = ref({
  show: false,
  title: '',
  totalText: '',
  unitText: '',
  rowGroupSize: 1,
  columns: [] as any[],
  rows: [] as Record<string, any>[],
  loading: false
})

async function openStatDetail(kind: StatKind) {
  statDlg.value = {
    show: true,
    title: STAT_TITLE[kind] || '数据明细',
    totalText: '',
    unitText: '',
    rowGroupSize: 1,
    columns: [],
    rows: [],
    loading: true
  }
  try {
    const res: any = await getStatDetail(kind, undefined, unit.value)
    if (res.code === 0 && res.data) {
      const list: any[] = res.data.rows || []
      statDlg.value.columns = res.data.columns || []
      statDlg.value.rows = list
      statDlg.value.totalText = `共 ${list.length} 条`
      statDlg.value.unitText = '单位：万m³'
      // 取水计划预警一个证占「计划 / 实际」两行，行数不是证书数，故显式说明口径
      if (kind === 'yuJing') {
        const certCount = new Set(list.map((r) => r.FIR_CERT_NUM_CODE)).size
        statDlg.value.totalText = `共 ${certCount} 个预警证书 · 每证两行（上计划 / 下实际），实际超月计划×1.3 的月份标红`
        statDlg.value.rowGroupSize = 2
      }
    }
  } catch (e) {
    console.warn('zhhSystem: statDetail 失败', e)
    statDlg.value.rows = []
  } finally {
    statDlg.value.loading = false
  }
}

// 地图点位点击 → 单站详情弹窗（公共 composable，与调水一张图同一实现）
const { mapStationShow, mapStationRow, mapStationWt, onMapNodeClick } = useMapStationDialog()

/**
 * 地图：就绪后把镜头定位到漳河。
 * 调水管理地图（gismapbox_es?module=diaoshuiguanli）的就绪标志是 `m_oDataToJieShui`；
 * 定位用 `m_oDataToPoint({ id })`，漳河的 id 取调水一张图的既有映射（ZH → '3'）。
 */
const ZH_LOCATE_ID = '3'
const { callMapReady } = useMapBridge({
  readyMethod: 'm_oDataToJieShui',
  messageHandlers: {
    // 地图点位点击：GIS 模块 diaoshuiguanli 发 { eventname:'details', STCD, MARK, TM, STNM }
    details: onMapNodeClick
  },
  onReady: () => {
    callMapReady((win: Window) => (win as any).m_oDataToPoint?.({ id: ZH_LOCATE_ID }))
  }
})

onMounted(() => {
  load()
})
</script>

<template>
  <div class="zhh-page">
    <!-- 左侧：漳河统计两块（旧 Page_p + Page_c 复刻）+ 按监管单位分组的工程/断面（单站卡样式同调水一张图） -->
    <LeftSide
      width="480px"
      top="80px"
      height="calc(100vh - 100px)"
      :scrollable="false"
      class="pointer-auto"
    >
      <div class="zhh-side-root">
        <TitleBackOut content="漳河（含清漳河浊漳河）" :is-click-btn="false" />
        <!-- 单张卡片：统计两块 + 监管单位子标题 + 工程/断面列表（列表区自滚，面板整体不滚） -->
        <DivBackIn class="zhh-card zhh-side-card">
          <div class="zhh-side-inner">
            <!-- ① 文字统计条 + ② 可区间通水累计（复用调水一张图的块，配置即漳河） -->
            <LydsTopBlocks line-cd="ZH" />
            <!-- ③ 监管单位子标题（样式同其他页面的分组小标题） -->
            <div class="zhh-group-title">{{ unit }}</div>
            <div class="zhh-list">
              <StationCard
                v-for="r in rows"
                :key="r.prjCd"
                line-cd="ZH"
                :ctg-cd="r.ctgCd"
                :prj-cd="String(r.prjCd)"
                :name="r.prjNm"
                :month-cmp="r.mnCmpQty"
                :yr-cmp="r.yrCmpQty"
                :data-yr="dataYr"
                :data-mn="dataMn"
              />
              <div v-if="!rows.length" class="zhh-empty">
                {{ loading ? '加载中…' : '暂无数据' }}
              </div>
            </div>
          </div>
        </DivBackIn>
      </div>
    </LeftSide>

    <!-- 右侧：取用水三块（全流域不变；下两块按归属单位筛选） -->
    <RightSide width="470px" padding="0 4px" class="pointer-auto">
      <TitleBackOut content="全流域取水许可证统计" :is-click-btn="false" />
      <DivBackIn class="zhh-card">
        <div class="zhh-hero">{{ fmt(base.sumXukeAll) }}<span class="zhh-unit">亿m³</span></div>
        <div class="zhh-hero-label">许可水量（河道外）</div>
        <div class="zhh-grid">
          <div>
            <b>{{ num(base.countOwnerAll) }}</b
            ><span>取用水户总数</span>
          </div>
          <div>
            <b>{{ num(base.countOwnerAllOut) }}</b
            ><span>河道外取水户</span>
          </div>
          <div>
            <b>{{ num(base.countCertAll) }}</b
            ><span>证照总数</span>
          </div>
          <div>
            <b>{{ num(base.countCertAllOut) }}</b
            ><span>河道外证照</span>
          </div>
        </div>
      </DivBackIn>

      <TitleBackOut :content="`委发证取水许可证统计（${unit}）`" :is-click-btn="false" />
      <DivBackIn class="zhh-card">
        <!-- 三处数值均可点击看明细（同取用水页面：按页面所属单位过滤） -->
        <div
          class="zhh-hero stat-clickable"
          title="点击查看明细"
          @click="openStatDetail('sumXukeWfzOut')"
        >
          <span class="num-click">{{ fmt(unitStat.sumXuke) }}</span
          ><span class="zhh-unit">亿m³</span>
        </div>
        <div class="zhh-hero-label">许可水量（河道外）</div>
        <div class="zhh-grid">
          <div class="stat-clickable" title="点击查看明细" @click="openStatDetail('certWfz')">
            <b class="num-click">{{ num(unitStat.certNum) }}</b
            ><span>证照总数</span>
          </div>
          <div class="stat-clickable" title="点击查看明细" @click="openStatDetail('ownerWfz')">
            <b class="num-click">{{ num(unitStat.ownerNum) }}</b
            ><span>取用水户总数</span>
          </div>
        </div>
      </DivBackIn>

      <TitleBackOut :content="`许可证预警情况（${unit}）`" :is-click-btn="false" />
      <DivBackIn class="zhh-card zhh-warn-card">
        <div
          class="warn-row stat-clickable"
          title="点击查看明细"
          @click="openStatDetail('exLimit')"
        >
          <span class="warn-label">超许可许可证</span>
          <span class="warn-value num-click">{{ num(unitStat.exLimit) }}</span>
        </div>
        <div class="warn-row stat-clickable" title="点击查看明细" @click="openStatDetail('yuJing')">
          <span class="warn-label">取水计划预警许可证</span>
          <span class="warn-value num-click">{{ num(unitStat.yuJing) }}</span>
        </div>
        <div
          class="warn-row stat-clickable"
          title="点击查看明细"
          @click="openStatDetail('expired')"
        >
          <span class="warn-label">即将到期许可证</span>
          <span class="warn-value num-click">{{ num(unitStat.expired) }}</span>
        </div>
      </DivBackIn>
    </RightSide>

    <!-- 地图点位点击 → 单站详情弹窗（与调水一张图同一组件） -->
    <StationDetailDialog
      v-model:show="mapStationShow"
      :row="mapStationRow"
      :wt-time="mapStationWt"
    />

    <!-- 统计明细弹窗（公共组件）：表头与数据由后端按统计类型 + 归属单位下发 -->
    <StatDetailDialog
      v-model:show="statDlg.show"
      :title="statDlg.title"
      :total-text="statDlg.totalText"
      :unit-text="statDlg.unitText"
      :row-group-size="statDlg.rowGroupSize"
      :columns="statDlg.columns"
      :rows="statDlg.rows"
      :loading="statDlg.loading"
    />
  </div>
</template>

<style scoped lang="scss">
.zhh-page {
  width: 100%;
  height: 100%;
}

.zhh-card {
  margin: 10px 0 4px;
}

.zhh-hero {
  font-size: 24px;
  font-weight: 700;
  color: #1766db;
  text-align: center;
  line-height: 30px;
}

.zhh-unit {
  font-size: 12px;
  font-weight: 400;
  margin-left: 3px;
  color: #667086;
}

.zhh-hero-label {
  font-size: 12px;
  color: #667086;
  text-align: center;
  margin-bottom: 6px;
}

.zhh-grid {
  display: flex;
  justify-content: space-between;
  text-align: center;
}

.zhh-grid > div {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.zhh-grid b {
  font-size: 16px;
  color: #0f378c;
}

.zhh-grid span {
  font-size: 12px;
  color: #667086;
}

/* 预警块：与取用水页面完全同款（行高/字号/字色/可点击 hover 一致） */
.zhh-warn-card {
  display: flex;
  flex-direction: column;
}

.warn-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
}

.warn-label {
  font-size: 15px;
  color: #3a4a63;
}

.warn-value {
  font-size: 28px;
  font-weight: 700;
  color: #f1a100;
}

.stat-clickable {
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.18s;

  &:hover {
    background: #f0f7ff;
  }

  &:hover .warn-value,
  &:hover .zhh-hero {
    color: #0e8ee7;
  }
}

/* 左侧面板：整体不滚，仅列表区自滚（参照原页面） */
.zhh-side-root {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.zhh-side-card {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;

  /* DivBackIn 内部是 n-spin-container > n-spin-content 两层块级包裹，需一并撑满才能让内层列表自滚 */
  :deep(.n-spin-container),
  :deep(.n-spin-content) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
}

.zhh-side-inner {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

:deep(.scrollbar-content.no-scroll) {
  height: 100%;
}

:deep(.left-container),
:deep(.right-container) {
  overflow: hidden;
}

.zhh-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

/* 左侧：监管单位子标题（样式同 BasinDetail 的分组小标题） */
.zhh-group-title {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  margin: 12px 0 6px;
  padding-left: 8px;
  border-left: 3px solid #1766db;
}

.zhh-empty {
  font-size: 13px;
  color: #667086;
  text-align: center;
  padding: 8px 0;
}
</style>
