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
  param.tp = ''
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
          isNull(data[i].GY) +
          "'>" +
          isNull(data[i].GY) +
          '</td>' +
          "<td title='" +
          isNull(data[i].FW) +
          "' >" +
          isNull(data[i].FW) +
          '</td>' +
          "<td title='" +
          isNull(data[i].NY) +
          "'>" +
          isNull(data[i].NY) +
          '</td>' +
          /*    "<td title='" + isNull(data[i].XX) + "'>" + isNull(data[i].XX) + "</td>" +
                    "<td title='" + isNull(data[i].GY) + "'>" + isNull(data[i].GY) + "</td>" +
                    "<td title='" + isNull(data[i].HG) + "'>" + isNull(data[i].HG) + "</td>" +
                    "<td title='" + isNull(data[i].ZZ) + "'>" + isNull(data[i].ZZ) + "</td>" +
                    "<td title='" + isNull(data[i].CK) + "'>" + isNull(data[i].CK) + "</td>" +
                    "<td title='" + isNull(data[i].GT) + "' >" + isNull(data[i].GT) + "</td>" +
                    "<td title='" + isNull(data[i].FD) + "' >" + isNull(data[i].FD) + "</td>" +
                    "<td title='" + isNull(data[i].GS) + "' >" + isNull(data[i].GS) + "</td>" +*/
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
          isNull(data[i].GY) +
          "'>" +
          isNull(data[i].GY) +
          '</td>' +
          "<td title='" +
          isNull(data[i].FW) +
          "' >" +
          isNull(data[i].FW) +
          '</td>' +
          "<td title='" +
          isNull(data[i].NY) +
          "'>" +
          isNull(data[i].NY) +
          '</td>' +
          /*  "<td title='" + isNull(data[i].XX) + "'>" + isNull(data[i].XX) + "</td>" +
                    "<td title='" + isNull(data[i].GY) + "'>" + isNull(data[i].GY) + "</td>" +
                    "<td title='" + isNull(data[i].HG) + "'>" + isNull(data[i].HG) + "</td>" +
                    "<td title='" + isNull(data[i].ZZ) + "'>" + isNull(data[i].ZZ) + "</td>" +
                    "<td title='" + isNull(data[i].CK) + "'>" + isNull(data[i].CK) + "</td>" +
                    "<td title='" + isNull(data[i].GT) + "' >" + isNull(data[i].GT) + "</td>" +
                    "<td title='" + isNull(data[i].FD) + "' >" + isNull(data[i].FD) + "</td>" +
                    "<td title='" + isNull(data[i].GS) + "' >" + isNull(data[i].GS) + "</td>" +*/
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
  param.tp = ''

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
      const titles = 'AD_NM,LEVNM,NUM,GY,FW,NY'
      const titles_zh = '行政区,级别,数量,工业,服务业,农业灌区'

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

//打印方法
function printpage() {
  printData1('dydiv')
}

//工业详细统计
function gydetail() {
  layer.open({
    type: 2,
    title: '工业门类重点监控用水单位数量统计',
    shadeClose: true,
    shade: 0.8,
    /* area: ['1100px', '600px'],*/
    area: ['100%', '100%'],
    /* content: basePath + 'pages/jyys_new/ywsj/zdjkysdw/dwsltj/gy/gy.jsp?yr='+yr,*/
    content: basePath + 'pages/jyys_new/ywsj/zdjkysdw/dwsltj/gy/gy.jsp',
    end: function () {
      /*search();*/
    }
  })
}

//服务业详细统计
function fwydetail() {
  layer.open({
    type: 2,
    title: '服务业门类重点监控用水单位数量统计',
    shadeClose: true,
    shade: 0.8,
    /*area: ['1100px', '600px'],*/
    area: ['100%', '100%'],
    content: basePath + 'pages/jyys_new/ywsj/zdjkysdw/dwsltj/fwy/fwy.jsp',
    end: function () {
      /*search();*/
    }
  })
}
