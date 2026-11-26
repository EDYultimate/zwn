<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
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
import AgentCiteButton from '@/components/common/Agent/AgentCiteButton.vue'
import AgentStreamSlot from '@/components/common/Agent/AgentStreamSlot.vue'

/**
 * 问答 Agent 测试页（路由 /knowledge/testQA）。
 *
 * 验证「能力声明缓存 → 问答请求 → 页面操作引导」完整链路：
 * - 本页只是聊天入口，业务页的能力声明与各自 index.vue 同目录，
 *   由 pageEntries.generated.ts 静态收集、应用启动时全量上报；
 * - 提问后：模型返回的每个 UI 事件（NAVIGATE / DIALOG / COMMAND / SPOTLIGHT）都渲染成按钮，
 *   一律等用户点击后才执行，回答本身不产生任何自动跳转或自动操作；
 * - 聊天记录存在 agentStore，跳到业务页再回来不丢。
 */

const store = agentStore()
const input = ref('')
const msgsEl = ref<HTMLElement | null>(null)
/** 流式回答由占位气泡 + 伪表格骨架承接，不再叠加「正在思考…」 */
const streaming = ref(false)

/** 演示问题快捷入口（覆盖两个页面的核心操作场景） */
const demoChips = [
  '提供在系统中的位置',
  '打开超许可预警明细',
  '今年许可水量是多少',
  '把预警日期切到 2026-09-03',
  '带我去视频监控',
  '看看民有渠的视频详情',
  '防洪抢险组织机构职责',
  '大坝安全评价 金属结构 闸门"',
  '只看离线的监控点位'
]

function scrollBottom() {
  nextTick(() => {
    const el = msgsEl.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  })
}

onMounted(() => {
  // 兜底同步：应用启动时已全量上报（src/agent/capabilitySync.ts），这里再做一次指纹校验，
  // 覆盖「开发热更新后直接刷新本页」的情况；内容一致时只会发一个 GET，不会重复写。
  void store.syncCapabilities()
  if (!store.messages.length) {
    store.appendMessage({
      role: 'a',
      text:
        '你好！我是问答 Agent 测试台。页面能力清单在应用启动时已自动同步，可以直接提问：' +
        '我会给出回答，并把可做的操作列成按钮——所有跳转、打开弹框、高亮、筛选都必须由你点击按钮后才会执行。'
    })
  }
  scrollBottom()
})

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
/**
 * 展示策略统一由公共层决定：多数回答没有表格 / 按钮，流式期间整条消息
 * 只留一句笼统等待描述，不逐品类报「准备中」；
 * 只有进入表格加载态（tableLoading：检测到表格片段或收到补充内容 stage）
 * 才固定展开伪表格骨架。
 */
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
/** 正文引用了这类内容才铺骨架，其余保持紧凑 */
function slotCompact(m: AgentChatMessage, kind: SlotKind): boolean {
  return slotView(m, kind).compact
}
/** 一条消息只在归属槽位显示一次等待 / 失败状态条 */
function slotShowStatus(m: AgentChatMessage, kind: SlotKind): boolean {
  return slotView(m, kind).showStatus
}
function slotShowRetry(m: AgentChatMessage, kind: SlotKind): boolean {
  return slotView(m, kind).showRetry
}
function refChip(kind: SlotKind | undefined, m: AgentChatMessage): string {
  return kind ? slotRefLabel(kind, slotState(m, kind)) : ''
}
function refChipClass(kind: SlotKind | undefined, m: AgentChatMessage): Record<string, boolean> {
  if (!kind) {
    return {}
  }
  const state = slotState(m, kind)
  return { 'is-waiting': state === 'waiting', 'is-error': state === 'error' }
}
/** 引用统计一律用 done 帧原始全文：正文里的表格被剥离时会连带吃掉 [[n]] */
function citeTextOf(m: AgentChatMessage): string {
  return m.citeText || m.text
}
function answerSegments(m: AgentChatMessage) {
  // 只有后端流式回答才插引用提示；开场白 / 执行结果提示保持原样
  return splitAnswerText(
    m.text,
    m.buttons,
    Boolean(m.slots?.streaming),
    Boolean(m.slots),
    m.kbRefs,
    kbSourceNumbers(citeTextOf(m), m.kbRefs)
  )
}

