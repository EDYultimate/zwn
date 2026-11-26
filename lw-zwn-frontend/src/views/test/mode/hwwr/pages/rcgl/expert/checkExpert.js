const param = {}
let uuid = ''
$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
})
function saveNewFa() {
  uuid = UUID()
  param.FA_NM = $('#fanm').val()
  param.ID = uuid
  jQuery.getJSON(basePath + 'rcgl/expert/saveExpertFaBasic', param, function (result) {
    //    	$("#fanm").val(param.FA_NM);
    parent.iniFa()
    parent.layer.closeAll()
  })
}
