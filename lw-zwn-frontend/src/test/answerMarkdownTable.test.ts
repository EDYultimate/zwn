import { describe, expect, test } from 'vitest'

import {
  clipPendingJsonTail,
  extractMarkdownTables,
  extractStreamingJsonAnswer,
  stripStreamingTable
} from '@/agent/answerMarkdownTable'

/**
 * 模型把 Markdown 表格写进 answer 正文时的兜底解析。
 * 锁定：竖线原文必须从正文消失、表格结构完整、角标与强调符号不残留。
 */
describe('answerMarkdownTable · 正文表格剥离', () => {
  const answer = [
    '防洪抢险组织机构的职责在《永定河超标洪水防御预案》中有明确的具体分工 [[1]]。',
    '',
    '在《2025年海河流域超标洪水防御预案》中，职责体系以行政首长负责制为核心 [[2]]。',
    '',
    '具体职责分工明细如下：',
    '',
    '| 角色/组别 | 职责内容 | 来源文件 |',
    '| :--- | :--- | :--- |',
    '| **全面负责人** (如刘波) | 全面负责水旱灾害防御工作 | 《永定河超标洪水防御预案》[[1]] |',
    '| **抢险队** | 完成工程类、机闸机电类一般险情抢险工作 | 《永定河超标洪水防御预案》[[1]] |',
    '',
    '注：具体人员名单为示例，实际执行中应以最新公布的防汛责任人名单为准。'
  ].join('\n')

  test('解析出真实表格，正文不再出现竖线与分隔行', () => {
    const result = extractMarkdownTables(answer)

    expect(result.tables).toHaveLength(1)
    expect(result.tables[0].head).toEqual(['角色/组别', '职责内容', '来源文件'])
    expect(result.tables[0].rows).toHaveLength(2)
    expect(result.tables[0].rows[0][0]).toBe('全面负责人 (如刘波)')
    expect(result.tables[0].rows[0][2]).toBe('《永定河超标洪水防御预案》')

    expect(result.text).not.toContain('|')
    expect(result.text).not.toContain(':---')
    expect(result.text).not.toContain('**')
    expect(result.text).toContain('具体职责分工明细如下：')
    expect(result.text).toContain('行政首长负责制')
  })

  test('表下「注：」放进 note，渲染时才会在表格下方', () => {
    const result = extractMarkdownTables(answer)
    expect(result.tables[0].note).toContain('注：具体人员名单为示例')
    expect(result.text).not.toContain('注：')
  })

  test('纯文字回答原样返回，不凭空造表格', () => {
    const text = '取水许可审批主要经历申请受理、技术审查、审批发证等环节 [[1]]。'
    expect(extractMarkdownTables(text)).toEqual({ text, tables: [] })
  })

  test('正文含单个竖线但下一行不是分隔行，不误判', () => {
    const text = '口径 A | B 的说明。\n下一行是普通文字。'
    expect(extractMarkdownTables(text)).toEqual({ text, tables: [] })
  })

  test('兼容不带首尾竖线、对齐分隔行与转义竖线', () => {
    const text = ['名称 | 说明', ':---: | ---:', 'A \\| B | 数值'].join('\n')
    const result = extractMarkdownTables(text)
    expect(result.tables[0].head).toEqual(['名称', '说明'])
    expect(result.tables[0].rows[0]).toEqual(['A | B', '数值'])
    expect(result.text).toBe('')
  })

  test('超过行数上限时多余行也被消耗，不漏回正文', () => {
    const lines = [
      '| 名称 | 值 |',
      '| --- | --- |',
      ...Array.from({ length: 40 }, (_, i) => `| 行${i} | ${i} |`)
    ]
    const result = extractMarkdownTables(lines.join('\n'))
    expect(result.tables[0].rows).toHaveLength(30)
    expect(result.text).not.toContain('|')
  })
})

