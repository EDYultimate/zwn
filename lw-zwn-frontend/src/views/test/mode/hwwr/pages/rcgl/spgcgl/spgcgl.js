let myChart
$(document).ready(function () {
  maketable()
  myChart = echarts.init(document.getElementById('echart'))
})

function makeEmptyData() {
  const json = []
  const row = {
    APPR_DT: '',
    APPR_ORG_CD: '',
    APP_ORG_NM: '',
    CERT_COND: '',
    CERT_NM: '',
    CERT_PRT_CD: '',
    CHK_INT_MET: '',
    CHK_SOUR_TP: '',
    DRAW_DT: '',
    DRAW_STAFF: '',
    INT_ADDR: '',
    INT_BD: '',
    INT_DL: '',
    INT_USE: '',
    LR_NM: '',
    MAN_ORG_CD: '',
    MAN_ORG_NM: '',
    RW_ADDR: '',
    RW_TP: '',
    RW_W: '',
    RW_WQ_REQ: '',
    TYEAR: '',
    WIU_CD: '',
    WIU_NM: '',
    WPC_CD: '',
    WPC_SN: '',
    WRP_NM: '',
    WW: ''
  }
  for (let i = 0; i < 8; ++i) {
    json.push(row)
  }
  return json
}

function finished() {
  $('.conent').height($(window).height() - 80)

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
  }
}

function maketable() {
  const json = {
    cert_cond: $('#cert_cond').val(),
    int_use: $('#int_use').val(),
    int_bd: $('#int_bd').val(),
    int_dl: $('#int_dl').val(),
    wrp_nm: $('#wrp_nm').val(),
    int_year: $('#int_year').val()
  }

  $.ajax({
    type: 'POST',
    url: basePath + 'rcgl/spgcgl/getSpgcgl',
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
          if (row.CERT_NM) {
            if (cert_num.hasOwnProperty(row.CERT_NM)) {
              cert_num[row.CERT_NM] += 1
            } else {
              cert_num[row.CERT_NM] = 1
            }
          }
        }
      }
      results.push({
        WPC_SN: '合计',
        WRP_NM: '共' + (isEmpty ? 0 : results.length) + '条',
        WW: (new Number(sum_ww).toFixed(2) * 100) / 100 // 保留两位小数
      })
      ctable.genTable(results)

      myChart.clear()
      // 当许可证状态为全部的时候显示饼图
      if (!$('#cert_cond').val()) {
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
  myChart.setOption(option)
}

function editRow(id) {
  // 750 640
  layer.open({
    type: 2,
    title: '修改',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '640px'],
    content: basePath + 'pages/rcgl/spgcgl/dialog/add.jsp?wpc_cd=' + id
  })
}

function add() {
  layer.open({
    type: 2,
    title: '新建',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '640px'],
    content: basePath + 'pages/rcgl/spgcgl/dialog/add.jsp'
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
    content: basePath + 'pages/rcgl/spgcgl/dialog/dlfiles.jsp?wpc_cd=' + wpc_cd
  })
}
