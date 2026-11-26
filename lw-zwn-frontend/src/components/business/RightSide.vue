<script setup lang="ts">
import { ref } from 'vue'

import switchL from '@/assets/img/layout/common/switch_l.png'
import switchR from '@/assets/img/layout/common/switch_r.png'

interface Props {
  // 宽度
  width?: string
  // 高度
  height?: string
  // 内边距
  padding?: string
  // 默认值
  top?: string
  // 是否启用整体滚动条（false 时内容区不滚动，由内部自行控制滚动）
  scrollable?: boolean
  // 是否可收起/展开
  retractable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: '',
  height: '',
  padding: '',
  top: '100px',
  scrollable: true,
  retractable: true
})

// 面板折叠状态：折叠时宽度置 0，展开恢复原本宽度
const collapsed = ref(false)

/** 切换右侧面板折叠/展开 */
function toggleCollapse() {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <div style="position: relative">
    <!-- 展开/收起按钮：位于页面最右侧，折叠时显示左箭头（展开），展开时显示右箭头（收起）；retractable=false 时隐藏 -->
    <div v-if="props.retractable" class="retract_right pointer-auto" @click="toggleCollapse">
      <img :src="collapsed ? switchR : switchL" :alt="collapsed ? '展开' : '收起'" />
    </div>

    <div
      class="right-container right-side-container"
      :style="{
        width: collapsed ? '0px' : props.width,
        height: props.height,
        top: props.top
      }"
    >
      <!-- 内层固定宽度：折叠时仅外层容器宽度动画到 0，内容（含 echarts）尺寸不变，避免图表被压扁 -->
      <div class="panel-inner" :style="{ width: props.width }">
        <n-scrollbar
          v-if="props.scrollable"
          class="custom-scrollbar"
          style="max-height: calc(100vh - 110px)"
        >
          <div class="scrollbar-content" :style="{ padding: props.padding }">
            <DivBackIn>
              <slot />
            </DivBackIn>
          </div>
        </n-scrollbar>
        <div v-else class="scrollbar-content no-scroll" :style="{ padding: props.padding }">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.right-side-container {
  //必须要有，地图监听此元素
}
.retract_right {
  position: fixed;
  right: 0px;
  top: 50%;
  transform: translateY(-50%); /* 整屏垂直居中 */
  cursor: pointer;
  user-select: none;
  z-index: 100;
  padding-right: 4px;

  img {
    display: block;
    width: 16px;
    /* 悬浮高亮：透明区域不受影响，仅可见部分变亮 + 发光描边 */
    transition: filter 0.2s ease;
  }

  &:hover img {
    filter: brightness(1.3) drop-shadow(0 0 6px rgba(10, 200, 182, 0.5));
  }
}
.right-container {
  position: fixed;
  right: 20px;
  overflow: hidden; /* 折叠宽度为 0 时裁剪内部固定宽度内容 */
  transition: width 0.3s ease; /* 折叠/展开平滑过渡 */
}

/* 内层固定宽度容器：承载实际内容，宽度不随折叠动画变化 */
.panel-inner {
  height: 100%;
}
.scrollbar-content {
  position: relative;
  width: 100%;
}

/* 非滚动模式：对齐 n-scrollbar-content 的内边距，整体不出滚动条 */
.scrollbar-content.no-scroll {
  padding: 5px 12px;
  box-sizing: border-box;
  overflow: hidden;
}

/* 滚动条不遮挡内容：内容区右侧预留滚动条空间 */
:deep(.n-scrollbar-content) {
  padding: 5px 12px;
  box-sizing: border-box;
}

/* 滚动条颜色调淡 */
:deep(.n-scrollbar-rail__scrollbar) {
  background-color: rgba(0, 0, 0, 0.05) !important;
  transition: background-color 0.2s var(--n-scrollbar-bezier);
}
:deep(.n-scrollbar-rail__scrollbar:hover) {
  background-color: rgba(0, 0, 0, 0.2) !important;
}
</style>
