let param = {}
$(function () {
  buildForm(id)
})

function buildForm(id) {
  param = {}
  param.id = id
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + '/jyys/ywsj/getDezEditInfo.action', param, function (result) {
    const data = result.list
    $('#nm').val(isNull(data[0].NM))
    $('#ad_cd').val(isNull(data[0].AD_CD))
    $('#hytp').val(isNull(data[0].HYTP))
    $('#hynm').val(isNull(data[0].HYNM))
    $('#ystp').val(isNull(data[0].YSTP))
    $('#tyz').val(isNull(data[0].TYZ))
    $('#xjz').val(isNull(data[0].XJZ))
    $('#unit').val(isNull(data[0].UNIT))
    $('#nt').val(isNull(data[0].NT))
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

  param.nm = $('#nm').val()
  param.ad_cd = $('#ad_cd').val()
  param.hytp = $('#hytp').val()
  /*param.nm=$('#fw option:selected').text();//选中的文本*/
  param.hynm = $('#hynm').val()
  param.ystp = $('#ystp').val()
  param.tyz = $('#tyz').val()
  param.xjz = $('#xjz').val()
  param.unit = $('#unit').val()
  param.nt = $('#nt').val()
  param.id = id
  param.ispro = '0' //代表通讯录
  jQuery.getJSON(basePath + 'jyys/ywsj/saveDezFileInfo', param, function (data) {
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
