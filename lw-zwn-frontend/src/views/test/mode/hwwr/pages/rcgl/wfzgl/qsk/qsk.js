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
  const btm = $('#btm').val()
  const etm = $('#etm').val()
  const qshUser = $('#qsh_user').val()
  const param = { btm: btm, etm: etm, qshUser: qshUser }
  jQuery.getJSON(basePath + '/message/rcgl/wfzgl/getWfzgl_Qsk', param, function (result) {
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
          isNull(data[i].INT_NM) +
          "'>" +
          isNull(data[i].INT_NM) +
          '</td>'
        if (isNull(data[i].INT_TP == '1')) {
          str += "<td title='蓄水'>蓄水</td>"
        } else if (isNull(data[i].INT_TP == '2')) {
          str += "<td title='引水'>引水</td>"
        } else if (isNull(data[i].INT_TP == '3')) {
          str += "<td title='提水'>提水</td>"
        } else if (isNull(data[i].WIUST_TP == '9')) {
          str += "<td title='其他'>其他</td>"
        } else {
          str += "<td title=''></td>"
        }
        str +=
          "<td title='" +
          isNull(data[i].ORG_NM) +
          "'>" +
          isNull(data[i].ORG_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].MAX_PERM_Q) +
          "'>" +
          isNull(data[i].MAX_PERM_Q) +
          '</td>' +
          "<td title='" +
          isNull(data[i].PERM_WW) +
          "'>" +
          isNull(data[i].PERM_WW) +
          '</td>' +
          "<td title='" +
          isNull(data[i].W) +
          "'>" +
          isNull(data[i].W) +
          '</td>'
        // TODO 要演示,先固定漳河数据
        /*if (data[i].WIU_CD && data[i].WIU_CD=="402589137") {
					str+= "<td title=''>59587</td>"
				}
				else {
					str+="<td title=''>-</td>";
				}*/

        str += '</tr>'
      }
    }

    $('#t_year').text(btm + '至' + etm)
    $('#tbody').empty().append(str)
    setTrColor()
  })
}

function replaceBr(str) {
  return str.replace(/<br>/g, '')
}
