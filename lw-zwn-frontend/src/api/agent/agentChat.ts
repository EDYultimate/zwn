import env from '@/env'
import request, { authHeaders } from '@/utils/request'
import type { AgentUiEvent } from '@/api/agent/agentUiCapability'

/** 回答附带的按钮（当前仅页面跳转） */
export interface AgentAction {
  /** 动作类型，目前仅 JUMP */
  type: string
  /** 按钮文案 */
  label: string
  /** 前端路由路径，如 /waterAssign/haihe */
  routePath: string
  /** 跳转携带的 query 参数 */
  query?: Record<string, string | number>
  /** 按钮所需功能权限 URL，用于与 myPermission 求交集 */
  requiredActUrl?: string
}

/**
 * 回答附带的结构化明细块。
 * 正文 answer 给结论与口径，逐项数值在这里由前端渲染成表格 / 要点；后端已做限额与列数对齐。
 */
export interface AgentAnswerDetail {
  /** 小节标题 */
  title?: string
  /** 表头；为空表示这个块没有表格 */
  head?: string[]
  /** 表格行，列数与 head 一致 */
  rows?: string[][]
  /** 要点列表 */
  points?: string[]
  /** 数值列索引（从 0 开始），前端右对齐加粗 */
  num?: number[]
  /** 表下注释：口径、单位、未展开条数等 */
  note?: string
}

/**
 * 知识库引用：正文里 [[n]]（n ≥ 11）指向的文档片段与原文定位。
 *
 * <p>与 {@link AgentUiEvent} 共用同一个编号空间：1~9 是页面动作，11 起是文档依据。
 * 定位字段在入库时就写进了 Qdrant payload，前端点角标直接打开原文，不回查业务库。
 */
export interface AgentKbRef {
  /** 行内引用编号，对应 answer 里的 [[n]] */
  cite?: number
  chunkId?: string
  collection?: string
  docId?: string
  docType?: string
  title?: string
  fileName?: string
  /** 原文件路径，用于打开原文 */
  filePath?: string
  /** 章节路径，如「1 总则 > 1.1 编制目的」 */
  sectionPath?: string
  /** 原文页码（PDF 等按页解析的来源才有） */
  pageNo?: number
  elemType?: string
  snippet?: string
  score?: number
  embedderId?: string
}

/** 智能问答返回结果 */
export interface AgentChatResult {
  sessionId: string
  answer: string
  actions?: AgentAction[]
  /** UI 引导事件（打开弹框/高亮/命令/跳转），后端已按能力声明白名单校验 */
  events?: AgentUiEvent[]
  /** 知识库引用（文档原文定位），知识侧关闭时为空数组 */
  kbRefs?: AgentKbRef[]
  /** 结构化明细（表格 / 要点）；流式期间为空，done 帧才下发 */
  details?: AgentAnswerDetail[]
  usedTools?: string[]
  costMs?: number
  /**
   * 服务端能力声明缓存为空：页面引导能力没同步到后端。
   * 前端收到后应强制重报一次并重试提问，否则模型会以为系统没有这些页面。
   */
  capabilitiesStale?: boolean
}

/** 会话消息 */
export interface AgentMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
}

/** 提问（带多轮上下文） */
export function askAgent(payload: { sessionId?: string; question: string; module?: string }) {
  return request({
    url: '/api/agent/chat',
    method: 'POST',
    data: payload
  })
}

/** 流式事件回调 */
export interface AgentStreamHandlers {
  /** 阶段进度：工具轮取数、模型整理回答时推送，让用户知道系统在动 */
  onStage?: (text: string) => void
  /** 最终回答的逐字增量 */
  onDelta?: (text: string) => void
  /** 取消信号（切页 / 主动停止时中断流） */
  signal?: AbortSignal
}

/** 标记「流式端点本身不可用」，允许上层回退到非流式接口，而不是把整次问答判为失败 */
function fallbackableError(message: string, status?: number): Error & { fallbackable?: boolean } {
  const error = new Error(message) as Error & { fallbackable?: boolean }
  error.fallbackable = status === undefined || [404, 405, 406, 501, 502, 503].includes(status)
  return error
}

