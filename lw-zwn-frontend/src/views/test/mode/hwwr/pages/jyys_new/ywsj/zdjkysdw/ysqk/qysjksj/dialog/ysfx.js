$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')

  const date = new Date()
  const year = date.getFullYear()
  $('#yr').val(year)

  init()
})

function init() {
  // var param = {"id":id,"wiu_cd":wiu_cd,"yr":$("#yr").val()};
  const param = { wiu_cd: wiu_cd, yr: $('#yr').val() }
  jQuery.getJSON(basePath + 'jyys/ywsj/getYsdwQysjkYsfxInfo', param, function (result) {
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
          isNull(data[i].MN) +
          '</td>' +
          '<td>' +
          isNull(data[i].PLANW) +
          '</td>' +
          '<td>' +
          isNull(data[i].W) +
          '</td></tr>'
      }
      for (let j = data.length; j < 11; j++) {
        str += '<tr>' + '<td></td><td></td><td></td>' + '</tr>'
      }
      $('#tbody').empty().append(str)

      /*   for(var i=data.length-1;i>=0 ;i--){
                xdataArr[data.length-1-i]=data[i].MN;
                y1dataArr[data.length-1-i]=data[i].PLANW;
                y2dataArr[data.length-1-i]=data[i].W;
            }*/
      for (var i = 0; i < data.length; i++) {
        xdataArr[i] = data[i].MN
        y1dataArr[i] = data[i].PLANW
        y2dataArr[i] = data[i].W
      }
    }
    const option = {
      title: {
        text: '用水分析图',
        x: 'left'
      },
      tooltip: {},
      legend: {
        data: ['计划用水量', '累计用水量'],
        x: 'middle'
      },
      xAxis: {
        data: xdataArr
      },
      yAxis: {
        name: '万m³'
      },
      series: [
        {
          name: '计划用水量',
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
          name: '实际用水量',
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
