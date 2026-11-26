import request from '@/utils/request'

export function findSysTest2List(params: any) {
  return request({
    url: '/api/example/sysTest2/findList_mybatis',
    method: 'GET',
    data: params
  })
}

export function findSysTest2ById(id: string) {
  return request({
    url: '/api/example/sysTest2/findById',
    method: 'GET',
    data: { id }
  })
}

export function addSysTest2(data: any) {
  return request({
    url: '/api/example/sysTest2/add',
    method: 'POST',
    data
  })
}

export function updateSysTest2(data: any) {
  return request({
    url: '/api/example/sysTest2/update',
    method: 'POST',
    data
  })
}

export function deleteSysTest2(id: string) {
  return request({
    url: '/api/example/sysTest2/delete',
    method: 'POST',
    data: { id }
  })
}
