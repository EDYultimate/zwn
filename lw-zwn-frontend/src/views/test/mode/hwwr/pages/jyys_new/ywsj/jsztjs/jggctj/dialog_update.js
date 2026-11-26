let param = {}
$(function () {
  buildForm(rpcd, ad_cd)
})

function buildForm(rpcd, ad_cd) {
  param = {}
  param.rpcd = rpcd
  param.ad_cd = ad_cd
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + '/jyys/ywsj/getJggctjEditInfo.action', param, function (result) {
    const data = result.list
    $('#yr').val(isNull(data[0].YR))
    $('#ad_cd').val(isNull(data[0].AD_CD))

    $('#agr_wsi_ad').val(isNull(data[0].AGR_WSI_AD))
    $('#agr_eia').val(isNull(data[0].AGR_EIA))
    $('#agr_nia').val(isNull(data[0].AGR_NIA))
    $('#agr_wsia').val(isNull(data[0].AGR_WSIA))
    $('#agr_num').val(isNull(data[0].AGR_NUM))

    $('#ind_wsi_ad').val(isNull(data[0].IND_WSI_AD))
    $('#ind_rriw').val(isNull(data[0].IND_RRIW))
    $('#ind_num').val(isNull(data[0].IND_NUM))

    $('#ulsi_wsi_ad').val(isNull(data[0].ULSI_WSI_AD))
    $('#ulsi_ccwsd').val(isNull(data[0].ULSI_CCWSD))
    $('#ulsi_num').val(isNull(data[0].ULSI_NUM))

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

  /*  var yr = $("#yr").val();
    if(yr==null||yr==''){
        alert("年份不能为空");
        return;
    }
    param.yr=$("#yr").val();*/

  param.ad_cd = $('#ad_cd').val()
  param.agr_wsi_ad = $('#agr_wsi_ad').val()
  param.agr_eia = $('#agr_eia').val()
  param.agr_nia = $('#agr_nia').val()
  param.agr_wsia = $('#agr_wsia').val()
  param.agr_num = $('#agr_num').val()
  param.ind_wsi_ad = $('#ind_wsi_ad').val()
  param.ind_rriw = $('#ind_rriw').val()
  param.ind_num = $('#ind_num').val()
  param.ulsi_wsi_ad = $('#ulsi_wsi_ad').val()
  param.ulsi_ccwsd = $('#ulsi_ccwsd').val()
  param.ulsi_num = $('#ulsi_num').val()

  param.rpcd = rpcd

  jQuery.getJSON(basePath + '/jyys/ywsj/saveJggctjInfo', param, function (data) {
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
