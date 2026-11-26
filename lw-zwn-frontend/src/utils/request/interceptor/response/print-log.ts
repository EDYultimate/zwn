import type { IRequestErrorSchema, ResLogInterceptor } from '@/utils/request/type'

import env from '@/env'

export const logInterceptor: ResLogInterceptor = {
  fulfilled: (normalizedResponse) => {
    if (env.IS_DEV) {
      const { config } = normalizedResponse.axiosRes
      try {
        console.log(
          `%c ${config?.method?.toUpperCase()} %c ${config.baseURL}${config.url}  %c`,
          'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
          'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
          'background:transparent'
        )
        console.log(
          '%c Params:',
          'background:#41b883 ; padding: 1px; border-radius: 3px;  color: #fff',
          JSON.stringify(config.params ?? null, null, 2)
        )
        console.log(
          '%c Request Body:',
          'background:#41b883 ; padding: 1px; border-radius: 3px;  color: #fff',
          JSON.parse(JSON.stringify(config.data ?? null, null, 2))
        )
        console.log(
          '%c 原始的 Response:',
          'background:#41b883 ; padding: 1px; border-radius: 3px;  color: #fff',
          JSON.parse(JSON.stringify(normalizedResponse.axiosRes.data))
        )
        console.log(
          '%c 处理后 Response:',
          'background:#41b883 ; padding: 1px; border-radius: 3px;  color: #fff',
          JSON.parse(JSON.stringify(normalizedResponse))
        )
      } catch (e) {
        console.error('axios 拦截器: print-log 异常:', e)
      }
    }

    return Promise.resolve(normalizedResponse)
  },
  rejected: (normalizedError: IRequestErrorSchema) => {
    if (env.IS_DEV) {
      const { config } = normalizedError.axiosInfo
      const responseData = normalizedError.axiosInfo.response?.data ?? '无'
      const { errorType, code, message } = normalizedError

      try {
        console.log(
          // @ts-ignore
          `%c ${config?.method?.toUpperCase()} %c ${config.baseURL}${config.url}  %c`,
          'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
          'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
          'background:transparent'
        )
        console.log(
          '%c Params:',
          'background:#41b883 ; padding: 1px; border-radius: 3px;  color: #fff',
          // @ts-ignore
          JSON.stringify(config.params ?? null, null, 2)
        )
        console.log(
          '%c Request Body:',
          'background:#41b883 ; padding: 1px; border-radius: 3px;  color: #fff',
          // @ts-ignore
          JSON.parse(JSON.stringify(config.data ?? null, null, 2))
        )
        console.log(
          '%c Response:',
          'background:#41b883 ; padding: 1px; border-radius: 3px;  color: #fff',
          JSON.parse(JSON.stringify(responseData))
        )
        console.log(
          '%c Error:',
          'background:#dc362e ; padding: 1px; border-radius: 3px;  color: #fff',
          JSON.parse(JSON.stringify({ errorType, code, message }))
        )
      } catch (e) {
        console.error('axios 拦截器: print-log 异常:', e)
      }
    }

    return Promise.reject(normalizedError) // 保证 Axios 或者前面的拦截器抛出的异常可以继续抛给下一个拦截器
  }
}

export default logInterceptor
