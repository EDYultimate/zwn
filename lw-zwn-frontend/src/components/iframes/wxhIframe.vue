<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import SkewButton from '@/components/business/SkewButton.vue'

// 子系统地址（用于 origin 校验，防止非法来源的消息）
const CHILD_ORIGIN = 'http://10.3.34.154:3000'

// iframe 实例引用
const iframeRef = ref<HTMLIFrameElement | null>(null)

// iframe 是否加载完成（加载中显示动画，完成后隐藏）
const loading = ref(true)

// 加载是否超时（10 秒未加载完成时提示用户）
const loadTimeout = ref(false)
// 超时定时器
let timeoutTimer: ReturnType<typeof setTimeout> | null = null

// 重新开始计时（进入加载状态时调用）
const startTimeoutTimer = () => {
  clearTimeout(timeoutTimer ?? undefined)
  loadTimeout.value = false
  timeoutTimer = setTimeout(() => {
    // 仍在加载中：标记超时，展示提示
    if (loading.value) {
      loadTimeout.value = true
    }
  }, 10_000)
}

/**
 * 主站监听子系统的消息
 * 子系统内部通过 window.parent.postMessage({ type: 'xxx', data: {...} }, 主站域名) 主动通知主站
 */
function handleChildMessage(event: MessageEvent) {
  console.log('[wxhIframe] 收到消息 origin:', event.origin, 'data:', event.data)
  // 安全校验：只信任子系统来源的消息
  if (event.origin !== CHILD_ORIGIN) {
    return
  }

  const { type, data } = event.data || {}

  switch (type) {
    case 'FACD_ACTION':
      console.log('用户在子系统做了操作', data)
      // 跳转到计划页面，加载完成后再发送 FAINFO_PLAN 消息
      navigateAndSend(data)
      break
    case 'USER_ACTION':
      console.log('子系统用户行为', data)
      break
    default:
      console.warn('未知的子系统消息类型:', type)
  }
}

// 计划页面地址
const PLAN_URL = 'http://10.3.34.154:3000/#/faManageout/plan'

/**
 * iframe 跳转到计划页面，页面就绪后再发送 FAINFO_PLAN 消息
 * 消息必须在子系统 plan 页面挂载、message 监听器注册完成之后发送，否则会被丢弃
 */
function navigateAndSend(data: Record<string, unknown> | undefined) {
  const iframe = iframeRef.value
  if (!iframe) {
    return
  }

  const sameOriginPage = iframe.src.split('#')[0] === PLAN_URL.split('#')[0]

  if (sameOriginPage) {
    // hash 路由切换（falist → plan）：iframe 不会重新加载、不触发 load 事件，
    // 需先更新 src 让子系统内部路由跳转，再等其页面挂载完成（延时）后发送
    iframe.src = PLAN_URL
    setTimeout(() => {
      postMessageToChild('FAINFO_PLAN', data)
    }, 500)
    return
  }

  // 跨页面跳转：等 load 事件（iframe 重新加载完成）后再发送
  const onLoad = () => {
    iframe.removeEventListener('load', onLoad)
    // 延迟等待子系统页面完成初始化并注册好 message 监听器
    setTimeout(() => {
      postMessageToChild('FAINFO_PLAN', data)
    }, 500)
  }

  iframe.addEventListener('load', onLoad)
  // 跳转到计划页面
  iframe.src = PLAN_URL
}

/**
 * 主站主动向子系统发送消息
 * 子系统内部通过 window.addEventListener('message', ...) 监听
 */
function postMessageToChild(type: string, data?: Record<string, unknown>) {
  iframeRef.value?.contentWindow?.postMessage({ type, data }, CHILD_ORIGIN)
}

onMounted(() => {
  window.addEventListener('message', handleChildMessage)
  // 挂载后开始加载超时计时
  startTimeoutTimer()
})

/**
 * 探测子系统服务是否真正可达
 * 浏览器在服务不可达（连接拒绝/超时）时也会给 iframe 触发 load 事件（错误页），
 * 需用 no-cors 探测区分：可达则 fetch 正常返回（opaque 响应），不可达则 reject
 */
async function probeChildReachable(): Promise<boolean> {
  try {
    await fetch(`${CHILD_ORIGIN}/`, { mode: 'no-cors', cache: 'no-store' })
    return true
  } catch {
    return false
  }
}

