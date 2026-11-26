$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - $('.right_menu').height() - 80
  $('.conent').css('height', height)
  search()
})
function setTrColor() {
  const item = $('#tbody tr')
  for (let i = 0; i < item.length; i++) {
    if (i % 2 != 0) {
      item[i].style.backgroundColor = 'rgba(252, 252, 252, 1)'
    }
  }
}
function search() {
  let qsXzq = $('#qs_xzq option:selected').val()
  if (qsXzq == undefined) {
    qsXzq = ''
  }
  const qsWay = $('#qs_way').val()
  const qshUser = $('#qsh_user').val()
  const param = { qsXzq: qsXzq, qsWay: qsWay, qshUser: qshUser }
  jQuery.getJSON(basePath + '/message/rcgl/ssfzgl/getSsfzgl_Qysh', param, function (result) {
    let str = ''
    const data = result.list
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        str +=
          '<tr>' +
          "<td title='" +
          isNull(data[i].QSHMC) +
          "'>" +
          isNull(data[i].QSHMC) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ADNM) +
          "'>" +
          isNull(data[i].ADNM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].QSFS) +
          "'>" +
          isNull(data[i].QSFS) +
          '</td>' +
          "<td title='" +
          replaceBr(isNull(data[i].QSDD)) +
          "'>" +
          replaceBr(isNull(data[i].QSDD)) +
          '</td>' +
          "<td title='" +
          isNull(data[i].QSL) +
          "'>" +
          isNull(data[i].QSL) +
          '</td>' +
          "<td title='" +
          isNull(data[i].QSYT) +
          "'>" +
          isNull(data[i].QSYT) +
          '</td>' +
          /*"<td title='"+ isNull(data[i].LJQSL) +"'>"+isNull(data[i].LJQSL)+"</td>" +*/
          "<td title='" +
          isNull(data[i].W) +
          "'>" +
          isNull(data[i].W) +
          '</td>' +
          '</tr>'
      }
    }

    $('#tbody').empty().append(str)
    setTrColor()
  })
}

function replaceBr(str) {
  return str.replace(/<br>/g, '')
}
