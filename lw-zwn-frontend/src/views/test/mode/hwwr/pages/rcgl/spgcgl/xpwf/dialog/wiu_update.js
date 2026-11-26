$(function () {
  $('#WIU_NM').val(wiu_nm)
})

function closediv() {
  parent.layer.closeAll()
}
// 保存
function save() {
  const param = {}
  const wiu_nm = $('#WIU_NM').val()
  if (wiu_nm == null || wiu_nm == '') {
    alert('请填写取水户名称')
    return
  }
  param.wiu_nm = wiu_nm
  param.wiu_cd = wiu_cd
  debugger
  jQuery.getJSON(basePath + '/spgc/updateWiu_nm', param, function (data) {
    alert(data.info)
    parent.maketable()
    parent.layer.closeAll()
  })
}
