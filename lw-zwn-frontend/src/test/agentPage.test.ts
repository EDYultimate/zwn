import { describe, expect, test, vi } from 'vitest'

// bridge.ts / 间接依赖的 store 会 import 路由实例；node 测试环境没有 window，
// createWebHistory 会直接抛错，因此在这里替换成最小内存桩。
vi.mock('@/router/instance', () => ({
  default: {
    currentRoute: { value: { path: '/' } },
    push: vi.fn(),
    replace: vi.fn(),
    afterEach: vi.fn()
  }
}))

import { ref } from 'vue'
import { localCapabilityDigest, resolvePagePath } from '@/agent/capabilityRegistry'
import { defineAgentActions } from '@/agent/page/actions'
import { createAgentPageContext } from '@/agent/page/bridge'
import { fnv1a32 } from '@/agent/page/hash'
import { declaredTargets, findPageDefinition, pageDefinitions } from '@/agent/page/registry'
import { defineAgentPage, type AgentPageContext } from '@/agent/page/types'

const noopCtx = (): AgentPageContext => createAgentPageContext({})

describe('defineAgentPage 契约', () => {
  test('旧式显式声明仍被支持，createHandlers 可在运行期产出处理器', () => {
    const def = defineAgentPage({
      capabilities: {
        route: '/unit/demo',
        title: '单元测试页',
        requiredActUrl: '/unit/demo',
        version: '1',
        commands: [{ target: 'doThing', desc: '做某事' }]
      },
      createHandlers: (ctx) => ({ doThing: (args) => ctx.call('doThing', args.value) })
    })
    expect(def.capabilities.route).toBe('/unit/demo')
    expect(Object.keys(def.createHandlers(noopCtx()))).toEqual(['doThing'])
  })

  test('pageKey 从路由表派生 route / title / 权限 URL，version 由内容自动算出', () => {
    const def = defineAgentPage({ pageKey: 'shipinjiankong' })
    expect(def.capabilities.route).toBe('/waterUse/qushuijianguan/shipinjiankong')
    expect(def.capabilities.title).toBe('取水监管 · 视频监控')
    expect(def.capabilities.requiredActUrl).toBe(def.capabilities.route)
    expect(def.capabilities.version).toMatch(/^[0-9a-f]{8}$/)
    expect(defineAgentPage({ pageKey: 'shipinjiankong' }).capabilities.version).toBe(
      def.capabilities.version
    )
  })

  test('能力面内容一变，version 立即变化（无需手动升版本）', () => {
    const a = defineAgentActions({ ping: { kind: 'command', desc: '甲' } })
    const b = defineAgentActions({ ping: { kind: 'command', desc: '乙' } })
    const v1 = defineAgentPage({ pageKey: 'qushuiyuebao', actions: a }).capabilities.version
    const v2 = defineAgentPage({ pageKey: 'qushuiyuebao', actions: b }).capabilities.version
    expect(v1).not.toBe(v2)
  })
})

describe('动作表', () => {
  test('一张表同时生成声明、契约方法名与参数转发', () => {
    const showX = vi.fn()
    const setDay = vi.fn()
    const actions = defineAgentActions({
      openX: {
        kind: 'dialog',
        desc: '打开明细',
        method: 'showX',
        params: [{ name: 'id', desc: '编号', required: true }]
      },
      setDay: {
        kind: 'command',
        desc: '切换日期',
        params: [{ name: 'date', desc: '日期', required: true, type: 'date' }]
      }
    })

    expect(actions.methods).toEqual(['showX', 'setDay'])
    expect(actions.targets).toEqual(['openX', 'setDay'])
    expect(actions.dialogs[0].target).toBe('openX')
    expect(actions.commands[0].target).toBe('setDay')

    const handlers = actions.createHandlers(createAgentPageContext({ showX, setDay }))
    handlers.openX({ id: 'A' })
    handlers.setDay({ date: '2026-01-01' })
    expect(showX).toHaveBeenCalledWith('A')
    expect(setDay).toHaveBeenCalledWith('2026-01-01')
  })
})

