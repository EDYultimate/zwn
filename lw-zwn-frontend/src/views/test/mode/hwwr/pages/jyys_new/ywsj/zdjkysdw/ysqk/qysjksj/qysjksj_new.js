let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  /* var tbHeight = bodyheight-120-$(".titleDiv").height()-$(".M-box").height()-10;
      $(".bbTable").css("height",tbHeight+"px");*/
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.STCD_DIV').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2

  const date = new Date()
  const year = date.getFullYear()
  $('#yr').val(year)

  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''

  let tbodyStr1 = ''

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.yr = $('#yr').val()
  param.ad_cd = $('#ad_cd').val()
  /*  param.levels= $("#levels").val();*/
  param.levels = '0'
  param.industry = $('#industry').val()
  param.nm = $('#nm').val()

  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + 'jyys/ywsj/getYsdwQysjkInfo', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        /*  tbodyStr += "<tr   onclick=initLayer('"+data[i].ID+"','"+data[i].WIU_CD+"','"+data[i].ORG+"')>" +*/
        tbodyStr +=
          '<tr>' +
          "<td title='" +
          isNull(data[i].YR) +
          "' >" +
          isNull(data[i].YR) +
          '</td>' +
          "<td title='" +
          isNull(data[i].AD_NM) +
          "'>" +
          isNull(data[i].AD_NM) +
          '</td>' +
          /* "<td title='"+isNull(data[i].INDUSTRY)+"' >"+isNull(data[i].INDUSTRY)+"</td>" +*/
          "<td title='" +
          isNull(data[i].ORG) +
          "'>" +
          isNull(data[i].ORG) +
          '</td>'
        tbodyStr += '</tr>'

        tbodyStr1 +=
          '<tr>' +
          "<td title='" +
          isNull(data[i].JAN) +
          "'>" +
          isNull(data[i].JAN) +
          '</td>' +
          "<td title='" +
          isNull(data[i].FEB) +
          "'>" +
          isNull(data[i].FEB) +
          '</td>' +
          "<td title='" +
          isNull(data[i].MAR) +
          "'>" +
          isNull(data[i].MAR) +
          '</td>' +
          "<td title='" +
          isNull(data[i].APR) +
          "'>" +
          isNull(data[i].APR) +
          '</td>' +
          "<td title='" +
          isNull(data[i].MAY) +
          "'>" +
          isNull(data[i].MAY) +
          '</td>' +
          "<td title='" +
          isNull(data[i].JUNE) +
          "'>" +
          isNull(data[i].JUNE) +
          '</td>' +
          "<td title='" +
          isNull(data[i].JULY) +
          "'>" +
          isNull(data[i].JULY) +
          '</td>' +
          "<td title='" +
          isNull(data[i].AUG) +
          "'>" +
          isNull(data[i].AUG) +
          '</td>' +
          "<td title='" +
          isNull(data[i].SEPT) +
          "'>" +
          isNull(data[i].SEPT) +
          '</td>' +
          "<td title='" +
          isNull(data[i].OCT) +
          "'>" +
          isNull(data[i].OCT) +
          '</td>' +
          "<td title='" +
          isNull(data[i].NOV) +
          "'>" +
          isNull(data[i].NOV) +
          '</td>' +
          "<td title='" +
          isNull(data[i].DEC) +
          "'>" +
          isNull(data[i].DEC) +
          '</td>' +
          "<td title='" +
          isNull(data[i].W) +
          "'>" +
          isNull(data[i].W) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TOTAL) +
          "'>" +
          isNull(data[i].TOTAL) +
          '</td>'

        if (data[i].EXCEEDW < 0) {
          tbodyStr1 += "<td title='-'>-</td>"
        } else {
          tbodyStr1 +=
            "<td title='" + isNull(data[i].EXCEEDW) + "'>" + isNull(data[i].EXCEEDW) + '</td>'
        }
        tbodyStr1 += '</tr>'
      }
      for (let x = data.length; x < pageSize; x++) {
        tbodyStr += '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
        tbodyStr1 +=
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
          '<td></td>' +
          '</tr>'
      }
    } else {
      for (var i = 0; i < pageSize; i++) {
        tbodyStr += '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
        tbodyStr1 +=
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
          '<td></td>' +
          '</tr>'
      }
    }

    const table_title =
      "<tr style='height:60px;'>" +
      "<td  style='width:60px;'> 年份</td>" +
      "<td  style='width:60px;'>行政区</td>" +
      "<td  style='width:200px;'>重点监控用水单位名称</td>" +
      '</tr>'

    const table_title1 =
      '<tr>' +
      "<td colspan='12'  style='width:1200px;'>实际用水量</td>" +
      "<td rowspan='2'  style='width:100px;'>年累计用水量</td>" +
      "<td rowspan='2' style='width:100px;'>年计划用水量</td>" +
      "<td rowspan='2'  style='width:100px;'>超计划水量</td>" +
      '</tr>' +
      '<tr>' +
      "<td style='width:5%;border-top:1px solid #E1E1E1;'>1月</td>" +
      "<td style='width:5%;border-top:1px solid #E1E1E1'>2月</td>" +
      "<td style='width:5%;border-top:1px solid #E1E1E1'>3月</td>" +
      "<td style='width:5%;border-top:1px solid #E1E1E1'>4月</td>" +
      "<td style='width:5%;border-top:1px solid #E1E1E1'>5月</td>" +
      "<td style='width:5%;border-top:1px solid #E1E1E1'>6月</td>" +
      "<td style='width:5%;border-top:1px solid #E1E1E1'>7月</td>" +
      "<td style='width:5%;border-top:1px solid #E1E1E1'>8月</td>" +
      "<td style='width:5%;border-top:1px solid #E1E1E1'>9月</td>" +
      "<td style='width:5%;border-top:1px solid #E1E1E1'>10月</td>" +
      "<td style='width:5%;border-top:1px solid #E1E1E1'>11月</td>" +
      "<td style='width:5%;border-top:1px solid #E1E1E1'>12月</td>" +
      '</tr>'

    $('#STCD_TABLE1').empty().append(table_title)
