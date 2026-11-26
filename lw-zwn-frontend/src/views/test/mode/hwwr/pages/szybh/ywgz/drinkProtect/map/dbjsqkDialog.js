//存放图片地址
//var picturePathHeader="http://localhost:8080/hwwr/";
//var picturePathHeader="http://localhost:8082/hwwrUpload/";
const picturePathHeader = 'http://10.3.250.90:8082/hwwrUpload/'

//var picturePathHeader="http://10.3.34.196:3721/hwwr";

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
  const imgStr = ''
  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterDrinkProtectDBJS', param, function (result) {
    console.log('getSaveWaterDrinkProtectDBJS:', result.length)
    if (result.length > 0) {
      if (result[0].ASSESS_DATE != null) {
        $('#ASSESS_DATE').html(result[0].ASSESS_DATE)
      } else {
        $('#ASSESS_DATE').html('')
      }
      if (result[0].ASSESS_RES != null) {
        $('#ASSESS_RES').html(result[0].ASSESS_RES)
      } else {
        $('#ASSESS_RES').html('')
      }
      if (result[0].PROBLEM != null) {
        $('#PROBLEM').html(result[0].PROBLEM)
      } else {
        $('#PROBLEM').html('')
      }
      if (result[0].REFORM != null) {
        $('#REFORM').html(result[0].REFORM)
      } else {
        $('#REFORM').html('')
      }
      //		     $('#ASSESS_RES').html(result[0].ASSESS_RES);
      //		     $('#PROBLEM').html(result[0].PROBLEM);
      //		     $('#REFORM').html(result[0].REFORM);
      //		     for(var i=0;i<result.length;i++){
      //		    	 //拼接图片层
      //		    	 imgStr+="<div class=\"picitem_outDiv\"><div class=\"picDiv\">" +
      //     			"<img onClick=\"openEdit('"+id+"')\" src='"+picturePathHeader+isNull(data[i].FILE_URL)+"' ></div><div class=\"pic_bottomOutDiv\" >" +
      //     		"<div class=\"picitem_bottomDiv\" >类型:"+unittpFormat(data[i].TP)+"</div>" +
      //     		"<div class=\"picitem_bottomDiv\" >描述:"+isNull(data[i].DETAILINFO)+"</div>" +
      //     		"<div class=\"picitem_bottomDiv\" >照片时间:"+isNull(data[i].TM)+"</div>" +
      //     		"<div class=\"picitem_bottomDiv\" >上传人:"+isNull(data[i].UP_PERSON)+"" +
      //     		"<div style=\"color:red;float:right;cursor:pointer\" onclick=\"delPic('"+fileid+"','"+id+"','"+filenm+"')\">删除</div>" +
      //     		"</div></div></div>";
      //		     }

      //		     $('#reformImg1').attr('src',basePath+result[0].IMAGE1_P);
      if (result[0].IMAGE1_P != null) {
        $('#reformImg1').attr(
          'src',
          basePath + result[0].IMAGE1_P.substring(2, result[0].IMAGE1_P.length)
        )
        $('#reformSpan1').html(result[0].IMAGE1_T)
      } else {
        $('#reformImg1').attr('src', '')
        $('#reformSpan1').html('')
      }
      if (result[0].IMAGE2_P != null) {
        $('#reformImg2').attr(
          'src',
          basePath + result[0].IMAGE2_P.substring(2, result[0].IMAGE2_P.length)
        )
        $('#reformSpan2').html(result[0].IMAGE2_T)
      } else {
        $('#reformImg2').attr('src', '')
        $('#reformSpan2').html('')
      }
      if (result[0].IMAGE3_P != null) {
        $('#reformImg3').attr(
          'src',
          basePath + result[0].IMAGE3_P.substring(2, result[0].IMAGE3_P.length)
        )
        $('#reformSpan3').html(result[0].IMAGE3_T)
      } else {
        $('#reformImg3').attr('src', '')
        $('#reformSpan3').html('')
      }
      if (result[0].IMAGE4_P != null) {
        $('#reformImg4').attr(
          'src',
          basePath + result[0].IMAGE4_P.substring(2, result[0].IMAGE4_P.length)
        )
        $('#reformSpan4').html(result[0].IMAGE4_T)
      } else {
        $('#reformImg4').attr('src', '')
        $('#reformSpan4').html('')
      }
    } else {
      $('#ASSESS_DATE').html('')
      $('#ASSESS_RES').html('')
      $('#PROBLEM').html('')
      $('#REFORM').html('')
      $('#reformImg1').attr('src', '')
      $('#reformSpan1').html('')
      $('#reformImg2').attr('src', '')
      $('#reformSpan2').html('')
      $('#reformImg3').attr('src', '')
      $('#reformSpan3').html('')
      $('#reformImg4').attr('src', '')
      $('#reformSpan4').html('')
    }
    //	     $("#imgDiv").empty().append(imgStr);
  })
}

