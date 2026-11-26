$(document).ready(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - $('.searchDiv').height() - 450
  $('#tableDiv').css('height', tbHeight + 'px')
  const date = new Date()
  const year = date.getFullYear()
  $('#tyear').val(year - 1)

  search()
})

function search() {
  const yr = $('#tyear').val()

  const json = {
    yr: yr
  }
  //打开遮罩层
  const index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })
  jQuery.getJSON(basePath + 'jdjc/getTotalInfo', json, function (result) {
    console.info(result)
    const data = result.total
    const tableList = result.tableList
    const yrTotal = result.yrTotal
    let tbodyHtml = ''
    $('#totalT').text(isNull(data[0].TOTAL)) //总套数
    $('#finishT').text(isNull(data[0].YCT)) //检查套数
    $('#finishT2').text(isNull(data[0].TOTAL)) //总套数
    $('#finishTime').text(isNull(data[0].JCTIME)) //检查次数
    $('#problemT').text(isNull(data[0].HAVEPROBLEM)) //有问题套数
    $('#percent').text(isNull(data[0].PERCEN)) //有问题套数占总套数的百分比
    $('#yr').text(yr)

    $('#problemNum').text(isNull(yrTotal[0].TOTALPROBLEM)) //查询年存在的问题
    $('#finishProNum').text(isNull(yrTotal[0].FINISHPROBLEM)) //今年整改了多少
    $('#nofinishProNum').text(isNull(yrTotal[0].NOTFINISHPROBLEM)) //查询年当年未整改多少
    $('#problemRate').text(isNull(yrTotal[0].FINISHRATE)) //整改率

    const xData = []
    const yData = []
    if (tableList.length > 0) {
      for (var i = 0; i < tableList.length; i++) {
        const probelm_id = isNull(tableList[i].PROBLEM_CD)
        const problem_nm = isNull(tableList[i].PROBLEM_NM)
        const num = isNull(tableList[i].NUM)
        const percen = isNull(tableList[i].PERCEN)
        xData[i] = problem_nm
        yData[i] = percen
        tbodyHtml += '<tr>'
        tbodyHtml += '<td>' + (i + 1) + '</td>'
        tbodyHtml +=
          '<td>' +
          problem_nm +
          "</td><td style='color:blue' onclick=\"openWpc('" +
          probelm_id +
          "','" +
          yr +
          '\')">' +
          num +
          '</td>'
        tbodyHtml += '<td>' + percen + '%</td>'
        tbodyHtml += '</tr>'
      }
    } else {
      for (var i = 0; i < 5; i++) {
        tbodyHtml += '<tr>'
        tbodyHtml += '<td></td>'
        tbodyHtml += '<td></td>'
        tbodyHtml += '<td></td>'
        tbodyHtml += '<td></td>'
        tbodyHtml += '</tr>'
      }
    }
    iniecharts(xData, yData)
    iniechartsPie(yrTotal)
    $('#Sztbody').html(tbodyHtml)
    //关闭遮罩层
    layer.close(index_load)
  })
}

function openWpc(pid, yr) {
  layer.open({
    type: 2,
    title: '取水许可证',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['600px', '400px'],
    content: basePath + 'pages/rcgl/jdjc/dialog/openProblemWpcList.jsp?pid=' + pid + '&yr=' + yr
  })
}

function iniecharts(xData, yData) {
  const myChart = echarts.init(document.getElementById('tjxxT'))
  option = {
    //			 color:['#b6a2de'],
    title: {
      text: '问题占比图',
      top: 4,
      x: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{a} <br/>{b}:{c}' + '%'
    },
    legend: {
      data: ['比例'],
      top: 30,
      x: 'center',
      itemWidth: 15,
      textStyle: {
        fontSize: 11
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: xData,
      axisLabel: {
        show: true,
        interval: 0,
        formatter: function (params) {
          let newParamsName = ''
          const paramsNameNumber = params.length
          const provideNumber = 5 //一行显示几个字
          const rowNumber = Math.ceil(paramsNameNumber / provideNumber)
          if (paramsNameNumber > provideNumber) {
            for (let p = 0; p < rowNumber; p++) {
              let tempStr = ''
              const start = p * provideNumber
              const end = start + provideNumber
              if (p == rowNumber - 1) {
                tempStr = params.substring(start, paramsNameNumber)
              } else {
                tempStr = params.substring(start, end) + '\n'
              }
              newParamsName += tempStr
            }
          } else {
            newParamsName = params
          }
          return newParamsName
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: '比例',
        //				stack: '叠图',
        type: 'bar',
        barWidth: 30, //柱图宽度
        data: yData
      }
    ]
  }
  myChart.setOption(option)
}

//饼状图
function iniechartsPie(data) {
  console.info(data)
  const myChart = echarts.init(document.getElementById('tjxxP'))
  option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
      left: 20,
      itemHeight: 7,
      textStyle: {
        color: '#000',
        fontSize: 14
      },
      itemGap: 20,
      icon: 'circle'
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '40%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: true,
            position: 'center',
            color: '#4c4a4a',
            formatter: '{total|' + data[0].FINISHRATE + '%}' + '\n\r' + '{active|整改率}',
            rich: {
              total: {
                fontSize: 35,
                fontFamily: '微软雅黑',
                color: '#454c5c'
              },
              active: {
                fontFamily: '微软雅黑',
                fontSize: 16,
                color: '#6c7a89',
                lineHeight: 30
              }
            }
          },
          emphasis: {
            //中间文字显示
            show: true
          }
        },
        lableLine: {
          normal: {
            show: false
          },
          emphasis: {
            show: true
          },
          tooltip: {
            show: false
          }
        },
        data: [
          { value: data[0].FINISHPROBLEM, name: '今年整改个数' },
          { value: data[0].NOTFINISHPROBLEM, name: '未整改个数' }
        ]
      }
    ]
    //	                    series: [
    //	                        {
    //	                            name: '问题整改情况',
    //	                            type: 'pie',
    //	                            radius: ['45%', '65%'],
    //	                            center: ["50%", "50%"],
    //	                            avoidLabelOverlap: true,
    //	                            label: {
    //	                                show: true,
    //	                                position: 'center',
    //	                                color: '#4c4a4a',
    //	                                formatter: '整改率\n\n'+data[0].FINISHRATE,
    //	                                emphasis: {//中间文字显示
    //	                                    show: true,
    //	                                }
    //	                            },
    //	                       /*     labelLine: {
    //	                            	  show: true,
    //		                                position: 'center',
    //		                                color: '#000',
    //		                                formatter: '整改率\n\n'+data[0].FINISHRATE,
    //	                            },*/
    //	                            data: [
    //	                                   {value:data[0].FINISHPROBLEM, name:'今年整改个数'},
    //	    	                           {value:data[0].NOTFINISHPROBLEM, name:'未整改个数'}
    //	                            ]
    //	                        }
    //	                    ]
  }
  myChart.setOption(option)
}
