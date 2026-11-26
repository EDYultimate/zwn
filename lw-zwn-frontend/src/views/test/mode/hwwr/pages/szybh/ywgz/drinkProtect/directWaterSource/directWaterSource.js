const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10

  const date = new Date()
  $('#nianFen').val(date.getFullYear() - 1)

  init()
  echartsIntoPanJiaKouRiver(2)
  echartsIntoDaHeiDingRiver(2)
  echartsIntoYueChengRiver(2)
})

function init() {
  param.YEAR = $('#nianFen').val()
  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterDrinkProtectDirectWater',
    param,
    function (result) {
      console.log('result:', result)
      let tbodyStr = ''
      let data = ''

      if (result.listYueWaterType.length != 0) {
        $('#panWQGSpan').html(result.listYueWaterType[0].WQG)
        $('#panWQGSpanNM').html('水质类别(' + result.listYueWaterType[0].MON + '月)')
      }

      data = result.listPanDetail
      if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          $('#panSUM_W_INSpan').html(
            isNull(result.listPanDetail[result.listPanDetail.length - 1].SUM_W_IN_YEAR)
          )
          tbodyStr +=
            '<tr>' +
            "<td title='" +
            isNull(data[i].MON) +
            "'>" +
            isNull(data[i].MON) +
            '</td>' +
            "<td title='" +
            isNull(data[i].AVW) +
            "'  >" +
            isNull(data[i].AVW) +
            '</td>' +
            "<td title='" +
            isNull(data[i].SUM_W_IN) +
            "'  >" +
            isNull(data[i].SUM_W_IN) +
            '</td>' +
            "<td title='" +
            isNull(data[i].GSL) +
            "'  >" +
            isNull(data[i].GSL) +
            '</td>' +
            '</tr>'
        }
        for (var x = data.length; x < 9; x++) {
          tbodyStr += '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
        }
      } else {
        for (var i = 0; i < 9; i++) {
          tbodyStr += '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
        }
      }
      $('#panTableData').empty().append(tbodyStr)
      if (result.listYueWaterType.length != 0) {
        $('#daWQGSda').html(result.listYueWaterType[0].WQG)
        $('#daWQGSdaNM').html('水质类别(' + result.listYueWaterType[0].MON + '月)')
      }

      //     $('#daWQGSda').html(isNull(result.listDaWaterType[0].WQG));
      //     $('#daWQGSdaNM').html("水质类别("+isNull(result.listDaWaterType[0].MON)+"月)");
      tbodyStr = ''
      data = result.listDaDetail
      if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          $('#daSUM_W_INSpan').html(
            isNull(result.listDaDetail[result.listDaDetail.length - 1].SUM_W_IN_YEAR)
          )
          tbodyStr +=
            '<tr>' +
            "<td title='" +
            isNull(data[i].MON) +
            "'>" +
            isNull(data[i].MON) +
            '</td>' +
            "<td title='" +
            isNull(data[i].AVW) +
            "'  >" +
            isNull(data[i].AVW) +
            '</td>' +
            "<td title='" +
            isNull(data[i].SUM_W_IN) +
            "'  >" +
            isNull(data[i].SUM_W_IN) +
            '</td>' +
            "<td title='" +
            isNull(data[i].GSL) +
            "'  >" +
            isNull(data[i].GSL) +
            '</td>' +
            '</tr>'
        }
        for (var x = data.length; x < 9; x++) {
          tbodyStr += '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
        }
      } else {
        for (var i = 0; i < 9; i++) {
          tbodyStr += '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
        }
      }
      $('#daTableData').empty().append(tbodyStr)
      console.log('tbodyStr: ', result.listYueWaterType)
      console.log('tbodyStr: ', result.listYueWaterType.length == 0)
      if (result.listYueWaterType.length != 0) {
        $('#yueWQGSyue').html(result.listYueWaterType[0].WQG)
        $('#yueWQGSyueNM').html('水质类别(' + result.listYueWaterType[0].MON + '月)')
      }

      tbodyStr = ''
      data = result.listYueDetail
      if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          $('#yueSUM_W_INSpan').html(
            isNull(result.listYueDetail[result.listYueDetail.length - 1].SUM_W_IN_YEAR)
          )
          tbodyStr +=
            '<tr>' +
            "<td title='" +
            isNull(data[i].MON) +
            "'>" +
            isNull(data[i].MON) +
            '</td>' +
            "<td title='" +
            isNull(data[i].AVW) +
            "'  >" +
            isNull(data[i].AVW) +
            '</td>' +
            "<td title='" +
            isNull(data[i].SUM_W_IN) +
            "'  >" +
            isNull(data[i].SUM_W_IN) +
            '</td>' +
            "<td title='" +
            isNull(data[i].GSL) +
            "'  >" +
            isNull(data[i].GSL) +
            '</td>' +
            '</tr>'
        }
        for (var x = data.length; x < 9; x++) {
          tbodyStr += '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
        }
      } else {
        for (var i = 0; i < 9; i++) {
          tbodyStr += '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
        }
      }
      $('#yueTableData').empty().append(tbodyStr)
    }
  )
}

