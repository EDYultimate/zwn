<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import {
  getVideoStationDetail,
  getVideoPlay,
  getVideoSnapshots,
  captureVideoSnapshot,
  downloadVideoSnapshots
} from '@/api/waterUse/video'
import type { VideoPlay, VideoStation } from '@/api/waterUse/video'
import { downloadBlob } from '@/hooks/web/useFileHandler'

/** 监控点位数据结构（与列表页一致） */
type StationItem = VideoStation

/** 站点详情扩展信息（字段与后端 VideoStationDetailVO 对齐） */
interface StationDetail {
  /** 管理单位名称：后端 manageUnit（取自 TR_DEPT.DEPTNAME） */
  manageUnit: string
  /** 所在河流名称：后端 river（取自 DICT_SPJK.KEYNAME） */
  river: string
  /** 经纬度坐标 */
  coord: string
  /** 地址 */
  addr: string
  /** 取水口管理暂未接入后端，以下两项仅作占位 */
  wtime: string
  wamt: string
}

const emptyDetail = (): StationDetail => ({
  manageUnit: '—',
  river: '—',
  coord: '—',
  addr: '—',
  wtime: '—',
  wamt: '—'
})

/** yyyy-MM-dd */
function formatDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const visible = ref(false)
// 当前查看的站点
const curStation = ref<StationItem | null>(null)
// 点位基本信息 / 播放信息（后端接口）
const detail = ref<StationDetail>(emptyDetail())
const play = ref<VideoPlay | null>(null)

/** 加载点位基本信息 */
async function loadDetail() {
  const code = curStation.value?.code
  if (!code) return
  try {
    const res = await getVideoStationDetail(code, frameDate.value)
    const d = res.code === 0 ? res.data : null
    // 经纬度：后端 XAXIS / YAXIS，经 Jackson 序列化后字段名为 xaxis / yaxis
    const x = d?.xaxis
    const y = d?.yaxis
    detail.value = {
      manageUnit: d?.manageUnit || d?.org || '—',
      river: d?.river || '—',
      coord: x && y ? `${x}, ${y}` : '—',
      addr: d?.address || d?.site || '—',
      wtime: d?.waterTime || '—',
      wamt: d?.waterAmount || '—'
    }
  } catch (e) {
    console.warn('getVideoStationDetail failed', e)
    detail.value = emptyDetail()
  }
}

/** 加载播放地址（HLS）+ 最新抓拍降级画面 */
async function loadPlay() {
  const code = curStation.value?.code
  if (!code) {
    play.value = null
    return
  }
  try {
    const res = await getVideoPlay(code, frameDate.value)
    play.value = res.code === 0 && res.data ? res.data : null
  } catch (e) {
    console.warn('getVideoPlay failed', e)
    play.value = null
  }
  videoFailed.value = false
  paused.value = false
}

/** 加载三类抓拍图片（定时拍摄 / 异常抓拍 / 取水抓拍） */
async function loadSnapshots() {
  const code = curStation.value?.code
  if (!code) {
    frames.value = []
    return
  }
  framesLoading.value = true
  try {
    const res = await getVideoSnapshots({ date: frameDate.value, code, limit: 200 })
    frames.value =
      res.code === 0 && Array.isArray(res.data)
        ? res.data.map((f) => ({
            id: f.id,
            path: f.path,
            url: f.url,
            group: toGroupName(f.groupCode),
            dur: f.duration,
            checked: false
          }))
        : []
  } catch (e) {
    console.warn('getVideoSnapshots failed', e)
    frames.value = []
  } finally {
    framesLoading.value = false
  }
}

/* ==================== 抓拍列表（定时拍摄 / 异常抓拍 / 取水抓拍） ==================== */
interface FrameItem {
  /** 截图相对路径（同时作为唯一 id 与下载参数） */
  id: string
  path: string
  /** 图片访问 URL */
  url: string
  group: '定时拍摄' | '异常抓拍' | '取水抓拍'
  /** 抓拍时刻 HH:mm:ss */
  dur: string
  checked: boolean
}