describe('页面登记表', () => {
  test('静态入口收集各业务页能力文件，route 唯一且按字典序排列', () => {
    const routes = pageDefinitions.map((d) => d.capabilities.route)
    expect(routes).toContain('/waterUse/qushuijianguan/shuiliangjiankong')
    expect(routes).toContain('/waterUse/qushuijianguan/shipinjiankong')
    expect(routes).toContain('/waterUse/tongji/qushuiyuebao')
    expect(new Set(routes).size).toBe(routes.length)
    expect([...routes]).toEqual([...routes].sort())
  })

  test('每个页面声明的 target 都有对应 handler（运行期对账，防止按钮点了没反应）', () => {
    for (const def of pageDefinitions) {
      const handlers = Object.keys(def.createHandlers(noopCtx()))
      expect(handlers.sort(), def.capabilities.route).toEqual(declaredTargets(def).sort())
    }
  })

  test('handler 调用的方法名都在业务页契约方法清单里', () => {
    for (const def of pageDefinitions) {
      if (!def.actions) {
        continue
      }
      expect(new Set(def.actions.methods).size).toBe(def.actions.methods.length)
      expect(def.actions.methods.length).toBe(declaredTargets(def).length)
    }
  })

  test('target 全局不重复，否则 ownerRoute 会把事件分发到错误页面', () => {
    const all = pageDefinitions.flatMap((d) => declaredTargets(d))
    expect(new Set(all).size).toBe(all.length)
  })

  test('按路由精确匹配、子路径前缀匹配、未登记返回 undefined', () => {
    expect(findPageDefinition('/waterUse/tongji/qushuiyuebao')?.capabilities.title).toBe(
      '统计报表 · 取水月报'
    )
    expect(findPageDefinition('/waterUse/tongji/qushuiyuebao/detail')?.capabilities.route).toBe(
      '/waterUse/tongji/qushuiyuebao'
    )
    expect(findPageDefinition('/not/registered')).toBeUndefined()
  })

  test('指纹与摘要算法一致；未登记别名的路径原样返回', () => {
    expect(localCapabilityDigest()).toMatch(/^[0-9a-f]{8}$/)
    expect(fnv1a32('')).toBe('811c9dc5')
    expect(resolvePagePath('/waterUse/tongji/qushuiyuebao')).toBe('/waterUse/tongji/qushuiyuebao')
  })
})

describe('页面上下文桥', () => {
  test('call 调用页面暴露的方法并透传参数', () => {
    const fn = vi.fn((a: string, b: number) => `${a}-${b}`)
    const ctx = createAgentPageContext({ doIt: fn })
    expect(ctx.call('doIt', 'x', 1)).toBe('x-1')
    expect(fn).toHaveBeenCalledWith('x', 1)
  })

  test('call 未暴露的方法返回 undefined 并给出明确报错，不抛异常打断问答', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const ctx = createAgentPageContext({})
    expect(ctx.call('missing')).toBeUndefined()
    expect(spy.mock.calls[0][0]).toContain('missing')
    spy.mockRestore()
  })

  test('get 自动解包 ref，has 判断能力是否存在', () => {
    const ctx = createAgentPageContext({ total: ref(42), label: '月报' })
    expect(ctx.get('total')).toBe(42)
    expect(ctx.get('label')).toBe('月报')
    expect(ctx.has('total')).toBe(true)
    expect(ctx.has('nope')).toBe(false)
  })

  test('isReady：未提供 ready 恒就绪；支持布尔 / ref / 函数三种写法', () => {
    expect(createAgentPageContext({}).isReady()).toBe(true)
    expect(createAgentPageContext({ ready: false }).isReady()).toBe(false)
    expect(createAgentPageContext({ ready: ref(true) }).isReady()).toBe(true)
    expect(createAgentPageContext({ ready: () => 1 > 0 }).isReady()).toBe(true)
  })
})
