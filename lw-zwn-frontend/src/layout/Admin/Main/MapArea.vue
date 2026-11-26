<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMapBridge } from '@/hooks/web/useMapBridge'

const route = useRoute()
const padding = ref<string>('14px 14px 14px 24px')

/**
 * gis2 常驻地图（public/gis/gis2/index.html）：
 * - iframe 在布局层只加载一次（AdminBottomLayout 常驻挂载本组件）；
 * - 路由切换地图页面时不再重建 iframe，只调 changeModule(module) 切换地图模块
 *   （模块切换完成由地图 postMessage modulechanged / 注册 onReceive 体现）；
 * - 非地图路由仅隐藏（v-show），切回同一会话内不重新加载。
 */
const GIS2_URL = '/gis/gis2/index.html'

/** 当前路由是否地图页：控制地图层显隐（iframe 常驻不销毁） */
const isMapRoute = computed(() => route.meta.mapIsShow === true)

/** 地图应用加载完成（loaded postMessage）：iframe 淡入，避免加载窗口期白屏闪烁 */
const mapLoaded = ref(false)

/** 已切换到的 gis2 模块（去重：路由间来回切换不重复调 changeModule） */
let currentModule: string | null = null

const { changeModule } = useMapBridge({
  messageHandlers: {
    loaded: () => {
      mapLoaded.value = true
    },
    modulechanged: () => {
      mapLoaded.value = true
    }
  }
})

/** 路由 meta.mapModule → gis2 模块名；未配置的地图页缺省 daping（大屏基础模块） */
function routeModule(): string {
  return (route.meta.mapModule as string) || 'daping'
}

function applyRouteModule() {
  const module = routeModule()
  if (module === currentModule) {
    return
  }
  currentModule = module
  // 地图首次加载较慢时 changeModule 内部会轮询等待就绪后再切换
  changeModule(module)
}

watch(
  () => route.fullPath,
  () => {
    if (route.meta.mapIsShow === true) {
      applyRouteModule()
    }
  },
  { immediate: true }
)

const isHideMenuCrumb = computed(() => route.meta.isHideMenuCrumb)

// 左侧竖向菜单是否显示（meta.verticalIsShow 为 false 时收起，地图页面包屑左移避开收起后的菜单位）
const isVerticalShow = computed(() => route.meta.verticalIsShow !== false)

