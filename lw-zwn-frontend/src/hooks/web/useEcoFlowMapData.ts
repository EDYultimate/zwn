import { getEcoFlowSections } from '@/api/ecology'
import { whsPoint } from '@/api/hwwr/wrWhs'
import { useMapBridge } from '@/hooks/web/useMapBridge'

/**
 * 地图撒点数据推送 composable（多模块 / 多数据集复用）
 *
 * 解决的三个问题：① 地图 iframe 在布局层，各页面写法不一；② 数据取一次就够，不该每个模块各请求一遍；
 * ③ 切模块时 iframe 会重新加载、GIS 端状态清零，必须在每次加载后重推。
 *
 * 内置数据源 = 生态流量三类断面（WR_ECO_SEC_B，197 条），配合 gismapbox 的统一入口
 * `window.setStationData(data)`（见 public/gismapbox/src/core/stationLayers.js）；
 * **推另一组撒点数据时**传 `fetcher` + `mapRows`（+ `cacheKey`），方法名按 GIS 约定给 `methodName`。
 *
 * 行为：
 *  - 以 methodName 作为「地图就绪」标志（探测到该方法即视为地图加载完成）→ 就绪后推送；
 *  - 数据按 cacheKey 缓存：同一会话内多个模块复用同一次请求（refresh() 可强制刷新）；
 *  - 地图方法不存在时静默跳过（可选链防御）；探测超时仅 warn。
 *
 * ⚠️ 推送时机：布局层地图宿主 MapArea.vue 已接入内置数据源（onMounted + 每次 iframe load），
 * 页面无需自行推送；若确需自控时机（例如自定义数据集），用 `autoPush: false` + 显式 `push()`。
 *
 * 用法：
 *  // A. 内置：生态流量三类断面（布局层已接入，页面一般不用管）
 *  const { push } = useEcoFlowMapData({ autoPush: false })
 *  // B. 另一组撒点数据
 *  const { push } = useEcoFlowMapData({
 *    methodName: 'setXxxData',            // GIS 侧约定入口（不能占用 setStationData 共享图层）
 *    cacheKey: 'xxx-points',
 *    fetcher: async () => (await getXxxPoints()).data,
 *    mapRows: (rows) => rows.map((r) => ({ stcd: r.code, name: r.nm, lngLat: [+r.x, +r.y] }))
 *  })
 */
const cache = new Map<string, any[]>()

/** 取数函数：force=true 时忽略缓存强制重新请求 */
export type StationFetcher = (force: boolean) => Promise<any[] | null>

export interface UseEcoFlowMapDataOptions {
  /** GIS 端接收方法名（同时作为地图就绪探测标志），默认 setStationData */
  methodName?: string
  /** 内置数据源范围（生态流量断面专用）：all 全部断面（默认）/ tracked 仅重点跟踪断面 */
  scope?: 'all' | 'tracked'
  /** 自定义数据源（推另一组撒点数据时传）；不传则用生态流量断面接口 */
  fetcher?: StationFetcher
  /** 行 → GIS 字段的映射；不传则用内置 toStationRows（三类断面映射） */
  mapRows?: (rows: any[]) => any[]
  /** 缓存键：不同数据集务必区分（传了 fetcher 又不给 cacheKey 时不做缓存，每次 push 都请求） */
  cacheKey?: string
  /** 是否忽略缓存强制重新请求 */
  force?: boolean
  /** 是否在挂载时自动推送一次（默认 true；由调用方按 iframe load 触发时传 false） */
  autoPush?: boolean
}

/**
 * 生态流量断面行 → gismapbox 统一站点字段（setStationData 约定）：
 * stcd / name / type / river / riverSystem / lngLat / targetType / targetValue。
 * 无坐标的行直接丢弃（否则 Number(null)=0 会在几内亚湾画出假点）。
 */
export function toStationRows(rows: any[]): any[] {
  if (!Array.isArray(rows)) {
    return []
  }
  return rows
    .filter((r) => r && r.lgd != null && r.ltt != null)
    .map((r) => ({
      stcd: r.secCd,
      name: r.secNm,
      // 三类断面：河湖控制断面 / 跨省河湖控制断面省内批复 / 已建水利水电工程
      type: r.secTpNm,
      river: r.rvLkNm,
      riverSystem: r.rvSysNm,
      lngLat: [Number(r.lgd), Number(r.ltt)],
      targetType: r.tgtTpText,
      targetValue: r.tgtVl
    }))
}

