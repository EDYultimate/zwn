import { defineAgentActions, type PageContractOf } from '@/agent/page/actions'
import { defineAgentPage } from '@/agent/page/types'

/**
 * 取水月报页 —— AI 能力定义（与 index.vue 同目录，改造教程的标准样例）。
 * 规则见 `src/agent/README.md`。
 *
 * <p>接入一个新页面只需：路由加 name + 在业务页同目录建本文件 +
 * 业务页写一行 expose + 模板打锚点。
 * route / title / requiredActUrl / version 全部由 pageKey 从路由表派生。
 *
 * <p>只从平台层具体模块 import，不经过 `@/agent/page` 聚合出口，
 * 避免与登记表（registry.ts）形成循环依赖。
 */
const actions = defineAgentActions({
  blQueryModal: {
    kind: 'dialog',
    desc: '通报查询弹框：按期号查询水资源信息通报（默认第 84 期）。用户想查历史通报/往期月报时建议打开',
    method: 'showBlQuery'
  },
  setMonth: {
    kind: 'command',
    desc: '切换统计月份，页面标题与汇总随月份变化。用户指定要看某个月的月报时使用',
    params: [{ name: 'month', desc: '月份，格式 yyyy-MM，如 2025-12', required: true }]
  },
  switchTab: {
    kind: 'command',
    desc: '切换统计页签。用户问按河流/按省份/重要断面/水库/水闸的分类数据时使用',
    params: [
      {
        name: 'tab',
        desc: '页签键',
        required: true,
        enums: ['river', 'prov', 'sec', 'store', 'lic']
      }
    ]
  }
})

/** 业务页 `exposeAgentContext({...} satisfies QushuiyuebaoPageContract)` */
export type QushuiyuebaoPageContract = PageContractOf<typeof actions>

export default defineAgentPage({
  pageKey: 'qushuiyuebao',
  module: 'water-report',

  // 锚点挂在常驻容器上（不要挂在 v-if 分支里，否则折叠页签下高亮会找不到元素）
  anchors: [
    {
      target: 'report-title',
      desc: '月报标题与数据源期号。用户问「这是哪个月的月报」「数据来自哪一期通报」时，高亮它'
    },
    {
      target: 'month-filter',
      desc: '统计月份筛选器。用户问「怎么看其他月份」「月份在哪改」时，高亮它'
    },
    {
      target: 'stat-table',
      desc: '统计表格区：按河流/省份/重要断面/水库蓄水等页签展示取水工程数量与取水量。用户问具体取水统计数据时，高亮它'
    },
    {
      target: 'report-foot-note',
      desc: '表下汇总说明：当月取水总量、占比、极值等结论性文字。用户问「合计多少」「哪个最多」时，高亮它'
    }
  ],

  actions
})