describe('answerMarkdownTable · 流式表格片段剥离', () => {
  test('表格片段出现前的正文逐字透传，未发现表格时不截断', () => {
    const result = stripStreamingTable('防洪抢险组织机构的职责分为四个层面，具体分工因预案层级而异。')
    expect(result).toEqual({ text: '防洪抢险组织机构的职责分为四个层面，具体分工因预案层级而异。', tableDetected: false })
  })

  test('增量吐到表格行（哪怕只有半行）就截断，之前的正文照常显示', () => {
    // 流式半截：表头行还没吐完，第二个竖线一到就判定表格开始
    const result = stripStreamingTable('具体职责分工如下：\n\n| 角色/组别 | 职')
    expect(result.tableDetected).toBe(true)
    expect(result.text).toBe('具体职责分工如下：')
    expect(result.text).not.toContain('|')
  })

  test('分隔行、数据行仍在增量里时持续截断（表格区一直在骨架中）', () => {
    const streamed = [
      '具体职责分工如下：',
      '',
      '| 角色/组别 | 职责内容 |',
      '| :--- | :--- |',
      '| 全面负责人 | 全面负责水旱灾害防御工'
    ].join('\n')
    const result = stripStreamingTable(streamed)
    expect(result.tableDetected).toBe(true)
    expect(result.text).toBe('具体职责分工如下：')
    expect(result.text).not.toContain('|')
    expect(result.text).not.toContain(':---')
  })

  test('普通句子里单个竖线不误判，正文原样返回', () => {
    const result = stripStreamingTable('口径 A | B 的说明。')
    expect(result).toEqual({ text: '口径 A | B 的说明。', tableDetected: false })
  })

  test('空文本与无竖线文本不报错', () => {
    expect(stripStreamingTable('')).toEqual({ text: '', tableDetected: false })
    expect(stripStreamingTable('纯文字回答')).toEqual({
      text: '纯文字回答',
      tableDetected: false
    })
  })
})

/**
 * 「"answer" 键没写完整之前」的窗口期防线：```json 围栏与 { 开头的 JSON 片段
 * 一旦逐字上屏就收不回，必须在嫌疑未决时扣住、定论后再放行或交给 JSON 抽取。
 */
describe('answerMarkdownTable · 流式尾部 JSON 嗅探', () => {
  test('行首反引号（围栏正在生成）：整行扣住，行内反引号不受影响', () => {
    expect(clipPendingJsonTail('查询结果如下：\n```js')).toEqual({
      text: '查询结果如下：\n',
      pending: true
    })
    // 行内代码不在行首，正常透传
    expect(clipPendingJsonTail('字段 `head` 的说明')).toEqual({
      text: '字段 `head` 的说明',
      pending: false
    })
  })

  test('末尾 "{" 后为空或跟着引号（JSON key 生成中）：扣到花括号前', () => {
    expect(clipPendingJsonTail('查询结果如下：{')).toEqual({
      text: '查询结果如下：',
      pending: true
    })
    expect(clipPendingJsonTail('查询结果如下：{"an')).toEqual({
      text: '查询结果如下：',
      pending: true
    })
  })

  test('"{|" 后是普通字符或空对象：嫌疑解除，全量放行（扣住的字符不丢）', () => {
    expect(clipPendingJsonTail('许可水量为 {约} 53631 万m³')).toEqual({
      text: '许可水量为 {约} 53631 万m³',
      pending: false
    })
    expect(clipPendingJsonTail('空对象 {} 亦如此')).toEqual({
      text: '空对象 {} 亦如此',
      pending: false
    })
  })

  test('空文本不报错', () => {
    expect(clipPendingJsonTail('')).toEqual({ text: '', pending: false })
  })
})

/**
 * 兜底一（JSON 回答抽取）接管后：前置说明保留，但混在其中的 ```json 围栏行必须剥掉，
 * 否则气泡里会一直显示 “```json”。
 */
describe('answerMarkdownTable · JSON 回答抽取剥围栏', () => {
  test('前置说明 + 围栏：prefix 剥掉围栏行，只留人话', () => {
    const raw = '查询结果如下：\n```json\n{"answer":"许可水量 53631 万m³","refs":[]}'
    const result = extractStreamingJsonAnswer(raw)
    expect(result.detected).toBe(true)
    expect(result.prefix).toBe('查询结果如下：\n')
    expect(result.answer).toBe('许可水量 53631 万m³')
  })

  test('只有围栏没有说明：prefix 为空', () => {
    const raw = '```json\n{"answer":"河道外 24436 万m³"'
    const result = extractStreamingJsonAnswer(raw)
    expect(result.detected).toBe(true)
    expect(result.prefix).toBe('')
    expect(result.answer).toBe('河道外 24436 万m³')
  })

  test('纯前置说明（无围栏）：prefix 原样保留', () => {
    const raw = '以下是查询结果：\n{"answer":"取水户数 128 户"'
    const result = extractStreamingJsonAnswer(raw)
    expect(result.detected).toBe(true)
    expect(result.prefix).toBe('以下是查询结果：\n')
  })
})
