function chart(results) {
  //初始化echarts实例
  const chart = echarts.init(document.getElementById('xyChart'))
  console.log(results)
  const cfData = []
  const lsData = []
  const lyData = []
  const jhData = [] //计划总数
  const xname = []
  for (let i = 0; i < results.length; i++) {
    cfData[i] = results[i].YPC
    lsData[i] = results[i].YRC
    lyData[i] = results[i].TOL_NUM
    jhData[i] = results[i].TFYP
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
      data: ['年度计划完成数', '年度实际完成数', '总计划完成数', '累计完成数']
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
        name: '县域达标（个）',
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
        name: '年度计划完成数',
        type: 'bar',
        barWidth: 15,
        data: cfData
      },
      {
        name: '年度实际完成数',
        type: 'bar',
        barWidth: 15,
        data: lsData
      },
      {
        name: '总计划完成数',
        type: 'bar',
        barWidth: 15,
        data: jhData
      },
      {
        name: '累计完成数',
        type: 'bar',
        barWidth: 15,
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
