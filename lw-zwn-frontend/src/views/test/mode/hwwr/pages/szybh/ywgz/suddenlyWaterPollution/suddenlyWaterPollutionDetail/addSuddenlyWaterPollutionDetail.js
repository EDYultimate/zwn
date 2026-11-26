const tpmap = new Map() //保存上传
const param = {}
const bbTpPath = null //路径
const getIsFile = 'y'
$(function () {
  const date = new Date()
  const year = date.getFullYear()
  //	$("#tm").val(year-1);
  //  	var uid=getUid();
  // 	upload1("file1",""+uid+"");//文件上传
  // 	$("#fileuid").val(uid);
})

function save() {
  const param = {}
  //	var fileinput = $("#fileuid").val();
  const nm = $('#CASE_NM').val()

  if (nm == null || nm == '') {
    alert('案例名称不能为空')
    return
  }

  //	  var index = layer.load();
  param.uuid = getUid()
  param.case_nm = $('#CASE_NM').val()
  param.river_nm = $('#RIVER_NM').val()
  param.address = $('#ADDRESS').val()
  param.tp = $('#TP').val()
  param.h_date = $('#H_DATE').val()
  param.handle = $('#HANDLE').val()
  param.report = $('#REPORT').val()
  param.res = $('#RES').val()
  param.imp = $('#IMP').val()

  $.ajax({
    url: basePath + 'szybh/ywgz/addWaterPollutionDetailInfo',
    type: 'POST',
    data: JSON.stringify(param),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      alert('添加成功')
      //		    	alert(data.info);
      //		    	layer.close(index);
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
