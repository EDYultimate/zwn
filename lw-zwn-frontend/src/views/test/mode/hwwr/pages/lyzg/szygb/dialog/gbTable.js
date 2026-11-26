$(document).ready(function () {
  maketable()
})

const pMap = {
  1: '海河流域分区降水量统计表',
  2: '海河流域代表站月、年降水量统计表',
  3: '海河流域分区地表水资源量统计表',
  4: '海河流域分区地下水资源量统计表',
  5: '海河流域分区水资源总量统计表',
  6: '海河流域大中型水库蓄水情况统计表',
  7: '海河流域平原区浅层地下水动态情况统计表',
  8: '海河流域平原区地下水位降落漏斗情况统计表',
  9: '海河流域分区供水量统计表',
  10: '海河流域分区用水量统计表',
  11: '海河流域重要城市建成区供用水量统计表',
  12: '海河流域分区耗水量统计表',
  13: '海河流域分区废污水排放量统计表',
  14: '海河流域河流水资源质量概况评价表',
  15: '海河流域河流水资源质量概况评价表',
  16: '海河流域水库水资源质量状况评价表',
  17: '海河流域省界水体水资源质量状况',
  18: '海河流域部分平原区浅层地下水水质状况评价表'
}

function openPage(url) {
  window.open(url, '_blank')
}

function showPage(p) {
  let url = null
  // 海河流域分区降水量统计表
  if (p == '1') {
    url = basePath + 'pages/kfly/jsl/tjxx/jsl.jsp'
  }
  // 海河流域代表站月、年降水量统计表
  else if (p == '2') {
    url = basePath + 'pages/kfly/jsl/dbzjsl/dbzjsl.jsp'
  }
  // 海河流域分区地表水资源量统计表
  else if (p == '3') {
    url = basePath + 'pages/kfly/szyl/dbs/dbs.jsp'
  }
  // 海河流域分区地下水资源量统计表
  else if (p == '4') {
    url = basePath + 'pages/kfly/szyl/dxs/dxs.jsp'
  }
  // 海河流域分区水资源总量统计表
  else if (p == '5') {
    url = basePath + 'pages/kfly/szyl/szyzl/szyzl.jsp'
  }
  // 海河流域大中型水库蓄水情况统计表
  else if (p == '6') {
    url = basePath + 'pages/kfly/skxsl/tjxx/skxsl.jsp'
  }
  // 海河流域平原区浅层地下水动态情况统计表
  else if (p == '7') {
    url = basePath + 'pages/kfly/gsl/dxs/gbsj/pydxs.jsp'
  }
  // 海河流域平原区地下水位降落漏斗情况统计表
  else if (p == '8') {
    url = basePath + 'pages/kfly/gsl/dxs/ldsj/dxsld.jsp'
  }
  // 海河流域分区供水量统计表
  else if (p == '9') {
    url = basePath + 'pages/kfly/gsl/gsfx/gsl/gs.jsp'
  }
  // 海河流域分区用水量统计表
  else if (p == '10') {
    url = basePath + 'pages/kfly/ysl/ysfx/ysl.jsp'
  }
  // 海河流域重要城市建成区供用水量统计表
  else if (p == '11') {
    url = basePath + 'pages/kfly/gsl/gsfx/csgsl/jcqgysl.jsp'
  }
  // 海河流域分区耗水量统计表
  else if (p == '12') {
    url = basePath + 'pages/kfly/hsl/hsfx/hsl.jsp'
  }
  // 海河流域分区废污水排放量统计表
  else if (p == '13') {
    url = basePath + 'pages/kfly/psl/pwl.jsp'
  }
  // 海河流域河流水资源质量概况评价表
  else if (p == '14') {
    url = basePath + 'pages/szybh/sjdm/szgk/hlszyzl.jsp'
  }
  // 海河流域河流水资源质量概况评价表
  else if (p == '15') {
    url = basePath + 'pages/szybh/sjdm/hpsz/hpszyzl.jsp'
  }
  // 海河流域水库水资源质量状况评价表
  else if (p == '16') {
    url = basePath + 'pages/szybh/sjdm/sksz/skszyzl.jsp'
  }
  // 海河流域省界水体水资源质量状况
  else if (p == '17') {
    url = basePath + 'pages/szybh/sjdm/sjstsz/sjstsz.jsp'
  }
  // 海河流域部分平原区浅层地下水水质状况评价表
  else if (p == '18') {
    url = basePath + 'pages/szybh/sjdm/pydxssz/pyqcdxs.jsp'
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
