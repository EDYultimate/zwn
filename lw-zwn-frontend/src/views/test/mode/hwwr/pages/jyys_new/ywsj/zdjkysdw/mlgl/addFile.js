const tpmap = new Map() //保存上传
const param = {}

$(function () {
  $('#industry').change(function () {
    //一二级行业联动
    initSecIndustry()
  })

  //初始化二级行业
  initSecIndustry()
})

function saveDbBase() {
  const param = {}
  /*var user = $("#user").val();
    if(user==null||user==''){
       alert("上传人不能为空");
       return;
   }*/

  const org = $('#org').val()
  if (org == null || org == '') {
    alert('单位名称不能为空')
    return
  }

  // param.yr =$("#area").val();//时间
  param.yr = yr
  /* debugger;*/

  param.ad_cd = $('#ad_cd').val()
  param.levels = $('#levels').val()
  param.industry = $('#industry').val()
  param.secindustry = $('#secindustry').val()
  param.org = $('#org').val()
  param.org_cd = $('#org_cd').val()

  param.id = ''
  jQuery.getJSON(basePath + 'jyys/ywsj/saveMlglFileInfo', param, function (data) {
    alert(data.info)
    parent.search()
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

//初始化二级行业
function initSecIndustry() {
  $('#secindustry').empty()
  let secindustryhtml
  const param = {}
  param.industry_cd = $('#industry').val()
  jQuery.getJSON(basePath + '/jyys/ywsj/getSecIndustryInfo', param, function (data) {
    if (data != null) {
      const dataList = data.list
      if (dataList.length > 0) {
        for (let i = 0; i < dataList.length; i++) {
          secindustryhtml +=
            "<option value='" +
            dataList[i].INDUSTRY_CD +
            "'>" +
            dataList[i].INDUSTRY_NM +
            '</option>'
        }
      }
    }
    $('#secindustry').html(secindustryhtml)
  })
}
