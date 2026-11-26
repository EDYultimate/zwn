import { onUnmounted } from 'vue'

import { useMapBridge } from '@/hooks/web/useMapBridge'
import type { VideoMapPoint, VideoStation } from '@/api/waterUse/video'

/**
 * 视频监控页地图点位桥接（gis2 常驻地图，模块 mapModule = 'shipinjiankong'）
 * ------------------------------------------------------------------
 * - 地图 iframe 由布局层常驻加载，页面进入时布局层已调 changeModule('shipinjiankong')；
 * - 本 hook 在模块就绪后把 /video/stations 返回的真实点位
 *   （xaxis 经度 / yaxis 纬度 / name 名称 / code 编码 / org 单位 / status 状态）
 *   通过模块的 window.onReceive(data) 灌入地图渲染；
 * - 地图上点击要素（gis2 details 消息 { code, name, layername }）→ 回调 onPointClick(name)。
 */

export interface UseVideoMapPointsOptions {
  /** 地图上点击要素时回传的名称（gis2 details 消息的 name 字段） */
  onPointClick?: (name: string) => void
}

/** 地图缩放定位载荷：经纬度来自接口 xaxis / yaxis，name 作为定位信息 */
export interface VideoMapFocus {
  name: string
  xaxis: number
  yaxis: number
  /** 目标层级，默认 12（与 gis2 视频模块点位定位层级一致） */
  zoom?: number
}

/** 把接口点位转换成地图点位，过滤掉没有有效经纬度的点位 */
export function toVideoMapPoints(stations: VideoStation[]): VideoMapPoint[] {
  const result: VideoMapPoint[] = []
  for (const station of stations || []) {
    const lng = Number(station.xaxis ?? station.xAxis)
    const lat = Number(station.yaxis ?? station.yAxis)
    if (
      !station.name ||
      !Number.isFinite(lng) ||
      !Number.isFinite(lat) ||
      lng < -180 ||
      lng > 180 ||
      lat < -90 ||
      lat > 90
    ) {
      continue
    }
    result.push({
      name: station.name,
      xaxis: lng,
      yaxis: lat,
      code: station.code,
      org: station.org,
      status: station.status,
      site: station.site,
      thumb: station.thumb,
      snapshotCount: station.snapshotCount,
      latestCaptureTime: station.latestCaptureTime
    })
  }
  return result
}

export function useVideoMapPoints(options: UseVideoMapPointsOptions = {}) {
  const { receive, cancelReceive, callMapReady } = useMapBridge({
    messageHandlers: options.onPointClick
      ? {
          // gis2 要素点击：{ eventname: 'details', code, name, layername }
          details: (payload: any) => {
            const name = payload?.name || payload?.STNM
            if (name) {
              options.onPointClick?.(String(name))
            }
          }
        }
      : undefined
  })

  let disposed = false

  /** 用真实点位替换地图上的所有旧点位（onReceive，模块未就绪时轮询、latest-wins） */
  function renderMapPoints(points: VideoMapPoint[]) {
    if (disposed) {
      return
    }
    receive(points)
  }

  /**
   * 按经纬度把地图缩放到指定点位（列表卡片点击时使用）：
   * 调 gis2 地图实例 map.setMapView$({ center, zoom }, { animate, duration })
   */
  function zoomToPoint(point: VideoMapFocus) {
    if (disposed) {
      return
    }
    callMapReady((win) => {
      const map = (win as any).map
      if (map && typeof map.setMapView$ === 'function') {
        map.setMapView$(
          {
            center: { lng: point.xaxis, lat: point.yaxis },
            zoom: point.zoom ?? 12,
            bearing: 0,
            pitch: 0
          },
          { animate: true, duration: 800 }
        )
      }
    })
  }

  onUnmounted(() => {
    disposed = true
    // 离开页面后不再向地图推送本页数据（地图 iframe 常驻不销毁）
    cancelReceive()
  })

  return { renderMapPoints, zoomToPoint }
}
