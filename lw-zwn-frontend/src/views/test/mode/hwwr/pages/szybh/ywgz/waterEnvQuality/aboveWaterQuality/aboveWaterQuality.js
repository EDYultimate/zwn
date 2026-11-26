let layerdata = {}
const param = {}
// iframe load success
function iframeload(target) {
  /**
   * 点击地图
   */
  document.getElementById('gismap').contentWindow.graphicCickHander_jsl = function (stcd) {
    const title = '降水量'
    $.post(
      basePath + '/gis/getstat',
      {
        stcds: stcd
      },
      function (data) {
        if (data.length < 1) {
          alert('未找到编号为' + stcd + '的测站')
          return
        }
        const pptn = data[0]
        layerdata = pptn
        layer.open({
          type: 2,
          title: pptn.ST_NM + title,
          shadeClose: false,
          shade: 0.2,
          maxmin: false, //开启最大化最小化按钮
          area: ['850px', '550px'],
          content: basePath + '/pages/kfly/jsl/sssj/jsl_stcd.jsp?stcd=' + stcd
        })
      }
    )
  }
}

$(function () {
  //    var bodyheight=$(document.body).outerHeight(true);
  //    var tbHeight = bodyheight-120-$(".titleDiv").height()-$(".M-box").height()-10;
  //    $(".bbTable").css("height",tbHeight+"px");
  //    $(".bbTable").css("height","100px");

  $.fn.zTree.init($('#treeDemoCheck'), setting, zNodes)
  qualityStat()
  qualityGovArea()
})

function qualityStat() {
  param.M_DATE = $('#dateSel').val()
  param.TP = 2

  const array = []
  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterWaterEnvQualityStat', param, function (result) {
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const item = {}
      item.value = result[i].COUNT
      switch (result[i].WQ_VAL) {
        case '1':
          item.name = 'Ⅰ'
          break
        case '2':
          item.name = 'Ⅱ'
          break
        case '3':
          item.name = 'Ⅲ'
          break
        case '4':
          item.name = 'Ⅳ'
          break
        case '5':
          item.name = 'Ⅴ'
          break
        case '6':
          item.name = 'Ⅵ'
          break
        default:
          item.name = '-'
      }
      array.push(item)
    }
    echartsWaterQualityType(array)
  })
}

function qualityGovArea() {
  param.M_DATE = $('#dateSel').val()
  param.TP = 2
  const array = []
  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterWaterEnvGovAreaStat', param, function (result) {
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const item = {}
      item.value = result[i].COUNT
      item.name = result[i].CITY

      array.push(item)
    }
    echartsGovArea(array)
  })
}

function echartsWaterQualityType(data) {
  option = {
    //			 color:['#51bbff', '#fffc00', '#ffc44d','#ee6666'],
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
        radius: ['40%', '60%'],
        center: ['45%', '45%'],
        //		            roseType: 'radius',
        itemStyle: {
          borderRadius: 5
        },
        label: {
          show: false
        },

        data: data
      }
    ]
  }

  const myChartWaterLevel = echarts.init(document.getElementById('waterQualityTypeDiv'))
  myChartWaterLevel.setOption(option)
}

function echartsGovArea(data) {
  option = {
    //			 color:['#51bbff', '#fffc00', '#ffc44d','#ee6666'],
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
        radius: ['40%', '60%'],
        center: ['45%', '45%'],

        //		            roseType: 'radius',
        itemStyle: {
          borderRadius: 5
        },
        label: {
          show: false
        },
        data: data
      }
    ]
  }

  const myChartWaterLevel = echarts.init(document.getElementById('govAreaDiv'))
  myChartWaterLevel.setOption(option)
}

var setting = {
  //		 view: {
  //            dblClickExpand: false
  //        },
  callback: {
    //			beforeClick: zTreeBeforeClick,
    onClick: onClick
  }
}

var zNodes = [
  {
    name: '河北省',
    isParent: true,
    open: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [
      { id: '101', name: '库心', icon: 'images/savewater/selectedIcon.png' },
      { id: '101', name: '乌龙矶', icon: 'images/savewater/selectedIcon.png' }
    ]
  },
  {
    name: '天津市',
    isParent: true,
    open: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [
      { id: '103', name: '于桥水库【坝上】', icon: 'images/savewater/selectedIcon.png' },
      { id: '101', name: '于桥水库【库心】', icon: 'images/savewater/selectedIcon.png' }
    ]
  },
  {
    name: '北京市',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [
      { id: '101', name: '密云水库【白河主坝】', icon: 'images/savewater/selectedIcon.png' },
      { id: '101', name: '官厅水库【永1000表】', icon: 'images/savewater/selectedIcon.png' }
    ]
  }
]

function onClick(event, treeId, treeNode) {
  console.log('isParent ', !treeNode.isParent)
  if (!treeNode.isParent) {
    //如果不是父节点，则请发数据给gis界面，调用gis接口
    //	    var zTree = $.fn.zTree.getZTreeObj("#treeDemoCheck");
    //	    var zTree = $.fn.zTree.getZTreeObj("#tree");

    //	     zTree.expandNode(treeNode);

    document.getElementById('gismap').contentWindow.locate(treeNode.id)
  }
}

$('#query_arrow_div').click(function () {
  const getBodyW = document.body.clientWidth //得到body宽

  if ($('#togg').val() == '1') {
    $('#query_arrow_div').css('right', 360 - 10)
    $('#gsFrame').css('width', getBodyW * 0.8)
    $('#query_dialog_div').css('display', 'block')
    $('#query_dialog_div').css('width', 360)
    $('#togg').val('0')
    $('#gsFrame').css('width', getBodyW - 360)
  } else {
    $('#query_arrow_div').css('right', -13)
    $('#gsFrame').css('width', getBodyW)
    $('#query_dialog_div').css('display', 'none')
    $('#togg').val('1')
  }
})

$('#searchTop').click(function () {
  //	if($("#toggQueryDialog").val()=="1"){
  //		var src=basePath+"/pages/szybh/ywgz/ecologyFlow/warnDetail/warnDetail.jsp";
  //		$("#gismap").attr("src",src);
  $('#toggQueryDialog').val('0')
  top.layer.open({
    type: 2,
    title: '地下水水质状况详细信息',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    //	 			offset: '70px',
    area: ['1300px', '650px'],
    content:
      basePath +
      '/pages/szybh/ywgz/waterEnvQuality/aboveWaterQuality/aboveWaterQualityDetail/aboveWaterQualityDetail.jsp'
  })
})
