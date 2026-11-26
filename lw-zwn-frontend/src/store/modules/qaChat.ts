import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { AgentChatMessage } from '@/store/modules/agentAgent'

/**
 * 智能问答会话仓库（按会话 key 分区）。
 *
 * <p>为什么放在 pinia 而不是组件里：问答页是路由级组件，切走即卸载，
 * 组件内 ref 会连同消息、sessionId 一起销毁，回来就只能从欢迎语重新开始。
 * 会话状态挂到应用级 store 后，路由切换不丢；多条会话（通用问答 / 各业务智能体）
 * 按 key 各自独立，互不串台，也各自持有 typing，不会互相锁住输入框。
 *
 * <p>这里只做内存态；跨刷新的持久化由 useAgentChat 写 sessionStorage 快照负责。
 */
export interface QaChatSessionState {
  messages: AgentChatMessage[]
  sessionId: string
  typing: boolean
  streaming: boolean
  /** 输入框草稿：切路由回来时连没发出去的问题一起保留 */
  input: string
}

function createSession(): QaChatSessionState {
  return { messages: [], sessionId: '', typing: false, streaming: false, input: '' }
}

export const qaChatStore = defineStore('qaChat', () => {
  const sessions = ref<Record<string, QaChatSessionState>>({})

  /** 取（不存在则创建）指定会话；返回的是响应式对象，直接读写即可 */
  function ensure(key: string): QaChatSessionState {
    const existing = sessions.value[key]
    if (existing) {
      return existing
    }
    sessions.value[key] = createSession()
    return sessions.value[key]
  }

  /** 重置某个会话（清空对话时用） */
  function reset(key: string) {
    sessions.value[key] = createSession()
  }

  return { sessions, ensure, reset }
})
