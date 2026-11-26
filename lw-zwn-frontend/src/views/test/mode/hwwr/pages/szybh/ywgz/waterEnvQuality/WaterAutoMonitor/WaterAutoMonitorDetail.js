let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight * 0.75 + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2
  //  $(".bbTable").css("height","500px");

  pageSize = 10

  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''

  const fw = $('#fw').val()

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }

  //    param.beginTm=$("#beginTm").val();
  //    param.endTm=$("#endTm").val();
  param.addvcd = $('#addvcd').val()
  param.addvnm = $('#duanMianMingCheng').val()

  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()

  jQuery.getJSON(basePath + 'szybh/ywgz/getWaterEnvQualityAutoWaterInfo', param, function (result) {
    console.log('getWaterEnvQualityAutoWaterInfo:', result)

    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        const no = (CurrentPage - 1) * pageSize + (i + 1)
        tbodyStr +=
          '<tr>' +
          //                "<td title='"+no+"'>"+no+"</td>" +
          "<td title='" +
          isNull(data[i].ADDVNM) +
          "'>" +
          isNull(data[i].ADDVNM) +
          '</td>' +
          //                "<td title='海河流域'>海河流域</td>" +
          //                "<td title='"+isNull(data[i].STNM)+"'>"+isNull(data[i].STNM)+"</td>" +
          "<td title='" +
          isNull(data[i].STNM) +
          "'><a href='javascript:void(0)'  onclick='do_support(" +
          '"' +
          data[i].STNM +
          '"' +
          ',' +
          data[i].ADDVCD +
          ")'>" +
          isNull(data[i].STNM) +
          '</a></td>' +
          "<td title='" +
          isNull(data[i].MONITOR_TIME) +
          "'>" +
          isNull(data[i].MONITOR_TIME) +
          '</td>' +
          "<td title='" +
          isNull(data[i].W_TP) +
          "'>" +
          isNull(data[i].W_TP) +
          '</td>' +
          "<td title='" +
          isNull(data[i].SW) +
          "'>" +
          isNull(data[i].SW) +
          '</td>' +
          "<td title='" +
          isNull(data[i].PH) +
          "'>" +
          isNull(data[i].PH) +
          '</td>' +
          "<td title='" +
          isNull(data[i].RJY) +
          "'  >" +
          isNull(data[i].RJY) +
          '</td>' +
          "<td title='" +
          isNull(data[i].DDL_VAL) +
          "'  >" +
          isNull(data[i].DDL_VAL) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ZHUDU) +
          "'  >" +
          isNull(data[i].ZHUDU) +
          '</td>' +
          "<td title='" +
          isNull(data[i].GMSYZS) +
          "'  >" +
          isNull(data[i].GMSYZS) +
          '</td>' +
          "<td title='" +
          isNull(data[i].AD) +
          "'  >" +
          isNull(data[i].AD) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ZL) +
          "'  >" +
          isNull(data[i].ZL) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ZD) +
          "'  >" +
          isNull(data[i].ZD) +
          '</td>' +
          "<td title='" +
          isNull(data[i].YLS) +
          "'  >" +
          isNull(data[i].YLS) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ZMD) +
          "'  >" +
          isNull(data[i].ZMD) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ZDQK) +
          "'  >" +
          isNull(data[i].ZDQK) +
          '</td>' +
          //                "<td title='"+isNull(data[i].ZHUDU)+"'  >"+isNull(data[i].ZHUDU)+"</td>" +

          '</tr>'
      }
      for (let x = data.length; x < pageSize; x++) {
        tbodyStr +=
          '<tr>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '</tr>'
      }
    } else {
      for (var i = 0; i < pageSize; i++) {
        tbodyStr +=
          '<tr>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '</tr>'
      }
    }

    $('#TableData').empty().append(tbodyStr)
    $('.M-box').pagination({
      pageCount: result.page.pages, //初始化时总页数3页
      current: CurrentPage,
      callback: function (api) {
        search(api.getCurrent())
      }
    })
    $('.tolSpan').html('共' + result.page.total + '条')
    $('.M-box').show()
    layer.close(index)
  })
}

function do_support(stnm, addvcd) {
  console.log('do_support:   ', stnm, addvcd)
  layer.open({
    type: 2,
    title: stnm + '信息统计',
    closeBtn: 1,
    shade: 0.3,
    offset: '60px',
    area: ['1100px', '500px'],
    content:
      basePath +
      'pages/szybh/ywgz/waterEnvQuality/WaterAutoMonitor/tjxxDialog.jsp?stnm=' +
      stnm +
      '&addvcd=' +
      addvcd
  })
}

//打印方法
function printpage() {
  printData('dydiv', 'dytable')
}

$('#waterReport_btn_generate_excel').click(function () {
  if (document.getElementById('TableData').rows.length <= 0) {
    alert('无下载数据')
  } else {
    excel = new ExcelGen({
      src_id: 'dytable',
      show_header: true
    })
    excel.generate()
  }
})
