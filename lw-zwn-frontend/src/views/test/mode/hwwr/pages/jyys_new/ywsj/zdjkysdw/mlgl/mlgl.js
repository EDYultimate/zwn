let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  /* var tbHeight = bodyheight-120-$(".titleDiv").height()-10-200;
     $(".bbTable").css("height",tbHeight+"px");*/

  const date = new Date()
  const year = date.getFullYear()
  /*$("#yr").val(year);*/
  $('#yr').text(year)

  search(year)
})

//上一版
function up() {
  let yr = $('#yr').text()
  yr = eval(yr) - 1
  $('#yr').text(yr)

  search(yr)
}

//下一版
function down() {
  let yr = $('#yr').text()
  yr = eval(yr) + 1
  $('#yr').text(yr)

  search(yr)
}

//页面初始化
function search(yr) {
  let tbodyStr = ''
  var yr

  /*if(CurrentPage==""||CurrentPage==null){CurrentPage=1;}*/
  if (yr == '' || yr == null) {
    yr = $('#yr').text()
  } else {
    yr = yr
  }
  debugger
  // param.yr= $("#yr").val();
  param.yr = yr
  param.ad_cd = $('#ad_cd').val()
  param.levels = $('#levels').val()
  param.industry = $('#industry').val()
  /*    param.pageSize=pageSize;
        param.pageNo=CurrentPage;*/
  param.nowTime = Math.random() //考虑ie浏览器刷新
  const index = layer.load()
  jQuery.getJSON(basePath + 'jyys/ywsj/getMlglExcelInfo', param, function (result) {
    const data = result
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr>' +
          "<td title='" +
          isNull(data[i].NO) +
          "'  style=' width:5%;'>" +
          isNull(data[i].NO) +
          '</td>' +
          "<td title='" +
          isNull(data[i].AD_NM) +
          "'  >" +
          isNull(data[i].AD_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].LEVELS) +
          "'  >" +
          isNull(data[i].LEVELS) +
          '</td>' +
          "<td title='" +
          isNull(data[i].INDUSTRY) +
          "'  >" +
          isNull(data[i].INDUSTRY) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ORG) +
          "'>" +
          isNull(data[i].ORG) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ORG_CD) +
          "'>" +
          isNull(data[i].ORG_CD) +
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
          '<a href="javascript:;" onclick="del(\'' +
          isNull(data[i].ID) +
          "','" +
          isNull(data[i].YR) +
          '\')">' +
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
    layer.close(index)
  })
}

function del(id, yr) {
  const msg = '您真的确定要删除该信息吗？\n\n请确认！'
  const pasrse = {}

  pasrse.id = id
  if (confirm(msg) == true) {
    $.ajax({
      url: basePath + 'jyys/ywsj/deleteMlglFileInfo',
      data: pasrse,
      dataType: 'json',
      type: 'post',
      success: function (data) {
        if (data != null && data.STATUS == 'Y') {
          alert('删除成功！')
        } else {
          alert('删除失败！')
        }
        search(yr)
      }
    })
  }
}

function newAdd() {
  const yr = $('#yr').text()
  debugger
  layer.open({
    type: 2,
    title: '名录添加',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '300px'],
    content: basePath + 'pages/jyys_new/ywsj/zdjkysdw/mlgl/addFile.jsp?yr=' + yr
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
function update(id, yr) {
  layer.open({
    type: 2,
    title: '名录修改',
    shadeClose: true,
    shade: 0.8,
    area: ['700px', '300px'],
    content:
      basePath + 'pages/jyys_new/ywsj/zdjkysdw/mlgl/dialog_update.jsp?id=' + id + '&yr=' + yr,
    end: function () {
      search(yr)
    }
  })
}

function dlexcel() {
  const yr = $('#yr').text()
  param.yr = yr

  $.ajax({
    type: 'POST',
    url: basePath + 'jyys/ywsj/getMlglExcelInfo',
    //contentType: 'application/json',
    async: true,
    data: param,
    success: function (data) {
      const results = data
      const titles = 'NO,AD_NM,LEVELS,INDUSTRY,ORG,ORG_CD'
      const titles_zh = '序号,行政区,级别,行业,单位名称,统一社会信用代码'

      const json = {
        titles: titles,
        titles_zh: titles_zh,
        results: JSON.stringify(results),
        excelname: yr + '年重点监控用水单位名录管理'
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
