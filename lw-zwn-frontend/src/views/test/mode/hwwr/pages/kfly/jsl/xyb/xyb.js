function finished() {
  initstyle()
}

function initstyle() {}

function maketable() {
  $.post(
    hwwr.basePath + '/gis/getPPTN_month',
    {
      start: $('#start').val(),
      end: $('#end').val(),
      stnm: $('#stnm').val(),
      val: $('#val').val()
    },
    function (data) {
      debugger
      option = {}
      ctable = cgrid.instance('table', option)
      ctable.finished = finished
      ctable.genTable(data)
    }
  )
}

function query() {
  maketable()
}

function init() {
  // 初始化默认时间
  const curtDate = new Date()
  endtime = curtDate.Format('yyyy-MM')
  starttime = moment().add(0, 'months').format('YYYY-MM')
  // 填入时间查询
  $('#start').val(starttime)
  $('#end').val(endtime)
}

$(document).ready(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - 100
  $('.conent').css('height', height)

  init()
  maketable()
})
