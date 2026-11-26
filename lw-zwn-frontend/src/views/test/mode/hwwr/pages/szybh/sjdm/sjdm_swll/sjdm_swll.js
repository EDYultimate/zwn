let pageSize
$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - 16 - 20 - 40
  $('.conent').css('height', height)
  const tbHeight = $('.conent').height() - $('.titleDiv').height() - $('.M-box').height()
  $('.tableDiv').css('height', tbHeight)
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
    basePath + '/szybh/sjdm/getSjdmSwLl',
    {
      nm: nm,
      beginTm: $('#beginTm').val(),
      endTm: $('#endTm').val(),
      pageSize: pageSize,
      pageNo: CurrentPage
    },
    function (result) {
      let theadStr = ''
      let tbodyStr = ''
      theadStr +=
        '<tr>' +
        '<td>省界断面</td>' +
        '<td>测站</td>' +
        '<td>河流</td>' +
        '<td>监测时间</td>' +
        '<td>水位(m)</td>' +
        '<td>流量(m³/s)</td>' +
        '</tr>'
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
            '<td onclick="clickST(\'' +
            data[i].STCD +
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
      $('#thead').empty().append(theadStr)
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
//点击测站，弹出监测与基础信息
function clickST(stcd) {
  const jc_src = basePath + 'pages/szybh/sjdm/sjdm_sz/stjc/stjc.jsp?stcd=' + stcd
  const info_src = basePath + 'pages/szybh/sjdm/sjdm_sz/stinfo/stinfo.jsp?stcd=' + stcd
  layer.tab({
    area: ['850px', '500px'],
    tab: [
      {
        title: '监测信息',
        content: '<iframe src="' + jc_src + '"></iframe>'
      },
      {
        title: '基础信息',
        content: '<iframe src="' + info_src + '"></iframe>'
      }
    ]
  })
}
