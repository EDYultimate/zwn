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

  //  $.fn.zTree.init($("#treeDemoCheck"), setting, zNodes);

  //    search(1);

  //	$("#hhProtectDiv").hover(() => {
  //		  console.log(1);
  //		  });

  $('#hhProtectDiv').mouseenter(function (e) {
    $('#hhProtectDiv').css('border', '3px solid #237bff')
    $('#hhProtectImg').attr('src', 'images/savewater/otherKeyAreaBGProtect2.png')
  })
  $('#hhProtectDiv').mouseleave(function (e) {
    $('#hhProtectDiv').css('border', '3px solid #e4e4e4')
    $('#hhProtectImg').attr('src', 'images/savewater/otherKeyAreaBGProtect.png')
  })

  $('#eedsProtectDiv').mouseenter(function (e) {
    $('#eedsProtectDiv').css('border', '3px solid #237bff')
    $('#eedsProtectImg').attr('src', 'images/savewater/otherKeyAreaBGProtect2.png')
  })
  $('#eedsProtectDiv').mouseleave(function (e) {
    $('#eedsProtectDiv').css('border', '3px solid #e4e4e4')
    $('#eedsProtectImg').attr('src', 'images/savewater/otherKeyAreaBGProtect.png')
  })

  $('#fwProtectDiv').mouseenter(function (e) {
    $('#fwProtectDiv').css('border', '3px solid #237bff')
    $('#fwProtectImg').attr('src', 'images/savewater/otherKeyAreaBGProtect2.png')
  })
  $('#fwProtectDiv').mouseleave(function (e) {
    $('#fwProtectDiv').css('border', '3px solid #e4e4e4')
    $('#fwProtectImg').attr('src', 'images/savewater/otherKeyAreaBGProtect.png')
  })
  //	echartsWaterLevel(1);
  //	echartsCollectCity(2);
})

function echartsWaterLevel(data) {
  option = {
    color: ['#51bbff', '#fffc00', '#ffc44d', '#ee6666'],
    series: [
      {
        name: '半径模式',
        type: 'pie',
        radius: [10, 53],
        center: ['25%', '50%'],
        roseType: 'radius',
        itemStyle: {
          borderRadius: 5
        },
        label: {
          show: false
        },
        data: [
          { value: 40, name: 'rose 1' },
          { value: 33, name: 'rose 2' },
          { value: 28, name: 'rose 3' },
          { value: 22, name: 'rose 4' }
        ]
      }
    ]
  }

  const myChartWaterLevel = echarts.init(document.getElementById('waterLevelDiv'))
  myChartWaterLevel.setOption(option)
}

function echartsCollectCity(data) {
  option = {
    grid: {
      height: 100,
      top: 30,
      left: 50
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value',
      name: '市（地）数量',
      axisLabel: {
        formatter: '{value} ml'
      }
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }
    ]
  }

  const myChartCollectCity = echarts.init(document.getElementById('collectCityDiv'))
  myChartCollectCity.setOption(option)
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
  layer.open({
    type: 2,
    title: '地下水通报详细信息',
    shadeClose: false,
    shade: 0.2,
    offset: '60px',
    maxmin: false, //开启最大化最小化按钮
    area: ['1500px', '660px'],
    content:
      basePath + '/pages/szybh/ywgz/groundWater/waterNotify/waterNotifyDetail/waterNotifyDetail.jsp'
  })
})
