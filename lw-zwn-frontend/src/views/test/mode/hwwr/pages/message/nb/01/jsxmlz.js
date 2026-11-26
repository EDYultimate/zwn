$(document).ready(function () {
  inittable()
})

function changeyear(year) {
  $('#chooseyear').val(year)
  $('#cyear').text(year)
  hwwr.option.year = year
}

function inittable() {
  // 查询最近有数据的年份
  $.post(
    hwwr.basePath + 'message/nb/getSzyNb_Year',
    {
      tp: '040'
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
    hwwr.basePath + 'message/nb/getWRA_ACHT',
    {
      year: $('#chooseyear').val(),
      type: $('#fw').val()
    },
    function (data) {
      const results = data
      if (!results || results.length < 1) {
        //			var newdata = makeEmptyData();
        //			results = newdata;
      }
      option = {
        // 真实表头
        realth: $('#realth tr th[data-field]'),
        // 数字保留小数位数(-1为不设置保留小数位)
        numfixed: 2
      }
      ctable = cgrid.instance('table', option)
      //		ctable.finished = finished;
      ctable.genTable(results)
    }
  )
}

function querybyyear() {
  maketable()
}
