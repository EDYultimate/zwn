import type { AgentKbRef } from '@/api/agent/agentChat'
import type { AgentUiEvent } from '@/api/agent/agentUiCapability'
import env from '@/env'

/**
 * 正文行内引用（`[[n]]`）的解析工具。
 *
 * <p>后端约定：answer 里每个 `[[n]]` 对应 refs 里 id=n 的那条事件，前端把它渲染成紧跟在
 * 数字后面的小角标，点角标就执行那条事件（高亮这个数、打开这个弹框）。
 *
 * <p>知识侧接入后编号空间扩展为两类，但仍是同一套 `[[n]]`：
 * <ul>
 *   <li>1~9：页面动作（events[].cite），点开弹框 / 跳转 / 高亮 / 命令；</li>
 *   <li>11 起：文档依据（kbRefs[].cite），点开原文并按章节定位。</li>
 * </ul>
 * 前端按编号查到哪一类就分派哪一种点击行为，不出现两套 `[1]`。
 *
 * <p>前端仍做一次兜底：正文里没有对应标记的事件照常渲染成按钮，避免后端清理逻辑
 * 出问题时按钮凭空消失（宁可多一个按钮，不可少一个入口）。
 */

export interface CiteSegment {
  /** 普通文本片段 */
  text: string
  /** 有值表示这段是页面动作角标 */
  cite?: AgentUiEvent
  /** 有值表示这段是知识库文档角标 */
  kbRef?: AgentKbRef
}

/** 把带 `[[n]]` 的正文拆成「文本 + 角标」片段；两类引用都没有对应的标记直接丢弃 */
export function splitCitations(
  text: string,
  events?: AgentUiEvent[],
  kbRefs?: AgentKbRef[]
): CiteSegment[] {
  if (!text) {
    return []
  }
  const byCite = new Map<number, AgentUiEvent>()
  for (const event of events ?? []) {
    if (event.cite) {
      byCite.set(event.cite, event)
    }
  }
  const byKbCite = new Map<number, AgentKbRef>()
  for (const ref of kbRefs ?? []) {
    if (ref.cite) {
      byKbCite.set(ref.cite, ref)
    }
  }
  const marker = /\[\[(\d{1,2})\]\]/g
  const segments: CiteSegment[] = []
  let last = 0
  let matched: RegExpExecArray | null
  while ((matched = marker.exec(text)) !== null) {
    const id = Number(matched[1])
    const event = byCite.get(id)
    const kbRef = byKbCite.get(id)
    if (matched.index > last) {
      segments.push({ text: text.slice(last, matched.index) })
    }
    if (event) {
      segments.push({ text: '', cite: event })
    } else if (kbRef) {
      segments.push({ text: '', kbRef })
    }
    last = matched.index + matched[0].length
  }
  if (last < text.length) {
    segments.push({ text: text.slice(last) })
  }
  return segments
}

/** 正文里实际引用到的编号集合 */
export function citedIds(text: string): Set<number> {
  const ids = new Set<number>()
  const marker = /\[\[(\d{1,2})\]\]/g
  let matched: RegExpExecArray | null
  while ((matched = marker.exec(text ?? '')) !== null) {
    ids.add(Number(matched[1]))
  }
  return ids
}

/**
 * 没有被正文引用的事件 —— 渲染成普通按钮。
 *
 * <p>判定用「正文里有没有这个编号」，而不是「事件的 cite 是不是空」：
 * 后端会把无效标记清掉，若只按 cite 判断，被清掉标记的那条事件就再也没有入口了。
 * 知识引用不在这里补按钮：它的入口就是正文角标本身。
 */
export function uncitedEvents(text: string, events?: AgentUiEvent[]): AgentUiEvent[] {
  const used = citedIds(text)
  return (events ?? []).filter((event) => !event.cite || !used.has(event.cite))
}

/** 角标的悬浮提示 / 无障碍文案 */
export function citeLabel(event: AgentUiEvent): string {
  return event.label || '定位到页面'
}

/**
 * 角标按钮的完整动作文案。
 *
 * <p>光秃秃一个小数字容易被当成脚注编号，用户不知道能点；把「点击前往」写进
 * aria-label / 悬浮浮层，既说明可点击，也说清点了去哪。不用原生 title，
 * 免得浏览器提示框和自定义浮层叠着弹两次。
 */
