let chartH
const param = {}

$(document).ready(function () {
  //初始化日期
  $('#year').val(new Date().Format('yyyy'))

  const tm = $('#year').val()
  const tp = $('#tp').val()

  const bodyh = parseInt($(window).height()) - 30 - 58
  const contentH = (bodyh - 30) / 2
  $('.content').css('height', contentH + 'px')

  chartH = contentH - 34
  $('.chart').css('height', chartH + 'px')

  makeTable()
})

function search() {
  makeTable()
}

function makeTable() {
  const tm = $('#year').val()
  const tp = $('#tp').val()
  param.tm = tm
  param.tp = tp
  jQuery.getJSON(basePath + 'message/rcgl/wfzgl/getWfztj', param, function (dataList) {
    const data = dataList.list
    let sum1 = 0
    let sum2 = 0
    let sum3 = 0
    let sum4 = 0
    let sum5 = 0
    let sum6 = 0
    const arrX = []
    const arr = []
    const arr1 = []
    const arr2 = []
    const arr3 = []
    const arr4 = []
    const arr5 = []
    const arr6 = []

    for (var i = 0; i < data.length; i++) {
      const dataMap = data[i]
      sum1 += isNullL(dataMap.VALID) //有效水量
      sum2 += isNullL(dataMap.EXPIRED) //过期水量
      sum3 += isNullL(dataMap.TOTAL) //超许可水量个数
      sum4 += isNullL(dataMap.WW) //许可水量
      sum5 += isNullL(dataMap.W) //实际水量
      //sum6+=isNullL(dataMap.CXKW); //超许可水量
      if (tp == '01') {
        arrX.push(dataMap.CONC_ORG)
      } else if (tp == '02') {
        arrX.push(dataMap.WRZ_NM)
      }
      arr.push(0) //合计
      arr1.push(isNullL(dataMap.VALID))
      arr2.push(isNullL(dataMap.EXPIRED))
      arr3.push(isNullL(dataMap.TOTAL))
      arr4.push(isNullL(dataMap.WW))
      arr5.push(isNullL(dataMap.W))
      arr6.push(isNullL(dataMap.CXKW))
    }
    //计算累计超许可水量
    sum6 = sum5 - sum4 < 0 ? 0 : sum5 - sum4

    // setAnyChartFun(arrX,arr,arr1,arr2,arr3,arr4,arr5);  //生成许可数量echarts图
    setAnyChartFun(arrX, arr, arr1, arr2) //生成有效/过期水量echarts图

    // setAnyChartFun1(arrX,arr6);  //生成许可水量echarts图
    setAnyChartFun1(arrX, arr4, arr5, arr6) //生成许可取水量/实际取水量/超许可水量echarts图

    let tableDiv =
      "<table width='100%' border='0' cellpadding='0' cellspacing='0'    class='bbTable'    style='border-left:0px;border-bottom:0px;'  >" +
      '<thead>' +
      '<tr >'
    if (tp == '01') {
      tableDiv += "<th width='50'>监管单位</th>"
    } else if (tp == '02') {
      tableDiv += "<th width='50'>水资源分区</th>"
    }
    tableDiv +=
      "<th width='50'>有效水量(万m³)</th>" +
      "<th width='50'>过期水量(万m³)</th>" +
      "<th width='50'>超许可水量个数</th>" +
      "<th width='50'>许可水量(万m³)</th>" +
      "<th width='50'>实际水量(万m³)</th>" +
      "<th width='50'>超许可水量(万m³)</th>" +
      "<th width='50'>超许可水量百分比</th>" +
      '</tr></thead><tbody>' +
      '<tr>' +
      '<td>合计</td>' +
      '<td>' +
      sum1.toFixed(2) +
      '</td>' +
      '<td>' +
      sum2.toFixed(2) +
      '</td>' +
      '<td>' +
      sum3 +
      '</td>' +
      '<td>' +
      sum4.toFixed(2) +
      '</td>' +
      '<td>' +
      sum5.toFixed(2) +
      '</td>' +
      '<td>' +
      sum6.toFixed(2) +
      '</td>' +
      '<td>' +
      ((sum6 / sum4) * 100).toFixed(0) +
      '%</td>' +
      /*   "<td>"+'-'+"</td>"+*/
      '</tr>'
    for (var i = 0; i < data.length; i++) {
      tableDiv += '<tr>'
      if (tp == '01') {
        tableDiv += '<td >' + data[i].CONC_ORG + '</td>'
      } else if (tp == '02') {
        tableDiv += '<td >' + data[i].WRZ_NM + '</td>'
      }
      tableDiv +=
        '<td>' +
        isNullL(data[i].VALID).toFixed(2) +
        '</td>' +
        '<td>' +
        isNullL(data[i].EXPIRED).toFixed(2) +
        '</td>' +
        '<td>' +
        isNullL(data[i].TOTAL) +
        '</td>' +
        '<td>' +
        isNullL(data[i].WW).toFixed(2) +
        '</td>' +
        '<td>' +
        isNullL(data[i].W).toFixed(2) +
        '</td>' +
        '<td>' +
        isNullL(data[i].CXKW).toFixed(2) +
        '</td>'
      if (data[i].PCT == '%') {
        tableDiv += '<td>0%</td>'
      } else {
        tableDiv += '<td>' + data[i].PCT + '</td>'
      }

      tableDiv += '</tr>'
    }
    tableDiv += '</tbody></table>'
    $('#tableDiv').html(tableDiv)

    if (tp == '01') {
      var trH = (0.9 * chartH) / 10
      $('#tableDiv')
        .find('tr')
        .css('height', trH + 'px')
    } else if (tp == '02') {
      var trH = (0.9 * chartH) / 6
      $('#tableDiv')
        .find('tr')
        .css('height', trH + 'px')
    }
  })
}

