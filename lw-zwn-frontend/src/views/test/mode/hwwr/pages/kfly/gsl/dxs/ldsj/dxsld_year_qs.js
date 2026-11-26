$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')
  init()
})

function init() {
  debugger
  if (!funn_cd) {
    funn_cd = ''
  }
  const param = { funn_cd: funn_cd, start: $('#beginTm').val(), end: $('#endTm').val() }
  jQuery.getJSON(basePath + '/message/gb/getDxsLdGb_Qst', param, function (result) {
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
        text: '年末漏斗面积趋势分析图',
        x: 'center'
      },
      tooltip: {},
      grid: {
        left: '10%',
        right: '10%'
      },
      legend: {
        data: ['漏斗面积'],
        x: 'right'
      },
      xAxis: {
        data: yr
      },
      yAxis: {
        name: 'k㎡'
      },
      series: [
        {
          name: '漏斗面积',
          type: 'line',
          showAllSymbol: true,
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
