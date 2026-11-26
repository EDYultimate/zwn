let ptype = 'update'
$(document).ready(function () {
  if (wpc_cd === null || wpc_cd === 'null' || wpc_cd === undefined || wpc_cd === '') {
    wpc_cd = ''
    ptype = 'add'
  }

  initData()
  initUpload()
  getFile()
})

function initData() {
  if (wpc_cd && wpc_cd != 'null') {
    //var json = {"wpc_cd": wpc_cd};
    const json = { wpc_sn: wpc_cd }
    $.ajax({
      type: 'POST',
      url: basePath + 'rcgl/spgcgl/getSpgcglM',
      contentType: 'application/json',
      async: true,
      data: JSON.stringify(json),
      success: function (data) {
        if (data && data.length > 0) {
          const row = data[0]
          for (const k in row) {
            $('#' + k).val(row[k])
          }
          const wpc_sn = row.WPC_SN
          const yr = wpc_sn.substr(wpc_sn.indexOf('[') + 1, 4)
          $('#yr01').val(yr)
          $('#yr02').val(parseInt(yr) + 1)
          $('#yr03').val(parseInt(yr) + 2)
          debugger
        }
      }
    })
  }
}

/**
 * =======================================
 *  文件上传
 * =======================================
 */

// 信息传递中所保存的所有文件名称
const fileNames = []
const fileIds = []
// 从保存的数组中删除对应文件
const deleteFIleFromArray = function (fileid) {
  if (fileid) {
    if (fileIds.indexOf(fileid) < 0) {
      return
    }
    fileNames.splice(fileIds.indexOf(fileid), 1)
    fileIds.splice(fileIds.indexOf(fileid), 1)
  }
}

// 添加文件名称
const addFileName = function (filename, fileid) {
  if (filename) {
    if (fileNames.indexOf(filename) >= 0) {
      return false
    }
    fileNames.push(filename)
    fileIds.push(fileid)
    return true
  }
  return false
}
//删除文件名称
const rmFileName = function (filename, fileid) {
  if (filename) {
    if (fileNames.indexOf(filename) < 0) {
      return false
    }
    fileNames.splice(fileNames.indexOf(filename), 1)
    fileIds.splice(fileIds.indexOf(fileid), 1)
    return true
  }
  return false
}

// 生成文件上传div
const getFileDiv = function (filename, fileid, filesize) {
  const filediv =
    "<tr id='file" +
    fileid +
    "' ><td><a onclick='javascript:viewfile(\"" +
    fileid +
    '")\'>' +
    filename +
    "</a></td><td><span id='filesize" +
    fileid +
    "' >" +
    filesize +
    '</span>' +
    "<span id='progress" +
    fileid +
    "' ></span></td><td><a onclick=\"deletefile('" +
    fileid +
    "')\" style='cursor:pointer;color: rgb(4, 84, 195);'>删除</a>" +
    '</td><td><a onclick="dlfile(\'' +
    fileid +
    "', '" +
    filename +
    "')\" style='cursor:pointer;color: rgb(4, 84, 195);'>下载</a></td></tr>"
  addFileName(filename, fileid)
  return filediv
}

// 删除文件上传对应div
const removeFileDiv = function (fileid) {
  const element = document.getElementById('file' + fileid)
  element.parentNode.removeChild(element)
}

// 控制进度条
const progressctrl = function (fileid, proc) {
  $('#progress' + fileid).text(' (' + proc + ')')
}

/* 校验文件
 * 判断文件大小及是否已上传
 */
const validfile = function (filename, filesize) {
  if (fileNames.indexOf(filename) >= 0) {
    alert(filename + ' 已上传，请选择其他文件')
    return false
  }

  if (filesize > 6291456) {
    alert(filename + ' 大于5M，请选择小于5M的文件')
    return false
  }

  if (filesize == 0) {
    alert(filename + ' 是空文件，请重新选择上传文件')
    return false
  }

  return true
}

function genUUID(len, radix) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = [],
    i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | (Math.random() * radix)]
    }
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

//32位UUID
function UUID() {
  return genUUID(32, Math.floor(Math.random() * 32) + 10)
}

