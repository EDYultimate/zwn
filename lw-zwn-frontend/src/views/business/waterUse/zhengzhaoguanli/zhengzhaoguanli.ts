import { defineAgentActions, type PageContractOf } from '@/agent/page/actions'
import { defineAgentPage } from '@/agent/page/types'

/**
 * 证照管理页 —— AI 能力定义（与 index.vue 同目录）。规则见 `src/agent/README.md`。
 *
 * <p>route / title / requiredActUrl / version 由 pageKey 从路由表派生；
 * 动作表同时生成声明、handler 与业务页契约类型，不需要手写 ctx.call。
 *
 * <p>只从平台层具体模块 import，不经过 `@/agent/page` 聚合出口，
 * 避免与登记表（registry.ts）形成循环依赖。
 */
const actions = defineAgentActions({
  /* ---------------- 弹框 ---------------- */

  licNewModal: {
    kind: 'dialog',
    desc: '新增取水许可证弹框：分栏表单，可填许可证状态、许可证编号、有效期、许可水量、取水项目名称、取水权人、组织机构代码、取水口明细（一证多口可增删）、所属河流/河段、水源类型、取水类型、取水用途、监管单位、行政区划与重点监管/灌区标记。用户要新建或登记一张取水许可证时建议打开',
    method: 'showLicNew'
  },
  licEditModal: {
    kind: 'dialog',
    desc: '编辑取水许可证弹框：按许可证编号回填原值后修改。已发证状态的证照仅允许改许可证状态、编号与行政区划监管信息。用户要修改某张已有许可证时建议打开',
    params: [
      { name: 'cert', desc: '许可证编号（须与列表中的许可证编号一致）', required: true }
    ],
    method: 'showLicEdit'
  },
  licDetailModal: {
    kind: 'dialog',
    desc: '证照详情弹框，含两个页签：①基本信息（证号、许可证状态、有效期、许可水量、取水项目、取水权人、组织机构代码、取水口明细表、所属河流/河段、水源类型、取水类型、取水用途、监管单位、行政区划、重点监管/灌区标记）；②监测计量信息（选定取水口后按日/月/年查看在线计量与全国取用水平台的取水量折线图、最大/最小/累计取水量统计卡与逐期统计表）。用户要看某张许可证的档案或取水数据时建议打开',
    params: [
      { name: 'cert', desc: '许可证编号（须与列表中的许可证编号一致）', required: true },
      {
        name: 'tab',
        desc: '打开后停留的页签：basic 基本信息 / meter 监测计量信息，不传默认 basic',
        enums: ['basic', 'meter']
      },
      {
        name: 'gran',
        desc: '监测计量页签的统计粒度：day 按日 / month 按月 / year 按年，不传默认 month',
        enums: ['day', 'month', 'year']
      },
      {
        name: 'port',
        desc: '监测计量页签的取水口编号（须为该证照下的取水口），不传默认「汇总」'
      }
    ],
    method: 'showLicDetail'
  },
  licDeleteModal: {
    kind: 'dialog',
    desc: '删除确认弹框：展示待删除的许可证编号与取水权人，确认后连同取水口信息一并删除且不可恢复。用户明确要求删除某张许可证时建议打开，由用户亲自点「删除」二次确认',
    params: [
      { name: 'cert', desc: '许可证编号（须与列表中的许可证编号一致）', required: true }
    ],
    method: 'showLicDelete'
  },

  /* ---------------- 筛选条件 ---------------- */

  setFilterKeyword: {
    kind: 'command',
    desc: '填写文本筛选条件并立即检索列表：许可证编号、取水权人、组织机构代码、河流均为模糊匹配。用户按编号/单位/河流找证照时使用',
    params: [
      {
        name: 'field',
        desc: '筛选字段',
        required: true,
        enums: ['许可证编号', '取水权人', '组织机构代码', '河流']
      },
      { name: 'keyword', desc: '关键字（模糊匹配）', required: true }
    ]
  },
  setSelectFilter: {
    kind: 'command',
    desc: '按下拉条件筛选列表：行政区（地级市）或监管单位（岳城局、卫河局等）。行政区优先传行政区划编码（adCd，如 130400），也接受页面下拉里显示的中文名称；监管单位传名称。传「全部」表示不限。用户要看某个市或某个监管单位管辖的证照时使用',
    params: [
      { name: 'field', desc: '筛选字段', required: true, enums: ['行政区', '监管单位'] },
      {
        name: 'value',
        desc: '目标值：行政区传 6 位行政区划编码（如 130400），或列表中出现过的行政区名称；监管单位传名称。传「全部」表示不限',
        required: true
      }
    ]
  },
  setInposFilter: {
    kind: 'command',
    desc: '按河道内外筛选列表，用于区分河道内取水（如水力发电）与河道外取水。用户问河道内/河道外证照时使用',
    params: [
      {
        name: 'inpos',
        desc: '河道内外码值：1=河道内取水，0=河道外取水；不传或传「全部」表示不限',
        required: true,
        enums: ['1', '0']
      }
    ]
  },
  setSrcFilter: {
    kind: 'command',
    desc: '按水源类型筛选列表，可多选。码值：1=地表水，2=地下水，3=其他；传「全部」清空。用户想只看某一类水源的证照时使用',
    params: [
      {
        name: 'srcs',
        desc: '水源类型码值，多个用逗号分隔（如「1,2」表示地表水和地下水），传「全部」清空',
        required: true
      }
    ]
  },
  setAmtRangeFilter: {
    kind: 'command',
    desc: '按许可水量区间筛选列表（单位万m³/年）。用户问许可水量大于/小于某个量级的证照时使用',
    params: [
      {
        name: 'range',
        desc: '许可水量区间',
        required: true,
        enums: ['全部', '<100', '100-1000', '>1000']
      }
    ]
  },
  setStatusFilter: {
    kind: 'command',
    desc: '按证照状态筛选列表，可多选，同时匹配证照状态与业务类型。可选值：有效、新办、变更、延续、无效、注销、吊销、撤销；传「全部」清空。用户问已注销/已吊销等特定状态的证照时使用',
    params: [
      {
        name: 'statuses',
        desc: '证照状态，多个用逗号分隔（如「注销,吊销」），传「全部」清空',
        required: true
      }
    ]
  },
  setIssuedFilter: {
    kind: 'command',
    desc: '按发证状态筛选列表（WR_WPC_SUP_B.STT）。用户问哪些许可证准予了但还没发证时使用',
    params: [
      {
        name: 'issued',
        desc: '发证状态码值：1=已发证，0=准予未发（STT 为空同 0）；传「全部」表示不限',
        required: true,
        enums: ['1', '0']
      }
    ]
  },
  setExpiringFilter: {
    kind: 'command',
    desc: '只看临近过期（≤60 天）的许可证，或取消该限制。用户问快到期/需要延续的证照时使用',
    params: [
      { name: 'only', desc: '是否只看临近过期', required: true, enums: ['是', '否'] }
    ]
  },

  /* ---------------- 列表与查询区 ---------------- */

  applyCertsQuery: {
    kind: 'command',
    desc: '按当前所有筛选条件重新查询许可证列表，刷新表格与底部统计脚注。改完条件后需要刷新结果时使用'
  },
  clearFilters: {
    kind: 'command',
    desc: '清除全部筛选条件（文本、行政区、监管单位、河道内外、水源类型、许可水量、证照状态、发证状态、临近过期），恢复全量列表。用户想重置筛选时使用'
  },
  toggleQueryPanel: {
    kind: 'command',
    desc: '展开或折叠「电子证照查询」筛选区（折叠后只保留标题与按钮）。需要看清列表或重新展开筛选时使用',
    params: [{ name: 'open', desc: '展开 / 折叠', required: true, enums: ['展开', '折叠'] }]
  }
})

