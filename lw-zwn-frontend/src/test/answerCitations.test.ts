import { describe, expect, test } from 'vitest'
import {
  answerSources,
  citeActionLabel,
  citedIds,
  kbCiteActionLabel,
  kbCiteLabel,
  kbRefUrl,
  kbSourceNumbers,
  kbSources,
  kbSourceWhere,
  splitCitations,
  uncitedEvents
} from '@/agent/answerCitations'
import type { AgentKbRef } from '@/api/agent/agentChat'
import type { AgentUiEvent } from '@/api/agent/agentUiCapability'

/**
 * 行内引用解析：正文 [[n]] 与事件的一一对应关系。
 *
 * 这层逻辑决定「用户点的角标到底执行哪个动作」，错配比没有角标更糟，因此单独锁定。
 */
describe('answerCitations', () => {
  const total: AgentUiEvent = {
    type: 'SPOTLIGHT',
    target: 'tile.xuKeShuiLiang',
    label: '高亮许可水量',
    cite: 1
  }
  const outside: AgentUiEvent = {
    type: 'SPOTLIGHT',
    target: 'tile.xuKeShuiLiangHeDaoWai',
    label: '高亮河道外',
    cite: 2
  }

  test('多个数字各自的角标按编号对应到正确事件', () => {
    const segments = splitCitations('许可水量 [[1]]53631 万m³，河道外 [[2]]24436 万m³。', [
      total,
      outside
    ])
    const cites = segments.filter((s) => s.cite).map((s) => s.cite!.target)
    expect(cites).toEqual(['tile.xuKeShuiLiang', 'tile.xuKeShuiLiangHeDaoWai'])
    // 普通文本片段拼接后应还原正文（去掉标记）
    const plain = segments
      .filter((s) => !s.cite)
      .map((s) => s.text)
      .join('')
    expect(plain).toBe('许可水量 53631 万m³，河道外 24436 万m³。')
  })

  test('找不到对应事件的标记直接丢弃，不渲染死角标', () => {
    const segments = splitCitations('许可水量 [[7]]53631 万m³。', [total])
    expect(segments.some((s) => s.cite)).toBe(false)
    expect(segments.map((s) => s.text).join('')).toBe('许可水量 53631 万m³。')
  })

  test('没有标记时不拆段', () => {
    const segments = splitCitations('今年许可水量为 53631 万m³。')
    expect(segments).toHaveLength(1)
    expect(segments[0].text).toBe('今年许可水量为 53631 万m³。')
  })

  test('未被正文引用的事件补成按钮；被引用的不重复出按钮', () => {
    const orphan: AgentUiEvent = { type: 'DIALOG', target: 'warnDetailModal', label: '查看明细' }
    const events = [total, outside, orphan]
    const text = '许可水量 [[1]]53631 万m³，河道外 [[2]]24436 万m³。'
    expect(citedIds(text)).toEqual(new Set([1, 2]))
    expect(uncitedEvents(text, events)).toEqual([orphan])
  })

  test('cite 存在但正文标记被后端清掉时，仍然渲染成按钮，不能丢入口', () => {
    const ev: AgentUiEvent = { type: 'SPOTLIGHT', target: 'tile.x', label: '高亮', cite: 3 }
    expect(uncitedEvents('许可水量 53631 万m³。', [ev])).toEqual([ev])
  })

  test('角标动作文案写明「可点击」与去向，没有 label 时也有兜底', () => {
    expect(citeActionLabel(total)).toBe('点击前往：高亮许可水量')
    const noLabel: AgentUiEvent = { type: 'SPOTLIGHT', target: 'tile.x' }
    expect(citeActionLabel(noLabel)).toBe('点击前往：定位到页面')
  })
})

/**
 * 知识库文档引用与页面动作共用同一个 [[n]] 编号空间：
 * 1~9 归 events，11 起归 kbRefs，不能出现两套 [1]，也不能互相错配。
 */
