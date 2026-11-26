import type { IRequestErrorSchema, ResInterceptor } from '@/utils/request/type'
import type { AxiosError } from 'axios'

// import env from '@/env'
import { redirectToLoginURL } from '@/utils/auth'
import { IRequestErrorCode } from '@/utils/request/type'

const HTTP_STATUS = {
  UNAUTHORIZED: 401, // 未授权, 后台目前通过 HTTP Code 判断是否授权
  NOT_FOUND: 404
}

const interceptor: ResInterceptor = {
  fulfilled: undefined, // 等效于 res => res,
  rejected(error: AxiosError | IRequestErrorSchema): Promise<never> {
    // if (env.IS_DEV) {
    //   console.log('axios 请求异常. response 拦截器中捕获异常:', error) // for debug
    // }
    let normalizedError: IRequestErrorSchema
    if ('isAxiosError' in error) {
      let msg = ''
      let errorCode

      if (error.code === 'ECONNABORTED') {
        // timeout error code: https://stackoverflow.com/a/50620317
        msg = '请求失败， 服务器未返回内容，请稍后再试'
        errorCode = IRequestErrorCode.TIME_OUT
      } else if (error.message === 'Network Error') {
        // 网络错误, 比如和服务端无法建立连接
        msg = '请求失败， 请检查网络连接并重启客户端'
        errorCode = IRequestErrorCode.NETWORK_ERROR
      } else {
        const status = error.response?.status ?? -999
        if (status === HTTP_STATUS.UNAUTHORIZED) {
          errorCode = IRequestErrorCode.UN_AUTH
          msg = '访问未授权'
        } else if (status === HTTP_STATUS.NOT_FOUND) {
          errorCode = IRequestErrorCode.NOT_FOUND
          msg = '请求地址不存在'
        } else {
          errorCode = error.code ?? IRequestErrorCode.UNKNOWN
          msg = error.message
        }
      }

      normalizedError = {
        errorType: 'axios',
        message: msg,
        code: errorCode,
        axiosInfo: {
          request: error.request,
          config: error.config,
          response: error.response
        },
        hasShownErrorMsg: false
      }

      if (errorCode === IRequestErrorCode.UN_AUTH) {
        normalizedError.message = '即将跳转登录'
        const hintText =
          error.config?.errorMessageFormatter?.(normalizedError) ?? normalizedError.message
        console.error(hintText)
        window.$message.info(hintText)
        normalizedError.hasShownErrorMsg = true
        // openLogoutMsgBox(hintText)
        setTimeout(() => {
          redirectToLoginURL()
        }, 1000)
      }
    } else {
      // Axios 内部或者其他拦截器 fulfilled()/rejected() 执行过程中抛出的异常, 应该继续抛出去
      normalizedError = error
    }

    return Promise.reject(normalizedError)
  }
}

export default interceptor
