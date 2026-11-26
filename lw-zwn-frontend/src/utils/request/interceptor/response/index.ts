import type { ResInterceptor, ResLogInterceptor } from '@/utils/request/type'

import error from '@/utils/request/interceptor/response/error'
import normalizeResponse from '@/utils/request/interceptor/response/normalize'
import printLog from '@/utils/request/interceptor/response/print-log'

const responseInterceptors: (ResInterceptor | ResLogInterceptor)[] = [
  normalizeResponse,
  error, // 异常处理要放最后, 达到 promise.then().then().catch() 的目的
  printLog
]

export default responseInterceptors
