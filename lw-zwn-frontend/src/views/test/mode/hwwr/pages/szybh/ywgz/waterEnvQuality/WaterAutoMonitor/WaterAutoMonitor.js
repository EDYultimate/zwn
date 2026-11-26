let layerdata = {}

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
  console.log(111)
  //    search(1);
})

var setting = {
  //		 view: {
  //            dblClickExpand: false
  //        },
  callback: {
    //			beforeClick: zTreeBeforeClick,
    //			onClick: onClick
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
      { id: '1', name: '库心', icon: 'images/savewater/selectedIcon.png' },
      { id: '', name: '乌龙矶', icon: 'images/savewater/selectedIcon.png' },
      { id: '', name: '燕子峪', icon: 'images/savewater/selectedIcon.png' },
      { id: '', name: '洒河桥', icon: 'images/savewater/selectedIcon.png' },
      { id: '', name: '于桥水库【坝上】', icon: 'images/savewater/selectedIcon.png' },
      { id: '', name: '陡河水库', icon: 'images/savewater/selectedIcon.png' },
      { id: '', name: '陡河水库【坝上】', icon: 'images/savewater/selectedIcon.png' },
      { id: '', name: '洋河水库', icon: 'images/savewater/selectedIcon.png' },
      { id: '', name: '邱庄水库', icon: 'images/savewater/selectedIcon.png' },
      { id: '', name: '桃林口', icon: 'images/savewater/selectedIcon.png' },
      { id: '', name: '大浪淀', icon: 'images/savewater/selectedIcon.png' }
    ]
  },
  {
    name: '北京市',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [
      { id: '1', name: '密云水库【白河主坝】', icon: 'images/savewater/selectedIcon.png' },
      { id: '', name: '官厅水库【永1000表】', icon: 'images/savewater/selectedIcon.png' }
    ]
  },
  {
    name: '天津市',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [
      { id: '1', name: '于桥水库【坝上】', icon: 'images/savewater/selectedIcon.png' },
      { id: '', name: '于桥水库【库心】', icon: 'images/savewater/selectedIcon.png' },
      { id: '', name: '尔王庄水库【库心】', icon: 'images/savewater/selectedIcon.png' }
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
    let tbodyStr = ''
    const index = layer.load()
    //debugger
    if (treeNode.id != null) {
      console.log('treeNode ', treeNode.id)

      param.STCD = treeNode.id
      jQuery.getJSON(
        basePath + 'szybh/ywgz/getSaveWaterEcologyFlowCheckSetInfo',
        param,
        function (result) {
          console.log('result:', result)
          if (result != null && result.length > 0) {
            let kaohezhibiao
            switch (result[0].ASS_TAR) {
              case '1':
                kaohezhibiao = '生态水位'
                break
              case '2':
                kaohezhibiao = '生态水量'
                break
              case '3':
                kaohezhibiao = '生态基流'
                break

              default:
                kaohezhibiao = ''
            }

            let pingjiashichang
            switch (result[0].ASS_TP) {
              case '1':
                pingjiashichang = '日'
                break
              case '2':
                pingjiashichang = '旬均'
                break
              case '3':
                pingjiashichang = '月均'
                break
              case '4':
                pingjiashichang = '季均'
                break
              case '5':
                pingjiashichang = '年累计'
                break
              default:
                pingjiashichang = ''
            }

            tbodyStr +=
              '<tr>' +
              "<td title='" +
              isNull(kaohezhibiao) +
              "'  >" +
              isNull(kaohezhibiao) +
              '</td>' +
              "<td title='" +
              isNull(pingjiashichang) +
              "'  >" +
              isNull(pingjiashichang) +
              '</td>' +
              "<td title='" +
              isNull(result[0].GOAL_V) +
              "'  >" +
              isNull(result[0].GOAL_V) +
              '</td>' +
              "<td title='" +
              isNull(result[0].ASS_TIME) +
              "'  >" +
              isNull(result[0].ASS_TIME) +
              '</td>' +
              '</tr>'
          } else {
            tbodyStr += '<tr><td></td></tr>'
          }
          console.log('tbodyStr', tbodyStr)
          $('#TableData').empty().append(tbodyStr)
          layer.close(index)
        }
      )
    }
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
    title: '水质自动监测数据',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    //	 			offset: '70px',
    area: ['1300px', '650px'],
    content:
      basePath + '/pages/szybh/ywgz/waterEnvQuality/WaterAutoMonitor/WaterAutoMonitorDetail.jsp'
  })
})
