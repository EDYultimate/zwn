/*
 * 因为在 axios 的 response 拦截器中对响应进行了处理
 * 所以需要对 axios 请求返回的参数类型进行重新定义
 * 采用模块扩充的方式, 对 AxiosInstance 的方法进行覆盖
 * 参考自:
 * */

import type { IRequestErrorSchema, ResponseSchema } from '@/utils/request/type'

export type IResponse<T = any> = Promise<ResponseSchema<T>>

declare module 'axios' {
  export interface AxiosRequestConfig {
    // 以下为 axios config 拓展字段

    // 将会把 返回值赋值给 ElMessage.error ，用于自定义错误信息
    errorMessageFormatter?: (err: IRequestErrorSchema) => string

    /**
     * 表示接口是否需要授权访问
     *
     * 是前端鉴权体系中的一项配置, 用于 request interceptor 中
     *
     * true 代表该接口需要授权访问(比如获取用户信息)
     *
     * false 表示不需要(比如登录接口)
     * 默认 true
     */
    // needAuth?: boolean
  }
  export interface AxiosInstance {
    <T = any, R = ResponseSchema<T>>(config: AxiosRequestConfig): Promise<R>
    <T = any, R = ResponseSchema<T>>(url: string, config?: AxiosRequestConfig): Promise<R>
    request: <T = any, R = ResponseSchema<T>>(config: AxiosRequestConfig) => Promise<R>
    get: <T = any, R = ResponseSchema<T>>(url: string, config?: AxiosRequestConfig) => Promise<R>
    delete: <T = any, R = ResponseSchema<T>>(url: string, config?: AxiosRequestConfig) => Promise<R>
    head: <T = any, R = ResponseSchema<T>>(url: string, config?: AxiosRequestConfig) => Promise<R>
    post: <T = any, R = ResponseSchema<T>>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ) => Promise<R>
    put: <T = any, R = ResponseSchema<T>>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ) => Promise<R>
    patch: <T = any, R = ResponseSchema<T>>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ) => Promise<R>
  }
}
