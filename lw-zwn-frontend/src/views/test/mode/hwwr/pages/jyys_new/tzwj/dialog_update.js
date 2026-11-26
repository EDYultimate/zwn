let param = {}
let uid = ''
$(function () {
  buildForm(id)

  /*  initYwfl();*/
})

function buildForm(id) {
  let yj_fileNames = '' //用于记录原先已有的附件

  param = {}
  param.id = id
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + '/jyys/tzwj/getTzwjEditInfo.action', param, function (result) {
    const data = result.list
    $('#title').val(isNull(data[0].TITLE))
    /* $("#docnum").val(isNull(data[0].DOCNUM));*/
    $('#tm').val(isNull(data[0].TM))
    /* $("#area").val(isNull(data[0].AREA_CD));*/
    console.info(data)
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

  const tm = $('#tm').val()
  if (tm == null || tm == '') {
    alert('时间不能为空')
    return
  }

  const title = $('#title').val()
  if (title == null || title == '') {
    alert('请填写工作总结计划')
    return
  }

  /* var docnum=$("#docnum").val();
    if (docnum == null|docnum =='') {
        alert("请填写文号");
        return;
    }*/
  param.title = $('#title').val()
  /*  param.docnum=docnum;*/
  param.fileid = uid
  /*param.area_cd =$("#area").val();//业务分类
    param.area =$('#area option:selected').text();//选中的文本*/
  param.tm = $('#tm').val()
  param.id = id
  jQuery.getJSON(basePath + '/jyys/tzwj/saveTzwjFileInfo', param, function (data) {
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

//初始化业务分类信息
function initYwfl() {
  $('#area').empty()
  let html = ''
  const param = {}
  param.nowTime = Math.random() //考虑ie浏览器刷新
  jQuery.getJSON(basePath + '/jyys/tzwj/getYwflInfo', param, function (data) {
    if (data != null) {
      const dataList = data.list
      if (dataList.length > 0) {
        for (let i = 0; i < dataList.length; i++) {
          html += "<option value='" + dataList[i].AREA_CD + "'>" + dataList[i].AREA + '</option>'
        }
      }
    }
    $('#area').html(html)
  })
}