/**
 * 回答底部的来源清单：一份文档只出现一次，序号与正文青色角标一致。
 * 正文（或表格）里没有可用角标时退回主要引用文档，知识库问答不会没有来源。
 */
function sourcesOf(m: AgentChatMessage): KbSource[] {
  return answerSources(citeTextOf(m), m.kbRefs)
}

function sourceWhere(source: KbSource): string {
  return kbSourceWhere(source)
}

/** 原文地址：有就渲染成真链接，没有时退化成提示 */
function hrefOf(ref: AgentKbRef): string {
  return kbRefUrl(ref)
}

/** 回答里有可点击的行内角标（页面动作或文档依据）时才显示引导 */
function hasCite(m: AgentChatMessage): boolean {
  return Boolean(m.buttons?.some((e) => e.cite) || m.kbRefs?.some((r) => r.cite))
}

/** 知识库角标 / 来源行点击：打开原文；打不开时只说清原因，不重复念一遍来源 */
function openKbCitation(ref: AgentKbRef) {
  const label = kbCiteLabel(ref)
  store.appendMessage({
    role: 'a',
    text: openKbRef(ref)
      ? `正在打开原文：${label}`
      : `《${ref.fileName || ref.title || '原文'}》没有可打开的原文地址（索引里缺文件路径）`
  })
}

function send(q?: string) {
  const text = (q ?? input.value).trim()
  if (!text || store.typing) {
    return
  }
  input.value = ''
  store.appendMessage({ role: 'u', text })
  store.typing = true
  streaming.value = true

  // 占位气泡：取 store 里的响应式代理，改原始 push 对象不会触发 Vue 更新。
  // 表格 / 按钮槽位随气泡一起创建，第一帧就有等待态。
  store.appendMessage({
    role: 'a',
    text: '正在理解问题…',
    question: text,
    slots: createMessageSlots()
  })
  const placeholder = store.messages[store.messages.length - 1]
  scrollBottom()
  void runAnswer(text, placeholder)
}

/**
 * 跑一轮问答并就地更新占位消息。
 *
 * <p>正文文字照常逐字流式输出；表格 / 补充内容不逐字漏出，走伪表格骨架：
 * <ul>
 *   <li>增量里检测到 Markdown 表格竖线原文 → 从该行截断，交给骨架；</li>
 *   <li>后端 stage「正文已完成，正在整理补充内容…」→ 模型开始生成 refs / details
 *       （表格在这里，正文里可能既没竖线也没「见下表」），同样进入骨架态。</li>
 * </ul>
 * 纯文字回答在正文逐字输出期间不铺骨架；done 帧到达后一次性渲染真实表格。
 * 失败时把已累积的原文放回气泡，避免半段回答凭空消失。
 */