function toGroupName(code?: string): FrameItem['group'] {
  if (code === 'abnormal') return '异常抓拍'
  if (code === 'water') return '取水抓拍'
  return '定时拍摄'
}

// 抓拍帧列表 / 加载态
const frames = ref<FrameItem[]>([])
const framesLoading = ref(false)

const timedFrames = computed(() => frames.value.filter((f) => f.group === '定时拍摄'))
const captureFrames = computed(() => frames.value.filter((f) => f.group === '异常抓拍'))
const waterFrames = computed(() => frames.value.filter((f) => f.group === '取水抓拍'))

// 全选
const allChecked = computed({
  get: () => frames.value.length > 0 && frames.value.every((f) => f.checked),
  set: (v: boolean) => frames.value.forEach((f) => (f.checked = v))
})

/* ==================== 实时视频 / 抓拍回放 ==================== */
// 当前播放的帧（点击抓拍帧切换为该图片回放）
const curFrame = ref<FrameItem | null>(null)
// 播放/暂停
const paused = ref(false)
// 录制中（后端暂未提供录像存储，仅保留演示状态）
const recording = ref(false)
// 截图请求中
const shooting = ref(false)
// 原生 video 元素 / HLS 播放失败标记
const videoEl = ref<HTMLVideoElement | null>(null)
const videoFailed = ref(false)
// 浏览器是否原生支持 HLS（Safari 支持，Chrome 需额外 hls.js，此处用最新抓拍降级）
const canPlayHls = (() => {
  try {
    return !!document.createElement('video').canPlayType('application/vnd.apple.mpegurl')
  } catch {
    return false
  }
})()

// 视频画面标签：实时监控 / 最新抓拍 / 抓拍回放
const videoCaption = computed(() => {
  if (curFrame.value) {
    return `抓拍回放 · ${curFrame.value.dur}`
  }
  const name = play.value?.name || play.value?.code || ''
  if (play.value?.streamUrl && canPlayHls && !videoFailed.value) {
    return `实时监控 · ${name}`
  }
  if (play.value?.snapshotUrl) {
    return `最新抓拍 · ${name}（当前浏览器不支持 HLS 直播）`
  }
  return play.value?.online === false ? '视频暂不可用' : `实时监控 · ${name}`
})

/** 点击抓拍帧：主画面切换为该抓拍图片 */
function playFrame(f: FrameItem) {
  curFrame.value = f
  paused.value = false
  videoEl.value?.pause()
  window.$message?.info(`已切换至抓拍回放 ${f.dur}`)
}

/** 返回实时画面 */
function backToLive() {
  curFrame.value = null
  paused.value = false
  closePreview()
  videoEl.value?.play().catch(() => {})
}

/* ==================== 抓拍大图预览（放大 / 缩小 / 拖拽平移） ==================== */
const previewVisible = ref(false)
/** 预览图片地址：未传时取当前回放帧 */
const previewUrl = ref('')
/** 缩放比例（1 = 适应窗口大小） */
const previewScale = ref(1)
/** 拖拽平移偏移量 */
const previewOffset = ref({ x: 0, y: 0 })
const previewDragging = ref(false)
const MIN_SCALE = 1
const MAX_SCALE = 6
let dragStart = { x: 0, y: 0 }
let dragOrigin = { x: 0, y: 0 }

/** 设置缩放比例，回到 1 倍时同时复位位移 */
function setPreviewScale(v: number) {
  previewScale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Number(v.toFixed(2))))
  if (previewScale.value === MIN_SCALE) {
    previewOffset.value = { x: 0, y: 0 }
  }
}

function zoomIn() {
  setPreviewScale(previewScale.value + 0.5)
}

function zoomOut() {
  setPreviewScale(previewScale.value - 0.5)
}

function resetZoom() {
  setPreviewScale(MIN_SCALE)
}

/** 打开大图预览：默认放大到 1 倍（适应窗口） */
function openPreview(url?: string) {
  const src = url || curFrame.value?.url
  if (!src) return
  previewUrl.value = src
  previewScale.value = 1
  previewOffset.value = { x: 0, y: 0 }
  previewVisible.value = true
}

