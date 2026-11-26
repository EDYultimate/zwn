let myChart
//$(document).ready(function(){
//	scrollEvent();
//
//	var options = {
//		'再生水矿坑排水': '再生水矿坑排水',
//		'地下水': '地下水',
//		'地下水（矿坑排水）': '地下水（矿坑排水）',
//		'地表水': '地表水',
//		'地表水地下水': '地表水地下水',
//		'地表水（再生水）': '地表水（再生水）',
//		'浅层地下水（傍河取水）': '浅层地下水（傍河取水）'
//	};
//
//	$("#wf_nm").mselect(options, []);
//
//	maketable();
//
//});

let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.M-box').height() - 10 - 80
  $('.bbTable').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2
  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''

  const tyear = $('#tyear').val()
  const wpc_sn = $('#wpc_sn').val()
  const wrp_nm = $('#wrp_nm').val()
  const wpc_cd = $('#wpc_cd').val()
  const expired = $('#expired').val()
  const int_use = $('#int_use').val()

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.tyear = tyear
  param.wpc_sn = wpc_sn
  param.wrp_nm = wrp_nm
  param.wpc_cd = wpc_cd
  param.expired = expired
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  //console.info(param);
  param.int_use = int_use
  const index = layer.load()
  jQuery.getJSON(basePath + '/message/rcgl/ssfzgl/getByxkzInfoSearch', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      console.info(data)
      for (var i = 0; i < data.length; i++) {
        const no = (CurrentPage - 1) * pageSize + (i + 1)
        const state = formateEXPIRED(data[i].EXPIRED)
        const colorStr = colorForEXPIRED(data[i].EXPIRED)
        tbodyStr +=
          '<tr>' +
          '<td>' +
          no +
          '</td>' +
          "<td title='" +
          state +
          "' style='color:" +
          colorStr +
          "'>" +
          state +
          '</td>' +
          "<td title='" +
          isNull(data[i].WPC_SN) +
          "'>" +
          isNull(data[i].WPC_SN) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WRP_NM) +
          "'>" +
          isNull(data[i].WRP_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].CHK_INT_MET) +
          "'>" +
          isNull(data[i].CHK_INT_MET) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WW) +
          "'>" +
          isNull(data[i].WW) +
          '</td>' +
          "<td title='" +
          isNull(data[i].INT_USE) +
          "'>" +
          isNull(data[i].INT_USE) +
          '</td>' +
          "<td title='" +
          dateTimeFormate(data[i].INT_BD) +
          "'>" +
          dateTimeFormate(data[i].INT_BD) +
          '</td>' +
          "<td title='" +
          dateTimeFormate(data[i].INT_DL) +
          "'>" +
          dateTimeFormate(data[i].INT_DL) +
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

function formateEXPIRED(EXPIRED) {
  if (EXPIRED > 0) {
    return '过期'
  }

  return '有效'
}
function colorForEXPIRED(EXPIRED) {
  if (EXPIRED > 0) {
    return '#f38b8b'
  }

  return '#404c5b'
}
