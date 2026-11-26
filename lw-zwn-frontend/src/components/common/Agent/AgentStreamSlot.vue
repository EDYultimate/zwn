<script setup lang="ts">
import { computed, onBeforeUnmount, onBeforeUpdate, onUpdated, ref, watch } from 'vue'
import {
  GENERIC_WAITING_TEXT,
  waitingText,
  type SlotKind,
  type SlotState
} from '@/agent/answerSlots'

/**
 * 流式回答的附加内容槽位（表格 / 跳转入口共用）。
 *
 * <p>四种状态：
 * <ul>
 *   <li>waiting：整条消息只留一句笼统的等待描述；正文确实引用了这类内容时才展开骨架；</li>
 *   <li>ready：done 帧到达，真实内容作为插槽原地淡入，容器高度做过渡动画；</li>
 *   <li>empty：本次没有这类内容，容器高度平滑收起到 0，不留下莫名其妙的空块；</li>
 *   <li>error：明确写出失败原因并提供重试按钮（一条消息只显示一次）。</li>
 * </ul>
 * 真实内容一律由父组件通过默认插槽提供，本组件不碰表格数据和跳转行为。
 * 等待文案不提「表格 / 入口」，因为多数回答最终并不产出这两类内容。
 */
const props = withDefaults(
  defineProps<{
    kind: SlotKind
    state: SlotState
    /** 后端 stage 帧的阶段文案，优先作为等待态提示 */
    hint?: string
    /** 错误态的说明文字 */
    errorText?: string
    /**
     * 页面明确进入「表格加载中」态时使用的等待文案，优先于阶段 hint。
     * 不传则沿用原来的笼统文案，保证测试页与历史行为不变。
     */
    loadingText?: string
    /** 一条消息有两个槽位，只需其中一个显示状态条 / 重试按钮，避免重复提示 */
    showStatus?: boolean
    showRetry?: boolean
    /**
     * 流式「紧凑待命」：正文还没引用这类附加内容时不铺大骨架，
     * 避免纯文字回答在 done 时收起一大块造成布局跳动；一旦引用就自动展开。
     */
    compact?: boolean
  }>(),
  {
    hint: '',
    errorText: '',
    loadingText: '',
    compact: false,
    showStatus: true,
    showRetry: true
  }
)

const emit = defineEmits<{ retry: [] }>()

const host = ref<HTMLElement | null>(null)
const elapsed = ref(0)
let ticker: number | undefined

/** 等太久也要有反馈：8 秒后把耗时显示出来，避免用户以为卡死 */
watch(
  [() => props.state, () => props.compact, () => props.showStatus],
  ([state, compact, showStatus]) => {
    window.clearInterval(ticker)
    elapsed.value = 0
    // 紧凑 / 静默时不计时：文案是固定的，每秒重渲染纯属浪费
    if (state === 'waiting' && showStatus && !compact) {
      ticker = window.setInterval(() => {
        elapsed.value += 1
      }, 1000)
    }
  },
  { immediate: true }
)
onBeforeUnmount(() => window.clearInterval(ticker))

/** 空串 = 不渲染状态条，让未被引用 / 不负责提示的那个槽位完全静默 */
const statusText = computed(() => {
  if (!props.showStatus) {
    return ''
  }
  if (props.state === 'error') {
    return props.errorText || '补充内容加载失败'
  }
  if (props.state !== 'waiting') {
    return ''
  }
  if (props.compact) {
    return GENERIC_WAITING_TEXT
  }
  if (props.loadingText) {
    return elapsed.value >= 8
      ? `${props.loadingText}（已等待 ${elapsed.value}s）`
      : props.loadingText
  }
  return waitingText({ hint: props.hint, elapsed: elapsed.value })
})

/**
 * 高度过渡：骨架 → 真实表格 / 空态收起时高度会变，直接切换会「咣」地跳一下。
 * 更新前记下旧高度，更新后先钉住旧高度再过渡到新高度，结束清除内联样式。
 */
let snapshot = 0
let clearTimer: number | undefined
let pendingClear: ((e?: TransitionEvent) => void) | undefined
/** 只在「状态 / 紧凑模式 / 状态条显隐」切换时量高度：计时文案每秒都在变，不该反复触发高度动画 */
const layoutKey = computed(
  () => `${props.state}:${props.compact ? 1 : 0}:${props.showStatus ? 1 : 0}`
)
let animatedKey = layoutKey.value
onBeforeUpdate(() => {
  if (host.value && layoutKey.value !== animatedKey) {
    snapshot = host.value.offsetHeight
  } else {
    snapshot = 0
  }
})
onUpdated(() => {
  animatedKey = layoutKey.value
  const el = host.value
  if (!el || snapshot <= 0) {
    snapshot = 0
    return
  }
  const from = snapshot
  snapshot = 0
  const to = el.offsetHeight
  if (Math.abs(to - from) < 2) {
    return
  }
  // 上一次过渡可能还没结束，先清理，避免多个监听器和内联高度互相打架
  window.clearTimeout(clearTimer)
  if (pendingClear) {
    el.removeEventListener('transitionend', pendingClear)
  }
  el.style.height = `${from}px`
  el.style.overflow = 'hidden'
  void el.offsetHeight // 强制回流，让浏览器认下起始高度
  el.style.transition = 'height .3s cubic-bezier(.25,.8,.25,1)'
  el.style.height = `${to}px`
  const clear = (e?: TransitionEvent) => {
    if (e && e.propertyName !== 'height') {
      return
    }
    el.style.height = ''
    el.style.overflow = ''
    el.style.transition = ''
    el.removeEventListener('transitionend', clear)
    pendingClear = undefined
  }
  pendingClear = clear
  el.addEventListener('transitionend', clear)
  // transitionend 在高度没实际变化或被中途打断时可能不触发，兜底复原
  clearTimer = window.setTimeout(clear, 420)
})
onBeforeUnmount(() => window.clearTimeout(clearTimer))
</script>

