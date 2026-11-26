$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  $('#beginTm').val(year + '-' + month + '-01')
  $('#endTm').val(getCurrentYMD())
  init()
})

function init() {
  const param = { cd: wrcs_cd, btm: $('#beginTm').val(), etm: $('#endTm').val() }
  jQuery.getJSON(basePath + '/gsl/dxs/getGslDxsDialogInfo', param, function (list) {
    if (list != null && list.length > 0) {
      let str = ''
      var x = []
      var da = []
      for (var i = list.length - 1; i >= 0; i--) {
        str +=
          '<tr>' +
          '<td>' +
          dateTimeHFormate1(list[i].TM) +
          '</td>' +
          '<td>' +
          isNull(list[i].BD) +
          '</td>' +
          '</tr>'
      }
      for (var i = 0; i < list.length; ++i) {
        x.push(dateTimeFormate(list[i].TM))
        da.push(list[i].BD)
      }
      for (let j = list.length; j < 12; j++) {
        str += '<tr>' + '<td></td><td></td>' + '</tr>'
      }

      $('#tbody').empty().append(str)
    }
    const option = {
      title: {
        text: '测站埋深监测信息趋势分析图'
      },
      tooltip: {},
      legend: {
        data: ['埋深']
      },
      xAxis: {
        data: x
      },
      yAxis: {
        name: 'm'
      },
      series: [
        {
          name: '埋深',
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#9ad4d4'
              }
            }
          },
          data: da
        }
      ]
    }
    const myChart_qs = echarts.init(document.getElementById('rightDiv'))
    myChart_qs.setOption(option)
  })
}
