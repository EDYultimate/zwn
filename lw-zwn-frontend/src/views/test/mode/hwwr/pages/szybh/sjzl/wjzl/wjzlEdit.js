let param = {}
let uid = ''
const getIsFile = 'y'
$(function () {
  buildForm(ID)
})

function buildForm(ID) {
  let yj_fileNames = '' //用于记录原先已有的附件
  param = {}
  param.id = ID

  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + 'szybh/sjzl/wjzl/getWJZLInfo', param, function (data) {
    console.info(data)
    $('#nm').val(isNull(data[0].NM))
    $('#tm').val(isNull(data[0].TM))
    $('#filetp').val(isNull(data[0].FILE_TP))
    $('#ywtp').val(isNull(data[0].YW_TP))
    $('#filenum').val(isNull(data[0].FILE_NUM))

    uid = data[0].FILEID

    if (data[0].FILE_ID !== '' && data[0].FILEID != null) {
      debugger
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

  const nm = $('#nm').val()

  if (nm == null || nm == '') {
    alert('标题不能为空')
    return
  }
  const index = layer.load()
  param.id = id
  param.fileid = uid
  param.nm = $('#nm').val()
  param.tm = $('#tm').val()
  param.filetp = $('#filetp').val()
  param.ywtp = $('#ywtp').val()
  param.filenum = $('#filenum').val()

  $.ajax({
    url: basePath + 'szybh/sjzl/wjzl/saveWJZLBase',
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
