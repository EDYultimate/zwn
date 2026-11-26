/**
 * 流域调水详情「页签上方两块」的线路配置（旧项目 Page_p + Page_c）
 *
 * - 'month' 线路（漳河/引滦/引黄入冀/南水北调…）：数据源 PORTAL_SYS.MONTH_DATA（本文件即此来源）
 * - 永定河：走 YDH 专属接口（见 YdBlocks.vue）
 * - 山西/滦河/滹沱河：季度录入 SZY_LURU_DATA（接入时在此登记 ids 与起始）
 */
export interface LydsTopCfg {
  /** 卡片标题（旧页面：漳河通水累计） */
  title: string
  /** 累计起始（年，或 'YYYY-MM'） */
  start: string | number
  /** 参与统计的 MONTH_DATA id */
  ids: string[]
}

export const LYDS_TOP_CFG: Record<string, LydsTopCfg> = {
  // 漳河（8 个工程）：自1983年（旧页面该块标题年份）
  ZH: {
    title: '漳河通水累计',
    start: 1983,
    ids: [
      'ZYJD000011',
      'ZYJD000013',
      'ZYJD000019',
      'ZYJD000017',
      'ZYJD000014',
      'ZYJD000015',
      'ZYJD000018',
      'ZYJD000016'
    ]
  },
  // 引滦工程（旧 wwtr_1）：引滦入津 / 引滦入唐 / 滦河下游；全线块标题「自1980年通水累计」
  LD: {
    title: '引滦工程通水累计',
    start: 1980,
    ids: ['ZYJD00001', 'ZYJD00002', 'ZYJD00003']
  },
  // 引黄入冀（旧 wwtr_4）：渠村/位山/潘庄/李家岸等 10 个工程；全线块标题「自1992年通水累计」
  YH_YJ: {
    title: '引黄入冀通水累计',
    start: 1992,
    ids: [
      'ZYJD000020',
      'ZYJD000022',
      'ZYJD000021',
      'ZYJD000023',
      'ZYJD000024-01',
      'ZYJD000026',
      'ZYJD000027-01',
      'ZYJD000028',
      'ZYJD000030',
      'ZYJD000032'
    ]
  },
  // 南水北调（旧 wwtr_5）：受水区（北京市/天津市/河北省/河南省/雄安）+ 东线北延各断面；全线块标题「自1983年通水累计」
  NSBD: {
    title: '南水北调通水累计',
    start: 1983,
    ids: [
      '28',
      '29',
      '30',
      '31',
      '32',
      'ZYJD000029-01',
      'ZYJD000029-02',
      'ZYJD000027-03',
      'ZYJD000024-02',
      'ZYJD000025-01'
    ]
  }
}

/** 该线路是否有页签上方的两块（有则 BasinDetail 隐藏原「当月供水量/调度年累计」总计条，与旧项目版式一致） */
export function hasLydsTopBlocks(lineCd: string) {
  return !!LYDS_TOP_CFG[lineCd]
}
