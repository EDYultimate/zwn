let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2

  //	$("#btm").val(new Date().Format("yyyy-MM"));
  //	$("#etm").val(new Date().Format("yyyy-MM"));
  //	search(1);

  jQuery.getJSON(basePath + '/szybh/sgnq/getSgnqInfoTm', param, function (result) {
    const tm = result[0].TM
    $('#btm').val(tm)
    $('#etm').val(tm)
    search(1)
  })
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''
  $('#tmSpan').text('')
  $('#tmSpan').text($('#btm').val() + '至' + $('#etm').val())
  const xzqcd = $('#xzqselect').val()
  const qshnm = $('#nm').val()

  /*var bdat = $("#btm").val()+"-01";
	var edat = $("#etm").val()+"-"+mothDayNum($("#etm").val());*/
  const bdat = $('#btm').val()
  const edat = $('#etm').val()
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.xzqcd = xzqcd
  param.nm = qshnm
  param.bdat = bdat
  param.edat = edat
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + '/szybh/sgnq/getSgnqInfo', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      console.info(data)
      for (var i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr onclick="initLayer(\'' +
          data[i].WFZ_CD +
          "','" +
          data[i].WFZ_NM +
          '\')">' +
          "<td title='" +
          isNull(data[i].WFZ_NM) +
          "'>" +
          isNull(data[i].WFZ_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].AD_NM) +
          "'>" +
          isNull(data[i].AD_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WFZ_FUN_SEQ) +
          "'>" +
          isNull(data[i].WFZ_FUN_SEQ) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WFZ_STAR) +
          "'>" +
          isNull(data[i].WFZ_STAR) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WFZ_END) +
          "'>" +
          isNull(data[i].WFZ_END) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WFZ_A) +
          "'>" +
          isNull(data[i].WFZ_A) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WFZ_LEN) +
          "'>" +
          isNull(data[i].WFZ_LEN) +
          '</td>' +
          "<td title='" +
          dateTimeFormate(data[i].ASOT) +
          "'>" +
          dateTimeFormate(data[i].ASOT) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WQG) +
          "'>" +
          isNull(data[i].WQG) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WFZ_WQT) +
          "'>" +
          isNull(data[i].WFZ_WQT) +
          '</td>' +
          "<td title='" +
          isNull(data[i].MESPEST) +
          "'>" +
          isNull(data[i].MESPEST) +
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
    content: basePath + '/pages/szybh/sgnq/sgnqTable/sgnqDialog.jsp?wrcs_cd=' + wrcs_cd
  })
}
