let param = {}
const uid = ''
$(function () {
  buildForm(id)
})

function buildForm(id) {
  const yj_fileNames = '' //用于记录原先已有的附件
  param = {}
  param.id = id
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + '/jyys/tzwj/getYwflEditInfo.action', param, function (result) {
    const data = result.list
    $('#area').val(isNull(data[0].AREA))
    console.info(data)
    parent.layer.close(index_)
    $('#saveButton').click(function () {
      saveDbBase(id, uid)
    })
  })
}

function closediv() {
  parent.layer.closeAll()
}
// 保存
function saveDbBase(id, uid) {
  const param = {}

  const area = $('#area').val()
  if (area == null || area == '') {
    alert('请填写业务分类')
    return
  }

  param.area = area
  param.id = id
  debugger
  /*param.bbyr=$("#bbyr").val();
    param.xdyr=$("#xdyr").val();*/
  jQuery.getJSON(basePath + '/jyys/tzwj/saveYwflFileInfo', param, function (data) {
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