//生成柱状图
/*
function setAnyChartFun(arr,arr1,arr2,arr3){
    var myChart = echarts.init(document.getElementById('echartDiv'));
    option = {
        title: {
            text: '许可数量统计',
            top : 4,
            x:"center",
            textStyle:{
                fontSize:14
            }
        },
        tooltip : {
          /!*  trigger: 'axis',*!/
            axisPointer: {
                type: 'shadow',
              /!*  label: {
                    backgroundColor: '#6a7985'
                }*!/
            }
        },
        legend: {
            data:['取水许可审批','新批未发'],
            top:30,
            x:"center",
        },
       /!* toolbox: {
            feature: {
                saveAsImage: {}
            }
        },*!/
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap :true,
                data : arr
            }
        ],
        yAxis : [
            {
                type : 'value',
                name:'个数',
               /!* axisLabel:{
                    formatter:'{value}'
                }*!/
            }
        ],
        series : [
            {
                name:'新批未发',
                type:'bar',
                stack: '叠图',
                barWidth : 30,
               /!* areaStyle: {},*!/
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
                stack: '叠图',
                barWidth : 30,
                /!* label: {
                     normal: {
                         show: true,
                         position: 'top'
                     }
                 },*!/
                /!*areaStyle: {},*!/
                data:arr2,
                itemStyle: {
                    normal: {
                        color: '#3ac7f3',
                    },
                }
            },
            {
                name:'总个数',
                type:'bar',
                stack: '叠图',
               /!* barWidth : 30,*!/
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#000'
                        },
                        formatter:''
                    }
                },
                /!*areaStyle: {},*!/
                data:arr1,
              /!*  itemStyle: {
                    normal: {
                        color: '#ff6641',
                    },
                }*!/
            },

        ]

    };
    var series = option["series"];

    var fun = function (params) {
        var data3 =0;
        for(var i=0,l=series.length;i<l;i++){
            data3 += series[i].data[params.dataIndex];
        }
        return data3;
    };

    series[series.length-1]["label"]["normal"]["formatter"] = fun ;
    // 使用刚指定的配置项和数据显示图表。

    myChart.setOption(option);
}
*/

