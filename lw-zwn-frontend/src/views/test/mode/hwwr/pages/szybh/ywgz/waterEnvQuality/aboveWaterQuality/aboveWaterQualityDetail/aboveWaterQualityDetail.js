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

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }

  param.M_DATE = $('#M_DATE').val()
  param.CATEGORY = $('#CATEGORY').val()
  param.ADDVCD = $('#ADDVCD').val()
  param.STNM = $('#STNM').val()

  param.pageSize = pageSize
  param.pageNo = CurrentPage
  param.TP = 2
  const index = layer.load()
  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterWaterEnvBelowDetailGis', function (result) {
    console.log('result:', result)
  })
  const totalDBNUM = 0
  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterWaterEnvDetail', param, function (result) {
    console.log('getSaveWaterWaterEnvBelowDetail:', result)

    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        const no = (CurrentPage - 1) * pageSize + (i + 1)
        tbodyStr +=
          '<tr>' +
          //                "<td title='"+no+"'>"+no+"</td>" +
          "<td title='" +
          isNull(data[i].STNM) +
          "'><a href='javascript:void(0)'  onclick='divClick(" +
          '"' +
          data[i].STNM +
          '"' +
          ',' +
          data[i].ID +
          ")'>" +
          isNull(data[i].STNM) +
          '</a></td>' +
          "<td title='" +
          isNull(data[i].ADDVCD) +
          "'  >" +
          isNull(data[i].ADDVCD) +
          '</td>' +
          "<td title='" +
          isNull(data[i].CATEGORY) +
          "'  >" +
          isNull(data[i].CATEGORY) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WQ_VAL) +
          "'  >" +
          isNull(data[i].WQ_VAL) +
          '</td>' +
          '</tr>'
      }
      for (let x = data.length; x < pageSize; x++) {
        tbodyStr += '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
      }
    } else {
      for (var i = 0; i < pageSize; i++) {
        tbodyStr += '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
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

function divClick(nm, ID) {
  top.layer.open({
    type: 2,
    title: nm + '测站详情', //+'降水量年趋势统计',
    closeBtn: 1,
    shade: 0.3,
    // maxmin: true,
    area: ['1300px', '650px'],
    content:
      basePath + 'pages/szybh/ywgz/waterEnvQuality/aboveWaterQuality/mapDialogTab.jsp?ID=' + ID
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
