<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import VideoDetailModal from './components/VideoDetailModal.vue'
import RelWhsModal from './components/RelWhsModal.vue'
import { useMapBridge, parseMapCoord } from '@/hooks/web/useMapBridge'
import { exposeAgentContext } from '@/agent/page'
import { getVideoStations, getVideoOrgs } from '@/api/waterUse/video'
import type { VideoStation } from '@/api/waterUse/video'
// 类型专用导入：编译后擦除，业务页不产生对能力声明的运行时依赖
import type { ShipinjiankongPageContract } from './shipinjiankong'

// 智能体接入见 <script setup> 末尾的 exposeAgentContext（要等下方业务函数定义完成）

/** 监控点位数据结构：直接复用后端 /video/stations 的返回类型 */
type StationItem = VideoStation

// 监控点位列表：来自后端 /video/stations（按查询日期统计抓拍状态）
const stationList = ref<StationItem[]>([])
const loading = ref(false)

// 监管单位下拉选项（后端返回，前端补「全部」）
const orgOptions = ref<string[]>(['全部'])
// 状态筛选 chips
const filterChips = ['全部', '在线', '离线', '异常抓拍', '有取水']

// 搜索关键词
const keyword = ref('')
// 监管单位（下拉）
const curOrg = ref('全部')
// 状态筛选 chip
const curFilter = ref('全部')
// 当前选中点位 id（卡片高亮）
const selectedId = ref<number | null>(null)
// 查询日期：默认当天（截图按 yyyy-MM-dd 分目录存放）
function formatDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
const queryDate = ref(formatDate(new Date()))

// ================= 地图交互（通用能力全部来自唯一适配层 useMapBridge） =================
// gis2 地图 iframe 由布局层常驻加载，本路由 meta.mapModule = 'shipinjiankong'（进入页面时已切换模块）：
//  - 推点位：watchToMap(数据源, 载荷转换) → 变化即防抖重推，适配层等模块注册好 onReceive 后调用
//  - 收点击：onFeatureClick（gis2 details 消息）→ 回选列表卡片
//  - 定位：zoomToPoint（适配层封装 map.setMapView$）
const { watchToMap, zoomToPoint } = useMapBridge({
  // 地图上点击要素：优先按 code 匹配（点位存在重名），取不到再退回 name
  onFeatureClick: (payload) => {
    const st =
      (payload?.code
        ? stationList.value.find((s) => s.code === String(payload.code))
        : undefined) ??
      (payload?.name ? stationList.value.find((s) => s.name === String(payload.name)) : undefined)
    if (st) {
      selectedId.value = st.id
    }
  }
})

/** 接口点位 → 地图 onReceive 载荷（个性化业务字段 + 经纬度经通用 parseMapCoord 校验） */
function toMapPoints(list: StationItem[]) {
  return list.flatMap((s) => {
    const coord = parseMapCoord(s)
    return coord
      ? [
          {
            id: s.id,
            code: s.code,
            name: s.name,
            org: s.org,
            status: s.status,
            site: s.site ?? '',
            xaxis: coord.lng,
            yaxis: coord.lat
          }
        ]
      : []
  })
}

/**
 * 加载监控点位列表
 * @param silent 静默刷新（定时同步状态时不显示 loading、失败也不弹提示）
 */
async function loadStations(silent = false) {
  if (!silent) {
    loading.value = true
  }
  try {
    const res = await getVideoStations({ date: queryDate.value })
    stationList.value = res.code === 0 && Array.isArray(res.data) ? res.data : []
  } catch (e) {
    console.warn('getVideoStations failed', e)
    stationList.value = []
    if (!silent) {
      window.$message?.warning('视频点位数据加载失败，请检查视频监控服务')
    }
  } finally {
    if (!silent) {
      loading.value = false
    }
  }
}

