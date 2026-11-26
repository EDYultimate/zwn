import request from '@/utils/request'

export function consistency(params) {
  return request({
    url: '/api/wrDisEval/consistency',
    method: 'GET',
    data: params
  })
}

export function main(params) {
  return request({
    url: '/api/wrDisEval/main',
    method: 'GET',
    data: params
  })
}

export function alloc(params) {
  return request({
    url: '/api/wrDisEval/alloc',
    method: 'GET',
    data: params
  })
}

export function wd(params) {
  return request({
    url: '/api/wrDisEval/wd',
    method: 'GET',
    data: params
  })
}
export function consistencyRate(params) {
  return request({
    url: '/api/wrDisEval/consistencyRate',
    method: 'GET',
    data: params
  })
}
