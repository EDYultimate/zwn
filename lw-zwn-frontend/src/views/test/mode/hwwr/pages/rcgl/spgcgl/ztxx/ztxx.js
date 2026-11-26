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

  /* if(tp=='01'){
        xkz('getSqxkzByXzq');  //  按行政区划分析许可证个数
        xkqsl('getSqqslByXzq');  //按行政区划分析许可取水量
    }else if(tp=='02'){
        xkz('getSqxkzBySzyfq'); //  按水资源分区分析许可证个数
        xkqsl('getSqqslBySzyfq');  //按水资源分区分析许可取水量
    }*/

  makeTable()

  /*   //许可证个数
    $(".menu li").click(function(){
        $(".clickLiTab").removeClass("clickLiTab");
        $(this).addClass("clickLiTab");

        switch($(this).attr("id")) {
            case 'xzqh':
                xkz('getSqxkzByXzq');  //  按行政区划
                break;
            case 'szyfq':
                xkz('getSqxkzBySzyfq'); //按水资源分区
                break;
        }
    })
    //许可取水量
    $(".menu1 li").click(function(){
        $(".clickLiTab1").removeClass("clickLiTab1");
        $(this).addClass("clickLiTab1");

        switch($(this).attr("id")) {
            case 'xzqh1':
                xkqsl('getSqqslByXzq');  //按行政区划
                break;
            case 'szyfq1':
                xkqsl('getSqqslBySzyfq');  //按水资源分区
                break;
        }
    })
*/
})

function search() {
  /* var tp=$("#tp").val();
   var tm=$("#year").val();
   if(tp=='01'){
       xkz('getSqxkzByXzq');  //  按行政区划分析许可证个数
       xkqsl('getSqqslByXzq');  //按行政区划分析许可取水量
    }else if(tp=='02'){
       xkz('getSqxkzBySzyfq'); //  按水资源分区分析许可证个数
       xkqsl('getSqqslBySzyfq');  //按水资源分区分析许可取水量
   }*/
  makeTable()
}

