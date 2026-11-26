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
  jQuery.getJSON(basePath + '/message/rcgl/wfzgl/getWfzgl_Qsz', param, function (result) {
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
          isNull(data[i].WIUST_NM) +
          "'>" +
          isNull(data[i].WIUST_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].LOC) +
          "'>" +
          isNull(data[i].LOC) +
          '</td>'
        /*	"<td title='"+ replaceBr(isNull(data[i].QSDD)) +"'>"+ replaceBr(isNull(data[i].QSDD))+"</td>" +*/
        /*"<td title='"+ isNull(data[i].WIUST_TP) +"'>"+isNull(data[i].WIUST_TP)+"</td>" ;*/
        if (isNull(data[i].WIUST_TP == '1')) {
          str += "<td title='地表水取水监测站'>地表水取水监测站</td>"
        } else if (isNull(data[i].WIUST_TP == '2')) {
          str += "<td title='地下水取水监测站'>地下水取水监测站</td>"
        } else if (isNull(data[i].WIUST_TP == '3')) {
          str += "<td title='入河排污口排水监测站'>入河排污口排水监测站</td>"
        } else if (isNull(data[i].WIUST_TP == '4')) {
          str += "<td title='灌区退水监测站'>灌区退水监测站</td>"
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
