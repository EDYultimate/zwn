$(function () {
  $('#btm').val(getCurrentYMD())
  $('#etm').val(getCurrentYMD())
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
  const bdat = $('#btm').val()
  const edat = $('#etm').val()
  const pdo_nm = $('#pdo_nm').val()
  const param = { bdat: bdat, edat: edat, pdo_nm: pdo_nm }
  jQuery.getJSON(basePath + '/szybh/rhpwk/getRhpwkLjpwl', param, function (result) {
    let str = ''
    const data = result
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        str +=
          '<tr>' +
          //"<td>"+(i+1)+"</td>" +
          "<td title='" +
          isNull(data[i].PDO_NM) +
          "'>" +
          isNull(data[i].PDO_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WIUST_NM) +
          "'>" +
          isNull(data[i].WIUST_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].MP_NM) +
          "'>" +
          isNull(data[i].MP_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].ADDR) +
          "'>" +
          isNull(data[i].ADDR) +
          '</td>' +
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
        str += '</tr>'
      }
    }
    debugger
    $('#t_year').text(btm + '至' + etm)
    $('#tbody').empty().append(str)
    setTrColor()
  })
}

function replaceBr(str) {
  return str.replace(/<br>/g, '')
}

//获取当月第一天
function getCurrentYM() {
  const date = new Date()
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  const day = date.getDate()
  if (month.toString().length == 1) {
    month = '0' + month
  }
  return year + '-' + month + '-01'
}

//获取当前天
function getCurrentYMD() {
  const date = new Date()
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  if (month.toString().length == 1) {
    month = '0' + month
  }
  if (day.toString().length == 1) {
    day = '0' + day
  }
  return year + '-' + month + '-' + day
}
