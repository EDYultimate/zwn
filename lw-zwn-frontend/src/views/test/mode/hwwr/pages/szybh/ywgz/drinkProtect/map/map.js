const layerdata = {}

// iframe load success
//function iframeload(target) {
//	 /**
//	 * 点击地图
//	 */
//	document.getElementById("gismap").contentWindow.graphicCickHander_jsl = function(stcd) {
//		var title = "降水量";
//		$.post(basePath +'/gis/getstat', {
//			stcds: stcd
//		}, function(data) {
//			if (data.length<1) {
//				alert("未找到编号为"+stcd+"的测站");
//				return;
//			}
//			var pptn = data[0];
//			layerdata = pptn;
//			top.layer.open({
//			      type: 2,
//			      title: pptn.ST_NM + title,
//			      shadeClose: false,
//			      shade: 0.2,
//			      maxmin: false, //开启最大化最小化按钮
//			      area: ['850px', '550px'],
//			      content: basePath+'/pages/kfly/jsl/sssj/jsl_stcd.jsp?stcd='+stcd
//			 });
//		})
//
//	}
//}

$(function () {
  //    var bodyheight=$(document.body).outerHeight(true);
  //    var tbHeight = bodyheight-120-$(".titleDiv").height()-$(".M-box").height()-10;
  //    $(".bbTable").css("height",tbHeight+"px");
  //    $(".bbTable").css("height","100px");

  $.fn.zTree.init($('#treeDemoCheck'), setting, zNodes)
  //  console.log(111);
  //    search(1);
  WaterTypeStat()
  GovAreaStat()
})

function WaterTypeStat() {
  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterDrinkProtectWaterType', function (result) {
    //    	console.log("getSaveWaterDrinkProtectWaterType",result);
    const waterTypeMap = []
    for (let i = 0; i < result.length; i++) {
      const tmp = {}
      tmp.name = result[i].SWS_TPNAME
      tmp.value = result[i].VALUE

      waterTypeMap.push(tmp)
    }
    echartsWaterType(waterTypeMap)
  })
}

function echartsWaterType(waterTypeMap) {
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
        //		            data: [
        //		                {value: 40, name: '河道'},
        //		                {value: 33, name: '水库'},
        //		                {value: 28, name: '地下水'}
        //		            ]
        data: waterTypeMap
      }
    ]
  }

  const myChartWaterLevel = echarts.init(document.getElementById('waterTypeDiv'))
  myChartWaterLevel.setOption(option)
}

function GovAreaStat() {
  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterDrinkProtectGovArea', function (result) {
    //    	console.log("getSaveWaterDrinkProtectGovArea",result);
    const govAreaMap = []
    for (let i = 0; i < result.length; i++) {
      const tmp = {}
      tmp.name = result[i].PROVINEC_NM
      tmp.value = result[i].VALUE
      govAreaMap.push(tmp)
    }
    echartsGovArea(govAreaMap)
  })
}

