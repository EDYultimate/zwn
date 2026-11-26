$(document).ready(function () {
  maketable()
})

const pMap = {
  1: '海河流域各省建设项目水资源论证统计表',
  2: '海河流域取水许可统计表',
  3: '海河流域年终保有有效取水许可证统计表',
  4: '海河流域取水计划统计表',
  5: '海河流域各省用水效率情况表',
  6: '海河流域水资源费征收使用情况表',
  7: '海河流域水资源管理机构统计表',
  8: '海河流域年终保有实施监督管理的取水许可证统计表',
  9: '海河流域各省水资源费征收标准'
}

function openPage(url) {
  window.open(url, '_blank')
}

function showPage(p) {
  let url = null
  // 海河流域各省建设项目水资源论证统计表
  if (p == '1') {
    url = basePath + 'pages/message/nb/01/jsxmlz.jsp'
  }
  // 海河流域取水许可统计表
  else if (p == '2') {
    url = basePath + 'pages/kfly/qsxk/qsxk/spff/dfbstt.jsp'
  }
  // 海河流域年终保有有效取水许可证统计表
  else if (p == '3') {
    url = basePath + 'pages/kfly/qsxk/qsxk/nzby/lcnystt.jsp'
  }
  // 海河流域取水计划统计表
  else if (p == '4') {
    url = basePath + 'pages/jyys/qsjh/tjxx/wupstt.jsp'
  }
  // 海河流域各省用水效率情况表
  else if (p == '5') {
    url = basePath + 'pages/jyys/ysxl/tjxx/ctwuem.jsp'
  }
  // 海河流域水资源费征收使用情况表
  else if (p == '6') {
    url = basePath + 'pages/kfly/qsxk/zssy/tjxx/wfsttm.jsp'
  }
  // 海河流域水资源管理机构统计表
  else if (p == '7') {
    url = basePath + 'pages/message/nb/10/tbm.jsp'
  } else if (p == '8') {
    url = basePath + '/pages/message/nb/05/ssjdgl.jsp'
  } else if (p == '9') {
    url = basePath + '/pages/message/nb/08/szyfzs.jsp'
  }

  openPage(url)
}

let ctable

function finished() {
  initstyle()
}

function initstyle() {}

function maketable() {
  const results = []
  for (key in pMap) {
    const result = {}
    result.No = '附表' + key
    result.Type = "<a href='javascript:showPage(" + key + ")'>" + pMap[key] + '</a>'
    results.push(result)
  }

  option = {}
  ctable = cgrid.instance('table', option)
  ctable.finished = finished
  ctable.genTable(results)
}