function echartsYearShuiLiang(xName, yShengTaiShuiLiang, yLeiJiShuiLiang, yMuBiaoZhi) {
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

    //		    legend:
    legend: [
      {
        //		    	top: "15%",
        left: '10',
        data: [{ name: '月生态水量', icon: 'image://images/savewater/bar.png' }],
        //	            x:"left",
        //	            padding:[0, 0,0,23],
        itemWidth: 10,
        itemHeight: 10
      },
      {
        data: [{ name: '累计生态水量', icon: 'image://images/savewater/line1.png' }],
        //	            x:"left",
        left: '110',
        //	            padding:[0, 0,0,23],
        itemWidth: 10,
        itemHeight: 3
      },
      {
        data: [{ name: '目标值', icon: 'image://images/savewater/line2.png' }],
        //		            x:"left",
        left: '230',
        //		            padding:[0, 0,0,23],
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
        type: 'value',
        name: '水量(亿m³)',
        //	                    min: 0,
        //	                    max: 250,
        //	                    interval: 50,
        axisLabel: {
          formatter: '{value} ml'
        }
      }
    ],
    series: [
      {
        name: '月生态水量',
        type: 'bar',
        data: yShengTaiShuiLiang,
        itemStyle: {
          normal: {
            color: '#3cceb1'
          }
        },
        barWidth: 50
      },
      {
        name: '累计生态水量',
        type: 'line',
        data: yLeiJiShuiLiang,
        itemStyle: {
          normal: {
            color: '#5178ea'
          }
        }
      },
      {
        name: '目标值',
        type: 'line',
        data: yMuBiaoZhi,
        itemStyle: {
          normal: {
            color: '#ff6446'
          }
        }
      }
    ]
  }

  const myChartYearShuiLiang = echarts.init(document.getElementById('rightDiv'))
  myChartYearShuiLiang.setOption(option)
}

function echartsYearShuiLiangSameCompare(xName, yShengTaiShuiLiang, yShengTaiShuiLiangPre) {
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
        left: '10',
        data: [{ name: '月生态水量(今年)', icon: 'image://images/savewater/bar.png' }],
        itemWidth: 10,
        itemHeight: 10
      },
      {
        data: [{ name: '月生态水量(去年)', icon: 'image://images/savewater/line1.png' }],
        left: '125',
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
        type: 'value',
        name: '水量(亿m³)',
        axisLabel: {
          formatter: '{value} ml'
        }
      }
    ],
    series: [
      {
        name: '月生态水量(今年)',
        type: 'line',
        data: yShengTaiShuiLiang,
        itemStyle: {
          normal: {
            color: '#3cceb1'
          }
        },
        barWidth: 50
      },
      {
        name: '月生态水量(去年)',
        type: 'line',
        data: yShengTaiShuiLiangPre,
        itemStyle: {
          normal: {
            color: '#5178ea'
          }
        }
      }
    ]
  }
  //	console.log(111);
  echarts.init(document.getElementById('rightDiv')).dispose() //销毁前一个实例
  const myChartYearShuiLiang = echarts.init(document.getElementById('rightDiv'))
  myChartYearShuiLiang.setOption(option)
}

function echartsNotYearDBPG(xName, yShiJiZhi, yMuBiaoZhi, titleReal) {
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
        left: '30',
        data: [{ name: '实际值', icon: 'image://images/savewater/line1.png' }],
        itemWidth: 10,
        itemHeight: 3
      },
      {
        data: [{ name: '目标值', icon: 'image://images/savewater/line2.png' }],
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
        type: 'value',
        name: titleReal,
        //	                    min: 0,
        //	                    max: 250,
        //	                    interval: 50,
        axisLabel: {
          formatter: '{value} ml'
        }
      }
    ],
    series: [
      {
        name: '实际值',
        type: 'bar',
        data: yShiJiZhi,
        itemStyle: {
          normal: {
            color: '#3cceb1'
          }
        },
        barWidth: 50
      },
      {
        name: '目标值',
        type: 'line',
        data: yMuBiaoZhi,
        itemStyle: {
          normal: {
            color: '#ff6446'
          }
        }
      }
    ]
  }

  const myChartYearShuiLiang = echarts.init(document.getElementById('rightDiv'))
  myChartYearShuiLiang.setOption(option)
}

function echartsNotYearDBPGSameCompare(xName, yNowValue, yPreValue, titleReal) {
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
        left: '30',
        data: [{ name: titleReal + '今年', icon: 'image://images/savewater/line1.png' }],
        itemWidth: 10,
        itemHeight: 3
      },
      {
        data: [{ name: titleReal + '去年', icon: 'image://images/savewater/line2.png' }],
        left: '100',
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
        type: 'value',
        name: titleReal,
        //	                    min: 0,
        //	                    max: 250,
        //	                    interval: 50,
        axisLabel: {
          formatter: '{value} ml'
        }
      }
    ],
    series: [
      {
        name: titleReal + '今年',
        type: 'line',
        data: yNowValue,
        itemStyle: {
          normal: {
            color: '#3cceb1'
          }
        },
        barWidth: 50
      },
      {
        name: titleReal + '去年',
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

  const myChartYearShuiLiang = echarts.init(document.getElementById('rightDiv'))
  myChartYearShuiLiang.setOption(option)
}