export function citeActionLabel(event: AgentUiEvent): string {
  return `点击前往：${citeLabel(event)}`
}

/* ---------------- 知识库文档角标 ---------------- */

/**
 * 同一份文档的归并键。
 *
 * <p>一篇文档会被切成几十个 chunk，正文里同一份文档常常被引用四五次；如果每次引用
 * 都出一个「查看原文」按钮，回答里就会挂满重复的跳转入口。归并的粒度是<b>文档</b>，
 * 不是 chunk：同一个 docId 的所有 chunk 共用一个来源序号。
 */
export function kbDocKey(ref: AgentKbRef): string {
  return ref.docId || ref.fileName || ref.title || `cite-${ref.cite ?? 0}`
}

/** 单条引用的位置描述：章节优先，PDF 只有页号时退回「第 N 页」 */
export function kbRefWhere(ref: AgentKbRef): string {
  const page = ref.pageNo ? `第 ${ref.pageNo} 页` : ''
  const section = (ref.sectionPath || '').trim()
  if (!section) {
    return page
  }
  // PDF 解析出来的 sectionPath 本身就是「第 N 页」，不要重复成「第 3 页（第 3 页）」
  if (page && /^第\s*\d+\s*页$/.test(section)) {
    return page
  }
  return page ? `${section}（${page}）` : section
}

/** 文档角标的短文案：文件名 + 章节 / 页号 */
export function kbCiteLabel(ref: AgentKbRef): string {
  const name = ref.fileName || ref.title || '原文'
  const where = kbRefWhere(ref)
  return `《${name}》${where ? ` · ${where}` : ''}`
}

/** 回答底部的来源条目：一份文档一条，序号与正文角标一致 */
export interface KbSource {
  /** 来源序号，正文角标显示的就是这个数字，从 1 开始 */
  no: number
  /** 代表引用：正文首次引用到该文档的那条命中 */
  ref: AgentKbRef
  /** 正文引用该文档的次数 */
  times: number
  /** 该文档命中的位置，去重后按首次出现顺序 */
  where: string[]
}

/** 一份文档在正文里出现多次时，位置合并成「第 3、7 页」而不是罗列两行 */
export function kbSourceWhere(source: KbSource): string {
  if (!source.where.length) {
    return ''
  }
  const pages = source.where.map((w) => /^第\s*(\d+)\s*页$/.exec(w)?.[1]).filter(Boolean)
  if (pages.length && pages.length === source.where.length) {
    return `第 ${pages.join('、')} 页`
  }
  const shown = source.where.slice(0, 3).join('；')
  return source.where.length > 3 ? `${shown} 等 ${source.where.length} 处` : shown
}

/**
 * 正文引用到的文档 → 去重后的来源清单。
 *
 * <p>只收「正文真的用 [[n]] 引过」的文档：后端下发的 kbRefs 是整轮回溯的候选片段，
 * 其中有大量模型并没有采用的条目，全列出来等于给用户看检索日志。
 * 序号按正文首次出现的顺序排，与阅读顺序一致。
 */
export function kbSources(text: string, kbRefs?: AgentKbRef[]): KbSource[] {
  const collection = collect(text, kbRefs)
  return collection.order.map((key) => collection.byDoc.get(key)!)
}

/**
 * 正文一个有效角标都没有时的兜底来源：按文档归并、按相关度取前几份主要引用。
 *
 * <p>模型偶尔不写 [[n]]，或正文里的表格被前端剥离后角标一并消失，但 kbRefs 里
 * 明明有本轮检索到的知识库文档——此时若严格执行「只列正文引用过的」，
 * 回答底部就完全没有来源，用户无法追溯答案出自哪些文档、更打不开原文。
 * 这里只取相关度最高的少量文档（不是把检索候选全倒出来），保住「有依据可查」。
 */
