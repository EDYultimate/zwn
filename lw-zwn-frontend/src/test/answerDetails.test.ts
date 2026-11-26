import { describe, expect, it } from 'vitest'
import { normalizeDetails, type AnsDetail } from '@/agent/answerDetails'
import type { AgentAnswerDetail } from '@/api/agent/agentChat'

describe('normalizeDetails', () => {
  it('正常明细：标题 / 表头 / 行 / 数值列 / 要点 / 注释全部保留', () => {
    const raw: AgentAnswerDetail[] = [
      {
        title: '许可水量构成',
        head: ['口径', '水量(万m³)'],
        rows: [
          ['总量', '53631'],
          ['河道外', '24436']
        ],
        num: [1],
        note: '已按当前单位过滤'
      },
      { title: '口径说明', points: ['许可水量是批复量', '不同于年度用水计划'] }
    ]

    const result = normalizeDetails(raw)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      title: '许可水量构成',
      head: ['口径', '水量(万m³)'],
      rows: [
        ['总量', '53631'],
        ['河道外', '24436']
      ],
      points: [],
      num: [1],
      note: '已按当前单位过滤'
    })
    expect(result[1].head).toEqual([])
    expect(result[1].points).toHaveLength(2)
  })

  it('漏了表头：自动补列名，并把所有行补齐到同一列数', () => {
    const result = normalizeDetails([
      { rows: [['总量'], ['河道外', '24436', '第三列']] } as AgentAnswerDetail
    ])

    expect(result[0].head).toEqual(['列1', '列2', '列3'])
    expect(result[0].rows).toEqual([
      ['总量', '', ''],
      ['河道外', '24436', '第三列']
    ])
  })

  it('单元格清除角标与 Markdown，超长内容截断', () => {
    const long = 'x'.repeat(260)
    const result = normalizeDetails([
      {
        title: '明[[1]]细',
        head: ['**口径**', '数值'],
        rows: [['`53631`', long]],
        points: ['- 要点一']
      }
    ])

    expect(result[0].title).toBe('明细')
    expect(result[0].head).toEqual(['口径', '数值'])
    expect(result[0].rows[0][0]).toBe('53631')
    expect(result[0].rows[0][1]).toHaveLength(200)
    expect(result[0].points).toEqual(['- 要点一'])
  })

  it('非数组 / null / 非对象块一律安全降级，不抛异常', () => {
    expect(normalizeDetails(undefined)).toEqual([])
    expect(normalizeDetails(null)).toEqual([])
    expect(normalizeDetails('bad' as unknown as AgentAnswerDetail[])).toEqual([])
    expect(normalizeDetails([null, 'bad', {}, 42] as unknown as AgentAnswerDetail[])).toEqual([])
  })

  it('只有标题没有内容的空块被丢弃，块数与行数有上限', () => {
    const blocks: AgentAnswerDetail[] = [
      { title: '只有标题' },
      ...Array.from({ length: 8 }, (_, i) => ({
        title: `块${i}`,
        head: ['列'],
        rows: Array.from({ length: 40 }, (_, r) => [`${r}`])
      }))
    ]

    const result: AnsDetail[] = normalizeDetails(blocks)

    expect(result).toHaveLength(4)
    // 第一块只有标题被丢弃，所以留下的都是带表格的块
    expect(result.every((d) => d.head.length > 0)).toBe(true)
    expect(result[0].rows).toHaveLength(30)
  })

  it('数值列索引越界时过滤掉，不产生渲染异常', () => {
    const result = normalizeDetails([
      { head: ['口径', '数值'], rows: [['总量', '53631']], num: [0, 1, 5, -1, 1.5] }
    ])

    expect(result[0].num).toEqual([0, 1])
  })
})
