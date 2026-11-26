# 业务页接入智能体 · 改造规范

> 适用对象：本系统**所有**需要被智能问答「跳转 / 打开弹框 / 高亮 / 触发命令」的业务页面。
> 配套实例：`src/views/business/waterUse/qushuiyuebao/qushuiyuebao.ts` + 同目录 `index.vue`。

---

## 0. 一句话规则

**同一个事实只写一次，其余全部派生**：

| 事实 | 唯一来源 | 派生结果 |
| --- | --- | --- |
| 路由 path / 菜单标题 / 权限 URL | `src/router/modules/*.ts` 的 `name` + `path` + `meta.title` | `pageMeta.generated.ts` → 所有能力声明的 `route` / `title` / `requiredActUrl` |
| 动作名、说明、参数、页面方法名 | 业务页同目录 `<pageKey>.ts` 的一张 `defineAgentActions` 表 | `dialogs` / `commands` / `createHandlers` / 业务页契约类型 |
| 能力面版本 | 声明内容的 FNV-1a 摘要 | `version`（自动，不用手升） |

**改路由只改 `home.ts`；加功能只改同目录能力文件 + 业务页实现；改业务实现只改业务页。**

业务页只做两件事：模板打 `data-anchor`，`<script setup>` 末尾写一次 `exposeAgentContext({...} satisfies XxxPageContract)`。

```vue
<script setup lang="ts">
import { exposeAgentContext } from '@/agent/page'
import type { QushuiyuebaoPageContract } from './qushuiyuebao'

exposeAgentContext({
  showBlQuery: () => blQueryRef.value?.show()
} satisfies QushuiyuebaoPageContract)
</script>

<template>
  <div data-anchor="stat-table"> ... </div>
</template>
```

---

## 1. 为什么这样组织

| 之前的做法 | 现在 |
| --- | --- |
| 能力声明集中放在 `src/agent/pages/`，改页面要跨目录找配置 | 能力文件与 `index.vue` **同目录**，改功能就地改 |
| `route` / `requiredActUrl` 在能力文件里手写 2~4 遍，路由一改就错 | 由路由表生成 `pageMeta`，能力文件只写 `pageKey` |
| `ctx.call('xxx')` 与页面 expose 的键跨文件靠人对齐，只能运行时报错 | 动作表生成 `PageContractOf`，`satisfies` 编译期强制；构建期脚本再兜底 |
| 声明与 handler 各写一份 target | 一张动作表同时生成声明 + handler |
| 改 desc 忘了升 `version`，模型仍用旧说明 | `version` 由内容自动算，指纹变化自动触发全量重报 |
| 新人照抄一整段模板 | 路由加 `name` + 同目录建一个能力文件 + 页面一行接入 |

**关键约束**：路由组件是 `() => import(...)` 懒加载的，能力文件放到 `views/` 下后，
不能靠「页面被访问」来登记，否则刚进问答页时后端清单为空。
因此 `gen:agent` 额外生成 `pageEntries.generated.ts`，用**静态 import** 把全部能力文件拉进首屏 JS，
保持「启动即全量上报」。能力文件本身只从 `@/agent/page/actions`、`@/agent/page/types`
这两个具体模块 import，不经过 `@/agent/page` 聚合出口，以避开与登记表的循环依赖。

核心收益：**改 A 忘改 B 时，编译/构建/启动就会失败**，不会出现「模型给了按钮、用户点了没反应」。

---

## 2. 目录与职责（谁改哪里）

| 路径 | 谁维护 | 作用 |
| --- | --- | --- |
| `src/router/modules/*.ts` | 业务开发 | 路由唯一来源；接入 agent 的叶子路由必须有唯一 `name` |
| `src/views/**/<pageKey>.ts` | 业务开发，每页一个 | **与 `index.vue` 同目录**；`pageKey` + 锚点 + 动作表；导出页面契约类型 |
| `src/agent/generated/pageMeta.generated.ts` | **自动生成，勿手改** | 路由元数据（path / title / actUrl / view / agentFile / aliases） |
| `src/agent/generated/pageEntries.generated.ts` | **自动生成，勿手改** | 静态 eager 入口：把各能力文件 import 进首屏 JS |
| `scripts/gen-agent-page-meta.mjs` | 平台维护 | 生成上面两个文件；`npm run gen:agent` |
| `scripts/check-agent-contracts.mjs` | 平台维护 | 构建期对账；`npm run check:agent` |
| `src/agent/page/*` | 平台维护 | 类型约束、动作表、上下文桥、路由插件、自检 |
| `src/agent/capabilityRegistry.ts` / `capabilitySync.ts` | 平台维护 | 声明收集、指纹、上报调度 |
| `src/store/modules/agentAgent.ts` | 平台维护 | 事件分发、跨页队列、高亮 |
| 业务 `.vue` | 业务开发 | 一行 `exposeAgentContext` + 同目录契约类型 + 模板 `data-anchor` |

