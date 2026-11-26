$(document).ready(function () {
  $('#qs_xzq').change(function (data) {
    type = data.target.value
    initType()
  })

  initType()
  getYear(function () {
    search()
  })
})

var type = 'l1'
let typeids = []
let typenames = []
function setTypenames() {
  $('#typename').val(typenames.toString())
}

function initType() {
  typeids = tableTypes[type].ids.split(',')
  typenames = tableTypes[type].names.split(',')
  setTypenames()
}

function finished() {}

function getYear(callback) {
  $.get(basePath + 'sgb/getIndex_Jsl_Year', {}, function (data) {
    if (data && data.length > 0) {
      $('#btm').val(data[data.length - 1].YEAR)
      $('#etm').val(data[0].YEAR)
    }

    if (callback) {
      callback()
    }
  })
}

function search() {
  genThead()

  $('#table tbody').empty()
  $.get(
    basePath + 'sgb/getIndex_Jsl',
    {
      btm: $('#btm').val(),
      etm: $('#etm').val()
    },
    function (data) {
      let results = data
      if (!results || results.length < 1 || !results[0].list || results[0].list.length < 1) {
        results = makeEmptyData()
      }
      option = {}
      ctable = cgrid.instance('table', option)
      ctable.finished = finished
      ctable.genTable(results[0].list.reverse())

      makechart(results)
    }
  )
}

// 生成表头
function genThead() {
  let str = '<th data-field="YEAR">年份</th>'
  for (let i = 0; i < typeids.length; ++i) {
    str += '<th data-field="' + typeids[i] + '">' + typenames[i] + '</th>'
  }
  $('#theads').empty().append(str)
}

function openDlg() {
  let area = []

  // l1 行政区
  if (type === 'l1') {
    area = ['292px', '150px']
  }
  // l2 水资源二级区
  else if (type === 'l2') {
    area = ['260px', '150px']
  }
  // l3 水资源三级区
  else if (type === 'l3') {
    area = ['920px', '640px']
  }

  layer.open({
    type: 2,
    title: '分区',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: area,
    content: basePath + 'pages/rcgl/szygb/common/dl.jsp?type=' + type
  })
}

function getSeries(data) {
  const seriesArr = []
  const names = tableTypes[type].names.split(',')
  const ids = tableTypes[type].ids.split(',')

  for (var i = 0; i < names.length; ++i) {
    seriesArr.push({
      sid: ids[i],
      name: names[i],
      type: 'line',
      data: data[0].vals[ids[i]].reverse()
    })
  }

  const series = []
  for (var i = 0; i < typeids.length; ++i) {
    for (let j = 0; j < seriesArr.length; ++j) {
      if (typeids[i] === seriesArr[j].sid) {
        series.push(seriesArr[j])
      }
    }
  }

  return series
}

function makechart(data) {
  let option = {}
  const series = getSeries(data)
  // l1 行政区
  if (type === 'l1') {
    option = {
      //color:['#b6a2de','#5ab1ef','#2ec7c9','#ea947e','#ff6666','#6ac36b','#f0ab4e','#b6a2de'],
      title: {
        text: '行政区降水量趋势统计图',
        top: 4,
        x: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: typenames,
        top: 30,
        x: 'center',
        textStyle: {
          fontSize: 11
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data[0].year.reverse()
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}亿m³'
        }
      },
      series: series
    }
  }
  // l2 水资源二级区
  else if (type === 'l2') {
    option = {
      //color:['#b6a2de','#5ab1ef','#2ec7c9','#ea947e','#ff6666','#6ac36b','#f0ab4e','#b6a2de'],
      title: {
        text: '水资源分区降水量趋势统计图',
        top: 4,
        x: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: typenames,
        top: 30,
        x: 'center',
        itemWidth: 15,
        textStyle: {
          fontSize: 11
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data[0].year.reverse()
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}亿m³'
        }
      },
      series: series
    }
  }
  // l3 水资源三级区
  else if (type === 'l3') {
    option = {
      //color:['#b6a2de','#5ab1ef','#2ec7c9','#ea947e','#ff6666','#6ac36b','#f0ab4e','#b6a2de'],
      title: {
        text: '水资源Ⅲ级区降水量趋势统计图',
        top: 4,
        x: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: typenames,
        type: 'scroll',
        top: '30px',
        x: 'center',
        itemWidth: 15,
        itemHeight: 8,
        textStyle: {
          fontSize: 11
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data[0].year.reverse()
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}亿m³'
        }
      },
      series: series
    }
  }

  const myChart = echarts.init(document.getElementById('charts'))
  setTimeout(function () {
    myChart.setOption(option, true)
  })
}
