<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  queryLatestMonth,
  queryMonthList,
  getLineCards,
  getLineDetail,
  mapPoints,
  queryDsMaxTime,
  queryStcdInfo,
  queryStcdDailyRange
} from '@/api/waterdisp'
import { useMapBridge } from '@/hooks/web/useMapBridge'
import { useMapStationDialog } from '@/hooks/web/useMapStationDialog'
import RightSide from '@/components/business/RightSide.vue'
import DivBackIn from '@/components/business/DivBackIn.vue'
import TitleBackOut from '@/components/business/TitleBackOut.vue'
import LineCard from './components/LineCard.vue'
import BasinDetail from './components/BasinDetail.vue'
import YdDetail from './components/YdDetail.vue'
import IntroPanel from './components/IntroPanel.vue'
import LineDataDialog from './components/LineDataDialog.vue'
import StationDetailDialog from './components/StationDetailDialog.vue'
import MonthReportDialog from './components/MonthReportDialog.vue'
import ReportQueryDialog from '@/components/business/ReportQueryDialog.vue'
import { BASIN_INTRO } from './components/basinIntro'

// ==================== 当前选中月份 ====================
const selected = ref<{ yr: number; mn: number }>({ yr: 0, mn: 0 })
const monthValue = computed(() =>
  selected.value.yr ? `${selected.value.yr}-${selected.value.mn}` : null
)

// 月份下拉选项
const monthOptions = ref<{ label: string; value: string }[]>([])

// ==================== 线路卡片 ====================
const cards = ref<any[]>([])
const cardsLoading = ref(false)

// ==================== 视图模式：列表 / 详情（原地切换） ====================
const viewMode = ref<'list' | 'detail'>('list')
const selectedLine = ref('')
const selectedLineNm = ref('')
const detailData = ref<any>({})
const detailLoading = ref(false)
// 流域简介滑出框：仅旧项目有简介的流域（漳河/滦河/滹沱河）显示按钮
const showIntro = ref(false)
const basinIntro = computed(() => BASIN_INTRO[selectedLine.value] || null)

async function loadMonths() {
  try {
    const res = await queryMonthList()
    if (res.code === 0 && Array.isArray(res.data)) {
      monthOptions.value = res.data
        .filter((m: any) => m.yr && m.mn)
        .map((m: any) => ({
          label: `${m.yr}年${m.mn}月`,
          value: `${m.yr}-${m.mn}`
        }))
    }
  } catch (e) {
    console.warn('queryMonthList failed', e)
  }
}

async function loadCards() {
  if (!selected.value.yr) {
    return
  }
  cardsLoading.value = true
  try {
    const res = await getLineCards({ yr: selected.value.yr, mn: selected.value.mn })
    if (res.code === 0 && res.data) {
      cards.value = res.data || []
    }
  } catch (e) {
    console.warn('getLineCards failed', e)
  } finally {
    cardsLoading.value = false
  }
}

// 月份切换：刷新卡片，若在详情态则刷新详情
function onMonthChange(val: string) {
  if (!val) {
    return
  }
  const [yr, mn] = val.split('-').map((n) => Number(n))
  selected.value = { yr, mn }
  loadCards()
  if (viewMode.value === 'detail' && selectedLine.value) {
    loadDetail(selectedLine.value)
  }
}

async function loadDetail(lineCd: string) {
  detailData.value = {}
  // 永定河为专属面板（YdDetail 自行取数），不走月报明细
  if (lineCd === 'YD') {
    detailLoading.value = false
    return
  }
  detailLoading.value = true
  try {
    const res = await getLineDetail({ lineCd, yr: selected.value.yr, mn: selected.value.mn })
    if (res.code === 0 && res.data) {
      detailData.value = res.data
    }
  } catch (e) {
    console.warn('load line detail failed', e)
  } finally {
    detailLoading.value = false
  }
}

// 线路数据弹窗（日尺度数据 → 站点详情，在同一弹窗内滑动切换）
const showDataDialog = ref(false)
// 月报数据弹窗（WR_WSP_MN_M 月度数据 + WR_WSP_WDE_B 工程属性）
const showMonthReport = ref(false)

// 点击卡片：右侧面板原地切换到该流域详情（线路数据弹窗改由标题栏「详情」按钮打开）
function onCardClick(lineCd: string) {
  const card = cards.value.find((c) => c.lineCd === lineCd)
  selectedLine.value = lineCd
  selectedLineNm.value = card ? card.lineNm : ''
  viewMode.value = 'detail'
  loadDetail(lineCd)
  onMapLocate(lineCd)
}

/** 标题栏「详情」按钮：打开线路数据弹窗（日尺度数据 → 站点详情，同一弹窗内滑动切换） */
function openDataDialog() {
  showDataDialog.value = true
}

