let pageSize
const param = {}

$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - 80 + 10
  //	$(".conent").css("height",height);
  const tbHeight = $('.conent').height() - $('.titleDiv').height()
  $('.bbTable').css('height', tbHeight)
  pageSize = Math.floor((tbHeight - 35) / 30) - 1

  const date = new Date()
  tm = date.getFullYear()

  $('#beginTm').val(tm - 5)
  $('#endTm').val(tm)
  search()
})

//页面初始化
function search() {
  let tbodyStr = ''
  $('#tmSpan').text('')
  $('#tmSpan').text($('#beginTm').val() + '到' + $('#endTm').val())

  const bdat = $('#beginTm').val()
  const edat = $('#endTm').val()
  param.bdat = bdat
  param.edat = edat
  param.adcd = cd
  const index = layer.load()
  jQuery.getJSON(basePath + '/szybh/rhpwk/getRhpwkTjInfoByAdcdTab', param, function (data) {
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        tbodyStr += '<tr>'
        tbodyStr +=
          "<td title='" +
          isNull(data[i].ADNM) +
          "'>" +
          isNull(data[i].ADNM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].YR) +
          "'>" +
          isNull(data[i].YR) +
          '</td>' +
          "<td title='" +
          isNull(data[i].PWK) +
          "'>" +
          isNull(data[i].PWK) +
          '</td>' +
          "<td title='" +
          isNull(data[i].SEW) +
          "'>" +
          isNull(data[i].SEW) +
          '</td>' +
          "<td title='" +
          isNull(data[i].COD) +
          "'>" +
          isNull(data[i].COD) +
          '</td>' +
          "<td title='" +
          isNull(data[i].NH3N) +
          "'>" +
          isNull(data[i].NH3N) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TP) +
          "'>" +
          isNull(data[i].TP) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TN) +
          "'>" +
          isNull(data[i].TN) +
          '</td>' +
          "<td title='" +
          isNull(data[i].VP) +
          "'>" +
          isNull(data[i].VP) +
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
          '</tr>'
      }
    }
    $('#tbody').empty().append(tbodyStr)

    layer.close(index)
  })
}
