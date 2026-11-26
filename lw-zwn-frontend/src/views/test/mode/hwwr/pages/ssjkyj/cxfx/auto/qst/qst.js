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
      parent.parent.setIframe('auto', 'qst')
    } else if ($('#stcdtype').val() == 'zatype') {
      // 人工
      parent.parent.setIframe('za', 'qst')
    }
  })
})

function initStyle() {
  $('#selcol').val(selcolnames)

  $('#nm').change(function () {
    if ($('#nm').val() == '1') {
      $('#timediv').empty()
      $('#timediv').append(
        '时间：<input type="text" id="btm" name="datemonth" onClick="WdatePicker({ dateFmt: \'yyyy-MM-dd\'})">' +
          '  --  ' +
          '<input type="text" id="etm" name="datemonth" onClick="WdatePicker({ dateFmt: \'yyyy-MM-dd\'})">' +
          '&nbsp;&nbsp;&nbsp;&nbsp;'
      )
    } else if ($('#nm').val() == '2') {
      $('#timediv').empty()
      $('#timediv').append(
        '时间：<input type="text" id="btm" name="datemonth" onClick="WdatePicker({ dateFmt: \'yyyy-MM\'})">' +
          '  --  ' +
          '<input type="text" id="etm" name="datemonth" onClick="WdatePicker({ dateFmt: \'yyyy-MM\'})">' +
          '&nbsp;&nbsp;&nbsp;&nbsp;'
      )
    }
    initDate()
  })
}

function initDate() {
  if ($('#nm').val() == '1') {
    var sbtm = moment().add(-12, 'months').format('YYYY-MM-DD')
    var setm = moment().format('YYYY-MM-DD')
    $('#btm').val(sbtm)
    $('#etm').val(setm)
  } else if ($('#nm').val() == '2') {
    var sbtm = moment().add(-12, 'months').format('YYYY-MM')
    var setm = moment().format('YYYY-MM')
    $('#btm').val(sbtm)
    $('#etm').val(setm)
  }
}

// 所选指标
let selcolids =
  'WT,PH,COND,TURB,DOX,CODMN,CODCR,TN,NH3N,NO2,NO3,TP,TOC,VLPH,CHLA,F,ARS,HG,CR6,CU,PB,CD,ZN,SB'
var selcolnames =
  '水温,PH值,电导率,浊度,溶解氧,高锰酸盐,化学需氧量,总氮,氨氮,亚硝酸盐,硝酸盐,总磷,总有机碳,挥发酚,叶绿素a,氟化物,砷,汞,铬,铜,铅,镉,锌,锑'
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
    url: basePath + 'cxfx/getAllAUTO',
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
    content: basePath + 'pages/ssjkyj/cxfx/auto/autocol.jsp'
  })
}

function initData(callback) {
  const json = {
    BTM: $('#btm').val(),
    ETM: $('#etm').val(),
    STCD: selstcd
  }
  let url = 'cxfx/getAUTOInfo'
  if ($('#nm').val() == '2') {
    url = 'cxfx/getAUTOInfoByMonth'
  }

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
  const xdata = []
  const ydata = []

  const selcolLower = selcol.toLowerCase()
  for (let i = 0; i < data.length; ++i) {
    xdata.push(data[i].tm)
    ydata.push(data[i][selcolLower])
  }

  option = {
    title: {
      text: name + ' 指标趋势统计图',
      x: 'center',
      textStyle: {
        fontSize: 12
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '13%', //距离左边的距离
      right: '13%', //距离右边的距离
      bottom: '35%', //距离下边的距离
      top: '15%' //距离上边的距离
    },
    xAxis: {
      type: 'category',
      data: xdata
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: ydata,
        type: 'line',
        smooth: false
      }
    ]
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
    area: ['870px', '200px'],
    content: basePath + 'pages/ssjkyj/cxfx/auto/autoStcd.jsp'
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
