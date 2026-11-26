function chart(results) {
  //初始化echarts实例
  const chart = echarts.init(document.getElementById('jsChart'))
  console.log(results)
  const cfData = []
  const lsData = []
  const lyData = []
  const xname = []
  for (let i = 0; i < results.length; i++) {
    cfData[i] = results[i].AGR_WSI_AD
    lsData[i] = results[i].IND_WSI_AD
    lyData[i] = results[i].ULSI_WSI_AD
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
      data: ['农业', '工业', '城镇生活和服务业']
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
        name: '节水资金投入（万元）',
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
        name: '农业',
        type: 'bar',
        barWidth: 25,
        data: cfData
      },
      {
        name: '工业',
        type: 'bar',
        barWidth: 25,
        data: lsData
      },
      {
        name: '城镇生活和服务业',
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