function closePreview() {
  previewVisible.value = false
  previewDragging.value = false
}

/** 滚轮缩放：向上放大 / 向下缩小 */
function onPreviewWheel(e: WheelEvent) {
  setPreviewScale(previewScale.value + (e.deltaY < 0 ? 0.3 : -0.3))
}

/** 拖拽平移（仅放大后可拖） */
function onDragStart(e: PointerEvent) {
  if (previewScale.value <= MIN_SCALE) return
  previewDragging.value = true
  dragStart = { x: e.clientX, y: e.clientY }
  dragOrigin = { ...previewOffset.value }
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
}

function onDragMove(e: PointerEvent) {
  if (!previewDragging.value) return
  previewOffset.value = {
    x: dragOrigin.x + (e.clientX - dragStart.x),
    y: dragOrigin.y + (e.clientY - dragStart.y)
  }
}

function onDragEnd() {
  previewDragging.value = false
}

/** Esc 关闭大图 */
function onPreviewKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closePreview()
}

watch(previewVisible, (v) => {
  if (v) {
    window.addEventListener('keydown', onPreviewKeydown)
  } else {
    window.removeEventListener('keydown', onPreviewKeydown)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onPreviewKeydown)
})

/** 暂停/播放：同时控制原生 video */
function togglePause() {
  paused.value = !paused.value
  const el = videoEl.value
  if (el) {
    if (paused.value) {
      el.pause()
    } else {
      el.play().catch(() => {})
    }
  }
  window.$message?.info(paused.value ? '实时视频已暂停' : '实时视频已恢复播放')
}

/** 截图：调用后端手动截帧并刷新抓拍列表 */
async function shot() {
  const code = curStation.value?.code
  if (!code) return
  shooting.value = true
  try {
    const res = await captureVideoSnapshot(code, 'timed')
    const item = (res.data as { items?: { ok: boolean; message?: string }[] } | null)?.items?.[0]
    if (item?.ok) {
      window.$message?.success('截图已保存')
      await loadSnapshots()
      await loadPlay()
    } else {
      window.$message?.warning(`截图失败：${item?.message || '未知原因'}`)
    }
  } catch (e) {
    console.warn('captureVideoSnapshot failed', e)
    window.$message?.warning('截图失败，请检查视频平台连接')
  } finally {
    shooting.value = false
  }
}

/** 录制开关（后端暂未接入录像存储） */
function toggleRec() {
  recording.value = !recording.value
  window.$message?.info(recording.value ? '开始录制（演示）…' : '录制结束（演示）')
}

/** 下载勾选的抓拍图片：后端打包 zip */
async function download() {
  const paths = frames.value.filter((f) => f.checked).map((f) => f.path)
  if (!paths.length) {
    window.$message?.info('请先勾选需要下载的抓拍图片')
    return
  }
  try {
    const res = await downloadVideoSnapshots(paths)
    downloadBlob(res.data, `视频抓拍_${frameDate.value}.zip`)
    window.$message?.success(`已下载 ${paths.length} 张抓拍图片`)
  } catch (e) {
    console.warn('downloadVideoSnapshots failed', e)
    window.$message?.warning('抓拍图片下载失败')
  }
}

// 抓拍列表查询日期
const frameDate = ref(formatDate(new Date()))

// 日期切换：刷新抓拍列表与降级画面
watch(frameDate, () => {
  if (visible.value) {
    loadSnapshots()
    loadPlay()
  }
})

/**
 * 打开弹框：展示指定监控点位的视频详情
 * @param st 点位对象（列表页传入）
 * @param date 抓拍查询日期（取自列表页查询日期，保证两个页面日期一致）
 */
const show = (st: StationItem, date?: string) => {
  curStation.value = st
  curFrame.value = null
  paused.value = false
  recording.value = false
  videoFailed.value = false
  detail.value = emptyDetail()
  play.value = null
  frames.value = []
  // 先同步日期（此时弹框未打开，不会触发 watch 重复请求）
  if (date && date !== frameDate.value) {
    frameDate.value = date
  }
  visible.value = true
  // 基本信息 / 播放地址 / 抓拍列表并行加载
  loadDetail()
  loadPlay()
  loadSnapshots()
}

