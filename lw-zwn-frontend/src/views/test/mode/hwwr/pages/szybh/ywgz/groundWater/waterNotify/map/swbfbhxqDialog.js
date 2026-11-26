$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  //	$("#rightDiv").css("width",bodyrightWidth-38+"px");

  //默认前7天, 初始化默认时间
  const curtDate = new Date()
  const curtYear = curtDate.Format('yyyy')
  const curtMon = curtDate.Format('MM')
  let curtSea
  if (curtMon >= 1 && curtMon < 4) {
    curtSea = 1
  } else if (curtMon >= 4 && curtMon < 7) {
    curtSea = 2
  } else if (curtMon >= 7 && curtMon < 10) {
    curtSea = 3
  } else if (curtMon >= 10 && curtMon < 13) {
    curtSea = 4
  }

  // 填入时间查询
  $('#seasonBeginInput').val(curtYear + '年' + curtSea + '季度')
  $('#seasonEndInput').val(curtYear + '年' + curtSea + '季度')
  // 获取前90天日期
  //	var day = 365;
  //	starttime =  moment().add(0-day+1, 'days').format('YYYY-MM');
  pageSize = 10
  init()
})

function init() {
  const begYear = $('#seasonBeginInput').val().substring(0, 4)
  const begSea = $('#seasonBeginInput').val().charAt(5)
  const endYear = $('#seasonEndInput').val().substring(0, 4)
  const endSea = $('#seasonEndInput').val().charAt(5)
  const maicang = $('input[type=radio]:checked').val()

  //    var begYear = 2021;
  //	var begSea = 1;
  //	var endYear = 2021;
  //	var endSea = 2;

  const param = {
    AD_CD: AD_CD,
    begYear: begYear,
    begSea: begSea,
    endYear: endYear,
    endSea: endSea,
    maicang: maicang
  }
  //    console.log("iniinitinitinitt:",param);

  //只有考核断面显示这个页面
  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterWaterNotifySWBFBHXQ', param, function (result) {
    console.log('getSaveWaterWaterNotifySWBFBHXQ:', result)
    let str = ''
    const xName = []
    const yShuiWeiBianFu = []
    if (result != null && result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        str +=
          '<tr>' +
          '<td>' +
          isNull(result[i].YR + '年' + result[i].SEA + '季度') +
          '</td>' +
          '<td>' +
          isNull(result[i].Z) +
          '</td>' +
          '</tr>'
        xName.push(result[i].YR + '年' + result[i].SEA + '季度')
        yShuiWeiBianFu.push(result[i].Z)
      }
      for (let x = result.length; x < pageSize; x++) {
        str += '<tr>' + '<td></td>' + '<td></td>' + '</tr>'
      }
    } else {
      for (var i = 0; i < pageSize; i++) {
        str += '<tr>' + '<td></td>' + '<td></td>' + '</tr>'
      }
    }

    $('#tbody').empty().append(str)
    echartsSWBFBHXQ(xName, yShuiWeiBianFu)
  })
}

layui.use(['form', 'upload', 'layer', 'laydate', 'jquery'], function () {
  const laydate = layui.laydate
  renderSeasonDate('#seasonBeginInput', '')
  renderSeasonDate('#seasonEndInput', '')
  // 季度
  function renderSeasonDate(ohd, sgl) {
    const ele = $(ohd)
    laydate.render({
      elem: ohd,
      type: 'month',
      format: 'yyyy年M季度',
      btns: ['clear', 'confirm'],
      ready: function (value, date, endDate) {
        const hd = $('#layui-laydate' + ele.attr('lay-key'))
        if (hd.length > 0) {
          hd.click(function () {
            quarter($(this))
          })
        }
        quarter(hd)
      },
      done: function (value, date, endDate) {
        if (!isNullSeason(date) && date.month > 0 && date.month < 5) {
          ele.attr('startDate', date.year + '年-' + date.month + '季')
        } else {
          ele.attr('startDate', '')
        }
        if (!isNullSeason(endDate) && endDate.month > 0 && endDate.month < 5) {
          ele.attr('endDate', endDate.year + '年-' + endDate.month)
        } else {
          ele.attr('endDate', '')
        }
      }
    })
  }
})

function quarter(thiz) {
  const mls = thiz.find('.laydate-month-list')
  mls.each(function (i, e) {
    $(this)
      .find('li')
      .each(function (inx, ele) {
        const cx = ele.innerHTML
        if (inx < 4) {
          ele.innerHTML = cx.replace(/月/g, '季度')
        } else {
          ele.style.display = 'none'
        }
      })
  })
}
function isNullSeason(quarter) {
  if (quarter == null || typeof quarter === 'undefined' || quarter == '') {
    return true
  }
  return false
}

function echartsSWBFBHXQ(xName, yShuiWeiBianFu) {
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

    //		    legend:
    legend: [
      {
        //		    	top: "15%",
        //                left: "10",
        data: [{ name: '水位变幅', icon: 'image://images/savewater/line1.png' }],
        x: 'center',
        //	            padding:[0, 0,0,23],
        itemWidth: 10,
        itemHeight: 10
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
        name: '水位变幅(m)'
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
        name: '水位变幅',
        type: 'line',
        data: yShuiWeiBianFu,
        itemStyle: {
          normal: {
            color: '#5178EA'
          }
        },
        barWidth: 50
      }
    ]
  }

  const myChartYearShuiLiang = echarts.init(document.getElementById('rightDiv'))
  myChartYearShuiLiang.setOption(option)
}
