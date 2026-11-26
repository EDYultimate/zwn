$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - 50
  $('.conent').css('height', hh - $('.searchDiv').height() - 50)
  initYear()
})

function initYear() {
  jQuery.getJSON(basePath + '/cus/getLastYM', null, function (data) {
    console.info(data)
    if (data != null) {
      $('#year').val(data.YM)
      $('#t_year').html(data.YM)
    }
    search()
  })
}

function search() {
  const year = $('#year').val()
  const fw = $('#fw').val()

  $('#t_year').html(year) // 改变年份
  jQuery.getJSON(basePath + '/cus/getPjmsList', { year: year, fw: fw }, function (result) {
    let str = ''
    const fwa = result.fw
    if (fwa == '1') {
      $('#theadhtml1').html('')
      var theadhtml1 = ''
      theadhtml1 += '<tr>'
      theadhtml1 += "<td style='width:40%;border-top:1px solid #cdd6e2'>行政分区</td>"
      theadhtml1 += "<td style='width:20%;border-top:1px solid #cdd6e2'>月均埋深(m)</td>"
      theadhtml1 += "<td style='width:20%;border-top:1px solid #cdd6e2'>最小埋深(m)</td>"
      theadhtml1 += "<td style='width:20%;border-top:1px solid #cdd6e2'>最大埋深(m)</td>"
      theadhtml1 += '</tr>'
      $('#theadhtml1').html(theadhtml1)

      var data = result.list
      if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          str += '<tr>'
          str +=
            '<td>' +
            isNull(data[i].ADDVNM) +
            '</td>' +
            '<td>' +
            isNull2(data[i].AVGZ) +
            '</td>' +
            '<td>' +
            isNull2(data[i].MAXZ) +
            '</td>' +
            '<td>' +
            isNull2(data[i].MINZ) +
            '</td>' +
            '</tr>'
        }
      }
    } else {
      $('#theadhtml1').html('')
      var theadhtml1 = ''
      theadhtml1 += '<tr>'
      theadhtml1 += "<td style='width:40%;border-top:1px solid #cdd6e2'>水资源分区</td>"
      theadhtml1 += "<td style='width:20%;border-top:1px solid #cdd6e2'>月均埋深(m)</td>"
      theadhtml1 += "<td style='width:20%;border-top:1px solid #cdd6e2'>最小埋深(m)</td>"
      theadhtml1 += "<td style='width:20%;border-top:1px solid #cdd6e2'>最大埋深(m)</td>"
      theadhtml1 += '</tr>'
      $('#theadhtml1').html(theadhtml1)

      var data = result.list
      if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          str += '<tr>'
          str +=
            '<td>' +
            isNull(data[i].WRRGNM) +
            '</td>' +
            '<td>' +
            isNull2(data[i].AVGZ) +
            '</td>' +
            '<td>' +
            isNull2(data[i].MAXZ) +
            '</td>' +
            '<td>' +
            isNull2(data[i].MINZ) +
            '</td>' +
            '</tr>'
        }
      }
    }
    $('#tbody').empty().append(str)
  })
}

function isNull2(vad) {
  if (vad === undefined || vad === null || vad === '' || vad === 'undefined' || vad === 'null') {
    return '-'
  }
  return vad.toFixed(2)
}
