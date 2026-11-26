import type { AnsDetail } from '@/agent/answerDetails'

/**
 * 把正文里的 Markdown 表格转成真实表格数据。
 *
 * <p>契约上逐项数值应放在 done 帧的 {@code details} 里由前端渲染成表格，
 * 但模型经常不守规矩，直接把 {@code | 表头 | ... |} 写进 {@code answer} 正文。
 * 前端没有 Markdown 解析器，正文又是 {@code white-space: pre-wrap}，
 * 结果就是一整段竖线原文糊在气泡里，还会把 {@code [[n]]} 角标挤成孤立的数字。
 *
 * <p>这里做两件事：把表格块从正文中剥离（只留「明细如下」这类引导句和表下注释），
 * 并把解析出的 head / rows 转成 {@link AnsDetail}，复用已有的 {@code .cg-tbl} 渲染。
 * 是纯函数、无第三方依赖，解析失败时宁可返回空表格也不改动正文结构。
 */

export interface MarkdownTableResult {
  /** 剥离表格原文后的正文 */
  text: string
  /** 解析出的表格块，可直接作为 details 渲染 */
  tables: AnsDetail[]
}

/* ---------------- 流式期间：模型把 JSON 回答当正文吐出来 ---------------- */

export interface StreamingJsonAnswer {
  /** 正文里是否出现了 JSON 回答结构（{"answer":"…"}） */
  detected: boolean
  /** 结构之前的前置说明（如「以下是查询结果：」），需要保留 */
  prefix: string
  /** answer 字段里已经可以安全展示的内容 */
  answer: string
  /** answer 字符串是否已经闭合 */
  closed: boolean
  /** answer 之后是否还有 details / refs 字段 */
  hasSupplement: boolean
  /** answer 之后出现了表格字段 */
  hasTable: boolean
}

const EMPTY_JSON_ANSWER: StreamingJsonAnswer = {
  detected: false,
  prefix: '',
  answer: '',
  closed: false,
  hasSupplement: false,
  hasTable: false
}

/**
 * 去掉前置说明末尾的 {@code ```json} 围栏行：围栏是给模型的格式约定，不是给用户看的正文。
 * 「以下是结果：\n```json\n」→「以下是结果：\n」；「```json\n」→「」。
 */
