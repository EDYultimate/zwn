//
$(function () {
  //	var bodyDivWidth = $("#mainDiv").css("width");
  //	var bodyleftWidth = $("#leftDiv").css("width");
  //	var bodyrightWidth = parseInt(bodyDivWidth)-parseInt(bodyleftWidth)-2;
  //	$("#rightDiv").css("width",bodyrightWidth+"px");

  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth - 38 + 'px')

  //默认前7天, 初始化默认时间
  // 初始化默认时间
  const curtDate = new Date()
  const endtime = curtDate.Format('yyyy-MM-dd')
  // 获取前7天日期
  const day = 20
  starttime = moment()
    .add(0 - day + 1, 'days')
    .format('YYYY-MM-DD')
  // 填入时间查询
  $('#beginTm').val(starttime)
  $('#endTm').val(endtime)

  init()
})

function init() {
  const param = { STCD: stcd, btm: $('#beginTm').val(), etm: $('#endTm').val(), ST_TP: st_tp }
  if (st_tp == 2 || st_tp == 4) {
    if (
      $('#beginTm').val() == null ||
      $('#beginTm').val() == '' ||
      $('#endTm').val() == null ||
      $('#endTm').val() == ''
    ) {
      alert('请选择时间段')
      return
    }
  }

  if (stcd == '30806201') {
    $('#zlz_input').css('display', 'inline')
    $('#zbtjfx_img').css('margin-left', '8')
  } else {
    $('#zlz_input').css('display', 'none')
  }

  if (stcd == '31001000') {
    $('#jxz_input').css('display', 'inline')
  } else {
    $('#jxz_input').css('display', 'none')
  }
  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterEcologyFlowMapRealInfo',
    param,
    function (result) {
      console.log('ssxxresult:', result)
      $('#tbody').empty()
      const list = result.data

      let minSW
      let minSWTime
      let minLL
      let minLLTime
      let sumSL

      //		if(1 == result.ST_TP){   //如果是考核断面 只显示考核的指标
      if (list != null && list.length > 0) {
        minSW = list[0].SHUIWEI
        minSWTime = list[0].NEWDATE

        minLL = list[0].LIULIANG
        minLLTime = list[0].NEWDATE
        sumSL = 0
        let str = ''
        for (var i = 0; i < list.length; i++) {
          str +=
            '<tr>' +
            '<td>' +
            isNull(list[i].NEWDATE) +
            '</td>' +
            '<td>' +
            isNull(list[i].SHUIWEI) +
            '</td>' +
            '<td>' +
            isNull(list[i].LIULIANG) +
            '</td>' +
            '<td>' +
            isNull(list[i].SHUILIANG) +
            '</td>' +
            '</tr>'
          if (isNull(list[i].SHUIWEI) != '-' && minSW > list[i].SHUIWEI) {
            minSW = list[i].SHUIWEI
            minSWTime = list[i].NEWDATE
          }
          if (minLL > list[i].LIULIANG) {
            minLL = list[i].LIULIANG
            minLLTime = list[i].NEWDATE
          }
          console.log('parseFloat(list[i].SHUILIANG) ', parseFloat(list[i].SHUILIANG))
          sumSL = sumSL + parseFloat(list[i].SHUILIANG)
        }
        $('#tbody').empty().append(str)
        //				if(){
        //
        //				}else{
        $('#statValDiv1').html(
          "<span style=''>" +
            isNull(minSW) +
            "</span><br><span style='font-size:10'>" +
            minSWTime +
            '</span>'
        )
        //				}
        $('#statValDiv2').html(
          "<span style=''>" +
            isNull(minLL) +
            "</span><br><span style='font-size:10'>" +
            minLLTime +
            '</span>'
        )
        $('#statValDiv3').html(isNull(parseFloat(sumSL).toFixed(2)))
      }
      //			var titleASS_TAR;
      //			if(1==result.ASS_TAR){
      //				titleASS_TAR = "水位";
      ////				$("#titleASS_TAR").text("水位");
      //			}else if(2==result.ASS_TAR){
      //				titleASS_TAR = "水量";
      //			}else{
      //				titleASS_TAR = "流量";
      //			}
      //			$("#titleASS_TAR").text(titleASS_TAR);

      const xName = []
      const ySHUIWEI = []
      const yLIULIANG = []
      const ySHUILIANG = []

      if (list != null && list.length > 0) {
        for (var i = 0; i < list.length; ++i) {
          xName.push(isNull(list[i].NEWDATE))
          ySHUIWEI.push(list[i].SHUIWEI)
          yLIULIANG.push(list[i].LIULIANG)
          ySHUILIANG.push(list[i].SHUILIANG)
        }
      }
      echartsRealInfo(xName, ySHUIWEI, yLIULIANG, ySHUILIANG)
    }
  )
}

