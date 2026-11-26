let pageSize
const param = {}

$(function () {
  //	var hh = document.body.clientHeight;
  //	var height = hh-$(".searchDiv").height()-80+10;
  //	$(".conent").css("height",height);
  //	var tbHeight = $(".conent").height()-$(".titleDiv").height()-$(".M-box").height();
  //	$(".tableDiv").css("height",tbHeight);
  //
  //	pageSize = Math.floor((tbHeight-35)/30)-1;

  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - 80 + 10
  $('.conent').css('height', height)

  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.tableDiv').css('height', tbHeight + 'px')
  //减去的 是表头的所占行数
  //pageSize = Math.floor((tbHeight)/30)-2;
  pageSize = Math.floor(tbHeight / 30) - 5

  jQuery.getJSON(basePath + '/szybh/rhpwk/getRhpwkInfoTm', param, function (result) {
    const tm = result[0].TM
    $('#btm').val(tm)
    search(1)
  })
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''
  $('#tmSpan').text('')
  $('#tmSpan').text($('#btm').val())
  const xzqcd = $('#xzqselect').val()
  const qshnm = $('#nm').val()

  const bdat = $('#btm').val()
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.xzqcd = xzqcd
  param.nm = qshnm
  param.bdat = bdat
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + '/szybh/rhpwk/getRhpwkJcInfo', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr onclick="initLayer(\'' +
          data[i].PDO_CD +
          "','" +
          data[i].PDO_NM +
          '\')">' +
          "<td title='" +
          isNull(data[i].PDO_NM) +
          "'>" +
          isNull(data[i].PDO_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].YR) +
          "'>" +
          isNull(data[i].YR) +
          '</td>' +
          "<td title='" +
          isNull(data[i].AD_NM) +
          "'>" +
          isNull(data[i].AD_NM) +
          '</td>' +
          /*"<td title='"+isNull(data[i].DWB_NM)+"'>"+isNull(data[i].DWB_NM)+"</td>" +*/
          //						"<td title='"+isNull(data[i].ADDR)+"'>"+isNull(data[i].ADDR)+"</td>" +
          /*"<td title='"+isNull(data[i].WFZ_NM)+"'>"+isNull(data[i].WFZ_NM)+"</td>" +*/
          "<td title='" +
          isNull(data[i].SEW_DA) +
          "'>" +
          isNull(data[i].SEW_DA) +
          '</td>' +
          "<td title='" +
          isNull(data[i].COD_DA) +
          "'>" +
          isNull(data[i].COD_DA) +
          '</td>' +
          "<td title='" +
          isNull(data[i].CODND) +
          "'>" +
          isNull(data[i].CODND) +
          '</td>' +
          "<td title='" +
          isNull(data[i].NH3N_DA) +
          "'>" +
          isNull(data[i].NH3N_DA) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ADND) +
          "'>" +
          isNull(data[i].ADND) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TP_DA) +
          "'>" +
          isNull(data[i].TP_DA) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ZLND) +
          "'>" +
          isNull(data[i].ZLND) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TN_DA) +
          "'>" +
          isNull(data[i].TN_DA) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ZDND) +
          "'>" +
          isNull(data[i].ZDND) +
          '</td>' +
          "<td title='" +
          isNull(data[i].VP_DA) +
          "'>" +
          isNull(data[i].VP_DA) +
          '</td>' +
          "<td title='" +
          isNull(data[i].HFFND) +
          "'>" +
          isNull(data[i].HFFND) +
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
          /*	"<td></td>" +
						"<td></td>" +
						"<td></td>" +*/
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
          /*	"<td></td>" +
				"<td></td>" +
				"<td></td>" +*/
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
    content: basePath + '/pages/szybh/rhpwk/jc/jcDialog.jsp?wrcs_cd=' + wrcs_cd
  })
}
