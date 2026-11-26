$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')
  init()
})

function init() {
  debugger
  if (!wrcs_cd && !fq) {
    plain_nm = ''
  } else if (!wrcs_cd && fq) {
    plain_nm = ''
    wrcs_cd = fq
  }
  const param = {
    wrcs_cd: wrcs_cd,
    plain_nm: plain_nm,
    start: $('#beginTm').val(),
    end: $('#endTm').val()
  }
  jQuery.getJSON(basePath + '/message/gb/getPydxs_Qst', param, function (result) {
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
        text: '年地下水量趋势分析图',
        x: 'center'
      },
      tooltip: {},
      legend: {
        data: ['地下水量'],
        x: 'right'
      },
      xAxis: {
        data: yr
      },
      yAxis: {
        name: '亿m³'
      },
      series: [
        {
          name: '地下水量',
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