describe('answerCitations · 知识库引用', () => {
  const kb: AgentKbRef = {
    cite: 11,
    chunkId: 'chunk-1',
    fileName: '防汛预案.docx',
    sectionPath: '1 总则 > 1.1 编制目的',
    filePath: '/docFiles/2025-07-16/a.docx'
  }
  const kb2: AgentKbRef = { cite: 12, title: '安全评价图书', filePath: '' }

  test('11 起的编号解析成 kbRef，1~9 仍解析成页面事件，互不串台', () => {
    const segments = splitCitations(
      '许可水量 [[1]]53631 万m³；编制目的见 [[11]]，职责见 [[12]]。',
      [{ type: 'SPOTLIGHT', target: 'tile.x', label: '高亮', cite: 1 }],
      [kb, kb2]
    )
    expect(segments.filter((s) => s.cite)).toHaveLength(1)
    expect(segments.filter((s) => s.kbRef).map((s) => s.kbRef!.chunkId)).toEqual([
      'chunk-1',
      undefined
    ])
  })

  test('知识引用没有对应 kbRefs 时按旧行为丢弃，不渲染死角标', () => {
    const segments = splitCitations('依据 [[11]]规定。', undefined, undefined)
    expect(segments.some((s) => s.cite || s.kbRef)).toBe(false)
    expect(segments.map((s) => s.text).join('')).toBe('依据 规定。')
  })

  test('知识引用不补成普通按钮，入口只有正文角标本身', () => {
    const events: AgentUiEvent[] = [
      { type: 'DIALOG', target: 'warnDetailModal', label: '查看明细' }
    ]
    expect(uncitedEvents('编制目的 [[11]]。', events)).toEqual(events)
  })

  test('文档角标文案写明文件名与章节，动作文案写明可点击', () => {
    expect(kbCiteLabel(kb)).toBe('《防汛预案.docx》 · 1 总则 > 1.1 编制目的')
    expect(kbCiteActionLabel(kb)).toContain('点击查看原文：')
    expect(kbCiteLabel(kb2)).toBe('《安全评价图书》')
  })

  test('原文地址：绝对 URL 原样使用，无路径返回空串', () => {
    expect(kbRefUrl({ filePath: 'https://kb.example.com/a.docx' })).toBe(
      'https://kb.example.com/a.docx'
    )
    expect(kbRefUrl(kb2)).toBe('')
  })
})

/**
 * 来源清单：一份文档只能有一个序号、一行条目。
 *
 * 之前同一份 PDF 被引用两次（11 / 14），正文里就出现两个一模一样的「查看原文」按钮，
 * 回答被跳转入口塞满。归并的粒度必须是文档，不是 chunk。
 */