// 状态来自定时截图任务的实测结果（每小时刷新），页面停留过久会展示旧状态，
// 因此每隔一段时间静默同步一次，并在从后台切回页面时立即刷新
const REFRESH_INTERVAL = 60_000
let refreshTimer: number | undefined

function stopAutoRefresh() {
  if (refreshTimer) {
    window.clearInterval(refreshTimer)
    refreshTimer = undefined
  }
}

function onPageVisible() {
  if (document.visibilityState === 'visible') {
    loadStations(true)
  }
}

/** 加载监管单位下拉选项 */
async function loadOrgs() {
  try {
    const res = await getVideoOrgs()
    if (res.code === 0 && Array.isArray(res.data) && res.data.length) {
      orgOptions.value = ['全部', ...res.data.filter(Boolean)]
    }
  } catch (e) {
    console.warn('getVideoOrgs failed', e)
  }
}

onMounted(() => {
  loadStations()
  loadOrgs()
  refreshTimer = window.setInterval(() => {
    if (document.visibilityState === 'visible') {
      loadStations(true)
    }
  }, REFRESH_INTERVAL)
  document.addEventListener('visibilitychange', onPageVisible)
})

onUnmounted(() => {
  stopAutoRefresh()
  document.removeEventListener('visibilitychange', onPageVisible)
})

// 查询日期变化后刷新点位（抓拍状态按日期统计），并同步详情弹框内的抓拍日期
watch(queryDate, () => {
  loadStations()
  detailModalRef.value?.setDate(queryDate.value)
})

// 状态 chip 是否命中：全部不过滤；有取水看 water；异常抓拍看 capture；其余与状态精确匹配
function matchFilter(s: StationItem) {
  const f = curFilter.value
  if (f === '全部') {
    return true
  }
  if (f === '有取水') {
    return s.water
  }
  if (f === '异常抓拍') {
    return s.capture
  }
  return s.status === f
}

// 过滤后的点位列表：状态 chip + 监管单位 + 名称关键词 联动过滤
const filteredList = computed(() => {
  const kw = keyword.value.trim()
  return stationList.value.filter((s) => {
    const matchKw = !kw || s.name.includes(kw)
    const matchOrg = curOrg.value === '全部' || s.org === curOrg.value
    return matchFilter(s) && matchOrg && matchKw
  })
})

// 列表（含筛选结果）变化 → 适配层防抖重推（receive → 地图 onReceive 重新撒点）
watchToMap(() => filteredList.value, toMapPoints)

// 状态文字颜色类：在线绿 / 离线灰
// （异常抓拍不再混进状态文案，由「详情」按钮上的红点 + 异常抓拍筛选项表达）
function statusClass(s: StationItem) {
  return s.status === '在线' ? 'is-online' : 'is-offline'
}

// 选中点位：卡片高亮
function selectStation(s: StationItem) {
  selectedId.value = s.id
}

// 弹框引用：视频详情 / 关联取水口
const detailModalRef = ref<InstanceType<typeof VideoDetailModal>>()
const relWhsModalRef = ref<InstanceType<typeof RelWhsModal>>()

/** 地图按该点位经纬度缩放定位（通用 zoomToPoint）；无有效经纬度返回 false */
function zoomToStation(s: StationItem): boolean {
  const coord = parseMapCoord(s)
  if (!coord) {
    return false
  }
  zoomToPoint(coord.lng, coord.lat)
  return true
}

/** 点击卡片：高亮 + 地图按经纬度缩放定位到该点位（不弹提示，避免频繁点击打扰） */
function focusStation(s: StationItem) {
  selectedId.value = s.id
  if (!zoomToStation(s)) {
    window.$message?.warning(`「${s.name}」缺少有效经纬度，无法在地图上定位`)
  }
}

/** 定位按钮：高亮 + 地图缩放定位 + 提示 */
function locateStation(s: StationItem) {
  selectedId.value = s.id
  if (!zoomToStation(s)) {
    window.$message?.warning(`「${s.name}」缺少有效经纬度，无法在地图上定位`)
    return
  }
  window.$message?.info(`已定位「${s.name}」（${s.org}）`)
}