/**
 * 同步抓拍查询日期（列表页查询日期变化时调用）
 * 弹框已打开时由 frameDate 的 watch 立即刷新抓拍列表与画面
 */
const setDate = (date: string) => {
  if (date && date !== frameDate.value) {
    frameDate.value = date
  }
}

const hide = () => {
  visible.value = false
  closePreview()
  videoEl.value?.pause()
}

defineExpose({ show, hide, setDate })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    table-theme="light"
    :title="curStation?.name || '视频详情'"
    :style-params="{ width: '1200px', height: 'auto' }"
  >
    <div class="vm-wrap">
      <!-- 左侧：站点信息 + 实时视频 -->
      <div class="vm-left">
        <div class="vm-info">
          <div class="row">
            <span>管理单位：</span><b>{{ detail.manageUnit }}</b>
          </div>
          <div class="row">
            <span>所在河流：</span><b>{{ detail.river }}</b>
          </div>
          <div class="row">
            <span>坐　　标：</span><b>{{ detail.coord }}</b>
          </div>
          <div class="row">
            <span>地　　址：</span><b>{{ detail.addr }}</b>
          </div>
        </div>

        <div class="vm-label">【实时视频】</div>
        <!-- 画面说明条：放在视频框外部，不遮挡画面与控制条 -->
        <div class="vm-cam">
          <span class="vm-caption">{{ videoCaption }}</span>
          <span v-if="curFrame" class="vm-back" @click="openPreview()">点击放大 ⤢</span>
          <span v-if="curFrame" class="vm-back" @click="backToLive">返回实时</span>
          <a
            v-else-if="play?.playUrl"
            class="vm-back"
            :href="play.playUrl"
            target="_blank"
            rel="noopener"
            >平台播放页 ↗</a
          >
        </div>
        <div
          class="vm-video"
          :class="{ paused, zoomable: !!curFrame }"
          @click="curFrame && openPreview()"
        >
          <!-- 点击抓拍帧：主画面回放该图片（等比完整展示，不裁切），再点画面可看大图 -->
          <img
            v-if="curFrame?.url"
            :src="curFrame.url"
            class="vm-frame is-contain"
            alt="抓拍回放"
          />
          <!-- 实时视频：原生支持 HLS 的浏览器直接播放平台 m3u8 流 -->
          <video
            v-else-if="play?.streamUrl && canPlayHls && !videoFailed"
            ref="videoEl"
            :src="play.streamUrl"
            class="vm-player"
            autoplay
            muted
            playsinline
            controls
            @error="videoFailed = true"
          ></video>
          <!-- 不支持 HLS 时降级为最新定时抓拍画面 -->
          <img
            v-else-if="play?.snapshotUrl"
            :src="play.snapshotUrl"
            class="vm-frame"
            alt="最新抓拍画面"
          />
          <div v-else class="vm-scene"></div>
          <span v-if="paused" class="vm-pausemark">‖</span>
          <span v-if="recording" class="vm-recmark">● REC</span>
        </div>

        <!-- 暂停 / 截图 / 录制 -->
        <div class="vm-btns">
          <button class="pill" @click="togglePause">{{ paused ? '播 放' : '暂 停' }}</button>
          <button class="pill" :disabled="shooting" @click="shot">
            {{ shooting ? '截图…' : '截 图' }}
          </button>
          <button class="pill" :class="{ rec: recording }" @click="toggleRec">
            {{ recording ? '停止录制' : '录 制' }}
          </button>
        </div>
      </div>

      <!-- 右侧：抓拍列表 -->
      <div class="vm-right">
        <div class="vm-tools">
          <n-checkbox v-model:checked="allChecked">全选</n-checkbox>
          <span v-if="framesLoading" class="vm-hint">抓拍加载中…</span>
          <span v-else-if="!frames.length" class="vm-hint">当日暂无抓拍图片</span>
          <span class="dl" @click="download">⬇ 下载</span>
          <span class="vm-time">
            时间

            <DatePicker
              v-model="frameDate"
              type="date"
              size="small"
              width="120px"
              table-theme="light"
              :clearable="false"
            />

            <!--            <n-date-picker-->
            <!--              v-model:formatted-value="frameDate"-->
            <!--              type="date"-->
            <!--              size="small"-->
            <!--              :clearable="false"-->
            <!--              style="width: 140px"-->
            <!--              @update:formatted-value="onFrameDateChange"-->
            <!--            />-->
          </span>
        </div>

        <div class="vm-label">【定时拍摄】</div>
        <div class="fgrid">
          <div
            v-for="f in timedFrames"
            :key="f.id"
            class="frame"
            :class="{ on: curFrame?.id === f.id }"
            @click="playFrame(f)"
          >
            <img class="scene scene-img" :src="f.url" alt="抓拍图片" />
            <n-checkbox v-model:checked="f.checked" @click.stop />
            <button class="zoom" title="查看大图" @click.stop="openPreview(f.url)">⤢</button>
            <span class="dur">{{ f.dur }}</span>
          </div>
        </div>

        <div class="vm-label">【异常抓拍】</div>
        <div class="fgrid">
          <div
            v-for="f in captureFrames"
            :key="f.id"
            class="frame warn"
            :class="{ on: curFrame?.id === f.id }"
            @click="playFrame(f)"
          >
            <img class="scene scene-img" :src="f.url" alt="抓拍图片" />
            <n-checkbox v-model:checked="f.checked" @click.stop />
            <button class="zoom" title="查看大图" @click.stop="openPreview(f.url)">⤢</button>
            <span class="dur">{{ f.dur }}</span>
          </div>
        </div>

        <div class="vm-label">【取水抓拍】</div>
        <div class="waterrow">
          <div
            v-for="f in waterFrames"
            :key="f.id"
            class="frame water"
            :class="{ on: curFrame?.id === f.id }"
            @click="playFrame(f)"
          >
            <img class="scene scene-img" :src="f.url" alt="抓拍图片" />
            <n-checkbox v-model:checked="f.checked" @click.stop />
            <button class="zoom" title="查看大图" @click.stop="openPreview(f.url)">⤢</button>
            <span class="dur">{{ f.dur }}</span>
          </div>
          <div class="winfo">
            取水时段：{{ detail.wtime }}<br />
            上报取水量：<b>{{ detail.wamt }}</b>
          </div>
        </div>
      </div>
    </div>

    <!--    <template #action>-->
    <!--      <n-space justify="end">-->
    <!--        <n-button @click="hide">关闭</n-button>-->
    <!--      </n-space>-->
    <!--    </template>-->

    <!-- 抓拍大图预览：按钮/滚轮缩放，放大后可拖拽平移，Esc 或点击遮罩关闭 -->
    <Teleport to="body">
      <div
        v-if="previewVisible"
        class="pv-mask"
        @click.self="closePreview"
        @wheel.prevent="onPreviewWheel"
      >
        <div class="pv-bar">
          <button class="pv-btn" title="缩小" @click="zoomOut">－</button>
          <span class="pv-scale">{{ Math.round(previewScale * 100) }}%</span>
          <button class="pv-btn" title="放大" @click="zoomIn">＋</button>
          <button class="pv-btn" title="适应窗口" @click="resetZoom">适应</button>
        </div>
        <div
          class="pv-stage"
          :class="{ dragging: previewDragging, zoomed: previewScale > 1 }"
          @pointerdown="onDragStart"
          @pointermove="onDragMove"
          @pointerup="onDragEnd"
          @pointercancel="onDragEnd"
        >
          <img
            :src="previewUrl"
            class="pv-img"
            :style="{
              transform: `translate(${previewOffset.x}px, ${previewOffset.y}px) scale(${previewScale})`
            }"
            alt="抓拍大图"
            draggable="false"
            @click.stop
          />
        </div>
        <span class="pv-close" title="关闭（Esc）" @click="closePreview">×</span>
      </div>
    </Teleport>
  </pro-modal>
