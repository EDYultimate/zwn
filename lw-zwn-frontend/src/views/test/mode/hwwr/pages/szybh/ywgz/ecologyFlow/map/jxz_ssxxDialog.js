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
  //	var curtDate = new Date();
  //	var endtime = curtDate.Format("yyyy-MM-dd");
  //	// 获取前7天日期
  //	var day = 20;
  //	starttime =  moment().add(0-day+1, 'days').format('YYYY-MM-DD');
  // 填入时间查询
  $('#beginTm').val(btm)
  $('#endTm').val(etm)

  init()
})

function init() {
  if (
    $('#beginTm').val() == null ||
    $('#beginTm').val() == '' ||
    $('#endTm').val() == null ||
    $('#endTm').val() == ''
  ) {
    alert('请选择时间段')
    return
  }

  const param = { STCD: 31001001, btm: $('#beginTm').val(), etm: $('#endTm').val(), ST_TP: 2 }

  //	var param = {"btm":'2021-12-19',"etm":'2021-12-21'};

  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterEcologyFlowMapRealInfo',
    param,
    function (result) {
      console.log('ssxxresult:', result)
      $('#tbody').empty()
      const list = result.data
      const xName = []
      const ySHUIWEI = []
      const yLIULIANG = []
      if (list != null && list.length > 0) {
        let str = ''
        for (let i = 0; i < list.length; i++) {
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
            '</tr>'
          xName.push(isNull(list[i].NEWDATE))

          ySHUIWEI.push(isNull(list[i].SHUIWEI))
          yLIULIANG.push(isNull(list[i].LIULIANG))
        }
        $('#tbody').empty().append(str)
      }

      echartsRealInfo(xName, ySHUIWEI, yLIULIANG)
    }
  )
}

function echartsRealInfo(xName, ySHUIWEI, yLIULIANG) {
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
    legend: {
      data: ['水位', '流量']
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
        //		                    name: '下泄水量',
        axisLabel: {
          //		                        formatter: '{value} ml'
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: '水位',
        type: 'bar',
        data: ySHUIWEI,
        itemStyle: {
          normal: {
            color: '#3cceb1'
          }
        },
        barWidth: 50
      },
      {
        name: '流量',
        type: 'bar',
        data: yLIULIANG,
        itemStyle: {
          normal: {
            color: '#A3FF00'
          }
        },
        barWidth: 50
      }
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
