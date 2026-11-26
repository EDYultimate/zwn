const echart_db_str = "<div id='echart_db' class='echart' style='width:80%;margin-top:20px;'></div>"
const myChart_qs = echarts.init(document.getElementById('echart_qs'))
const colors = ['#9ad4d4', '#35abab', '#5cf7cd', '#bbbaff']
$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - 50
  $('.conent').css('height', hh - $('.searchDiv').height() - 50)
  search()
  initQst()
})
function search() {
  const year = $('#year').val()
  const fw = $('#fw').val()
  jQuery.getJSON(
    parent.basePath + '/message/gb/getSzyGb_Gsl',
    { year: year, fw: fw },
    function (result) {
      let str = ''
      const data = result.list
      if (data != null && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (ifWide(data[i].WRCS_CD)) {
            str += "<tr class='wide'>"
          } else {
            str += '<tr>'
          }
          str +=
            '<td>' +
            isNull(data[i].NM) +
            '</td>' +
            '<td>' +
            isNull(data[i].XS) +
            '</td>' +
            '<td>' +
            isNull(data[i].TS) +
            '</td>' +
            '<td>' +
            isNull(data[i].YS) +
            '</td>' +
            '<td>' +
            isNull(data[i].DRL) +
            '</td>' +
            '<td>' +
            isNull(data[i].LYMC) +
            '</td>' +
            '<td>' +
            isNull(data[i].RG) +
            '</td>' +
            '<td>' +
            isNull(data[i].DBSTOL) +
            '</td>' +
            '<td>' +
            isNull(data[i].QC) +
            '</td>' +
            '<td>' +
            isNull(data[i].SC) +
            '</td>' +
            '<td>' +
            isNull(data[i].WX) +
            '</td>' +
            '<td>' +
            isNull(data[i].DXSTOL) +
            '</td>' +
            '<td>' +
            isNull(data[i].WSCL) +
            '</td>' +
            '<td>' +
            isNull(data[i].YS) +
            '</td>' +
            '<td>' +
            isNull(data[i].HS) +
            '</td>' +
            '<td>' +
            isNull(data[i].QTTOL) +
            '</td>' +
            '<td>' +
            isNull(data[i].TOL) +
            '</td>' +
            '<td>' +
            isNull(data[i].HSLY) +
            '</td>' +
            '<td>' +
            isNull(data[i].SSL) +
            '</td>' +
            '</tr>'
        }
      }
      $('#tbody').empty().append(str)
      if (fw != '') {
        $('#echartDiv').empty().append(echart_db_str)
        const myChart_db = echarts.init(document.getElementById('echart_db'))
        let title = ''
        if (fw == '040000') {
          title = year + '年水资源分区供水量对比分析图'
        } else {
          title = year + '年行政区供水量对比分析图'
        }
        const option = {
          title: {
            text: title
          },
          tooltip: {},
          legend: {
            data: ['地表水供水量', '地下水供水量 ', '其他水源供水量', '总供水量']
          },
          xAxis: {
            data: result.x
          },
          yAxis: {
            name: '亿m³'
          },
          series: [
            {
              name: '地表水供水量',
              type: 'bar',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: colors[0]
                }
              },
              data: result.dbstol
            },
            {
              name: '地下水供水量',
              type: 'bar',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: colors[1]
                }
              },
              data: result.dxstol
            },
            {
              name: '其他水源供水量',
              type: 'bar',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: colors[2]
                }
              },
              data: result.qttol
            },
            {
              name: '总供水量',
              type: 'bar',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: colors[2]
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
  jQuery.getJSON(parent.basePath + '/message/gb/getGsl_Qst', null, function (result) {
    const option = {
      title: {
        text: '海河流域年供水量趋势分析图'
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
          data: result.gsl
        }
      ]
    }
    myChart_qs.setOption(option)
  })
}
