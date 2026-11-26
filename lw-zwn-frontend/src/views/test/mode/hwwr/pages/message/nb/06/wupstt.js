/**
 * ====================== 按水资源分区 =================
 */
let ctable1

function finished1() {
  initstyle1()
}

function initstyle1() {
  // 标题宽度设置为和表格宽度相同
  const width = $('#table1').width()
  $('.titleDiv1').width(width)
}

function inittable1() {
  // 查询最近有数据的年份
  $.post(
    hwwr.basePath + 'message/nb/getSzyNb_Year',
    {
      tp: '007'
    },
    function (data) {
      if (!data || (data && data.length < 1)) {
        return
      }
      changeyear1(data)
      maketable1()
    }
  )
}

function maketable1() {
  $.post(
    hwwr.basePath + 'message/nb/getWUPSTT_BAS',
    {
      year: hwwr.option.year
    },
    function (data) {
      const results = JSON.parse(data)
      if (!results || results.length < 1) {
        //			var newdata = makeEmptyData();
        //			results = newdata;
      }
      option = {
        // 真实表头
        realth: $('#realth1 tr th[data-field]'),
        // 数字保留小数位数(-1为不设置保留小数位)
        numfixed: 2,
        // 需要在列中合并单元格
        mergeincols: [4],
        // 最大合并的单元格个数
        mergecolcellsize: 4
      }
      ctable1 = cgrid.instance('table1', option)
      ctable1.finished = finished1
      ctable1.genTable(results)

      //		// 生成图形
      //		makecharts(results);
    }
  )
}

function makeEmptyData1() {
  return []
}

function changeyear1(year) {
  $('#chooseyear').val(year)
  $('#cyear1').text(year)
  hwwr.option.year = year
}

/**
 * ====================== 按行政区 =================
 */
let ctable2

function finished2() {
  initstyle2()
}

function initstyle2() {
  // 标题宽度设置为和表格宽度相同
  const width = $('#table2').width()
  $('.titleDiv2').width(width)
}

function inittable2() {
  // 查询最近有数据的年份
  $.post(
    hwwr.basePath + 'message/nb/getSzyNb_Year',
    {
      tp: '007'
    },
    function (data) {
      if (!data || (data && data.length < 1)) {
        return
      }
      changeyear2(data)
      maketable2()
    }
  )
}

function maketable2() {
  $.post(
    hwwr.basePath + 'message/nb/getWUPSTT_AD',
    {
      year: hwwr.option.year
    },
    function (data) {
      const results = JSON.parse(data)
      if (!results || results.length < 1) {
        //			var newdata = makeEmptyData();
        //			results = newdata;
      }
      option = {
        // 真实表头
        realth: $('#realth2 tr th[data-field]'),
        // 数字保留小数位数(-1为不设置保留小数位)
        numfixed: 2,
        // 需要在列中合并单元格
        mergeincols: [4],
        // 最大合并的单元格个数
        mergecolcellsize: 4
      }
      ctable2 = cgrid.instance('table2', option)
      ctable2.finished = finished2
      ctable2.genTable(results)

      //		// 生成图形
      //		makecharts(results);
    }
  )
}

function makeEmptyData2() {
  return []
}

function changeyear2(year) {
  $('#chooseyear').val(year)
  $('#cyear2').text(year)
  hwwr.option.year = year
}

/**
 * ====================== 公用方法 =================
 */
function querybyyear() {
  const year = $('#chooseyear').val()
  $('#cyear1').text(year)
  hwwr.option.year = year
  maketable1()
  maketable2()
}

$(document).ready(function () {
  inittable1()
  inittable2()
})