/** 详情：打开视频详情弹框（站点信息 + 实时视频 + 云台 + 抓拍列表），抓拍日期与列表页查询日期一致 */
function openDetail(s: StationItem) {
  selectedId.value = s.id
  detailModalRef.value?.show(s, queryDate.value)
}

/** 关联取水口：打开关联取水口列表弹框 */
function openRelWhs(s: StationItem) {
  selectedId.value = s.id
  relWhsModalRef.value?.show(s)
}

// 「后一天」按钮：查询日期 +1 天
function goNextDay() {
  const d = new Date(queryDate.value.replace(/-/g, '/'))
  d.setDate(d.getDate() + 1)
  const pad = (n: number) => String(n).padStart(2, '0')
  queryDate.value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// 智能体接入：只暴露能力；声明在同目录 shipinjiankong.ts，事件注册由公共层自动完成
exposeAgentContext({
  showVideoDetail: (name: string) => openByName(name, openDetail),
  showRelWhs: (name: string) => openByName(name, openRelWhs),
  locateByName: (name: string) => openByName(name, locateStation),
  filterByStatus: (status: string) => {
    if (filterChips.includes(status)) {
      curFilter.value = status
      window.$message?.info(`已筛选：${status}`)
    }
  },
  searchStation: (word: string) => {
    if (word) {
      keyword.value = word
      window.$message?.info(`已搜索：${word}`)
    }
  },
  setQueryDate: (date: string) => {
    if (date) {
      queryDate.value = date
      window.$message?.info(`查询日期已切换到 ${date}`)
    }
  }
} satisfies ShipinjiankongPageContract)

/** 按点位名称查找后执行页面动作；找不到时统一提示，避免各 handler 重复这段判断 */
function openByName(name: string, action: (s: StationItem) => void) {
  const st = stationList.value.find((s) => s.name === name)
  if (st) {
    action(st)
  } else {
    window.$message?.warning(`未找到监控点位「${name}」，请确认名称`)
  }
}
</script>

<template>
  <div>
    <RightSide width="420px">
      <!-- 标题行：监控信息查询 + 日期 + 后一天 -->
      <TitleBackOut content="监控信息查询" :is-click-btn="true">
        <DatePicker
          v-model="queryDate"
          type="date"
          size="small"
          width="120px"
          table-theme="blue"
          :clearable="false"
        />
        <!--        <span class="next-day" title="后一天" @click="goNextDay">»</span>-->
      </TitleBackOut>

      <div style="margin: 10px 0; padding: 10px">
        <!-- 名称搜索框 -->
        <input v-model="keyword" class="search" placeholder="请输入名称" />

        <!-- 监管单位下拉 -->
        <div class="orgrow">
          <span>监管单位</span>
          <select v-model="curOrg">
            <option v-for="org in orgOptions" :key="org">{{ org }}</option>
          </select>
        </div>

        <!-- 状态筛选 chips -->
        <div class="chips">
          <span
            v-for="f in filterChips"
            :key="f"
            class="chip"
            :class="{ active: curFilter === f }"
            @click="curFilter = f"
          >
            <i></i>{{ f }}
          </span>
        </div>

        <!-- 点位列表（data-anchor：智能体高亮「监控点位列表区域」） -->
        <div class="list" data-anchor="station-list">
          <div v-if="loading" class="list-empty">正在加载监控点位…</div>
          <div v-else-if="filteredList.length === 0" class="list-empty">未查询到符合条件的站点</div>
          <div
            v-for="st in filteredList"
            :key="st.id"
            class="card"
            :class="{ sel: selectedId === st.id }"
            @click="focusStation(st)"
          >
            <div class="card-top">
              <span class="card-name">{{ st.name }}</span>
              <span class="card-org">（{{ st.org }}）</span>
              <span class="card-status" :class="statusClass(st)">● {{ st.status }}</span>
            </div>
            <div class="card-main">
              <div class="thumb" :class="{ offline: st.status === '离线' }">
                <!-- 最新定时抓拍图片（无抓拍时保留原 CSS 示意背景） -->
                <img v-if="st.thumb" :src="st.thumb" class="thumb-img" alt="最新抓拍" />
                <span class="play">▶</span>
              </div>
              <div class="ops">
                <div class="oprow">
                  <span class="op" @click.stop="locateStation(st)">定位</span>
                  <span class="op" :class="{ main: st.main }" @click.stop="openDetail(st)">
                    详情
                    <span v-if="st.capture" class="bdg red"></span>
                    <span v-else-if="st.main" class="bdg blue"></span>
                  </span>
                  <span class="op" @click.stop="openRelWhs(st)">关联取水口</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部统计：点位总数与当前过滤后展示条数（data-anchor：智能体高亮「查询结果统计」） -->
      <div class="rp-foot" data-anchor="station-count">
        <span
          >查询结果：点位数 <b>{{ stationList.length }}</b> 个</span
        >
        <span class="show-count"
          >当前显示 <b>{{ filteredList.length }}</b> 条</span
        >
      </div>
    </RightSide>

    <!-- 视频详情弹框：站点信息 + 实时视频 + 云台 + 抓拍列表 -->
    <VideoDetailModal ref="detailModalRef" />
    <!-- 关联取水口弹框：站点关联的取水口列表 -->
    <RelWhsModal ref="relWhsModalRef" />
  </div>
</template>

<style scoped lang="scss">
/* 「后一天」按钮 */
.next-day {
  margin-left: 8px;
  font-size: 14px;
  font-weight: bold;
  color: #7fc0ff;
  cursor: pointer;

  &:hover {
    color: #fff;
  }
}

/* 名称搜索框 */
.search {
  width: 100%;
  padding: 8px 12px;
  font-size: 13px;
  color: #dff0ff;
  text-align: center;
  outline: none;
  background: rgba(8, 30, 72, 0.9);
  border: 1px solid rgba(80, 170, 255, 0.4);
  border-radius: 16px;

  &::placeholder {
    color: #7fa5d2;
  }

  &:focus {
    border-color: #57c7ff;
    box-shadow: 0 0 10px rgba(87, 199, 255, 0.45);
  }
}

/* 监管单位行 */
.orgrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  font-size: 13px;
  color: #bcd8fa;

  select {
    width: 160px;

    padding: 3px 10px;
    font-size: 12px;
    color: #dff0ff;
    text-align: center;
    text-align-last: center;
    outline: none;
    cursor: pointer;
    background: rgba(8, 30, 72, 0.9);
    border: 1px solid rgba(80, 170, 255, 0.4);
    border-radius: 3px;

    option {
      background: #0a2848;
    }
  }
}

