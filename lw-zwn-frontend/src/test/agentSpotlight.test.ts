import { describe, expect, test } from 'vitest'
import {
  clamp01,
  easeInOutCubic,
  expandRect,
  holeRect,
  lerpRect,
  type SpotlightRect
} from '@/agent/spotlight'

/**
 * 引导遮罩的几何计算。
 *
 * 这层决定「暗幕最终停在哪个矩形」，算错会直接把用户要看的数字盖住，
 * 因此把裁剪、插值、缓动单独锁定；DOM 动画本身不在这里测。
 */
describe('spotlight geometry', () => {
  const viewport = { width: 1200, height: 800 }

  test('洞口在元素四周外扩 padding', () => {
    const rect: SpotlightRect = { left: 200, top: 100, width: 120, height: 60 }
    expect(holeRect(rect, viewport, 8)).toEqual({
      left: 192,
      top: 92,
      width: 136,
      height: 76
    })
  })

  test('元素贴视口边缘时洞口被裁剪，不会跑出屏幕让暗幕缺角', () => {
    expect(holeRect({ left: 2, top: 3, width: 40, height: 30 }, viewport, 8)).toEqual({
      left: 0,
      top: 0,
      width: 50,
      height: 41
    })
    expect(holeRect({ left: 1180, top: 780, width: 30, height: 30 }, viewport, 8)).toEqual({
      left: 1172,
      top: 772,
      width: 28,
      height: 28
    })
  })

  test('元素完全在视口外时返回零尺寸洞口（触发上层等待/兜底）', () => {
    const hole = holeRect({ left: 100, top: 2000, width: 80, height: 40 }, viewport, 8)
    expect(hole.width).toBeGreaterThanOrEqual(0)
    expect(hole.height).toBe(0)
  })

  test('收缩插值从全屏起点单调逼近目标矩形', () => {
    const from: SpotlightRect = { left: -2, top: -2, width: 1204, height: 804 }
    const to: SpotlightRect = { left: 500, top: 300, width: 120, height: 60 }
    expect(lerpRect(from, to, 0)).toEqual(from)
    expect(lerpRect(from, to, 1)).toEqual(to)
    expect(lerpRect(from, to, 0.5)).toEqual({
      left: 249,
      top: 149,
      width: 662,
      height: 432
    })
    // 每前进一步，洞口都更小 —— 视觉上就是暗幕持续从四周向内推进
    let prev = Infinity
    for (const p of [0, 0.25, 0.5, 0.75, 1]) {
      const r = lerpRect(from, to, easeInOutCubic(p))
      const area = r.width * r.height
      expect(area).toBeLessThanOrEqual(prev)
      prev = area
    }
  })

  test('插值与外扩对越界进度做裁剪，不产生负宽高', () => {
    const to: SpotlightRect = { left: 10, top: 10, width: 20, height: 20 }
    expect(lerpRect(to, to, 1.8).width).toBe(20)
    expect(clamp01(-1)).toBe(0)
    expect(clamp01(2)).toBe(1)
    expect(expandRect(to, 12)).toEqual({
      left: -2,
      top: -2,
      width: 44,
      height: 44
    })
    expect(expandRect({ left: 5, top: 5, width: 10, height: 10 }, -20).width).toBe(0)
  })

  test('缓动端点固定且中段不过冲', () => {
    expect(easeInOutCubic(0)).toBe(0)
    expect(easeInOutCubic(1)).toBe(1)
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 6)
    for (const p of [0.1, 0.3, 0.7, 0.9]) {
      expect(easeInOutCubic(p)).toBeGreaterThanOrEqual(0)
      expect(easeInOutCubic(p)).toBeLessThanOrEqual(1)
    }
  })
})
