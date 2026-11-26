<template>
  <div class="pro-table" :class="[themeClass]">
    <vxe-grid
      ref="proTableRef"
      v-bind="gridOptions"
      :loading="props.loading"
      :data="props.data"
      @cell-click="emit('cellClick', $event)"
      @cell-dblclick="emit('cellDblclick', $event)"
      @header-cell-click="emit('headerCellClick', $event)"
      @sort-change="emit('sortChange', $event)"
      @filter-change="emit('filterChange', $event)"
      @checkbox-change="emit('checkboxChange', $event)"
      @checkbox-all="emit('checkboxAll', $event)"
      @radio-change="emit('radioChange', $event)"
      @scroll="emit('scroll', $event)"
    >
      <!-- 透传所有插槽 -->
      <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
        <slot :name="name" v-bind="slotData || {}" />
      </template>

      <!-- 默认加载中插槽：页面未自定义 #loading 时统一使用（加载动画 + 文案） -->
      <template v-if="!$slots.loading" #loading>
        <div class="pt-loading">
          <span class="pt-loading__ring"></span>
          <span class="pt-loading__text">{{ loadingText }}</span>
        </div>
      </template>

      <!-- 默认空数据插槽 -->
      <template #empty>
        <slot name="empty">
          <n-empty description="暂无数据"></n-empty>
        </slot>
      </template>

      <!-- 分页器插槽 -->
      <template #pager>
        <slot name="pager">
          <div v-if="props.isPagination" class="pro-table__pager">
            <vxe-pager
              v-model:current-page="pagerState.pageNumber"
              v-model:page-size="pagerState.pageSize"
              :total="props.pager?.total ?? 0"
              :background="props.pagerBackground"
              :page-sizes="props.pageSizes"
              :layouts="props.pagerLayouts"
              @page-change="handlePageChange"
            >
              <!-- 透传分页器插槽 -->
              <template v-for="(_, name) in pagerSlots" :key="name" #[name]="slotData">
                <slot :name="`pager-${name}`" v-bind="slotData || {}" />
              </template>
            </vxe-pager>
          </div>
        </slot>
      </template>
    </vxe-grid>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, shallowRef, useSlots, watch } from 'vue'
import type {
  VxeGridInstance,
  VxeGridProps,
  VxeGridPropTypes
} from 'vxe-pc-ui/types/components/grid'
import type { VxeTablePropTypes } from 'vxe-pc-ui/types/components/table'
import type { VxePagerProps, VxePagerPropTypes } from 'vxe-pc-ui/types/components/pager'

/**
 * 分页器配置接口
 */
export interface ProTablePager {
  pageSize: number
  pageNumber: number
  total: number
}

/**
 * 预设主题类型（兼容保留）
 * @deprecated 全项目表格已统一为「浅色 / 深色」两套标准主题（见 assets/style/pro-table.scss），
 * 该字段仅为兼容历史调用，除 'dark' 外一律按浅色标准渲染。
 */
export type ProTableTheme = 'blue' | 'gray' | 'dark' | 'green' | 'orange' | 'water' | 'custom'

/**
 * 表格主题：light 浅色标准（默认）/ dark 深色标准（深色大屏面板内使用）
 * 'blue' 为历史命名，等价于 'dark'
 */
export type ProTableSkin = 'light' | 'blue' | 'dark'

/**
 * Props 定义
 */
