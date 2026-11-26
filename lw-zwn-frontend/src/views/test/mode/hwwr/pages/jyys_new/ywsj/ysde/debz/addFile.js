const tpmap = new Map() //保存上传
const param = {}
const bbTpPath = null //路径
$(function () {
  const date = new Date()
  const year = date.getFullYear()
  $('#yr').val(year)
  const uid = getUid()
  upload1('file1', '' + uid + '') //文件上传
  $('#fileuid').val(uid)
})

function saveDbBase() {
  const param = {}
  /*var user = $("#user").val();
    if(user==null||user==''){
       alert("上传人不能为空");
       return;
   }*/

  const fileuid = $('#fileuid').val()
  if (fileuid == null || fileuid == '') {
    alert('请上传文件')
    return
  }

  const nm = $('#nm').val()
  if (nm == null || nm == '') {
    alert('请填写定额标准名称')
    return
  }

  param.nm = $('#nm').val()
  param.fileid = $('#fileuid').val()
  param.num = $('#num').val()
  param.org = $('#org').val()
  param.releasetm = $('#releasetm').val()
  param.executm = $('#executm').val()
  param.isabolished = $('#isabolished').val()
  param.id = ''

  param.ad_nm = $('#ad_nm').val()
  jQuery.getJSON(basePath + '/jyys/ywsj/saveDebzFileInfo', param, function (data) {
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
