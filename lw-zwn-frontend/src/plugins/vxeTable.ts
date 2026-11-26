import { App } from 'vue'
import VxeUI from 'vxe-pc-ui'
import zhCN from 'vxe-pc-ui/lib/language/zh-CN'
import VxeTable from 'vxe-table'
import XEUtils from 'xe-utils'
import VXETablePluginExportXLSX from '@vxe-ui/plugin-export-xlsx'
import ExcelJS from 'exceljs'
import domZIndex from 'dom-zindex'
import { globalPageSize } from '@/config/pagination'
import '@/assets/style/vxe_table.scss'

//设定中文
VxeTable.setI18n('zh-CN', zhCN)
VxeTable.setLanguage('zh-CN')
// VxeTable.setTheme('dark')
//配置全局表格属性
VxeTable.setConfig({
  size: 'small',
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
    }
  }
})
//调用xlsx导出
VxeTable.use(VXETablePluginExportXLSX, {
  ExcelJS
})
//解决弹窗当中的层级冲突问题
domZIndex.setCurrent(9998)
//混合方式定义全局format函数
VxeUI.formats.mixin({
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
  }
})
//多组件注册,vxetable非独立组件,调用了众多vxeui的样式
const lazyVxeTable = (app: App) => {
  app.use(VxeTable)
  app.use(VxeUI)
}

export function useTable(app: App) {
  // 表格功能
  lazyVxeTable(app)
}