function echartsIntoPanJiaKouRiver(data) {
  option = {
    grid: {
      height: '60%',
      width: '60%'
      //		    	top:30,
      //		    	left:50
    },
    legend: {
      data: ['滦河', '柳河', '瀑河']
    },
    xAxis: {
      type: 'category',
      data: ['1月', '3月', '5月', '7月', '9月', '11月', '12月']
    },
    yAxis: {
      type: 'value',
      name: '入库河流'
      //		        axisLabel: {
      //                    formatter: '{value} ml'
      //                }
    },
    series: [
      {
        name: '滦河',
        data: [160, 230, 130, 10, 110, 130, 160],
        type: 'line'
      },
      {
        name: '柳河',
        data: [60, 130, 230, 120, 140, 140, 190],
        type: 'line'
      },
      {
        name: '瀑河',
        data: [180, 220, 430, 210, 140, 40, 110],
        type: 'line'
      }
    ]
  }
  echarts.init(document.getElementById('IntoRiverPanJiaKouDiv')).setOption(option)
}

function echartsIntoDaHeiDingRiver(data) {
  option = {
    grid: {
      height: '60%',
      width: '60%'
      //		    	top:30,
      //		    	left:50
    },
    legend: {
      data: ['滦河', '洒河']
    },
    xAxis: {
      type: 'category',
      data: ['1月', '3月', '5月', '7月', '9月', '11月', '12月']
    },
    yAxis: {
      type: 'value',
      name: '入库河流'
      //		        axisLabel: {
      //                    formatter: '{value} ml'
      //                }
    },
    series: [
      {
        name: '滦河',
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'line'
      },
      {
        name: '洒河',

        data: [110, 240, 130, 180, 270, 120, 230],
        type: 'line'
      }
    ]
  }
  echarts.init(document.getElementById('IntoRiverDaHeiDingDiv')).setOption(option)
}

function echartsIntoYueChengRiver(data) {
  option = {
    grid: {
      height: '60%',
      width: '60%'
      //		    	top:30,
      //		    	left:50
    },
    legend: {
      data: ['漳河']
    },
    xAxis: {
      type: 'category',
      data: ['1月', '3月', '5月', '7月', '9月', '11月', '12月']
    },
    yAxis: {
      type: 'value',
      name: '入库河流'
      //		        axisLabel: {
      //                    formatter: '{value} ml'
      //                }
    },
    series: [
      {
        name: '漳河',
        data: [110, 210, 120, 10, 50, 120, 110],
        type: 'line'
      }
    ]
  }
  echarts.init(document.getElementById('IntoRiverYueChengDiv')).setOption(option)
}
