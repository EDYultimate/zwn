const tpmap = new Map() //保存上传
const param = {}
const bbTpPath = null //路径
const getIsFile = 'y'
$(function () {
  //	var date = new Date();
  //	var year = date.getFullYear();
  //	$("#tm").val(year);
  const uid = getUid()
  upload1('file1', '' + uid + '') //文件上传
  $('#fileuid').val(uid)
})

function saveDbBase() {
  if ('n' == getIsFile) {
    const msg = '附件不合规，是否继续保存？\n\n请确认！'

    if (confirm(msg) == true) {
      save()
    }
  } else {
    save()
  }
}

function save() {
  const param = {}
  const fileinput = $('#fileuid').val()
  const nm = $('#nm').val()

  if (fileinput == null || fileinput == '') {
    alert('请上传文件')
    return
  }
  if (nm == null || nm == '') {
    alert('标题不能为空')
    return
  }

  const index = layer.load()
  param.id = getUid()
  param.file_id = $('#fileuid').val()
  param.nm = $('#nm').val()
  param.file_tp = $('#filetp').val()
  param.create_tm = getCurrentDate()

  $.ajax({
    url: basePath + 'szybh/ywgz/saveWaterFileDetailAdd',
    type: 'POST',
    data: JSON.stringify(param),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
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

  const hours = currentDate.getHours() // 获取当前小时数(0-23)
  const mon = currentDate.getMinutes() // 获取当前分钟数(0-59)
  const sec = currentDate.getSeconds()

  return yearTM + '-' + monthTM + '-' + dayTM + ' ' + hours + ':' + mon + ':' + sec
}
