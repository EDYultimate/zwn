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

  //    search(1);
})

var setting = {
  //		 view: {
  //            dblClickExpand: false
  //        },
  callback: {
    //			beforeClick: zTreeBeforeClick,
    onClick: onClick
  }
}

//var zNodes =[
//	{name:"滹沱河", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"中线入滹沱河",icon:"images/savewater/selectedIcon.png"},
//		           {id:'', name:"再生水入滹沱河",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"滏阳河", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"盂县补水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"南拒马河", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"南拒马河",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"永定河", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"1#洞补水口",icon:"images/savewater/selectedIcon.png"},
//		           {id:'', name:"小红门补水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"七里河-顺水河", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"七里海补水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"唐河", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"引江补水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"沙河-潴龙河", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"沙河补水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"北拒马河-白沟河", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"白沟河补水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"瀑河", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"瀑河补水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"泜河", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"泜河补水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"南运河", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"南运河补水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"七里海", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"七里海补水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	,
//	{name:"大黄堡洼", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"大黄堡洼补水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"北大港", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"北大港补水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"团泊洼", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"团泊洼补水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"白洋淀", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"引江补水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"衡水湖", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"衡水湖补水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"南大港", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"南大港补水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"漳河", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"漳河补水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"卫河", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"卫河补水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"潮白河", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"上游水库补水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	},
//	{name:"北运河", isParent:true,
//		iconOpen:"images/savewater/arrowOpenIcon.png",
//		iconClose:"images/savewater/arrowCloseIcon.png",
//		children: [
//		           {id:'', name:"北运河再生水口",icon:"images/savewater/selectedIcon.png"}
//		           ]
//	}
//];

var zNodes = [
  {
    name: '滹沱河',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [
      { id: '1', name: '中线入滹沱河', icon: 'images/savewater/selectedIcon.png' },
      { id: '2', name: '再生水入滹沱河', icon: 'images/savewater/selectedIcon.png' }
    ]
  },
  {
    name: '滏阳河',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '3', name: '盂县补水口', icon: 'images/savewater/selectedIcon.png' }]
  },
  {
    name: '南拒马河',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '4', name: '南拒马河', icon: 'images/savewater/selectedIcon.png' }]
  },
  {
    name: '永定河',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [
      { id: '5', name: '1#洞补水口', icon: 'images/savewater/selectedIcon.png' },
      { id: '6', name: '小红门补水口', icon: 'images/savewater/selectedIcon.png' }
    ]
  },
  {
    name: '七里河-顺水河',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '7', name: '七里海补水口', icon: 'images/savewater/selectedIcon.png' }]
  },
  {
    name: '唐河',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '8', name: '引江补水口', icon: 'images/savewater/selectedIcon.png' }]
  },
  {
    name: '沙河-潴龙河',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '9', name: '沙河补水口', icon: 'images/savewater/selectedIcon.png' }]
  },
  {
    name: '北拒马河-白沟河',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '10', name: '白沟河补水口', icon: 'images/savewater/selectedIcon.png' }]
  },
  {
    name: '瀑河',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '11', name: '瀑河补水口', icon: 'images/savewater/selectedIcon.png' }]
  },
  {
    name: '泜河',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '12', name: '泜河补水口', icon: 'images/savewater/selectedIcon.png' }]
  },
  {
    name: '南运河',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '13', name: '南运河补水口', icon: 'images/savewater/selectedIcon.png' }]
  },
  {
    name: '七里海',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '14', name: '七里海补水口', icon: 'images/savewater/selectedIcon.png' }]
  },
  {
    name: '大黄堡洼',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '15', name: '大黄堡洼补水口', icon: 'images/savewater/selectedIcon.png' }]
  },
  {
    name: '北大港',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '16', name: '北大港补水口', icon: 'images/savewater/selectedIcon.png' }]
  },
  {
    name: '团泊洼',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '17', name: '团泊洼补水口', icon: 'images/savewater/selectedIcon.png' }]
  },
  {
    name: '白洋淀',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '18', name: '引江补水口', icon: 'images/savewater/selectedIcon.png' }]
  },
  {
    name: '衡水湖',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '19', name: '衡水湖补水口', icon: 'images/savewater/selectedIcon.png' }]
  },
  {
    name: '南大港',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '20', name: '南大港补水口', icon: 'images/savewater/selectedIcon.png' }]
  },
  {
    name: '漳河',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '21', name: '漳河补水口', icon: 'images/savewater/selectedIcon.png' }]
  },
  {
    name: '卫河',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '22', name: '卫河补水口', icon: 'images/savewater/selectedIcon.png' }]
  },
  {
    name: '潮白河',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '23', name: '上游水库补水口', icon: 'images/savewater/selectedIcon.png' }]
  },
  {
    name: '北运河',
    isParent: true,
    iconOpen: 'images/savewater/arrowOpenIcon.png',
    iconClose: 'images/savewater/arrowCloseIcon.png',
    children: [{ id: '24', name: '北运河再生水口', icon: 'images/savewater/selectedIcon.png' }]
  }
]

