let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  /* var tbHeight = bodyheight-120-$(".titleDiv").height()-10-200;
    $(".bbTable").css("height",tbHeight+"px");*/

  const date = new Date()
  const year = date.getFullYear()
  $('#yr').val(year)

  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.yr = $('#yr').val()

  param.nowTime = Math.random() //考虑ie浏览器刷新
  /*    param.pageSize=pageSize;
    param.pageNo=CurrentPage;*/
  const index = layer.load()
  jQuery.getJSON(basePath + 'jyys/ywsj/getHztjInfo', param, function (result) {
    const data = result
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr>' +
          /*  "<td title='"+isNullZ(data[i].NO)+"'  style=' width:5%;'>"+isNullZ(data[i].NO)+"</td>" +*/
          "<td title='" +
          isNullZ(data[i].YR) +
          "'  >" +
          isNullZ(data[i].YR) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].AD_NM) +
          "'  >" +
          isNullZ(data[i].AD_NM) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].TFYP) +
          "'  >" +
          isNullZ(data[i].TFYP) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].YPC) +
          "'  >" +
          isNullZ(data[i].YPC) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].YRC) +
          "'>" +
          isNullZ(data[i].YRC) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].TOL_NUM) +
          "'>" +
          isNullZ(data[i].TOL_NUM) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].TOL_RATE) +
          "'>" +
          isNullZ(data[i].TOL_RATE) +
          '</td>' +
          '<td>' +
          '<a href="javascript:;" onclick=update(\'' +
          isNullZ(data[i].RPCD) +
          "','" +
          isNullZ(data[i].AD_CD) +
          "')>" +
          "<img style='cursor: pointer;' title='编辑' src='" +
          basePath +
          "/images/index/bj_07.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
          '<a href="javascript:;" onclick=del(\'' +
          isNullZ(data[i].RPCD) +
          "','" +
          isNullZ(data[i].AD_CD) +
          "')>" +
          "<img style='cursor: pointer;' title='删除' src='" +
          basePath +
          "/images/index/sc_13.png'></a></td>" +
          '</tr>'
      }
    }
    $('#tbody').empty().append(tbodyStr)
    /*    $('.M-box').pagination({
            pageCount: result.page.pages, //初始化时总页数3页
            current:CurrentPage,
            callback:function(api){
                search(api.getCurrent());
            }
        });
        $(".tolSpan").html("共"+result.page.total+"条");
        $('.M-box').show();*/
    makecharts(result)
    layer.close(index)
  })
}

function del(rpcd, ad_cd) {
  const msg = '您真的确定要删除该信息吗？\n\n请确认！'
  const pasrse = {}

  pasrse.rpcd = rpcd
  pasrse.ad_cd = ad_cd
  if (confirm(msg) == true) {
    $.ajax({
      url: basePath + 'jyys/ywsj/deleteHztjInfo',
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
    title: '汇总统计添加',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '300px'],
    content: basePath + 'pages/jyys_new/ywsj/xydb/hztj/addFile.jsp'
  })
}

/*function selectFile(id){
    layer.open({
        type: 2,
        title: '文件',
        shadeClose: false,
        shade: 0.2,
        maxmin: false, //开启最大化最小化按钮
        area: ['750px', '500px'],
        content: basePath+'/pages/jyys/ysFile/download.jsp?id='+id
    });
}*/

//编辑信息
function update(rpcd, ad_cd) {
  layer.open({
    type: 2,
    title: '汇总统计修改',
    shadeClose: true,
    shade: 0.8,
    area: ['700px', '300px'],
    content:
      basePath + 'pages/jyys_new/ywsj/xydb/hztj/dialog_update.jsp?rpcd=' + rpcd + '&ad_cd=' + ad_cd,
    end: function () {
      search(1)
    }
  })
}

function dlexcel() {
  param.yr = $('#yr').val()

  $.ajax({
    type: 'POST',
    url: basePath + 'jyys/ywsj/getHztjExcelInfo',
    //contentType: 'application/json',
    async: true,
    data: param,
    success: function (data) {
      const results = data
      const titles = 'YR,AD_NM,TFYP,YPC,YRC,TOL_NUM,TOL_RATE'
      const titles_zh =
        '年份,行政区,总计划数,当年计划数,当年实际完成数,截止目前累计完成数,累计完成比例'

      const json = {
        titles: titles,
        titles_zh: titles_zh,
        results: JSON.stringify(results),
        excelname: '县域达标汇总统计'
      }
      // 下载表格
      $.fileDownload(basePath + 'commonExcel/download', {
        httpMethod: 'POST',
        data: json,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        successCallback: function (url) {
          debugger
        }
      })
    }
  })
}

//打印方法
function printpage() {
  const table = document.getElementById('table1')
  const trs = table.rows
  for (let i = 0, len = trs.length; i < len; i++) {
    if (i == 0) {
      var cell = trs[i].cells[5]
      cell.style.display = 'none'
    } else if (i == 1) {
    } else {
      var cell = trs[i].cells[7]
      cell.style.display = 'none'
    }
  }

  const headstr = '<html><head><title></title></head><body>'
  const footstr = '</body>'
  const printData = document.getElementById('dydiv').innerHTML
  const oldstr = document.body.innerHTML
  document.body.innerHTML = headstr + printData + footstr
  window.print()
  document.body.innerHTML = oldstr
  window.location.reload()
  return false
}
