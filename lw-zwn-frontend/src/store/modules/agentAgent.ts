import { defineStore } from 'pinia'
import { nextTick, ref } from 'vue'
import router from '@/router/instance'
import {
  localCapabilityDigest,
  pageCapabilities,
  resolvePagePath
} from '@/agent/capabilityRegistry'
import type { AgentKbRef } from '@/api/agent/agentChat'
import type { AnsDetail } from '@/agent/answerDetails'
import type { MessageSlots } from '@/agent/answerSlots'
import { dismissSpotlight, spotlight } from '@/agent/spotlight'
import {
  getAgentCapabilityFingerprint,
  reportAgentCapabilities,
  type AgentPageCapabilities,
  type AgentUiEvent
} from '@/api/agent/agentUiCapability'

/**
 * 智能问答「页面动作总线」。
 *
 * 职责（与后端能力声明机制配对）：
 * 1. 能力同步：全量声明在应用启动时上报（见 src/agent/capabilitySync.ts），
 *    之后靠指纹比对增量校验；声明唯一来源是各业务页同目录的能力文件，页面不再逐页登记；
 * 2. 事件分发：模型输出的 UI 事件按 target 找到注册的页面处理器执行；
 *    处理器由页面能力插件（src/agent/page/install.ts）按路由统一注册与注销；
 * 3. 跨页执行：目标页面未挂载时事件进入待执行队列，跳转后由目标页 flush；
 * 4. 锚点高亮：SPOTLIGHT 滚动定位后播放「暗幕收缩包围 → 散去」的新手引导遮罩；
 * 5. 测试会话保持：testAgent 页的聊天记录存这里，跳转到业务页再回来不丢。
 */

/** 页面注册的处理器：target → 执行函数 */
interface HandlerEntry {
  route: string
  fn: (args: Record<string, any>) => void
}

/** testAgent 页的聊天消息 */
export interface AgentChatMessage {
  role: 'u' | 'a'
  text: string
  /** 待用户点击的按钮事件（DIALOG / NAVIGATE） */
  buttons?: AgentUiEvent[]
  /** 知识库文档引用（编号 ≥ 11），点角标打开原文 */
  kbRefs?: AgentKbRef[]
  /**
   * done 帧的完整原始正文（未剥离 Markdown 表格），只供来源清单 / 角标编号统计，
   * 不参与渲染：表格单元格里也可能带 [[n]]，剥离后直接用 m.text 会丢引用。
   */
  citeText?: string
  /** 结构化明细块（表格 / 要点），done 帧才下发 */
  details?: AnsDetail[]
  /** 流式回答的附加内容槽位状态；历史消息不带此字段 */
  slots?: MessageSlots
  /** 本条回答对应的问题，异常时支持「重新生成」 */
  question?: string
  /** 事件执行结果说明（如「已跳转到水量监控页」） */
  note?: string
}

