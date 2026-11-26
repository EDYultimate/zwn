import type { AxiosError, AxiosResponse } from 'axios'

export interface IResPage {
  pageNum: number
  pageSize: number
  pages: number
  total: number
}

export interface ResponseSchema<T = any> {
  code: string | number
  data: T
  message: string
  page?: IResPage
  axiosRes: AxiosResponse
}

// 自定义 axios http 请求响应异常时的 error 对象
export type IRequestErrorType =
  | 'axios' // axios 内部异常
  | 'custom' // 拦截器中抛出的异常, 如 业务异常

/**
 * 前端自定义错误码
 * 用字符串方式记录, 便于在日志中直接判断异常类型
 * 如果用纯数字方式记录, 还需再到这里对应关系
 */
export enum IRequestErrorCode {
  UNKNOWN = 'UNKNOWN',
  TIME_OUT = 'TIME_OUT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UN_AUTH = 'UN_AUTH 401',
  NOT_FOUND = 'NOT_FOUND 404'
}

export interface IRequestErrorSchema {
  // 这里的 code 包含两种情况
  // 1. HTTP Status 200, 但业务接口返回的 code 为异常情况: 此时的 code 值 = 业务接口返回的 code 值
  // 2. axios 内部异常: 比如超时,404,接口鉴权失败 401等, 此时 code 值 = IRequestErrorCode
  // TODO: 和后端沟通, 枚举出所有的错误 code
  code: string | number | IRequestErrorCode
  message: string
  errorType: IRequestErrorType
  axiosInfo: Pick<AxiosError, 'config' | 'request' | 'response'>
  hasShownErrorMsg?: boolean
}

export interface ResInterceptor {
  fulfilled?: (response: AxiosResponse) => Promise<any>
  rejected?: (response: AxiosError) => Promise<any>
}
export interface ResLogInterceptor {
  fulfilled?: (response: ResponseSchema) => Promise<any>
  rejected?: (response: IRequestErrorSchema) => Promise<any>
}
