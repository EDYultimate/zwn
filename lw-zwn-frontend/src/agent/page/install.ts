import { nextTick, watch } from 'vue'
import router from '@/router/instance'
import { agentStore } from '@/store/modules/agentAgent'
import { createAgentPageContext, getAgentContext, onAgentContextChange } from './bridge'
import { declaredTargets, findPageDefinition, pageDefinitions } from './registry'
import type { AgentPageContextSource, AgentPageDefinition } from './types'

/**
 * 页面能力插件：把「注册 handler / 就绪握手 / 跨页冲刷 / 离开注销」全部收归一处。
 *
 * <p>业务页不再调用 useAgentActions，也不再 import 能力声明；只要 expose 一次上下文，
 * 插件按当前路由找到该页的能力定义（与业务页同目录，由静态入口登记）自动完成接线。
 *
 * <p>时序：本函数必须在 `app.mount()` **之前**调用。
 * 页面 setup 里的 exposeAgentContext 发生在 mount 期间，若插件晚于 mount 安装，
 * 首屏页面的 enter 事件就丢了（表现为刷新后按钮无效、再切一次页才恢复）。
 */

let installed = false
let activeRoute = ''
let activeSource: AgentPageContextSource | undefined

/**
 * 能力声明里的 route 由路由表生成，这里再用真实 router 反查一次：
 * 改了 home.ts 却没跑 `npm run gen:agent` 时，启动就能看见红字，而不是等按钮跳到 404。
 */
function validateRouteSync(): string[] {
  const problems: string[] = []
  if (typeof router.getRoutes !== 'function') {
    return problems
  }
  const byName = new Map<string, string>()
  for (const record of router.getRoutes()) {
    if (record.name) {
      byName.set(String(record.name), record.path)
    }
  }
  for (const def of pageDefinitions) {
    if (!def.pageKey) {
      continue
    }
    const actual = byName.get(def.pageKey)
    if (!actual) {
      problems.push(`${def.capabilities.route}: 路由表里找不到 name「${def.pageKey}」`)
    } else if (actual !== def.capabilities.route) {
      problems.push(
        `${def.capabilities.route}: 路由表当前路径为「${actual}」，生成物已过期，请执行 npm run gen:agent`
      )
    }
  }
  return problems
}

/** 启动自检：把「靠人记」的规则变成控制台里能看见的红字 */
export function validatePageDefinitions(): string[] {
  const problems: string[] = []
  const seenRoutes = new Set<string>()
  const seenTargets = new Map<string, string>()

  for (const def of pageDefinitions) {
    const { route, version } = def.capabilities
    const label = route || '(缺少 route)'
    if (!route) {
      problems.push(`${label}: capabilities.route 不能为空`)
    }
    if (seenRoutes.has(route)) {
      problems.push(`${label}: route 重复，指纹与 ownerRoute 都会歧义`)
    }
    seenRoutes.add(route)
    if (!version) {
      problems.push(`${label}: version 不能为空（应由能力面内容自动算出）`)
    }
    if (typeof def.createHandlers !== 'function') {
      problems.push(`${label}: 缺少 createHandlers`)
    }

    for (const target of declaredTargets(def)) {
      const owner = seenTargets.get(target)
      if (owner && owner !== route) {
        problems.push(`${label}: target「${target}」与 ${owner} 重复，事件会分发到错误页面`)
      }
      seenTargets.set(target, route)
    }
  }

  if (!pageDefinitions.length) {
    problems.push('pageEntries.generated.ts 里没有任何页面定义，请执行 npm run gen:agent')
  }
  return [...problems, ...validateRouteSync()]
}

/** 运行时对账：声明了 target 却没有 handler，等于模型给了按钮但点了没反应 */
function assertHandlerCoverage(def: AgentPageDefinition, handlers: Record<string, unknown>) {
  const keys = new Set(Object.keys(handlers ?? {}))
  const missing = declaredTargets(def).filter((target) => !keys.has(target))
  const extra = [...keys].filter((key) => !declaredTargets(def).includes(key))
  if (missing.length) {
    console.error(`[agent] ${def.capabilities.route} 缺少 handler：${missing.join('、')}`)
  }
  if (extra.length) {
    console.error(`[agent] ${def.capabilities.route} 存在未声明的 handler：${extra.join('、')}`)
  }
}

