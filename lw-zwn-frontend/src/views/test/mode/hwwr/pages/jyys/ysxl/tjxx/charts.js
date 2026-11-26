function chart1(results) {
  //初始化echarts实例
  const chart = echarts.init(document.getElementById('ysChart'))
  console.log(results)
  const cfData = []

  const xname = []
  for (let i = 0; i < results.length; i++) {
    cfData[i] = results[i].IND_RRIW

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
      data: ['重复利用率']
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
        name: '比率（%）',
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
        name: '重复利用率',
        type: 'bar',
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
    lsData[i] = results[i].PIPE_DROP_R

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
      data: ['漏损率']
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
        name: '比率（%）',
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
        name: '漏损率',
        type: 'bar',
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
    lyData[i] = (results[i].IRR_R * 100).toFixed(0)
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
      data: ['利用系数']
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
        name: '比率（%）',
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
        name: '利用系数',
        type: 'bar',
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
