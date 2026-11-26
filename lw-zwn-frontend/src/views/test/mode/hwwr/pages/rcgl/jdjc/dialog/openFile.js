$(function () {
  getFile()
})

function getFile(mang_cd) {
  const pdata = {
    conc_id: "'" + id + "'"
  }

  const url = convertJsonToUrl(pdata)
  if (id != null && id != '') {
    $.ajax({
      url: basePath + 'jdjc/getConcProblemFile' + url,
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (data) {
        let downloadFileDiv =
          "<div class='dialogtopDiv' id='yidong'>资料附件下载</div>" +
          "<div class='tableDiv'><form  action='/wrem/DownloadMultiFile.action' id='multiFileDownload' method='post' onsubmit= 'return downloadMultiFile()'>" +
          "<table class='mainTable'><thead>" +
          "<tr><td style='width:15%'>序号</td>" +
          "<td style='width:55%'>文件名</td>" +
          "<td style='width:15%'>操作</td></tr></thead><tbody>"
        if (data.length > 0) {
          for (let j = 0; j < data.length; j++) {
            const fileid = isNull(data[j].FILE_ID)
            const filePath = isNull(data[j].FILE_PATH)
            const fileName = isNull(data[j].FILE_TITL)
            const ext = isNull(data[j].FILE_EXT)
            downloadFileDiv +=
              "<tr><td  style='text-align: centre;text-indent: 5px'>&nbsp;&nbsp;" +
              (j + 1) +
              '</td>' +
              "<td title='" +
              fileName +
              "' name='fileName'>" +
              fileName +
              '</td>' +
              "<td title='下载'>" +
              "<a href='javascript:void(0)' onclick=\"dlfile('" +
              fileid +
              "','" +
              fileName +
              "','WPCONC')\">" +
              '&nbsp;&nbsp;下载&nbsp;' +
              '</a>'
            //只有pdf可以预览
            if (ext == '.pdf') {
              downloadFileDiv +=
                "<a href='javascript:void(0)' style='cursor: pointer;' title='预览' " +
                'onClick="viewYlPdf(\'' +
                fileid +
                "','" +
                fileName +
                "','/jdjc/tempNamePdf','" +
                filePath +
                '\')" >预览</a>'
            }
            downloadFileDiv += '</td></tr>'
          }
        }
        downloadFileDiv += '</tbody></table></form></div>'
        $('' + downloadFileDiv).appendTo($('#addWin'))
      }
    })
  }
}

function dlfile(file_id, filename, mang_cd) {
  $.fileDownload(basePath + 'spgc/downloadfileProblem', {
    httpMethod: 'POST',
    data: {
      id: id,
      file_id: file_id,
      mang_cd: mang_cd
    },
    successCallback: function (url) {
      debugger
    }
  })
}
