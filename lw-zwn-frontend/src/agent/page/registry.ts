import { pageEntries } from '@/agent/generated/pageEntries.generated'

import type { AgentPageDefinition } from './types'

/**
 * 页面能力登记表。
 *
 * <p>能力文件已移到各自业务页 `index.vue` 的同目录（`<pageKey>.ts`）。
 * 路由组件是懒加载的，若靠页面被访问时才登记，启动全量上报就会缺页面；
 * 因此由 `gen:agent` 生成 `pageEntries.generated.ts`，用**静态 import** 把声明
 * 拉进首屏 JS，不需要业务开发回来改这里，也不受 views 下其它 .ts 文件干扰。
 *
 * <p>新增页面：路由加 `name` + 在业务页同目录放能力文件 + 跑 `npm run gen:agent`。
 */
/** 按 route 排序，保证提示词与 `route@version` 指纹在不同环境/重启间稳定 */
export const pageDefinitions: AgentPageDefinition[] = [...pageEntries]
  .filter((def): def is AgentPageDefinition => Boolean(def?.capabilities?.route))
  .sort((a, b) =>
    a.capabilities.route < b.capabilities.route
      ? -1
      : a.capabilities.route > b.capabilities.route
        ? 1
        : 0
  )

/** 按路由取页面定义；路由带动态段时退化为前缀匹配 */
export function findPageDefinition(route: string): AgentPageDefinition | undefined {
  return (
    pageDefinitions.find((def) => def.capabilities.route === route) ??
    pageDefinitions.find((def) => route.startsWith(def.capabilities.route + '/'))
  )
}

/** 声明里出现的全部 dialog / command target，供运行时对账 */
export function declaredTargets(def: AgentPageDefinition): string[] {
  const dialogs = def.capabilities.dialogs?.map((d) => d.target) ?? []
  const commands = def.capabilities.commands?.map((c) => c.target) ?? []
  return [...dialogs, ...commands]
}
