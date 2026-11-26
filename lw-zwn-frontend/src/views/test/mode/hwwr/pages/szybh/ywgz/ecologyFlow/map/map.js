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
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  //    $(".bbTable").css("height",tbHeight+"px");
  //    $(".bbTable").css("height","100px");
  console.log(tbHeight)
  $('#query_arrow_div').css('margin-top', tbHeight / 2)

  $.fn.zTree.init($('#treeDemoCheck'), setting, zNodes)

  search()
})

function search() {
  const date = new Date()
  param.year = date.getFullYear()
  let totalWDB = 0
  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterGovAreaCheckStat', param, function (data) {
    console.log(data)
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].SUM != 0) {
          totalWDB += data[i].SUM
        }
      }
    }
    $('#totalWDB').html(totalWDB)
  })
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
    name: '水利部印发(8条河流，11个考核断面)',
    isParent: true,
    open: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [
      {
        name: '白洋淀',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        open: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          {
            id: '30806201',
            name: '十方院(考核)',
            icon: 'images/savewater/selectedIcon.png',
            font: { color: '#000079' }
          }
        ]
      },
      {
        name: '七里海',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          { id: '99990176', name: '淮淀闸(考核)', icon: 'images/savewater/selectedIcon.png' },
          { id: '99990095', name: '淮淀闸(管理)', icon: 'images/savewater/selectedIcon.png' }
        ]
      },
      //			{ name:"滦河", isParent:true}
      {
        name: '滦河',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          { id: '30101400', name: '滦县站(管理)', icon: 'images/savewater/selectedIcon.png' },
          { id: '30101202', name: '大黑汀水库(管理)', icon: 'images/savewater/selectedIcon.png' },
          { id: '00000002', name: '桃林口水库(管理)', icon: 'images/savewater/selectedIcon.png' },
          {
            id: '00000003',
            name: '岩山渠首(管理、计算)',
            icon: 'images/savewater/selectedIcon.png'
          }
        ]
      },
      {
        name: '永定河',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          { id: '30700500', name: '三家店(考核)', icon: 'images/savewater/selectedIcon.png' },
          { id: '30700050', name: '八号桥(管理)', icon: 'images/savewater/selectedIcon.png' },
          { id: '30700100', name: '官厅水库(考核管理)', icon: 'images/savewater/selectedIcon.png' },
          { id: '00000004', name: '小红门再生水(计算)', icon: 'images/savewater/selectedIcon.png' },
          { id: '30700700', name: '卢沟桥(管理)', icon: 'images/savewater/selectedIcon.png' }
        ]
      },
      {
        name: '桑干河',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          { id: '30702400', name: '册田水库(考核)', icon: 'images/savewater/selectedIcon.png' },
          { id: '30702700', name: '石匣里(管理)', icon: 'images/savewater/selectedIcon.png' }
          //						,{id:'00000005', name:"册田水库下游灌区引水口(计算)",icon:"images/savewater/selectedIcon.png"}
        ]
      },
      {
        name: '洋河',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          { id: '30705600', name: '响水堡(考核)', icon: 'images/savewater/selectedIcon.png' }
          //						,{id:'00000006', name:"响水堡水库下游灌区引水口(计算)",icon:"images/savewater/selectedIcon.png"}
        ]
      },
      {
        name: '南运河',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          {
            id: '31001802',
            name: '四女寺南运河节制闸(管理)',
            icon: 'images/savewater/selectedIcon.png'
          },
          { id: '31001790', name: '耿李杨(管理)', icon: 'images/savewater/selectedIcon.png' },
          { id: '31000400', name: '第三店(管理)', icon: 'images/savewater/selectedIcon.png' },
          {
            id: '31000900',
            name: '北陈屯节制闸闸上(考核)',
            icon: 'images/savewater/selectedIcon.png'
          },
          {
            id: '31001000',
            name: '九宣闸南运河节制闸(管理)',
            icon: 'images/savewater/selectedIcon.png'
          },
          { id: '31001250', name: '十一堡闸上(考核)', icon: 'images/savewater/selectedIcon.png' }
        ]
      },
      {
        name: '潮白河',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          { id: '30301801', name: '密云水库坝下(管理)', icon: 'images/savewater/selectedIcon.png' },
          { id: '30300100', name: '苏庄(考核)', icon: 'images/savewater/selectedIcon.png' },
          { id: '30503900', name: '牛牧屯闸上(管理)', icon: 'images/savewater/selectedIcon.png' },
          { id: '30300300', name: '赶水坝(考核)', icon: 'images/savewater/selectedIcon.png' },
          {
            id: '30304301',
            name: '土门楼（青）闸下(管理)',
            icon: 'images/savewater/selectedIcon.png'
          },
          {
            id: '30300660',
            name: '朱刘庄闸（泃）(考核)',
            icon: 'images/savewater/selectedIcon.png'
          },
          { id: '30300600', name: '宁车沽闸(考核)', icon: 'images/savewater/selectedIcon.png' }
        ]
      }
    ]
  },
  {
    name: '北京市印发(4条河流，6个考核断面)',
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    isParent: true,
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [
      {
        name: '北护城河',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [{ id: '30523800', name: '松林闸', icon: 'images/savewater/selectedIcon.png' }]
      },
      {
        name: '清河',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          { id: '00000007', name: '肖家河闸前(考核)', icon: 'images/savewater/selectedIcon.png' },
          { id: '00000008', name: '下清河闸前(考核)', icon: 'images/savewater/selectedIcon.png' },
          { id: '00000009', name: '沈家坟闸前(考核)', icon: 'images/savewater/selectedIcon.png' }
        ]
      },
      {
        name: '十三陵水库',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          { id: '30503400', name: '库水位(考核)', icon: 'images/savewater/selectedIcon.png' }
        ]
      },
      {
        name: '昆明湖',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          { id: '00000010', name: '颐和闸(考核、管理)', icon: 'images/savewater/selectedIcon.png' }
        ]
      }
    ]
  },
  {
    name: '天津市印发(3条河流，3个考核断面)',
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    isParent: true,
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [
      {
        name: '七里海湿地',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          { id: '00000011', name: '苇海区闸下(考核)', icon: 'images/savewater/selectedIcon.png' },
          { id: '30301050', name: '七里海北站(管理)', icon: 'images/savewater/selectedIcon.png' },
          {
            id: '99990095',
            name: '潮白新河淮淀闸上(管理)',
            icon: 'images/savewater/selectedIcon.png'
          }
        ]
      },
      {
        name: '洪泥河',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          { id: '31003250', name: '洪泥河首闸(考核)', icon: 'images/savewater/selectedIcon.png' },
          { id: '30600651', name: '洪泥河防洪闸(管理)', icon: 'images/savewater/selectedIcon.png' }
        ]
      },
      {
        name: '龙凤河故道',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          { id: '00000012', name: '老龙凤河闸上(考核)', icon: 'images/savewater/selectedIcon.png' },
          {
            id: '99990077',
            name: '南三孔节制闸上(管理)',
            icon: 'images/savewater/selectedIcon.png'
          },
          { id: '30502200', name: '筐儿港上(管理)', icon: 'images/savewater/selectedIcon.png' }
        ]
      }
    ]
  },
  {
    name: '河北省印发(3条河流，4个考核断面)',
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    isParent: true,
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [
      {
        name: '滹沱河',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          { id: '30909200', name: '岗南水库(考核)', icon: 'images/savewater/selectedIcon.png' },
          { id: '30909303', name: '黄壁庄水库(考核)', icon: 'images/savewater/selectedIcon.png' },
          { id: '30909100', name: '滹沱河小觉站(管理)', icon: 'images/savewater/selectedIcon.png' },
          { id: '30912400', name: '冶河平山站(管理)', icon: 'images/savewater/selectedIcon.png' }
        ]
      },
      {
        name: '青龙河',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          { id: '00000013', name: '桃林口水库(考核)', icon: 'images/savewater/selectedIcon.png' }
        ]
      },
      {
        name: '衡水湖',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          { id: '30905500', name: '衡水湖千顷洼(考核)', icon: 'images/savewater/selectedIcon.png' }
        ]
      }
    ]
  },
  {
    name: '山西省印发(5条河流，7个考核断面)',
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    isParent: true,
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [
      {
        name: '滹沱河',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          { id: '30909000', name: '南庄(考核、管理)', icon: 'images/savewater/selectedIcon.png' },
          { id: '00000017', name: '省界(考核)', icon: 'images/savewater/selectedIcon.png' },
          { id: '30908800', name: '界河铺(管理)', icon: 'images/savewater/selectedIcon.png' }
        ]
      },
      {
        name: '桑干河',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          { id: '00000015', name: '册田水库(考核)', icon: 'images/savewater/selectedIcon.png' },
          { id: '00000016', name: '东榆林水库(管理)', icon: 'images/savewater/selectedIcon.png' }
        ]
      },
      {
        name: '浊漳河',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          {
            id: '31008402',
            name: '关河水库(考核、管理)',
            icon: 'images/savewater/selectedIcon.png'
          },
          { id: '31007650', name: '侯壁水文站(考核)', icon: 'images/savewater/selectedIcon.png' },
          { id: '00000019', name: '云竹水库(管理)', icon: 'images/savewater/selectedIcon.png' },
          { id: '00000020', name: '淜头水电站(管理)', icon: 'images/savewater/selectedIcon.png' }
        ]
      },
      {
        name: '浊漳南源',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          {
            id: '31007800',
            name: '漳泽水库(考核、管理)',
            icon: 'images/savewater/selectedIcon.png'
          },
          { id: '31008000', name: '屯绛水库(考核)', icon: 'images/savewater/selectedIcon.png' }
        ]
      },
      {
        name: '浊漳西源',
        iconOpen: 'images/savewater/arrowOpenIcon.png',
        isParent: true,
        iconClose: 'images/savewater/arrowCloseIcon.png',
        children: [
          {
            id: '31008100',
            name: '后湾水库(考核、管理)',
            icon: 'images/savewater/selectedIcon.png'
          },
          { id: '31008070', name: '圪芦河水库(管理)', icon: 'images/savewater/selectedIcon.png' }
        ]
      }
    ]
  }
]

