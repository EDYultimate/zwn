let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 1

  $('#btm').val(new Date().Format('yyyy-MM-dd'))
  $('#etm').val(new Date().Format('yyyy-MM-dd'))
  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''
  $('#titleSpan').empty()
  const xzqcd = $('#xzqselect').val()
  const status = $('#status').val()
  debugger
  const qshnm = $('#nm').val()
  const bdat = $('#btm').val()
  const edat = $('#etm').val()
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.xzqcd = xzqcd
  param.status = status
  param.qshnm = qshnm
  param.bdat = bdat
  param.edat = edat
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  $('#titleSpan').text(bdat + '至' + edat)
  const index = layer.load()
  jQuery.getJSON(basePath + '/kfly/ysl/getQshQslInfo_new', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr>' +
          "<td title='" +
          isNull(data[i].WIU_NM) +
          "'>" +
          isNull(data[i].WIU_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].AD_NM) +
          "'>" +
          isNull(data[i].AD_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].MON_G) +
          "'>" +
          isNull(data[i].MON_G) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TRAD_TP) +
          "'>" +
          isNull(data[i].TRAD_TP) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ECO_TP) +
          "'>" +
          isNull(data[i].ECO_TP) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WIU_TP) +
          "'>" +
          isNull(data[i].WIU_TP) +
          '</td>' +
          /*"<td title='"+isNull(data[i].DT)+"'>"+isNull(data[i].DT)+"</td>" +*/
          "<td title='" +
          isNull(data[i].DAY_W) +
          "'>" +
          isNull(data[i].DAY_W) +
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
          /*"<td></td>" +*/
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
          /*"<td></td>" +*/
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
