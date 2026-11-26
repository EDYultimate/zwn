function chart(datas) {
  //初始化echarts实例
  const chart = echarts.init(document.getElementById('chart'))
  const option = {
    color: ['#4cabce'],
    title: {
      text: '蓄水变量合计(10⁸m³)',
      left: 'center'
    },
    tooltip: {},
    xAxis: {
      data: datas.name
    },
    yAxis: {},
    series: [
      {
        name: '合计',
        type: 'bar',
        barMaxWidth: 50,
        data: datas.data
      }
    ]
  }
  chart.setOption(option)
}

function filterdata(results) {
  const nms = ['合计', '滦冀平原']
  const datas = {}
  datas.name = []
  datas.data = []
  for (let i = 0; i < results.length; ++i) {
    if (nms.indexOf(results[i].PLAIN_NM) > -1) {
      datas.name.push(results[i].WRZ_NM)
      datas.data.push(results[i].SUM_WSV)
    }
  }
  return datas
}

function makecharts(results) {
  const data = filterdata(results)
  chart(data)
}
