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
    hwwr.basePath + 'message/nb/getSzyNb_Year',
    {
      tp: '004'
    },
    function (data) {
      if (!data || (data && data.length < 1)) {
        return
      }
      changeyear(data)
      maketable()
    }
  )
}

function maketable() {
  $.post(
    hwwr.basePath + 'message/nb/getDFBSTT_BAS',
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
        realth: $('#realth tr th[data-field]'),
        // 数字保留小数位数(-1为不设置保留小数位)
        numfixed: 0,
        // 需要在列中合并单元格
        mergeincols: [4],
        // 最大合并的单元格个数
        mergecolcellsize: 4
      }
      ctable = cgrid.instance('table', option)
      ctable.finished = finished
      ctable.genTable(results)

      //		// 生成图形
      //		makecharts(results);
    }
  )
}

function makeEmptyData() {
  return []
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
  test()
})
