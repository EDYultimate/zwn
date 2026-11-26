<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue'
import { DEFAULT_RIVERS, type MapRiverItem } from '@/components/business/MapToolbar.vue'

/**
 * 河流选择器（取用水一张图左下）
 *
 * 由地图工具栏 MapToolbar 的「河流」功能（倒数第二个工具）抽出：原为工具栏内展开面板，
 * 现改为独立按钮放在「委发证取水许可证统计」模块下方。点击后**从按钮右侧横向滑出一整行**
 * 全部河流（宽度随内容自适应），点某条河流由父组件调地图 m_oposition(code) 定位高亮。
 *
 * 注意：面板容器（LeftSide）为 overflow:auto，会裁掉横向溢出的内容，
 * 故滑出条 teleport 到 body 并用 fixed 定位（位置按按钮实时计算），避免被裁。
 *
 * 河流数据复用 MapToolbar 导出的 DEFAULT_RIVERS，避免两处维护同一份清单。
 */
const emit = defineEmits<{ (e: 'select', river: MapRiverItem): void }>()

const open = ref(false)
const toggleRef = ref<HTMLButtonElement | null>(null)
const stripStyle = ref<Record<string, string>>({})

/** 按按钮位置计算滑出条坐标（右对齐按钮右缘 + 间距，垂直与按钮居中对齐） */
function placeStrip() {
  const el = toggleRef.value
  if (!el) {
    return
  }
  const r = el.getBoundingClientRect()
  stripStyle.value = {
    left: `${Math.round(r.right + 8)}px`,
    top: `${Math.round(r.top + r.height / 2)}px`,
    transform: 'translateY(-50%)'
  }
}

function toggle() {
  open.value = !open.value
  if (open.value) {
    placeStrip()
    window.addEventListener('resize', placeStrip)
    window.addEventListener('scroll', placeStrip, true)
  } else {
    detach()
  }
}

function detach() {
  window.removeEventListener('resize', placeStrip)
  window.removeEventListener('scroll', placeStrip, true)
}

function close() {
  open.value = false
  detach()
}

function pick(river: MapRiverItem) {
  emit('select', river)
}

onBeforeUnmount(detach)

// 供外部（如切换线路）收起时调用
defineExpose({ close })
</script>

<template>
  <div class="river-selector">
    <button ref="toggleRef" class="rs-toggle" :class="{ 'is-open': open }" @click="toggle">
      <span class="rs-caret" aria-hidden="true"></span>
      <span class="rs-label">选择河段</span>
    </button>

    <!-- 滑出条：teleport 到 body，避免被面板 overflow 裁剪 -->
    <Teleport to="body">
      <Transition name="rs-slide">
        <div v-show="open" class="rs-strip" :style="stripStyle">
          <button
            v-for="river in DEFAULT_RIVERS"
            :key="river.code"
            class="rs-item"
            :title="river.name"
            @click="pick(river)"
          >
            {{ river.name }}
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
/* 外层仅作定位锚（实际位置由使用方通过 class 指定，见页面 .river-selector-floating） */
.river-selector {
  display: inline-block;
}

/* 展开按钮：浅色系，与页面 DivBackIn 面板风格一致
   宽度按内容自适应（箭头 + "选择河段" 四个字 + 内边距），不再整条铺满面板 */
.rs-toggle {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  width: auto;
  height: 30px;
  padding: 0 12px;
  border: 1px solid rgba(77, 140, 220, 0.45);
  border-radius: 6px;
  background: rgba(245, 249, 255, 0.9);
  color: #0f378c;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  box-sizing: border-box;
  transition:
    background-color 0.2s,
    border-color 0.2s;

  &:hover,
  &.is-open {
    background: #e8f2ff;
    border-color: #1766db;
  }
}

/* 右三角形；展开后旋转为向下 */
.rs-caret {
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 6px solid #1766db;
  transition: transform 0.2s ease;

  .is-open & {
    transform: rotate(90deg);
  }
}

/* 滑出条：单行铺开全部河流，宽度随内容自适应 */
.rs-strip {
  position: fixed;
  z-index: 2100;
  display: flex;
  align-items: center;
  gap: 4px;
  width: max-content;
  max-width: calc(100vw - 24px);
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 6px 8px;
  border: 1px solid rgba(77, 140, 220, 0.45);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 4px 16px rgba(30, 60, 120, 0.18);
  box-sizing: border-box;
}

.rs-item {
  flex: 0 0 auto;
  height: 26px;
  padding: 0 10px;
  border: 1px solid #e2eaf6;
  border-radius: 4px;
  background: #fff;
  color: #3c3f46;
  font-size: 13px;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.18s;

  &:hover {
    background: #1766db;
    border-color: #1766db;
    color: #fff;
  }
}

/* 从左侧滑出（向右展开） */
.rs-slide-enter-active,
.rs-slide-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.rs-slide-enter-from,
.rs-slide-leave-to {
  opacity: 0;
  /* 保留 translateY(-50%) 的垂直居中，再向左偏移实现滑出感 */
  transform: translateY(-50%) translateX(-14px);
}
</style>