</template>

<style scoped lang="scss">
/* 整体双栏布局：左视频 / 右抓拍 */
.vm-wrap {
  display: flex;
  gap: 24px;
  padding: 4px 6px 8px;
}

.vm-left {
  flex: none;
  width: 50%;
}

.vm-right {
  flex: 1;
  min-width: 0;
  /* 左右分栏分割线 */
  padding-left: 24px;
  border-left: 1px solid rgba(55, 122, 236, 0.18);
}

/* 站点信息 */
.vm-info {
  margin-bottom: 10px;

  .row {
    display: flex;
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 1.6;

    span {
      flex: none;
      color: rgba(31, 59, 99, 0.65);
    }

    b {
      font-weight: 400;
      color: #1f3b63;
    }
  }
}

/* 分组标题：主题蓝 */
.vm-label {
  margin: 10px 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #377aec;
}

/* 实时视频画面 */
.vm-video {
  position: relative;
  height: 300px;
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(180deg, #9dbfd6 0 38%, #5d94b8 38% 52%, #5f8a55 52% 100%);
  border: 1px solid rgba(55, 122, 236, 0.25);
  border-radius: 3px;

  &.paused .vm-scene,
  &.paused .vm-player,
  &.paused .vm-frame {
    filter: brightness(0.6);
  }
}

.vm-scene {
  position: absolute;
  inset: 0;
}

/* 实时播放器与抓拍回放图片 */
.vm-player,
.vm-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #0b2a48;
}

