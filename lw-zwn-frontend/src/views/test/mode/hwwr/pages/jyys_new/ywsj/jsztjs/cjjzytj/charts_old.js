function chart(results) {
  //初始化echarts实例
  const chart = echarts.init(document.getElementById('xyChart'))
  console.log(results)
  const cfData = []
  const lsData = []
  const lyData = []
  const xname = []
  for (let i = 0; i < results.length; i++) {
    cfData[i] = results[i].SCIA_T
    lsData[i] = results[i].SCORG_T
    lyData[i] = results[i].SCLE_T
    xname[i] = results[i].AD_NM
  }
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    toolbox: {
      feature: {
        // dataView: {show: true, readOnly: false},
        // magicType: {show: true, type: ['line', 'bar']},
        // restore: {show: true},
        // saveAsImage: {show: true}
      }
    },
    legend: {
      data: ['节水型灌区', '节水型单位', '节水型居民小区']
    },
    xAxis: [
      {
        type: 'category',
        data: xname,
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '创建进程与统计（个）',
        // min: 0,
        // max: 250,
        // interval: 50,
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: '节水型灌区',
        type: 'bar',
        barWidth: 25,
        data: cfData
      },
      {
        name: '节水型单位',
        type: 'bar',
        barWidth: 25,
        data: lsData
      },
      {
        name: '节水型居民小区',
        type: 'bar',
        barWidth: 25,
        // yAxisIndex: 1,
        data: lyData
      }
    ]
    // color : ['#4cabce' ],
    // title: {
    //     text: '取水量统计(亿立方米)',
    //     left : 'center'
    // },
    // tooltip: {},
    // xAxis: {
    //     data: datas.name
    // },
    // yAxis: {},
    // series: [{
    //     name: '合计',
    //     type: 'bar',
    //     barMaxWidth: 50,
    //     data: datas.data
    // }]
  }
  chart.setOption(option)
}

function makecharts(results) {
  chart(results)
}