export const agentStore = defineStore('agentAgent', () => {
  // ==================== 状态 ====================
  const handlers = new Map<string, HandlerEntry>()
  /**
   * 本地已知的页面声明，初始化即灌入登记表全量。
   * {@link ownerRoute} 依赖它查「target 属于哪个页面」；
   * 若只靠页面挂载时登记，用户没逛过的页面就永远找不到路由，按钮点了也跳不过去。
   */
  const pages = ref<AgentPageCapabilities[]>([...pageCapabilities])
  /** 最近一次同步成功后服务端确认的指纹（空 = 尚未同步成功） */
  const syncedDigest = ref('')
  /** 跨页待执行的事件队列 */
  const pending = ref<AgentUiEvent[]>([])
  /** 跨页事件的就绪等待上限：页面接口慢于它就不再干等，明确告诉用户没执行 */
  const ACTION_TIMEOUT_MS = 3000
  /** 页面自定义的「数据已就绪」判定，key 为路由 */
  const readyChecks = new Map<string, () => boolean>()

  // testAgent 聊天状态（存 store 以便跳页后恢复）
  const messages = ref<AgentChatMessage[]>([])
  const sessionId = ref('')
  const typing = ref(false)

  // ==================== 能力同步 ====================

  /** 进行中的同步任务（并发调用复用同一个请求） */
  let syncing: Promise<boolean> | null = null

  /**
   * 与后端对齐能力清单。
   *
   * <p>先查服务端指纹，与本地 `route@version` 摘要一致就直接返回（一个几十字节的 GET，
   * 不写盘、不重建索引）；不一致才全量上报。这是「定时同步」能便宜跑起来的前提——
   * 否则每个标签页每 N 分钟全量写一次，多用户场景下全是无谓写入。
   *
   * @param force true = 跳过指纹比对强制全量上报（后端清单为空时的自愈路径）
   */
  async function syncCapabilities(force = false): Promise<boolean> {
    if (!pageCapabilities.length) {
      return true
    }
    if (syncing) {
      return syncing
    }
    syncing = doSync(force)
    try {
      return await syncing
    } finally {
      syncing = null
    }
  }

  async function doSync(force: boolean): Promise<boolean> {
    const digest = localCapabilityDigest()
    try {
      if (!force) {
        const res: any = await getAgentCapabilityFingerprint('web')
        const fingerprint = res?.data as { digest?: string; pageCount?: number } | undefined
        if (fingerprint?.digest === digest && (fingerprint.pageCount ?? 0) > 0) {
          syncedDigest.value = digest
          return true
        }
      }
      await reportAgentCapabilities({ client: 'web', full: true, pages: pageCapabilities })
      syncedDigest.value = digest
      console.info(
        '[agent] 能力声明已全量同步：',
        pageCapabilities.length,
        '个页面，digest =',
        digest
      )
      return true
    } catch (e: any) {
      // 失败不记录指纹，下次「页面可见 / 定时任务」会自动重试
      syncedDigest.value = ''
      console.warn('[agent] 能力声明同步失败（将在下次触发时重试）', e?.message)
      return false
    }
  }

  /** 兼容旧调用名：全量上报（测试页与自愈路径用） */
  async function reportAll(force = false) {
    return syncCapabilities(force)
  }

  // ==================== 处理器注册与事件分发 ====================

  function registerHandler(target: string, route: string, fn: (args: Record<string, any>) => void) {
    handlers.set(target, { route, fn })
  }

  /** target 归属的页面路由（从已注册声明里查） */
  function ownerRoute(target: string): string | undefined {
    return pages.value.find(
      (p) =>
        p.dialogs?.some((d) => d.target === target) ||
        p.commands?.some((c) => c.target === target) ||
        p.anchors?.some((a) => a.target === target)
    )?.route
  }

  /**
   * 分发一个 UI 事件。
   *
   * 只由「用户点击回答里的按钮」调用——model 返回的 events 一律先渲染成按钮，
   * 不存在任何自动执行路径（自动跳转/自动打开弹框都是禁止的）。
   *
   * <p>跨页时同时做两件事：入内存队列（同一次会话内最快）+ 写进目标路由的 query。
   * 只靠内存队列的话，用户跳过去按一下刷新，事件就凭空消失了，弹框永远不出现；
   * 写进 query 后刷新、复制链接、多标签页都能复现这次引导。
   */
  function dispatch(ev: AgentUiEvent): { executed: boolean; navigated?: string } {
    if (ev.type === 'NAVIGATE') {
      dismissSpotlight()
      // 模型历史回答里可能带着改版前的 route：先过一次别名映射再跳转
      const target = resolvePagePath(ev.target)
      router.push(target)
      return { executed: true, navigated: target }
    }
    const route = ownerRoute(ev.target)
    const current = router.currentRoute.value.path
    if (route && route !== current) {
      dismissSpotlight()
      pending.value.push(ev)
      router.push({ path: route, query: { _agent: encodeEvent(ev) } })
      return { executed: false, navigated: route }
    }
    const ok = execute(ev)
    return { executed: ok }
  }

  /** 在当前页直接执行事件 */
  function execute(ev: AgentUiEvent): boolean {
    if (ev.type === 'SPOTLIGHT') {
      return highlight(ev.target, ev.label)
    }
    const handler = handlers.get(ev.target)
    if (!handler) {
      console.warn('[agent] 未注册的事件 target：', ev.target)
      window.$message?.warning(`页面未注册该操作：${ev.target}`)
      return false
    }
    try {
      handler.fn(ev.args ?? {})
      return true
    } catch (e) {
      console.warn('[agent] 事件执行失败：', ev.target, e)
      window.$message?.error('操作执行失败，请在页面上手动操作')
      return false
    }
  }

  /**
   * 目标页挂载后执行排队事件。
   *
   * <p>以前是固定等 500ms 就执行，页面接口慢一点就拿到空数据（弹框打开但内容为空）。
   * 现在改成「就绪握手」：每 50ms 探一次，处理器已注册且锚点元素存在才算就绪，
   * 最多等 {@link ACTION_TIMEOUT_MS}；超时明确告知用户没执行，而不是静默吞掉。
   */
  async function flushPending(route: string) {
    const fromQuery = takeQueryEvent(route)
    const queued = pending.value.filter((ev) => ownerRoute(ev.target) === route)
    const targets = [...queued, ...fromQuery]
    if (!targets.length) {
      return
    }
    pending.value = pending.value.filter((ev) => !queued.includes(ev))
    await nextTick()
    for (const ev of targets) {
      const ready = await waitForReady(ev)
      if (!ready) {
        console.warn('[agent] 目标页未在超时内就绪，已放弃执行：', ev.target)
        window.$message?.warning('页面数据还在加载，刚才的操作没有执行，请稍后重试')
        continue
      }
      execute(ev)
    }
  }

  /** 页面就绪判定：注册的 ready 钩子 + 处理器已注册 + （高亮时）锚点元素已渲染 */
  function isReady(ev: AgentUiEvent): boolean {
    const route = ownerRoute(ev.target) ?? router.currentRoute.value.path
    const check = readyChecks.get(route)
    if (check && !check()) {
      return false
    }
    if (ev.type === 'SPOTLIGHT') {
      return !!document.querySelector(`[data-anchor="${ev.target}"]`)
    }
    return handlers.has(ev.target)
  }

  async function waitForReady(ev: AgentUiEvent): Promise<boolean> {
    const deadline = Date.now() + ACTION_TIMEOUT_MS
    while (Date.now() < deadline) {
      if (isReady(ev)) {
        return true
      }
      await new Promise((resolve) => window.setTimeout(resolve, 50))
    }
    return isReady(ev)
  }

  /** 页面声明自己「数据已就绪」的钩子（如首屏接口返回）；不注册则只按处理器/锚点判定 */
  function registerReady(route: string, check: () => boolean) {
    readyChecks.set(route, check)
  }

  /**
   * 注销某页面注册的全部处理器。
   *
   * <p>以前处理器是全局 Map 覆盖式、从不清空：离开 A 页进 B 页后，
   * A 的 target 仍指向已经卸载的组件闭包，同名 target 还会互相覆盖导致串台。
   * 现在由页面能力插件在路由切换时统一调用。
   */
  function unregisterHandlers(route: string) {
    for (const [target, entry] of handlers) {
      if (entry.route === route) {
        handlers.delete(target)
      }
    }
  }

  /** 注销某页面的就绪钩子，避免旧闭包长期持有已卸载组件的数据 */
  function unregisterReady(route: string) {
    readyChecks.delete(route)
  }

  function encodeEvent(ev: AgentUiEvent): string {
    return JSON.stringify({
      type: ev.type,
      target: ev.target,
      label: ev.label,
      args: ev.args ?? {}
    })
  }

  function decodeEvent(raw: string): AgentUiEvent | null {
    try {
      const parsed = JSON.parse(raw) as AgentUiEvent
      return parsed?.type && parsed?.target ? parsed : null
    } catch {
      return null
    }
  }

  /**
   * 取出 URL 上的待执行事件（跨页跳转带过来的）。
   *
   * <p>取完立即从 query 里删掉：否则用户刷新一次就重放一次，弹框反复弹出。
   * 事件属于别的页面时转存内存队列，等那个页面挂载时再执行。
   */
  function takeQueryEvent(route: string): AgentUiEvent[] {
    const current = router.currentRoute.value
    const raw = current.query?._agent
    if (!raw || typeof raw !== 'string') {
      return []
    }
    clearQuery()
    const ev = decodeEvent(raw)
    if (!ev) {
      return []
    }
    if (ownerRoute(ev.target) !== route) {
      pending.value.push(ev)
      return []
    }
    return [ev]
  }

  function clearQuery() {
    const current = router.currentRoute.value
    if (!current.query?._agent) {
      return
    }
    const query = { ...current.query }
    delete query._agent
    void router.replace({ path: current.path, query })
  }

  /**
   * 高亮锚点元素：新手指导式遮罩。
   *
   * <p>不再做元素自身的 box-shadow 闪烁——那种效果在深色卡片上几乎看不见，
   * 也没有「视线被引导过去」的过程。现在由 {@link spotlight} 在 body 上挂一层
   * fixed 遮罩：暗幕从四周收缩到该元素的矩形、包围停留、再散去。
   * 遮罩 pointer-events:none，不拦截用户的下一次点击；实现细节见 spotlight.ts。
   *
   * <p>同步返回 boolean，其余动画异步自行收尾，不影响 execute / flushPending 的判定。
   */
  function highlight(target: string, label?: string): boolean {
    const el = document.querySelector(`[data-anchor="${target}"]`) as HTMLElement | null
    if (!el) {
      console.warn('[agent] 未找到锚点元素：', target)
      window.$message?.info(`请在对应页面查看：${target}`)
      return false
    }
    spotlight(el, { label })
    return true
  }

  // ==================== 测试会话 ====================

  function appendMessage(msg: AgentChatMessage) {
    messages.value.push(msg)
  }

  function clearChat() {
    messages.value = []
    sessionId.value = ''
  }

  return {
    messages,
    sessionId,
    typing,
    pages,
    pending,
    syncedDigest,
    reportAll,
    syncCapabilities,
    registerHandler,
    unregisterHandlers,
    registerReady,
    unregisterReady,
    dispatch,
    execute,
    flushPending,
    highlight,
    appendMessage,
    clearChat
  }
})
