let pageSize
const param = {}
$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2
  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''
  const bdat = $('#btm').val()
  const edat = $('#etm').val()
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.nm = $('#nm').val()
  param.bdat = bdat
  param.edat = edat
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + '/sjtj/sjqk/zlxxTj', param, function (result) {
    $('#tbody').empty()
    const data = result.page.list
    if (data != null && data.length > 0) {
      //console.info(data);
      for (var i = 0; i < data.length; i++) {
        const getTr = $('<tr>')
        for (let j = 0; j < 9; j++) {
          const getTd = $('<td>')
          if (j == 0) {
            getTd.html(i + 1)
          }
          if (j == 1) {
            getTd.html(isNull(data[i].YR) + '年度')
            getTd.attr('title', isNull(data[i].YR))
          }
          if (j == 2) {
            getTd.html(subS(isNull(data[i].PROJ_NM), 18))
            getTd.attr('title', isNull(data[i].PROJ_NM))
          }
          if (j == 3) {
            getTd.html(subS(isNull(data[i].CONS_ORG), 8))
            getTd.attr('title', isNull(data[i].CONS_ORG))
          }
          if (j == 4) {
            getTd.html(isNull(data[i].CONT_NM))
            getTd.attr('title', isNull(data[i].CONT_NM))
          }
          if (j == 5) {
            getTd.html(isNull(data[i].TEL))
            getTd.attr('title', isNull(data[i].TEL))
          }
          if (j == 6) {
            getTd.html(isNull(data[i].DOC_TP))
            getTd.attr('title', isNull(data[i].DOC_TP))
          }
          if (j == 7) {
            getTd.html(subS(isNull(data[i].FILE_NM), 18))
            getTd.attr('title', isNull(data[i].FILE_NM))
          }
          if (j == 8) {
            getTd.html(
              '<a onclick="downfile(\'' +
                data[i].FILE_PATH +
                "','" +
                data[i].FILE_NM +
                data[i].FILE_EXT +
                '\')">下载</a>&nbsp;&nbsp;<a onclick="deletefile(\'' +
                data[i].FILE_CD +
                '\')">删除</a>'
            )
          }

          getTd.appendTo(getTr)
        }
        getTr.appendTo($('#tbody'))
        //				tbodyStr += "<tr>" +
        //				"<td>"+(i+1)+"</td>" +
        //				"<td></td>" +
        //				"<td></td>" +
        //				"<td></td>" +
        //						"<td title='"+isNull(data[i].FILE_NM)+"'>"+isNull(data[i].FILE_NM)+"</td>" +
        //						"<td title='"+isNull(data[i].EST_PERS)+"'>"+isNull(data[i].EST_PERS)+"</td>" +
        //						"<td title='"+isNull(data[i].PUB_DT)+"'>"+isNull(data[i].PUB_DT)+"</td>" +
        //						"<td title='"+isNull(data[i].FILE_EXT)+"'>"+isNull(data[i].FILE_EXT)+"</td>" +
        //						"<td><a onclick=\"downfile('"+data[i].FILE_PATH+"','"+data[i].FILE_NM+data[i].FILE_EXT+"')\">下载</a>&nbsp;&nbsp;<a onclick=\"deletefile('"+data[i].FILE_CD+"',)\">删除</a></td>" +
        //						"</tr>";
      }
      for (let x = data.length; x < pageSize; x++) {
        tbodyStr +=
          '<tr>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '</tr>'
      }
    } else {
      for (var i = 0; i < pageSize; i++) {
        tbodyStr +=
          '<tr>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '</tr>'
      }
    }
    $('#tbody').append(tbodyStr)
    //$("#tbody").empty().append(tbodyStr);
    $('.M-box').pagination({
      pageCount: result.page.pages, //初始化时总页数3页
      current: CurrentPage,
      callback: function (api) {
        search(api.getCurrent())
      }
    })
    $('.tolSpan').html('共' + result.page.total + '条')
    $('.M-box').show()
    layer.close(index)
  })
}
function openUpload() {
  layer.open({
    type: 2,
    title: ['成果上传', true],
    skin: 'layui-layer-rim', //加上边框
    area: ['350px', '350px'], //宽高
    content: 'pages/lyzg/zlxx/upload.jsp'
  })
}
function downfile(filepath, filename) {
  window.location.href =
    basePath + '/sjtj/sjqk/downloadfile?filepath=' + filepath + '&filename=' + filename
}
function deletefile(file_cd) {
  const msg = '您真的确定要删除该成果吗？\n\n请确认！'
  if (confirm(msg) == true) {
    jQuery.getJSON(basePath + '/sjtj/sjqk/deleteFile', { file_cd: file_cd }, function (data) {
      if (data != null && data.STATUS == 'Y') {
        alert('删除成功！')
      } else {
        alert('删除失败！')
      }
      search(1)
    })
  }
}
