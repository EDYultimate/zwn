$(document).ready(function () {
  initStyle()
  initDate()

  getAllZA(function () {
    //选第一个节点
    $($('#Sztbody td')[0]).click()
    partCharts()
  })

  $('#stcdtype').change(function () {
    if ($('#stcdtype').val() == 'autotype') {
      // 自动
      parent.parent.setIframe('auto', 'tbt')
    } else if ($('#stcdtype').val() == 'zatype') {
      // 人工
      parent.parent.setIframe('za', 'tbt')
    }
  })
})

function initDate() {
  const sbtm = moment().add(-1, 'years').format('YYYY')
  const setm = moment().format('YYYY')
  $('#byear').val(sbtm)
  $('#eyear').val(setm)
}

function initStyle() {
  $('#selcol').val(selcolnames)
  $('#bmonth').val('01')
  $('#emonth').val('03')
}

// 所选指标
let selcolids =
  'WT,PH,DOX,CODMN,CODCR,BOD5,NH3N,TP,TN,F,CN,S2,CU,ZN,SE,ARS,HG,CD,PB,CR6,VLPH,FCG,LAS'
var selcolnames =
  '水温,PH值,溶解氧,高锰酸盐,化学需氧量,五日生化需氧量,氨氮,总磷,总氮,氟化物,氰化物,硫化物,铜,锌,硒,砷,汞,镉,铅,铬,挥发酚,粪大肠菌群,阳离子表面活性剂'
let selstcd = ''
let selstcdname = ''
function setSelCol(id, name) {
  selcolids = id
  selcolnames = name
  $('#selcol').val(name)

  //  划分区域
  siInitPage = false
  curPage = 1
  partCharts()
}

//function partCharts() {
//	var selcolList = selcolids.split(',');
//	$('#charts').empty();
//	for (var i=0; i<selcolList.length; ++i) {
//		var divStr = "<div id='chart_"+selcolList[i]+"' style='width:33%;height:400px;margin: 0px;position: relative;float: left;'></div>";
//		$('#charts').append(divStr);
//	}
//}

function getAllZA(callback) {
  $.ajax({
    url: basePath + 'cxfx/getAllZA',
    data: '',
    success: function (data) {
      let rows = ''
      for (let i = 0; i < data.length; ++i) {
        const str =
          '<tr onclick="ckStcd(\'' +
          data[i].STCD +
          '\')"><td  id="row_' +
          data[i].STCD +
          '" >' +
          data[i].ST_NM +
          '</td></tr>'
        rows += str
      }
      $('#Sztbody').append(rows)
      $('#stcddiv').perfectScrollbar()

      callback()
    }
  })
}

function ckStcd(stcd) {
  $('.ckrow').removeClass('ckrow')
  $('#row_' + stcd).addClass('ckrow')
  selstcd = stcd
  selstcdname = $('.ckrow').text()
  selFirstStcd(selstcd, selstcdname)
  $('#t_date').text(selstcdname)
  partCharts()
}

function selcol() {
  layer.open({
    title: '选择水质指标',
    type: 2,
    area: ['680px', '250px'],
    content: basePath + 'pages/ssjkyj/cxfx/za/zacol.jsp'
  })
}

function initData(callback) {
  const json = {
    BTM: $('#byear').val() + '-' + $('#bmonth').val(),
    ETM: $('#eyear').val() + '-' + $('#emonth').val(),
    STCD: selstcd
  }
  const url = 'cxfx/getZAInfoByMonth'

  $.ajax({
    url: basePath + url,
    data: JSON.stringify(json),
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      const selcolList = selcolids.split(',')
      const selcolnameList = selcolnames.split(',')

      if (!siInitPage) {
        initPage(
          selcolList.length % pageSize == 0
            ? selcolList.length / pageSize
            : Math.floor(selcolList.length / pageSize) + 1
        )
      }

      for (let i = (curPage - 1) * pageSize; i < pageSize * curPage && i < selcolList.length; ++i) {
        makeChart(data, selcolList[i], selcolnameList[i])
      }

      if (callback) {
        callback()
      }
    }
  })
}

