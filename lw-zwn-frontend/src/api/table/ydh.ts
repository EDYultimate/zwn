import request from '@/utils/request'

export function ydhTest(params: any) {
  return request({
    url: '/api/ydhSample/test',
    method: 'GET',
    data: params
  })
}

export function queryAllStInfo(params: any) {
  return request({
    url: '/api/ydhSample/queryAllStInfo',
    method: 'GET',
    data: params
  })
}

export function queryRVAVData(params: any) {
  return request({
    url: '/api/ydhSample/queryRVAVData',
    method: 'GET',
    data: params
  })
}

export function queryRVAVLatestData(params: any) {
  return request({
    url: '/api/ydhSample/queryRVAVLatestData',
    method: 'GET',
    data: params
  })
}

export function queryRVAVYearData(params: any) {
  return request({
    url: '/api/ydhSample/queryRVAVYearData',
    method: 'GET',
    data: params
  })
}
