let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2

  const date = new Date()
  const year = date.getFullYear()
  $('#yr').val(year)
  $('#year').text(year)
  search()
})

//页面初始化
function search() {
  let tbodyStr = ''

  const yr = $('#yr').val()
  if (yr == null || yr == '') {
    alert('年份不能为空')
    return
  }
  $('#year').text(yr)
  param.yr = yr
  param.tp = 'fwy'
  param.nowTime = Math.random() //考虑ie浏览器刷新

  const index = layer.load()
  jQuery.getJSON(basePath + 'jyys/ywsj/getYsdwSltjInfo', param, function (result) {
    const data = result

    const num = 2

    for (let i = 0; i < data.length; i++) {
      tbodyStr += '<tr>'

      if (i % 2 == 0) {
        tbodyStr +=
          "<td title='" +
          isNull(data[i].AD_NM) +
          "' rowspan=" +
          num +
          '>' +
          isNull(data[i].AD_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].LEVNM) +
          "'>" +
          isNull(data[i].LEVNM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].NUM) +
          "' >" +
          isNull(data[i].NUM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].PF) +
          "'>" +
          isNull(data[i].PF) +
          '</td>' +
          "<td title='" +
          isNull(data[i].JT) +
          "' >" +
          isNull(data[i].JT) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ZS) +
          "'>" +
          isNull(data[i].ZS) +
          '</td>' +
          "<td title='" +
          isNull(data[i].XX) +
          "'>" +
          isNull(data[i].XX) +
          '</td>' +
          "<td title='" +
          isNull(data[i].JR) +
          "'>" +
          isNull(data[i].JR) +
          '</td>' +
          "<td title='" +
          isNull(data[i].FDC) +
          "'>" +
          isNull(data[i].FDC) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ZL) +
          "'>" +
          isNull(data[i].ZL) +
          '</td>' +
          "<td title='" +
          isNull(data[i].KX) +
          "'>" +
          isNull(data[i].KX) +
          '</td>' +
          "<td title='" +
          isNull(data[i].SL) +
          "' >" +
          isNull(data[i].SL) +
          '</td>' +
          "<td title='" +
          isNull(data[i].JM) +
          "' >" +
          isNull(data[i].JM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].JY) +
          "' >" +
          isNull(data[i].JY) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WS) +
          "' >" +
          isNull(data[i].WS) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WH) +
          "' >" +
          isNull(data[i].WH) +
          '</td>' +
          "<td title='" +
          isNull(data[i].GG) +
          "' >" +
          isNull(data[i].GG) +
          '</td>' +
          "<td title='" +
          isNull(data[i].GJ) +
          "' >" +
          isNull(data[i].GJ) +
          '</td>' +
          '</tr>'
      } else {
        tbodyStr +=
          "<td title='" +
          isNull(data[i].LEVNM) +
          "'>" +
          isNull(data[i].LEVNM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].NUM) +
          "' >" +
          isNull(data[i].NUM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].PF) +
          "'>" +
          isNull(data[i].PF) +
          '</td>' +
          "<td title='" +
          isNull(data[i].JT) +
          "' >" +
          isNull(data[i].JT) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ZS) +
          "'>" +
          isNull(data[i].ZS) +
          '</td>' +
          "<td title='" +
          isNull(data[i].XX) +
          "'>" +
          isNull(data[i].XX) +
          '</td>' +
          "<td title='" +
          isNull(data[i].JR) +
          "'>" +
          isNull(data[i].JR) +
          '</td>' +
          "<td title='" +
          isNull(data[i].FDC) +
          "'>" +
          isNull(data[i].FDC) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ZL) +
          "'>" +
          isNull(data[i].ZL) +
          '</td>' +
          "<td title='" +
          isNull(data[i].KX) +
          "'>" +
          isNull(data[i].KX) +
          '</td>' +
          "<td title='" +
          isNull(data[i].SL) +
          "' >" +
          isNull(data[i].SL) +
          '</td>' +
          "<td title='" +
          isNull(data[i].JM) +
          "' >" +
          isNull(data[i].JM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].JY) +
          "' >" +
          isNull(data[i].JY) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WS) +
          "' >" +
          isNull(data[i].WS) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WH) +
          "' >" +
          isNull(data[i].WH) +
          '</td>' +
          "<td title='" +
          isNull(data[i].GG) +
          "' >" +
          isNull(data[i].GG) +
          '</td>' +
          "<td title='" +
          isNull(data[i].GJ) +
          "' >" +
          isNull(data[i].GJ) +
          '</td>' +
          '</tr>'
      }
    }

    $('#tbody').empty().append(tbodyStr)
    layer.close(index)
  })
}

function dlexcel() {
  const yr = $('#yr').val()
  param.yr = yr
  param.tp = 'fwy'
  $.ajax({
    type: 'POST',
    url: basePath + 'jyys/ywsj/getYsdwSltjInfo',
    //contentType: 'application/json',
    async: true,
    data: param,
    success: function (data) {
      const results = data
      /*            var titles = 'AD_NM,LEVNM,NUM,XX,GY,HG,ZZ,CK,GT,FD,GS'
                        var titles_zh = '行政区,级别,数量,学校,公用,化工,造纸,采矿,钢铁,发电,供水'*/
      const titles = 'AD_NM,LEVNM,NUM,CK,ZZ,DL'
      const titles_zh = '行政区,级别,数量,采矿业,制造业, 电力、热力、燃气及水生产和供应业'

      const json = {
        titles: titles,
        titles_zh: titles_zh,
        results: JSON.stringify(results),
        excelname: yr + '年重点监控用水单位数量统计'
      }
      // 下载表格
      $.fileDownload(basePath + 'commonExcel/download', {
        httpMethod: 'POST',
        data: json,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        successCallback: function (url) {
          debugger
        }
      })
    }
  })
}