watch(
  () => route.fullPath,
  (newRoutePath, oldRoutePath) => {
    if (newRoutePath !== oldRoutePath) {
      if (route.meta.verticalIsShow !== false) {
        padding.value = '14px 14px 14px 0px'
      } else {
        padding.value = '0px 0px 0px 0px'
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <!-- 非地图路由时整层不参与布局（class 见下方 .map-area--idle）：
       AdminBottomLayout 的 n-layout 为 flex 容器，本组件根节点 flex:auto，
       若仅隐藏内部 .map-stage，空壳仍会与 MainArea 平分宽度，出现左侧空白 -->
  <n-layout-content
    :class="{ 'map-area--idle': !isMapRoute }"
    :content-style="{ padding, background: 'transparent' }"
  >
    <!-- 地图层：gis2 常驻 iframe（只加载一次）；路由 meta.mapIsShow 控制显隐，
         地图页之间切换由上方 changeModule 完成，不重载 iframe -->
    <div v-show="isMapRoute" class="map-stage">
      <div class="map-layer map-layer--app">
        <iframe
          :src="GIS2_URL"
          class="map-frame"
          :class="{ 'map-frame--loaded': mapLoaded }"
          allowfullscreen
        ></iframe>
      </div>

      <!-- 遮罩层：半透明叠加，仅视觉，事件穿透 -->
      <!--      <div class="map-mask-layer"></div>-->
    </div>
  </n-layout-content>
</template>

<style lang="scss" scoped>
/*
 * 分层规范（z-index 由 route.meta.mapLayout 控制，默认值见脚本）
 * ┌───────────────────────────────┐  businessZ  业务路由层（容器穿透，见下方说明）
 * ├───────────────────────────────┤  maskZ      遮罩层（半透明，事件穿透）
 * ├───────────────────────────────┤  mapZ       地图层（接收交互）
 * └───────────────────────────────┘  body 底层
 *
 * 交互规则（统一下沉，页面无需逐页处理）：
 *  - 遮罩层 pointer-events: none，点击直达地图层
 *  - 业务路由容器由布局 wrapper 置 pointer-events: none（空白区域点击直达地图层），
 *    公共面板 .left-container/.right-container 与页面 .pointer-auto 浮层由下方 global 块放行
 */

/* 非地图路由：根节点整层移出布局流（常驻 iframe 仍在 DOM 内，不卸载、不重载），
   避免空壳 flex 项挤占 MainArea 宽度 */
.map-area--idle {
  display: none;
}

.map-stage {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* 整层位于顶部菜单层（z-index: 1000）之下 */
  pointer-events: none; /* 舞台不拦截事件，交由各层自行处理 */
}

$map-fade-duration: 1s; // 地图淡入淡出过渡时长

.map-layer {
  z-index: 1;
  position: absolute;
  inset: 0;
  //background-image: url('@/assets/img/map/demo-map.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  pointer-events: auto; /* 允许地图缩放/平移操作 */
}

/* 深色兜底层：常驻且默认透明，进入地图模式时淡入，
   柔和遮盖默认底图，兼作地图加载窗口期/球外透明区域的底色 */
.map-layer::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: #f0f0f0; /* 兜底底色，可按项目主题调整 */
  opacity: 0;
  pointer-events: none; /* 不拦截地图层交互 */
  transition: opacity $map-fade-duration ease;
}

/* gis2 常驻地图模式：深色兜底层淡入盖住默认底图 */
.map-layer--app::before {
  //opacity: 1;
}

.map-frame {
  position: relative; /* 层叠在兜底层之上 */
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  opacity: 0; /* 加载完成前隐藏，避免加载窗口期白屏/透明闪烁 */
  transition: opacity $map-fade-duration ease;
}

/* 地图应用加载完成后柔和淡入 */
.map-frame--loaded {
  opacity: 1;
}

.map-business-layer {
  z-index: 3;
  position: relative;
}

/* 三级菜单页签：文档流块（同 MainArea .menu--item-level3），relative+z-index 浮于 fixed 地图层（z-index: 0）之上；
   margin 对齐 MainArea 卡片容器 padding（15px 顶 / 10px 左）+ 页签条 margin-bottom 10px，切换页面位置完全不变 */
.map-lv3-tabs {
  position: relative;
  z-index: 10;
  display: flex;
  margin: 15px 0 10px 10px;
}

/* 地图模式下：容器整体穿透，空白区域点击直达地图；业务面板用 .pointer-auto 恢复交互 */
.map-router-passthrough {
  //pointer-events: none;
}

.n-layout {
  background-color: transparent;
}

.haveMap_Crumb {
  position: fixed;
  top: 96px;
  left: 250px;
}

/* 左侧竖向菜单收起（meta.verticalIsShow 为 false）：面包屑左移避开收起后的菜单位 */
.haveMap_Crumb--collapse {
  left: 32px;
}
</style>

<style lang="scss">
/*
 * 点击穿透统一下沉到公共地图组件（MapArea），页面无需逐页自处理：
 *
 * 路由内容 wrapper 由两个布局承载并已设整体穿透（pointer-events: none）：
 *   - AdminBottomLayout（业务模块）：.router-view-map-container
 *   - CenterLayout（总览/首页模块）：.router-view-container
 *
 * 本 global 块为这两类 wrapper 内的"公共可交互元素"统一放行（全局，避免 scoped :deep 选择器陷阱）：
 *   1. LeftSide/RightSide 面板根容器 .left-container / .right-container —— 自动恢复点击
 *   2. 页面自绘 fixed 浮层/弹层根节点上加 class="pointer-auto" 恢复点击
 *   其余空白区域保持穿透，点击直达下层地图（iframe/默认底图），地图可平移/缩放。
 */
/* 通用交互工具类：任意可交互浮层根节点添加后恢复点击（无副作用，auto 为默认值） */
.pointer-auto {
  pointer-events: auto;
}

/*
 * 地图页（body.page-map，路由 meta.mapIsShow 打标，见 src/router/index.ts）下，
 * 为布局路由 wrapper 内公共元素放行点击。wrapper 本身由布局置 pointer-events:none（穿透），
 * 此处仅在地图态恢复以下可交互区域，避免误伤非地图态 MainArea 页面：
 * 注：业务组件根节点会继承 router-view 传入的 wrapper class（Vue attrs 透传），
 *     故同时放行「wrapper 与 .pointer-auto 同在根节点」的情形（页面整体可交互）。
 */
body.page-map .router-view-map-container .left-container,
body.page-map .router-view-map-container .right-container,
body.page-map .router-view-map-container .pointer-auto,
body.page-map .router-view-map-container.pointer-auto,
body.page-map .router-view-container .left-container,
body.page-map .router-view-container .right-container,
body.page-map .router-view-container .pointer-auto,
body.page-map .router-view-container.pointer-auto {
  pointer-events: auto;
}
</style>