function getFile() {
  $.post(basePath + 'rcgl/spgcgl/getSpgcglFile?wpc_cd=' + wpc_cd, {}, function (data) {
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; ++i) {
        $('#uploadfiles').append(
          getFileDiv(data[i].FILE_NM, data[i].FILE_CD, data[i].FILE_SIZE + 'KB')
        )
      }
    }
  })
}

// 上传文件
var initUpload = function () {
  const FileController = basePath + 'rcgl/spgcgl/upload'

  $('#uploadfile').fileupload({
    url: FileController,
    add: function (e, data) {
      // 生成文件uuid
      const uuid = UUID()
      const filename = data.files[0].name
      const filesize = Math.ceil(data.files[0].size / 1024)

      $('#uploadfiles').append(getFileDiv(filename, uuid, filesize + 'KB'))
      const scrollheight = $('#uploadfiles').height()
      $('#scrollfiles').scrollTop(scrollheight)
      data.fileUUID = uuid
      // 添加文件uuid到request
      data.formData = { fileid: uuid, wpc_cd: wpc_cd, filesize: filesize }
      data.submit()
    },
    done: function (e, data) {
      const fileid = data.fileUUID
      progressctrl(fileid, '100%')
      const res = data.result
      if (!res) {
        // 上传错误，则删除文件上传div
        removeFileDiv(fileid)
        deleteFIleFromArray(fileid)
        alert('上传失败')
      } else if (fileIds.indexOf(fileid) < 0) {
        fileIds.push(fileid)
      }
    },
    progress: function (e, data) {
      let progress = parseInt((data.loaded / data.total) * 100, 10)
      if (progress == 100) {
        // 前台传递100%之后，后台需要消耗存储时间
        progress = 98
      }
      const fileid = data.fileUUID
      progressctrl(fileid, progress + '%')
    }
  })
}

// 删除文件
const deletefile = function (fileid) {
  pdata = {
    file_cd: fileid
  }
  $.ajax({
    url: basePath + 'rcgl/spgcgl/deleteFile',
    type: 'POST',
    data: JSON.stringify(pdata),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      if (!data) {
        alert(data.message)
        return
      }
      removeFileDiv(fileid)
      deleteFIleFromArray(fileid)
    }
  })
}

// 获取文件后缀名
const getFileExt = function (filename) {
  return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename
}

function dlfile(file_cd) {
  $.fileDownload(basePath + '/rcgl/spgcgl/downloadfile', {
    httpMethod: 'POST',
    data: { file_cd: file_cd },
    successCallback: function (url) {
      debugger
    }
  })
}

function save() {
  const pdata = {
    WPC_CD: wpc_cd,
    WPC_SN: $('#WPC_SN').val(),
    CERT_COND: $('#CERT_COND').val(),
    INT_BD: $('#INT_BD').val(),
    INT_DL: $('#INT_DL').val(),
    WRP_NM: $('#WRP_NM').val(),
    LR_NM: $('#LR_NM').val(),
    APPR_DT: $('#APPR_DT').val(),
    INT_ADDR: $('#INT_ADDR').val(),
    WIU_NM: $('#WIU_NM').val(),
    CERT_PRT_CD: $('#CERT_PRT_CD').val(),
    WW: $('#WW').val(),
    CHK_INT_MET: $('#CHK_INT_MET').val(),
    INT_USE: $('#INT_USE').val(),
    CHK_SOUR_TP: $('#CHK_SOUR_TP').val(),
    RW_ADDR: $('#RW_ADDR').val(),
    RW_TP: $('#RW_TP').val(),
    RW_W: $('#RW_W').val(),
    RW_WQ_REQ: $('#RW_WQ_REQ').val(),
    DRAW_DT: $('#DRAW_DT').val(),
    DRAW_STAFF: $('#DRAW_STAFF').val(),
    fileids: fileIds.toString(),
    type: ptype
  }
  $.ajax({
    url: basePath + 'rcgl/spgcgl/updateWpc',
    type: 'POST',
    data: JSON.stringify(pdata),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      debugger
      if (data) {
        alert(data.res)
      } else {
        parent.maketable()
        parent.layer.closeAll()
      }
    }
  })
}

function cancel() {
  parent.layer.closeAll()
}
