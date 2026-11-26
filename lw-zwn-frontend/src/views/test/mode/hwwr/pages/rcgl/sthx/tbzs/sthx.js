//表格行高
let trH

$(function () {
  initSthxTable()

  const bodyh = parseInt($(window).height()) - 58
  $('#sthDateDiv').css('height', bodyh + 'px')

  trH = (0.8 * bodyh) / 10
  $('#sthxTableDiv')
    .find('tr')
    .css('height', trH + 'px')

  /*$("#show_chg").change(function(){
		var id=$(this).val();*/
  $('.changeBtn').click(function () {
    const id = $(this).attr('id')
    //		$("#sthxEchartDiv").animate({width: 'toggle'});
    if (id == 'tubtn') {
      $('#sthxTableDiv').hide()
      $('#tubtn').attr('src', basePath + 'images/index/tu1.png')
      $('#tablebtn').attr('src', basePath + 'images/index/table2.png')
      $('#sthxEchartDiv').animate({ width: 'show' })
      $('#sthxTableDiv').animate({ width: 'hide' })
    } else if (id == 'tablebtn') {
      $('#sthxEchartDiv').hide()
      $('#tubtn').attr('src', basePath + 'images/index/tu2.png')
      $('#tablebtn').attr('src', basePath + 'images/index/table1.png')
      $('#sthxTableDiv').animate({ width: 'show' })
      $('#sthxEchartDiv').animate({ width: 'hide' })
    }
  })
})

// 保留3位小数
function toFixed(obj) {
  return (new Number(obj).toFixed(3) * 1000) / 1000
}

function editSthxNm(nm) {
  if (nm.indexOf('北京') != -1) {
    return '京'
  }
  if (nm.indexOf('天津') != -1) {
    return '津'
  }
  if (nm.indexOf('河北') != -1) {
    return '冀'
  }
  if (nm.indexOf('山西') != -1) {
    return '晋'
  }
  if (nm.indexOf('河南') != -1) {
    return '豫'
  }
  if (nm.indexOf('山东') != -1) {
    return '鲁'
  }
  if (nm.indexOf('内蒙') != -1) {
    return '蒙'
  }
  if (nm.indexOf('辽宁') != -1) {
    return '辽'
  }
}

function isNull(vad) {
  if (vad == undefined || vad == null || vad == '' || vad == 'undefined' || vad == 'null') {
    return ''
  }
  return vad
}

