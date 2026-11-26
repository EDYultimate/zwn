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
    $('#iframe').attr('src', basePath + 'pages/lyzg/sjdm/sjdm_szzdz/sjdm_szzdz.jsp')
  } else if (id == 'qst') {
    $('#iframe').attr('src', basePath + 'pages/ssjkyj/cxfx/auto/qst/qst.jsp')
  } else if (id == 'tbt') {
    $('#iframe').attr('src', basePath + 'pages/ssjkyj/cxfx/auto/tbt/tbt.jsp')
  } else if (id == 'hbt') {
    $('#iframe').attr('src', basePath + 'pages/ssjkyj/cxfx/auto/hbt/hbt.jsp')
  } else if (id == 'ybb') {
    $('#iframe').attr('src', basePath + 'pages/ssjkyj/cxfx/auto/ybb/ybb.jsp')
  } else if (id == 'nbb') {
    $('#iframe').attr('src', basePath + 'pages/ssjkyj/cxfx/auto/nbb/nbb.jsp')
  }
}
