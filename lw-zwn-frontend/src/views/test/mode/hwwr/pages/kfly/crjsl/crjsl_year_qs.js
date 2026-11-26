$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')
  init()
})

function init() {
  const param = { wrcs_cd: wrcs_cd, beginTm: $('#beginTm').val(), endTm: $('#endTm').val() }
  jQuery.getJSON(basePath + '/kfly/crjsl/getCrjsl_Qst', param, function (result) {
    const data = result.list
    console.info(data)
    const xdataArr = []
    const y1dataArr = []
    const y2dataArr = []
    if (data != null && data.length > 0) {
      let str = ''
      for (var i = 0; i < data.length; i++) {
        str +=
          '<tr><td>' +
          isNull(data[i].YEAR) +
          '</td>' +
          '<td>' +
          isNull(data[i].IN_PROV_WAT) +
          '</td>' +
          '<td>' +
          isNull(data[i].OUT_PORV_WAT) +
          '</td></tr>'
      }
      for (let j = data.length; j < 11; j++) {
        str += '<tr>' + '<td></td><td></td><td></td>' + '</tr>'
      }
      $('#tbody').empty().append(str)

      for (var i = data.length - 1; i >= 0; i--) {
        xdataArr[data.length - 1 - i] = data[i].YEAR
        y1dataArr[data.length - 1 - i] = data[i].IN_PROV_WAT
        y2dataArr[data.length - 1 - i] = data[i].OUT_PORV_WAT
      }
    }
    const option = {
      title: {
        text: '出入省境水量年趋势分析图',
        x: 'left'
      },
      tooltip: {},
      legend: {
        data: ['入境水量', '出境水量'],
        x: 'right'
      },
      xAxis: {
        data: xdataArr
      },
      yAxis: {
        name: '万m³'
      },
      series: [
        {
          name: '入境水量',
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#9ad4d4'
              }
            }
          },
          data: y1dataArr
        },
        {
          name: '出境水量',
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#372bd4'
              }
            }
          },
          data: y2dataArr
        }
      ]
    }
    const myChart_qs = echarts.init(document.getElementById('rightDiv'))
    myChart_qs.setOption(option)
  })
}
