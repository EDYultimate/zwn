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
  param.pro_stage = $('#pro_stage').val()
  param.project_nm = $('#project_nm').val()
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + '/szybh/sjzl/project/getProjectList', param, function (result) {
    const dataAll = result.page.list
    console.info(dataAll)
    const data = dataAll[0].data
    const totalList = dataAll[0].totalList

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
          isNull(data[i].PROJECT_NM) +
          "'  >" +
          isNull(data[i].PROJECT_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TM) +
          "'  >" +
          isNull(data[i].TM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].PRO_LEVEL1) +
          "'  >" +
          isNull(data[i].PRO_LEVEL1) +
          '</td>' +
          "<td title='" +
          isNull(data[i].PRO_LEVEL2) +
          "'  >" +
          isNull(data[i].PRO_LEVEL2) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WT_TP) +
          "'  >" +
          isNull(data[i].WT_TP) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WT_CASHNUM) +
          "'  >" +
          isNull(data[i].WT_CASHNUM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].PRO_UNIT) +
          "'  >" +
          isNull(data[i].PRO_UNIT) +
          '</td>' +
          "<td title='" +
          xmjdFormat(data[i].PRO_STAGE) +
          "'  >" +
          xmjdFormat(data[i].PRO_STAGE) +
          '</td>' +
          "<td title='" +
          isNull(data[i].SCALETOTAL) +
          "%'  >" +
          isNull(data[i].SCALETOTAL) +
          '%</td>' +
          "<td title='" +
          isNull(data[i].CASHTOTAL) +
          "'  >" +
          isNull(data[i].CASHTOTAL) +
          '</td>' +
          "<td title='" +
          ywtpFormat(data[i].YW_TP) +
          "'  >" +
          ywtpFormat(data[i].YW_TP) +
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
          "/images/savewater/delbtn.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
          '<a href="javascript:;" onclick=selectFile(\'' +
          isNull(data[i].FILEID) +
          "')>" +
          "<img style='cursor: pointer;' title='下载' src='" +
          basePath +
          "/images/index/xz_11.png'></a></td>"
        ;('</tr>')
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
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '</tr>'
      }
    }
    $('#totalnum').text(isNull(totalList[0].TOTALNUM))
    $('#level1num').text(isNull(totalList[0].LEVEL1))
    $('#level2num').text(isNull(totalList[0].LEVEL2))
    $('#totalcash').text(isNull(totalList[0].CASH))

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
      url: basePath + '/szybh/sjzl/project/delProjectInfo',
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
    area: ['1000px', '500px'],
    content: basePath + '/pages/szybh/sjzl/projectManage/projectAdd.jsp'
  })
}

//编辑信息
function update(id) {
  layer.open({
    type: 2,
    title: '修改',
    shadeClose: true,
    shade: 0.2,
    area: ['1000px', '500px'],
    content: basePath + '/pages/szybh/sjzl/projectManage/projectEdit.jsp?id=' + id,
    end: function () {
      search(1)
    }
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
//项目阶段
function xmjdFormat(val) {
  if (val == '1') {
    return '立项申报'
  } else if (val == '2') {
    return '招投标'
  } else if (val == '3') {
    return '实施'
  } else if (val == '4') {
    return '已验收'
  }

  return '-'
}
