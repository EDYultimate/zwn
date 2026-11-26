/////////////////////
// 表格
/////////////////////
let ctable

function finished() {
  initstyle()
}

function initstyle() {}

function inittable() {
  // 查询最近有数据的年份
  maketable()
}

function maketable() {
  $.post(basePath + 'lyzg/szynb/getSzynb', {}, function (data) {
    const results = data
    for (let i = 0; i < results.length; ++i) {
      const year = results[i].FILL_YR
      results[i].Link =
        '<a href=\'javascript:window.open("' +
        urls[year] +
        '", "_blank")\' >' +
        year +
        '年水资源公报</a>'
      /*results[i].MANG = "<a href='javascript:ckYear(\""+year+"\")'>管理</a>";*/
      results[i].MANG = '<a href=\'javascript:ckYear("' + year + '")\'>附表</a>'
    }

    option = {}
    ctable = cgrid.instance('table', option)
    ctable.finished = finished
    ctable.genTable(results)

    //		// 生成图形
    //		makecharts(results);
  })
}

function ckYear(year) {
  layer.open({
    type: 2,
    title: '年报信息',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['450px', '380px'],
    content: basePath + '/pages/lyzg/szynb/dialog/nbTable.jsp'
  })
}

// 水资源公报连接
var urls = {
  2016: 'http://www.hwcc.gov.cn/hwcc/static/szygb/gongbao2016/index.html',
  2015: 'http://www.hwcc.gov.cn/hwcc/static/szygb/gongbao2015/index.htm',
  2014: 'http://www.hwcc.gov.cn/hwcc/static/szygb/gongbao2014/index.htm',
  2013: 'http://www.hwcc.gov.cn/hwcc/static/szygb/gongbao2013/index.htm',
  2012: 'http://www.hwcc.gov.cn/hwcc/static/szygb/gongbao2012/index.htm',
  2011: 'http://www.hwcc.gov.cn/hwcc/static/szygb/gongbao2011/index.htm',
  2010: 'http://www.hwcc.gov.cn/hwcc/static/szygb/gongbao2010/index.htm',
  2009: 'http://www.hwcc.gov.cn/hwcc/static/szygb/gongbao2009/index.htm',
  2008: 'http://www.hwcc.gov.cn/hwcc/static/szygb/gongbao2008/index.htm',
  2007: 'http://www.hwcc.gov.cn/hwcc/static/szygb/gongbao2007/index.htm',
  2006: 'http://www.hwcc.gov.cn/hwcc/static/szygb/gongbao2006/index.htm',
  2005: 'http://www.hwcc.gov.cn/hwcc/static/szygb/gongbao2005/index.htm',
  2004: 'http://www.hwcc.gov.cn/hwcc/static/szygb/gongbao_2004/index.htm',
  2003: 'http://www.hwcc.gov.cn/hwcc/static/szygb/gongbao_2003/index.htm',
  2002: 'http://www.hwcc.gov.cn/hwcc/static/szygb/gongbao_2002/index.htm',
  2001: 'http://www.hwcc.gov.cn/hwcc/static/szygb/gongbao_2001/index.htm',
  2000: 'http://www.hwcc.gov.cn/hwcc/static/szygb/gongbao_2000/index.htm'
}

$(document).ready(function () {
  inittable()
})
