import request from '@/utils/request'

export function wrShtovlAreList(params) {
  return request({
    url: '/api/wrShtovlAre/list',
    method: 'GET',
    data: params
  })
}
