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
      tp: '352'
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
    hwwr.basePath + 'message/nb/getWSS_BIN',
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
        numfixed: 2
        // 需要在列中合并单元格
        //mergeincols: [4],
        // 最大合并的单元格个数
        //mergecolcellsize: 4,
      }
      ctable1 = cgrid.instance('table1', option)
      ctable1.finished = finished1
      ctable1.genTable(results)

      //		// 生成图形
      makecharts(results)
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
 * ====================== 公用方法 =================
 */
function querybyyear() {
  const year = $('#chooseyear').val()
  $('#cyear1').text(year)
  hwwr.option.year = year
  maketable1()
}

$(document).ready(function () {
  inittable1()
})