async function runAnswer(text: string, msg: AgentChatMessage) {
  let streamed = ''
  /** 骨架首次上屏时间：done 太快时按它补足最短展示时长，保证加载效果真的可见 */
  let skeletonShownAt = 0
  /** 是否已进入补充内容阶段：此后的 delta 是 details / refs 的 JSON，不属于正文 */
  let supplementStarted = false
  /** 补充内容阶段的 JSON 文本：判断里面到底有没有表格 */
  let supplementJson = ''
  if (msg.slots) {
    msg.slots.streaming = true
    msg.slots.hint = ''
    msg.slots.error = ''
    msg.slots.tableLoading = false
  }
  /** 两个触发源共用的入口：进入表格加载态并记下骨架上屏时间 */
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
    const index = store.messages.findIndex((m) => m === msg)
    if (index >= 0) {
      store.messages.splice(index, 1)
    }
  }
  const onProgress = (stage?: string, delta?: string) => {
    if (stage) {
      // 约定标记（<<DETAILS_START...>>）只是协议信号，不显示成正文 / 阶段提示
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
        // 只有后端明确说了有表格才铺骨架；类型未知先等，避免没表格却显示表格加载中
        if (supplement.kind === 'table') {
          enterTableLoading()
        }
      }
    }
    if (delta) {
      // 补充内容阶段的增量是 refs / details 的 JSON，不写进正文
      if (supplementStarted) {
        supplementJson += delta
        if (!msg.slots?.tableLoading && looksLikeTableJson(supplementJson)) {
          enterTableLoading()
        }
        scrollBottom()
        return
      }
      streamed += delta
      // 兜底一：模型把「前缀 + {"answer":"…"}」整段当正文吐出，抽出 answer 展示
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
      // 兜底二：后端没发标记、直接把 JSON 当正文推时，从 JSON 键处截断
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
      // 正文逐字输出，但未完成的表格片段截断不显示，交给伪表格骨架占位
      const parts = stripStreamingTable(streamed)
      msg.text = parts.text
      if (parts.tableDetected) {
        enterTableLoading()
      }
    }
    scrollBottom()
  }
  const askOnce = () =>
    askAgentAuto(
      { sessionId: store.sessionId || undefined, question: text },
      { onStage: (s) => onProgress(s), onDelta: (d) => onProgress(undefined, d) }
    )

  try {
    let data: AgentChatResult | null = null
    for (let attempt = 0; attempt < 2; attempt++) {
      data = await askOnce()
      if (!data.capabilitiesStale || attempt === 1) {
        break
      }
      // 后端能力清单为空（最常见原因：后端重启过）：强制补报再重问，用户无需手动刷新
      console.info('[agent] 后端能力清单为空，重报一次后重试')
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
    store.sessionId = data.sessionId || store.sessionId
    // done 帧是权威结果：正文里若混了 Markdown 表格，剥离竖线原文并转成真实表格；
    // 后端给了结构化 details 就以它为准，否则用正文里的 Markdown 表格兜底
    const markdown = extractMarkdownTables(data.answer)
    const structured = normalizeDetails(data.details)
    const details = structured.length ? structured : markdown.tables
    // 骨架一旦上屏过，就按「首次上屏时刻」补足最短展示时长：
    // stage 与 done 几乎同时到达时骨架也能被看见，不会一闪而过。
    const rest = skeletonShownAt ? tableLoadingDelay(Date.now() - skeletonShownAt, true) : 0
    if (rest > 0) {
      await new Promise<void>((resolve) => window.setTimeout(resolve, rest))
    }
    // 同一轮渲染里先把 streaming 关掉，槽位才不会先显示空态再闪成真实内容。
    // citeText 保留未剥离表格的全文：表格里的 [[n]] 也要参与来源统计与角标编号
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
    if (msg.slots) {
      msg.slots.streaming = false
      msg.slots.error = message.includes('无权限')
        ? '当前账号没有智能问答功能权限'
        : message || '问答服务暂不可用'
    }
    if (streamed) {
      // 失败后把已收到的原文放回气泡（含被截断的表格片段），保留半段回答
      msg.text = streamed
    } else {
      // 一个字都没吐出来：换成明确的错误提示，不留空占位气泡
      removePlaceholder()
      store.appendMessage({
        role: 'a',
        text: message.includes('无权限')
          ? '当前账号没有智能问答功能权限，请联系管理员配置。'
          : `问答服务暂时不可用：${message}（请确认 lonwin-start 已启动，且当前登录 token 有效）`
      })
    }
    // 已有部分正文时保留它，槽位显示错误态 + 「重新生成」
  } finally {
    streaming.value = false
    store.typing = false
    scrollBottom()
  }
}

/** 槽位错误态里的「重新生成」：复用同一条占位消息，不再追加一条用户提问 */
function retryAnswer(msg: AgentChatMessage) {
  if (!msg.question || store.typing) {
    return
  }
  msg.text = '正在重新生成…'
  if (msg.slots) {
    msg.slots.tableLoading = false
  }
  store.typing = true
  streaming.value = true
  void runAnswer(msg.question, msg)
}

