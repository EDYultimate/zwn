import { defineAgentActions, type PageContractOf } from '@/agent/page/actions'
import { defineAgentPage } from '@/agent/page/types'

/**
 * 水量监控页 —— AI 能力定义（与 index.vue 同目录）。规则见 `src/agent/README.md`。
 *
 * <p>route / title / requiredActUrl / version 由 pageKey 从路由表派生；
 * 动作表同时生成声明、handler 与业务页契约类型，不需要手写 ctx.call。
 *
 * <p>只从平台层具体模块 import，不经过 `@/agent/page` 聚合出口，
 * 避免与登记表（registry.ts）形成循环依赖。
 */
const actions = defineAgentActions({
  warnDetailModal: {
    kind: 'dialog',
    desc: '预警明细弹框：按类别和日期展示逐条预警记录（取水权人、许可证号、许可/实际水量、处理状态等）。用户想看某类预警的明细清单时建议打开',
    params: [
      {
        name: 'category',
        desc: '预警类别',
        required: true,
        enums: ['临界许可', '超许可', '超计划', '计量异常']
      },
      { name: 'date', desc: '预警日期，格式 yyyy-MM-dd，不传默认页面当前日期', type: 'date' }
    ],
    method: 'showWarnDetail'
  },
  setWarnDate: {
    kind: 'command',
    desc: '切换预警日期。页面所有预警卡数量与明细数据随日期刷新。用户指定要看某一天的预警情况时使用',
    params: [{ name: 'date', desc: '目标日期，格式 yyyy-MM-dd', required: true, type: 'date' }]
  }
})

/** 业务页 `exposeAgentContext({...} satisfies ShuiliangjiankongPageContract)` */
export type ShuiliangjiankongPageContract = PageContractOf<typeof actions>

export default defineAgentPage({
  pageKey: 'shuiliangjiankong',
  module: 'water-monitor',

  anchors: [
    {
      target: 'warn-card.linJieXuKe',
      desc: '「临界许可」预警卡及其预警套数。用户问临界许可/即将超许可的情况时，高亮它'
    },
    {
      target: 'warn-card.chaoXuKe',
      desc: '「超许可」预警卡及其预警套数。用户问超出许可水量的情况时，高亮它'
    },
    {
      target: 'warn-card.chaoJiHua',
      desc: '「超计划」预警卡及其预警套数。用户问超出年度取水计划的情况时，高亮它'
    },
    {
      target: 'warn-card.jiLiangYiChang',
      desc: '「计量异常」预警卡及其预警套数。用户问计量设施/监测数据异常时，高亮它'
    },
    { target: 'tile.quShuiHuShu', desc: '「取水户数」统计数字。用户问有多少取水户时，高亮它' },
    { target: 'tile.quShuiKou', desc: '「取水口」统计数字。用户问取水口数量时，高亮它' },
    {
      target: 'tile.zhengZhaoZongShu',
      desc: '「证照总数」统计数字。用户问有效取水许可证数量时，高亮它'
    },
    {
      target: 'tile.xuKeShuiLiang',
      desc: '「许可水量」总数字（万m³）。用户问总许可水量时，高亮它'
    },
    {
      target: 'tile.xuKeShuiLiangHeDaoWai',
      desc: '「许可水量·河道外」统计数字。用户问河道外用水许可时，高亮它'
    },
    {
      target: 'tile.xuKeShuiLiangHeDaoNei',
      desc: '「许可水量·河道内」统计数字。用户问河道内/生态补水许可时，高亮它'
    }
  ],

  actions
})
