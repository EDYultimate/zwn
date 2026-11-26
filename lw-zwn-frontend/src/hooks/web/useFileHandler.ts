import { useMessage } from 'naive-ui'

import type { AxiosError, AxiosResponse } from 'axios'
import type { UploadFileInfo } from 'naive-ui'

import { downloadFileApi, viewFileApi } from '@/api/file'
import request from '@/utils/request'

export const ALLOWED_FILE_TYPES = {
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
} as const

export const DEFAULT_ALLOWED_TYPES = [
  ALLOWED_FILE_TYPES.PDF,
  ALLOWED_FILE_TYPES.DOC,
  ALLOWED_FILE_TYPES.DOCX
]

export function downloadBlob(blobData: BlobPart, fileName: string) {
  const blob = blobData instanceof Blob ? blobData : new Blob([blobData])
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(objectUrl), 100)
}

export async function downloadFile(id: string, fileName = '未命名文件') {
  const res = await downloadFileApi(id)
  downloadBlob(res.data, fileName)
}

export async function exportExcel(url: string, params: any, fileName = '导出文件.xlsx') {
  const res = await request.get(url, { params, responseType: 'blob' })
  downloadBlob(res.data, fileName)
}

export async function previewFile(id: string) {
  const res = await viewFileApi(id)
  if (res.code === 0) {
    window.open(res.data)
  }
  return res
}

interface CustomRequestParams {
  file: any
  data?: Record<string, any>
  onFinish: (result: AxiosResponse | unknown) => void
  onError: (error: AxiosError | Error) => void
  onProgress: (progress: { percent: number }) => void
}

export function createUploadRequest(
  url: string,
  getExtraFields?: (data?: Record<string, any>) => Record<string, any>
) {
  return async function customRequest({
    file,
    data,
    onFinish,
    onError,
    onProgress
  }: CustomRequestParams) {
    const formData = new FormData()
    formData.append('file', file.file)

    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })
    }

    if (getExtraFields) {
      const extraFields = getExtraFields(data)
      Object.entries(extraFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })
    }

    try {
      const res = await request.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress({ percent })
          }
        }
      })
      onFinish(res)
    } catch (error) {
      onError(error as Error)
    }
  }
}

export function createBeforeUpload(options?: {
  allowedTypes?: string[]
  errorMessage?: string
  onValid?: (file: UploadFileInfo) => void
}) {
  const message = useMessage()
  const {
    allowedTypes = DEFAULT_ALLOWED_TYPES,
    errorMessage = '只能上传 PDF、Word 格式文件，请重新上传',
    onValid
  } = options || {}

  return async function beforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
    if (!allowedTypes.includes(data.file.file?.type || '')) {
      message.error(errorMessage)
      return false
    }
    onValid?.(data.file)
    return true
  }
}