/** 点击按钮才执行：这是整条链路里唯一会触发页面动作的入口 */
function runEvent(ev: AgentUiEvent) {
  const result = store.dispatch(ev)
  if (result.navigated) {
    store.appendMessage({
      role: 'a',
      text: `正在前往「${result.navigated}」执行：${buttonText(ev)}`
    })
  } else if (result.executed) {
    store.appendMessage({ role: 'a', text: `已执行：${buttonText(ev)}` })
  } else {
    store.appendMessage({
      role: 'a',
      text: `操作未完成：${buttonText(ev)}`,
      note: '目标页面未注册该操作，或页面上找不到对应元素'
    })
  }
  scrollBottom()
}

/** 按钮文案：模型给了 label 直接用，否则降级成「类型：target」 */
function buttonText(ev: AgentUiEvent) {
  return ev.label || `${eventTypeName[ev.type] ?? ev.type}：${ev.target}`
}

async function clearChat() {
  if (store.sessionId) {
    try {
      await resetAgentChat(store.sessionId)
    } catch {
      // 后端不可用也照常清前端
    }
  }
  store.clearChat()
  store.appendMessage({ role: 'a', text: '对话已清空，重新开始吧。' })
}

const eventTypeName: Record<string, string> = {
  DIALOG: '打开弹框',
  NAVIGATE: '跳转页面',
  SPOTLIGHT: '高亮',
  COMMAND: '执行'
}
</script>

