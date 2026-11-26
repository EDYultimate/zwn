import type { AgentKbRef } from '@/api/agent/agentChat'
import type { AgentUiEvent } from '@/api/agent/agentUiCapability'

/**
 * 流式回答的「附加内容槽位」。
 *
 * <p>后端出于首字时间的考虑让 answer 逐字推 delta，details（表格）与 refs/events（跳转入口）
 * 只能等整段 JSON 生成完、在 done 帧一次性下发。于是正文写着「分项数值见下表」时，
 * 下方其实什么都没有：用户看到的是一句指向空处的引用，等很久后组件突然出现、把布局撑开。
 *
 * <p>这里不改输出契约，而是在前端把「表格 / 跳转入口」当成两个**一直存在的槽位**：
 * 流式期间就渲染等待骨架，done 后原地换成真实内容。槽位状态由消息上的
 * {@link MessageSlots} 派生，纯函数、可单测，两个问答页共用同一套规则。
 */

export type SlotKind = 'table' | 'actions'
export type SlotState = 'waiting' | 'ready' | 'empty' | 'error'

/** 挂在一条回答消息上的流式状态（放进 ref 数组里，Vue 会把它变成深层响应式） */
export interface MessageSlots {
  /** 这条回答是否仍在流式生成；false 表示 done 帧已到或已失败 */
  streaming: boolean
  /** 后端 stage 帧给的阶段文案，作为等待态的补充说明 */
  hint: string
  /** 非空表示加载异常，槽位切换成错误态并给出重试入口 */
  error: string
  /**
   * 是否已进入「表格 / 补充内容加载态」（正文逐字输出、表格走骨架的页面使用）。
   *
   * <p>触发源（命中任一即置 true）：
   * <ol>
   *   <li>后端 stage 帧 {@code 正文已完成，正在整理补充内容…}——answer 字段已写完、
   *       后面就是 refs / details，表格此时才开始生成，done 帧才下发；</li>
   *   <li>增量正文里检测到 Markdown 表格片段（竖线原文截断，交给骨架）。</li>
   * </ol>
   * 纯文字回答在正文逐字输出期间保持 false，不铺骨架、不显示「表格加载中」；
   * done 帧确实没有表格时，骨架平滑收起。
   */
  tableLoading?: boolean
}

export function createMessageSlots(): MessageSlots {
  return { streaming: true, hint: '', error: '', tableLoading: false }
}

/**
 * 与后端约定的「补充内容开始」标准标记（stage 帧 text 精确等于它）。
 *
 * <p>约定：answer 字段逐字推完后，后端先发一帧
 * {@code {"type":"stage","text":"<<DETAILS_START>>"}}，再生成 details / refs。
 * 前端看到这一帧即停止把后续 delta 当正文、按补充内容处理（表格骨架 + 等待 done）。
 *
 * <p>用固定标记而不是自然语言，是为了不依赖后端阶段文案的措辞；
 * 旧后端仍发「正文已完成，正在整理补充内容…」，两种都认。
 */
export const SUPPLEMENT_STAGE_MARKER = '<<DETAILS_START>>'

/**
 * 补充内容阶段的解析结果。
 *
 * <p>{@code kind} 为空表示后端只说了「有补充内容」，没说是什么：可能是表格、
 * 可能只是跳转按钮、也可能最后什么都没有。这种情况**不能**直接铺表格骨架，
 * 否则纯文字回答也会出现「表格加载中」。
 */
export interface SupplementStageInfo {
  matched: boolean
  kind?: SlotKind
}

const SUPPLEMENT_MARKER_RE = /^<<DETAILS_START(?::([a-z]+))?>>$/

/**
 * 解析 stage 帧。
 *
 * <p>约定写法（推荐后端按这个发）：
 * <ul>
 *   <li>{@code <<DETAILS_START:table>>} —— 后面有表格，前端立即铺表格骨架；</li>
 *   <li>{@code <<DETAILS_START:actions>>} —— 后面只有跳转按钮，不铺表格骨架；</li>
 *   <li>{@code <<DETAILS_START>>} —— 有补充内容但类型未知，只进入等待态。</li>
 * </ul>
 * 旧阶段文案（正文已完成 / 整理补充内容）按「类型未知」处理。
 *
 * <p>其余阶段（理解问题 / 检索知识库 / 整理回答 / 生成回答）一律不触发。
 */
