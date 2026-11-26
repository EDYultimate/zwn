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

  param.ky = $('#ky').val()
  param.tp = '3' //政策文件
  param.tm = $('#tm').val()
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + '/szybh/sjzl/flfg/getLawList', param, function (result) {
    const data = result.page.list
    let strArr = ''
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        const nm = data[i].FILE_NM
        if (nm != '' && nm != undefined) {
          strArr = nm.split('.')
        }

        const no = (CurrentPage - 1) * pageSize + (i + 1)
        tbodyStr +=
          '<tr>' +
          "<td title='" +
          no +
          "'  style=' width:10%;'>" +
          no +
          '</td>' +
          "<td title='" +
          isNull(data[i].NM) +
          "'  style=' width:35%;'>" +
          isNull(data[i].NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TM) +
          "'  style=' width:25%;'>" +
          isNull(data[i].TM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].DEPT) +
          "'  style=' width:10%;'>" +
          isNull(data[i].DEPT) +
          '</td>' +
          "<td title='" +
          isNull(data[i].UP_PERSON) +
          "'  style=' width:10%;'>" +
          isNull(data[i].UP_PERSON) +
          '</td>' +
          "<td style=' width:20%;' >" +
          '<a href="javascript:;" onclick=update(\'' +
          isNull(data[i].ID) +
          "','" +
          isNull(data[i].TM) +
          "')>" +
          "<img style='cursor: pointer;' title='编辑' src='" +
          basePath +
          "/images/savewater/editbtn.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
          '<a href="javascript:;" onclick=selectFile(\'' +
          isNull(data[i].FILEID) +
          "')>" +
          "<img style='cursor: pointer;' title='下载' src='" +
          basePath +
          "/images/index/xz_11.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"

        if (strArr[strArr.length - 1] == 'pdf') {
          tbodyStr +=
            '<a href="javascript:;" onclick=preview(\'' +
            data[i].FILEID +
            "','" +
            data[i].FILE_NM +
            "','" +
            data[i].SUFFIX +
            "')>" +
            "<img style='cursor: pointer;' title='预览' src='" +
            basePath +
            "/images/index/yl_14.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        }

        tbodyStr +=
          '<a href="javascript:;" onclick="del(\'' +
          isNull(data[i].ID) +
          "','" +
          data[i].FILEID +
          "','" +
          data[i].FILE_NM +
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
          /*    "<td></td>" +
                    "<td></td>" +*/
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
          /*    "<td></td>" +
                    "<td></td>" +*/
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

function del(id, fileid, filenm) {
  const msg = '您真的确定要删除该信息吗？\n\n请确认！'
  const pasrse = {}

  pasrse.id = id
  pasrse.fileid = fileid //文件编码
  pasrse.filenm = filenm //文件编码
  if (confirm(msg) == true) {
    $.ajax({
      url: basePath + '/szybh/sjzl/flfg/delLawInfo',
      data: pasrse,
      dataType: 'json',
      type: 'GET',
      success: function (data) {
        if (data.success) {
          alert('删除成功')
        } else {
          alert('删除失败')
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
    content: basePath + '/pages/szybh/sjzl/law_file/zcwj/zcwjAdd.jsp'
  })
}

function selectFile(id) {
  layer.open({
    type: 2,
    title: '文件',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '300px'],
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
    content: basePath + '/pages/szybh/sjzl/law_file/zcwj/zcwjEdit.jsp?id=' + id,
    end: function () {
      search(1)
    }
  })
}

//预览pdf
function preview(fileid, filenm, suffix) {
  //debugger;
  if (suffix.indexOf('f') > 0 && countString(suffix, 'f') == 1) {
    //只有一个PDF 直接预览
    if (filenm.indexOf(',')) {
      const filenmArr = filenm.split(',')
      for (let i = 0; i < filenmArr.length; i++) {
        if (filenmArr[i].indexOf('.pdf') > 0) {
          //viewYl( fileid,filenm+".pdf",'/kfly/nsbd/tempName');
          viewYl(fileid, filenmArr[i], '/kfly/nsbd/tempName')
        }
      }
    } else {
      selectFile(fileid)
    }
  } else {
    //多个pdf弹出下载框
    selectFile(fileid)
  }
}
//判断某个字符在字符串出现的次数
function countString(str, s) {
  let count = 0
  for (let i = 0; i <= str.length; i++) {
    if (str.indexOf(s) == i) {
      str = str.substring(i + 1, str.length)
      count++
    }
  }
  return count
}
