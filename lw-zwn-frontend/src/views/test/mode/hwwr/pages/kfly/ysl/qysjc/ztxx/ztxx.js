let chartH

$(document).ready(function () {
  const bodyh = parseInt($(window).height()) - 30
  const contentH = bodyh - 30
  $('.content').css('height', contentH + 'px')

  chartH = contentH - 110
  $('.chart').css('height', chartH + 'px')
  /*$("#leftDiv").css("height",0.6*chartH+"px");*/
  $('#tableDiv').css('height', 0.8 * chartH + 'px')

  $('#bdat').val(new Date().Format('yyyy'))
  $('#edat').val(new Date().Format('yyyy'))

  qsl('getWfzQslByXzq') //  按行政区划分析累计取水量
  qssy() //  分析取水水源
  //累计取水量
  $('.menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')

    switch ($(this).attr('id')) {
      case 'xzqh':
        qsl('getWfzQslByXzq') //  按行政区划
        break
      case 'szyfq':
        qsl('getWfzQslBySzyfq') //按水资源分区
        break
    }
  })
})

//切换时间
$('input:radio[name=radio]').change(function () {
  if ($('input:radio[name=radio]:checked').val() == '1') {
    $('#mn').css('display', 'none')
    $('#yr').css('display', '')
    $('#bdat').val(new Date().Format('yyyy'))
    $('#edat').val(new Date().Format('yyyy'))
  } else if ($('input:radio[name=radio]:checked').val() == '2') {
    $('#yr').css('display', 'none')
    $('#mn').css('display', '')
    $('#bdat1').val(new Date().Format('yyyy-MM'))
    $('#edat1').val(new Date().Format('yyyy-MM'))
  }
})

function search() {
  qsl('getWfzQslByXzq') //  按行政区划分析累计取水量

  qssy()

  $('.menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')

    switch ($(this).attr('id')) {
      case 'xzqh':
        qsl('getWfzQslByXzq') //  按行政区划
        break
      case 'szyfq':
        qsl('getWfzQslBySzyfq') //按水资源分区
        break
    }
  })
}

