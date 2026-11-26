/**
 * 海委上报中央数据情况
 */
let ctable1

function finished1() {}

function clickRow1(rownum) {
  const data = ctable1.data[rownum]
  layer.open({
    type: 2,
    title: data.NM,
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['700px', '600px'],
    content:
      hwwr.basePath + 'pages/lyzg/zysjtj/zysjtj_dg.jsp?date=' + data.TM + '&type=' + data.TYPE
  })
}

function maketable1() {
  $.post(
    hwwr.basePath + '/sjtj/sjqk/getSendSjqk',
    {
      date: $('#chooseyear').val()
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

/**
 * 海委接收中央数据情况
 */
let ctable2

function finished2() {}

function maketable2() {
  $.post(
    hwwr.basePath + '/sjtj/sjqk/getRecvSjqk',
    {
      date: $('#chooseyear').val()
    },
    function (results) {
      option = {}
      ctable2 = cgrid.instance('table2', option)
      ctable2.finished = finished2
      ctable2.genTable(results)
    }
  )
}

/**
 * 公共部分
 */

function changeyear(date) {
  const year = date.split('-')[0]
  const month = date.split('-')[1]
  $('.cyear').text(year)
  $('.cmonth').text(month)
  $('#chooseyear').val(date)
}

function querybyyear() {
  maketable1()
  maketable2()

  const date = $('#chooseyear').val()
  const year = date.split('-')[0]
  const month = date.split('-')[1]
  $('.cyear').text(year)
  $('.cmonth').text(month)
}

function inittable() {
  // 当前年月
  const date = moment().format('YYYY-MM')
  changeyear(date)
  querybyyear()
}

$(document).ready(function () {
  inittable()
})
