import { describe, expect, test } from 'vitest'
import {
  createMessageSlots,
  findSlotAnchors,
  GENERIC_WAITING_TEXT,
  isSupplementStage,
  MIN_TABLE_LOADING_MS,
  resolveSlotState,
  resolveSlotViews,
  slotRefLabel,
  splitAnswerText,
  tableLoadingDelay,
  TABLE_LOADING_TEXT,
  waitingText,
  type SlotKind
} from '@/agent/answerSlots'
import type { AgentUiEvent } from '@/api/agent/agentUiCapability'
import type { AgentKbRef } from '@/api/agent/agentChat'

/**
 * 流式附加内容槽位。锁定的核心契约：
 * 1. 流式期间必须有 waiting（不能等 done 才有组件）；
 * 2. done 后按真实内容判 ready / empty，失败恒为 error；
 * 3. 正文分段不能丢字、不能把 JSON 标记 / 表格数据漏进正文；
 * 4. 旧回答（无 slots）渲染结果与改造前一致。
 */
describe('answerSlots · 状态机', () => {
  test('新建的消息处于等待态，done 后按有无内容分流', () => {
    const slots = createMessageSlots()
    expect(slots).toEqual({ streaming: true, hint: '', error: '', tableLoading: false })
    expect(resolveSlotState(slots, true)).toBe('waiting')
    expect(resolveSlotState(slots, false)).toBe('waiting')

    slots.streaming = false
    expect(resolveSlotState(slots, true)).toBe('ready')
    expect(resolveSlotState(slots, false)).toBe('empty')
  })

  test('加载异常优先于一切状态，且历史消息不受影响', () => {
    const slots = createMessageSlots()
    slots.error = '流式回答未正常结束，请重试'
    expect(resolveSlotState(slots, true)).toBe('error')
    expect(resolveSlotState(slots, false)).toBe('error')
    // 欢迎语 / 内置示例不带 slots：有内容直接 ready，没内容 empty，绝不出现骨架
    expect(resolveSlotState(undefined, true)).toBe('ready')
    expect(resolveSlotState(undefined, false)).toBe('empty')
  })

  test('等待角标用笼统措辞，不承诺一定有表格 / 入口；就绪与失败才写清品类', () => {
    const table = slotRefLabel('table', 'waiting')
    expect(table).toBe(slotRefLabel('actions', 'waiting'))
    expect(table).toContain('整理中')
    expect(table).not.toMatch(/表格|入口|准备中/)
    expect(slotRefLabel('table', 'ready')).toContain('明细')
    expect(slotRefLabel('table', 'error')).toContain('失败')
    expect(slotRefLabel('table', 'empty')).toBe('')
    expect(slotRefLabel('actions', 'empty')).toBe('')
  })
})