function initSthxTable() {
  //
  const zlChart = echarts.init(document.getElementById('sthxyszlDiv'))
  const gyChart = echarts.init(document.getElementById('sthxgyysDiv'))
  const nyChart = echarts.init(document.getElementById('sthxnyblDiv'))
  const sgnqChart = echarts.init(document.getElementById('sthxsgnqdbDiv'))
  let sthxtable =
    "<table width='100%' border='0' cellpadding='0' cellspacing='0' class='list_table' style='border-left:0px;border-bottom:0px;'>" +
    "<tr class='titleTr'>" +
    "<th rowspan='2'>分区</th>" +
    "<th colspan='2'>用水总量(亿m³)</th>" +
    "<th colspan='2'>万元工业(亿m³)</th>" +
    "<th colspan='2'>农田灌溉(%)</th>" +
    "<th colspan='2'>水功能区达标(%)</th>" +
    "<th rowspan='2'>评分</th>" +
    '</tr>' +
    "<tr class='titleTr'>" +
    '<th>目标值</th>' +
    '<th>实际值</th>' +
    '<th>目标值</th>' +
    '<th>实际值</th>' +
    '<th>目标值</th>' +
    '<th>实际值</th>' +
    '<th>目标值</th>' +
    '<th>实际值</th>' +
    '</tr>'
  const dt = $('#sthxDate').val()
  $.getJSON(basePath + '/rcgl/sthx/getSthxData', { tm: dt }, function (data) {
    const dt = data.dt
    $('#sthxDate').val(dt)
    const listMap = data.result
    const xzq = []
    const yszlmb = [] //用水总量目标
    const gyysmb = [] //用水总量实际
    const yszlsj = [] //工业用水目标
    const gyyssj = [] //工业用水实际
    const nymb = []
    const nysj = []
    const sgnqmb = []
    const sgnqsj = []
    for (let i = 0; i < listMap.length; i++) {
      xzq.push(editSthxNm(listMap[i].ADDVNM))
      yszlmb.push(isNull(listMap[i].YSZLMB))
      gyysmb.push(isNull(listMap[i].GYNDMB))
      yszlsj.push(isNull(listMap[i].YSZLSJ))
      gyyssj.push(isNull(listMap[i].GYNDSJ))
      nymb.push(toFixed(isNull(listMap[i].NTLYMB) / 100))
      nysj.push(toFixed(isNull(listMap[i].NTLYSJ) / 100))
      sgnqmb.push(isNull(listMap[i].SGNQMB))
      sgnqsj.push(isNull(listMap[i].SGNQSJ))
      if (i % 2 != 0) {
        sthxtable +=
          "<tr style='background:#f6f9fb;' class='tr' onmouseover=\"this.style.backgroundColor='#fff4e3'\"" +
          'onmouseout="this.style.backgroundColor=\'#f6f9fb\'">'
      } else {
        sthxtable +=
          "<tr class='tr' onmouseover=\"this.style.backgroundColor='#fff4e3'\"" +
          'onmouseout="this.style.backgroundColor=\'rgb(255, 255, 255)\'">'
      }
      sthxtable +=
        "<td class='td_center'>" +
        isNull(listMap[i].ADDVNM, null) +
        '</td>' +
        "<td class='td_center'>" +
        isNull(listMap[i].YSZLMB, null) +
        '</td>' +
        "<td class='td_center'>" +
        isNull(listMap[i].YSZLSJ, null) +
        '</td>' +
        "<td class='td_center'>" +
        isNull(listMap[i].GYNDMB, null) +
        '</td>' +
        "<td class='td_center'>" +
        isNull(listMap[i].GYNDSJ, null) +
        '</td>' +
        "<td class='td_center'>" +
        isNull(listMap[i].NTLYMB, 1) +
        '</td>' +
        "<td class='td_center'>" +
        isNull(listMap[i].NTLYSJ, 1) +
        '</td>' +
        "<td class='td_center'>" +
        isNull(listMap[i].SGNQMB, 1) +
        '</td>' +
        "<td class='td_center'>" +
        isNull(listMap[i].SGNQSJ, 1) +
        '</td>' +
        "<td class='td_center'>" +
        isNull(listMap[i].ZDF, null) +
        '</td>' +
        '</tr>'
    }
    sthxtable += '</table>'

    option = {
      title: {
        text: '用水总量',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 14
        },
        left: '10%'
      },
      legend: {
        data: ['目标', '实际'],
        right: '0%'
      },
      color: ['#1ba9fe', '#ffa58b'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      calculable: true,
      grid: {
        top: '22%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          splitLine: { show: false }, //去除网格线
          type: 'category',
          data: xzq
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value}亿m³'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#ced7e0'],
              width: 0.5,
              type: 'solid'
            }
          }
        }
      ],
      series: [
        {
          name: '目标',
          type: 'line',
          data: yszlmb
        },
        {
          name: '实际',
          type: 'bar',
          barMaxWidth: 18,
          data: yszlsj
        }
      ]
    }
    option2 = {
      title: {
        text: '万元工业增加值用水量降幅',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 14
        },
        left: '10%'
      },
      legend: {
        data: ['目标', '实际'],
        right: '0%'
      },
      color: ['#b598fb', '#3ac7f3'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      calculable: true,
      grid: {
        top: '22%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          splitLine: { show: false }, //去除网格线
          type: 'category',
          data: xzq
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#ced7e0'],
              width: 0.5,
              type: 'solid'
            }
          }
        }
      ],
      series: [
        {
          name: '目标',
          type: 'line',
          data: gyysmb
        },
        {
          name: '实际',
          type: 'bar',
          barMaxWidth: 18,
          data: gyyssj
        }
      ]
    }
    option3 = {
      title: {
        text: '农田灌溉水有效利用系数',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 14
        },
        left: '10%'
      },
      legend: {
        data: ['目标', '实际'],
        right: '0%'
      },
      color: ['#ff6641', '#c2a8ff'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      calculable: true,
      grid: {
        top: '22%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          splitLine: { show: false }, //去除网格线
          type: 'category',
          data: xzq
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#ced7e0'],
              width: 0.5,
              type: 'solid'
            }
          }
        }
      ],
      series: [
        {
          name: '目标',
          type: 'line',
          data: nymb
        },
        {
          name: '实际',
          type: 'bar',
          barMaxWidth: 18,
          data: nysj
        }
      ]
    }
    option4 = {
      title: {
        text: '水功能区达标率',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 14
        },
        left: '10%'
      },
      legend: {
        data: ['目标', '实际'],
        right: '0%'
      },
      color: ['#ff9908', '#74d563'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      calculable: true,
      grid: {
        top: '22%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          splitLine: { show: false }, //去除网格线
          type: 'category',
          data: xzq
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#ced7e0'],
              width: 0.5,
              type: 'solid'
            }
          }
        }
      ],
      series: [
        {
          name: '目标',
          type: 'line',
          data: sgnqmb
        },
        {
          name: '实际',
          type: 'bar',
          barMaxWidth: 18,
          data: sgnqsj
        }
      ]
    }
    zlChart.setOption(option)
    gyChart.setOption(option2)
    nyChart.setOption(option3)
    sgnqChart.setOption(option4)
    console.log(trH)
    debugger
    $('#sthxTableDiv').html(sthxtable)
    $('#sthxTableDiv')
      .find('tr')
      .css('height', trH + 'px')
    $('#sthLoadDiv').hide()
  })
}

function add() {
  layer.open({
    type: 2,
    title: '录入',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['975px', '650px'],
    content: basePath + 'pages/rcgl/sthx/tbzs/dialog/add.jsp?sthxDate=' + $('#sthxDate').val()
  })
}
