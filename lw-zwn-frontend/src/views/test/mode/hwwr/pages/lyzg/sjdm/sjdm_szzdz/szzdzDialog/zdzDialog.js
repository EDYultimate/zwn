const zbnmStr = '高锰酸盐指数,溶解氧,化学需氧量,氨氮,挥发酚'
const zbcdStr = 'codmn,dox,codcr,nh3n,vlph'
const zbdwStr = 'mg/L,mg/L,mg/L,mg/L,mg/L'
$(function () {
  $('#beginTm').val(getLastMYM())
  $('#endTm').val(new Date().Format('yyyy-MM'))
  initZbInput()
  init()
})
//初始化指标选择
function initZbInput() {
  $('#szzb').val(zbnmStr)
}
function init() {
  jQuery.getJSON(
    basePath + '/szybh/szzdz/getZdSzDialog',
    { wrcd: getUrlParam('stcd'), bdmon: $('#beginTm').val(), edmon: $('#endTm').val() },
    function (result) {
      const data = result.page.list
      const zbnm = zbnmStr.split(',')
      const zbcd = zbcdStr.split(',')
      const zbdw = zbdwStr.split(',')
      let theadStr = ''
      let tbodyStr = ''
      if (zbcd[0] != '') {
        theadStr += "<tr style='height:71px'><td style='width:150px;'>时间</td>"
        theadStr +=
          "<td class='zbtd'  style='width:150px;cursor:pointer;' id='WQGVAL' name='水质类别' headers='类' title='水质类别' style='width:80px;'><p>水质类别</p></td>"
        theadStr +=
          "<td title='主要污染物及超标倍数' style='width:150px;'>主要污染物及超标倍数</td>"
        for (var i = 0; i < zbcd.length; i++) {
          if (zbnm[i] == 'pH') {
            theadStr +=
              "<td class='zbtd'  style='width:150px;cursor:pointer;' id='" +
              zbcd[i] +
              "' name='" +
              zbnm[i] +
              "' headers='' title='" +
              zbnm[i] +
              "' style='width:80px;'><p>" +
              zbnm[i] +
              '</p></td>'
          } else {
            theadStr +=
              "<td class='zbtd'  style='width:150px;cursor:pointer;' id='" +
              zbcd[i] +
              "' name='" +
              zbnm[i] +
              "' headers='" +
              zbdw[i] +
              "' title='" +
              zbnm[i] +
              '(' +
              zbdw[i] +
              ")' style='width:80px;'><p>" +
              zbnm[i] +
              '(' +
              zbdw[i] +
              ')</p></td>'
          }
        }
        theadStr += '</tr>'
      }
      if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          if (zbcd[0] != '') {
            tbodyStr += '<tr><td>' + isNull(data[i].TM) + '</td>'
            tbodyStr += '<td>' + isNull(data[i].WQG) + '</td>'
            tbodyStr +=
              '<td title=' + isNull(data[i].MESPEST) + '>' + isNull(data[i].MESPEST) + '</td>'
            for (let j = 0; j < zbcd.length; j++) {
              tbodyStr +=
                "<td title='" +
                isNull(data[i][zbcd[j].toUpperCase()]) +
                "'>" +
                isNull(data[i][zbcd[j].toUpperCase()]) +
                '</td>'
            }
            tbodyStr += '</tr>'
          }
        }
      }
      $('#thead').html(theadStr)
      $('#tbody').html(tbodyStr)
      //点击指标切换趋势分析图
      $('.zbtd').click(function () {
        $('.zbtd').css('background-color', 'rgba(252, 252, 252, 1)')
        $(this).css('background-color', '#fff3e9')

        initZbQs(data, $(this).attr('id'), $(this).attr('name'), $(this).attr('headers'))
      })
      $('.zbtd:eq(0)').click()
    }
  )
}
//初始化指标趋势图
function initZbQs(data, zb, zbnm, zbdw) {
  const tm = []
  const zbvalue = []
  if (data != null && data.length > 0) {
    for (let i = data.length - 1, j = 0; i >= 0; i--, j++) {
      tm[j] = data[i].TM
      zbvalue[j] = data[i][zb.toUpperCase()]
    }
  }
  //水质类别的Y轴要做特殊处理，所以单独拿出
  if (zb == 'WQGVAL') {
    $('#echartDiv1').show()
    $('#echartDiv2').hide()
    const option1 = {
      title: {
        text: zbnm + '监测趋势分析图',
        x: 'center'
      },
      tooltip: {},
      legend: {
        data: [zbnm],
        x: 'right'
      },
      grid: {
        x: 50,
        x2: 50,
        y: 40,
        y2: 20
      },
      xAxis: {
        data: tm
      },
      yAxis: {
        min: 0,
        max: 7,
        axisLabel: {
          formatter: function (value, index) {
            const texts = []
            if (value == '1') {
              texts.push('Ⅰ类')
            }
            if (value == '2') {
              texts.push('Ⅱ类')
            }
            if (value == '3') {
              texts.push('Ⅲ类')
            }
            if (value == '4') {
              texts.push('Ⅳ类')
            }
            if (value == '5') {
              texts.push('Ⅴ类')
            }
            if (value == '6') {
              texts.push('劣Ⅴ类')
            }
            return texts
          }
        }
      },
      series: [
        {
          name: zbnm,
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#9ad4d4'
              }
            }
          },
          tooltip: {
            // Series config.
            trigger: 'item',
            formatter: function (value) {
              const texts = []
              if (value.value == '1') {
                texts.push('Ⅰ类')
              }
              if (value.value == '2') {
                texts.push('Ⅱ类')
              }
              if (value.value == '3') {
                texts.push('Ⅲ类')
              }
              if (value.value == '4') {
                texts.push('Ⅳ类')
              }
              if (value.value == '5') {
                texts.push('Ⅴ类')
              }
              if (value.value == '6') {
                texts.push('劣Ⅴ类')
              }
              return '水质类别：</br>' + value.name + ':' + texts
            }
          },
          data: zbvalue
        }
      ]
    }
    const myChart_qs1 = echarts.init(document.getElementById('echartDiv1'))
    myChart_qs1.setOption(option1)
  }
  //其他数值数据未处理
  else {
    $('#echartDiv1').hide()
    $('#echartDiv2').show()
    const option = {
      title: {
        text: zbnm + '监测趋势分析图',
        x: 'center'
      },
      tooltip: {},
      legend: {
        data: [zbnm],
        x: 'right'
      },
      grid: {
        x: 50,
        x2: 50,
        y: 40,
        y2: 20
      },
      xAxis: {
        data: tm
      },
      yAxis: {
        name: zbdw,
        type: 'value'
        //					formatter:function(a,b,c){
        //						return c;
        //						}
      },
      series: [
        {
          name: zbnm,
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#9ad4d4'
              }
            }
          },
          data: zbvalue
        }
      ]
    }
    const myChart_qs = echarts.init(document.getElementById('echartDiv2'))
    myChart_qs.setOption(option)
  }
}
//选择指标
function openZb() {
  layer.open({
    type: 2,
    title: '指标选择',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['620px', '400px'],
    content: basePath + 'pages/common/zb/zb.jsp'
  })
}
