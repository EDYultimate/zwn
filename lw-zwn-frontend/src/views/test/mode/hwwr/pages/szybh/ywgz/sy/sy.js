const param = {}
const param2 = {}
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
  echartsBeiJing()
  echartsTianJin()
  echartsHeBei()

  echartsGovArea()

  const date = new Date()
  let mon = date.getMonth() + 1
  if (mon.toString().length == 1) {
    mon = '0' + mon
  }
  $('#time').val(date.getFullYear() + '' + mon)

  //	$("#time").val(date.getFullYear());
  changeDate()
})

function changeDate() {
  param.date = $dp.$('time').value
  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterSYAbove', param, function (data) {
    console.log('data', data)
    if (data != null && data.length > 0) {
      $('#mon_context').html(data[0].CONTEXT)
    } else {
      $('#mon_context').html('无数据！')
    }
    //    	$('mon_context').text("111");
  })
}

function echartsBeiJing() {
  option = {
    color: ['#0AC8B6', '#E8E8E8'],
    legend: {
      icon: 'rect', //  字段控制形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow，none

      itemWidth: 10, // 设置宽度

      itemHeight: 10, // 设置高度
      orient: 'vertical',
      x: 'right',
      y: 'bottom',
      textStyle: {
        //图例文字的样式
        color: '#050505',
        fontSize: 9,
        fontWeight: 'bold'
      },
      show: false
    },
    series: [
      {
        name: '半径模式',
        type: 'pie',
        radius: ['40%', '60%'],
        center: ['45%', '45%'],
        //		            roseType: 'radius',

        itemStyle: {
          borderRadius: 5
        },
        label: {
          normal: {
            show: true,
            position: 'center',
            formatter: function () {
              return '90%'
            },
            textStyle: {
              fontSize: 20,
              color: '#7F7F7F'
            }
          }
        },
        data: [
          { value: 40, name: '河道' },
          { value: 33, name: '水库' }
        ]
        //		            data:waterTypeMap
      }
    ]
  }

  const myChartWaterLevel = echarts.init(document.getElementById('beiJing'))
  //	var myChartWaterLevel2 = echarts.init(document.getElementById('tianJin'));
  //	var myChartWaterLevel3 = echarts.init(document.getElementById('heBei'));

  myChartWaterLevel.setOption(option)
  //	myChartWaterLevel2.setOption(option);
  //	myChartWaterLevel3.setOption(option);
}

function echartsTianJin() {
  option = {
    color: ['#0AC8B6', '#E8E8E8'],
    legend: {
      icon: 'rect', //  字段控制形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow，none

      itemWidth: 10, // 设置宽度

      itemHeight: 10, // 设置高度
      orient: 'vertical',
      x: 'right',
      y: 'bottom',
      textStyle: {
        //图例文字的样式
        color: '#050505',
        fontSize: 9,
        fontWeight: 'bold'
      },
      show: false
    },
    series: [
      {
        name: '半径模式',
        type: 'pie',
        radius: ['40%', '60%'],
        center: ['45%', '45%'],
        //		            roseType: 'radius',

        itemStyle: {
          borderRadius: 5
        },
        label: {
          normal: {
            show: true,
            position: 'center',
            formatter: function () {
              return '75%'
            },
            textStyle: {
              fontSize: 20,
              color: '#7F7F7F'
            }
          }
        },
        data: [
          { value: 40, name: '河道' },
          { value: 33, name: '水库' }
        ]
        //		            data:waterTypeMap
      }
    ]
  }

  //	var myChartWaterLevel = echarts.init(document.getElementById('beiJing'));
  const myChartWaterLevel2 = echarts.init(document.getElementById('tianJin'))
  //	var myChartWaterLevel3 = echarts.init(document.getElementById('heBei'));

  //	myChartWaterLevel.setOption(option);
  myChartWaterLevel2.setOption(option)
  //	myChartWaterLevel3.setOption(option);
}

