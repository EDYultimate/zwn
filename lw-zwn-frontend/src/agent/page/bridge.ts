import { getCurrentInstance, onMounted, onUnmounted, unref } from 'vue'
import router from '@/router/instance'
import type { AgentPageContext, AgentPageContextSource } from './types'

/**
 * 业务页 → 公共层的唯一通道。
 *
 * <p>业务页只做一件事：把「愿意开放给智能体的能力」按名字交出来（一行调用）。
 * 不 import 能力声明、不 import store、不注册 handler、不关心 flushPending。
 * 反过来 adapter 也拿不到页面的 ref / 组件实例，只能通过 `ctx.call()` 按名字调用。
 */

/** 当前每个路由暴露的上下文（同一时刻一个路由只有一个页面实例） */
const contexts = new Map<string, AgentPageContextSource>()

export type ContextChangeKind = 'enter' | 'leave'
type Listener = (route: string, kind: ContextChangeKind) => void
const listeners = new Set<Listener>()

/** 插件订阅「页面上下文出现 / 消失」，页面不需要关心 */
export function onAgentContextChange(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getAgentContext(route: string): AgentPageContextSource | undefined {
  return contexts.get(route)
}

function emit(route: string, kind: ContextChangeKind) {
  listeners.forEach((listener) => listener(route, kind))
}

/**
 * 业务页入口：暴露能力给智能体。
 *
 * <p>必须在 `<script setup>` 顶层、所有待暴露的状态定义之后调用一次。
 * 命名约定：
 * <ul>
 *   <li>普通键：方法用 `ctx.call('xxx', ...)`，值用 `ctx.get('xxx')`；</li>
 *   <li>`ready`（可选）：boolean / Ref&lt;boolean&gt; / () =&gt; boolean，表示首屏数据是否到位，
 *       插件会自动接成跨页弹框的就绪握手，页面不用再写 `options.ready`；</li>
 * </ul>
 * 不提供 `ready` 时按「已就绪」处理（纯静态页无需等待）。
 */
export function exposeAgentContext(source: AgentPageContextSource): void {
  const route = router.currentRoute.value.path
  contexts.set(route, source)

  const instance = getCurrentInstance()
  if (instance) {
    // enter 放在 mounted：此时 DOM 已渲染，跨页 flushPending 里若需要 router.replace 清理
    // _agent query，也不会与尚未结束的首次导航打架。
    onMounted(() => emit(route, 'enter'))
    onUnmounted(() => {
      // 只清理自己：快速来回切页时，旧实例的卸载不能删掉新实例刚写入的上下文
      if (contexts.get(route) === source) {
        contexts.delete(route)
      }
      emit(route, 'leave')
    })
  } else {
    console.warn('[agent] exposeAgentContext 必须在 <script setup> 顶层调用，否则无法自动注销')
    emit(route, 'enter')
  }
}

/** 把页面交出的原始对象包装成 adapter 使用的只读上下文 */
export function createAgentPageContext(source: AgentPageContextSource): AgentPageContext {
  return {
    call<T = unknown>(name: string, ...args: any[]): T | undefined {
      const fn = source?.[name]
      if (typeof fn !== 'function') {
        console.error(
          `[agent] 页面未暴露方法「${name}」。请在 exposeAgentContext({ ${name}: () => {...} }) 中补上`
        )
        return undefined
      }
      return fn(...args) as T
    },
    get<T = unknown>(name: string): T | undefined {
      const value = source?.[name]
      return (typeof value === 'function' ? value : unref(value)) as T | undefined
    },
    has(name: string): boolean {
      return source != null && name in source
    },
    isReady(): boolean {
      if (!source || !('ready' in source)) {
        return true
      }
      const value = source.ready
      const resolved = typeof value === 'function' ? value() : unref(value)
      // 未显式置 false / null 都算就绪，避免 ref 初值为 undefined 时永远等满 3 秒
      return resolved !== false && resolved != null
    }
  }
}