describe('answerSlots · 统一等待描述', () => {
  test('默认文案与紧凑文案都不出现「表格 / 入口 / 准备中」', () => {
    expect(GENERIC_WAITING_TEXT).not.toMatch(/表格|入口|准备中/)
    expect(waitingText()).not.toMatch(/表格|入口|准备中/)
    expect(waitingText({ elapsed: 20 })).not.toMatch(/表格|入口|准备中/)
  })

  test('阶段进度优先，等太久补上秒数（超时文案优先于 hint）', () => {
    expect(waitingText({ hint: '正在查询相关数据…' })).toBe('正在查询相关数据…')
    expect(waitingText({ elapsed: 7 })).toBe('回答生成中…')
    expect(waitingText({ hint: '任意阶段', elapsed: 9 })).toContain('已等待 9s')
  })

  test('纯文字回答流式期间整条消息只留一处笼统等待，两槽位都不铺骨架', () => {
    const views = resolveSlotViews(
      createMessageSlots(),
      '取水许可审批主要经历申请受理、技术审查、审批发证等环节。',
      { table: false, actions: false }
    )
    expect(views.table).toMatchObject({ state: 'waiting', compact: true, showStatus: true })
    expect(views.actions).toMatchObject({ state: 'waiting', compact: true, showStatus: false })
  })

  test('正文提到「见下表」时只展开表格骨架，入口槽位静默', () => {
    const views = resolveSlotViews(createMessageSlots(), '分项数值见下表。', {
      table: false,
      actions: false
    })
    expect(views.table).toMatchObject({ compact: false, showStatus: true })
    expect(views.actions).toMatchObject({ compact: true, showStatus: false })
  })

  test('只提到「点按钮」时由入口槽位承担唯一状态条', () => {
    const views = resolveSlotViews(createMessageSlots(), '也可点击按钮跳转查看。', {
      table: false,
      actions: false
    })
    expect(views.table.showStatus).toBe(false)
    expect(views.actions).toMatchObject({ compact: false, showStatus: true })
  })

  test('两类都提到时状态条仍只出现一次', () => {
    const views = resolveSlotViews(createMessageSlots(), '明细见下表，也可点击按钮跳转。', {
      table: false,
      actions: false
    })
    expect([views.table.showStatus, views.actions.showStatus].filter(Boolean)).toHaveLength(1)
    expect(views.table.compact).toBe(false)
    expect(views.actions.compact).toBe(false)
  })

  test('强制表格加载态：正文没有锚点也展开表格骨架，且状态条只出现一次', () => {
    const slots = createMessageSlots()
    const loading = resolveSlotViews(slots, '', {
      table: false,
      actions: false,
      forceTableSkeleton: true
    })
    expect(loading.table).toMatchObject({ state: 'waiting', compact: false, showStatus: true })
    expect(loading.actions).toMatchObject({ state: 'waiting', compact: true, showStatus: false })
    expect(TABLE_LOADING_TEXT).toContain('表格')

    // done 帧到达后强制失效，仍按真实内容分流，不残留骨架
    slots.streaming = false
    const done = resolveSlotViews(slots, '', {
      table: true,
      actions: false,
      forceTableSkeleton: true
    })
    expect(done.table).toMatchObject({ state: 'ready', compact: false, showStatus: false })
  })

  test('done 后按真实内容分流，等待提示全部消失', () => {
    const slots = createMessageSlots()
    slots.streaming = false
    const views = resolveSlotViews(slots, '分项见下表', { table: true, actions: false })
    expect(views.table).toMatchObject({ state: 'ready', compact: false, showStatus: false })
    expect(views.actions).toMatchObject({ state: 'empty', showStatus: false })
  })

  test('失败只报一次，重试按钮也只给一处', () => {
    const slots = createMessageSlots()
    slots.error = '问答服务暂不可用'
    const views = resolveSlotViews(slots, '', { table: false, actions: false })
    expect(views.table).toMatchObject({ state: 'error', showStatus: true, showRetry: true })
    expect(views.actions).toMatchObject({ state: 'error', showStatus: false, showRetry: false })
  })

  test('历史 / 示例消息没有 slots，不出现任何等待态', () => {
    const views = resolveSlotViews(undefined, '分项见下表', { table: true, actions: false })
    expect(views.table).toMatchObject({ state: 'ready', showStatus: false })
    expect(views.actions).toMatchObject({ state: 'empty', showStatus: false })
  })
})

describe('answerSlots · 补充内容 stage 识别', () => {
  test('「正文已完成，正在整理补充内容…」触发表格加载态', () => {
    expect(isSupplementStage('正文已完成，正在整理补充内容…')).toBe(true)
  })

  test('其余阶段不触发表格骨架（纯文字回答一上来不摆骨架）', () => {
    const otherStages = [
      '正在理解问题…',
      '正在结合数据整理回答…',
      '正在检索知识库文档…',
      '正在查询「queryWaterUse」相关数据…',
      '正在生成回答…'
    ]
    for (const stage of otherStages) {
      expect(isSupplementStage(stage)).toBe(false)
    }
    expect(isSupplementStage('')).toBe(false)
  })
})

describe('answerSlots · 表格骨架最短展示', () => {
  test('有表格且 done 来得太快时补足剩余时长，让骨架先上屏', () => {
    expect(tableLoadingDelay(0, true)).toBe(MIN_TABLE_LOADING_MS)
    expect(tableLoadingDelay(120, true)).toBe(MIN_TABLE_LOADING_MS - 120)
  })

  test('等够了、或本轮没有表格时不额外延迟', () => {
    expect(tableLoadingDelay(MIN_TABLE_LOADING_MS + 500, true)).toBe(0)
    expect(tableLoadingDelay(0, false)).toBe(0)
  })
})

describe('answerSlots · 引用锚点（决定紧凑待命 / 展开骨架）', () => {
  test('每种槽位取最早一处引用短语的结束位置', () => {
    const text = '分项见下表，另有汇总表格，也可点按钮跳转'
    const anchors = findSlotAnchors(text)
    expect(anchors.table).toBe('分项见下表'.length)
    expect(anchors.actions).toBe(text.indexOf('按钮') + '按钮'.length)
  })

  test('流式只吐了半个短语时不误判，等写全才展开骨架', () => {
    expect(findSlotAnchors('请看下方表')).toEqual({})
    expect(findSlotAnchors('分项见下表')).toEqual({ table: '分项见下表'.length })
    expect(findSlotAnchors('')).toEqual({})
  })

  test('纯文字回答没有任何引用锚点，不会先铺开大骨架', () => {
    expect(findSlotAnchors('取水许可审批主要经历申请受理、技术审查、审批发证等环节。')).toEqual({})
  })
})

