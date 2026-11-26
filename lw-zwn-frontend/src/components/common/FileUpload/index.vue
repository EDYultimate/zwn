<template>
  <n-upload
    ref="uploadRef"
    v-model:file-list="innerFileList"
    :multiple="props.multiple"
    :max="props.max"
    :accept="props.accept"
    :disabled="props.disabled"
    :directory-dnd="props.directoryDnd"
    :show-file-list="props.showFileList"
    :custom-request="handleCustomRequest"
    :before-upload="handleBeforeUpload"
  >
    <n-upload-dragger>
      <div class="file-upload__icon">
        <n-icon size="48" :depth="3">
          <CloudUploadOutline />
        </n-icon>
      </div>
      <n-text class="file-upload__title">{{ props.title }}</n-text>
      <n-p depth="3" class="file-upload__tip">{{ props.tip }}</n-p>
    </n-upload-dragger>
  </n-upload>
</template>

<script setup lang="ts">
import { CloudUploadOutline } from '@vicons/ionicons5'
import type { UploadFileInfo } from 'naive-ui'
import { uploadSysFile } from '@/api/file/sysFile'

interface FileUploadProps {
  /** 上传地址，默认匹配后端 /ossFile/upload */
  uploadUrl?: string
  /** 文件组（业务 id，上传时传给后端） */
  groupId?: string
  /** 文件组类型（上传时传给后端） */
  groupType?: string
  /** 额外的表单参数 */
  data?: Record<string, any>
  /** 额外的请求头 */
  headers?: Record<string, string>
  /** 是否允许多选 */
  multiple?: boolean
  /** 最大上传数量 */
  max?: number
  /** 接受的文件类型 */
  accept?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否启用目录拖拽 */
  directoryDnd?: boolean
  /** 是否展示内置文件列表 */
  showFileList?: boolean
  /** 主标题 */
  title?: string
  /** 提示文案 */
  tip?: string
  /** 单文件大小上限（字节），0 表示不限制 */
  maxSize?: number
  /** 请求超时时间（毫秒），0 表示不限制 */
  timeout?: number
}

const props = withDefaults(defineProps<FileUploadProps>(), {
  uploadUrl: '/ossFile/upload',
  multiple: true,
  disabled: false,
  directoryDnd: true,
  showFileList: true,
  title: '点击或者拖动文件到该区域来上传',
  tip: '请不要上传敏感数据',
  maxSize: 0,
  timeout: 0
})

const emit = defineEmits<{
  (e: 'success', response: any, file: UploadFileInfo, fileList: UploadFileInfo[]): void
  (e: 'error', error: any, file: UploadFileInfo, fileList: UploadFileInfo[]): void
  (e: 'change', fileList: UploadFileInfo[]): void
}>()

const uploadRef = ref()
const innerFileList = ref<UploadFileInfo[]>([])

watch(
  innerFileList,
  (val) => {
    emit('change', val)
  },
  { deep: true }
)

const formatFileSize = (size?: number) => {
  if (!size) {
    return '-'
  }
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let s = size
  let i = 0
  while (s >= 1024 && i < units.length - 1) {
    s /= 1024
    i++
  }
  return `${s.toFixed(2)} ${units[i]}`
}

const handleBeforeUpload = ({ file }: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  if (props.maxSize && file.file && file.file.size > props.maxSize) {
    window.$message?.error(`文件大小不能超过 ${formatFileSize(props.maxSize)}`)
    return false
  }
  return true
}

interface CustomRequestOptions {
  file: UploadFileInfo
  data?: Record<string, any>
  onFinish: () => void
  onError: () => void
  onProgress: (e: { percent: number }) => void
}

const handleCustomRequest = async ({
  file,
  data,
  onFinish,
  onError,
  onProgress
}: CustomRequestOptions) => {
  const formData = new FormData()
  if (file.file) {
    formData.append('file', file.file)
  }
  const bizData: Record<string, any> = {
    groupId: props.groupId,
    groupType: props.groupType,
    ...(props.data || {}),
    ...(data || {})
  }
  Object.entries(bizData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, String(value))
    }
  })

  try {
    const res = await uploadSysFile(formData, {
      params: { _t: `${Date.now()}-${Math.random()}` },
      timeout: props.timeout,
      headers: props.headers,
      onUploadProgress: (progressEvent: { loaded: number; total?: number }) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress({ percent })
        }
      }
    })
    emit('success', res, file, innerFileList.value)
    onFinish()
  } catch (error) {
    emit('error', error, file, innerFileList.value)
    onError()
  }
}

const submit = () => {
  uploadRef.value?.submit()
}

const clear = () => {
  uploadRef.value?.clear()
  innerFileList.value = []
}

const getFileList = () => innerFileList.value

const openOpenFileDialog = () => {
  uploadRef.value?.openOpenFileDialog()
}

defineExpose({ submit, clear, getFileList, openOpenFileDialog })
</script>

<style scoped lang="scss">
.file-upload__icon {
  margin-bottom: 12px;
}

.file-upload__title {
  font-size: 16px;
}

.file-upload__tip {
  margin: 8px 0 0 0;
}
</style>
