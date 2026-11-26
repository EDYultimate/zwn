let pageSize
const param = {}

$(function () {
  //	var hh = document.body.clientHeight;
  //	var height = hh-$(".searchDiv").height()-80+10;
  //	$(".conent").css("height",height);
  //	var tbHeight = $(".conent").height()-$(".titleDiv").height();
  //	$(".tableDiv").css("height",tbHeight);
  //	pageSize = Math.floor((tbHeight-35)/30)-1;

  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.tableDiv').css('height', tbHeight + 'px')
  //减去的 是表头的所占行数
  pageSize = Math.floor(tbHeight / 30) - 1

  jQuery.getJSON(basePath + '/szybh/rhpwk/getRhpwkInfoTm', param, function (result) {
    let tm = ''
    if (result.length > 0) {
      tm = result[0].TM
    } else {
      const date = new Date()
      tm = date.getFullYear()
    }
    $('#btm').val(tm)
    search(1)
  })
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''
  $('#tmSpan').text('')
  $('#tmSpan').text($('#btm').val())

  const bdat = $('#btm').val()
  param.bdat = bdat
  const index = layer.load()
  jQuery.getJSON(basePath + '/szybh/rhpwk/getRhpwkTjTabInfo', param, function (data) {
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        if (i == 0) {
          tbodyStr += '<tr>'
        } else {
          tbodyStr += '<tr onclick="initLayer(\'' + data[i].ADCD + "','" + data[i].NM + '\')">'
        }
        tbodyStr +=
          "<td title='" +
          isNull(data[i].NM) +
          "'>" +
          isNull(data[i].NM) +
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
          isNull(data[i].sewP) +
          "'>" +
          isNull(data[i].sewP) +
          '</td>' +
          "<td title='" +
          isNull(data[i].COD) +
          "'>" +
          isNull(data[i].COD) +
          '</td>' +
          "<td title='" +
          isNull(data[i].codP) +
          "'>" +
          isNull(data[i].codP) +
          '</td>' +
          "<td title='" +
          isNull(data[i].NH3N) +
          "'>" +
          isNull(data[i].NH3N) +
          '</td>' +
          "<td title='" +
          isNull(data[i].nh3nP) +
          "'>" +
          isNull(data[i].nh3nP) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TP) +
          "'>" +
          isNull(data[i].TP) +
          '</td>' +
          "<td title='" +
          isNull(data[i].tpP) +
          "'>" +
          isNull(data[i].tpP) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TN) +
          "'>" +
          isNull(data[i].TN) +
          '</td>' +
          "<td title='" +
          isNull(data[i].tnP) +
          "'>" +
          isNull(data[i].tnP) +
          '</td>' +
          "<td title='" +
          isNull(data[i].VP) +
          "'>" +
          isNull(data[i].VP) +
          '</td>' +
          "<td title='" +
          isNull(data[i].vpP) +
          "'>" +
          isNull(data[i].vpP) +
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

function initLayer(cd, nm) {
  layer.open({
    type: 2,
    title: nm,
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['900px', '500px'],
    content: basePath + '/pages/szybh/rhpwk/tj/tjYearDialog.jsp?cd=' + cd
  })
}
