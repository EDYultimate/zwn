let param = {}
let uid = ''
const getIsFile = 'y'
$(function () {
  buildForm(ID)
})

function buildForm(ID) {
  let yj_fileNames = '' //用于记录原先已有的附件
  param = {}
  param.ID = ID

  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + 'rcgl/expert/getExpertInfoAndFile', param, function (data) {
    $('#EXP_NM').val(isNull(data[0].EXP_NM))
    $('#EXP_SEX').val(isNull(data[0].EXP_SEX))
    $('#BRITHDAY').val(isNull(data[0].BRITHDAY))
    $('#POLICITAL_STATUS').val(isNull(data[0].POLICITAL_STATUS))
    $('#SPECIALTY').val(isNull(data[0].SPECIALTY))
    $('#UNITS').val(isNull(data[0].UNITS))
    $('#AD_NM').val(isNull(data[0].AD_NM))
    $('#EXP_TYPE').val(isNull(data[0].EXP_TYPE))
    $('#JOB').val(isNull(data[0].JOB))
    $('#PHONE_NUMBER').val(isNull(data[0].PHONE_NUMBER))
    $('#ADDRESS').val(isNull(data[0].ADDRESS))
    $('#E_MAIL').val(isNull(data[0].E_MAIL))
    $('#NT').val(isNull(data[0].NT))

    uid = data[0].FILEID

    if (data[0].FILE_ID !== '' && data[0].FILEID != null) {
      let i = 0
      let trTable = ''
      if (data[0].FILE_ID !== '' && data[0].FILE_ID != null) {
        for (i = 0; i < data.length; i++) {
          trTable +=
            "<tr id='fileYj" +
            i +
            "' class='fileYj'><td class='textalign' colspan='4'>" +
            isNull(data[i].FILE_NM) +
            "&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick=deleteManyFile('fileYj','" +
            ID +
            "','" +
            isNull(data[i].FILE_ID) +
            "','" +
            isNull(data[i].FILE_NM) +
            "','" +
            i +
            "')>删除</a></td><tr>"
          yj_fileNames = yj_fileNames + isNull(data[i].FILE_NM) + ','
        }
        if (yj_fileNames != null) {
          yj_fileNames = yj_fileNames.substring(0, yj_fileNames.length - 1)
        }
        $('#file_tr').after(trTable)
      }
      upload1('file1', '' + data[0].FILEID + '', '' + data[0].FILE_NM + '') //
    }
    parent.layer.close(index_)
    $('#saveButton').click(function () {
      saveDbBase(ID, uid)
    })
  })
}

function closediv() {
  parent.layer.closeAll()
}
// 保存
function saveDbBase(id, uid) {
  if ('n' == getIsFile) {
    const msg = '附件不合规，是否继续保存？\n\n请确认！'
    if (confirm(msg) == true) {
      save(id, uid)
    }
  } else {
    save(id, uid)
  }
}

function save(id, uid) {
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
  param.fileid = uid
  param.exp_nm = $('#EXP_NM').val()
  param.exp_sex = $('#EXP_SEX').val()
  param.brithday = $('#BRITHDAY').val()
  param.policital_status = $('#POLICITAL_STATUS').val()
  param.specialty = $('#SPECIALTY').val()
  param.units = $('#UNITS').val()
  param.ad_nm = $('#AD_NM').val()
  param.exp_type = $('#EXP_TYPE').val()
  param.job = $('#JOB').val()
  param.phone_number = $('#PHONE_NUMBER').val()
  param.address = $('#ADDRESS').val()
  param.e_mail = $('#E_MAIL').val()
  param.nt = $('#NT').val()
  console.info(param)
  $.ajax({
    url: basePath + 'rcgl/expert/saveExpertBase',
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
