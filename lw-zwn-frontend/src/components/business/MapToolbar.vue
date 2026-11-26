<script lang="ts">
// 模块作用域：withDefaults 默认值工厂只能引用模块作用域变量（不能引用 <script setup> 局部变量）
export interface MapRiverItem {
  name: string
  code: string
}
export interface MapToolItem {
  key: string
  icon?: string
  label?: string
  handler?: (win: Window | null) => void
}

// 默认河流（迁自旧项目 portalIndex.vue rivers 数组，STCD → 地图河流定位）
export const DEFAULT_RIVERS: MapRiverItem[] = [
  { name: '滦河', code: 'QSXK00000001' },
  { name: '蓟运河', code: 'QSXK00000002' },
  { name: '泃河', code: 'QSXK00000003' },
  { name: '拒马河', code: 'QSXK00000004' },
  { name: '滹沱河', code: 'QSXK00000005' },
  { name: '浊漳河1', code: 'QSXK00000006' },
  { name: '浊漳河2', code: 'QSXK00000007' },
  { name: '清漳河', code: 'QSXK00000008' },
  { name: '漳河', code: 'QSXK00000009' },
  { name: '卫河', code: 'QSXK00000010' },
  { name: '共产主义渠', code: 'QSXK00000011' },
  { name: '卫运河', code: 'QSXK00000012' },
  { name: '漳卫新河', code: 'QSXK00000013' },
  { name: '南运河', code: 'QSXK00000014' }
]
</script>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

/**
 * 地图工具栏（可复用组件，迁自旧项目 portalIndex.vue 的"指北针这一溜"工具栏）
 *
 * 默认工具（传入 tools 数组即可显示）：
 *   north 指北针（箭头随地图 rotate 事件旋转，点击复位正北）
 *   fullview 复位/全景
 *   clear 清除绘制
 *   coordinate 坐标搜索（经度/纬度定位，调地图 m_opositionPoint）
 *   river 河流选择（点击定位高亮，调地图 m_oposition）
 *   boxselect 框选（切换型：点击激活/再点退出，调地图 selectTool('boxselect'/'stopboxselect')；
 *              地图双击完成绘制后 postMessage boxselect，按钮自动复位；配合清除按钮联动复位）
 *
 * 自定义口：
 *   1. tools 传对象项 {key, icon, label, handler} 追加自定义按钮（handler 优先于内置行为）；
 *   2. 默认插槽追加自定义内容到工具列末尾；
 *   3. getMapWin 自定义地图 window 获取方式（缺省取 .map-frame iframe）。
 *
 * 地图应用需暴露 global 方法：selectTool / m_opositionPoint / m_oposition（如 diaoshui_mapbox szyjg/main.js）。
 */

const props = withDefaults(
  defineProps<{
    // 显示的工具（内置 key 字符串或自定义对象），默认全部 5 个
    tools?: Array<string | MapToolItem>
    // 河流选择列表（缺省旧项目 14 条）
    rivers?: MapRiverItem[]
    // 自定义地图 window 获取方式（缺省取 .map-frame iframe）
    getMapWin?: () => Window | null
    // 工具栏位置（相对视口）
    top?: string
    right?: string
  }>(),
  {
    tools: () => ['north', 'fullview', 'clear', 'coordinate', 'river'],
    rivers: () => DEFAULT_RIVERS,
    getMapWin: () => null,
    // 默认放在右侧栏左边：RightSide 固定 right:20px，宽度 470px → 工具栏 right = 20+470+10 间隙
    top: '130px',
    right: '500px'
  }
)

// 内置工具元信息（label 用于 tooltip）
const BUILTIN_META: Record<string, { label: string }> = {
  north: { label: '指北针' },
  fullview: { label: '复位' },
  clear: { label: '清除' },
  coordinate: { label: '坐标' },
  river: { label: '河流' },
  boxselect: { label: '框选' }
}

// 展开型工具（点击切换展开面板）
const EXPAND_KEYS = ['coordinate', 'river']

// 切换型工具（点击激活/再点退出，如框选；激活调 start 命令、退出调 stop 命令）
const TOGGLE_ACTIONS: Record<string, { start: string; stop: string }> = {
  boxselect: { start: 'boxselect', stop: 'stopboxselect' }
}

