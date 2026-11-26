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

  param.scia_a = $('#scia_a').val()
  param.scep_a = $('#scep_a').val()
  param.scof_a = $('#scof_a').val()
  param.scsl_a = $('#scsl_a').val()
  param.scot_a = $('#scot_a').val()
  param.scle_a = $('#scle_a').val()

  param.scia_t = $('#scia_t').val()
  param.scep_t = $('#scep_t').val()
  param.scof_t = $('#scof_t').val()
  param.scsl_t = $('#scsl_t').val()
  param.scot_t = $('#scot_t').val()
  param.scle_t = $('#scle_t').val()

  param.id = ''
  jQuery.getJSON(basePath + '/jyys/ywsj/saveCjjzytjInfo', param, function (data) {
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

//计算节水型灌区累计数
function calc_scia(num) {
  const param = {}
  param.yr = $('#yr').val() - 1 //上一年
  param.ad_cd = $('#ad_cd').val()
  debugger
  jQuery.getJSON(basePath + '/jyys/ywsj/getCjjzytjCalc', param, function (data) {
    if (data != null && data.hasOwnProperty('SCIA_T')) {
      //var  sciat=data["SCIA_T"];
      const scia = data.SCIA_T
      $('#scia_t').val(eval(num) + eval(scia))
    } else {
      $('#scia_t').val(eval(num))
    }
  })
}

//计算企业累计数
function calc_scep(num) {
  const param = {}
  param.yr = $('#yr').val() - 1 //上一年
  param.ad_cd = $('#ad_cd').val()
  jQuery.getJSON(basePath + '/jyys/ywsj/getCjjzytjCalc', param, function (data) {
    if (data != null && data.hasOwnProperty('SCEP_T')) {
      const scep = data.SCEP_T
      $('#scep_t').val(eval(num) + eval(scep))
    } else {
      $('#scep_t').val(eval(num))
    }
  })
}

//计算机关累计数
function calc_scof(num) {
  const param = {}
  param.yr = $('#yr').val() - 1 //上一年
  param.ad_cd = $('#ad_cd').val()
  jQuery.getJSON(basePath + '/jyys/ywsj/getCjjzytjCalc', param, function (data) {
    if (data != null && data.hasOwnProperty('SCOF_T')) {
      const scof = data.SCOF_T
      $('#scof_t').val(eval(num) + eval(scof))
    } else {
      $('#scof_t').val(eval(num))
    }
  })
}

//计算学校累计数
function calc_scsl(num) {
  const param = {}
  param.yr = $('#yr').val() - 1 //上一年
  param.ad_cd = $('#ad_cd').val()
  jQuery.getJSON(basePath + '/jyys/ywsj/getCjjzytjCalc', param, function (data) {
    if (data != null && data.hasOwnProperty('SCSL_T')) {
      const scsl = data.SCSL_T
      $('#scsl_t').val(eval(num) + eval(scsl))
    } else {
      $('#scsl_t').val(eval(num))
    }
  })
}

//计算其他累计数
function calc_scot(num) {
  const param = {}
  param.yr = $('#yr').val() - 1 //上一年
  param.ad_cd = $('#ad_cd').val()
  jQuery.getJSON(basePath + '/jyys/ywsj/getCjjzytjCalc', param, function (data) {
    if (data != null && data.hasOwnProperty('SCOT_T')) {
      //var  sciat=data["SCEP_T"];
      const scot = data.SCOT_T
      $('#scot_t').val(eval(num) + eval(scot))
    } else {
      $('#scot_t').val(eval(num))
    }
  })
}

//计算节水型居民小区累计数
function calc_scle(num) {
  const param = {}
  param.yr = $('#yr').val() - 1 //上一年
  param.ad_cd = $('#ad_cd').val()
  jQuery.getJSON(basePath + '/jyys/ywsj/getCjjzytjCalc', param, function (data) {
    if (data != null && data.hasOwnProperty('SCLE_T')) {
      const scle = data.SCLE_T
      $('#scle_t').val(eval(num) + eval(scle))
    } else {
      $('#scle_t').val(eval(num))
    }
  })
}
