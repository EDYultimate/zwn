const param = {}
let newsnum = 3

$(function () {
  $('#textarea').val(
    '1. 本月节水新闻发布数量：1条。\n' + '2. 重点监控用水单位超计划水量单位：0个。\n'
  )

  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 80 - 250 - 60
  $('#topDiv').css('height', tbHeight + 'px')
  /* $("#middleDiv").css("height",tbHeight+"px");
    $("#bottomDiv").css("height",tbHeight+"px");*/
  newsnum = Math.floor(tbHeight / 30) //向下取整数部分
  search()

  imgSlideFunction()
})

function search() {
  init('4', '#tzgg') //通知公告
}

//初始展示最新5条新闻
function init(jsType, bodyId) {
  param.jsType = jsType
  param.jsTitle = $('#jsTitle').val()
  param.newsnum = newsnum //新闻条数
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

//轮播图
function imgSlideFunction() {
  /*  $(id).empty();
    $.each(obj, function(i, item){//遍历内容数据进行展示
        var getLi=$("<li></li>");
        var picDiv=$("<div class='pic'></div>");//
        var getImg=$("<img>");//生成子内容div
        getImg.attr("src",item.img);
        getImg.appendTo(picDiv);
        picDiv.appendTo(getLi);
        var titleDiv=$("<div class='title' ></div>");//生成子内容div
        titleDiv.html(item.context);//加载文字内容
        titleDiv.appendTo(getLi);
        getLi.appendTo($(id));
        picDiv.viewer();
    });*/
  /*    jQuery(".picScroll-left").slide({
        mainCell:".bd ul",
        autoPlay:true,
        effect:left,
        vis:3,
        interTime:50
    });*/

  jQuery('.picScroll-left').slide({
    mainCell: '.bd ul',
    autoPlay: true,
    effect: 'leftMarquee',
    vis: 3,
    interTime: 50
  })
}

//

function getMore(id) {
  layer.open({
    type: 2,
    title: '通知公告',
    shadeClose: true,
    shade: 0.8,
    area: ['1000px', '600px'],
    content: basePath + '/pages/jyys_new/sy/tzgg/tzgg.jsp?id=' + id,
    end: function () {
      search(1)
    }
  })
}
