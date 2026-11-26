$(document).ready(function () {
  if (cktype) {
    cktab(cktype)
  }
})

function cktab(id) {
  $('.ckrow').removeClass('ckrow')
  $('#' + id).addClass('ckrow')

  $('#iframe').attr('src', '')
  if (id == 'jcxx') {
    $('#iframe').attr('src', basePath + 'pages/lyzg/sjdm/sjdm_sz/sjdm_sz.jsp')
  } else if (id == 'qst') {
    $('#iframe').attr('src', basePath + 'pages/ssjkyj/cxfx/za/qst/qst.jsp')
  } else if (id == 'tbt') {
    $('#iframe').attr('src', basePath + 'pages/ssjkyj/cxfx/za/tbt/tbt.jsp')
  } else if (id == 'hbt') {
    $('#iframe').attr('src', basePath + 'pages/ssjkyj/cxfx/za/hbt/hbt.jsp')
  } else if (id == 'nbb') {
    $('#iframe').attr('src', basePath + 'pages/ssjkyj/cxfx/za/nbb/nbb.jsp')
  }
}
