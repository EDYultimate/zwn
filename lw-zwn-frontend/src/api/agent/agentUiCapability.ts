import request from '@/utils/request'

/**
 * 智能问答「页面能力声明」与 UI 事件的前端类型定义。
 *
 * 与后端 cn.lonwin.module.agent.uicapability.UiPageCapability / AgentUiEventVO 一一对应，
 * 两端字段变化需同步。
 */

/** UI 事件类型 */
export type AgentEventType = 'NAVIGATE' | 'DIALOG' | 'SPOTLIGHT' | 'COMMAND'

/** 回答附带的 UI 引导事件（后端已按能力声明白名单校验） */
export interface AgentUiEvent {
  type: AgentEventType
  /** 目标语义键：路由 / 弹框名 / 锚点 / 命令名 */
  target: string
  /** 按钮文案（DIALOG/NAVIGATE 渲染成按钮时显示） */
  label?: string
  /** 事件参数 */
  args?: Record<string, any>
  /**
   * 行内引用编号：正文里第 n 个 `[[n]]` 标记对应的就是这个事件。
   * 为空表示该事件没有被正文引用，按普通按钮渲染。
   */
  cite?: number
}

/** 弹框/命令参数定义 */
export interface AgentParamDef {
  name: string
  desc: string
  required?: boolean
  type?: 'string' | 'number' | 'date'
  enums?: string[]
}

/** 可高亮元素 */
export interface AgentAnchorDef {
  /** 语义键，对应模板中的 data-anchor 属性值 */
  target: string
  /** 给模型看的说明：这是什么、什么场景下建议高亮 */
  desc: string
}

/** 可打开弹框 */
export interface AgentDialogDef {
  target: string
  desc: string
  params?: AgentParamDef[]
  requiredActUrl?: string
}

/** 可触发的页面行为 */
export interface AgentCommandDef {
  target: string
  desc: string
  params?: AgentParamDef[]
  requiredActUrl?: string
}

/** 一个页面对智能体开放的能力声明 */
export interface AgentPageCapabilities {
  /**
   * 业务模块标识（如 water-cert）：与后端工具 @AgentTool.module 对齐。
   * 后端按「当前模块」裁剪页面能力清单时用它过滤；不填 = 不属于任何业务模块，
   * 仅通用问答（全量清单）时可见。
   */
  module?: string
  /** 页面路由，模型发 NAVIGATE 指令时使用 */
  route: string
  /** 页面标题（进提示词） */
  title: string
  /** 本页菜单对应的功能权限 URL */
  requiredActUrl: string
  /** 声明内容版本：内容变了才重新上报 */
  version: string
  anchors?: AgentAnchorDef[]
  dialogs?: AgentDialogDef[]
  commands?: AgentCommandDef[]
}

/** 上报能力声明（登录后及版本变化时调用，按 client + route 整体替换、幂等） */
export function reportAgentCapabilities(payload: {
  client: string
  /** true = 全量上报（未出现的页面视为下线）；缺省 = 只覆盖本次出现的 route */
  full?: boolean
  pages: AgentPageCapabilities[]
}) {
  return request({
    url: '/api/agent/ui-capabilities',
    method: 'POST',
    data: payload
  })
}

/** 查询后端当前缓存的能力声明（排查用） */
export function listAgentCapabilities() {
  return request({
    url: '/api/agent/ui-capabilities',
    method: 'GET'
  })
}

/** 能力清单指纹：与服务端缓存做一致性比对，一致就不必重发全量声明 */
export interface AgentCapabilityFingerprint {
  client?: string
  pageCount: number
  /** route@version 摘要，算法见 src/agent/capabilityRegistry.ts 的 localCapabilityDigest */
  digest: string
  updatedAt?: number
}

/** 查询后端当前能力清单的指纹（启动 / 定时同步用，几十字节） */
export function getAgentCapabilityFingerprint(client = 'web') {
  return request({
    url: '/api/agent/ui-capabilities/fingerprint',
    method: 'GET',
    params: { client }
  })
}

// ==================== 在线配置页（人工覆盖，改动落库） ====================

/** 配置页返回的单页配置：代码默认值 + 当前生效值 + 是否被人工改过 */
export interface UiPageCapabilityConfig {
  client: string
  route: string
  /** 代码默认值：前端代码声明（启动全量上报得到的基线） */
  baseline: AgentPageCapabilities | null
  /** 当前生效值：提示词与事件白名单实际使用 */
  effective: AgentPageCapabilities | null
  overridden: boolean
  updatedBy?: string
  updatedAt?: string
}

/** 配置状态：存储方式、人工覆盖数量、页面基线数量 */
export interface AgentConfigStatus {
  toolStore: string
  uiStore: string
  toolOverrides: number
  uiOverrides: number
  uiPages: number
}

/** 一键还原的结果 */
export interface AgentConfigRestoreResult {
  toolOverrides: number
  toolVersion: number
  uiOverrides: number
  uiPages: number
}

/** 配置页清单 */
export function listUiCapabilityConfigs() {
  return request({
    url: '/api/agent/ui-capabilities/admin',
    method: 'GET'
  })
}

/** 保存某页面的人工配置（只改文案；契约字段由后端按代码基线强制校正） */
export function saveUiCapabilityOverride(page: AgentPageCapabilities, client = 'web') {
  return request({
    url: '/api/agent/ui-capabilities/admin',
    method: 'PUT',
    params: { client },
    data: page
  })
}

/** 恢复单页为代码默认 */
export function removeUiCapabilityOverride(route: string, client = 'web') {
  return request({
    url: '/api/agent/ui-capabilities/admin',
    method: 'DELETE',
    params: { route, client }
  })
}

/** 查询配置状态（两个配置页共用） */
export function getAgentConfigStatus() {
  return request({ url: '/api/agent/config/status', method: 'GET' })
}

/**
 * 一键还原：清空工具元数据与页面能力的全部人工配置，运行时回到代码默认值。
 * 两个配置页共用这个按钮；调用方随后应重新加载列表（页面能力页还会重报一次代码声明）。
 */
export function restoreAgentConfig() {
  return request({ url: '/api/agent/config/restore', method: 'POST' })
}
