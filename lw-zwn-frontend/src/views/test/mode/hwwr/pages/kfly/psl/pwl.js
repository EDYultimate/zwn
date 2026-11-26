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
    parent.basePath + '/message/gb/getSzyGb_Pwl',
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
              //str+="<tr class='wide' >";
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
            isNull(data[i].JMSH) +
            '</td>' +
            '<td>' +
            isNull(data[i].GY) +
            '</td>' +
            '<td>' +
            isNull(data[i].JZ) +
            '</td>' +
            '<td>' +
            isNull(data[i].ECTOL) +
            '</td>' +
            '<td>' +
            isNull(data[i].SC) +
            '</td>' +
            '<td>' +
            isNull(data[i].TOL) +
            '</td>' +
            '<td>' +
            isNull(data[i].HD) +
            '</td>' +
            '<td>' +
            isNull(data[i].KK) +
            '</td>'

          if (fw == 'A000000') {
            // 三级区
            str += '<td>' + isNull(data[i].INWW) + '</td>'
          }
          str += '</tr>'
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
          title = year + '年水资源分区排污量对比分析图'
        } else {
          title = year + '年行政区排污量对比分析图'
        }
        const option = {
          title: {
            text: title
          },
          tooltip: {},
          legend: {
            data: ['用户废污排放量', '火电厂直流式冷却水排放量', '矿坑排水量']
          },
          xAxis: {
            data: result.x
          },
          yAxis: [
            {
              name: '亿m³'
            }
          ],
          series: [
            {
              name: '用户废污排放量',
              type: 'bar',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: colors[0]
                }
              },
              data: result.tol
            },
            {
              name: '火电厂直流式冷却水排放量',
              type: 'bar',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: colors[1]
                }
              },
              data: result.hd
            },
            {
              name: '矿坑排水量',
              type: 'bar',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: colors[2]
                }
              },
              data: result.kk
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
  jQuery.getJSON(parent.basePath + '/message/gb/getPwl_Qst', null, function (result) {
    const option = {
      title: {
        text: '海河流域年排污量趋势分析图'
      },
      tooltip: {},
      legend: {
        data: ['排污量']
      },
      xAxis: {
        data: result.yr
      },
      yAxis: {
        name: '亿m³'
      },
      series: [
        {
          name: '排污量',
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                color: colors[0]
              }
            }
          },
          data: result.pwl
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
    content: basePath + '/pages/kfly/psl/pwl_year_qs.jsp?wrcs_cd=' + wrcs_cd
  })
}
