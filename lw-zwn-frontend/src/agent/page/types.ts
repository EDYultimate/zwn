import type {
  AgentAnchorDef,
  AgentCommandDef,
  AgentDialogDef,
  AgentPageCapabilities
} from '@/api/agent/agentUiCapability'

import { pageMeta, type PageKey } from '@/agent/generated/pageMeta.generated'
import type { AgentActionsRuntime } from './actions'
import { fnv1a32 } from './hash'

/**
 * 页面接入智能体的唯一契约。
 *
 * <p>路由不再写在能力文件里：pageKey 指向路由记录的 name，
 * route / title / requiredActUrl / version 全部由 `pageMeta`（从路由表生成）派生。
 * 动作也不再手写 handler：由 `defineAgentActions` 一张表生成声明 + 转发 + 契约类型。
 */

/** 单个 UI 事件的处理器；args 来自模型输出的 `args`，可能是空对象 */
export type AgentActionHandler = (args: Record<string, any>) => void

/**
 * adapter 能看到的页面上下文。
 *
 * <p>不直接把页面的 ref / 组件实例交给 adapter，避免业务页内部实现泄漏到公共层：
 * adapter 只按名字调用页面自愿暴露的能力，缺方法时给出明确报错而不是静默失败。
 */
export interface AgentPageContext {
  /** 调用 `exposeAgentContext` 暴露的同名方法 */
  call<T = unknown>(name: string, ...args: any[]): T | undefined
  /** 读取暴露的值；ref / computed 会自动解包，函数原样返回 */
  get<T = unknown>(name: string): T | undefined
  /** 页面是否暴露了某个能力（用于可选能力分支） */
  has(name: string): boolean
  /** 约定的 `ready` 能力：不提供时恒为 true */
  isReady(): boolean
}

/** 业务页通过 `exposeAgentContext` 交出的原始对象，值可以是值 / ref / computed / 函数 */
export type AgentPageContextSource = Record<string, any>

/** 运行期使用的页面定义（类型已擦除，供静态入口收集与插件调度） */
export interface AgentPageDefinition {
  /** 稳定页面标识（路由 name）；旧式定义没有该字段 */
  pageKey?: PageKey
  capabilities: AgentPageCapabilities
  createHandlers: (ctx: AgentPageContext) => Record<string, AgentActionHandler>
  /** 动作表：启动自检用它对账「页面是否暴露了全部方法」 */
  actions?: AgentActionsRuntime
  /** 可选：自定义「数据已就绪」判定；默认取上下文里的 `ready` 能力 */
  ready?: (ctx: AgentPageContext) => boolean
}

/**
 * 新版配置：只写 pageKey + 锚点 + 动作表。
 * 路由路径、页面标题、权限 URL、版本号全部自动派生。
 */
export interface AgentPageConfig {
  /** 必须等于路由记录里的 name，且已由 gen:agent 收录；写错编译失败 */
  pageKey: PageKey
  /**
   * 业务模块标识（如 water-cert）：与后端工具 @AgentTool.module 对齐。
   * 后端按「当前模块」裁剪页面能力清单时用它过滤；不填 = 不属于任何业务模块，
   * 仅通用问答（全量清单）时可见。
   */
  module?: string
  /** 覆盖自动派生的标题（一般不需要） */
  title?: string
  /** 覆盖自动派生的内容版本（一般不需要） */
  version?: string
  anchors?: readonly AgentAnchorDef[]
  actions?: AgentActionsRuntime
  ready?: (ctx: AgentPageContext) => boolean
}

/** 旧版配置：保留是为了兼容 `src/test/agentPage.test.ts` 等显式声明的调用方 */
type CapabilityInput = Omit<AgentPageCapabilities, 'anchors' | 'dialogs' | 'commands'> & {
  anchors?: readonly AgentAnchorDef[]
  dialogs?: readonly AgentDialogDef[]
  commands?: readonly AgentCommandDef[]
}
type TargetFrom<T> = T extends { target: infer K extends string } ? K : never
type ActionTargets<C extends CapabilityInput> =
  | TargetFrom<NonNullable<C['dialogs']>[number]>
  | TargetFrom<NonNullable<C['commands']>[number]>

export interface AgentPageLegacyConfig<C extends CapabilityInput> {
  capabilities: C
  createHandlers: (ctx: AgentPageContext) => Record<ActionTargets<C>, AgentActionHandler>
  ready?: (ctx: AgentPageContext) => boolean
}

/** 由「能力面内容」算版本号：改 desc / 参数 / 路由后无需手动 +1，指纹自动变化并触发重报 */
function autoVersion(pageKey: string, caps: Omit<AgentPageCapabilities, 'version'>): string {
  return fnv1a32(
    JSON.stringify({
      pageKey,
      module: caps.module,
      route: caps.route,
      title: caps.title,
      requiredActUrl: caps.requiredActUrl,
      anchors: caps.anchors ?? [],
      dialogs: caps.dialogs ?? [],
      commands: caps.commands ?? []
    })
  )
}

export function defineAgentPage(config: AgentPageConfig): AgentPageDefinition
export function defineAgentPage<const C extends CapabilityInput>(
  config: AgentPageLegacyConfig<C>
): AgentPageDefinition
// 实现签名放宽：旧式 const 泛型的 handler 键约束只在 overload 上生效，
// 若在这里收窄成 CapabilityInput，TS 会判定 overload 与实现签名不兼容。
export function defineAgentPage(config: any): AgentPageDefinition {
  // 旧式：调用方自己写完整 capabilities + handler，原样保留
  if ('capabilities' in config) {
    const legacy = config as AgentPageLegacyConfig<CapabilityInput>
    return {
      capabilities: legacy.capabilities as unknown as AgentPageCapabilities,
      createHandlers: legacy.createHandlers as unknown as AgentPageDefinition['createHandlers'],
      ready: legacy.ready
    }
  }

  // 实现签名是 any，这里立刻收窄回真实配置类型，避免 any 索引导致的隐式 any
  const input = config as AgentPageConfig
  const meta = pageMeta[input.pageKey]
  if (!meta) {
    throw new Error(
      `[agent] pageKey「${input.pageKey}」不在 pageMeta 中：请检查路由 name，或执行 npm run gen:agent`
    )
  }

  // 权限 URL 统一由路由派生，dialog/command 级重复配置不再需要手写
  const inheritActUrl = <T extends AgentDialogDef | AgentCommandDef>(item: T): T => ({
    ...item,
    requiredActUrl: item.requiredActUrl ?? meta.actUrl
  })
  const dialogs = input.actions?.dialogs.map(inheritActUrl) ?? []
  const commands = input.actions?.commands.map(inheritActUrl) ?? []

  const caps: Omit<AgentPageCapabilities, 'version'> = {
    module: input.module,
    route: meta.path,
    title: input.title ?? meta.title,
    requiredActUrl: meta.actUrl,
    anchors: input.anchors ? [...input.anchors] : undefined,
    dialogs: dialogs.length ? dialogs : undefined,
    commands: commands.length ? commands : undefined
  }

  return {
    pageKey: input.pageKey,
    capabilities: { ...caps, version: input.version ?? autoVersion(input.pageKey, caps) },
    createHandlers: input.actions?.createHandlers ?? (() => ({})),
    actions: input.actions,
    ready: input.ready
  }
}
