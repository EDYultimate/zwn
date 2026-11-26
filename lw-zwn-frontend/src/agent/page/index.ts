/**
 * 页面能力公共层统一出口（供业务页与能力文件使用）。
 *
 * <p>刻意不在这里 re-export install.ts：业务页 import 本文件属于高频路径，
 * 不要把 agentAgent store / 路由插件的求值链拖进每个业务页。
 * 应用入口请直接从 `@/agent/page/install` 引入 installAgentPages。
 */
export { defineAgentPage } from './types'
export type {
  AgentActionHandler,
  AgentPageConfig,
  AgentPageContext,
  AgentPageContextSource,
  AgentPageDefinition,
  AgentPageLegacyConfig
} from './types'
export { defineAgentActions } from './actions'
export type {
  AgentActionInput,
  AgentActionMap,
  AgentActionParamInput,
  AgentActionsDefinition,
  AgentActionsRuntime,
  PageContractOf
} from './actions'
export { exposeAgentContext } from './bridge'
export { pageDefinitions, findPageDefinition, declaredTargets } from './registry'
