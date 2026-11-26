import { nextTick, toRef } from 'vue'
import {
  askAgentAuto,
  resetAgentChat,
  type AgentChatResult,
  type AgentKbRef
} from '@/api/agent/agentChat'
import type { AgentUiEvent } from '@/api/agent/agentUiCapability'
import {
  answerSources,
  citeActionLabel,
  kbCiteActionLabel,
  kbCiteLabel,
  kbSourceNumbers,
  kbSourceWhere,
  kbRefUrl,
  openKbRef,
  uncitedEvents,
  type KbSource
} from '@/agent/answerCitations'
import { normalizeDetails } from '@/agent/answerDetails'
import {
  extractMarkdownTables,
  extractStreamingJsonAnswer,
  clipPendingJsonTail,
  findSupplementJsonStart,
  looksLikeTableJson,
  stripStreamingTable
} from '@/agent/answerMarkdownTable'
import {
  createMessageSlots,
  parseSupplementStage,
  resolveSlotViews,
  slotRefLabel,
  splitAnswerText,
  tableLoadingDelay,
  TABLE_LOADING_TEXT,
  type SlotKind,
  type SlotState,
  type SlotView
} from '@/agent/answerSlots'
import { agentStore, type AgentChatMessage } from '@/store/modules/agentAgent'
import { qaChatStore } from '@/store/modules/qaChat'
import { userInfoStore } from '@/store/modules/userInfo'

/**
 * 智能问答会话逻辑（与 /knowledge/testQA 同一套：流式逐字 + 表格骨架 + 引用角标 + 事件按钮）。
 *
 * <p>状态位置：会话状态存放在 qaChatStore（按 key 分区），因此路由切换卸载页面后
 * 消息、sessionId、未发出去的输入框草稿都还在；再叠加一层 sessionStorage 快照，
 * 浏览器刷新 / 关闭标签页后重新进入也能恢复。
 * 页面动作的执行仍然走 agentStore.dispatch，与业务页能力声明是同一条链路。
 */
export interface UseAgentChatOptions {
  /** 会话标识（必填）：不同 key 各自保留记录，如 qa.general / qa.cert / testAgent */
  key: string
  /**
   * 业务模块标识：发问时透传给后端，用于按模块裁剪工具清单（如取水证模块传 water-cert）。
   * 不传 = 通用问答，后端注入全量工具。
   */
  module?: string
  /** 欢迎语段落；为空表示不显示开场白 */
  welcome?: string[]
  /** 欢迎语下方的数据来源说明 */
  welcomeSource?: string
  /** 滚动到底：由组件传入消息容器；force=true 表示无视用户的上翻状态强制回到底部 */
  scrollTo?: (force?: boolean) => void
}

/** sessionStorage 快照：只保留最近若干条，避免长表格把配额撑爆 */
const STORAGE_PREFIX = 'qa-chat'
const MAX_PERSIST_MESSAGES = 100

/** 当前账号标识：内存会话与快照都按它隔离，换账号登录不会读到别人的问答记录 */
function currentUser(): string {
  try {
    return userInfoStore().state.username || 'anon'
  } catch (e) {
    // store 未安装（单测 / 独立挂载）时退化为匿名
    console.warn('[QA] 读取用户信息失败，会话使用匿名标识', e)
    return 'anon'
  }
}

