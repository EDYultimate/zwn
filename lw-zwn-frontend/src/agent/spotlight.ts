/**
 * SPOTLIGHT 视觉引导：新手指导式「暗幕收缩 → 包围目标 → 散去」。
 *
 * <p>效果：一层半透明暗幕从视口四周向目标元素收缩，合拢成刚好包围该元素的透明洞口，
 * 停留片刻（描边呼吸）后洞口微扩、整体淡出。全程纯展示：遮罩 pointer-events:none，
 * 不拦截点击，不改动业务 DOM，也不依赖任何全局样式文件。
 *
 * <p>为什么用「单元素 + 巨大 box-shadow 挖洞」而不是四块 div 拼：
 * 一个矩形从全屏插值到目标矩形时，四条边天然同时向内推进，正是「从四周收缩」；
 * DOM 只有一个节点，没有接缝、不用算溢出；`0 0 0 100vmax` 保证任意视口都盖得满。
 *
 * <p>为什么每帧重算 getBoundingClientRect：跨页跳转过来的高亮常伴随 smooth scroll、
 * 页面入场动画、异步数据撑开布局，一次性算好终点必然错位。逐帧跟随让洞口始终追着
 * 元素的真实位置，滚动中也不会跑偏。
 */

export interface SpotlightRect {
  left: number
  top: number
  width: number
  height: number
}

export interface SpotlightOptions {
  /** 洞口相对元素外扩的像素，默认 8 */
  padding?: number
  /** 洞口圆角，默认 10 */
  radius?: number
  /** 暗幕收缩时长，默认 560ms */
  shrinkMs?: number
  /** 包围后停留时长，默认 850ms */
  holdMs?: number
  /** 散去时长，默认 400ms */
  fadeMs?: number
  /** 洞口下方的小提示牌文案（一般是角标 label）；不传则不显示 */
  label?: string
}

const SHRINK_MS = 560
const HOLD_MS = 850
const FADE_MS = 400
const PADDING = 8
const RADIUS = 10
/** 元素一直没进入视口时，最多等这么久就退回简单闪烁 */
const SETTLE_TIMEOUT_MS = 700

// ==================== 纯几何计算（可单测） ====================

export const clamp01 = (t: number): number => (t < 0 ? 0 : t > 1 ? 1 : t)

/** 双端缓动：起步不突兀，合拢时也不会急停 */
export function easeInOutCubic(t: number): number {
  const x = clamp01(t)
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

/** 外扩 padding 并裁剪到视口，避免洞口跑出屏幕导致暗幕缺角 */
export function holeRect(
  rect: SpotlightRect,
  viewport: { width: number; height: number },
  padding = PADDING
): SpotlightRect {
  const left = Math.max(0, Math.min(rect.left - padding, viewport.width))
  const top = Math.max(0, Math.min(rect.top - padding, viewport.height))
  const right = Math.max(0, Math.min(rect.left + rect.width + padding, viewport.width))
  const bottom = Math.max(0, Math.min(rect.top + rect.height + padding, viewport.height))
  return {
    left,
    top,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top)
  }
}

export function lerpRect(from: SpotlightRect, to: SpotlightRect, t: number): SpotlightRect {
  const p = clamp01(t)
  return {
    left: from.left + (to.left - from.left) * p,
    top: from.top + (to.top - from.top) * p,
    width: from.width + (to.width - from.width) * p,
    height: from.height + (to.height - from.height) * p
  }
}

/** 散去阶段让洞口略微外扩，产生「光圈散开」的感觉 */
export function expandRect(rect: SpotlightRect, by: number): SpotlightRect {
  return {
    left: rect.left - by,
    top: rect.top - by,
    width: Math.max(0, rect.width + by * 2),
    height: Math.max(0, rect.height + by * 2)
  }
}

// ==================== 运行时 ====================

type Phase = 'settle' | 'shrink' | 'hold' | 'fade'

/** 当前正在播放的动画的销毁函数；重复触发时先收掉旧的，绝不叠两层遮罩 */
let activeDispose: (() => void) | null = null

/** 视口外的起点：比视口略大，保证收缩第 0 帧阴影完全落在视口外，不会露出暗角 */
function fullRect(viewport: { width: number; height: number }): SpotlightRect {
  return { left: -2, top: -2, width: viewport.width + 4, height: viewport.height + 4 }
}

