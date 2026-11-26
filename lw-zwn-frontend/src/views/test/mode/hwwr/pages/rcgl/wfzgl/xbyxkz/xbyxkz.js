let myChart
$(document).ready(function () {
  scrollEvent()

  maketable()
})

function makeEmptyData() {
  const json = []
  // var row = {
  // 		APPR_DT: "",APPR_ORG_CD: "",APP_ORG_NM: "",CERT_COND: "",CERT_NM: "",CERT_PRT_CD: "",CHK_INT_MET: "",CHK_SOUR_TP: "",
  // 		DRAW_DT: "",DRAW_STAFF: "",INT_ADDR: "",INT_BD: "",INT_DL: "",INT_USE: "",LR_NM: "",MAN_ORG_CD: "",MAN_ORG_NM: "",
  // 		RW_ADDR: "",RW_TP: "",RW_W: "",RW_WQ_REQ: "",TYEAR: "",WIU_CD: "",WIU_NM: "",WPC_CD: "",WPC_SN: "",WRP_NM: "",WW: ""
  // }
  // for (var i=0; i<8; ++i) {
  // 	json.push(row);
  // }
  return json
}

function finished() {
  $('.conent').height($(window).innerHeight() - $('.searchDiv').innerHeight() - 12)

  // 操作
  const rowlength = $('tr').length
  const collength = $($('tr')[0]).children().length - 1

  for (let row = 1; row < rowlength; ++row) {
    const cell = $($('tr')[row]).children()[collength - 1]
    const wpc_cd = $($($('tr')[row]).children()[0]).text()
    if (!wpc_cd) {
      continue
    }
    //var str = "<div class='editdiv' onclick='editRow(\""+wpc_cd+"\")'></div><div class='deldiv' onclick='delRow(\""+wpc_cd+"\")'></div>";
    const str =
      "<div class='editdiv'  style='margin-left: calc(50% - 16px);' onclick='editRow(\"" +
      wpc_cd +
      '")\'></div>'
    $(cell).append(str)

    // 附件下载
    const celldl = $($('tr')[row]).children()[collength]
    const strdl = "<div style='cursor:pointer' onclick='dlfiles(\"" + wpc_cd + '")\'>附件</div>'
    $(celldl).append(strdl)

    // // 取水权人
    // var celldr = $($('tr')[row]).children()[5];
    // var wrp_nm = '<a href="javascript:ckWRP_NM(\''+wpc_cd+'\')">'+$(celldr).text()+'</a>';
    // $(celldr).empty().append(wrp_nm);

    // 颜色
    const EXPIRED = ctable.data[row - 1].EXPIRED
    if (EXPIRED > 0) {
      $($($('tr')[row]).children()[3]).css('color', '#f38b8b')
    } else if (EXPIRED < 0) {
      $($($('tr')[row]).children()[3]).css('color', '#ffa500')
    }
  }

  addPositionRel(2)
  addPositionRel(4)
  addPositionRel(5)
  addPositionRel(6)
  $($('#table th')[1]).css('z-index', 2)
  $($('#table th')[3]).css('z-index', 2)
  $($('#table th')[4]).css('z-index', 2)
  $($('#table th')[5]).css('z-index', 2)
}

function maketable() {
  let types = ['3', '4']
  if ($('#cert_cond').val() === '3') {
    types = ['3']
  } else if ($('#cert_cond').val() === '4') {
    types = ['4']
  }

  const json = {
    wrp_nm: $('#wrp_nm').val(),
    wpc_sn: $('#wpc_sn').val(),
    conc_org: $('#conc_org').val(),
    ad_nm: $('#ad_nm').val(),
    wrz_nm: $('#wrz_nm').val(),
    cert_conds: types
  }

  $.ajax({
    type: 'POST',
    url: basePath + 'rcgl/spgcgl/getSpgcglM',
    contentType: 'application/json',
    async: true,
    data: JSON.stringify(json),
    success: function (data) {
      let results = data
      let isEmpty = false
      if (!results || results.length < 1) {
        results = makeEmptyData()
        isEmpty = true
      }
      option = {
        colTitle: true
      }
      ctable = cgrid.instance('table', option)
      ctable.finished = finished

      // 统计新发证和延续证的个数
      const cert_num = {}
      // 计算合计
      let sum_ww = 0
      if (results && results.length > 0) {
        for (const idx in results) {
          const row = results[idx]
          row.no = 1 + parseInt(idx)
          if (row.WW) {
            sum_ww += row.WW
          }

          row.WPC_CD = row.WPC_CD.replace(/\s+/g, '')

          //
          if (row.CERT_COND === '3') {
            row.CERT_COND_NM = '注销'
          } else if (row.CERT_COND === '4') {
            row.CERT_COND_NM = '吊销'
          }

          if (row.EXPIRED_NM) {
            if (cert_num.hasOwnProperty(row.EXPIRED_NM)) {
              cert_num[row.EXPIRED_NM] += 1
            } else {
              cert_num[row.EXPIRED_NM] = 1
            }
          }
        }
      }
      results.push({
        no: '合计',
        EXPIRED_NM: '共' + (isEmpty ? 0 : results.length) + '条',
        WW: (new Number(sum_ww).toFixed(2) * 100) / 100 // 保留两位小数
      })
      ctable.genTable(results)

      $('.conent').scrollLeft(0)

      // 当许可证状态为全部的时候显示饼图
      if (!$('#expired').val()) {
        makechart(cert_num)
      }
    }
  })
}

