import request from '@/utils/request'

export function statistics(params) {
  return request({
    url: '/api/wrWhs/statistics',
    method: 'GET',
    data: params
  })
}

export function groupCount(params) {
  return request({
    url: '/api/wrWhs/groupCount',
    method: 'GET',
    data: params
  })
}

export function whsProb(params) {
  return request({
    url: '/api/wrWhs/whsProb',
    method: 'GET',
    data: params
  })
}

export function whsList(params) {
  return request({
    url: '/api/wrWhs/getList',
    method: 'GET',
    data: params
  })
}
export function whsPoint(params) {
  return request({
    url: '/api/wrWhs/whsPoint',
    method: 'GET',
    data: params
  })
}

export function findAllList(params) {
  return request({
    url: '/api/wrWhs/findAllList',
    method: 'GET',
    data: params
  })
}