export function parseSupplementStage(stage: string): SupplementStageInfo {
  const text = (stage || '').trim()
  if (!text) {
    return { matched: false }
  }
  const hit = SUPPLEMENT_MARKER_RE.exec(text)
  if (hit) {
    const kind = hit[1]
    return {
      matched: true,
      kind: kind === 'table' || kind === 'actions' ? kind : undefined
    }
  }
  if (/正文已完成|整理补充内容/.test(text)) {
    return { matched: true }
  }
  return { matched: false }
}

/**
 * 判断 stage 帧是否为「正文写完、开始整理补充内容」。
 *
 * <p>后端在 answer 字符串闭合时发这一帧，此时正文已逐字输出完，
 * 剩余字段（refs / details）还在生成。
 *
 * @see parseSupplementStage 需要区分「是否有表格」时用这个，它带类型信息
 */
export function isSupplementStage(stage: string): boolean {
  return parseSupplementStage(stage).matched
}

/**
 * 由「消息状态 + 是否已有真实内容」推导槽位状态。
 *
 * <p>历史消息 / 内置示例回答没有 slots，直接按内容判定 ready / empty，
 * 保证旧回答的渲染结果一字不变。
 */
export function resolveSlotState(slots: MessageSlots | undefined, hasContent: boolean): SlotState {
  if (slots?.error) {
    return 'error'
  }
  if (!slots) {
    return hasContent ? 'ready' : 'empty'
  }
  if (slots.streaming) {
    return 'waiting'
  }
  return hasContent ? 'ready' : 'empty'
}

/** 正文引用短语旁边那枚小角标的文案；空串表示不渲染（内容为空时不制造假入口） */
export function slotRefLabel(kind: SlotKind, state: SlotState): string {
  if (state === 'waiting') {
    // 正文顺口提到「表格 / 入口」，最终未必真有这类内容；用笼统措辞，不做品类承诺
    return '内容整理中…'
  }
  if (state === 'ready') {
    return kind === 'table' ? '明细见下方 ↓' : '入口见下方 ↓'
  }
  if (state === 'error') {
    return kind === 'table' ? '表格加载失败' : '入口加载失败'
  }
  return ''
}

/* ---------------- 正文里「引用了附加内容」的位置 ---------------- */

/**
 * 每种槽位只取正文中**最早**的一处引用。
 *
 * <p>短语故意选 2~4 字的短词：模型是逐字吐的，等长句写全才识别就晚了。
 * 交替顺序按「更具体在前」排列，避免「见下表」先被「下表」截走。
 * 不追求语义精确——这只是一枚提示角标，真正的表格在槽位里，识别漏了也不影响内容。
 */
const SLOT_PATTERNS: { kind: SlotKind; re: RegExp }[] = [
  { kind: 'table', re: /下方表格|如下表格|见下表|如下表|明细表|汇总表|数据表格|下表|表格/g },
  { kind: 'actions', re: /下方按钮|点击按钮|点击下方|跳转入口|页面入口|快捷入口|按钮|入口/g }
]

/**
 * 正文里每种附加内容最早一处引用短语的**结束位置**。
 *
 * <p>页面拿它决定槽位该「紧凑待命」还是「展开骨架」：正文还没提到表格时
 * 不必先摆一张大骨架，否则纯文字回答在 done 时要收起一大截，反而制造跳动。
 */
export function findSlotAnchors(text: string): Partial<Record<SlotKind, number>> {
  const anchors: Partial<Record<SlotKind, number>> = {}
  if (!text) {
    return anchors
  }
  for (const { kind, re } of SLOT_PATTERNS) {
    re.lastIndex = 0
    const hit = re.exec(text)
    if (hit) {
      anchors[kind] = hit.index + hit[0].length
    }
    re.lastIndex = 0
  }
  return anchors
}

export interface AnswerSegment {
  /** 普通文本片段 */
  text: string
  /** 已解析的页面动作角标（done 后 refs 到齐） */
  cite?: AgentUiEvent
  /** 已解析的知识库文档角标（编号 ≥ 11，点击打开原文） */
  kbRef?: AgentKbRef
  /** 文档角标显示的来源序号：同一份文档的多个 chunk 共用同一个数字 */
  kbNo?: number
  /** 流式期间 refs 还没到：先渲染成等待中的小圆点，不静默吞掉 */
  pendingCite?: boolean
  /** 这段文本后面紧跟一枚「引用附加内容」的提示角标 */
  slot?: SlotKind
}

