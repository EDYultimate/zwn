let ctable1

function finished1() {}

function clickRow1(rownum) {}

function maketable1(date) {
  $.post(
    basePath + '/sjtj/sjqk/getSendByType',
    {
      date: date,
      type: type
    },
    function (results) {
      option = {}
      ctable1 = cgrid.instance('table1', option)
      ctable1.finished = finished1
      ctable1.clickRow = clickRow1
      ctable1.genTable(results)
    }
  )
}

function init() {
  const date = $('#tm').val()
  maketable1(date)
}

$(document).ready(function () {
  $('#tm').val(new Date().Format('yyyy-MM')) //默认当前月
  const date = $('#tm').val()
  maketable1(date)
})
