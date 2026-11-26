$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')
  init()
})

function init() {
  const param = { wrcs_cd: wrcs_cd, beginTm: $('#beginTm').val(), endTm: $('#endTm').val() }
  jQuery.getJSON(basePath + '/message/gb/getSzyzl_Qst', param, function (result) {
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
          isNull(list[i].TOL) +
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
        //text: '海河流域年水资源总量趋势分析图'
        text: '年水资源总量趋势分析图'
      },
      tooltip: {},
      legend: {
        x: 'right',
        data: ['水量']
      },
      xAxis: {
        data: result.yr
      },
      yAxis: {
        name: '亿m³'
      },
      series: [
        {
          name: '水量',
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#9ad4d4'
              }
            }
          },
          data: result.szyzl
        }
      ]
    }
    const myChart_qs = echarts.init(document.getElementById('rightDiv'))
    myChart_qs.setOption(option)
  })
}
