const mothArr = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月'
]
const mothNumArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
const param = {}
$(function () {
  getSel()
})

function getSel() {
  $.ajax({
    url: basePath + '/kfly/nsbd/getRouteList',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (data) {
      let html = ''
      for (let i = 0; i < data.length; i++) {
        html += '<option value="' + data[i].CD + '">' + data[i].NM + '</option>'
      }
      $('#fw').html(html)
      getYr()
    }
  })
}
function getYr() {
  const cd = $('#fw').val()
  param.cd = cd
  $.ajax({
    url: basePath + '/kfly/nsbd/getYrList',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (data) {
      if (data.length > 0) {
        $('#year').val(data[0].YR)
      } else {
        const date = new Date()
        const year = date.getFullYear()
        $('#year').val(year)
      }
      ini()
    }
  })
}
function ini() {
  //打开遮罩层
  const index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })
  $('#t_year').text($('#fw').find('option:selected').text() + $('#year').val())
  param.cd = $('#fw').val()
  param.yr = $('#year').val()
  $('#tbody').html('')
  $.ajax({
    url: basePath + '/kfly/nsbd/getTjList',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (result) {
      const data = result.data
      const base = result.base

      let tabhtml = ''
      let tbodyhtml = ''
      if (base.length > 0) {
        const startm = base[0].DDTM_STAR
        const endtm = base[0].DDTM_END
        //比较开始结束时间大小，判断时间跨度,开始时间月份小于结束时间，说明没跨年；如果起始时间大于结束时间，中间有跨年
        //未跨年,整年的1-12月
        if (parseInt(startm) < parseInt(endtm)) {
          tabhtml += '<tr>'
          tabhtml += "<td rowspan='2' colspan='2'>名称</td>"
          tabhtml += "<td colspan='12'>" + param.yr + '</td>'
          tabhtml += "<td rowspan='2'>合计</td>"
          tabhtml += '</tr>'
          //正常遍历12个月
          tabhtml += '<tr>'
          for (var i = 0; i < mothArr.length; i++) {
            tabhtml += '<td style="border-top:1px solid #E1E1E1">' + mothArr[i] + '</td>'
          }
          tabhtml += '</tr>'
        } //跨年
        else {
          const yr1col = 12 - parseInt(endtm)
          tabhtml += '<tr>'
          tabhtml += "<td rowspan='2' colspan='2'>名称</td>"
          tabhtml += "<td colspan='" + yr1col + "'>" + param.yr + '</td>'
          tabhtml += "<td colspan='" + endtm + "'>" + (parseInt(param.yr) + 1) + '</td>'
          tabhtml += "<td rowspan='2'>合计</td>"
          tabhtml += '</tr>'
          //遍历从几月开始到明年几月结束
          tabhtml += '<tr>'
          for (var i = startm - 1; i < mothArr.length; i++) {
            tabhtml += '<td style="border-top:1px solid #E1E1E1">' + mothArr[i] + '</td>'
          }
          for (var i = 0; i < endtm; i++) {
            tabhtml += '<td style="border-top:1px solid #E1E1E1">' + mothArr[i] + '</td>'
          }
          tabhtml += '</tr>'
        }
        $('#theadtab').html(tabhtml)
        for (var i = 0; i < base.length; i++) {
          const decd = base[i].DECD
          const nm = base[i].NM
          const state = base[i].STATE
          //未跨年表格html
          if (parseInt(startm) < parseInt(endtm)) {
            tbodyhtml += '<tr>'
            tbodyhtml += "<td rowspan='2'>" + nm + gsFormatte(state) + '</td>'
            tbodyhtml += '<td>计划</td>'
            for (var j = 0; j < mothArr.length; j++) {
              tbodyhtml += "<td id='" + decd + mothNumArr[j] + "1'></td>"
            }
            tbodyhtml += "<td id='" + decd + "hj1'></td>"
            tbodyhtml += '</tr>'
            tbodyhtml += '<tr>'
            tbodyhtml += '<td>实际</td>'
            for (var j = 0; j < mothArr.length; j++) {
              tbodyhtml += "<td id='" + decd + mothNumArr[j] + "2'></td>"
            }
            tbodyhtml += "<td id='" + decd + "hj2'></td>"
            tbodyhtml += '</tr>'
          } //跨年表格html
          else {
            tbodyhtml += '<tr>'
            tbodyhtml += "<td rowspan='2'>" + nm + gsFormatte(state) + '</td>'
            tbodyhtml += '<td>计划</td>'
            for (var j = parseInt(startm) - 1; j < mothArr.length; j++) {
              tbodyhtml += "<td id='" + decd + mothNumArr[j] + "1'></td>"
            }
            for (var j = 0; j < endtm; j++) {
              tbodyhtml += "<td id='" + decd + mothNumArr[j] + "1'></td>"
            }
            tbodyhtml += "<td id='" + decd + "hj1'></td>"
            tbodyhtml += '</tr>'
            tbodyhtml += '<tr>'
            tbodyhtml += '<td>实际</td>'
            for (var j = parseInt(startm) - 1; j < mothArr.length; j++) {
              tbodyhtml += "<td id='" + decd + mothNumArr[j] + "2'></td>"
            }
            for (var j = 0; j < endtm; j++) {
              tbodyhtml += "<td id='" + decd + mothNumArr[j] + "2'></td>"
            }
            tbodyhtml += "<td id='" + decd + "hj2'></td>"
            tbodyhtml += '</tr>'
          }
        }
        $('#tbody').html(tbodyhtml)
        for (let k = 0; k < data.length; k++) {
          const cd = data[k].DECD
          let moth = data[k].YM
          if (moth != 'hj') {
            moth = data[k].YM.substr(5)
          }
          const type = data[k].TYPETB
          const val = data[k].VAL
          $('#' + cd + moth + type).html(val)
        }
      }
      //给echarts图赋值
      chart(base)
      //关闭遮罩层
      layer.close(index_load)
    }
  })
}

