const echart_db_str = "<div id='echart_db' class='echart' style='width:80%;margin-top:20px;'></div>"
const colors = ['#9ad4d4', '#35abab', '#5cf7cd', '#bbbaff', '#2671c5', '#a486c5', '#de6c5a']
$(function () {
  //	$("#fwwf").multiselect();
  $('#fwwf').multiselect({
    selectedList: 100,

    noneSelectedText: '请选择'
  })
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - 50
  $('.conent').css('height', hh - $('.searchDiv').height() - 50)

  initYear()
  //	initQst();
})

function initYear() {
  const date = new Date()
  const year = date.getFullYear()
  const yearend = date.getFullYear() - 2
  let month = date.getMonth() + 1
  month = month < 10 ? '0' + month : month
  const mydate = year.toString() + '/' + month.toString()
  const yend = yearend + '/01'
  $('#begin').val(yend)
  $('#end').val(mydate)

  changemulList()
}

function changemulList() {
  const fw = $('#fw').val()
  if (fw == '1') {
    $('#fwwf').html('')
    $('#fwwf').multiselect('refresh')
    jQuery.getJSON(parent.basePath + '/cus/getADList', null, function (data) {
      if (data != null && data.length > 0) {
        let str = ''
        str += "<optgroup label='北京市'>"
        for (var i = 0; i < data.length; i++) {
          if (data[i].ADDVCD.substring(0, 2) == '11') {
            if (data[i].ADDVCD == '110100') {
              str +=
                "<option value='" +
                data[i].ADDVCD +
                "' selected='selected'>" +
                data[i].ADDVNM +
                '</option>'
            } else {
              str += "<option value='" + data[i].ADDVCD + "'>" + data[i].ADDVNM + '</option>'
            }
          }
        }
        str += '</optgroup>'
        str += "<optgroup label='天津市'>"
        for (var i = 0; i < data.length; i++) {
          if (data[i].ADDVCD.substring(0, 2) == '12') {
            if (data[i].ADDVCD == '120100') {
              str +=
                "<option value='" +
                data[i].ADDVCD +
                "' selected='selected'>" +
                data[i].ADDVNM +
                '</option>'
            } else {
              str += "<option value='" + data[i].ADDVCD + "'>" + data[i].ADDVNM + '</option>'
            }
          }
        }
        str += '</optgroup>'
        str += "<optgroup label='河北省'>"
        for (var i = 0; i < data.length; i++) {
          if (data[i].ADDVCD.substring(0, 2) == '13') {
            str += "<option value='" + data[i].ADDVCD + "'>" + data[i].ADDVNM + '</option>'
          }
        }
        str += '</optgroup>'
        str += "<optgroup label='河南省'>"
        for (var i = 0; i < data.length; i++) {
          if (data[i].ADDVCD.substring(0, 2) == '41') {
            str += "<option value='" + data[i].ADDVCD + "'>" + data[i].ADDVNM + '</option>'
          }
        }
        str += '</optgroup>'
        str += "<optgroup label='山东省'>"
        for (var i = 0; i < data.length; i++) {
          if (data[i].ADDVCD.substring(0, 2) == '37') {
            str += "<option value='" + data[i].ADDVCD + "'>" + data[i].ADDVNM + '</option>'
          }
        }
        str += '</optgroup>'

        $('#fwwf').html(str)
        $('#fwwf').multiselect('refresh')
      }
      search()
    })
  } else {
    $('#fwwf').html('')
    jQuery.getJSON(parent.basePath + '/cus/getWRList', null, function (data) {
      if (data != null && data.length > 0) {
        let str = ''
        for (let i = 0; i < data.length; i++) {
          if (i == 0) {
            str +=
              "<option value='" +
              data[i].WRRGCD +
              "' selected='selected'>" +
              data[i].WRRGNM +
              '</option>'
          } else {
            str += "<option value='" + data[i].WRRGCD + "'>" + data[i].WRRGNM + '</option>'
          }
        }
        $('#fwwf').html(str)
        $('#fwwf').multiselect('refresh')
      }
      search()
    })
  }
}

function search() {
  const begin = $('#begin').val()
  const end = $('#end').val()
  const fw = $('#fw').val()
  const fwwf = $('#fwwf').val()
  //	$("#t_year").html(year);// 改变年份
  console.info(fwwf)
  if (fwwf == null) {
    alert('请选择地区')
  }
  jQuery.getJSON(
    parent.basePath + '/cus/getQsfxList',
    { begin: begin, end: end, fw: fw, fwwf: JSON.stringify(fwwf) },
    function (result) {
      const data = result.list
      const adnm = result.adnm.length
      const yearList = result.yearList.length
      const yeardata = result.yearList
      const adnmdata = result.adnm

      $('#thead1').html('')
      let theadhtml1 = ''
      theadhtml1 += '<tr>'
      theadhtml1 += "<td style='width:20%;border-top:1px solid #cdd6e2'>时间</td>"

      for (let k = 0; k < adnm; k++) {
        theadhtml1 += "<td style='border-top:1px solid #cdd6e2'>" + adnmdata[k] + '</td>'
      }

      theadhtml1 += '</tr>'
      $('#thead1').html(theadhtml1)

      let str = ''

      if (data != null && data.length > 0) {
        for (let i = 0; i < yearList; i++) {
          str += '<tr>'
          str += '<td>' + isNull(yeardata[i]) + '</td>'
          for (let j = 0; j < adnm; j++) {
            str += '<td>' + isNull2(data[j * yearList + i].BD) + '</td>'
          }
          str += '</tr>'
        }
      }

      const series = []
      for (let a = 0; a < adnm; a++) {
        const dataechart = []
        for (let b = 0; b < yearList; b++) {
          dataechart.push(isNull2(data[a * yearList + b].BD))
        }
        series.push({
          name: adnmdata[a],
          type: 'line',
          //				barWidth:20,
          itemStyle: {
            normal: {
              color: colors[a]
            }
          },
          data: dataechart
        })
      }

      $('#tbody').empty().append(str)

      $('#echartDiv').empty().append(echart_db_str)
      const myChart_db = echarts.init(document.getElementById('echart_db'))
      let title = ''

      title = '埋深趋势分析图'

      const option = {
        title: {
          text: title
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (datas) {
            let res = datas[0].name.split('.')[0] + '' + '<br/>'
            for (let i = 0, length = datas.length; i < length; i++) {
              res += datas[i].marker + datas[i].seriesName + ': ' + datas[i].data + '<br/>'
            }
            return res
          }
        },
        legend: {
          data: adnmdata
        },
        xAxis: [
          {
            type: 'category',
            data: yeardata,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: {
          //						name:"亿m³"
        },

        series: series
      }
      myChart_db.setOption(option)
    }
  )
}
function isNull2(vad) {
  if (vad === undefined || vad === null || vad === '' || vad === 'undefined' || vad === 'null') {
    return '-'
  }
  return vad.toFixed(2)
}