export function useAgentChat(options: UseAgentChatOptions) {
  const store = agentStore()
  const chats = qaChatStore()
  const owner = currentUser()

  /** 会话状态挂在 store 上：组件卸载不影响记录 */
  const state = chats.ensure(`${owner}::${options.key}`)
  const messages = toRef(state, 'messages')
  const sessionId = toRef(state, 'sessionId')
  const typing = toRef(state, 'typing')
  const streaming = toRef(state, 'streaming')
  const input = toRef(state, 'input')

  const welcomeMessage = (): AgentChatMessage | null => {
    const text = (options.welcome ?? []).filter(Boolean).join('\n')
    return text ? { role: 'a', text, note: options.welcomeSource } : null
  }

  function storageKey(): string {
    return `${STORAGE_PREFIX}:${owner}:${options.key}`
  }

  /** 只序列化「渲染需要且可序列化」的字段；slots 是流式中间态，恢复后会卡在加载骨架 */
  function snapshot() {
    return {
      sessionId: state.sessionId,
      messages: state.messages.slice(-MAX_PERSIST_MESSAGES).map((m) => ({
        role: m.role,
        text: m.text,
        citeText: m.citeText,
        buttons: m.buttons,
        kbRefs: m.kbRefs,
        details: m.details,
        note: m.note,
        question: m.question
      }))
    }
  }

  function persist() {
    try {
      sessionStorage.setItem(storageKey(), JSON.stringify(snapshot()))
    } catch (e) {
      // 配额满 / 隐私模式：只影响刷新恢复，不影响当前会话
      console.warn('[QA] 会话快照写入失败', e)
    }
  }

  function restore(): boolean {
    try {
      const raw = sessionStorage.getItem(storageKey())
      if (!raw) {
        return false
      }
      const data = JSON.parse(raw) as { sessionId?: string; messages?: AgentChatMessage[] }
      const list = Array.isArray(data.messages) ? data.messages.filter((m) => m && m.role) : []
      if (!list.length) {
        return false
      }
      state.messages = list.map((m) => ({ ...m, slots: undefined }))
      state.sessionId = data.sessionId || ''
      return true
    } catch (e) {
      console.warn('[QA] 会话快照恢复失败', e)
      return false
    }
  }

  function resetMessages() {
    const welcome = welcomeMessage()
    state.messages = welcome ? [welcome] : []
  }

  // 首次进入：优先恢复快照，没有则写欢迎语；store 里已有记录（切路由回来）则原样保留
  if (!state.messages.length) {
    if (restore()) {
      // 快照不携带流式态：中断的请求不会跟着恢复，一律回到可交互状态
      state.typing = false
      state.streaming = false
    } else {
      resetMessages()
    }
  }

  /**
   * 滚到底部。
   *
   * @param force 用户自己发问时强制跟随：之前手动翻看历史也会被拉回最新，否则
   *              只在用户仍贴在底部时才跟随，模型流式输出不会打断用户上翻
   */
  function scrollBottom(force = false) {
    nextTick(() => options.scrollTo?.(force))
  }

  function appendMessage(msg: AgentChatMessage) {
    messages.value.push(msg)
  }

  /* ---------------- 流式附加内容槽位 ---------------- */

  function hasTable(m: AgentChatMessage): boolean {
    return Boolean(m.details?.length)
  }

  function hasActions(m: AgentChatMessage): boolean {
    return Boolean(uncitedEvents(m.text, m.buttons).length)
  }

  function showSlot(m: AgentChatMessage, kind: SlotKind): boolean {
    return m.slots ? true : kind === 'table' ? hasTable(m) : hasActions(m)
  }

  function slotView(m: AgentChatMessage, kind: SlotKind): SlotView {
    return resolveSlotViews(m.slots, m.text, {
      table: hasTable(m),
      actions: hasActions(m),
      forceTableSkeleton: Boolean(m.slots?.tableLoading)
    })[kind]
  }

  function slotState(m: AgentChatMessage, kind: SlotKind): SlotState {
    return slotView(m, kind).state
  }

  function slotCompact(m: AgentChatMessage, kind: SlotKind): boolean {
    return slotView(m, kind).compact
  }

  function slotShowStatus(m: AgentChatMessage, kind: SlotKind): boolean {
    return slotView(m, kind).showStatus
  }

  function slotShowRetry(m: AgentChatMessage, kind: SlotKind): boolean {
    return slotView(m, kind).showRetry
  }

  function refChip(kind: SlotKind | undefined, m: AgentChatMessage): string {
    return kind ? slotRefLabel(kind, slotState(m, kind)) : ''
  }

  function refChipClass(
    kind: SlotKind | undefined,
    m: AgentChatMessage
  ): Record<string, boolean> {
    if (!kind) {
      return {}
    }
    const state = slotState(m, kind)
    return { 'is-waiting': state === 'waiting', 'is-error': state === 'error' }
  }

  function citeTextOf(m: AgentChatMessage): string {
    return m.citeText || m.text
  }

  function answerSegments(m: AgentChatMessage) {
    return splitAnswerText(
      m.text,
      m.buttons,
      Boolean(m.slots?.streaming),
      Boolean(m.slots),
      m.kbRefs,
      kbSourceNumbers(citeTextOf(m), m.kbRefs)
    )
  }

  function sourcesOf(m: AgentChatMessage): KbSource[] {
    return answerSources(citeTextOf(m), m.kbRefs)
  }

  function sourceWhere(source: KbSource): string {
    return kbSourceWhere(source)
  }

  function hrefOf(ref: AgentKbRef): string {
    return kbRefUrl(ref)
  }

  function hasCite(m: AgentChatMessage): boolean {
    return Boolean(m.buttons?.some((e) => e.cite) || m.kbRefs?.some((r) => r.cite))
  }

  function openKbCitation(ref: AgentKbRef) {
    const label = kbCiteLabel(ref)
    appendMessage({
      role: 'a',
      text: openKbRef(ref)
        ? `正在打开原文：${label}`
        : `《${ref.fileName || ref.title || '原文'}》没有可打开的原文地址（索引里缺文件路径）`
    })
    scrollBottom()
  }

  /* ---------------- 提问 / 流式回答 ---------------- */

  function send(q?: string) {
    const text = (q ?? input.value).trim()
    if (!text || typing.value) {
      return
    }
    input.value = ''
    appendMessage({ role: 'u', text })
    typing.value = true
    streaming.value = true

    // 占位气泡：先上屏流式骨架，再发请求，避免 done 太快时骨架从未出现过
    appendMessage({
      role: 'a',
      text: '正在理解问题…',
      question: text,
      slots: createMessageSlots()
    })
    const placeholder = messages.value[messages.value.length - 1]
    // 用户主动发问：强制回到底部继续跟随，即使刚才正在上翻历史
    scrollBottom(true)
    void runAnswer(text, placeholder)
  }

  async function runAnswer(text: string, msg: AgentChatMessage) {
    let streamed = ''
    let skeletonShownAt = 0
    /** 是否已进入「补充内容」阶段：此后的 delta 是 details / refs 的 JSON，不属于正文 */
    let supplementStarted = false
    /** 补充内容阶段的 JSON 文本：用来判断里面到底有没有表格 */
    let supplementJson = ''
    if (msg.slots) {
      msg.slots.streaming = true
      msg.slots.hint = ''
      msg.slots.error = ''
      msg.slots.tableLoading = false
    }
    const enterTableLoading = () => {
      if (!msg.slots) {
        return
      }
      if (!msg.slots.tableLoading) {
        skeletonShownAt = Date.now()
      }
      msg.slots.tableLoading = true
    }
    const removePlaceholder = () => {
      const index = messages.value.findIndex((m) => m === msg)
      if (index >= 0) {
        messages.value.splice(index, 1)
      }
    }
    const onProgress = (stage?: string, delta?: string) => {
      if (stage) {
        // 约定标记（<<DETAILS_START...>>）只是协议信号，不能当正文 / 阶段提示显示给用户
        const isMarker = stage.trim().startsWith('<<DETAILS_START')
        if (!streamed && !isMarker) {
          msg.text = stage
        }
        if (msg.slots && !isMarker) {
          msg.slots.hint = stage
        }
        const supplement = parseSupplementStage(stage)
        if (supplement.matched) {
          supplementStarted = true
          // 只有后端明确说了「有表格」才铺骨架。旧文案 / 未声明类型时先等：
          // 「整理补充内容」也可能只是跳转按钮，甚至什么都没有，不能先摆一张表格
          if (supplement.kind === 'table') {
            enterTableLoading()
          }
        }
      }
      if (delta) {
        // 补充内容阶段后的增量是 details / refs 的 JSON（例如 ","head":["），
        // 不是正文：不写进气泡，只攒起来判断里面有没有表格
        if (supplementStarted) {
          supplementJson += delta
          if (!msg.slots?.tableLoading && looksLikeTableJson(supplementJson)) {
            enterTableLoading()
          }
          scrollBottom()
          return
        }
        streamed += delta
        // 兜底一：模型把「前缀说明 + {"answer":"…"}」整段当正文吐出来：
        // 从 JSON 里抽出 answer 展示，绝不把 JSON 源码露在气泡里
        const jsonAnswer = extractStreamingJsonAnswer(streamed)
        if (jsonAnswer.detected) {
          const visible = stripStreamingTable(jsonAnswer.prefix + jsonAnswer.answer)
          msg.text = visible.text.trimEnd()
          if (visible.tableDetected || jsonAnswer.hasTable) {
            enterTableLoading()
          }
          scrollBottom()
          return
        }
        // 兜底二：后端没发阶段帧、直接把 details JSON 当正文推过来时，从 JSON 键处截断
        const jsonStart = findSupplementJsonStart(streamed)
        if (jsonStart >= 0) {
          supplementStarted = true
          supplementJson = streamed.slice(jsonStart)
          msg.text = streamed.slice(0, jsonStart)
          if (looksLikeTableJson(supplementJson)) {
            enterTableLoading()
          }
          scrollBottom()
          return
        }
        // 正文逐字输出。三个防线都不许 JSON 痕迹上屏：
        // 未决的围栏 / JSON 开头先扣住（"answer" 键没写全之前兜底一还没接管，
        // ```json / {" 会逐字漏出来）、未完成的表格片段截断、交给伪表格骨架占位
        const clipped = clipPendingJsonTail(streamed)
        const parts = stripStreamingTable(clipped.text)
        msg.text = parts.text
        if (parts.tableDetected) {
          enterTableLoading()
        }
      }
      scrollBottom()
    }
    const askOnce = () =>
      askAgentAuto(
        { sessionId: sessionId.value || undefined, question: text, module: options.module },
        { onStage: (s) => onProgress(s), onDelta: (d) => onProgress(undefined, d) }
      )

    try {
      // 页面能力清单没同步过就先补一次，避免后端以为系统里没有可操作页面
      if (!store.syncedDigest) {
        await store.syncCapabilities()
      }
      let data: AgentChatResult | null = null
      for (let attempt = 0; attempt < 2; attempt++) {
        data = await askOnce()
        if (!data.capabilitiesStale || attempt === 1) {
          break
        }
        // 后端能力清单为空（最常见原因：后端重启过）：强制补报再重问，用户无需手动刷新
        console.info('[QA] 后端能力清单为空，重报一次后重试')
        await store.reportAll(true)
        streamed = ''
        skeletonShownAt = 0
        supplementStarted = false
        supplementJson = ''
        msg.text = '页面引导能力已同步，正在重新回答…'
        if (msg.slots) {
          msg.slots.tableLoading = false
        }
      }

      if (!data?.answer) {
        throw new Error('未获取到回答')
      }
      sessionId.value = data.sessionId || sessionId.value
      const markdown = extractMarkdownTables(data.answer)
      const structured = normalizeDetails(data.details)
      const details = structured.length ? structured : markdown.tables
      const rest = skeletonShownAt ? tableLoadingDelay(Date.now() - skeletonShownAt, true) : 0
      if (rest > 0) {
        await new Promise<void>((resolve) => window.setTimeout(resolve, rest))
      }
      // 同一轮渲染里先关 streaming，槽位才不会先显示空态再闪成真实内容
      msg.citeText = data.answer
      msg.text = markdown.text
      msg.buttons = data.events ?? []
      msg.kbRefs = data.kbRefs ?? []
      msg.details = details
      if (msg.slots) {
        msg.slots.streaming = false
      }
    } catch (e: any) {
      const message = String(e?.message ?? '')
      console.warn('[QA] 智能问答接口调用失败', e)
      if (msg.slots) {
        msg.slots.streaming = false
        msg.slots.error = message.includes('无权限')
          ? '当前账号没有智能问答功能权限'
          : message || '模型调用失败'
      }
      if (streamed) {
        // 失败后把已收到的原文放回气泡，保留半段回答
        msg.text = streamed
      } else {
        removePlaceholder()
        if (message.includes('无权限')) {
          window.$message?.warning('当前账号没有智能问答功能权限，请联系管理员配置')
          appendMessage({
            role: 'a',
            text: '当前账号暂无智能问答功能权限，请联系管理员在权限系统中配置后重试。'
          })
        } else {
          // 调用失败不使用任何内置示例兜底：宁可如实说失败，也不让用户把演示数据当成真实结果
          window.$message?.warning('模型调用失败，请稍后再试')
          appendMessage({
            role: 'a',
            text: '模型调用失败，请稍后再试。',
            note: message ? `错误信息：${message}` : ''
          })
        }
      }
    } finally {
      streaming.value = false
      typing.value = false
      // 一轮结束才落盘：逐字流式过程不写，避免高频写入与半截快照
      persist()
      scrollBottom()
    }
  }

  /** 槽位错误态里的「重新生成」：复用同一条占位消息，不追加用户提问 */
  function retryAnswer(msg: AgentChatMessage) {
    if (!msg.question || typing.value) {
      return
    }
    msg.text = '正在重新生成…'
    if (msg.slots) {
      msg.slots.tableLoading = false
    }
    typing.value = true
    streaming.value = true
    // 用户主动点「重新生成」：强制回到底部跟随
    scrollBottom(true)
    void runAnswer(msg.question, msg)
  }

  /* ---------------- 事件按钮 / 清空 ---------------- */

  function buttonText(ev: AgentUiEvent) {
    return ev.label || `${eventTypeName[ev.type] ?? ev.type}：${ev.target}`
  }

  /** 点击按钮才执行：整条链路里唯一会触发页面动作的入口 */
  function runEvent(ev: AgentUiEvent) {
    const result = store.dispatch(ev)
    if (result.navigated) {
      appendMessage({ role: 'a', text: `正在前往「${result.navigated}」执行：${buttonText(ev)}` })
    } else if (result.executed) {
      appendMessage({ role: 'a', text: `已执行：${buttonText(ev)}` })
    } else {
      appendMessage({
        role: 'a',
        text: `操作未完成：${buttonText(ev)}`,
        note: '目标页面未注册该操作，或页面上找不到对应元素'
      })
    }
    scrollBottom()
  }

  async function clearChat() {
    const sid = sessionId.value
    sessionId.value = ''
    if (sid) {
      try {
        await resetAgentChat(sid)
      } catch (e) {
        // 后端不可用也照常清前端
        console.warn('[QA] 清空会话记忆失败', e)
      }
    }
    resetMessages()
    typing.value = false
    streaming.value = false
    try {
      // 清空也要清掉快照，否则刷新后旧对话又回来了
      sessionStorage.removeItem(storageKey())
    } catch (e) {
      console.warn('[QA] 会话快照清理失败', e)
    }
    window.$message?.info('对话已清空')
    scrollBottom()
  }

  return {
    messages,
    sessionId,
    typing,
    streaming,
    input,
    send,
    retryAnswer,
    runEvent,
    clearChat,
    buttonText,
    hasCite,
    answerSegments,
    sourcesOf,
    sourceWhere,
    hrefOf,
    openKbCitation,
    showSlot,
    slotState,
    slotCompact,
    slotShowStatus,
    slotShowRetry,
    refChip,
    refChipClass,
    citeActionLabel,
    kbCiteActionLabel,
    uncitedEvents,
    TABLE_LOADING_TEXT
  }
}

const eventTypeName: Record<string, string> = {
  DIALOG: '打开弹框',
  NAVIGATE: '跳转页面',
  SPOTLIGHT: '高亮',
  COMMAND: '执行'
}

export type AgentChatSession = ReturnType<typeof useAgentChat>