// 切换型工具激活时的操作提示文案（用于顶部浮动提示横幅，未配置则不显示）
const TOGGLE_HINTS: Record<string, string> = {
  boxselect:
    '框选模式已开启：请在地图上点击鼠标左键绘制矩形框，双击地图完成框选；框选范围内的取水点位将自动汇总至取水量监测弹窗。再次点击框选按钮可退出。'
}

// 指北针角度（监听地图 rotate 事件）
const compassAngle = ref(0)
const expanded = ref<Record<string, boolean>>({})
const toggled = ref<Record<string, boolean>>({})
const coordX = ref('')
const coordY = ref('')

const toolList = computed<MapToolItem[]>(() =>
  props.tools.map((t) => {
    const item = typeof t === 'string' ? { key: t } : { ...t }
    if (!item.label && BUILTIN_META[item.key]) {
      item.label = BUILTIN_META[item.key].label
    }
    return item
  })
)

// 当前激活中的切换型工具提示文案（同时只显示一个，框选完成/退出后自动消失）
const activeToggleHint = computed(() => {
  const activeKey = Object.keys(toggled.value).find((k) => toggled.value[k])
  return activeKey ? TOGGLE_HINTS[activeKey] || '' : ''
})

function resolveMapWin(): Window | null {
  const custom = props.getMapWin?.()
  if (custom) {
    return custom
  }
  const frame = document.querySelector<HTMLIFrameElement>('.map-frame')
  return frame?.contentWindow ?? null
}

// 内置按钮行为映射：key → 地图 selectTool 参数
const TOOL_ACTIONS: Record<string, string> = {
  north: 'north',
  fullview: 'fullview',
  clear: 'clear'
}

// 点击工具：展开型切换面板（坐标/河流互斥，同时只开一个）；自定义 handler 优先；否则走内置行为
function onToolClick(tool: MapToolItem) {
  if (EXPAND_KEYS.includes(tool.key)) {
    const willOpen = !expanded.value[tool.key]
    Object.keys(expanded.value).forEach((k) => {
      expanded.value[k] = false
    })
    expanded.value[tool.key] = willOpen
    return
  }
  if (tool.handler) {
    tool.handler(resolveMapWin())
    return
  }
  // 切换型工具：激活/退出（如框选），按钮高亮表示激活中
  const toggle = TOGGLE_ACTIONS[tool.key]
  if (toggle) {
    const isActive = !toggled.value[tool.key]
    toggled.value[tool.key] = isActive
    ;(resolveMapWin() as any)?.selectTool?.(isActive ? toggle.start : toggle.stop)
    return
  }
  const action = TOOL_ACTIONS[tool.key]
  if (action) {
    // 清除时同步复位切换型工具（框选绘制一并清理，地图侧 clearBoxSelect）
    if (tool.key === 'clear') {
      Object.keys(toggled.value).forEach((k) => {
        toggled.value[k] = false
      })
    }
    ;(resolveMapWin() as any)?.selectTool?.(action)
  }
}

// 坐标搜索：经度,纬度 → 地图定位（m_opositionPoint）
function onSearchCoord() {
  const lng = Number(coordX.value)
  const lat = Number(coordY.value)
  if (isNaN(lng) || isNaN(lat) || !coordX.value.trim() || !coordY.value.trim()) {
    return
  }
  ;(resolveMapWin() as any)?.m_opositionPoint?.(lng, lat)
}

// 河流选择：定位高亮对应河流（m_oposition）
function onRiverClick(river: MapRiverItem) {
  ;(resolveMapWin() as any)?.m_oposition?.(river.code)
}

// 监听地图消息：rotate → 指北针箭头跟随旋转；boxselect（地图双击完成框选）→ 按钮自动复位
function onMapMessage(e: MessageEvent) {
  const data = e.data
  if (!data || !data.eventname) {
    return
  }
  if (data.eventname === 'rotate') {
    compassAngle.value = Number(data.state) || 0
  } else if (data.eventname === 'boxselect') {
    toggled.value.boxselect = false
  }
}

onMounted(() => {
  window.addEventListener('message', onMapMessage)
})
onUnmounted(() => {
  window.removeEventListener('message', onMapMessage)
})
</script>

