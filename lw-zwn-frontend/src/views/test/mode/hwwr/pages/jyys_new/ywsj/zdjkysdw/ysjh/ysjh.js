let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  /* var tbHeight = bodyheight-120-$(".titleDiv").height()-10-200;
     $(".bbTable").css("height",tbHeight+"px");*/

  const date = new Date()
  const year = date.getFullYear()
  $('#yr').val(year)
  /*$("#cyear1").text(year);*/
  search()
})

//页面初始化
function search() {
  let tbodyStr = ''

  /*if(CurrentPage==""||CurrentPage==null){CurrentPage=1;}*/

  const yr = $('#yr').val()
  if (yr == null || yr == '') {
    alert('查询年份不能为空')
    return
  }
  param.yr = yr
  param.ad_cd = $('#ad_cd').val()
  param.levels = $('#levels').val()
  param.industry = $('#industry').val()
  param.nowTime = Math.random() //考虑ie浏览器刷新

  const index = layer.load()
  jQuery.getJSON(basePath + 'jyys/ywsj/getYsdwYsjhtjInfo', param, function (result) {
    const data = result
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr>' + "<td title='" + isNull(data[i].YR) + "' >" + isNull(data[i].YR) + '</td>'

        if (isNull(data[i].LEVELS) == '小计' || isNull(data[i].LEVELS) == '合计') {
          tbodyStr +=
            "<td   colspan='3'  title='" +
            isNull(data[i].AD_NM) +
            isNull(data[i].LEVELS) +
            "'>" +
            isNull(data[i].AD_NM) +
            isNull(data[i].LEVELS) +
            '</td>'
        } else {
          tbodyStr +=
            "<td title='" +
            isNull(data[i].AD_NM) +
            "'>" +
            isNull(data[i].AD_NM) +
            '</td>' +
            "<td title='" +
            isNull(data[i].LEVELS) +
            "'>" +
            isNull(data[i].LEVELS) +
            '</td>' +
            "<td title='" +
            isNull(data[i].INDUSTRY) +
            "' >" +
            isNull(data[i].INDUSTRY) +
            '</td>'
        }
        tbodyStr +=
          "<td title='" + isNull(data[i].TOTAL) + "'>" + isNull(data[i].TOTAL) + '</td>' + '</tr>'
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

//用水计划管理
function ysjhgl() {
  layer.open({
    type: 2,
    title: '用水计划管理',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['100%', '100%'],
    content: basePath + 'pages/jyys_new/ywsj/zdjkysdw/ysjh/ysjhgl/ysjhgl.jsp'
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

/*
//编辑信息
function update(id,yr){
    debugger;
    layer.open({
        type: 2,
        title: '修改',
        shadeClose: true,
        shade: 0.8,
        area: ['700px', '300px'],
        content: basePath + 'pages/jyys_new/ywsj/zdjkysdw/mlgl/dialog_update.jsp?id='+id+'&yr='+yr,
        end:function(){
            search(yr);
        }
    });
}*/

function dlexcel() {
  const yr = $('#yr').val()
  param.yr = yr

  $.ajax({
    type: 'POST',
    url: basePath + 'jyys/ywsj/getYsdwYsjhtjInfo',
    //contentType: 'application/json',
    async: true,
    data: param,
    success: function (data) {
      const results = data
      /*            var titles = 'YR,AD_NM,LEVELS,INDUSTRY,TOTAL,JAN,FEB,MAR,APR,MAY,JUNE,JULY,AUG,SEPT,OCT,NOV,DEC'
            var titles_zh = '年份,行政区,级别,行业,年计划用水量,1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月'*/

      const titles = 'YR,AD_NM,LEVELS,INDUSTRY,TOTAL'
      const titles_zh = '年份,行政区,级别,行业,年计划用水量（万立方米）'
      const json = {
        titles: titles,
        titles_zh: titles_zh,
        results: JSON.stringify(results),
        // "excelname":yr+"年重点监控用水单位名录管理"
        excelname: '重点监控用水单位用水计划统计'
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
