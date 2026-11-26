import request from '@/utils/request'

export function queryDemo(params: any) {
  return request({
    url: '/api/v1/url',
    method: 'GET',
    data: params
  })
}

export function findTestList(params: any) {
  return request({
    url: '/api/example/sysTest2/findList_mybatis',
    method: 'GET',
    data: params
  })
}
