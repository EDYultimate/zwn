function chart(results) {
  //初始化echarts实例
  const chart = echarts.init(document.getElementById('chart'))
  console.log(results)
  const jhData = []
  const sjData = []
  const slData = []
  const qtData = []
  const xname = []
  for (let i = 0; i < results.length; i++) {
    jhData[i] = results[i].SUM1 === undefined ? undefined : parseFloat(results[i].SUM1).toFixed(2)
    sjData[i] = results[i].SUM2 === undefined ? undefined : parseFloat(results[i].SUM2).toFixed(2)
    slData[i] =
      results[i].HP_REAL_WW === undefined ? undefined : parseFloat(results[i].HP_REAL_WW).toFixed(2)
    qtData[i] =
      results[i].OTHR_REAL_WW === undefined
        ? undefined
        : parseFloat(results[i].OTHR_REAL_WW).toFixed(2)
    xname[i] = results[i].WRZ_NM.trim()
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
      data: ['计划取水量', '实际取水量', '水力发电', '其他']
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
        name: '水量(亿立方米)',
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
        name: '计划取水量',
        type: 'bar',
        data: jhData
      },
      {
        name: '实际取水量',
        type: 'bar',
        data: sjData
      },
      {
        name: '水力发电',
        type: 'bar',
        // yAxisIndex: 1,
        data: slData
      },
      {
        name: '其他',
        type: 'bar',
        // yAxisIndex: 1,
        data: qtData
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