function chart(datas) {
  const dataAxis = new Array(datas.length)
  const jhData = new Array(datas.length)
  const sjData = new Array(datas.length)
  for (let i = 0; i < datas.length; i++) {
    const decd = datas[i].DECD
    const nm = datas[i].NM
    const state = datas[i].STATE
    //横坐标
    dataAxis[i] = nm + gsFormatte(state)
    //计划水量数据
    jhData[i] = $('#' + decd + 'hj1').html()
    //实际水量数据
    sjData[i] = $('#' + decd + 'hj2').html()
  }
  const myChart = echarts.init(document.getElementById('chartDIV'))
  option = {
    //			color: [ '#e74c3c', '#f39c12', '#f1c40f', '#1ebd61',
    //			        '#3498db', '#2980d9', '#52bdf2', '#9b59b6'],
    //			        backgroundColor: '#ffffff',
    title: {
      text: '水量对比图'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ['计划水量', '实际水量']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '5%',
      containLabel: true
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true }
      }
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        data: dataAxis,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: '{value} 万m³'
        }
      }
    ],
    series: [
      {
        name: '计划水量',
        type: 'bar',
        barWidth: '15%',
        data: jhData
        //	            markPoint : {
        //	                data : [
        //	                    {type : 'max', name: '最大值'},
        //	                    {type : 'min', name: '最小值'}
        //	                ]
        //	            },
        //	            markLine : {
        //	                data : [
        //	                    {type : 'average', name: '平均值'}
        //	                ]
        //	            }
      },
      {
        name: '实际水量',
        type: 'bar',
        barWidth: '15%',
        data: sjData
        //	            markPoint : {
        //	                data : [
        //	                    {type : 'max', name: '最大值'},
        //	                    {type : 'min', name: '最小值'}
        //	                ]
        //	            },
        //	            markLine : {
        //	                data : [
        //	                    {type : 'average', name: '平均值'}
        //	                ]
        //	            }
      }
    ]
  }
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}

function gsFormatte(val) {
  if (val == 'G') {
    return '(供水)'
  }
  return '(收水)'
}
