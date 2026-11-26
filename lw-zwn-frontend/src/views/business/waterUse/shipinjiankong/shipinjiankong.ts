import { defineAgentActions, type PageContractOf } from '@/agent/page/actions'
import { defineAgentPage } from '@/agent/page/types'

/**
 * 视频监控页 —— AI 能力定义（与 index.vue 同目录）。规则见 `src/agent/README.md`。
 *
 * <p>本文件是唯一事实来源：route / title / requiredActUrl / version 由 pageKey
 * 从路由表派生；动作表同时生成给模型看的声明、事件 handler 和业务页契约类型。
 * 弹框/命令参数 stationName 按点位名称匹配（页面列表数据中的 name 字段）。
 *
 * <p>只从平台层具体模块 import，不经过 `@/agent/page` 聚合出口，
 * 避免与登记表（registry.ts）形成循环依赖。
 */
const actions = defineAgentActions({
  videoDetailModal: {
    kind: 'dialog',
    desc: '视频详情弹框：站点信息 + 实时视频 + 云台控制 + 抓拍列表。用户想看某个监控点位的实时画面或详情时建议打开',
    params: [
      { name: 'stationName', desc: '监控点位名称（须与页面列表中的名称一致）', required: true }
    ],
    method: 'showVideoDetail'
  },
  relWhsModal: {
    kind: 'dialog',
    desc: '关联取水口弹框：展示某监控点位关联的取水口列表。用户想看某点位关联了哪些取水口时建议打开',
    params: [
      { name: 'stationName', desc: '监控点位名称（须与页面列表中的名称一致）', required: true }
    ],
    method: 'showRelWhs'
  },
  locateStation: {
    kind: 'command',
    desc: '在地图/列表上定位某个监控点位（选中并提示）。用户问某个点位在哪里时使用',
    params: [{ name: 'stationName', desc: '监控点位名称', required: true }],
    method: 'locateByName'
  },
  filterByStatus: {
    kind: 'command',
    desc: '按状态筛选监控点位列表。用户想只看某类点位（如只看离线）时使用',
    params: [
      {
        name: 'status',
        desc: '筛选类别',
        required: true,
        enums: ['全部', '在线', '离线', '异常抓拍', '有取水']
      }
    ]
  },
  searchStation: {
    kind: 'command',
    desc: '按名称搜索监控点位。用户指定了点位名称关键词时使用',
    params: [{ name: 'keyword', desc: '名称关键词', required: true }]
  },
  setQueryDate: {
    kind: 'command',
    desc: '切换查询日期，点位数据随日期刷新',
    params: [{ name: 'date', desc: '目标日期，格式 yyyy-MM-dd', required: true, type: 'date' }]
  }
})

/** 业务页 `exposeAgentContext({...} satisfies ShipinjiankongPageContract)` */
export type ShipinjiankongPageContract = PageContractOf<typeof actions>

export default defineAgentPage({
  pageKey: 'shipinjiankong',
  module: 'water-video',

  anchors: [
    {
      target: 'station-list',
      desc: '监控点位列表区域（点位卡片：名称、监管单位、在线状态、视频缩略图、定位/详情/关联取水口操作）。用户想看监控点位情况时，高亮它'
    },
    {
      target: 'station-count',
      desc: '查询结果统计（点位总数与当前显示条数）。用户问有多少监控点位时，高亮它'
    }
  ],

  actions
})
