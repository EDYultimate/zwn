import type { AgentCommandDef, AgentDialogDef, AgentParamDef } from '@/api/agent/agentUiCapability'

import type { AgentActionHandler, AgentPageContext } from './types'

/** 参数输入：enums 放宽成 readonly，兼容 `const` 泛型推导出的只读元组 */
export interface AgentActionParamInput {
  name: string
  desc: string
  required?: boolean
  type?: 'string' | 'number' | 'date'
  enums?: readonly string[]
}

/**
 * 能力动作 = 「给模型看的声明」+「转发到页面方法的规则」。
 *
 * <p>以前 dialogs/commands 写在 capabilities 里、createHandlers 再手写一遍 ctx.call，
 * 两处 target 靠编译期约束，但 `ctx.call('xxx')` 的字符串名与业务页 expose 的键
 * 跨文件靠人对齐，只能运行时报错。现在一张表同时生成声明、handler 和契约类型：
 * 名字只写一次，页面漏实现会直接编译失败。
 */
export interface AgentActionInput {
  /** dialog 渲染成「打开弹框」按钮；command 是页面行为 */
  kind: 'dialog' | 'command'
  /** 给模型看的说明：什么场景下用 + 能看到什么 */
  desc: string
  params?: readonly AgentActionParamInput[]
  /** 业务页 exposeAgentContext 里的方法名；缺省 = 动作键（target） */
  method?: string
  /** 从模型 args 取值的字段顺序；缺省 = params 的 name 顺序 */
  pick?: readonly string[]
  /** 单独指定权限 URL；缺省继承页面级 requiredActUrl */
  requiredActUrl?: string
}

export type AgentActionMap = Record<string, AgentActionInput>

/** 运行时需要的动作表形状（不含泛型，供公共层传递） */
export interface AgentActionsRuntime {
  readonly dialogs: AgentDialogDef[]
  readonly commands: AgentCommandDef[]
  readonly targets: readonly string[]
  /** 页面必须暴露的方法名集合，供启动自检对账 */
  readonly methods: readonly string[]
  createHandlers(ctx: AgentPageContext): Record<string, AgentActionHandler>
}

/** 带类型标记的动作表：`typeof actions` 可推导出业务页契约 */
export interface AgentActionsDefinition<
  A extends AgentActionMap = AgentActionMap
> extends AgentActionsRuntime {
  /** 仅用于类型推导，运行时为 undefined */
  readonly __contract: A
}

/** 从动作表推导「页面必须暴露的方法名」联合 */
type MethodOf<A> = {
  [K in keyof A]: A[K] extends { method: infer M extends string } ? M : K & string
}[keyof A]

/**
 * 业务页 exposeAgentContext 的对象必须满足的契约。
 * 用法：`exposeAgentContext({ ... } satisfies XxxPageContract)`。
 */
export type PageContractOf<D> = D extends { __contract: infer A }
  ? A extends object
    ? { [M in MethodOf<A>]: (...args: any[]) => unknown } & { ready?: unknown }
    : never
  : never

/** 定义一张动作表：声明与 handler 都由它派生，不再手写 createHandlers */
export function defineAgentActions<const A extends AgentActionMap>(
  actions: A
): AgentActionsDefinition<A> {
  const dialogs: AgentDialogDef[] = []
  const commands: AgentCommandDef[] = []
  const targets: string[] = []
  const methods: string[] = []
  const rules: { target: string; method: string; pick: string[] }[] = []

  for (const [target, def] of Object.entries(actions)) {
    const method = def.method ?? target
    const pick = def.pick ? [...def.pick] : (def.params ?? []).map((p) => p.name)

    // 显式构造参数对象：键顺序固定，自动算出的 version 才稳定
    const params: AgentParamDef[] | undefined = def.params?.map((p) => ({
      name: p.name,
      desc: p.desc,
      ...(p.required !== undefined ? { required: p.required } : {}),
      ...(p.type ? { type: p.type } : {}),
      ...(p.enums ? { enums: [...p.enums] } : {})
    }))
    const entry: AgentDialogDef & AgentCommandDef = {
      target,
      desc: def.desc,
      ...(params ? { params } : {}),
      ...(def.requiredActUrl ? { requiredActUrl: def.requiredActUrl } : {})
    }
    if (def.kind === 'dialog') {
      dialogs.push(entry)
    } else {
      commands.push(entry)
    }

    targets.push(target)
    methods.push(method)
    rules.push({ target, method, pick })
  }

  return {
    // 运行时占位：只为把 A 带到 typeof 里，供 PageContractOf 推导
    __contract: undefined as unknown as A,
    dialogs,
    commands,
    targets,
    methods,
    createHandlers(ctx: AgentPageContext): Record<string, AgentActionHandler> {
      const handlers: Record<string, AgentActionHandler> = {}
      for (const rule of rules) {
        handlers[rule.target] = (args) =>
          ctx.call(rule.method, ...rule.pick.map((key) => args?.[key]))
      }
      return handlers
    }
  }
}
