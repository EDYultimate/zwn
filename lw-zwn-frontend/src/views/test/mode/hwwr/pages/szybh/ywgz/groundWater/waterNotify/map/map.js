//var layerdata = {};
let param = {}
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
//			layer.open({
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

  //  $.fn.zTree.init($("#treeDemoCheck"), setting, zNodes);

  //    search(1);

  pageSize = 10

  const maicang = $('input[type=radio]:checked').val()
  const year = 2021
  const season = 2
  //缺乏判断季度的代码
  $('#seasonId').val(year + '年' + season + '季度')
  getWaterLevel(year, season, maicang)
  getCollectCity(year, season, maicang)
  //	console.log("aaa",maicang);

  search(year, season, maicang)
  readyCall() //页面第一次加载时给GIS传递数据
})

//function bbb(){
//	console.log("aaa");
//}
//$("input[id=seasonId]").change(function () {
//	console.log("ccc");
////    console.log("seasonId",$("input[id=seasonId]").val());
//});

//$("input").blur(function(){
//	console.log("ccc");
//
//});
$('input[name=radio]').click(function () {
  //    console.log("radio",$("input[type=radio]:checked").val());
  param = {}

  param.year = $('#seasonId').val().substring(0, 4)
  param.season = $('#seasonId').val().charAt(5)
  param.maicang = $('input[type=radio]:checked').val()

  //    console.log("radio",param.year,param.season,param.maicang);

  getWaterLevel(param.year, param.season, param.maicang)
  getCollectCity(param.year, param.season, param.maicang)
  search(param.year, param.season, param.maicang)
  readyCall()
})

function getWaterLevel(year, season, maicang) {
  param.year = year
  param.season = season
  param.maicang = maicang
  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterGroundWaterWaterLevelInfo',
    param,
    function (result) {
      $('#up').text('-')
      $('#stable').text('-')
      $('#down').text('-')
      $('#downPlus').text('-')
      const waterLevelMap = []
      for (let i = 0; i < result.length; i++) {
        if (result[i].NAME != null) {
          const tmp = {}
          tmp.name = result[i].NAME
          tmp.value = result[i].VALUE
          switch (result[i].NAME) {
            case 1:
              $('#up').text(result[i].VALUE)
              var colorObj = { color: '#51bbff' }
              tmp.itemStyle = colorObj
              break
            case 2:
              $('#stable').text(result[i].VALUE)
              var colorObj = { color: '#fffc00' }
              tmp.itemStyle = colorObj
              break
            case 3:
              $('#down').text(result[i].VALUE)
              var colorObj = { color: '#ffc44d' }
              tmp.itemStyle = colorObj
              break
            case 4:
              $('#downPlus').text(result[i].VALUE)
              var colorObj = { color: '#ee6666' }
              tmp.itemStyle = colorObj
              break
          }
          waterLevelMap.push(tmp)
        }
      }

      if (waterLevelMap.length == 0) {
        //    		$("#waterLevelDiv").empty();
        //    		var myChartWaterLevel = echarts.init(document.getElementById('waterLevelDiv'));
        //    		myChartWaterLevel.clear();
        echarts.init(document.getElementById('waterLevelDiv')).dispose() //销毁前一个实例
        $('#waterLevelSpan').css('display', 'block')
        $('#waterLevelSpan').html('暂无数据')
        $('#totalNum').text('总数：-个')
        $('#up').text('-')
        $('#stable').text('-')
        $('#down').text('-')
        $('#downPlus').text('-')
      } else {
        $('#waterLevelSpan').css('display', 'none')

        echartsWaterLevel(waterLevelMap)
        const totalNum =
          parseInt(isNull2($('#up').text())) +
          parseInt(isNull2($('#stable').text())) +
          parseInt(isNull2($('#down').text())) +
          parseInt(isNull2($('#downPlus').text()))
        $('#totalNum').text('总数：' + totalNum + '个')
      }
    }
  )
}

function isNull2(vad) {
  if (vad === '-') {
    return 0
  }
  return vad
}

