/**
 * FNV-1a 32 位摘要（与服务端 UiCapabilityService.digest() 算法一致）。
 *
 * 不用 crypto.subtle：内网 http 部署下不可用，这里只需要「内容变没变」的比对。
 */
export function fnv1a32(text: string): string {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    // 等价的 32 位乘法（JS 直接用 * 会丢精度）
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash.toString(16).padStart(8, '0')
}
