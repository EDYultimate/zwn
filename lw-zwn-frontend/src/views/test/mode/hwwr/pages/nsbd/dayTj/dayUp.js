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
//调水线路测站个数
let stcdNum = 0
const cdArr = []
$(function () {
  //	var date = new Date();
  //	var year = date.getFullYear();
  //	$("#year").val(year);
  $('#tm').val(GetDay())
  getSel()
})
//
//function getYr(){
//	$.ajax({
//	    url: basePath+"/kfly/nsbd/getRouteYr",
//	    data: param,
//	    dataType : "json",
//	    type: 'post',
//	    success: function(data) {
//	    	if(data.length>0){
//	    		$("#year").val(data[0].YR);
//	    	}
//	    	getSel();
//	    }
//	    });
//}
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
      ini()
    }
  })
}

function ini() {
  //打开遮罩层
  const index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })
  $('#t_year').text($('#fw').find('option:selected').text() + $('#tm').val())
  param.cd = $('#fw').val()
  param.tm = $('#tm').val()
  //    param.yr=$("#year").val();
  //    param.type=$("#type").val();
  $('#tbody').html('')
  $.ajax({
    url: basePath + '/kfly/nsbd/getDaySlTjListTotal',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (result) {
      const base = result.base
      const data = result.data
      console.info(data)
      let tabhtml = ''
      let tbodyhtml = ''
      if (base.length > 0) {
        stcdNum = base.length
        for (var i = 0; i < stcdNum; i++) {
          cdArr[i] = base[i].DECD
        }

        tabhtml += '<tr>'
        tabhtml += "<td rowspan='2'>日期</td>"
        tabhtml += "<td rowspan='2' >监测项目</td>"
        tabhtml += "<td colspan='" + stcdNum * 2 + "'>监测断面</td>"
        tabhtml += '</tr>'
        //正常遍历12个月
        tabhtml += '<tr>'
        for (var i = 0; i < stcdNum; i++) {
          tabhtml +=
            '<td colspan=\'2\' style="border-top:1px solid #E1E1E1">' + base[i].NM + '</td>'
        }
        tabhtml += '</tr>'
        $('#theadtab').html(tabhtml)
        tbodyhtml += '<tr>'
        tbodyhtml += "<td rowspan='5'>" + param.tm + '</td>'
        tbodyhtml += '<td>日均流量（m3/s）</td>'

        for (var i = 0; i < base.length; i++) {
          tbodyhtml +=
            "<td colspan='2'  class='" +
            base[i].DECD +
            "' flag='DAY_Q' id='" +
            base[i].DECD +
            "DAY_Q'></td>"
        }
        tbodyhtml += '</tr>'

        tbodyhtml += '<tr>'
        tbodyhtml += "<td rowspan='2'>累计水量(万m3)</td>"
        for (var i = 0; i < base.length; i++) {
          tbodyhtml +=
            "<td  class='" + base[i].DECD + "' flag='bgtm'   id='" + base[i].DECD + "BGTM'></td>"
          tbodyhtml +=
            "<td  class='" + base[i].DECD + "' flag='egtm'   id='" + base[i].DECD + "FEDTM'></td>"
        }
        tbodyhtml += '</tr>'

        tbodyhtml += '<tr>'
        for (var i = 0; i < base.length; i++) {
          tbodyhtml +=
            "<td colspan='2'  class='" +
            base[i].DECD +
            "' flag='SL'   id='" +
            base[i].DECD +
            "SL'></td>"
        }
        tbodyhtml += '</tr>'

        tbodyhtml += '<tr>'
        tbodyhtml += '<td>水质类型</td>'
        for (var i = 0; i < base.length; i++) {
          tbodyhtml +=
            "<td colspan='2'  class='" +
            base[i].DECD +
            "' flag='WQT'   id='" +
            base[i].DECD +
            "WQT'></td>"
          //	    			tbodyhtml+="<td  class='"+base[i].DECD+"' flag='WQTYM'   id='"+base[i].DECD+"WQTYM'></td>";
        }
        tbodyhtml += '</tr>'

        $('#tbody').html(tbodyhtml)
        for (let k = 0; k < data.length; k++) {
          const cd = data[k].DECD
          $('#' + cd + 'DAY_Q').html(isNullL(data[k].AVOTQ))
          $('#' + cd + 'SL').html(data[k].LSSL)
          $('#' + cd + 'BGTM').html('开始:<br>' + isNull(data[k].BGTM))
          $('#' + cd + 'FEDTM').html('结束:<br>' + isNull(data[k].FEDTM))
          $('#' + cd + 'WQT').html(isNull(data[k].WQG) + '(' + isNull(data[k].WQTYM) + ')')
        }
      }
      chart(result)
      //关闭遮罩层
      layer.close(index_load)
    }
  })
}

function chart(data) {
  const base = data.base
  const datas = data.data
  const dataAxis = new Array(base.length)
  const jhData = new Array(base.length)
  const sjData = new Array(base.length)
  for (let i = 0; i < base.length; i++) {
    const cd = base[i].DECD
    const nm = base[i].NM
    //横坐标
    dataAxis[i] = nm
    for (let j = 0; j < datas.length; j++) {
      const cd2 = datas[j].DECD
      if (cd == cd2) {
        //				var state=datas[j].STATE;
        //计划水量数据
        jhData[i] = datas[j].VAL
        //实际水量数据
        sjData[i] = datas[j].LSSL
      }
    }
  }
  const myChart = echarts.init(document.getElementById('chartDIV'))
  option = {
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
      },
      {
        name: '实际水量',
        type: 'bar',
        barWidth: '15%',
        data: sjData
      }
    ]
  }
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}
