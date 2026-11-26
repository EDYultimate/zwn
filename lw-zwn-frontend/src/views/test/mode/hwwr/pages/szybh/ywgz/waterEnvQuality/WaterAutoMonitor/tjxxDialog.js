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
  const param = {
    stnm: stnm,
    beginTm: $('#beginTm').val(),
    endTm: $('#endTm').val(),
    addvcd: addvcd,
    type: $('#type').val()
  }
  //	if(st_tp==2||st_tp==4){
  if (
    $('#beginTm').val() == null ||
    $('#beginTm').val() == '' ||
    $('#endTm').val() == null ||
    $('#endTm').val() == ''
  ) {
    alert('请选择时间段')
    return
  }
  //	}

  jQuery.getJSON(basePath + 'szybh/ywgz/getWaterAutoMonitorStat', param, function (list) {
    console.log('ssxxresult:', list)
    $('#tbody').empty()
    //		var list = result.data;
    const xName = []
    const yVAL = []
    const yIII = []

    if (list != null && list.length > 0) {
      let str = ''
      for (let i = 0; i < list.length; i++) {
        str +=
          '<tr>' +
          '<td>' +
          isNull(list[i].MONITOR_TIME) +
          '</td>' +
          '<td>' +
          isNull(list[i].VAL) +
          '</td>' +
          '</tr>'

        xName.push(isNull(list[i].MONITOR_TIME))
        yVAL.push(list[i].VAL)
        yIII.push('Ⅲ')
      }
      $('#tbody').empty().append(str)
    }

    let titleName
    if (1 == param.type) {
      titleName = '水质类别'
    } else if (2 == param.type) {
      titleName = '水温(℃)'
    } else if (3 == param.type) {
      titleName = 'PH(无量纲)'
    } else if (4 == param.type) {
      titleName = '溶解氧(mg/L)'
    } else if (5 == param.type) {
      titleName = '电导率(μS/cm)'
    } else if (6 == param.type) {
      titleName = '浊度(NTU)'
    } else if (7 == param.type) {
      titleName = '高锰酸盐指数(mg/L)'
    } else if (8 == param.type) {
      titleName = '氨氮(mg/L)'
    } else if (9 == param.type) {
      titleName = '总磷(mg/L)'
    } else if (10 == param.type) {
      titleName = '总氮(mg/L)'
    } else if (11 == param.type) {
      titleName = '叶绿素α(mg/L)'
    } else {
      titleName = '藻密度(cells/L)'
    }
    $('#titleName').text(titleName)
    if (1 == param.type) {
      echartsRealInfo(xName, yVAL, yIII)
    } else {
      echartsRealInfo2(xName, yVAL, titleName)
    }
  })
}

function echartsRealInfo(xName, yWaterType, yIII) {
  //		console.log("yWaterType ",yWaterType);
  //	console.log("yIII ",yIII);

  //	yWaterType = 'IV';
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
      height: 210
    },

    legend: [
      {
        left: '20',
        data: [{ name: '水质类别', icon: 'image://images/savewater/line1.png' }],
        itemWidth: 10,
        itemHeight: 3
      },
      {
        data: [{ name: 'Ⅲ类', icon: 'image://images/savewater/line2.png' }],
        left: '90',
        itemWidth: 10,
        itemHeight: 3
      }
    ],

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
        type: 'category',
        //	                    name: titleReal,
        boundaryGap: false,
        data: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', '劣Ⅴ']
        //	                    data: ['I', 'II', 'III', 'IV', 'V','劣V'],
        //	                    min: 0,
        //	                    max: 250,
        //	                    interval: 50,
        //	                    axisLabel: {
        //	                        formatter: '{value} ml'
        //	                    }
      }
    ],
    series: [
      {
        name: '水质类别',
        type: 'line',
        data: yWaterType,
        //					data: ['I'],

        itemStyle: {
          normal: {
            color: '#5178EA'
          }
        }
        //	                barWidth: 30
      },
      {
        name: 'III类',
        type: 'line',
        data: yIII,
        itemStyle: {
          normal: {
            color: '#ff6446'
          }
        }
      }
    ]
  }
  echarts.init(document.getElementById('rightDiv')).dispose()
  const myChartRealInfo = echarts.init(document.getElementById('rightDiv'))
  myChartRealInfo.setOption(option)
}

function echartsRealInfo2(xName, yWaterType, titleName) {
  //		console.log("yWaterType ",yWaterType);
  //	console.log("yIII ",yIII);

  //	yWaterType = 'IV';
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
      height: 210
    },

    legend: [
      {
        left: '20',
        data: [{ name: titleName, icon: 'image://images/savewater/line1.png' }],
        itemWidth: 10,
        itemHeight: 3
      }
      //		    {
      //		    	data: [
      //		                {name:'Ⅲ类',icon:'image://images/savewater/line2.png'},],
      //		        left: "90",
      //	            itemWidth: 10,itemHeight: 3
      //	            }
    ],

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
        //	                    "show" : true,
        axisLine: { onZero: false },
        //	                    name: titleReal,
        min: 0,
        max: 250
        //	                    interval: 50,
        //	                    axisLabel: {
        //	                        formatter: '{value} ml'
        //	                    }
      }
    ],
    series: [
      {
        name: titleName,
        type: 'line',
        data: yWaterType,
        //					data: ['I'],

        itemStyle: {
          normal: {
            color: '#5178EA'
          }
        }
        //	                barWidth: 30
      }
      //				{
      //					name: 'III类',
      //					type: 'line',
      //					data: yIII,
      //					itemStyle: {
      //	                    normal: {
      //	                        color: '#ff6446'
      //	                    }
      //	                }
      //				}
    ]
  }
  echarts.init(document.getElementById('rightDiv')).dispose()
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
