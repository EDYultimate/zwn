let param = {}
$(function () {
  buildForm(id)
})

function buildForm(id) {
  param = {}
  param.id = id
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + 'jyys/lygk/getTxlEditInfo', param, function (result) {
    const data = result.list
    $('#nm').val(isNull(data[0].NM))
    $('#workplace').val(isNull(data[0].WORKPLACE))
    $('#job').val(isNull(data[0].JOB))
    $('#tel').val(isNull(data[0].TEL))
    $('#fax').val(isNull(data[0].FAX))
    $('#mob').val(isNull(data[0].MOB))
    $('#addr').val(isNull(data[0].ADDR))
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
  /*var user = $("#user").val();
    if(user==null||user==''){
       alert("上传人不能为空");
       return;
   }*/

  const nm = $('#nm').val()
  if (nm == null || nm == '') {
    alert('姓名不能为空')
    return
  }

  const workplace = $('#workplace').val()
  if (workplace == null || workplace == '') {
    alert('单位不能为空')
    return
  }

  param.nm = $('#nm').val()
  param.workplace = $('#workplace').val()
  param.job = $('#job').val()
  param.tel = $('#tel').val()
  param.fax = $('#fax').val()
  param.mob = $('#mob').val()
  param.addr = $('#addr').val()
  param.id = id
  param.ispro = '0' //代表通讯录
  jQuery.getJSON(basePath + 'jyys/lygk/saveTxl', param, function (data) {
    if (data != null && data.STATUS == 'Y') {
      alert('修改成功！')
    } else {
      alert('修改失败！')
    }
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
