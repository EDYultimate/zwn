const tpmap = new Map() //保存上传
const param = {}
$(function () {
  const date = new Date()
  const year = date.getFullYear()
  $('#yr').val(year)
})

function saveDbBase() {
  const param = {}
  /*var user = $("#user").val();
    if(user==null||user==''){
       alert("上传人不能为空");
       return;
   }*/

  const yr = $('#yr').val()
  if (yr == null || yr == '') {
    alert('年份不能为空')
    return
  }

  /*var nm=$("#nm").val();
    if (nm == null||nm =='') {
        alert("请填写定额标准名称");
        return;
    }*/

  param.yr = $('#yr').val()
  param.ad_cd = $('#ad_cd').val()

  param.real_ww = $('#real_ww').val()
  param.pl_ww = $('#pl_ww').val()

  param.id = ''
  jQuery.getJSON(basePath + '/jyys/ywsj/saveTjfxInfo', param, function (data) {
    alert(data.info)
    parent.search(1)
    parent.layer.closeAll()
  })
}

function closediv() {
  parent.parent.parent.layer.closeAll()
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
