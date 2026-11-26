let ctable

function finished() {
  const rowlength = $('tr').length

  for (let row = 1; row < rowlength; ++row) {
    /*  var  W = ctable.data[row-1].W;
        if (W > 0) {
            $($($('tr')[row])).css('color','red');
        }*/
    const YELLOWW = ctable.data[row - 1].YELLOWW
    const REDW = ctable.data[row - 1].REDW
    if (REDW > 0) {
      $($($('tr')[row])).css('color', 'red')
    } else if (REDW < 0 && YELLOWW > 0) {
      $($($('tr')[row])).css('color', '#ffa500')
    }
  }
}

function inittable() {
  // 查询最近有数据的年份
  maketable()
}

function maketable() {
  const param = { tm: $('#tm').val(), jgdw: $('#conc_org').val() }
  $.post(basePath + 'message/rcgl/wfzgl/getQsdQslSjjh', param, function (data) {
    debugger
    const results = data

    option = {}
    ctable = cgrid.instance('table', option)
    ctable.finished = finished
    ctable.genTable(results)

    //		// 生成图形
    //		makecharts(results);
  })
}

$(document).ready(function () {
  inittable()
  $('#tm').val(new Date().Format('yyyy-MM-dd'))
})
