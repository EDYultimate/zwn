let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2

  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''

  const yr = $('#yr').val()

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.yr = yr
  param.filenm = $('#filenm').val()
  param.type = '1'
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + 'rcgl/sthx/getGlzdFileInfo', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      console.info(data)
      for (var i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr>' +
          "<td title='" +
          isNull(data[i].NO) +
          "'>" +
          isNull(data[i].NO) +
          '</td>' +
          "<td title='" +
          isNull(data[i].FILENM) +
          "'>" +
          isNull(data[i].FILENM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].YR) +
          "'>" +
          isNull(data[i].YR) +
          '</td>' +
          "<td title='" +
          isNull(data[i].SC_TM) +
          "'>" +
          isNull(data[i].SC_TM) +
          '</td>' +
          '<td>' +
          /*   "<a href=\"javascript:;\" onclick=update('"+isNull(data[i].ID)+"','"+isNull(data[i].YR)+"')>" +
                    "<img style='cursor: pointer;' title='编辑' src='"+basePath+"/images/index/bj_07.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                    "<a href=\"javascript:;\" onclick=selectFile('"+isNull(data[i].FILEID)+"')>" +
                    "<img style='cursor: pointer;' title='下载' src='"+basePath+"/images/index/xz_11.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                    "<a href=\"javascript:;\" onclick=\"del('"+isNull(data[i].ID)+"')\">" +
                    "<img style='cursor: pointer;' title='删除' src='"+basePath+"/images/index/sc_13.png'></a></td>" +*/

          '<a href="javascript:;" onclick=update(\'' +
          isNull(data[i].ID) +
          "','" +
          isNull(data[i].YR) +
          "')>" +
          "<img style='cursor: pointer;' title='编辑' src='" +
          basePath +
          "/images/index/bj_07.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
          '<a href="javascript:;" onclick=selectFile(\'' +
          isNull(data[i].FILEID) +
          "')>" +
          "<img style='cursor: pointer;' title='下载' src='" +
          basePath +
          "/images/index/xz_11.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
          /*"<a href=\"javascript:;\" onclick=viewYl('"+data[i].FILEID+"','"+ data[i].FILE_NM+".pdf"+"','/kfly/nsbd/tempName')>" +*/
          '<a href="javascript:;" onclick=preview(\'' +
          data[i].FILEID +
          "','" +
          data[i].FILE_NM +
          "','" +
          data[i].SUFFIX +
          "')>" +
          "<img style='cursor: pointer;' title='预览' src='" +
          basePath +
          "/images/index/yl_14.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
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
          '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
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

function del(id) {
  const msg = '您真的确定要删除该信息吗？\n\n请确认！'
  const pasrse = {}

  pasrse.id = id
  if (confirm(msg) == true) {
    $.ajax({
      url: basePath + 'rcgl/sthx/deleteGlzdFileInfo',
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
    content: basePath + '/pages/rcgl/sthx/glzdkh/addFile.jsp'
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
    area: ['700px', '500px'],
    content: basePath + '/pages/rcgl/sthx/glzdkh/dialog_update.jsp?id=' + id,
    end: function () {
      search(1)
    }
  })
}
