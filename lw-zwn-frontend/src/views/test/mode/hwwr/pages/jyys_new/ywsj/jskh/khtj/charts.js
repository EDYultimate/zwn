function chart1(results) {
  //初始化echarts实例
  const chart = echarts.init(document.getElementById('ysChart'))

  const cfData = []
  const xname = []
  for (let i = 0; i < results.length; i++) {
    cfData[i] = results[i].IND_RRIW

    xname[i] = results[i].AD_NM
  }
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{c}%',
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
      data: ['工业用水重复利用率']
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
        name: '比率',
        // min: 0,
        // max: 250,
        // interval: 50,
        axisLabel: {
          /*formatter: '{value}'*/
          formatter: '{value}%'
        }
      }
    ],
    series: [
      {
        name: '工业用水重复利用率',
        type: 'bar',
        barWidth: 25,
        data: cfData,
        itemStyle: {
          label: {
            formatter: '{b}\n{c}%'
          }
        }
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
      formatter: '{c}%',
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
      data: ['公共供水管网漏损率']
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
        name: '比率',
        // min: 0,
        // max: 250,
        // interval: 50,
        axisLabel: {
          formatter: '{value}%'
        }
      }
    ],
    series: [
      {
        name: '公共供水管网漏损率',
        type: 'bar',
        barWidth: 25,
        data: lsData,
        itemStyle: {
          label: {
            formatter: '{b}\n{c}%'
          }
        }
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
    lyData[i] = results[i].IRR_R
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
      data: ['农田灌溉水有效利用系数']
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
        name: '系数',
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
        name: '农田灌溉水有效利用系数',
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
