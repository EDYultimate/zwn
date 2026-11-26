$(document).ready(function () {
  initUpload('WPCONC')
  getFile('WPCONC')
  mutlsel()

  initData()
})

function mutlsel() {
  const options = {
    再生水矿坑排水: '再生水矿坑排水',
    地下水: '地下水',
    '地下水（矿坑排水）': '地下水（矿坑排水）',
    地表水: '地表水',
    地表水地下水: '地表水地下水',
    '地表水（再生水）': '地表水（再生水）',
    '浅层地下水（傍河取水）': '浅层地下水（傍河取水）'
  }

  $('#wf_nm').mselect(options, [], true)
}

function initData() {
  let url = basePath + 'jdjc/getCONC'
  if (id && c_id) {
    url += '?id=' + id + '&c_id=' + c_id
    $.ajax({
      type: 'GET',
      url: url,
      contentType: 'application/json',
      async: true,
      success: function (data) {
        if (data && data.length > 0) {
          const d = data[0]
          $('#table [name="pram"]').each(function () {
            $(this).val(d[this.id])
          })

          wiu_obj.wiu_cd = d.wrp_cd
        }
      }
    })
  }
}

function initNM(dp) {
  $.ajax({
    type: 'GET',
    url: basePath + 'jdjc/getCONC?tyear=' + dp.cal.getNewDateStr(),
    contentType: 'application/json',
    async: true,
    success: function (data) {
      const options = {}
      if (data && data.length > 0) {
        data.forEach(function (i) {
          options[i.nm] = i.nm
        })
        $('#nm').mselect(options, [], true)
      }
    }
  })
}

function cancel() {
  parent.layer.closeAll()
}

function save() {
  let flag = true
  // 年取水量是否为数字
  if (!checkRate($('#ww').val())) {
    flag = false
    alert('年取水量需要为数字格式')
    return
  }

  if (isStrEmpty($('#tyear').val())) {
    flag = false
    alert('年份不能为空')
    return
  }
  if (isStrEmpty($('#nm').val())) {
    flag = false
    alert('监督检查名称不能为空')
    return
  }
  if (isStrEmpty($('#wrp_nm').val())) {
    flag = false
    alert('取水权人不能为空')
    return
  }

  if (flag) {
    const json = {}
    $('#table [name="pram"]').each(function () {
      json[this.id] = $(this).val()
    })
    json.wrp_cd = wiu_obj.wiu_cd

    if (id) {
      json.id = id
      json.conc_id = id
      json.c_id = c_id
    }
    json.fileIds = fileIds

    $.ajax({
      url: basePath + 'jdjc/save',
      type: 'POST',
      data: JSON.stringify(json),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (data) {
        if (data && data.success) {
          parent.search()
          parent.layer.closeAll()
        } else {
          alert('保存失败')
        }
      }
    })
  }
}

var wiu_obj = {
  wiu_cd: '',
  wiu_nm: ''
}

function setWrp_nm(wiu_nm) {
  $('#wrp_nm').val(wiu_nm)
}

function wiuPage() {
  layer.open({
    type: 2,
    title: '取水户',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['600px', '400px'],
    content: basePath + 'pages/rcgl/spgcgl/xpwf/dialog/wiu.jsp'
  })
}

/**
 * =======================================
 *  文件上传
 * =======================================
 */

// 信息传递中所保存的所有文件名称
const fileNames = []
var fileIds = []
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
const getFileDiv = function (filename, fileid, filesize, mang_cd) {
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
    "', '" +
    mang_cd +
    "')\" style='cursor:pointer;color: rgb(4, 84, 195);'>删除</a>" +
    '</td><td><a onclick="dlfile(\'' +
    fileid +
    "', '" +
    filename +
    "', '" +
    mang_cd +
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

function getFile(mang_cd) {
  pdata = {
    conc_id: id,
    c_id: c_id,
    mang_cd: mang_cd
  }

  const url = convertJsonToUrl(pdata)

  $.ajax({
    url: basePath + 'jdjc/getConcFile' + url,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; ++i) {
          $('#uploadfiles').append(
            getFileDiv(
              data[i].file_titl + data[i].file_ext,
              data[i].file_id,
              data[i].file_size + 'KB',
              data[i].mang_cd
            )
          )
        }
      }
    }
  })
}

// 上传文件
var initUpload = function (mang_cd) {
  const FileController = basePath + 'jdjc/upload'

  $('#uploadfile').fileupload({
    url: FileController,
    add: function (e, data) {
      // 生成文件uuid
      const uuid = UUID()
      const filename = data.files[0].name
      const filesize = Math.ceil(data.files[0].size / 1024)

      $('#uploadfiles').append(getFileDiv(filename, uuid, filesize + 'KB', mang_cd))
      const scrollheight = $('#uploadfiles').height()
      $('#scrollfiles').scrollTop(scrollheight)
      data.fileUUID = uuid
      // 添加文件uuid到request
      data.formData = {
        file_id: uuid,
        conc_id: id,
        c_id: c_id,
        file_size: filesize,
        mang_cd: mang_cd
      }
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
const deletefile = function (fileid, mang_cd) {
  pdata = {
    id: id,
    c_id: c_id,
    file_id: fileid,
    mang_cd: mang_cd
  }
  $.ajax({
    url: basePath + 'jdjc/delConcFile',
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

function dlfile(file_id, filename, mang_cd) {
  $.fileDownload(basePath + 'spgc/downloadfile', {
    httpMethod: 'POST',
    data: {
      id: id,
      c_id: c_id,
      file_id: file_id,
      mang_cd: mang_cd
    },
    successCallback: function (url) {
      debugger
    }
  })
}
