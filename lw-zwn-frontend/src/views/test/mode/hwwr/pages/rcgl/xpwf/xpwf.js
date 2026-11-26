$(document).ready(function () {
  maketable()
})

function makeEmptyData() {
  const json = []
  const row = {
    WPC_CD: '',
    WPC_NM: '',
    NYEAR: '',
    WW: '',
    CERT_NM: '',
    CONTACT: '',
    CERT: '',
    ISCERT: ''
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
    nyear: $('#nyear').val(),
    wpc_nm: $('#wpc_nm').val()
  }

  $.get(
    basePath + 'rcgl/nocert/queryNoCert',
    {
      year: json.nyear,
      wpc_nm: json.wpc_nm
    },
    function (data) {
      let results = data
      if (!results || results.length < 1) {
        results = makeEmptyData()
      }
      option = {
        colTitle: true
      }
      ctable = cgrid.instance('table', option)
      ctable.finished = finished

      if (results && results.length > 0) {
        for (i in results) {
          const row = results[i]
          row.no = 1 + parseInt(i)
          if (row.cert === '0') {
            row.iscert = '未发'
          } else if (row.cert === '1') {
            row.iscert = '已发'
          }
        }
      }

      ctable.genTable(results)
    }
  )
}

function editRow(id) {
  // 750 640
  layer.open({
    type: 2,
    title: '修改',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '350px'],
    content: basePath + 'pages/rcgl/xpwf/dialog/add.jsp?wpc_cd=' + id
  })
}

function add() {
  layer.open({
    type: 2,
    title: '新建',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '350px'],
    content: basePath + 'pages/rcgl/xpwf/dialog/add.jsp'
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
    content: basePath + 'pages/rcgl/xpwf/dialog/dlfiles.jsp?wpc_cd=' + wpc_cd
  })
}
