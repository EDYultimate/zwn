/*
 * 对返回结果进行归一化的响应拦截器
 * */

import type { AxiosResponse } from 'axios'
import type { IRequestErrorSchema, ResInterceptor, ResponseSchema } from '@/utils/request/type'

export const CODE = {
  SUCCESS: [
    '200',
    0 // 常规接口正常响应
  ],
  FAIL: '99999' // 后端服务器未处理的异常(一长串), 比如 sql 插入异常
}

function normalizeResponse(
  axiosRes: AxiosResponse<Blob | Omit<ResponseSchema, 'axiosRes'>>
): ResponseSchema {
  const { data: res } = axiosRes

  if (res instanceof Blob) {
    return {
      code: CODE.SUCCESS[0],
      message: 'SUCCESS',
      data: res,
      axiosRes
    }
  }
  return {
    code: res.code,
    message: res.message,
    data: res.data,
    page: res.page,
    axiosRes
  }
}

/**
 * 统一处理响应数据的错误格式函数
 * @param errorObj 错误对象
 * @param response blob 格式时 该参数为通过 JSON.parse(await response.data.text()) 得到的错误对象
 *                 其他格式为 normalizeResponse 函数返回对象
 */
function handleErrorFn(errorObj: ResponseSchema, response: AxiosResponse): IRequestErrorSchema {
  const code = errorObj.code
  const errorMsg = errorObj.message
  const err: IRequestErrorSchema = {
    errorType: 'custom',
    code,
    message: '',
    axiosInfo: {
      config: response.config,
      request: response.request,
      response
    }
  }

  if (code === CODE.FAIL) {
    // 1. 服务端内部错误, 主要是服务端未处理的异常情况
    err.message = errorMsg ?? '服务器内部异常，请稍后再试'
  } else {
    // 2. 业务失败, 服务端已处理过的异常情况
    err.message = errorMsg ?? '请求失败'
  }
  return err
}

const normalizeResInterceptor: ResInterceptor = {
  fulfilled: async (response: AxiosResponse): Promise<ResponseSchema> => {
    const normalizedRes = normalizeResponse(response)
    if (response.config.responseType === 'blob') {
      // 处理下载文件
      /**
       * 解决由于 TS 限制接受文件类型为 blob, 导致当返回 JSON 格式后 axios 将其转换为 blob 格式
       */
      if (response.data.type === 'application/json') {
        // 从 blob 中获取 JOSN 信息 例如: {"code": "B0320", "message": "请求失败"}
        // Blob.text() 方法返回一个 Promise 对象, 包含 blob 中的内容  参考自: https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/text
        const blobErrorRes = JSON.parse(await response.data.text())
        const code = blobErrorRes.code // 服务关闭后 后端返回错误码

        if (!CODE.SUCCESS.includes(code)) {
          // 业务请求失败
          return Promise.reject(handleErrorFn(blobErrorRes, response))
        } // 业务请求失败,服务器已处理过的异常情况
        return Promise.reject(normalizedRes)
      } // 业务请求成功
      return Promise.resolve(normalizedRes)
    }
    const code = normalizedRes.code
    if (CODE.SUCCESS.includes(code)) {
      // 业务请求成功
      return Promise.resolve(normalizedRes)
    } // 业务请求失败, 可能多种原因
    return Promise.reject(handleErrorFn(normalizedRes, response))
  },
  rejected: undefined // 保证 Axios 或者前面的拦截器抛出的异常可以继续抛给下一个拦截器
}

export default normalizeResInterceptor