interface Token {
  start: number
  end: number
  cite?: AgentUiEvent
  kbRef?: AgentKbRef
  kbNo?: number
  pendingCite?: boolean
  slot?: SlotKind
  /** 非预览模式下找不到事件的 [[n]]：吃掉标记但不渲染任何东西 */
  drop?: boolean
}

/**
 * 把正文拆成「文本 / 引用角标 / 待到位的角标 / 附加内容提示」片段。
 *
 * <p>是 {@code splitCitations} 的超集：旧行为（找不到事件的 [[n]] 静默丢弃）在
 * 非预览模式下完全一致，因此欢迎语、内置示例回答的显示不受影响。
 *
 * @param preview 流式预览：未匹配到引用的 [[n]] 渲染成等待角标，让用户知道这里有入口
 * @param slotRefs 是否插入附加内容引用提示；欢迎语 / 内置示例传 false，保持原样
 * @param kbRefs 知识库文档引用，与 events 共用编号空间（1~9 页面动作 / 11 起文档依据）
 * @param kbNumbers 引用编号 → 来源序号；不传则直接用原编号（旧行为）
 */
export function splitAnswerText(
  text: string,
  events?: AgentUiEvent[],
  preview = false,
  slotRefs = true,
  kbRefs?: AgentKbRef[],
  kbNumbers?: Map<number, number>
): AnswerSegment[] {
  if (!text) {
    return []
  }
  const byEvent = new Map<number, AgentUiEvent>()
  for (const event of events ?? []) {
    if (event.cite) {
      byEvent.set(event.cite, event)
    }
  }
  const byKb = new Map<number, AgentKbRef>()
  for (const ref of kbRefs ?? []) {
    if (ref.cite) {
      byKb.set(ref.cite, ref)
    }
  }

  const tokens: Token[] = []
  const citeRe = /\[\[(\d{1,2})\]\]/g
  let matched: RegExpExecArray | null
  while ((matched = citeRe.exec(text)) !== null) {
    const start = matched.index
    const end = start + matched[0].length
    const id = Number(matched[1])
    const event = byEvent.get(id)
    const kbRef = byKb.get(id)
    if (event) {
      tokens.push({ start, end, cite: event })
    } else if (kbRef) {
      // 角标显示来源序号而不是原始 chunk 编号：同一文档的多个片段共用一个数字，
      // 与回答底部的来源清单一一对应，用户不会看到「11、14 指向同一份文件」这种反直觉编号。
      tokens.push({ start, end, kbRef, kbNo: kbNumbers?.get(id) ?? id })
    } else if (preview) {
      tokens.push({ start, end, pendingCite: true })
    } else {
      tokens.push({ start, end, drop: true })
    }
  }

  if (slotRefs) {
    for (const { kind, re } of SLOT_PATTERNS) {
      re.lastIndex = 0
      const hit = re.exec(text)
      re.lastIndex = 0
      if (!hit) {
        continue
      }
      const start = hit.index
      const end = start + hit[0].length
      // 角标优先：引用短语若和 [[n]] 重叠，就不再插提示，避免同一处挤两枚标记
      const overlapsCite = tokens.some((t) => (t.cite || t.kbRef) && t.start < end && t.end > start)
      if (overlapsCite) {
        continue
      }
      // 零长度 token：短语本身留在正文里，提示角标插在它后面
      tokens.push({ start: end, end, slot: kind })
    }
  }

  tokens.sort((a, b) => a.start - b.start || a.end - b.end)
  const segments: AnswerSegment[] = []
  let last = 0
  for (const token of tokens) {
    if (token.start < last) {
      continue // 理论上不会重叠，留个兜底防止正则边界把正文吃重
    }
    if (token.start > last) {
      segments.push({ text: text.slice(last, token.start) })
    }
    if (!token.drop) {
      segments.push({
        text: '',
        cite: token.cite,
        kbRef: token.kbRef,
        kbNo: token.kbNo,
        pendingCite: token.pendingCite,
        slot: token.slot
      })
    }
    last = token.end
  }
  if (last < text.length) {
    segments.push({ text: text.slice(last) })
  }
  return segments
}

/* ---------------- 等待态展示策略 ---------------- */

/** 笼统等待文案：不承诺一定有表格 / 跳转入口，纯文字回答也适用 */
export const GENERIC_WAITING_TEXT = '回答生成中，如有补充内容将在此显示'
const GENERIC_SLOW_TEXT = '还在生成回答，请稍候…'

