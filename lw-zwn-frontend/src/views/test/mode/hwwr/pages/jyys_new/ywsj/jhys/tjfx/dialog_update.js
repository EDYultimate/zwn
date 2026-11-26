let param = {}
$(function () {
  buildForm(rpcd, ad_cd)
})

function buildForm(rpcd, ad_cd) {
  param = {}
  param.rpcd = rpcd
  param.ad_cd = ad_cd
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + '/jyys/ywsj/getTjfxEditInfo.action', param, function (result) {
    const data = result.list
    $('#yr').val(isNullZ(data[0].YR))
    $('#ad_cd').val(isNullZ(data[0].AD_CD))

    $('#real_ww').val(isNullZ(data[0].REAL_WW))
    $('#pl_ww').val(isNullZ(data[0].PL_WW))

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

  const yr = $('#yr').val()
  if (yr == null || yr == '') {
    alert('年份不能为空')
    return
  }
  param.yr = $('#yr').val()
  param.ad_cd = $('#ad_cd').val()

  param.real_ww = $('#real_ww').val()
  param.pl_ww = $('#pl_ww').val()

  param.rpcd = rpcd

  jQuery.getJSON(basePath + '/jyys/ywsj/saveTjfxInfo', param, function (data) {
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
