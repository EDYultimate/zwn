$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')
  init()
})

function init() {
  debugger
  if (!type) {
    type = ''
  }
  if (!rv_cd) {
    rv_cd = ''
  }
  const param = { rv_cd: rv_cd, type: type, start: $('#beginTm').val(), end: $('#endTm').val() }
  jQuery.getJSON(basePath + '/message/gb/getHlSzyzl_Qst', param, function (result) {
    const list = result
    const yr = []
    const jsl = []
    $('#tbody').empty()
    if (list != null && list.length > 0) {
      let str = ''
      for (var i = 0; i < list.length; ++i) {
        str +=
          '<tr>' +
          '<td>' +
          isNull(list[i].YEAR) +
          '</td>' +
          '<td>' +
          isNull(list[i].CUR_P) +
          '</td>' +
          '</tr>'
      }
      for (var i = list.length - 1; i >= 0; --i) {
        yr.push(list[i].YEAR)
        jsl.push(list[i].CUR_P)
      }
      $('#tbody').append(str)
    }
    const option = {
      title: {
        text: '年评价河长趋势分析图',
        x: 'center'
      },
      tooltip: {},
      legend: {
        data: ['评价河长'],
        x: 'right'
      },
      xAxis: {
        data: yr
      },
      yAxis: {
        name: 'km'
      },
      series: [
        {
          name: '评价河长',
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#9ad4d4'
              }
            }
          },
          data: jsl
        }
      ]
    }
    const myChart_qs = echarts.init(document.getElementById('rightDiv'))
    myChart_qs.setOption(option)
  })
}
