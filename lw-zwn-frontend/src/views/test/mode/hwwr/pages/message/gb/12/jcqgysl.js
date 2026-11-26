function finished() {
  initstyle()
}

function initstyle() {
  // 标题宽度设置为和表格宽度相同
  const width = $('#table').width()
  $('.titleDiv').width(width)
}

function inittable() {
  // 查询最近有数据的年份
  $.post(
    hwwr.basePath + 'message/gb/getSzyGb_Year',
    {
      tp: '014'
    },
    function (data) {
      if (!data || (data && data.length < 1)) {
        return
      }
      const obj = JSON.parse(data)
      changeyear(obj[0].YEAR)
      maketable()
    }
  )
}

function maketable() {
  $.post(
    hwwr.basePath + 'message/gb/getJcqGyslGb',
    {
      year: hwwr.option.year
    },
    function (data) {
      const results = JSON.parse(data)
      option = {
        // 真实表头
        realth: $('#realth tr th[data-field]'),
        // 数字保留小数位数(-1为不设置保留小数位)
        numfixed: 2
      }
      ctable = cgrid.instance('table', option)
      ctable.finished = finished
      ctable.genTable(results)

      //		// 生成图形
      //		makecharts(results);
    }
  )
}

function changeyear(year) {
  $('#chooseyear').val(year)
  $('#cyear').text(year)
  hwwr.option.year = year
}

function querybyyear() {
  const year = $('#chooseyear').val()
  $('#cyear').text(year)
  hwwr.option.year = year
  maketable()
}

$(document).ready(function () {
  inittable()
})
