let ctable1

function finished1() {}

function clickRow1(rownum) {}

function maketable1() {
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

$(document).ready(function () {
  maketable1()
})
