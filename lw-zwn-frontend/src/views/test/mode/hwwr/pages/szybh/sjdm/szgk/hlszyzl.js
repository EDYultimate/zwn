function finished() {
  initstyle()
}

function initstyle() {
  //	// 标题宽度设置为和表格宽度相同
  //	var width = $('#table').width();
  //	$('.titleDiv').width(width);
}

function inittable() {
  // 查询最近有数据的年份
  $.post(
    hwwr.basePath + 'message/gb/getSzyGb_Year',
    {
      tp: '017'
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

function clickRow(idx) {
  const row = ctable.data[idx]
  debugger
  layer.open({
    type: 2,
    title: row.RV_NM,
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['850px', '500px'],
    content:
      hwwr.basePath +
      '/pages/szybh/sjdm/szgk/szgk_year_qs.jsp?rv_cd=' +
      row.RV_CD +
      '&type=' +
      row.STYPE
  })
}

function maketable() {
  $.post(
    hwwr.basePath + 'message/gb/getHlSzyzl',
    {
      year: hwwr.option.year
    },
    function (data) {
      const results = JSON.parse(data)
      option = {
        // 真实表头
        realth: $('#realth tr th[data-field]'),
        // 最大合并列单元格个数
        mergecolcellsize: 10,
        // 需要在列中合并单元格
        mergeincols: [3]
      }
      ctable = cgrid.instance('table', option)
      ctable.finished = finished
      ctable.clickRow = clickRow
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
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - 20
  $('.conent').css('height', height)

  inittable()
})
