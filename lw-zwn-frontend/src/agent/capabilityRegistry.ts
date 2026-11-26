import type { AgentPageCapabilities } from '@/api/agent/agentUiCapability'

import { pageAliases } from '@/agent/generated/pageMeta.generated'
import { fnv1a32 } from './page/hash'
import { pageDefinitions } from './page/registry'

/**
 * 全部页面的能力声明（唯一来源：各业务页同目录的 `<pageKey>.ts`，
 * 由 `pageEntries.generated.ts` 静态收集）。
 *
 * <p>路径、标题、权限 URL 由 `pageMeta`（从路由表生成）派生，版本号由能力面内容自动算出，
 * 因此改路由或改说明后无需手改任何配置：`route@version` 指纹一变，同步调度器会自动全量重报。
 *
 * <p>声明打完包就在首屏 JS 里，应用启动即可全量上报，不依赖用户逛过哪些页面。
 */
export const pageCapabilities: AgentPageCapabilities[] = pageDefinitions.map(
  (def) => def.capabilities
)

/**
 * 本地声明的指纹，算法与服务端 `UiCapabilityService.digest()` 必须完全一致：
 * `route@version` 按 route 升序、换行拼接，取 FNV-1a 32 位十六进制。
 */
export function localCapabilityDigest(): string {
  if (!pageCapabilities.length) {
    return '0'
  }
  const text = pageCapabilities.map((page) => `${page.route}@${page.version}\n`).join('')
  return fnv1a32(text)
}

/**
 * 旧路径 -> 当前路径。模型历史回答里的 NAVIGATE 可能带着改版前的 route，
 * 路由 meta.agentAliases 里登记过的旧地址仍能正确跳转。
 */
export function resolvePagePath(target: string): string {
  return pageAliases[target] ?? target
}
