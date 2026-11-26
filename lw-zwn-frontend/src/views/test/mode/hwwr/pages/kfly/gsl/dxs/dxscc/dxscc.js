let pageSize
const param = {}

$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height()
  $('.conent').css('height', height)
  const tbHeight = $('.conent').height() - $('.titleDiv').height() - $('.M-box').height()
  $('.tableDiv').css('height', tbHeight)
  pageSize = Math.floor((tbHeight - 45) / 30) - 2
  search(1)
})

//页面初始化
function search(CurrentPage) {
  const tbodyStr = ''
  const stnm = $('#stnm').val()
  param.stnm = stnm
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + '/gsl/dxs/getDxsccBase', param, function (result) {
    let str = ''
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        str +=
          '<tr>' +
          "<td title='" +
          isNull(data[i].GWOA_NM) +
          "'>" +
          isNull(data[i].GWOA_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].DIV_BAS) +
          "'>" +
          isNull(data[i].DIV_BAS) +
          '</td>' +
          "<td title='" +
          isNull(data[i].GWOA_A) +
          "'>" +
          isNull(data[i].GWOA_A) +
          '</td>' +
          "<td title='" +
          formateman(data[i].MAN_TP) +
          "'>" +
          formateman(data[i].MAN_TP) +
          '</td>' +
          "<td title='" +
          isNull(data[i].MAJ_COLL_LAY) +
          "'>" +
          isNull(data[i].MAJ_COLL_LAY) +
          '</td>' +
          "<td title='" +
          isNull(data[i].GW_EXP_YD) +
          "'>" +
          isNull(data[i].GW_EXP_YD) +
          '</td>' +
          "<td title='" +
          isNull(data[i].AA_EXP_YD) +
          "'>" +
          isNull(data[i].AA_EXP_YD) +
          '</td>' +
          "<td title='" +
          isNull(data[i].GW_LEV_MAX_DEP) +
          "'>" +
          isNull(data[i].GW_LEV_MAX_DEP) +
          '</td>' +
          "<td title='" +
          isNull(data[i].MAX_DEP_LOC) +
          "'>" +
          isNull(data[i].MAX_DEP_LOC) +
          '</td>' +
          "<td title='" +
          isNull(data[i].CONT_AD_NM) +
          "'>" +
          isNull(data[i].CONT_AD_NM) +
          '</td>' +
          '</tr>'
      }
      for (let x = data.length; x < pageSize; x++) {
        str +=
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
          '</tr>'
      }
    } else {
      for (var i = 0; i < pageSize; i++) {
        str +=
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
          '</tr>'
      }
    }
    $('#tbody').empty().append(str)
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

function formateman(type) {
  let tp = ''
  switch (type) {
    case '1':
      tp = '按压采区管理'
      break
    case '2':
      tp = '按限采区管理'
      break
    case '3':
      tp = '按禁采区管理'
      break
    case '9':
      tp = '其他管理方式'
      break
  }
  return tp
}

function initLayer(wrcs_cd, nm) {
  layer.open({
    type: 2,
    title: nm,
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['850px', '500px'],
    content: basePath + '/pages/kfly/gsl/dxs/sssj/sssjDialog.jsp?wrcs_cd=' + wrcs_cd
  })
}
