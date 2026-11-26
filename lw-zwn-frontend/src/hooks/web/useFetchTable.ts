import { reactive, ref } from 'vue'

import type { Ref } from 'vue'
import type { VxeGridInstance, VxePagerProps, VxeTableInstance } from 'vxe-table'

import { globalPageSize } from '@/config/pagination'
import type { ResponseSchema } from '@/utils/request/type'

interface FetchTableProps {
  apiFun: (params?: any) => Promise<ResponseSchema>
  params: any
  tableRef: Ref<
    | VxeGridInstance
    | VxeTableInstance
    | { loadData: (data: any[]) => void; refreshColumn: () => void; refreshScroll: () => void }
    | undefined
  >
  pageSize?: number
  isPagination?: boolean
  isInit?: boolean
  callback?: (value: any[]) => void
}

interface IPager {
  pageSize: number
  pageNumber: number
  total: number
}

export default (props: FetchTableProps) => {
  const { apiFun, params, tableRef, pageSize, isPagination = true, isInit = true, callback } = props
  const loading = ref<boolean>(false)
  const data = ref<any[]>([])
  const pager = ref<IPager>({
    pageSize: globalPageSize.value,
    pageNumber: 1,
    total: 0
  })
  if (pageSize && pageSize !== 0) {
    pager.value.pageSize = Number(pageSize)
  }
  const loadData = () => {
    loading.value = true
    apiFun(isPagination ? Object.assign(params, pager.value) : params).then((res) => {
      data.value = isPagination ? res.data.records : res.data
      pager.value.total = isPagination ? res.data.total : 0
      tableRef.value?.refreshColumn()
      tableRef.value?.refreshScroll()
      tableRef.value?.loadData(data.value)
      loading.value = false
      callback?.(data.value)
    })
  }
  if (isInit) {
    loadData()
  }
  const pageChange = (type: VxePagerProps) => {
    pager.value.pageNumber = type.currentPage as number
    pager.value.pageSize = type.pageSize as number
    loading.value = true
    loadData()
  }

  return reactive({
    data,
    pageChange,
    pager,
    loading,
    loadData
  })
}