.append(tbodyStr)
    $('#STCD_TABLE2').empty().append(table_title1)
.append(tbodyStr1)
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

function dlexcel() {
  param.yr = $('#yr').val()
  param.ad_cd = $('#ad_cd').val()
  /*  param.levels= $("#levels").val();*/
  param.levels = '0'
  param.industry = $('#industry').val()
  param.nm = $('#nm').val()

  param.nowTime = Math.random() //考虑ie浏览器刷新

  $.ajax({
    type: 'POST',
    url: basePath + 'jyys/ywsj/getYsdwQysjkExcelInfo',
    //contentType: 'application/json',
    async: true,
    data: param,
    success: function (data) {
      const results = data
      const titles =
        'YR,AD_NM,ORG,JAN,FEB,MAR,APR,MAY,JUNE,JULY,AUG,SEPT,OCT,NOV,DEC,W,TOTAL,EXCEEDW'
      const titles_zh =
        '年份,行政区,重点监控用水单位名称,1月用水量,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月,年累计用水量,年计划用水量,超计划水量'

      const json = {
        titles: titles,
        titles_zh: titles_zh,
        results: JSON.stringify(results),
        excelname: '国家级重点监控用水单位取用水监控数据'
      }
      // 下载表格
      $.fileDownload(basePath + 'commonExcel/download', {
        httpMethod: 'POST',
        data: json,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        successCallback: function (url) {}
      })
    }
  })
}

//打印方法
function printpage() {
  printData1('dydiv')
}

//用水分析图
function initLayer(id, wiu_cd, nm) {
  layer.open({
    type: 2,
    title: nm,
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['850px', '500px'],
    content:
      basePath +
      '/pages/jyys_new/ywsj/zdjkysdw/ysqk/qysjksj/dialog/ysfx.jsp?wiu_cd=' +
      wiu_cd +
      '&id=' +
      id
  })
}
