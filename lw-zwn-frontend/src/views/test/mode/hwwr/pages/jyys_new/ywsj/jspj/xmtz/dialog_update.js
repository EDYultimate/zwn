let param = {}
let registeruid = ''
let formuid = ''
let techuid = ''

$(function () {
  buildForm(id)
})

function buildForm(id) {
  let registeryj_fileNames = '' //用于记录原先已有的附件
  let formyj_fileNames = ''
  let techyj_fileNames = ''

  param = {}
  param.id = id
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + 'jyys/ywsj/getXmtzEditInfo.action', param, function (result) {
    const data = result.list
    $('#yr').val(isNull(data[0].YR))
    $('#nm').val(isNull(data[0].NM))
    $('#ad_cd').val(isNull(data[0].AD_CD))
    $('#evaluation').val(isNull(data[0].EVALUATION))
    $('#registertm').val(isNull(data[0].REGISTERTM))
    $('#formtm').val(isNull(data[0].FORMTM))
    $('#techtm').val(isNull(data[0].TECHTM))

    //登记表附件
    registeruid = data[0].REGISTERFILE_ID
    if (data[0].REGISTERFILE_ID !== '' && data[0].REGISTERFILEID != null) {
      var i = 0
      let registertrTable = ''
      if (data[0].REGISTERFILE_ID !== '' && data[0].REGISTERFILE_ID != null) {
        for (i = 0; i < data.length; i++) {
          registertrTable +=
            "<tr id='registerfileYj" +
            i +
            "' class='registerfileYj'><td class='textalign' colspan='2'>" +
            isNull(data[i].REGISTERFILE_NM) +
            "&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick=deleteManyFile('registerfileYj','" +
            id +
            "','" +
            isNull(data[i].REGISTERFILE_ID) +
            "','" +
            isNull(data[i].REGISTERFILE_NM) +
            "','" +
            i +
            "')>删除</a></td><tr>"
          registeryj_fileNames = registeryj_fileNames + isNull(data[i].REGISTERFILE_NM) + ','
        }
        if (registeryj_fileNames != null) {
          registeryj_fileNames = registeryj_fileNames.substring(0, registeryj_fileNames.length - 1)
        }
        $('#registerfile_tr').after(registertrTable)
      }
      upload1('file1', '' + data[0].REGISTERFILEID + '', '' + data[0].REGISTERFILE_NM + '') //
    }

    //形式审查意见附件
    formuid = data[0].FORMFILE_ID
    if (data[0].FORMFILE_ID !== '' && data[0].FORMFILEID != null) {
      var i = 0
      let formtrTable = ''
      if (data[0].FORMFILE_ID !== '' && data[0].FORMFILE_ID != null) {
        for (i = 0; i < data.length; i++) {
          formtrTable +=
            "<tr id='formfileYj" +
            i +
            "' class='formfileYj'><td class='textalign' colspan='2'>" +
            isNull(data[i].FORMFILE_NM) +
            "&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick=deleteManyFile('formfileYj','" +
            id +
            "','" +
            isNull(data[i].FORMFILE_ID) +
            "','" +
            isNull(data[i].FORMFILE_NM) +
            "','" +
            i +
            "')>删除</a></td><tr>"
          formyj_fileNames = formyj_fileNames + isNull(data[i].FORMFILE_NM) + ','
        }
        if (formyj_fileNames != null) {
          formyj_fileNames = formyj_fileNames.substring(0, formyj_fileNames.length - 1)
        }
        $('#formfile_tr').after(formtrTable)
      }
      upload1('file2', '' + data[0].FORMFILEID + '', '' + data[0].FORMFILE_NM + '') //
    }

    //技术审查意见
    techuid = data[0].TECHFILE_ID
    if (data[0].TECHFILE_ID !== '' && data[0].TECHFILEID != null) {
      var i = 0
      let techtrTable = ''
      if (data[0].TECHFILE_ID !== '' && data[0].TECHFILE_ID != null) {
        for (i = 0; i < data.length; i++) {
          techtrTable +=
            "<tr id='techfileYj" +
            i +
            "' class='techfileYj'><td class='textalign' colspan='2'>" +
            isNull(data[i].TECHFILE_NM) +
            "&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick=deleteManyFile('techfileYj','" +
            id +
            "','" +
            isNull(data[i].TECHFILE_ID) +
            "','" +
            isNull(data[i].TECHFILE_NM) +
            "','" +
            i +
            "')>删除</a></td><tr>"
          techyj_fileNames = techyj_fileNames + isNull(data[i].TECHFILE_NM) + ','
        }
        if (techyj_fileNames != null) {
          techyj_fileNames = techyj_fileNames.substring(0, techyj_fileNames.length - 1)
        }
        $('#techfile_tr').after(techtrTable)
      }
      upload1('file3', '' + data[0].TECHFILEID + '', '' + data[0].TECHFILE_NM + '') //
    }

    parent.layer.close(index_)
    $('#saveButton').click(function () {
      //saveDbBase(id,uid);
      saveDbBase(id)
    })
  })
}

function closediv() {
  parent.layer.closeAll()
}
// 保存
function saveDbBase(id) {
  const nm = $('#nm').val()
  if (nm == null || nm == '') {
    alert('请填写项目名称')
    return
  }

  const yr = $('#yr').val()
  if (yr == null || yr == '') {
    alert('请填写年份')
    return
  }

  /*  var ad_cd=$("#ad_cd").val();
    if (ad_cd == null||ad_cd =='') {
        alert("请填写所在地");
        return;
    }*/

  param.nm = $('#nm').val() //项目名称
  param.yr = $('#yr').val() //年份
  param.ad_cd = $('#ad_cd').val() //行政区
  param.evaluation = $('#evaluation').val() //评价环节

  param.registerfileid = $('#registerfileuid').val()
  param.formfileid = $('#formfileuid').val()
  param.techfileid = $('#techfileuid').val()

  param.registertm = $('#registertm').val() //节水评价发文时间
  param.formtm = $('#formtm').val() //形式审查时间
  param.techtm = $('#techtm').val() //技术审查时间

  param.tm = getCurrentDate()
  param.id = id
  jQuery.getJSON(basePath + 'jyys/ywsj/saveXmtzInfo', param, function (data) {
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
