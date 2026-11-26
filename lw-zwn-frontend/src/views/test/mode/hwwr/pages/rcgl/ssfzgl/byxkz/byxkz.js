$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - $('.right_menu').height() - 80
  $('.conent').css('height', height)
  initYear(search)
})
function setTrColor() {
  const item = $('#tbody tr')
  for (let i = 0; i < item.length; i++) {
    if (i % 2 != 0) {
      item[i].style.backgroundColor = 'rgba(252, 252, 252, 1)'
    }
  }
}

let endYear = ''
function initYear(callback) {
  jQuery.getJSON('/hwwr/message/rcgl/ssfzgl/getQsz_Year', { tp: '' }, function (data) {
    if (data != null && data.length > 0) {
      endYear = data[0].YEAR
      if (callback) {
        callback()
      }
    }
  })
}

function search() {
  const fzYear = $('#fz_year').val()
  const param = { fzYear: fzYear }
  jQuery.getJSON(basePath + '/message/rcgl/ssfzgl/getSsfzgl_Byxkz', param, function (result) {
    let str = ''
    const data = result.list
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].XZQ == '') {
          str += "<tr class='wide' >"
        } else {
          str += '<tr>'
        }
        str +=
          '<td>' +
          isNull(data[i].ADNM) +
          '</td>' +
          '<td>' +
          isNull(data[i].A1) +
          '</td>' +
          '<td>' +
          isNull(data[i].B1) +
          '</td>' +
          '<td>' +
          isNull(data[i].A2) +
          '</td>' +
          '<td>' +
          isNull(data[i].B2) +
          '</td>' +
          '<td>' +
          isNull(data[i].A3) +
          '</td>' +
          '<td>' +
          isNull(data[i].B3) +
          '</td>' +
          '<td>' +
          isNull(data[i].A4) +
          '</td>' +
          '<td>' +
          isNull(data[i].B4) +
          '</td>' +
          '</tr>'
      }
    }
    if (fzYear !== '') {
      $('#t_year').text(fzYear + '年 ')
    } else {
      $('#t_year').text('2006年-' + endYear + '年')
    }
    $('#tbody').empty().append(str)
    setTrColor()
  })
}
