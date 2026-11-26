let param = {}
let uid = ''
$(function () {
  buildForm(id)
})

function buildForm(id) {
  let yj_fileNames = '' //用于记录原先已有的附件

  param = {}
  param.id = id
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + '/jyys/ywsj/getDebzEditInfo.action', param, function (result) {
    const data = result.list
    $('#nm').val(isNull(data[0].NM))
    $('#num').val(isNull(data[0].NUM))
    $('#org').val(isNull(data[0].ORG))
    $('#releasetm').val(isNull(data[0].RELEASETM))
    $('#executm').val(isNull(data[0].EXECUTM))
    $('#isabolished').val(isNull(data[0].ISABOLISHED))

    $('#ad_nm').val(isNull(data[0].AD_NM))

    uid = data[0].FILE_ID
    if (data[0].FILE_ID !== '' && data[0].FILEID != null) {
      let i = 0
      let trTable = ''
      if (data[0].FILE_ID !== '' && data[0].FILE_ID != null) {
        for (i = 0; i < data.length; i++) {
          trTable +=
            "<tr id='fileYj" +
            i +
            "' class='fileYj'><td class='textalign' colspan='2'>" +
            isNull(data[i].FILE_NM) +
            "&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick=deleteManyFile('fileYj','" +
            id +
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

  const nm = $('#nm').val()
  if (nm == null || nm == '') {
    alert('请填写定额标准名称')
    return
  }

  param.nm = $('#nm').val()
  param.fileid = $('#fileuid').val()
  param.num = $('#num').val()
  param.org = $('#org').val()
  param.releasetm = $('#releasetm').val()
  param.executm = $('#executm').val()
  param.isabolished = $('#isabolished').val()
  param.id = id

  param.ad_nm = $('#ad_nm').val()

  jQuery.getJSON(basePath + '/jyys/ywsj/saveDebzFileInfo', param, function (data) {
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