新增页面不需要改任何全局文件：路由加 `name` + 同目录放 `<pageKey>.ts`，
`npm run gen:agent` 会自动把新页面写进两个生成物。
`npm run dev` / `build:*` 会先跑 `gen:agent`；`build:*` 还会跑 `check:agent` 与 `vue-tsc --noEmit`。

---

## 3. 接入五步（以取水月报为例）

### 步骤 1 · 路由加稳定 `name`

```ts
// src/router/modules/home.ts
{
  name: 'qushuiyuebao',          // = pageKey = 能力文件名，稳定不变
  path: 'qushuiyuebao',          // 随便改，能力声明会自动跟随
  component: () => import('@/views/business/waterUse/qushuiyuebao/index.vue'),
  meta: {
    title: '取水月报',
    // 可选：改版前的旧路径，模型历史回答里的 NAVIGATE 仍能跳转
    agentAliases: ['/waterUse/tongji/monthReport']
  }
}
```

`name` 必须全局唯一。标题由最后两级 `meta.title` 自动拼成「统计报表 · 取水月报」，无需手写。
改完执行 `npm run gen:agent`（dev / build 会自动执行），生成物里就是新的 path / title / actUrl / agentFile。

### 步骤 2 · 在业务页同目录新建 `<name>.ts`

例如 `src/views/business/waterUse/qushuiyuebao/qushuiyuebao.ts`（与 `index.vue` 平级）。
完整模板见第 4 节。要点：

- `pageKey` 必须等于路由 `name`，也等于文件名；写错编译失败，`check:agent` 也会报错。
- **不要写** `route` / `title` / `requiredActUrl` / `version`，全部自动派生。
- 动作表里每个键就是 `target`；`method` 省略时默认等于 `target`，`pick` 省略时按 `params` 顺序取模型参数。
- 导出 `export type XxxPageContract = PageContractOf<typeof actions>` 供业务页使用。
- 只 import 平台层具体模块（见模板），不要写 `from '@/agent/page'`。

```ts
import { defineAgentActions, type PageContractOf } from '@/agent/page/actions'
import { defineAgentPage } from '@/agent/page/types'

const actions = defineAgentActions({
  blQueryModal: { kind: 'dialog', desc: '…', method: 'showBlQuery' },
  setMonth: {
    kind: 'command',
    desc: '…',
    params: [{ name: 'month', desc: '月份', required: true }]
  }
})
export type QushuiyuebaoPageContract = PageContractOf<typeof actions>

export default defineAgentPage({ pageKey: 'qushuiyuebao', anchors: [/* … */], actions })
```

`method` 是「业务页暴露的方法名」唯一书写处；公共层自动生成
`(args) => ctx.call(method, ...pick.map(k => args[k]))`，**不要再手写 `createHandlers` / `ctx.call`**。

### 步骤 3 · 业务页加一行接入

```ts
import { exposeAgentContext } from '@/agent/page'
import type { QushuiyuebaoPageContract } from './qushuiyuebao'

exposeAgentContext({
  showBlQuery: () => blQueryRef.value?.show(),
  setMonth: (value: string) => { if (/^\d{4}-\d{2}$/.test(value)) month.value = value }
} satisfies QushuiyuebaoPageContract)
```

规则：
- `satisfies` 让「漏方法 / 拼错名 / 多了无关键」在 `vue-tsc --noEmit` 直接失败；
- `import type` 用同目录相对路径，编译后擦除，业务页不产生对能力声明的运行时依赖；
- 值一律写成函数，参数校验放页面里做（模型给的值不可信）；
- `ready` 是保留键，可用于首屏异步数据握手，契约允许它存在；
- 即使本页只有高亮，也要写 `exposeAgentContext({} satisfies XxxPageContract)`。

### 步骤 4 · 模板打 `data-anchor`

只给 `anchors` 声明过的元素打，属性值就是 `target`：

```vue
<div class="table-wrap" data-anchor="stat-table">…</div>
```

