/* eslint-disable */
/**
 * 自动生成，请勿手改。
 * 数据源：src/router/modules/*.ts 中带 name 的路由记录。
 * 生成命令：npm run gen:agent
 */
export const pageMeta = {
  "shuiliangjiankong": {
    "path": "/waterUse/qushuijianguan/shuiliangjiankong",
    "title": "取水监管 · 水量监控",
    "actUrl": "/waterUse/qushuijianguan/shuiliangjiankong",
    "aliases": [],
    "view": "src/views/business/waterUse/shuiliangjiankong/index.vue",
    "agentFile": "src/views/business/waterUse/shuiliangjiankong/shuiliangjiankong.ts"
  },
  "shipinjiankong": {
    "path": "/waterUse/qushuijianguan/shipinjiankong",
    "title": "取水监管 · 视频监控",
    "actUrl": "/waterUse/qushuijianguan/shipinjiankong",
    "aliases": [],
    "view": "src/views/business/waterUse/shipinjiankong/index.vue",
    "agentFile": "src/views/business/waterUse/shipinjiankong/shipinjiankong.ts"
  },
  "zhengzhaoguanli": {
    "path": "/waterUse/zhengzhao",
    "title": "取用水管理 · 证照管理",
    "actUrl": "/waterUse/zhengzhao",
    "aliases": [],
    "view": "src/views/business/waterUse/zhengzhaoguanli/index.vue",
    "agentFile": "src/views/business/waterUse/zhengzhaoguanli/zhengzhaoguanli.ts"
  },
  "qushuiyuebao": {
    "path": "/waterUse/tongji/qushuiyuebao",
    "title": "统计报表 · 取水月报",
    "actUrl": "/waterUse/tongji/qushuiyuebao",
    "aliases": [],
    "view": "src/views/business/waterUse/qushuiyuebao/index.vue",
    "agentFile": "src/views/business/waterUse/qushuiyuebao/qushuiyuebao.ts"
  }
} as const

/** 允许写进能力文件的页面标识；写错 pageKey 会编译失败 */
export type PageKey = keyof typeof pageMeta

/** 历史路径 -> 当前路径：模型旧回答里的 NAVIGATE 仍能跳转 */
export const pageAliases: Readonly<Record<string, string>> = {}