describe('answerSlots · 正文分段', () => {
  const ev: AgentUiEvent = {
    type: 'SPOTLIGHT',
    target: 'tile.xuKeShuiLiang',
    label: '高亮许可水量',
    cite: 1
  }

  /** 只取普通文本片段，用于校验「正文一字不丢」 */
  const plain = (text: string, events?: AgentUiEvent[], preview = false) =>
    splitAnswerText(text, events, preview)
      .filter((s) => !s.cite && !s.pendingCite && !s.slot)
      .map((s) => s.text)
      .join('')

  test('非预览模式下与旧的 splitCitations 行为一致：无事件的标记被静默丢弃', () => {
    const text = '许可水量 [[7]]53631 万m³。'
    const segs = splitAnswerText(text, [ev])
    expect(segs.some((s) => s.cite || s.pendingCite)).toBe(false)
    expect(plain(text, [ev])).toBe('许可水量 53631 万m³。')
  })

  test('流式预览：refs 未到位的 [[n]] 显示待到位角标，不让引用位置空着', () => {
    const text = '许可水量 [[1]]53631 万m³。'
    const segs = splitAnswerText(text, [], true)
    expect(segs.filter((s) => s.pendingCite)).toHaveLength(1)
    expect(plain(text, [], true)).toBe('许可水量 53631 万m³。')
    // done 后事件到齐，同一段正文变成可点击角标
    expect(splitAnswerText(text, [ev], true).filter((s) => s.cite)).toHaveLength(1)
  })

  test('正文提到「见下表」时，在短语后插入表格引用提示，且正文原样保留', () => {
    const text = '2026 年许可水量 53631 万m³，分项数值见下表。\\n口径：取水许可批复量。'
    const segs = splitAnswerText(text, [], true)
    const slots = segs.filter((s) => s.slot).map((s) => s.slot as SlotKind)
    expect(slots).toEqual(['table'])
    // 引用提示的位置在「见下表」之后
    const at = text.indexOf('见下表') + '见下表'.length
    const idx = segs.findIndex((s) => s.slot)
    expect(
      segs
        .slice(0, idx)
        .map((s) => s.text)
        .join('').length
    ).toBe(at)
    expect(plain(text, [], true)).toBe(text)
  })

  test('表格与跳转入口各只插一枚提示，短语本身仍显示在正文里', () => {
    const text = '详细数据见下表，也可点击下方按钮跳转。另有汇总表格。'
    const segs = splitAnswerText(text, [], true)
    expect(segs.filter((s) => s.slot === 'table')).toHaveLength(1)
    expect(segs.filter((s) => s.slot === 'actions')).toHaveLength(1)
    expect(plain(text, [], true)).toBe(text)
  })

  test('同一句里既有引用角标又有表格提示时，两者都渲染且正文不丢', () => {
    const text = '许可水量 [[1]]53631 万m³，分项见下表。'
    const segs = splitAnswerText(text, [ev], true)
    expect(segs.filter((s) => s.cite)).toHaveLength(1)
    expect(segs.filter((s) => s.slot === 'table')).toHaveLength(1)
    expect(plain(text, [ev], true)).toBe('许可水量 53631 万m³，分项见下表。')
  })

  test('欢迎语 / 内置示例关掉引用提示后，正文按原样整段返回', () => {
    const text = '分项见下表，也可点按钮跳转。'
    const segs = splitAnswerText(text, [], false, false)
    expect(segs).toHaveLength(1)
    expect(segs[0].text).toBe(text)
    expect(segs[0].slot).toBeUndefined()
  })

  test('空正文不报错', () => {
    expect(splitAnswerText('', [], true)).toEqual([])
  })

  test('文档角标显示来源序号：同文档的不同 chunk 编号归并成同一个数字', () => {
    const kbRefs: AgentKbRef[] = [
      { cite: 11, docId: 'd1', fileName: '预案.pdf' },
      { cite: 14, docId: 'd1', fileName: '预案.pdf' }
    ]
    const numbers = new Map([
      [11, 1],
      [14, 1]
    ])
    const segs = splitAnswerText('A [[11]]B [[14]]', [], false, true, kbRefs, numbers)
    expect(segs.filter((s) => s.kbRef).map((s) => s.kbNo)).toEqual([1, 1])
  })

  test('不传序号映射时退回原编号，旧调用方行为不变', () => {
    const kbRefs: AgentKbRef[] = [{ cite: 11, docId: 'd1', fileName: '预案.pdf' }]
    const segs = splitAnswerText('依据 [[11]]。', [], false, true, kbRefs)
    expect(segs.filter((s) => s.kbRef).map((s) => s.kbNo)).toEqual([11])
  })
})
