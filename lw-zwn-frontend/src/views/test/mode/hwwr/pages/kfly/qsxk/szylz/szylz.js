let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2

  const date = new Date()
  const year = date.getFullYear()
  $('#btm').val(year)
  //	$("#etm").val(year);
  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''
  $('#tmSpan').text('')
  $('#tmSpan').text($('#btm').val())
  const qshnm = $('#nm').val()
  const bdat = $('#btm').val()
  //	var edat = $("#etm").val()+"-"+mothDayNum($("#etm").val());
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.nm = qshnm
  param.bdat = bdat
  //	param.edat=edat;
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + '/kfly/qsxk/getSzylzInfo', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        //				tbodyStr += "<tr onclick=\"initLayer('"+data[i].WRA_CD+"','"+data[i].PROJ_NM+"')\">" +
        tbodyStr +=
          '<tr>' +
          "<td title='" +
          isNull(data[i].PROJ_NM) +
          "'>" +
          isNull(data[i].PROJ_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WRP_NM) +
          "'>" +
          isNull(data[i].WRP_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].CHK_SOUR_TP) +
          "'>" +
          isNull(data[i].CHK_SOUR_TP) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WW) +
          "'>" +
          isNull(data[i].WW) +
          '</td>' +
          "<td title='" +
          isNull(data[i].MAN_STATE) +
          "'>" +
          isNull(data[i].MAN_STATE) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WRA_RES) +
          "'>" +
          isNull(data[i].WRA_RES) +
          '</td>' +
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
          '</tr>'
      }
    }
    $('#tbody').empty().append(tbodyStr)
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

function initLayer(wrcs_cd, nm) {
  layer.open({
    type: 2,
    title: nm,
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['850px', '500px'],
    content: basePath + '/pages/kfly/qsxk/szylz/szylzDialog.jsp?wrcs_cd=' + wrcs_cd
  })
}
