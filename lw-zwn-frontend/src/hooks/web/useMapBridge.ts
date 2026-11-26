import { onMounted, onUnmounted, watch } from 'vue'

/**
 * gis2 地图 iframe 桥接 composable（public/gis/gis2/index.html）
 * ------------------------------------------------------------------
 * 使用前提：布局层 MapArea 常驻渲染 gis2 地图 iframe（只加载一次），
 * 路由切换地图页面时不再重建 iframe，只调用 changeModule(moduleName) 切换地图模块。
 *
 * gis2 交互协议：
 *  - 地图初始化完成 → postMessage { eventname: 'loaded', state: 'complete' }
 *  - 切换模块        → iframe 内调用 window.changeModule('shipinjiankong') 等
 *  - 切换完成        → postMessage { eventname: 'modulechanged', state: 'complete' }
 *                      （部分异步模块不发该消息，但会在挂载后注册 window.onReceive）
 *  - 业务数据推送    → receive(data, method?)：适配层轮询等模块注册好接收方法
 *                      （默认 onReceive，视频监控模块）后调用，方法名以各模块为准
 *                      watchToMap(() => list.value, toPayload)：数据源变化自动防抖推送
 *  - 要素点击        → postMessage { eventname: 'details', code, name, layername }
 *                      页面可用 options.onFeatureClick 直接收回调（免写 eventname 映射）
 *  - 经纬度定位      → zoomToPoint(lng, lat, zoom?)：封装 map.setMapView$（各模块统一的定位交互）
 *  - 地图控件        → iframe 的 window.map：
 *      zoomIn / zoomOut / resetMapView$ / measureStop / measureLength /
 *      measureArea / changmapModel(type:"1"影像 "2"地形 "3"行政区) / setMapView$
 *
 * 另导出纯函数 parseMapCoord：接口点位经纬度字段（xaxis/xAxis/yaxis/yAxis）
 * → { lng, lat }（number，范围校验），给任意模块装配地图点位载荷时复用。
 */

export interface MapBridgeOptions {
  /** iframe 选择器，默认 '.map-frame'（布局层 MapArea 中的常驻 gis2 iframe） */
  frameSelector?: string
  /**
   * 地图就绪探测的全局方法名，默认 'changeModule'（gis2 应用入口函数）。
   * 旧样例地图页面可显式传入其原有方法名（如 'm_ogetData'）。
   */
  readyMethod?: string
  /** 地图就绪回调（可选） */
  onReady?: (win: Window) => void
  /** postMessage 消息处理映射（可选）：key 为 eventname，如 loaded / modulechanged / details */
  messageHandlers?: Record<string, (data: any) => void>
  /**
   * 地图要素点击快捷回调（details 消息 { code, name, layername }）。
   * 与 messageHandlers.details 等价，只是免写 eventname 映射结构。
   */
  onFeatureClick?: (payload: any) => void
}

/**
 * gis2 地图初始化完成标记（模块级共享，所有 useMapBridge 实例复用）。
 * gis2 在地图实例创建早期就定义了 window.changeModule，但图层引擎尚未 load 完成，
 * 过早 changeModule 会导致模块图层初始化失败 → 必须等 'loaded' 消息（真就绪）后再切模块。
 * 首次 import 本模块时即安装监听，确保能捕获 iframe 的 loaded 消息；
 * 后续创建的 bridge 实例直接读该标记，无需各自等待消息。
 */
let gis2Loaded = false
let gis2LoadedListenerInstalled = false

function ensureGis2LoadedListener() {
  if (gis2LoadedListenerInstalled) {
    return
  }
  gis2LoadedListenerInstalled = true
  window.addEventListener('message', (e: MessageEvent) => {
    if (e.data?.eventname !== 'loaded') {
      return
    }
    // 只认常驻 .map-frame iframe 发来的 loaded，避免误吞其它来源的同名消息
    const frame = document.querySelector<HTMLIFrameElement>('.map-frame')
    if (frame?.contentWindow && e.source === frame.contentWindow) {
      gis2Loaded = true
    }
  })
}

/** 等地图真正加载完成（loaded 消息）后执行；约 60s 超时后仍兜底执行一次 */
function waitMapLoaded(fn: () => void, retry = 0) {
  if (gis2Loaded || retry >= 300) {
    fn()
    return
  }
  setTimeout(() => waitMapLoaded(fn, retry + 1), 200)
}