//生成柱状图 （取水个数统计）
function setAnyChartFun(arrX, arr, arr1, arr2) {
  const myChart = echarts.init(document.getElementById('echartDiv'))
  option = {
    title: {
      text: '许可水量统计',
      top: 4,
      x: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      /*  trigger: 'axis',*/
      axisPointer: {
        type: 'shadow'
        /*  label: {
                      backgroundColor: '#6a7985'
                  }*/
      }
    },
    legend: {
      data: ['有效水量', '过期水量'],
      top: 30,
      x: 'center',
      selectedMode: false //图例不可点击
    },
    /* toolbox: {
             feature: {
                 saveAsImage: {}
             }
         },*/
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: true,
        data: arrX
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '水量'
        /* axisLabel:{
                     formatter:'{value}'
                 }*/
      }
    ],
    series: [
      {
        name: '有效水量',
        type: 'bar',
        stack: '叠图',
        barWidth: 30,
        /* areaStyle: {},*/
        data: arr1,
        itemStyle: {
          normal: {
            color: '#b598fb'
          }
        }
      },
      {
        name: '过期水量',
        type: 'bar',
        stack: '叠图',
        barWidth: 30,
        data: arr2,
        itemStyle: {
          normal: {
            color: '#3ac7f3'
          }
        }
      },
      /*{
                name:'批复个数',
                type:'bar',
                stack: '叠图',
                barWidth : 30,
                data:arr3,
                  itemStyle: {
                      normal: {
                          color: '#ff6641',
                      },
                  }
    },
            {
                name:'发证申请个数',
                type:'bar',
                stack: '叠图',
                barWidth : 30,
                data:arr4,
                  itemStyle: {
                      normal: {
                          color: '#6ac36b',
                      },
                  }
            },
            {
                name:'制证个数',
                type:'bar',
                stack: '叠图',
                barWidth : 30,
                data:arr5,
                  itemStyle: {
                      normal: {
                          color: '#f0ab4e',
                      },
                  }
            },*/
      {
        name: '总水量',
        type: 'bar',
        stack: '叠图',
        data: arr,
        label: {
          normal: {
            show: true,
            position: 'top',
            textStyle: {
              color: '#000'
            },
            formatter: ''
          }
        }
      }
    ]
  }
  const series = option.series

  const fun = function (params) {
    let data3 = 0
    for (let i = 0, l = series.length; i < l; i++) {
      data3 += series[i].data[params.dataIndex]
    }
    return data3.toFixed(2)
  }

  series[series.length - 1].label.normal.formatter = fun
  // 使用刚指定的配置项和数据显示图表。

  myChart.setOption(option)
}

//实际水量统计
function setAnyChartFun1(arrX, arr4, arr5, arr6) {
  const myChart = echarts.init(document.getElementById('echartDiv1'))
  option = {
    title: {
      text: '实际水量统计',
      top: 4,
      x: 'center',
      textStyle: {
        fontSize: 14
      }
    },
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
      /*data:['许可水量']*/
      data: ['许可水量', '实际水量', '超许可水量'],
      top: 30,
      x: 'center',
      selectedMode: false //图例不可点击
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
        data: arrX
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
        /*stack: '总量',
                barWidth: 30,*/
        areaStyle: {},
        data: arr4,
        itemStyle: {
          normal: {
            color: '#6ac36b'
          }
        }
      },
      {
        name: '实际水量',
        type: 'bar',
        /*   stack: '总量',
                barWidth : 30,*/
        areaStyle: {},
        data: arr5,
        itemStyle: {
          normal: {
            color: '#b598fb'
          }
        }
      },
      {
        name: '超许可水量',
        type: 'bar',
        /*  stack: '总量',
                barWidth : 30,*/
        areaStyle: {},
        data: arr6,
        itemStyle: {
          normal: {
            color: '#ff6641'
          }
        }
      }

      /*   {
                name:'取水许可审批',
                type:'bar',
                stack: '总量',
                barWidth : 30,
                areaStyle: {},
                data:arr2,
                itemStyle: {
                    normal: {
                        color: '#74d563',
                    },
                }
            },

            {
                name:'申请水量',
                type:'bar',
                stack: '总量',
                barWidth : 30,
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                areaStyle: {},
                data:arr1,
                itemStyle: {
                    normal: {
                        color: '#c2a8ff',
                    },
                }
            }*/
    ]
  }
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}
