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
  const btm = $('#btm').val()
  const etm = $('#etm').val()
  const qshUser = $('#qsh_user').val()
  const qsXzq = $('#qs_xzq').val()
  const param = { btm: btm, etm: etm, qshUser: qshUser, qsXzq: qsXzq }

  jQuery.getJSON(basePath + '/message/rcgl/ssfzgl/getSsfzgl_Qsh', param, function (result) {
    let str = ''
    const data = result.list
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        str +=
          '<tr>' +
          "<td title='" +
          isNull(data[i].WIU_NM) +
          "'>" +
          isNull(data[i].WIU_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ADDR) +
          "'>" +
          isNull(data[i].ADDR) +
          '</td>' +
          /*	"<td title='"+ replaceBr(isNull(data[i].QSDD)) +"'>"+ replaceBr(isNull(data[i].QSDD))+"</td>" +*/
          "<td title='" +
          isNull(data[i].AD_NM) +
          "'>" +
          isNull(data[i].AD_NM) +
          '</td>' +
          /*"<td title='"+ isNull(data[i].QSL) +"'>"+isNull(data[i].QSL)+"</td>" +*/
          "<td title='" +
          isNull(data[i].W) +
          "'>" +
          isNull(data[i].W) +
          '</td>'

        str += '</tr>'
      }
    }

    $('#tbody').empty().append(str)
    setTrColor()
  })
}

function replaceBr(str) {
  return str.replace(/<br>/g, '')
}