function echartsGovArea(govAreaMap) {
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
        //		            data: [
        //		                {value: 40, name: '北京'},
        //		                {value: 33, name: '天津'},
        //		                {value: 28, name: '河北'},
        //		                {value: 22, name: '山西'},
        //		                {value: 30, name: '河南'},
        //		                {value: 25, name: '山东'},
        //		                {value: 18, name: '内蒙'}
        //		            ]
        data: govAreaMap
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
    name: '北京市(8)',
    isParent: true,
    open: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [
      { id: '110116000004', name: '密云水库水源地', icon: 'images/savewater/selectedIcon.png' },
      {
        id: '111111111110',
        name: '北京市自来水集团第二水厂水源地',
        icon: 'images/savewater/selectedIcon.png'
      },
      {
        id: '111111111111',
        name: '北京市自来水集团第三水厂水源地',
        icon: 'images/savewater/selectedIcon.png'
      },
      {
        id: '111111111112',
        name: '北京市自来水集团第八水厂水源地',
        icon: 'images/savewater/selectedIcon.png'
      },
      { id: '110116000001', name: '怀柔水库水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '110000000007', name: '北京市拒马河水源地', icon: 'images/savewater/selectedIcon.png' },
      {
        id: '111111111113',
        name: '北京市顺义区第三水源地',
        icon: 'images/savewater/selectedIcon.png'
      },
      { id: '110229000002', name: '白河堡水库水源地', icon: 'images/savewater/selectedIcon.png' }
    ]
  },
  {
    name: '天津市(1)',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [
      {
        id: '120000000001',
        name: '于桥-尔王庄水库水源地',
        icon: 'images/savewater/selectedIcon.png'
      }
    ]
  },
  {
    name: '河北省(24)',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [
      { id: '130131000001', name: '岗南水库水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '130185000001', name: '黄壁庄水库水源地', icon: 'images/savewater/selectedIcon.png' },
      {
        id: '111111111114',
        name: '石家庄市滹沱河地下水水源地',
        icon: 'images/savewater/selectedIcon.png'
      },
      {
        id: '0C0000000001',
        name: '潘家口-大黑汀水库水源地',
        icon: 'images/savewater/selectedIcon.png'
      },
      { id: '130205000002', name: '陡河水库水源地', icon: 'images/savewater/selectedIcon.png' },
      {
        id: '111111111115',
        name: '唐山市北郊水厂水源地',
        icon: 'images/savewater/selectedIcon.png'
      },
      {
        id: '130321000003',
        name: '桃林口水库水源地（含洋河水库水源）',
        icon: 'images/savewater/selectedIcon.png'
      },
      { id: '130303000001', name: '石河水库水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '130427000001', name: '岳城水库水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '111111111116', name: '邯郸市羊角铺水源地', icon: 'images/savewater/selectedIcon.png' },
      {
        id: '111111111117',
        name: '邢台市桥西董村水厂水源地',
        icon: 'images/savewater/selectedIcon.png'
      },
      { id: '130627000001', name: '西大洋水库水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '130634000001', name: '王快水库水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '111111111118', name: '保定市一亩泉水源地', icon: 'images/savewater/selectedIcon.png' },
      {
        id: '111111111119',
        name: '张家口市旧李宅水源地',
        icon: 'images/savewater/selectedIcon.png'
      },
      { id: '111111111120', name: '张家口市样台水源地', icon: 'images/savewater/selectedIcon.png' },
      {
        id: '111111111121',
        name: '张家口市腰站堡水源地',
        icon: 'images/savewater/selectedIcon.png'
      },
      {
        id: '111111111122',
        name: '张家口市北水源水源地',
        icon: 'images/savewater/selectedIcon.png'
      },
      { id: '111111111123', name: '承德市二水厂水源地', icon: 'images/savewater/selectedIcon.png' },
      {
        id: '111111111124',
        name: '承德市双滦自来水公司水源地',
        icon: 'images/savewater/selectedIcon.png'
      },
      { id: '130927000001', name: '大浪淀水库水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '130924000001', name: '杨埕水库水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '111111111125', name: '廊坊市城区水源地', icon: 'images/savewater/selectedIcon.png' },
      {
        id: '111111111126',
        name: '衡水市自来水公司水源地',
        icon: 'images/savewater/selectedIcon.png'
      }
    ]
  },
  {
    name: '山西省(4)',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [
      { id: '140321000004', name: '阳泉市娘子关水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '111111111127', name: '长治市辛安泉水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '111111111128', name: '朔州市耿庄水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '111111111129', name: '沂州市豆罗水源地', icon: 'images/savewater/selectedIcon.png' }
    ]
  },
  {
    name: '内蒙古(1)',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [
      {
        id: '111111111130',
        name: '锡林郭勒盟一棵树-东苗圃水源地',
        icon: 'images/savewater/selectedIcon.png'
      }
    ]
  },
  {
    name: '山东省(13)',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [
      { id: '111111111131', name: '清源湖水库水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '111111111132', name: '相家河水库水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '111111111133', name: '庆云水库水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '111111111134', name: '丁东水库水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '111111111135', name: '杨安镇水库水源地', icon: 'images/savewater/selectedIcon.png' },
      {
        id: '111111111136',
        name: '聊城市东聊供水水源地',
        icon: 'images/savewater/selectedIcon.png'
      },
      { id: '111111111137', name: '思源湖水库水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '111111111138', name: '三角洼水库水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '111111111139', name: '孙武湖水库水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '111111111140', name: '仙鹤湖水库水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '111111111141', name: '幸福水库水源地', icon: 'images/savewater/selectedIcon.png' },
      { id: '111111111142', name: '西海水库水源地', icon: 'images/savewater/selectedIcon.png' },
      {
        id: '111111111143',
        name: '滨州市东郊水库水源地',
        icon: 'images/savewater/selectedIcon.png'
      }
    ]
  },
  {
    name: '河南省(4)',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [
      { id: '111111111144', name: '弓上水库水源地', icon: 'images/savewater/selectedIcon.png' },
      {
        id: '111111111145',
        name: '安阳市洹河地下水水源地',
        icon: 'images/savewater/selectedIcon.png'
      },
      { id: '111111111146', name: '盘石头水库水源地', icon: 'images/savewater/selectedIcon.png' },
      {
        id: '111111111147',
        name: '焦作市城区地下水水源地',
        icon: 'images/savewater/selectedIcon.png'
      }
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
    console.log(treeNode.id)
    document.getElementById('gismap').contentWindow.locate(treeNode.id)
    console.log(treeNode.id)
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
    title: '重要水源地详细信息',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    //	 			offset: '70px',
    area: ['1300px', '650px'],
    content:
      basePath + '/pages/szybh/ywgz/drinkProtect/keyWaterSourceDetail/keyWaterSourceDetail.jsp'
  })
})
