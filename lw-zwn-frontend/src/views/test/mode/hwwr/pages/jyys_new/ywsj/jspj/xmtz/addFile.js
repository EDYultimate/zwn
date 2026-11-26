const tpmap = new Map() //保存上传
const param = {}
const bbTpPath = null //路径
$(function () {
  const date = new Date()
  const year = date.getFullYear()
  //$("#tm").val(year-1);

  // 节水评价登记表上传
  const registeruid = getUid()
  upload1('file1', '' + registeruid + '')
  $('#registerfileuid').val(registeruid)

  //形式审查意见上传
  const formuid = getUid()
  upload1('file2', '' + formuid + '')
  $('#formfileuid').val(formuid)
  //技术审查意见上传
  const techuid = getUid()
  upload1('file3', '' + techuid + '')
  $('#techfileuid').val(techuid)
})

function saveDbBase() {
  const param = {}

  const nm = $('#nm').val()
  if (nm == null || nm == '') {
    alert('请填写项目名称')
    return
  }

  const yr = $('#yr').val()
  if (yr == null || yr == '') {
    alert('请填写年份')
    return
  }

  /*
    var ad_cd=$("#ad_cd").val();
    if (ad_cd == null||ad_cd =='') {
        alert("请填写所在地");
        return;
    }
*/

  param.nm = $('#nm').val() //项目名称
  param.yr = $('#yr').val() //年份
  param.ad_cd = $('#ad_cd').val() //行政区
  param.evaluation = $('#evaluation').val() //评价环节

  param.registerfileid = $('#registerfileuid').val()
  param.formfileid = $('#formfileuid').val()
  param.techfileid = $('#techfileuid').val()

  param.registertm = $('#registertm').val() //节水评价发文时间
  param.formtm = $('#formtm').val() //形式审查时间
  param.techtm = $('#techtm').val() //技术审查时间

  param.tm = getCurrentDate()
  param.id = ''
  jQuery.getJSON(basePath + '/jyys/ywsj/saveXmtzInfo', param, function (data) {
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