function makechart(data) {
  const xdata = []
  const ydata = []
  for (const k in data) {
    xdata.push('' + k)
    const row = { value: data[k], name: '' + k }
    ydata.push(row)
  }
  const option = {
    title: {
      text: '证件状态统计',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: xdata
    },
    series: [
      {
        name: '证件状态',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: ydata,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  const myChart = echarts.init(document.getElementById('echart'))
  myChart.setOption(option, true)
}

function editRow(id) {
  // 750 640
  layer.open({
    type: 2,
    title: '修改',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['1068px', '560px'],
    content: basePath + 'pages/rcgl/wfzgl/xbyxkz/dialog/add.jsp?wpc_cd=' + id
  })
}

function add() {
  layer.open({
    type: 2,
    title: '新建',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['1068px', '660px'],
    content: basePath + 'pages/rcgl/wfzgl/xbyxkz/dialog/add.jsp'
  })
}

function delRow(id) {
  debugger
}

function dlfiles(wpc_cd) {
  layer.open({
    type: 2,
    title: '附件下载',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['550px', '400px'],
    content: basePath + 'pages/rcgl/wfzgl/xbyxkz/dialog/dlfiles.jsp?wpc_cd=' + wpc_cd
  })
}

function addPositionRel(num) {
  $('#table tr th:nth-child(' + num + ')').css('position', 'relative')
  $('#table tr td:nth-child(' + num + ')').css('position', 'relative')
  $('#table tr td:nth-child(' + num + ')').addClass('fixtitle')
  $('#table tr td:nth-child(' + num + ')').css('z-index', 1)
  $('#table tr td:nth-child(' + num + ')').css('overflow-y', 'hidden')
  $('#table th').css('position', 'relative')
}

function setFixedCol(num, x) {
  $('#table tr th:nth-child(' + num + ')').css('left', x + 'px')
  $('#table tr th:nth-child(' + num + ')').addClass('fixtitle')
  $('#table tr td:nth-child(' + num + ')').css('left', x + 'px')
}

function setFixedTitle(y) {
  $('#table th').css('top', y + 'px')
}

////////
//监听页面滚动事件
function scrollEvent() {
  $('.conent').scroll(function (e) {
    // clearTimeout(timer);
    // var timer = setTimeout(function () {
    scrollFunc()
    if (scrollDirection === 'down' || scrollDirection === 'up') {
      setFixedTitle(scrollAction.y)
    } else if (scrollDirection === 'left' || scrollDirection === 'right') {
      setFixedCol(2, scrollAction.x)
      setFixedCol(4, scrollAction.x)
      setFixedCol(5, scrollAction.x)
      setFixedCol(6, scrollAction.x)
    }
    // }, 5)
  })
}

var scrollAction = { x: undefined, y: undefined },
  scrollDirection
function scrollFunc() {
  // if (typeof scrollAction.x === undefined) {
  // 	scrollAction.x = $('.conent').scrollLeft();
  // 	scrollAction.y = $('.conent').scrollTop();
  // }
  const diffX = scrollAction.x - $('.conent').scrollLeft()
  const diffY = scrollAction.y - $('.conent').scrollTop()
  if (diffX < 0) {
    // Scroll right
    scrollDirection = 'right'
  } else if (diffX > 0) {
    // Scroll left
    scrollDirection = 'left'
  } else if (diffY < 0) {
    // Scroll down
    scrollDirection = 'down'
  } else if (diffY > 0) {
    // Scroll up
    scrollDirection = 'up'
  } else {
    // First scroll event
  }
  scrollAction.x = $('.conent').scrollLeft()
  scrollAction.y = $('.conent').scrollTop()
}

// 取水权人点击
function ckWRP_NM(WPC_CD) {
  layer.open({
    type: 2,
    title: '填报',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['1300px', '600px'],
    content: basePath + 'pages/rcgl/wfzgl/xbyxkz/dialog/check.jsp?wpc_cd=' + WPC_CD
  })
}
