let pageSize
const param = {}

$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - 80 + 10
  $('.conent').css('height', height)
  const tbHeight = $('.conent').height() - $('.titleDiv').height() - $('.M-box').height()
  $('.tableDiv').css('height', tbHeight)
  pageSize = Math.floor((tbHeight - 35) / 30) - 1

  $('#btm').val(GetDay())
  $('#etm').val(getCurrentYMD())
  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''
  $('#tmSpan').text('')
  $('#tmSpan').text($('#btm').val())
  const qshnm = $('#nm').val()

  const bdat = $('#btm').val()
  const edat = $('#etm').val()
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  //	param.xzqcd=xzqcd;
  param.nm = qshnm
  param.bdat = bdat
  param.edat = edat
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + '/kfly/sk/getSkJcInfo_def', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr onclick="initLayer(\'' +
          data[i].STCD +
          "','" +
          data[i].RES_NM +
          '\')">' +
          "<td title='" +
          isNull(data[i].RES_NM) +
          "'>" +
          isNull(data[i].RES_NM) +
          '</td>' +
          "<td title='" +
          dateTimeHFormate1(data[i].TM) +
          "'>" +
          dateTimeHFormate1(data[i].TM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TOT_V) +
          "'>" +
          isNull(data[i].TOT_V) +
          '</td>' +
          "<td title='" +
          isNull(data[i].FRSC_V) +
          "'>" +
          isNull(data[i].FRSC_V) +
          '</td>' +
          "<td title='" +
          isNull(data[i].NORM_WZ) +
          "'>" +
          isNull(data[i].NORM_WZ) +
          '</td>' +
          "<td title='" +
          isNull(data[i].CF_Z) +
          "'>" +
          isNull(data[i].CF_Z) +
          '</td>' +
          "<td title='" +
          isNull(data[i].UTIL_V) +
          "'>" +
          isNull(data[i].UTIL_V) +
          '</td>' +
          "<td title='" +
          isNull(data[i].RZ) +
          "'>" +
          isNull(data[i].RZ) +
          '</td>' +
          "<td title='" +
          isNull(data[i].W) +
          "'>" +
          isNull(data[i].W) +
          '</td>' +
          "<td title='" +
          isNull(data[i].INQ) +
          "'>" +
          isNull(data[i].INQ) +
          '</td>' +
          "<td title='" +
          isNull(data[i].OTQ) +
          "'>" +
          isNull(data[i].OTQ) +
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
    content: basePath + '/pages/message/jcxx/skxx/skDialog.jsp?wrcs_cd=' + wrcs_cd
  })
}

function formatSkLx(str) {
  let result = ''
  switch (str) {
    case '1':
      result = '大（1）型'
      break
    case '2':
      result = '大（2）型'
      break
    case '3':
      result = '中型'
      break
    case '4':
      result = '小（1）型'
      break
    case '5':
      result = '小（2）型'
      break
  }
  return result
}