function ref_section() {
  console.log(1)
  if (stcd == '30806201') {
    top.layer.open({
      type: 2,
      title: '枣林庄断面信息统计',
      closeBtn: 1,
      shade: 0.3,
      // maxmin: true,
      area: ['1000px', '450px'],
      content:
        basePath +
        'pages/szybh/ywgz/ecologyFlow/map/zlz_ssxxDialog.jsp?stcd=' +
        stcd +
        '&btm=' +
        $('#beginTm').val() +
        '&etm=' +
        $('#endTm').val()
    })
  } else if (stcd == '31001000') {
    top.layer.open({
      type: 2,
      title: '九宣闸(南)下信息统计',
      closeBtn: 1,
      shade: 0.3,
      // maxmin: true,
      area: ['1000px', '450px'],
      content:
        basePath +
        'pages/szybh/ywgz/ecologyFlow/map/jxz_ssxxDialog.jsp?stcd=' +
        stcd +
        '&btm=' +
        $('#beginTm').val() +
        '&etm=' +
        $('#endTm').val()
    })
  }
}

function echartsRealInfo(xName, ySHUIWEI, yLIULIANG, ySHUILIANG) {
  const colors = ['#3cceb1', '#51BBFF', '#FF6600']
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    grid: {
      height: 210,
      width: 550
    },
    legend: {
      //			        data: [legendName],
      //			        data: "图例",
      data: ['水位', '流量', '水量']
      //			        x:"left",
      //	                left: "50",
      //			        padding:[0, 0,0,53]
      //			        icon:'image://images/savewater/bar.png',
      //			        itemWidth: 10,
      //		            itemHeight: 10
    },
    xAxis: [
      {
        type: 'category',
        data: xName,
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '水位',
        //		                    min: 0,
        //		                    max: 25,
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[0]
          }
        },
        axisLabel: {
          formatter: '{value} m'
        }
      },
      {
        type: 'value',
        name: '流量',
        //		                    min: 0,
        //		                    max: 100,
        position: 'right',
        offset: 50,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[1]
          }
        },
        axisLabel: {
          formatter: '{value} m³/s'
        }
      },
      {
        type: 'value',
        name: '水量',
        //		                    min: 0,
        //		                    max: 1000,
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[2]
          }
        },
        axisLabel: {
          formatter: '{value} m³'
        }
      }
    ],
    series: [
      {
        name: '水位',
        type: 'line',
        data: ySHUIWEI,
        itemStyle: {
          normal: {
            color: '#3cceb1'
          }
        }
      },
      {
        name: '流量',
        type: 'line',
        yAxisIndex: 1,
        data: yLIULIANG,
        itemStyle: {
          normal: {
            color: '#51BBFF'
          }
        }
      },
      {
        name: '水量',
        type: 'bar',
        yAxisIndex: 2,
        data: ySHUILIANG,
        itemStyle: {
          normal: {
            color: '#FF6600'
          }
        }
      }
      //	                     {
      //							name: legendName,
      //							type: 'line',
      //							data: yREALVAL,
      //							itemStyle: {
      //			                    normal: {
      //			                        color: '#3cceb1'
      //			                    }
      //			                },
      //		//	                barWidth: 50
      //	                     }
    ]
  }
  echarts.init(document.getElementById('rightDiv')).dispose()
  const myChartRealInfo = echarts.init(document.getElementById('rightDiv'))
  myChartRealInfo.setOption(option)
}

function echartsRealInfo2(xName, yREALVAL, yREALVAL2) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },

    legend: {
      data: ['水位', '流量']
    },
    xAxis: [
      {
        type: 'category',
        data: xName,
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '水位',
        axisLabel: {
          //		                        formatter: '{value} ml'
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '流量',
        axisLabel: {
          //		                        formatter: '{value} ml'
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: '水位',
        type: 'line',
        data: yREALVAL,
        itemStyle: {
          normal: {
            color: '#3cceb1'
          }
        },
        barWidth: 50
      },
      {
        name: '流量',
        type: 'line',
        data: yREALVAL2,
        itemStyle: {
          normal: {
            color: '#ff6446'
          }
        }
      }
    ]
  }
  const myChartRealInfo = echarts.init(document.getElementById('rightDiv'))
  myChartRealInfo.setOption(option)
}

function toFormateTm(val) {
  if (val == '1') {
    return '上旬'
  }
  if (val == '2') {
    return '中旬'
  }
  if (val == '3') {
    return '下旬'
  }
  if (val == '4') {
    return '月'
  }
}

function dateTimeSSFormate2(tm) {
  if (tm == undefined || tm == null || tm == '' || tm == 'undefined' || tm == 'null') {
    return ''
  }
  const d = new Date(tm)
  const year = d.getYear()
  const month = d.getMonth() + 1
  const date = d.getDate()
  const day = d.getDay()
  const hours = d.getHours()
  const minutes = d.getMinutes()
  const seconds = d.getSeconds()
  const ms = d.getMilliseconds()
  let curDateTime = d.getFullYear()
  if (month > 9) {
    curDateTime = curDateTime + '-' + month
  } else {
    curDateTime = curDateTime + '-0' + month
  }
  if (date > 9) {
    curDateTime = curDateTime + '-' + date
  } else {
    curDateTime = curDateTime + '-0' + date
  }
  if (hours > 9) {
    curDateTime = curDateTime + ' ' + hours
  } else {
    curDateTime = curDateTime + ' 0' + hours
  }
  if (minutes > 9) {
    curDateTime = curDateTime + ':' + minutes
  } else {
    curDateTime = curDateTime + ':0' + minutes
  }
  if (seconds > 9) {
    curDateTime = curDateTime + ':' + seconds
  } else {
    curDateTime = curDateTime + ':0' + seconds
  }

  return curDateTime
}
