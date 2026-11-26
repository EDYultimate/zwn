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
  /*    param.pageSize=pageSize;
        param.pageNo=CurrentPage;*/
  param.nowTime = Math.random() //考虑ie浏览器刷新
  const index = layer.load()
  jQuery.getJSON(basePath + 'jyys/ywsj/getTjfxInfo', param, function (result) {
    const data = result
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr>' +
          /*  "<td title='"+isNull(data[i].NO)+"'  style=' width:5%;'>"+isNull(data[i].NO)+"</td>" +  */
          "<td title='" +
          isNullZ(data[i].YR) +
          "'  >" +
          isNullZ(data[i].YR) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].AD_NM) +
          "'>" +
          isNullZ(data[i].AD_NM) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].PL_WW) +
          "'>" +
          isNullZ(data[i].PL_WW) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].REAL_WW) +
          "' >" +
          isNullZ(data[i].REAL_WW) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].IS_EXCEED) +
          "'>" +
          isNullZ(data[i].IS_EXCEED) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].EXCEED_WW) +
          "' >" +
          isNullZ(data[i].EXCEED_WW) +
          '</td>' +
          "<td style=' width:20%;' >" +
          '<a href="javascript:;" onclick=update(\'' +
          isNull(data[i].RPCD) +
          "','" +
          isNull(data[i].AD_CD) +
          "')>" +
          "<img style='cursor: pointer;' title='编辑' src='" +
          basePath +
          "/images/index/bj_07.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
          '<a href="javascript:;" onclick=del(\'' +
          isNull(data[i].RPCD) +
          "','" +
          isNull(data[i].AD_CD) +
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
      url: basePath + 'jyys/ywsj/deleteTjfxInfo',
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
    title: '新增',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['700px', '280px'],
    content: basePath + 'pages/jyys_new/ywsj/jhys/tjfx/addFile.jsp'
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
    title: '修改',
    shadeClose: true,
    shade: 0.8,
    area: ['700px', '280px'],
    content:
      basePath + 'pages/jyys_new/ywsj/jhys/tjfx/dialog_update.jsp?rpcd=' + rpcd + '&ad_cd=' + ad_cd,
    end: function () {
      search(1)
    }
  })
}

function dlexcel() {
  param.yr = $('#yr').val()

  $.ajax({
    type: 'POST',
    url: basePath + 'jyys/ywsj/getTjfxExcelInfo',
    //contentType: 'application/json',
    async: true,
    data: param,
    success: function (data) {
      const results = data
      const titles = 'YR,AD_NM,PL_WW,REAL_WW,IS_EXCEED,EXCEED_WW'
      const titles_zh =
        '年份,行政区,年计划用水量（万立方米）,年实际用水量（万立方米）,是否超计划,超计划水量（万立方米）'

      const json = {
        titles: titles,
        titles_zh: titles_zh,
        results: JSON.stringify(results),
        excelname: '计划用水统计分析'
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
  printData('dydiv', 'table1')
}
