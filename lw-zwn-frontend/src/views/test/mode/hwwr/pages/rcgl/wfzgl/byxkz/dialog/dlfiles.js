$(document).ready(function () {
  getFile('WPCF')
})

function dlfile(file_cd, filename, mang_cd) {
  $.fileDownload(basePath + 'spgc/downloadfile', {
    httpMethod: 'POST',
    data: { wpc_cd: wpc_cd, file_cd: file_cd, mang_cd: mang_cd },
    successCallback: function (url) {
      debugger
    }
  })
}

// 删除文件上传对应div
const removeFileDiv = function (fileid) {
  const element = document.getElementById('file' + fileid)
  element.parentNode.removeChild(element)
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
    }
  })
}
function yl(file_cd) {
  viewYl(file_cd, '', '/rcgl/spgcgl/tempName')
}
// 生成文件上传div
const getFileDiv = function (filename, fileid, filesize, mang_cd) {
  let filediv =
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
    "' ></span></td>" +
    '<td><a onclick="dlfile(\'' +
    fileid +
    "', '" +
    filename +
    "', '" +
    mang_cd +
    "')\" style='cursor:pointer;color: rgb(4, 84, 195);'>下载</a>"
  const pdfStr = filename.substring(filename.length - 3, filename.length)
  if (pdfStr == 'pdf') {
    filediv +=
      '<a onclick="yl(\'' +
      fileid +
      "', '" +
      filename +
      "')\" style='cursor:pointer;color: rgb(4, 84, 195);'>预览</a>"
  }
  filediv += '</td></tr>'
  return filediv
}

function getFile(mang_cd) {
  pdata = {
    wpc_cd: wpc_cd,
    mang_cd: ''
  }

  $.ajax({
    url: basePath + 'spgc/getWpcFile',
    type: 'POST',
    data: JSON.stringify(pdata),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; ++i) {
          $('#uploadfiles').append(
            getFileDiv(
              data[i].file_titl + data[i].file_ext,
              data[i].file_cd,
              data[i].file_size + 'KB',
              data[i].mang_cd
            )
          )
        }
      }
    }
  })
}