<template>
  <div class="test-agent">
    <!-- 顶栏 -->
    <div class="ta-head">
      <div>
        <span class="ta-title">问答 Agent 测试台</span>
        <span class="ta-tag">Demo：回答由后端脚本/大模型生成，UI 引导事件经能力声明白名单校验</span>
      </div>
      <button class="ta-clear" @click="clearChat">清空对话</button>
    </div>

    <!-- 消息区 -->
    <div ref="msgsEl" class="ta-msgs">
      <div
        v-for="(m, i) in store.messages"
        :key="i"
        class="ta-row"
        :class="m.role === 'u' ? 'is-u' : 'is-a'"
      >
        <div class="ta-bubble">
          <div v-if="hasCite(m)" class="ta-cite-hint">
            <span class="ta-cite-hint-ico">↗</span
            >文中角标可点击：蓝色前往对应数据或页面，青色为来源序号（见回答末尾的来源清单）
          </div>
          <!--
            正文逐字流式输出；增量里的表格片段（竖线原文）在写入前已被剥离，
            截断处由下方表格槽位的伪表格骨架承接，done 后一次性渲染真实表格。
          -->
          <div class="ta-text">
            <template v-for="(seg, k) in answerSegments(m)" :key="k">
              <AgentCiteButton v-if="seg.pendingCite" pending />
              <AgentCiteButton
                v-else-if="seg.cite"
                :cite="seg.cite.cite"
                :tip="citeActionLabel(seg.cite)"
                @activate="runEvent(seg.cite!)"
              />
              <AgentCiteButton
                v-else-if="seg.kbRef"
                variant="kb"
                :cite="seg.kbNo"
                :tip="kbCiteActionLabel(seg.kbRef)"
                @activate="openKbCitation(seg.kbRef!)"
              />
              <span
                v-else-if="seg.slot && refChip(seg.slot, m)"
                class="ta-slot-ref"
                :class="refChipClass(seg.slot, m)"
                >{{ refChip(seg.slot, m) }}</span
              >
              <span v-else>{{ seg.text }}</span>
            </template>
          </div>
          <!--
            结构化明细槽位：骨架不是一开始就铺，只有进入表格加载态
            （tableLoading：增量检测到表格片段，或后端 stage「正文已完成，正在整理补充内容…」）
            或正文提到「见下表」时才展开伪表格骨架并显示「表格数据加载中…」；
            纯文字回答只留紧凑状态条，done 后原地淡入真实表格。
          -->
          <AgentStreamSlot
            v-if="showSlot(m, 'table')"
            kind="table"
            :state="slotState(m, 'table')"
            :compact="slotCompact(m, 'table')"
            :show-status="slotShowStatus(m, 'table')"
            :show-retry="slotShowRetry(m, 'table')"
            :hint="m.slots?.hint"
            :loading-text="TABLE_LOADING_TEXT"
            :error-text="m.slots?.error"
            @retry="retryAnswer(m)"
          >
            <div v-for="(d, di) in m.details" :key="'d' + di" class="ta-detail">
              <div v-if="d.title" class="ta-detail-hd">{{ d.title }}</div>
              <!-- 宽表格在气泡内部横向滚动，不再把整个消息区撑出左右滚动条 -->
              <div v-if="d.head.length" class="ta-tbl-wrap">
                <table class="ta-tbl">
                  <thead>
                    <tr>
                      <th v-for="(h, hi) in d.head" :key="'h' + hi">{{ h }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(r, ri) in d.rows" :key="'r' + ri">
                      <td v-for="(c, ci) in r" :key="'c' + ci" :class="{ n: d.num.includes(ci) }">
                        {{ c }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ul v-if="d.points.length">
                <li v-for="(pt, pi) in d.points" :key="'pt' + pi">{{ pt }}</li>
              </ul>
              <div v-if="d.note" class="ta-detail-note">{{ d.note }}</div>
            </div>
          </AgentStreamSlot>
          <div v-if="m.note" class="ta-note">{{ m.note }}</div>
          <!-- 跳转按钮槽位：正文提到入口才展开骨架，done 后淡入，点击行为不变 -->
          <AgentStreamSlot
            v-if="showSlot(m, 'actions')"
            kind="actions"
            :state="slotState(m, 'actions')"
            :compact="slotCompact(m, 'actions')"
            :show-status="slotShowStatus(m, 'actions')"
            :show-retry="slotShowRetry(m, 'actions')"
            :hint="m.slots?.hint"
            :error-text="m.slots?.error"
            @retry="retryAnswer(m)"
          >
            <div v-if="uncitedEvents(m.text, m.buttons).length" class="ta-btns">
              <span class="ta-btns-tip">点击后才会执行：</span>
              <button
                v-for="(ev, j) in uncitedEvents(m.text, m.buttons)"
                :key="j"
                class="ta-btn"
                @click="runEvent(ev)"
              >
                {{ buttonText(ev) }}
              </button>
            </div>
          </AgentStreamSlot>
          <!-- 来源清单：一份文档一行，序号与正文青色角标一致，正文里不再重复「查看原文」 -->
          <div v-if="sourcesOf(m).length" class="ta-sources">
            <div class="ta-sources-hd">来源</div>
            <div v-for="s in sourcesOf(m)" :key="s.no" class="ta-source">
              <span class="no">{{ s.no }}</span>
              <div class="txt">
                <a
                  v-if="hrefOf(s.ref)"
                  class="t"
                  :href="hrefOf(s.ref)"
                  target="_blank"
                  rel="noopener noreferrer"
                  >《{{ s.ref.fileName || s.ref.title || '原文' }}》</a
                >
                <span v-else class="t is-off" @click="openKbCitation(s.ref)"
                  >《{{ s.ref.fileName || s.ref.title || '原文' }}》</span
                >
                <span v-if="sourceWhere(s)" class="w">{{ sourceWhere(s) }}</span>
                <span v-if="s.times > 1" class="times">正文引用 {{ s.times }} 处</span>
                <!-- 知识库原文地址：有就显示可点路径，没有时明确说明缺什么 -->
                <a
                  v-if="hrefOf(s.ref)"
                  class="addr"
                  :href="hrefOf(s.ref)"
                  target="_blank"
                  rel="noopener noreferrer"
                  :title="hrefOf(s.ref)"
                  >{{ s.ref.filePath }}</a
                >
                <span v-else class="addr is-off">索引未记录原文地址</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="store.typing && !streaming" class="ta-row is-a">
        <div class="ta-bubble ta-typing">正在思考…</div>
      </div>
    </div>

    <!-- 快捷问题 -->
    <div class="ta-chips">
      <span v-for="chip in demoChips" :key="chip" class="ta-chip" @click="send(chip)">{{
        chip
      }}</span>
    </div>

    <!-- 输入区 -->
    <div class="ta-input">
      <input
        v-model="input"
        placeholder="输入问题，回车发送（如：打开超许可预警明细）"
        @keyup.enter="send()"
      />
      <button :disabled="store.typing" @click="send()">发送</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.test-agent {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 160px);
  padding: 16px;
  background: #f5f7fb;
  border-radius: 8px;
}

.ta-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .ta-title {
    margin-right: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #1f2d3d;
  }

  .ta-tag {
    font-size: 12px;
    color: #8492a6;
  }

  .ta-clear {
    padding: 5px 14px;
    font-size: 12px;
    color: #475669;
    cursor: pointer;
    background: #fff;
    border: 1px solid #d3dce6;
    border-radius: 4px;

    &:hover {
      color: #2b8dff;
      border-color: #2b8dff;
    }
  }
}

