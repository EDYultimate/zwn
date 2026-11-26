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

  const fw = $('#fw').val()

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }

  param.NM = $('#expertnm').val()
  param.unittype = $('#unittype').val()
  //    param.units=$("#units").val();

  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()

  jQuery.getJSON(basePath + 'szybh/lygk/getSaveWaterAddressBookInfo', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
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
          isNull(data[i].NM) +
          "'  >" +
          isNull(data[i].NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].PERSON_UNIT) +
          "'  >" +
          isNull(data[i].PERSON_UNIT) +
          '</td>' +
          "<td title='" +
          isNull(data[i].PERSON_DEPT) +
          "'  >" +
          isNull(data[i].PERSON_DEPT) +
          '</td>' +
          "<td title='" +
          isNull(data[i].JOB) +
          "'  >" +
          isNull(data[i].JOB) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TEL_NUM) +
          "'  >" +
          isNull(data[i].TEL_NUM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].FAX_NUM) +
          "'  >" +
          isNull(data[i].FAX_NUM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].MOB_NUM) +
          "'  >" +
          isNull(data[i].MOB_NUM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ADDRESS) +
          "'  >" +
          isNull(data[i].ADDRESS) +
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
          isNull(data[i].NM) +
          '\')">' +
          "<img style='cursor: pointer;' title='删除' src='" +
          basePath +
          "/images/savewater/delbtn.png'></a></td>" +
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

//新建
function newAdd() {
  layer.open({
    type: 2,
    title: '添加',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '500px'],
    content: basePath + 'pages/szybh/lygk/addressBook/addAddressBook.jsp'
  })
}

//编辑信息
function update(id) {
  layer.open({
    type: 2,
    title: '修改',
    shadeClose: true,
    shade: 0.2,
    area: ['700px', '500px'],
    content: basePath + '/pages/szybh/lygk/addressBook/editAddressBook.jsp?id=' + id,
    end: function () {
      search(1)
    }
  })
}

//删除通讯录
function del(id, nm, fileid) {
  const msg = '您真的确定要删除' + nm + '信息吗？\n\n请确认！'
  const pasrse = {}

  pasrse.id = id
  pasrse.fileid = fileid //文件编码
  if (confirm(msg) == true) {
    const index_load = layer.load()
    $.ajax({
      url: basePath + 'szybh/lygk/delSaveWaterAddressBookInfo',
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