/**
 * SSE 流式提问。
 *
 * <p>axios 会把响应一次性读进内存，拿不到 ReadableStream，所以这里用原生 fetch。
 * 解析按缓冲拆行（不逐块直读），兼容 {@code data:} 与 {@code data: }，跳过 {@code :} 心跳注释，
 * 收到 {@code data: [DONE]} 结束。帧结构：
 * <pre>
 * data: {"type":"stage","text":"正在查询…"}
 * data: {"type":"delta","text":"许可"}
 * data: {"type":"done","data":{...AgentChatResult}}
 * data: {"type":"error","message":"…"}
 * </pre>
 *
 * @returns done 帧里的权威结果（含 sessionId / events / capabilitiesStale）
 */
export async function askAgentStream(
  payload: { sessionId?: string; question: string; module?: string },
  handlers: AgentStreamHandlers = {}
): Promise<AgentChatResult> {
  let response: Response
  try {
    response = await fetch(`${env.API_BASE_URL}/api/agent/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        'X-Requested-With': 'XMLHttpRequest',
        ...authHeaders()
      },
      body: JSON.stringify(payload),
      signal: handlers.signal
    })
  } catch (e: any) {
    // 网络层就没连上：此刻还没产生任何输出，回退不会重复作答
    throw fallbackableError(`问答服务不可达：${e?.message ?? ''}`)
  }

  if (!response.ok) {
    let message = `问答服务返回 ${response.status}`
    try {
      const body = await response.json()
      message = body?.message || message
    } catch {
      // 非 JSON 错误体，保留状态码提示
    }
    throw fallbackableError(message, response.status)
  }
  if (!response.body) {
    throw fallbackableError('当前浏览器不支持流式响应')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''
  // 用对象承载跨回调的状态：直接声明 let 变量时 TS 的控制流分析看不到回调里的赋值，
  // 会把 result 窄化成恒为 null 的 never。
  const state: { result: AgentChatResult | null; streamDone: boolean } = {
    result: null,
    streamDone: false
  }

  const handleLine = (rawLine: string) => {
    const line = rawLine.replace(/\r$/, '')
    if (!line || line.startsWith(':') || !line.startsWith('data:')) {
      return
    }
    let payloadText = line.slice('data:'.length)
    if (payloadText.startsWith(' ')) {
      payloadText = payloadText.slice(1)
    }
    payloadText = payloadText.trim()
    if (!payloadText) {
      return
    }
    if (payloadText === '[DONE]') {
      state.streamDone = true
      return
    }
    let frame: any
    try {
      frame = JSON.parse(payloadText)
    } catch {
      return // 网关插入的非 JSON 调试行，忽略
    }
    switch (frame.type) {
      case 'stage':
        handlers.onStage?.(String(frame.text ?? ''))
        break
      case 'delta':
        handlers.onDelta?.(String(frame.text ?? ''))
        break
      case 'done':
        state.result = frame.data as AgentChatResult
        break
      case 'error':
        throw new Error(String(frame.message ?? '问答服务异常'))
      default:
        break
    }
  }

  try {
    while (!state.streamDone) {
      const { value, done } = await reader.read()
      if (done) {
        break
      }
      buffer += decoder.decode(value, { stream: true })
      let index: number
      while ((index = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, index)
        buffer = buffer.slice(index + 1)
        handleLine(line)
      }
    }
    if (buffer.trim()) {
      handleLine(buffer.trim())
    }
  } finally {
    reader.releaseLock()
  }

  if (!state.result?.answer) {
    throw new Error('流式回答未正常结束，请重试')
  }
  return state.result
}

/**
 * 提问入口（推荐）：优先流式；仅当后端没有流式端点 / 网关不支持时回退到旧的阻塞接口。
 * 已经收到过帧之后的失败不会回退，避免同一问题被模型答两遍。
 */
export async function askAgentAuto(
  payload: { sessionId?: string; question: string; module?: string },
  handlers: AgentStreamHandlers = {}
): Promise<AgentChatResult> {
  try {
    return await askAgentStream(payload, handlers)
  } catch (e: any) {
    if (!e?.fallbackable) {
      throw e
    }
    console.warn('[agent] 流式端点不可用，回退到非流式接口', e)
    const res: any = await askAgent(payload)
    const data = res?.data as AgentChatResult | undefined
    if (!data?.answer) {
      throw new Error(res?.message || '未获取到回答')
    }
    return data
  }
}

/** 清空会话记忆（前端「清空对话」按钮调用） */
export function resetAgentChat(sessionId: string) {
  return request({
    url: '/api/agent/chat/reset',
    method: 'POST',
    data: { sessionId }
  })
}

/** 查询会话历史 */
export function getAgentHistory(sessionId: string) {
  return request({
    url: '/api/agent/chat/history',
    method: 'GET',
    params: { sessionId }
  })
}