/** 业务页 `exposeAgentContext({...} satisfies ZhengzhaoguanliPageContract)` */
export type ZhengzhaoguanliPageContract = PageContractOf<typeof actions>

export default defineAgentPage({
  pageKey: 'zhengzhaoguanli',
  // 智能体能力约定（module = water-cert，即「取水许可信息管理智能体」）：
  // 后端工具 = water.cert.* + AgentToolApi 公共能力；前端页面 = 本页面。
  // 提示词清单、ui.locate 检索、事件白名单三处都按此 module 裁剪，
  // 其他 module 的页面（water-monitor / water-video / water-report）不会进入本智能体
  module: 'water-cert',

  anchors: [
    {
      target: 'stat-permit-qty',
      desc: '「许可水量」统计卡：全部证照许可水量合计（万m³）与按河流分布的迷你柱状图。用户问总许可水量、各河流许可水量对比时，高亮它'
    },
    {
      target: 'stat-cert-count',
      desc: '「取水许可证」统计卡：证照总数与监管单位分布环形图及图例（点击图例可按监管单位筛选）。用户问有多少取水许可证、各监管单位证照分布时，高亮它'
    },
    {
      target: 'stat-intake-count',
      desc: '「取水口」统计卡：取水口总数与按河流分布的迷你柱状图。用户问取水口数量及河流分布时，高亮它'
    },
    {
      target: 'query-panel',
      desc: '「电子证照查询」区域：六项文本/下拉筛选（许可证编号、取水权人、组织机构代码、河流、行政区、监管单位）、三组单选/多选条件（河道内外、水源类型、许可水量、证照状态、发证状态、临近过期）以及查询/新建/导出按钮。用户想筛选证照或问有哪些筛选条件时，高亮它'
    },
    {
      target: 'cert-table',
      desc: '取水许可证列表表格：许可证编号、取水权人、组织机构代码、取水项目名称、所属河流、许可水量、用途、业务类型、水源类型、监管单位、行政区及详情/编辑/删除操作。用户问证照清单或某条证照记录时，高亮它'
    },
    {
      target: 'cert-foot',
      desc: '列表底部统计脚注：筛选结果条数、许可水量合计、取水口数合计（未筛选时展示全库证件数/许可水量/取水口数），并提供「清除筛选」入口。用户问筛选结果合计或总量时，高亮它'
    }
  ],

  actions
})
