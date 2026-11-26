import { onMounted, onUnmounted } from 'vue'

import { useMapBridge } from '@/hooks/web/useMapBridge'

/** 地图点位分类：摄像头 / 生态流量 */
export type WaterMapPointCategory = 'camera' | 'eco'

/**
 * 水量监控地图点位桥接
 * - 页面挂载后按分类渲染点位
 * - 页面卸载时清空点位，避免影响其他地图页面
 *
 * @example
 * useWaterMapPoints('camera') // 只渲染摄像头点位
 * useWaterMapPoints('eco')    // 只渲染生态流量点位
 */
export function useWaterMapPoints(category: WaterMapPointCategory) {
  const { callMapReady, getMapFrame } = useMapBridge({
    readyMethod: 'm_oaddWaterMonitorPoints'
  })
  let disposed = false

  onMounted(() => {
    callMapReady((win) => {
      if (disposed) {
        return
      }
      const addPoints = (win as any).m_oaddWaterMonitorPoints
      if (typeof addPoints === 'function') {
        addPoints(category)
      }
    })
  })

  onUnmounted(() => {
    disposed = true
    const win = getMapFrame()?.contentWindow
    const clearPoints = (win as any)?.m_oclearWaterMonitorPoints
    if (typeof clearPoints === 'function') {
      clearPoints()
    }
  })
}