/**
 * 「先加载、后一次性展示」模式下的表格加载文案。
 *
 * <p>与 {@link GENERIC_WAITING_TEXT} 分开：后者用于普通回答的紧凑待命，
 * 不能承诺一定有表格；这里由页面明确进入表格加载态时才使用。
 */
export const TABLE_LOADING_TEXT = '表格数据加载中…'

/**
 * 表格骨架的最短展示时长。
 *
 * <p>done 帧可能来得极快（命中缓存、模型一次吐完整段），Vue 会把
 * waiting → ready 批处理成一次渲染，骨架从没上过屏，表格就像「啪」地冒出来。
 * 有表格时补一小段等待，让三行伪表格骨架至少可见、淡入过渡才有起点。
 */
export const MIN_TABLE_LOADING_MS = 450

/** 有表格的回答还需等待多少毫秒；纯文字回答一律不延迟（纯函数，便于单测） */
export function tableLoadingDelay(elapsedMs: number, hasTable: boolean): number {
  return hasTable ? Math.max(0, MIN_TABLE_LOADING_MS - elapsedMs) : 0
}

/**
 * 等待态文案（纯函数，便于单测）：优先用后端 stage 帧的阶段说明，
 * 其余一律退回笼统描述，等太久再把等待秒数补上。
 */
export function waitingText(options: { hint?: string; elapsed?: number } = {}): string {
  const elapsed = options.elapsed ?? 0
  if (elapsed >= 8) {
    return `${GENERIC_SLOW_TEXT}（已等待 ${elapsed}s）`
  }
  return options.hint || '回答生成中…'
}

export interface SlotView {
  state: SlotState
  /** 不铺骨架，只留一行状态条（或整块静默） */
  compact: boolean
  /** 是否显示状态条：一条消息同时最多一处，避免重复报「准备中」 */
  showStatus: boolean
  /** 是否显示「重新生成」按钮：同样只给一处 */
  showRetry: boolean
}

export interface SlotViewInput {
  /** 是否已有真实表格内容（done 帧之后才可能为真） */
  table: boolean
  /** 是否已有真实跳转入口 */
  actions: boolean
  /**
   * 流式期间强制表格槽位展开伪表格骨架，并让它独占状态条。
   * 页面显式声明本轮已进入表格加载态（正文里的表格片段 / 后端补充内容 stage），
   * 不依赖正文有没有「见下表」之类的锚点。
   */
  forceTableSkeleton?: boolean
}

/**
 * 一条消息两个槽位的展示策略，两个问答页共用同一套规则。
 *
 * <p>多数回答根本没有表格或跳转按钮，所以流式期间**不按品类分别提示**：
 * 整条消息只留一句笼统的等待描述；只有正文确实提到「见下表 / 点按钮」时，
 * 被提到的那个槽位才展开骨架占位。done 后一律以真实内容为准（ready / empty），
 * 失败也只报一次，避免同一条消息里两处「准备中 / 加载失败」。
 */
export function resolveSlotViews(
  slots: MessageSlots | undefined,
  text: string,
  input: SlotViewInput
): Record<SlotKind, SlotView> {
  const anchors = findSlotAnchors(text)
  const generic = Boolean(slots?.streaming) && !slots?.error && !anchors.table && !anchors.actions
  const forceTable = Boolean(input.forceTableSkeleton && slots?.streaming && !slots?.error)
  // 状态条归属：强制表格加载 / 笼统阶段 / 正文提到表格 → table；只提到入口 → actions
  const owner: SlotKind = forceTable || generic || anchors.table !== undefined ? 'table' : 'actions'

  const view = (kind: SlotKind): SlotView => {
    const state = resolveSlotState(slots, input[kind])
    // 历史 / 示例消息没有 slots：保持改造前的渲染，不出现任何等待态
    if (!slots) {
      return { state, compact: false, showStatus: false, showRetry: false }
    }
    if (state === 'error') {
      return { state, compact: true, showStatus: kind === 'table', showRetry: kind === 'table' }
    }
    if (state !== 'waiting') {
      return { state, compact: false, showStatus: false, showRetry: false }
    }
    const referenced = anchors[kind] !== undefined
    return {
      state,
      compact: kind === 'table' && forceTable ? false : !referenced,
      showStatus: kind === owner,
      showRetry: false
    }
  }
  return { table: view('table'), actions: view('actions') }
}