describe('answerCitations · 来源清单去重', () => {
  const page1: AgentKbRef = {
    cite: 11,
    docId: 'doc-pdf',
    fileName: '海河流域超标洪水防御预案.pdf',
    sectionPath: '第 1 页',
    pageNo: 1
  }
  const page12: AgentKbRef = {
    cite: 14,
    docId: 'doc-pdf',
    fileName: '海河流域超标洪水防御预案.pdf',
    sectionPath: '第 12 页',
    pageNo: 12
  }
  const other: AgentKbRef = {
    cite: 12,
    docId: 'doc-word',
    fileName: '海河流域超标洪水防御预案.docx',
    sectionPath: '1 总则 > 1.1 编制目的'
  }
  const text = '系统中该预案 [[11]]，构成见 [[12]]，附则见 [[14]]。'

  test('同一文档的多次引用合并成一条来源，序号按首次出现顺序', () => {
    const sources = kbSources(text, [page1, other, page12])
    expect(sources.map((s) => s.no)).toEqual([1, 2])
    expect(sources.map((s) => s.ref.docId)).toEqual(['doc-pdf', 'doc-word'])
    expect(sources[0].times).toBe(2)
    expect(sources[1].times).toBe(1)
  })

  test('同文档多页合并成「第 1、12 页」，不重复罗列两行', () => {
    const sources = kbSources(text, [page1, other, page12])
    expect(sources[0].where).toEqual(['第 1 页', '第 12 页'])
    expect(kbSourceWhere(sources[0])).toBe('第 1、12 页')
    expect(kbSourceWhere(sources[1])).toBe('1 总则 > 1.1 编制目的')
  })

  test('正文没引用的候选片段不进来源清单，不给用户看检索日志', () => {
    const unused: AgentKbRef = { cite: 13, docId: 'doc-unused', fileName: '未采用.pdf' }
    expect(kbSources(text, [page1, other, page12, unused]).map((s) => s.ref.docId)).toEqual([
      'doc-pdf',
      'doc-word'
    ])
  })

  test('引用编号 → 来源序号：11 与 14 都指向 1', () => {
    const numbers = kbSourceNumbers(text, [page1, other, page12])
    expect(numbers.get(11)).toBe(1)
    expect(numbers.get(14)).toBe(1)
    expect(numbers.get(12)).toBe(2)
    expect(numbers.get(13)).toBeUndefined()
  })

  test('章节已写明页码时不再重复，PDF 的「第 N 页」保持原样', () => {
    expect(kbCiteLabel(page1)).toBe('《海河流域超标洪水防御预案.pdf》 · 第 1 页')
    expect(kbCiteLabel(other)).toBe(
      '《海河流域超标洪水防御预案.docx》 · 1 总则 > 1.1 编制目的'
    )
  })
})

/**
 * 正文里的表格被前端剥离后，单元格里的 [[n]] 会一并消失；
 * 此时 kbSources 为空，但后端 kbRefs 明明有文档，来源清单不能整个消失。
 */
describe('answerCitations · 主要引用文档兜底', () => {
  const a: AgentKbRef = {
    cite: 11,
    docId: 'doc-a',
    fileName: '永定河超标洪水防御预案.pdf',
    filePath: '/docFiles/a.pdf',
    sectionPath: '第 3 页',
    pageNo: 3,
    score: 0.91
  }
  const a2: AgentKbRef = {
    cite: 12,
    docId: 'doc-a',
    fileName: '永定河超标洪水防御预案.pdf',
    filePath: '/docFiles/a.pdf',
    sectionPath: '第 7 页',
    pageNo: 7,
    score: 0.88
  }
  const b: AgentKbRef = {
    cite: 13,
    docId: 'doc-b',
    fileName: '海河流域超标洪水防御预案.pdf',
    filePath: '/docFiles/b.pdf',
    score: 0.72
  }

  test('正文没有角标时按相关度列出主要引用文档，同一文档只出现一次', () => {
    const sources = answerSources('防洪抢险组织机构分为四个层面，具体分工见下表。', [b, a2, a])
    expect(sources.map((s) => s.ref.docId)).toEqual(['doc-a', 'doc-b'])
    expect(sources.map((s) => s.no)).toEqual([1, 2])
    expect(sources[0].ref.filePath).toBe('/docFiles/a.pdf')
    expect(sources[0].where).toEqual(['第 3 页', '第 7 页'])
  })

  test('正文有有效角标时仍按原文顺序展示，不启用兜底', () => {
    const sources = answerSources('依据 [[13]] 与 [[11]]。', [a, b])
    expect(sources.map((s) => s.ref.docId)).toEqual(['doc-b', 'doc-a'])
  })

  test('没有 kbRefs 时不凭空造来源；候选超限时只保留最相关的几份', () => {
    expect(answerSources('任意正文。', [])).toEqual([])
    const many = Array.from({ length: 12 }, (_, i) => ({
      ...a,
      cite: 11 + i,
      docId: `doc-${i}`,
      score: i / 20
    }))
    expect(answerSources('任意正文。', many)).toHaveLength(5)
  })
})
