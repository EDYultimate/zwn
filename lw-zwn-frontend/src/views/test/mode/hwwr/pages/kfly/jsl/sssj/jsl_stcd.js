$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')

  $('#qsfx').click(ckqsfx)
  $('#jcxx').click(ckjcxx)
  //默认前7天, 初始化默认时间
  const curtDate = new Date()
  endtime = curtDate.Format('yyyy-MM-dd')
  // 获取前7天日期
  const day = 7
  starttime = moment()
    .add(0 - day + 1, 'days')
    .format('YYYY-MM-DD')
  // 填入时间查询
  $('#beginTm').val(starttime)
  $('#endTm').val(endtime)

  init()
})

function ckqsfx() {
  $('#content_chart').show()
  $('#content_table').hide()
  $('#qsfx').addClass('clickLiTab')
  $('#jcxx').removeClass('clickLiTab')
}

function ckjcxx() {
  $('#content_chart').hide()
  $('#content_table').show()
  $('#qsfx').removeClass('clickLiTab')
  $('#jcxx').addClass('clickLiTab')

  const data = parent.layerdata
  if (data.ST_NM) {
    $('#ST_NM').text(data.ST_NM)
  }
  if (data.STCD) {
    $('#STCD').text(data.STCD)
  }
  if (data.LOC) {
    $('#LOC').text(data.LOC)
  }
  if (data.EST_ST_YM) {
    $('#EST_ST_YM').text(data.EST_ST_YM)
  }
  if (data.ENG_MAN_CD) {
    $('#ENG_MAN_CD').text(data.ENG_MAN_CD)
  }
  if (data.NT) {
    $('#NT').text(data.NT)
  }
}

function init() {
  const param = { stcd: stcd, start: $('#beginTm').val(), end: $('#endTm').val() }
  jQuery.getJSON(basePath + '/gis/getPPTNByDate', param, function (result) {
    const list = result
    if (list != null && list.length > 0) {
      let str = ''
      for (var i = list.length - 1; i >= 0; i--) {
        str +=
          '<tr>' +
          '<td>' +
          isNull(list[i].TM) +
          '</td>' +
          '<td>' +
          isNull(list[i].VAL) +
          '</td>' +
          '</tr>'
      }
      $('#tbody').empty().append(str)
    }
    //
    const tms = []
    const vals = []
    for (var i = 0; i < list.length; ++i) {
      tms.push(list[i].TM)
      vals.push(list[i].VAL)
    }

    const option = {
      //				title: {
      //					text: '分析图'
      //				},
      tooltip: {},
      legend: {
        data: ['降雨量']
      },
      xAxis: {
        data: tms
      },
      yAxis: {
        name: 'mm'
      },
      series: [
        {
          name: '降雨量',
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#9ad4d4'
              }
            }
          },
          data: vals
        }
      ]
    }
    const myChart_qs = echarts.init(document.getElementById('rightDiv'))
    myChart_qs.setOption(option)
  })
}
