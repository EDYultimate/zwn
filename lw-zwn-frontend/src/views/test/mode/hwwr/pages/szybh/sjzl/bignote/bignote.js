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
  param.ywtp = $('#ywtp').val()
  param.tm = $('#tm').val()
  param.info = $('#info').val()
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + '/szybh/sjzl/bignote/getNoteList', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      console.info(data)

      for (var i = 0; i < data.length; i++) {
        const no = (CurrentPage - 1) * pageSize + (i + 1)
        tbodyStr +=
          '<tr>' +
          "<td title='" +
          no +
          "'>" +
          no +
          '</td>' +
          "<td title='" +
          isNull(data[i].TM) +
          "'  >" +
          isNull(data[i].TM) +
          '</td>' +
          "<td title='" +
          ywtpFormat(data[i].YWTP) +
          "'  >" +
          ywtpFormat(data[i].YWTP) +
          '</td>' +
          "<td title='" +
          isNull(data[i].INFO) +
          "'  >" +
          isNull(data[i].INFO) +
          '</td>' +
          "<td style=' width:20%;' >" +
          '<a href="javascript:;" onclick=update(\'' +
          isNull(data[i].ID) +
          "')>" +
          "<img style='cursor: pointer;' title='编辑' src='" +
          basePath +
          "/images/savewater/editbtn.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
          '<a href="javascript:;" onclick="del(\'' +
          isNull(data[i].ID) +
          "','" +
          isNull(data[i].EXP_NM) +
          '\')">' +
          "<img style='cursor: pointer;' title='删除' src='" +
          basePath +
          "/images/savewater/delbtn.png'></a></td>" +
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

//删除专家
function del(id, nm, fileid) {
  const msg = '您真的确定要删除该条信息吗？\n\n请确认！'
  const pasrse = {}

  pasrse.id = id

  if (confirm(msg) == true) {
    const index_load = layer.load()
    $.ajax({
      url: basePath + '/szybh/sjzl/bignote/delNoteInfo',
      data: pasrse,
      dataType: 'json',
      type: 'GET',
      success: function (data) {
        if (!data) {
          alert(data.message)
          return
        }
        //关闭遮罩层
        layer.close(index_load)
        search(1)
      }
    })
  }
}
//新建
function newAdd() {
  layer.open({
    type: 2,
    title: '添加',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['550px', '300px'],
    content: basePath + 'pages/szybh/sjzl/bignote/bignoteAdd.jsp'
  })
}

//编辑信息
function update(id) {
  layer.open({
    type: 2,
    title: '修改',
    shadeClose: true,
    shade: 0.2,
    area: ['550px', '300px'],
    content: basePath + '/pages/szybh/sjzl/bignote/bignoteEdit.jsp?id=' + id,
    end: function () {
      search(1)
    }
  })
}

//业务类型
function ywtpFormat(val) {
  if (val == '1') {
    return '生态流量'
  } else if (val == '2') {
    return '地下水超采'
  } else if (val == '3') {
    return '饮用水源保护'
  }

  return '-'
}
