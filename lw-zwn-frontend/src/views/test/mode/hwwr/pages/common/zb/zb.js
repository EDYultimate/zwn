const zbList = [
  { nm: '水温', cd: 'wt', dw: '℃' },
  { nm: 'pH', cd: 'ph', dw: '' },
  { nm: '高锰酸盐指数', cd: 'codmn', dw: 'mg/L' },
  { nm: '溶解氧', cd: 'dox', dw: 'mg/L' },
  { nm: '化学需氧量', cd: 'codcr', dw: 'mg/L' },
  { nm: '五日生化需氧量', cd: 'bod5', dw: 'mg/L' },
  { nm: '氨氮', cd: 'nh3n', dw: 'mg/L' },
  { nm: '总磷', cd: 'tp', dw: 'mg/L' },
  { nm: '总氮', cd: 'tn', dw: 'mg/L' },
  { nm: '铜', cd: 'cu', dw: 'mg/L' },
  { nm: '锌', cd: 'zn', dw: 'mg/L' },
  { nm: '氟化物', cd: 'f', dw: 'mg/L' },
  { nm: '硒', cd: 'se', dw: 'mg/L' },
  { nm: '砷', cd: 'ars', dw: 'mg/L' },
  { nm: '汞', cd: 'hg', dw: 'mg/L' },
  { nm: '镉', cd: 'cd', dw: 'mg/L' },
  { nm: '六价铬', cd: 'cr6', dw: 'mg/L' },
  { nm: '铅', cd: 'pb', dw: 'mg/L' },
  { nm: '氰化物', cd: 'cn', dw: 'mg/L' },
  { nm: '挥发酚', cd: 'vlph', dw: 'mg/L' },
  { nm: '阴离子表面活性剂', cd: 'las', dw: 'mg/L' },
  { nm: '石油类', cd: 'oil', dw: 'mg/L' },
  { nm: '硫化物', cd: 's2', dw: 'mg/L' },
  { nm: '粪大肠菌群', cd: 'fcg', dw: '个/L' },
  { nm: '氯化物', cd: 'cl', dw: 'mg/L' },
  { nm: '叶绿素a', cd: 'chla', dw: 'mg/L' },
  { nm: '透明度', cd: 'clarity', dw: 'm' },
  { nm: '矿化度', cd: 'mndg', dw: 'mg/L' },
  { nm: '总硬度', cd: 'thrd', dw: 'mg/L' },
  { nm: '电导率', cd: 'cond', dw: 'μS/cm' },
  { nm: '悬浮物', cd: 'ss', dw: 'mg/L' },
  { nm: '硝酸盐', cd: 'no3', dw: 'mg/L' },
  { nm: '亚硝酸盐', cd: 'no2', dw: 'mg/L' },
  { nm: '硫酸盐', cd: 'so4', dw: 'mg/L' },
  { nm: '碳酸盐', cd: 'co3', dw: 'mg/L' },
  { nm: '重碳酸盐', cd: 'hco3', dw: 'mg/L' },
  { nm: '总有机碳', cd: 'toc', dw: 'mg/L' },
  { nm: '钾', cd: 'k', dw: 'mg/L' },
  { nm: '钠', cd: 'na', dw: 'mg/L' },
  { nm: '钙', cd: 'ca', dw: 'mg/L' },
  { nm: '镁', cd: 'mg', dw: 'mg/L' },
  { nm: '铁', cd: 'fe', dw: 'mg/L' },
  { nm: '锰', cd: 'mn', dw: 'mg/L' },
  { nm: '镍', cd: 'ni', dw: 'mg/L' }
]
$(function () {
  initZbTable()
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
  let selectedDws = ''
  const checkboxs = $('#sjdmZbTable input:checkbox')
  for (let i = 0; i < checkboxs.size(); i++) {
    if (checkboxs.eq(i).attr('checked') == 'checked') {
      selectedNms += checkboxs.eq(i).attr('name')
      selectedNms += ','
      selectedCds += checkboxs.eq(i).attr('id')
      selectedCds += ','
      selectedDws += checkboxs.eq(i).val()
      selectedDws += ','
    }
  }
  if (selectedNms) {
    selectedNms = selectedNms.substring(0, parseInt(selectedNms.length - 1))
    selectedCds = selectedCds.substring(0, parseInt(selectedCds.length - 1))
    selectedDws = selectedDws.substring(0, parseInt(selectedDws.length - 1))
  } else {
    layer.msg('至少选择一个指标！')
    return
  }
  window.parent.zbnmStr = selectedNms
  window.parent.zbcdStr = selectedCds
  window.parent.zbdwStr = selectedDws
  window.parent.layer.closeAll()
  window.parent.initZbInput()
}
//初始化指标
function initZbTable() {
  const SjdmZbTable = $('#sjdmZbTable')
  for (let i = 0; i < zbList.length;) {
    const radioTrA1 = $('<tr>')
    zuZbDiv(zbList[i]).appendTo(radioTrA1)
    if (i + 1 < zbList.length) {
      zuZbDiv(zbList[i + 1]).appendTo(radioTrA1)
    }
    if (i + 2 < zbList.length) {
      zuZbDiv(zbList[i + 2]).appendTo(radioTrA1)
    }
    if (i + 3 < zbList.length) {
      zuZbDiv(zbList[i + 3]).appendTo(radioTrA1)
    }
    i += 4
    radioTrA1.appendTo(SjdmZbTable)
  }
}
/**
 *	指标填充弹出框内容公共方法
 **/
function zuZbDiv(map) {
  let radioTdA31 = ''
  let flg = false
  if (map != undefined) {
    const zbcd = parent.zbcdStr.split(',')
    for (let i = 0; i < zbcd.length; i++) {
      if (zbcd[i] == map.cd) {
        flg = true
        break
      }
    }
    if (flg) {
      radioTdA31 = $('<td>').html(
        "<input  id='" +
          map.cd +
          "' name='" +
          map.nm +
          "'  type='checkbox' checked='true'  value='" +
          map.dw +
          "' name='radio2'/><label style='font-family: 微软雅黑,黑体;font-size: 14px;' class='DialogInput' type='text' for='" +
          map.cd +
          "' readonly='readonly'>" +
          map.nm +
          '</label>'
      )
    } else {
      radioTdA31 = $('<td>').html(
        "<input  id='" +
          map.cd +
          "' name='" +
          map.nm +
          "'  type='checkbox'  value='" +
          map.dw +
          "' name='radio2'/><label style='font-family: 微软雅黑,黑体;font-size: 14px;' class='DialogInput' type='text' for='" +
          map.cd +
          "' readonly='readonly'>" +
          map.nm +
          '</label>'
      )
    }
  }
  return radioTdA31
}
