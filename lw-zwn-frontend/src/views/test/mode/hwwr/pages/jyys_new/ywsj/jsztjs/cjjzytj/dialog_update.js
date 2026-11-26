let param = {}
$(function () {
  buildForm(rpcd, ad_cd)
})

function buildForm(rpcd, ad_cd) {
  param = {}
  param.rpcd = rpcd
  param.ad_cd = ad_cd
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + '/jyys/ywsj/getCjjzytjEditInfo.action', param, function (result) {
    debugger
    const data = result.list
    $('#yr').val(isNull(data[0].YR))
    $('#ad_cd').val(isNull(data[0].AD_CD))

    $('#scia_a').val(isNull(data[0].SCIA_A))
    $('#scep_a').val(isNull(data[0].SCEP_A))
    $('#scof_a').val(isNull(data[0].SCOF_A))
    $('#scsl_a').val(isNull(data[0].SCSL_A))
    $('#scot_a').val(isNull(data[0].SCOT_A))
    $('#scle_a').val(isNull(data[0].SCLE_A))

    $('#scia_t').val(isNull(data[0].SCIA_T))
    $('#scep_t').val(isNull(data[0].SCEP_T))
    $('#scof_t').val(isNull(data[0].SCOF_T))
    $('#scsl_t').val(isNull(data[0].SCSL_T))
    $('#scot_t').val(isNull(data[0].SCOT_T))
    $('#scle_t').val(isNull(data[0].SCLE_T))

    parent.layer.close(index_)
    $('#saveButton').click(function () {
      saveDbBase(rpcd, ad_cd)
    })
  })
}

function closediv() {
  parent.layer.closeAll()
}
// 保存
function saveDbBase(rpcd, ad_cd) {
  const param = {}

  /*    var yr = $("#yr").val();
    if(yr==null||yr==''){
        alert("年份不能为空");
        return;
    }
    param.yr=$("#yr").val();*/

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

  param.rpcd = rpcd

  jQuery.getJSON(basePath + '/jyys/ywsj/saveCjjzytjInfo', param, function (data) {
    alert(data.info)
    parent.search(1)
    parent.layer.closeAll()
  })
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