// 返回列表
function goBack() {
  viewMode.value = 'list'
  selectedLine.value = ''
  selectedLineNm.value = ''
  showIntro.value = false
  showDataDialog.value = false
  showMonthReport.value = false
  // 地图回到全景（jsonarr stcd='0' 为全景范围）
  callMapReady((win) => (win as any).m_oDataToPoint({ id: '0' }))
}

// ==================== 地图交互（iframe 内 diaoshui_mapbox 应用，跨窗口同源直调） ====================
// 地图应用 global 方法：m_oDataToPoint({id,data}) 全景定位+线路高亮；m_oDataToJieShui({id,data}) 点位绘制；
// m_ohandlelayers([layerName]) 矢量图层显隐；传值协议与旧项目 water_tr.js 一致
const MAP_LINE_STCD: Record<string, string> = {
  YD: '2',
  NSBD: '5',
  YH_YJ: '4',
  LH: '6',
  LD: '1',
  HT: '7',
  ZH: '3'
}

// 地图点位点击处理（公共 composable：解析查询日 + 补站类 + 无数据回退最新有数据日 + 打开弹窗）
const { mapStationShow, mapStationRow, mapStationWt, onMapNodeClick } = useMapStationDialog()

// 使用地图桥接 composable：调水地图就绪方法为 m_oDataToJieShui；并监听地图发来的节点点击消息
const { callMapReady } = useMapBridge({
  readyMethod: 'm_oDataToJieShui',
  messageHandlers: {
    // GIS 模块 diaoshuiguanli 的 postNodeDetail → { eventname:'details', STCD, MARK, TM, STNM }
    details: onMapNodeClick
  }
})

// ==================== 地图点位点击 → 单站详情弹窗 ====================
// 与「右侧日尺度数据」弹窗（线路 → 该线各断面表 → 站点）不同：
// 地图上的一个点位就是一个单站，直接弹该站详情，不带线路/河段上下文。

// 初始：把 7 条线路全部点位交给地图绘制（等价旧 m_oDataToJieShui({id:'0', data})）
async function loadMapPoints() {
  try {
    const res = await mapPoints()
    if (res.code !== 0 || !res.data) {
      return
    }
    const all = res.data.lines.flatMap((l: any) => l.points || [])
    callMapReady((win) => (win as any).m_oDataToJieShui({ id: '0', data: all }))
  } catch (e) {
    console.warn('mapPoints failed', e)
  }
}

// 点击线路：全景定位到该流域（等价旧 m_oDataToPoint({id: stcd})）
function onMapLocate(lineCd: string) {
  const stcd = MAP_LINE_STCD[lineCd]
  if (!stcd) {
    return
  }
  callMapReady((win) => (win as any).m_oDataToPoint({ id: stcd }))
}

// 月报查询弹窗（原「日报导出」占位改为月报查询；数据源 HWWR.ST_MEDIA_B，DOC_TP='DS' 不限线路）
const showReportDialog = ref(false)

onMounted(async () => {
  try {
    const res = await queryLatestMonth()
    if (res.code === 0 && res.data && res.data.yr) {
      selected.value = { yr: res.data.yr, mn: res.data.mn }
    }
  } catch (e) {
    console.warn('queryLatestMonth failed', e)
  }
  loadMonths()
  loadCards()
  loadMapPoints()
})
</script>

