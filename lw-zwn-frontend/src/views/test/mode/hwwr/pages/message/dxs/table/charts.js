/**
 * 公用 创建图形方法
 */
function filterData(results) {
  const all = {}
  // 副标题
  all.subtext = results.last + '底 至 ' + results.curr + '底'
  // x轴标记名称 平原和盆地
  all.xlabel1 = []
  // x轴标记值 平原和盆地
  all.xdata1 = []
  // x轴标记名称 行政区
  all.xlabel2 = []
  // x轴标记值 行政区
  all.xdata2 = []

  for (let i = 0; i < results.data.length; ++i) {
    const row = results.data[i]
    if (row.GWB_CD) {
      // 平原和盆地
      if (row.WRZ_TP == '1' || row.WRZ_TP == '2') {
        all.xlabel1.push(row.WRZ_NM)
        if (row.hasOwnProperty('PY_T_WSV')) {
          all.xdata1.push(parseInt(row.PY_T_WSV) / 10000.0)
        } else if (row.hasOwnProperty('PQ_T_WSV')) {
          all.xdata1.push(parseInt(row.PQ_T_WSV) / 10000.0)
        }
      }
      // 行政区
      else if (row.WRZ_TP == '3') {
        all.xlabel2.push(row.WRZ_NM)
        if (row.hasOwnProperty('PY_T_WSV')) {
          all.xdata2.push(parseInt(row.PY_T_WSV) / 10000.0)
        } else if (row.hasOwnProperty('PQ_T_WSV')) {
          all.xdata2.push(parseInt(row.PQ_T_WSV) / 10000.0)
        }
      }
    }
  }
  return all
}

// 海河流域平原和山间盆地地下水蓄变量示意图
function makechart1(chartId, res) {
  // 初始化echarts实例
  const chart1 = echarts.init(document.getElementById(chartId))

  // 副标题
  const subtext = res.subtext
  // x轴标记名称
  const xlabel = res.xlabel
  // x轴标记值
  const xdata = res.xdata

  const option1 = {
    color: ['#2b91c3'],
    title: {
      text: '海河流域平原和山间盆地地下水蓄变量示意图',
      left: 'center',
      subtext: '(' + subtext + ')',
      subtextStyle: {
        color: '#000000'
      }
    },
    grid: {
      left: '40',
      right: '4%',
      bottom: '150'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: [
      {
        type: 'category',
        data: xlabel,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          formatter: function (val) {
            return val.split('').join('\n')
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '地下水蓄变量(亿m³)\n',
        nameLocation: 'middle',
        offset: 0
      }
    ],
    series: [
      {
        type: 'bar',
        data: xdata
      }
    ]
  }

  chart1.setOption(option1)
}

// 海河流域平原和山间盆地地下水各行政区蓄变量示意图
function makechart2(chartId, res) {
  //初始化echarts实例
  const chart2 = echarts.init(document.getElementById(chartId))

  // 副标题
  const subtext = res.subtext
  // x轴标记名称
  const xlabel = res.xlabel
  // x轴标记值
  const xdata = res.xdata

  const option2 = {
    color: ['#2b91c3'],
    title: {
      text: '海河流域平原和山间盆地地下水各行政区蓄变量示意图 ',
      left: 'center',
      subtext: '(' + subtext + ')',
      subtextStyle: {
        color: '#000000'
      }
    },
    grid: {
      left: '40',
      right: '4%',
      bottom: '150'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: [
      {
        type: 'category',
        data: xlabel,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          formatter: function (val) {
            return val.split('').join('\n')
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '地下水蓄变量(亿m³)\n',
        nameLocation: 'middle',
        offset: 0
      }
    ],
    series: [
      {
        type: 'bar',
        barMaxWidth: 50,
        data: xdata
      }
    ]
  }

  chart2.setOption(option2)
}

/**
 * 季报
 * 平原和山间盆地地下水蓄变量统计表 (与上年同季度比较)
 */
// 海河流域平原和山间盆地地下水蓄变量示意图
function makeYearChart() {
  $.post(
    hwwr.basePath + 'message/dxs/qryear',
    {
      yearNo: hwwr.option.yearNo
    },
    function (data) {
      const results = JSON.parse(data)
      const res = filterData(results)

      //海河流域平原和山间盆地地下水蓄变量示意图
      makechart1('chartYear1', {
        subtext: res.subtext,
        xlabel: res.xlabel1,
        xdata: res.xdata1
      })

      // 海河流域平原和山间盆地地下水各行政区蓄变量示意图
      makechart2('chartYear2', {
        subtext: res.subtext,
        xlabel: res.xlabel2,
        xdata: res.xdata2
      })
    }
  )
}

/**
 * 季报
 * 平原和山间盆地地下水蓄变量统计表 (与上季度比较)
 */
//海河流域平原和山间盆地地下水蓄变量示意图
function makeQuarterChart() {
  $.post(
    hwwr.basePath + 'message/dxs/qrquarter',
    {
      yearNo: hwwr.option.yearNo
    },
    function (data) {
      const results = JSON.parse(data)
      const res = filterData(results)

      //海河流域平原和山间盆地地下水蓄变量示意图
      makechart1('chartQuarter1', {
        subtext: res.subtext,
        xlabel: res.xlabel1,
        xdata: res.xdata1
      })

      // 海河流域平原和山间盆地地下水各行政区蓄变量示意图
      makechart2('chartQuarter2', {
        subtext: res.subtext,
        xlabel: res.xlabel2,
        xdata: res.xdata2
      })
    }
  )
}
