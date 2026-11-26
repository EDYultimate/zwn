$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  //	$("#rightDiv").css("width",bodyrightWidth+"px");
  const date = new Date()
  const year = date.getFullYear()

  $('#beginTm').val(year - 10)
  $('#endTm').val(year)
  init()
})

function init() {
  const lylevel = $('#lyfqselect', parent.document).val()
  const param = {
    wrcd: wrcd,
    type: type,
    level: lylevel,
    btm: $('#beginTm').val(),
    etm: $('#endTm').val()
  }
  jQuery.getJSON(basePath + '/hsl/et/getXzqDialog', param, function (list) {
    console.info(list)
    if (list != null && list.length > 0) {
      var xArr = []
      var valArr = []
      for (let i = 0; i < list.length; i++) {
        xArr[i] = isNull(list[i].CHARTX)
        valArr[i] = isNull(list[i].CHARTY)
      }
    }
    const option = {
      title: {
        text: 'ET值趋势分析图'
      },
      tooltip: {},
      legend: {
        data: ['ET值']
      },
      xAxis: {
        data: xArr
      },
      yAxis: {
        name: 'mm'
      },
      series: [
        {
          name: 'ET值',
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#9ad4d4'
              }
            }
          },
          data: valArr
        }
      ]
    }
    const myChart_qs = echarts.init(document.getElementById('rightDiv'))
    myChart_qs.setOption(option)
  })
}
