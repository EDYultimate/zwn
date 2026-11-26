const echart_db_str = "<div id='echart_db' class='echart' style='width:80%;margin-top:20px;'></div>"
const myChart_qs = echarts.init(document.getElementById('echart_qs'))
const colors = ['#9ad4d4', '#35abab', '#5cf7cd', '#bbbaff', '#2671c5', '#a486c5', '#de6c5a']
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
    parent.basePath + '/message/gb/getSzyGb_Ysl',
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
            isNull(data[i].ST) +
            '</td>' +
            '<td>' +
            isNull(data[i].SJD) +
            '</td>' +
            '<td>' +
            isNull(data[i].CT) +
            '</td>' +
            '<td>' +
            isNull(data[i].NTTOL) +
            '</td>' +
            '<td>' +
            isNull(data[i].NTDXS) +
            '</td>' +
            '<td>' +
            isNull(data[i].LG) +
            '</td>' +
            '<td>' +
            isNull(data[i].CC) +
            '</td>' +
            '<td>' +
            isNull(data[i].YT) +
            '</td>' +
            '<td>' +
            isNull(data[i].SC) +
            '</td>' +
            '<td>' +
            isNull(data[i].LMTOL) +
            '</td>' +
            '<td>' +
            isNull(data[i].LMDXS) +
            '</td>' +
            '<td>' +
            isNull(data[i].ZL) +
            '</td>' +
            '<td>' +
            isNull(data[i].XH) +
            '</td>' +
            '<td>' +
            isNull(data[i].GYYS) +
            '</td>' +
            '<td>' +
            isNull(data[i].GMYX) +
            '</td>' +
            '<td>' +
            isNull(data[i].GYTOL) +
            '</td>' +
            '<td>' +
            isNull(data[i].GYDXS) +
            '</td>' +
            '<td>' +
            isNull(data[i].JZY) +
            '</td>' +
            '<td>' +
            isNull(data[i].FWY) +
            '</td>' +
            '<td>' +
            isNull(data[i].QTTOL) +
            '</td>' +
            '<td>' +
            isNull(data[i].CZDXS) +
            '</td>' +
            '<td>' +
            isNull(data[i].CZ) +
            '</td>' +
            '<td>' +
            isNull(data[i].NC) +
            '</td>' +
            '<td>' +
            isNull(data[i].JMTOL) +
            '</td>' +
            '<td>' +
            isNull(data[i].JMDXS) +
            '</td>' +
            '<td>' +
            isNull(data[i].CZHJ) +
            '</td>' +
            '<td>' +
            isNull(data[i].NCHJ) +
            '</td>' +
            '<td>' +
            isNull(data[i].STTOL) +
            '</td>' +
            '<td>' +
            isNull(data[i].HJDXS) +
            '</td>' +
            '<td>' +
            isNull(data[i].TOL) +
            '</td>' +
            '<td>' +
            isNull(data[i].DXSTOL) +
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
          title = year + '年水资源分区用水量对比分析图'
        } else {
          title = year + '年行政区用水量对比分析图'
        }
        const option = {
          title: {
            text: title
          },
          tooltip: {},
          legend: {
            data: ['农田', '林牧渔畜', '工业', '城镇公共', '居民生活', '生态环境', '总用水']
          },
          xAxis: [
            {
              type: 'category',
              data: result.x,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: {
            name: '亿m³'
          },
          series: [
            {
              name: '农田',
              type: 'bar',
              //						barWidth:20,
              itemStyle: {
                normal: {
                  color: colors[0]
                }
              },
              data: result.nttol
            },
            {
              name: '林牧渔畜',
              type: 'bar',
              //						barWidth:20,
              itemStyle: {
                normal: {
                  color: colors[1]
                }
              },
              data: result.lmtol
            },
            {
              name: '工业',
              type: 'bar',
              //						barWidth:20,
              itemStyle: {
                normal: {
                  color: colors[2]
                }
              },
              data: result.gytol
            },
            {
              name: '城镇公共',
              type: 'bar',
              //						barWidth:20,
              itemStyle: {
                normal: {
                  color: colors[3]
                }
              },
              data: result.qttol
            },
            {
              name: '居民生活',
              type: 'bar',
              //						barWidth:20,
              itemStyle: {
                normal: {
                  color: colors[4]
                }
              },
              data: result.jmtol
            },
            {
              name: '生态环境',
              type: 'bar',
              //						barWidth:20,
              itemStyle: {
                normal: {
                  color: colors[5]
                }
              },
              data: result.sttol
            },
            {
              name: '总用水量',
              type: 'bar',
              //						barWidth:20,
              itemStyle: {
                normal: {
                  color: colors[6]
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
  jQuery.getJSON(parent.basePath + '/message/gb/getYsl_Qst', null, function (result) {
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
          data: result.ysl
        }
      ]
    }
    myChart_qs.setOption(option)
  })
}