function echartsHeBei() {
  option = {
    color: ['#0AC8B6', '#E8E8E8'],
    legend: {
      icon: 'rect', //  字段控制形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow，none

      itemWidth: 10, // 设置宽度

      itemHeight: 10, // 设置高度
      orient: 'vertical',
      x: 'right',
      y: 'bottom',
      textStyle: {
        //图例文字的样式
        color: '#050505',
        fontSize: 9,
        fontWeight: 'bold'
      },
      show: false
    },
    series: [
      {
        name: '半径模式',
        type: 'pie',
        radius: ['40%', '60%'],
        center: ['45%', '45%'],
        //		            roseType: 'radius',

        itemStyle: {
          borderRadius: 5
        },
        label: {
          normal: {
            show: true,
            position: 'center',
            formatter: function () {
              return '95%'
            },
            textStyle: {
              fontSize: 20,
              color: '#7F7F7F'
            }
          }
        },
        data: [
          { value: 40, name: '河道' },
          { value: 33, name: '水库' }
        ]
        //		            data:waterTypeMap
      }
    ]
  }

  //	var myChartWaterLevel = echarts.init(document.getElementById('beiJing'));
  //	var myChartWaterLevel2 = echarts.init(document.getElementById('tianJin'));
  const myChartWaterLevel3 = echarts.init(document.getElementById('heBei'))

  //	myChartWaterLevel.setOption(option);
  //	myChartWaterLevel2.setOption(option);
  myChartWaterLevel3.setOption(option)
}

function echartsGovArea() {
  option = {
    color: ['#039BDF', '#00BAF5', '#00D6E7', '#EEBF54', '#9AD653', '#FA0E0E'],
    legend: {
      icon: 'rect', //  字段控制形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow，none

      itemWidth: 10, // 设置宽度

      itemHeight: 10, // 设置高度
      orient: 'vertical',
      x: 'right',
      y: 'bottom',
      textStyle: {
        //图例文字的样式
        color: '#050505',
        fontSize: 9,
        fontWeight: 'bold'
      }
    },
    series: [
      {
        name: '半径模式',
        type: 'pie',
        radius: ['30%', '60%'],
        center: ['45%', '45%'],

        //		            roseType: 'radius',
        itemStyle: {
          borderRadius: 5
        },
        label: {
          show: false
        },
        data: [
          { value: 28, name: '引黄' },
          { value: 22, name: '引滦' },
          { value: 25, name: '再生水' },
          { value: 30, name: '上游水库' },
          { value: 40, name: '南水北调东线' },
          { value: 33, name: '南水北调中线' }
        ]
        //		            data:govAreaMap
      }
    ]
  }

  const myChartWaterLevel = echarts.init(document.getElementById('govAreaDiv'))
  myChartWaterLevel.setOption(option)
}

function search() {
  //    init("6","#slb_news"); //水利部通知
  init('d', '#slb_news') //水利部通知

  init2('a', '#hw_news', 'http://www.hwcc.gov.cn/wwgj/n') //海委动态-海委要闻

  initNewsNum() //节水新闻数据条数
  initYsdwNum() //监控用水单位个数

  const date = new Date()
  param.year = date.getFullYear()
  let tbodyStr = ''
  let totalWDB = 0
  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterGovAreaCheckStat', param, function (data) {
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        tbodyStr +=
          "<tr style='border-bottom: 1px #F3F3F3 solid;'>" +
          "<td title='" +
          isNull(data[i].PUBLIC_ORG) +
          "'  >" +
          isNull(data[i].PUBLIC_ORG) +
          '</td>' +
          "<td title='" +
          isNull(data[i].LAKENUM) +
          "'  >" +
          isNull(data[i].LAKENUM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].SECTIONNUM) +
          "'  >" +
          isNull(data[i].SECTIONNUM) +
          '</td>'

        if (data[i].SUM != 0) {
          tbodyStr +=
            "<td style='color: red;' title='" +
            isNull(data[i].SUM) +
            "'>" +
            isNull(data[i].SUM) +
            '</td>'
          totalWDB += data[i].SUM
        } else {
          tbodyStr += "<td title='" + isNull(data[i].SUM) + "'  >" + isNull(data[i].SUM) + '</td>'
        }
        tbodyStr += '</tr>'
      }
    } else {
      for (var i = 0; i < 5; i++) {
        tbodyStr += '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
      }
    }
    $('#TableData').empty().append(tbodyStr)
    $('#totalWDB').html(totalWDB)
  })
}

