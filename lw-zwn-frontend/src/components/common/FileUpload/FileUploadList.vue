<template>
  <div class="file-upload-list">
    <!-- 拖拽上传区域 -->
    <div v-show="!props.disabled && props.showUploadArea" class="file-upload-list__upload">
      <FileUpload
        ref="fileUploadRef"
        :group-id="props.groupId"
        :group-type="props.groupType"
        :accept="props.accept"
        :max-size="props.maxSize"
        :multiple="props.multiple"
        :max="props.max"
        :disabled="props.disabled"
        :title="props.title"
        :tip="props.tip"
        :data="props.data"
        :headers="props.headers"
        :show-file-list="false"
        @success="handleUploadSuccess"
        @error="handleUploadError"
      />
    </div>

    <!-- 检索区域 -->
    <div v-if="props.showSearch" class="file-upload-list__search">
      <n-space align="center" :wrap="false">
        <n-input
          v-model:value="searchForm.original"
          placeholder="请输入文件名检索"
          clearable
          style="width: 240px"
          @keyup.enter="handleSearch"
        />
        <n-button type="primary" @click="handleSearch">查询</n-button>
        <n-button @click="handleReset">重置</n-button>
        <n-button
          v-if="!props.disabled && !props.showUploadArea"
          type="primary"
          @click="handleAddFile"
          >新增文件</n-button
        >
      </n-space>
    </div>

    <!-- 文件表格 -->
    <div class="file-upload-list__table pt-table-wrap">
      <ProTable
        ref="proTableRef"
        :columns="columns"
        :loading="table.loading"
        :data="table.data"
        :pager="table.pager"
        :is-pagination="props.isPagination"
        :height="props.height"
        @page-change="table.pageChange"
      >
        <template #empty>
          <n-empty description="暂无文件" />
        </template>
      </ProTable>
    </div>

    <!-- 重命名弹窗 -->
    <ProModal
      v-model:show="renameVisible"
      title="重命名"
      :style-params="{ width: '480px', height: 'auto' }"
    >
      <n-form label-placement="left" label-width="80px">
        <n-form-item label="文件名">
          <n-input
            v-model:value="renameForm.original"
            placeholder="请输入文件名"
            @keyup.enter="handleRenameConfirm"
          />
        </n-form-item>
      </n-form>
      <template #action>
        <n-space justify="end">
          <n-button @click="renameVisible = false">取消</n-button>
          <n-button type="primary" :loading="renameSaving" @click="handleRenameConfirm">
            确认
          </n-button>
        </n-space>
      </template>
    </ProModal>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import type { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid'
import FileUpload from './index.vue'
import ProTable from '@/components/common/ProTable'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import useFetchTable from '@/hooks/web/useFetchTable'
import { findSysFilePage, findSysFileList, deleteSysFile, renameSysFile } from '@/api/file/sysFile'
import type { SysFile } from '@/api/file/sysFile'
import other from '@/utils/other'

interface FileUploadListProps {
  /** 文件组（业务 id），配合 groupType 定位一批业务文件 */
  groupId?: string
  /** 文件组类型，配合 groupId 定位一批业务文件 */
  groupType?: string
  /** 接受的文件类型 */
  accept?: string
  /** 单文件大小上限（字节），0 表示不限制 */
  maxSize?: number
  /** 是否允许多选 */
  multiple?: boolean
  /** 最大上传数量 */
  max?: number
  /** 是否禁用上传 */
  disabled?: boolean
  /** 上传区域主标题 */
  title?: string
  /** 上传区域提示文案 */
  tip?: string
  /** 是否显示上传区域 */
  showUploadArea?: boolean
  /** 是否显示检索区域 */
  showSearch?: boolean
  /** 是否开启分页 */
  isPagination?: boolean
  /** 每页条数 */
  pageSize?: number
  /** 表格高度 */
  height?: string | number
  /** 额外的上传表单参数 */
  data?: Record<string, any>
  /** 额外的上传请求头 */
  headers?: Record<string, string>
}

const props = withDefaults(defineProps<FileUploadListProps>(), {
  groupId: '',
  groupType: '',
  accept: '',
  maxSize: 0,
  multiple: true,
  max: undefined,
  disabled: false,
  title: '点击或者拖动文件到该区域来上传',
  tip: '请不要上传敏感数据',
  showUploadArea: true,
  showSearch: true,
  isPagination: true,
  pageSize: 10,
  height: 'auto',
  data: () => ({}),
  headers: () => ({})
})

const emit = defineEmits<{
  (e: 'upload-success', response: any, file: any, fileList: any[]): void
  (e: 'upload-error', error: any, file: any, fileList: any[]): void
  (e: 'delete-success', row: SysFile): void
  (e: 'rename-success', row: SysFile): void
}>()

const proTableRef = shallowRef<InstanceType<typeof ProTable>>()
const fileUploadRef = shallowRef<InstanceType<typeof FileUpload>>()

const searchForm = reactive({
  groupId: props.groupId,
  groupType: props.groupType,
  original: ''
})

const table = useFetchTable({
  apiFun: props.isPagination ? findSysFilePage : findSysFileList,
  params: searchForm,
  tableRef: proTableRef as any,
  pageSize: props.pageSize,
  isPagination: props.isPagination
})

watch(
  () => [props.groupId, props.groupType],
  ([groupId, groupType]) => {
    searchForm.groupId = groupId
    searchForm.groupType = groupType
    table.pager.pageNumber = 1
    table.loadData()
  }
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
/**
 * 处理下载文件
 *
 * @param {any} item - 文件项对象
 */
const handleDownFile = (item: any) => {
  other.downBlobFile(`/api/ossFile/${item.id}`, {}, item.original)
}

const columns: VxeGridPropTypes.Columns = [
  { type: 'seq', title: '序号', align: 'center', width: 60 },
  { field: 'original', title: '文件名', align: 'left', minWidth: 200 },
  {
    field: 'fileSize',
    title: '文件大小',
    align: 'center',
    width: 120,
    slots: {
      default: ({ row }) => h('span', formatFileSize(row.fileSize))
    }
  },
  { field: 'createBy', title: '上传人', align: 'center', width: 120 },
  { field: 'createTime', title: '上传时间', align: 'center', width: 160 },
  {
    title: '操作',
    align: 'center',
    width: 250,
    fixed: 'right',
    slots: {
      default: ({ row }) => {
        return h(resolveComponent('n-space'), { justify: 'center' }, () => [
          h(
            resolveComponent('n-button'),
            {
              size: 'small',
              type: 'primary',
              tertiary: true,
              onClick: () => handleDownFile(row)
            },
            () => '下載'
          ),
          h(
            resolveComponent('n-button'),
            {
              size: 'small',
              type: 'warning',
              tertiary: true,
              onClick: () => handleRename(row)
            },
            () => '重命名'
          ),
          h(
            resolveComponent('n-button'),
            {
              size: 'small',
              type: 'error',
              tertiary: true,
              onClick: () => handleDelete(row)
            },
            () => '删除'
          )
        ])
      }
    }
  }
]

const handleSearch = () => {
  table.pager.pageNumber = 1
  table.loadData()
}

const handleReset = () => {
  searchForm.original = ''
  table.pager.pageNumber = 1
  table.loadData()
}

const handleAddFile = () => {
  fileUploadRef.value?.openOpenFileDialog()
}

const handleUploadSuccess = (response: any, file: any, fileList: any[]) => {
  window.$message?.success('上传成功')
  table.loadData()
  emit('upload-success', response, file, fileList)
}

const handleUploadError = (error: any, file: any, fileList: any[]) => {
  emit('upload-error', error, file, fileList)
}

const handleDelete = (row: SysFile) => {
  window?.$dialog?.warning({
    title: '提示',
    content: `确定删除文件「${row.original}」吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await deleteSysFile([row.id as string | number])
        window.$message.success('删除成功')
        emit('delete-success', row)
        table.loadData()
      } catch {
        window.$message.error('删除失败')
      }
    }
  })
}

const renameVisible = ref(false)
const renameSaving = ref(false)
const renameForm = reactive({
  id: '' as string | number,
  original: ''
})

const handleRename = (row: SysFile) => {
  renameForm.id = row.id as string | number
  renameForm.original = row.original || ''
  renameVisible.value = true
}

const handleRenameConfirm = async () => {
  if (!renameForm.original.trim()) {
    window.$message?.warning('请输入文件名')
    return
  }
  renameSaving.value = true
  try {
    await renameSysFile({
      id: renameForm.id,
      original: renameForm.original
    })
    window.$message.success('重命名成功')
    emit('rename-success', { id: renameForm.id, original: renameForm.original } as SysFile)
    renameVisible.value = false
    table.loadData()
  } catch {
    window.$message.error('重命名失败')
  } finally {
    renameSaving.value = false
  }
}

const refresh = () => {
  table.loadData()
}

const clearUpload = () => {
  fileUploadRef.value?.clear()
}

defineExpose({ refresh, clearUpload })
</script>

<style scoped lang="scss">
.file-upload-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.file-upload-list__table {
  flex: 1;
  min-height: 0;
}
</style>
