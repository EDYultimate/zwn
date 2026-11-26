$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth - 38 + 'px')

  //默认前7天, 初始化默认时间
  const curtDate = new Date()
  const curtYear = curtDate.Format('yyyy')
  // 获取前90天日期
  //	var day = 365;
  //	starttime =  moment().add(0-day+1, 'days').format('YYYY-MM');
  // 填入时间查询
  $('#nianFen').val(curtYear)
  //	$('#endTm').val(endtime);

  init()
})

function init() {
  const param = { SWS_CD: SWS_CD, YEAR: $('#nianFen').val() }
  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterDrinkProtectAppraise',
    param,
    function (result) {
      console.log('dbpgresult:', result)
      const list = result
      const yWaterType = []
      const xName = []
      const yIII = []
      if (list != null && list.length > 0) {
        let str = ''
        let waterType = ''
        for (let i = 0; i < list.length; i++) {
          switch (list[i].WQG) {
            case '1':
              waterType = 'Ⅰ'
              break
            case '2':
              waterType = 'Ⅱ'
              break
            case '3':
              waterType = 'Ⅲ'
              break
            case '4':
              waterType = 'Ⅳ'
              break
            case '5':
              waterType = 'Ⅴ'
              break
            case '6':
              waterType = 'Ⅵ'
              break
            default:
              waterType = ''
          }
          str +=
            '<tr>' +
            '<td>' +
            isNull(list[i].MON) +
            '月</td>' +
            '<td>' +
            isNull(waterType) +
            '</td>' +
            '<td>' +
            isNull(list[i].EXCEED) +
            '</td>' +
            '</tr>'

          xName.push(isNull(list[i].MON + '月'))
          yWaterType.push(waterType)
          yIII.push('Ⅲ')
        }
        $('#tbody').empty().append(str)
      }
      echartsSZPJ(xName, yWaterType, yIII)
    }
  )
}

function echartsSZPJ(xName, yWaterType, yIII) {
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
        data: [{ name: '基准值', icon: 'image://images/savewater/line2.png' }],
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

        data: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ']
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
        type: 'bar',
        data: yWaterType,
        itemStyle: {
          normal: {
            color: '#5178EA'
          }
        },
        barWidth: 30
        //	                barCategoryGap:'1%',/*多个并排柱子设置柱子之间的间距*/
        //	                barGap:'3%',/*多个并排柱子设置柱子之间的间距*/
      },
      {
        name: '基准值',
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
  const myChartYearShuiLiang = echarts.init(document.getElementById('rightDiv'))
  myChartYearShuiLiang.setOption(option)
}

$('#sameCompareDiv').click(function () {
  if ($('#sameCompareTogg').val() == '1') {
    $('#sameCompareTogg').val('0')
    $('#sameCompareDiv').css('color', '#08358A')
    const param = { SWS_CD: SWS_CD, YEAR: $('#nianFen').val() }
    //		var param = {"STCD":stcd,"YR":$("#nianFen").val(),"ST_TP":st_tp};
    //只有考核断面显示这个页面
    jQuery.getJSON(
      basePath + 'szybh/ywgz/getSaveWaterDrinkProtectAppraiseSameCompare',
      param,
      function (result) {
        console.log('sameCompareresult:', result)
        const list = result.data
        const listPre = result.dataPre
        const xNowName = []
        const yNowValue = []
        let xName = []
        let waterType = ''
        if (list != null && list.length > 0) {
          for (var i = 0; i < list.length; ++i) {
            switch (list[i].MAX_WQG) {
              case '1':
                waterType = 'Ⅰ'
                break
              case '2':
                waterType = 'Ⅱ'
                break
              case '3':
                waterType = 'Ⅲ'
                break
              case '4':
                waterType = 'Ⅳ'
                break
              case '5':
                waterType = 'Ⅴ'
                break
              case '6':
                waterType = 'Ⅵ'
                break
              default:
                waterType = ''
            }
            xNowName.push(isNull(list[i].DUANMIANMON))
            yNowValue.push(waterType)
          }
        }

        const xPreName = []
        const yPreValue = []
        if (listPre != null && listPre.length > 0) {
          for (var i = 0; i < listPre.length; ++i) {
            switch (listPre[i].MAX_WQG) {
              case '1':
                waterType = 'Ⅰ'
                break
              case '2':
                waterType = 'Ⅱ'
                break
              case '3':
                waterType = 'Ⅲ'
                break
              case '4':
                waterType = 'Ⅳ'
                break
              case '5':
                waterType = 'Ⅴ'
                break
              case '6':
                waterType = 'Ⅵ'
                break
              default:
                waterType = ''
            }
            xPreName.push(isNull(listPre[i].DUANMIANMON))
            yPreValue.push(waterType)
          }
        }
        xName = xNowName.length > xPreName.length ? xNowName : xPreName
        echartsSZPJSameCompare(xName, yNowValue, yPreValue)
      }
    )
  } else {
    $('#sameCompareTogg').val('1')
    $('#sameCompareDiv').css('color', '#4082FF')
    init()
  }
})

function echartsSZPJSameCompare(xName, yNowValue, yPreValue) {
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
        data: [{ name: '去年水质类别', icon: 'image://images/savewater/line1.png' }],
        itemWidth: 10,
        itemHeight: 3
      },
      {
        data: [{ name: '今年水质类别', icon: 'image://images/savewater/line2.png' }],
        left: '120',
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

        data: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ']
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
        name: '去年水质类别',
        type: 'line',
        data: yNowValue,
        itemStyle: {
          normal: {
            color: '#5178EA'
          }
        }
        //	                barWidth: 50
      },
      {
        name: '今年水质类别',
        type: 'line',
        data: yPreValue,
        itemStyle: {
          normal: {
            color: '#ff6446'
          }
        }
      }
    ]
  }

  echarts.init(document.getElementById('rightDiv')).dispose()
  const myChartYearShuiLiang = echarts.init(document.getElementById('rightDiv'))
  myChartYearShuiLiang.setOption(option)
}
