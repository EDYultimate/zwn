let pageSize
const param = {}

$(function () {
  const hh = document.body.clientHeight

  const height = hh - $('.searchDiv').height() - 80 + 10
  $('.conent').css('height', height)
  const tbHeight = $('.conent').height() - $('.titleDiv').height() - $('.M-box').height()
  $('.tableDiv').css('height', tbHeight)
  //pageSize = Math.floor((tbHeight-35)/30)-1;
  pageSize = Math.floor((tbHeight - 35) / 30) - 3
  //
  //	$("#btm").val(GetDay());
  //	$("#etm").val(getCurrentYMD());
  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''
  $('#tmSpan').text('')
  $('#tmSpan').text($('#btm').val())
  const qshnm = $('#nm').val()
  const adcd = $('#xzqselect').val()

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.nm = qshnm
  param.adcd = adcd
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + '/kfly/nsbd/getNsbdTjInfo', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr onclick="initLayer(\'' +
          data[i].WRCD +
          "','" +
          data[i].ST_NM +
          '\')">' +
          "<td title='" +
          isNull(data[i].ST_NM) +
          "'>" +
          isNull(data[i].ST_NM) +
          '</td>' +
          "<td title='" +
          formatLx(data[i].NT) +
          "'>" +
          formatLx(data[i].NT) +
          '</td>' +
          "<td title='" +
          dateTimeHFormate1(data[i].TM) +
          "'>" +
          dateTimeHFormate1(data[i].TM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].Q) +
          "'>" +
          isNull(data[i].Q) +
          '</td>' +
          "<td title='" +
          isNull(data[i].DAY_W) +
          "'>" +
          isNull(data[i].DAY_W) +
          '</td>' +
          "<td title='" +
          isNull(data[i].MW) +
          "'>" +
          isNull(data[i].MW) +
          '</td>' +
          "<td title='" +
          isNull(data[i].YSL) +
          "'>" +
          isNull(data[i].YSL) +
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
  //	layer.open({
  //	      type: 2,
  //	      title: nm,
  //	      shadeClose: false,
  //	      shade: 0.2,
  //	      maxmin: false, //开启最大化最小化按钮
  //	      area: ['850px', '500px'],
  //	      content: basePath+'/pages/kfly/skxsl/sssj/skDialog.jsp?wrcs_cd='+wrcs_cd
  //	    });
}

function formatLx(str) {
  let result = ''
  switch (str) {
    case '1':
      result = '控制断面'
      break
    case '2':
      result = '省界交水断面'
      break
    case '3':
      result = '干渠取水口'
      break
  }
  return result
}
