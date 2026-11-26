import axios from 'axios'
import qs from 'qs'

import env from '@/env'
import responseInterceptors from '@/utils/request/interceptor/response'

import type { AxiosRequestConfig } from 'axios'

const TimeoutLimit = 30

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface PendingType {
  url?: string
  method?: Method
  params: any
  data: any
  cancel: (message?: string) => void
}

const pending: Array<PendingType> = []
const CancelToken = axios.CancelToken

const removePending = (config: AxiosRequestConfig) => {
  for (const key in pending) {
    const item: number = +key
    const list: PendingType = pending[key]
    if (
      list.url === config.url &&
      list.method === config.method &&
      JSON.stringify(list.params) === JSON.stringify(config.params) &&
      JSON.stringify(list.data) === JSON.stringify(config.data)
    ) {
      list.cancel('操作太频繁，请稍后再试')
      pending.splice(item, 1)
    }
  }
}

const axiosOpt = {
  baseURL: env.API_BASE_URL,
  timeout: TimeoutLimit * 1000,
  validateStatus(status: number) {
    return status === 200
  }
}
const request = axios.create(axiosOpt)
export const requestWithoutReqInterceptors = axios.create(axiosOpt)

/**
 * 鉴权头统一出口。流式问答用原生 fetch（axios 拿不到 response body 的 ReadableStream），
 * 不经过请求拦截器，必须从这里取头，避免两处鉴权逻辑各写一份、日后漂移。
 */
export const authHeaders = (): Record<string, string> => ({
  Authorization: 'TODO-TEST',
  token: 'TODO-TEST'
})

request.interceptors.request.use((config) => {
  removePending(config)
  config.cancelToken = new CancelToken((c) => {
    pending.push({
      url: config.url,
      method: config.method as Method,
      params: config.params,
      data: config.data,
      cancel: c
    })
  })
  config.headers['X-Requested-With'] = 'XMLHttpRequest'
  const method = (config.method as string).toLocaleLowerCase()
  if (method === 'get' && config.data !== null && config.data !== undefined) {
    config.url += `?${qs.stringify(config.data, { indices: false })}`
  }
  Object.assign(config.headers, authHeaders())
  return config
})

request.interceptors.request.use(undefined, (error) => {
  if (env.IS_DEV) {
    console.error('axios 请求异常. request 拦截器中捕获异常:', error)
  }
  return Promise.reject(error)
})

responseInterceptors.forEach((interceptor) => {
  request.interceptors.response.use(
    interceptor.fulfilled as Parameters<typeof request.interceptors.response.use>[0],
    interceptor.rejected as Parameters<typeof request.interceptors.response.use>[1]
  )
})

export default request
