let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 110 - $('.titleDiv').height() - $('.M-box').height()
  $('.bbTable').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2

  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''

  const jsTitle = $('#jsTitle').val()

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.jsType = '4'
  param.jsTitle = jsTitle
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + 'jyys/jsxw/getNews', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr>' +
          "<td title='" +
          isNull(data[i].NO) +
          "'  style=' width:5%;'>" +
          isNull(data[i].NO) +
          '</td>' +
          "<td title='" +
          isNull(data[i].JS_TITLE) +
          "'  style=' width:35%;text-align:left;'><a href=\"javascript:newsView('" +
          data[i].JS_TITLE +
          "','" +
          data[i].ID +
          '\');">' +
          isNull(data[i].JS_TITLE) +
          '</a></td>' +
          "<td title='" +
          isNull(data[i].JS_DATE) +
          "'  style=' width:25%;'>" +
          isNull(data[i].JS_DATE) +
          '</td>' +
          "<td title='" +
          isNull(data[i].JS_SOURCE) +
          "'  style=' width:25%;'>" +
          isNull(data[i].JS_SOURCE) +
          '</td>' +
          "<td style=' width:5%;' >" +
          '<a href="javascript:update(\'' +
          data[i].ID +
          "','" +
          data[i].JS_TITLE +
          '\');">' +
          "<img style='cursor: pointer;' title='编辑' src='" +
          basePath +
          "/images/index/bj_07.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;" +
          '<a href="javascript:;" onclick="del(\'' +
          isNull(data[i].ID) +
          '\')">' +
          "<img style='cursor: pointer;' title='删除' src='" +
          basePath +
          "/images/index/sc_13.png'></a></td>" +
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
