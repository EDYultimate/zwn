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
  jQuery.getJSON(basePath + '/jyys/zlk/getZlkEditInfo.action', param, function (result) {
    const data = result.list
    $('#nm').val(isNull(data[0].NM))
    $('#profile').val(isNull(data[0].PROFILE))
    $('#yr').val(isNull(data[0].YR))
    $('#type').val(isNull(data[0].TYPE_CD))
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
  debugger
  const param = {}

  const nm = $('#nm').val()
  if (nm == null || nm == '') {
    alert('请填写名称')
    return
  }

  const profile = $('#profile').val()
  if ((profile == null) | (profile == '')) {
    alert('请填写简介')
    return
  }
  param.nm = $('#nm').val()
  param.profile = profile
  param.fileid = uid
  param.type_cd = $('#type').val() //类型
  param.type = $('#type option:selected').text() //选中的文本
  param.yr = $('#yr').val()
  param.id = id
  /*param.bbyr=$("#bbyr").val();
    param.xdyr=$("#xdyr").val();*/
  jQuery.getJSON(basePath + '/jyys/zlk/saveZlkFileInfo', param, function (data) {
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
