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
        downloadFileDiv +=
          "<tr><td  style='text-align: centre;text-indent: 5px'>&nbsp;&nbsp;" +
          (j + 1) +
          '</td>' +
          "<td title='" +
          isNull(data[j].FILENM) +
          "' name='fileName'>" +
          isNull(data[j].FILENM) +
          '</td>' +
          "<td title='下载'><a href='javascript:void(0)' onclick=\"downloadFile('" +
          fileid +
          "','" +
          fileName +
          '\')">&nbsp;&nbsp;下载&nbsp;</a></td>' +
          //					"<td style='cursor: pointer;' title='预览' onClick='viewFunction(this)' getType='"+isNull(data[j].file_view_type)+"' path='"+isNull(data[j].fileurl)+"' name='"+isNull(data[j].file_view_nm)+"' isview='"+isNull(data[j].is_view)+"'>预览</td>"+
          '</tr>'
      }
    }
    downloadFileDiv += '</tbody></table></form></div>'
    $('' + downloadFileDiv).appendTo($('#addWin'))
  })
}
