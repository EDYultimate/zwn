let param = {}
let uid = ''

const getIsFile = 'y'

$(function () {
  buildForm(id)
})

function buildForm(id) {
  let yj_fileNames = '' //用于记录原先已有的附件

  param = {}
  param.id = id
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + 'rcgl/sthx/getKhwdEditInfo.action', param, function (result) {
    console.info(result)
    debugger
    const data = result.list
    $('#filenm').val(isNull(data[0].FILENM))
    $('#tm').val(isNull(data[0].YR))
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
            '' +
            isNull(data[i].FILE_NM) +
            "&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' " +
            "onclick=deleteManyFile('fileYj','" +
            isNull(data[i].FILE_ID) +
            "','" +
            i +
            "','" +
            isNull(data[i].FILE_NM) +
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

  const filenm = $('#filenm').val()
  if (filenm == null || filenm == '') {
    alert('请填写文件名称')
    return
  }
  param.filenm = $('#filenm').val()
  param.fileid = uid
  param.yr = $('#tm').val()
  param.tm = getCurrentDate()
  param.id = id
  console.info(param)
  jQuery.getJSON(basePath + '/rcgl/sthx/saveKhwdFileInfo', param, function (data) {
    alert(data.info)
    parent.search(1)
    parent.layer.closeAll()
  })
}

function deleteManyFile(className, fileid, i, filenm) {
  const param = {}
  param.fileid = fileid
  param.filenm = filenm
  console.info(param)

  jQuery.getJSON(basePath + '/rcgl/sthx/deleteREL_FA_FILE.action', param, function (data) {
    const message = data.STATUS
    if (message.indexOf('Y') != -1) {
      $('#' + className + i + '').remove()
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