export function kbMainSources(kbRefs?: AgentKbRef[], limit = 5): KbSource[] {
  const byDoc = new Map<string, KbSource>()
  const refs = [...(kbRefs ?? [])].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  for (const ref of refs) {
    const key = kbDocKey(ref)
    let source = byDoc.get(key)
    if (!source) {
      if (byDoc.size >= limit) {
        continue
      }
      source = { no: 0, ref, times: 0, where: [] }
      byDoc.set(key, source)
    }
    const where = kbRefWhere(ref)
    if (where && !source.where.includes(where)) {
      source.where.push(where)
    }
  }
  return [...byDoc.values()].map((source, i) => ({ ...source, no: i + 1 }))
}

/**
 * 回答底部的来源清单（页面统一入口）：
 * 正文角标能统计出引用时按原文顺序展示；统计不到但后端确实检索到了知识库文档时，
 * 退回按相关度展示主要引用文档，保证知识库问答一定有来源地址可点。
 */
export function answerSources(text: string, kbRefs?: AgentKbRef[]): KbSource[] {
  const cited = kbSources(text, kbRefs)
  return cited.length ? cited : kbMainSources(kbRefs)
}

/**
 * 引用编号 → 来源序号。正文里的角标显示这个序号，同一文档的多个 chunk 共用一个数字。
 */
export function kbSourceNumbers(text: string, kbRefs?: AgentKbRef[]): Map<number, number> {
  const collection = collect(text, kbRefs)
  const numbers = new Map<number, number>()
  for (const [cite, key] of collection.noOf) {
    numbers.set(cite, collection.byDoc.get(key)!.no)
  }
  return numbers
}

function collect(text: string, kbRefs?: AgentKbRef[]) {
  const byCite = new Map<number, AgentKbRef>()
  for (const ref of kbRefs ?? []) {
    if (ref.cite) {
      byCite.set(ref.cite, ref)
    }
  }
  const byDoc = new Map<string, KbSource>()
  const order: string[] = []
  const noOf = new Map<number, string>()
  const marker = /\[\[(\d{1,2})\]\]/g
  let matched: RegExpExecArray | null
  while ((matched = marker.exec(text ?? '')) !== null) {
    const cite = Number(matched[1])
    const ref = byCite.get(cite)
    if (!ref) {
      continue
    }
    const key = kbDocKey(ref)
    let source = byDoc.get(key)
    if (!source) {
      source = { no: order.length + 1, ref, times: 0, where: [] }
      byDoc.set(key, source)
      order.push(key)
    }
    source.times += 1
    noOf.set(cite, key)
    const where = kbRefWhere(ref)
    if (where && !source.where.includes(where)) {
      source.where.push(where)
    }
  }
  return { byDoc, order, noOf }
}

/** 文档角标的完整动作文案，写进 aria-label / 悬浮浮层 */
export function kbCiteActionLabel(ref: AgentKbRef): string {
  return `点击查看原文：${kbCiteLabel(ref)}`
}

/**
 * 原文地址：filePath 可能是绝对 URL，也可能是服务端相对路径（如 /docFiles/...）。
 * 返回空串表示这条引用没有可打开的原文，调用方应退化为提示来源信息。
 */
export function kbRefUrl(ref: AgentKbRef): string {
  const path = ref.filePath || ''
  if (!path) {
    return ''
  }
  if (/^https?:\/\//i.test(path)) {
    return path
  }
  return `${env.API_BASE_URL || ''}${path.startsWith('/') ? '' : '/'}${path}`
}

/**
 * 打开原文。返回 false 只表示「这条引用确实没有原文地址」。
 *
 * <p>不要用 {@code window.open(...) == null} 判断失败：浏览器拦弹窗、
 * 「在新标签页中打开链接」的后台策略、无头环境都会让它返回 null，
 * 而地址本身完全可用。以前据此提示「暂无可打开的原文路径」，
 * 用户看到的是「明明有原文却说没有」。这里拦下后退化成 a 标签点击，
 * 仍处于同一次用户手势内，绝大多数情况下能正常打开。
 */
export function openKbRef(ref: AgentKbRef): boolean {
  const url = kbRefUrl(ref)
  if (!url) {
    return false
  }
  if (window.open(url, '_blank', 'noopener,noreferrer')) {
    return true
  }
  try {
    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    link.remove()
    return true
  } catch {
    return false
  }
}