/* 状态筛选 chips */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  font-size: 12px;
  color: #a9ccf5;
  cursor: pointer;
  background: rgba(10, 38, 88, 0.7);
  border: 1px solid rgba(90, 170, 255, 0.4);
  border-radius: 3px;
  transition: all 0.2s;

  /* 勾选小方块 */
  i {
    width: 8px;
    height: 8px;
    border: 1px solid rgba(140, 200, 255, 0.8);
    border-radius: 1px;
  }

  &.active {
    color: #fff;
    background: linear-gradient(180deg, #2b8dff, #0b4bb0);
    border-color: #7cc5ff;
    box-shadow: 0 0 10px rgba(60, 150, 255, 0.7);

    i {
      background: #fff;
      border-color: #fff;
    }
  }
}

/* 点位列表 */
.list {
  display: flex;
  flex-direction: column;
  gap: 9px;
  max-height: 480px;
  margin-top: 10px;
  overflow-y: auto;
  padding-right: 3px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(90, 170, 255, 0.45);
    border-radius: 3px;
  }
}

/* 空列表提示 */
.list-empty {
  padding: 26px 0;
  font-size: 13px;
  color: #7fa5d2;
  text-align: center;
}

/* 点位卡片 */
.card {
  padding: 8px;
  cursor: pointer;
  background: linear-gradient(160deg, rgba(16, 52, 116, 0.72), rgba(8, 26, 62, 0.6));
  border: 1px solid rgba(80, 170, 255, 0.3);
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    border-color: #57c7ff;
    box-shadow: 0 0 14px rgba(87, 199, 255, 0.35);
  }

  /* 选中态：绿色描边 */
  &.sel {
    border-color: #39e6a3;
    box-shadow: 0 0 14px rgba(57, 230, 163, 0.45);
  }
}

