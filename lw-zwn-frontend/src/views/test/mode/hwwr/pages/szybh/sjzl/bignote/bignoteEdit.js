let param = {}
const uid = ''
const getIsFile = 'y'
$(function () {
  buildForm(ID)
})

function buildForm(ID) {
  param = {}
  param.id = ID

  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + '/szybh/sjzl/bignote/getNoteInfo', param, function (data) {
    $('#info').val(isNull(data[0].INFO))
    $('#ywtp').val(isNull(data[0].YWTP))
    $('#tm').val(isNull(data[0].TM))

    parent.layer.close(index_)
    $('#saveButton').click(function () {
      save(ID)
    })
  })
}

function closediv() {
  parent.layer.closeAll()
}

function save(id) {
  const param = {}
  const tm = $('#tm').val()
  const info = $('#info').val()

  if (tm == null || tm == '') {
    alert('时间不能为空')
    return
  }

  if (info == null || info == '') {
    alert('描述不能为空')
    return
  }
  const index = layer.load()
  param.id = id
  param.ywtp = $('#ywtp').val()
  param.tm = $('#tm').val()
  param.info = $('#info').val()

  $.ajax({
    url: basePath + '/szybh/sjzl/bignote/saveNoteBase',
    type: 'POST',
    data: JSON.stringify(param),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      layer.close(index)
      alert(data.info)
      parent.search(1)
      parent.layer.closeAll()
    }
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
