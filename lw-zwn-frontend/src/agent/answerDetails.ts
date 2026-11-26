import type { AgentAnswerDetail } from '@/api/agent/agentChat'

/**
 * 回答里的结构化明细块（归一化后可直接渲染）。
 *
 * <p>后端已做过一轮限额与列数对齐，这里仍保留前端防御：SSE done 帧来自网络，
 * 老版本后端、代理改写、模型畸形输出都可能让字段缺失或类型不对，
 * 直接 `d.head.length` 会在模板里抛错、白掉整个气泡。
 */
export interface AnsDetail {
  title: string
  head: string[]
  rows: string[][]
  points: string[]
  num: number[]
  note: string
}

const MAX_BLOCKS = 4
const MAX_COLS = 8
/** 与后端证照列表工具的 limit 上限（50）对齐，避免「工具返回 50 条、前端只画 30 条」 */
const MAX_ROWS = 50
const MAX_POINTS = 12
const MAX_CELL = 200
const MAX_TEXT = 300

/** 单元格不渲染角标与 Markdown，顺手清掉残留符号 */
function cleanCell(value: unknown, max = MAX_CELL): string {
  const text = value == null ? '' : typeof value === 'string' ? value : String(value)
  return text
    .replace(/\[\[\d{1,2}\]\]/g, '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .slice(0, max)
}

function toList(value: unknown, limit: number): string[] {
  if (!Array.isArray(value)) {
    return []
  }
  return value.slice(0, limit).map((item) => cleanCell(item))
}

/** 把后端下发的 details 归一化；任何异常都返回空数组，绝不影响正文显示 */
export function normalizeDetails(raw?: AgentAnswerDetail[] | null): AnsDetail[] {
  if (!Array.isArray(raw)) {
    return []
  }
  const result: AnsDetail[] = []
  /** 超过块数上限被丢掉的有效块数量：用于在最后一块补一句说明，避免「数据悄悄少了」 */
  let droppedBlocks = 0
  for (const block of raw) {
    if (!block || typeof block !== 'object') {
      continue
    }
    // 只对「有效块」计数，避免几个空块就把名额占满
    if (result.length >= MAX_BLOCKS) {
      const hasHead = Array.isArray(block.head) && block.head.length > 0
      const hasPoints = Array.isArray(block.points) && block.points.length > 0
      if (hasHead || hasPoints) {
        droppedBlocks += 1
      }
      continue
    }
    const head = toList(block.head, MAX_COLS)
    const allRows = Array.isArray(block.rows) ? block.rows : []
    // 行数上限是对渲染的保护：截断时必须写进 note，否则用户只看到「数据不全」
    const truncatedRows = allRows.length > MAX_ROWS
    const rawRows = allRows.slice(0, MAX_ROWS)
    let rows = rawRows.map((row) => toList(row, MAX_COLS)).filter((row) => row.length > 0)

    // 模型给了行却漏了表头：补占位列名，并把所有行补齐到同一列数
    if (!head.length && rows.length) {
      const cols = Math.max(...rows.map((r) => r.length))
      for (let i = 0; i < cols; i++) {
        head.push(`列${i + 1}`)
      }
    }
    if (head.length) {
      rows = rows.map((row) => {
        const fixed = row.slice(0, head.length)
        while (fixed.length < head.length) {
          fixed.push('')
        }
        return fixed
      })
    }

    const points = toList(block.points, MAX_POINTS).filter(Boolean)
    const num = Array.isArray(block.num)
      ? block.num.filter(
          (n): n is number =>
            Number.isInteger(n) && (n as number) >= 0 && (n as number) < head.length
        )
      : []
    const title = cleanCell(block.title)
    let note = cleanCell(block.note, MAX_TEXT)
    if (truncatedRows) {
      note = `${note ? note + '；' : ''}共 ${allRows.length} 行，仅展示前 ${MAX_ROWS} 行`
    }

    // 只有标题、既没表格也没要点的块渲染出来是个孤零零的标题，直接丢掉
    if (!head.length && !points.length) {
      continue
    }
    result.push({ title, head, rows, points, num, note })
  }
  // 块数被截断时补一句：否则后面的明细块会无声消失
  if (droppedBlocks && result.length) {
    const last = result[result.length - 1]
    last.note = `${last.note ? last.note + '；' : ''}另有 ${droppedBlocks} 个明细块未展示`
  }
  return result
}
