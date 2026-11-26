function chart1(results) {
  //初始化echarts实例
  const chart = echarts.init(document.getElementById('ysChart'))
  console.log(results)
  const cfData = []

  const xname = []
  for (let i = 0; i < results.length; i++) {
    cfData[i] = results[i].SCIA_T

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
      data: ['节水型灌区']
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
        name: '创建数量统计',
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
      }
    ]
  }
  chart.setOption(option)
}

function chart2(results) {
  //初始化echarts实例
  const chart2 = echarts.init(document.getElementById('ysChart2'))
  console.log(results)

  const lsData = []

  const xname = []
  for (let i = 0; i < results.length; i++) {
    lsData[i] = results[i].SCORG_T

    xname[i] = results[i].AD_NM
  }
  const option = {
    color: ['#d48265'],
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
      data: ['节水型单位']
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
        name: '创建数量统计',
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
        name: '节水型单位',
        type: 'bar',
        barWidth: 25,
        data: lsData
      }
    ]
  }
  chart2.setOption(option)
}

function chart3(results) {
  //初始化echarts实例
  const chart3 = echarts.init(document.getElementById('ysChart3'))
  console.log(results)

  const lyData = []
  const xname = []
  for (let i = 0; i < results.length; i++) {
    //lyData[i] = (results[i].IRR_R).toFixed(2)
    lyData[i] = results[i].SCLE_T
    xname[i] = results[i].AD_NM
  }
  const option = {
    color: ['#61a0a8'],
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
      data: ['节水型居民小区']
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
        name: '创建数量统计',
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
        name: '节水型居民小区',
        type: 'bar',
        barWidth: 25,
        // yAxisIndex: 1,
        data: lyData
      }
    ]
  }
  chart3.setOption(option)
}
function makecharts(results) {
  chart1(results)
  chart2(results)
  chart3(results)
}
