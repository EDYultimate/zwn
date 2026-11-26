$(function () {
  $('.tab').mouseover(function () {
    $('.tab').removeClass('tabSel')
    $(this).addClass('tabSel')
  })
  $('.tab').click(function () {
    const id = $(this).attr('id')
    alert(id)
  })
  initJslTb()
})

function initJslTb() {
  jQuery.getJSON(basePath + '/index/getJsl', null, function (result) {
    let str = ''
    if (result != null) {
      for (let i = 0; i < result.length; i++) {
        str +=
          '<tr>' +
          '<td>' +
          isNull(result[i].YEAR) +
          '</td>' +
          '<td>' +
          isNull(result[i].C010000040000) +
          '</td>' +
          '<td>' +
          isNull(result[i].C020000040000) +
          '</td>' +
          '<td>' +
          isNull(result[i].C030000040000) +
          '</td>' +
          '<td>' +
          isNull(result[i].C040000040000) +
          '</td>' +
          '<td>' +
          isNull(result[i].C000000110000) +
          '</td>' +
          '<td>' +
          isNull(result[i].C000000120000) +
          '</td>' +
          '<td>' +
          isNull(result[i].C000000130000) +
          '</td>' +
          '<td>' +
          isNull(result[i].C000000140000) +
          '</td>' +
          '<td>' +
          isNull(result[i].C000000410000) +
          '</td>' +
          '<td>' +
          isNull(result[i].C000000370000) +
          '</td>' +
          '<td>' +
          isNull(result[i].C000000150000) +
          '</td>' +
          '<td>' +
          isNull(result[i].C000000210000) +
          '</td>' +
          '<td>' +
          isNull(result[i].C000000040000) +
          '</td>' +
          '</tr>'
      }
      $('#tbody').empty().append(str)
    }
  })
}