export interface ProTableProps {
  /** vxe-grid 原生配置 */
  gridOptions?: VxeGridProps
  /** 表格列配置 */
  columns?: VxeGridPropTypes.Columns
  /** 表格数据 */
  data?: any[]
  /** 加载状态（加载过程中表格显示统一的加载动画遮罩） */
  loading?: boolean
  /** 加载中提示文案（页面自定义 #loading 插槽时不生效） */
  loadingText?: string
  /** 是否显示分页 */
  isPagination?: boolean
  /** 分页器配置 */
  pager?: ProTablePager
  /** 分页器背景 */
  pagerBackground?: boolean
  /** 分页器布局 */
  pagerLayouts?: VxePagerPropTypes.Layouts
  /** 每页条数选项 */
  pageSizes?: number[]
  /** 是否斑马纹（标准样式默认关闭，仅在确有必要强调行序时开启） */
  stripe?: boolean
  /** 是否显示边框 */
  border?: boolean
  /** 是否圆角 */
  round?: boolean
  /** 预设主题（已废弃，仅为兼容历史调用；除 'dark' 外一律按浅色标准渲染） */
  theme?: ProTableTheme
  /** 表格主题：light 浅色标准（默认）/ dark 深色标准（'blue' 为历史命名，等价于 'dark'） */
  tableTheme?: ProTableSkin
  /** 表格高度 */
  height?: string | number
  /** 表格最大高度 */
  maxHeight?: string | number
  /** 是否自动高度 */
  autoHeight?: boolean
  /** 列配置 */
  columnConfig?: VxeTablePropTypes.ColumnConfig
  /** 行配置 */
  rowConfig?: VxeTablePropTypes.RowConfig
  /** 排序配置 */
  sortConfig?: VxeTablePropTypes.SortConfig
  /** 筛选配置 */
  filterConfig?: VxeTablePropTypes.FilterConfig
  /** 复选框配置 */
  checkboxConfig?: VxeTablePropTypes.CheckboxConfig
  /** 单选框配置 */
  radioConfig?: VxeTablePropTypes.RadioConfig
  /** 展开行配置 */
  expandConfig?: VxeTablePropTypes.ExpandConfig
  /** 树形配置 */
  treeConfig?: VxeTablePropTypes.TreeConfig
  /** 合并单元格配置 */
  mergeCells?: VxeTablePropTypes.MergeCells
  /** 合并表头配置 */
  mergeHeaderCells?: VxeTablePropTypes.MergeHeaderCells
  /** 空数据文本 */
  emptyText?: string
}

const props = withDefaults(defineProps<ProTableProps>(), {
  gridOptions: () => ({}),
  data: () => [],
  loading: false,
  loadingText: '数据加载中...',
  isPagination: true,
  pager: () => ({
    pageSize: 20,
    pageNumber: 1,
    total: 0
  }),
  pagerBackground: true,
  pagerLayouts: () =>
    [
      'PrevJump',
      'PrevPage',
      'Jump',
      'PageCount',
      'NextPage',
      'NextJump',
      'Sizes',
      'Total'
    ] as VxePagerPropTypes.Layouts,
  pageSizes: () => [10, 20, 50, 100],
  stripe: false,
  border: false,
  round: false,
  theme: 'gray',
  tableTheme: 'light',
  height: 'auto',
  autoHeight: true,
  emptyText: '暂无数据'
})

const emit = defineEmits<{
  /** 分页变化 */
  (e: 'pageChange', pager: VxePagerProps): void
  (e: 'cellClick', ...args: any[]): void
  /** 单元格双击 */
  (e: 'cellDblclick', ...args: any[]): void
  /** 表头单元格点击 */
  (e: 'headerCellClick', ...args: any[]): void
  /** 排序变化 */
  (e: 'sortChange', ...args: any[]): void
  /** 筛选变化 */
  (e: 'filterChange', ...args: any[]): void
  /** 复选框变化 */
  (e: 'checkboxChange', ...args: any[]): void
  /** 复选框全选 */
  (e: 'checkboxAll', ...args: any[]): void
  /** 单选框变化 */
  (e: 'radioChange', ...args: any[]): void
  /** 滚动 */
  (e: 'scroll', ...args: any[]): void
  /** 更新分页器 */
  (e: 'update:pager', pager: ProTablePager): void
}>()

const slots = useSlots()
const proTableRef = shallowRef<VxeGridInstance>()

/**
 * 分页器状态（内部维护，支持 v-model）
 */
const pagerState = reactive<ProTablePager>({
  pageSize: props.pager?.pageSize ?? 20,
  pageNumber: props.pager?.pageNumber ?? 1,
  total: props.pager?.total ?? 0
})

