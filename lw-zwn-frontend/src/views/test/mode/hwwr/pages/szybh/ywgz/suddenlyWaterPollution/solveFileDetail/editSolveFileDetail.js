let param = {}
let file_ida = ''
const getIsFile = 'y'
$(function () {
  buildForm(ID)
})

function buildForm(ID) {
  let yj_fileNames = '' //用于记录原先已有的附件
  param = {}
  param.ID = ID
  param.pageNo = 1
  param.pageSize = 1

  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterFileInfoSingle', param, function (result) {
    console.log('xiugai', result)
    const data = result
    $('#nm').val(isNull(data[0].NM))
    switch (isNull(data[0].FILE_TP)) {
      case '工作规程':
        $('#filetp').val(1)
        break
      case '应急预案':
        $('#filetp').val(2)
        break
      case '事件报告':
        $('#filetp').val(3)
        break
      case '总结报告':
        $('#filetp').val(4)
        break
    }

    //        $("#filetp").val(isNull(data[0].FILE_TP));
    //        $("#ywtp").val(isNull(data[0].YW_TP));
    //        $("#filenum").val(isNull(data[0].FILE_NUM));

    file_ida = data[0].FILE_IDA

    if (data[0].FILE_IDB !== '' && data[0].FILE_IDA != null) {
      let i = 0
      let trTable = ''

      for (i = 0; i < data.length; i++) {
        trTable +=
          "<tr id='fileYj" +
          i +
          "' class='fileYj'><td class='textalign' colspan='4'>" +
          isNull(data[i].FILE_NM) +
          "&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick=deleteManyFile('fileYj','" +
          ID +
          "','" +
          isNull(data[i].FILE_IDB) +
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
      upload1('file1', '' + data[0].FILE_IDA + '', '' + data[0].FILE_NM + '') //
    }
    parent.layer.close(index_)
    $('#saveButton').click(function () {
      saveDbBase(ID, file_ida)
    })
  })
}

function closediv() {
  parent.layer.closeAll()
}
// 保存
function saveDbBase(id, file_ida) {
  if ('n' == getIsFile) {
    const msg = '附件不合规，是否继续保存？\n\n请确认！'
    if (confirm(msg) == true) {
      save(id, file_ida)
    }
  } else {
    save(id, file_ida)
  }
}

function save(id, file_ida) {
  const param = {}

  const nm = $('#nm').val()

  if (nm == null || nm == '') {
    alert('标题不能为空')
    return
  }
  const index = layer.load()
  param.id = id
  param.file_id = file_ida
  param.nm = $('#nm').val()
  param.file_tp = $('#filetp').val()

  $.ajax({
    url: basePath + 'szybh/ywgz/saveWaterFileDetailAdd',
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
