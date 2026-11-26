$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  //	$("#rightDiv").css("width",bodyrightWidth-38+"px");

  //默认前7天, 初始化默认时间
  const curtDate = new Date()
  const curtYear = curtDate.Format('yyyy-MM')
  // 获取前90天日期
  //	var day = 365;
  //	starttime =  moment().add(0-day+1, 'days').format('YYYY-MM');
  // 填入时间查询
  $('#beginTm').val('2021-01')
  $('#endTm').val(curtYear)

  //	$('#endTm').val(endtime);

  init()
})

function init() {
  let tbodyStr = ''
  const param = { RV_CD: RV_CD, beginTm: $('#beginTm').val(), endTm: $('#endTm').val() }
  console.log('iniinitinitinitt:', param)

  //只有考核断面显示这个页面
  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterGroundWaterNorthDetailBSXQInfo',
    param,
    function (result) {
      console.log('BSXQInfo:', result)
      const xName = []
      const yNAISHUIZHONG = []
      const yNAISHUIDONG = []
      const yYINHUANG = []
      const yYINLUAN = []
      const ySHANGYOU = []
      const yZAISHENG = []
      const yHEJI = []

      const data = result.data
      if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          tbodyStr +=
            '<tr>' +
            "<td title='" +
            isNull(data[i].RV_NM) +
            "'>" +
            isNull(data[i].YR + '-' + data[i].MON) +
            '</td>' +
            "<td title='" +
            isNull(data[i].NAISHUIZHONG) +
            "'>" +
            isNull(data[i].NAISHUIZHONG) +
            '</td>' +
            "<td title='" +
            isNull(data[i].NAISHUIDONG) +
            "'>" +
            isNull(data[i].NAISHUIDONG) +
            '</td>' +
            "<td title='" +
            isNull(data[i].YINHUANG) +
            "'>" +
            isNull(data[i].YINHUANG) +
            '</td>' +
            "<td title='" +
            isNull(data[i].YINLUAN) +
            "'>" +
            isNull(data[i].YINLUAN) +
            '</td>' +
            "<td title='" +
            isNull(data[i].SHANGYOU) +
            "'>" +
            isNull(data[i].SHANGYOU) +
            '</td>' +
            "<td title='" +
            isNull(data[i].ZAISHENG) +
            "'>" +
            isNull(data[i].ZAISHENG) +
            '</td>' +
            "<td title='" +
            isNull(data[i].HEJI) +
            "'>" +
            isNull(data[i].HEJI) +
            '</td>' +
            '</tr>'
          xName.push(isNull(data[i].YR + '-' + data[i].MON))
          yNAISHUIZHONG.push(data[i].NAISHUIZHONG)
          yNAISHUIDONG.push(isNull(data[i].NAISHUIDONG))
          yYINHUANG.push(isNull(data[i].YINHUANG))
          yYINLUAN.push(isNull(data[i].YINLUAN))
          ySHANGYOU.push(isNull(data[i].SHANGYOU))
          yZAISHENG.push(isNull(data[i].ZAISHENG))
          yHEJI.push(isNull(data[i].HEJI))
        }
        for (let x = data.length; x < 6; x++) {
          tbodyStr +=
            '<tr>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '</tr>'
        }
      } else {
        for (var i = 0; i < 6; i++) {
          tbodyStr +=
            '<tr>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '</tr>'
        }
      }
      $('#tbody').empty().append(tbodyStr)

      echartsBSXQ(
        xName,
        yNAISHUIZHONG,
        yNAISHUIDONG,
        yYINHUANG,
        yYINLUAN,
        ySHANGYOU,
        yZAISHENG,
        yHEJI
      )
    }
  )
}

