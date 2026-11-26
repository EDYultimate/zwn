const pMap = {
  '1-1': '海河流域分区降水量统计表',
  '1-2': '海河流域代表站月、年降水量统计表',
  '1-3': '海河流域分区地表水资源量统计表',
  //'1-4': '海河流域代表站月、年径流量统计表',
  '1-5': '海河流域分区地下水资源量统计表',
  '1-6': '海河流域分区水资源总量统计表',
  '1-7': '海河流域大中型水库蓄水情况统计表',
  '1-8': '海河流域平原区浅层地下水动态情况统计表',
  '1-9': '海河流域平原区地下水位降落漏斗情况统计表',
  '1-10': '海河流域分区供水量统计表',
  '1-11': '海河流域分区用水量统计表',
  '1-12': '海河流域重要城市建成区供用水量统计表',
  '1-13': '海河流域分区耗水量统计表',
  '1-14': '海河流域分区废污水排放量统计表',
  '1-15': '海河流域河流水资源质量概况评价表',
  '1-16': '海河流域河流水资源质量概况评价表',
  '1-17': '海河流域水库水资源质量状况评价表',
  '1-18': '海河流域省界水体水资源质量状况',
  '1-19': '海河流域部分平原区浅层地下水水质状况评价表'
}

function gpmenu(id, name) {
  const html =
    "<li class='mditem'>" +
    "<table width='100%' height='30px;'>" +
    '<tbody>' +
    '<tr>' +
    "<td><img id='" +
    id +
    "' title='附表1 海河流域分区降水量统计表' src='" +
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
  // 海河流域分区降水量统计表
  if (p == '1-1') {
    url = basePath + 'pages/kfly/jsl/tjxx/jsl.jsp'
  }
  // 海河流域代表站月、年降水量统计表
  else if (p == '1-2') {
    url = basePath + 'pages/kfly/jsl/dbzjsl/dbzjsl.jsp'
  }
  // 海河流域分区地表水资源量统计表
  else if (p == '1-3') {
    url = basePath + 'pages/kfly/szyl/dbs/dbs.jsp'
  }
  // 海河流域代表站月、年径流量统计表
  else if (p == '1-4') {
  }
  // 海河流域分区地下水资源量统计表
  else if (p == '1-5') {
    url = basePath + 'pages/kfly/szyl/dxs/dxs.jsp'
  }
  // 海河流域分区水资源总量统计表
  else if (p == '1-6') {
    url = basePath + 'pages/kfly/szyl/szyzl/szyzl.jsp'
  }
  // 海河流域大中型水库蓄水情况统计表
  else if (p == '1-7') {
    url = basePath + 'pages/kfly/skxsl/tjxx/skxsl.jsp'
  }
  // 海河流域平原区浅层地下水动态情况统计表
  else if (p == '1-8') {
    url = basePath + 'pages/kfly/gsl/dxs/gbsj/pydxs.jsp'
  }
  // 海河流域平原区地下水位降落漏斗情况统计表
  else if (p == '1-9') {
    url = basePath + 'pages/kfly/gsl/dxs/ldsj/dxsld.jsp'
  }
  // 海河流域分区供水量统计表
  else if (p == '1-10') {
    url = basePath + 'pages/kfly/gsl/gsfx/gsl/gs.jsp'
  }
  // 海河流域分区用水量统计表
  else if (p == '1-11') {
    url = basePath + 'pages/kfly/ysl/ysfx/ysl.jsp'
  }
  // 海河流域重要城市建成区供用水量统计表
  else if (p == '1-12') {
    url = basePath + 'pages/kfly/gsl/gsfx/csgsl/jcqgysl.jsp'
  }
  // 海河流域分区耗水量统计表
  else if (p == '1-13') {
    url = basePath + 'pages/kfly/hsl/hsfx/hsl.jsp'
  }
  // 海河流域分区废污水排放量统计表
  else if (p == '1-14') {
    url = basePath + 'pages/kfly/psl/pwl.jsp'
  }
  // 海河流域河流水资源质量概况评价表
  else if (p == '1-15') {
    url = basePath + 'pages/szybh/sjdm/szgk/hlszyzl.jsp'
  }
  // 海河流域河流水资源质量概况评价表
  else if (p == '1-16') {
    url = basePath + 'pages/szybh/sjdm/hpsz/hpszyzl.jsp'
  }
  // 海河流域水库水资源质量状况评价表
  else if (p == '1-17') {
    url = basePath + 'pages/szybh/sjdm/sksz/skszyzl.jsp'
  }
  // 海河流域省界水体水资源质量状况
  else if (p == '1-18') {
    url = basePath + 'pages/szybh/sjdm/sjstsz/sjstsz.jsp'
  }
  // 海河流域部分平原区浅层地下水水质状况评价表
  else if (p == '1-19') {
    url = basePath + 'pages/szybh/sjdm/pydxssz/pyqcdxs.jsp'
  }

  openPage(url)
}

$(document).ready(function () {
  addHtml()
})
