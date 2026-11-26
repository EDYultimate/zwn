import { afterEach, describe, expect, test, vi } from 'vitest'
import { askAgentStream } from '@/api/agent/agentChat'

/**
 * 前端 SSE 客户端：按缓冲拆行是重点——上游 chunk 边界可能落在一条 data 帧中间，
 * 逐块直读会解析出半截 JSON，表现为回答丢字。
 */
describe('askAgentStream', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function mockStream(chunks: string[], ok = true, status = 200) {
    const encoder = new TextEncoder()
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        chunks.forEach((chunk) => controller.enqueue(encoder.encode(chunk)))
        controller.close()
      }
    })
    const response = {
      ok,
      status,
      body: ok ? body : null,
      json: async () => ({ message: '接口不存在' })
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))
  }

  const doneFrame = (answer: string) =>
    `data: {"type":"done","data":{"sessionId":"s1","answer":"${answer}","events":[]}}\n\n`

  test('跨 chunk 边界拆行，stage/delta/done 各自派发', async () => {
    // 故意把一条 data 帧从中间劈开
    mockStream([
      ': ping\n\n',
      'data: {"type":"stage","text":"正在查询…"}\n\n',
      'data: {"type":"delta","text":"许可水量 "}\n',
      '\n',
      'data: {"type":"delta","text":"53631 万m³"}\n\n',
      doneFrame('许可水量 53631 万m³'),
      'data: [DONE]\n\n'
    ])
    const stages: string[] = []
    const deltas: string[] = []

    const result = await askAgentStream(
      { question: '许可水量多少' },
      { onStage: (s) => stages.push(s), onDelta: (d) => deltas.push(d) }
    )

    expect(stages).toEqual(['正在查询…'])
    expect(deltas.join('')).toBe('许可水量 53631 万m³')
    expect(result.answer).toBe('许可水量 53631 万m³')
    expect(result.sessionId).toBe('s1')
  })

  test('兼容 data: 无空格前缀，[DONE] 之后的帧不再处理', async () => {
    mockStream([
      'data:{"type":"delta","text":"甲"}\n\n',
      doneFrame('甲'),
      'data: [DONE]\n\n',
      'data:{"type":"delta","text":"乙"}\n\n'
    ])

    const deltas: string[] = []
    const result = await askAgentStream({ question: 'x' }, { onDelta: (d) => deltas.push(d) })

    expect(deltas).toEqual(['甲'])
    expect(result.answer).toBe('甲')
  })

  test('流中 error 帧转为拒绝，且不回退到非流式接口', async () => {
    mockStream(['data:{"type":"error","message":"模型上下文超限"}\n\n'])

    await expect(askAgentStream({ question: 'x' })).rejects.toThrow('模型上下文超限')
  })

  test('流式端点 404：错误标记 fallbackable，供上层回退', async () => {
    mockStream([], false, 404)

    await expect(askAgentStream({ question: 'x' })).rejects.toMatchObject({
      message: '接口不存在',
      fallbackable: true
    })
  })

  test('没有 done 帧就结束：明确报错，不返回半句回答', async () => {
    mockStream(['data: {"type":"delta","text":"半句"}\n\n', 'data: [DONE]\n\n'])

    await expect(askAgentStream({ question: 'x' })).rejects.toThrow('流式回答未正常结束')
  })
})
