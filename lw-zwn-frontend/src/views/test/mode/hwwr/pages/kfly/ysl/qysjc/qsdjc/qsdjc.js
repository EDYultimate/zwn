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

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  $('#btm').val(yesterday.Format('yyyy-MM-dd'))
  $('#etm').val(yesterday.Format('yyyy-MM-dd'))
  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''
  $('#titleSpan').empty()
  const xzqcd = $('#xzqselect').val()
  //debugger;
  const qshnm = $('#nm').val()
  const bdat = $('#btm').val()
  const edat = $('#etm').val()
  const wrz_nm = $('#wrz_nm').val()
  const conc_org = $('#conc_org').val()
  const fzlx = $('#fzlx').val()
  // 获取当日有数据复选框状态
  const hasDataToday = $('#hasDataToday').is(':checked')
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.xzqcd = xzqcd
  param.qshnm = qshnm
  param.bdat = bdat
  param.edat = edat
  param.wrz_nm = wrz_nm
  param.conc_org = conc_org
  param.fzlx = fzlx
  param.hasDataToday = hasDataToday ? 1 : 0
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  $('#titleSpan').text(bdat + '至' + edat)
  const index = layer.load()
  jQuery.getJSON(basePath + '/kfly/ysl/getWssfzQshQsdslInfo', param, function (result) {
    if (result.errors != null && result.errors.length > 0) {
      alert(result.errors)
      layer.close(index)
      return
    }
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr  onclick="initLayer(\'' +
          data[i].MP_CD +
          "',' " +
          data[i].MP_NM +
          '\')" >' +
          "<td title='" +
          isNull(data[i].MP_NM) +
          "'>" +
          isNull(data[i].MP_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].FZLX) +
          "'>" +
          isNull(data[i].FZLX) +
          '</td>' +
          "<td title='" +
          isNull(data[i].AD_NM) +
          "'>" +
          isNull(data[i].AD_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WRZ_NM) +
          "'>" +
          isNull(data[i].WRZ_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].CONC_ORG) +
          "'>" +
          isNull(data[i].CONC_ORG) +
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
      }
    })
    $('.tolSpan').html('共' + result.page.total + '条')
    $('.M-box').show()
    layer.close(index)
  })
}

function initLayer(mp_cd, nm) {
  layer.open({
    type: 2,
    title: nm,
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['850px', '500px'],
    content: basePath + '/pages/kfly/ysl/qysjc/qsdjc/qsdDialog.jsp?mp_cd=' + mp_cd
  })
}
