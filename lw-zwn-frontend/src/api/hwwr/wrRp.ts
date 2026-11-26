import request from '@/utils/request'

export function awSum(params) {
  return request({
    url: '/api/wrRp/awSum',
    method: 'GET',
    data: params
  })
}

export function awDetail(params) {
  return request({
    url: '/api/wrRp/awDetail',
    method: 'GET',
    data: params
  })
}