/**
 * iframe load 事件回调
 * 注意：错误页也会触发 load，故需探测服务可达性后再判定加载成功
 */
async function handleIframeLoad() {
  const reachable = await probeChildReachable()
  if (!reachable) {
    // 服务不可达：显示失败提示（不再显示加载动画）
    loadTimeout.value = true
    return
  }
  // 真正加载完成：隐藏加载动画并清除超时计时
  loading.value = false
  loadTimeout.value = false
  clearTimeout(timeoutTimer ?? undefined)
  setTimeout(() => {
    // TODO: 按需填充基础数据内容
    postMessageToChild('FAINFO_BASIC', {})
  }, 500)
}

onUnmounted(() => {
  window.removeEventListener('message', handleChildMessage)
  iframeRef.value?.removeEventListener('load', handleIframeLoad)
  // 组件销毁时清除超时定时器
  clearTimeout(timeoutTimer ?? undefined)
})

// 对外暴露发送方法（供父组件通过 ref 调用）
defineExpose({ postMessageToChild })
</script>

<template>
  <!--  <n-layout-content :content-style="{ background: 'transparent' }">-->
  <div class="wxh-iframe-wrapper">
    <!-- 加载动画：iframe 加载完成后隐藏（超时后改为提示） -->
    <Transition name="fade">
      <div v-if="loading && !loadTimeout" class="loading-mask">
        <n-spin size="large" />
      </div>
    </Transition>
    <!-- 加载超时提示：10 秒仍未渲染出来 -->
    <Transition name="fade">
      <div v-if="loadTimeout" class="loading-mask">
        <div class="timeout-tip">
          <div class="timeout-title">页面加载超时</div>
          <div class="timeout-desc">嵌入页面响应缓慢或服务暂不可用，请检查网络后重试</div>
        </div>
      </div>
    </Transition>
    <Transition name="map-frame">
      <iframe
        ref="iframeRef"
        src="http://10.3.34.154:3000/#/faManageout/falist"
        class="map-frame"
        :class="{ 'map-frame--loaded': !loading }"
        allowfullscreen
        @load="handleIframeLoad"
      ></iframe>
    </Transition>
  </div>
  <!--  </n-layout-content>-->
</template>

<style lang="scss" scoped>
$map-fade-duration: 0.2s;

/* 需裁掉的子页面顶部高度（子页面头部区域，跨域无法改 DOM，用上移+裁剪方式隐藏） */
$crop-top: 0px;

/* 外层容器：撑满父级，作为加载动画与 iframe 的定位基准 */
.wxh-iframe-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  /* 裁剪 iframe 上移后溢出的顶部区域 */
  overflow: hidden;
}

/* 加载动画遮罩：铺满 iframe 区域 */
.loading-mask {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

/* 遮罩淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 加载超时提示内容 */
.timeout-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 30px;

  .timeout-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .timeout-desc {
    font-size: 13px;
    color: #999;
  }
}

.map-frame {
  position: relative; /* 层叠在兜底层之上 */
  width: 100%;
  /* 高度补足被裁掉的顶部区域，保证底部内容完整显示 */
  height: calc(100% + #{$crop-top});
  /* 整体上移，使子页面 top < 200px 的头部区域移出可视范围被裁剪 */
  transform: translateY(-#{$crop-top});
  border: none;
  display: block;
  opacity: 0; /* 加载完成前隐藏，避免加载窗口期白屏/透明闪烁 */
  transition: opacity $map-fade-duration ease;
}

/* 顶部点击拦截层：固定在容器顶部 30px，盖在 iframe 之上拦截鼠标事件 */
.top-click-blocker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30px;
  /* 置于 iframe 之上（loading-mask 为 z-index: 1，此层级更高） */
  z-index: 2;
  /* 背景透明，仅拦截事件不遮挡视觉 */
  background: transparent;
}

/* 地图应用加载完成后柔和淡入 */
.map-frame--loaded {
  opacity: 1;
}

/* 退出独立地图应用模式时 iframe 淡出（须置于 --loaded 规则之后以覆盖其 opacity） */
.map-frame-leave-active {
  transition: opacity $map-fade-duration ease;
}

.map-frame-leave-to {
  opacity: 0.15;
}
</style>