//分析取水水源
function qssy() {
  const tjtp = $('input:radio[name=radio]:checked').val()
  if (tjtp == '1') {
    var bdat = $('#bdat').val()
    var edat = $('#edat').val()
  } else if (tjtp == '2') {
    var bdat = $('#bdat1').val()
    var edat = $('#edat1').val()
  }
  jQuery.getJSON(
    basePath + '/kfly/ysl/getWfzQslSy',
    { nowTime: Math.random(), bdat: bdat, edat: edat, tjtp: tjtp },
    function (dataList) {
      const data = dataList.list

      let dbs = 0 //地表水
      let dxs = 0 //地下水
      let qtsy = 0 //非常规水源
      if (data != null && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].SOUR_TP == 1) {
            dbs = data[i].W
          } else if (data[i].SOUR_TP == 2) {
            dxs = data[i].W
          } else {
            qtsy = data[i].W
          }
        }
      }
      const myChart = echarts.init(document.getElementById('chartDiv'))
      myChart.clear()
      const option = {
        title: {
          text: '取水水源构成',
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
          data: ['地表水', '地下水', '非常规水源']
        },
        series: [
          {
            name: '取水水源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: dbs, name: '地表水' },
              { value: dxs, name: '地下水' },
              { value: qtsy, name: '非常规水源' }
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
                  const colorList = ['#74d563', '#c2a8ff', '#3ac7f3']
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  )
}

//分析 取水量
function qsl(type) {
  const tjtp = $('input:radio[name=radio]:checked').val()
  if (tjtp == '1') {
    var bdat = $('#bdat').val()
    var edat = $('#edat').val()
  } else if (tjtp == '2') {
    var bdat = $('#bdat1').val()
    var edat = $('#edat1').val()
  }
  jQuery.getJSON(
    basePath + '/kfly/ysl/' + type,
    { nowTime: Math.random(), bdat: bdat, edat: edat, tjtp: tjtp },
    function (dataList) {
      const data = dataList.list
      const arr = []
      const arr1 = []
      /*   var arr2=new Array();
        var arr3=new Array();*/
      let sum1 = 0
      /* var sum2=0;
        var sum3=0;*/
      for (var i = 0; i < data.length; i++) {
        const dataMap = data[i]
        if (type == 'getWfzQslByXzq') {
          arr.push(dataMap.AD_NM)
        } else if (type == 'getWfzQslBySzyfq') {
          arr.push(dataMap.WRZ_NM)
        }
        arr1.push(dataMap.W)
        /*          arr2.push(dataMap.SP);
            arr3.push(dataMap.XPWF);*/

        sum1 += dataMap.W
        /* sum2+=dataMap.SP;
            sum3+=dataMap.XPWF;*/
      }
      const myChart = echarts.init(document.getElementById('echartDiv'))
      myChart.clear()
      /*setAnyChartFun(arr,arr1,arr2,arr3);*/
      setAnyChartFun(arr, arr1)

      let tableDiv =
        "<table width='100%' border='0' cellpadding='0' cellspacing='0'    class='bbTable'    style='border-left:0px;border-bottom:0px;'   id='tab''>" +
        '<thead>' +
        '<tr >'
      if (type == 'getWfzQslByXzq') {
        tableDiv += "<th width='50'>行政区</th>"
      } else if (type == 'getWfzQslBySzyfq') {
        tableDiv += "<th width='50'>水资源分区</th>"
      }
      tableDiv +=
        "<th width='50'>总量(万m³)</th>" +
        /*      "<th width='50'>取水许可审批</th>" +
            "<th width='50'>新批未发</th>" +*/
        '</tr></thead><tbody>' +
        '<tr>' +
        '<td>全部</td>' +
        '<td>' +
        sum1.toFixed(2) +
        '</td>' +
        /*  "<td>"+sum2+"</td>"+
            "<td>"+sum3+"</td>"+*/
        '</tr>'

      for (var i = 0; i < data.length; i++) {
        tableDiv += '<tr>'
        if (type == 'getWfzQslByXzq') {
          tableDiv += '<td >' + data[i].AD_NM + '</td>'
        } else if (type == 'getWfzQslBySzyfq') {
          tableDiv += '<td >' + data[i].WRZ_NM + '</td>'
        }
        tableDiv +=
          '<td>' +
          data[i].W +
          '</td>' +
          /*  "<td>"+data[i].SP+"</td>"+
                "<td>"+data[i].XPWF+"</td>"+*/
          '</tr>'
      }
      tableDiv += '</tbody></table>'
      $('#tableDiv').html(tableDiv)

      if (type == 'getWfzQslByXzq') {
        var trH = (0.8 * chartH) / 10
        $('#tableDiv')
          .find('tr')
          .css('height', trH + 'px')
      } else if (type == 'getWfzQslBySzyfq') {
        var trH = (0.8 * chartH) / 6
        $('#tableDiv')
          .find('tr')
          .css('height', trH + 'px')
      }
    }
  )
}

//生成柱状图
function setAnyChartFun(arr, arr1) {
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
      data: ['取水量']
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
        name: '万m³'
      }
    ],
    series: [
      /* {
                name:'新批未发',
                type:'bar',
                stack: '总量',
                barWidth : 30,
                areaStyle: {},
                data:arr3,
                itemStyle: {
                    normal: {
                        color: '#b598fb',
                    },
                }
            },
            {
                name:'取水许可审批',
                type:'bar',
                stack: '总量',
                barWidth : 30,
                /!* label: {
                     normal: {
                         show: true,
                         position: 'top'
                     }
                 },*!/
                areaStyle: {},
                data:arr2,
                itemStyle: {
                    normal: {
                        color: '#3ac7f3',
                    },
                }
            },*/
      {
        name: '总量',
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
