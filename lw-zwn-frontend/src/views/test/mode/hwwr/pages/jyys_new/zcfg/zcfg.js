let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2

  search(1)

  initYwfl()
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''

  const fw = $('#fw').val()

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.cd = fw
  param.filenm = $('#filenm').val()
  //param.type='1';
  param.dept = '节水处'
  param.area_cd = $('#area').val() //业务分类编码
  param.pageSize = pageSize
  param.pageNo = CurrentPage

  param.nowTime = Math.random() //考虑ie浏览器刷新
  const index = layer.load()
  jQuery.getJSON(basePath + 'rcgl/sthx/getFlfgFileInfo', param, function (result) {
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
          isNull(data[i].FILENM) +
          "'  style=' width:35%;cursor:pointer;'   onclick=preview('" +
          data[i].FILEID +
          "','" +
          data[i].FILE_NM +
          "','" +
          data[i].SUFFIX +
          "')>" +
          isNull(data[i].FILENM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].BB_YR) +
          "'  style=' width:15%;'>" +
          isNull(data[i].BB_YR) +
          '</td>' +
          "<td title='" +
          isNull(data[i].DOC_TYPE) +
          "'  style=' width:25%;'>" +
          isNull(data[i].DOC_TYPE) +
          '</td>' +
          /*     "<td title='"+isNull(data[i].AREA)+"'  style=' width:15%;'>"+isNull(data[i].AREA)+"</td>" +*/
          "<td title='" +
          isNull(data[i].SC_USER) +
          "'  style=' width:10%;'>" +
          isNull(data[i].SC_USER) +
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
          '<tr>' +
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
      url: basePath + 'rcgl/sthx/deleteFlfgFileInfo',
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
    title: '政策法规添加',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '300px'],
    content: basePath + '/pages/jyys_new/zcfg/addFile.jsp'
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
    title: '政策法规修改',
    shadeClose: true,
    shade: 0.8,
    area: ['700px', '350px'],
    content: basePath + '/pages/jyys_new/zcfg/dialog_update.jsp?id=' + id,
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

//添加业务分类
/*function addYwfl(){
    layer.open({
        type: 2,
        title: '业务分类',
        shadeClose: false,
        shade: 0.2,
        maxmin: false, //开启最大化最小化按钮
        area: ['600px', '500px'],
        content: basePath+'/pages/jyys_new/ywsj/ywfl/ywfl.jsp'
    });
}*/

//初始化业务分类信息
function initYwfl() {
  $('#area').empty()
  let html = "<option value=''>全部</option>"
  const param = {}
  param.nowTime = Math.random() //考虑ie浏览器刷新
  jQuery.getJSON(basePath + '/jyys/tzwj/getYwflInfo', param, function (data) {
    if (data != null) {
      const dataList = data.list
      if (dataList.length > 0) {
        for (let i = 0; i < dataList.length; i++) {
          html += "<option value='" + dataList[i].AREA_CD + "'>" + dataList[i].AREA + '</option>'
        }
      }
    }
    $('#area').html(html)
    //search(1);
  })
}