- 挂在**常驻容器**上，不要挂 `v-if` / 未激活页签内的元素；
- 一个 target 只能出现一次；列表项可动态拼接 `:data-anchor="'tile.' + key"`，但拼接结果要与声明逐字一致；
- `check:agent` 会校验静态锚点，动态锚点页面自动跳过，由启动自检告警。

### 步骤 5 · 自检

启动开发服务器，控制台应出现：

```
[agent] 已生成 2 个文件：N 个页面
[agent] 页面能力自检通过：N 个页面
[agent] 能力声明已全量同步：N 个页面，digest = xxxxxxxx
```

提交前跑一次 `npm run check:agent`。出现任何 `[agent]` 红字按第 7 节排错。

---

## 4. 可复制的空白模板

另存为 `src/views/**/<name>.ts`（与 `index.vue` 同目录）：

```ts
import { defineAgentActions, type PageContractOf } from '@/agent/page/actions'
import { defineAgentPage } from '@/agent/page/types'

const actions = defineAgentActions({
  someModal: {
    kind: 'dialog',
    desc: '某某明细弹框：展示……。用户想看逐条明细时建议打开',
    params: [{ name: 'category', desc: '类别', required: true, enums: ['甲', '乙'] }],
    method: 'showSomeModal'
  },
  setSomeValue: {
    kind: 'command',
    desc: '切换某某条件，页面数据随之刷新。用户指定某值时使用',
    params: [{ name: 'value', desc: '目标值', required: true }]
  }
})

export type SomePageContract = PageContractOf<typeof actions>

export default defineAgentPage({
  pageKey: 'somePage',
  anchors: [{ target: 'some-area', desc: '某某数据区域。用户问某某数据时，高亮它' }],
  actions
  // ready: (ctx) => ctx.has('dataLoaded') && Boolean(ctx.get('dataLoaded'))
})
```

只有高亮、没有动作时：省略 `actions`，业务页写 `exposeAgentContext({})`。

---

## 5. 字段与命名规则

**必须**

- 路由 `name` 全局唯一；`pageKey` = `name` = 能力文件名。
- 能力文件与 `index.vue` **同目录**，文件名 `<pageKey>.ts`；`gen:agent` 按此约定生成静态入口。
- `target` 全局唯一（跨页面也不能重名），`ownerRoute()` 靠它反查页面。
- `desc` 写「**什么场景下用 + 能看到什么**」，模型靠这句话决定选不选它。
- `params` 里 `required: true` 的参数模型必须给值；`enums` 之外的取值会被后端丢弃；日期用 `type: 'date'`，格式 `yyyy-MM-dd`。
- 业务页 expose 的键集合必须与动作表的 `method` 集合完全一致（`satisfies` + `check:agent` 双重保证）。
- 每个 `dialogs` / `commands` 的 target 都有 handler（由动作表自动生成）。

**禁止**

- 不要在能力文件里手写 `route` / `title` / `requiredActUrl` / `version`。
- 不要手写 `createHandlers` / `ctx.call`。
- 不要把能力文件放到 `src/agent/pages/` 或其它目录，也不要再建 `agent.capabilities.ts` / 用 `useAgentActions`（已废弃）。
- 能力文件不要 `import ... from '@/agent/page'`（聚合出口会与登记表形成循环依赖），只用 `actions` / `types` 具体模块。
- 不要在业务页 import 能力声明的**运行时值**（只允许 `import type`）。
- 不要在业务页 import `agentStore` / `capabilityRegistry`，不要手动调 `flushPending`。
- 不要在 handler 里做跳转或写业务逻辑；所有事件必须由用户点击回答里的按钮后执行。
- 不要把 `data-anchor` 写到隐藏 / 折叠元素上。

---

## 6. `ready` 握手（异步数据页必看）

从问答页跳过来打开弹框时，目标页可能还在请求数据。插件会轮询等待「就绪」，最多 3 秒；超时明确提示用户重试。

```ts
exposeAgentContext({
  // ① 布尔 ref / computed（推荐）：用 loading 状态，别用「数据长度 > 0」
  ready: computed(() => !loading.value),
  showDetail: (id: string) => modalRef.value?.show(id)
} satisfies SomePageContract)
```

也支持 `ready: () => boolean`、`ready: dataLoaded`。不提供 = 视作已就绪。
更复杂的判断写能力文件的 `ready: (ctx) => ...`，优先级更高。

---

## 7. 排错表

