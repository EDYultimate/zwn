import type { IRequestErrorSchema } from '@/utils/request/type'
import type { App } from 'vue'

function isObject(v: any) {
  return typeof v === 'object' && v !== null
}
/**
 * 新增全局 Promise reject 异常捕获
 * 配合 axios 拦截器, 处理接口异常并且业务中未捕获该异常的情况
 * 对于以上情况, 弹窗提示用户
 *
 *  1. 使用 promise 的 .catch() 捕获
 *  如果不用 .catch() 捕获异常, 全局会通过 Message 提示;
 *  如果使用 .catch() 捕获异常, 全局不会再提示;
 *
 *  举例 1, 会有 Message 提示:
 *  request.get<string>('/api/xx')
 *   .then((res) => {
 *      // 处理业务逻辑
 *    })
 *
 *  举例 2, 不会有 Message 提示
 *  request.get<string>('/api/xx')
 *   .then((res) => {
 *      // 处理业务逻辑
 *    })
 *   .catch((err) => {})
 *
 *  2. 使用 trycatch 捕获
 *  如果在 catch(e) {} 中继续抛出异常, 全局会通过 unhandledrejection 来 Message 提示;
 *  如果在 catch(e) {} 中继续抛出异常, 但抛出的异常中 hasShownErrorMsg 设置为 true,  全局会通过 unhandledrejection 时不再 Message 提示;
 *  如果在 catch(e) {} 中不再抛出异常, 则认为已经处理异常，将不再触发 unhandledrejection;
 *
 *  举例1, 会有 Message 提示:
 *  try {
 *    await getApiData()
 *  } catch(err) {
 *    // 其他操作
 *    // 抛出异常，由上层或 unhandledrejection 处理，若没上层 unhandledrejection 弹框
 *    throw err
 *  }
 *
 *  举例2, 没有 Message 提示:
 *  try {
 *    await getApiData()
 *  } catch(err) {
 *    // 其他操作
 *    // 抛出异常, 但设置 hasShownErrorMsg 为 true, 上层或 unhandledrejection 处理时可检测 err.hasShownErrorMsg === true 为以弹过框不再弹框处理
 *    err.hasShownErrorMsg = true
 *    throw err
 *  }
 *
 *  举例3, 没有 Message 提示:
 *  try {
 *    await getApiData()
 *  } catch(err) {
 *    // 其他操作
 *    // 不抛出异常， 上层或 unhandledrejection 不再会收到异常信息
 *  }
 */

/**
 * 处理接口异常导致的 rejected promise: 弹窗提示用户
 * @param reason Promise rejected reason
 */
export function unhandledRejectionHandler(reason: any) {
  if (isObject(reason) && 'errorType' in reason) {
    const normalizedError = reason as IRequestErrorSchema
    if (!normalizedError.hasShownErrorMsg) {
      const hintText =
        normalizedError.axiosInfo.config?.errorMessageFormatter?.(normalizedError) ??
        normalizedError.message
      try {
        window.$message.error(hintText, {
          type: 'error',
          duration: 5 * 1000
        })
      } catch (e) {
        console.error(e)
      }
    }
  } else {
    console.error(reason)
  }
}

/**
 * 为了能够捕获接口异常导致的 rejected Promise
 * 分别通过 vue3 全局 errorHandler 和 window unhandledrejection 注册事件回调
 * @param {App} app
 */
function addAxiosUnhandledRejectionEvent(app: App) {
  // vue3 生产环境会对 template 中 vnode 绑定的事件回调进行拦截, 会对 rejected promise 进行 .catch() 兜底处理, 然后不会继续抛出异常
  // 所以需要挂载 app.config.errorHandler 事件处理
  app.config.errorHandler = unhandledRejectionHandler

  // 对于 vue 未拦截的 rejected promise 的情况
  // 比如: setup () {
  //  getUserInfo() // 这里接口异常 vue3 没有拦截, 需要在全局注册 unhandledrejection 事件回调来处理
  // }
  window.addEventListener('unhandledrejection', (e) => {
    unhandledRejectionHandler(e.reason)
  })
}

// 需要在 vue 的 app 实例创建后通过 app.use(axiosPlugin) 完成 axios 接口异常处理事件回调的注册
export const axiosErrorHandlerPlugin = {
  install(app: App) {
    addAxiosUnhandledRejectionEvent(app) // 绑定异常事件回调
  }
}
