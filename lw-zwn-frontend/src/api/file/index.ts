import request from '@/utils/request'

export function downloadFileApi(id: string) {
  return request({
    url: `/api/file/download/${id}`,
    method: 'GET',
    responseType: 'blob'
  })
}

export function viewFileApi(id: string) {
  return request({
    url: `/api/file/view/${id}`,
    method: 'GET'
  })
}
