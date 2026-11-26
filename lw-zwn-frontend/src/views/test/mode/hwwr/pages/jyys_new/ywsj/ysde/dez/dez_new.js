let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  /*    var tbHeight = bodyheight-120-$(".titleDiv").height()-$(".M-box").height()-10;
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
  let table_title = ''

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.nm = $('#nm').val()
  param.ad_cd = $('#ad_cd').val()
  param.hytp = $('#hytp').val()
  param.hynm = $('#hynm').val()
  param.ystp = $('#ystp').val()
  param.nowTime = Math.random() //考虑ie浏览器刷新
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()

  const nm = $('#nm').val() //行业
  if ($('#nm').val() == '工业') {
    table_title =
      "<tr style='height:60px;'>" +
      "<td  style='width:60px;'> 序号</td>" +
      "<td  style='width:60px;'>标准</td>" +
      "<td  style='width:200px;'>行业类别</td>" +
      "<td  style='width:200px;'>行业名称</td>" +
      "<td  style='width:200px;'>产品名称</td>" +
      "<td  style='width:200px;'>工艺路线</td>" +
      "<td  style='width:150px;'>单位</td>" +
      "<td  style='width:80px;'>通用值</td>" +
      "<td  style='width:80px;'>先进值</td>" +
      "<td  style='width:80px;'>生产规模</td>" +
      "<td  style='width:80px;'>调整系数</td>" +
      "<td  style='width:300px;'>备注</td>" +
      "<td  style='width:80px;'>操作</td>" +
      '</tr>'
  } else if ($('#nm').val() == '农业') {
    table_title =
      "<tr style='height:60px;'>" +
      "<td  style='width:60px;'> 序号</td>" +
      "<td  style='width:60px;'>标准</td>" +
      "<td  style='width:200px;'>行业类别</td>" +
      "<td  style='width:200px;'>行业名称</td>" +
      "<td  style='width:200px;'>产品名称</td>" +
      "<td  style='width:150px;'>保证率</td>" +
      "<td  style='width:80px;'>分区</td>" +
      "<td  style='width:150px;'>单位</td>" +
      "<td  style='width:80px;'>通用值</td>" +
      "<td  style='width:80px;'>先进值</td>" +
      "<td  style='width:300px;'>备注</td>" +
      "<td  style='width:80px;'>操作</td>" +
      '</tr>'
  } else if ($('#nm').val() == '生活') {
    table_title =
      "<tr style='height:60px;'>" +
      "<td  style='width:60px;'> 序号</td>" +
      "<td  style='width:60px;'>标准</td>" +
      "<td  style='width:200px;'>行业类别</td>" +
      "<td  style='width:200px;'>行业名称</td>" +
      "<td  style='width:200px;'>产品名称</td>" +
      "<td  style='width:150px;'>单位</td>" +
      "<td  style='width:80px;'>通用值</td>" +
      "<td  style='width:80px;'>先进值</td>" +
      "<td  style='width:300px;'>备注</td>" +
      "<td  style='width:80px;'>操作</td>" +
      '</tr>'
  }

  jQuery.getJSON(basePath + 'jyys/ywsj/getDezFileInfo', param, function (result) {
    const data = result.page.list

    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr>' +
          "<td title='" +
          isNull(data[i].NO) +
          "' >" +
          isNull(data[i].NO) +
          '</td>' +
          /* "<td title='"+isNull(data[i].NM)+"' >"+isNull(data[i].NM)+"</td>" +*/
          /* "<td title='"+isNull(data[i].AD_CD)+"'>"+isNull(data[i].AD_CD)+"</td>" +*/
          "<td title='" +
          isNull(data[i].AD_NM) +
          "'>" +
          isNull(data[i].AD_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].HYTP) +
          "'>" +
          isNull(data[i].HYTP) +
          '</td>' +
          "<td title='" +
          isNull(data[i].HYNM) +
          "' >" +
          isNull(data[i].HYNM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].YSTP) +
          "'>" +
          isNull(data[i].YSTP) +
          '</td>'

        if (nm == '工业') {
          tbodyStr += "<td title='" + isNull(data[i].GYLX) + "'>" + isNull(data[i].GYLX) + '</td>'
        } else if (nm == '农业') {
          tbodyStr +=
            "<td title='" +
            isNull(data[i].BZL) +
            "'>" +
            isNull(data[i].BZL) +
            '</td>' +
            "<td title='" +
            isNull(data[i].FQ) +
            "' >" +
            isNull(data[i].FQ) +
            '</td>'
        }

        tbodyStr +=
          "<td title='" +
          isNull(data[i].UNIT) +
          "'>" +
          isNull(data[i].UNIT) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TYZ) +
          "'>" +
          isNull(data[i].TYZ) +
          '</td>' +
          "<td title='" +
          isNull(data[i].XJZ) +
          "'>" +
          isNull(data[i].XJZ) +
          '</td>'

        if (nm == '工业') {
          tbodyStr +=
            "<td title='" +
            isNull(data[i].SCGM) +
            "'>" +
            isNull(data[i].SCGM) +
            '</td>' +
            "<td title='" +
            isNull(data[i].TZXS) +
            "'>" +
            isNull(data[i].TZXS) +
            '</td>'
        }
        tbodyStr +=
          "<td title='" +
          isNull(data[i].NT) +
          "'>" +
          isNull(data[i].NT) +
          '</td>' +
          "<td style=' width:20%;' >" +
          '<a href="javascript:;" onclick=update(\'' +
          isNull(data[i].ID) +
          "','" +
          isNull(data[i].NM) +
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
        tbodyStr += '<tr>'

        if (nm == '工业') {
          tbodyStr += '<td></td>' + '<td></td>' + '<td></td>'
        } else if (nm == '农业') {
          tbodyStr += '<td></td>' + '<td></td>'
        }

        tbodyStr +=
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
        tbodyStr += '<tr>'
        if (nm == '工业') {
          tbodyStr += '<td></td>' + '<td></td>' + '<td></td>'
        } else if (nm == '农业') {
          tbodyStr += '<td></td>' + '<td></td>'
        }
        tbodyStr +=
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

    $('#STCD_TABLE2').empty().append(table_title).append(tbodyStr)

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
      url: basePath + 'jyys/ywsj/deleteDezFileInfo',
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
    title: '定额值添加',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '500px'],
    // content: basePath+'pages/jyys_new/ywsj/ysde/dez/addFile.jsp'
    content: basePath + 'pages/jyys_new/ywsj/ysde/dez/add/tab.jsp'
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
function update(id, nm) {
  if (nm == '工业') {
    layer.open({
      type: 2,
      title: '工业定额值修改',
      shadeClose: true,
      shade: 0.8,
      area: ['700px', '500px'],
      content: basePath + '/pages/jyys_new/ywsj/ysde/dez/update/update_gy.jsp?id=' + id,
      end: function () {
        search(1)
      }
    })
  } else if (nm == '农业') {
    layer.open({
      type: 2,
      title: '农业定额值修改',
      shadeClose: true,
      shade: 0.8,
      area: ['700px', '500px'],
      content: basePath + '/pages/jyys_new/ywsj/ysde/dez/update/update_ny.jsp?id=' + id,
      end: function () {
        search(1)
      }
    })
  } else if (nm == '生活') {
    layer.open({
      type: 2,
      title: '生活定额值修改',
      shadeClose: true,
      shade: 0.8,
      area: ['700px', '500px'],
      content: basePath + '/pages/jyys_new/ywsj/ysde/dez/update/update_sh.jsp?id=' + id,
      end: function () {
        search(1)
      }
    })
  }
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
