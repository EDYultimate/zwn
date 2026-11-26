let pageSize
const param = {}
const colors = ['#9ad4d4', '#35abab', '#5cf7cd', '#bbbaff']
//$(function(){
//	var hh = document.body.clientHeight;
//	var height = hh-$(".searchDiv").height()-70;
//	$(".conent").css("height",height);
//	var tbHeight = $(".conent").height()-$(".M-box").height();
//	$(".tableDiv").css("height",tbHeight);
//
//	$("#btm").val(getLastYM());
//	$("#etm").val(new Date().Format("yyyy-MM"));
//	search(1);
//});
$(function () {
  const ww = document.body.clientWidth

  //	var hh = document.body.clientHeight;
  //	var height = hh-$(".searchDiv").height()-20;
  //	$(".conent").css("height",height);
  //	var tbHeight = $(".conent").height()-$(".M-box").height()-20;
  //	$(".tableDiv").css("height",tbHeight);

  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.tableDiv').css('height', tbHeight + 'px')

  //计算echarts图的个数，每个图限定宽度为550，取整数
  //	var echartNum=parseInt((ww-100)/550);

  //两行得出每页显示图的个数
  //	pageSize=echartNum*2;

  const echartWW = parseInt((ww - 100) / 3)
  //初始化echarts个数
  let echartsHtml = ''

  //自适应每行显示三张echarts图
  pageSize = 3 * 2

  for (let i = 0; i < pageSize; i++) {
    //自适应每行显示三张echarts图
    echartsHtml +=
      '<div id="echarts' +
      (i + 1) +
      '" style="float: left; width: ' +
      echartWW +
      'px; height:45%;margin:5px; border: 1px solid rgb(204, 204, 204);  border-collapse: collapse; background-color: rgba(0, 0, 0, 0);"></div>'
    //		echartsHtml+="<div id=\"echarts"+(i+1)+"\" style=\"float: left; width:550px; height:44%;margin:5px; border: 1px solid rgb(204, 204, 204);  border-collapse: collapse; background-color: rgba(0, 0, 0, 0);\"></div>";
  }
  $('#tableDiv').append(echartsHtml)
  $('#btm').val(getLastYM())
  $('#etm').val(new Date().Format('yyyy-MM'))
  search(1)
})
//页面初始化
function search(CurrentPage) {
  const tbodyStr = ''
  const qshnm = $('#nm').val()
  const bdat = $('#btm').val()
  const edat = $('#etm').val()
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.nm = qshnm
  param.bdat = bdat
  param.edat = edat
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + '/lyzg/sgnq/getZgSgnqEcharts', param, function (result) {
    if (result.listData.length > 0) {
      const list = result.listData
      for (var i = 0; i < list.length; i++) {
        const data = list[i]
        var titlenm = ''
        var x = []
        var wqg = []
        const WFZ_WQT = []
        titlenm = data[0].wfznm
        for (let j = 0; j < data.length; j++) {
          x[j] = data[j].tm
          wqg[j] = isNull(data[j].wqg)
          WFZ_WQT[j] = isNull(data[j].wqt)
        }
        iniecharts(i, x, wqg, WFZ_WQT, titlenm)
      }
      //最后数据不足6条 字段隐藏其余的echarts的div
      if (list.length < pageSize) {
        for (var i = pageSize - 1; i >= list.length; i--) {
          var titlenm = ''
          var x = []
          var wqg = []
          x[0] = ''
          wqg[0] = ''

          $('#echarts' + (i + 1)).hide()
        }
      }
    } else {
      for (var i = 0; i < 6; i++) {
        var titlenm = ''
        var x = []
        var wqg = []
        x[0] = ''
        wqg[0] = ''

        iniecharts(i, x, wqg, titlenm)
      }
    }

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
function iniecharts(i, x, wqg, WFZ_WQT, titlenm) {
  $('#echarts' + (i + 1)).show()
  const echartsA = echarts.init(document.getElementById('echarts' + (i + 1)))
  const option = {
    title: {
      text: titlenm + '水质评价趋势图',
      textStyle: {
        //文字大小
        fontSize: 14
      }
    },
    tooltip: {},
    legend: {
      data: ['水质类别', '目标水质类别'],
      left: 'right',
      top: 15
    },
    grid: {
      x: 45,
      y: 45,
      x2: 30,
      y2: 30
    },
    xAxis: {
      data: x
    },
    yAxis: {
      axisLabel: {
        formatter: function (value, index) {
          const texts = []
          if (index === 1) {
            texts.push('Ⅰ类')
          }
          if (index === 2) {
            texts.push('Ⅱ类')
          }
          if (index === 3) {
            texts.push('Ⅲ类')
          }
          if (index === 4) {
            texts.push('Ⅳ类')
          }
          if (index === 5) {
            texts.push('Ⅴ类')
          }
          if (index === 6) {
            texts.push('劣Ⅴ类')
          }
          return texts
        }
      }
    },
    series: [
      {
        name: '水质类别',
        type: 'line',

        tooltip: {
          // Series config.
          trigger: 'item',
          formatter: function (value) {
            const texts = []
            if (value.value == '1') {
              texts.push('Ⅰ类')
            }
            if (value.value == '2') {
              texts.push('Ⅱ类')
            }
            if (value.value == '3') {
              texts.push('Ⅲ类')
            }
            if (value.value == '4') {
              texts.push('Ⅳ类')
            }
            if (value.value == '5') {
              texts.push('Ⅴ类')
            }
            if (value.value == '6') {
              texts.push('劣Ⅴ类')
            }
            return '水质类别：</br>' + value.name + ':' + texts
          }
        },
        itemStyle: {
          normal: {
            show: true,
            lineStyle: {
              color: colors[0]
            }
          }
        },
        data: wqg
      },
      {
        name: '目标水质类别',
        type: 'line',
        data: WFZ_WQT,
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            if (a.value == 1) {
              return '目标水质类别：</br>' + a.name + ':Ⅰ类'
            }
            if (a.value == 2) {
              return '目标水质类别：</br>' + a.name + ':Ⅱ类'
            }
            if (a.value == 3) {
              return '目标水质类别：</br>' + a.name + ':Ⅲ类'
            }
            if (a.value == 4) {
              return '目标水质类别：</br>' + a.name + ':Ⅳ类'
            }
            if (a.value == 5) {
              return '目标水质类别：</br>' + a.name + ':Ⅴ类'
            }
            if (a.value == 6) {
              return '目标水质类别：</br>' + a.name + ':劣Ⅴ类'
            }
          }
        },
        itemStyle: {
          normal: {}
        }
      }
    ]
  }

  echartsA.setOption(option)
}
