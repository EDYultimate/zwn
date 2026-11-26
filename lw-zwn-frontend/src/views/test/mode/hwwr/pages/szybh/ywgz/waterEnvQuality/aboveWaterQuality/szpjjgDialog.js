$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  //	$("#middleDiv").css("width",bodyrightWidth-38+"px");

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
  echartsWaterQualityType(1)
})

function init() {
  const param = { ID: ID, YR: $('#nianFen').val(), pageSize: 12, pageNo: 1, TP: 2 }
  //    console.log("iniinitinitinitt:",param);

  //只有考核断面显示这个页面
  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterWaterEnvDetail', param, function (result) {
    console.log('jspjjg:', result)
    let str = ''
    const xName = []
    const yWaterType = []
    const yIII = []

    let Ⅰ = 0,
      Ⅱ = 0,
      Ⅲ = 0,
      Ⅳ = 0,
      Ⅴ = 0,
      Ⅵ = 0

    const arr = []
    const list = result.page.list
    if (list != null && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        str +=
          '<tr>' +
          '<td>' +
          isNull(list[i].M_DATE) +
          '</td>' +
          '<td>' +
          isNull(list[i].WQ_VAL) +
          '</td>' +
          '<td>' +
          isNull(list[i].MESPEST) +
          '</td>' +
          '</tr>'

        xName.push(isNull(list[i].M_DATE))
        yWaterType.push(isNull(list[i].WQ_VAL))
        yIII.push('Ⅲ')

        switch (list[i].WQ_VAL) {
          case 'Ⅰ':
            Ⅰ++
            break
          case 'Ⅱ':
            Ⅱ++
            break
          case 'Ⅲ':
            Ⅲ++
            break
          case 'Ⅳ':
            Ⅳ++
            break
          case 'Ⅴ':
            Ⅴ++
            break
          case 'Ⅵ':
            Ⅵ++
            break
        }
      }
      //					console.log("arr",I,II,III,IV,V,VI);

      const item1 = {},
        item2 = {},
        item3 = {},
        item4 = {},
        item5 = {},
        item6 = {}
      item1.name = 'Ⅰ'
      item1.value = Ⅰ
      arr.push(item1)
      item2.name = 'Ⅱ'
      item2.value = Ⅱ
      arr.push(item2)
      item3.name = 'Ⅲ'
      item3.value = Ⅲ
      arr.push(item3)
      item4.name = 'Ⅳ'
      item4.value = Ⅳ
      arr.push(item4)
      item5.name = 'Ⅴ'
      item5.value = Ⅴ
      arr.push(item5)
      item6.name = 'Ⅵ'
      item6.value = Ⅵ
      arr.push(item6)
      console.log('arr', arr)
    }

    $('#tbody').empty().append(str)

    //				echartsYearShuiLiang(xName,yShengTaiShuiLiang,yLeiJiShuiLiang,yMuBiaoZhi);

    echartsSZBHTJ(xName, yWaterType, yIII)

    echartsWaterQualityType(arr)
  })
}

function echartsSZBHTJ(xName, yWaterType, yIII) {
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
        data: [{ name: 'III类', icon: 'image://images/savewater/line2.png' }],
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
        barWidth: 50
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

  echarts.init(document.getElementById('middleDiv')).dispose()
  const myChartYearShuiLiang = echarts.init(document.getElementById('middleDiv'))
  myChartYearShuiLiang.setOption(option)
}

function echartsWaterQualityType(data) {
  option = {
    //			 color:['#51bbff', '#fffc00', '#ffc44d','#ee6666'],
    legend: {
      icon: 'rect', //  字段控制形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow，none

      itemWidth: 10, // 设置宽度

      itemHeight: 10, // 设置高度
      orient: 'vertical',
      x: 'right',
      y: 'bottom',
      textStyle: {
        //图例文字的样式
        color: '#050505',
        fontSize: 9,
        fontWeight: 'bold'
      }
    },
    series: [
      {
        name: '半径模式',
        type: 'pie',
        radius: ['40%', '60%'],
        center: ['45%', '45%'],
        //		            roseType: 'radius',
        itemStyle: {
          borderRadius: 5
        },
        label: {
          show: false
        },
        //		            data: [
        //		                {value: 40, name: 'I'},
        //		                {value: 33, name: 'II'},
        //		                {value: 28, name: 'III'},
        //		                {value: 18, name: 'IV'},
        //		                {value: 46, name: '111V'}
        //		            ],
        data: data,
        barWidth: 50
      }
    ]
  }

  const myChartWaterLevel = echarts.init(document.getElementById('waterQualityTypeDiv'))
  myChartWaterLevel.setOption(option)
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