<template>
  <div class="page-layout">
    <!-- 右侧：流域调水（列表 / 详情 原地切换）——由左侧移至右侧常驻 -->
    <!-- 右栏不再传 top：本页有二级菜单，面包屑右缘远在 x≈820 以内，
         与右栏（x≈1450 起）横向不相交，无需为避让面包屑下移到 140，
         直接用 RightSide 默认 top（100px），与其他页面右栏一致 -->
    <RightSide width="480px" class="pointer-auto">
      <TitleBackOut content="流域调水">
        <div class="title-controls">
          <!-- 列表态：月份选择 + 日报导出；详情态：流域简介 + 返回 -->
          <template v-if="viewMode === 'list'">
            <n-select
              :value="monthValue"
              :options="monthOptions"
              size="small"
              style="width: 118px"
              placeholder="选择月份"
              @update:value="onMonthChange"
            />
            <n-button size="small" type="primary" secondary @click="showReportDialog = true">
              月报查询
            </n-button>
          </template>
          <template v-else>
            <n-button
              v-if="basinIntro"
              size="small"
              type="primary"
              secondary
              @click="showIntro = true"
            >
              流域简介
            </n-button>
            <!-- 月报数据：打开线路月报数据弹窗（WR_WSP_MN_M + WR_WSP_WDE_B），位于「详情」左侧 -->
            <n-button size="small" type="primary" secondary @click="showMonthReport = true">
              月报数据
            </n-button>
            <!-- 详情：打开线路数据弹窗（日尺度数据 → 站点详情），位于「返回」左侧 -->
            <n-button size="small" type="primary" secondary @click="openDataDialog">
              详情
            </n-button>
            <n-button size="small" secondary @click="goBack">返回</n-button>
          </template>
        </div>
      </TitleBackOut>

      <!-- 列表视图（框高固定，卡片列表内部滚动） -->
      <DivBackIn
        v-if="viewMode === 'list'"
        :is-loading="cardsLoading"
        style="margin: 8px 0"
        :is-empty="false"
      >
        <div class="panel-body panel-body--scroll">
          <div v-if="cards.length === 0" class="empty-tip">暂无数据</div>
          <LineCard
            v-for="card in cards"
            :key="card.lineCd"
            :card="card"
            :active="selectedLine === card.lineCd"
            @click="onCardClick"
          />
        </div>
      </DivBackIn>

      <!-- 详情视图（原地切换）：标题/总计/Tab 固定，站点卡片区内部滚动 -->
      <DivBackIn v-else :is-loading="detailLoading" style="margin: 8px 0" :is-empty="false">
        <div class="panel-body panel-body--detail">
          <div class="detail-header">
            <span class="detail-title">
              {{ selectedLineNm }}
              <span v-if="detailData.yr" class="detail-sub">
                （{{ detailData.dataYr || detailData.yr }}年{{
                  detailData.dataMn || detailData.mn
                }}月）
              </span>
            </span>
          </div>

          <!-- 永定河：专属面板（通水累计/官厅以上以下进度，非月报明细） -->
          <YdDetail v-if="selectedLine === 'YD'" class="detail-basin" />
          <BasinDetail v-else class="detail-basin" :line-cd="selectedLine" :detail="detailData" />
        </div>
      </DivBackIn>

      <!-- 流域简介：右侧滑出框 -->
      <n-drawer v-model:show="showIntro" :width="420" placement="right">
        <n-drawer-content :title="`${selectedLineNm} · 流域简介`" closable>
          <IntroPanel :data="basinIntro" :line-nm="selectedLineNm" />
        </n-drawer-content>
      </n-drawer>
    </RightSide>

    <!-- 中间地图区域（透明，复用布局层地图底板；空白区域事件穿透，点击直达地图） -->
    <div class="center-map-area"></div>

    <!-- 线路数据弹窗：日尺度数据 → 行点击 → 站点详情（同一弹窗内滑动切换，互不遮挡） -->
    <LineDataDialog
      v-model:show="showDataDialog"
      :line-cd="selectedLine"
      :line-nm="selectedLineNm"
    />

    <!-- 月报查询弹窗（公共组件）：年份 tab + 报告列表（预览/下载），数据源 ST_MEDIA_B -->
    <ReportQueryDialog v-model:show="showReportDialog" doc-tp="DS" />

    <!-- 线路月报数据弹窗：WR_WSP_MN_M 月度数据 + WR_WSP_WDE_B 工程属性（标题栏「月报数据」按钮） -->
    <MonthReportDialog
      v-model:show="showMonthReport"
      :line-cd="selectedLine"
      :line-nm="selectedLineNm"
    />

    <!-- 地图点位点击：单站详情弹窗（独立模式自渲染 n-modal；单站，不带线路/河段上下文） -->
    <StationDetailDialog
      v-model:show="mapStationShow"
      :row="mapStationRow"
      :wt-time="mapStationWt"
    />
  </div>
</template>

<style scoped lang="scss">
.page-layout {
  display: flex;
  //width: 100%;
  //height: 100vh;
  overflow: hidden;
  pointer-events: none; /* 页面容器整体穿透：中间空白区域点击直达地图底板；可交互面板用 .pointer-auto 恢复 */
}

.center-map-area {
  flex: 1;
  background: transparent;
  pointer-events: none; /* 空白区域穿透至地图底板，地图可拖动/缩放 */
}

.title-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.empty-tip {
  padding: 16px 0;
  text-align: center;
  color: #999;
  font-size: 13px;
}

/* ==================== 面板主体：框高固定，内容内部滚动 ==================== */
.panel-body {
  /* 200 = 顶栏/右栏顶部(100) + 标题行(37) + 上下边距与底部留白(≈63)。
     必须让「标题行 + 主体」总高不超过右栏上限 calc(100vh - 110px)，
     否则外层容器会冒出滚动条（要求：整体不滚，只标题下方的列表滚）。 */
  height: calc(100vh - 200px);

  &--scroll {
    overflow-y: auto;
    padding-right: 4px;
  }

  &--detail {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &--scroll::-webkit-scrollbar {
    width: 6px;
  }

  &--scroll::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.15);
    border-radius: 3px;
  }
}

.detail-basin {
  flex: 1;
  min-height: 0;
}

/* ==================== 详情视图（原地切换） ==================== */
.detail-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.detail-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f378c;
}

.detail-sub {
  font-size: 12px;
  font-weight: 400;
  color: #666;
}
</style>
