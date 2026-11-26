let pageSize
$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - 30
  $('.conent').css('height', height)
  const tbHeight = $('.conent').height() - $('.titleDiv').height() - $('.M-box').height() - 30
  $('.tableDiv').css('height', tbHeight)
  pageSize = Math.floor((tbHeight - 35) / 30) - 2
  //	$("#beginTm").val(new Date().Format("yyyy-MM-dd")+" 00:00:00");
  //	$("#endTm").val(new Date().Format("yyyy-MM-dd HH:mm:ss"));
  search(1)
})

const isinited = true
//页面初始化
function search(CurrentPage) {
  const flag = ''
  const nm = $('#nm').val()

  if (CurrentPage === undefined) {
    CurrentPage = 1
  }

  //初始化页面路径，查询无时间内的所有数据中，各站最新一条数据
  if (!$('#beginTm').val() && !$('#endTm').val()) {
    urlStr = 'getSjdmSw'
  } //按筛选条件查全部
  else {
    urlStr = 'getSjdmSwDialog'
  }

  const index = layer.load()
  jQuery.getJSON(
    basePath + '/szybh/sjdm/' + urlStr,
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
            isNull(data[i].NEWTM) +
            "'>" +
            isNull(data[i].NEWTM) +
            '</td>' +
            "<td title='" +
            isNull(data[i].RZ) +
            "'>" +
            isNull(data[i].RZ) +
            '</td>' +
            '</tr>'
        }
        for (let x = data.length; x < pageSize; x++) {
          tbodyStr +=
            '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
        }
      } else {
        for (var i = 0; i < pageSize; i++) {
          tbodyStr +=
            '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
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
//function clickST(stcd){
//	var jc_src = basePath+"pages/szybh/sjdm/sjdm_sz/stjc/stjc.jsp?stcd="+stcd;
//	var info_src = basePath+"pages/szybh/sjdm/sjdm_sz/stinfo/stinfo.jsp?stcd="+stcd;
//	layer.tab({
//		  area: ['850px', '500px'],
//		  tab: [{
//		    title: '监测信息',
//		    content: '<iframe src="'+jc_src+'"></iframe>'
//		  }, {
//		    title: '基础信息',
//		    content: '<iframe src="'+info_src+'"></iframe>'
//		  }]
//		});
//}

function initLayer(wrcs_cd, nm) {
  const jc_src = basePath + '/pages/lyzg/sjdm/sjdm_sw/ldswDialog.jsp?wrcs_cd=' + wrcs_cd
  const info_src = basePath + 'pages/lyzg/sjdm/sjdm_sw/stinfo/stinfo.jsp?stcd=' + wrcs_cd
  layer.tab({
    area: ['850px', '500px'],
    tab: [
      {
        title: nm,
        content: '<iframe src="' + jc_src + '"></iframe>'
      },
      {
        title: '基础信息',
        content: '<iframe src="' + info_src + '"></iframe>'
      }
    ]
  })
}
