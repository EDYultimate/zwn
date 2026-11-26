$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10

  //    echartsIntoPanJiaKouRiver(2);
})

function echartsIntoPanJiaKouRiver(data) {
  option = {
    grid: {
      height: 150
      //		    	top:30,
      //		    	left:50
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value',
      name: '入库河流',
      axisLabel: {
        formatter: '{value} ml'
      }
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }
    ]
  }
  echarts.init(document.getElementById('IntoRiverPanJiaKouDiv')).setOption(option)
}

function echartsIntoDaHeiDingRiver(data) {
  option = {
    grid: {
      height: 150
      //		    	top:30,
      //		    	left:50
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value',
      name: '入库河流',
      axisLabel: {
        formatter: '{value} ml'
      }
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }
    ]
  }
  echarts.init(document.getElementById('IntoRiverPanJiaKouDiv')).setOption(option)
}
