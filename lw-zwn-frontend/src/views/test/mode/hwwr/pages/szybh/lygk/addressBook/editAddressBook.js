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

  const index_ = parent.layer.load() //getSaveWaterAddressBookInfoByID
  jQuery.getJSON(basePath + 'szybh/lygk/getSaveWaterAddressBookInfoByID', param, function (data) {
    console.log('data:', data)
    $('#personName').val(isNull(data[0].NM))
    $('#units').val(isNull(data[0].PERSON_UNIT))
    $('#office').val(isNull(data[0].PERSON_DEPT))
    $('#job').val(isNull(data[0].JOB))
    $('#officePhoneNumber').val(isNull(data[0].TEL_NUM))
    $('#fax').val(isNull(data[0].FAX_NUM))
    $('#phoneNumber').val(isNull(data[0].MOB_NUM))
    $('#address').val(isNull(data[0].ADDRESS))
    $('#unitType').val(isNull(data[0].UNIT_TP))
    //        $("#remark").val(isNull(data[0].ADDRESS));

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

  const EXP_NM = $('#personName').val()
  if (EXP_NM == null || EXP_NM == '') {
    alert('请填写姓名')
    return
  }
  const flag = checkMobile($('#phoneNumber').val())

  if ($('#phoneNumber').val() != '' && !flag) {
    alert('手机号码格式错误')
    return
  }
  const index = layer.load()
  param.id = id
  param.nm = $('#personName').val()
  param.person_unit = $('#units').val()
  param.person_dept = $('#office').val()
  param.job = $('#job').val()
  param.tel_num = $('#officePhoneNumber').val()
  param.fax_num = $('#fax').val()
  param.mob_num = $('#phoneNumber').val()
  param.address = $('#address').val()
  param.unit_tp = $('#unitType').val()
  param.remark = ''

  //	param.exp_nm=$("#EXP_NM").val();
  //    param.exp_sex=$("#EXP_SEX").val();
  //    param.brithday=$("#BRITHDAY").val();
  //    param.policital_status=$("#POLICITAL_STATUS").val();
  //    param.specialty=$("#SPECIALTY").val();
  //    param.units=$("#UNITS").val();
  //    param.exp_type=$("#EXP_TYPE").val();
  //    param.job=$("#JOB").val();
  //    param.phone_number=$("#PHONE_NUMBER").val();
  //    param.address=$("#ADDRESS").val();
  //    param.e_mail=$("#E_MAIL").val();
  //    param.nt=$("#NT").val();
  //    param.unittype=$("#unittype").val();

  $.ajax({
    url: basePath + 'szybh/lygk/saveWaterAddressBookInfoSave',
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
