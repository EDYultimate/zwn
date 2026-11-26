const tpmap = new Map() //保存上传
const param = {}

$(function () {})

function saveDbBase() {
  const param = {}

  const hytp = $('#hytp').val()
  if (hytp == null || hytp == '') {
    alert('行业类别不能为空')
    return
  }
  /*    var workplace=$("#workplace").val();
        if (workplace == null||workplace =='') {
            alert("单位不能为空");
            return;
        }*/
  /* param.nm=$("#nm").val();*/

  param.nm = '工业'
  param.ad_cd = $('#ad_cd').val()
  param.hytp = $('#hytp').val()
  /*param.nm=$('#fw option:selected').text();//选中的文本*/
  param.hynm = $('#hynm').val()
  param.ystp = $('#ystp').val()
  param.tyz = $('#tyz').val()
  param.xjz = $('#xjz').val()
  param.unit = $('#unit').val()
  param.nt = $('#nt').val()
  param.gylx = $('#gylx').val()
  param.scgm = $('#scgm').val()
  param.tzxs = $('#tzxs').val()
  param.id = ''
  jQuery.getJSON(basePath + '/jyys/ywsj/saveDezFileInfo', param, function (data) {
    alert(data.info)
    /*   parent.search(1);
        parent.layer.closeAll();*/
    parent.parent.search(1)
    parent.parent.layer.closeAll()
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