| 现象 / 控制台信息 | 原因 | 修复 |
| --- | --- | --- |
| `TS2741 / TS2353`（业务页） | `satisfies` 发现方法缺失 / 拼错 / 多余 | 按契约补齐或删掉 |
| `pageKey「x」不在 pageMeta 中` | 路由没加 `name`，或没跑生成 | 加 `name`，执行 `npm run gen:agent` |
| `缺少能力文件（须放在业务页同目录…）` | 新增路由后没建 `<pageKey>.ts`，或放错目录/文件名 | 按 `pageMeta.generated.ts` 的 `agentFile` 建文件 |
| `pageKey「x」与路由 name「y」不一致` | 能力文件里的 pageKey 写错 | 改成路由 name，并保持文件名一致 |
| `生成物已过期，请执行 npm run gen:agent` | 改了 `home.ts` 但生成物是旧的 | 执行 `npm run gen:agent`（dev/build 自动跑） |
| `pageEntries.generated.ts 与路由表不一致` | CI 上忘了生成 | `npm run gen:agent && npm run check:agent` |
| `业务页未暴露方法 xxx` | 绕过了 `satisfies`（`as any` / 动态键） | 按 `check:agent` 输出补齐 |
| `未暴露契约方法「xxx」` | 页面挂载时对账失败 | 同上行 |
| `target「xxx」与 /yyy 重复` | target 跨页面重名 | 改成全局唯一 |
| `声明了锚点「xxx」，当前 DOM 未找到 data-anchor` | 模板漏写或挂在折叠元素 | 补 / 移到常驻容器 |
| `[agent] 模板缺少 data-anchor：xxx` | 构建期锚点校验失败 | 按输出补模板 |
| 刚进系统问答页说「暂无该页面」 | 静态入口没生成 / 能力文件 import 了聚合出口导致循环 | 跑 `gen:agent`；检查能力文件 import |
| 改了 desc 但模型行为没变 | 服务端清单未刷新 | `version` 已自动变化，确认 `digest` 日志与后端指纹一致 |
| 路由改名后旧回答按钮跳 404 | 没登记旧路径 | 在路由 `meta.agentAliases` 补旧 path，重新生成 |
| 刷新首屏后按钮无效，切一次页就好 | 插件装到 `app.mount()` 之后 | 保持 `installAgentPages()` 在 mount 之前 |

调试入口：`import { agentPageDiagnostics } from '@/agent/page/install'`，返回每页 pageKey / route / version / actions / methods / 上下文是否就绪。

---

## 8. 提交前检查清单

- [ ] 路由叶子节点有唯一 `name`，且与 `pageKey`、能力文件名一致
- [ ] 能力文件与 `index.vue` **同目录**，只 import `actions` / `types` 具体模块
- [ ] 能力文件没有手写 `route` / `title` / `requiredActUrl` / `version` / `createHandlers`
- [ ] 业务页 `exposeAgentContext({...} satisfies XxxPageContract)`，且用同目录 `import type`
- [ ] `anchors` 的每个 target 在模板有且仅有一个 `data-anchor`，挂在常驻 DOM
- [ ] `npm run gen:agent && npm run check:agent` 通过，`vue-tsc --noEmit` 通过
- [ ] 启动控制台无 `[agent]` 红字
- [ ] 问答页实测：高亮、每个弹框、每个命令、跨页跳转后弹框自动打开

---

## 9. 不需要改的部分

- **后端**：无需改动。声明仍通过 `POST /api/agent/ui-capabilities` 上报，服务端按 `client + route` 收录并做权限过滤；`version` 由前端自动算，服务端 digest 算法不变。
- **问答页 / 提示词**：无需改动。模型看到的能力清单来自全量上报的声明。
- **能力同步 / 指纹 / store**：平台维护，业务开发不碰。

---

## 10. 已有接入页面

| 页面 | 能力文件（与业务页同目录） | 业务页 |
| --- | --- | --- |
| 取水月报（**标准样例**） | `views/business/waterUse/qushuiyuebao/qushuiyuebao.ts` | `views/business/waterUse/qushuiyuebao/index.vue` |
| 水量监控 | `views/business/waterUse/shuiliangjiankong/shuiliangjiankong.ts` | `views/business/waterUse/shuiliangjiankong/index.vue` |
| 视频监控 | `views/business/waterUse/shipinjiankong/shipinjiankong.ts` | `views/business/waterUse/shipinjiankong/index.vue` |
| 证照管理 | `views/business/waterUse/zhengzhaoguanli/zhengzhaoguanli.ts` | `views/business/waterUse/zhengzhaoguanli/index.vue` |