.card-top {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #eaf5ff;
}

.card-org {
  font-size: 11.5px;
  font-weight: 400;
  color: #8fc3ff;
}

.card-status {
  margin-left: auto;
  font-size: 11px;
  font-weight: 400;

  /* 在线绿 / 离线灰 / 异常抓拍红 */
  &.is-online {
    color: #39e6a3;
  }

  &.is-offline {
    color: #9aa9ba;
  }

  &.is-capture {
    color: #ff6b6b;
  }
}

.card-main {
  display: flex;
  gap: 9px;
  margin-top: 8px;
  align-items: center;
}

/* 视频缩略图（纯 CSS 示意 + 播放按钮） */
.thumb {
  position: relative;
  flex: none;
  width: 96px;
  height: 58px;
  overflow: hidden;
  background: linear-gradient(180deg, #6f9a5c 0 20%, #3f6b45 20% 38%, #123c5c 38% 100%);
  border: 1px solid rgba(120, 190, 255, 0.25);
  border-radius: 3px;

  /* 离线点位缩略图置灰 */
  &.offline {
    filter: grayscale(0.85) brightness(0.75);
  }

  /* 后端返回的最新抓拍图片 */
  .thumb-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .play {
    position: absolute;
    left: 50%;
    top: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    font-size: 7px;
    color: #0d2a55;
    background: rgba(255, 255, 255, 0.88);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.7);
  }
}

/* 定位/详情操作按钮 */
.oprow {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  gap: 6px;
}

.op {
  position: relative;
  padding: 5px 14px;
  font-size: 12px;
  text-align: center;
  color: #c2ddfb;
  cursor: pointer;
  background: rgba(12, 40, 92, 0.8);
  border: 1px solid rgba(90, 170, 255, 0.45);
  border-radius: 3px;
  transition: all 0.2s;

  &:hover {
    color: #fff;
    background: rgba(50, 140, 255, 0.45);
    border-color: #7cc5ff;
  }

  /* 重点点位的「详情」按钮高亮 */
  &.main {
    color: #fff;
    background: linear-gradient(180deg, #2b8dff, #0b4bb0);
    border-color: #7cc5ff;
    box-shadow: 0 0 10px rgba(60, 150, 255, 0.6);
  }

  /* 详情按钮右上角角标：异常抓拍红 / 重点点位蓝 */
  .bdg {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 8px;
    height: 8px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 50%;

    &.red {
      background: #ff4d4d;
      box-shadow: 0 0 7px #ff4d4d;
    }

    &.blue {
      background: #38b6ff;
      box-shadow: 0 0 7px #38b6ff;
    }
  }
}

/* 底部统计 */
.rp-foot {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 8px 12px;
  font-size: 12.5px;
  color: #a9ccf5;
  background: rgba(8, 30, 72, 0.6);
  border: 1px solid rgba(80, 170, 255, 0.25);

  b {
    font-size: 13.5px;
    color: #57c7ff;
  }

  .show-count {
    margin-left: auto;
    color: #7fb4ec;

    b {
      color: #7fb4ec;
    }
  }
}
</style>