<template>
  <!-- 切换型工具激活提示横幅（框选激活时显示，teleport 到 body 顶部居中，与工具栏位置解耦） -->
  <teleport to="body">
    <div v-if="activeToggleHint" class="toggle-hint-banner">
      <span class="hint-icon" aria-hidden="true">!</span>
      <span class="hint-text">{{ activeToggleHint }}</span>
    </div>
  </teleport>

  <div class="map-toolbar" :style="{ top, right }">
    <!-- 展开面板（坐标输入 / 河流按钮，向左弹出） -->
    <div class="toolbar-pop">
      <div v-if="expanded.coordinate" class="pop-panel coord-panel">
        <input v-model="coordX" type="text" class="coord-input" placeholder="经度" />
        <span class="comma">,</span>
        <input v-model="coordY" type="text" class="coord-input" placeholder="纬度" />
        <button class="pop-btn pop-btn--primary" @click="onSearchCoord">搜索</button>
      </div>
      <div v-if="expanded.river" class="pop-panel river-panel">
        <button
          v-for="river in rivers"
          :key="river.code"
          class="pop-btn"
          @click="onRiverClick(river)"
        >
          {{ river.name }}
        </button>
      </div>
    </div>

    <!-- 工具列 -->
    <div class="toolbar-col">
      <div
        v-for="tool in toolList"
        :key="tool.key"
        class="tool-item"
        :class="{ 'tool-item--active': expanded[tool.key] || toggled[tool.key] }"
        :title="tool.label"
        @click="onToolClick(tool)"
      >
        <!-- 指北针：箭头随地图旋转 -->
        <svg
          v-if="tool.key === 'north'"
          class="tool-icon compass"
          :style="{ transform: `rotate(${compassAngle}deg)` }"
          viewBox="0 0 24 24"
          width="22"
          height="22"
        >
          <path d="M12 2 L16 12 L12 10 L8 12 Z" fill="#4db6ff" />
          <path d="M12 22 L16 12 L12 14 L8 12 Z" fill="#fff" opacity="0.55" />
        </svg>
        <!-- 复位/全景 -->
        <svg
          v-else-if="tool.key === 'fullview'"
          class="tool-icon"
          viewBox="0 0 24 24"
          width="22"
          height="22"
        >
          <path
            d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm7 14v-2h-1v2h1zm-4 0v-2H7v2h1zm8 0v-2h-1v2h1zm-7.5-5.5l1.5 1.5 4-4-1.5-1.5-2.5 2.5-1-1-1.5 1.5z"
            fill="#fff"
          />
        </svg>
        <!-- 清除 -->
        <svg
          v-else-if="tool.key === 'clear'"
          class="tool-icon"
          viewBox="0 0 24 24"
          width="22"
          height="22"
        >
          <path
            d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.24 13.59L14.83 17 12 14.17 9.17 17l-1.41-1.41L10.59 12 7.76 9.17l1.41-1.41L12 10.59 14.83 7.76l1.41 1.41L13.41 12l2.83 2.83z"
            fill="#fff"
          />
        </svg>
        <!-- 坐标搜索 -->
        <svg
          v-else-if="tool.key === 'coordinate'"
          class="tool-icon"
          viewBox="0 0 24 24"
          width="22"
          height="22"
        >
          <path
            d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 15.5A5.5 5.5 0 1 1 17.5 12 5.5 5.5 0 0 1 12 17.5zM12 4a8 8 0 1 1-8 8 8 8 0 0 1 8-8zm0 2a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3z"
            fill="#fff"
          />
        </svg>
        <!-- 河流 -->
        <svg
          v-else-if="tool.key === 'river'"
          class="tool-icon"
          viewBox="0 0 24 24"
          width="22"
          height="22"
        >
          <path
            d="M3 6c2.5 0 2.5 1.5 5 1.5S10.5 6 13 6s2.5 1.5 5 1.5S20.5 6 21 6v2c-.5 0-1-1.5-3-1.5S15.5 8 13 8s-2.5-1.5-5-1.5S5.5 8 5 8V6zm0 5c2.5 0 2.5 1.5 5 1.5s2.5-1.5 5-1.5 2.5 1.5 5 1.5 2.5-1.5 3-1.5v2c-.5 0-1-1.5-3-1.5s-2.5 1.5-5 1.5-2.5-1.5-5-1.5S5.5 13 5 13v-2zm0 5c2.5 0 2.5 1.5 5 1.5s2.5-1.5 5-1.5 2.5 1.5 5 1.5 2.5-1.5 3-1.5v2c-.5 0-1-1.5-3-1.5s-2.5 1.5-5 1.5-2.5-1.5-5-1.5S5.5 18 5 18v-2z"
            fill="#fff"
          />
        </svg>
        <!-- 框选：切换型工具（激活时高亮，双击完成绘制后自动复位） -->
        <svg
          v-else-if="tool.key === 'boxselect'"
          class="tool-icon"
          viewBox="0 0 24 24"
          width="22"
          height="22"
        >
          <path
            d="M5 3h4v2H7v2H5V3zm10 0h4v4h-2V5h-2V3zM5 17h2v2h2v2H5v-4zm12 0h2v-2h2v4h-4v-2z"
            fill="#fff"
          />
        </svg>
        <!-- 自定义工具：icon 文本/SVG 或 key -->
        <span v-else class="tool-custom">{{ tool.icon || tool.label || tool.key }}</span>
      </div>

      <!-- 自定义扩展插槽：追加到工具列末尾 -->
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.map-toolbar {
  position: fixed;
  z-index: 20;
  pointer-events: auto; /* 页面容器整体穿透时工具栏仍可交互 */
  display: flex;
  align-items: center;
}

