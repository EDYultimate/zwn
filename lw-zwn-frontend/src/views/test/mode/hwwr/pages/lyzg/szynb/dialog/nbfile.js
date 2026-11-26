const pMap = {
  '1-1': '海河流域各省建设项目水资源论证统计表',
  '1-2': '海河流域取水许可统计表',
  '1-3': '海河流域年终保有有效取水许可证统计表',
  '1-4': '海河流域取水计划统计表',
  '1-5': '海河流域各省用水效率情况表',
  '1-6': '海河流域水资源费征收使用情况表',
  '1-7': '海河流域水资源管理机构统计表',
  '1-8': '海河流域年终保有实施监督管理的取水许可证统计表',
  '1-9': '海河流域各省水资源费征收标准'
}

function gpmenu(id, name) {
  const html =
    "<li class='mditem'>" +
    "<table width='100%' height='30px;'>" +
    '<tbody>' +
    '<tr>' +
    "<td><img id='" +
    id +
    "' title='" +
    name +
    "' src='" +
    basePath +
    "images/index/icon_file_excel.png'></td>" +
    "<td><a class='itemname' onclick=\"showPage('" +
    id +
    '\');">' +
    name +
    '</a></td>' +
    '</tr>' +
    '</tbody>' +
    '</table>' +
    '</li>'
  return html
}

function addHtml() {
  let html = ''

  let i = 1
  for (const key in pMap) {
    html += gpmenu(key, '附表' + i + ' ' + pMap[key])
    ++i
  }

  $('#gpmenu').empty()
  $('#gpmenu').append(html)
}

function openPage(url) {
  window.open(url, '_blank')
}

function showPage(p) {
  let url = null

  // 海河流域各省建设项目水资源论证统计表
  if (p == '1-1') {
    url = basePath + 'pages/message/nb/01/jsxmlz.jsp'
  }
  // 海河流域取水许可统计表
  else if (p == '1-2') {
    url = basePath + 'pages/kfly/qsxk/qsxk/spff/dfbstt.jsp'
  }
  // 海河流域年终保有有效取水许可证统计表
  else if (p == '1-3') {
    url = basePath + 'pages/kfly/qsxk/qsxk/nzby/lcnystt.jsp'
  }
  // 海河流域取水计划统计表
  else if (p == '1-4') {
    url = basePath + 'pages/jyys/qsjh/tjxx/wupstt.jsp'
  }
  // 海河流域各省用水效率情况表
  else if (p == '1-5') {
    url = basePath + 'pages/jyys/ysxl/tjxx/ctwuem.jsp'
  }
  // 海河流域水资源费征收使用情况表
  else if (p == '1-6') {
    url = basePath + 'pages/kfly/qsxk/zssy/tjxx/wfsttm.jsp'
  }
  // 海河流域水资源管理机构统计表
  else if (p == '1-7') {
    url = basePath + 'pages/message/nb/10/tbm.jsp'
  } else if (p == '1-8') {
    url = basePath + '/pages/message/nb/05/ssjdgl.jsp'
  } else if (p == '1-9') {
    url = basePath + '/pages/message/nb/08/szyfzs.jsp'
  }

  openPage(url)
}

$(document).ready(function () {
  addHtml()
})
