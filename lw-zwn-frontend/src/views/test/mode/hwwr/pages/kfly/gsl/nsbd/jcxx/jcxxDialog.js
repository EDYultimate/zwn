$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')
  $('#beginTm').val(getLastMYM() + '-01')
  $('#endTm').val(getCurrentYMD())
  init()
})

function init() {
  const param = { cd: wrcs_cd, btm: $('#beginTm').val(), etm: $('#endTm').val() }
  jQuery.getJSON(basePath + '/kfly/nsbd/getNsbdDayQQst', param, function (list) {
    const x = []
    const dat = []
    if (list != null && list.length > 0) {
      let str = ''
      for (let i = list.length - 1; i >= 0; i--) {
        str +=
          '<tr>' +
          '<td>' +
          isNull(list[i].TM) +
          '</td>' +
          '<td>' +
          isNull(list[i].Q) +
          '</td>' +
          '</tr>'
      }
      for (let j = 0; j < list.length; j++) {
        x[j] = isNull(list[j].TM)
        dat[j] = isNull(list[j].Q)
      }
      $('#tbody').empty().append(str)
    }
    const option = {
      title: {
        text: '日流量分析图',
        x: 'center'
      },
      tooltip: {},
      legend: {
        data: ['流量'],
        x: 'right'
      },
      xAxis: {
        data: x
      },
      yAxis: {
        name: 'm³/s'
      },
      series: [
        {
          name: '流量',
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#9ad4d4'
              }
            }
          },
          data: dat
        }
      ]
    }
    const myChart_qs = echarts.init(document.getElementById('rightDiv'))
    myChart_qs.setOption(option)
  })
}
