let pageSize
$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - 80
  $('.conent').css('height', height)
  const tbHeight = $('.conent').height() - $('.titleDiv').height() - $('.M-box').height()
  $('.tableDiv').css('height', tbHeight - 5)
  pageSize = Math.floor((tbHeight - 35) / 30) - 1
  $('#beginTm').val(new Date().Format('yyyy-MM-dd'))
  $('#endTm').val(new Date().Format('yyyy-MM-dd'))
  search(1)
})
//页面初始化
function search(CurrentPage) {
  const nm = $('#nm').val()
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  const index = layer.load()
  jQuery.getJSON(
    basePath + '/szybh/sjdm/getSjdmSwLl_def',
    {
      nm: nm,
      beginTm: $('#beginTm').val(),
      endTm: $('#endTm').val(),
      pageSize: pageSize,
      pageNo: CurrentPage
    },
    function (result) {
      let tbodyStr = ''
      const data = result.page.list
      if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          tbodyStr +=
            '<tr>' +
            "<td title='" +
            isNull(data[i].RB_NM) +
            "'>" +
            isNull(data[i].RB_NM) +
            '</td>' +
            '<td onclick="initLayer(\'' +
            data[i].STCD +
            "','" +
            data[i].ST_NM +
            "')\" title='" +
            isNull(data[i].ST_NM) +
            "'>" +
            isNull(data[i].ST_NM) +
            '</td>' +
            "<td title='" +
            isNull(data[i].RV_NM) +
            "'>" +
            isNull(data[i].RV_NM) +
            '</td>' +
            "<td title='" +
            isNull(data[i].TM) +
            "'>" +
            isNull(data[i].TM) +
            '</td>' +
            "<td title='" +
            isNull(data[i].SW) +
            "'>" +
            isNull(data[i].SW) +
            '</td>' +
            "<td title='" +
            isNull(data[i].LL) +
            "'>" +
            isNull(data[i].LL) +
            '</td>' +
            '</tr>'
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
            '</tr>'
        }
      }
      $('#tbody').empty().append(tbodyStr)
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
    }
  )
}

function initLayer(wrcs_cd, nm) {
  layer.open({
    type: 2,
    title: nm,
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['850px', '500px'],
    content: basePath + '/pages/message/jcxx/czxx/swllDialog.jsp?wrcs_cd=' + wrcs_cd
  })
}
