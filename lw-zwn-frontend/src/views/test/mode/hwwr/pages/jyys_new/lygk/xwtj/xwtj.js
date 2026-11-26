let pageSize
const param = {}

let num = 0

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2

  $('#yr').val(new Date().Format('yyyy'))
  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }

  param.yr = $('#yr').val() //年份
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  param.id = ''
  param.nowTime = Math.random() //考虑ie浏览器刷新
  const index = layer.load()

  const currentYM = getCurrentYM()
  // jQuery.getJSON(basePath+"rcgl/sthx/getFlfgFileInfo",param,function(result){
  jQuery.getJSON(basePath + 'jyys/lygk/getXwtjInfo', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        if (currentYM == data[i].JS_DATE.substr(0, 7)) {
          num++
          tbodyStr +=
            "<tr  style='color:blue;'>" +
            "<td title='" +
            isNull(data[i].NO) +
            "'  style=' width:5%;'>" +
            isNull(data[i].NO) +
            '</td>' +
            "<td title='" +
            isNull(data[i].JS_TITLE) +
            "'  style=' width:20%;text-align:left;'>" +
            isNull(data[i].JS_TITLE) +
            '</td>' +
            "<td title='" +
            isNull(data[i].JS_DATE) +
            "'  style=' width:20%;'>" +
            isNull(data[i].JS_DATE) +
            '</td>' +
            "<td title='" +
            isTick(data[i].HWCC) +
            "'  style=' width:10%;'>" +
            isTick(data[i].HWCC) +
            '</td>' +
            "<td title='" +
            isTick(data[i].HHSL) +
            "'  style=' width:10%;'>" +
            isTick(data[i].HHSL) +
            '</td>' +
            "<td title='" +
            isTick(data[i].QGJSB) +
            "'  style=' width:10%;'>" +
            isTick(data[i].QGJSB) +
            '</td>' +
            "<td title='" +
            isTick(data[i].JSHS) +
            "'  style=' width:10%;'>" +
            isTick(data[i].JSHS) +
            '</td>' +
            "<td title='" +
            isTick(data[i].MWR) +
            "'  style=' width:10%;'>" +
            isTick(data[i].MWR) +
            '</td>' +
            '</tr>'
        } else {
          tbodyStr +=
            '<tr>' +
            "<td title='" +
            isNull(data[i].NO) +
            "'  style=' width:5%;'>" +
            isNull(data[i].NO) +
            '</td>' +
            "<td title='" +
            isNull(data[i].JS_TITLE) +
            "'  style=' width:20%;text-align:left;'>" +
            isNull(data[i].JS_TITLE) +
            '</td>' +
            "<td title='" +
            isNull(data[i].JS_DATE) +
            "'  style=' width:20%;'>" +
            isNull(data[i].JS_DATE) +
            '</td>' +
            "<td title='" +
            isTick(data[i].HWCC) +
            "'  style=' width:10%;'>" +
            isTick(data[i].HWCC) +
            '</td>' +
            "<td title='" +
            isTick(data[i].HHSL) +
            "'  style=' width:10%;'>" +
            isTick(data[i].HHSL) +
            '</td>' +
            "<td title='" +
            isTick(data[i].QGJSB) +
            "'  style=' width:10%;'>" +
            isTick(data[i].QGJSB) +
            '</td>' +
            "<td title='" +
            isTick(data[i].JSHS) +
            "'  style=' width:10%;'>" +
            isTick(data[i].JSHS) +
            '</td>' +
            "<td title='" +
            isTick(data[i].MWR) +
            "'  style=' width:10%;'>" +
            isTick(data[i].MWR) +
            '</td>' +
            '</tr>'
        }
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

    if (num < 2) {
      //获取新闻发布数不足提醒
      getNewsWarn()
    }
  })
}

/*//删除信息
function del(id){
    var msg = "您真的确定要删除该信息吗？\n\n请确认！";
    var pasrse={};

    pasrse.id=id;
    if (confirm(msg)==true){
        $.ajax({
            url: basePath+"jyys/lygk/deleteTxl",
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
}

//新增信息
function newAdd(){
    layer.open({
        type: 2,
        title: '新增',
        shadeClose: false,
        shade: 0.2,
        maxmin: false, //开启最大化最小化按钮
        area: ['750px', '350px'],
        content: basePath+'/pages/jyys_new/lygk/txl/dialog/add.jsp'
    });
}


//编辑信息
function update(id){
    layer.open({
        type: 2,
        title: '修改',
        shadeClose: true,
        shade: 0.8,
        area: ['750px', '350px'],
        content: basePath + '/pages/jyys_new/lygk/txl/dialog/update.jsp?id='+id,
        end:function(){
            search(1);
        }
    });
}


function dlexcel() {
    param.nm=$('#nm').val();
    param.workplace=$('#workplace').val();
    param.ispro="0";

    $.ajax ({
        type: "POST",
        url: basePath + 'jyys/lygk/getTxlExcelInfo',
        //contentType: 'application/json',
        async: true,
        data: param,
        success: function (data) {
            debugger;
            var results = data;
            var titles = 'NO,NM,WORKPLACE,JOB,TEL,FAX,MOB,ADDR'
            var titles_zh = '序号,姓名,单位,职务,办公电话,传真,手机号码,通讯地址'

            var json = {
                'titles' : titles,
                'titles_zh' :titles_zh,
                "results": JSON.stringify(results),
                "excelname":"通讯录"
            };
            // 下载表格
            $.fileDownload(basePath + 'commonExcel/download', {
                httpMethod : 'POST',
                data : json,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                successCallback : function(url) {
                    debugger;
                }
            })
        }
    });

}

}*/

//判断是否是需要打勾（新闻被引用）
function isTick(vad) {
  if (vad === 0) {
    return '√'
  }
  return ''
}

//获取新闻发布数不足提醒
function getNewsWarn() {
  layer.open({
    type: 2,
    title: '提醒',
    shadeClose: true,
    shade: 0.2,
    area: ['150px', '150px'],
    //offset:['250px', '0px'],
    offset: 'rb',
    content: basePath + '/pages/jyys_new/lygk/xwtj/dialog/xwfb.jsp?',
    end: function () {}
  })
}
