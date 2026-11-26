let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2

  /*var date = new Date();
    var year = date.getFullYear();
    $("#yr").val(year);*/
  $('#yr').val('2019')
  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  /* param.nm= $("#nm").val();*/
  param.ishwcc = $('#ishwcc').val()
  param.yr = $('#yr').val()
  param.batch = $('#batch').val()

  param.pageSize = pageSize
  param.pageNo = CurrentPage

  param.nowTime = Math.random() //考虑ie浏览器刷新
  const index = layer.load()
  jQuery.getJSON(basePath + 'jyys/ywsj/getDbmlInfo', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr>' +
          /*   "<td title='"+isNull(data[i].NO)+"' >"+isNull(data[i].NO)+"</td>" +*/

          /* "<td title='"+isNull(data[i].AD_CD)+"'>"+isNull(data[i].AD_CD)+"</td>" +*/
          "<td title='" +
          isNull(data[i].AD_NM) +
          "'>" +
          isNull(data[i].AD_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].BATCH) +
          "'>" +
          isNull(data[i].BATCH) +
          '</td>' +
          "<td title='" +
          isNull(data[i].YR) +
          "'>" +
          isNull(data[i].YR) +
          '</td>' +
          "<td style='text-align: left' title='" +
          isNull(data[i].DISTRICT) +
          "' >" +
          isNull(data[i].DISTRICT) +
          '</td>' +
          '</tr>'
      }
      for (let x = data.length; x < pageSize; x++) {
        tbodyStr += '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
      }
    } else {
      for (var i = 0; i < pageSize; i++) {
        tbodyStr += '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
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

/*
function del(id){
    var msg = "您真的确定要删除该信息吗？\n\n请确认！";
    var pasrse={};

    pasrse.id=id;
    if (confirm(msg)==true){
        $.ajax({
            url: basePath+"jyys/ywsj/deleteDezFileInfo",
            data: pasrse,
            dataType : "json",
            type: 'post',
            success: function(data) {
                if(data!=null && data.STATUS=="Y"){
                    alert("删除成功！");
                }else{
                    alert("删除失败！");
                }
                search(1);
            }
        });
    }
} */

function newAdd() {
  layer.open({
    type: 2,
    title: '达标名录添加',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '450px'],
    content: basePath + 'pages/jyys_new/ywsj/xydb/dbml/addFile.jsp'
  })
}

/*
function selectFile(id){
    layer.open({
        type: 2,
        title: '文件',
        shadeClose: false,
        shade: 0.2,
        maxmin: false, //开启最大化最小化按钮
        area: ['750px', '500px'],
        content: basePath+'/pages/jyys/ysFile/download.jsp?id='+id
    });
}


//编辑信息
function update(id,){
    layer.open({
        type: 2,
        title: '修改',
        shadeClose: true,
        shade: 0.8,
        area: ['700px', '450px'],
        content: basePath + '/pages/jyys_new/ywsj/ysde/dez/dialog_update.jsp?id='+id,
        end:function(){
            search(1);
        }
    });
}
*/

//预览pdf
/*
function   preview(fileid,filenm,suffix){
    //debugger;
    if(suffix.indexOf('f')>0&&countString(suffix,'f')==1){//只有一个PDF 直接预览
        if(filenm.indexOf(',')){
            var filenmArr = filenm.split(",");
            for(var i=0;i<filenmArr.length;i++){
                if(filenmArr[i].indexOf('.pdf')>0){
                    //viewYl( fileid,filenm+".pdf",'/kfly/nsbd/tempName');
                    viewYl( fileid,filenmArr[i],'/kfly/nsbd/tempName');
                }
            }
        }else{
            selectFile(fileid);
        }

    }else{  //多个pdf弹出下载框
        selectFile(fileid);
    }
}
//判断某个字符在字符串出现的次数
function  countString(str, s) {
    var count = 0;
    for(var  i= 0; i<=str.length; i++){
        if(str.indexOf(s) == i){
            str = str.substring(i+1,str.length);
            count++;
        }
    }
    return count;
}
*/

function dlexcel() {
  param.ishwcc = $('#ishwcc').val()
  param.yr = $('#yr').val()

  $.ajax({
    type: 'POST',
    url: basePath + 'jyys/ywsj/getDbmlExcelInfo',
    //contentType: 'application/json',
    async: true,
    data: param,
    success: function (data) {
      const results = data
      const titles = 'AD_NM,BATCH,YR,DISTRICT'
      const titles_zh = '行政区,批次,年份,达标县（区）'

      const json = {
        titles: titles,
        titles_zh: titles_zh,
        results: JSON.stringify(results),
        excelname: '达标名录'
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
  printData1('dydiv')
}
