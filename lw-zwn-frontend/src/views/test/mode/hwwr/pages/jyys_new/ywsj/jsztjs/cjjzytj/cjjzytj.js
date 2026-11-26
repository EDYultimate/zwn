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
  jQuery.getJSON(basePath + 'jyys/ywsj/getCjjzytjInfo', param, function (result) {
    const data = result
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr>' +
          /*  "<td title='"+isNull(data[i].NO)+"'  style=' width:5%;'>"+isNull(data[i].NO)+"</td>" +
                    "<td title='"+isNull(data[i].YR)+"'  >"+isNull(data[i].YR)+"</td>" + */
          "<td title='" +
          isNullZ(data[i].AD_NM) +
          "'>" +
          isNullZ(data[i].AD_NM) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].SCIA_A) +
          "'>" +
          isNullZ(data[i].SCIA_A) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].SCIA_T) +
          "' >" +
          isNullZ(data[i].SCIA_T) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].SCEP_A) +
          "'>" +
          isNullZ(data[i].SCEP_A) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].SCEP_T) +
          "'>" +
          isNullZ(data[i].SCEP_T) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].SCOF_A) +
          "'>" +
          isNullZ(data[i].SCOF_A) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].SCOF_T) +
          "'>" +
          isNullZ(data[i].SCOF_T) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].SCSL_A) +
          "'>" +
          isNullZ(data[i].SCSL_A) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].SCSL_T) +
          "'>" +
          isNullZ(data[i].SCSL_T) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].SCOT_A) +
          "'>" +
          isNullZ(data[i].SCOT_A) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].SCOT_T) +
          "'>" +
          isNullZ(data[i].SCOT_T) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].SCORG_A) +
          "'>" +
          isNullZ(data[i].SCORG_A) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].SCORG_T) +
          "'>" +
          isNullZ(data[i].SCORG_T) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].SCLE_A) +
          "'>" +
          isNullZ(data[i].SCLE_A) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].SCLE_T) +
          "'>" +
          isNullZ(data[i].SCLE_T) +
          '</td>' +
          '<td>' +
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
      url: basePath + 'jyys/ywsj/deleteCjjzytjInfo',
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
    area: ['750px', '380px'],
    content: basePath + 'pages/jyys_new/ywsj/jsztjs/cjjzytj/addFile.jsp'
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
    area: ['700px', '380px'],
    content:
      basePath +
      'pages/jyys_new/ywsj/jsztjs/cjjzytj/dialog_update.jsp?rpcd=' +
      rpcd +
      '&ad_cd=' +
      ad_cd,
    end: function () {
      search(1)
    }
  })
}

function dlexcel() {
  param.yr = $('#yr').val()

  $.ajax({
    type: 'POST',
    url: basePath + 'jyys/ywsj/getCjjzytjExcelInfo',
    //contentType: 'application/json',
    async: true,
    data: param,
    success: function (data) {
      const results = data
      const titles =
        'AD_NM,SCIA_A,SCIA_T,SCEP_A,SCEP_T,SCOF_A,SCOF_T,SCSL_A,SCSL_T,SCOT_A,SCOT_T,SCORG_A,SCORG_T,SCLE_A,SCLE_T'
      const titles_zh =
        '行政区,节水型灌区新增数,节水型灌区累计数,企业新增数,企业累计数,机关新增数,机关累计数,学校新增数,学校累计数,其他新增数,其他累计数,节水型单位合计新增数,节水型社会合计累计数,节水型居民小区新增数,节水型居民小区累计数'

      const json = {
        titles: titles,
        titles_zh: titles_zh,
        results: JSON.stringify(results),
        excelname: '创建进展与统计'
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
      var cell = trs[i].cells[4]
      cell.style.display = 'none'
    } else if (i == 1 || i == 2) {
    } else {
      var cell = trs[i].cells[15]
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
