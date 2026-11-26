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

  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.yr = $('#yr').val()
  param.ad_cd = $('#ad_cd').val()
  param.levels = $('#levels').val()
  param.industry = $('#industry').val()
  param.nm = $('#nm').val()
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  param.nowTime = Math.random() //考虑ie浏览器刷新
  const index = layer.load()
  jQuery.getJSON(basePath + 'jyys/ywsj/getYsdwDftjInfo', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
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
          "<td title='" +
          isNull(data[i].LEVELS) +
          "'>" +
          isNull(data[i].LEVELS) +
          '</td>' +
          "<td title='" +
          isNull(data[i].INDUSTRY) +
          "' >" +
          isNull(data[i].INDUSTRY) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ORG) +
          "'>" +
          isNull(data[i].ORG) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TOTAL) +
          "'>" +
          isNull(data[i].TOTAL) +
          '</td>' +
          "<td title='" +
          isNull(data[i].W) +
          "'>" +
          isNull(data[i].W) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ISEXCEED) +
          "'>" +
          isNull(data[i].ISEXCEED) +
          '</td>' +
          "<td title='" +
          isNull(data[i].EXCEEDW) +
          "'>" +
          isNull(data[i].EXCEEDW) +
          '</td>' +
          "<td style=' width:20%;' >" +
          '<a href="javascript:;" onclick=update(\'' +
          isNull(data[i].ID) +
          "','" +
          isNull(data[i].YR) +
          "')>" +
          "<img style='cursor: pointer;' title='编辑' src='" +
          basePath +
          "/images/index/bj_07.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
          '<a href="javascript:;" onclick="del(\'' +
          isNull(data[i].ID) +
          '\')">' +
          "<img style='cursor: pointer;' title='删除' src='" +
          basePath +
          "/images/index/sc_13.png'></a>" +
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

function del(id) {
  const msg = '您真的确定要删除该信息吗？\n\n请确认！'
  const pasrse = {}

  pasrse.id = id
  if (confirm(msg) == true) {
    $.ajax({
      url: basePath + 'jyys/ywsj/deleteYsdwDftjInfo',
      data: pasrse,
      dataType: 'json',
      type: 'post',
      success: function (data) {
        if (data != null && data.STATUS == 'Y') {
          alert('删除成功！')
        } else {
          alert('删除失败！')
        }
        search(1)
      }
    })
  }
}

function newAdd() {
  layer.open({
    type: 2,
    title: '添加',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '300px'],
    content: basePath + 'pages/jyys_new/ywsj/zdjkysdw/ysqk/dftjsj/addFile.jsp'
  })
}

function selectFile(id) {
  layer.open({
    type: 2,
    title: '文件',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '500px'],
    content: basePath + '/pages/jyys/ysFile/download.jsp?id=' + id
  })
}

//编辑信息
function update(id) {
  layer.open({
    type: 2,
    title: '修改',
    shadeClose: true,
    shade: 0.8,
    area: ['700px', '300px'],
    content: basePath + 'pages/jyys_new/ywsj/zdjkysdw/ysqk/dftjsj/dialog_update.jsp?id=' + id,
    end: function () {
      search(1)
    }
  })
}

//导出
function dlexcel() {
  param.yr = $('#yr').val()
  param.ad_cd = $('#ad_cd').val()
  param.levels = $('#levels').val()
  param.industry = $('#industry').val()
  param.nm = $('#nm').val()

  $.ajax({
    type: 'POST',
    url: basePath + 'jyys/ywsj/getYsdwDftjExcelInfo',
    //contentType: 'application/json',
    async: true,
    data: param,
    success: function (data) {
      const results = data
      const titles = 'YR,AD_NM,LEVELS,INDUSTRY,ORG,TOTAL,W,ISEXCEED,EXCEEDW'
      const titles_zh =
        '年份,行政区,级别,行业,重点监控用水单位名称,年计划用水量,年实际用水量,是否超计划,超计划水量'

      const json = {
        titles: titles,
        titles_zh: titles_zh,
        results: JSON.stringify(results),
        excelname: '重点监控用水单位地方统计数据'
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
  printData('dydiv', 'dytable')
}
