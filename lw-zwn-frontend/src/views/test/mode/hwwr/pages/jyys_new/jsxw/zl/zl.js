let pageSize
const param = {}
let newsnum = 3

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  // var tbHeight = (bodyheight-80)/3;
  const tbHeight = (bodyheight - 20) / 3
  $('#topDiv').css('height', tbHeight + 'px')
  $('#middleDiv').css('height', tbHeight + 'px')
  $('#bottomDiv').css('height', tbHeight + 'px')
  newsnum = Math.floor(tbHeight / 30) //向下取整数部分
  search()
})

function search() {
  //0节水要闻 1海委动态 2流域动态
  init('0', '#jsyw') //节水要闻
  init('1', '#hwdt') //海委动态
  init('2', '#lydt') //流域动态
}

//初始展示最新5条新闻
function init(jsType, bodyId) {
  param.jsType = jsType
  param.jsTitle = $('#jsTitle').val()
  param.newsnum = newsnum //新闻条数
  param.nowTime = Math.random() //考虑ie浏览器刷新
  jQuery.getJSON(basePath + 'jyys/jsxw/getTopFive', param, function (result) {
    const data = result
    let tbodyStr
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
          isNull(data[i].JS_TITLE) +
          "'  style=' width:80%;text-align:left;'><a href=\"javascript:newsView('" +
          data[i].JS_TITLE +
          "','" +
          data[i].ID +
          '\');">' +
          isNull(data[i].JS_TITLE) +
          '</a></td>' +
          "<td title='" +
          isNull(data[i].JS_DATE) +
          "'  style=' width:15%;'>" +
          isNull(data[i].JS_DATE) +
          '</td>' +
          '</tr>'
      }
      $(bodyId).empty().append(tbodyStr)
    } else {
      $(bodyId).html('未找到相关新闻内容')
    }
  })
}

//tab页签切换
function getMore(bodyId) {
  parent.changeTab(bodyId)
}

/*
//节水要闻
function initJsyw(){
    //0节水要闻 1海委动态 2流域动态
    param.jsType = "0";
    param.jsTitle = $("#jsTitle").val();
    jQuery.getJSON(basePath+"jyys/jsxw/getTopFive",param,function(result){
        var data=result;
        var  tbodyStr;
        if(data!=null && data.length>0){
            for(var i=0;i<data.length;i++){
                tbodyStr += "<tr>" +
                    "<td title='"+isNull(data[i].NO)+"'  style=' width:2%;'>"+isNull(data[i].NO)+"</td>" +
                    "<td title='"+isNull(data[i].JS_TITLE)+"'  style=' width:88%;text-align:left;'><a href=\"javascript:newsView('" +data[i].JS_TITLE+ "','" +data[i].ID+ "');\">"+isNull(data[i].JS_TITLE)+"</a></td>" +
                    "<td title='"+isNull(data[i].JS_DATE)+"'  style=' width:10%;'>"+isNull(data[i].JS_DATE)+"</td>" +
                    "</tr>";
            }
            $("#jsyw").empty().append(tbodyStr);
        }else{
            $("#jsyw").html("未找到相关新闻内容")
        }
    })
}

//海委动态
function initHwdt(){
    param.jsType = "1";
    param.jsTitle = $("#jsTitle").val();
    jQuery.getJSON(basePath+"jyys/jsxw/getTopFive",param,function(result){
        var data=result;
        var  tbodyStr;
        for(var i=0;i<data.length;i++){
            tbodyStr += "<tr>" +
                "<td title='"+isNull(data[i].NO)+"'  style=' width:2%;'>"+isNull(data[i].NO)+"</td>" +
                "<td title='"+isNull(data[i].JS_TITLE)+"'  style=' width:88%;text-align:left;'><a href=\"javascript:newsView('" +data[i].JS_TITLE+ "','" +data[i].ID+ "');\">"+isNull(data[i].JS_TITLE)+"</a></td>" +
                "<td title='"+isNull(data[i].JS_DATE)+"'  style=' width:10%;'>"+isNull(data[i].JS_DATE)+"</td>" +
                "</tr>";
        }
        $("#hwdt").empty().append(tbodyStr);
    })
}

//流域动态
function initLydt(){
    param.jsType = "2";
    param.jsTitle = $("#jsTitle").val();
    jQuery.getJSON(basePath+"jyys/jsxw/getTopFive",param,function(result){
        var data=result;
        var  tbodyStr;
        for(var i=0;i<data.length;i++){
            tbodyStr += "<tr>" +
                "<td title='"+isNull(data[i].NO)+"'  style=' width:2%;'>"+isNull(data[i].NO)+"</td>" +
                "<td title='"+isNull(data[i].JS_TITLE)+"'  style=' width:88%;text-align:left;'><a href=\"javascript:newsView('" +data[i].JS_TITLE+ "','" +data[i].ID+ "');\">"+isNull(data[i].JS_TITLE)+"</a></td>" +
                "<td title='"+isNull(data[i].JS_DATE)+"'  style=' width:10%;'>"+isNull(data[i].JS_DATE)+"</td>" +
                "</tr>";
        }
        $("#lydt").empty().append(tbodyStr);
    })
}*/
