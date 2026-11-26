<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import MainArea from '@/layout/Admin/Main/MainArea.vue'
import MapArea from '@/layout/Admin/Main/MapArea.vue'
import VerticalSidebar from '@/layout/Admin/VerticalSidebar/VerticalSidebar.vue'
import VerticalTreeSidebar from '@/layout/Admin/VerticalSidebar/VerticalTreeSidebar.vue'

const route = useRoute()
const verticalIsShowRef = ref<boolean>(true)
const mapIsShowRef = ref<boolean>(false)
watch(
  () => route.fullPath,
  (newRoutePath, oldRoutePath) => {
    if (newRoutePath !== oldRoutePath) {
      if (route.meta.verticalIsShow !== false) {
        verticalIsShowRef.value = true
      } else {
        verticalIsShowRef.value = route.meta.verticalIsShow
      }

      if (route.meta.mapIsShow == true) {
        mapIsShowRef.value = true
      } else {
        mapIsShowRef.value = false
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <n-layout
    :has-sider="verticalIsShowRef"
    :style="{
      height: 'calc(100vh - 80px)',
      background: 'transparent !important',
      padding: '0px 10px 15px 15px'
    }"
  >
    <VerticalTreeSidebar v-if="verticalIsShowRef" :is-map="mapIsShowRef" />
    <!-- gis2 地图常驻挂载（只加载一次）：本组件不再 v-if 卸载 MapArea，
         地图页间切换由 MapArea 内部 changeModule 完成，非地图路由仅隐藏 -->
    <MapArea />
    <router-view v-if="mapIsShowRef" class="router-view-map-container" />
    <MainArea v-else />
  </n-layout>
</template>

<style scoped>
/*
 * 地图页路由内容容器（点击穿透统一下沉到布局层）：
 * - 容器整体 pointer-events: none，页面空白区域点击直达下层地图（MapArea iframe/默认底图），地图可平移/缩放
 * - 公共业务面板（LeftSide/RightSide 根容器 .left-container/.right-container）与页面标记 .pointer-auto 的浮层自动恢复交互，
 *   页面无需逐页写穿透逻辑（全局放行规则见 MainArea.vue 下方 global 块）
 */
.router-view-map-container {
  position: fixed;
  z-index: 6;
}
</style>
