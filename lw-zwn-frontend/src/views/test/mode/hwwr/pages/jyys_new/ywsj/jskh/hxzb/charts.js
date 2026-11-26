function chart1(results) {
  // 万元工业增加值用水量下降幅度
  //初始化echarts实例
  const chart = echarts.init(document.getElementById('ysChart'))
  const cfData = []
  const lyData = []

  const xname = []
  for (let i = 0; i < results.length; i++) {
    cfData[i] = results[i].ADD_TAR_IND //目标值
    lyData[i] = results[i].ADD_ACT_IND //实际值

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
      data: ['目标', '自评实际值']
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
        name: '万元工业增加值用水量下降幅度（%）',
        // min: 0,
        // max: 250,
        // interval: 50,
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: '目标',
        type: 'bar',
        barWidth: 15,
        data: cfData
      },
      {
        name: '自评实际值',
        type: 'bar',
        barWidth: 15,
        data: lyData
      }
    ]
  }
  chart.setOption(option)
}

function chart2(results) {
  //初始化echarts实例
  const chart2 = echarts.init(document.getElementById('ysChart2'))

  const lsData = []
  const ctData = []

  const xname = []
  for (let i = 0; i < results.length; i++) {
    lsData[i] = results[i].TAR_IRR
    ctData[i] = results[i].ACT_IRR

    xname[i] = results[i].AD_NM
  }
  const option = {
    color: ['#d48265', '#61a0a8'],
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
      data: ['目标', '自评实际值']
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
        name: '农田灌溉水有效利用系数',
        // min: 0,
        // max: 250,
        // interval: 50,
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: '目标',
        type: 'bar',
        barWidth: 15,
        data: lsData
      },
      {
        name: '自评实际值',
        type: 'bar',
        barWidth: 15,
        data: ctData
      }
    ]
  }
  chart2.setOption(option)
}

function makecharts(results) {
  chart1(results)
  chart2(results)
}
