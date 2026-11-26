const param = {}

//选择展示文件
function selectYJFile(fileyj) {
  param.fileyj = fileyj
  param.tableNm = 'swr_zjzl'
  param.searchTime = Math.random()
  jQuery.getJSON(basePath + '/kfly/nsbd/findFilesById', param, function (result) {
    const data = result.list
    let downloadFileDiv =
      "<div class='dialogtopDiv' id='yidong'>资料附件下载</div>" +
      "<div class='tableDiv'><form  action='/wrem/DownloadMultiFile.action' id='multiFileDownload' method='post' onsubmit= 'return downloadMultiFile()'>" +
      "<table class='mainTable'><thead>" +
      "<tr><td style='width:15%'>序号</td>" +
      "<td style='width:55%'>文件名</td>" +
      "<td style='width:15%'>操作</td></tr></thead><tbody>"
    if (data.length > 0) {
      const fileid = isNull(data[0].FILEID)
      downloadFileDiv +=
        "<tr><input type='hidden' name='fileId' id='fileId' value='" +
        fileid +
        "'/></tr>" +
        "<tr><input type='hidden' name='filePaths'  id='filePaths'  value=''/></tr>"
      for (let j = 0; j < data.length; j++) {
        const filePath = isNull(data[j].FILEURL)
        const fileName = isNull(data[j].FILENM)
        const pdfStr = fileName.substring(fileName.length - 3, fileName.length)
        downloadFileDiv +=
          "<tr><td  style='text-align: center;text-indent: 5px'>&nbsp;&nbsp;" +
          (j + 1) +
          '</td>' +
          "<td title='" +
          isNull(data[j].FILENM) +
          "' name='fileName'>" +
          isNull(data[j].FILENM) +
          '</td>' +
          "<td title='下载' style='text-align: center;'><a href='javascript:void(0)' onclick=\"downloadFile('" +
          fileid +
          "','" +
          fileName +
          '\')">&nbsp;&nbsp;下载&nbsp;</a>'
        //只有pdf可以预览
        if (pdfStr == 'pdf') {
          downloadFileDiv +=
            "<a href='javascript:void(0)' style='cursor: pointer;' title='预览' onClick=\"viewYl('" +
            data[j].FILEID +
            "','" +
            fileName +
            "','/kfly/nsbd/tempName')\" >预览</a>"
        }
        downloadFileDiv += '</td>'
        ;('</tr>')
      }
    }
    downloadFileDiv += '</tbody></table></form></div>'
    $('' + downloadFileDiv).appendTo($('#addWin'))
  })
}
