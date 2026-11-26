$(function () {
  const type = $('#lyfqselect', parent.document).val()
  initZbTable(type)
})
//全选-取消全选
function checkToggle() {
  const checkflg = $('#checkFlg').val()
  if (checkflg == '0') {
    var ainput = $('#SjdmZbTable input')
    if (ainput.attr('type') == 'checkbox') {
      ainput.attr('checked', 'checked')
    }
    $('#checkFlg').val('1')
    $('#checkBtn').attr('value', '取消全选')
  } else {
    var ainput = $('#SjdmZbTable input')
    if (ainput.attr('type') == 'checkbox') {
      ainput.removeAttr('checked')
    }
    $('#checkFlg').val('0')
    $('#checkBtn').attr('value', '全选')
  }
}
//确认选择
function confirmBtn() {
  let selectedNms = ''
  let selectedCds = ''
  const checkboxs = $('#sjdmZbTable input:checkbox')
  for (let i = 0; i < checkboxs.size(); i++) {
    if (checkboxs.eq(i).attr('checked') == 'checked') {
      selectedNms += checkboxs.eq(i).attr('name')
      selectedNms += ','
      selectedCds += checkboxs.eq(i).attr('id')
      selectedCds += ','
    }
  }
  if (selectedNms) {
    selectedNms = selectedNms.substring(0, parseInt(selectedNms.length - 1))
    selectedCds = selectedCds.substring(0, parseInt(selectedCds.length - 1))
  }
  window.parent.dknmStr = selectedNms
  window.parent.dkcdStr = selectedCds

  window.parent.layer.closeAll()
  window.parent.initDkInput()
}
//初始化指标
function initZbTable(type) {
  const param = { type: type }
  jQuery.getJSON(basePath + '/hsl/et/getHhlyDkdyType', param, function (list) {
    console.info(list)
    const SjdmZbTable = $('#sjdmZbTable')
    for (let i = 0; i < list.length;) {
      const radioTrA1 = $('<tr>')
      zuZbDiv(list[i]).appendTo(radioTrA1)
      if (i + 1 < list.length) {
        zuZbDiv(list[i + 1]).appendTo(radioTrA1)
      }
      if (i + 2 < list.length) {
        zuZbDiv(list[i + 2]).appendTo(radioTrA1)
      }
      if (i + 3 < list.length) {
        zuZbDiv(list[i + 3]).appendTo(radioTrA1)
      }
      i += 4
      radioTrA1.appendTo(SjdmZbTable)
    }
  })
}
/**
 *	指标填充弹出框内容公共方法
 **/
function zuZbDiv(map) {
  let radioTdA31 = ''
  if (map != undefined) {
    radioTdA31 = $('<td>').html(
      "<input  id='" +
        map.TCD +
        "' name='" +
        map.NM +
        "'  type='checkbox'   name='radio2'/><label style='font-family: 微软雅黑,黑体;font-size: 14px;' class='DialogInput' type='text' for='" +
        map.TCD +
        "' readonly='readonly'>" +
        map.NM +
        '</label>'
    )
  }
  return radioTdA31
}
