let pageSize
const param = {}

$(function () {
  //	var hh = document.body.clientHeight;
  //	var height = hh-$(".searchDiv").height()-80+10;
  //	$(".conent").css("height",height);
  //	var tbHeight = $(".conent").height()-$(".titleDiv").height()-$(".M-box").height();
  //	$(".tableDiv").css("height",tbHeight);
  //	pageSize = Math.floor((tbHeight-35)/30)-1;
  let bodyheight = $(document.body).outerHeight(true)

  if (getOS() == 'Linux' && userBrowser() == 'Firefox') {
    //适配国产操作系统中的火狐浏览器
    bodyheight = bodyheight - 40
  }
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.tableDiv').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2
  //
  $('#btm').val(GetDay())
  $('#etm').val(getCurrentYMD())
  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''
  $('#tmSpan').text('')
  $('#tmSpan').text($('#btm').val() + '到' + $('#etm').val())
  const qshnm = $('#nm').val()
  const adcd = $('#xzqselect').val()
  const btm = $('#btm').val()
  const etm = $('#etm').val()

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.nm = qshnm
  param.adcd = adcd
  param.btm = btm
  param.etm = etm
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + '/kfly/nsbd/getNsbdJcxxTjInfo', param, function (result) {
    const data = result.page.list
    console.info(data)
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
          //						"<td title='"+isNull(data[i].BTM)+"'>"+isNull(data[i].BTM)+"</td>" +
          //						"<td title='"+isNull(data[i].ETM)+"'>"+isNull(data[i].ETM)+"</td>" +

          "<td title='" +
          isNull(data[i].Q) +
          "'>" +
          isNull(data[i].Q) +
          '</td>' +
          "<td title='" +
          isNull(data[i].SL) +
          "'>" +
          isNullForSl(data[i].SL) +
          '</td>' +
          '</tr>'
      }
      for (let x = data.length; x < pageSize; x++) {
        tbodyStr += '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
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

function isNullForSl(vad) {
  if (vad === undefined || vad === null || vad === '' || vad === 'undefined' || vad === 'null') {
    return '-'
  }
  return vad / 1000
}

function initLayer(wrcs_cd, nm) {
  layer.open({
    type: 2,
    title: nm,
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['850px', '500px'],
    content: basePath + '/pages/kfly/gsl/nsbd/jcxx/jcxxDialog.jsp?wrcs_cd=' + wrcs_cd
  })
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
