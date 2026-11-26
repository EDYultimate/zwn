$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')
  $('#beginTm').val(getLastYM())
  $('#endTm').val(getLastMYM())
  init()
})

function init() {
  const param = { cd: wrcs_cd, btm: $('#beginTm').val(), etm: $('#endTm').val() }
  jQuery.getJSON(basePath + '/szybh/sgnq/getSgnqDialogInfo', param, function (list) {
    console.info(list)
    if (list != null && list.length > 0) {
      let str = ''
      var x = []
      var da = []
      for (var i = list.length - 1; i >= 0; i--) {
        str +=
          '<tr>' +
          '<td>' +
          dateTimeFormate(list[i].ASOT) +
          '</td>' +
          '<td>' +
          formatSz(list[i].WQG) +
          '</td>' +
          '</tr>'
      }
      for (var i = 0; i < list.length; i++) {
        x.push(dateTimeFormate(list[i].ASOT))
        da.push(isNull(list[i].WQG))
      }
      for (let j = list.length; j < 12; j++) {
        str += '<tr>' + '<td></td><td></td>' + '</tr>'
      }

      $('#tbody').empty().append(str)
    }

    const option = {
      title: {
        text: '水质类别趋势分析图'
      },
      tooltip: {},
      legend: {
        data: ['水质类别']
      },
      xAxis: {
        data: x
      },
      yAxis: {
        axisLabel: {
          formatter: function (value, index) {
            const texts = []
            if (index === 1) {
              texts.push('Ⅰ类')
            }
            if (index === 2) {
              texts.push('Ⅱ类')
            }
            if (index === 3) {
              texts.push('Ⅲ类')
            }
            if (index === 4) {
              texts.push('Ⅳ类')
            }
            if (index === 5) {
              texts.push('Ⅴ类')
            }
            if (index === 6) {
              texts.push('劣Ⅴ类')
            }
            return texts
          }
        }
      },
      series: [
        {
          name: '水质类别',
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
