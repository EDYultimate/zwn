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
    parent.basePath + '/message/gb/getSzyGb_Szyzl',
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
            isNull(data[i].HCLL) +
            '</td>' +
            '<td>' +
            isNull(data[i].DXSZY) +
            '</td>' +
            '<td>' +
            isNull(data[i].HCJLL) +
            '</td>' +
            '<td>' +
            isNull(data[i].PYRSBJ) +
            '</td>' +
            '<td>' +
            isNull(data[i].PXL) +
            '</td>' +
            '<td>' +
            isNull(data[i].BCFL) +
            '</td>' +
            '<td>' +
            isNull(data[i].TOL) +
            '</td>' +
            '<td>' +
            isNull(data[i].LSTOL) +
            '</td>' +
            '<td>' +
            isNull(data[i].DNPJ) +
            '</td>' +
            '<td>' +
            isNull(data[i].QNB) +
            '</td>' +
            '<td>' +
            isNull(data[i].DNB) +
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
          title = year + '年水资源分区水资源量对比分析图'
        } else {
          title = year + '年行政区水资源量对比分析图'
        }
        const option = {
          title: {
            text: title
          },
          tooltip: {},
          legend: {
            data: ['分区水资源总量', '上年分区水资源总量', '多年平均分区水资源总量']
          },
          xAxis: {
            data: result.x
          },
          yAxis: {
            name: '亿m³'
          },
          series: [
            {
              name: '分区水资源总量',
              type: 'bar',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: colors[0]
                }
              },
              data: result.szyzl
            },
            {
              name: '上年分区水资源总量',
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
              name: '多年平均分区水资源总量',
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
  jQuery.getJSON(parent.basePath + '/message/gb/getSzyzl_Qst', null, function (result) {
    console.info(result)
    const option = {
      title: {
        text: '海河流域年水资源总量趋势分析图'
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
          data: result.szyzl
        }
      ]
    }
    myChart_qs.setOption(option)
  })
}
