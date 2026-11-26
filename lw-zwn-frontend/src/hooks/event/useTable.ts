import VXETablePluginExportXLSX from '@vxe-ui/plugin-export-xlsx'
import domZIndex from 'dom-zindex'
import ExcelJS from 'exceljs'
import VxeUI from 'vxe-pc-ui'
import zhCN from 'vxe-pc-ui/lib/language/zh-CN'
import VxeTable from 'vxe-table'
import XEUtils from 'xe-utils'

import type { App } from 'vue'

import { globalPageSize } from '@/config/pagination'

import '@/assets/style/vxe_table.scss'

VxeTable.setI18n('zh-CN', zhCN)
VxeTable.setLanguage('zh-CN')
VxeTable.setConfig({
  pager: {
    size: 'small',
    background: true,
    autoHidden: false,
    perfect: false,
    pageSize: globalPageSize.value,
    pagerCount: 7,
    pageSizes: [10, 15, 30, 50, 100, 300, 500, 1000],
    // prettier-ignore
    layouts: ['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']
  },
  table: {
    size: 'small',
    stripe: true,
    border: true,
    round: true,
    showOverflow: 'tooltip',
    tooltipConfig: {
      showAll: false,
      theme: 'dark'
    },
    virtualYConfig: {
      enabled: true
    },
    virtualXConfig: {
      enabled: true
    },
    rowConfig: {
      isHover: true
    },
    exportConfig: {}
  }
})

VxeTable.formats.mixin({
  isNull: {
    tableCellFormatMethod: ({ cellValue }) => {
      if (XEUtils.isNull(cellValue)) {
        return '--'
      } else if (cellValue == 'null') {
        return '--'
      } else if (cellValue == '') {
        return '--'
      }
      return cellValue
    }
  },
  source: {
    tableCellFormatMethod: ({ cellValue }) => {
      if (XEUtils.isNull(cellValue)) {
        return '--'
      }
      if (cellValue === '1') {
        return `<div>重大危险</div>`
      }
      if (cellValue === '2') {
        return '一般危险'
      }
      return '--'
    }
  },
  isDirective: {
    tableCellFormatMethod: ({ cellValue }) => {
      if (XEUtils.isNull(cellValue)) {
        return '--'
      }
      if (cellValue === '1') {
        return '导则内置'
      }
      if (cellValue === '0') {
        return '自定义'
      }
      return '--'
    }
  },
  evaMethod: {
    tableCellFormatMethod: ({ cellValue }) => {
      if (XEUtils.isNull(cellValue)) {
        return '--'
      }
      if (cellValue === '1') {
        return '直接评价法'
      } else if (cellValue === '2') {
        return '风险矩阵法（LS法）'
      } else if (cellValue === '3') {
        return '作业条件危险性评价法（LEC法）'
      }
      return '--'
    }
  },
  evaMethodSimple: {
    tableCellFormatMethod: ({ cellValue }) => {
      if (XEUtils.isNull(cellValue)) {
        return '--'
      }
      if (cellValue === '1') {
        return '直接评价法'
      } else if (cellValue === '2') {
        return 'LS法'
      } else if (cellValue === '3') {
        return 'LEC法'
      }
      return '--'
    }
  },
  hazardLevelResult: {
    tableCellFormatMethod: ({ cellValue }) => {
      if (XEUtils.isNull(cellValue)) {
        return '未研判'
      } else if (cellValue === '0') {
        return '重大风险'
      } else if (cellValue === '1') {
        return '较大风险'
      } else if (cellValue === '2') {
        return '一般风险'
      } else if (cellValue === '3') {
        return '低风险'
      }
      return '--'
    }
  }
})
VxeTable.use(VXETablePluginExportXLSX, {
  ExcelJS
})
domZIndex.setCurrent(998)

const lazyVxeTable = (app: App) => {
  app.use(VxeTable)
  app.use(VxeUI)
}
export function useTable(app: App) {
  // 表格功能
  lazyVxeTable(app)
}
