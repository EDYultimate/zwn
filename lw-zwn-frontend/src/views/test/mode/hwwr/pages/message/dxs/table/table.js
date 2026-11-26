/**
 * 公用方法
 */
// 在指定行加背景颜色
function addrowcolor(tableid, results) {
  const datas = ['平原区合计', '盆地区合计', '统计范围合计']
  const color = '#edf6f9'
  // 需要添加背景色的行
  const idx = []
  for (var i = 0; i < results.length; ++i) {
    const row = results[i]
    if (datas.indexOf(row.WRZ_NM) != -1) {
      idx.push(i)
    }
  }
  for (var i = 0; i < idx.length; ++i) {
    $('#' + tableid + ' tr[data-index="' + idx[i] + '"]').css('background-color', color)
  }
}

/**
 * 季报
 * 平原和山间盆地地下水蓄变量统计表 (与上年同季度比较)
 */
let catble1

const finished1 = function () {
  if (!ctable1.data || ctable1.data.length < 1) {
    return
  }
  // 加上颜色
  addrowcolor('table', ctable1.data)
}

function maketable1() {
  $.post(
    hwwr.basePath + 'message/dxs/qryear',
    {
      yearNo: hwwr.option.yearNo
    },
    function (data) {
      const results = JSON.parse(data)
      option = {
        // 真实表头
        realth: $('#realth tr th[data-field]')
      }
      // 上一年
      $('#lastyear').text(results.last + '底')
      //
      $('#cdate1').text('（' + results.curr + '底）')
      ctable1 = cgrid.instance('table', option)
      ctable1.finished = finished1
      ctable1.genTable(results.data)
    }
  )
}

/**
 * 季报
 * 平原和山间盆地地下水蓄变量统计表 (与上季度比较)
 */
let catble2

const finished2 = function () {
  if (!ctable2.data || ctable2.data.length < 1) {
    return
  }
  // 加上颜色
  addrowcolor('table2', ctable2.data)
}

function maketable2() {
  $.post(
    hwwr.basePath + 'message/dxs/qrquarter',
    {
      yearNo: hwwr.option.yearNo
    },
    function (data) {
      const results = JSON.parse(data)
      option = {
        // 真实表头
        realth: $('#realth2 tr th[data-field]')
      }
      // 上一年
      $('#lastquarter').text(results.last + '底')
      //
      $('#cdate2').text('（' + results.curr + '底）')
      ctable2 = cgrid.instance('table2', option)
      ctable2.finished = finished2
      ctable2.genTable(results.data)
    }
  )
}

$(document).ready(function () {
  // 季报 -  平原和山间盆地地下水蓄变量统计表 (与上年同季度比较)
  maketable1()
  // 季报 -  平原和山间盆地地下水蓄变量统计表 (与上季度比较)
  maketable2()
  // 季报 2张图像 -  平原和山间盆地地下水蓄变量统计表 (与上年同季度比较)
  makeYearChart()
  // 季报 2张图像 -  平原和山间盆地地下水蓄变量统计表 (与上季度比较)
  makeQuarterChart()
})
