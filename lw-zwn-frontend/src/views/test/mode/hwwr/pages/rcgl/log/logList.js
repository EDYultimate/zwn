let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2
  $('#etm').val(getCurrentYMD())
  $('#btm').val(getLastWeekDate())
  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.btm = $('#btm').val()
  param.etm = $('#etm').val()
  param.nm = $('#nm').val()
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + 'rcgl/logtag/getLogList', param, function (result) {
    if (result.errors != null && result.errors.length > 0) {
      alert(result.errors)
      layer.close(index)
      return
    }
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        const rno = parseInt((CurrentPage - 1) * pageSize) + parseInt(i + 1)

        tbodyStr +=
          '<tr>' +
          "<td title='" +
          rno +
          "'>" +
          rno +
          '</td>' +
          "<td title='" +
          isNull(data[i].USERNAME) +
          "'>" +
          isNull(data[i].USERNAME) +
          '</td>' +
          "<td title='" +
          dateTimeSSFormate2(data[i].TS) +
          "'>" +
          dateTimeSSFormate2(data[i].TS) +
          '</td>' +
          "<td title='" +
          isNull(data[i].MODEL_NM) +
          "'>" +
          isNull(data[i].MODEL_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].USEFOR) +
          "'>" +
          isNull(data[i].USEFOR) +
          '</td>' +
          '</tr>'
      }
      for (let x = data.length; x < pageSize; x++) {
        tbodyStr +=
          '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
      }
    } else {
      for (var i = 0; i < pageSize; i++) {
        tbodyStr +=
          '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
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