function makeTable() {
  const tm = $('#year').val()
  const tp = $('#tp').val()
  param.tm = tm
  param.tp = tp
  jQuery.getJSON(basePath + 'rcgl/spgcgl/getQsxktj', param, function (dataList) {
    debugger
    const data = dataList.list
    let sum1 = 0
    let sum2 = 0
    let sum3 = 0
    let sum4 = 0
    let sum5 = 0
    let sum6 = 0
    let sum7 = 0
    const arrX = []
    const arr = []
    const arr1 = []
    const arr2 = []
    const arr3 = []
    const arr4 = []
    const arr5 = []
    const arr6 = []
    const arr7 = []

    for (var i = 0; i < data.length; i++) {
      const dataMap = data[i]
      sum1 += dataMap.SQ //申请个数
      sum2 += dataMap.SL //受理个数
      sum3 += dataMap.XK //批复个数(许可决定)
      sum4 += dataMap.FZSQ //发证申请个数
      sum5 += dataMap.ZZ //制证个数
      sum6 += dataMap.SPSL //批复水量
      sum7 += dataMap.JSSC //技术审查个数
      if (tp == '01') {
        arrX.push(dataMap.AD_NM)
      } else if (tp == '02') {
        arrX.push(dataMap.WRZ_NM)
      }
      arr.push(0) //合计
      arr1.push(dataMap.SQ)
      arr2.push(dataMap.SL)
      arr3.push(dataMap.XK)
      arr4.push(dataMap.FZSQ)
      arr5.push(dataMap.ZZ)
      arr6.push(dataMap.SPSL)
      arr7.push(dataMap.JSSC)
    }
    setAnyChartFun(arrX, arr, arr1, arr2, arr3, arr4, arr5, arr7) //生成许可数量echarts图

    setAnyChartFun1(arrX, arr6) //生成许可水量echarts图

    let tableDiv =
      "<table width='100%' border='0' cellpadding='0' cellspacing='0'    class='bbTable'    style='border-left:0px;border-bottom:0px;'  >" +
      '<thead>' +
      '<tr >'
    if (tp == '01') {
      tableDiv += "<th width='50'>行政区</th>"
    } else if (tp == '02') {
      tableDiv += "<th width='50'>水资源分区</th>"
    }
    tableDiv +=
      "<th width='50'>申请个数</th>" +
      "<th width='50'>受理个数</th>" +
      "<th width='50'>技术审查个数</th>" +
      "<th width='50'>批复个数</th>" +
      "<th width='50'>发证申请个数</th>" +
      /*"<th width='50'>制证个数</th>" +*/
      "<th width='50'>批复水量(万m³)</th>" +
      '</tr></thead><tbody>' +
      '<tr>' +
      '<td>合计</td>' +
      '<td>' +
      sum1 +
      '</td>' +
      '<td>' +
      sum2 +
      '</td>' +
      '<td>' +
      sum7 +
      '</td>' +
      '<td>' +
      sum3 +
      '</td>' +
      '<td>' +
      sum4 +
      '</td>' +
      /* "<td>"+sum5+"</td>"+*/
      '<td>' +
      sum6.toFixed(2) +
      '</td>' +
      '</tr>'
    for (var i = 0; i < data.length; i++) {
      tableDiv += '<tr>'
      if (tp == '01') {
        tableDiv += '<td >' + data[i].AD_NM + '</td>'
      } else if (tp == '02') {
        tableDiv += '<td >' + data[i].WRZ_NM + '</td>'
      }
      tableDiv +=
        '<td>' +
        data[i].SQ +
        '</td>' +
        '<td>' +
        data[i].SL +
        '</td>' +
        '<td>' +
        data[i].JSSC +
        '</td>' +
        '<td>' +
        data[i].XK +
        '</td>' +
        '<td>' +
        data[i].FZSQ +
        '</td>' +
        /*"<td>"+data[i].ZZ+"</td>"+*/
        '<td>' +
        data[i].SPSL +
        '</td>' +
        '</tr>'
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

//分析 许可证数量
/*function xkz(type){
    jQuery.getJSON(basePath+"rcgl/spgcgl/"+type,{"nowTime":Math.random()}, function (dataList)  {
        var data = dataList.list;
        var arr=new Array();
        var arr1=new Array();
        var arr2=new Array();
        var arr3=new Array();
        var  sum1=0;
        var sum2=0;
        var sum3=0;
        for(var i=0;i<data.length;i++){
            var dataMap=data[i];
            if (type=='getSqxkzByXzq'){
                arr.push(dataMap.AD_NM);
            }else if(type=='getSqxkzBySzyfq'){
                arr.push(dataMap.WRZ_NM);
            }
           /!* arr1.push(dataMap.TOTAL);*!/
            arr1.push(0);
            arr2.push(dataMap.SP);
            arr3.push(dataMap.XPWF);

            sum1+=dataMap.TOTAL;
            sum2+=dataMap.SP;
            sum3+=dataMap.XPWF;
        }
        var myChart = echarts.init(document.getElementById("echartDiv"));
        myChart.clear();
        setAnyChartFun(arr,arr1,arr2,arr3);

       /!* var tableDiv= "<table width='100%' border='0' cellpadding='0' cellspacing='0'    class='bbTable'    style='border-left:0px;border-bottom:0px;'   id='tab''>" +
            "<thead>"+
            "<tr >"
        if(type=='getSqxkzByXzq'){
            tableDiv+="<th width='50'>行政区</th>"
        }else if(type=='getSqxkzBySzyfq'){
            tableDiv+=  "<th width='50'>水资源分区</th>"
        }
        tableDiv+= "<th width='50'>总个数</th>" +
            "<th width='50'>取水许可审批</th>" +
            "<th width='50'>新批未发</th>" +
            "</tr></thead><tbody>"+
            "<tr>" +
            "<td>全部</td>"+
            "<td>"+sum1+"</td>"+
            "<td>"+sum2+"</td>"+
            "<td>"+sum3+"</td>"+
            "</tr>"


        for(var i=0;i<data.length;i++){
            tableDiv+="<tr>"
            if(type=='getSqxkzByXzq'){
                tableDiv+="<td >"+data[i].AD_NM+"</td>"
            }else if(type=='getSqxkzBySzyfq'){
                tableDiv+="<td >"+data[i].WRZ_NM+"</td>"
            }
            tableDiv+= "<td>"+data[i].TOTAL+"</td>"+
                "<td>"+data[i].SP+"</td>"+
                "<td>"+data[i].XPWF+"</td>"+
                "</tr>"
        }
        tableDiv += "</tbody></table>";
        $("#tableDiv").html(tableDiv);

        if(type=='getSqxkzByXzq'){
            var trH=0.9*chartH/10;
            $("#tableDiv").find("tr").css("height",trH+"px");
        }else if(type=='getSqxkzBySzyfq'){
            var trH=0.9*chartH/6;
            $("#tableDiv").find("tr").css("height",trH+"px");
        }*!/
    });
}*/

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
function setAnyChartFun(arrX, arr, arr1, arr2, arr3, arr4, arr5, arr7) {
  const myChart = echarts.init(document.getElementById('echartDiv'))
  option = {
    title: {
      text: '许可数量统计',
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
      //data:['申请个数','受理个数','批复个数','发证申请个数','制证个数'],
      //data:['申请个数','受理个数','技术审查个数','批复个数','发证申请个数','制证个数'],
      data: ['申请个数', '受理个数', '技术审查个数', '批复个数', '发证申请个数'],
      top: 30,
      x: 'center'
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
        name: '个数',
        minInterval: 1
        /* axisLabel:{
                     formatter:'{value}'
                 }*/
      }
    ],
    series: [
      {
        name: '申请个数',
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
        name: '受理个数',
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
      {
        name: '技术审查个数',
        type: 'bar',
        stack: '叠图',
        barWidth: 30,
        data: arr7,
        itemStyle: {
          normal: {
            color: '#f0ab4e'
          }
        }
      },
      {
        name: '批复个数',
        type: 'bar',
        stack: '叠图',
        barWidth: 30,
        data: arr3,
        itemStyle: {
          normal: {
            color: '#ff6641'
          }
        }
      },
      {
        name: '发证申请个数',
        type: 'bar',
        stack: '叠图',
        barWidth: 30,
        data: arr4,
        itemStyle: {
          normal: {
            color: '#6ac36b'
          }
        }
      },
      /*    {
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
        name: '总个数',
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
    return data3
  }

  series[series.length - 1].label.normal.formatter = fun
  // 使用刚指定的配置项和数据显示图表。

  myChart.setOption(option)
}

//分析 许可取水量
/*function xkqsl(type){
    jQuery.getJSON(basePath+"rcgl/spgcgl/"+type,{"nowTime":Math.random()}, function (dataList)  {
        var data = dataList.list;
        /!*debugger;*!/
        var arr=new Array();
        var arr1=new Array();
         var arr2=new Array();
         var arr3=new Array();

        var sum1=0;
        var sum2=0;
        var sum3=0;
        for(var i=0;i<data.length;i++){
            var dataMap=data[i];
            if (type=='getSqqslByXzq'){
                arr.push(dataMap.AD_NM);
            }else if(type=='getSqqslBySzyfq'){
                arr.push(dataMap.WRZ_NM);
            }
             arr1.push(dataMap.TOTAL);
             arr2.push(dataMap.SP);
             arr3.push(dataMap.XPWF);

            sum1+=dataMap.TOTAL;
            sum2+=dataMap.SP;
            sum3+=dataMap.XPWF;
        }
        var myChart = echarts.init(document.getElementById("echartDiv1"));
        myChart.clear();
        setAnyChartFun1(arr,arr1,arr2,arr3);

        /!*var tableDiv= "<table width='100%' border='0' cellpadding='0' cellspacing='0' class='bbTable' style='border-left:0px;border-bottom:0px;'  id='tab1'>" +
            "<thead>"+
            "<tr >"
        if(type=='getSqqslByXzq'){
            tableDiv+="<th width='50'>行政区</th>"
        }else if(type=='getSqqslBySzyfq'){
            tableDiv+=  "<th width='50'>水资源分区</th>"
        }
        tableDiv+= "<th width='50'>许可水量(万m³)</th>" +
             "<th width='50'>取水许可审批</th>" +
             "<th width='50'>新批未发</th>" +
            "</tr></thead><tbody>"+
            "<tr>" +
            "<td>全部</td>"+
            "<td>"+sum1+"</td>"+
            "<td>"+sum2+"</td>"+
            "<td>"+sum3+"</td>"+
            "</tr>"

        for(var i=0;i<data.length;i++){
            tableDiv+="<tr>"
            if(type=='getSqqslByXzq'){
                tableDiv+="<td >"+data[i].AD_NM+"</td>"
            }else if(type=='getSqqslBySzyfq'){
                tableDiv+="<td >"+data[i].WRZ_NM+"</td>"
            }
            tableDiv+= "<td>"+data[i].TOTAL+"</td>"+
                 "<td>"+data[i].SP+"</td>"+
                 "<td>"+data[i].XPWF+"</td>"+
                "</tr>"
        }
        tableDiv += "</tbody></table>";
        $("#tableDiv1").html(tableDiv);

        if(type=='getSqqslByXzq'){
            var trH=0.9*chartH/10;
            $("#tableDiv1").find("tr").css("height",trH+"px");
        }else if(type=='getSqqslBySzyfq'){
            var trH=0.9*chartH/6;
            $("#tableDiv1").find("tr").css("height",trH+"px");
        }*!/
    });
}

//生成柱状图
function setAnyChartFun1(arr,arr1,arr2,arr3){
    var myChart = echarts.init(document.getElementById('echartDiv1'));
    option = {
        title: {
            text: '许可水量统计',
            top : 4,
            x:"center",
            textStyle:{
                fontSize:14
            }
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            /!*data:['许可水量']*!/
            data:['取水许可审批','新批未发'],
            top:30,
            x:"center",
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                /!*boundaryGap : false,*!/
                boundaryGap : true,
                data : arr
            }
        ],
        yAxis : [
            {
                type : 'value',
                name :'万m³'
            }
        ],
        series : [
            {
                name:'新批未发',
                type:'bar',
                stack: '总量',
                barWidth : 30,
                areaStyle: {},
                data:arr3,
                itemStyle: {
                    normal: {
                        color: '#ff9908',
                    },
                }
            },

            {
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
            }

        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}*/

//许可水量统计
function setAnyChartFun1(arrX, arr1) {
  const myChart = echarts.init(document.getElementById('echartDiv1'))
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
      data: ['批复水量'],
      top: 30,
      x: 'center'
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
        name: '批复水量',
        type: 'bar',
        stack: '总量',
        barWidth: 30,
        areaStyle: {},
        data: arr1,
        itemStyle: {
          normal: {
            color: '#ff9908'
          }
        },
        label: {
          normal: {
            show: true,
            position: 'top'
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
