$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - 50
  $('.conent').css('height', hh - $('.searchDiv').height() - 50)
  initYear()
})

function initYear() {
  jQuery.getJSON('/hwwr/message/wnnb/getSzyNb_WnYear', { tp: '039' }, function (data) {
    if (data) {
      $('#year').val(data)
    }
    search()
  })
}
function search() {
  $('#t_year').text('')
  const year = $('#year').val()
  $('#t_year').text(year)
  const fw = $('#fw').val()
  $('#tbody').empty()
  jQuery.getJSON(parent.basePath + '/message/wnnb/getSzyNb_szyfzs', { yr: year }, function (data) {
    let str = ''
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        str +=
          '<tr>' +
          '<td style="width:150px">' +
          isNull(data[i].AD_NM) +
          '</td>' +
          '<td>' +
          isNull(data[i].AR_TP) +
          '</td>' +
          '<td>' +
          isNull(data[i].DBS_ZLS) +
          '</td>' +
          '<td>' +
          isNull(data[i].DBS_SH) +
          '</td>' +
          '<td>' +
          isNull(data[i].DBS_GY) +
          '</td>' +
          '<td>' +
          isNull(data[i].DBS_NY) +
          '</td>' +
          '<td>' +
          isNull(data[i].DBS_HD) +
          '</td>' +
          '<td>' +
          isNull(data[i].DBS_SD) +
          '</td>' +
          '<td>' +
          isNull(data[i].DBS_QT1) +
          '</td>' +
          '<td>' +
          isNull(data[i].DBS_QT2) +
          '</td>' +
          '<td>' +
          isNull(data[i].DBS_QT3) +
          '</td>' +
          '<td>' +
          isNull(data[i].DXS_ZLS) +
          '</td>' +
          '<td>' +
          isNull(data[i].DXS_SH) +
          '</td>' +
          '<td>' +
          isNull(data[i].DXS_GY) +
          '</td>' +
          '<td>' +
          isNull(data[i].DXS_NY) +
          '</td>' +
          '<td>' +
          isNull(data[i].DXS_HD) +
          '</td>' +
          '<td>' +
          isNull(data[i].DXS_QT1) +
          '</td>' +
          '<td>' +
          isNull(data[i].DXS_QT2) +
          '</td>' +
          '<td>' +
          isNull(data[i].DXS_QT3) +
          '</td>' +
          '</tr>'
      }
      $('#tbody').html(str)
    }
  })
}
