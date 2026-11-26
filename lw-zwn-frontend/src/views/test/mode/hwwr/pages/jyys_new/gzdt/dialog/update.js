let param = {}
$(function () {
  buildForm(id)
})

function buildForm(id) {
  param = {}
  param.id = id
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + 'jyys/gzdt/getGzdtEditInfo', param, function (result) {
    const data = result.list
    $('#btm').val(isNull(data[0].BTM))
    $('#etm').val(isNull(data[0].ETM))
    $('#area').val(isNull(data[0].AREA_CD))
    $('#outline').val(isNull(data[0].OUTLINE))
    $('#content').val(isNull(data[0].CONTENT))

    parent.layer.close(index_)
    $('#saveButton').click(function () {
      saveDbBase(id)
    })
  })
}

function closediv() {
  parent.layer.closeAll()
}
// 保存
function saveDbBase(id) {
  const param = {}

  const outline = $('#outline').val()
  if (outline == null || outline == '') {
    alert('工作动态概要不能为空')
    return
  }

  const btm = $('#btm').val()
  if (btm == null || btm == '') {
    alert('开始时间不能为空')
    return
  }

  param.area_cd = $('#area').val() //业务分类
  param.area = $('#area option:selected').text() //选中的文本

  param.btm = $('#btm').val()
  param.etm = $('#etm').val()
  param.outline = $('#outline').val()
  param.content = $('#content').val()
  param.id = id
  jQuery.getJSON(basePath + 'jyys/gzdt/saveGzdtFileInfo', param, function (data) {
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
