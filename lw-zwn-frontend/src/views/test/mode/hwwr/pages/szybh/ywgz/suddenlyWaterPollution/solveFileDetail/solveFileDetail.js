let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight * 0.75 + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2
  //  $(".bbTable").css("height","500px");

  pageSize = 10

  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }

  param.FILE_TP = $('#FILE_TP').val()
  param.NM = $('#NM').val()

  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  //    jQuery.getJSON(basePath+"szybh/ywgz/getSaveWaterEcologyFlowGisWarnInfo",param,function(result){
  ////       console.log("result:",result);
  //    });
  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterFileDetailInfo', param, function (result) {
    console.log('getSaveWaterFileDetailInfo:', result)

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
          "'>" +
          isNull(data[i].NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].FILE_TP) +
          "'  >" +
          isNull(data[i].FILE_TP) +
          '</td>' +
          "<td title='" +
          isNull(data[i].CREATE_TM) +
          "'  >" +
          isNull(data[i].CREATE_TM) +
          '</td>' +
          "<td style=' width:20%;' >" +
          '<a href="javascript:;" onclick=update(\'' +
          isNull(data[i].ID) +
          "')>" +
          "<img style='cursor: pointer;' title='编辑' src='" +
          basePath +
          "/images/savewater/editbtn.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
          '<a href="javascript:;" onclick=selectFile(\'' +
          isNull(data[i].FILE_ID) +
          "')>" +
          "<img style='cursor: pointer;' title='下载' src='" +
          basePath +
          "/images/index/xz_11.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"

        tbodyStr +=
          '<a href="javascript:;" onclick="del(\'' +
          isNull(data[i].ID) +
          "','" +
          data[i].FILE_ID +
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
    //    	console.log("totalDBNUM:   ",totalDBNUM);

    $('#TableData').empty().append(tbodyStr)
    //        $("#tbody2").empty().append(tbodyStr);
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

//新建
function newAdd() {
  top.layer.open({
    type: 2,
    title: '添加',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '500px'],
    content:
      basePath + 'pages/szybh/ywgz/suddenlyWaterPollution/solveFileDetail/addSolveFileDetail.jsp'
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
    content:
      basePath +
      '/pages/szybh/ywgz/suddenlyWaterPollution/solveFileDetail/editSolveFileDetail.jsp?ID=' +
      id,
    end: function () {
      search(1)
    }
  })
}

function del(id, fileid) {
  const msg = '您真的确定要删除该信息吗？\n\n请确认！'
  const pasrse = {}

  pasrse.id = id
  pasrse.fileid = fileid //文件编码
  if (confirm(msg) == true) {
    $.ajax({
      url: basePath + '/szybh/ywgz/saveWaterFileDetailDel',
      data: pasrse,
      dataType: 'json',
      type: 'GET',
      success: function (data) {
        if (data.success) {
          const param = {}
          param.fileId = fileid
          param.filePath = fileid
          jQuery.getJSON(basePath + '/kfly/nsbd/deleteALLFile.action', param, function (data) {
            const message = data.flag
            if (message.indexOf('true') != -1) {
              alert('删除成功')
            }
          })
        } else {
          alert('删除失败')
        }
        search(1)
      }
    })
  }
}

//打印方法
function printpage() {
  printData('dydiv', 'dytable')
}

$('#waterReport_btn_generate_excel').click(function () {
  if (document.getElementById('TableData').rows.length <= 0) {
    alert('无下载数据')
  } else {
    excel = new ExcelGen({
      src_id: 'dytable',
      show_header: true
    })
    excel.generate()
  }
})