/* 抓拍回放：等比缩放完整展示（不裁切，多余区域留底色） */
.vm-frame.is-contain {
  object-fit: contain;
}

/* 回放态下点击画面可看大图 */
.vm-video.zoomable {
  cursor: zoom-in;
}

/* 画面说明条：位于视频框上方（框外），说明文字 + 操作链接 */
.vm-cam {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 6px;
  padding: 0 2px;
  font-size: 12.5px;
  color: #4e6a94;

  .vm-caption {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

/* 说明条上的操作链接（点击放大 / 返回实时 / 平台播放页） */
.vm-back {
  flex: none;
  color: #377aec;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #1f5fd0;
  }
}

.vm-pausemark {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 34px;
  color: #fff;
  transform: translate(-50%, -50%);
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  pointer-events: none;
}

.vm-recmark {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: rgba(220, 38, 38, 0.85);
  border-radius: 3px;
  animation: blink 1s infinite;
  pointer-events: none;
}

@keyframes blink {
  50% {
    opacity: 0.4;
  }
}

/* 暂停/截图/录制：胶囊按钮 */
.vm-btns {
  display: flex;
  justify-content: center;
  gap: 34px;
  margin-top: 16px;
}

.pill {
  min-width: 92px;
  padding: 7px 22px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  background: #377aec;
  border: none;
  border-radius: 18px;
  transition: all 0.2s;

  font-weight: bold;

  &:hover {
    background: #4a94f0;
  }

  /* 录制中红色提示 */
  &.rec {
    color: #fff;
    background: #d9534f;

    &:hover {
      background: #e46a66;
    }
  }
}

/* 右侧工具条 */
.vm-tools {
  display: flex;
  gap: 18px;
  align-items: center;

  /* 全选文字加深，避免浅灰在白底上不清晰 */
  :deep(.n-checkbox .n-checkbox__label) {
    color: #1f3b63;
  }

  .vm-hint {
    font-size: 12.5px;
    color: #8a9cb5;
  }

  .dl {
    font-size: 13.5px;
    color: #1f3b63;
    cursor: pointer;

    &:hover {
      color: #377aec;
    }
  }

  .vm-time {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-left: auto;
    font-size: 13.5px;
    color: #4e6a94;
  }
}

/* 抓拍帧网格：3 列 */
.fgrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px 10px;
}

