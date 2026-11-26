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

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }

  param.area = $('#area').val() //业务分类
  param.pageSize = pageSize
  param.pageNo = CurrentPage

  param.tp = '1'

  param.nowTime = Math.random() //考虑ie浏览器刷新
  const index = layer.load()
  jQuery.getJSON(basePath + 'jyys/tzwj/getYwflFileInfo', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      console.info(data)
      for (var i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr>' +
          "<td title='" +
          isNull(data[i].NO) +
          "'  style=' width:5%;'>" +
          isNull(data[i].NO) +
          '</td>' +
          "<td title='" +
          isNull(data[i].AREA) +
          "'  style=' width:35%;'>" +
          isNull(data[i].AREA) +
          '</td>' +
          "<td style=' width:20%;' >" +
          '<a href="javascript:;" onclick=update(\'' +
          isNull(data[i].ID) +
          "','" +
          isNull(data[i].YR) +
          "')>" +
          "<img style='cursor: pointer;' title='编辑' src='" +
          basePath +
          "/images/index/bj_07.png'></a></td>" +
          /*   "<a href=\"javascript:;\" onclick=update('"+isNull(data[i].ID)+"','"+isNull(data[i].YR)+"')>" +
                    "<img style='cursor: pointer;' title='编辑' src='"+basePath+"/images/index/bj_07.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                    "<a href=\"javascript:;\" onclick=\"del('"+isNull(data[i].ID)+"')\">" +
                    "<img style='cursor: pointer;' title='删除' src='"+basePath+"/images/index/sc_13.png'></a></td>" +*/
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

function del(id) {
  const msg = '您真的确定要删除该信息吗？\n\n请确认！'
  const pasrse = {}

  pasrse.id = id
  if (confirm(msg) == true) {
    $.ajax({
      url: basePath + 'jyys/tzwj/deleteYwflFileInfo',
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
    title: '业务分类添加',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['400px', '200px'],
    content: basePath + '/pages/jyys_new/ywsj/ywfl/addFile.jsp'
  })
}

//编辑信息
function update(id) {
  layer.open({
    type: 2,
    title: '业务分类修改',
    shadeClose: true,
    shade: 0.8,
    area: ['400px', '200px'],
    content: basePath + '/pages/jyys_new/ywsj/ywfl/dialog_update.jsp?id=' + id,
    end: function () {
      search(1)
    }
  })
}