/* 切换型工具激活提示横幅（框选激活时显示，teleport 到 body 顶部居中，与工具栏位置解耦）
   注意：teleport 到 body 后元素已脱离 .map-toolbar 容器，但 Vue scoped 样式
   会给元素加 data-v-xxx 属性，因此 scoped 选择器仍可命中，无需 :deep()。 */
.toggle-hint-banner {
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  width: 360px;
  max-width: calc(100vw - 24px);
  padding: 10px 14px;
  background: rgba(16, 30, 69, 0.92);
  border: 1px solid rgba(77, 182, 255, 0.7);
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: flex-start;
  gap: 8px;
  animation: hintFadeIn 0.25s ease;

  .hint-icon {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #4db6ff;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    line-height: 18px;
    text-align: center;
  }

  .hint-text {
    flex: 1;
    color: #e6f4ff;
    font-size: 12px;
    line-height: 1.6;
  }
}

@keyframes hintFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -8px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

/* 展开面板：工具列左侧弹出 */
.toolbar-pop {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.pop-panel {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(16, 30, 69, 0.85);
  border: 1px solid rgba(77, 182, 255, 0.5);
  border-radius: 6px;
  backdrop-filter: blur(4px);
  white-space: nowrap;
}

.coord-panel {
  .coord-input {
    width: 72px;
    height: 26px;
    padding: 0 8px;
    border: none;
    border-radius: 4px;
    outline: none;
    font-size: 13px;
    color: #333;
    background: #fff;

    &::placeholder {
      color: #999;
    }
  }

  .comma {
    color: #fff;
    font-size: 14px;
    font-weight: bold;
  }
}

.river-panel {
  flex-wrap: wrap;
  max-width: 340px;
}

.pop-btn {
  height: 28px;
  padding: 0 10px;
  border: 1px solid #4db6ff;
  border-radius: 4px;
  background: rgba(0, 100, 200, 0.7);
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 150, 255, 0.9);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}

.pop-btn--primary {
  background: #1766db;

  &:hover {
    background: #0e8ee7;
  }
}

/* 工具列：竖排按钮 */
.toolbar-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tool-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: rgba(16, 30, 69, 0.75);
  border: 1px solid rgba(77, 182, 255, 0.35);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 100, 200, 0.8);
    border-color: #4db6ff;
  }

  &--active {
    background: rgba(0, 100, 200, 0.85);
    border-color: #4db6ff;
  }
}

.tool-icon {
  display: block;
}

.compass {
  transition: transform 0.3s ease;
}

.tool-custom {
  color: #fff;
  font-size: 12px;
}
</style>
