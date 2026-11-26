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
    parent.basePath + '/message/gb/getSzyGb_Dbs',
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
            isNull(data[i].WRCS_AREA) +
            '</td>' +
            '<td>' +
            isNull(data[i].W) +
            '</td>' +
            '<td>' +
            isNull(data[i].LS) +
            '</td>' +
            '<td>' +
            isNull(data[i].SNW) +
            '</td>' +
            '<td>' +
            isNull(data[i].DNPJ) +
            '</td>' +
            '<td>' +
            isNull(data[i].YSN) +
            '</td>' +
            '<td>' +
            isNull(data[i].DNPJB) +
            '</td>' +
            '<td>' +
            isNull(data[i].INSL) +
            '</td>' +
            '<td>' +
            isNull(data[i].OUTSL) +
            '</td>' +
            '<td>' +
            isNull(data[i].RHSL) +
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
          title = year + '年水资源分区地表水对比分析图'
        } else {
          title = year + '年行政区地表水对比分析图'
        }
        const option = {
          title: {
            text: title
          },
          tooltip: {},
          legend: {
            data: ['当年水量', '去年水量', '多年平均']
          },
          xAxis: {
            data: result.x
          },
          yAxis: {
            name: '亿m³'
          },
          series: [
            {
              name: '当年水量',
              type: 'bar',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: colors[0]
                }
              },
              data: result.dbs
            },
            {
              name: '去年水量',
              type: 'bar',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: colors[1]
                }
              },
              data: result.ly_dbs
            },
            {
              name: '多年平均',
              type: 'bar',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: colors[2]
                }
              },
              data: result.avg_dbs
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
  jQuery.getJSON(parent.basePath + '/message/gb/getDbs_Qst', null, function (result) {
    const option = {
      title: {
        text: '海河流域年地表水水量趋势分析图'
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
          data: result.dbs
        }
      ]
    }
    myChart_qs.setOption(option)
  })
}