/**
 * 页面挂载时对账「动作表声明的方法」与「业务页 expose 的键」。
 * 编译期有 satisfies 兜底，这里是防 `as any` / 动态键绕过的最后一道防线。
 */
function assertContextCoverage(def: AgentPageDefinition, raw: AgentPageContextSource | undefined) {
  const methods = def.actions?.methods ?? []
  if (!methods.length) {
    return
  }
  const exposed = Object.keys(raw ?? {})
  const missing = methods.filter((m) => !exposed.includes(m))
  const extra = exposed.filter((key) => key !== 'ready' && !methods.includes(key))
  const label = def.capabilities.route
  if (missing.length) {
    console.error(
      `[agent] ${label} 未暴露契约方法：${missing.join('、')}，请在 exposeAgentContext 中补齐`
    )
  }
  if (extra.length) {
    console.error(
      `[agent] ${label} 暴露了契约外的方法：${extra.join('、')}，请在动作表中声明或删除`
    )
  }
}

/** 开发期提示：声明了锚点但模板里没打 data-anchor（折叠区元素允许缺失，仅告警） */
async function warnMissingAnchors(def: AgentPageDefinition) {
  if (!import.meta.env.DEV) {
    return
  }
  await nextTick()
  for (const anchor of def.capabilities.anchors ?? []) {
    if (!document.querySelector(`[data-anchor="${anchor.target}"]`)) {
      console.warn(
        `[agent] ${def.capabilities.route} 声明了锚点「${anchor.target}」，当前 DOM 未找到 data-anchor`
      )
    }
  }
}

export function installAgentPages(): void {
  if (installed) {
    return
  }
  installed = true

  const problems = validatePageDefinitions()
  if (problems.length) {
    console.error('[agent] 页面能力自检未通过：\n - ' + problems.join('\n - '))
  } else {
    console.info('[agent] 页面能力自检通过：', pageDefinitions.length, '个页面')
  }

  const store = agentStore()

  const deactivate = (route: string) => {
    store.unregisterHandlers(route)
    store.unregisterReady(route)
    if (activeRoute === route) {
      activeRoute = ''
      activeSource = undefined
    }
  }

  const activate = (route: string, raw: AgentPageContextSource | undefined) => {
    const def = findPageDefinition(route)
    if (!def) {
      return
    }

    if (!raw && declaredTargets(def).length) {
      console.error(
        `[agent] 页面 ${route} 未在 <script setup> 调用 exposeAgentContext，事件处理器将全部失效`
      )
    }

    assertContextCoverage(def, raw)

    const ctx = createAgentPageContext(raw ?? {})
    const handlers = def.createHandlers(ctx)
    assertHandlerCoverage(def, handlers)

    Object.entries(handlers).forEach(([target, fn]) => store.registerHandler(target, route, fn))
    store.registerReady(route, () => (def.ready ? def.ready(ctx) : ctx.isReady()))
    void store.flushPending(route)
    void warnMissingAnchors(def)
  }

  // 接线一律由页面 onMounted 的 enter 驱动：此时上下文已写入、DOM 已渲染。
  // 用 source 对象引用判重，快速来回切页时同路由的新实例仍能重新接线。
  onAgentContextChange((route, kind) => {
    if (kind === 'leave') {
      deactivate(route)
      return
    }
    const raw = getAgentContext(route)
    if (activeRoute === route && activeSource === raw) {
      return
    }
    activeRoute = route
    activeSource = raw
    activate(route, raw)
  })

  // 路由 watcher 只做注销兜底。刻意不在这里 activate：
  // post flush 与组件 onMounted 的先后顺序不保证，抢先接线会绑到空上下文。
  watch(
    () => router.currentRoute.value.path,
    (next, prev) => {
      if (prev && prev !== next && activeRoute === prev) {
        deactivate(prev)
      }
    },
    { flush: 'post' }
  )
}

/** 诊断用：供调试页展示「哪些页面接了、target 各归谁」 */
export function agentPageDiagnostics() {
  return pageDefinitions.map((def) => ({
    pageKey: def.pageKey ?? null,
    route: def.capabilities.route,
    version: def.capabilities.version,
    title: def.capabilities.title,
    anchors: def.capabilities.anchors?.map((a) => a.target) ?? [],
    actions: declaredTargets(def),
    methods: def.actions?.methods ?? [],
    contextReady: Boolean(getAgentContext(def.capabilities.route))
  }))
}
