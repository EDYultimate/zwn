$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')
  init()
})

function init() {
  const param = { wrcs_cd: wrcs_cd, beginTm: $('#beginTm').val(), endTm: $('#endTm').val() }
  jQuery.getJSON(basePath + '/kfly/qsxk/getSzylzQst', param, function (result) {
    const list = result.list
    if (list != null && list.length > 0) {
      var str = ''
      for (let i = list.length - 1; i >= 0; i--) {
        str +=
          '<tr>' +
          '<td>' +
          isNull(list[i].YR) +
          '</td>' +
          '<td>' +
          isNull(list[i].WW) +
          '</td>' +
          '</tr>'
      }
      for (var j = list.length; j < 12; j++) {
        str += '<tr>' + '<td></td><td></td>' + '</tr>'
      }
      $('#tbody').empty().append(str)
    } else {
      var str = ''
      for (var j = 0; j < 12; j++) {
        str += '<tr>' + '<td></td><td></td>' + '</tr>'
      }
      $('#tbody').empty().append(str)
    }
    const option = {
      title: {
        text: '取水量趋势分析图'
      },
      tooltip: {},
      legend: {
        data: ['取水量']
      },
      xAxis: {
        data: result.yr
      },
      yAxis: {
        name: '万m³'
      },
      series: [
        {
          name: '取水量',
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#9ad4d4'
              }
            }
          },
          data: result.ww
        }
      ]
    }
    const myChart_qs = echarts.init(document.getElementById('rightDiv'))
    myChart_qs.setOption(option)
  })
}
