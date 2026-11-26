let param = {}
const uid = ''
const getIsFile = 'y'
$(function () {
  buildForm(ID)
})

function buildForm(ID) {
  const yj_fileNames = '' //用于记录原先已有的附件
  param = {}
  param.ID = ID

  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + 'rcgl/expert/getSaveWaterExpertInfoByID', param, function (data) {
    $('#EXP_NM').val(isNullZ(data[0].EXP_NM))
    $('#EXP_SEX').val(isNullZ(data[0].EXP_SEX))
    $('#BRITHDAY').val(isNullZ(data[0].BRITHDAY))
    $('#POLICITAL_STATUS').val(isNullZ(data[0].POLICITAL_STATUS))
    $('#SPECIALTY').val(isNullZ(data[0].SPECIALTY))
    $('#UNITS').val(isNullZ(data[0].UNITS))
    $('#EXP_TYPE').val(isNullZ(data[0].EXP_TYPE))
    $('#JOB').val(isNullZ(data[0].JOB))
    $('#PHONE_NUMBER').val(isNullZ(data[0].PHONE_NUMBER))
    $('#ADDRESS').val(isNullZ(data[0].ADDRESS))
    $('#E_MAIL').val(isNullZ(data[0].E_MAIL))
    //        $("#NT").val(isNull(data[0].NT));
    $('#unittype').val(isNullZ(data[0].UNITTYPE))

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

  const EXP_NM = $('#EXP_NM').val()
  if (EXP_NM == null || EXP_NM == '') {
    alert('请填写专家姓名')
    return
  }
  const flag = checkMobile($('#PHONE_NUMBER').val())

  if ($('#PHONE_NUMBER').val() != '' && !flag) {
    alert('手机号码格式错误')
    return
  }
  const index = layer.load()
  param.id = id
  param.exp_nm = $('#EXP_NM').val()
  param.exp_sex = $('#EXP_SEX').val()
  param.brithday = $('#BRITHDAY').val()
  param.policital_status = $('#POLICITAL_STATUS').val()
  param.specialty = $('#SPECIALTY').val()
  param.units = $('#UNITS').val()
  param.exp_type = $('#EXP_TYPE').val()
  param.job = $('#JOB').val()
  param.phone_number = $('#PHONE_NUMBER').val()
  param.address = $('#ADDRESS').val()
  param.e_mail = $('#E_MAIL').val()
  param.nt = ''
  param.unittype = $('#unittype').val()

  $.ajax({
    url: basePath + 'rcgl/expert/savewaterExpertBase',
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
