let param = {}
$(function () {
  buildForm(rpcd, ad_cd)
})

function buildForm(rpcd, ad_cd) {
  param = {}
  param.rpcd = rpcd
  param.ad_cd = ad_cd
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + '/jyys/ywsj/getHxzbEditInfo.action', param, function (result) {
    const data = result.list
    $('#yr').val(isNull(data[0].YR))
    $('#ad_cd').val(isNull(data[0].AD_CD))

    $('#add_tar_ind').val(isNull(data[0].ADD_TAR_IND))
    $('#add_act_ind').val(isNull(data[0].ADD_ACT_IND))
    $('#tar_irr').val(isNull(data[0].TAR_IRR))
    $('#act_irr').val(isNull(data[0].ACT_IRR))

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

  param.add_tar_ind = $('#add_tar_ind').val()
  param.add_act_ind = $('#add_act_ind').val()
  param.tar_irr = $('#tar_irr').val()
  param.act_irr = $('#act_irr').val()

  param.rpcd = rpcd

  jQuery.getJSON(basePath + '/jyys/ywsj/saveHxzbInfo', param, function (data) {
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