<template>
  <div
    ref="host"
    class="as-slot"
    :class="['as-' + kind, 'is-' + state, { 'is-silent': !statusText && state !== 'ready' }]"
    :data-agent-slot="kind"
  >
    <div class="as-inner">
      <!-- 等待 / 失败状态条：一条消息只在一处显示，不占正文输出 -->
      <div v-if="statusText" class="as-status" role="status" :title="hint">
        <span v-if="state === 'waiting'" class="as-spin" aria-hidden="true"></span>
        <span v-else class="as-warn" aria-hidden="true">!</span>
        <span class="as-status-text">{{ statusText }}</span>
        <button
          v-if="state === 'error' && showRetry"
          class="as-retry"
          type="button"
          @click="emit('retry')"
        >
          重新生成
        </button>
      </div>

      <!-- 骨架：表格用三行伪表格，跳转入口用几个胶囊按钮；紧凑待命时先不铺开 -->
      <div v-if="state === 'waiting' && !compact" class="as-skeleton" aria-hidden="true">
        <template v-if="kind === 'table'">
          <div class="as-sk-row as-sk-head">
            <i v-for="n in 3" :key="'h' + n"></i>
          </div>
          <div v-for="r in 3" :key="'r' + r" class="as-sk-row">
            <i v-for="n in 3" :key="'c' + r + '-' + n"></i>
          </div>
        </template>
        <template v-else>
          <span v-for="n in 3" :key="'p' + n" class="as-sk-pill"></span>
        </template>
      </div>

      <!-- 真实内容：父组件插槽，淡入而不是突然插入 -->
      <div v-else-if="state === 'ready'" class="as-content">
        <slot />
      </div>
      <!-- empty / error：内容区不渲染，容器高度平滑收起 -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.as-slot {
  margin: 9px 0 2px;
  font-size: 12.5px;
  line-height: 1.6;
  /* 测试页气泡整体是 pre-wrap，槽位内必须还原，否则模板缩进会被当正文空格 */
  white-space: normal;
  color: #5a7ba6;

  /* 空态 / 静默等待：不留边距，配合高度过渡完全收起 */
  &.is-empty,
  &.is-silent {
    margin: 0;
    padding: 0;
  }
}

.as-inner {
  min-width: 0;
}

.as-status {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  align-items: center;
  min-height: 20px;
  font-size: 12px;
  color: #6d8bb0;
}

.as-status-text {
  flex: 1;
  min-width: 0;
}

.as-spin {
  flex: none;
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid #cfdef2;
  border-top-color: #1f7ae0;
  border-radius: 50%;
  animation: as-spin 0.8s linear infinite;
}

.as-warn {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  background: #e08a3c;
  border-radius: 50%;
}

.as-retry {
  flex: none;
  padding: 2px 10px;
  font-family: inherit;
  font-size: 12px;
  color: #1f7ae0;
  cursor: pointer;
  background: #eef5fd;
  border: 1px solid #c9dcf2;
  border-radius: 11px;

  &:hover {
    color: #fff;
    background: #1f7ae0;
    border-color: #1f7ae0;
  }
}

.as-skeleton {
  box-sizing: border-box;
  margin-top: 7px;
  padding: 9px 10px;
  background: #fbfdff;
  border: 1px dashed #cbdcf2;
  border-radius: 6px;
}

.as-sk-row {
  display: flex;
  gap: 8px;
  margin-bottom: 7px;

  &:last-child {
    margin-bottom: 0;
  }

  i {
    display: block;
    flex: 1;
    height: 8px;
    border-radius: 3px;
    background: linear-gradient(90deg, #e7f0fb 25%, #f5faff 38%, #e7f0fb 63%);
    background-size: 400% 100%;
    animation: as-shimmer 1.5s ease-in-out infinite;
  }

  i:nth-child(2) {
    flex: 1.5;
    animation-delay: 0.12s;
  }

  i:nth-child(3) {
    flex: 0.8;
    animation-delay: 0.24s;
  }
}

.as-sk-head i {
  height: 10px;
  background: linear-gradient(90deg, #dceafa 25%, #eef6ff 38%, #dceafa 63%);
  background-size: 400% 100%;
}

.as-sk-pill {
  display: inline-block;
  width: 76px;
  height: 20px;
  margin: 1px 8px 1px 0;
  vertical-align: middle;
  border-radius: 11px;
  background: linear-gradient(90deg, #e7f0fb 25%, #f5faff 38%, #e7f0fb 63%);
  background-size: 400% 100%;
  animation: as-shimmer 1.5s ease-in-out infinite;

  &:nth-child(2) {
    width: 92px;
    animation-delay: 0.14s;
  }

  &:nth-child(3) {
    width: 64px;
    animation-delay: 0.28s;
  }
}

.as-content {
  min-width: 0;
  animation: as-fade-in 0.3s ease both;
}

@keyframes as-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes as-shimmer {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
@keyframes as-fade-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .as-spin,
  .as-sk-row i,
  .as-sk-pill,
  .as-content {
    animation: none;
  }
}
</style>
