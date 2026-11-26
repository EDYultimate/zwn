const tpmap = new Map() //保存上传
const param = {}
const bbTpPath = null //路径
const getIsFile = 'y'
$(function () {
  const date = new Date()
  const year = date.getFullYear()
  $('#tm').val(year - 1)
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
  const nm = $('#fileuid').val()
  if (nm == null || nm == '') {
    alert('请上传文件')
    return
  }
  const filenm = $('#filenm').val()
  if (filenm == null || filenm == '') {
    alert('请填写文件名称')
    return
  }
  param.filenm = $('#filenm').val()
  param.fileid = $('#fileuid').val()
  param.nm = $('#fw option:selected').text() //选中的文本
  param.cd = $('#fw').val()
  param.tm = getCurrentDate()
  param.id = ''
  param.yr = $('#tm').val()
  jQuery.getJSON(basePath + '/rcgl/sthx/saveZxjdFileInfo', param, function (data) {
    alert(data.info)
    parent.search(1)
    parent.layer.closeAll()
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
