<script setup lang="ts">
import CenterSidebar from '@/layout/Admin/VerticalSidebar/CenterSidebar.vue'
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import defaultTitleLogo from '@/assets/img/layout/logo/title_logo_panel4.png'

import MapArea from '@/layout/Admin/Main/MapArea.vue'

const route = useRoute()

// 仅地图应用（meta.mapUrl，如调水/取用水）自带底图，去掉默认全屏背景 back_panel.png；
// 其余未接入地图的模块仍保留默认背景图，避免空白
const mapUrl = computed<string | undefined>(() => route.meta.mapUrl)

// 顶部标题图（meta.headerLogo 覆盖，缺省用默认 banner）
const headerLogo = computed<string>(() => (route.meta.headerLogo as string) || defaultTitleLogo)
const mapIsShowRef = ref<boolean>(false)
watch(
  () => route.fullPath,
  (newRoutePath, oldRoutePath) => {
    if (newRoutePath !== oldRoutePath) {
      mapIsShowRef.value = route.meta.mapIsShow === true
    }
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <!-- 顶部标题图：默认用 title_logo_panel4.png；路由 meta.headerLogo 可覆盖（漳河上游/漳卫南等子系统） -->
    <img
      :src="headerLogo"
      style="position: fixed; left: 0px; top: 0px; z-index: 5; width: 100%; pointer-events: none"
      alt=""
    />
    <!-- 底部条纹装饰：左图 + 中间渐变拉伸 + 右图镜像（仿 layout-sample footer 三段式结构） -->
    <div class="bottom-footer">
      <div class="footer-left"></div>
      <div class="footer-center"></div>
      <div class="footer-right"></div>
    </div>

    <!--    <img-->
    <!--      src="@/assets/img/layout/shade/shade_panel.png"-->
    <!--      style="position: fixed; left: 0px; top: 0px; z-index: 3; width: 100%; height: 100vh"-->
    <!--      alt=""-->
    <!--    />-->

    <!-- 默认全屏背景图：仅未接入地图（meta.mapUrl）的模块展示；
        地图应用自带底图（back_panel.png 不做默认图片底图，MapArea --app 已透明化 demo-map） -->
    <img
      v-if="!mapUrl"
      src="@/assets/img/layout/back/back_panel.png"
      style="
        position: fixed;
        left: 0px;
        top: 0px;
        z-index: 2;
        width: 100%;
        height: 100vh;
        pointer-events: none;
      "
      alt=""
    />

    <!--    <CenterSidebar-->
    <!--      v-if="verticalIsShowRef"-->
    <!--      class="router-view-container"-->
    <!--      style="left: 0px; top: 120px"-->
    <!--    />-->

    <!-- 地图底板页面（router meta.mapIsShow 开启；mapUrl 指定独立地图应用） -->
    <MapArea v-if="mapIsShowRef" class="center-map-area-wrap" />
    <router-view
      class="router-view-container"
      :class="{ 'router-view-container--map': mapIsShowRef }"
    />
  </div>
</template>

<style scoped lang="scss">
/* 地图底板上浮层：盖过背景图（z2）、位于顶部标题（z5）之下 */
.center-map-area-wrap {
  position: relative;
  z-index: 3;
}

.router-view-container {
  position: fixed;
  z-index: 6;
}

/* 仅地图态开启容器穿透：空白区域直达下层 MapArea（点击穿透统一下沉到布局层，见 MapArea global 放行规则） */
.router-view-container--map {
  pointer-events: none;
}
/* 底部三段式条纹：左右为科技线条图，中间 1px 渐变横向平铺拉伸（仿 layout-sample .fhsy .bottom .footer） */
.bottom-footer {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 5;
  display: flex;
  width: 100%;
  height: 31px;
  pointer-events: none;
}
.footer-left,
.footer-right {
  width: 825px;
  background: url('@/assets/img/layout/logo/bottom_side.png') no-repeat;
  background-size: 100% 100%;
}
.footer-center {
  flex: 1;
  min-width: 0;
  background: url('@/assets/img/layout/logo/bottom_center.png') repeat-x;
  background-size: 100% 100%;
}
.footer-right {
  transform: rotateY(180deg);
}
</style>
