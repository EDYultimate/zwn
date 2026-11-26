let param = {}
$(function () {
  buildForm(rpcd, ad_cd)
})

function buildForm(rpcd, ad_cd) {
  param = {}
  param.rpcd = rpcd
  param.ad_cd = ad_cd
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + '/jyys/ywsj/getKhtjEditInfo.action', param, function (result) {
    debugger
    const data = result.list
    $('#yr').val(isNull(data[0].YR))
    $('#ad_cd').val(isNull(data[0].AD_CD))

    $('#ind_ww').val(isNull(data[0].IND_WW))
    $('#ind_reu_w').val(isNull(data[0].IND_REU_W))
    $('#pipe_tot_ws').val(isNull(data[0].PIPE_TOT_WS))
    $('#pipe_eff_ws').val(isNull(data[0].PIPE_EFF_WS))
    $('#irr_wu').val(isNull(data[0].IRR_WU))
    $('#eff_irr').val(isNull(data[0].EFF_IRR))

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
  param.ind_ww = $('#ind_ww').val()
  param.ind_reu_w = $('#ind_reu_w').val()
  param.pipe_tot_ws = $('#pipe_tot_ws').val()
  param.pipe_eff_ws = $('#pipe_eff_ws').val()
  param.irr_wu = $('#irr_wu').val()
  param.eff_irr = $('#eff_irr').val()

  param.rpcd = rpcd

  jQuery.getJSON(basePath + '/jyys/ywsj/saveKhtjInfo', param, function (data) {
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
