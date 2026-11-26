$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')
  init()
})

function init() {
  const param = { wrcs_cd: wrcs_cd, beginTm: $('#beginTm').val(), endTm: $('#endTm').val() }
  jQuery.getJSON(basePath + '/kfly/jsl/getJsl_Qst', param, function (result) {
    const list = result.list
    if (list != null && list.length > 0) {
      let str = ''
      for (let i = list.length - 1; i >= 0; i--) {
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
      for (let j = list.length; j < 12; j++) {
        str += '<tr>' + '<td></td><td></td>' + '</tr>'
      }
      $('#tbody').empty().append(str)
    }
    const option = {
      title: {
        text: '年降水量趋势分析图',
        x: 'center',
        textStyle: {
          color: '#404c5b',
          fontWeight: 'normal'
        }
      },
      tooltip: {},
      legend: {
        data: ['降水量'],
        x: 'right'
      },
      xAxis: {
        type: 'category',
        data: result.yr,
        axisLabel: {
          rotate: 30,
          interval: 0
        }
      },
      yAxis: {
        name: 'mm'
      },
      series: [
        {
          name: '降水量',
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#9ad4d4'
              }
            }
          },
          data: result.jsl
        }
      ]
    }
    const myChart_qs = echarts.init(document.getElementById('rightDiv'))
    myChart_qs.setOption(option)
  })
}
