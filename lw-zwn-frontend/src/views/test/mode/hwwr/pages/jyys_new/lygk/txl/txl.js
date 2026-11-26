let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2

  initWorkplace() //初始化单位信息
  // search(1);
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.workplace = $('#workplace').val()
  param.nm = $('#nm').val()
  param.ispro = '0' //0表示通讯录
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  param.id = ''
  const index = layer.load()
  // jQuery.getJSON(basePath+"rcgl/sthx/getFlfgFileInfo",param,function(result){
  jQuery.getJSON(basePath + 'jyys/lygk/getTxlInfo', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr>' +
          "<td title='" +
          isNull(data[i].NO) +
          "'  style=' width:5%;'>" +
          isNull(data[i].NO) +
          '</td>' +
          "<td title='" +
          isNull(data[i].NM) +
          "'  style=' width:35%;'>" +
          isNull(data[i].NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WORKPLACE) +
          "'  style=' width:25%;'>" +
          isNull(data[i].WORKPLACE) +
          '</td>' +
          "<td title='" +
          isNull(data[i].JOB) +
          "'  style=' width:10%;'>" +
          isNull(data[i].JOB) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TEL) +
          "'  style=' width:10%;'>" +
          isNull(data[i].TEL) +
          '</td>' +
          "<td title='" +
          isNull(data[i].FAX) +
          "'  style=' width:10%;'>" +
          isNull(data[i].FAX) +
          '</td>' +
          "<td title='" +
          isNull(data[i].MOB) +
          "'  style=' width:10%;'>" +
          isNull(data[i].MOB) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ADDR) +
          "'  style=' width:10%;'>" +
          isNull(data[i].ADDR) +
          '</td>' +
          "<td style=' width:8%;' >" +
          '<a href="javascript:;" onclick=update(\'' +
          isNull(data[i].ID) +
          "','" +
          isNull(data[i].TEL) +
          "')>" +
          "<img style='cursor: pointer;' title='编辑' src='" +
          basePath +
          "/images/index/bj_07.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
          '<a href="javascript:;" onclick="del(\'' +
          isNull(data[i].ID) +
          '\')">' +
          "<img style='cursor: pointer;' title='删除' src='" +
          basePath +
          "/images/index/sc_13.png'></a></td>" +
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

//初始化单位信息
function initWorkplace() {
  $('#workplace').empty()
  let html = "<option value=''>全部</option>"
  const param = {}
  param.ispro = '0'
  jQuery.getJSON(basePath + '/jyys/lygk/getWorkplaceInfo', param, function (data) {
    if (data != null) {
      const dataList = data.list
      if (dataList.length > 0) {
        for (let i = 0; i < dataList.length; i++) {
          html +=
            "<option value='" + dataList[i].WORKPLACE + "'>" + dataList[i].WORKPLACE + '</option>'
        }
      }
    }
    $('#workplace').html(html)

    search(1)
  })
}

//删除信息
function del(id) {
  const msg = '您真的确定要删除该信息吗？\n\n请确认！'
  const pasrse = {}

  pasrse.id = id
  if (confirm(msg) == true) {
    $.ajax({
      url: basePath + 'jyys/lygk/deleteTxl',
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

//新增信息
function newAdd() {
  layer.open({
    type: 2,
    title: '通讯录添加',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '350px'],
    content: basePath + '/pages/jyys_new/lygk/txl/dialog/add.jsp'
  })
}

//编辑信息
function update(id) {
  layer.open({
    type: 2,
    title: '通讯录修改',
    shadeClose: true,
    shade: 0.8,
    area: ['750px', '350px'],
    content: basePath + '/pages/jyys_new/lygk/txl/dialog/update.jsp?id=' + id,
    end: function () {
      search(1)
    }
  })
}

function dlexcel() {
  param.nm = $('#nm').val()
  param.workplace = $('#workplace').val()
  param.ispro = '0'

  $.ajax({
    type: 'POST',
    url: basePath + 'jyys/lygk/getTxlExcelInfo',
    //contentType: 'application/json',
    async: true,
    data: param,
    success: function (data) {
      debugger
      const results = data
      const titles = 'NO,NM,WORKPLACE,JOB,TEL,FAX,MOB,ADDR'
      const titles_zh = '序号,姓名,单位,职务,办公电话,传真,手机号码,通讯地址'

      const json = {
        titles: titles,
        titles_zh: titles_zh,
        results: JSON.stringify(results),
        excelname: '通讯录'
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