function onClick(event, treeId, treeNode) {
  console.log('isParent ', !treeNode.isParent)
  if (!treeNode.isParent) {
    //如果不是父节点，则请发数据给gis界面，调用gis接口
    //		console.log("aaa");
    document.getElementById('gismap').contentWindow.locate(treeNode.id)

    //	    var zTree = $.fn.zTree.getZTreeObj("#treeDemoCheck");
    //	    var zTree = $.fn.zTree.getZTreeObj("#tree");

    //	     zTree.expandNode(treeNode);
    //		var tbodyStr="";
    //		 var index = layer.load();
    //debugger
  }
}

$('#query_arrow_div').click(function () {
  const getBodyW = document.body.clientWidth //得到body宽
  //	console.log("aaa");
  const date = new Date()
  $('#nianFenInput').val(date.getFullYear())
  if ($('#togg').val() == '1') {
    $('#query_arrow_div').css('right', 360 - 10)
    $('#gsFrame').css('width', getBodyW * 0.8)
    $('#query_dialog_div').css('display', 'block')
    $('#query_dialog_div').css('width', 360)
    $('#togg').val('0')
    $('#gsFrame').css('width', getBodyW - 360)
    //		$("#checkSetDiv").css("right",70+360);
  } else {
    $('#query_arrow_div').css('right', -13)
    $('#gsFrame').css('width', getBodyW)
    $('#query_dialog_div').css('display', 'none')
    $('#togg').val('1')
    //		$("#checkSetDiv").css("right",70);
  }
})

$('#searchTop').click(function () {
  top.layer.open({
    type: 2,
    title: '河湖生态补水详情',
    shadeClose: false,
    shade: 0.2,
    //	        offset: '60px',
    maxmin: false, //开启最大化最小化按钮
    area: ['1300px', '650px'],
    content: basePath + '/pages/szybh/ywgz/groundWater/NorthDetail/NorthDetail.jsp'
  })

  //	if($("#toggQueryDialog").val()=="1"){
  //		var src=basePath+"/pages/szybh/ywgz/groundWater/NorthDetail/NorthDetail.jsp";
  //		$("#gismap").attr("src",src);
  //		$("#toggQueryDialog").val("0");
  //		$("#checkSetDiv").css("display", "none")
  //	}else{
  //		var src=basePath+"/pages/gis/main/shlh/index.jsp";
  //		$("#gismap").attr("src",src);
  //		$("#toggQueryDialog").val("1");
  //		$("#checkSetDiv").css("display", "block")
  //
  //	}
})

//$("#checkSetDiv").click(function(){
//	if($("#toggCheckSet").val()=="1"){
////		var src=basePath+"/images/savewater/checkSet1.png";
////		$("#checkSetImg").attr("src",src);
////		src=basePath+"/pages/szybh/ywgz/ecologyFlow/checkSet/checkSet.jsp";
////		$("#gismap").attr("src",src);
//		$("#toggCheckSet").val("0");
//	}else{
////		var src=basePath+"/pages/gis/main/shlh/index.jsp";
////		$("#gismap").attr("src",src);
////		var src=basePath+"/images/savewater/checkSet0.png";
////		$("#checkSetImg").attr("src",src);
////		src=basePath+"/pages/gis/main/shlh/index.jsp";
////		$("#gismap").attr("src",src);
//		$("#toggCheckSet").val("1");
//	}
//});
