$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')
  //	$("#beginTm").val((new Date().Format("yyyy"))-5);
  //	$("#endTm").val(new Date().Format("yyyy"));
  init()
})

function init() {
  const param = { cd: wrcs_cd, bdat: $('#beginTm').val(), edat: $('#endTm').val() }
  jQuery.getJSON(basePath + '/szybh/rhpwk/getRhpwkJcInfoDialog', param, function (list) {
    if (list != null && list.length >= 0) {
      let str = ''
      var x = []
      var da = []
      for (var i = list.length - 1; i >= 0; i--) {
        str +=
          '<tr>' +
          '<td>' +
          isNull(list[i].YR) +
          '</td>' +
          '<td>' +
          isNull(list[i].SEW_DA) +
          '</td>' +
          '</tr>'
      }
      for (var i = 0; i < list.length; ++i) {
        x.push(isNull(list[i].YR))
        da.push(list[i].SEW_DA)
      }
      for (let j = list.length; j < 12; j++) {
        str += '<tr>' + '<td></td><td></td>' + '</tr>'
      }

      $('#tbody').empty().append(str)
    }
    const option = {
      title: {
        text: '入河排污口污水排放量趋势分析图'
      },
      tooltip: {},
      legend: {
        right: 15,
        data: ['污水排放量']
      },
      xAxis: {
        data: x
      },
      yAxis: {
        name: '万吨/年'
      },
      series: [
        {
          name: '污水排放量',
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
