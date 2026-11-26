$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')

  //默认前7天, 初始化默认时间
  const curtDate = new Date()
  endtime = curtDate.Format('yyyy-MM')
  // 获取前90天日期
  const day = 365
  starttime = moment()
    .add(0 - day + 1, 'days')
    .format('YYYY-MM')
  // 填入时间查询
  $('#beginTm').val(starttime)
  $('#endTm').val(endtime)

  init()
})

function init() {
  const param = { stcd: stcd, btm: $('#beginTm').val(), etm: $('#endTm').val() }
  jQuery.getJSON(basePath + '/szybh/Rvorlkappraise/getZOrQByTm', param, function (result) {
    const list = result.data
    const col = result.col
    let colnm = ''
    if (col == 'AVZ') {
      $('#titleTd').text('水位(m)')
      colnm = '水位(m)'
    }
    if (col == 'AVQ') {
      $('#titleTd').text('流量(m³/s)')
      colnm = '流量(m³/s)'
    }

    if (list != null && list.length > 0) {
      let str = ''
      for (var i = list.length - 1; i >= 0; i--) {
        str +=
          '<tr>' +
          '<td>' +
          dateTimeSSFormate2(list[i].YM) +
          '</td>' +
          '<td>' +
          toFormateTm(list[i].PRDTP) +
          '</td>' +
          '<td>' +
          isNull(list[i][col]) +
          '</td>' +
          '</tr>'
      }
      $('#tbody').empty().append(str)
    }
    //
    const tms = []
    const vals = []
    for (var i = 0; i < list.length; ++i) {
      tms.push(dateTimeSSFormate2(list[i].YM))
      vals.push(list[i][col])
    }

    const option = {
      tooltip: {},
      legend: {
        data: [colnm]
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
          console.log(params)
          return params[0].name + '<br>' + params[0].seriesName + ':' + params[0].data
        }
      },
      xAxis: {
        type: 'category',

        axisTick: {
          show: false
        },
        data: tms
      },
      yAxis: {
        name: colnm
      },
      series: [
        {
          name: colnm,
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#9ad4d4'
              }
            }
          },
          data: vals
        }
      ]
    }
    const myChart_qs = echarts.init(document.getElementById('rightDiv'))
    myChart_qs.setOption(option)
  })
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
  //	var date = d.getDate();
  //	var day = d.getDay();
  //	var hours = d.getHours();
  //	var minutes = d.getMinutes();
  //	var seconds = d.getSeconds();
  //	var ms = d.getMilliseconds();
  let curDateTime = d.getFullYear()
  if (month > 9) {
    curDateTime = curDateTime + '-' + month
  } else {
    curDateTime = curDateTime + '-0' + month
  }
  //	if(date>9)
  //	curDateTime = curDateTime +"-"+date;
  //	else
  //	curDateTime = curDateTime +"-0"+date;
  //	if(hours>9)
  //	curDateTime = curDateTime +" "+hours;
  //	else
  //	curDateTime = curDateTime +" 0"+hours;
  //	if(minutes>9)
  //	curDateTime = curDateTime +":"+minutes;
  //	else
  //	curDateTime = curDateTime +":0"+minutes;
  //	if(seconds>9)
  //		curDateTime = curDateTime +":"+seconds;
  //		else
  //		curDateTime = curDateTime +":0"+seconds;
  //
  return curDateTime
}
