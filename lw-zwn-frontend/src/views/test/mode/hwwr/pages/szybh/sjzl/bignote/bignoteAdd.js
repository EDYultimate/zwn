const param = {}

function save() {
  const param = {}
  const tm = $('#tm').val()
  const info = $('#info').val()

  if (tm == null || tm == '') {
    alert('时间不能为空')
    return
  }

  if (info == null || info == '') {
    alert('描述不能为空')
    return
  }

  const index = layer.load()
  param.id = getUid()
  param.ywtp = $('#ywtp').val()
  param.tm = $('#tm').val()
  param.info = $('#info').val()

  console.info(param)

  $.ajax({
    url: basePath + '/szybh/sjzl/bignote/saveNoteBase',
    type: 'POST',
    data: JSON.stringify(param),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      layer.close(index)
      alert(data.info)
      parent.search(1)
      parent.layer.closeAll()
    }
  })
}

function closediv() {
  parent.parent.parent.layer.closeAll()
}

function getUid() {
  const str = Math.random().toString()
  let strs = [] //定义一数组
  strs = str.split('.') //字符分割
  let uid = strs[1] + ''
  const myDate = new Date()
  const hms = myDate.getMilliseconds() + '' //获取当前毫秒数(0-999)
  uid = uid + hms
  return uid
}
/**
 * 获得当前时间
 */
function getCurrentDate() {
  const currentDate = new Date() //当前时间
  let dayTM = currentDate.getDate()
  let monthTM = currentDate.getMonth() + 1
  const yearTM = currentDate.getFullYear()
  if (parseInt(dayTM) < 10) {
    dayTM = '0' + parseInt(dayTM)
  }
  if (parseInt(monthTM) < 10) {
    monthTM = '0' + parseInt(monthTM)
  }
  return yearTM + '-' + monthTM + '-' + dayTM
}
