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
  //	starttime = moment().add(0-day+1, 'days').format('YYYY-MM');
  // 填入时间查询
  $('#nianFen').val(curtYear)
  //	$('#endTm').val(endtime);

  init()
})

//两个浮点数相加
function FloatAdd(arg1, arg2) {
  let r1, r2, m
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}

function init() {
  const param = { STCD: stcd, YR: $('#nianFen').val(), ST_TP: st_tp }
  //    console.log("iniinitinitinitt:",param);
  //只有考核断面显示这个页面
  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterEcologyFlowMapStandardAppraiseInfo',
    param,
    function (result) {
      console.log('dbpgresult:', result)

      if (st_tp == '1' || st_tp == '3') {
        $('#statTitle1').css('display', 'block')
        $('#statTitle2').css('display', 'block')
        $('#statTitle3').css('display', 'block')
      }
      if (result.ASS_TP == 5) {
        //如果时年，则对应水量，不显示断面时段数，显示累计水量值
        var list = result.data
        let TOTAL_VAL_JS = 0.0
        var str = ''
        if (list != null && list.length > 0) {
          for (var i = 0; i < list.length; i++) {
            str +=
              '<tr>' +
              '<td>' +
              isNull(list[i].TM.substr(0, 4)) +
              '年' +
              isNull(list[i].TM.substr(4, 2)) +
              '月</td>' +
              //								"<td>月</td>" +
              '<td>' +
              isNullRealVal(list[i].REAL_VAL) +
              '</td>'
            if (list[i].ST_TP == '1' || list[i].ST_TP == '3') {
              if (
                result.STCD == '30700500' ||
                result.STCD == '30702400' ||
                result.STCD == '30705600' ||
                result.STCD == '30101400'
              ) {
                str +=
                  '<td>' +
                  isNull(list[i].ATTACH_VAL) +
                  '</td>' +
                  '<td>' +
                  isNull(list[i].REAL_VAL_HAN) +
                  '</td>' +
                  '<td>' +
                  isNull(list[i].TOTAL_VAL) +
                  '</td>'
              } else {
                str +=
                  '<td>' +
                  isNull(list[i].REAL_VAL_HAN) +
                  '</td>' +
                  '<td>' +
                  isNull(list[i].TOTAL_VAL) +
                  '</td>'
                $('#titleAttach').css('display', 'none')
              }
            } else if (list[i].ST_TP == '4') {
              if (list[i].REAL_VAL != null) {
                TOTAL_VAL_JS = FloatAdd(TOTAL_VAL_JS, parseFloat(list[i].REAL_VAL).toFixed(2))
              } else {
                TOTAL_VAL_JS = ''
              }

              str += '<td>' + isNull(TOTAL_VAL_JS) + '</td>'
            }
            str += '</tr>'
          }
        }
        $('#tbody').empty().append(str)

        if (result.ST_TP == 1 || result.ST_TP == 3) {
          $('#titleReal').text('径流量')
          $('#titleTotal').text('累计生态水量')

          $('#titleRealHan').text('生态水量')
          let attachName = ''
          switch (result.STCD) {
            case '00000001':
              attachName = '岩山渠首'
              break
            case '30700500':
              attachName = '小红门'
              break
            case '30702400':
              attachName = '下游灌区取水'
              break
            case '30705600':
              attachName = '下游灌区取水'
              break
            case '00000015':
              attachName = '下游灌区取水'
          }
          $('#titleAttach').text(attachName)
        } else {
          if (result.STCD == '00000004') {
            $('#titleReal').text('补水量')
            $('#titleTotal').text('累计补水量')
          } else {
            $('#titleReal').text('取水量')
            $('#titleTotal').text('累计取水量')
          }

          $('#titleAttach').css('display', 'none')
          $('#titleRealHan').css('display', 'none')
        }

        //				$("#titleRealHan").text("月生态水量(扣除)");

        //				$("#titleGoal").text("累计水量(m³)");
        //				$("#titleGoal").text("累计水量");
        //				$("#titleRes").css('display','none');
        let leiJiShuiLiang

        if (result.ST_TP == 4) {
          leiJiShuiLiang = TOTAL_VAL_JS
        } else {
          leiJiShuiLiang = result.leiJiShuiLiang
        }
        const muBiaoShuiLiang = result.muBiaoShuiLiang
        const daBiaoQingKuang = result.daBiaoQingKuang
        $('#statTitleDiv1').text('累计水量')
        if (leiJiShuiLiang == '-' || leiJiShuiLiang == '') {
          $('#statValDiv1').html(isNull(leiJiShuiLiang))
        } else {
          $('#statValDiv1').html(
            isNull(parseFloat(leiJiShuiLiang).toFixed(1)) + "<span style='font-size:12'>万m³</span>"
          )
        }

        $('#statTitleDiv2').text('目标水量')

        if (muBiaoShuiLiang == '-' || muBiaoShuiLiang == '') {
          $('#statValDiv2').html(isNull(muBiaoShuiLiang))
        } else {
          $('#statValDiv2').html(
            isNull(parseFloat(muBiaoShuiLiang).toFixed(1)) +
              "<span style='font-size:12'>万m³</span>"
          )
        }

        $('#statTitleDiv3').text('达标情况')
        $('#statValDiv3').html(isNull(daBiaoQingKuang))

        var xName = []
        const yShengTaiShuiLiang = []
        const yLeiJiShuiLiang = []
        var yMuBiaoZhi = []

        if (list != null && list.length > 0) {
          for (var i = 0; i < list.length; ++i) {
            if (result.ST_TP == 1 || result.ST_TP == 3) {
              yShengTaiShuiLiang.push(list[i].REAL_VAL_HAN)
            } else {
              yShengTaiShuiLiang.push(list[i].REAL_VAL)
            }

            xName.push(isNull(list[i].TM))
            //						yShengTaiShuiLiang.push(list[i].REAL_VAL);
            yLeiJiShuiLiang.push(isNull(list[i].TOTAL_VAL))
            yMuBiaoZhi.push(isNull(list[i].GOAL_V))
          }
        }
        if (result.ST_TP == 1 || result.ST_TP == 3) {
          echartsYearShuiLiang(xName, yShengTaiShuiLiang, yLeiJiShuiLiang, yMuBiaoZhi)
        } else {
          echartsYearShuiLiangCompute(xName, yShengTaiShuiLiang, yLeiJiShuiLiang)
        }
      } else if (
        result.ASS_TP == 1 ||
        result.ASS_TP == 2 ||
        result.ASS_TP == 3 ||
        result.ASS_TP == 4
      ) {
        //如果时季、月、旬、日
        //	    	   var titleDateUnit;
        //	    	   var PRDTPstat;
        //	    		if(result.ASS_TP==1){
        //	    			titleDateUnit = '日';
        //	    		}
        //	    		else if(result.ASS_TP==2){

        //	    			titleDateUnit = '旬均';
        //	    		}
        //	    		else if(result.ASS_TP==3){
        //	    			titleDateUnit = '月均';
        //	    		}else if(result.ASS_TP==4){
        //	    			titleDateUnit = '季均';
        //	    		}else{
        //	    			titleDateUnit = '';
        //	    		}
        //				$("#titleDateUnit").text(titleDateUnit);

        var list = result.data
        if (list != null && list.length > 0) {
          var str = ''
          for (var i = 0; i < list.length; i++) {
            //						if(result.ASS_TP==2){
            //							switch(list[i].PRDTP) {
            //						     case "1":
            //						    	 titleDateUnit = '上旬';
            //						        break;
            //						     case "2":
            //						    	 titleDateUnit = '中旬';
            //						        break;
            //						     default:
            //						    	 titleDateUnit = '下旬';
            //							}
            //						}
            str += '<tr>'
            //								"<td>"+isNull(titleDateUnit)+"</td>" +
            if (list[i].ASS_TP == 1) {
              str +=
                '<td>' +
                isNull(list[i].TM.substr(0, 4)) +
                '年' +
                isNull(list[i].TM.substr(4, 2)) +
                '月' +
                isNull(list[i].TM.substr(6, 2)) +
                '日</td>' +
                '<td>' +
                isNullRealVal(list[i].REAL_VAL) +
                '</td>' +
                "<td title='" +
                isNull(list[i].TOTAL_VAL) +
                "'  >" +
                isNull(list[i].TOTAL_VAL) +
                '</td>'
            } else if (list[i].ASS_TP == 2) {
              str +=
                '<td>' +
                isNull(list[i].TM.substr(0, 4)) +
                '年' +
                isNull(list[i].TM.substr(4, 2)) +
                '月'
              if (list[i].TM.substr(6, 1) == 1) {
                str += '上旬</td>'
              } else if (list[i].TM.substr(6, 1) == 2) {
                str += '中旬</td>'
              } else if (list[i].TM.substr(6, 1) == 3) {
                str += '下旬</td>'
              }
              str += '<td>' + isNullRealVal(list[i].REAL_VAL) + '</td>'
            } else if (list[i].ASS_TP == 3) {
              str +=
                '<td>' +
                isNull(list[i].TM.substr(0, 4)) +
                '年' +
                isNull(list[i].TM.substr(4, 2)) +
                '月</td>' +
                '<td>' +
                isNullRealVal(list[i].REAL_VAL) +
                '</td>'
            } else if (list[i].ASS_TP == 4) {
              str +=
                '<td>' +
                isNull(list[i].TM.substr(0, 4)) +
                '年' +
                isNull(list[i].TM.substr(4, 1)) +
                '季度</td>' +
                '<td>' +
                isNullRealVal(list[i].REAL_VAL) +
                '</td>'
            }
            //								"<td>"+isNull(list[i].GOAL_V)+"</td>" +
            if (param.ST_TP != 2 && param.ST_TP != 4) {
              if (list[i].RES == 0) {
                str += "<td style='color: red;'>未达标</td>"
              } else if (list[i].RES == 1) {
                str += '<td>达标</td>'
              } else if (list[i].RES == 2) {
                str += '<td>非考核期</td>'
              } else if (list[i].RES == 3) {
                //										str+="<td>还没录入</td>";
                str += '<td>录入数据不合规</td>'
              } else if (list[i].RES == 5) {
                str += '<td>不参与考核</td>'
              } else if (list[i].RES == null) {
                str += '<td>还没录入</td>'
              }
            }
            str += '</tr>'
          }
          //					console.log(str);
        }
        $('#tbody').empty().append(str)

        let titleReal
        if (result.kaohezhibiao == 1) {
          titleReal = '水位(m)'
        } else if (result.kaohezhibiao == 2) {
          titleReal = '水量(万m³)'
        } else if (result.kaohezhibiao == 3) {
          titleReal = '流量(m³/s)'
        } else {
          titleReal = ''
        }
        $('#titleReal').text(titleReal)
        //				$("#titleGoal").text("累计水量(m³)");
        //				console.log("ST_TP ",param.ST_TP);
        if (param.ST_TP != 2 && param.ST_TP != 4) {
          $('#titleRealHan').text('考核结果')
        } else {
          $('#titleRealHan').css('display', 'none')
        }
        $('#titleAttach').css('display', 'none')
        $('#titleTotal').css('display', 'none')

        if (result.ASS_TP == 1) {
          $('#titleTotal').css('display', 'block')
          $('#titleTotal').text('考核结果')
          $('#titleRealHan').text('蓄水总量')
        }

        //				$("#titleRes").css('display','revert');

        //				$("#titleRes").text("考核结果");

        //				var kaoheshiduanshu = result.kaoheshiduanshu;
        //				var dabiaoshiduanshu = result.dabiaoshiduanshu;
        //				var baozhengchengdu = (parseFloat(dabiaoshiduanshu)/parseFloat(kaoheshiduanshu)*100).toFixed(1);
        //				console.log(kaoheshiduanshu);
        //				console.log(dabiaoshiduanshu);
        //				console.log(baozhengchengdu);
        //
        //				$("#statTitleDiv1").text("考核时段数");
        //				$("#statValDiv1").text(isNull(kaoheshiduanshu));
        //
        //				$("#statTitleDiv2").text("达标时段数");
        //				$("#statValDiv2").text(isNull(dabiaoshiduanshu));
        //				$("#statTitleDiv3").text("保证程度");
        //				$("#statValDiv3").text(baozhengchengdu+"%");

        //获取考核时段数、达标时段数两个指标，显示在下边的方框中。
        param.TAR_Y = $('#nianFen').val()
        param.pageSize = 1
        param.pageNo = 1
        jQuery.getJSON(
          basePath + 'szybh/ywgz/getSaveWaterEcologyFlowWarnDetailInfo',
          param,
          function (result) {
            console.log('result', result)
            const data = result.page.list
            if (data != null && data.length > 0) {
              $('#statTitleDiv1').text('考核时段数')
              $('#statValDiv1').text(isNull(data[0].REL_CHECK_TIME_NUM))
              $('#statTitleDiv2').text('达标时段数')
              $('#statValDiv2').text(isNull(data[0].DBNUM))
              $('#statTitleDiv3').text('保证程度')
              $('#statValDiv3').text(isNull(data[0].DBRATE) + '%')
            } else {
              $('#statValDiv1').text('')
              $('#statValDiv2').text('')
              $('#statValDiv3').text('')
            }
          }
        )

        var xName = []
        const yShiJiZhi = []
        var yMuBiaoZhi = []

        if (list != null && list.length > 0) {
          for (var i = 0; i < list.length; ++i) {
            //						var titleDateUnit;
            //						switch(list[i].PRDTP) {
            //					     case "1":
            //					    	 titleDateUnit = '上旬';
            //					        break;
            //					     case "2":
            //					    	 titleDateUnit = '中旬';
            //					        break;
            //					     default:
            //					    	 titleDateUnit = '下旬';
            //						}
            //						if(list[i].NEWDATE.substr(4,1)=='0')
            //							xName.push(isNull(list[i].NEWDATE.substr(5,1)+"月"+titleDateUnit));
            //						else
            //							xName.push(isNull(list[i].NEWDATE.substr(4,2)+"月"+titleDateUnit));
            //						xName.push(isNull(list[i].TM));

            //						console.log("ssss",list[i].TM.substr(0,6));
            if (list[i].ASS_TP == 2) {
              if (list[i].TM.substr(6, 1) == 1) {
                xName.push(list[i].TM.substr(0, 4) + '年' + list[i].TM.substr(4, 2) + '月上旬')
              } else if (list[i].TM.substr(6, 1) == 2) {
                xName.push(list[i].TM.substr(0, 4) + '年' + list[i].TM.substr(4, 2) + '月中旬')
              } else if (list[i].TM.substr(6, 1) == 3) {
                xName.push(list[i].TM.substr(0, 4) + '年' + list[i].TM.substr(4, 2) + '月下旬')
              }
            } else if (list[i].ASS_TP == 3) {
              xName.push(list[i].TM.substr(0, 4) + '年' + list[i].TM.substr(4, 2) + '月')
            } else {
              //							xName.push(list[i].TM.substr(0,4)+"年"+list[i].TM.substr(4,2)+"月"+list[i].TM.substr(6,2)+"日");

              xName.push(isNull(list[i].TM))
            }
            yShiJiZhi.push(list[i].REAL_VAL)
            yMuBiaoZhi.push(isNull(list[i].GOAL_V))
          }
        }
        if (result.ASS_TP == 1) {
          echartsNotYearDBPGInterval(xName, yShiJiZhi, yMuBiaoZhi, titleReal)
        } else {
          echartsNotYearDBPG(xName, yShiJiZhi, yMuBiaoZhi, titleReal)
        }
      }

      //	       if(result.daBiaoQingKuang==null){
      //				$("#statValDiv2").html("-");
      //				$("#statValDiv3").html("-");
      //
      //	       }
    }
  )
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
        let xName = []
        if (result.ASS_TP == 5) {
          //如果时年，则对应水量，不显示断面时段数，显示累计水量值
          var list = result.data
          var listPre = result.dataPre
          const yShengTaiShuiLiang = []

          if (list != null && list.length > 0) {
            for (var i = 0; i < list.length; ++i) {
              //							xName.push(isNull(list[i].NEWDATE));
              yShengTaiShuiLiang.push(list[i].SHUILIANG)
            }
          }

          const yShengTaiShuiLiangPre = []
          if (listPre != null && listPre.length > 0) {
            for (var i = 0; i < listPre.length; ++i) {
              xName.push(isNull(listPre[i].NEWDATE))

              yShengTaiShuiLiangPre.push(isNull(listPre[i].SHUILIANG))
            }
          }
          echartsYearShuiLiangSameCompare(xName, yShengTaiShuiLiang, yShengTaiShuiLiangPre)
        } else {
          let titleReal
          if (result.kaohezhibiao == 1) {
            titleReal = '水位(m)'
          } else if (result.kaohezhibiao == 2) {
            titleReal = '水量(万m³)'
          } else if (result.kaohezhibiao == 3) {
            titleReal = '流量(m³/s)'
          } else {
            titleReal = '-'
          }
          var list = result.data
          var listPre = result.dataPre
          const xNowName = []
          const yNowValue = []

          if (list != null && list.length > 0) {
            for (var i = 0; i < list.length; ++i) {
              //							xNowName.push(isNull(list[i].TM));
              if (list[i].ASS_TP == 2) {
                if (list[i].TM.substr(6, 1) == 1) {
                  xNowName.push(list[i].TM.substr(4, 2) + '月上旬')
                } else if (list[i].TM.substr(6, 1) == 2) {
                  xNowName.push(list[i].TM.substr(4, 2) + '月中旬')
                } else if (list[i].TM.substr(6, 1) == 3) {
                  xNowName.push(list[i].TM.substr(4, 2) + '月下旬')
                }
              } else if (list[i].ASS_TP == 3) {
                xNowName.push(list[i].TM.substr(4, 2) + '月')
              } else {
                xNowName.push(isNull(list[i].TM))
              }
              yNowValue.push(list[i].REAL_VAL)
            }
          }

          const xPreName = []
          const yPreValue = []
          if (listPre != null && listPre.length > 0) {
            for (var i = 0; i < listPre.length; ++i) {
              //							xPreName.push(isNull(listPre[i].TM));
              if (listPre[i].ASS_TP == 2) {
                if (listPre[i].TM.substr(6, 1) == 1) {
                  xPreName.push(listPre[i].TM.substr(4, 2) + '月上旬')
                } else if (listPre[i].TM.substr(6, 1) == 2) {
                  xPreName.push(listPre[i].TM.substr(4, 2) + '月中旬')
                } else if (listPre[i].TM.substr(6, 1) == 3) {
                  xPreName.push(listPre[i].TM.substr(4, 2) + '月下旬')
                }
              } else if (listPre[i].ASS_TP == 3) {
                xPreName.push(listPre[i].TM.substr(4, 2) + '月')
              } else {
                xPreName.push(isNull(listPre[i].TM))
              }
              yPreValue.push(isNull(listPre[i].REAL_VAL))
            }
          }

          xName = xNowName.length > xPreName.length ? xNowName : xPreName
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
      height: 210,
      width: 460
    },

    legend: [
      {
        //		    	top: "15%",
        left: '10',
        data: [{ name: '径流量', icon: 'image://images/savewater/bar.png' }],
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
        name: '径流量(万m³)'
        //	                    min: 0,
        //	                    max: 250,
        //	                    interval: 50,
        //	                    axisLabel: {
        //	                        formatter: '{value} ml'
        //	                    }
      },
      {
        type: 'value',
        name: '累计生态水量/目标值(万m³)'
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
        name: '径流量',
        type: 'bar',
        data: yShengTaiShuiLiang,
        //					data: [120, 200, 150, 80, 70, 110, 130],

        itemStyle: {
          normal: {
            color: '#3cceb1'
          }
        },
        barWidth: 30
      },
      {
        name: '累计生态水量',
        type: 'line',
        yAxisIndex: 1,
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
        yAxisIndex: 1,
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

// echartsYearShuiLiangCompute

function echartsYearShuiLiangCompute(xName, yShengTaiShuiLiang, yLeiJiShuiLiang) {
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
      height: 210,
      width: 460
    },

    // 		    legend:
    legend: [
      {
        // 		    	top: "15%",
        left: '10',
        data: [{ name: '径流量', icon: 'image://images/savewater/bar.png' }],
        // 	            x:"left",
        // 	            padding:[0, 0,0,23],
        itemWidth: 10,
        itemHeight: 10
      },
      {
        data: [{ name: '累计生态水量', icon: 'image://images/savewater/line1.png' }],
        // 	            x:"left",
        left: '110',
        // 	            padding:[0, 0,0,23],
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
        name: '水量(万m³)'
      },
      {
        type: 'value',
        name: '累计生态水量(万m³)'
      }
    ],
    series: [
      {
        name: '径流量',
        type: 'bar',
        data: yShengTaiShuiLiang,

        itemStyle: {
          normal: {
            color: '#3cceb1'
          }
        },
        barWidth: 30
      },
      {
        name: '累计生态水量',
        type: 'line',
        yAxisIndex: 1,
        data: yLeiJiShuiLiang,
        itemStyle: {
          normal: {
            color: '#5178ea'
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
        data: [{ name: '径流量(今年)', icon: 'image://images/savewater/bar.png' }],
        itemWidth: 10,
        itemHeight: 10
      },
      {
        data: [{ name: '径流量(去年)', icon: 'image://images/savewater/line1.png' }],
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
        name: '水量(万m³)'
        //	                    axisLabel: {
        //	                        formatter: '{value} ml'
        //	                    }
      }
    ],
    series: [
      {
        name: '径流量(今年)',
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
        name: '径流量(去年)',
        type: 'line',
        data: yShengTaiShuiLiangPre,
        itemStyle: {
          normal: {
            color: '#5178ea'
          }
        },
        barWidth: 50
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
        //		                axisPointer: {
        //		                    type: 'shadow'
        //		                }
        axisLabel: {
          //			                interval: 10,
          //		                    rotate: 90
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: titleReal
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
        name: '实际值',
        type: 'bar',
        data: yShiJiZhi,
        itemStyle: {
          normal: {
            color: '#5178EA'
          }
        },
        barWidth: 20
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
        //	                barWidth: 50
      }
    ]
  }

  const myChartYearShuiLiang = echarts.init(document.getElementById('rightDiv'))
  myChartYearShuiLiang.setOption(option)
}

function echartsNotYearDBPGInterval(xName, yShiJiZhi, yMuBiaoZhi, titleReal) {
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
        //		                axisPointer: {
        //		                    type: 'shadow'
        //		                }
        axisLabel: {
          interval: 30
          //		                    rotate: 90
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: titleReal
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
        name: '实际值',
        type: 'line',
        data: yShiJiZhi,
        itemStyle: {
          normal: {
            color: '#5178EA'
          }
        }
        //	                barWidth: 20
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
        //	                barWidth: 50
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
        name: titleReal
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
        name: titleReal + '今年',
        type: 'line',
        data: yNowValue,
        itemStyle: {
          normal: {
            color: '#5178EA'
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
            color: '#FF6446'
          }
        },
        barWidth: 50
      }
    ]
  }

  const myChartYearShuiLiang = echarts.init(document.getElementById('rightDiv'))
  myChartYearShuiLiang.setOption(option)
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

/*处理表格空或者未定义字段*/
function isNullRealVal(vad) {
  if (vad === undefined || vad === null || vad === '' || vad === 'undefined' || vad === 'null') {
    return '还没录入'
  }
  return vad
}