function place(node: HTMLElement, rect: SpotlightRect) {
  node.style.left = `${rect.left}px`
  node.style.top = `${rect.top}px`
  node.style.width = `${Math.max(0, rect.width)}px`
  node.style.height = `${Math.max(0, rect.height)}px`
}

/** 兜底：元素始终不可见（被隐藏 / 在折叠容器里）时，退回原来的轻量闪烁，保证有反馈 */
function fallbackFlash(el: HTMLElement) {
  el.animate?.(
    [
      { boxShadow: '0 0 0 0px rgba(255, 213, 74, 0.9)' },
      { boxShadow: '0 0 0 8px rgba(255, 213, 74, 0.35)' },
      { boxShadow: '0 0 0 0px rgba(255, 213, 74, 0)' }
    ],
    { duration: 900, iterations: 2 }
  )
}

/**
 * 对指定元素播放一次引导遮罩。
 *
 * 同步返回，不阻塞调用方（store.execute 仍按 boolean 判断执行结果）；
 * 动画由内部 rAF 驱动，结束后自行移除所有 DOM。
 */
export function spotlight(el: HTMLElement, options: SpotlightOptions = {}): void {
  if (typeof document === 'undefined' || typeof window === 'undefined' || !el?.isConnected) {
    return
  }
  activeDispose?.()

  const padding = options.padding ?? PADDING
  const radius = options.radius ?? RADIUS
  const reduceMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const shrinkMs = reduceMotion ? 1 : (options.shrinkMs ?? SHRINK_MS)
  const holdMs = reduceMotion ? 450 : (options.holdMs ?? HOLD_MS)
  const fadeMs = reduceMotion ? 220 : (options.fadeMs ?? FADE_MS)

  // ---------- DOM：一个容器 + 挖洞层 + 描边层 + 可选提示牌 ----------
  const host = document.createElement('div')
  host.dataset.agentSpotlight = '1'
  Object.assign(host.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '10000',
    pointerEvents: 'none',
    overflow: 'hidden'
  })

  const mask = document.createElement('div')
  Object.assign(mask.style, {
    position: 'fixed',
    background: 'transparent',
    boxShadow: '0 0 0 100vmax rgba(7, 14, 28, 0.66)',
    pointerEvents: 'none',
    willChange: 'left, top, width, height'
  })

  const frame = document.createElement('div')
  Object.assign(frame.style, {
    position: 'fixed',
    background: 'transparent',
    pointerEvents: 'none'
  })

  const tip = document.createElement('div')
  const hasTip = !!options.label?.trim()
  if (hasTip) {
    tip.textContent = options.label!.trim()
    Object.assign(tip.style, {
      position: 'fixed',
      maxWidth: '260px',
      padding: '6px 14px',
      borderRadius: '999px',
      background: 'rgba(16, 24, 42, 0.94)',
      color: '#ffe08a',
      fontSize: '12px',
      lineHeight: '18px',
      letterSpacing: '0.4px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      transform: 'translateX(-50%)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.35)',
      pointerEvents: 'none',
      opacity: '0'
    })
  }

  host.append(mask, frame)
  if (hasTip) {
    host.append(tip)
  }
  document.body.appendChild(host)

  let raf = 0
  let disposed = false
  const dispose = () => {
    if (disposed) {
      return
    }
    disposed = true
    cancelAnimationFrame(raf)
    host.remove()
    if (activeDispose === dispose) {
      activeDispose = null
    }
  }
  activeDispose = dispose

  // ---------- 滚动定位：能看见就不滚，看不见才滚，且由 rAF 跟随其过程 ----------
  const initial = el.getBoundingClientRect()
  const fullyVisible =
    initial.top >= 0 && initial.bottom <= window.innerHeight && initial.height > 0
  if (!fullyVisible) {
    el.scrollIntoView?.({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' })
  }

  let phase: Phase = 'settle'
  let phaseStart = 0
  let settleStart = 0
  let lastTop = Number.NaN
  let stableFrames = 0

  /** 当前帧的真实洞口（已裁剪到视口）；元素被移除/隐藏时返回 null */
  const currentHole = (): SpotlightRect | null => {
    if (!el.isConnected) {
      return null
    }
    const viewport = { width: window.innerWidth, height: window.innerHeight }
    const hole = holeRect(el.getBoundingClientRect(), viewport, padding)
    return hole.width > 2 && hole.height > 2 ? hole : null
  }

  const render = (
    hole: SpotlightRect,
    alpha: number,
    edgeAlpha: number,
    pulse: number,
    p: number
  ) => {
    place(mask, hole)
    place(frame, hole)
    // 圆角随收缩进度出现：起点为 0，避免全屏矩形带圆角时四角露出深色三角
    const r = radius * edgeAlpha
    mask.style.borderRadius = `${r}px`
    frame.style.borderRadius = `${r}px`
    mask.style.opacity = `${alpha}`
    frame.style.opacity = `${Math.min(1, edgeAlpha) * alpha}`
    frame.style.boxShadow =
      `0 0 0 2px rgba(255, 209, 74, 0.95), ` +
      `0 0 ${18 + pulse * 16}px ${3 + pulse * 3}px rgba(255, 196, 54, ${0.3 + pulse * 0.3}), ` +
      `inset 0 0 ${18 + p * 10}px rgba(255, 210, 90, 0.16)`

    if (hasTip) {
      const viewport = { width: window.innerWidth, height: window.innerHeight }
      const centerX = Math.min(Math.max(hole.left + hole.width / 2, 90), viewport.width - 90)
      const below = hole.top + hole.height + 14
      const above = hole.top - 42
      tip.style.left = `${centerX}px`
      tip.style.top = `${below + 30 <= viewport.height ? below : Math.max(8, above)}px`
      tip.style.opacity = `${edgeAlpha * alpha}`
    }
  }

  const tick = (now: number) => {
    if (disposed) {
      return
    }
    if (!phaseStart) {
      phaseStart = now
      settleStart = now
    }
    const viewport = { width: window.innerWidth, height: window.innerHeight }
    const hole = currentHole()

    // 元素在动画途中被卸载（路由切走 / v-if 收起）：直接收尾，不留一层黑幕
    if (!hole) {
      if (phase === 'settle' && now - settleStart < SETTLE_TIMEOUT_MS) {
        raf = requestAnimationFrame(tick)
        return
      }
      if (phase === 'settle') {
        fallbackFlash(el)
      }
      dispose()
      return
    }

    let shown = hole
    let alpha = 1
    let edgeAlpha = 1
    let spread = 0

    if (phase === 'settle') {
      // 等 smooth scroll / 入场动画稳定：连续 6 帧位置不变，或超时就进入收缩
      const top = hole.top
      if (Math.abs(top - lastTop) < 0.5) {
        stableFrames++
      } else {
        stableFrames = 0
      }
      lastTop = top
      shown = fullRect(viewport)
      render(shown, 1, 0, 0, 0) // 全屏洞口 = 暗幕完全在视口外，屏幕保持原样
      if (stableFrames >= 6 || now - settleStart > SETTLE_TIMEOUT_MS) {
        phase = 'shrink'
        phaseStart = now
      }
    } else if (phase === 'shrink') {
      const p = clamp01((now - phaseStart) / shrinkMs)
      shown = lerpRect(fullRect(viewport), hole, easeInOutCubic(p))
      // 描边只在快合拢时亮起，避免出现一个「全屏金框」
      edgeAlpha = clamp01((p - 0.55) / 0.45)
      render(shown, 1, edgeAlpha, 0, p)
      if (p >= 1) {
        phase = 'hold'
        phaseStart = now
      }
    } else if (phase === 'hold') {
      const pulse = 0.5 + 0.5 * Math.sin((now - phaseStart) / 230)
      render(hole, 1, 1, pulse, 0)
      if (now - phaseStart >= holdMs) {
        phase = 'fade'
        phaseStart = now
      }
    } else {
      const p = clamp01((now - phaseStart) / fadeMs)
      spread = 18 * easeInOutCubic(p)
      shown = expandRect(hole, spread)
      alpha = 1 - p
      render(shown, alpha, 1, 1 - p, p)
      if (p >= 1) {
        dispose()
        return
      }
    }

    raf = requestAnimationFrame(tick)
  }

  raf = requestAnimationFrame(tick)
}

/** 立即收掉正在播放的引导（路由切换、新对话等场景可主动调用） */
export function dismissSpotlight(): void {
  activeDispose?.()
}