export function useEcoFlowMapData(options: UseEcoFlowMapDataOptions = {}) {
  const methodName = options.methodName || 'setStationData'
  const scope = options.scope || 'all'
  // 自定义数据源未给缓存键时不缓存，避免与内置断面数据互相污染
  const cacheKey = options.cacheKey || (options.fetcher ? '' : scope)
  const mapRows = options.mapRows || toStationRows

  /** 内置数据源：生态流量三类断面（WR_ECO_SEC_B） */
  async function fetchEcoFlowSections(): Promise<any[] | null> {
    try {
      const res = await getEcoFlowSections({ scope })
      if (res.code === 0 && res.data && Array.isArray(res.data.rows)) {
        return res.data.rows
      }
    } catch (e) {
      console.warn('useEcoFlowMapData: getEcoFlowSections failed', e)
    }
    return null
  }

  async function fetchRows(force: boolean): Promise<any[] | null> {
    if (!force && cacheKey) {
      const hit = cache.get(cacheKey)
      if (hit) {
        return hit
      }
    }
    const rows = await (options.fetcher ? options.fetcher(!!force) : fetchEcoFlowSections())
    if (rows && cacheKey) {
      cache.set(cacheKey, rows)
    }
    return rows
  }

  // 就绪探测标志固定为 methodName；autoPush=false 时只关掉挂载即推，探测能力保留给调用方的 push()
  const { callMapReady } = useMapBridge(
    options.autoPush === false
      ? { readyMethod: methodName }
      : { readyMethod: methodName, onReady: () => push() }
  )

  /** 推送一次：取数（命中缓存不再请求）→ 等地图方法就绪 → 调用 */
  async function push() {
    const rows = await fetchRows(!!options.force)
    const stations = mapRows(rows || [])
    if (!stations.length) {
      return
    }
    callMapReady((win) => (win as any)[methodName]?.(stations))
  }

  return {
    callMapReady,
    /** 推送一次（地图未就绪时轮询等待；数据命中缓存不重复请求） */
    push,
    /** 强制刷新数据（下次推送用最新；如地图已就绪可再调 push 推送） */
    refresh: () => fetchRows(true)
  }
}

/** 语义化别名：推送到地图的撒点数据（与 useEcoFlowMapData 同一个实现） */
export const useMapStationPush = useEcoFlowMapData

// ============================================================================
// 数据集二：饮用水水源地点位（55 个）→ GIS setDrinkingWaterData
// ============================================================================

/**
 * 水源地点位行 → 地图字段：保留原始字段（WHS_CD/WHS_TP/WQ_ASSESS/…），
 * 另补归一化字段 stcd / name / lngLat；无经纬度的行丢弃。
 */
export function toWaterSourceRows(rows: any[]): any[] {
  if (!Array.isArray(rows)) {
    return []
  }
  return rows
    .filter((r) => r && r.LNG != null && r.LAT != null)
    .map((r) => ({
      ...r,
      stcd: r.WHS_CD,
      name: r.WHS_NM,
      lngLat: [Number(r.LNG), Number(r.LAT)]
    }))
}

/** 取水源地点位：接口必传报告年份，当前年无数据时回退上一年（2026 暂无数据 → 取 2025） */
async function fetchWaterSourceRows(): Promise<any[] | null> {
  const now = new Date().getFullYear()
  for (const yr of [now, now - 1]) {
    try {
      const res = await whsPoint({ rptYr: String(yr) })
      if (res && res.code === 0 && Array.isArray(res.data) && res.data.length) {
        return res.data
      }
    } catch (e) {
      console.warn('useWaterSourceMapData: whsPoint failed', e)
    }
  }
  return null
}

/**
 * 饮用水水源地 55 个点位 → GIS `setDrinkingWaterData`（与三类断面同一套投送机制，独立缓存键）。
 * 用法与 useEcoFlowMapData 完全一致（options 同名同义），可覆盖 methodName/force/autoPush 等。
 */
export function useWaterSourceMapData(options: UseEcoFlowMapDataOptions = {}) {
  return useEcoFlowMapData({
    methodName: 'setDrinkingWaterData',
    cacheKey: 'water-source-points',
    fetcher: fetchWaterSourceRows,
    mapRows: toWaterSourceRows,
    autoPush: false,
    ...options
  })
}
