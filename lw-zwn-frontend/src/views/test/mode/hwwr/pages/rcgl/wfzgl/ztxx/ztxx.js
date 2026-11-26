let chartH

$(document).ready(function () {
  const bodyh = parseInt($(window).height())
  const contentH = (bodyh - 30) / 2
  $('.content').css('height', contentH + 'px')

  chartH = contentH - 32
  $('.chart').css('height', chartH + 'px')

  xkz('getXkzByXzq') //  按行政区划分析许可证个数

  /*xkqsl('getXkqslByXzq');  //按行政区划分析许可取水量*/

  ztxx() //获取许可取水量总体信息

  //许可证个数
  $('.menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')

    switch ($(this).attr('id')) {
      case 'xzqh':
        /* var trH=0.9*chartH/10;
                $("#tab,tr").css("height",trH+"px");*/
        xkz('getXkzByXzq') //  按行政区划
        break
      case 'szyfq':
        /* var trH=0.9*chartH/6;
                $("#tab,tr").css("height",trH+"px");*/
        xkz('getXkzBySzyfq') //按水资源分区
        break
    }
  })

  //许可取水量
  $('.menu1 li').click(function () {
    $('.clickLiTab1').removeClass('clickLiTab1')
    $(this).addClass('clickLiTab1')

    switch ($(this).attr('id')) {
      case 'xzqh1':
        /* var trH=0.9*chartH/10;
                $("#tab1,tr").css("height",trH+"px");*/
        xkqsl('getXkqslByXzq') //按行政区划
        break
      case 'szyfq1':
        /*  var trH=0.9*chartH/6;
                $("#tab1,tr").css("height",trH+"px");*/
        xkqsl('getXkqslBySzyfq') //按水资源分区
        break
      case 'ztxx':
        ztxx()
        break
    }
  })
})

//分析 许可证数量
function xkz(type) {
  jQuery.getJSON(
    basePath + 'message/rcgl/wfzgl/' + type,
    { nowTime: Math.random() },
    function (dataList) {
      const data = dataList.list
      const arr = []
      const arr1 = []
      const arr2 = []
      const arr3 = []
      let sum1 = 0
      let sum2 = 0
      let sum3 = 0
      for (var i = 0; i < data.length; i++) {
        const dataMap = data[i]
        if (type == 'getXkzByXzq') {
          arr.push(dataMap.AD_NM)
        } else if (type == 'getXkzBySzyfq') {
          arr.push(dataMap.WRZ_NM)
        }
        arr1.push(dataMap.TOTAL)
        arr2.push(dataMap.VALID)
        arr3.push(dataMap.EXPIRED)

        sum1 += dataMap.TOTAL
        sum2 += dataMap.VALID
        sum3 += dataMap.EXPIRED
      }
      const myChart = echarts.init(document.getElementById('echartDiv'))
      myChart.clear()
      setAnyChartFun(arr, arr1, arr2, arr3)

      let tableDiv =
        "<table width='100%' border='0' cellpadding='0' cellspacing='0'    class='bbTable'    style='border-left:0px;border-bottom:0px;'>" +
        '<thead>' +
        '<tr >'
      if (type == 'getXkzByXzq') {
        tableDiv += "<th width='80'>行政区</th>"
      } else if (type == 'getXkzBySzyfq') {
        tableDiv += "<th width='80'>水资源分区</th>"
      }
      tableDiv +=
        "<th width='50'>总个数</th>" +
        "<th width='50'>有效</th>" +
        "<th width='50'>过期</th>" +
        '</tr></thead><tbody>' +
        '<tr>' +
        '<td>全部</td>' +
        '<td>' +
        sum1 +
        '</td>' +
        '<td>' +
        sum2 +
        '</td>' +
        '<td>' +
        sum3 +
        '</td>' +
        '</tr>'

      for (var i = 0; i < data.length; i++) {
        tableDiv += '<tr>'
        if (type == 'getXkzByXzq') {
          tableDiv += '<td >' + data[i].AD_NM + '</td>'
        } else if (type == 'getXkzBySzyfq') {
          tableDiv += '<td >' + data[i].WRZ_NM + '</td>'
        }
        tableDiv +=
          '<td>' +
          data[i].TOTAL +
          '</td>' +
          '<td>' +
          data[i].VALID +
          '</td>' +
          '<td>' +
          data[i].EXPIRED +
          '</td>' +
          '</tr>'
      }

      tableDiv += '</tbody></table>'

      $('#tableDiv').html(tableDiv)

      if (type == 'getXkzByXzq') {
        var trH = (0.9 * chartH) / 10
        $('#tableDiv')
          .find('tr')
          .css('height', trH + 'px')
      } else if (type == 'getXkzBySzyfq') {
        var trH = (0.9 * chartH) / 6
        $('#tableDiv')
          .find('tr')
          .css('height', trH + 'px')
      }
    }
  )
}

//生成柱状图
function setAnyChartFun(arr, arr1, arr2, arr3) {
  const myChart = echarts.init(document.getElementById('echartDiv'))
  option = {
    /* title: {
            text: '许可证数量'
        },*/
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['有效', '过期']
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      /* x:'3%',
            y:'3%',*/
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        /*boundaryGap : false,*/
        boundaryGap: true,
        data: arr
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '个数'
      }
    ],
    series: [
      {
        name: '过期',
        type: 'bar',
        stack: '总量',
        barWidth: 30,
        areaStyle: {},
        data: arr3,
        itemStyle: {
          normal: {
            color: '#b598fb'
          }
        }
      },

      {
        name: '有效',
        type: 'bar',
        stack: '总量',
        barWidth: 30,
        /* label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },*/
        areaStyle: {},
        data: arr2,
        itemStyle: {
          normal: {
            color: '#3ac7f3'
          }
        }
      },
      {
        name: '总个数',
        type: 'bar',
        stack: '总量',
        barWidth: 30,
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
        areaStyle: {},
        data: arr1,
        itemStyle: {
          normal: {
            color: '#ff6641'
          }
        }
      }
    ]
  }
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}

