let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 1

  /*$("#btm").val(new Date().Format("yyyy-MM-dd"));*/
  $('#btm').val('2019-01-01')
  $('#etm').val(new Date().Format('yyyy-MM-dd'))
  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''
  $('#titleSpan').empty()
  const xzqcd = $('#xzqselect').val()
  const qshnm = $('#nm').val()
  const bdat = $('#btm').val()
  const edat = $('#etm').val()
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.xzqcd = xzqcd
  param.qshnm = qshnm
  param.bdat = bdat
  param.edat = edat
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  $('#titleSpan').text(bdat + '至' + edat)
  const index = layer.load()
  jQuery.getJSON(basePath + '/kfly/ysl/getQsdSllInfo_new', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr>' +
          "<td title='" +
          isNull(data[i].MP_NM) +
          "'>" +
          isNull(data[i].MP_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].XZQ) +
          "'>" +
          isNull(data[i].XZQ) +
          '</td>' +
          "<td title='" +
          isNull(data[i].SOUR_TP) +
          "'>" +
          isNull(data[i].SOUR_TP) +
          '</td>' +
          /*	"<td title='"+isNull(data[i].WI_TYPE)+"'>"+isNull(data[i].WI_TYPE)+"</td>" +*/
          "<td title='" +
          isNull(data[i].USE_TYPE) +
          "'>" +
          isNull(data[i].USE_TYPE) +
          '</td>' +
          "<td title='" +
          isNull(data[i].MON_G) +
          "'>" +
          isNull(data[i].MON_G) +
          '</td>' +
          "<td title='" +
          isNull(data[i].DAY_MAX) +
          "'>" +
          isNull(data[i].DAY_MAX) +
          '</td>' +
          /*		"<td title='"+isNull(data[i].DT)+"'>"+isNull(data[i].DT)+"</td>" +*/
          "<td title='" +
          isNull(data[i].QSL) +
          "'>" +
          isNull(data[i].QSL) +
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
          /*	"<td></td>" +
						"<td></td>" +*/
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
          /*	"<td></td>" +
						"<td></td>" +*/
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