/**
 * 监听外部 pager 变化
 */
watch(
  () => props.pager,
  (newPager) => {
    if (newPager) {
      pagerState.pageSize = newPager.pageSize
      pagerState.pageNumber = newPager.pageNumber
      pagerState.total = newPager.total
    }
  },
  { deep: true }
)

/**
 * 主题类名
 * 全项目仅有「浅色标准（默认，无需类名）/ 深色标准（.pro-table--dark）」两套；
 * tableTheme='blue' 为历史命名，等价于 'dark'；theme 字段已废弃，仅 'dark' 仍生效。
 */
const themeClass = computed(() => {
  const isDark =
    props.tableTheme === 'dark' || props.tableTheme === 'blue' || props.theme === 'dark'
  return isDark ? 'pro-table--dark' : ''
})

/**
 * 合并后的 vxe-grid 配置
 */
const gridOptions = computed<VxeGridProps>(() => {
  return {
    id: props.gridOptions?.id ?? Math.random().toString(),
    height: props.height,
    maxHeight: props.maxHeight,
    stripe: props.stripe,
    border: props.border,
    round: props.round,
    columns: props.columns,
    columnConfig: {
      resizable: true,
      ...props.columnConfig
    },
    rowConfig: props.rowConfig,
    sortConfig: props.sortConfig,
    filterConfig: props.filterConfig,
    checkboxConfig: props.checkboxConfig,
    radioConfig: props.radioConfig,
    expandConfig: props.expandConfig,
    treeConfig: props.treeConfig,
    mergeCells: props.mergeCells,
    mergeHeaderCells: props.mergeHeaderCells,
    emptyText: props.emptyText,
    ...props.gridOptions
  }
})

/**
 * 分页器插槽筛选
 */
const pagerSlots = computed(() => {
  const pagerSlotNames = ['left', 'right']
  const result: Record<string, any> = {}
  for (const name of pagerSlotNames) {
    if (slots[`pager-${name}`]) {
      result[name] = slots[`pager-${name}`]
    }
  }
  return result
})

/**
 * 分页变化处理
 */
const handlePageChange = (pager: VxePagerProps) => {
  pagerState.pageNumber = pager.currentPage as number
  pagerState.pageSize = pager.pageSize as number
  emit('update:pager', { ...pagerState })
  emit('pageChange', pager)
}

/**
 * 刷新列
 */
const refreshColumn = () => {
  proTableRef.value?.refreshColumn()
}

/**
 * 刷新滚动
 */
const refreshScroll = () => {
  proTableRef.value?.refreshScroll()
}

/**
 * 加载数据
 */
const loadData = (data: any[]) => {
  proTableRef.value?.loadData(data)
}

/**
 * 获取选中数据
 */
const getCheckboxRecords = () => {
  return proTableRef.value?.getCheckboxRecords() ?? []
}

/**
 * 获取当前分页信息
 */
const getPager = () => {
  return { ...pagerState }
}

/**
 * 设置分页信息
 */
const setPager = (pager: Partial<ProTablePager>) => {
  if (pager.pageSize !== undefined) {
    pagerState.pageSize = pager.pageSize
  }
  if (pager.pageNumber !== undefined) {
    pagerState.pageNumber = pager.pageNumber
  }
  if (pager.total !== undefined) {
    pagerState.total = pager.total
  }
}

/**
 * 暴露方法
 */
defineExpose({
  refreshColumn,
  refreshScroll,
  loadData,
  getCheckboxRecords,
  getPager,
  setPager,
  /** 获取 vxe-grid 实例 */
  getGridInstance: () => proTableRef.value
})
</script>

<style scoped lang="scss">
/* 统一表格样式由 src/assets/style/pro-table.scss 全局提供（main.scss 已引入），
   组件内不再重复引入，避免同一套规则被打包两次。此处只保留容器尺寸。 */
.pro-table {
  width: 100%;
  height: 100%;
}
</style>
