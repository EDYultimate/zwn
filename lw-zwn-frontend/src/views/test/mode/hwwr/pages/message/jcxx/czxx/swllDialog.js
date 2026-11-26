$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')
  $('#beginTm').val(getLastWeekDate())
  $('#endTm').val(getCurrentYMD())
  init()
})

function init() {
  const param = { stcd: wrcs_cd, beginTm: $('#beginTm').val(), endTm: $('#endTm').val() }
  jQuery.getJSON(basePath + '/szybh/sjdm/getSjdmSwLl_Qst', param, function (list) {
    console.info(list)
    if (list != null && list.length > 0) {
      let str = ''
      var x = []
      var sw = []
      var ll = []
      for (var i = list.length - 1; i >= 0; i--) {
        str +=
          '<tr>' +
          '<td>' +
          isNull(list[i].TM) +
          '</td>' +
          '<td>' +
          isNull(list[i].SW) +
          '</td>' +
          '<td>' +
          isNull(list[i].LL) +
          '</td>' +
          '</tr>'
      }
      for (var i = 0; i < list.length; i++) {
        x.push(isNull(list[i].TM))
        sw.push(isNull(list[i].SW))
        ll.push(isNull(list[i].LL))
      }
      for (let j = list.length; j < 12; j++) {
        str += '<tr>' + '<td></td><td></td><td></td>' + '</tr>'
      }

      $('#tbody').empty().append(str)
    }
    const option = {
      title: {
        text: '水位流量趋势分析图'
      },
      tooltip: {},
      legend: {
        data: ['水位', '流量']
      },
      xAxis: {
        data: x,
        axisLabel: {
          interval: 'auto',
          rotate: 10
        }
      },
      grid: {
        left: '3%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      yAxis: [
        {
          type: 'value',
          name: '水位',
          position: 'left',
          axisLabel: {
            formatter: '{value} （m）'
          }
        },
        {
          type: 'value',
          name: '流量',
          position: 'right',
          axisLabel: {
            formatter: '{value} （m³/s）'
          }
        }
      ],
      series: [
        {
          name: '水位',
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#9ad4d4'
              }
            }
          },
          yAxisIndex: 0,
          data: sw
        },
        {
          name: '流量',
          type: 'line',
          //					itemStyle:{
          //		                normal:{
          //		                     lineStyle:{
          //		                         color:'#9ad4d4'
          //		                     }
          //		                 }
          //		            },
          yAxisIndex: 1,
          data: ll
        }
      ]
    }
    const myChart_qs = echarts.init(document.getElementById('rightDiv'))
    myChart_qs.setOption(option)
  })
}