.ta-msgs {
  flex: 1;
  overflow-y: auto;
  /* 回答（长文本 / 宽表格）一律在气泡内消化宽度，消息区不出左右滚动条 */
  overflow-x: hidden;
  padding: 12px;
  background: #fff;
  border: 1px solid #e6ebf2;
  border-radius: 8px;
}

.ta-row {
  display: flex;
  margin-bottom: 12px;

  &.is-u {
    justify-content: flex-end;

    .ta-bubble {
      color: #fff;
      background: linear-gradient(180deg, #2b8dff, #0b6bd0);
      border-radius: 10px 2px 10px 10px;
    }
  }

  &.is-a .ta-bubble {
    color: #1f2d3d;
    background: #f2f6fc;
    border-radius: 2px 10px 10px 10px;
  }
}

.ta-bubble {
  max-width: 82%;
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
  /* 详细答案的分段与编号列表按原样换行显示 */
  white-space: pre-wrap;
}

.ta-text {
  white-space: pre-wrap;
}

.ta-note {
  margin-top: 6px;
  font-size: 12px;
  color: #b8860b;
}

/* 结构化明细块：覆盖气泡的 pre-wrap，避免模板缩进被当成正文空格 */
.ta-detail {
  margin: 10px 0 2px;
  white-space: normal;
}
.ta-detail-hd {
  margin-bottom: 5px;
  font-size: 13px;
  font-weight: 700;
  color: #1f4e7a;
}
.ta-tbl-wrap {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.ta-tbl {
  width: 100%;
  font-size: 12.5px;
  border-collapse: collapse;

  th,
  td {
    padding: 5px 7px;
    text-align: left;
    border: 1px solid #d9e6f5;
  }
  th {
    font-weight: 600;
    color: #1a4f86;
    background: #eef5fd;
  }
  td.n {
    font-weight: 700;
    color: #1f6fd6;
    text-align: right;
  }
}
.ta-detail ul {
  margin: 6px 0 0;
  padding-left: 18px;
  font-size: 12.5px;
}
.ta-detail-note {
  margin-top: 5px;
  font-size: 12px;
  color: #8aa3c4;
}

/* 流式附加内容：正文「见下表 / 入口」旁边的小提示 */
.ta-slot-ref {
  display: inline-flex;
  align-items: center;
  padding: 0 7px;
  margin: 0 3px;
  font-size: 11.5px;
  line-height: 1.7;
  color: #4a7bb3;
  white-space: nowrap;
  vertical-align: baseline;
  background: #e8f1fd;
  border: 1px solid #cddff5;
  border-radius: 9px;

  &.is-waiting {
    color: #7d97b8;
    background: #f2f7fd;
    border-style: dashed;
    animation: ta-slot-pulse 1.6s ease-in-out infinite;
  }

  &.is-error {
    color: #b4651c;
    background: #fff5e9;
    border-color: #f0cda1;
  }
}
@keyframes ta-slot-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
}

/* 槽位内沿用原有明细 / 按钮样式，去掉与槽位叠加的上边距 */
.ta-bubble .as-content .ta-detail:first-child {
  margin-top: 0;
}
.ta-bubble .as-content .ta-btns {
  margin-top: 0;
}

/* 角标按钮样式统一在 AgentCiteButton.vue；这里只放「角标可点击」的一行引导 */
.ta-cite-hint {
  display: flex;
  gap: 5px;
  align-items: center;
  margin: 0 0 6px;
  font-size: 12px;
  line-height: 1.5;
  color: #5a7ba6;
  /* 气泡是 pre-wrap，提示行按普通文本排版 */
  white-space: normal;
  /* done 帧随权威答案一起出现，淡入避免「咣」地多出一行 */
  animation: ta-hint-in 0.25s ease both;
}

@keyframes ta-hint-in {
  from {
    opacity: 0;
    transform: translateY(-3px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ta-cite-hint {
    animation: none;
  }
}

.ta-cite-hint-ico {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  background: #1f7ae0;
  border-radius: 50%;
}

/* 来源清单：一份文档一行，序号与正文青色角标一致 */
.ta-sources {
  margin-top: 12px;
  padding: 9px 11px;
  background: #f7fafc;
  border: 1px solid #e6eef7;
  border-radius: 8px;
}

.ta-sources-hd {
  margin-bottom: 5px;
  font-size: 11px;
  font-weight: 700;
  color: #7d93ad;
  letter-spacing: 0.5px;
}

.ta-source {
  display: flex;
  gap: 7px;
  align-items: flex-start;
  padding: 4px 0;
  font-size: 12.5px;
  line-height: 1.6;

  & + .ta-source {
    border-top: 1px dashed #e9f0f8;
  }

  .no {
    flex: none;
    min-width: 15px;
    height: 15px;
    margin-top: 2px;
    padding: 0 4px;
    font-size: 10.5px;
    font-weight: 700;
    line-height: 15px;
    color: #0b6b58;
    text-align: center;
    background: #e8f5f1;
    border: 1px solid #a9dccf;
    border-radius: 4px;
  }

  .txt {
    min-width: 0;
  }

  .t {
    padding: 0;
    font: inherit;
    color: #1668b8;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    background: none;
    border: 0;

    &:hover {
      text-decoration: underline;
    }

    &.is-off {
      color: #6b7f95;
      cursor: default;

      &:hover {
        text-decoration: none;
      }
    }
  }

  .w {
    margin-left: 6px;
    color: #5f7794;
  }

  .times {
    margin-left: 6px;
    color: #93a7bd;
  }

  /* 原文地址独占一行并允许折行，长路径不会把气泡撑出横向滚动条 */
  .addr {
    display: block;
    margin-top: 2px;
    font-size: 11.5px;
    line-height: 1.5;
    color: #7a94b4;
    overflow-wrap: anywhere;
    text-decoration: none;

    &:hover {
      color: #1668b8;
      text-decoration: underline;
    }

    &.is-off {
      color: #a8b8ca;
      cursor: default;

      &:hover {
        text-decoration: none;
      }
    }
  }
}

.ta-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.ta-btns-tip {
  align-self: center;
  font-size: 12px;
  color: #8492a6;
}

.ta-btn {
  padding: 6px 14px;
  font-size: 13px;
  color: #2b8dff;
  cursor: pointer;
  background: #fff;
  border: 1px solid #2b8dff;
  border-radius: 16px;
  transition: all 0.2s;

  &:hover {
    color: #fff;
    background: #2b8dff;
  }
}

.ta-typing {
  color: #8492a6;
}

.ta-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 8px;
}

.ta-chip {
  padding: 4px 12px;
  font-size: 12px;
  color: #475669;
  cursor: pointer;
  background: #fff;
  border: 1px solid #d3dce6;
  border-radius: 14px;

  &:hover {
    color: #2b8dff;
    border-color: #2b8dff;
  }
}

.ta-input {
  display: flex;
  gap: 10px;

  input {
    flex: 1;
    padding: 10px 14px;
    font-size: 14px;
    outline: none;
    background: #fff;
    border: 1px solid #d3dce6;
    border-radius: 6px;

    &:focus {
      border-color: #2b8dff;
    }
  }

  button {
    padding: 0 22px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    background: #2b8dff;
    border: none;
    border-radius: 6px;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}
</style>
