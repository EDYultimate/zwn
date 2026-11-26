const tpmap = new Map() //保存上传
const param = {}

$(function () {})

function saveDbBase() {
  const param = {}
  /*var user = $("#user").val();
    if(user==null||user==''){
       alert("上传人不能为空");
       return;
   }*/

  const outline = $('#outline').val()
  if (outline == null || outline == '') {
    alert('工作动态概要不能为空')
    return
  }

  const btm = $('#btm').val()
  if (btm == null || btm == '') {
    alert('开始时间不能为空')
    return
  }

  param.area_cd = $('#area').val() //业务分类
  param.area = $('#area option:selected').text() //选中的文本

  param.btm = $('#btm').val()
  param.etm = $('#etm').val()
  param.outline = $('#outline').val()
  param.content = $('#content').val()

  param.id = ''
  jQuery.getJSON(basePath + 'jyys/gzdt/saveGzdtFileInfo', param, function (data) {
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
