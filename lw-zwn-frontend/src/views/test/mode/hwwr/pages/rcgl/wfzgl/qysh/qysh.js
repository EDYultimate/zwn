$(function () {
  const height = $(window).innerHeight() - $('.searchDiv').innerHeight() - 12
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
  const qsWay = $('#qs_way').val()
  const qshUser = $('#qsh_user').val()
  const param = { qsWay: qsWay, qshUser: qshUser }
  jQuery.getJSON(basePath + '/message/rcgl/wfzgl/getWfzgl_Qysh', param, function (result) {
    let str = ''
    const data = result.list
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        str +=
          '<tr>' +
          '<td>' +
          (i + 1) +
          '</td>' +
          "<td title='" +
          isNull(data[i].QSHMC) +
          "'>" +
          isNull(data[i].QSHMC) +
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
          isNull(data[i].LJQSL) +
          "'>" +
          isNull(data[i].LJQSL) +
          '</td>' +
          /*"<td title='"+ isNull(data[i].QSL) +"'>"+isNull(data[i].QSL)+"</td>" +*/
          "<td title='" +
          isNull(data[i].QSYT) +
          "'>" +
          isNull(data[i].QSYT) +
          '</td>' +
          // TODO 要演示,先固定漳河数据
          /*if (data[i].WIU_CD && data[i].WIU_CD=="402589137") {
					str+= "<td title=''>59587</td>"
				}
				else {
					str+="<td title=''>-</td>";
				}*/
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
