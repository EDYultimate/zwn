/**
 *============蓄水量
 */
function snmChart(data) {
  //初始化echarts实例
  const chart = echarts.init(document.getElementById('snmChart'))
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      top: 0,
      width: 530,
      data: [
        '滦河及冀东沿海上年末蓄水量',
        '海河北系上年末蓄水量',
        '海河南系上年末蓄水量',
        '滦河及冀东沿海当年末蓄水量',
        '海河北系当年末蓄水量',
        '海河南系当年末蓄水量',
        '滦河及冀东沿海年蓄水变量',
        '海河北系年蓄水变量',
        '海河南系年蓄水变量'
      ]
    },
    toolbox: {},
    grid: {
      top: 100,
      height: 430
    },
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
    series: data
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
  const res = [
    {
      name: '滦河及冀东沿海上年末蓄水量',
      type: 'bar',
      barGap: 0,
      data: [L_RES_YSW_list[0], M_RES_YSW_list[0]]
    },
    {
      name: '海河北系上年末蓄水量',
      type: 'bar',
      data: [L_RES_YSW_list[1], M_RES_YSW_list[1]]
    },
    {
      name: '海河南系上年末蓄水量',
      type: 'bar',
      data: [L_RES_YSW_list[2], M_RES_YSW_list[2]]
    },
    {
      name: '滦河及冀东沿海当年末蓄水量',
      type: 'bar',
      barGap: 0,
      data: [L_RES_YEW_list[0], M_RES_YEW_list[0]]
    },
    {
      name: '海河北系当年末蓄水量',
      type: 'bar',
      data: [L_RES_YEW_list[1], M_RES_YEW_list[1]]
    },
    {
      name: '海河南系当年末蓄水量',
      type: 'bar',
      data: [L_RES_YEW_list[2], M_RES_YEW_list[2]]
    },
    {
      name: '滦河及冀东沿海年蓄水变量',
      type: 'bar',
      barGap: 0,
      data: [L_RES_CAL_list[0], M_RES_CAL_list[0]]
    },
    {
      name: '海河北系年蓄水变量',
      type: 'bar',
      data: [L_RES_CAL_list[1], M_RES_CAL_list[1]]
    },
    {
      name: '海河南系年蓄水变量',
      type: 'bar',
      data: [L_RES_CAL_list[2], M_RES_CAL_list[2]]
    }
  ]

  return res
}

function makecharts(results) {
  debugger
  if (!results || results.length < 1) {
    return
  }
  const data = filterdata(results)
  snmChart(data)
}
