let pageSize
const param = {}

$(function () {
  let bodyheight = $(document.body).outerHeight(true)

  if (getOS() == 'Linux' && userBrowser() == 'Firefox') {
    //适配国产操作系统中的火狐浏览器
    bodyheight = bodyheight - 100
  }

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
  const qsknm = $('#nm').val()
  const bdat = $('#btm').val()
  const edat = $('#etm').val()
  const wrz_nm = $('#wrz_nm').val()
  const conc_org = $('#conc_org').val()
  const fzlx = $('#fzlx').val()

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  /*param.xzqcd=xzqcd;*/
  param.qsknm = qsknm
  param.bdat = bdat
  param.edat = edat
  /*param.wrz_nm=wrz_nm;
	param.conc_org=conc_org;
	param.fzlx=fzlx;*/

  param.pageSize = pageSize
  param.pageNo = CurrentPage
  $('#titleSpan').text(bdat + '至' + edat)
  const index = layer.load()
  jQuery.getJSON(basePath + '/kfly/ysl/getQskSllInfo', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr onclick="initLayer(\'' +
          data[i].INT_CD +
          "','" +
          data[i].INT_NM +
          '\')">' +
          "<td title='" +
          isNull(data[i].INT_NM) +
          "'>" +
          isNull(data[i].INT_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].INT_TP) +
          "'>" +
          isNull(data[i].INT_TP) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ORG_NM) +
          "'>" +
          isNull(data[i].ORG_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].MAX_PERM_Q) +
          "'>" +
          isNull(data[i].MAX_PERM_Q) +
          '</td>' +
          "<td title='" +
          isNull(data[i].PERM_WW) +
          "'>" +
          isNull(data[i].PERM_WW) +
          '</td>' +
          "<td title='" +
          isNull(data[i].W) +
          "'>" +
          isNull(data[i].W) +
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
        debugger
      }
    })
    debugger
    $('.tolSpan').html('共' + result.page.total + '条')
    $('.M-box').show()
    layer.close(index)
  })
}

function initLayer(int_cd, nm) {
  layer.open({
    type: 2,
    title: nm,
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['850px', '500px'],
    content: basePath + '/pages/kfly/ysl/qysjc/qskjc/qskDialog.jsp?int_cd=' + int_cd
  })
}
