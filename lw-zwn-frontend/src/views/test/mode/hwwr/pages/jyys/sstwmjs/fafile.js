let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2

  const date = new Date()
  const year = date.getFullYear()
  $('#btm').val(year - 1)
  $('#etm').val(year)
  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''
  $('#tmSpan').text('')
  $('#tmSpan').text($('#btm').val() + '至' + $('#etm').val())
  const fw = $('#fw').val()
  const bdat = $('#btm').val()
  const edat = $('#etm').val()
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.cd = fw
  param.bdat = bdat
  param.edat = edat
  param.type = '1'
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + '/kfly/nsbd/getJyysFileInfo', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      console.info(data)
      for (var i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr>' +
          "<td title='" +
          isNull(data[i].XLNM) +
          "'>" +
          isNull(data[i].XLNM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].YR) +
          "'>" +
          isNull(data[i].YR) +
          '</td>' +
          "<td title='" +
          isNull(data[i].URL) +
          "'>" +
          '<a href="javascript:;" onclick=update(\'' +
          isNull(data[i].CD) +
          "','" +
          isNull(data[i].YR) +
          "')>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
          '<a href="javascript:;" onclick=selectFile(\'' +
          isNull(data[i].URL) +
          "')>查看</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
          '<a href="javascript:;" onclick="del(\'' +
          isNull(data[i].CD) +
          "','" +
          isNull(data[i].YR) +
          '\')">删除</a></td>' +
          '</tr>'
      }
      for (let x = data.length; x < pageSize; x++) {
        tbodyStr += '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
      }
    } else {
      for (var i = 0; i < pageSize; i++) {
        tbodyStr += '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
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

function del(cd, yr) {
  const msg = '您真的确定要删除该信息吗？\n\n请确认！'
  const pasrse = {}

  pasrse.yr = yr
  pasrse.cd = cd
  if (confirm(msg) == true) {
    $.ajax({
      url: basePath + '/kfly/nsbd/deleteJyysFileInfo',
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
    title: '上传',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '300px'],
    content: basePath + '/pages/jyys/sstwmjs/addFile.jsp'
  })
}

function xiazai(filename) {
  const param = { filename: filename }
  location.href = '' + basePath + '/kfly/nsbd/downloadfile?filename=' + filename + ''
}

function selectFile(id) {
  layer.open({
    type: 2,
    title: '文件',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '500px'],
    content: basePath + '/pages/jyys/sstwmjs/download.jsp?id=' + id
  })
}

//编辑信息
function update(cd, yr, type) {
  layer.open({
    type: 2,
    title: '修改',
    shadeClose: true,
    shade: 0.8,
    area: ['700px', '500px'],
    content: basePath + '/pages/jyys/sstwmjs/dialog_update.jsp?cd=' + cd + '&yr=' + yr,
    end: function () {
      search(1)
    }
  })
}