function echartsBSXQ(
  xName,
  yNAISHUIZHONG,
  yNAISHUIDONG,
  yYINHUANG,
  yYINLUAN,
  ySHANGYOU,
  yZAISHENG,
  yHEJI
) {
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
      height: 150,
      width: 600
    },
    legend: {
      data: ['合计', '中线', '东线', '引黄', '引滦', '上游水库', '再生水']
    },
    //		    legend: [{
    //                left: 'auto',
    //		        data: [ {name:'实际值',icon:'image://images/savewater/line1.png',}],
    //	            itemWidth: 10,
    //	            itemHeight:3
    //		    },{
    //		    	data: [
    //		                {name:'目标值',icon:'image://images/savewater/line2.png'},],
    //		        left: 'auto',
    //	            itemWidth: 10,itemHeight: 3
    //	            }],

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
        //	                    name: titleReal,
        name: '水量(亿m³)'

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
        name: '合计',
        smooth: true,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(204, 241, 253)'
            }
          ])
        },
        type: 'line',
        data: yHEJI,
        itemStyle: {
          normal: {
            color: '#3cceb1'
          }
        },
        barWidth: 50
      },
      {
        name: '中线',
        smooth: true,
        type: 'line',
        data: yNAISHUIZHONG
        //					itemStyle: {
        //	                    normal: {
        //	                        color: '#ff6446'
        //	                    }
        //	                }
      },
      {
        name: '东线',
        smooth: true,
        type: 'line',
        data: yNAISHUIDONG
        //					itemStyle: {
        //	                    normal: {
        //	                        color: '#ff6446'
        //	                    }
        //	                }
      },
      {
        name: '引黄',
        smooth: true,
        type: 'line',
        data: yNAISHUIDONG
        //					itemStyle: {
        //	                    normal: {
        //	                        color: '#ff6446'
        //	                    }
        //	                }
      },
      {
        name: '引滦',
        smooth: true,
        type: 'line',
        data: yYINLUAN
        //					itemStyle: {
        //	                    normal: {
        //	                        color: '#ff6446'
        //	                    }
        //	                }
      },
      {
        name: '上游水库',
        smooth: true,
        type: 'line',
        data: ySHANGYOU
        //					itemStyle: {
        //	                    normal: {
        //	                        color: '#ff6446'
        //	                    }
        //	                }
      },
      {
        name: '再生水',
        smooth: true,
        type: 'line',
        data: yZAISHENG
        //					itemStyle: {
        //	                    normal: {
        //	                        color: '#ff6446'
        //	                    }
        //	                }
      }
    ]
  }

  const myChartYearShuiLiang = echarts.init(document.getElementById('rightDiv'))
  myChartYearShuiLiang.setOption(option)
}

$('#sameCompareDiv').click(function () {
  if ($('#sameCompareTogg').val() == '1') {
    $('#sameCompareTogg').val('0')
    $('#sameCompareDiv').css('color', '#08358A')

    const param = { STCD: stcd, YR: $('#nianFen').val(), ST_TP: st_tp }
    //只有考核断面显示这个页面
    jQuery.getJSON(
      basePath + 'szybh/ywgz/getSaveWaterEcologyFlowMapStandardAppraiseSameCompare',
      param,
      function (result) {
        console.log('sameCompareresult:', result)
        if (result.ASS_TP == 5) {
          //如果时年，则对应水量，不显示断面时段数，显示累计水量值
          var list = result.data
          var listPre = result.dataPre
          var xName = []
          const yShengTaiShuiLiang = []

          if (list != null && list.length > 0) {
            for (var i = 0; i < list.length; ++i) {
              xName.push(isNull(list[i].NEWDATE))
              yShengTaiShuiLiang.push(list[i].AVW)
            }
          }

          const yShengTaiShuiLiangPre = []
          if (listPre != null && listPre.length > 0) {
            for (var i = 0; i < listPre.length; ++i) {
              yShengTaiShuiLiangPre.push(isNull(listPre[i].AVW))
            }
          }
          echartsYearShuiLiangSameCompare(xName, yShengTaiShuiLiang, yShengTaiShuiLiangPre)
        } else {
          let titleReal
          if (result.kaohezhibiao == 1) {
            titleReal = '水位'
          } else if (result.kaohezhibiao == 2) {
            titleReal = '水量'
          } else if (result.kaohezhibiao == 3) {
            titleReal = '流量'
          } else {
            titleReal = '-'
          }
          var list = result.data
          var listPre = result.dataPre
          var xName = []
          const yNowValue = []

          if (list != null && list.length > 0) {
            for (var i = 0; i < list.length; ++i) {
              xName.push(isNull(list[i].NEWDATE))
              yNowValue.push(list[i].REALVAL)
            }
          }

          const yPreValue = []
          if (listPre != null && listPre.length > 0) {
            for (var i = 0; i < listPre.length; ++i) {
              yPreValue.push(isNull(listPre[i].REALVAL))
            }
          }
          echartsNotYearDBPGSameCompare(xName, yNowValue, yPreValue, titleReal)
        }
      }
    )
  } else {
    $('#sameCompareTogg').val('1')
    $('#sameCompareDiv').css('color', '#4082FF')
    init()
  }
})
