const echart_db_str = "<div id='echart_db' class='echart' style='width:80%;margin-top:20px;'></div>"
const myChart_qs = echarts.init(document.getElementById('echart_qs'))
const colors = ['#9ad4d4', '#35abab', '#5cf7cd', '#bbbaff']
$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - 50
  $('.conent').css('height', hh - $('.searchDiv').height() - 50)
  search()
  //	initQst();
})
function search() {
  const year = $('#year').val()
  const fw = $('#fw').val()
  if (fw == 'A000000') {
    // 三级区
    $('#oneTable').hide()
    $('#twoTable').show()
  } else {
    $('#oneTable').show()
    $('#twoTable').hide()
  }
  $('#t_year').html(year) // 改变年份
  jQuery.getJSON(
    parent.basePath + '/message/gb/getSzyGb_Hsl',
    { year: year, fw: fw },
    function (result) {
      let str = ''
      const data = result.list
      if (data != null && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (fw == 'A000000') {
            // 三级区
            if (ifWide(data[i].WRCS_CD)) {
              str +=
                "<tr class='wide'  onclick=\"initLayer('" +
                data[i].WRCS_CD +
                "','" +
                data[i].NM +
                '\')">'
              //str+="<tr class='wide'>";
            } else {
              str += '<tr onclick="initLayer(\'' + data[i].WRCS_CD + "','" + data[i].NM + '\')">'
              //str+="<tr>";
            }

            str += '<td>' + isNull(data[i].AD_NM) + '</td>' + '<td>' + isNull(data[i].NM) + '</td>'
          } else {
            if (ifWide(data[i].WRCS_CD)) {
              str +=
                "<tr class='wide'  onclick=\"initLayer('" +
                data[i].WRCS_CD +
                "','" +
                data[i].NM +
                '\')">'
            } else {
              str += '<tr onclick="initLayer(\'' + data[i].WRCS_CD + "','" + data[i].NM + '\')">'
            }
            str += '<td>' + isNull(data[i].NM) + '</td>'
          }

          str +=
            '<td>' +
            isNull(data[i].STHSL) +
            '</td>' +
            '<td>' +
            isNull(data[i].STHS) +
            '</td>' +
            '<td>' +
            isNull(data[i].SJDHSL) +
            '</td>' +
            '<td>' +
            isNull(data[i].SJDHS) +
            '</td>' +
            '<td>' +
            isNull(data[i].CTHSL) +
            '</td>' +
            '<td>' +
            isNull(data[i].CTHS) +
            '</td>' +
            '<td>' +
            isNull(data[i].LMHSL) +
            '</td>' +
            '<td>' +
            isNull(data[i].LMHS) +
            '</td>' +
            '<td>' +
            isNull(data[i].SCHSL) +
            '</td>' +
            '<td>' +
            isNull(data[i].SCHS) +
            '</td>' +
            '<td>' +
            isNull(data[i].ZLHSL) +
            '</td>' +
            '<td>' +
            isNull(data[i].ZLHS) +
            '</td>' +
            '<td>' +
            isNull(data[i].XHHSL) +
            '</td>' +
            '<td>' +
            isNull(data[i].XHHS) +
            '</td>' +
            '<td>' +
            isNull(data[i].GYHSL) +
            '</td>' +
            '<td>' +
            isNull(data[i].GYHS) +
            '</td>' +
            '<td>' +
            isNull(data[i].JZHSL) +
            '</td>' +
            '<td>' +
            isNull(data[i].JZHS) +
            '</td>' +
            '<td>' +
            isNull(data[i].FWHSL) +
            '</td>' +
            '<td>' +
            isNull(data[i].FWHS) +
            '</td>' +
            '<td>' +
            isNull(data[i].SHCZHSL) +
            '</td>' +
            '<td>' +
            isNull(data[i].SHCZHS) +
            '</td>' +
            '<td>' +
            isNull(data[i].NCHSL) +
            '</td>' +
            '<td>' +
            isNull(data[i].NCHS) +
            '</td>' +
            '<td>' +
            isNull(data[i].STCZHSL) +
            '</td>' +
            '<td>' +
            isNull(data[i].STCZHS) +
            '</td>' +
            '<td>' +
            isNull(data[i].STNCHSL) +
            '</td>' +
            '<td>' +
            isNull(data[i].STNCHS) +
            '</td>' +
            '<td>' +
            isNull(data[i].TOLR) +
            '</td>' +
            '<td>' +
            isNull(data[i].TOL) +
            '</td>' +
            '</tr>'
        }
      }
      if (fw == 'A000000') {
        // 三级区
        $('#tbody_two').empty().append(str)
      } else {
        $('#tbody').empty().append(str)
      }

      if (fw != '' && fw != 'A000000') {
        // 三级区没有图
        $('#echartDiv').empty().append(echart_db_str)
        const myChart_db = echarts.init(document.getElementById('echart_db'))
        let title = ''
        if (fw == '040000') {
          title = year + '年水资源分区耗水量对比分析图'
        } else {
          title = year + '年行政区耗水量对比分析图'
        }
        const option = {
          title: {
            text: title
          },
          tooltip: {},
          legend: {
            data: ['耗水率', '耗水量']
          },
          xAxis: {
            data: result.x
          },
          yAxis: [
            {
              name: '亿m³'
            },
            {
              name: '%'
            }
          ],
          series: [
            {
              name: '耗水率',
              type: 'line',
              barWidth: 20,
              yAxisIndex: 1,
              itemStyle: {
                normal: {
                  color: colors[0]
                }
              },
              data: result.tolr
            },
            {
              name: '耗水量',
              type: 'bar',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: colors[1]
                }
              },
              data: result.tol
            }
          ]
        }
        myChart_db.setOption(option)
      } else {
        $('#echartDiv').empty()
      }
    }
  )
}
function initQst() {
  jQuery.getJSON(parent.basePath + '/message/gb/getHsl_Qst', null, function (result) {
    const option = {
      title: {
        text: '海河流域年耗水量趋势分析图'
      },
      tooltip: {},
      legend: {
        data: ['水量']
      },
      xAxis: {
        data: result.yr
      },
      yAxis: {
        name: '亿m³'
      },
      series: [
        {
          name: '水量',
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                color: colors[0]
              }
            }
          },
          data: result.hsl
        }
      ]
    }
    myChart_qs.setOption(option)
  })
}

function initLayer(wrcs_cd, nm) {
  layer.open({
    type: 2,
    title: nm,
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['850px', '500px'],
    content: basePath + '/pages/kfly/hsl/hsfx/hsl_year_qs.jsp?wrcs_cd=' + wrcs_cd
  })
}