export function useMapBridge(options: MapBridgeOptions = {}) {
  const {
    frameSelector = '.map-frame',
    readyMethod = 'changeModule',
    onReady,
    messageHandlers,
    onFeatureClick
  } = options

  function getMapFrame(): HTMLIFrameElement | null {
    return document.querySelector<HTMLIFrameElement>(frameSelector)
  }

  function getMapWin(): Window | null {
    return getMapFrame()?.contentWindow ?? null
  }

  /**
   * 等待地图 global 方法就绪后执行回调（轮询）。
   * gis2 首次加载（bundle + 图层配置）可能较慢，默认轮询 60s。
   */
  function callMapReady(fn: (win: Window) => void, retry = 0, maxRetry = 300, interval = 200) {
    const win = getMapFrame()?.contentWindow
    if (win && typeof (win as any)[readyMethod] === 'function') {
      fn(win)
    } else if (retry < maxRetry) {
      setTimeout(() => callMapReady(fn, retry + 1, maxRetry, interval), interval)
    } else {
      console.warn('useMapBridge: 地图应用未就绪，跳过地图调用')
    }
  }

  /**
   * 处理来自地图 iframe 的 postMessage 事件：
   * - details 消息分发给 onFeatureClick 快捷回调；
   * - 其余按 eventname 分发到 messageHandlers
   */
  function onMapMessage(e: MessageEvent) {
    if (!messageHandlers && !onFeatureClick) {
      return
    }
    const data = e.data
    if (!data || !data.eventname) {
      return
    }
    if (data.eventname === 'details' && onFeatureClick) {
      onFeatureClick(data)
    }
    messageHandlers?.[data.eventname]?.(data)
  }

  // ==================== gis2 模块切换 ====================

  /**
   * 等待模块切换完成：收到 modulechanged 消息，或模块注册/更换了 onReceive 函数。
   * （异步 Vue 模块如 shipinjiankong 挂载后才注册 onReceive，且不发 modulechanged）
   * @param before 切换前捕获的 onReceive 引用（用于识别「被新模块替换」）
   */
  function waitForModuleSwitch(win: Window, before: unknown, timeout = 8000): Promise<Window> {
    return new Promise((resolve) => {
      let done = false
      const finish = () => {
        if (done) {
          return
        }
        done = true
        window.removeEventListener('message', onMsg)
        clearInterval(pollTimer)
        clearTimeout(giveUpTimer)
        resolve(win)
      }
      const onMsg = (e: MessageEvent) => {
        if (e.data?.eventname === 'modulechanged') {
          finish()
        }
      }
      window.addEventListener('message', onMsg)
      const pollTimer = setInterval(() => {
        const fn = (win as any).onReceive
        if (typeof fn === 'function' && fn !== before) {
          finish()
        }
      }, 120)
      const giveUpTimer = setTimeout(finish, timeout)
    })
  }

  /**
   * 切换 gis2 地图模块（只切模块，不重载 iframe）。
   * 等地图真正加载完成（loaded）→ changeModule(module) → 等切换完成（modulechanged / onReceive 就绪）。
   * @returns 切换完成后的地图 window（等待超时也会 resolve，调用方自行容错）
   */
  function changeModule(module: string): Promise<Window | null> {
    ensureGis2LoadedListener()
    return new Promise((resolve) => {
      waitMapLoaded(() => {
        callMapReady((win) => {
          const before = (win as any).onReceive
          try {
            ;(win as any).changeModule(module)
          } catch (e) {
            console.warn(`useMapBridge: changeModule(${module}) 调用失败`, e)
            resolve(null)
            return
          }
          waitForModuleSwitch(win, before).then(() => resolve(win))
        })
      })
    })
  }

  // ==================== 业务数据推送（onReceive） ====================

  // 待推送数据 + 轮询状态：模块未就绪时多次 receive 只保留最后一次
  let pendingData: { data: any; method: string } | null = null
  let pollingReceive = false

  /**
   * 向当前 gis2 模块推送业务数据（调用模块在 iframe window 上注册的数据接收方法）。
   * 模块切换期间该方法可能尚未注册：内部轮询等待（约 30s），
   * 等待期间多次调用仅最后一次数据生效（latest-wins）。
   * @param method 模块注册的数据接收方法名，默认 'onReceive'（视频监控模块）；
   *               后续地图模块若换方法名，传对应名字即可，页面代码不用变
   */
  function receive(data: any, method: string = 'onReceive'): void {
    pendingData = { data, method }
    if (pollingReceive) {
      return
    }
    pollingReceive = true
    pollReceive(0)
  }

  function pollReceive(retry: number) {
    // 待发数据已被取消：停止轮询
    if (!pendingData) {
      pollingReceive = false
      return
    }
    const win = getMapWin()
    const fn = win && (win as any)[pendingData.method]
    if (typeof fn === 'function') {
      pollingReceive = false
      const payload = pendingData.data
      pendingData = null
      try {
        fn(payload)
      } catch (e) {
        console.warn('useMapBridge: 推送数据失败', e)
      }
    } else if (retry < 150) {
      setTimeout(() => pollReceive(retry + 1), 200)
    } else {
      pollingReceive = false
      const method = pendingData.method
      pendingData = null
      console.warn(`useMapBridge: 当前地图模块未注册 ${method}，本次数据推送被跳过`)
    }
  }

  /** 取消尚未推送的待发数据（页面卸载时调用，避免离开页面后仍向地图写数据） */
  function cancelReceive(): void {
    pendingData = null
  }

  /**
   * 数据源变化后自动（防抖）推送给地图——覆盖各模块最常见的
   * 「接口列表 / 筛选结果变化 → 重新撒点」模式，页面无需自写 watch + 定时器。
   * @param source 响应式数据源 getter（如 () => filteredList.value）
   * @param toPayload 业务数据 → 地图载荷；返回空数组即清空地图点位
   * @param options.debounce 防抖毫秒，默认 120（避免筛选连点频繁重推）
   * @param options.method 模块接收方法名，默认 'onReceive'
   */
  function watchToMap<T>(
    source: () => T,
    toPayload: (data: T) => any,
    options: { debounce?: number; method?: string } = {}
  ): void {
    const { debounce = 120, method = 'onReceive' } = options
    let timer: ReturnType<typeof setTimeout> | undefined
    watch(
      source,
      (data) => {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          timer = undefined
          receive(toPayload(data), method)
        }, debounce)
      },
      { immediate: true }
    )
    // watch 随组件卸载自动停止，这里只需清掉未触发的防抖定时器
    onUnmounted(() => {
      if (timer) {
        clearTimeout(timer)
      }
    })
  }

  // ==================== 地图控件（window.map） ====================

  /** 调用地图实例方法（就绪后执行）：如 callMap('zoomIn') */
  function callMap(method: string, ...args: any[]): void {
    callMapReady((win) => {
      const fn = (win as any).map?.[method]
      if (typeof fn === 'function') {
        fn(...args)
      } else {
        console.warn(`useMapBridge: 地图方法 ${method} 不存在，跳过调用`)
      }
    })
  }

  /** 地图放大 */
  function zoomIn() {
    callMap('zoomIn')
  }

  /** 地图缩小 */
  function zoomOut() {
    callMap('zoomOut')
  }

  /** 地图复原视角 */
  function resetMapView() {
    callMap('resetMapView$')
  }

  /** 测量长度（先清空再测量） */
  function measureLength() {
    callMap('measureStop')
    callMap('measureLength')
  }

  /** 测量面积（先清空再测量） */
  function measureArea() {
    callMap('measureStop')
    callMap('measureArea')
  }

  /** 清空测量 */
  function measureStop() {
    callMap('measureStop')
  }

  /** 切换底图：type "1" 影像 / "2" 地形 / "3" 行政区 */
  function changeBaseMap(type: '1' | '2' | '3') {
    callMap('changmapModel', type)
  }

  /**
   * 按经纬度把地图缩放定位到目标点（各模块统一的定位交互）。
   * gis2 地图模块内部点击点位也是同样参数：zoom 12 + 动画 800ms。
   */
  function zoomToPoint(lng: number, lat: number, zoom = 12): void {
    callMapReady((win) => {
      const map = (win as any).map
      if (typeof map?.setMapView$ === 'function') {
        map.setMapView$(
          { center: { lng, lat }, zoom, bearing: 0, pitch: 0 },
          { animate: true, duration: 800 }
        )
      }
    })
  }

  function initMapBridge() {
    if (messageHandlers || onFeatureClick) {
      window.addEventListener('message', onMapMessage)
    }
    if (onReady) {
      callMapReady(onReady)
    }
  }

  function destroyMapBridge() {
    if (messageHandlers || onFeatureClick) {
      window.removeEventListener('message', onMapMessage)
    }
    cancelReceive()
  }

  // 自动管理生命周期：挂载时初始化，卸载时清理
  onMounted(initMapBridge)
  onUnmounted(destroyMapBridge)

  return {
    /** 等待地图就绪后执行回调（兼容旧样例地图用法） */
    callMapReady,
    /** 获取地图 iframe 元素 */
    getMapFrame,
    /** 获取地图 iframe 的 window */
    getMapWin,
    /** 切换 gis2 地图模块（不重载 iframe），完成后 resolve */
    changeModule,
    /** 向当前模块推送业务数据（默认调模块注册的 window.onReceive，latest-wins） */
    receive,
    /** 取消未推送的待发数据 */
    cancelReceive,
    /** 数据源变化自动（防抖）推送给地图：watchToMap(() => list.value, toPayload) */
    watchToMap,
    /** 调用地图实例方法 */
    callMap,
    /** 地图控件：放大 / 缩小 / 复原 / 测量 / 底图切换 / 经纬度定位 */
    zoomIn,
    zoomOut,
    resetMapView,
    measureLength,
    measureArea,
    measureStop,
    changeBaseMap,
    /** 按经纬度把地图缩放定位到目标点（封装 map.setMapView$） */
    zoomToPoint,
    /** 手动销毁监听（如需提前清理） */
    destroyMapBridge
  }
}

/**
 * 接口点位经纬度字段 → { lng, lat }（number）。
 * 兼容 xaxis/xAxis、yaxis/yAxis 两种字段名；无效或超范围返回 null。
 * 各业务模块给地图装配点位载荷时复用（onReceive 载荷的经纬度必须是合法 number）。
 */
export function parseMapCoord(source: {
  xaxis?: unknown
  xAxis?: unknown
  yaxis?: unknown
  yAxis?: unknown
}): { lng: number; lat: number } | null {
  const lng = Number(source.xaxis ?? source.xAxis)
  const lat = Number(source.yaxis ?? source.yAxis)
  if (!Number.isFinite(lng) || !Number.isFinite(lat) || Math.abs(lng) > 180 || Math.abs(lat) > 90) {
    return null
  }
  return { lng, lat }
}
