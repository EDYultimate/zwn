const param = {}
let tztgnum = 3

// 存放图片地址
//var picturePathHeader="http://localhost:8083/hwwr/picserver/";
//var picturePathHeader="http://localhost:8082/hwwrUpload/";
const picturePathHeader = 'http://10.3.250.90:8082/hwwrUpload/'

const saveImg = [
  { IMG: basePath + 'pages/jyys_new/sy/images/01.png', CONTEXT: '图1' },
  { IMG: basePath + 'pages/jyys_new/sy/images/02.png', CONTEXT: '图2' },
  { IMG: basePath + 'pages/jyys_new/sy/images/03.png', CONTEXT: '图3' },
  { IMG: basePath + 'pages/jyys_new/sy/images/04.png', CONTEXT: '图4' },
  { IMG: basePath + 'pages/jyys_new/sy/images/05.png', CONTEXT: '图5' }
]

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  /*var tbHeight = (bodyheight-80-250-60);*/
  /*$("#topDiv").css("height",tbHeight+"px");*/
  /* $("#middleDiv").css("height",tbHeight+"px");
    $("#bottomDiv").css("height",tbHeight+"px");*/
  tztgnum = Math.floor(215 / 30) //向下取整数部分

  // imgSlideFunction(saveImg);

  getSyImages() //动态获取首页图片

  search()
})

function search() {
  init('4', '#tzgg') //通知公告

  initNewsNum() //节水新闻数据条数
  initYsdwNum() //监控用水单位个数
}

//初始展示最新5条新闻
function init(jsType, bodyId) {
  param.jsType = jsType
  param.jsTitle = $('#jsTitle').val()
  param.newsnum = tztgnum //通知公告条数
  param.nowTime = Math.random() //考虑ie浏览器刷新
  jQuery.getJSON(basePath + 'jyys/jsxw/getTopFive', param, function (result) {
    console.log(result)
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
          "'  style=' width:75%;text-align:left;'><a href=\"javascript:newsView('" +
          data[i].JS_TITLE +
          "','" +
          data[i].ID +
          '\');">' +
          isNull(data[i].JS_TITLE) +
          '</a></td>' +
          "<td title='" +
          isNull(data[i].JS_DATE) +
          "'  style=' width:30%;'>" +
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

//获取首页的图片
function getSyImages() {
  param.nowTime = Math.random() //考虑ie浏览器刷新
  jQuery.getJSON(basePath + 'jyys/zlk/getSyImages', param, function (result) {
    console.log(result)
    //        debugger;
    const data = result

    //var data= [{CONTEXT: "图片", IMG: "/opt/lonwin_web/uploadFile/8956159771901759395\\file2011271606456647174.png"},
    //     {CONTEXT: "图片2", IMG: "/opt/lonwin_web/uploadFile/3838538743046678222\\file2011301606700929636.png"}];

    if (data != null && data.length > 0) {
      imgSlideFunction(data)
    } else {
      //imgSlideFunction(saveImg);
    }
  })
}

//轮播图
function imgSlideFunction(obj) {
  $('#picList').empty()

  $.each(obj, function (i, item) {
    //遍历内容数据进行展示
    const getLi = $("<li  class='picli'></li>")
    const picDiv = $("<div class='pic'></div>") //
    const getImg = $('<img>') //生成子内容div
    getImg.attr('src', picturePathHeader + item.IMG)
    getImg.appendTo(picDiv)
    picDiv.appendTo(getLi)
    const titleDiv = $("<div class='pictitle' ></div>") //生成子内容div
    titleDiv.html(item.CONTEXT) //加载文字内容
    titleDiv.appendTo(getLi)
    getLi.appendTo($('#picList'))
    picDiv.viewer()
  })

  jQuery('.picScroll-left').slide({
    mainCell: '.bd ul',
    autoPlay: true,
    effect: 'leftMarquee',
    vis: 5,
    interTime: 50
  })
}

//轮播图
/*function imgSlideFunction(obj){
    $("#picList").empty();

    $.each(obj, function(i, item){//遍历内容数据进行展示
        var getLi=$("<li></li>");
        var picDiv=$("<div class='pic'></div>");//
        var getImg=$("<img>");//生成子内容div
        getImg.attr("src",item.IMG);
        getImg.appendTo(picDiv);
        picDiv.appendTo(getLi);
        var titleDiv=$("<div class='pictitle' ></div>");//生成子内容div
        titleDiv.html(item.CONTEXT);//加载文字内容
        titleDiv.appendTo(getLi);
        getLi.appendTo($("#picList"));
        picDiv.viewer();
    });


    jQuery(".picScroll-left").slide({
        mainCell:".bd ul",
        autoPlay:true,
        effect:"leftMarquee",
        vis:5,
        interTime:50
    });
}*/

//获取更多
function getMore(id) {
  layer.open({
    type: 2,
    title: '通知公告',
    shadeClose: true,
    shade: 0.8,
    area: ['950px', '550px'],
    content: basePath + '/pages/jyys_new/sy/tzgg/tzgg.jsp?id=' + id,
    end: function () {
      search(1)
    }
  })
}

//跳转节水新闻统计链接
function turnToXwtj() {
  parent.turnToXwtj()
}

//跳转用水情况中取用水监控数据
function turnToQysjksj() {
  parent.turnToQysjksj()
}

//节水新闻数据条数
function initNewsNum() {
  const mon = new Date().Format('yyyy-MM')
  param.mon = mon
  jQuery.getJSON(basePath + 'jyys/lygk/getNewsNum', param, function (result) {
    const data = result
    $('#newsnum').text(data)
    if (data < 2) {
      $('#newsnum').css('color', 'red')
    }
  })
}

//超计划水量重点监控用水单位个数
function initYsdwNum() {
  const yr = new Date().Format('yyyy')
  param.yr = yr
  jQuery.getJSON(basePath + 'jyys/ywsj/getYsdwNum', param, function (result) {
    const data = result
    $('#ysdwnum').text(data)
    if (data > 0) {
      $('#ysdwnum').css('color', 'red')
    }
  })
}
