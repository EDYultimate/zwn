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

  const nm = $('#nm').val()
  if (nm == null || nm == '') {
    alert('姓名不能为空')
    return
  }

  const workplace = $('#workplace').val()
  if (workplace == null || workplace == '') {
    alert('单位不能为空')
    return
  }

  param.nm = $('#nm').val()
  param.workplace = $('#workplace').val()
  /*param.nm=$('#fw option:selected').text();//选中的文本*/
  param.job = $('#job').val()
  param.tel = $('#tel').val()
  param.fax = $('#fax').val()
  param.mob = $('#mob').val()
  param.addr = $('#addr').val()
  param.id = ''
  param.ispro = '0' //代表通讯录
  jQuery.getJSON(basePath + 'jyys/lygk/saveTxl', param, function (data) {
    if (data != null && data.STATUS == 'Y') {
      alert('添加成功！')
    } else {
      alert('添加失败！')
    }
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