function stripCodeFenceLine(prefix: string): string {
  return prefix.replace(/[ \t]*```[a-zA-Z]*[ \t]*(\r?\n)?$/, '')
}

/**
 * 兜底：模型不守契约，把「前缀说明 + {"answer":"…"}」整段当正文吐出来时，
 * 从中抽出 answer 字段的内容用于展示，绝不能让 {@code {"answer":"} 这类源码露给用户。
 *
 * <p>正常情况下后端会先抽取 answer 再推 delta，这里检测不到 JSON 结构、原样返回。
 * answer 字符串里的转义（\n、\u4e2d 等）按 JSON 规则还原；遇到半个转义就停在安全前缀。
 * 前置说明里混着的围栏行（{@code ```json}）一并剥掉——它同样是 JSON 格式的痕迹。
 */
export function extractStreamingJsonAnswer(raw: string): StreamingJsonAnswer {
  if (!raw || raw.length < 12) {
    return EMPTY_JSON_ANSWER
  }
  const key = raw.indexOf('"answer"')
  if (key < 0) {
    return EMPTY_JSON_ANSWER
  }
  const brace = raw.lastIndexOf('{', key)
  if (brace < 0) {
    return EMPTY_JSON_ANSWER
  }
  const prefix = stripCodeFenceLine(raw.slice(0, brace))
  const colon = raw.indexOf(':', key + '"answer"'.length)
  if (colon < 0) {
    return { ...EMPTY_JSON_ANSWER, detected: true, prefix }
  }
  let quote = colon + 1
  while (quote < raw.length && /\s/.test(raw[quote])) {
    quote += 1
  }
  if (raw[quote] !== '"') {
    return { ...EMPTY_JSON_ANSWER, detected: true, prefix }
  }
  let out = ''
  for (let i = quote + 1; i < raw.length; i++) {
    const c = raw[i]
    if (c === '\\') {
      const next = raw[i + 1]
      if (next === undefined) {
        break // 半个转义，等下一帧
      }
      if (next === 'u') {
        const hex = raw.slice(i + 2, i + 6)
        if (!/^[0-9a-fA-F]{4}$/.test(hex)) {
          break // Unicode 转义还没到齐
        }
        out += String.fromCharCode(parseInt(hex, 16))
        i += 5
        continue
      }
      out +=
        next === 'n' ? '\n' : next === 'r' ? '\r' : next === 't' ? '\t' : next === 'b' ? '\b' : next === 'f' ? '\f' : next
      i += 1
      continue
    }
    if (c === '"') {
      const tail = raw.slice(i + 1)
      return {
        detected: true,
        prefix,
        answer: out,
        closed: true,
        hasSupplement: /^\s*,\s*"/.test(tail),
        hasTable: /"head"\s*:/.test(tail)
      }
    }
    out += c
  }
  return { detected: true, prefix, answer: out, closed: false, hasSupplement: false, hasTable: false }
}

/* ---------------- 流式期间：扣住「还没定论的 JSON / 围栏开头」 ---------------- */

export interface PendingJsonTail {
  /** 剥掉未决尾巴后的安全正文（每帧全量重算，显示可直接覆盖） */
  text: string
  /** 尾部有未决的围栏 / JSON 嫌疑：保持等待态，不要把它当成纯文本收尾 */
  pending: boolean
}

/**
 * 流式正文的尾部嗅探：{@code "answer"} 键没写完整之前，后面的兜底检测都接管不了，
 * 而 {@code ```json}、{@code {"a} 这类 JSON 开头一旦逐字上屏就收不回。
 *
 * <p>与后端 StreamingAnswerTap 的 safeTextEnd 同一条规则（双端各自兜底）：
 * <ul>
 *   <li>行首反引号 —— 可能是 {@code ```json} 围栏正在逐字生成，整行扣住
 *       （行首才查，行内代码不受影响）；</li>
 *   <li>最后一个 '{' —— 之后为空或以 '"' 开头（JSON 对象 key），按 JSON 嫌疑扣住；
 *       '{' 后是汉字 / 字母 / '}' 视为普通文本放行。</li>
 * </ul>
 * 嫌疑解除后（后续字符证明是普通文本），扣住的部分随下一帧自然补发。
 */
export function clipPendingJsonTail(text: string): PendingJsonTail {
  if (!text) {
    return { text, pending: false }
  }
  let end = text.length
  const lineStart = text.lastIndexOf('\n') + 1
  if (lineStart < end && text[lineStart] === '`') {
    end = lineStart
  }
  const brace = text.lastIndexOf('{')
  if (brace >= 0 && brace < end) {
    let i = brace + 1
    while (i < text.length && /\s/.test(text[i])) {
      i += 1
    }
    if (i >= text.length || text[i] === '"') {
      end = Math.min(end, brace)
    }
  }
  return { text: text.slice(0, end), pending: end < text.length }
}

/* ---------------- 流式期间：识别「补充内容 JSON」 ---------------- */

/**
 * details / refs 的 JSON 键名。后端若把补充字段当成正文逐字推（例如 delta 依次是
 * {@code ","}、{@code head}、{@code ":["}），这些片段会糊进气泡，
 * 前端必须认出「这里开始不是正文了」并截断。
 */
const SUPPLEMENT_JSON_KEY_RE =
  /[,{]\s*"(head|rows|title|points|num|note|details|events|kbRefs|cite)"\s*:/

/**
 * 流式正文里「补充内容 JSON」的起始下标；-1 表示正文里没有这类片段。
 *
 * <p>只作为后端没发阶段帧时的兜底：正常情况下后端会先发 stage 帧
 * （{@code <<DETAILS_START>>} 或「正文已完成，正在整理补充内容…」），
 * 前端据此直接停止追加正文，不需要逐字猜测。
 *
 * <p>截断点会往前吃掉紧贴的 {@code " , { [ } 空格} 等 JSON 结构碎片，
 * 避免正文末尾残留 {@code ","}。
 */
export function findSupplementJsonStart(text: string): number {
  if (!text || text.length < 6) {
    return -1
  }
  const hit = SUPPLEMENT_JSON_KEY_RE.exec(text)
  if (!hit) {
    return -1
  }
  let start = hit.index
  while (start > 0 && /["'{,[\]}\s]/.test(text[start - 1])) {
    start -= 1
  }
  return start
}

/**
 * 补充内容 JSON 里是否已经出现表格字段（head / rows）。
 *
 * <p>流式期间靠它决定「要不要铺表格骨架」：{@code "title"}、{@code "events"}、
 * {@code "kbRefs"} 这些字段出现都不代表有表格，只有 {@code head} / {@code rows}
 * 才说明 details 里真的是一张表。
 */
export function looksLikeTableJson(text: string): boolean {
  return /"(head|rows)"\s*:/.test(text || '')
}

/* ---------------- 流式期间：剥离「还没生成完」的表格片段 ---------------- */

export interface StreamingTextResult {
  /** 剥离未完成表格片段后的可显示正文 */
  text: string
  /** 是否检测到疑似表格片段（应展示表格加载骨架） */
  tableDetected: boolean
}

/**
 * 疑似表格行：以 {@code |} 开头，或一行里出现两个以上竖线。
 * 普通句子几乎不会命中；流式期间一行可能只吐出一半，第二个竖线一到就能判定。
 */
function looksLikeTableLine(line: string): boolean {
  const t = line.trim()
  if (!t.includes('|')) {
    return false
  }
  return t.startsWith('|') || (t.match(/\|/g) ?? []).length >= 2
}

/**
 * 流式期间把「还没生成完的表格片段」从正文中剥离。
 *
 * <p>正文要逐字流式输出，但 Markdown 表格的竖线原文（{@code | 角色 | 职责 |}）
 * 逐字漏出来会被当成「表格内容漏成文字」的 bug。这里从第一个疑似表格行起截断：
 * 之前的正文照常逐字显示，截断处交给伪表格骨架占位（{@link StreamingTextResult#tableDetected}
 * 提示页面进入表格加载态），done 后由 {@link extractMarkdownTables} 一次性剥离并渲染真表。
 */
export function stripStreamingTable(text: string): StreamingTextResult {
  if (!text || !text.includes('|')) {
    return { text, tableDetected: false }
  }
  const lines = text.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    if (looksLikeTableLine(lines[i])) {
      return {
        text: lines
          .slice(0, i)
          .join('\n')
          .replace(/\n{3,}/g, '\n\n')
          .trimEnd(),
        tableDetected: true
      }
    }
  }
  return { text, tableDetected: false }
}

const MAX_TABLES = 4
const MAX_COLS = 8
const MAX_ROWS = 30
const MAX_CELL = 200
const ESCAPED_PIPE = '\u0000'
const DIVIDER_CELL = /^:?-{3,}:?$/

/** 拆一行表格：兼容带 / 不带首尾竖线，顺手清掉角标、Markdown 强调与换行标签 */
function cells(line: string): string[] {
  const trimmed = line.trim().replace(/\\\|/g, ESCAPED_PIPE)
  const body = trimmed.startsWith('|') ? trimmed.slice(1) : trimmed
  const noTail = body.endsWith('|') ? body.slice(0, -1) : body
  return noTail.split('|').map((cell) =>
    cell
      .replaceAll(ESCAPED_PIPE, '|')
      .trim()
      .replace(/\[\[\d{1,2}\]\]/g, '')
      .replace(/\*\*/g, '')
      .replace(/`/g, '')
      .replace(/<br\s*\/?>/gi, ' ')
      .slice(0, MAX_CELL)
      .trim()
  )
}

function isDivider(line: string): boolean {
  const parts = cells(line)
  return parts.length >= 2 && parts.every((p) => DIVIDER_CELL.test(p.replace(/\s+/g, '')))
}

function isRow(line: string): boolean {
  return line.includes('|') && cells(line).length >= 2
}

/**
 * 扫描正文，遇到「表头行 + 分隔行」就认定为一个表格块。
 * 只有单个 {@code |} 的普通句子不会被误判（分隔行列数必须与表头一致）。
 */
export function extractMarkdownTables(text: string): MarkdownTableResult {
  if (!text || !text.includes('|')) {
    return { text, tables: [] }
  }

  const lines = text.split(/\r?\n/)
  const kept: string[] = []
  const tables: AnsDetail[] = []
  let i = 0

  while (i < lines.length) {
    const head = cells(lines[i])
    const hasDivider =
      i + 1 < lines.length && isDivider(lines[i + 1]) && cells(lines[i + 1]).length === head.length

    if (head.length >= 2 && hasDivider) {
      const cols = head.slice(0, MAX_COLS)
      i += 2
      const rows: string[][] = []
      while (i < lines.length && isRow(lines[i]) && !isDivider(lines[i])) {
        const row = cells(lines[i]).slice(0, cols.length)
        while (row.length < cols.length) {
          row.push('')
        }
        // 超限额的行也要消耗掉，否则竖线原文会漏回正文
        if (rows.length < MAX_ROWS && row.some(Boolean)) {
          rows.push(row)
        }
        i++
      }
      const pushed = rows.length > 0 && tables.length < MAX_TABLES
      if (pushed) {
        tables.push({ title: '', head: cols, rows, points: [], num: [], note: '' })
      }
      // 表格块周围的空行不留，避免正文里空出一大截
      while (i < lines.length && lines[i].trim() === '') {
        i++
      }
      // 「注：…」是表下注释，放进 note 才会显示在表格下方而不是正文末尾
      if (pushed && i < lines.length && /^\s*(注|备注|说明)\s*[:：]/.test(lines[i])) {
        tables[tables.length - 1].note = lines[i].trim().slice(0, MAX_CELL)
        i++
        while (i < lines.length && lines[i].trim() === '') {
          i++
        }
      }
      continue
    }

    kept.push(lines[i])
    i++
  }

  return {
    text: kept
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim(),
    tables
  }
}
