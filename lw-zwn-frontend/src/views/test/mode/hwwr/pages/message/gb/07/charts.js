/**
 *============上年末蓄水量
 */
function snmChart(data) {
  //初始化echarts实例
  const chart = echarts.init(document.getElementById('snmChart'))
  const option = {
    color: ['#003366', '#006699', '#4cabce'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    title: {
      text: '上年末蓄水量 ',
      left: 'center'
    },
    legend: {
      top: 23,
      data: ['滦河及冀东沿海', '海河北系', '海河南系']
    },
    toolbox: {},
    calculable: true,
    xAxis: [
      {
        type: 'category',
        axisTick: {
          show: false
        },
        data: ['大型水库', '中型水库']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: data['上年末蓄水量']
  }
  chart.setOption(option)
}

/**
 *============当年末蓄水量
 */
function dnmChart(data) {
  //初始化echarts实例
  const chart = echarts.init(document.getElementById('dnmChart'))
  const option = {
    color: ['#003366', '#006699', '#4cabce'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    title: {
      text: '当年末蓄水量 ',
      left: 'center'
    },
    legend: {
      top: 23,
      data: ['滦河及冀东沿海', '海河北系', '海河南系']
    },
    toolbox: {},
    calculable: true,
    xAxis: [
      {
        type: 'category',
        axisTick: {
          show: false
        },
        data: ['大型水库', '中型水库']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: data['当年末蓄水量']
  }
  chart.setOption(option)
}

/**
 *============年蓄水变量
 */
function nmChart(data) {
  //初始化echarts实例
  const chart = echarts.init(document.getElementById('nmChart'))
  const option = {
    color: ['#003366', '#006699', '#4cabce'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    title: {
      text: '年蓄水变量',
      left: 'center'
    },
    legend: {
      top: 23,
      data: ['滦河及冀东沿海', '海河北系', '海河南系']
    },
    toolbox: {},
    calculable: true,
    xAxis: [
      {
        type: 'category',
        axisTick: {
          show: false
        },
        data: ['大型水库', '中型水库']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: data['年蓄水变量']
  }
  chart.setOption(option)
}

/**
 *============公用方法
 */
function filterdata(results) {
  const stcd = ['滦河及冀东沿海', '海河北系', '海河南系']

  // 大型水库
  const L_RES_YSW_list = []
  const L_RES_YEW_list = []
  const L_RES_CAL_list = []
  // 中型水库
  const M_RES_YSW_list = []
  const M_RES_YEW_list = []
  const M_RES_CAL_list = []

  for (let i = 0; i < results.length; ++i) {
    const row = results[i]
    if (row.STYPE == '大型水库') {
      L_RES_YSW_list.push(row.RES_YSW)
      L_RES_YEW_list.push(row.RES_YEW)
      L_RES_CAL_list.push(row.RES_CAL)
    } else if (row.STYPE == '中型水库') {
      M_RES_YSW_list.push(row.RES_YSW)
      M_RES_YEW_list.push(row.RES_YEW)
      M_RES_CAL_list.push(row.RES_CAL)
    }
  }

  //
  const res = {}
  res['上年末蓄水量'] = [
    {
      name: '滦河及冀东沿海',
      type: 'bar',
      barGap: 0,
      data: [L_RES_YSW_list[0], M_RES_YSW_list[0]]
    },
    {
      name: '海河北系',
      type: 'bar',
      data: [L_RES_YSW_list[1], M_RES_YSW_list[1]]
    },
    {
      name: '海河南系',
      type: 'bar',
      data: [L_RES_YSW_list[2], M_RES_YSW_list[2]]
    }
  ]

  res['当年末蓄水量'] = [
    {
      name: '滦河及冀东沿海',
      type: 'bar',
      barGap: 0,
      data: [L_RES_YEW_list[0], M_RES_YEW_list[0]]
    },
    {
      name: '海河北系',
      type: 'bar',
      data: [L_RES_YEW_list[1], M_RES_YEW_list[1]]
    },
    {
      name: '海河南系',
      type: 'bar',
      data: [L_RES_YEW_list[2], M_RES_YEW_list[2]]
    }
  ]

  res['年蓄水变量'] = [
    {
      name: '滦河及冀东沿海',
      type: 'bar',
      barGap: 0,
      data: [L_RES_CAL_list[0], M_RES_CAL_list[0]]
    },
    {
      name: '海河北系',
      type: 'bar',
      data: [L_RES_CAL_list[1], M_RES_CAL_list[1]]
    },
    {
      name: '海河南系',
      type: 'bar',
      data: [L_RES_CAL_list[2], M_RES_CAL_list[2]]
    }
  ]

  return res
}

function makecharts(results) {
  if (!results || results.length < 1) {
    return
  }
  const data = filterdata(results)
  snmChart(data)
  dnmChart(data)
  nmChart(data)
}