const myChart = []
function makeChart(data, selcol, name) {
  const bmonth = $('#bmonth').val()
  const bmonthText = $('#bmonth option[value="' + bmonth + '"]').text()
  const emonth = $('#emonth').val()
  const emonthText = $('#emonth option[value="' + emonth + '"]').text()

  const months = []
  for (var i = parseInt(bmonthText); i <= parseInt(emonthText); ++i) {
    months.push(i)
  }

  const years = []
  const byear = $('#byear').val()
  const eyear = $('#eyear').val()
  for (var i = parseInt(byear); i <= parseInt(eyear); ++i) {
    years.push(i)
  }

  const selcolLower = selcol.toLowerCase()

  //
  const dataMap = {}
  for (var i = 0; i < data.length; ++i) {
    const row = data[i]
    const time = row.tm
    var year = time.split('-')[0]
    var month = parseInt(time.split('-')[1])

    const yearVal = data[i][selcolLower]
    if (!dataMap[month]) {
      dataMap[month] = {}
    }
    dataMap[month][year] = yearVal
  }

  const monthStrs = []
  for (var i = 0; i < months.length; ++i) {
    monthStrs.push(months[i] + '月')
  }

  const series = []
  for (var i = 0; i < months.length; ++i) {
    var month = months[i]
    const serie = {
      name: month + '月',
      type: 'bar',
      barWidth: '10%',
      data: []
    }
    for (let j = 0; j < years.length; ++j) {
      var year = years[j]
      if (dataMap[month] && dataMap[month][year]) {
        serie.data.push(dataMap[month][year])
      } else {
        serie.data.push(null)
      }
    }
    series.push(serie)
  }

  option = {
    title: {
      text: name + ' 同比分析图',
      x: 'center',
      textStyle: {
        fontSize: 12
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      top: '5%',
      data: monthStrs
    },
    grid: {
      left: '13%', //距离左边的距离
      right: '13%', //距离右边的距离
      bottom: '35%', //距离下边的距离
      top: '18%', //距离上边的距离
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: years
    },
    yAxis: {
      type: 'value'
    },
    series: series
  }

  if (myChart[selcol] != null && myChart[selcol] != '' && myChart[selcol] != undefined) {
    myChart[selcol].dispose()
  }
  myChart[selcol] = echarts.init(document.getElementById('chart_' + selcol))
  myChart[selcol].setOption(option)
}

// 站点选择
function selstcdid() {
  layer.open({
    title: '选择水质指标',
    type: 2,
    area: ['1110px', '400px'],
    content: basePath + 'pages/ssjkyj/cxfx/za/zaStcd.jsp'
  })
}

function setSelStcdId(id, name) {
  selstcd = id
  selstcdname = name
  $('#selstcdid').val(name)
  $('#t_date').text(selstcdname)
  //  划分区域
  curPage = 1
  partCharts()
}

function selFirstStcd(id, name) {
  $('#selstcdid').val(name)
}

// 分页
var curPage = 1
var pageSize = 6
var siInitPage = false

function initPage(allpages) {
  siInitPage = true
  $('.M-box').pagination({
    pageCount: allpages, //初始化时总页数3页
    current: curPage,
    callback: function (api) {
      curPage = api.getCurrent()
      partCharts()
    }
  })
  $('.tolSpan').html('共' + selcolids.split(',').length + '条')
  $('.M-box').show()
}

function partCharts() {
  $('#charts').empty()
  const selcolList = selcolids.split(',')

  for (let i = (curPage - 1) * pageSize; i < pageSize * curPage && i < selcolList.length; ++i) {
    const divStr =
      "<div id='chart_" +
      selcolList[i] +
      "' style='width:33%;height:400px;margin: 0px;position: relative;float: left;'></div>"
    $('#charts').append(divStr)
  }

  initData()
}
