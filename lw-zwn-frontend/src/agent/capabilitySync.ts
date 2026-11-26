import router from '@/router/instance'
import { agentStore } from '@/store/modules/agentAgent'

/**
 * 能力声明的同步调度器。
 *
 * <p>解决的核心问题：以前只有「用户打开某个业务页」才会上报该页声明，
 * 于是刚进系统直接打开问答页时，后端清单是空的，模型只能说「暂无该页面」。
 *
 * <p>策略：**启动即全量上报 + 之后只做指纹校验**。
 * <ul>
 *   <li>启动（首屏就绪、登录完成）→ 一次全量上报，不依赖用户逛过哪些页面；</li>
 *   <li>之后每 {@link SYNC_INTERVAL_MS} 分钟、页面重新可见、网络恢复 → 只查一次指纹，
 *       与本地 `route@version` 摘要一致就跳过，不一致才补发；</li>
 *   <li>后端重启导致缓存清空时，指纹比对会立刻发现（服务端 digest 变回 "0"）并自动补报，
 *       不需要用户手动刷新。</li>
 * </ul>
 *
 * <p>为什么不定时盲目全量重发：每次全量都会重建 target 索引并落盘，
 * 多标签页 / 多用户时全是无谓写入。指纹比对是一个几十字节的 GET，成本可忽略。
 */

/** 定时校验间隔（仅查指纹，内容一致不写） */
const SYNC_INTERVAL_MS = 5 * 60 * 1000

/** 首次同步失败后的退避重试（毫秒）：登录态未就绪、后端刚启动都可能失败一次 */
const RETRY_DELAYS = [3000, 10000, 30000]

/** 页面重新可见时，距上次尝试小于该值就跳过（避免频繁切 tab 触发请求） */
const VISIBLE_MIN_GAP_MS = 30 * 1000

/** 幂等标记：HMR 或多处调用只挂一次监听 */
let started = false

/**
 * 启动同步调度（在应用 bootstrap 完成、路由就绪后调用一次）。
 */
export function startCapabilitySync(): void {
  if (started) {
    return
  }
  started = true

  const store = agentStore()
  let lastAttemptAt = 0
  let retryIndex = 0

  /** 执行一次同步；失败按退避表重试 */
  const sync = async (force = false): Promise<void> => {
    lastAttemptAt = Date.now()
    const ok = await store.syncCapabilities(force)
    if (ok) {
      retryIndex = 0
      return
    }
    const delay = RETRY_DELAYS[retryIndex]
    if (delay === undefined) {
      console.warn('[agent] 能力声明多次同步失败，等待下次页面可见或定时任务重试')
      return
    }
    retryIndex += 1
    window.setTimeout(() => void sync(force), delay)
  }

  // 1. 首屏渲染后立刻同步：此时静态声明已随首屏 JS 加载完毕，不依赖任何业务页访问
  window.requestAnimationFrame(() => {
    window.setTimeout(() => void sync(), 300)
  })

  // 2. 登录完成 / 路由切换：启动时若因未登录失败过，这里补一次（syncedDigest 为空才发）
  router.afterEach(() => {
    if (!store.syncedDigest) {
      void sync()
    }
  })

  // 3. 页面重新可见（用户从别的 tab 切回来）：低频校验，兜住后端重启/发布
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') {
      return
    }
    if (Date.now() - lastAttemptAt < VISIBLE_MIN_GAP_MS) {
      return
    }
    void sync()
  })

  // 4. 网络恢复：内网断线重连后补一次，避免整场会话都处于「清单为空」
  window.addEventListener('online', () => void sync())

  // 5. 定时校验：只查指纹，一致就什么都不做
  window.setInterval(() => {
    if (document.visibilityState === 'visible') {
      void sync()
    }
  }, SYNC_INTERVAL_MS)

  console.info(
    '[agent] 能力声明同步调度已启动：启动全量上报，之后每',
    SYNC_INTERVAL_MS / 60000,
    '分钟校验指纹'
  )
}
