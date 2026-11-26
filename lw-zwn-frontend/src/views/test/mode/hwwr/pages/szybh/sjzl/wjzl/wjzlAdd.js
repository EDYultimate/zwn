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

  const param1 = {}
  param1.nm = nm
  param1.pageSize = 1
  param1.pageNo = 1

  $.ajax({
    url: basePath + '/szybh/sjzl/wjzl/getWJZLList',
    type: 'GET',
    data: param1,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      const datalist = data.page
      const list = datalist.list
      console.info(list)
      if (list.length > 0) {
        alert('标题已存在')
        layer.closeAll()
      } else {
        param.id = getUid()
        param.fileid = $('#fileuid').val()
        param.nm = $('#nm').val()
        param.tm = $('#tm').val()
        param.filetp = $('#filetp').val()
        param.ywtp = $('#ywtp').val()
        param.filenum = $('#filenum').val()

        console.info(param)
        $.ajax({
          url: basePath + 'szybh/sjzl/wjzl/saveWJZLBase',
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