.frame {
  position: relative;
  cursor: pointer;

  .scene {
    height: 64px;
    background: linear-gradient(180deg, #b5d2e2 0 42%, #5d94b8 42% 54%, #5f8a55 54% 100%);
    border: 1px solid rgba(55, 122, 236, 0.2);
    border-radius: 2px;
  }

  /* 真实抓拍图片铺满帧区域 */
  .scene-img {
    display: block;
    width: 100%;
    object-fit: cover;
  }

  /* 勾选框悬挂在帧左上角 */
  :deep(.n-checkbox) {
    position: absolute;
    top: -7px;
    left: -7px;
    z-index: 1;
  }

  /* 时长在帧下方居中 */
  .dur {
    display: block;
    margin-top: 5px;
    font-size: 12px;
    color: #4e6a94;
    text-align: center;
  }

  /* 选中描边 */
  &.on .scene {
    border-color: #377aec;
    box-shadow: 0 0 8px rgba(55, 122, 236, 0.35);
  }

  /* 异常抓拍红调 / 取水抓拍蓝调 */
  &.warn .scene {
    background: linear-gradient(180deg, #d8b0a0 0 40%, #8a6a55 40% 100%);
  }

  &.water .scene {
    background: linear-gradient(180deg, #a9cede 0 45%, #4a86ad 45% 100%);
  }
}

/* 取水抓拍行：帧 + 取水信息并排 */
.waterrow {
  display: flex;
  gap: 18px;
  align-items: flex-start;

  .frame {
    flex: none;
    width: 150px;
  }
}

/* 抓拍帧「查看大图」按钮：挂在帧右上角，悬停加深 */
.zoom {
  position: absolute;
  top: -7px;
  right: -7px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  font-size: 11px;
  line-height: 1;
  color: #377aec;
  cursor: pointer;
  background: #fff;
  border: 1px solid rgba(55, 122, 236, 0.45);
  border-radius: 50%;
  opacity: 0.65;
  transition: opacity 0.15s;

  &:hover {
    opacity: 1;
    box-shadow: 0 0 6px rgba(55, 122, 236, 0.5);
  }
}

.frame:hover .zoom {
  opacity: 1;
}

/* 取水时段信息：深蓝文字，数值主题蓝 */
.winfo {
  padding-top: 6px;
  font-size: 13.5px;
  line-height: 1.9;
  color: #1f3b63;

  b {
    font-weight: 600;
    color: #377aec;
  }
}

/* ==================== 抓拍大图预览 ==================== */
.pv-mask {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(3, 12, 28, 0.88);
}

.pv-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: none;

  /* 放大后可拖拽平移 */
  &.zoomed {
    cursor: grab;
  }

  &.dragging {
    cursor: grabbing;
  }
}

.pv-img {
  max-width: 92vw;
  max-height: 82vh;
  transition: transform 0.12s ease-out;
  user-select: none;
  -webkit-user-drag: none;
}

/* 拖拽时取消过渡，避免跟手延迟 */
.pv-stage.dragging .pv-img {
  transition: none;
}

.pv-bar {
  position: fixed;
  bottom: 26px;
  left: 50%;
  z-index: 2;
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 6px 14px;
  background: rgba(10, 30, 60, 0.85);
  border: 1px solid rgba(90, 170, 255, 0.35);
  border-radius: 20px;
  transform: translateX(-50%);
}

.pv-btn {
  min-width: 34px;
  padding: 4px 10px;
  font-size: 13px;
  color: #dff0ff;
  cursor: pointer;
  background: rgba(55, 122, 236, 0.25);
  border: 1px solid rgba(90, 170, 255, 0.4);
  border-radius: 12px;

  &:hover {
    background: rgba(55, 122, 236, 0.6);
  }
}

.pv-scale {
  min-width: 52px;
  font-size: 13px;
  color: #9dc7ff;
  text-align: center;
}

.pv-close {
  position: fixed;
  top: 20px;
  right: 26px;
  z-index: 2;
  font-size: 30px;
  line-height: 1;
  color: #dff0ff;
  cursor: pointer;

  &:hover {
    color: #fff;
  }
}
</style>
