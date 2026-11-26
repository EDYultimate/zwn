function finished() {}

function clickRow(idx) {
  debugger
  const row = ctable.data[idx]
  //getDxsLdGb_Qst
  layer.open({
    type: 2,
    title: row.FUNN_NM,
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['850px', '500px'],
    content: hwwr.basePath + '/pages/kfly/gsl/dxs/ldsj/dxsld_year_qs.jsp?funn_cd=' + row.FUNN_CD
  })
}

function inittable() {
  // 查询最近有数据的年份
  $.post(
    hwwr.basePath + 'message/gb/getSzyGb_Year',
    {
      tp: '010'
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
    hwwr.basePath + 'message/gb/getDxsLdGb',
    {
      year: hwwr.option.year
    },
    function (data) {
      const results = JSON.parse(data)
      option = {
        // 真实表头
        realth: $('#realth tr th[data-field]')
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
  $('#year').val(year)
  $('#cyear').text(year)
  hwwr.option.year = year
}

function querybyyear() {
  const year = $('#year').val()
  $('#cyear').text(year)
  hwwr.option.year = year
  maketable()
}

$(document).ready(function () {
  inittable()
})
