/**
 * 编写一个无外部依赖的简易Toast,解决 naive-ui 必须在入口组件实例化成功后才能使用 useMessage() 的问题
 * 使用当前 Toast 方法, 可以在任意地方引入
 *
 * Toast.success('操作成功！');
 * Toast.info('这是一条信息');
 * Toast.warn('这是一条警告', 5000);
 * Toast.error('出现错误', 5000);
 */

/**
 * Toast 消息类型定义
 */
type ToastType = 'info' | 'success' | 'warn' | 'error'

interface ToastConfig {
  color: string
  icon: string
}

class Toast {
  private static container: HTMLDivElement | null = null
  private static isStyleInjected = false

  private static readonly TYPE_CONFIG: Record<ToastType, ToastConfig> = {
    success: {
      color: '#67C23A',
      icon: '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>'
    },
    error: {
      color: '#F56C6C',
      icon: '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>'
    },
    warn: {
      color: '#E6A23C',
      icon: '<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>'
    },
    info: {
      color: '#909399',
      icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>'
    }
  }

  private constructor() {} // 防止实例化

  /**
   * 初始化全局容器和样式
   */
  private static init(): void {
    if (!this.isStyleInjected) {
      const style = document.createElement('style')
      style.innerHTML = `
        @keyframes toastIn { 
          from { opacity: 0; transform: translate(-50%, -20px); } 
          to { opacity: 1; transform: translate(-50%, 0); } 
        }
        @keyframes toastOut { 
          from { opacity: 1; transform: translate(-50%, 0); } 
          to { opacity: 0; transform: translate(-50%, -20px); } 
        }
        .ts-toast-item {
          position: fixed; left: 50%;
          background: #fff; padding: 12px 16px; border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex; align-items: center; min-width: 320px;
          z-index: 9999; font-family: sans-serif;
          animation: toastIn 0.3s ease-out forwards;
          pointer-events: auto;
        }
      `
      document.head.appendChild(style)
      this.isStyleInjected = true
    }

    if (!this.container) {
      this.container = document.createElement('div')
      this.container.id = 'ts-toast-container'
      // 容器仅作为逻辑参考，实际 item 靠 fixed 定位来处理堆叠高度偏移
      document.body.appendChild(this.container)
    }
  }

  /**
   * 显示 Toast
   */
  public static show(message: string, type: ToastType = 'info', duration: number = 3000): void {
    this.init()

    const config = this.TYPE_CONFIG[type]
    const toastElement = document.createElement('div')
    toastElement.className = 'ts-toast-item'

    // 计算堆叠偏移量（简单实现：根据当前页面已有的 toast 数量）
    const activeToasts = document.querySelectorAll('.ts-toast-item')
    const offset = 20 + activeToasts.length * 60
    toastElement.style.top = `${offset}px`

    toastElement.innerHTML = `
      <div style="width: 20px; height: 20px; background: ${config.color}; border-radius: 50%; 
                  display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0;">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="#fff">
          ${config.icon}
        </svg>
      </div>
      <div style="color: #606266; font-size: 14px; line-height: 1.4; word-break: break-all;">${message}</div>
    `

    document.body.appendChild(toastElement)

    // 定时移除
    setTimeout(() => {
      toastElement.style.animation = 'toastOut 0.3s ease-in forwards'
      toastElement.addEventListener('animationend', () => {
        toastElement.remove()
        this.reposition() // 移除后重新计算剩余 Toast 的位置
      })
    }, duration)
  }

  /**
   * 重新计算所有 Toast 的位置（使堆叠平滑）
   */
  private static reposition(): void {
    const activeToasts = document.querySelectorAll('.ts-toast-item') as NodeListOf<HTMLDivElement>
    activeToasts.forEach((toast, index) => {
      toast.style.transition = 'top 0.3s ease'
      toast.style.top = `${20 + index * 60}px`
    })
  }

  // 快捷方法
  static success(msg: string, dur?: number) {
    this.show(msg, 'success', dur)
  }
  static error(msg: string, dur?: number) {
    this.show(msg, 'error', dur)
  }
  static warn(msg: string, dur?: number) {
    this.show(msg, 'warn', dur)
  }
  static info(msg: string, dur?: number) {
    this.show(msg, 'info', dur)
  }
}

export default Toast