//分析 许可取水量
function xkqsl(type) {
  jQuery.getJSON(
    basePath + 'message/rcgl/wfzgl/' + type,
    { nowTime: Math.random() },
    function (dataList) {
      const data = dataList.list
      /*debugger;*/
      const arr = []
      const arr1 = []
      let sum1 = 0
      /* var arr2=new Array();
        var arr3=new Array();*/
      for (var i = 0; i < data.length; i++) {
        const dataMap = data[i]
        if (type == 'getXkqslByXzq') {
          arr.push(dataMap.AD_NM)
        } else if (type == 'getXkqslBySzyfq') {
          arr.push(dataMap.WRZ_NM)
        }
        /* arr1.push(dataMap.TOTAL);
            arr2.push(dataMap.VALID);
            arr3.push(dataMap.EXPIRED);*/
        arr1.push(dataMap.WW)
        sum1 += dataMap.WW
      }

      $('#echartDiv2').css('display', 'none')
      $('#tableDiv1').css('display', 'block')

      const myChart = echarts.init(document.getElementById('echartDiv1'))
      myChart.clear()
      /* setAnyChartFun(arr,arr1,arr2,arr3);*/
      setAnyChartFun1(arr, arr1)

      let tableDiv =
        "<table width='100%' border='0' cellpadding='0' cellspacing='0' class='bbTable' style='border-left:0px;border-bottom:0px;' >" +
        '<thead>' +
        '<tr >'
      if (type == 'getXkqslByXzq') {
        tableDiv += "<th width='80'>行政区</th>"
      } else if (type == 'getXkqslBySzyfq') {
        tableDiv += "<th width='80'>水资源分区</th>"
      }
      tableDiv +=
        "<th width='50'>许可水量(万m³)</th>" +
        /* "<th width='50'>有效</th>" +
            "<th width='50'>过期</th>" +*/
        '</tr></thead><tbody>' +
        '<tr>' +
        '<td>全部</td>' +
        '<td>' +
        sum1 +
        '</td>' +
        '</tr>'

      for (var i = 0; i < data.length; i++) {
        tableDiv += '<tr>'
        if (type == 'getXkqslByXzq') {
          tableDiv += '<td >' + data[i].AD_NM + '</td>'
        } else if (type == 'getXkqslBySzyfq') {
          tableDiv += '<td >' + data[i].WRZ_NM + '</td>'
        }
        tableDiv +=
          '<td>' +
          data[i].WW +
          '</td>' +
          /* "<td>"+data[i].VALID+"</td>"+
                "<td>"+data[i].EXPIRED+"</td>"+*/
          '</tr>'
      }

      tableDiv += '</tbody></table>'

      $('#tableDiv1').html(tableDiv)

      if (type == 'getXkqslByXzq') {
        var trH = (0.9 * chartH) / 10
        $('#tableDiv1')
          .find('tr')
          .css('height', trH + 'px')
      } else if (type == 'getXkqslBySzyfq') {
        var trH = (0.9 * chartH) / 6
        $('#tableDiv1')
          .find('tr')
          .css('height', trH + 'px')
      }
    }
  )
}

//生成柱状图
function setAnyChartFun1(arr, arr1) {
  const myChart = echarts.init(document.getElementById('echartDiv1'))
  option = {
    /* title: {
              text: '许可证数量'
          },*/
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['许可水量']
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        /*boundaryGap : false,*/
        boundaryGap: true,
        data: arr
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '万m³'
      }
    ],
    series: [
      {
        name: '许可水量',
        type: 'bar',
        stack: '总量',
        barWidth: 30,
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
        areaStyle: {},
        data: arr1,
        itemStyle: {
          normal: {
            color: '#ff9908'
          }
        }
      }
    ]
  }
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}

//总体信息
function ztxx() {
  jQuery.getJSON(
    basePath + 'message/rcgl/wfzgl/getGW_SW',
    { nowTime: Math.random() },
    function (dataList) {
      const data = dataList.list
      //console.log(data[0].SW_WW);

      const myChart = echarts.init(document.getElementById('echartDiv1'))
      myChart.clear()
      const option = {
        title: {
          text: '不同水源保有有效取水许可量对比',
          x: 'center',
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          /*left: 'left',*/
          x: 'center',
          y: 'bottom',
          orient: 'horizontal',
          data: ['地表水', '地下水']
        },
        series: [
          {
            name: '取水来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: data[0].SW_WW, name: '地表水' },
              { value: data[0].GW_WW, name: '地下水' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function (params) {
                  //自定义颜色
                  const colorList = ['#74d563', '#c2a8ff']
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)

      /*$("#tableDiv1"). empty();*/
      $('#tableDiv1').css('display', 'none')
      $('#echartDiv2').css('display', 'block')
      const myChart1 = echarts.init(document.getElementById('echartDiv2'))
      const option1 = {
        title: {
          text: '地表水保有有效取水许可量对比',
          x: 'center',
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          /*left: 'left',*/
          x: 'center',
          y: 'bottom',
          orient: 'horizontal',
          data: ['河道内取水量', '河道外取水量']
        },
        series: [
          {
            /*name: '访问来源',*/
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: data[0].SW_WW_IN, name: '河道内取水量' },
              { value: data[0].SW_WW_OUT, name: '河道外取水量' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function (params) {
                  //自定义颜色
                  const colorList = ['#3ac7f3', '#ff6641']
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart1.setOption(option1)
    }
  )
}