//初始展示最新5条新闻
function init(jsType, bodyId) {
  param.jsType = jsType
  param.jsTitle = $('#jsTitle').val()
  param.newsnum = tztgnum //通知公告条数
  param.nowTime = Math.random() //考虑ie浏览器刷新

  jQuery.getJSON(basePath + 'szybh/ywgz/getTopFive', param, function (result) {
    //        console.log(result);
    const data = result
    let tbodyStr
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr>' +
          "<td  style=' width:1%;'><img  style='vertical-align: middle;' src='images/savewater/sy_circle_title.png'></td>" +
          "<td title='" +
          isNull(data[i].JS_TITLE) +
          "'  style=' width:75%;text-align:left;'><a href=\"javascript:newsView('" +
          data[i].JS_TITLE +
          "','" +
          data[i].ID +
          "');\"><span style='color: #535353;font-size:16px;font-family: Microsoft YaHei;'>" +
          isNull(data[i].JS_TITLE) +
          '</span></a></td>' +
          //                  "<td title='"+isNull(data[i].JS_TITLE)+"'  style=' width:75%;text-align:left;'><a href=\"javascript:newsView('" +data[i].JS_TITLE+ "','" +data[i].ID+ "');\">"+isNull(data[i].JS_TITLE)+"	</a></td>" +
          //                  "<td  ><a href=\"javascript:newsView('" +data[i].JS_TITLE+ "','" +data[i].ID+ "');\">"+isNull(data[i].JS_TITLE)+"	</a></td>" +

          "<td title='" +
          isNull(data[i].JS_DATE) +
          "'  style=' width:30%;'><span style='color: #c5c5c5;font-size:14px;font-family: Microsoft YaHei;'>" +
          isNull(data[i].JS_DATE) +
          '</span></td>' +
          '</tr>'
      }
      $(bodyId).empty().append(tbodyStr)
    } else {
      $(bodyId).html('未找到相关新闻内容')
    }
  })
}

//初始展示最新5条新闻
function init2(jsType, bodyId, source_url) {
  param2.jsType = jsType
  param2.jsTitle = $('#jsTitle').val()
  param2.newsnum = tztgnum //通知公告条数
  param2.nowTime = Math.random() //考虑ie浏览器刷新

  param2.source_url = 'http://www.hwcc.gov.cn/wwgj/n' //用于区分海委要闻和水利纵览，此处只获取海委要闻

  jQuery.getJSON(basePath + 'szybh/ywgz/getTopFive', param2, function (result) {
    //        console.log(result);
    const data = result
    let tbodyStr
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr>' +
          "<td  style=' width:1%;'><img  style='vertical-align: middle;' src='images/savewater/sy_circle_title.png'></td>" +
          "<td title='" +
          isNull(data[i].JS_TITLE) +
          "'  style=' width:75%;text-align:left;'><a href=\"javascript:newsView('" +
          data[i].JS_TITLE +
          "','" +
          data[i].ID +
          "');\"><span style='color: #535353;font-size:16px;font-family: Microsoft YaHei;'>" +
          isNull(data[i].JS_TITLE) +
          '</span></a></td>' +
          //                  "<td title='"+isNull(data[i].JS_TITLE)+"'  style=' width:75%;text-align:left;'><a href=\"javascript:newsView('" +data[i].JS_TITLE+ "','" +data[i].ID+ "');\">"+isNull(data[i].JS_TITLE)+"	</a></td>" +
          //                  "<td  ><a href=\"javascript:newsView('" +data[i].JS_TITLE+ "','" +data[i].ID+ "');\">"+isNull(data[i].JS_TITLE)+"	</a></td>" +

          "<td title='" +
          isNull(data[i].JS_DATE) +
          "'  style=' width:30%;'><span style='color: #c5c5c5;font-size:14px;font-family: Microsoft YaHei;'>" +
          isNull(data[i].JS_DATE) +
          '</span></td>' +
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
    const data = result

    //var data= [{CONTEXT: "图片", IMG: "/opt/lonwin_web/uploadFile/8956159771901759395\\file2011271606456647174.png"},
    //  {CONTEXT: "图片2", IMG: "/opt/lonwin_web/uploadFile/3838538743046678222\\file2011301606700929636.png"}];

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
      console.log('aa')
      search()
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

//打开更多页面
function morePage(val) {
  const url = 'pages/szybh/ywgz/sy/moreNew.jsp?tp=' + val
  parent.changeIframe(url)
}

function morePage2(val, source_url) {
  const url = 'pages/szybh/ywgz/sy/moreNew.jsp?tp=' + val + '&source_url=' + source_url
  parent.changeIframe(url)
}
