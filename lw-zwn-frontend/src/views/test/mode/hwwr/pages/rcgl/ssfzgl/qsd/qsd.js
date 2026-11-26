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
  jQuery.getJSON(basePath + '/message/rcgl/ssfzgl/getSsfzgl_Qsd', param, function (result) {
    let str = ''
    const data = result.list
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        str +=
          '<tr>' +
          "<td title='" +
          isNull(data[i].MP_NM) +
          "'>" +
          isNull(data[i].MP_NM) +
          '</td>' +
          /*	if(isNull(data[i].SOUR_TP=='11')||isNull(data[i].SOUR_TP=='12')||isNull(data[i].SOUR_TP=='13')||isNull(data[i].SOUR_TP=='19')){
					str+="<td title='地表水'>地表水</td>" ;
				}else if(isNull(data[i].SOUR_TP=='21')||isNull(data[i].SOUR_TP=='22')||isNull(data[i].SOUR_TP=='23')||isNull(data[i].SOUR_TP=='24')||isNull(data[i].SOUR_TP=='25')||isNull(data[i].SOUR_TP=='29')){
					str+= "<td title='地下水'>地下水</td>" ;
				}else if(isNull(data[i].SOUR_TP=='31')||isNull(data[i].SOUR_TP=='32')||isNull(data[i].SOUR_TP=='33')||isNull(data[i].SOUR_TP=='34')||isNull(data[i].SOUR_TP=='39')){
					str+= "<td title='非常规水源'>非常规水源</td>" 				
				}else{
					str+= "<td title=''></td>"
				}*/

          "<td title='" +
          isNull(data[i].SOUR_TP) +
          "'>" +
          isNull(data[i].SOUR_TP) +
          '</td>' +
          /*	"<td title='"+ replaceBr(isNull(data[i].QSDD)) +"'>"+ replaceBr(isNull(data[i].QSDD))+"</td>" +*/
          //	str+="<td title='"+ isNull(data[i].MON_G) +"'>"+isNull(data[i].MON_G)+"</td>" +*  监控级别
          "<td title='" +
          isNull(data[i].USE_TYPE) +
          "'>" +
          isNull(data[i].USE_TYPE) +
          '</td>' +
          "<td title='" +
          isNull(data[i].DAY_MAX) +
          "'>" +
          isNull(data[i].DAY_MAX) +
          '</td>' +
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