function echartsWaterLevel(echartlevelCountArr) {
  option = {
    //			color:['#51bbff', '#fffc00', '#ffc44d','#ee6666'],
    series: [
      {
        name: '半径模式',
        type: 'pie',
        radius: [10, 53],
        //		            roseType: 'radius',
        itemStyle: {
          borderRadius: 5
        },
        label: {
          show: false
        },
        //		            data: [40,33,28,22]
        data: echartlevelCountArr
        //		            data: [{value: 1,itemStyle:{color:'#51bbff'}},{value: 1,itemStyle:{color:'#ffc44d'}}]
      }
    ]
  }

  const myChartWaterLevel = echarts.init(document.getElementById('waterLevelDiv'))
  myChartWaterLevel.setOption(option)
}

function getCollectCity(year, season, maicang) {
  param = {}
  param.year = year
  param.season = season
  param.maicang = maicang
  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterGroundWaterCollectCityInfo',
    param,
    function (result) {
      //        console.log("result  ",result);
      const xCityName = []
      const yCount = []

      for (let i = 0; i < result.length; i++) {
        xCityName.push(result[i].AD_NM)
        yCount.push(result[i].COUNT)
      }
      echartsCollectCity(xCityName, yCount)
    }
  )
}

function echartsCollectCity(xCityName, yCount) {
  option = {
    grid: {
      height: 100,
      top: 30,
      left: 50
    },
    tooltip: {
      show: true
    },
    xAxis: {
      type: 'category',
      //		        data: ['北京', '河北', '山西', '河南', '山东', '内蒙', '辽宁']
      data: xCityName
    },
    yAxis: {
      type: 'value',
      name: '市（地）数量',
      axisLabel: {
        formatter: '{value} 个'
      }
    },
    series: [
      {
        //		        data: [120, 200, 150, 80, 70, 110, 130],
        data: yCount,

        type: 'bar'
      }
    ]
  }

  const myChartCollectCity = echarts.init(document.getElementById('collectCityDiv'))
  myChartCollectCity.setOption(option)
}

function search(year, season, maicang) {
  let tbodyStr = ''
  param = {}
  param.year = year
  param.season = season
  param.maicang = maicang
  param.pageSize = pageSize
  param.pageNo = 1
  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterwaterNotifyDetailInfo',
    param,
    function (result) {
      //	    console.log("map waterNotifyDetailInfo:",result);
      const data = result.page.list
      if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          tbodyStr +=
            '<tr>' +
            "<td title='" +
            isNull(data[i].RANK) +
            "'  >" +
            isNull(data[i].RANK) +
            '</td>' +
            "<td title='" +
            isNull(data[i].AD_NM) +
            "' >" +
            isNull(data[i].AD_NM) +
            '</td>' +
            "<td title='" +
            isNull(data[i].PROVINCE) +
            "'  >" +
            isNull(data[i].PROVINCE) +
            '</td>' +
            "<td title='" +
            isNull(data[i].Z) +
            "'  >" +
            isNull(data[i].Z) +
            '</td>' +
            //	            "<td title='"+isNull(data[i].TYPE)+"'  >"+isNull(data[i].TYPE)+"</td>" +
            '</tr>'
        }
        for (let x = data.length; x < pageSize; x++) {
          tbodyStr +=
            '<tr>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            //	                "<td></td>" +
            '</tr>'
        }
      } else {
        for (var i = 0; i < pageSize; i++) {
          tbodyStr +=
            '<tr>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            //	            "<td></td>" +
            '</tr>'
        }
      }
      //	    $("#TableData").empty().append(tbodyStr);
      $('#tbody').empty().append(tbodyStr)
    }
  )
}

$('#query_arrow_div').click(function () {
  const getBodyW = document.body.clientWidth //得到body宽
  //	console.log("aaa");
  $('#nianFenInput').val('2021')
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
    title: '地下水通报详细信息',
    shadeClose: false,
    shade: 0.2,
    //	      offset: '60px',
    maxmin: false, //开启最大化最小化按钮
    area: ['1300px', '650px'],
    content:
      basePath + '/pages/szybh/ywgz/groundWater/waterNotify/waterNotifyDetail/waterNotifyDetail.jsp'
  })
})

function readyCall() {
  param = {}
  param.year = $('#seasonId').val().substring(0, 4)
  param.season = $('#seasonId').val().charAt(5)
  param.maicang = $('input[type=radio]:checked').val()
  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterEcologyFlowWarnDetailInfoGis',
    param,
    function (result) {
      document.getElementById('gismap').contentWindow.getData(result)
    }
  )
}
