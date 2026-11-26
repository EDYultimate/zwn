$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')
  $('#beginTm').val(GetDay())
  $('#endTm').val(getCurrentYMD())
  init()
})

function init() {
  const param = {
    stcd: wrcs_cd,
    beginTm: $('#beginTm').val() + ' 00:00:00',
    endTm: $('#endTm').val() + ' 23:59:00',
    pageNo: '1',
    pageSize: '1000'
  }
  jQuery.getJSON(basePath + '/szybh/sjdm/getSjdmSwDialog', param, function (result) {
    const list = result.page.list
    console.info(list)
    if (list != null && list.length > 0) {
      let str = ''
      //			var x = [];
      //			var da = [];
      for (let i = list.length - 1; i >= 0; i--) {
        str +=
          '<tr>' +
          '<td style="padding:0">' +
          isNull(list[i].NEWTM) +
          '</td>' +
          '<td>' +
          isNull(list[i].RZ) +
          '</td>' +
          '</tr>'
      }
      for (let j = list.length; j < 12; j++) {
        str += '<tr>' + '<td></td><td></td>' + '</tr>'
      }

      $('#tbody').empty().append(str)
    }
    setAnyChartFun(list)
  })
}

function setAnyChartFun(list) {
  const x = []
  const da = []
  for (let i = 0; i < list.length; i++) {
    x.push(isNull(list[i].NEWTM))
    da.push(isNull(list[i].RZ))
  }
  const myChart_qs = echarts.init(document.getElementById('rightDiv'))

  const option = {
    title: {
      text: '水位趋势分析图'
    },
    tooltip: {},
    legend: {
      data: ['水位']
    },
    xAxis: {
      data: x,
      axisLabel: {}
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} m'
      }
    },
    series: [
      {
        name: '水位',
        type: 'line',
        label: {
          formatter: '{value} （m）'
        },
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
  // 使用刚指定的配置项和数据显示图表。
  myChart_qs.setOption(option)
}
