let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2

  /* $("#btm").val(getLastWeekDate());
    $("#etm").val(getCurrentYMD());*/

  $('#yr').val(new Date().Format('yyyy'))

  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''
  /* var btm=$("#btm").val();
    var etm=$("#etm").val();
    if((btm==null||btm=='')&&(etm==null||etm=='' ) )  {
        alert("开始时间和结束时间不能为空");
        return;
    } */

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }

  param.area_cd = $('#area').val()
  param.nm = $('#nm').val() //关键词
  /*param.btm= btm;
    param.etm= etm;*/
  param.tm = $('#yr').val()

  param.pageSize = pageSize
  param.pageNo = CurrentPage
  param.id = ''
  param.nowTime = Math.random() //考虑ie浏览器刷新

  const index = layer.load()

  jQuery.getJSON(basePath + 'jyys/gzdt/getGzdtFileInfo', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr>' +
          "<td title='" +
          isNull(data[i].NO) +
          "'  style=' width:10%;'>" +
          isNull(data[i].NO) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TM) +
          "'  style=' width:10%;'>" +
          isNull(data[i].TM) +
          '</td>' +
          /*    "<td title='"+isNull(data[i].BTM)+"'  style=' width:35%;'>"+isNull(data[i].BTM)+"</td>" +
                        "<td title='"+isNull(data[i].ETM)+"'  style=' width:35%;'>"+isNull(data[i].ETM)+"</td>" +*/
          "<td title='" +
          isNull(data[i].OUTLINE) +
          "'  style=' width:25%;'>" +
          isNull(data[i].OUTLINE) +
          '</td>' +
          "<td style=' width:20%;' >" +
          '<a href="javascript:;" onclick=update(\'' +
          isNull(data[i].ID) +
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
        tbodyStr +=
          '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
      }
    } else {
      for (var i = 0; i < pageSize; i++) {
        tbodyStr +=
          '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
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

//删除信息
function del(id) {
  const msg = '您真的确定要删除该信息吗？\n\n请确认！'
  const pasrse = {}

  pasrse.id = id
  if (confirm(msg) == true) {
    $.ajax({
      url: basePath + 'jyys/gzdt/deleteGzdtFileInfo',
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

//新增信息
function newAdd() {
  layer.open({
    type: 2,
    title: '工作动态添加',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '500px'],
    content: basePath + '/pages/jyys_new/gzdt/dialog/add.jsp'
  })
}

//编辑信息
function update(id) {
  layer.open({
    type: 2,
    title: '工作动态修改',
    shadeClose: true,
    shade: 0.8,
    area: ['750px', '500px'],
    content: basePath + '/pages/jyys_new/gzdt/dialog/update.jsp?id=' + id,
    end: function () {
      search(1)
    }
  })
}

/*
function dlexcel() {
        param.nm=$('#nm').val();
        param.workplace=$('#workplace').val();
        param.ispro="1";

    $.ajax ({
        type: "POST",
        url: basePath + 'jyys/lygk/getTxlExcelInfo',
        //contentType: 'application/json',
        async: true,
        data: param,
        success: function (data) {
            debugger;
            var results = data;
            var titles = 'NO,NM,WORKPLACE,JOB,TEL,MOB,ADDR'
            var titles_zh = '序号,姓名,单位,职务,办公电话,手机号码,通讯地址'

            var json = {
                'titles' : titles,
                'titles_zh' :titles_zh,
                "results": JSON.stringify(results),
                "excelname":"专家库"
            };
            // 下载表格
            $.fileDownload(basePath + 'commonExcel/download', {
                httpMethod : 'POST',
                data : json,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                successCallback : function(url) {
                }
            })
        }
    });

} */