function onClick(event, treeId, treeNode) {
  //	console.log("isParent ",!treeNode.isParent);
  if (!treeNode.isParent) {
    //如果不是父节点，则请发数据给gis界面，调用gis接口
    //console.log(treeNode.id);
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
    $('#checkSetDiv').css('right', 70 + 360)
  } else {
    $('#query_arrow_div').css('right', -13)
    $('#gsFrame').css('width', getBodyW)
    $('#query_dialog_div').css('display', 'none')
    $('#togg').val('1')
    $('#checkSetDiv').css('right', 70)
  }
})

$('#searchTop').click(function () {
  //	if($("#toggQueryDialog").val()=="1"){
  //		var src=basePath+"/pages/szybh/ywgz/ecologyFlow/warnDetail/warnDetail.jsp";
  //		$("#gismap").attr("src",src);
  $('#toggQueryDialog').val('0')
  //		$("#checkSetDiv").css("display", "none");
  top.layer.open({
    type: 2,
    title: '预警评估详情',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['1300px', '670px'],
    content: basePath + '/pages/szybh/ywgz/ecologyFlow/warnDetail/warnDetail.jsp'
  })

  //	}else{
  //		var src=basePath+"/pages/gis/main/shlh/index.jsp";
  //		$("#gismap").attr("src",src);
  //		$("#toggQueryDialog").val("1");
  //		$("#checkSetDiv").css("display", "block")
  //
  //	}
})

$('#checkSetDiv').click(function () {
  //	if($("#toggCheckSet").val()=="1"){
  //		var src=basePath+"/images/savewater/checkSet1.png";
  //		$("#checkSetImg").attr("src",src);
  //		src=basePath+"/pages/szybh/ywgz/ecologyFlow/checkSet/checkSet.jsp";
  //		$("#gismap").attr("src",src);
  $('#toggCheckSet').val('0')
  top.layer.open({
    type: 2,
    title: '断面考核阈值设置',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['1300px', '650px'],
    content: basePath + '/pages/szybh/ywgz/ecologyFlow/checkSet/checkSet.jsp'
  })

  //	}else{
  //		var src=basePath+"/pages/gis/main/shlh/index.jsp";
  //		$("#gismap").attr("src",src);
  //		var src=basePath+"/images/savewater/checkSet0.png";
  //		$("#checkSetImg").attr("src",src);
  //		src=basePath+"/pages/gis/main/shlh/index.jsp";
  //		$("#gismap").attr("src",src);
  //		$("#toggCheckSet").val("1");
  //	}
})
